module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: [
          [
            "module:react-native-dotenv",
            {
              moduleName: "react-native-dotenv",
            },
          ],
          "transform-remove-console",
          "react-native-reanimated/plugin",
        ],
      },
      development: {
        plugins: [
          [
            "module:react-native-dotenv",
            {
              moduleName: "react-native-dotenv",
            },
          ],
          "react-native-reanimated/plugin",
        ],
      },
    },
  };
};
