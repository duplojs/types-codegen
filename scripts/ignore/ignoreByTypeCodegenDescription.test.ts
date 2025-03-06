import { createProcess, Description, OkHttpResponse } from "@duplojs/core";
import { duploseIsIgnored, IgnoreByTypeCodegenDescription } from "./ignoreByTypeCodegenDescription";

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
});
