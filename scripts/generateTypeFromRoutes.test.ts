import { makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { generateTypeFromRoutes } from "./generateTypeFromRoutes";
import { IgnoreThisDuplose } from "./ignore/ignoreThisDuplose";

it("generateTypeFromRoutes", () => {
	const route = useBuilder()
		.createRoute("GET", "/test")
		.extract({
			query: {
				page: zod.number(),
			},
		})
		.handler(
			(pickup) => new OkHttpResponse("test", pickup("page")),
			makeResponseContract(OkHttpResponse, "test", zod.number()),
		);

	const ignoredRoute = useBuilder()
		.createRoute("GET", "/test", new IgnoreThisDuplose())
		.extract({
			query: {
				page: zod.number(),
			},
		})
		.handler(
			(pickup) => new OkHttpResponse("test", pickup("page")),
			makeResponseContract(OkHttpResponse, "test", zod.number()),
		);

	expect(
		generateTypeFromRoutes([route, ignoredRoute]),
	)
		.toMatchSnapshot();
});
