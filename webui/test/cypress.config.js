const { defineConfig } = require('cypress')

module.exports = defineConfig({
  watchForFileChanges: true,
  defaultCommandTimeout: 10000,
  e2e: {
  }
})