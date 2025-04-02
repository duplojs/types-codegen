import { createProcess, OkHttpResponse, useBuilder, zod, ContextPrefixDescription } from "@duplojs/core";
import { routeToZodSchema } from "./routeToZodSchema";

it("routeToZodSchema", () => {
	const routeContract = new OkHttpResponse("test", zod.string());
	const processContract = new OkHttpResponse("test", zod.undefined());

	const process = createProcess("test")
		.extract({ params: { id: zod.string() } })
		.cut(
			() => new OkHttpResponse("test"),
			[],
			processContract,
		)
		.exportation();

	const route = useBuilder(new ContextPrefixDescription("context-prefix"))
		.preflight(process)
		.createRoute("GET", "/test")
		.extract({ body: zod.string() })
		.execute(process)
		.handler(
			() => new OkHttpResponse("test", "toto"),
			routeContract,
		);

	const result = routeToZodSchema(route);

	expect(
		result!.safeParse({
			method: "GET",
			path: "/context-prefix/test",
			body: "toto",
			params: { id: "toto" },
			response: {
				code: 200,
				information: "test",
				body: "toto",
			},
		}),
	).toStrictEqual({
		data: {
			body: "toto",
			method: "GET",
			params: {
				id: "toto",
			},
			path: "/context-prefix/test",
			response: {
				body: "toto",
				code: 200,
				information: "test",
			},
		},
		success: true,
	});
});
