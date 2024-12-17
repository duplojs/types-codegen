import { ZodToTypescript } from "@duplojs/zod-to-typescript";
import { zod, ZodSpace } from "@duplojs/core";
import { literalStringWithAsterisk } from "./literalStringWithAsterisk";
import { ZodLiteral } from "zod";

it("literalStringWithAsterisk", () => {
	const zodToTypescript = new ZodToTypescript([literalStringWithAsterisk]);

	zodToTypescript.append(
		new ZodLiteral({
			value: "totot*test*ff",
			typeName: ZodSpace.ZodFirstPartyTypeKind.ZodLiteral,
			asteriskToStringInterpolation: true,
		}),
		"Test",
	);

	zodToTypescript.append(
		new ZodLiteral({
			value: "/users/*",
			typeName: ZodSpace.ZodFirstPartyTypeKind.ZodLiteral,
			asteriskToStringInterpolation: true,
		}),
		"Path",
	);

	expect(
		zodToTypescript.toString(true),
	).toMatchSnapshot();
});
