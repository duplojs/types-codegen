import { CreatedHttpResponse, makeResponseContract, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { userSchema } from "@schemas/users";

useBuilder()
	.createRoute("GET", "/users/{userId}")
	.extract({
		params: {
			userid: zod.string(),
		},
	})
	.handler(
		() => new OkHttpResponse("user.get"),
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
		() => new CreatedHttpResponse("user.created"),
		makeResponseContract(CreatedHttpResponse, "user.created", userSchema),
	);
