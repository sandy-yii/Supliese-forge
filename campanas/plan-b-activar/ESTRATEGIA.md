# Plan B mientras no hay acceso de administrador (12 oct 2026)

Basado en las auditorías de septiembre y en lo que la extensión vio el 12 de octubre. Cada prompt revisa los números actuales antes de cambiar algo y pide un SÍ.

| Cuenta | Hoy | Qué se hace | Prompt |
|---|---|---|---|
| Servicio 265-909-2662 | 7 campañas en pausa | Activar las campañas de los grupos Reparación y Mantenimiento ($237/conv, 180 conv) y Servicio Técnico Industrial ($101/conv). No activar Pmax - Local, Refacciones (anuncios rechazados), Display ni Local - Comercial/doméstico. Tope $300/día. | 1-servicio.txt |
| Quick Laundry 256-397-2201 | 2 campañas activas | Reactivar grupos pausados que convertían a $150 o menos (no Girbau ni Competencia). Grupo "Industrial temporal" en Search Marcas con +$150/día mientras CLM y Gamesail están detenidas. | 2-quick-laundry.txt, 4-quick-laundry-industrial.txt |
| Girbau 860-582-6837 | Nerea y Máximo Rendimiento activas | Si Nerea pierde impresiones por presupuesto: Máximo Rendimiento a la mitad y esa cantidad a Nerea. Solo español. Las pausas de palabras de marca en Nerea esperan a que existan las campañas nuevas. | 3-girbau.txt |
| CLM 993-525-8739 | Pausada por Google (verificación) | Que la agencia (dueña) complete la verificación. Al volver: Búsqueda sí; Máximo Rendimiento e Inglés no; Túnel solo con negativas de autolavado. | — |
| Gamesail 645-094-0317 | Pausada por Google (verificación) | Que el cliente (perfil de pagos) complete la verificación. Los datos de septiembre son de la cuenta vieja: antes de activar, leer las 9 campañas. Display, Video y Latam no entran en el plan B. | — |

Páginas de destino: ver la decisión en `campanas/README.md`.
