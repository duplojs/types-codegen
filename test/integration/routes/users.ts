import { CreatedHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { userSchema } from "@schemas/users";

useBuilder()
	.createRoute("GET", "/users/{userId}")
	.extract({
		params: {
			userId: zod.string(),
		},
	})
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
