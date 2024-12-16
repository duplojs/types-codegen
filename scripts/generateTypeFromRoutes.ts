import { ZodSpace, type Route } from "@duplojs/core";
import { routeToZodSchema } from "./routeToZodSchema";
import { unionZodSchema } from "./unionZodSchema";
import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { instanceofTransformator } from "./zodToTypescript/typescriptTransformators/instanceof";
import { receiveFormDataTransformator } from "./zodToTypescript/typescriptTransformators/receiveFormData";
import { defaultToOptionalHook } from "./zodToTypescript/hooks/defaultToOptional";
import { duploseIsIgnored } from "./ignore/ignoreThisDuplose";

export function generateTypeFromRoutes(routes: Route[]) {
	const routesSchema = unionZodSchema(
		routes
			.filter((route) => !duploseIsIgnored(route))
			.map(routeToZodSchema),
	);

	ZodToTypescript.injectZod(ZodSpace);

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
