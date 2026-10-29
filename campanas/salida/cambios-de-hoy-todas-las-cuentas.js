/**
 * Atelback · Cambios de hoy (exclusiones, anuncios nuevos y ajustes) — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): corre, en este orden, los
 * mismos pasos que los scripts sueltos:
 *   1. Exclusiones y palabras clave
 *   2. Anuncios nuevos
 *   3. Ajustes
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

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "url": "https://gamesail.mx/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["casera", "BROAD"], ["caseras", "BROAD"], ["para casa", "PHRASE"], ["de casa", "PHRASE"], ["carga frontal", "PHRASE"], ["mabe", "BROAD"], ["easy", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["8 kg", "PHRASE"], ["9 kg", "PHRASE"], ["10 kg", "PHRASE"], ["12 kg", "PHRASE"], ["battistella", "BROAD"], ["tolkar", "BROAD"], ["fagor", "BROAD"], ["speed queen", "PHRASE"], ["ipso", "BROAD"], ["alliance", "BROAD"], ["girbau", "BROAD"], ["maytag", "BROAD"], ["huebsch", "BROAD"], ["milnor", "BROAD"], ["tintorería", "BROAD"], ["tintoreria", "BROAD"], ["tintorerías", "BROAD"], ["tintorerias", "BROAD"], ["cerca de mí", "PHRASE"], ["cerca de mi", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["seminuevas", "BROAD"], ["segunda mano", "PHRASE"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["arrendamiento", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["cómo hacer", "PHRASE"], ["como hacer", "PHRASE"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["técnico", "BROAD"], ["tecnico", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["abrir una lavandería", "PHRASE"], ["abrir una lavanderia", "PHRASE"], ["negocio de lavandería", "PHRASE"], ["negocio de lavanderia", "PHRASE"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["autoservicio", "BROAD"], ["monedas", "BROAD"], ["semi industrial", "PHRASE"], ["semi industriales", "PHRASE"], ["semindustrial", "BROAD"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["túnel", "BROAD"], ["tunel", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["40 kg", "PHRASE"], ["40 kilos", "PHRASE"], ["45 kg", "PHRASE"], ["45 kilos", "PHRASE"], ["60 kg", "PHRASE"], ["60 kilos", "PHRASE"], ["lavadora industrial 100 kg", "PHRASE"], ["lavadoras industriales 100 kg", "PHRASE"], ["lavadora de 100 kilos", "PHRASE"], ["lavadoras de 100 kilos", "PHRASE"], ["lavandería hotelera", "EXACT"], ["lavanderia hotelera", "EXACT"], ["lavandería para hospital", "PHRASE"], ["lavanderia para hospital", "PHRASE"], ["lavandería institucional", "PHRASE"], ["lavanderia institucional", "PHRASE"], ["mangle industrial", "EXACT"], ["mangle de planchado", "PHRASE"], ["planchadora de rodillo", "PHRASE"], ["autos", "BROAD"], ["carros", "BROAD"], ["coches", "BROAD"], ["autolavado", "BROAD"], ["car wash", "PHRASE"], ["carwash", "BROAD"], ["vehículos", "BROAD"], ["vehiculos", "BROAD"]]}, "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "grupos": [{"nombre": "Lavadoras industriales para ropa", "kw": [["lavadoras industriales", "EXACT"], ["lavadora industrial para ropa", "EXACT"], ["lavadora industrial para ropa", "PHRASE"], ["lavadoras industriales de ropa", "PHRASE"], ["lavadora industrial de ropa", "PHRASE"], ["lavadoras y secadoras industriales", "PHRASE"]]}, {"nombre": "Lavadoras para sábanas", "kw": [["lavadora industrial para sábanas", "PHRASE"], ["lavadoras para sábanas", "PHRASE"], ["lavadora de sábanas industrial", "PHRASE"], ["lavadora industrial para blancos", "PHRASE"]]}]}, {"nombre": "AB · Lavadoras por capacidad y precio", "grupos": [{"nombre": "Lavadoras por capacidad", "kw": [["lavadora industrial 20 kg precio", "EXACT"], ["lavadora industrial 30 kg precio", "EXACT"], ["lavadora industrial 50 kg precio", "EXACT"], ["lavadora industrial 20 kg", "PHRASE"], ["lavadora industrial 30 kg", "PHRASE"], ["lavadora industrial 50 kg", "PHRASE"], ["lavadoras industriales precio", "PHRASE"], ["centro de lavado industrial", "PHRASE"]]}]}, {"nombre": "AB · Secadoras industriales", "grupos": [{"nombre": "Secadoras para ropa", "kw": [["secadoras industriales de ropa", "PHRASE"], ["secadoras industriales", "PHRASE"], ["secadora industrial de ropa", "EXACT"], ["secadora industrial para ropa", "PHRASE"], ["secadora industrial para sábanas", "PHRASE"]]}, {"nombre": "Secadoras por capacidad", "kw": [["secadora industrial 50 kg", "PHRASE"], ["secadora industrial 100 kg", "PHRASE"], ["secadora industrial 130 kg", "PHRASE"], ["secadora industrial 200 kg", "PHRASE"], ["secadora de 100 kilos", "PHRASE"], ["secadora de 200 kilos", "PHRASE"], ["secadora industrial 30 kg", "PHRASE"]]}]}, {"nombre": "AB · Hoteles y hospitales", "grupos": [{"nombre": "Hoteles", "kw": [["lavadora industrial para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["secadoras para lavandería hotelera", "PHRASE"], ["secadora industrial para hotel", "PHRASE"], ["equipo para lavandería hotelera", "PHRASE"]]}, {"nombre": "Hospitales", "kw": [["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["secadora industrial para hospital", "PHRASE"]]}]}, {"nombre": "AB · Mangles y planchado", "grupos": [{"nombre": "Mangles", "kw": [["mangle planchador", "PHRASE"], ["dobladora de ropa industrial", "PHRASE"], ["calandria industrial", "PHRASE"], ["mangle para sábanas", "PHRASE"]]}]}, {"nombre": "AB · Competencia depurada", "grupos": [{"nombre": "Marcas de la competencia", "kw": [["atlika lavadoras industriales", "EXACT"], ["lavadora industrial atlika", "EXACT"], ["servex lavadoras", "EXACT"], ["lavadora industrial servex", "EXACT"], ["domus lavadora industrial", "EXACT"], ["wascomat lavadora industrial", "EXACT"], ["lorsa lavadora industrial", "EXACT"], ["unimac lavadora industrial", "EXACT"], ["primus lavadora industrial", "EXACT"]]}]}, {"nombre": "AB · Marca Gamesail", "grupos": [{"nombre": "Gamesail", "kw": [["gamesail", "EXACT"], ["gamesail méxico", "PHRASE"], ["gamesail lavadoras industriales", "EXACT"]]}, {"nombre": "Lavadoras Gamesail", "kw": [["lavadoras gamesail", "PHRASE"], ["lavadora gamesail", "PHRASE"]]}, {"nombre": "Secadoras Gamesail", "kw": [["secadoras gamesail", "PHRASE"], ["secadora gamesail", "PHRASE"]]}]}]}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["franquicia", "BROAD"], ["franquicias", "BROAD"], ["franchise", "BROAD"], ["franquiciatario", "BROAD"], ["hotel", "BROAD"], ["hoteles", "BROAD"], ["hotelera", "BROAD"], ["hospital", "BROAD"], ["hospitales", "BROAD"], ["clínica", "BROAD"], ["clinica", "BROAD"], ["mangle", "BROAD"], ["mangles", "BROAD"], ["planchadora", "BROAD"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["gamesail", "BROAD"], ["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["100 kg", "PHRASE"], ["100 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["túnel", "BROAD"], ["tunel", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["60 kg", "PHRASE"], ["girbau", "BROAD"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["lavax", "BROAD"], ["lava 1", "PHRASE"], ["aquamatic", "BROAD"], ["5asec", "BROAD"], ["cerca de mí", "PHRASE"], ["cerca de mi", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["seminuevas", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["gratis", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["carga frontal", "PHRASE"]]}, "campanas": [{"nombre": "AB · Equipo para lavandería", "grupos": [{"nombre": "Lavadoras para lavandería", "kw": [["lavadoras para lavanderías", "PHRASE"], ["lavadoras industriales para lavandería", "PHRASE"], ["lavadoras para lavandería precios", "EXACT"], ["lavadoras para negocio", "EXACT"], ["lavadoras y secadoras para lavandería", "PHRASE"], ["equipo para lavandería", "PHRASE"]]}, {"nombre": "Semi industrial", "kw": [["lavadoras semi industriales", "PHRASE"], ["lavadora semi industrial", "PHRASE"], ["lavadora comercial", "PHRASE"]]}]}, {"nombre": "AB · Emprendimiento", "grupos": [{"nombre": "Abrir una lavandería", "kw": [["abrir una lavandería", "PHRASE"], ["poner una lavandería", "PHRASE"], ["abrir mi lavandería", "PHRASE"], ["poner mi lavandería", "PHRASE"]]}]}, {"nombre": "AB · Autoservicio y monedas", "grupos": [{"nombre": "Autoservicio", "kw": [["lavadoras de monedas", "EXACT"], ["equipo para lavandería autoservicio", "EXACT"], ["lavadoras de autoservicio", "PHRASE"], ["lavadora para lavandería autoservicio", "PHRASE"], ["lavadora de monedas", "PHRASE"], ["secadora de monedas", "PHRASE"]]}]}, {"nombre": "AB · Secadoras para lavandería", "grupos": [{"nombre": "Secadoras para lavandería", "kw": [["secadora de ropa para lavandería", "PHRASE"], ["secadora lavandería", "PHRASE"], ["secadora semi industrial", "PHRASE"], ["secadoras semi industriales", "PHRASE"]]}]}, {"nombre": "AB · Marcas comerciales", "grupos": [{"nombre": "Maytag y LG", "kw": [["lavadora maytag industrial", "PHRASE"], ["lavadora maytag comercial", "PHRASE"], ["lg lavadora industrial", "PHRASE"], ["lavadora lg comercial", "PHRASE"]]}]}, {"nombre": "AB · Marca Quick Laundry", "grupos": [{"nombre": "Quick Laundry", "kw": [["quick laundry", "EXACT"], ["quick laundry méxico", "PHRASE"], ["quicklaundry", "EXACT"], ["quick laundry equipo", "PHRASE"]]}, {"nombre": "Supliese", "kw": [["supliese", "EXACT"], ["supliese", "PHRASE"], ["supliese gómez", "EXACT"]]}]}]}, {"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://kingstar.com.mx/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["auto", "BROAD"], ["autos", "BROAD"], ["carro", "BROAD"], ["carros", "BROAD"], ["coche", "BROAD"], ["coches", "BROAD"], ["automóvil", "BROAD"], ["automovil", "BROAD"], ["automóviles", "BROAD"], ["automoviles", "BROAD"], ["vehículo", "BROAD"], ["vehiculo", "BROAD"], ["vehículos", "BROAD"], ["vehiculos", "BROAD"], ["camión", "BROAD"], ["camion", "BROAD"], ["camiones", "BROAD"], ["camioneta", "BROAD"], ["camionetas", "BROAD"], ["moto", "BROAD"], ["motos", "BROAD"], ["car wash", "PHRASE"], ["carwash", "BROAD"], ["autolavado", "BROAD"], ["autolavados", "BROAD"], ["auto lavado", "PHRASE"], ["lavacoches", "BROAD"], ["tráiler", "BROAD"], ["trailer", "BROAD"], ["tráileres", "BROAD"], ["traileres", "BROAD"], ["encerado", "BROAD"], ["detallado", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["abrir una lavandería", "PHRASE"], ["abrir una lavanderia", "PHRASE"], ["negocio de lavandería", "PHRASE"], ["negocio de lavanderia", "PHRASE"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["autoservicio", "BROAD"], ["monedas", "BROAD"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["gamesail", "BROAD"], ["20 kg", "PHRASE"], ["30 kg", "PHRASE"], ["30 kilos", "PHRASE"], ["girbau", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["carga frontal", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["hisense", "BROAD"], ["fuzzy logic", "PHRASE"], ["heavy duty", "PHRASE"], ["cobija", "BROAD"], ["cobijas", "BROAD"], ["edredón", "BROAD"], ["edredon", "BROAD"], ["edredones", "BROAD"], ["15 kg", "PHRASE"], ["15 kilos", "PHRASE"], ["20 kilos", "PHRASE"], ["30kg", "PHRASE"], ["10 kg", "PHRASE"], ["22 kg", "PHRASE"], ["24 kg", "PHRASE"], ["24kg", "PHRASE"], ["25 kg", "PHRASE"], ["26 kg", "PHRASE"], ["28 kg", "PHRASE"], ["24 kilos", "PHRASE"], ["25 kilos", "PHRASE"], ["26 kilos", "PHRASE"], ["28 kilos", "PHRASE"], ["speed queen", "PHRASE"], ["dexter", "BROAD"], ["wascomat", "BROAD"], ["unimac", "BROAD"], ["electrolux", "BROAD"], ["primus", "BROAD"], ["lorsa", "BROAD"], ["alliance", "BROAD"], ["ipso", "BROAD"], ["cobertor", "BROAD"], ["cobertores", "BROAD"], ["king size", "PHRASE"], ["lavadora grande", "EXACT"], ["lavadoras grandes", "EXACT"], ["lavadora potente", "EXACT"], ["domus", "BROAD"], ["18 kg", "PHRASE"], ["18 kilos", "PHRASE"]]}, "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "grupos": [{"nombre": "Lavadoras de alta capacidad", "kw": [["lavadoras de 100 kilos", "PHRASE"], ["lavadora industrial 100 kg", "PHRASE"], ["lavadora industrial 60 kg", "PHRASE"], ["lavadoras de alta capacidad", "PHRASE"], ["lavadora industrial de alta capacidad", "PHRASE"]]}, {"nombre": "Secadoras de alta capacidad", "kw": [["secadora industrial 100 kg", "PHRASE"], ["secadoras de 100 kilos", "PHRASE"], ["secadora industrial 130 kg", "PHRASE"], ["secadora industrial 200 kg", "PHRASE"], ["secadoras industriales de alta capacidad", "PHRASE"], ["secadora industrial 50 kg", "PHRASE"]]}]}, {"nombre": "AB · Lavandería hotelera e institucional", "grupos": [{"nombre": "Lavandería hotelera", "kw": [["lavandería hotelera", "EXACT"], ["proyecto de lavandería hotelera", "PHRASE"], ["lavandería industrial para hotel", "PHRASE"], ["lavandería para hotel", "PHRASE"]]}, {"nombre": "Hospitales e institucional", "kw": [["lavandería para hospital", "PHRASE"], ["lavandería hospitalaria", "PHRASE"], ["lavandería institucional", "PHRASE"]]}, {"nombre": "Lavadoras para hotel y hospital", "kw": [["lavadora industrial para hotel", "PHRASE"], ["lavadoras industriales para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["lavadora industrial 50 kg", "PHRASE"]]}]}, {"nombre": "AB · Mangles y planchado", "grupos": [{"nombre": "Mangles", "kw": [["mangle de planchado", "PHRASE"], ["mangle industrial", "PHRASE"], ["planchadora de rodillo industrial", "PHRASE"]]}]}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "grupos": [{"nombre": "20 a 45 kg", "kw": [["lavadoras y secadoras de 20 a 45 kg", "PHRASE"], ["lavadora industrial 40 kg", "PHRASE"], ["secadora industrial 40 kg", "PHRASE"], ["lavadora de 40 kilos", "PHRASE"], ["lavadora industrial 45 kg", "PHRASE"], ["secadora industrial 45 kg", "PHRASE"]]}]}, {"nombre": "AB · Túnel de lavado", "grupos": [{"nombre": "Túnel de lavado para ropa", "kw": [["túnel de lavado industrial", "PHRASE"], ["túnel de lavado para ropa", "PHRASE"], ["túnel de lavado de ropa", "PHRASE"], ["lavadora de túnel", "PHRASE"], ["sistema de lavado continuo", "PHRASE"], ["túnel de lavado para hotel", "PHRASE"], ["túnel de lavado para lavandería", "PHRASE"]]}]}, {"nombre": "AB · Marca CLM", "grupos": [{"nombre": "CLM", "kw": [["clm méxico", "EXACT"], ["clmmexico", "EXACT"], ["clm lavandería", "PHRASE"], ["clm lavadoras", "PHRASE"], ["clm lavandería industrial", "PHRASE"], ["kingstar", "EXACT"], ["kingstar méxico", "PHRASE"], ["kingstar lavadoras", "PHRASE"], ["kingstar lavandería", "PHRASE"], ["king star lavadoras", "PHRASE"]]}]}]}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadoras industriales", "EXACT"], ["lavadora industrial", "EXACT"], ["lavadoras para lavanderia", "EXACT"], ["lavadoras para lavandería", "EXACT"], ["lavadoras comerciales", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["lavadora industrial precio", "EXACT"], ["precio de lavadora industrial", "PHRASE"], ["precio de lavadoras industriales", "PHRASE"], ["precio lavadoras industriales", "PHRASE"], ["costo lavadora industrial", "PHRASE"], ["costo de lavadora industrial", "PHRASE"], ["costo de lavadoras industriales", "PHRASE"], ["cuánto cuesta una lavadora industrial", "PHRASE"], ["cuanto cuesta una lavadora industrial", "PHRASE"], ["cuánto cuestan las lavadoras industriales", "PHRASE"], ["cuanto cuestan las lavadoras industriales", "PHRASE"], ["cuánto vale una lavadora industrial", "PHRASE"], ["cuanto vale una lavadora industrial", "PHRASE"], ["para negocio", "PHRASE"], ["commercial washer", "PHRASE"], ["partes para lavadora industrial", "PHRASE"], ["partes para lavadoras industriales", "PHRASE"], ["refacciones para lavadora industrial", "PHRASE"], ["refacciones para lavadoras industriales", "PHRASE"], ["refacciones para secadora industrial", "PHRASE"], ["refacciones para secadoras industriales", "PHRASE"], ["refacciones lavandería industrial", "PHRASE"], ["refacciones lavanderia industrial", "PHRASE"], ["curso", "BROAD"], ["cursos", "BROAD"], ["tutorial", "BROAD"], ["cómo reparar", "PHRASE"], ["como reparar", "PHRASE"], ["diagrama", "BROAD"], ["diagramas", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["manuales", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["easy", "BROAD"], ["de casa", "PHRASE"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["carga frontal", "PHRASE"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["empleo", "BROAD"], ["trabajo", "BROAD"], ["sueldo", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"]]}, "campanas": [{"nombre": "AB · Servicio técnico industrial", "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico de lavadoras industriales", "PHRASE"], ["técnico en lavadoras industriales", "PHRASE"], ["técnico en lavandería industrial", "PHRASE"], ["técnico de secadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Reparación y mantenimiento", "grupos": [{"nombre": "Reparación", "kw": [["reparación de lavadoras industriales", "PHRASE"], ["reparación de lavadora industrial", "PHRASE"]]}, {"nombre": "Mantenimiento correctivo", "kw": [["mantenimiento correctivo lavadora industrial", "PHRASE"], ["mantenimiento correctivo lavadoras industriales", "PHRASE"], ["mantenimiento correctivo lavadora", "PHRASE"]]}, {"nombre": "Mantenimiento preventivo", "kw": [["mantenimiento preventivo lavadoras industriales", "PHRASE"], ["mantenimiento lavandería industrial", "PHRASE"], ["mantenimiento de lavadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Refacciones Girbau y Gamesail", "grupos": [{"nombre": "Refacciones Girbau", "kw": [["refacciones girbau", "EXACT"], ["refacciones girbau", "PHRASE"], ["refacciones para lavadora girbau", "PHRASE"], ["refacciones para secadora girbau", "PHRASE"], ["partes girbau", "PHRASE"], ["refacciones girbau", "BROAD"]]}, {"nombre": "Refacciones Gamesail", "kw": [["refacciones gamesail", "EXACT"], ["refacciones gamesail", "PHRASE"], ["partes gamesail", "PHRASE"], ["refacciones gamesail", "BROAD"]]}]}, {"nombre": "AB · Servicio a secadoras", "grupos": [{"nombre": "Secadoras", "kw": [["reparación de secadoras industriales", "PHRASE"], ["servicio a secadoras industriales", "PHRASE"], ["mantenimiento de secadoras industriales", "PHRASE"], ["reparación secadoras industriales", "BROAD"]]}]}, {"nombre": "AB · Instalación", "grupos": [{"nombre": "Instalación", "kw": [["instalación de lavandería industrial", "PHRASE"], ["instalación de equipo de lavandería", "PHRASE"], ["instalación lavandería industrial", "BROAD"]]}]}, {"nombre": "AB · Servicio a lavanderías", "grupos": [{"nombre": "Pólizas", "kw": [["mantenimiento para lavandería de autoservicio", "PHRASE"], ["póliza de mantenimiento lavandería", "PHRASE"], ["mantenimiento lavandería autoservicio", "BROAD"]]}]}]}, {"cuenta": "860-582-6837", "nombre": "Girbau", "url": "https://girbaupro.com/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadora industrial", "EXACT"], ["lavadoras industriales", "EXACT"], ["lavadora industrial precio", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["precio lavadora industrial", "EXACT"], ["lavadora industrial 12 kg", "EXACT"], ["lavadora industrial 14 kg", "EXACT"], ["lavadora industrial 30 kg", "EXACT"], ["lavadora industrial 30 kg precio", "EXACT"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["lorsa", "BROAD"], ["lorza", "BROAD"], ["wascomat", "BROAD"], ["unimac", "BROAD"], ["maytag", "BROAD"], ["alliance", "BROAD"], ["speed queen", "PHRASE"], ["primus", "BROAD"], ["electrolux", "BROAD"], ["lg", "BROAD"], ["imesa", "BROAD"], ["sertec", "BROAD"], ["edro", "BROAD"], ["lavartind", "BROAD"], ["whirlpool", "BROAD"], ["braun", "BROAD"], ["gamesail", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["continental girbau", "PHRASE"], ["empleo", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["usada", "BROAD"], ["usadas", "BROAD"], ["renta", "BROAD"]]}, "campanas": [{"nombre": "AB · Marca Girbau", "grupos": [{"nombre": "Girbau", "kw": [["girbau", "EXACT"], ["girbau", "PHRASE"], ["lavadoras girbau", "PHRASE"], ["girbau méxico", "PHRASE"], ["distribuidor girbau", "PHRASE"], ["girbau occidente", "PHRASE"]]}]}, {"nombre": "AB · Girbau Smart Plus", "grupos": [{"nombre": "Smart Plus", "kw": [["girbau smart plus", "PHRASE"], ["smart plus girbau", "PHRASE"], ["lavadora girbau smart plus", "PHRASE"]]}]}, {"nombre": "AB · Girbau por capacidad y sector", "grupos": [{"nombre": "Capacidad", "kw": [["lavadora girbau 12 kg", "PHRASE"], ["lavadora girbau 14 kg", "PHRASE"], ["girbau 12 kg", "PHRASE"], ["girbau 14 kg", "PHRASE"], ["secadora girbau", "PHRASE"], ["lavadora industrial girbau", "PHRASE"]]}, {"nombre": "Sector", "kw": [["lavadora girbau para hotel", "PHRASE"], ["mangle girbau", "PHRASE"], ["girbau para lavandería", "PHRASE"]]}]}, {"nombre": "AB · Servicio técnico Girbau", "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico girbau", "PHRASE"], ["reparación girbau", "PHRASE"], ["mantenimiento girbau", "PHRASE"]]}]}]}];
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
        ops.push({ adGroupAdOperation: { create: { adGroup: rnGrupo, status: 'ENABLED', ad: { finalUrls: [g.url || PLAN.url],
          responsiveSearchAd: { headlines: g.h.map(function (t) { return { text: t }; }), descriptions: g.d.map(function (t) { return { text: t }; }),
            path1: g.p[0], path2: g.p[1] } } } } });
        donde.push('anuncio de «' + nombre + '» (' + g.h.length + ' títulos, ' + g.d.length + ' descripciones, a ' + (g.url || PLAN.url) + ')');
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
 * Atelback · Anuncios nuevos con las palabras que busca la gente — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): agrega un anuncio nuevo, encendido,
 * en los grupos donde Google dice «anuncio poco relevante». Sus títulos repiten lo que la persona buscó. El anuncio que
 * ya está en el grupo se queda como está: no se pausa, no se edita y no se borra. Tampoco toca presupuestos, topes,
 * palabras clave ni páginas. Si el anuncio nuevo ya existe, no lo repite.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "url": "https://gamesail.mx/", "anuncios": []}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "anuncios": [{"campana": "AB · Equipo para lavandería", "grupo": "Lavadoras para lavandería", "h": ["Lavadoras para Lavanderías", "Lavadoras para Negocio", "Lavadoras Industriales", "Lavadoras y Secadoras", "Equipo para Lavandería", "Precios de Lavadoras", "Lavadoras para tu Negocio", "Lavadora Industrial", "Cotiza por WhatsApp", "Pide tu Precio Hoy", "Para Lavandería Comercial", "Quick Laundry", "Te Ayudamos a Elegir"], "d": ["Lavadoras para lavandería y para negocio, industriales y semi industriales. Cotiza hoy.", "Lavadoras y secadoras para lavandería. Te damos precio y te ayudamos a elegir.", "Equipo para lavandería nueva o que va a crecer. Escríbenos por WhatsApp y cotiza.", "Quick Laundry: lavadoras industriales para lavandería con asesoría para elegir."], "p": ["lavadoras", "negocio"], "url": "https://quicklaundry.store/"}]}, {"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://kingstar.com.mx/", "anuncios": []}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "anuncios": [{"campana": "AB · Reparación y mantenimiento", "grupo": "Reparación", "h": ["Reparación Lavadora Industrial", "Reparación de Lavadoras", "Lavadoras Industriales", "Reparamos tu Lavadora", "Técnicos en Reparación", "Reparación en tu Negocio", "Agenda tu Reparación", "Diagnóstico de tu Equipo", "Habla con un Técnico", "Servicio Técnico Industrial", "Cotiza por WhatsApp"], "d": ["Reparación de lavadoras industriales con técnicos en equipo industrial. Agenda tu visita.", "Reparamos lavadoras industriales de lavanderías, hoteles y hospitales.", "Escríbenos por WhatsApp: te damos diagnóstico y cotización de la reparación.", "Reparación de lavadora industrial y mantenimiento correctivo. Habla con un técnico."], "p": ["reparacion", "industrial"], "url": "https://laundrysolutions.store/reparacion-lavadoras-industriales"}]}, {"cuenta": "860-582-6837", "nombre": "Girbau", "url": "https://girbaupro.com/", "anuncios": []}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function firma(titulos) { return titulos.map(function (t) { return t.toLowerCase(); }).sort().join('|'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('ANUNCIOS NUEVOS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  if (!PLAN.anuncios.length) { Logger.log('Nada que agregar en esta cuenta.'); return; }

  var grupos = {};
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group.resource_name FROM ad_group ' +
    "WHERE ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var g = it.next();
    grupos[g.campaign.name + ' > ' + g.adGroup.name] = { rn: g.adGroup.resourceName, anuncios: 0, firmas: {} };
  }
  var ita = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad ' +
    "WHERE ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED'");
  while (ita.hasNext()) {
    var a = ita.next(), gr = grupos[a.campaign.name + ' > ' + a.adGroup.name];
    if (!gr) continue;
    gr.anuncios++;
    gr.firmas[firma(((a.adGroupAd.ad.responsiveSearchAd || {}).headlines || []).map(function (h) { return h.text; }))] = true;
  }

  var ops = [], donde = [];
  PLAN.anuncios.forEach(function (n) {
    var nombre = n.campana + ' > ' + n.grupo, gr = grupos[nombre];
    if (!gr) { Logger.log('AVISO: no existe el grupo ' + nombre + '. Se salta.'); return; }
    if (gr.firmas[firma(n.h)]) { Logger.log('«' + nombre + '»: el anuncio nuevo ya está. No se repite.'); return; }
    if (gr.anuncios >= 3) { Logger.log('AVISO «' + nombre + '»: ya tiene ' + gr.anuncios + ' anuncios (Google permite 3). Se salta.'); return; }
    ops.push({ adGroupAdOperation: { create: { adGroup: gr.rn, status: 'ENABLED', ad: { finalUrls: [n.url || PLAN.url],
      responsiveSearchAd: { headlines: n.h.map(function (t) { return { text: t }; }), descriptions: n.d.map(function (t) { return { text: t }; }),
        path1: n.p[0], path2: n.p[1] } } } } });
    donde.push('anuncio nuevo en «' + nombre + '» (' + n.h.length + ' títulos, ' + n.d.length + ' descripciones, a ' + (n.url || PLAN.url) +
      ') · títulos: ' + n.h.join(' · ') + ' · el anuncio que ya tenía se queda');
  });
  if (!ops.length) { Logger.log('Nada que agregar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) Logger.log((vista ? 'SE HARÍA: ' : 'HECHO: ') + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) Logger.log((ops.length - malos) + ' anuncio(s) por agregar' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  else Logger.log('LISTO: ' + (ops.length - malos) + ' anuncio(s) agregados' + (malos ? ', ' + malos + ' rechazados por Google' : '') +
    '. Google los revisa en unas horas; mañana el script «por qué no sale» dirá si mejoró la relevancia.');
}

  main();
}

function paso3() {
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

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "prefijo": "AB · ", "url": "https://gamesail.mx/", "ajustes": {}}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "prefijo": "AB · ", "url": "https://quicklaundry.store/", "ajustes": {"presupuesto": {"Emprendimiento": 40, "Autoservicio y monedas": 34, "Marca Quick Laundry": 14}, "arriba": {"Marca Quick Laundry": {"cuota": 0.8, "tope": 10}}, "presencia": ["Campaña Search Marcas"]}}, {"cuenta": "993-525-8739", "nombre": "CLM", "prefijo": "AB · ", "url": "https://kingstar.com.mx/", "ajustes": {"presupuesto": {"Alta capacidad 60 kg o más": 222, "Lavandería hotelera e institucional": 97, "Marca CLM": 20, "Túnel de lavado": 92}, "arriba": {"Marca CLM": {"cuota": 0.8, "tope": 15}}}}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "url": "https://laundrysolutions.store/", "ajustes": {"pausar_palabras": [["Servicio técnico industrial", "Servicio técnico", "técnico lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Reparación", "reparación lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Mantenimiento preventivo", "mantenimiento lavadoras industriales", "BROAD"]], "presupuesto": {"Reparación y mantenimiento": 156, "Servicio técnico industrial": 75}}}, {"cuenta": "860-582-6837", "nombre": "Girbau", "prefijo": "AB · ", "url": "https://girbaupro.com/", "ajustes": {"arriba": {"Marca Girbau": {"cuota": 0.8, "tope": 25}}, "presupuesto": {"Marca Girbau": 62, "Girbau Smart Plus": 10, "Girbau por capacidad y sector": 15, "Servicio técnico Girbau": 10}, "activar": {"Max Rendimiento - Girbau": 90}}}];
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
    FALLO = true;
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
var FALLO = false;   // si una revisión falla, no se enciende ninguna campaña anterior
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('AJUSTES · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var aj = PLAN.ajustes || {};
  var pausar = aj.pausar || [], presupuesto = aj.presupuesto || {}, palabras = aj.pausar_palabras || [], topes = aj.topes || {},
      arriba = aj.arriba || {}, activar = aj.activar || {}, presencia = aj.presencia || [];
  if (!pausar.length && !Object.keys(presupuesto).length && !palabras.length && !Object.keys(topes).length && !Object.keys(arriba).length &&
      !Object.keys(activar).length && !presencia.length) { Logger.log('Nada que ajustar en esta cuenta por ahora.'); return; }

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
  function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; }
  var nuestra = sitio(PLAN.url), noEncendio = [];

  // Campañas anteriores que se vuelven a encender: solo si todos sus anuncios ya llevan a la página de la marca
  Object.keys(activar).forEach(function (n) {
    var monto = activar[n], f = filas("SELECT campaign.resource_name, campaign.status, campaign.advertising_channel_type, campaign_budget.resource_name, " +
      "campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign WHERE campaign.name = '" + n.replace(/'/g, "\\'") + "' AND campaign.status != 'REMOVED'", 'la campaña ' + n)[0];
    if (!f) { que.push('«' + n + '»: no existe en esta cuenta. Se salta.'); return; }
    if (f.campaign.status === 'ENABLED') { que.push('«' + n + '»: ya está encendida.'); return; }
    var malas = {};
    FALLO = false;
    filas("SELECT ad_group_ad.ad.final_urls FROM ad_group_ad WHERE campaign.resource_name = '" + f.campaign.resourceName + "' AND ad_group_ad.status = 'ENABLED' " +
      "AND ad_group.status = 'ENABLED'", 'los anuncios de ' + n).forEach(function (a) {
      (a.adGroupAd.ad.finalUrls || []).forEach(function (u) { if (sitio(u) !== nuestra) malas[sitio(u) || '(sin dirección)'] = true; });
    });
    filas("SELECT asset_group.final_urls FROM asset_group WHERE campaign.resource_name = '" + f.campaign.resourceName + "' AND asset_group.status = 'ENABLED'",
      'los grupos de recursos de ' + n).forEach(function (a) {
      (a.assetGroup.finalUrls || []).forEach(function (u) { if (sitio(u) !== nuestra) malas[sitio(u) || '(sin dirección)'] = true; });
    });
    // Enlaces de sitio y otros recursos de la campaña que llevan a una página
    filas("SELECT campaign.resource_name, asset.final_urls, campaign_asset.field_type FROM campaign_asset WHERE campaign.resource_name = '" + f.campaign.resourceName + "' " +
      "AND campaign_asset.status = 'ENABLED'", 'los enlaces de ' + n).forEach(function (a) {
      (a.asset.finalUrls || []).forEach(function (u) { if (sitio(u) !== nuestra) malas[sitio(u) + ' (enlace de sitio u otro recurso)'] = true; });
    });
    if (FALLO) {
      que.push('NO SE ENCIENDE «' + n + '»: no se pudo revisar a dónde mandan todos sus anuncios y enlaces (ver arriba). Manda este registro.');
      noEncendio.push(n);
      return;
    }
    if (Object.keys(malas).length) {
      que.push('NO SE ENCIENDE «' + n + '»: todavía manda a ' + Object.keys(malas).join(', ') + ' y no a ' + nuestra + '. Primero hay que cambiarle la página.');
      noEncendio.push(n);
      return;
    }
    ops.push({ campaignOperation: { update: { resourceName: f.campaign.resourceName, status: 'ENABLED',
      geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE' } }, updateMask: 'status,geoTargetTypeSetting.positiveGeoTargetType' } });
    donde.push('encender «' + n + '»');
    if (f.campaignBudget.explicitlyShared) {
      que.push('ENCENDER «' + n + '» (manda a ' + nuestra + '; solo personas en México). AVISO: su presupuesto es compartido; revísalo a mano.');
    } else {
      ops.push({ campaignBudgetOperation: { update: { resourceName: f.campaignBudget.resourceName, amountMicros: Math.round(monto * 1e6) }, updateMask: 'amountMicros' } });
      donde.push('presupuesto de «' + n + '»');
      que.push('ENCENDER «' + n + '» con ' + dinero(monto) + ' al día (antes tenía ' + dinero(Number(f.campaignBudget.amountMicros || 0) / 1e6) +
        '; manda a ' + nuestra + '; solo personas en México)');
    }
    despues += monto;
  });
  // Campañas encendidas que deben mostrarse solo a personas que están en México
  presencia.forEach(function (n) {
    var c = C[n];
    if (!c) return;
    ops.push({ campaignOperation: { update: { resourceName: c.rn, geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE' } },
      updateMask: 'geoTargetTypeSetting.positiveGeoTargetType' } });
    donde.push('zona de «' + n + '»');
    que.push('ZONA «' + n + '»: solo personas que están en México (antes también «interesadas» desde otros países)');
  });
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
    // Las bajadas pagan las campañas que se encienden: si alguna no se encendió, no se baja nada
    if (nuevo < c.monto && noEncendio.length) { que.push('«' + n + '»: se queda en ' + dinero(c.monto) + ' (iba a bajar para pagar «' + noEncendio.join('», «') + '», que no se encendió).'); return; }
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

function main() {
  Logger.log('');
  Logger.log('########## PASO 1 DE 3 · EXCLUSIONES Y PALABRAS CLAVE ##########');
  try { paso1(); } catch (e) {
    Logger.log('ERROR en el paso 1: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 2 DE 3 · ANUNCIOS NUEVOS ##########');
  try { paso2(); } catch (e) {
    Logger.log('ERROR en el paso 2: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 3 DE 3 · AJUSTES ##########');
  try { paso3(); } catch (e) {
    Logger.log('ERROR en el paso 3: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('LISTO: se corrieron los 3 pasos. Copia todo el registro y mándalo.');
}
