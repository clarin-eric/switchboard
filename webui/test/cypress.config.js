const { defineConfig } = require('cypress')

module.exports = defineConfig({
  watchForFileChanges: true,
  defaultCommandTimeout: 100000,
  e2e: {
    baseUrl: 'http://localhost:8080'
  }
})