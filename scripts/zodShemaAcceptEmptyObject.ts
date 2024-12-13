import { type ZodType } from "zod";

export function zodShemaAcceptEmptyObject(zodSechema: ZodType) {
	const { success } = zodSechema.safeParse({});

	return success;
}
