/**
 * Atelback · Crear campañas de arranque — Servicio para Lavandería (265-909-2662)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: crea campañas nuevas de Búsqueda EN PAUSA, con sus grupos, palabras clave, anuncios, negativas,
 * ubicación e idioma, y una lista de negativas compartida. Todo va en una sola operación: si algo falla,
 * no se crea nada. NO modifica, pausa, activa ni borra nada que ya exista en la cuenta.
 *
 * CÓMO SE USA (dentro de la cuenta 265-909-2662, no en el MCC):
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
var URL_PENDIENTE = true;

var PLAN = {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://PENDIENTE-copiar-de-los-anuncios-actuales/", "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["partes para lavadora industrial", "PHRASE"], ["partes para lavadoras industriales", "PHRASE"], ["refacciones para lavadora industrial", "PHRASE"], ["refacciones para lavadoras industriales", "PHRASE"], ["refacciones para secadora industrial", "PHRASE"], ["refacciones para secadoras industriales", "PHRASE"], ["refacciones lavandería industrial", "PHRASE"], ["refacciones lavanderia industrial", "PHRASE"], ["curso", "BROAD"], ["cursos", "BROAD"], ["tutorial", "BROAD"], ["cómo reparar", "PHRASE"], ["como reparar", "PHRASE"], ["diagrama", "BROAD"], ["diagramas", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["manuales", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["easy", "BROAD"], ["de casa", "PHRASE"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["carga frontal", "PHRASE"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["empleo", "BROAD"], ["trabajo", "BROAD"], ["sueldo", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["clm", "BROAD"]]}, "campanas": [{"nombre": "AB · Servicio técnico industrial", "diario": 43, "cpc": 15, "negativas": [["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["venta", "BROAD"], ["comprar", "BROAD"], ["cotizar equipo", "BROAD"], ["girbau", "BROAD"], ["precio lavadora industrial", "PHRASE"], ["lavadora industrial precio", "PHRASE"]], "grupos": [{"nombre": "Servicio técnico", "kw": [["servicio técnico lavadoras industriales", "PHRASE"], ["técnico en lavadoras industriales", "PHRASE"], ["servicio técnico lavandería industrial", "PHRASE"], ["servicio técnico secadoras industriales", "PHRASE"]], "h": ["Servicio Técnico Industrial", "Técnicos en Lavadoras", "Lavadoras Industriales", "Lavanderías Industriales", "Secadoras Industriales", "Mantenimiento Correctivo", "Mantenimiento Preventivo", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Servicio técnico para lavadoras y secadoras industriales. Agenda tu servicio hoy.", "Técnicos para lavanderías industriales, hoteles y hospitales. Habla con un técnico.", "Mantenimiento correctivo y preventivo para que tu lavandería no se detenga.", "Agenda una visita y recibe el diagnóstico de tu equipo."], "p": ["servicio", "tecnico"]}]}, {"nombre": "AB · Reparación y mantenimiento", "diario": 54, "cpc": 15, "negativas": [["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["venta", "BROAD"], ["comprar", "BROAD"], ["cotizar equipo", "BROAD"], ["girbau", "BROAD"], ["precio lavadora industrial", "PHRASE"], ["lavadora industrial precio", "PHRASE"]], "grupos": [{"nombre": "Reparación", "kw": [["reparación de lavadoras industriales", "PHRASE"], ["reparación de lavadora industrial", "PHRASE"]], "h": ["Reparación de Lavadoras", "Lavadoras Industriales", "Reparación Industrial", "Mantenimiento Correctivo", "Técnicos en Lavadoras", "Diagnóstico de tu Equipo", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Reparación de lavadoras industriales para lavanderías, hoteles y hospitales.", "Técnicos en lavadoras y secadoras industriales. Agenda tu servicio hoy.", "Agenda una visita y recibe el diagnóstico de tu equipo."], "p": ["reparacion", "lavadoras"]}, {"nombre": "Mantenimiento correctivo", "kw": [["mantenimiento correctivo lavadora industrial", "PHRASE"], ["mantenimiento correctivo lavadoras industriales", "PHRASE"], ["mantenimiento correctivo lavadora", "PHRASE"]], "h": ["Mantenimiento Correctivo", "Lavadoras Industriales", "Reparación de Lavadoras", "Técnicos en Lavadoras", "Diagnóstico de tu Equipo", "Agenda una Visita", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Mantenimiento correctivo para lavadoras industriales. Agenda tu servicio hoy.", "Técnicos para lavanderías industriales, hoteles y hospitales. Habla con un técnico.", "Agenda una visita y recibe el diagnóstico de tu equipo."], "p": ["mantenimiento", "correctivo"]}, {"nombre": "Mantenimiento preventivo", "kw": [["mantenimiento preventivo lavadoras industriales", "PHRASE"], ["mantenimiento lavandería industrial", "PHRASE"], ["mantenimiento de lavadoras industriales", "PHRASE"]], "h": ["Mantenimiento Preventivo", "Lavadoras Industriales", "Lavanderías Industriales", "Técnicos en Lavadoras", "Evita Paros de tu Equipo", "Agenda una Visita", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Mantenimiento preventivo para lavadoras y secadoras industriales. Agenda hoy.", "Técnicos para lavanderías industriales, hoteles y hospitales. Habla con un técnico.", "Agenda una visita y recibe el diagnóstico de tu equipo."], "p": ["mantenimiento", "preventivo"]}]}, {"nombre": "AB · Refacciones Girbau y Gamesail", "diario": 16, "cpc": 12, "negativas": [], "grupos": [{"nombre": "Refacciones Girbau", "kw": [["refacciones girbau", "EXACT"], ["refacciones girbau", "PHRASE"], ["refacciones para lavadora girbau", "PHRASE"], ["refacciones para secadora girbau", "PHRASE"], ["partes girbau", "PHRASE"]], "h": ["Refacciones Girbau", "Refacciones Originales", "Para Lavadoras y Secadoras", "Instalación por Técnicos", "Pide tu Refacción", "Cotiza tu Refacción", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Refacciones Girbau para lavadoras y secadoras. Cotiza tu refacción hoy.", "Te ayudamos a identificar la pieza y la instalamos con nuestros técnicos.", "Envíanos el modelo de tu equipo y recibe cotización de la refacción."], "p": ["refacciones", "girbau"]}, {"nombre": "Refacciones Gamesail", "kw": [["refacciones gamesail", "EXACT"], ["refacciones gamesail", "PHRASE"], ["partes gamesail", "PHRASE"]], "h": ["Refacciones Gamesail", "Refacciones Originales", "Para Lavadoras y Secadoras", "Instalación por Técnicos", "Pide tu Refacción", "Cotiza tu Refacción", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Refacciones Gamesail para lavadoras y secadoras. Cotiza tu refacción hoy.", "Te ayudamos a identificar la pieza y la instalamos con nuestros técnicos.", "Envíanos el modelo de tu equipo y recibe cotización de la refacción."], "p": ["refacciones", "gamesail"]}]}, {"nombre": "AB · Servicio a secadoras", "diario": 11, "cpc": 15, "negativas": [["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["venta", "BROAD"], ["comprar", "BROAD"], ["cotizar equipo", "BROAD"], ["girbau", "BROAD"], ["precio lavadora industrial", "PHRASE"], ["lavadora industrial precio", "PHRASE"]], "grupos": [{"nombre": "Secadoras", "kw": [["reparación de secadoras industriales", "PHRASE"], ["servicio a secadoras industriales", "PHRASE"], ["mantenimiento de secadoras industriales", "PHRASE"]], "h": ["Reparación de Secadoras", "Secadoras Industriales", "Mantenimiento Correctivo", "Mantenimiento Preventivo", "Técnicos en Secadoras", "Agenda una Visita", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Reparación y mantenimiento de secadoras industriales. Agenda tu servicio hoy.", "Técnicos para lavanderías industriales, hoteles y hospitales.", "Agenda una visita y recibe el diagnóstico de tu equipo."], "p": ["secadoras", "servicio"]}]}, {"nombre": "AB · Instalación", "diario": 7, "cpc": 15, "negativas": [["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["venta", "BROAD"], ["comprar", "BROAD"], ["cotizar equipo", "BROAD"], ["girbau", "BROAD"], ["precio lavadora industrial", "PHRASE"], ["lavadora industrial precio", "PHRASE"]], "grupos": [{"nombre": "Instalación", "kw": [["instalación de lavandería industrial", "PHRASE"], ["instalación de equipo de lavandería", "PHRASE"]], "h": ["Instalación de Lavanderías", "Instalación de Equipo", "Lavanderías Industriales", "Técnicos Especializados", "Agenda una Visita", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Instalación de equipo para lavanderías industriales. Agenda una visita hoy.", "Técnicos para lavanderías, hoteles y hospitales. Habla con un técnico."], "p": ["instalacion", "lavanderia"]}]}, {"nombre": "AB · Servicio a lavanderías", "diario": 4, "cpc": 12, "negativas": [["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["venta", "BROAD"], ["comprar", "BROAD"], ["cotizar equipo", "BROAD"], ["girbau", "BROAD"], ["precio lavadora industrial", "PHRASE"], ["lavadora industrial precio", "PHRASE"]], "grupos": [{"nombre": "Pólizas", "kw": [["mantenimiento para lavandería de autoservicio", "PHRASE"], ["póliza de mantenimiento lavandería", "PHRASE"]], "h": ["Póliza de Mantenimiento", "Lavanderías de Autoservicio", "Mantenimiento Preventivo", "Evita Paros de tu Equipo", "Agenda una Visita", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Pólizas de mantenimiento para lavanderías de autoservicio. Agenda hoy.", "Mantenimiento preventivo y correctivo para que tu lavandería no se detenga."], "p": ["mantenimiento", "lavanderias"]}]}]};

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
