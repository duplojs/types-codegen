import { type ZodSchemaHook } from "@duplojs/zod-to-typescript";
import { ZodDefault, ZodOptional } from "zod";

export const defaultToOptionalHook: ZodSchemaHook
= (zodSchema, context, output) => zodSchema instanceof ZodDefault
	? output(
		"next",
		ZodOptional.create(zodSchema._def.innerType),
	)
	: output(
		"next",
		zodSchema,
	);
