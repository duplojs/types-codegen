import { ExtractStep, zod } from "@duplojs/core";
import { concactExtractSteps } from "./concactExtractSteps";

it("concactExtractSteps", () => {
	const extractSteps = [
		new ExtractStep({
			body: zod.object({
				name: zod.string(),
				age: zod.number(),
			}),
		}),
		new ExtractStep({
			query: {
				page: zod.number(),
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
	];

	const result = concactExtractSteps(extractSteps);

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
		result.query!.safeParse({
			page: 7,
		}),
	).toEqual({
		data: {
			page: 7,
		},
		success: true,
	});

	expect(result.params).toBe(undefined);
});
