import { spawnSync } from "child_process";
import { existsSync, readFileSync, unlinkSync } from "fs";

describe("command", () => {
	const outputPath = `${process.cwd()}/test/output/outputTypeCodegen.d.ts`;

	beforeAll(() => {
		if (existsSync(outputPath)) {
			unlinkSync(outputPath);
		}
	});

	it("include all routes", () => {
		spawnSync(
			"npx",
			["duplojs-types-codegen", "-i", "routes", "-o", "../output/outputTypeCodegen.d.ts"],
			{
				cwd: `${process.cwd()}/test/integration`,
			},
		);

		expect(existsSync(outputPath))
			.toBe(true);

		expect(readFileSync(outputPath, "utf-8"))
			.toMatchSnapshot();
	});

	it("require scripts", () => {
		spawnSync(
			"npx",
			["duplojs-types-codegen", "--require", "routes/users.ts", "-i", "routes/documents.ts", "-o", "../output/outputTypeCodegen.d.ts"],
			{
				cwd: `${process.cwd()}/test/integration`,
			},
		);

		expect(existsSync(outputPath))
			.toBe(true);

		expect(readFileSync(outputPath, "utf-8"))
			.toMatchSnapshot();
	});
});
