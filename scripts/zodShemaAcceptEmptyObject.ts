import { type ZodSpace } from "@duplojs/core";

export function zodShemaAcceptEmptyObject(zodSechema: ZodSpace.ZodType) {
	const { success } = zodSechema.safeParse({});

	return success;
}
