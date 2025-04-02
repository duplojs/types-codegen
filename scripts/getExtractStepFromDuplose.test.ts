import { createProcess, ExtractStep, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getExtractStepFromDuplose } from "./getExtractStepFromDuplose";
import { IgnoreByTypeCodegenDescription } from "./ignoreByTypeCodegenDescription";

it("getExtractStepFromDuplose", () => {
	const process = createProcess("test")
		.extract({ body: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation();

	const ignoredProcess = createProcess("test")
		.extract({ query: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation([], new IgnoreByTypeCodegenDescription());

	const ignoredByImplementationProcess = createProcess("test")
		.extract({ query: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation([]);

	const route = useBuilder()
		.preflight(process)
		.createRoute("GET", "/test")
		.extract({ params: {} })
		.extract({ headers: {} }, undefined, new IgnoreByTypeCodegenDescription())
		.execute(process)
		.execute(ignoredProcess)
		.execute(ignoredByImplementationProcess, undefined, new IgnoreByTypeCodegenDescription())
		.handler(
			() => new OkHttpResponse("test"),
		);

	expect(getExtractStepFromDuplose(route)).toEqual([
		new ExtractStep({ body: {} }),
		new ExtractStep({ params: {} }),
		new ExtractStep({ body: {} }),
	]);
});
