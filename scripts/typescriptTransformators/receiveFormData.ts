import { getTypedEntries, zod, ZodReceiveFormData } from "@duplojs/core";
import { type TypescriptTransformator } from "@duplojs/zod-to-typescript";
import { factory, SyntaxKind } from "typescript";
import { ZodType } from "zod";

const schemaKey = zod.never();

const receiveFormDataInterfaceName = "ReceiveFormData";
const receiveFormDataGenericFirstParams = "GenericValue";

const receiveFormDataTypeNode = factory.createInterfaceDeclaration(
	[],
	receiveFormDataInterfaceName,
	[
		factory.createTypeParameterDeclaration(
			[],
			receiveFormDataGenericFirstParams,
			factory.createTypeReferenceNode(
				"Record",
				[
					factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
					factory.createUnionTypeNode([
						factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
						factory.createArrayTypeNode(
							factory.createKeywordTypeNode(SyntaxKind.StringKeyword),
						),
						factory.createArrayTypeNode(
							factory.createTypeReferenceNode("File"),
						),
					]),
				],
			),
		),
	],
	[],
	[
		factory.createPropertySignature(
			[],
			"extractor",
			undefined,
			factory.createFunctionTypeNode(
				[],
				[
					factory.createParameterDeclaration(
						[],
						factory.createToken(SyntaxKind.DotDotDotToken),
						"args",
						undefined,
						factory.createArrayTypeNode(
							factory.createKeywordTypeNode(SyntaxKind.AnyKeyword),
						),
					),
				],
				factory.createTypeReferenceNode(
					"Promise",
					[
						factory.createTypeReferenceNode(
							receiveFormDataGenericFirstParams,
						),
					],
				),
			),
		),
	],
);

export const receiveFormDataTransformator: TypescriptTransformator = {
	support(zodSchema) {
		return zodSchema instanceof ZodReceiveFormData;
	},

	makeTypeNode(zodSchema: ZodReceiveFormData, { findTypescriptTransformator, context }) {
		if (!context.has(schemaKey)) {
			context.set(schemaKey, receiveFormDataTypeNode);
		}

		return factory.createTypeReferenceNode(
			receiveFormDataInterfaceName,
			[
				findTypescriptTransformator(
					zod.object(
						getTypedEntries(zodSchema.recieveFormDataParams)
							.reduce<Record<string, ZodType>>(
								(pv, [key, value]) => ({
									...pv,
									[key]: value instanceof ZodType
										? value
										: zod.instanceof(File).array(),
								}),
								{},
							),
					),
				),
			],
		);
	},
};
