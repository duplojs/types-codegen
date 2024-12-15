import { Description, type Duplose } from "@duplojs/core";

export class IgnoreThisDuplose extends Description {

}

export function duploseIsIgnored(duplose: Duplose) {
	return !!duplose.definiton.descriptions.find(
		(description) => description instanceof IgnoreThisDuplose,
	);
}
