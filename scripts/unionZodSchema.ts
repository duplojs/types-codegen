import { zod } from "@duplojs/core";
import { type ZodType } from "zod";

export function unionZodSchema(zodSechemas: ZodType[]) {
	return zod.union(<never>(
		zodSechemas.length > 0
			? zodSechemas
			: [zod.never()]
	));
}
