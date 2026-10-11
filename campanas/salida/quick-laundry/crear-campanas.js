/**
 * Atelback · Crear campañas de arranque — Quick Laundry (cuenta Supliese Gómez) (256-397-2201)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: crea campañas nuevas de Búsqueda EN PAUSA, con sus grupos, palabras clave, anuncios, negativas,
 * ubicación e idioma, y una lista de negativas compartida. Todo va en una sola operación: si algo falla,
 * no se crea nada. NO modifica, pausa, activa ni borra nada que ya exista en la cuenta.
 *
 * CÓMO SE USA (dentro de la cuenta 256-397-2201, no en el MCC):
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

var PLAN = {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://supliese.com/landing/", "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["franquicia", "BROAD"], ["franquicias", "BROAD"], ["franchise", "BROAD"], ["franquiciatario", "BROAD"], ["hotel", "BROAD"], ["hoteles", "BROAD"], ["hotelera", "BROAD"], ["hospital", "BROAD"], ["hospitales", "BROAD"], ["clínica", "BROAD"], ["clinica", "BROAD"], ["mangle", "BROAD"], ["mangles", "BROAD"], ["planchadora", "BROAD"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["gamesail", "BROAD"], ["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["100 kg", "PHRASE"], ["100 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["túnel", "BROAD"], ["tunel", "BROAD"], ["clm", "BROAD"], ["60 kg", "PHRASE"], ["girbau", "BROAD"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["lavax", "BROAD"], ["lava 1", "PHRASE"], ["aquamatic", "BROAD"], ["5asec", "BROAD"], ["cerca de mí", "PHRASE"], ["cerca de mi", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["seminuevas", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["gratis", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["carga frontal", "PHRASE"]]}, "campanas": [{"nombre": "AB · Equipo para lavandería", "diario": 79, "cpc": 8, "negativas": [], "grupos": [{"nombre": "Lavadoras para lavandería", "kw": [["lavadoras para lavanderías", "PHRASE"], ["lavadoras industriales para lavandería", "PHRASE"], ["lavadoras para lavandería precios", "EXACT"], ["lavadoras para negocio", "EXACT"], ["lavadoras y secadoras para lavandería", "PHRASE"], ["equipo para lavandería", "PHRASE"]], "h": ["Equipo para Lavanderías", "Lavadoras para Lavandería", "Lavadoras y Secadoras", "Equipo Comercial", "Precios de Equipo", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras para lavandería. Te ayudamos a elegir el equipo. Cotiza hoy.", "Equipo comercial y semi industrial para lavanderías nuevas o que van a crecer.", "Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo y capacidad.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["equipo", "lavanderia"]}, {"nombre": "Semi industrial", "kw": [["lavadoras semi industriales", "PHRASE"], ["lavadora semi industrial", "PHRASE"], ["lavadora comercial", "PHRASE"]], "h": ["Lavadoras Semi Industriales", "Lavadora Comercial", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras semi industriales y comerciales para lavandería. Cotiza hoy.", "Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo y capacidad.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["lavadoras", "comerciales"]}]}, {"nombre": "AB · Emprendimiento", "diario": 49, "cpc": 7, "negativas": [["cuanto cuesta", "PHRASE"], ["cuánto cuesta", "PHRASE"], ["cuanto cuestan", "PHRASE"], ["cuánto cuestan", "PHRASE"], ["cuanto se necesita", "PHRASE"], ["cuánto se necesita", "PHRASE"], ["cuanto se invierte", "PHRASE"], ["cuánto se invierte", "PHRASE"], ["cuanto dinero", "PHRASE"], ["cuánto dinero", "PHRASE"], ["cuanto gana", "PHRASE"], ["cuánto gana", "PHRASE"], ["cuanto deja", "PHRASE"], ["cuánto deja", "PHRASE"]], "grupos": [{"nombre": "Abrir una lavandería", "kw": [["abrir una lavandería", "PHRASE"], ["poner una lavandería", "PHRASE"], ["abrir mi lavandería", "PHRASE"], ["poner mi lavandería", "PHRASE"]], "h": ["Abre tu Lavandería", "Pon tu Propia Lavandería", "Asesoría para tu Lavandería", "Equipo para tu Lavandería", "Te Ayudamos a Planearla", "Elige el Equipo Correcto", "Lavadoras y Secadoras", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Te asesoramos para elegir el equipo de tu lavandería según tu espacio y tu plan.", "Quick Laundry: lavadoras y secadoras para abrir tu lavandería, con asesoría.", "Platica con un asesor sobre el local, el equipo y los pasos para abrir tu lavandería.", "Solicita tu cotización de equipo para tu lavandería nueva."], "p": ["lavanderia", "abrir"]}]}, {"nombre": "AB · Autoservicio y monedas", "diario": 28, "cpc": 7, "negativas": [], "grupos": [{"nombre": "Autoservicio", "kw": [["lavadoras de monedas", "EXACT"], ["equipo para lavandería autoservicio", "EXACT"], ["lavadoras de autoservicio", "PHRASE"], ["lavadora para lavandería autoservicio", "PHRASE"], ["lavadora de monedas", "PHRASE"], ["secadora de monedas", "PHRASE"]], "h": ["Lavadoras de Monedas", "Equipo para Autoservicio", "Lavandería de Autoservicio", "Secadoras de Monedas", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras de monedas para lavandería de autoservicio. Cotiza hoy.", "Quick Laundry: equipo para autoservicio con asesoría para elegir modelo.", "Equipa tu lavandería de autoservicio con lavadoras y secadoras comerciales.", "Solicita tu cotización y recibe precio del equipo para tu autoservicio."], "p": ["autoservicio", "monedas"]}]}, {"nombre": "AB · Secadoras para lavandería", "diario": 16, "cpc": 8, "negativas": [], "grupos": [{"nombre": "Secadoras para lavandería", "kw": [["secadora de ropa para lavandería", "PHRASE"], ["secadora lavandería", "PHRASE"], ["secadora semi industrial", "PHRASE"], ["secadoras semi industriales", "PHRASE"]], "h": ["Secadoras para Lavandería", "Secadoras Semi Industriales", "Secadora Comercial", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Secadoras de ropa para lavandería, comerciales y semi industriales. Cotiza hoy.", "Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo.", "Solicita tu cotización y recibe precio de la secadora que necesitas."], "p": ["secadoras", "lavanderia"]}]}, {"nombre": "AB · Marcas comerciales", "diario": 16, "cpc": 7, "negativas": [["teléfono", "BROAD"], ["telefono", "BROAD"], ["dirección", "BROAD"], ["direccion", "BROAD"], ["sucursal", "BROAD"], ["servicio", "BROAD"]], "grupos": [{"nombre": "Maytag y LG", "kw": [["lavadora maytag industrial", "PHRASE"], ["lavadora maytag comercial", "PHRASE"], ["lg lavadora industrial", "PHRASE"], ["lavadora lg comercial", "PHRASE"]], "h": ["Lavadoras Comerciales", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Precios de Equipo", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras comerciales para lavandería. Cotiza hoy con un asesor.", "Quick Laundry: equipo comercial para tu lavandería con asesoría para elegir modelo.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["lavadoras", "comerciales"]}]}, {"nombre": "AB · Marca Quick Laundry", "diario": 10, "cpc": 6, "negativas": [["precio por kilo", "PHRASE"], ["por kilo", "PHRASE"], ["servicio de lavado", "PHRASE"], ["domicilio", "BROAD"], ["horario", "BROAD"], ["horarios", "BROAD"]], "grupos": [{"nombre": "Quick Laundry", "kw": [["quick laundry", "EXACT"], ["quick laundry méxico", "PHRASE"], ["quicklaundry", "EXACT"], ["quick laundry equipo", "PHRASE"]], "h": ["Quick Laundry", "Quick Laundry México", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Antes Supliese", "Te Ayudamos a Elegir", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Quick Laundry, antes Supliese: equipo para lavanderías. Cotiza hoy con un asesor.", "Lavadoras y secadoras comerciales para abrir o equipar tu lavandería.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["quick", "laundry"]}, {"nombre": "Supliese", "kw": [["supliese", "EXACT"], ["supliese", "PHRASE"], ["supliese gómez", "EXACT"]], "h": ["Supliese Ahora es", "Quick Laundry", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Antes Supliese", "Te Ayudamos a Elegir", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Supliese ahora es Quick Laundry: el mismo equipo para lavanderías. Cotiza hoy.", "Lavadoras y secadoras comerciales para abrir o equipar tu lavandería.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["quick", "laundry"]}]}]};

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
