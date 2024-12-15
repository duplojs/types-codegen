import { zod, type ExtractStep } from "@duplojs/core";
import { ZodType } from "zod";
import { zodShemaAcceptEmptyObject } from "./zodShemaAcceptEmptyObject";
import { removeIgnoredZodSchemaFromExtractValue } from "./ignore/ignoreThisZodSchema";

const keyofVariableRequestValue = <const>[
	"body",
	"params",
	"query",
	"headers",
];

export type VariableRequestValue = Partial<
	Record<
		typeof keyofVariableRequestValue[number],
		ZodType
	>
>;

export function concatExtractSteps(extractSteps: ExtractStep[]) {
	const {
		body,
		params,
		query,
		headers,
	} = extractSteps
		.flatMap(
			(extractStep) => keyofVariableRequestValue.map(
				(key) => {
					if (!extractStep.parent[key]) {
						return undefined;
					}

					const extractValueWithoutIgnoredZodSchema
						= removeIgnoredZodSchemaFromExtractValue(
							extractStep.parent[key],
						);

					return extractValueWithoutIgnoredZodSchema
						? <const>[key, extractValueWithoutIgnoredZodSchema]
						: undefined;
				},
			),
		)
		.filter((value) => !!value)
		.map(
			([key, value]) => <const>[
				key,
				value instanceof ZodType
					? value
					: zod.object(value),
			],
		)
		.reduce<VariableRequestValue>(
			(pv, [key, value]) => {
				const zodSechema = pv[key];

				if (!zodSechema) {
					return {
						...pv,
						[key]: value,
					};
				} else {
					return {
						...pv,
						[key]: zodSechema.and(value),
					};
				}
			},
			{},
		);

	return {
		...(body && {
			body: zodShemaAcceptEmptyObject(body)
				? body.optional()
				: body,
		}),
		...(params && {
			params: zodShemaAcceptEmptyObject(params)
				? params.optional()
				: params,
		}),
		...(query && {
			query: zodShemaAcceptEmptyObject(query)
				? query.optional()
				: query,
		}),
		...(headers && {
			headers: zodShemaAcceptEmptyObject(headers)
				? headers.optional()
				: headers,
		}),
	};
}
