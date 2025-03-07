import { createProcess, Description, ExtractStep, OkHttpResponse } from "@duplojs/core";
import { duploseIsIgnored, IgnoreByTypeCodegenDescription, stepIsIgnored } from "./ignoreByTypeCodegenDescription";

describe("IgnoreThisRoute", () => {
	it("Description", () => {
		expect(new IgnoreByTypeCodegenDescription()).instanceof(Description);
	});

	it("duploseIsIgnored", () => {
		const ignoredProcess = createProcess("test")
			.extract({ body: {} })
			.cut(
				() => new OkHttpResponse("test"),
			)
			.exportation([], new IgnoreByTypeCodegenDescription());

		expect(
			duploseIsIgnored(ignoredProcess),
		).toBe(true);
	});

	it("stepIsIgnored", () => {
		const ignoredProcess = new ExtractStep(
			{},
			undefined,
			[new IgnoreByTypeCodegenDescription()],
		);

		expect(
			stepIsIgnored(ignoredProcess),
		).toBe(true);
	});
});
