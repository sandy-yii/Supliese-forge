# Caso de referencia: grupo Supliese (2026)

Son cinco cuentas de un grupo de distribuidores de equipo de lavandería industrial en México:

- Gamesail (equipo industrial)
- Supliese Gómez (montar y operar lavanderías)
- CLM (equipo de alta capacidad)
- Servicio para Lavandería (reparación y refacciones)
- Girbau (una marca)

La agencia anterior dejó las cuentas y se hizo una auditoría para reestructurarlas. Sirve como ejemplo de qué buscar y de qué tamaño suelen ser los hallazgos.

## Lo que encontró la auditoría

| Hallazgo | Evidencia |
|---|---|
| La conversión principal era abrir el chat | 2,152 "conversiones" en 9 meses; el costo real por prospecto calificado del grupo era $1,062.80, contra $79.53 reportado |
| Una keyword amplia se llevaba la mitad del dinero | «lavadoras industriales precio», en amplia: 53% del gasto de Gamesail ($90,121) |
| El dinero estaba repartido al revés | En Supliese, Emprendimiento (CPA $68) se llevaba 44%; Equipo (CPA $44) recibía 31% y perdía hasta 30% de impresiones por presupuesto |
| Las cuentas competían entre sí | Gamesail y Supliese compartían 1,579 términos idénticos, ~80% del gasto visible de cada una |
| La marca propia se pagaba en la cuenta equivocada | La búsqueda «supliese» la pagaba Gamesail |
| El CPA se disparó | CLM: de $100 en mayo a $351 en julio. Servicio: ×4.7 entre marzo y julio |
| Máximo Rendimiento consumía sin producir | Girbau: 3 conversiones a $985 cada una, contra 55 a $331 en Búsqueda; el CTR de la cuenta bajó de 12.5% a 5.6% |
| Hubo meses sin gestión | Gamesail: marzo y abril sin ningún cambio |
| Había anuncios rechazados por meses | Servicio: la campaña de refacciones tenía todos sus anuncios rechazados |
| La estructura estaba inflada | Servicio: 11 de 17 grupos nunca recibieron una impresión |

## Lo que la primera auditoría no revisó

Por eso esta skill lo incluye:

- **Negativas existentes.** Se propusieron negativas sin ver las que ya había. Ahora se extraen en las pestañas 06–08 del script y el analizador omite los términos ya bloqueados.
- **Configuración de segmentación.** Presencia o interés, socios de búsqueda, Display dentro de Búsqueda, dispositivos, horarios: ninguna se revisó. Ahora están en las pestañas 02 y 11–14.
- **Estado de políticas de todos los anuncios.** Los rechazos se encontraron caso por caso, no de forma sistemática. Ahora están en la pestaña 09.
- **Páginas de destino y llamadas.** Ahora están en las pestañas 10 y 17.
- **Cobertura del informe de términos.** Los porcentajes de canibalización se calcularon sobre el gasto visible (~60% del total) sin decirlo. Ahora el informe muestra la columna "Términos visibles".
- **Canibalización solo entre dos cuentas.** Ahora se calcula para todos los pares.
- **Explicación técnica de la canibalización.** "Se suben el precio" es cierto solo si Google las trata como anunciantes distintos. Si las trata como el mismo negocio, aplica la política de ventaja injusta: un solo anuncio por subasta.
- **Muestras chicas.** Algunas líneas se decidieron con CPA de menos de 5 conversiones. Ahora se marcan con ⚠.
- **Información de subastas.** No se usó. Es la prueba más visual de que las cuentas hermanas compiten entre sí.
- **El hueco de WhatsApp en la medición.** Ahora está documentado en `medicion-highlevel.md`.
