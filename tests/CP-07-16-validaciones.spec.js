// tests/CP-07-16-validaciones.spec.js
// Casos vinculados: CP-07 (impedir stock negativo) y CP-16 (rechazar campos obligatorios vacíos)

const { test, expect } = require('@playwright/test');

const TEST_EMAIL = 'CORREO_VÁLIDO@AQUÍ.com';
const TEST_PASSWORD = 'CONTRASEÑA_VÁLIDA_AQUÍ';

async function login(page) {
  await page.goto('/');
  await page.locator('#loginEmail').fill(TEST_EMAIL);
  await page.locator('#loginPassword').fill(TEST_PASSWORD);
  await page.locator('#btnLogin').click();
  await expect(page.locator('#authGate')).toBeHidden({ timeout: 10_000 });
}

async function navegarA(page, seccion) {
  const navBtn = page.locator(`button.nav-btn[data-target="${seccion}"]`).first();
  await navBtn.click();
  await expect(navBtn).toHaveClass(/active/);
}

test.describe('CP-07: Impedir stock negativo', () => {
  test('El sistema no permite que el stock de un producto con 0 unidades baje de 0', async ({ page }) => {
    await login(page);
    await navegarA(page, 'inventorySection');

    // Esperar a que la lista de productos cargue
    const anyProductCard = page.locator('#productList article.product-card').first();
    await expect(anyProductCard).toBeVisible({ timeout: 10_000 });

    // Buscar "Producto QA 01", o usar el primer producto disponible si no existe
    const targetCard = page.locator('#productList article.product-card', { hasText: 'Producto QA 01' });
    const productCard = (await targetCard.count() > 0) ? targetCard.first() : anyProductCard;

    // PRECONDICIÓN GARANTIZADA: Asegurar que esté en 0 usando el botón de Agotar si está disponible
    const outButton = productCard.locator('button[data-action="out"]');
    if (await outButton.isVisible()) {
      await outButton.click();
    }

    // Esperar a que el contador sea efectivamente 0
    const stockNum = productCard.locator('.stock-num');
    await expect(stockNum).toHaveText('0');

    // Botón de disminución
    const minusButton = productCard.locator('button[data-action="minus"]');
    await expect(minusButton).toBeVisible();

    // Intentar disminuir bajo 0 tres veces
    for (let i = 0; i < 3; i++) {
      await minusButton.click();
    }

    // Aserción 1: El contador no baja a números negativos
    await expect(stockNum).toHaveText('0');

    // Aserción 2: La tarjeta se clasifica con estado "out" (agotado)
    await expect(productCard).toHaveClass(/\bout\b/);

    // Aserción 3: El badge/pill refleja estado "Agotado"
    await expect(productCard.locator('.pill.out')).toContainText('Agotado');
  });
});

test.describe('CP-16: Validación de campos obligatorios vacíos', () => {
  test('El sistema rechaza guardar un producto sin nombre', async ({ page }) => {
    await login(page);

    // Abrir modal de registro manual
    await page.getByRole('button', { name: /agregar producto sin código/i }).click();
    const modalHeading = page.getByRole('heading', { name: /registrar producto/i });
    await expect(modalHeading).toBeVisible();

    // Intentar guardar dejando el nombre vacío
    await page.getByRole('button', { name: /guardar producto/i }).click();

    // Aserción 1: Validar toast de error (espera reactiva antes de que desaparezca)
    const toast = page.locator('#toast');
    await expect(toast).toBeVisible({ timeout: 3000 });
    await expect(toast).toHaveClass(/\bbad\b/);
    await expect(toast).toContainText(/escribe el nombre del producto/i);

    // Aserción 2: El modal permanece abierto (el flujo no continúa con datos inválidos)
    await expect(modalHeading).toBeVisible();
  });
});