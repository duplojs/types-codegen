import { instanceofDuplose, Process, Route, type ContractResponse, type Duplose } from "@duplojs/core";
import { isStepWithResponse } from "./isStepWithResponse";
import { duploseIsIgnored } from "./ignore/ignoreThisDuplose";

export function getContractResponseFromDuplose(duplose: Duplose): ContractResponse[] {
	if (duploseIsIgnored(duplose)) {
		return [];
	}

	const contractResponseFromPreflight = instanceofDuplose(Route, duplose)
		? duplose.definiton.preflightSteps.flatMap(
			(preflightStep) => getContractResponseFromDuplose(preflightStep.parent),
		)
		: [];

	return [
		...contractResponseFromPreflight,
		...duplose.definiton.steps.flatMap(
			(step) => {
				if (step.parent instanceof Process) {
					return getContractResponseFromDuplose(step.parent);
				}

				return isStepWithResponse(step)
					? step.responses
					: [];
			},
		),
	];
}
