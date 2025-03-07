import typescript from '@rollup/plugin-typescript';
import { defineConfig } from "rollup";

export default defineConfig([
	{
		input: ["scripts/index.ts", "bin/index.ts"],
		output: [
			{
				format: "esm",
				dir: "dist",
				preserveModules: true,
			},
		],
		plugins: [
			typescript({
				tsconfig: "tsconfig.build.json",
				include: /\.[jt]sx?$/,
				exclude: /node_modules/,
			}),
		],
	},
]);
