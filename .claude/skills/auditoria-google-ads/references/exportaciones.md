# Cómo conseguir los datos

## Opción A: exportaciones de la interfaz de Google Ads

Para cada cuenta, en el periodo acordado, **Descargar > CSV**. Guarda una carpeta por cuenta, con el nombre de la cuenta: el analizador usa ese nombre.

| Informe | Dónde | Notas |
|---|---|---|
| Términos de búsqueda | Campañas > Estadísticas e informes > Términos de búsqueda | Incluir la columna "Añadido/excluido" |
| Palabras clave de búsqueda | Campañas > Audiencias, palabras clave y contenido > Palabras clave de búsqueda | Incluir el nivel de calidad y el estado |
| Campañas, **segmentado por mes** | Campañas > Campañas > Segmento > Tiempo > Mes | Agregar las columnas de cuota de impresiones y de pérdida por presupuesto y por ranking |
| Grupos de anuncios, por mes | Campañas > Grupos de anuncios | Opcional |
| Historial de cambios | Herramientas > Historial de cambios | La interfaz da hasta 2 años; la API, solo 30 días |
| Acciones de conversión | Objetivos > Conversiones > Resumen | Puede ser una captura si no se puede exportar: hace falta ver cuáles son *principales* |
| Información de subastas | Campañas > Estadísticas e informes > Información de subastas | Sirve para mostrar que las cuentas hermanas compiten entre sí |
| Palabras clave negativas y listas | Herramientas > Biblioteca compartida > Listas de exclusión | Evita proponer negativas que ya existen |

**Formato:** los CSV en español traen dos líneas de título antes del encabezado, separador decimal con coma, miles con punto y filas de "Total". El analizador maneja todo eso; no hay que limpiarlos a mano.

## Opción B: script de extracción (recomendado si hay MCC)

`assets/extraccion-google-ads.js` vuelca 19 informes de todas las cuentas a una hoja de Google, con una columna "Cuenta". Solo hace consultas: no cambia nada en las cuentas.

1. Crea una hoja de Google vacía y copia su URL.
2. En Google Ads (de preferencia en el MCC): Herramientas > Acciones masivas > Scripts > "+". Pega el script.
3. Edita al inicio:
   - `HOJA`: la URL de la hoja.
   - `DESDE` y `HASTA`: el periodo.
   - `CUENTAS`: los IDs sin guiones; vacío = todas las del MCC.
4. **Autorizar.** Google pide acceso a la cuenta y a Sheets; es lo esperado.
5. **Vista previa no basta:** hay que dar **Ejecutar**. Revisa el registro: cada informe dice cuántas filas trajo o el error.
6. **Descarga cada pestaña como CSV** (Archivo > Descargar > CSV) a una misma carpeta y pásala al analizador.

**Si un informe da error,** los demás siguen corriendo. Los errores comunes son:

- *Llamadas:* la cuenta no tiene informes de llamadas activados.
- *Un campo no existe:* Google renombra campos entre versiones de la API. Quítalo de la lista `campos` y vuelve a correr.
- *Tiempo agotado* en cuentas grandes: baja el `LIMIT` de términos o acorta el periodo.

El historial del script cubre solo 30 días. Para meses atrás, usa la exportación de la interfaz.

## Opción C: navegar con la extensión de Chrome (solo lectura)

Sirve cuando la persona no puede o no quiere descargar a mano. El encargo debe incluir, textual:

> No modifiques, pauses, actives ni edites absolutamente nada dentro de las cuentas. Solo navegar, configurar vistas, descargar y capturar. Si algo te pide confirmar un cambio, detente y pregúntame.

**Cómo trabajar así:**

- Configura las columnas y el periodo.
- Descarga los informes de la tabla de la Opción A y toma capturas de lo que no se exporta (acciones de conversión principales, estado de políticas).
- Abre una pestaña nueva; no reutilices pestañas del usuario.

## Qué pedir además al cliente

- Los prospectos o ventas por mes del CRM, para calcular el costo real por cliente.
- La lista de lo que venden y lo que no: modelos, marcas, capacidades, servicio, refacciones.
- Zonas de cobertura y horario de atención.
- Si hubo agencia anterior: desde cuándo y hasta cuándo, para leer el historial con contexto.
