import { type Duplose, ExtractStep, instanceofDuplose, Process, Route } from "@duplojs/core";
import { duploseIsIgnored } from "./ignore/ignoreByTypeCodegenDescription";

export function getExtractStepFromDuplose(duplose: Duplose): ExtractStep[] {
	if (duploseIsIgnored(duplose)) {
		return [];
	}

	const extractStepFromPreflight = instanceofDuplose(Route, duplose)
		? duplose.definiton.preflightSteps.flatMap(
			(preflightStep) => getExtractStepFromDuplose(preflightStep.parent),
		)
		: [];

	return [
		...extractStepFromPreflight,
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
