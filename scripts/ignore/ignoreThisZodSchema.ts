import { getTypedEntries } from "@duplojs/core";
import { ZodType } from "zod";

declare module "zod" {
	interface ZodType {
		_typesCodegneIgnore?: true;
	}
}

export function ignoreThisZodSchema<
	GenericZodSchema extends ZodType,
>(zodSchema: GenericZodSchema) {
	zodSchema._typesCodegneIgnore = true;

	return zodSchema;
}

export function zodSchemaIsIgnored(zodschema: ZodType) {
	return zodschema._typesCodegneIgnore === true;
}

export function removeIgnoredZodSchemaFromExtractValue(
	extractValue: ZodType | Record<string, ZodType>,
) {
	if (extractValue instanceof ZodType) {
		if (zodSchemaIsIgnored(extractValue)) {
			return undefined;
		} else {
			return extractValue;
		}
	} else {
		const extractValueWithoutIgnoredZodSchema = getTypedEntries(extractValue)
			.reduce<Record<string, ZodType>>(
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
