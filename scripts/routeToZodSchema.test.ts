import { OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { routeToZodSchema } from "./routeToZodSchema";
import path from "path";

it("routeToZodSchema", () => {
	const routeContract = new OkHttpResponse("test", zod.string());
	const processContract = new OkHttpResponse("test", zod.undefined());

	const process = useBuilder()
		.createProcess("test")
		.extract({ params: { id: zod.string() } })
		.cut(
			() => new OkHttpResponse("test"),
			[],
			processContract,
		)
		.exportation();

	const route = useBuilder()
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
			path: "/test",
			body: "toto",
			params: { id: "toto" },
			response: {
				code: 200,
				information: "test",
				body: "toto",
				ok: true,
			},
		}),
	).toStrictEqual({
		data: {
			body: "toto",
			method: "GET",
			params: {
				id: "toto",
			},
			path: "/test",
			response: {
				body: "toto",
				code: 200,
				information: "test",
				ok: true,
			},
		},
		success: true,
	});
});
