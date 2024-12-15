import { type Duplose, ExtractStep, Process } from "@duplojs/core";
import { duploseIsIgnored } from "./ignore/ignoreThisDuplose";

export function getExtractStepFromDuplose(duplose: Duplose): ExtractStep[] {
	if (duploseIsIgnored(duplose)) {
		return [];
	}

	return [
		...duplose.definiton.preflightSteps.flatMap(
			(preflightStep) => getExtractStepFromDuplose(preflightStep.parent),
		),
		...duplose.definiton.steps.flatMap(
			(step) => {
				if (step.parent instanceof Process) {
					return getExtractStepFromDuplose(step.parent);
				}

				return step instanceof ExtractStep
					? step
					: [];
			},
		),
	];
}
