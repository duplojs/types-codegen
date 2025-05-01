import { type Duplose, ExtractStep, instanceofDuplose, Process, Route } from "@duplojs/core";
import { duploseIsIgnored, stepIsIgnored } from "./ignoreByTypeCodegenDescription";

export function getExtractStepFromDuplose(duplose: Duplose): ExtractStep[] {
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
					return getExtractStepFromDuplose(step.parent);
				}

				return step instanceof ExtractStep
					? step
					: [];
			},
		);
}
