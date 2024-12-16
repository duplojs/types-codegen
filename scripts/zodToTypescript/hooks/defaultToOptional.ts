import { type ZodSchemaHook } from "@duplojs/zod-to-typescript";
import { zod } from "@duplojs/core";

export const defaultToOptionalHook: ZodSchemaHook
= (zodSchema, context, output) => zodSchema instanceof zod.ZodDefault
	? output(
		"next",
		zod.ZodOptional.create(zodSchema._def.innerType),
	)
	: output(
		"next",
		zodSchema,
	);
