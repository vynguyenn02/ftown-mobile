module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module:react-native-dotenv",
        {
          moduleName: "@env",
          path: ".env",
          safe: true, // Thêm tính năng an toàn (nếu cần)
          allowUndefined: true, // Cho phép biến không được định nghĩa (nếu cần)
        },
      ],
    ],
  };
};
