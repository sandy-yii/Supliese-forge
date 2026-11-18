# MCP de Google Ads · plan de instalación (rama `claude/mcp-google-ads`, 18 nov 2026)

**Qué es:** un «conector» que deja que Claude lea directo las cuentas de Google Ads (campañas, clics, gasto, búsquedas, rechazos) sin que Sandy tenga que correr un script y copiar el registro.

**Cuál:** el oficial de Google, `googleads/google-ads-mcp` (GitHub).

## Lo que puede y no puede hacer

| Puede | Cómo lo dejamos |
|---|---|
| Consultar cualquier dato con GAQL (`search`), ver campos, listar cuentas | **Prendido** |
| Crear recursos (textos, imágenes, enlaces, fragmentos) | **Apagado** en `tools_config.yaml` |
| Crear y poner etiquetas | **Apagado** en `tools_config.yaml` |

Así queda **solo lectura**. Los cambios en las cuentas se siguen haciendo con script (Vista previa → OK de Sandy → Ejecutar), como dice `CLAUDE.md`. Aunque el servidor tiene un paso de «proponer y confirmar» para cambios, no se usa.

## Qué se necesita (todo con **gamesailmx@gmail.com**, nunca con cuentas personales)

1. **Proyecto de Google Cloud** con la **Google Ads API** habilitada.
2. **Cliente OAuth** de tipo «Escritorio» en ese proyecto (se descarga un JSON).
3. **Token de desarrollador de Google Ads** (cuenta de administrador → Administración → Centro de API). El README del MCP no lo menciona, pero la Google Ads API siempre lo pide: lo confirmamos al instalar. Con nivel de prueba solo funciona con cuentas de prueba; hace falta un nivel que permita cuentas reales.
4. **Iniciar sesión** con gcloud:
   `gcloud auth application-default login --scopes=https://www.googleapis.com/auth/adwords,https://www.googleapis.com/auth/cloud-platform --client-id-file=ARCHIVO_DEL_CLIENTE.json`
   Eso guarda un archivo de credenciales; su ruta va en `GOOGLE_APPLICATION_CREDENTIALS`.
5. **Python 3.11+ y pipx** en la computadora donde corra.
6. **Número de la cuenta de administrador** (MCC) en `GOOGLE_ADS_LOGIN_CUSTOMER_ID`, para ver las 5 cuentas.

La configuración de ejemplo está en `mcp.ejemplo.json` (sin ningún dato real).

## Dónde instalarlo (decisión pendiente)

| Opción | A favor | En contra |
|---|---|---|
| **A. En la computadora de Sandy** (Claude Code o la app de escritorio) — *recomendada* | El inicio de sesión de Google se queda en su máquina; se hace una vez | Hay que instalar Python, pipx y gcloud una vez |
| B. En las sesiones en la nube como esta | No instala nada en su compu | El archivo de credenciales tendría que guardarse como secreto del entorno; las sesiones se borran y el acceso de Google caduca cada hora, así que es más frágil |

## Seguridad

- El archivo de credenciales y el token de desarrollador **nunca** se suben a este repositorio ni se pegan en el chat.
- Quien tenga el MCP conectado puede **leer** los datos de las 5 cuentas.
- `tools_config.yaml` se revisa antes de cada actualización del MCP, por si Google agrega herramientas nuevas que cambien cuentas.

## Pasos siguientes

1. Sandy decide dónde se instala (A o B).
2. Revisar en el Centro de API de la cuenta de administrador si ya hay token de desarrollador y su nivel.
3. Crear o reutilizar el proyecto de Google Cloud con gamesailmx (puede servir el de Analytics, si existe).
4. Instalar y probar con una consulta de solo lectura, por ejemplo los clics de ayer de las 5 cuentas.
