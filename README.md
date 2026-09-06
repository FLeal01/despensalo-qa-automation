# Automatización QA — despensalo.cl (Evaluación U3) - Fabiola Leal S50

---

## Contenido del Repositorio

* **`tests/`**: Suites de pruebas automatizadas con Playwright (JavaScript)[cite: 2].
  * `CP-02-login.spec.js`: Verificación de autenticación y redirección al panel principal[cite: 1].
  * `CP-03-04-inventario.spec.js`: Alta de productos y modificación acumulativa de stock. Incluye la función parametrizada `agregarProductoSinCodigo` (Criterio 6.1)[cite: 1].
  * `CP-07-16-validaciones.spec.js`: Reglas de negocio (bloqueo de stock negativo bajo 0) y validación reactiva de campos obligatorios en modales[cite: 1].
* **`docs/`**:
  * **Documento_Casos_Prueba_Despensalo.pdf:** Registro formal de casos manuales ejecutados, gestión de defectos (bug tracking con causa raíz y recomendación), sesiones exploratorias y análisis comparativo manual.
  * **Presentacion_Final_Despensalo.pdf:** Versión resumida y visual del informe.
* **`playwright.config.js`**: Configuración multi-entorno (Chromium y Firefox) con captura automática de screenshots, videos y trazas[cite: 1, 2].
* **`test-results/` / `playwright-report/`**: Evidencias gráficas, capturas automáticas y reportes consolidados en HTML[cite: 1, 2].

---

## Trazabilidad de Casos y Cumplimiento de Rúbrica

### 🔗 Matriz de Trazabilidad de Casos y Cumplimiento

| Caso Manual | Script Automatizado | Objetivo / Validación Técnica | Criterio de Evaluación |
| :---: | :--- | :--- | :---: |
| **CP-02** | `CP-02-login.spec.js` | Autenticación válida, ocultamiento de `#authGate` y renderizado de la vista principal. | Flujo con usuario autenticado (5.1)[cite: 1] |
| **CP-03** | `CP-03-04-inventario.spec.js` | Alta manual de producto con stock inicial y actualización del indicador global `#kUnits`. | Automatización parametrizada (6.1)[cite: 1] |
| **CP-04** | `CP-03-04-inventario.spec.js` | Aumento de stock de 5 a 8 unidades y verificación del selector reactivo `.stock-num`. | Consistencia de datos y regresión (6.2)[cite: 1, 2] |
| **CP-07** | `CP-07-16-validaciones.spec.js` | Control de límites: bloqueo de decremento bajo 0 y asignación del estado agotado. | Caso de prueba negativo / de borde (5.1)[cite: 1] |
| **CP-16** | `CP-07-16-validaciones.spec.js` | Restricción de guardado sin nombre obligatorio y captura de la notificación `#toast.bad`. | Validación de formulario y excepciones (5.1)[cite: 1] |

* **Consistencia Multi-Entorno (6.2):** Suites ejecutadas en **Chromium** y **Firefox** mediante 3 ciclos repetitivos continuos, alcanzando un **100% de consistencia** (superando el umbral del 90% exigido).
* **Políticas Operacionales:** Ejecución restringida a un solo worker (`--workers=1`) para asegurar tráfico de usuario real, evitando condiciones de carrera en el almacenamiento o sobrecarga en el servidor evaluado.

---

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
