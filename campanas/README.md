# Campañas de arranque del grupo Supliese

Plan corregido con los acuerdos de la junta del 11 de octubre de 2026, y los scripts que crean las campañas en Google Ads.

| Archivo | Qué es |
|---|---|
| `plan.py` | El plan: campañas, porcentajes, topes de CPC, palabras clave, anuncios y negativas de las cinco cuentas. Se edita solo aquí. |
| `generar.py` | Revisa el plan y genera los scripts y las fichas. |
| `plantilla-script.js` | Base de los scripts de Google Ads. |
| `salida/<cuenta>/crear-campanas.js` | Script que crea las campañas de esa cuenta, **en pausa**. |
| `salida/<cuenta>/conversiones.js` | Script que crea las conversiones de la página y deja en el registro las variables para el código de medición. |
| `salida/<cuenta>/activar.js` | Script que enciende las campañas nuevas y hace los cambios del plan en las anteriores. Cómo usarlo: `activacion/GUIA-SCRIPTS.md`. |
| `salida/<cuenta>/prompt-extension/parte-N-de-M.txt` | Instrucciones para crear las campañas a mano con la extensión Claude in Chrome, en partes: la 1 trae las reglas y la lista de negativas; cada parte siguiente, una campaña. Quedan en pausa, con fecha de inicio 2026-12-31. |
| `salida/<cuenta>/ficha.md` | Todo lo que crea el script, para revisarlo antes. |
| `salida/cruces.md` | Palabras clave que todavía podrían competir entre cuentas. |

```
python3 campanas/generar.py
```

El generador se detiene con error si algo falla:

- un título pasa de 30 caracteres, una descripción de 90 o una ruta de 15;
- un anuncio tiene menos de 3 títulos o menos de 2 descripciones;
- una palabra clave no es válida;
- una negativa bloquea una palabra clave de su propia cuenta;
- los porcentajes no suman 100.

## Cambios de la junta

| Cuenta | Cambio |
|---|---|
| Todas | El grupo se sigue llamando Supliese. La marca de la cuenta Supliese Gómez pasa a ser **Quick Laundry**. |
| Gamesail | Lavadoras con énfasis en **ropa y sábanas**. Secadoras de **50, 100, 130 y 200 kg**. Se agregan «lavandería hotelera», «lavadoras Gamesail» y «secadoras Gamesail». Las refacciones salen: pasan a Servicio. |
| Quick Laundry | Sale «cuánto cuesta poner una lavandería» (trae preguntones). Sale Franquicias: «franquicia» queda como negativa y la keyword se pausa en la cuenta actual. |
| CLM | Se agregan **40 kg**, «lavandería hotelera» y «túnel de lavado para ropa». Sale la competencia. Negativas para no confundirse con **túneles de lavado de autos**. |
| Servicio para Lavandería | El foco es el servicio técnico. Se agrega mantenimiento correctivo. Las refacciones genéricas van a negativas («partes para lavadora industrial»); se quedan solo **refacciones Girbau y Gamesail**. |
| Girbau | Se agregan el modelo nuevo **Girbau Smart Plus** y las capacidades de **12 y 14 kg**. «Lavadora industrial» sin marca va a negativas. Las refacciones pasan a Servicio; el servicio técnico Girbau se queda. |

## Decisiones tomadas después de la junta

- **Refacciones Girbau y Gamesail:** solo en Servicio para Lavandería. Girbau y Gamesail las tienen como negativa.
- **Lavandería hotelera, dividida por producto:**
  - Gamesail se queda con las máquinas («lavadoras para lavandería hotelera»).
  - CLM se queda con la lavandería completa: la búsqueda exacta «lavandería hotelera», el túnel y los proyectos.
- **Quick Laundry en los anuncios desde ya,** pujando también por «supliese».
- **Las campañas se crean en pausa;** se activan cuenta por cuenta con el OK.
- **Zona de Girbau:** su campaña actual «Girbau Búsqueda | Nerea» tiene los 32 estados, así que las nuevas van a todo México, como las demás cuentas. Idioma: solo español (Nerea tiene también inglés).
- **Páginas de destino (12 oct 2026):** Supliese / Quick Laundry https://www.supliese.com/ · Girbau https://supliese-girbau-lavadoras.vercel.app/ (desde el 21 oct 2026; antes girbauoccidente.com) · CLM https://www.clmmexico.com/ · Gamesail https://gamesail.mx/ · Servicio https://www.servicioparalavanderias.com/. Los anuncios viejos con otra URL no se editan: se crea uno nuevo igual con la URL nueva y el viejo se pausa cuando el nuevo esté aprobado.

## Reparto de búsquedas entre cuentas

Cada cuenta carga como negativas las búsquedas de las otras. `salida/cruces.md` comprueba que no quede ninguna palabra clave que otra cuenta pueda activar.

| Cuenta | Se queda con |
|---|---|
| Gamesail | Lavadoras para ropa y sábanas de 20, 30 y 50 kg; secadoras de 30 a 200 kg; lavadoras para hotel y hospital; mangle planchador y dobladora; su marca. |
| Quick Laundry | Equipo comercial y semi industrial para lavandería, abrir una lavandería, autoservicio y monedas, Maytag y LG, su marca y «supliese». |
| CLM | 40 y 45 kg, 60 kg o más, lavandería hotelera e institucional completa, túnel de lavado para ropa, mangle industrial, su marca. |
| Servicio para Lavandería | Servicio técnico, reparación, mantenimiento preventivo y correctivo, instalación; refacciones solo Girbau y Gamesail. |
| Girbau | Todo lo que lleva la palabra «girbau», salvo las refacciones. |

## Cómo se crean las campañas

Depende del acceso de la usuaria en cada cuenta:

- **Administradora con su propio usuario** (Girbau desde el 20 oct 2026): con el script, ver «Cómo se ejecuta con script».
- **Sin ese acceso**: a mano con la extensión Claude in Chrome, sin script, porque la cuenta no puede autorizarlo.

### A mano con la extensión

1. En Chrome, abrir Google Ads **dentro de la cuenta** (no en el MCC).
2. Abrir el panel de la extensión y pegar `salida/<cuenta>/prompt-extension/parte-1-de-M.txt`. Cuando la extensión termine, pegar la parte 2, y así hasta la última, en la misma conversación. Van en partes porque un texto largo se corta al pegarlo.
3. Al terminar, la extensión da la lista de lo creado. Se compara contra `ficha.md`.

Orden: Girbau, Servicio para Lavandería, CLM, Quick Laundry, Gamesail.

## Cómo se ejecuta con script

1. Revisar la ficha de la cuenta. Si la lista «AB · Negativas de la cuenta» ya existe de un intento a mano, el script la reutiliza y solo le agrega lo que falte; si ya existe alguna campaña «AB ·», se detiene sin crear nada.
2. Dentro de la cuenta, no en el MCC: Herramientas > Acciones masivas > Scripts > «+».
3. Pegar `crear-campanas.js` y autorizar con el usuario administrador propio (con su verificación en 2 pasos).
4. Correr la **vista previa**: no crea nada. Si termina en «VISTA PREVIA SIN ERRORES», dar **Ejecutar**.

Detalles del script:

- Revisa que se esté corriendo en la cuenta correcta.
- Se niega a duplicar campañas que ya existan.
- Crea todo en una sola operación: si algo falla, no queda nada a medias.
- No toca las campañas actuales.

**Requieren el OK del cliente, cuenta por cuenta:**

- Activar las campañas nuevas.
- Bajar las campañas actuales a la mitad de su presupuesto.
- Cada pausa en las campañas actuales (la lista está en cada ficha).

## Lo que no está probado

- El script no se ha corrido en una cuenta real. Se probó con una simulación de Google Ads:
  - genera bien las operaciones;
  - se detiene si se corre en la cuenta equivocada;
  - reutiliza la lista de negativas si ya existe y le agrega solo lo que falta;
  - se detiene sin crear nada si ya existe una campaña con el mismo nombre.
- La vista previa en la cuenta es la prueba real.
- Los topes de CPC salen del CPC promedio de Gamesail (~$8) y Supliese (~$5). En CLM, Servicio y Girbau son estimados: se ajustan la primera semana con el CPC real.
