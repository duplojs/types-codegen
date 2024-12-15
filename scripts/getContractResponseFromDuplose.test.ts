import { OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getContractResponseFromDuplose } from "./getContractResponseFromDuplose";
import { IgnoreThisDuplose } from "./ignore/ignoreThisDuplose";

it("getContractResponseFromDuplose", () => {
	const routeContract = new OkHttpResponse("test", zod.undefined());
	const processContract = new OkHttpResponse("test", zod.undefined());

	const process = useBuilder()
		.createProcess("test")
		.cut(
			() => new OkHttpResponse("test"),
			[],
			processContract,
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
		.execute(process)
		.execute(ignoredProcess)
		.handler(
			() => new OkHttpResponse("test"),
			routeContract,
		);

	const rc = getContractResponseFromDuplose(route);

	expect(rc).toEqual([processContract, processContract, routeContract]);
});
