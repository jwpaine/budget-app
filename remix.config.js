// /** @type {import('@remix-run/dev').AppConfig} */
// module.exports = {
//   cacheDirectory: "./node_modules/.cache/remix",
//   future: {
//     v2_errorBoundary: true,
//     v2_meta: true,
//     v2_normalizeFormMethod: true,
//     v2_routeConvention: true,
//   },
//   ignoredRouteFiles: ["**/.*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
// };

/**
 * @type {import('@remix-run/dev').AppConfig}
 */

module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  serverBuildPath: "build/index.js",
  publicPath: "/build/",
  future: {
    unstable_cssSideEffectImports: true,
  },
};

