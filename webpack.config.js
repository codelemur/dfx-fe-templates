const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const preCSS = require('precss');
const autoPrefixer = require('autoprefixer');
const dfxJson = require("./dfx.json");

// List of all aliases for canisters. This creates the module alias for
// the `import ... from "ic:canisters/xyz"` where xyz is the name of a
// canister.
const aliases = Object.entries(dfxJson.canisters)
  .reduce((acc, [name, value]) => {
    const outputRoot = path.join(__dirname, dfxJson.defaults.build.output, name);
    const canisterKey = "ic:canisters/" + name;
    const idlKey = "ic:idl/" + name;
    const canisterPath = path.join(outputRoot, name + ".js");
    const idlPath = path.join(outputRoot, name + ".did.js");
    console.log({ canisterKey, idlKey, canisterPath, idlPath })
    return {
      ...acc,
      [canisterKey]: canisterPath,
      [idlKey]: idlPath,
    };
  }, {});


/**
 * Generate a webpack configuration for a canister.
 */
function generateWebpackConfigForCanister(name, info) {
  if (typeof info.frontend !== 'object') {
    return;
  }

  const outputRoot = path.join(__dirname, dfxJson.defaults.build.output, name);
  const inputRoot = __dirname;

  return {
    mode: "production",
    entry: {
      index: path.join(inputRoot, info.frontend.entrypoint),
    },
    devtool: "source-map",
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
    },
    resolve: {
      alias: aliases,
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.(scss)$/,
          use: [{
            loader: 'style-loader', // inject CSS to page
          }, {
            loader: 'css-loader', // translates CSS into CommonJS modules
          }, {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  preCSS,
                  autoPrefixer
                ];
              }
            }
          }, {
            loader: 'sass-loader' // compiles Sass to CSS
          }]
        }
      ]
    },
    output: {
      filename: "index.js",
      path: path.join(__dirname, info.frontend.output),
    },
    plugins: [],
  };
}

// If you have webpack configurations you want to build as part of this
// config, add them here.
module.exports = [
  ...Object.entries(dfxJson.canisters).map(([name, info]) => {
    return generateWebpackConfigForCanister(name, info);
  }).filter(x => !!x),
];
