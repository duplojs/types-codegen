import { OkHttpResponse, zod } from "@duplojs/core";
import { contractResponseToZodSchema } from "./contractResponseToZodSchema";

it("contractResponseToZodSchema", () => {
	const schema = contractResponseToZodSchema(
		new OkHttpResponse("test", zod.string()),
	);

	expect(
		schema.safeParse({
			code: 200,
			information: "test",
			body: "my super body",
		}),
	)
		.toStrictEqual({
			data: {
				code: 200,
				information: "test",
				body: "my super body",
			},
			success: true,
		});
});
