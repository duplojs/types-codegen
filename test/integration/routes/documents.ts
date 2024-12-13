import { makeResponseContract, OkHttpResponse, recieveFiles, useBuilder, zod, File } from "@duplojs/core";

useBuilder()
	.createRoute("POST", "/pictures")
	.extract({
		body: zod.receiveFormData({
			userId: zod.string(),
			pictures: recieveFiles({
				maxSize: 200,
				quantity: 5,
				mimeType: /test/,
			}),
		}),
	})
	.handler(
		(pickup) => {
			const { pictures: [file] } = pickup("body");

			return new OkHttpResponse("picture.upload", file);
		},
		makeResponseContract(OkHttpResponse, "picture.upload", zod.instanceof(File)),
	);
