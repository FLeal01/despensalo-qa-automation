// playwright.config.js
// Configuración base del proyecto de automatización para despensalo.cl (Evaluación U3)

const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false, // ejecutar en orden, útil porque hay dependencias de datos (stock)
  retries: 0,
  reporter: [
    ['html', { open: 'never' }], // genera reporte visual con capturas -> sirve como evidencia
    ['list'],
  ],
  use: {
    baseURL: 'https://despensalo.cl',
    screenshot: 'on', // captura automática en cada paso -> evidencia para 6.1/6.2
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
