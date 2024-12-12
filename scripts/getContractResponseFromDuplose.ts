import { type ContractResponse, type Duplose } from "@duplojs/core";
import { isStepWithResponse } from "./isStepWithResponse";

export function getContractResponseFromDuplose(duplose: Duplose): ContractResponse[] {
	return [
		...duplose.definiton.preflightSteps.flatMap(
			(preflightStep) => getContractResponseFromDuplose(preflightStep.parent),
		),
		...duplose.definiton.steps.flatMap(
			(step) => isStepWithResponse(step)
				? step.responses
				: [],
		),
	];
}
