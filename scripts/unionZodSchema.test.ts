import { zod } from "@duplojs/core";
import { unionZodSchema } from "./unionZodSchema";
import { ZodBoolean, ZodNumber, ZodString } from "zod";

it("unionZodSchema", () => {
	const schema = unionZodSchema([zod.string(), zod.number(), zod.boolean()]);

	expect(schema._def.options[0])
		.instanceof(ZodString);

	expect(schema._def.options[1])
		.instanceof(ZodNumber);

	expect(schema._def.options[2])
		.instanceof(ZodBoolean);
});
