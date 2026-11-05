# Propuesta de reparto · junta del 5 nov 2026 (interno)

El total del grupo queda en ≈ $53,300 al mes (unos $1,753 al día), lo mismo que gastaba la agencia anterior. Ese gasto se midió con los 30 días previos al arranque, del 20 de septiembre al 19 de octubre.

Se reparte así:

1. Primero sale el dinero de lo que no trae contactos.
2. Luego se ajustan las dos campañas con el contacto más caro: Alta capacidad ($365 por contacto) y Reparación ($366 por contacto).

No se toca lo que trae contactos a buen precio. Antes de aplicarlo hace falta el visto bueno del cliente por escrito, y se corre primero en Vista previa.

**Quick Laundry · $359 al día (≈ $10,900 al mes)**

| Campaña | Presupuesto al día |
|---|---|
| Emprendimiento | $20 → $10 |
| Equipo para lavandería | $260 (sin cambio) |
| Autoservicio y monedas | $42 (sin cambio) |
| Marca | $6 (sin cambio) |
| Secadoras | $3 (sin cambio) |
| Marcas comerciales | $3 (sin cambio) |
| Campaña Search Marcas (anterior) | $35 (no se toca) |

**Kingstar (CLM) · $398 al día (≈ $12,100 al mes)**

| Campaña | Presupuesto al día |
|---|---|
| Alta capacidad | $330 → $227 |
| Hotelera | $100 → $40 |
| Túnel | $80 → $70 |
| 20 a 45 kg | $50 → $6 |
| Mangles | $50 (sin cambio) |
| Marca | $5 (sin cambio) |

**Laundry Solutions · $134 al día (≈ $4,100 al mes)**

| Campaña | Presupuesto al día |
|---|---|
| Servicio técnico | $75 (sin cambio) |
| Reparación | $156 → $55 |
| Refacciones | $10 → $1 |
| Instalación | $10 → $1 |
| Servicio a lavanderías | $8 → $1 |
| Servicio a secadoras | $10 → $1 |

**Girbau · $214 al día (≈ $6,500 al mes)**

Sin cambio.

**Gamesail · $648 al día ($19,700 al mes)**

Pasa a presupuesto completo, que ya estaba acordado.

**Topes de costo por clic** (solo con autorización)

| Marca | Campaña | Tope |
|---|---|---|
| Gamesail | Hoteles y hospitales | $16 → $20 |
| Laundry Solutions | Reparación | $15 → $18 |
| Girbau | Por capacidad y sector | $20 → $24 |

**Ojo:**

- **Recortes grandes:** Alta capacidad baja 31%, Reparación 65% y Hotelera 60%. Pueden volver a aprender unos días.
- **Contactos esperados:** 11 a 14 al día esta semana.

---

## Acordado en la junta del 5 nov: se aplica por pasos

El cliente aprobó el reparto, pero pidió hacerlo poco a poco para no frenar los contactos. Se aplica con `campanas/salida/reparto-por-pasos-todas-las-cuentas.js`. Cada paso mueve un tercio del camino, y Gamesail sube con el mismo dinero que sale de las otras.

| Paso | Desde | Suma al día (5 marcas) | Al mes |
|---|---|---|---|
| Hoy | — | $1,791 | ≈ $54,400 |
| 1 | jue 5 nov | $1,779 | ≈ $54,100 |
| 2 | lun 9 nov | $1,765 | ≈ $53,700 |
| 3 | jue 12 nov | $1,753 | ≈ $53,300 |

**Reglas mientras dura el cambio:**

- **Antes de cada paso se revisa el reporte diario.** Si una campaña recortada pierde contactos, ese paso se detiene en esa campaña.
- **No se corren** `ajustes`, `subir presupuesto`, `más leads` ni `activar`, porque usan los presupuestos del plan anterior.
- **Topes:** autorizados los 3 el 5 nov y también por pasos:

  | Marca | Campaña | Paso 1 | Paso 2 | Paso 3 |
  |---|---|---|---|---|
  | Gamesail | Hoteles y hospitales | $17 | $19 | $20 |
  | Laundry Solutions | Reparación | $16 | $17 | $18 |
  | Girbau | Por capacidad y sector | $21 | $23 | $24 |

  El tope no sube el gasto, porque manda el presupuesto diario.
- **Freno automático:** si una campaña que baja trajo 2 o más contactos en 7 días a un costo por contacto igual o mejor que el de su cuenta, no baja en ese paso.
- **Un paso por corrida:** cada campaña avanza como máximo un paso cada vez que se corre el script, así que no hay saltos dobles.
