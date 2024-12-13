import { type Route } from "@duplojs/core";
import { routeToZodSchema } from "./routeToZodSchema";
import { unionZodSchema } from "./unionZodSchema";
import { ZodToTypescript } from "@duplojs/zod-to-typescript";

export function generateTypeFromRoutes(routes: Route[]) {
	const routesSchema = unionZodSchema(
		routes.map(routeToZodSchema),
	);

	return ZodToTypescript.convert(
		routesSchema,
		{ name: "Route" },
	);
}
