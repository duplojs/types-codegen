import { getTypedEntries, zod, type ZodSpace } from "@duplojs/core";

declare module "zod" {
	interface ZodType {
		_typesCodegneIgnore?: true;
	}
}

export function ignoreThisZodSchema<
	GenericZodSchema extends ZodSpace.ZodType,
>(zodSchema: GenericZodSchema) {
	zodSchema._typesCodegneIgnore = true;

	return zodSchema;
}

export function zodSchemaIsIgnored(zodschema: ZodSpace.ZodType) {
	return zodschema._typesCodegneIgnore === true;
}

export function removeIgnoredZodSchemaFromExtractValue(
	extractValue: ZodSpace.ZodType | Record<string, ZodSpace.ZodType>,
) {
	if (extractValue instanceof zod.ZodType) {
		if (zodSchemaIsIgnored(extractValue)) {
			return undefined;
		} else {
			return extractValue;
		}
	} else {
		const extractValueWithoutIgnoredZodSchema = getTypedEntries(extractValue)
			.reduce<Record<string, Zod.ZodType>>(
				(pv, [key, value]) => {
					if (zodSchemaIsIgnored(value)) {
						return pv;
					}

					return {
						...pv,
						[key]: value,
					};
				},
				{},
			);

		return Object.keys(extractValueWithoutIgnoredZodSchema).length === 0
			? undefined
			: extractValueWithoutIgnoredZodSchema;
	}
}
