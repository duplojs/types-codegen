import { instanceofDuplose, Process, Route, type ContractResponse, type Duplose } from "@duplojs/core";
import { isStepWithResponse } from "./isStepWithResponse";
import { duploseIsIgnored, stepIsIgnored } from "./ignoreByTypeCodegenDescription";

export function getContractResponseFromDuplose(duplose: Duplose): ContractResponse[] {
	if (duploseIsIgnored(duplose)) {
		return [];
	}

	return [
		...instanceofDuplose(Route, duplose)
			? duplose.definiton.preflightSteps
			: [],
		...duplose.definiton.steps,
	]
		.flatMap(
			(step) => {
				if (stepIsIgnored(step)) {
					return [];
				} else if (step.parent instanceof Process) {
					return getContractResponseFromDuplose(step.parent);
				}

				return isStepWithResponse(step)
					? step.responses
					: [];
			},
		);
}
