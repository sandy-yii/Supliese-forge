/**
 * Atelback · Todo en uno — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): corre, en este orden, los
 * mismos pasos que los scripts sueltos:
 *   1. Exclusiones y palabras clave
 *   2. Ajustes
 *   3. Topes de costo por clic
 *   4. Subir presupuesto
 * Primero las exclusiones, para que el presupuesto que sube no se vaya en búsquedas que no sirven.
 * Si un paso falla, se detiene ahí y no corre los siguientes.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (cada paso dice qué haría) > EJECUTAR.
 * En la vista previa cada paso ve la cuenta como está hoy; al ejecutar, cada uno ve lo que dejó el anterior.
 */

function paso1() {
/**
 * Atelback · Agregar las palabras clave nuevas del plan — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): compara las palabras clave de
 * cada grupo de las campañas «AB ·» con el plan y agrega las que faltan, encendidas. También agrega a la lista
 * «AB · Negativas de la cuenta» las exclusiones del plan que le falten. No quita ni cambia ninguna de las que ya
 * existen, ni toca anuncios, presupuestos o páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "url": "https://gamesail.mx/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["casera", "BROAD"], ["caseras", "BROAD"], ["para casa", "PHRASE"], ["de casa", "PHRASE"], ["carga frontal", "PHRASE"], ["mabe", "BROAD"], ["easy", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["8 kg", "PHRASE"], ["9 kg", "PHRASE"], ["10 kg", "PHRASE"], ["12 kg", "PHRASE"], ["battistella", "BROAD"], ["tolkar", "BROAD"], ["fagor", "BROAD"], ["speed queen", "PHRASE"], ["ipso", "BROAD"], ["alliance", "BROAD"], ["girbau", "BROAD"], ["maytag", "BROAD"], ["huebsch", "BROAD"], ["milnor", "BROAD"], ["tintorería", "BROAD"], ["tintoreria", "BROAD"], ["tintorerías", "BROAD"], ["tintorerias", "BROAD"], ["cerca de mí", "PHRASE"], ["cerca de mi", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["seminuevas", "BROAD"], ["segunda mano", "PHRASE"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["arrendamiento", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["cómo hacer", "PHRASE"], ["como hacer", "PHRASE"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["técnico", "BROAD"], ["tecnico", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["abrir una lavandería", "PHRASE"], ["abrir una lavanderia", "PHRASE"], ["negocio de lavandería", "PHRASE"], ["negocio de lavanderia", "PHRASE"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["autoservicio", "BROAD"], ["monedas", "BROAD"], ["semi industrial", "PHRASE"], ["semi industriales", "PHRASE"], ["semindustrial", "BROAD"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["túnel", "BROAD"], ["tunel", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["40 kg", "PHRASE"], ["40 kilos", "PHRASE"], ["45 kg", "PHRASE"], ["45 kilos", "PHRASE"], ["60 kg", "PHRASE"], ["60 kilos", "PHRASE"], ["lavadora industrial 100 kg", "PHRASE"], ["lavadoras industriales 100 kg", "PHRASE"], ["lavadora de 100 kilos", "PHRASE"], ["lavadoras de 100 kilos", "PHRASE"], ["lavandería hotelera", "EXACT"], ["lavanderia hotelera", "EXACT"], ["lavandería para hospital", "PHRASE"], ["lavanderia para hospital", "PHRASE"], ["lavandería institucional", "PHRASE"], ["lavanderia institucional", "PHRASE"], ["mangle industrial", "EXACT"], ["mangle de planchado", "PHRASE"], ["planchadora de rodillo", "PHRASE"], ["autos", "BROAD"], ["carros", "BROAD"], ["coches", "BROAD"], ["autolavado", "BROAD"], ["car wash", "PHRASE"], ["carwash", "BROAD"], ["vehículos", "BROAD"], ["vehiculos", "BROAD"]]}, "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "grupos": [{"nombre": "Lavadoras industriales para ropa", "kw": [["lavadoras industriales", "EXACT"], ["lavadora industrial para ropa", "EXACT"], ["lavadora industrial para ropa", "PHRASE"], ["lavadoras industriales de ropa", "PHRASE"], ["lavadora industrial de ropa", "PHRASE"], ["lavadoras y secadoras industriales", "PHRASE"]]}, {"nombre": "Lavadoras para sábanas", "kw": [["lavadora industrial para sábanas", "PHRASE"], ["lavadoras para sábanas", "PHRASE"], ["lavadora de sábanas industrial", "PHRASE"], ["lavadora industrial para blancos", "PHRASE"]]}]}, {"nombre": "AB · Lavadoras por capacidad y precio", "grupos": [{"nombre": "Lavadoras por capacidad", "kw": [["lavadora industrial 20 kg precio", "EXACT"], ["lavadora industrial 30 kg precio", "EXACT"], ["lavadora industrial 50 kg precio", "EXACT"], ["lavadora industrial 20 kg", "PHRASE"], ["lavadora industrial 30 kg", "PHRASE"], ["lavadora industrial 50 kg", "PHRASE"], ["lavadoras industriales precio", "PHRASE"], ["centro de lavado industrial", "PHRASE"]]}]}, {"nombre": "AB · Secadoras industriales", "grupos": [{"nombre": "Secadoras para ropa", "kw": [["secadoras industriales de ropa", "PHRASE"], ["secadoras industriales", "PHRASE"], ["secadora industrial de ropa", "EXACT"], ["secadora industrial para ropa", "PHRASE"], ["secadora industrial para sábanas", "PHRASE"]]}, {"nombre": "Secadoras por capacidad", "kw": [["secadora industrial 50 kg", "PHRASE"], ["secadora industrial 100 kg", "PHRASE"], ["secadora industrial 130 kg", "PHRASE"], ["secadora industrial 200 kg", "PHRASE"], ["secadora de 100 kilos", "PHRASE"], ["secadora de 200 kilos", "PHRASE"], ["secadora industrial 30 kg", "PHRASE"]]}]}, {"nombre": "AB · Hoteles y hospitales", "grupos": [{"nombre": "Hoteles", "kw": [["lavadora industrial para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["secadoras para lavandería hotelera", "PHRASE"], ["secadora industrial para hotel", "PHRASE"], ["equipo para lavandería hotelera", "PHRASE"]]}, {"nombre": "Hospitales", "kw": [["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["secadora industrial para hospital", "PHRASE"]]}]}, {"nombre": "AB · Mangles y planchado", "grupos": [{"nombre": "Mangles", "kw": [["mangle planchador", "PHRASE"], ["dobladora de ropa industrial", "PHRASE"], ["calandria industrial", "PHRASE"], ["mangle para sábanas", "PHRASE"]]}]}, {"nombre": "AB · Competencia depurada", "grupos": [{"nombre": "Marcas de la competencia", "kw": [["atlika lavadoras industriales", "EXACT"], ["lavadora industrial atlika", "EXACT"], ["servex lavadoras", "EXACT"], ["lavadora industrial servex", "EXACT"], ["domus lavadora industrial", "EXACT"], ["wascomat lavadora industrial", "EXACT"], ["lorsa lavadora industrial", "EXACT"], ["unimac lavadora industrial", "EXACT"], ["primus lavadora industrial", "EXACT"]]}]}, {"nombre": "AB · Marca Gamesail", "grupos": [{"nombre": "Gamesail", "kw": [["gamesail", "EXACT"], ["gamesail méxico", "PHRASE"], ["gamesail lavadoras industriales", "EXACT"]]}, {"nombre": "Lavadoras Gamesail", "kw": [["lavadoras gamesail", "PHRASE"], ["lavadora gamesail", "PHRASE"]]}, {"nombre": "Secadoras Gamesail", "kw": [["secadoras gamesail", "PHRASE"], ["secadora gamesail", "PHRASE"]]}]}]}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["franquicia", "BROAD"], ["franquicias", "BROAD"], ["franchise", "BROAD"], ["franquiciatario", "BROAD"], ["hotel", "BROAD"], ["hoteles", "BROAD"], ["hotelera", "BROAD"], ["hospital", "BROAD"], ["hospitales", "BROAD"], ["clínica", "BROAD"], ["clinica", "BROAD"], ["mangle", "BROAD"], ["mangles", "BROAD"], ["planchadora", "BROAD"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["gamesail", "BROAD"], ["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["100 kg", "PHRASE"], ["100 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["túnel", "BROAD"], ["tunel", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["60 kg", "PHRASE"], ["girbau", "BROAD"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["lavax", "BROAD"], ["lava 1", "PHRASE"], ["aquamatic", "BROAD"], ["5asec", "BROAD"], ["cerca de mí", "PHRASE"], ["cerca de mi", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["seminuevas", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["gratis", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["carga frontal", "PHRASE"]]}, "campanas": [{"nombre": "AB · Equipo para lavandería", "grupos": [{"nombre": "Lavadoras para lavandería", "kw": [["lavadoras para lavanderías", "PHRASE"], ["lavadoras industriales para lavandería", "PHRASE"], ["lavadoras para lavandería precios", "EXACT"], ["lavadoras para negocio", "EXACT"], ["lavadoras y secadoras para lavandería", "PHRASE"], ["equipo para lavandería", "PHRASE"]]}, {"nombre": "Semi industrial", "kw": [["lavadoras semi industriales", "PHRASE"], ["lavadora semi industrial", "PHRASE"], ["lavadora comercial", "PHRASE"]]}]}, {"nombre": "AB · Emprendimiento", "grupos": [{"nombre": "Abrir una lavandería", "kw": [["abrir una lavandería", "PHRASE"], ["poner una lavandería", "PHRASE"], ["abrir mi lavandería", "PHRASE"], ["poner mi lavandería", "PHRASE"]]}]}, {"nombre": "AB · Autoservicio y monedas", "grupos": [{"nombre": "Autoservicio", "kw": [["lavadoras de monedas", "EXACT"], ["equipo para lavandería autoservicio", "EXACT"], ["lavadoras de autoservicio", "PHRASE"], ["lavadora para lavandería autoservicio", "PHRASE"], ["lavadora de monedas", "PHRASE"], ["secadora de monedas", "PHRASE"]]}]}, {"nombre": "AB · Secadoras para lavandería", "grupos": [{"nombre": "Secadoras para lavandería", "kw": [["secadora de ropa para lavandería", "PHRASE"], ["secadora lavandería", "PHRASE"], ["secadora semi industrial", "PHRASE"], ["secadoras semi industriales", "PHRASE"]]}]}, {"nombre": "AB · Marcas comerciales", "grupos": [{"nombre": "Maytag y LG", "kw": [["lavadora maytag industrial", "PHRASE"], ["lavadora maytag comercial", "PHRASE"], ["lg lavadora industrial", "PHRASE"], ["lavadora lg comercial", "PHRASE"]]}]}, {"nombre": "AB · Marca Quick Laundry", "grupos": [{"nombre": "Quick Laundry", "kw": [["quick laundry", "EXACT"], ["quick laundry méxico", "PHRASE"], ["quicklaundry", "EXACT"], ["quick laundry equipo", "PHRASE"]]}, {"nombre": "Supliese", "kw": [["supliese", "EXACT"], ["supliese", "PHRASE"], ["supliese gómez", "EXACT"]]}]}]}, {"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://kingstar.com.mx/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["auto", "BROAD"], ["autos", "BROAD"], ["carro", "BROAD"], ["carros", "BROAD"], ["coche", "BROAD"], ["coches", "BROAD"], ["automóvil", "BROAD"], ["automovil", "BROAD"], ["automóviles", "BROAD"], ["automoviles", "BROAD"], ["vehículo", "BROAD"], ["vehiculo", "BROAD"], ["vehículos", "BROAD"], ["vehiculos", "BROAD"], ["camión", "BROAD"], ["camion", "BROAD"], ["camiones", "BROAD"], ["camioneta", "BROAD"], ["camionetas", "BROAD"], ["moto", "BROAD"], ["motos", "BROAD"], ["car wash", "PHRASE"], ["carwash", "BROAD"], ["autolavado", "BROAD"], ["autolavados", "BROAD"], ["auto lavado", "PHRASE"], ["lavacoches", "BROAD"], ["tráiler", "BROAD"], ["trailer", "BROAD"], ["tráileres", "BROAD"], ["traileres", "BROAD"], ["encerado", "BROAD"], ["detallado", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["abrir una lavandería", "PHRASE"], ["abrir una lavanderia", "PHRASE"], ["negocio de lavandería", "PHRASE"], ["negocio de lavanderia", "PHRASE"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["autoservicio", "BROAD"], ["monedas", "BROAD"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["gamesail", "BROAD"], ["20 kg", "PHRASE"], ["30 kg", "PHRASE"], ["30 kilos", "PHRASE"], ["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["secadora industrial 100 kg", "PHRASE"], ["secadora de 100 kilos", "PHRASE"], ["secadoras de 100 kilos", "PHRASE"], ["lavadora industrial para hotel", "PHRASE"], ["lavadoras industriales para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["lavadoras para lavanderia hotelera", "PHRASE"], ["lavadora para lavandería hotelera", "PHRASE"], ["lavadora para lavanderia hotelera", "PHRASE"], ["secadoras para lavandería hotelera", "PHRASE"], ["secadoras para lavanderia hotelera", "PHRASE"], ["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["mangle planchador", "PHRASE"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["para sábanas", "PHRASE"], ["para sabanas", "PHRASE"], ["girbau", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["carga frontal", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["hisense", "BROAD"], ["fuzzy logic", "PHRASE"], ["heavy duty", "PHRASE"], ["cobija", "BROAD"], ["cobijas", "BROAD"], ["edredón", "BROAD"], ["edredon", "BROAD"], ["edredones", "BROAD"], ["15 kg", "PHRASE"], ["15 kilos", "PHRASE"], ["20 kilos", "PHRASE"], ["30kg", "PHRASE"], ["10 kg", "PHRASE"], ["22 kg", "PHRASE"], ["24 kg", "PHRASE"], ["24kg", "PHRASE"], ["25 kg", "PHRASE"], ["26 kg", "PHRASE"], ["28 kg", "PHRASE"], ["24 kilos", "PHRASE"], ["25 kilos", "PHRASE"], ["26 kilos", "PHRASE"], ["28 kilos", "PHRASE"]]}, "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "grupos": [{"nombre": "Lavadoras de alta capacidad", "kw": [["lavadoras de 100 kilos", "PHRASE"], ["lavadora industrial 100 kg", "PHRASE"], ["lavadora industrial 60 kg", "PHRASE"], ["lavadoras de alta capacidad", "PHRASE"], ["lavadora industrial de alta capacidad", "PHRASE"]]}]}, {"nombre": "AB · Lavandería hotelera e institucional", "grupos": [{"nombre": "Lavandería hotelera", "kw": [["lavandería hotelera", "EXACT"], ["proyecto de lavandería hotelera", "PHRASE"], ["lavandería industrial para hotel", "PHRASE"], ["lavandería para hotel", "PHRASE"]]}, {"nombre": "Hospitales e institucional", "kw": [["lavandería para hospital", "PHRASE"], ["lavandería hospitalaria", "PHRASE"], ["lavandería institucional", "PHRASE"]]}]}, {"nombre": "AB · Mangles y planchado", "grupos": [{"nombre": "Mangles", "kw": [["mangle de planchado", "PHRASE"], ["mangle industrial", "PHRASE"], ["planchadora de rodillo industrial", "PHRASE"]]}]}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "grupos": [{"nombre": "20 a 45 kg", "kw": [["lavadoras y secadoras de 20 a 45 kg", "PHRASE"], ["lavadora industrial 40 kg", "PHRASE"], ["secadora industrial 40 kg", "PHRASE"], ["lavadora de 40 kilos", "PHRASE"], ["lavadora industrial 45 kg", "PHRASE"], ["secadora industrial 45 kg", "PHRASE"]]}]}, {"nombre": "AB · Túnel de lavado", "grupos": [{"nombre": "Túnel de lavado para ropa", "kw": [["túnel de lavado industrial", "PHRASE"], ["túnel de lavado para ropa", "PHRASE"], ["túnel de lavado de ropa", "PHRASE"], ["lavadora de túnel", "PHRASE"], ["sistema de lavado continuo", "PHRASE"], ["túnel de lavado para hotel", "PHRASE"], ["túnel de lavado para lavandería", "PHRASE"]]}]}, {"nombre": "AB · Marca CLM", "grupos": [{"nombre": "CLM", "kw": [["clm méxico", "EXACT"], ["clmmexico", "EXACT"], ["clm lavandería", "PHRASE"], ["clm lavadoras", "PHRASE"], ["clm lavandería industrial", "PHRASE"], ["kingstar", "EXACT"], ["kingstar méxico", "PHRASE"], ["kingstar lavadoras", "PHRASE"], ["kingstar lavandería", "PHRASE"], ["king star lavadoras", "PHRASE"]]}]}]}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadoras industriales", "EXACT"], ["lavadora industrial", "EXACT"], ["lavadoras para lavanderia", "EXACT"], ["lavadoras para lavandería", "EXACT"], ["lavadoras comerciales", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["lavadora industrial precio", "EXACT"], ["precio de lavadora industrial", "PHRASE"], ["precio de lavadoras industriales", "PHRASE"], ["precio lavadoras industriales", "PHRASE"], ["costo lavadora industrial", "PHRASE"], ["costo de lavadora industrial", "PHRASE"], ["costo de lavadoras industriales", "PHRASE"], ["cuánto cuesta una lavadora industrial", "PHRASE"], ["cuanto cuesta una lavadora industrial", "PHRASE"], ["cuánto cuestan las lavadoras industriales", "PHRASE"], ["cuanto cuestan las lavadoras industriales", "PHRASE"], ["cuánto vale una lavadora industrial", "PHRASE"], ["cuanto vale una lavadora industrial", "PHRASE"], ["para negocio", "PHRASE"], ["commercial washer", "PHRASE"], ["partes para lavadora industrial", "PHRASE"], ["partes para lavadoras industriales", "PHRASE"], ["refacciones para lavadora industrial", "PHRASE"], ["refacciones para lavadoras industriales", "PHRASE"], ["refacciones para secadora industrial", "PHRASE"], ["refacciones para secadoras industriales", "PHRASE"], ["refacciones lavandería industrial", "PHRASE"], ["refacciones lavanderia industrial", "PHRASE"], ["curso", "BROAD"], ["cursos", "BROAD"], ["tutorial", "BROAD"], ["cómo reparar", "PHRASE"], ["como reparar", "PHRASE"], ["diagrama", "BROAD"], ["diagramas", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["manuales", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["easy", "BROAD"], ["de casa", "PHRASE"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["carga frontal", "PHRASE"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["empleo", "BROAD"], ["trabajo", "BROAD"], ["sueldo", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"]]}, "campanas": [{"nombre": "AB · Servicio técnico industrial", "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico de lavadoras industriales", "PHRASE"], ["técnico en lavadoras industriales", "PHRASE"], ["técnico en lavandería industrial", "PHRASE"], ["técnico de secadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Reparación y mantenimiento", "grupos": [{"nombre": "Reparación", "kw": [["reparación de lavadoras industriales", "PHRASE"], ["reparación de lavadora industrial", "PHRASE"]]}, {"nombre": "Mantenimiento correctivo", "kw": [["mantenimiento correctivo lavadora industrial", "PHRASE"], ["mantenimiento correctivo lavadoras industriales", "PHRASE"], ["mantenimiento correctivo lavadora", "PHRASE"]]}, {"nombre": "Mantenimiento preventivo", "kw": [["mantenimiento preventivo lavadoras industriales", "PHRASE"], ["mantenimiento lavandería industrial", "PHRASE"], ["mantenimiento de lavadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Refacciones Girbau y Gamesail", "grupos": [{"nombre": "Refacciones Girbau", "kw": [["refacciones girbau", "EXACT"], ["refacciones girbau", "PHRASE"], ["refacciones para lavadora girbau", "PHRASE"], ["refacciones para secadora girbau", "PHRASE"], ["partes girbau", "PHRASE"], ["refacciones girbau", "BROAD"]]}, {"nombre": "Refacciones Gamesail", "kw": [["refacciones gamesail", "EXACT"], ["refacciones gamesail", "PHRASE"], ["partes gamesail", "PHRASE"], ["refacciones gamesail", "BROAD"]]}]}, {"nombre": "AB · Servicio a secadoras", "grupos": [{"nombre": "Secadoras", "kw": [["reparación de secadoras industriales", "PHRASE"], ["servicio a secadoras industriales", "PHRASE"], ["mantenimiento de secadoras industriales", "PHRASE"], ["reparación secadoras industriales", "BROAD"]]}]}, {"nombre": "AB · Instalación", "grupos": [{"nombre": "Instalación", "kw": [["instalación de lavandería industrial", "PHRASE"], ["instalación de equipo de lavandería", "PHRASE"], ["instalación lavandería industrial", "BROAD"]]}]}, {"nombre": "AB · Servicio a lavanderías", "grupos": [{"nombre": "Pólizas", "kw": [["mantenimiento para lavandería de autoservicio", "PHRASE"], ["póliza de mantenimiento lavandería", "PHRASE"], ["mantenimiento lavandería autoservicio", "BROAD"]]}]}]}, {"cuenta": "860-582-6837", "nombre": "Girbau", "url": "https://girbaupro.com/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadora industrial", "EXACT"], ["lavadoras industriales", "EXACT"], ["lavadora industrial precio", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["precio lavadora industrial", "EXACT"], ["lavadora industrial 12 kg", "EXACT"], ["lavadora industrial 14 kg", "EXACT"], ["lavadora industrial 30 kg", "EXACT"], ["lavadora industrial 30 kg precio", "EXACT"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["lorsa", "BROAD"], ["lorza", "BROAD"], ["wascomat", "BROAD"], ["unimac", "BROAD"], ["maytag", "BROAD"], ["alliance", "BROAD"], ["speed queen", "PHRASE"], ["primus", "BROAD"], ["electrolux", "BROAD"], ["lg", "BROAD"], ["imesa", "BROAD"], ["sertec", "BROAD"], ["edro", "BROAD"], ["lavartind", "BROAD"], ["whirlpool", "BROAD"], ["braun", "BROAD"], ["gamesail", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["continental girbau", "PHRASE"], ["empleo", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["usada", "BROAD"], ["usadas", "BROAD"], ["renta", "BROAD"]]}, "campanas": [{"nombre": "AB · Marca Girbau", "grupos": [{"nombre": "Girbau", "kw": [["girbau", "EXACT"], ["girbau", "PHRASE"], ["lavadoras girbau", "PHRASE"], ["girbau méxico", "PHRASE"], ["distribuidor girbau", "PHRASE"], ["girbau occidente", "PHRASE"]]}]}, {"nombre": "AB · Girbau Smart Plus", "grupos": [{"nombre": "Smart Plus", "kw": [["girbau smart plus", "PHRASE"], ["smart plus girbau", "PHRASE"], ["lavadora girbau smart plus", "PHRASE"]]}]}, {"nombre": "AB · Girbau por capacidad y sector", "grupos": [{"nombre": "Capacidad", "kw": [["lavadora girbau 12 kg", "PHRASE"], ["lavadora girbau 14 kg", "PHRASE"], ["girbau 12 kg", "PHRASE"], ["girbau 14 kg", "PHRASE"], ["secadora girbau", "PHRASE"], ["lavadora industrial girbau", "PHRASE"]]}, {"nombre": "Sector", "kw": [["lavadora girbau para hotel", "PHRASE"], ["mangle girbau", "PHRASE"], ["girbau para lavandería", "PHRASE"]]}]}, {"nombre": "AB · Servicio técnico Girbau", "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico girbau", "PHRASE"], ["reparación girbau", "PHRASE"], ["mantenimiento girbau", "PHRASE"]]}]}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var TIPOS = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function clave(texto, tipo) { return texto.toLowerCase() + '|' + tipo; }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('PALABRAS CLAVE NUEVAS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));

  var campanasRn = {};
  var itc = AdsApp.search("SELECT campaign.name, campaign.resource_name FROM campaign WHERE campaign.status != 'REMOVED'");
  while (itc.hasNext()) { var cc = itc.next().campaign; campanasRn[cc.name] = cc.resourceName; }
  var grupos = {};
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group.resource_name FROM ad_group ' +
    "WHERE ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var g = it.next();
    grupos[g.campaign.name + ' > ' + g.adGroup.name] = { rn: g.adGroup.resourceName, hay: {} };
  }
  var itk = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
    "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE " +
    "AND ad_group_criterion.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (itk.hasNext()) {
    var k = itk.next();
    var gr = grupos[k.campaign.name + ' > ' + k.adGroup.name];
    if (gr) gr.hay[clave(k.adGroupCriterion.keyword.text, k.adGroupCriterion.keyword.matchType)] = true;
  }

  var ops = [], donde = [], faltan = [], temporal = 0;

  // Exclusiones de la cuenta que faltan en la lista
  var lista = '', yaEnLista = {};
  var its = AdsApp.search("SELECT shared_set.resource_name, shared_set.name FROM shared_set " +
    "WHERE shared_set.status = 'ENABLED' AND shared_set.type = 'NEGATIVE_KEYWORDS'");
  while (its.hasNext()) { var ss = its.next().sharedSet; if (ss.name === PLAN.lista.nombre) lista = ss.resourceName; }
  if (!lista) {
    Logger.log('AVISO: no existe la lista «' + PLAN.lista.nombre + '». Las exclusiones no se agregan.');
  } else {
    var itn = AdsApp.search("SELECT shared_criterion.resource_name, shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion " +
      "WHERE shared_criterion.shared_set = '" + lista + "'");
    while (itn.hasNext()) {
      var sc = itn.next().sharedCriterion, kn = sc.keyword;
      if (kn) yaEnLista[clave(kn.text, kn.matchType)] = sc.resourceName || true;
    }
    // Exclusiones que el plan ya no quiere (por ejemplo, porque ahora esas búsquedas sí se atienden)
    (PLAN.quitar || []).forEach(function (w) {
      var rn = yaEnLista[clave(w[0], w[1])];
      if (typeof rn !== 'string') return;
      ops.push({ sharedCriterionOperation: { remove: rn } });
      donde.push('quitar la exclusión «' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') de la lista de la cuenta');
    });
    PLAN.lista.kw.forEach(function (w) {
      if (yaEnLista[clave(w[0], w[1])]) return;
      ops.push({ sharedCriterionOperation: { create: { sharedSet: lista, keyword: { text: w[0], matchType: w[1] } } } });
      donde.push('exclusión «' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en la lista de la cuenta');
    });
  }
  PLAN.campanas.forEach(function (c) {
    c.grupos.forEach(function (g) {
      var nombre = c.nombre + ' > ' + g.nombre;
      var gr = grupos[nombre];
      if (!gr && g.h && campanasRn[c.nombre]) {
        // Grupo nuevo en una campaña que ya existe: se crea con su anuncio y sus palabras clave
        var rnGrupo = 'customers/' + AdsApp.currentAccount().getCustomerId().replace(/-/g, '') + '/adGroups/' + (--temporal);
        ops.push({ adGroupOperation: { create: { resourceName: rnGrupo, campaign: campanasRn[c.nombre], name: g.nombre, status: 'ENABLED', type: 'SEARCH_STANDARD' } } });
        donde.push('grupo nuevo «' + nombre + '»');
        ops.push({ adGroupAdOperation: { create: { adGroup: rnGrupo, status: 'ENABLED', ad: { finalUrls: [PLAN.url],
          responsiveSearchAd: { headlines: g.h.map(function (t) { return { text: t }; }), descriptions: g.d.map(function (t) { return { text: t }; }),
            path1: g.p[0], path2: g.p[1] } } } } });
        donde.push('anuncio de «' + nombre + '» (' + g.h.length + ' títulos, ' + g.d.length + ' descripciones, a ' + PLAN.url + ')');
        gr = grupos[nombre] = { rn: rnGrupo, hay: {} };
      }
      if (!gr) { faltan.push(nombre); return; }
      g.kw.forEach(function (w) {
        if (gr.hay[clave(w[0], w[1])]) return;
        ops.push({ adGroupCriterionOperation: { create: { adGroup: gr.rn, status: 'ENABLED', keyword: { text: w[0], matchType: w[1] } } } });
        donde.push('«' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en ' + nombre);
      });
    });
  });
  faltan.forEach(function (n) { Logger.log('AVISO: no existe el grupo ' + n + ' (¿falta correr «crear-campanas.js»?). Se salta.'); });
  if (!ops.length) { Logger.log('Nada que agregar: las campañas ya tienen todas las palabras clave y exclusiones del plan.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    var otro = /^(quitar|grupo|anuncio)/.test(donde[i]);
    if (r.isSuccessful()) Logger.log((otro ? (vista ? 'SE HARÍA: ' : 'HECHO: ') : (vista ? 'SE AGREGARÍA ' : 'AGREGADA ')) + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) {
    Logger.log((ops.length - malos) + ' cambio(s) por hacer' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  } else {
    Logger.log('LISTO: ' + (ops.length - malos) + ' cambio(s) hechos' + (malos ? ', ' + malos + ' rechazadas por Google' : '') + '.');
  }
}

  main();
}

function paso2() {
/**
 * Atelback · Ajustes — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py (campo «ajustes» de cada cuenta). No se edita a mano.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): pausa las campañas anteriores
 * y las palabras clave que indica el plan, y pone a las campañas nuevas «AB ·» el presupuesto diario y el tope de costo
 * por clic que indica el plan.
 * Pausar se puede deshacer en cualquier momento y conserva el historial. No toca anuncios, topes ni páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (dice cuánto se gastaría) > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "prefijo": "AB · ", "ajustes": {}}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "prefijo": "AB · ", "ajustes": {"pausar": ["Campaña Modelo de Negocio", "Campaña Search Marcas"], "presupuesto": {"Equipo para lavandería": 190, "Emprendimiento": 99, "Autoservicio y monedas": 55, "Secadoras para lavandería": 16, "Marcas comerciales": 16, "Marca Quick Laundry": 18}, "arriba": {"Marca Quick Laundry": {"cuota": 0.8, "tope": 10}}}}, {"cuenta": "993-525-8739", "nombre": "CLM", "prefijo": "AB · ", "ajustes": {"presupuesto": {"Alta capacidad 60 kg o más": 222, "Lavandería hotelera e institucional": 117}, "arriba": {"Marca CLM": {"cuota": 0.8, "tope": 15}}}}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "ajustes": {"pausar_palabras": [["Servicio técnico industrial", "Servicio técnico", "técnico lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Reparación", "reparación lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Mantenimiento preventivo", "mantenimiento lavadoras industriales", "BROAD"]], "presupuesto": {"Reparación y mantenimiento": 130, "Servicio técnico industrial": 64}}}, {"cuenta": "860-582-6837", "nombre": "Girbau", "prefijo": "AB · ", "ajustes": {"arriba": {"Marca Girbau": {"cuota": 0.8, "tope": 25}}}}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS_MES = 30.4;

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('AJUSTES · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var aj = PLAN.ajustes || {};
  var pausar = aj.pausar || [], presupuesto = aj.presupuesto || {}, palabras = aj.pausar_palabras || [], topes = aj.topes || {},
      arriba = aj.arriba || {};
  if (!pausar.length && !Object.keys(presupuesto).length && !palabras.length && !Object.keys(topes).length && !Object.keys(arriba).length) { Logger.log('Nada que ajustar en esta cuenta por ahora.'); return; }

  var C = {};
  filas('SELECT campaign.resource_name, campaign.name, campaign.status, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    'campaign.target_impression_share.location, campaign.target_impression_share.location_fraction_micros, ' +
    'campaign.target_impression_share.cpc_bid_ceiling_micros, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { rn: f.campaign.resourceName, presupuesto: f.campaignBudget.resourceName, puja: f.campaign.biddingStrategyType,
      tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6, cuota: f.campaign.targetImpressionShare || {},
      monto: Number(f.campaignBudget.amountMicros || 0) / 1e6, compartido: f.campaignBudget.explicitlyShared };
  });
  var antes = 0;
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });

  var ops = [], donde = [], que = [], despues = antes;
  pausar.forEach(function (n) {
    var c = C[n];
    if (!c) { que.push('«' + n + '»: no está encendida (ya en pausa o con otro nombre). Se salta.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, status: 'PAUSED' }, updateMask: 'status' } });
    donde.push('pausa de «' + n + '»');
    que.push('PAUSAR «' + n + '» (gastaba hasta ' + dinero(c.monto) + ' al día)');
    despues -= c.monto;
  });
  if (palabras.length) {
    var kws = {};
    filas('SELECT campaign.name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
      "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
      "AND campaign.status != 'REMOVED' AND ad_group.status != 'REMOVED'", 'las palabras clave').forEach(function (f) {
      var k = f.adGroupCriterion.keyword;
      kws[[f.campaign.name, f.adGroup.name, k.text.toLowerCase(), k.matchType].join('|')] = f.adGroupCriterion.resourceName;
    });
    palabras.forEach(function (w) {
      var nombre = PLAN.prefijo + w[0] + ' > ' + w[1], rn = kws[[PLAN.prefijo + w[0], w[1], w[2].toLowerCase(), w[3]].join('|')];
      if (!rn) { que.push('«' + w[2] + '» en ' + nombre + ': no está encendida. Se salta.'); return; }
      ops.push({ adGroupCriterionOperation: { update: { resourceName: rn, status: 'PAUSED' }, updateMask: 'status' } });
      donde.push('pausa de la palabra «' + w[2] + '»');
      que.push('PAUSAR PALABRA «' + w[2] + '» en ' + nombre);
    });
  }
  Object.keys(topes).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevoTope = topes[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja !== 'TARGET_SPEND') { que.push('AVISO «' + n + '»: no puja por clics con tope (' + c.puja + '). Se salta.'); return; }
    if (c.tope >= nuevoTope) { que.push('«' + n + '»: su tope ya es $' + c.tope + ' o más.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(nuevoTope * 1e6) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    donde.push('tope CPC de «' + n + '»');
    que.push('TOPE CPC «' + n + '»: $' + c.tope + ' → $' + nuevoTope + ' (entra a más subastas; no cambia el presupuesto)');
  });
  // Campañas que deben salir hasta arriba: «Cuota de impresiones objetivo», parte superior absoluta de la página
  Object.keys(arriba).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], a = arriba[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja === 'TARGET_IMPRESSION_SHARE' && c.cuota.location === 'ABSOLUTE_TOP_OF_PAGE' &&
        Math.round(Number(c.cuota.locationFractionMicros || 0) / 1e4) === Math.round(a.cuota * 100) &&
        Math.round(Number(c.cuota.cpcBidCeilingMicros || 0) / 1e6) === a.tope) {
      que.push('«' + n + '»: ya pide salir hasta arriba el ' + Math.round(a.cuota * 100) + '% de las veces con tope $' + a.tope + '.');
      return;
    }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetImpressionShare: { location: 'ABSOLUTE_TOP_OF_PAGE',
      locationFractionMicros: Math.round(a.cuota * 1e6), cpcBidCeilingMicros: Math.round(a.tope * 1e6) } }, updateMask: 'targetImpressionShare.location,targetImpressionShare.locationFractionMicros,targetImpressionShare.cpcBidCeilingMicros' } });
    donde.push('puja para salir arriba en «' + n + '»');
    que.push('SALIR ARRIBA «' + n + '»: de «maximizar clics» (tope $' + c.tope + ') a «salir hasta arriba el ' + Math.round(a.cuota * 100) +
      '% de las veces», pagando como máximo $' + a.tope + ' por clic. El presupuesto no cambia.');
  });
  Object.keys(presupuesto).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevo = presupuesto[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (Math.round(c.monto) === Math.round(nuevo)) { que.push('«' + n + '»: ya tiene ' + dinero(nuevo) + ' al día.'); return; }
    if (c.compartido) { que.push('AVISO «' + n + '»: su presupuesto es compartido; cámbialo a mano a ' + dinero(nuevo) + ' al día.'); return; }
    ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
    donde.push('presupuesto de «' + n + '»');
    que.push('PRESUPUESTO «' + n + '»: ' + dinero(c.monto) + ' → ' + dinero(nuevo) + ' al día');
    despues += nuevo - c.monto;
  });

  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  que.forEach(function (t) { Logger.log(t); });
  Logger.log('');
  Logger.log('Presupuesto diario de todas las campañas encendidas: ' + dinero(antes) + ' → ' + dinero(despues) +
    ' (al mes, hasta ' + dinero(antes * DIAS_MES) + ' → ' + dinero(despues * DIAS_MES) + ').');
  if (!ops.length) { Logger.log('Nada que cambiar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo con el gasto, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '. Para deshacer una pausa, actívala de nuevo en Campañas.');
  }
}

  main();
}

function paso3() {
/**
 * Atelback · Más leads en las campañas nuevas — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está):
 *   1. Si ya no hay campañas anteriores encendidas, pasa a su presupuesto completo del plan las campañas nuevas «AB ·»
 *      que siguen con el de arranque (la mitad). Si un presupuesto ya se movió después (con «ajustes» o «subir
 *      presupuesto»), no lo toca.
 *   2. A las campañas nuevas que pierden la mitad o más de sus impresiones por puja (últimos 7 días), les sube el
 *      tope de CPC un 50%, o hasta lo que Google pide para la primera página. Nunca pasa del doble del tope del plan.
 * No toca anuncios, palabras clave, páginas ni campañas anteriores.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (dice cuánto se gastaría) > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (presupuesto completo, cargado a Equipo para lavandería)", "fijos": ["Equipo para lavandería", "Emprendimiento", "Autoservicio y monedas", "Secadoras para lavandería", "Marcas comerciales", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Alta capacidad)", "fijos": ["Alta capacidad 60 kg o más", "Lavandería hotelera e institucional"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); la marca sale arriba con «ajustes»", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS_MES = 30.4;

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function micros(pesos) { return Math.round(pesos * 1e6); }
function pesos(m) { return Number(m || 0) / 1e6; }
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('MÁS LEADS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var planDe = {};
  PLAN.campanas.forEach(function (k) { planDe[k.nombre] = k; });

  var nuevas = [], anteriores = [];
  filas('SELECT campaign.resource_name, campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    'campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign ' +
    "WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    var x = { nombre: f.campaign.name, rn: f.campaign.resourceName, puja: f.campaign.biddingStrategyType,
      tope: pesos((f.campaign.targetSpend || {}).cpcBidCeilingMicros), presupuesto: f.campaignBudget.resourceName,
      monto: pesos(f.campaignBudget.amountMicros), compartido: f.campaignBudget.explicitlyShared };
    (esNueva(x.nombre) ? nuevas : anteriores).push(x);
  });
  if (!nuevas.length) throw new Error('No hay campañas «' + PLAN.prefijo + '» encendidas. Corre «activar.js». No se hizo nada.');

  var cuota = {};
  filas('SELECT campaign.name, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share FROM campaign ' +
    "WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 'ENABLED'", 'la cuota de impresiones').forEach(function (f) {
    // Si una campaña aún no tiene datos, Google no manda «metrics».
    var m = f.metrics || {};
    cuota[f.campaign.name] = { puja: m.searchRankLostImpressionShare, presupuesto: m.searchBudgetLostImpressionShare };
  });
  var primera = {};
  filas('SELECT campaign.name, ad_group_criterion.position_estimates.first_page_cpc_micros FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'lo que pide Google por palabra').forEach(function (f) {
    var v = pesos((f.adGroupCriterion.positionEstimates || {}).firstPageCpcMicros);
    if (v) (primera[f.campaign.name] = primera[f.campaign.name] || []).push(v);
  });

  var ops = [], donde = [], que = [], antes = 0, despues = 0;
  var completo = anteriores.length === 0;
  if (!completo) {
    Logger.log('Siguen encendidas ' + anteriores.length + ' campaña(s) anterior(es): ' + anteriores.map(function (a) { return '«' + a.nombre + '»'; }).join(', ') +
      '. Las nuevas se quedan con su presupuesto actual; pasan a completo cuando pauses las anteriores.');
  }
  nuevas.forEach(function (x) {
    var k = planDe[x.nombre];
    antes += x.monto;
    var monto = x.monto;
    // 1. Presupuesto completo
    var fijo = (PLAN.fijos || []).indexOf(x.nombre.replace(PLAN.prefijo, '')) >= 0;   // su presupuesto lo pone «ajustes»
    if (completo && k && !fijo && x.monto <= k.arranque && x.monto < k.completo) {
      if (x.compartido) {
        que.push('AVISO «' + x.nombre + '»: su presupuesto es compartido con otras campañas; súbelo a mano a $' + k.completo + ' al día.');
      } else {
        monto = k.completo;
        ops.push({ campaignBudgetOperation: { update: { resourceName: x.presupuesto, amountMicros: micros(monto) }, updateMask: 'amountMicros' } });
        donde.push('presupuesto de «' + x.nombre + '»');
        que.push('PRESUPUESTO «' + x.nombre + '»: ' + dinero(x.monto) + ' → ' + dinero(monto) + ' al día');
      }
    }
    despues += monto;
    // 2. Tope de CPC
    var c = cuota[x.nombre];
    if (x.puja !== 'TARGET_SPEND' || !x.tope || !c || !(Number(c.puja) >= 0.5)) return;
    var maximo = k ? k.cpc * 2 : x.tope * 2;
    if (x.tope >= maximo) {
      que.push('AVISO «' + x.nombre + '»: pierde ' + Math.round(c.puja * 100) + '% por puja, pero su tope ($' + x.tope + ') ya es el doble del plan. Se revisa con las palabras clave.');
      return;
    }
    var pide = (primera[x.nombre] || []).sort(function (a, b) { return a - b; });
    var mediana = pide.length ? pide[Math.floor(pide.length / 2)] : 0;
    var nuevo = Math.ceil(Math.min(maximo, Math.max(x.tope * 1.5, mediana)));
    if (nuevo <= x.tope) return;
    ops.push({ campaignOperation: { update: { resourceName: x.rn, targetSpend: { cpcBidCeilingMicros: micros(nuevo) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    donde.push('tope CPC de «' + x.nombre + '»');
    que.push('TOPE CPC «' + x.nombre + '»: $' + x.tope + ' → $' + nuevo + ' (pierde ' + Math.round(c.puja * 100) + '% de impresiones por puja' +
      (mediana ? '; Google pide ~$' + Math.round(mediana) + ' para la primera página' : '') + ')');
  });

  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  if (!que.length) Logger.log('Nada que cambiar: las campañas nuevas ya tienen su presupuesto y su tope no las frena.');
  que.forEach(function (t) { Logger.log(t); });
  Logger.log('');
  Logger.log('Presupuesto diario de las campañas nuevas: ' + dinero(antes) + ' → ' + dinero(despues) +
    ' (al mes, hasta ' + dinero(despues * DIAS_MES) + '). Los topes de CPC no cambian el presupuesto: solo dejan entrar a más subastas.');
  if (!ops.length) return;

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo con el gasto, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '.');
  }
}

  main();
}

function paso4() {
/**
 * Atelback · Subir presupuesto a lo que funciona — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está), con los últimos 3 días completos:
 *   1. Sube 20% el presupuesto de las campañas nuevas «AB ·» que se quedan sin dinero (pierden 20% o más de sus
 *      impresiones por presupuesto), traen clics y pagan por clic lo del plan o menos. Las que siguen aprendiendo no suben.
 *   2. Solo si hace falta espacio para subir, baja el presupuesto de las campañas nuevas que casi no lo usan (gastan
 *      menos del 30%), hasta 1.5 veces lo que sí gastan y sin bajar de $10 al día. Ese dinero no se estaba usando.
 *   3. Nunca pasa el tope mensual de la cuenta: la suma de presupuestos diarios de todas las campañas encendidas,
 *      por 30.4 días, queda igual o por debajo del presupuesto mensual del plan.
 * No toca campañas anteriores, anuncios, palabras clave, topes de CPC ni páginas.
 *
 * CÓMO SE USA: cada 2 o 3 días, pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (presupuesto completo, cargado a Equipo para lavandería)", "fijos": ["Equipo para lavandería", "Emprendimiento", "Autoservicio y monedas", "Secadoras para lavandería", "Marcas comerciales", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Alta capacidad)", "fijos": ["Alta capacidad 60 kg o más", "Lavandería hotelera e institucional"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); la marca sale arriba con «ajustes»", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS_MES = 30.4;
var DIAS = 3;              // días completos que se revisan
var SUBE = 0.20;           // cuánto sube cada vez
var PIERDE_MIN = 0.20;     // pérdida por presupuesto a partir de la cual sube
var CLICS_MIN = 5;         // clics mínimos en esos días para considerar que funciona
var USA_MIN = 0.30;        // por debajo de este uso del presupuesto, se le baja
var PISO = 10;             // presupuesto diario mínimo de una campaña nueva

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function num(x) { return Number(x || 0); }
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }
function pct(x) { return Math.round(x * 100) + '%'; }
function mas(t, dias) { var p = t.split('-'); var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().substring(0, 10); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  if (PLAN.subir === false) { Logger.log('SUBIR PRESUPUESTO · ' + PLAN.nombre + ' · hoy no toca en esta cuenta: ' + PLAN.subir_porque + '. No se hizo nada.'); return; }
  var hoy = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  var desde = mas(hoy, -DIAS), hasta = mas(hoy, -1);
  var tope = PLAN.mensual / DIAS_MES;
  Logger.log('SUBIR PRESUPUESTO · ' + PLAN.nombre + ' · días ' + desde + ' a ' + hasta + ' · tope ' + dinero(PLAN.mensual) + ' al mes (' +
    dinero(tope) + ' al día)' + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var planDe = {};
  PLAN.campanas.forEach(function (k) { planDe[k.nombre] = k; });

  var C = {};
  filas('SELECT campaign.name, campaign.primary_status_reasons, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { nueva: esNueva(f.campaign.name), aprende: (f.campaign.primaryStatusReasons || []).indexOf('BIDDING_STRATEGY_LEARNING') >= 0,
      rn: f.campaignBudget.resourceName, monto: num(f.campaignBudget.amountMicros) / 1e6, compartido: f.campaignBudget.explicitlyShared,
      costo: 0, clics: 0, pierde: null };
  });
  filas('SELECT campaign.name, metrics.cost_micros, metrics.clicks, metrics.search_budget_lost_impression_share FROM campaign ' +
    "WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "' AND campaign.status = 'ENABLED'", 'los números').forEach(function (f) {
    var c = C[f.campaign.name], m = f.metrics || {};
    if (!c) return;
    c.costo = num(m.costMicros) / 1e6; c.clics = num(m.clicks);
    if (m.searchBudgetLostImpressionShare !== undefined) c.pierde = num(m.searchBudgetLostImpressionShare);
  });

  var antes = 0;
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });
  var nuevo = {}, que = [], nota = [];

  // Campañas nuevas que casi no usan su presupuesto: de ahí sale el espacio si hace falta
  var donantes = Object.keys(C).filter(function (n) {
    var c = C[n];
    if (!c.nueva || c.compartido || !c.monto) return false;
    return c.costo / (c.monto * DIAS) < USA_MIN && Math.max(PISO, Math.ceil(c.costo / DIAS * 1.5)) < c.monto;
  }).sort(function (a, b) { return (C[b].monto - C[b].costo / DIAS) - (C[a].monto - C[a].costo / DIAS); });

  // 1. Candidatas a subir, de la más barata por clic contra su plan a la más cara
  var sube = Object.keys(C).filter(function (n) {
    var c = C[n], k = planDe[n];
    if (!c.nueva) return false;
    var porClic = c.clics ? c.costo / c.clics : 0;
    if (c.pierde === null || c.pierde < PIERDE_MIN) return false;
    if (c.compartido) { nota.push('«' + n + '»: su presupuesto es compartido; súbelo a mano si quieres.'); return false; }
    if (c.aprende) { nota.push('«' + n + '» pierde ' + pct(c.pierde) + ' por presupuesto, pero sigue aprendiendo: sube la próxima vez.'); return false; }
    if (c.clics < CLICS_MIN) { nota.push('«' + n + '» pierde ' + pct(c.pierde) + ' por presupuesto, pero con ' + c.clics + ' clics todavía no se ve si funciona.'); return false; }
    if (k && porClic > k.cpc) { nota.push('«' + n + '» pierde ' + pct(c.pierde) + ' por presupuesto, pero paga ' + dinero(porClic) + ' por clic, más que los ' + dinero(k.cpc) + ' del plan: no sube.'); return false; }
    return true;
  }).sort(function (a, b) {
    var ka = planDe[a], kb = planDe[b];
    return (C[a].costo / C[a].clics) / (ka ? ka.cpc : 1) - (C[b].costo / C[b].clics) / (kb ? kb.cpc : 1);
  });

  var espacio = tope - antes;
  function liberar(falta) {
    while (falta > 0 && donantes.length) {
      var n = donantes[0], c = C[n], piso = Math.max(PISO, Math.ceil(c.costo / DIAS * 1.5));
      var actual = (n in nuevo) ? nuevo[n] : c.monto, quita = Math.min(actual - piso, Math.ceil(falta));
      if (quita <= 0) { donantes.shift(); continue; }
      nuevo[n] = actual - quita; espacio += quita; falta -= quita;
      if (nuevo[n] <= piso) donantes.shift();
    }
  }
  sube.forEach(function (n) {
    var c = C[n], deseado = Math.ceil(c.monto * (1 + SUBE)), extra = deseado - c.monto;
    if (extra > espacio) liberar(extra - espacio);
    if (espacio < 1) { nota.push('«' + n + '» merece subir, pero la cuenta ya llegó a su tope mensual. Opción: pausar una campaña anterior para liberar dinero.'); return; }
    if (extra > espacio) { extra = Math.floor(espacio); deseado = c.monto + extra; }
    nuevo[n] = deseado; espacio -= extra;
    que.push('SUBE «' + n + '»: ' + dinero(c.monto) + ' → ' + dinero(deseado) + ' al día (pierde ' + pct(c.pierde) + ' por presupuesto; ' +
      c.clics + ' clics a $' + (c.costo / c.clics).toFixed(2) + ' en ' + DIAS + ' días)');
  });

  Object.keys(nuevo).forEach(function (n) {
    var c = C[n];
    if (nuevo[n] < c.monto) que.unshift('BAJA «' + n + '»: ' + dinero(c.monto) + ' → ' + dinero(nuevo[n]) + ' al día (en ' + DIAS +
      ' días usó ' + pct(c.costo / (c.monto * DIAS)) + ' de su presupuesto; ese dinero pasa a la que sí funciona)');
  });
  var despues = 0;
  Object.keys(C).forEach(function (n) { despues += (n in nuevo) ? nuevo[n] : C[n].monto; });
  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  if (!que.length) Logger.log('Nada que cambiar hoy.');
  que.forEach(function (t) { Logger.log(t); });
  nota.forEach(function (t) { Logger.log('NOTA: ' + t); });
  Logger.log('');
  Logger.log('Suma de presupuestos diarios (todas las campañas encendidas): ' + dinero(antes) + ' → ' + dinero(despues) +
    ' · al mes, como máximo: ' + dinero(antes * DIAS_MES) + ' → ' + dinero(despues * DIAS_MES) + ' · tope del plan ' + dinero(PLAN.mensual));
  var ops = [], donde = [];
  Object.keys(nuevo).forEach(function (n) {
    ops.push({ campaignBudgetOperation: { update: { resourceName: C[n].rn, amountMicros: Math.round(nuevo[n] * 1e6) }, updateMask: 'amountMicros' } });
    donde.push('presupuesto de «' + n + '»');
  });
  if (!ops.length) return;

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '. Vuelve a correrlo en 2 o 3 días.');
  }
}

  main();
}

function main() {
  Logger.log('');
  Logger.log('########## PASO 1 DE 4 · EXCLUSIONES Y PALABRAS CLAVE ##########');
  try { paso1(); } catch (e) {
    Logger.log('ERROR en el paso 1: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 2 DE 4 · AJUSTES ##########');
  try { paso2(); } catch (e) {
    Logger.log('ERROR en el paso 2: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 3 DE 4 · TOPES DE COSTO POR CLIC ##########');
  try { paso3(); } catch (e) {
    Logger.log('ERROR en el paso 3: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 4 DE 4 · SUBIR PRESUPUESTO ##########');
  try { paso4(); } catch (e) {
    Logger.log('ERROR en el paso 4: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('LISTO: se corrieron los 4 pasos. Copia todo el registro y mándalo.');
}
