const { defineConfig } = require('cypress')

module.exports = defineConfig({
  watchForFileChanges: true,
  defaultCommandTimeout: 100000,
  e2e: {
    baseUrl: 'http://127.0.0.1:8080'
  }
})