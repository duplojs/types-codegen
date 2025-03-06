import { createProcess, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getContractResponseFromDuplose } from "./getContractResponseFromDuplose";
import { IgnoreByTypeCodegenDescription } from "./ignore/ignoreByTypeCodegenDescription";

it("getContractResponseFromDuplose", () => {
	const routeContract = new OkHttpResponse("test", zod.undefined());
	const processContract = new OkHttpResponse("test", zod.undefined());

	const process = createProcess("test")
		.cut(
			() => new OkHttpResponse("test"),
			[],
			processContract,
		)
		.exportation();

	const ignoredProcess = createProcess("test")
		.extract({ body: {} })
		.cut(
			() => new OkHttpResponse("test"),
		)
		.exportation([], new IgnoreByTypeCodegenDescription());

	const route = useBuilder()
		.preflight(process)
		.createRoute("GET", "/test")
		.execute(process)
		.execute(ignoredProcess)
		.handler(
			() => new OkHttpResponse("test"),
			routeContract,
		);

	const rc = getContractResponseFromDuplose(route);

	expect(rc).toEqual([processContract, processContract, routeContract]);
});
