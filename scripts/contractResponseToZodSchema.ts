import { zod, type ContractResponse } from "@duplojs/core";

export function contractResponseToZodSchema(contractResponse: ContractResponse) {
	return zod.object({
		code: zod.literal(contractResponse.code),
		information: zod.literal(contractResponse.code),
		body: contractResponse.body,
		ok: zod.literal(
			!!(contractResponse.code >= 200 && contractResponse.code <= 299),
		),
	});
}
