// CP-02-login.spec.js
// Caso vinculado: CP-02 - Inicio de sesión con credenciales válidas
// Objetivo: Verificar que un usuario registrado puede iniciar sesión con credenciales correctas
// y es redirigido correctamente a la página principal (Home) de Despénsalo.

const { test, expect } = require('@playwright/test');

// Ajusta estas credenciales por las de tu cuenta de prueba
const TEST_EMAIL = process.env.DESPENSALO_EMAIL || 'CORREO_VÁLIDO@AQUÍ.com';
const TEST_PASSWORD = process.env.DESPENSALO_PASSWORD || 'CONTRASEÑA_VÁLIDA_AQUÍ';

test.describe('CP-02: Login con credenciales válidas', () => {
  test('El usuario inicia sesión correctamente y es redirigido al Home', async ({ page }) => {
    // 1. Ir a la página principal (el login vive dentro de #authGate, no es una ruta aparte)
    await page.goto('/');

    // Asegurar que el formulario de login esté visible (por si el authGate abre en otra pestaña/tab)
    await expect(page.locator('#loginForm')).toBeVisible();

    // 2. Ingresar correo y contraseña válidos (selectores reales por ID)
    await page.locator('#loginEmail').fill(TEST_EMAIL);
    await page.locator('#loginPassword').fill(TEST_PASSWORD);

    // 3. Presionar "Ingresar a Despénsalo"
    await page.locator('#btnLogin').click();

    // Aserción principal: el authGate (pantalla de login) deja de estar visible tras el login exitoso
    // Nota: el texto por defecto de #authMsg ("Sesión cerrada correctamente.") corresponde
    // al mensaje de LOGOUT, no de login. Si al iniciar sesión aparece un mensaje "good" distinto,
    // ajusta esta aserción para validar ESE texto en lugar de solo la clase.
    await expect(page.locator('#authGate')).toBeHidden({ timeout: 10_000 });

    // Aserción adicional: el contenido principal de la app (post-login) es visible
    await expect(page.locator('main')).toBeVisible();
  });
});
