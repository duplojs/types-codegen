import { type Step, StepWithResponse } from "@duplojs/core";

export function isStepWithResponse(
	step: Step,
): step is StepWithResponse {
	return step instanceof StepWithResponse;
}
