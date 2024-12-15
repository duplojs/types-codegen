import { Description, OkHttpResponse, useBuilder } from "@duplojs/core";
import { duploseIsIgnored, IgnoreThisDuplose } from "./ignoreThisDuplose";

describe("IgnoreThisRoute", () => {
	it("Description", () => {
		expect(new IgnoreThisDuplose()).instanceof(Description);
	});

	it("duploseIsIgnored", () => {
		const ignoredProcess = useBuilder()
			.createProcess("test")
			.extract({ body: {} })
			.cut(
				() => new OkHttpResponse("test"),
			)
			.exportation([], new IgnoreThisDuplose());

		expect(
			duploseIsIgnored(ignoredProcess),
		).toBe(true);
	});
});
