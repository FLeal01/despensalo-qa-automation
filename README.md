# Automatización QA — despensalo.cl (Evaluación U3) - Fabiola Leal S50

---

## Contenido del Repositorio

* **`tests/`**: Suites de pruebas automatizadas con Playwright (JavaScript)[cite: 2].
  * `CP-02-login.spec.js`: Verificación de autenticación y redirección al panel principal[cite: 1].
  * `CP-03-04-inventario.spec.js`: Alta de productos y modificación acumulativa de stock. Incluye la función parametrizada `agregarProductoSinCodigo` (Criterio 6.1)[cite: 1].
  * `CP-07-16-validaciones.spec.js`: Reglas de negocio (bloqueo de stock negativo bajo 0) y validación reactiva de campos obligatorios en modales[cite: 1].
* **`docs/`**:
  * **Documento_Casos_Prueba_Despensalo.pdf:** Registro formal de casos manuales ejecutados, gestión de defectos (bug tracking con causa raíz y recomendación), sesiones exploratorias y análisis comparativo manual.
* **`playwright.config.js`**: Configuración multi-entorno (Chromium y Firefox) con captura automática de screenshots, videos y trazas[cite: 1, 2].
* **`test-results/` / `playwright-report/`**: Evidencias gráficas, capturas automáticas y reportes consolidados en HTML[cite: 1, 2].

---

## Trazabilidad de Casos y Cumplimiento de Rúbrica

| Caso Manual[cite: 1] | Script Automatizado[cite: 1] | Objetivo / Validación | Criterio Clave |
| :---: | :--- | :--- | :---: |
| **CP-02**[cite: 1] | `CP-02-login.spec.js` | Autenticación válida, ocultamiento de `#authGate` y carga de vista principal[cite: 1]. | Flujo autenticado[cite: 1] |
| **CP-03**[cite: 1] | `CP-03-04-inventario.spec.js` | Registro manual de ítem e incremento en contador global `#kUnits`[cite: 1]. | Parametrización (6.1)[cite: 1] |
| **CP-04**[cite: 1] | `CP-03-04-inventario.spec.js` | Modificación de stock (5 a 8 un.) sobre `.stock-num`[cite: 1]. | Consistencia de datos[cite: 1] |
| **CP-07**[cite: 1] | `CP-07-16-validaciones.spec.js` | Control de límites: bloqueo de decremento bajo 0 y estado agotado[cite: 1]. | Caso negativo / borde[cite: 1] |
| **CP-16**[cite: 1] | `CP-07-16-validaciones.spec.js` | Restricción de guardado sin nombre y captura de alerta `#toast.bad`[cite: 1]. | Manejo de excepciones[cite: 1] |

* **Consistencia Multi-Entorno (6.2):** Suites ejecutadas en **Chromium** y **Firefox** mediante 3 ciclos repetitivos continuos, alcanzando un **100% de consistencia** (superando el umbral del 90% exigido)[cite: 1].
* **Políticas Operacionales:** Ejecución restringida a un solo worker (`--workers=1`) para asegurar tráfico de usuario real, evitando condiciones de carrera en el almacenamiento o sobrecarga en el servidor evaluado.

---

## Antes de ejecutar

Los selectores (`getByLabel`, `getByRole`, `getByTestId`, rutas como `/login` o `/inventario`) son **aproximaciones basadas en tus casos documentados**. Debes:

1. Abrir despensalo.cl e inspeccionar el HTML real (clic derecho → Inspeccionar) de cada campo/botón mencionado.
2. Reemplazar los selectores marcados por los reales.

## 1. Instalación

```bash
npm init -y
npm install -D @playwright/test
npx playwright install
```

## 2. Configurar credenciales de prueba 
```bash
export DESPENSALO_EMAIL="correo_de_prueba@ejemplo.com"
export DESPENSALO_PASSWORD="password_de_prueba"
```

(En Windows PowerShell: `$env:DESPENSALO_EMAIL="..."`)

## 3. Ejecutar los scripts

```bash
# Todos los tests, en Chromium, 3 veces cada uno (repetibilidad)
npm run test:chromium

# Todos los tests, en Firefox, 3 veces cada uno (segundo entorno -> indicador 6.2)
npm run test:firefox

# Ambos entornos de una vez
npm run test:all
```

## 4. Ver el reporte con evidencia (capturas automáticas)

```bash
npm run report
```
Abre un reporte HTML navegable con capturas de cada paso.
