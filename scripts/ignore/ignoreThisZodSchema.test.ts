import { zod } from "@duplojs/core";
import { ignoreThisZodSchema, removeIgnoredZodSchemaFromExtractValue, zodSchemaIsIgnored } from "./ignoreThisZodSchema";

describe("ignoreThisZodSchema", () => {
	it("add flag ignore flag", () => {
		const zodSchema = ignoreThisZodSchema(
			zod.string(),
		);

		expect(zodSchema._typesCodegneIgnore).toBe(true);
	});

	it("zodSchemaIsIgnored", () => {
		const zodSchema = ignoreThisZodSchema(
			zod.string(),
		);

		expect(
			zodSchemaIsIgnored(zodSchema),
		).toBe(true);
	});

	describe("removeIgnoredZodSchemaFromExtractValue", () => {
		it("allow zodSchema", () => {
			const zodSchema = zod.string();

			expect(
				removeIgnoredZodSchemaFromExtractValue(zodSchema),
			).toBe(zodSchema);
		});

		it("remove zodSchema", () => {
			const zodSchema = ignoreThisZodSchema(
				zod.string(),
			);

			expect(
				removeIgnoredZodSchemaFromExtractValue(zodSchema),
			).toBe(undefined);
		});

		it("allow sub zodSchema", () => {
			const zodSchema = {
				test: zod.string(),
			};

			expect(
				removeIgnoredZodSchemaFromExtractValue(zodSchema),
			).toStrictEqual(zodSchema);
		});

		it("remove sub zodSchema", () => {
			const zodSchema = {
				test: ignoreThisZodSchema(
					zod.string(),
				),
			};

			expect(
				removeIgnoredZodSchemaFromExtractValue(zodSchema),
			).toBe(undefined);
		});
	});
});

