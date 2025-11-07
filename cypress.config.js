const { defineConfig } = require('cypress');
const { initPlugin } = require('cypress-image-snapshot/plugin');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      initPlugin(on, config);
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });
      return config;
    },
    screenshotOnRunFailure: true,
    video: true,
  },
  viewportWidth: 1280,
  viewportHeight: 720,
});