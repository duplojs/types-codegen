import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { instanceofTransformator } from "./instanceof";
import { zod } from "@duplojs/core";

it("instanceofTransformator", () => {
	const zodToTypescript = new ZodToTypescript([instanceofTransformator]);

	zodToTypescript.append(
		zod.instanceof(Blob),
		"Test",
	);

	expect(
		zodToTypescript.toString(true),
	).toMatchSnapshot();
});
