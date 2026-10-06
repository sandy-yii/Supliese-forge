# Checklist de auditoría

El orden importa: cada bloque se apoya en el anterior. En cada punto se indica qué mirar, de dónde sale el dato y por qué importa. "Script" se refiere a la pestaña del script de extracción; "UI", a la exportación de la interfaz.

## Contenido

1. [Medición](#1-medición)
2. [Gestión e historial](#2-gestión-e-historial)
3. [Estructura y presupuesto](#3-estructura-y-presupuesto)
4. [Palabras clave y concordancias](#4-palabras-clave-y-concordancias)
5. [Términos de búsqueda y negativas](#5-términos-de-búsqueda-y-negativas)
6. [Marca propia y competencia](#6-marca-propia-y-competencia)
7. [Varias cuentas: canibalización y territorio](#7-varias-cuentas-canibalización-y-territorio)
8. [Segmentación: zona, horario, dispositivo, redes](#8-segmentación-zona-horario-dispositivo-redes)
9. [Anuncios, políticas y páginas de destino](#9-anuncios-políticas-y-páginas-de-destino)
10. [Llamadas](#10-llamadas)
11. [Lo que no se puede ver en los datos](#11-lo-que-no-se-puede-ver-en-los-datos)

---

## 1. Medición

Es lo primero porque las pujas automáticas aprenden de la conversión principal. Si la conversión es "abrió el chat", Google aprende a traer gente que abre chats.

- **Conversiones principales** (script `15 Config conversiones`, o UI en Objetivos > Conversiones). ¿Hay clics en WhatsApp, aperturas de chat, vistas de página o clics en el teléfono marcados como *principales*? El analizador los marca como "señal débil".
- **Mezcla real** (script `16 Conversiones por accion`). ¿Qué porcentaje de las conversiones de cada mes son señales débiles? Ese número es el hallazgo, más que la configuración en sí.
- **Recuento.** Para prospectos, lo normal es *una por clic*. *Cada una* infla el número cuando la misma persona abre el chat tres veces.
- **Ventana y atribución.** Una ventana de clic muy corta en ventas de ciclo largo pierde conversiones.
- **Evolución del CPA mes a mes** (campañas mensuales). Si subió mucho sin cambio de mercado (en el caso Supliese, ×3.5 y ×4.7 en dos meses), la causa suele ser que la puja aprendió de la señal equivocada.
- **Costo real por cliente.** Si hay CRM, pide los prospectos calificados o las ventas del periodo y calcula el costo por cada uno. Pon lado a lado el CPA del reporte y el real; la diferencia suele ser el argumento más fuerte de la auditoría.
- **Volumen para puja automática.** Con menos de unas 30 conversiones reales al mes por campaña, la puja por conversiones no tiene datos suficientes. Recomienda maximizar clics con tope de CPC hasta llegar ahí.

**Cómo reportarlo:** "El X% de las conversiones son aperturas de chat. El reporte dice $A por conversión; por prospecto calificado son $B." Avisa que **al corregir la medición el número de conversiones va a bajar**, para que el cliente no lo lea como un empeoramiento.

## 2. Gestión e historial

Sale del historial de cambios: UI para periodos largos, script para los últimos 30 días.

- **Meses sin ningún cambio.** Significan una cuenta sin gestión. El analizador los lista.
- **Quién cambiaba.** La agencia, el cliente o personas sin identificar.
- **Pausas y activaciones recientes,** sobre todo al terminar con una agencia: ¿quién pausó qué y cuándo?
- **Campañas y anuncios rechazados durante meses sin corregir.** Un rechazo casi siempre se corrige en una tarde; que dure meses es un pendiente de gestión.

## 3. Estructura y presupuesto

Sale de las campañas (mensual, con cuotas de impresión) y de los presupuestos.

- **El dinero repartido al revés.** Pasa cuando la campaña con peor CPA se lleva más porcentaje del gasto que de las conversiones. El analizador lo marca como "absorbe gasto con CPA alto".
- **Campañas eficientes topadas.** Tienen buen CPA y más de 20% de impresiones perdidas por presupuesto. Son la oportunidad más barata: mover dinero ahí no requiere aprender nada nuevo.
- **Pérdida por ranking alta** (más de 50%). El problema es la calidad o la puja, no el dinero. Subir presupuesto no lo arregla.
- **Máximo Rendimiento (PMax) junto a Búsqueda.** Compara su CPA y su porcentaje del gasto, y revisa si el CTR de la cuenta cayó cuando PMax entró. PMax puede quedarse con búsquedas de marca o genéricas que Búsqueda ya cubría.
- **Estructura inflada.** Muchos grupos que nunca reciben impresiones, o todo el dinero pasando por un solo grupo.
- **Presupuestos compartidos** que esconden qué campaña se come el dinero.

## 4. Palabras clave y concordancias

Sale de las palabras clave.

- **Gasto por concordancia** y su CPA. Una keyword amplia que concentra más de la mitad del gasto es la señal más común de control perdido.
- **Concentración.** El porcentaje del gasto en la primera keyword y en las cinco primeras.
- **Pausadas con gasto en el periodo.** Las pausaron a medio periodo: ¿por qué? A veces eran las buenas.
- **No aptas, limitadas o rechazadas:** cuántas son y por qué.
- **Nivel de calidad** medio, y las keywords con 5 o menos que tienen gasto relevante.

## 5. Términos de búsqueda y negativas

Sale de los términos de búsqueda y de las negativas existentes (script `06`–`08`).

- **Gasto sin ninguna conversión** (total y porcentaje).
- **Desperdicio claro:** términos que ya gastaron al menos un CPA promedio sin convertir. Los excluye el analizador si ya son keyword o ya están bloqueados. **Revisa la intención antes de proponerlos como negativa.**
- **Patrones de negativas** por categoría, con su costo: doméstico, usado o renta, empleo o cursos, información, otras marcas, servicio en lugar de venta.
- **Keywords candidatas:** términos que convierten a CPA igual o mejor que la cuenta y no están dados de alta. Se proponen en exacta o frase con la etiqueta *Plan*.
- **Duplicados internos:** el mismo término entrando por varios grupos o campañas de la misma cuenta. Hace que la cuenta compita consigo misma y ensucia los datos de cada grupo.
- **Recuerda al proponer negativas:** las negativas **no** cubren sinónimos ni plurales. "usada" no bloquea "usadas" ni "seminueva". Propón las variantes.

## 6. Marca propia y competencia

- **Marca propia:** cuánto cuesta y **en qué cuenta se paga**. En el caso Supliese, la marca de una cuenta la pagaba otra.
- **Competencia:** separa *marca sola*, *marca + producto*, *marca + lugar o contacto*. La última suele ser gente que busca a la competencia (su teléfono o su sucursal), no un proveedor. Casi siempre es la más cara y va a negativas.
- **Decide marca por marca, con su CPA real.** Algunas se mantienen, otras se recortan, otras salen.
- **El nombre de un competidor puede ser keyword, pero no puede ir en el texto del anuncio.** Para usar una marca de terceros en el texto (por ejemplo, la de un fabricante del que son distribuidores), puede hacer falta una autorización del dueño de la marca.

## 7. Varias cuentas: canibalización y territorio

Sale de la tabla de canibalización y de `canibalizacion_cuentas.csv`.

- **Cuántos términos comparten** cada par de cuentas y qué porcentaje del gasto visible de cada una representan.
- **Los términos compartidos de más gasto:** ¿a qué cuenta le corresponde cada intención?
- **La marca de una cuenta pagada por otra.**
- **Busca a las cuentas hermanas en Subastas** (UI: Información de subastas). Si aparecen como competidores entre sí, es la prueba visible para el cliente.
- **Propón un reparto por intención** (por ejemplo: equipo industrial / montar un negocio / servicio y refacciones / una marca específica) y deja abiertos los cruces que dependen de decisiones comerciales, como zona o capacidad.

## 8. Segmentación: zona, horario, dispositivo, redes

Sale del script: `02`, `11`–`14`.

- **Presencia o interés.** Con "personas en tu zona o interesadas en ella", se paga por gente que no está en la zona. Compara el CPA de `AREA_OF_INTEREST` contra `LOCATION_OF_PRESENCE`. En negocios locales o con cobertura limitada, casi siempre conviene "presencia".
- **Socios de búsqueda y Display dentro de una campaña de Búsqueda.** Revisa su CPA aparte; suelen traer clics baratos de baja intención.
- **Dispositivos:** CPA por dispositivo. Una diferencia grande sugiere un problema en la página móvil o en el formulario.
- **Días y horas:** horas con gasto y cero conversiones. Cruza con el horario en que alguien contesta: un prospecto que llama a las 11 p.m. y nadie atiende se pierde.

## 9. Anuncios, políticas y páginas de destino

Sale del script: `09` y `10`.

- **Rechazados y limitados.** Los temas más frecuentes son marcas registradas en el texto, promesas de ingresos o rendimiento, y afirmaciones engañosas. Una campaña con todos sus anuncios rechazados no gasta, pero sí parece activa.
- **Fuerza del anuncio baja.**
- **Páginas de destino:** CPA por URL, puntuación de velocidad móvil y porcentaje de clics en páginas aptas para móvil. Revisa también que los parámetros de la URL (`gclid`) no se pierdan en redirecciones; ver `medicion-highlevel.md`.

## 10. Llamadas

Sale del script `17` o de UI: Informes > Llamadas.

- **Cuántas llamadas hubo, cuántas de 60 s o más y cuántas perdidas.**
- **¿La llamada cuenta como conversión, y con qué duración mínima?** En negocios de servicio, la llamada suele ser la conversión principal.
- **No contar doble.** Si las llamadas se miden con el número de desvío de Google y también con un número de seguimiento del CRM, solo uno debe ser la conversión principal.

## 11. Lo que no se puede ver en los datos

Anótalo como pendiente y pregúntalo al cliente:

- Qué se vende de verdad: modelos, capacidades, existencias de refacciones.
- La cobertura geográfica real y los tiempos de respuesta.
- El margen por línea. Un CPA alto puede valer la pena en un producto de ticket alto (por ejemplo, el túnel de lavado).
- Las relaciones comerciales: marcas que no quieren tocar, si son distribuidores autorizados.
- Lo que pasa después del clic, si no hay CRM conectado.
