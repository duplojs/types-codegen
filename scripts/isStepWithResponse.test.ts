import { CutStep } from "@duplojs/core";
import { isStepWithResponse } from "./isStepWithResponse";

it("isStepWithResponse", () => {
	const custCtep = new CutStep((() => {}) as any, []);

	expect(isStepWithResponse(custCtep)).toBe(true);
});
