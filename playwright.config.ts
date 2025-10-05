import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',        // Directory where API test files are located
  fullyParallel: true,       // Run tests in parallel
  retries: 0,                // No retries by default
  reporter: 'html',          // Use HTML reporter for results visualization
  use: {
    baseURL: process.env.BASE_URL || 'https://api.example.com', // Base URL for all API requests
    extraHTTPHeaders: {
      // Common headers for all API requests
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.API_TOKEN || ''}`,
    },
  },
});
