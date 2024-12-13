import { zod, type Route } from "@duplojs/core";
import { concatExtractSteps } from "./concatExtractSteps";
import { getExtractStepFromDuplose } from "./getExtractStepFromDuplose";
import { getContractResponseFromDuplose } from "./getContractResponseFromDuplose";
import { contractResponseToZodSchema } from "./contractResponseToZodSchema";
import { type ZodType } from "zod";
import { unionZodSchema } from "./unionZodSchema";

export const defaultResponseSchema = zod.object({
	code: zod.number(),
	information: zod.string(),
	body: zod.unknown(),
	ok: zod.boolean(),
});

export function routeToZodSchema(route: Route) {
	const contractResponses = getContractResponseFromDuplose(route);
	const response = contractResponses
		.map(contractResponseToZodSchema)
		.reduce<undefined | ZodType>(
			(pv, cv) => (pv ? pv.or(cv) : cv),
			undefined,
		);

	const extractStep = getExtractStepFromDuplose(route);
	const variableRequestValue = concatExtractSteps(extractStep);

	const routesSchema = route.definiton.paths
		.map(
			(path) => zod.object({
				method: zod.literal(route.definiton.method),
				path: zod.literal(path),
				...variableRequestValue,
				...(
					response
						? { response }
						: { response: defaultResponseSchema }
				),
			}).passthrough(),
		);

	return unionZodSchema(routesSchema);
}
