import { zod } from "@duplojs/core";
import { type ZodType } from "zod";

export function unionZodSchema(zodSechema: ZodType[]) {
	const [first = zod.never(), seconde = zod.never(), ...rest] = zodSechema;

	return zod.union([first, seconde, ...rest]);
}
