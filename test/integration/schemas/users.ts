import { zod } from "@duplojs/core";

export const userSchema = zod.object({
	name: zod.string(),
	age: zod.number(),
});
