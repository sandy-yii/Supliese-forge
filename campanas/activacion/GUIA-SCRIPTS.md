# Activar las cinco cuentas con scripts

Cada cuenta tiene tres scripts en `campanas/salida/<cuenta>/`. Se corren **dentro de la cuenta**, en este orden, y cada uno primero con **Vista previa** (no cambia nada) y después con **Ejecutar**:

| # | Script | Qué hace |
|---|---|---|
| 1 | `crear-campanas.js` | Crea las campañas nuevas «AB ·» **en pausa**, con grupos, palabras clave, anuncios, negativas, ubicación (México) e idioma (español), más la lista «AB · Negativas de la cuenta». |
| 2 | `conversiones.js` | Crea las conversiones de la página (formulario, WhatsApp, teléfono, correo) y «Llamadas desde anuncios» si no existe. Activa el etiquetado automático. Al ejecutarlo, deja en el registro las **variables para Rodolfo**. |
| 3 | `activar.js` | Enciende las campañas nuevas con su presupuesto, les corrige la página si se crearon con una anterior, y hace los cambios del plan en las campañas anteriores (ver la tabla de abajo). |

Si después cambia la página de una cuenta, `cambiar-pagina.js` cambia la URL de los anuncios de todas las campañas (un solo sitio por grupo) y deja en el registro si Google aprobó o rechazó cada anuncio y por qué.

Ningún script borra nada. Si un script encuentra un error, no hace ningún cambio y explica por qué en el registro.

## Antes de empezar

- [ ] **Entrar con tu propio usuario administrador**, con tu verificación en 2 pasos funcionando. Si Google pide la llave de acceso y no la tienes, no se puede autorizar el script.
- [ ] **Forma de pago vigente** en la cuenta (Facturación, sin avisos).
- [ ] **La página de destino carga bien** en celular, con el formulario y el botón de WhatsApp funcionando.
- [ ] **CLM:** la verificación del anunciante dice «Verificado». Si no, se puede correr todo, pero la cuenta sigue sin mostrar anuncios hasta que Google apruebe.
- [ ] **Gamesail:** la cuenta nueva ya existe (ver más abajo) y tienes su número.

## Cómo correr cada script

1. En Google Ads, abre la cuenta (revisa el número arriba a la derecha).
2. **Herramientas → Acciones masivas → Secuencias de comandos → +**.
3. Ponle nombre, por ejemplo «AB · 1 Crear», «AB · 2 Conversiones», «AB · 3 Activar».
4. Borra lo que trae el editor y pega el archivo **completo**.
5. **Autorizar** con tu usuario.
6. **Vista previa** → abre **Registros**:
   - Si termina en «VISTA PREVIA SIN ERRORES», revisa la lista de cambios y da **Ejecutar**.
   - Si dice cualquier error, **no ejecutes**: copia el registro y mándalo.

## Lo que hace «activar.js» en cada cuenta

| Cuenta | Página | Campañas anteriores | Presupuesto diario de las nuevas | Además |
|---|---|---|---|---|
| **Girbau** 860-582-6837 | girbaupro.com | Se **pausan** todas (las armó la agencia anterior) | **Completo: $217** | — |
| **Quick Laundry** 256-397-2201 | www.supliese.com | Las activas bajan a la **mitad** | Arranque: $198 (completo: $396) | Pausa palabras de «franquicia» y «cuánto cuesta poner una lavandería» y el grupo o campaña de Competencia. Cambia sus anuncios a la página nueva y les aplica «PB · Negativas basura». |
| **CLM** 993-525-8739 | kingstar.com.mx | Las activas bajan a la **mitad** | Arranque: $307 (completo: $616) | Pausa la campaña o grupo de Competencia. Cambia sus anuncios a la página nueva y aplica «PB · Negativas basura». |
| **Servicio** 265-909-2662 | laundrysolutions.store | Están todas en pausa; se quedan así | **Completo: $269** | — |
| **Gamesail** (cuenta nueva) | gamesail-lavadoras.vercel.app | No hay | **Completo: $648** | — |

Regla de presupuesto: si las campañas anteriores siguen activas, las nuevas arrancan con la mitad y las anteriores se quedan con la otra mitad; si no hay campañas anteriores activas, las nuevas arrancan con su presupuesto completo. En 2 a 4 semanas, si las nuevas sostienen los clientes, se pausan las anteriores y las nuevas pasan a completo.

Google exige un solo sitio web por grupo de anuncios («Un sitio web por cada grupo de anuncios»). Para Google, los anuncios pausados también cuentan. Por eso los anuncios anteriores no se copian: se les cambia la página (los adaptables de búsqueda) o se quitan (los de otro tipo, que ya no se pueden editar). La vista previa lista exactamente cuáles antes de ejecutar. Google los vuelve a revisar en unas horas.

## Gamesail: abrir la cuenta nueva

1. En ads.google.com, con el correo de la empresa: **Nueva cuenta de Google Ads → Cambiar al modo experto → Crear una cuenta sin campaña**.
2. País: México · Zona horaria: Ciudad de México · Moneda: **MXN** (no se puede cambiar después).
3. Facturación a nombre de la empresa.
4. Completar la **verificación del anunciante** como organización, con la Constancia de Situación Fiscal, el acta y la identificación del representante.
5. Copiar el número de la cuenta nueva. En **cada uno** de los tres scripts de Gamesail, pegarlo arriba en `var CUENTA_NUEVA = '';` (por ejemplo `var CUENTA_NUEVA = '123-456-7890';`). Los scripts se niegan a correr en la cuenta anterior 645-094-0317.

## Después de ejecutar

- [ ] **Pasar a Rodolfo** las variables que dejó «conversiones.js» en el registro (`NEXT_PUBLIC_GADS_ID` y las etiquetas), para cada sitio. La guía de instalación es `medicion/nextjs/Guia-medicion-landings.md`.
- [ ] **A las 24 horas:** anuncios aprobados, campañas con impresiones y gasto, y las conversiones nuevas pasando de «Sin verificar» a «Registrando conversiones» (después de que Rodolfo instale el código).
- [ ] **Primera semana:** ajustar los topes de CPC con el CPC real. Correr los prompts de `campanas/mantenimiento/` para las negativas.

## Lo que los scripts no hacen (queda a mano)

- **Google Analytics 4:** crear una propiedad por sitio y pasarle a Rodolfo el ID `G-…`.
- **Pasar a Secundaria** las conversiones que no son clientes (por ejemplo «GA4 (web) Coudibot» en Servicio). «conversiones.js» las señala en el registro, pero no las cambia.
- **Enlaces de sitio y otros recursos** con páginas viejas, y anuncios que no son adaptables de búsqueda: «activar.js» los avisa en el registro.
- **Máximo Rendimiento u otras campañas que no son de Búsqueda** que sigan activas: revisar su página a mano.
- **Fecha de inicio:** si alguna campaña nueva se creó a mano con la extensión (fecha 2026-12-31), cambiarla a hoy.

## Si algo falla

| Mensaje | Qué significa |
|---|---|
| «Ya existen: campaña «AB · …»» | Las campañas ya se crearon antes. Salta al paso 2. |
| «Faltan campañas nuevas» | Falta correr «crear-campanas.js», o alguna campaña nueva se borró o se renombró. |
| «Este script es para la cuenta …» | Estás en otra cuenta. Cambia de cuenta arriba a la derecha. |
| «Es una cuenta nueva: pega su número…» | Solo Gamesail: falta poner el número en `CUENTA_NUEVA`. |
| "AVISO: Google no acepta la palabra clave…" | Google rechaza esa palabra por sus políticas. El script la omite y crea todo lo demás; se puede ejecutar. |
| Cualquier otro error | No ejecutes. Copia el registro completo y mándalo. |
