import { zod } from "@duplojs/core";
import { unionZodSchema } from "./unionZodSchema";

it("unionZodSchema", () => {
	const schema = unionZodSchema([zod.string(), zod.number(), zod.boolean()]);

	expect(schema.safeParse("test"))
		.toStrictEqual({
			data: "test",
			success: true,
		});

	expect(schema.safeParse(1))
		.toStrictEqual({
			data: 1,
			success: true,
		});

	expect(schema.safeParse(true))
		.toStrictEqual({
			data: true,
			success: true,
		});
});
