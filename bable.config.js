// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: true, // This helps in compiling to ES module compatible code
        },
        modules: false, // Set to false to keep ES module syntax
      },
    ],
    "@babel/preset-react",
  ],
  plugins: ["@babel/plugin-transform-runtime"],
};
