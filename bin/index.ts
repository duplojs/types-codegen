#!/usr/bin/env -S npx tsx

import { instanceofDuplose, Route, useBuilder } from "@duplojs/core";
import { program } from "commander";
import ignore from "ignore";
import { lstatSync, readdirSync } from "fs";
import { relative, resolve } from "path";
import Watcher from "watcher";
import { fork } from "child_process";
import { writeFile } from "fs/promises";
import { generateTypeFromRoutes } from "@scripts/generateTypeFromRoutes";
import { render } from "@scripts/render";

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
		console.log(`Start watch ${include}`);

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
	console.log("Generating types...");

	for (const path of paths) {
		await import(path);
	}

	const routes = [...useBuilder.getAllCreatedDuplose()]
		.filter((duplose) => instanceofDuplose(Route, duplose));

	if (routes.length > 0) {
		const typeInString = generateTypeFromRoutes(routes);

		await writeFile(
			output,
			render(typeInString),
			"utf-8",
		);
		console.log(`All the types were generated in ${output}.`);
	} else {
		console.error("No route was found.");
	}
}

