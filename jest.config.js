module.exports = {
    preset: '@vue/cli-plugin-unit-jest',
    transform: {
        '^.+\\.vue$': 'vue-jest',
      },
      setupFiles: ["<rootDir>/tests/unit/index.js"],
      verbose: true
}
