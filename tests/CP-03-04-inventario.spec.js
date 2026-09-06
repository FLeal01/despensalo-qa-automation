// CP-03-04-inventario.spec.js
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

async function obtenerUnidadesActuales(page) {
  await navegarA(page, 'homeSection');
  const unitsLocator = page.locator('#kUnits');
  await expect(unitsLocator).not.toHaveText('', { timeout: 7000 });
  const texto = await unitsLocator.innerText();
  return parseInt(texto.replace(/\D/g, ''), 10) || 0;
}

async function agregarProductoSinCodigo(page, {
  nombre,
  stockActual,
  stockMinimo,
  stockObjetivo,
  categoria,
  guardarEn,
  unidad,
  precio,
}) {
  await page.getByRole('button', { name: /agregar producto sin código/i }).click();
  const modalHeading = page.getByRole('heading', { name: /registrar producto/i });
  await expect(modalHeading).toBeVisible();

  await page.getByPlaceholder(/arroz grado 2/i).fill(nombre);

  if (guardarEn) await page.locator('#pInventoryType').selectOption(guardarEn);
  if (categoria) await page.locator('#pCategory').selectOption(categoria);
  if (unidad) await page.locator('#pUnit').selectOption(unidad);

  await page.locator('#pStock').fill(String(stockActual));
  if (stockMinimo !== undefined) await page.locator('#pMin').fill(String(stockMinimo));
  if (stockObjetivo !== undefined) await page.locator('#pTarget').fill(String(stockObjetivo));
  if (precio !== undefined) await page.locator('#pPrice').fill(String(precio));

  await page.getByRole('button', { name: /guardar producto/i }).click();
  
  // Esperar que el modal se cierre por completo en el DOM
  await expect(modalHeading).toBeHidden({ timeout: 7000 });
}

test.describe.serial('CP-03/CP-04: Inventario y stock', () => {
  // Nombre con prefijo limpio para que no colisione con números de stock
  let PRODUCT_NAME;

  test.beforeAll(() => {
    PRODUCT_NAME = `ProdQA_${Date.now()}`;
  });

  test('CP-03: Agregar producto manualmente con stock inicial de 5 unidades', async ({ page }) => {
    await login(page);

    const unidadesAntes = await obtenerUnidadesActuales(page);

    await agregarProductoSinCodigo(page, {
      nombre: PRODUCT_NAME,
      stockActual: 5,
      stockMinimo: 1,
      stockObjetivo: 1,
    });

    // Validar presencia en inventario
    await navegarA(page, 'inventorySection');
    const productCard = page.locator('#productList article.product-card', { hasText: PRODUCT_NAME });
    
    // Esperar a que la tarjeta aparezca
    await expect(productCard).toBeVisible({ timeout: 10_000 });
    
    // Selector exacto .stock-num descubierto por la traza
    await expect(productCard.locator('.stock-num')).toHaveText('5');

    // Validar incremento en dashboard
    await navegarA(page, 'homeSection');
    await expect(page.locator('#kUnits')).toHaveText(String(unidadesAntes + 5));
  });

  test('CP-04: Aumentar stock de un producto existente de 5 a 8 unidades', async ({ page }) => {
    await login(page);

    const unidadesAntes = await obtenerUnidadesActuales(page);

    await navegarA(page, 'inventorySection');
    const productCard = page.locator('#productList article.product-card', { hasText: PRODUCT_NAME });
    await expect(productCard).toBeVisible({ timeout: 10_000 });
    
    await productCard.locator('button[data-action="edit"]').click();

    const stockInput = page.locator('#pStock');
    await expect(stockInput).toBeVisible();
    await stockInput.fill('8');
    
    await page.getByRole('button', { name: /guardar/i }).click();
    await expect(stockInput).toBeHidden({ timeout: 7000 });

    // Corrección del strict mode violation: targeteamos exactamente .stock-num
    await expect(productCard.locator('.stock-num')).toHaveText('8');

    // Validar incremento acumulado en dashboard (+3)
    await navegarA(page, 'homeSection');
    await expect(page.locator('#kUnits')).toHaveText(String(unidadesAntes + 3));
  });
});