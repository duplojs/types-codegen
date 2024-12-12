import { OkHttpResponse, useBuilder, zod } from "@duplojs/core";
import { getContractResponseFromDuplose } from "./getContractResponseFromDuplose";

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

	const route = useBuilder()
		.preflight(process)
		.createRoute("GET", "/test")
		.execute(process)
		.handler(
			() => new OkHttpResponse("test"),
			routeContract,
		);

	const rc = getContractResponseFromDuplose(route);

	expect(rc).toEqual([processContract, processContract, routeContract]);
});
