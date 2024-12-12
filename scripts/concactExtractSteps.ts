import { zod, type ExtractStep } from "@duplojs/core";
import { ZodType } from "zod";

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

export function concactExtractSteps(extractSteps: ExtractStep[]) {
	return extractSteps
		.flatMap(
			(extractStep) => keyofVariableRequestValue.map(
				(key) => extractStep.parent[key]
					? <const>[key, extractStep.parent[key]]
					: undefined,
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
}
