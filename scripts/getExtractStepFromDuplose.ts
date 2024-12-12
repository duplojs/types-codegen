import { type Duplose, ExtractStep } from "@duplojs/core";

export function getExtractStepFromDuplose(duplose: Duplose): ExtractStep[] {
	return [
		...duplose.definiton.preflightSteps.flatMap(
			(preflightStep) => getExtractStepFromDuplose(preflightStep.parent),
		),
		...duplose.definiton.steps.flatMap(
			(step) => step instanceof ExtractStep
				? step
				: [],
		),
	];
}
