import { zod, type ZodSpace } from "@duplojs/core";

export function unionZodSchema(zodSechemas: ZodSpace.ZodType[]) {
	return zod.union(<never>(
		zodSechemas.length > 0
			? zodSechemas
			: [zod.never()]
	));
}
