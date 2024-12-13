import { ExtractStep, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getExtractStepFromDuplose } from "./getExtractStepFromDuplose";

it("getExtractStepFromDuplose", () => {
	const process = useBuilder()
		.createProcess("test")
		.extract({ body: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation();

	const route = useBuilder()
		.preflight(process)
		.createRoute("GET", "/test")
		.extract({ params: {} })
		.execute(process)
		.handler(
			() => new OkHttpResponse("test"),
		);

	const es = getExtractStepFromDuplose(route);

	expect(es).toEqual([
		new ExtractStep({ body: {} }),
		new ExtractStep({ params: {} }),
		new ExtractStep({ body: {} }),
	]);
});
