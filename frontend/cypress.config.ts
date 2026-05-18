import { defineConfig } from 'cypress';
import codeCoverageTask from '@cypress/code-coverage/task';
import * as dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  env: {
    apiUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    userEmail: 'karin.andersson@example.com',
    userPassword: 'password',
  },
  e2e: {
    experimentalRunAllSpecs: true,
    setupNodeEvents(on, config) {
      codeCoverageTask(on, config);
      // It's IMPORTANT to return the config object
      // with any changed environment variables
      return config;
    },
    chromeWebSecurity: false,
    defaultCommandTimeout: 5000,
    retries: 3,
  },
});
