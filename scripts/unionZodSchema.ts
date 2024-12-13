import { zod } from "@duplojs/core";
import { ZodNever, type ZodType } from "zod";

export function unionZodSchema(zodSechema: ZodType[]) {
	return zodSechema.reduce(
		(pv, cv) => pv instanceof ZodNever ? cv : pv.or(cv),
		zod.never(),
	);
}
