import { ExtractStep, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getExtractStepFromDuplose } from "./getExtractStepFromDuplose";
import { IgnoreThisDuplose } from "./ignore/ignoreThisDuplose";

it("getExtractStepFromDuplose", () => {
	const process = useBuilder()
		.createProcess("test")
		.extract({ body: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation();

	const ignoredProcess = useBuilder()
		.createProcess("test")
		.extract({ body: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation([], new IgnoreThisDuplose());

	const route = useBuilder()
		.preflight(process)
		.createRoute("GET", "/test")
		.extract({ params: {} })
		.execute(process)
		.execute(ignoredProcess)
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
