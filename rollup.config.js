import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import fs from "fs";
const path = require("path");
const crypto = require("crypto");
var UglifyJS = require("uglify-js");

const bundleMobxDoric = `dist/bundle_mobx-doric.js`;
const bundleMobx = `dist/bundle_mobx.js`;

const polyfilledSymbol = fs.readFileSync("./polyfilled.js", "utf-8");
const mobxDevelopmentSource = fs.readFileSync(
  "node_modules/mobx/dist/mobx.cjs.development.js",
  "utf-8"
);
const mobxProductionMinSource = fs.readFileSync(
  "node_modules/mobx/dist/mobx.cjs.production.min.js",
  "utf-8"
);

fs.writeFileSync(
  bundleMobx,
  UglifyJS.minify(`${polyfilledSymbol}\n${mobxDevelopmentSource}`).code
);

export default [
  {
    input: `build/index.js`,
    output: {
      format: "cjs",
      file: bundleMobxDoric,
      sourcemap: true,
    },
    plugins: [
      resolve({ mainFields: ["jsnext:main"] }),
      commonjs(),
      json(),
      {
        name: "generateBundle",
        generateBundle: async function (options, info) {
          console.log("generateBundle");
          const files = [bundleMobxDoric, bundleMobx];
          const androidAssets = "android/src/main/assets";

          for (let file of files) {
            const md5 = crypto.createHash("md5");
            md5.update(path.basename(file));
            const name = md5.digest("hex").toLowerCase();

            let data;
            if (file === bundleMobx) {
              data = mobxProductionMinSource;
            } else {
              data = await fs.promises.readFile(file);
            }

            const temp = new Uint8Array(data.buffer);
            for (let i = 0; i < temp.length; i++) {
              temp[i] = 0xff - temp[i];
            }
            await fs.promises.writeFile(
              path.resolve(androidAssets, name),
              data
            );
          }
        },
      },
    ],
    external: ["reflect-metadata", "doric", "mobx"],
    onwarn: function (warning) {
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }
      console.warn(warning.message);
    },
  },
];
