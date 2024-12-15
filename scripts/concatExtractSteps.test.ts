import { ExtractStep, zod } from "@duplojs/core";
import { concatExtractSteps } from "./concatExtractSteps";
import { ignoreThisZodSchema } from "./ignore/ignoreThisZodSchema";

it("concatExtractSteps", () => {
	const extractSteps = [
		new ExtractStep({
			body: zod.object({
				name: zod.string(),
				age: zod.number(),
			}),
		}),
		new ExtractStep({
			query: {
				page: zod.number().optional(),
			},
		}),
		new ExtractStep({
			headers: {
				authorization: zod.string(),
			},
		}),
		new ExtractStep({
			headers: {
				contentType: zod.string(),
			},
		}),
		new ExtractStep({
			body: {
				test: zod.string(),
			},
		}),
		new ExtractStep({
			params: {
				test: ignoreThisZodSchema(zod.string()),
			},
		}),
	];

	const result = concatExtractSteps(extractSteps);

	expect(
		result.body!.safeParse({
			name: "toto",
			age: 7,
			test: "ok",
		}),
	).toEqual({
		data: {
			name: "toto",
			age: 7,
			test: "ok",
		},
		success: true,
	});

	expect(
		result.headers!.safeParse({
			authorization: "test",
			contentType: "toto",
		}),
	).toEqual({
		data: {
			authorization: "test",
			contentType: "toto",
		},
		success: true,
	});

	expect(
		result.query!.safeParse(undefined),
	).toEqual({
		data: undefined,
		success: true,
	});

	expect(result.params).toBe(undefined);
});
