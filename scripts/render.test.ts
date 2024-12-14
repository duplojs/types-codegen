import { render } from "./render";

it("render", () => {
	expect(
		render("test"),
	).toMatchSnapshot();
});
