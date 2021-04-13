module.exports = (api) => {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    env: {
      production: {
        plugins: ["transform-remove-console", "react-native-reanimated/plugin"],
      },
      development: {
        plugins: ["react-native-reanimated/plugin"],
      },
    },
  };
};
