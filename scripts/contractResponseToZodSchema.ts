import { zod, type ContractResponse } from "@duplojs/core";

export function contractResponseToZodSchema(contractResponse: ContractResponse) {
	return zod.object({
		code: zod.literal(contractResponse.code),
		information: zod.literal(contractResponse.information),
		body: contractResponse.body,
	});
}
