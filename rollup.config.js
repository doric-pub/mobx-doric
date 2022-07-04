import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import fs from "fs";

fs.copyFileSync(
  "node_modules/mobx/dist/mobx.cjs.production.min.js",
  "dist/bundle_mobx.js"
);

export default [
  {
    input: `build/index.js`,
    output: {
      format: "cjs",
      file: `dist/bundle_mobx-doric.js`,
      sourcemap: true,
    },
    plugins: [resolve({ mainFields: ["jsnext:main"] }), commonjs(), json()],
    external: ["reflect-metadata", "doric", "mobx"],
    onwarn: function (warning) {
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }
      console.warn(warning.message);
    },
  },
];
