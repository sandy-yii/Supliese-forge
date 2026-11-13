# Supliese-forge

- **Cómo se crean las campañas depende del acceso.** En las cuentas donde la usuaria ya es administradora con su propio usuario (Girbau desde el 20 oct 2026; Gamesail, cuenta nueva 118-347-6484, desde el 26 oct), se usa el script `campanas/salida/<cuenta>/crear-campanas.js` (Vista previa y luego Ejecutar). En las demás, se hacen a mano con la extensión Claude in Chrome usando los prompts por partes de `campanas/salida/<cuenta>/prompt-extension/`, sin script, Google Ads Editor ni cargas masivas. Todo se genera con `python3 campanas/generar.py`.
- Nada se activa, pausa ni edita en las cuentas sin el OK explícito de la usuaria, cuenta por cuenta.
- En los prompts de la extensión se usa **solo la cuenta de Google gamesailmx@gmail.com**. Nunca las cuentas personales de la usuaria (ni para Ads, Analytics, Search Console, soporte, apelaciones o formularios). Todo correo de contacto que se escriba en un formulario o apelación es gamesailmx@gmail.com. Si un paso abre otra cuenta o trae otro correo ya escrito, la extensión se detiene y avisa.
- **Script primero.** Todo lo que se pueda hacer con un script de Google Ads (leer, cambiar URL, presupuestos, negativas, grupos de recursos, etc.) se entrega como script (Vista previa y luego Ejecutar con OK). La extensión solo para lo que forzosamente es a mano (apelaciones, formularios de soporte, Analytics, ajustes que la API no permite).

## Regla de oro: que nunca dejen de llegar leads
Toda estrategia, script o cambio se diseña para que **ningún lead se frene**. Antes de proponer algo, revisar:
- **Agregar antes que quitar.** Anuncios, extensiones, palabras o páginas nuevas se suman; lo viejo que trae se queda encendido hasta que lo nuevo demuestre que funciona.
- **Nunca pausar ni apagar** una campaña, grupo, palabra o anuncio que trajo contactos en Google **o en Resend** (Google solo ve ~1 de cada 3 por las cookies).
- **Cambios chicos:** presupuesto o puja ±20% como máximo por corrida, un cambio por cuenta al día, y nunca dos cosas a la vez en la misma campaña.
- **No reiniciar el aprendizaje de Google:** no cambiar estrategia de puja ni metas de conversión en campañas que traen, salvo con OK explícito y explicando el riesgo.
- **No editar anuncios que ya salen** (al editarlos vuelven a revisión): se crea uno nuevo al lado.
- **Siempre con red:** Vista previa, OK de Sandy, y un script o paso para deshacerlo el mismo día.
- **Se mide contra el promedio de la marca, no contra un solo día,** al día siguiente del cambio.
- Si una opción tiene riesgo de bajar leads, se dice claro y se ofrece la versión más segura.

## Tablero de Supliese (fuente única)
- Al empezar: `bash sup hoy` y lee TABLERO.md. Lo que dice gana sobre notas viejas de este repositorio.
- Al terminar: por cada tarea mía que cambió, `bash sup cierre C108 hecha "qué quedó y dónde se comprueba"`; lo demás, `bash sup cierre "nota"`.
- Nunca montos de dinero, llaves ni contraseñas en las notas. TABLERO.md no se sube a git.
