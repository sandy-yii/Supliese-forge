/**
 * Atelback · Crear campañas de arranque — {{NOMBRE}} ({{ID}})
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: crea campañas nuevas de Búsqueda EN PAUSA, con sus grupos, palabras clave, anuncios, negativas,
 * ubicación e idioma, y una lista de negativas compartida. Todo va en una sola operación: si algo falla,
 * no se crea nada. NO modifica, pausa, activa ni borra nada que ya exista en la cuenta.
 *
 * CÓMO SE USA (dentro de la cuenta {{ID}}, no en el MCC):
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
var URL_PENDIENTE = {{PENDIENTE}};

var PLAN = {{PLAN}};

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
