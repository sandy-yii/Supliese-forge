/**
 * Atelback · ¿Por qué no sale el anuncio? Calidad y puja por palabra clave — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Para cada palabra clave
 * encendida de las campañas nuevas «AB ·» muestra lo que decide si el anuncio sale y en qué lugar:
 *   - el nivel de calidad de Google (1 a 10) y sus tres partes: relevancia del anuncio, probabilidad de clic y página;
 *   - lo que Google pide pagar por clic para salir en la primera página y hasta arriba, contra el tope de la campaña;
 *   - si Google la tiene como «pocas búsquedas».
 * Al final dice qué arreglar primero. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var NIVEL = { ABOVE_AVERAGE: 'buena', AVERAGE: 'normal', BELOW_AVERAGE: 'MALA' };

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
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function pesos(m) { return m ? '$' + (Number(m) / 1e6).toFixed(0) : '—'; }
var TIPO = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };

function main() {
  revisarCuenta();
  Logger.log('¿POR QUÉ NO SALE EL ANUNCIO? · ' + PLAN.nombre + ' · solo lee');

  var topes = {};
  filas("SELECT campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "campaign.target_impression_share.cpc_bid_ceiling_micros FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    var c = f.campaign;
    topes[c.name] = Number((c.targetSpend || {}).cpcBidCeilingMicros || (c.targetImpressionShare || {}).cpcBidCeilingMicros || 0);
  });

  var malaPagina = 0, malaRelevancia = 0, malaClic = 0, cortas = [], pocas = [], total = 0;
  var porCampana = {};
  filas('SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ' +
    'ad_group_criterion.system_serving_status, ad_group_criterion.quality_info.quality_score, ' +
    'ad_group_criterion.quality_info.creative_quality_score, ad_group_criterion.quality_info.post_click_quality_score, ' +
    'ad_group_criterion.quality_info.search_predicted_ctr, ad_group_criterion.position_estimates.first_page_cpc_micros, ' +
    'ad_group_criterion.position_estimates.top_of_page_cpc_micros FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'las palabras clave').forEach(function (f) {
    if (!esNueva(f.campaign.name)) return;
    total++;
    var k = f.adGroupCriterion, q = k.qualityInfo || {}, e = k.positionEstimates || {}, tope = topes[f.campaign.name] || 0;
    var linea = '«' + k.keyword.text + '» (' + (TIPO[k.keyword.matchType] || k.keyword.matchType) + ') · calidad ' + (q.qualityScore || '—') + '/10' +
      ' · anuncio ' + (NIVEL[q.creativeQualityScore] || '—') + ' · clic esperado ' + (NIVEL[q.searchPredictedCtr] || '—') +
      ' · página ' + (NIVEL[q.postClickQualityScore] || '—') + ' · pide ' + pesos(e.firstPageCpcMicros) + ' para salir y ' +
      pesos(e.topOfPageCpcMicros) + ' para salir arriba · tope ' + pesos(tope) + (k.systemServingStatus === 'RARELY_SERVED' ? ' · POCAS BÚSQUEDAS' : '');
    (porCampana[f.campaign.name] = porCampana[f.campaign.name] || []).push(linea);
    if (q.postClickQualityScore === 'BELOW_AVERAGE') malaPagina++;
    if (q.creativeQualityScore === 'BELOW_AVERAGE') malaRelevancia++;
    if (q.searchPredictedCtr === 'BELOW_AVERAGE') malaClic++;
    if (k.systemServingStatus === 'RARELY_SERVED') pocas.push(k.keyword.text);
    else if (tope && Number(e.topOfPageCpcMicros) > tope) cortas.push(k.keyword.text + ' (pide ' + pesos(e.topOfPageCpcMicros) + ', tope ' + pesos(tope) + ')');
  });

  Object.keys(porCampana).sort().forEach(function (n) {
    Logger.log('');
    Logger.log('==== ' + n.replace(PLAN.prefijo, '') + ' ====');
    porCampana[n].forEach(function (l) { Logger.log(l); });
  });

  Logger.log('');
  Logger.log('==== RESULTADO (' + total + ' palabras clave) ====');
  if (malaPagina) Logger.log('❌ ' + malaPagina + ' palabra(s) con PÁGINA mala: Google cree que la página no responde a lo que se buscó o no es buena en celular. Lo arregla Rodolfo (texto de la búsqueda en la página, rapidez, teléfono visible).');
  if (malaRelevancia) Logger.log('❌ ' + malaRelevancia + ' palabra(s) con ANUNCIO poco relevante: el texto del anuncio no repite lo que la persona buscó. Se arregla con títulos nuevos.');
  if (malaClic) Logger.log('⚠️ ' + malaClic + ' palabra(s) con probabilidad de clic baja: el anuncio llama poco la atención frente a la competencia.');
  if (cortas.length) Logger.log('💲 ' + cortas.length + ' palabra(s) piden más que el tope para salir arriba: ' + cortas.slice(0, 15).join(' · '));
  if (pocas.length) Logger.log('⚠️ ' + pocas.length + ' palabra(s) con POCAS BÚSQUEDAS (Google no las activa): ' + pocas.slice(0, 15).join(' · '));
  if (!malaPagina && !malaRelevancia && !malaClic && !cortas.length && !pocas.length) Logger.log('✅ Calidad y topes bien.');
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
