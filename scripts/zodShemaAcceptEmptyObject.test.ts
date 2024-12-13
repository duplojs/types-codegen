import { zod } from "@duplojs/core";
import { zodShemaAcceptEmptyObject } from "./zodShemaAcceptEmptyObject";

it("zodShemaAcceptEmptyObject", () => {
	expect(
		zodShemaAcceptEmptyObject(zod.object({ test: zod.string().optional() })),
	).toBe(true);

	expect(
		zodShemaAcceptEmptyObject(zod.string()),
	).toBe(false);
});
