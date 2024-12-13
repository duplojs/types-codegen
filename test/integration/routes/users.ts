import { CreatedHttpResponse, makeResponseContract, NotFoundHttpResponse, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { userSchema } from "@schemas/users";

useBuilder()
	.createRoute("GET", "/users/{userId}")
	.extract({
		params: {
			userId: zod.string(),
		},
	})
	.cut(
		({ dropper }) => (dropper(null)),
		[],
		makeResponseContract(NotFoundHttpResponse, "user.notfound"),
	)
	.handler(
		() => new OkHttpResponse("user.get", {
			name: "John Doe",
			age: 30,
		}),
		makeResponseContract(OkHttpResponse, "user.get", userSchema),
	);

useBuilder()
	.createRoute("POST", "/users")
	.extract({
		body: zod.object({
			name: zod.string(),
			age: zod.number(),
		}),
	})
	.handler(
		(pickup) => new CreatedHttpResponse("user.created", pickup("body")),
		makeResponseContract(CreatedHttpResponse, "user.created", userSchema),
	);

useBuilder()
	.createRoute("GET", "/users")
	.handler(
		() => new OkHttpResponse("users.get", [
			{
				name: "John Doe",
				age: 30,
			},
		]),
		makeResponseContract(OkHttpResponse, "users.get", userSchema.array()),
	);
