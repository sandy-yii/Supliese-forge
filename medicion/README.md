# Medición de las páginas

Las cinco páginas nuevas (de Rodolfo, en Next.js) no tienen la etiqueta de Google: por eso hay 0 conversiones desde el 20–21 oct y las conversiones viejas dejaron de registrar el 25 oct. Las acciones «AB · Formulario enviado» y «AB · Clic en WhatsApp» ya existen en cada cuenta; falta que la página les avise.

| Archivo | Para qué |
|---|---|
| `mensaje-para-rodolfo.md` | El mensaje para pedirle que instale la medición |
| `nextjs/Guia-medicion-landings.md` | La guía con el código, para adjuntarla al mensaje |
| `verificacion-por-pagina.md` | Cómo comprobar, página por página, que ya cuenta |
| `../campanas/salida/datos-medicion-todas-las-cuentas.js` | Script de solo lectura que saca los datos para Rodolfo |

## Paso 1 · Sacar los datos de cada cuenta

Rodolfo necesita, por cada página, un ID (`AW-…`) y una etiqueta por conversión. Se sacan con un script que **solo lee** y no cambia nada:

1. Entra a la cuenta (una a la vez): **Herramientas › Acciones masivas › Secuencias de comandos › "+"**.
2. Pega completo `campanas/salida/datos-medicion-todas-las-cuentas.js`. Sirve para las cinco cuentas: reconoce sola en cuál está. En Gamesail, primero pon su número en `CUENTA_NUEVA`, arriba del script.
3. **Autorizar › Vista previa.** No hace falta Ejecutar.
4. En el registro, copia el bloque **«PARA LA PÁGINA … (copiar tal cual)»**. Se ve así:

   ```
   NEXT_PUBLIC_GADS_ID=AW-123456789
   NEXT_PUBLIC_GADS_LABEL_FORMULARIO=AbC-D_efG-h12
   NEXT_PUBLIC_GADS_LABEL_WHATSAPP=…
   NEXT_PUBLIC_GADS_LABEL_LLAMADA=…
   NEXT_PUBLIC_GADS_LABEL_CORREO=…
   ```

5. Mándaselo a Rodolfo diciendo de qué página es. Cada página lleva los suyos: no se mezclan.
6. Guarda también el registro completo: trae las conversiones de los últimos 30 días, los ajustes de la cuenta y el estado del botón de llamada.

Si el script dice «NO ENCONTRADO», se puede sacar a mano: **Objetivos › Conversiones › Resumen › «AB · Formulario enviado» › Configurar etiqueta › Usar Google tag**. Sale una línea como `'send_to': 'AW-123456789/AbC-D_efG-h12'`: lo de antes de la diagonal es el ID, lo de después es la etiqueta. Se repite con «AB · Clic en WhatsApp», etc.

`NEXT_PUBLIC_GA4_ID` no sale de Google Ads: es el ID `G-…` de Google Analytics. Si la página todavía no tiene propiedad, se deja vacío y se instala igual.

## Paso 2 · Mandar el mensaje

`mensaje-para-rodolfo.md` con la guía adjunta y los datos de cada página.

## Paso 3 · Verificar

`verificacion-por-pagina.md`, cuando Rodolfo avise que publicó cada página.

## Lo que queda pendiente de tu OK

El script no cambia nada. Si el registro muestra algo de esto, se arregla a mano solo con tu OK, cuenta por cuenta:

- **Etiquetado automático: NO** → Administrador › Configuración de la cuenta › Etiquetado automático.
- **Informes de llamadas: NO** → Administrador › Configuración de la cuenta › Informes de llamadas.
- Una acción vieja (chat Coudibot, etc.) que sigue como **Principal** → conviene pasarla a Secundaria para que Google no aprenda de aperturas de chat.
