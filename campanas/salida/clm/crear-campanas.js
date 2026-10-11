/**
 * Atelback · Crear campañas de arranque — CLM (993-525-8739)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: crea campañas nuevas de Búsqueda EN PAUSA, con sus grupos, palabras clave, anuncios, negativas,
 * ubicación e idioma, y una lista de negativas compartida. Todo va en una sola operación: si algo falla,
 * no se crea nada. NO modifica, pausa, activa ni borra nada que ya exista en la cuenta.
 *
 * CÓMO SE USA (dentro de la cuenta 993-525-8739, no en el MCC):
 *   1. Herramientas > Acciones masivas > Scripts > "+" > pegar este archivo completo.
 *   2. Autorizar.
 *   3. VISTA PREVIA. Si el registro termina en "VISTA PREVIA SIN ERRORES", dar EJECUTAR.
 *   4. Revisar las campañas creadas. Se activan solo con el OK del cliente.
 */

// Ubicación: 2484 = México completo. Si la cuenta cubre solo algunos estados, reemplazar por sus IDs
// (Herramientas > Ubicaciones, o la lista de geoTargetConstants de Google Ads).
var UBICACIONES = [2484];
// Idioma: 1003 = español.
var IDIOMAS = [1003];
// La página de destino de esta cuenta todavía no está confirmada si esto es true: el script se detiene.
var URL_PENDIENTE = false;

var PLAN = {"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://clmmexico.com/", "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["auto", "BROAD"], ["autos", "BROAD"], ["carro", "BROAD"], ["carros", "BROAD"], ["coche", "BROAD"], ["coches", "BROAD"], ["automóvil", "BROAD"], ["automovil", "BROAD"], ["automóviles", "BROAD"], ["automoviles", "BROAD"], ["vehículo", "BROAD"], ["vehiculo", "BROAD"], ["vehículos", "BROAD"], ["vehiculos", "BROAD"], ["camión", "BROAD"], ["camion", "BROAD"], ["camiones", "BROAD"], ["camioneta", "BROAD"], ["camionetas", "BROAD"], ["moto", "BROAD"], ["motos", "BROAD"], ["car wash", "PHRASE"], ["carwash", "BROAD"], ["autolavado", "BROAD"], ["autolavados", "BROAD"], ["auto lavado", "PHRASE"], ["lavacoches", "BROAD"], ["tráiler", "BROAD"], ["trailer", "BROAD"], ["tráileres", "BROAD"], ["traileres", "BROAD"], ["encerado", "BROAD"], ["detallado", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["abrir una lavandería", "PHRASE"], ["abrir una lavanderia", "PHRASE"], ["negocio de lavandería", "PHRASE"], ["negocio de lavanderia", "PHRASE"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["autoservicio", "BROAD"], ["monedas", "BROAD"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["gamesail", "BROAD"], ["20 kg", "PHRASE"], ["30 kg", "PHRASE"], ["30 kilos", "PHRASE"], ["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["secadora industrial 100 kg", "PHRASE"], ["secadora de 100 kilos", "PHRASE"], ["secadoras de 100 kilos", "PHRASE"], ["lavadora industrial para hotel", "PHRASE"], ["lavadoras industriales para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["lavadoras para lavanderia hotelera", "PHRASE"], ["lavadora para lavandería hotelera", "PHRASE"], ["lavadora para lavanderia hotelera", "PHRASE"], ["secadoras para lavandería hotelera", "PHRASE"], ["secadoras para lavanderia hotelera", "PHRASE"], ["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["mangle planchador", "PHRASE"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["para sábanas", "PHRASE"], ["para sabanas", "PHRASE"], ["girbau", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["carga frontal", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"]]}, "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "diario": 92, "cpc": 18, "negativas": [], "grupos": [{"nombre": "Lavadoras de alta capacidad", "kw": [["lavadoras de 100 kilos", "PHRASE"], ["lavadora industrial 100 kg", "PHRASE"], ["lavadora industrial 60 kg", "PHRASE"], ["lavadoras de alta capacidad", "PHRASE"], ["lavadora industrial de alta capacidad", "PHRASE"]], "h": ["Lavadoras de Alta Capacidad", "Lavadora Industrial 100 kg", "Lavadora Industrial 60 kg", "De 60 kg en Adelante", "Lavandería Industrial", "Proyectos de Lavandería", "Te Ayudamos a Elegir", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras industriales de alta capacidad, de 60 kg en adelante. Cotiza hoy.", "Equipo CLM para lavanderías industriales, hoteles y hospitales de gran volumen.", "Te ayudamos a dimensionar la lavandería según los kilos que procesas al día.", "Solicita tu cotización y habla con un asesor sobre tu proyecto."], "p": ["alta", "capacidad"]}]}, {"nombre": "AB · Lavandería hotelera e institucional", "diario": 77, "cpc": 18, "negativas": [], "grupos": [{"nombre": "Lavandería hotelera", "kw": [["lavandería hotelera", "EXACT"], ["proyecto de lavandería hotelera", "PHRASE"], ["lavandería industrial para hotel", "PHRASE"], ["lavandería para hotel", "PHRASE"]], "h": ["Lavandería Hotelera", "Lavandería para Hoteles", "Proyectos de Lavandería", "Equipo de Alta Capacidad", "Túnel de Lavado para Ropa", "Mangles y Planchado", "Te Ayudamos a Planearla", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavandería hotelera completa: lavado, secado y planchado de alta capacidad. Cotiza hoy.", "CLM diseña y equipa la lavandería de tu hotel según los kilos que procesas al día.", "Túnel de lavado, lavadoras de alta capacidad y mangles para hoteles.", "Solicita tu cotización y habla con un asesor sobre tu proyecto."], "p": ["lavanderia", "hotelera"]}, {"nombre": "Hospitales e institucional", "kw": [["lavandería para hospital", "PHRASE"], ["lavandería hospitalaria", "PHRASE"], ["lavandería institucional", "PHRASE"]], "h": ["Lavandería Hospitalaria", "Lavandería Institucional", "Proyectos de Lavandería", "Equipo de Alta Capacidad", "Túnel de Lavado para Ropa", "Te Ayudamos a Planearla", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavandería para hospitales e instituciones: lavado, secado y planchado. Cotiza hoy.", "CLM diseña y equipa tu lavandería según los kilos que procesas al día.", "Solicita tu cotización y habla con un asesor sobre tu proyecto."], "p": ["lavanderia", "hospital"]}]}, {"nombre": "AB · Mangles y planchado", "diario": 46, "cpc": 18, "negativas": [], "grupos": [{"nombre": "Mangles", "kw": [["mangle de planchado", "PHRASE"], ["mangle industrial", "PHRASE"], ["planchadora de rodillo industrial", "PHRASE"]], "h": ["Mangle Industrial", "Mangle de Planchado", "Planchadora de Rodillo", "Planchado de Alta Capacidad", "Para Hoteles y Hospitales", "Te Ayudamos a Elegir", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Mangles industriales y planchadoras de rodillo de alta capacidad. Cotiza hoy.", "Equipo CLM para planchar sábanas y blancos en hoteles, hospitales y lavanderías.", "Solicita tu cotización y habla con un asesor sobre tu operación."], "p": ["mangles", "planchado"]}]}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "diario": 46, "cpc": 15, "negativas": [], "grupos": [{"nombre": "20 a 45 kg", "kw": [["lavadoras y secadoras de 20 a 45 kg", "PHRASE"], ["lavadora industrial 40 kg", "PHRASE"], ["secadora industrial 40 kg", "PHRASE"], ["lavadora de 40 kilos", "PHRASE"], ["lavadora industrial 45 kg", "PHRASE"], ["secadora industrial 45 kg", "PHRASE"]], "h": ["Lavadora Industrial 40 kg", "Secadora Industrial 40 kg", "Lavadoras de 20 a 45 kg", "Capacidad de 40 kg", "Lavandería Industrial", "Te Ayudamos a Elegir", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras industriales de 20 a 45 kg, incluida la de 40 kg. Cotiza hoy.", "Equipo CLM para lavanderías industriales, hoteles y hospitales.", "Solicita tu cotización y habla con un asesor sobre la capacidad que necesitas."], "p": ["lavadoras", "40-kg"]}]}, {"nombre": "AB · Túnel de lavado", "diario": 31, "cpc": 30, "negativas": [], "grupos": [{"nombre": "Túnel de lavado para ropa", "kw": [["túnel de lavado industrial", "PHRASE"], ["túnel de lavado para ropa", "PHRASE"], ["túnel de lavado de ropa", "PHRASE"], ["lavadora de túnel", "PHRASE"], ["sistema de lavado continuo", "PHRASE"], ["túnel de lavado para hotel", "PHRASE"], ["túnel de lavado para lavandería", "PHRASE"]], "h": ["Túnel de Lavado para Ropa", "Túnel de Lavado Industrial", "Lavado Continuo de Ropa", "Para Hoteles y Hospitales", "Lavandería de Gran Volumen", "Proyectos de Lavandería", "Te Ayudamos a Planearlo", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Túnel de lavado para ropa: lavado continuo para lavanderías de gran volumen.", "CLM diseña e instala túneles de lavado para hoteles, hospitales y lavanderías.", "Te ayudamos a dimensionar el túnel según los kilos de ropa que procesas al día.", "Solicita tu cotización y habla con un asesor sobre tu proyecto."], "p": ["tunel", "ropa"]}]}, {"nombre": "AB · Marca CLM", "diario": 15, "cpc": 8, "negativas": [], "grupos": [{"nombre": "CLM", "kw": [["clm méxico", "EXACT"], ["clmmexico", "EXACT"], ["clm lavandería", "PHRASE"], ["clm lavadoras", "PHRASE"], ["clm lavandería industrial", "PHRASE"]], "h": ["CLM México", "Lavandería Industrial", "Túnel de Lavado para Ropa", "Equipo de Alta Capacidad", "Sitio Oficial CLM", "Te Ayudamos a Elegir", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["CLM México: lavandería industrial, túnel de lavado y alta capacidad. Cotiza hoy.", "Equipo para hoteles, hospitales y lavanderías de gran volumen.", "Solicita tu cotización y habla con un asesor sobre tu proyecto."], "p": ["clm", "lavanderia"]}]}]};

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== PLAN.cuenta) {
    throw new Error('Este script es para la cuenta ' + PLAN.cuenta + ' y se está corriendo en ' + cid + '. No se creó nada.');
  }
  if (URL_PENDIENTE) {
    throw new Error('Falta la página de destino: reemplaza PLAN.url por la URL real y pon URL_PENDIENTE = false. No se creó nada.');
  }
  var c = cid.replace(/-/g, '');

  var choques = [];
  var nombres = {};
  PLAN.campanas.forEach(function (k) { nombres[k.nombre] = true; });
  var it = AdsApp.search("SELECT campaign.name FROM campaign WHERE campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var n = it.next().campaign.name;
    if (nombres[n]) choques.push('campaña «' + n + '»');
  }
  var it2 = AdsApp.search("SELECT shared_set.name FROM shared_set WHERE shared_set.status = 'ENABLED'");
  while (it2.hasNext()) {
    var s = it2.next().sharedSet.name;
    if (s === PLAN.lista.nombre) choques.push('lista «' + s + '»');
  }
  if (choques.length) {
    throw new Error('Ya existen: ' + choques.join(', ') + '. No se creó nada, para no duplicar.');
  }

  var siguiente = -1;
  function temporal(tipo) { return 'customers/' + c + '/' + tipo + '/' + (siguiente--); }
  function micros(pesos) { return String(Math.round(pesos * 1000000)); }

  var ops = [];
  var lista = temporal('sharedSets');
  ops.push({ sharedSetOperation: { create: { resourceName: lista, name: PLAN.lista.nombre, type: 'NEGATIVE_KEYWORDS' } } });
  PLAN.lista.kw.forEach(function (k) {
    ops.push({ sharedCriterionOperation: { create: { sharedSet: lista, keyword: { text: k[0], matchType: k[1] } } } });
  });

  var resumen = [];
  PLAN.campanas.forEach(function (k) {
    var presupuesto = temporal('campaignBudgets');
    ops.push({ campaignBudgetOperation: { create: {
      resourceName: presupuesto, name: k.nombre + ' · presupuesto', amountMicros: micros(k.diario),
      deliveryMethod: 'STANDARD', explicitlyShared: false } } });
    var campana = temporal('campaigns');
    ops.push({ campaignOperation: { create: {
      resourceName: campana, name: k.nombre, status: 'PAUSED', advertisingChannelType: 'SEARCH',
      campaignBudget: presupuesto,
      targetSpend: { cpcBidCeilingMicros: micros(k.cpc) },
      networkSettings: { targetGoogleSearch: true, targetSearchNetwork: false, targetContentNetwork: false,
                         targetPartnerSearchNetwork: false },
      geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE', negativeGeoTargetType: 'PRESENCE' },
      containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING' } } });
    UBICACIONES.forEach(function (u) {
      ops.push({ campaignCriterionOperation: { create: { campaign: campana, location: { geoTargetConstant: 'geoTargetConstants/' + u } } } });
    });
    IDIOMAS.forEach(function (l) {
      ops.push({ campaignCriterionOperation: { create: { campaign: campana, language: { languageConstant: 'languageConstants/' + l } } } });
    });
    ops.push({ campaignSharedSetOperation: { create: { campaign: campana, sharedSet: lista } } });
    k.negativas.forEach(function (n) {
      ops.push({ campaignCriterionOperation: { create: { campaign: campana, negative: true, keyword: { text: n[0], matchType: n[1] } } } });
    });
    var palabras = 0;
    k.grupos.forEach(function (g) {
      var grupo = temporal('adGroups');
      ops.push({ adGroupOperation: { create: { resourceName: grupo, campaign: campana, name: g.nombre, status: 'ENABLED', type: 'SEARCH_STANDARD' } } });
      g.kw.forEach(function (w) {
        ops.push({ adGroupCriterionOperation: { create: { adGroup: grupo, status: 'ENABLED', keyword: { text: w[0], matchType: w[1] } } } });
        palabras++;
      });
      ops.push({ adGroupAdOperation: { create: { adGroup: grupo, status: 'ENABLED', ad: {
        finalUrls: [PLAN.url],
        responsiveSearchAd: {
          headlines: g.h.map(function (t) { return { text: t }; }),
          descriptions: g.d.map(function (t) { return { text: t }; }),
          path1: g.p[0], path2: g.p[1] } } } } });
    });
    resumen.push(k.nombre + ' · $' + k.diario + '/día de arranque · tope CPC $' + k.cpc + ' · ' + k.grupos.length + ' grupos · ' + palabras + ' palabras clave');
  });

  Logger.log(PLAN.nombre + ': ' + ops.length + ' operaciones.');
  var resultados = AdsApp.mutateAll(ops, { partialFailure: false });
  var errores = [];
  resultados.forEach(function (r, i) {
    if (!r.isSuccessful()) {
      errores.push('#' + i + ' ' + JSON.stringify(ops[i]).substring(0, 300) + ' → ' + r.getErrorMessages().join('; '));
    }
  });
  if (errores.length) {
    errores.forEach(function (e) { Logger.log(e); });
    throw new Error(errores.length + ' operaciones con error. No se creó nada. Revisa el registro.');
  }
  resumen.forEach(function (r) { Logger.log(r); });
  if (AdsApp.getExecutionInfo().isPreview()) {
    Logger.log('VISTA PREVIA SIN ERRORES. Para crear las campañas (en pausa), da EJECUTAR.');
  } else {
    Logger.log('CREADO. Todas las campañas quedaron EN PAUSA. Se activan solo con el OK del cliente.');
  }
}
