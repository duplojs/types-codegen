import { spawnSync } from "child_process";

describe("command", () => {
	it("generate file", () => {
		spawnSync(
			"npx",
			["duplojs-types-codegen", "-i", "routes", "-o", "../output/outputTypeCodegen.d.ts"],
			{
				cwd: `${process.cwd()}/test/integration`,
			},
		);
	});
});
