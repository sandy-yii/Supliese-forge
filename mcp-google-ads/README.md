# Leer Google Ads desde Claude · conector TrueClicks (19 nov 2026)

**Qué es:** un conector que deja que Claude lea directo las 5 cuentas de Google Ads de Supliese (campañas, clics, gasto, conversiones, búsquedas, auditorías) sin que Sandy corra un script y copie el registro.

**Regla (de Sandy): SOLO LEER.** Con el conector nunca se edita, pausa, activa ni mueve nada. Los cambios siguen siendo con script: Vista previa → OK de Sandy → Ejecutar (ver `CLAUDE.md`).

## Lo que quedó funcionando

- Conector **TrueClicks** agregado en claude.ai → Configuración → Conectores → conector personalizado, con la dirección `https://data.trueclicks.com/mcp/`.
- Inicio de sesión en TrueClicks y Google Ads con **gamesailmx@gmail.com**.
- No pide token de desarrollador, proyecto de Google Cloud ni instalar nada. Funciona en las sesiones en la nube de Claude Code.
- El propio conector se declara de solo lectura. Sus herramientas (revisadas el 19 nov 2026) solo consultan: lista de cuentas, consultas GAQL (`google_ads_execute_report`), auditorías, alertas, metas de ritmo y tareas. Ninguna cambia campañas, presupuestos ni pujas.

## Cuentas que ve (prueba del 19 nov 2026, datos del 18 nov)

| Cuenta en Google Ads | Número | Id en TrueClicks | Leyó |
|---|---|---|---|
| Supliese Gomez (Quick Laundry) | 256-397-2201 | 221454 | Sí |
| Gamesail nueva | 118-347-6484 | 221457 | Sí |
| CLM Equipos de Lavado (Kingstar/CLM) | 993-525-8739 | 221455 | Sí |
| Servicio para Lavanderia (Laundry Solutions) | 265-909-2662 | 221453 | Sí |
| Girbau | 860-582-6837 | 221456 | Sí |

Las herramientas piden el **Id de TrueClicks**, no el número de Google Ads.

Consulta de prueba: reporte `customer`, campos `metrics.clicks`, `metrics.cost_micros` (gasto × 1,000,000) y `metrics.conversions`, con fecha de inicio y fin el mismo día.

## Lo que no se usó: el conector oficial de Google (`googleads/google-ads-mcp`)

Queda como plan B. Lo que se verificó en su código (17 nov 2026), por si algún día se instala:
- `tools_config.yaml` lleva todo debajo de `namespaces:`. Sin esa clave **prende todas las herramientas, también las que escriben**. El de esta carpeta ya está corregido y deja solo lectura.
- El token de desarrollador va en la variable `GOOGLE_ADS_DEVELOPER_TOKEN`, aunque su README no lo menciona. La cuenta de administrador va en `GOOGLE_ADS_LOGIN_CUSTOMER_ID`.
- Necesita Python 3.11+, pipx, gcloud, proyecto de Google Cloud con la Google Ads API, cliente OAuth de escritorio y token de desarrollador con nivel que lea cuentas reales.
- Ejemplo de configuración, sin datos reales: `mcp.ejemplo.json`.

## Seguridad

- Ningún token, archivo de credenciales ni contraseña se sube a este repositorio ni se pega en el chat.
- Los datos de las cuentas pasan por TrueClicks, una empresa externa. Para quitarle el acceso: claude.ai → Configuración → Conectores, y en la cuenta de Google de gamesailmx → Seguridad → Apps con acceso.
