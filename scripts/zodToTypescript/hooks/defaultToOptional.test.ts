import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { defaultToOptionalHook } from "./defaultToOptional";
import { zod } from "@duplojs/core";

it("defaultToOptionalHook", () => {
	const zodToTypescript = new ZodToTypescript();

	zodToTypescript.zodSchemaHooks.push(
		defaultToOptionalHook,
	);

	zodToTypescript.append(
		zod.string().default("toto"),
		"test",
	);

	expect(zodToTypescript.toString())
		.toMatchSnapshot();
});
