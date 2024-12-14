import { type Route } from "@duplojs/core";
import { routeToZodSchema } from "./routeToZodSchema";
import { unionZodSchema } from "./unionZodSchema";
import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { instanceofTransformator } from "./zodToTypescript/typescriptTransformators/instanceof";
import { receiveFormDataTransformator } from "./zodToTypescript/typescriptTransformators/receiveFormData";
import { defaultToOptionalHook } from "./zodToTypescript/hooks/defaultToOptional";

export function generateTypeFromRoutes(routes: Route[]) {
	const routesSchema = unionZodSchema(
		routes.map(routeToZodSchema),
	);

	const zodToTypescript = new ZodToTypescript([instanceofTransformator, receiveFormDataTransformator]);

	zodToTypescript.zodSchemaHooks.push(
		defaultToOptionalHook,
	);

	zodToTypescript.append(
		routesSchema,
		"CodegenRoutes",
	);

	return zodToTypescript.toString(true);
}
