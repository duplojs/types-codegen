#!/usr/bin/env -S npx tsx

import { instanceofDuplose, Route, useBuilder } from "@duplojs/core";
import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { routeToZodSchema } from "@scripts/index";
import { program } from "commander";
import { type ZodType } from "zod";
import ignore from "ignore";
import { lstatSync, readdirSync, writeFileSync } from "fs";
import { relative, resolve } from "path";
import Watcher from "watcher";
import { fork } from "child_process";

program
	.requiredOption("-i, --include <char>")
	.requiredOption("-o, --output <char>")
	.option("-e, --exclude <char>")
	.option("-w, --watch");

program.parse();

const { include, exclude, output, watch } = program.opts<Record<string, string>>();

const includeValidator = ignore().add(include.split(","));

const excludeValidator = exclude
	? ignore().add(exclude.split(","))
	: undefined;

const devFolderValidator = ignore().add([".git", "node_modules", "vendor", ".github", "dist", "coverage"]);

const paths = (function importFile(path: string): string[] {
	const stat = lstatSync(path);

	if (stat.isDirectory()) {
		return readdirSync(path)
			.map((subpath) => relative(process.cwd(), `${path}/${subpath}`))
			.filter((path) => !devFolderValidator.ignores(path))
			.filter((path) => !excludeValidator?.ignores(path))
			.flatMap(importFile);
	} else if (includeValidator.ignores(path)) {
		return [resolve(path)];
	} else {
		return [];
	}
})(process.cwd());

if (watch) {
	const watcher = new Watcher(paths, { ignoreInitial: true });

	function launchFork() {
		console.log("Generating types...");

		fork(
			import.meta.filename,
			process.argv.filter((arg) => arg !== "-w" && arg !== "--watch"),
			{
				cwd: process.cwd(),
				stdio: "inherit",
				execArgv: process.execArgv,
			},
		);
	}

	watcher.on("change", launchFork);

	launchFork();
} else {
	for (const path of paths) {
		await import(path);
	}

	const routeSchema = [...useBuilder.getAllCreatedDuplose()]
		.filter((duplose) => instanceofDuplose(Route, duplose))
		.map(routeToZodSchema)
		.filter((value) => !!value)
		.reduce<undefined | ZodType>(
			(pv, cv) => (pv ? pv.or(cv) : cv),
			undefined,
		);

	if (routeSchema) {
		writeFileSync(
			output,
			ZodToTypescript.convert(
				routeSchema,
				{ name: "Route" },
			),
			"utf-8",
		);
	} else {
		console.error("No route was found.");
	}
}

