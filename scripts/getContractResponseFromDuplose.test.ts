import { createProcess, OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getContractResponseFromDuplose } from "./getContractResponseFromDuplose";
import { IgnoreByTypeCodegenDescription } from "./ignoreByTypeCodegenDescription";

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
			[],
			processContract,
		)
		.exportation([], new IgnoreByTypeCodegenDescription());

	const ignoredByImplementationProcess = createProcess("test")
		.extract({ body: {} })
		.cut(
			() => new OkHttpResponse("test"),
			[],
			processContract,
		)
		.exportation([]);

	const route = useBuilder()
		.preflight(process)
		.createRoute("GET", "/test")
		.execute(process)
		.execute(ignoredProcess)
		.execute(ignoredByImplementationProcess, undefined, new IgnoreByTypeCodegenDescription())
		.cut(
			() => new OkHttpResponse("test"),
			[],
			processContract,
			new IgnoreByTypeCodegenDescription(),
		)
		.handler(
			() => new OkHttpResponse("test"),
			routeContract,
		);

	expect(getContractResponseFromDuplose(route)).toEqual([processContract, processContract, routeContract]);
});
