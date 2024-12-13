import { ZodInstanceof } from "@duplojs/core";
import { type TypescriptTransformator } from "@duplojs/zod-to-typescript";
import { factory } from "typescript";

export const instanceofTransformator: TypescriptTransformator = {
	support(zodSchema) {
		return zodSchema instanceof ZodInstanceof;
	},

	makeTypeNode(zodSchema: ZodInstanceof<new (...args: any[]) => any>) {
		return factory.createTypeReferenceNode(
			factory.createIdentifier(zodSchema._def.constructor.name),
		);
	},
};
