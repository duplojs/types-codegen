import { type Route } from "@duplojs/core";
import { routeToZodSchema } from "./routeToZodSchema";
import { unionZodSchema } from "./unionZodSchema";
import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { instanceofTransformator } from "./typescriptTransformators/instanceof";
import { receiveFormDataTransformator } from "./typescriptTransformators/receiveFormData";

export function generateTypeFromRoutes(routes: Route[]) {
	const routesSchema = unionZodSchema(
		routes.map(routeToZodSchema),
	);

	const zodToTypescript = new ZodToTypescript([instanceofTransformator, receiveFormDataTransformator]);

	zodToTypescript.append(
		routesSchema,
		"Routes",
	);

	return zodToTypescript.toString(true);
}
