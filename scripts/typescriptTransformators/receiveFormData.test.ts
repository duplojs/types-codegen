import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { recieveFiles, zod } from "@duplojs/core";
import { receiveFormDataTransformator } from "./receiveFormData";
import { instanceofTransformator } from "./instanceof";

it("receiveFormDataTransformator", () => {
	const zodToTypescript = new ZodToTypescript([
		receiveFormDataTransformator,
		instanceofTransformator,
	]);

	zodToTypescript.append(
		zod.receiveFormData({
			picture: recieveFiles({
				maxSize: 500,
				quantity: 5,
				mimeType: /test/,
			}),
			userId: zod.string(),
			age: zod.number(),
		}),
		"Test",
	);

	expect(
		zodToTypescript.toString(true),
	).toMatchSnapshot();
});
