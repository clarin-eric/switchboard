const { defineConfig } = require('cypress')

module.exports = defineConfig({
  watchForFileChanges: true,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: 'http://127.0.0.1:8080'
  }
})