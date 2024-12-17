import { ZodSpace } from "@duplojs/core";
import { type TypescriptTransformator } from "@duplojs/zod-to-typescript";
import { factory, SyntaxKind } from "typescript";

declare module "zod" {
	interface ZodLiteralDef<T = any> {
		asteriskToStringInterpolation?: T extends string
			? true
			: undefined;
	}
}

export const literalStringWithAsterisk: TypescriptTransformator = {
	support(zodSchema) {
		return zodSchema instanceof ZodSpace.ZodLiteral
			&& typeof zodSchema._def.value === "string"
			&& zodSchema._def.asteriskToStringInterpolation === true
			&& zodSchema._def.value.includes("*");
	},

	makeTypeNode(zodSchema: ZodSpace.ZodLiteral<string>) {
		const [head = "", ...rest] = zodSchema._def.value.split("*");

		return factory.createTemplateLiteralType(
			factory.createTemplateHead(head, head),
			rest.map(
				(value, index) => factory.createTemplateLiteralTypeSpan(
					factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
					index === rest.length - 1
						? factory.createTemplateTail(value, value)
						: factory.createTemplateMiddle(value, value),
				),
			),
		);
	},
};
