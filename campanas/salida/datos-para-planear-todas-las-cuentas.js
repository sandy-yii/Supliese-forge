/**
 * Atelback · Datos para planear: campañas, palabras clave, páginas y lo que se pierde por dinero — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Desde que arrancaron las campañas nuevas (20 oct) hasta ayer:
 *   1. CAMPAÑAS: presupuesto al día, gasto, clics, contactos REALES (WhatsApp, llamada, formulario; sin Google Maps ni
 *      chatbot), costo por contacto, en qué porcentaje de las búsquedas sale, cuánto pierde por PRESUPUESTO y cuánto por
 *      POSICIÓN (puja o calidad), y tope por clic.
 *   2. FOCO: las campañas que pierden búsquedas POR DINERO y sí traen contactos, ordenadas de más barata a más cara.
 *      Son las primeras que deben recibir presupuesto.
 *   3. PALABRAS CLAVE: las que más gastan, con contactos, costo por contacto, nivel de calidad, en cuántas búsquedas sale
 *      y cuánto pierde por posición.
 *   4. PÁGINAS: a qué página llegan los clics y qué porcentaje termina en contacto.
 *   5. Un renglón final «PLAN ·» con lo importante.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro.
 */

var DESDE = '2026-10-20';
var MAX_PALABRAS = 40;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function pct(x) { return (x === undefined || x === null || x === '' || isNaN(Number(x))) ? '—' : Math.round(Number(x) * 100) + '%'; }
function cpa(g, c) { return c >= 0.5 ? pesos(g / c) : 'sin contactos'; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var ayer = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var rango = "segments.date BETWEEN '" + DESDE + "' AND '" + ayer + "'";
  var dias = Math.round((new Date(ayer) - new Date(DESDE)) / 864e5) + 1;
  Logger.log('DATOS PARA PLANEAR · ' + marca + ' · del ' + DESDE + ' al ' + ayer + ' (' + dias + ' días) · solo lee');
  Logger.log('Contacto real = WhatsApp, llamada o formulario (sin Google Maps ni chatbot). Por mes = a este ritmo, 30 días.');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  // Contactos reales por campaña, por palabra y por página
  var contC = {}, contK = {}, contP = {};
  filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE " + rango, 'contactos por campaña')
    .forEach(function (f) { var a = f.segments.conversionActionName; if (esReal(a, tipos[a])) contC[f.campaign.name] = (contC[f.campaign.name] || 0) + (Number(f.metrics.allConversions) || 0); });
  filas("SELECT ad_group_criterion.criterion_id, ad_group.id, segments.conversion_action_name, metrics.all_conversions FROM keyword_view WHERE " + rango,
    'contactos por palabra').forEach(function (f) {
      var a = f.segments.conversionActionName, k = f.adGroup.id + '|' + f.adGroupCriterion.criterionId;
      if (esReal(a, tipos[a])) contK[k] = (contK[k] || 0) + (Number(f.metrics.allConversions) || 0);
    });
  filas("SELECT landing_page_view.unexpanded_final_url, segments.conversion_action_name, metrics.all_conversions FROM landing_page_view WHERE " + rango,
    'contactos por página').forEach(function (f) {
      var a = f.segments.conversionActionName, u = f.landingPageView.unexpandedFinalUrl;
      if (esReal(a, tipos[a])) contP[u] = (contP[u] || 0) + (Number(f.metrics.allConversions) || 0);
    });

  // 1. Campañas
  Logger.log('==== 1. CAMPAÑAS ENCENDIDAS ====');
  var camp = filas("SELECT campaign.name, campaign.advertising_channel_type, campaign_budget.amount_micros, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "metrics.cost_micros, metrics.clicks, metrics.impressions, metrics.average_cpc, metrics.search_impression_share, " +
    "metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND " + rango + " ORDER BY metrics.cost_micros DESC", 'las campañas');
  var tot = { g: 0, c: 0, k: 0, pres: 0 }, foco = [];
  camp.forEach(function (f) {
    var c = f.campaign, x = f.metrics, g = (Number(x.costMicros) || 0) / 1e6, k = contC[c.name] || 0;
    var pres = (Number((f.campaignBudget || {}).amountMicros) || 0) / 1e6, tope = c.targetSpend && c.targetSpend.cpcBidCeilingMicros ? (Number(c.targetSpend.cpcBidCeilingMicros) / 1e6) : 0;
    tot.g += g; tot.c += k; tot.k += Number(x.clicks) || 0; tot.pres += pres;
    Logger.log('«' + c.name + '»' + (c.advertisingChannelType === 'PERFORMANCE_MAX' ? ' (Máximo rendimiento)' : ''));
    Logger.log('    presupuesto ' + pesos(pres) + '/día' + (tope ? ' · tope por clic $' + tope : '') + ' · gasto ' + pesos(g) + ' (' + pesos(g / dias) + '/día) · ' +
      (x.clicks || 0) + ' clics a ' + pesos((Number(x.averageCpc) || 0) / 1e6));
    Logger.log('    ' + n(k) + ' contactos (' + n(k / dias * 30) + '/mes) · ' + cpa(g, k) + ' c/u · sale en ' + pct(x.searchImpressionShare) +
      ' de las búsquedas · pierde ' + pct(x.searchBudgetLostImpressionShare) + ' por PRESUPUESTO · ' + pct(x.searchRankLostImpressionShare) + ' por POSICIÓN');
    var pb = Number(x.searchBudgetLostImpressionShare) || 0;
    if (pb >= 0.15 && k >= 1) foco.push({ nombre: c.name, pb: pb, pr: Number(x.searchRankLostImpressionShare) || 0, k: k, g: g, pres: pres });
  });
  Logger.log('TOTAL · presupuesto ' + pesos(tot.pres) + '/día · gasto ' + pesos(tot.g) + ' · ' + tot.k + ' clics · ' + n(tot.c) + ' contactos (' +
    n(tot.c / dias * 30) + '/mes) · ' + cpa(tot.g, tot.c) + ' c/u');
  Logger.log('');

  // 2. Foco
  Logger.log('==== 2. FOCO: PIERDEN BÚSQUEDAS POR DINERO Y SÍ TRAEN CONTACTOS (de más barata a más cara) ====');
  foco.sort(function (a, b) { return (a.g / a.k) - (b.g / b.k); });
  foco.forEach(function (x, i) {
    Logger.log((i + 1) + '. «' + x.nombre + '» · ' + cpa(x.g, x.k) + ' por contacto · pierde ' + pct(x.pb) + ' por presupuesto (' + pct(x.pr) +
      ' por posición) · hoy ' + pesos(x.pres) + '/día · ' + n(x.k / dias * 30) + ' contactos/mes');
  });
  if (!foco.length) Logger.log('Ninguna campaña con contactos pierde 15% o más por presupuesto.');
  Logger.log('');

  // 3. Palabras clave
  Logger.log('==== 3. PALABRAS CLAVE (las ' + MAX_PALABRAS + ' que más gastan) ====');
  var TIPO = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };
  var kw = filas("SELECT campaign.name, ad_group.id, ad_group.name, ad_group_criterion.criterion_id, ad_group_criterion.keyword.text, " +
    "ad_group_criterion.keyword.match_type, ad_group_criterion.quality_info.quality_score, metrics.cost_micros, metrics.clicks, " +
    "metrics.search_impression_share, metrics.search_rank_lost_impression_share FROM keyword_view WHERE campaign.status = 'ENABLED' AND " +
    "ad_group_criterion.status = 'ENABLED' AND metrics.cost_micros > 0 AND " + rango + " ORDER BY metrics.cost_micros DESC LIMIT " + MAX_PALABRAS, 'las palabras clave');
  if (!kw.length) kw = filas("SELECT campaign.name, ad_group.id, ad_group.name, ad_group_criterion.criterion_id, ad_group_criterion.keyword.text, " +
    "ad_group_criterion.keyword.match_type, ad_group_criterion.quality_info.quality_score, metrics.cost_micros, metrics.clicks FROM keyword_view " +
    "WHERE campaign.status = 'ENABLED' AND ad_group_criterion.status = 'ENABLED' AND metrics.cost_micros > 0 AND " + rango +
    " ORDER BY metrics.cost_micros DESC LIMIT " + MAX_PALABRAS, 'las palabras clave (sin cuota)');
  kw.forEach(function (f) {
    var a = f.adGroupCriterion, x = f.metrics, g = (Number(x.costMicros) || 0) / 1e6, k = contK[f.adGroup.id + '|' + a.criterionId] || 0;
    var cal = (a.qualityInfo || {}).qualityScore;
    Logger.log('«' + a.keyword.text + '» (' + (TIPO[a.keyword.matchType] || a.keyword.matchType) + ') · ' + f.campaign.name + ' › ' + f.adGroup.name + ' · ' +
      (x.clicks || 0) + ' clics · ' + pesos(g) + ' · ' + n(k) + ' contactos · ' + cpa(g, k) + (cal ? ' · calidad ' + cal + '/10' : '') +
      (x.searchImpressionShare !== undefined ? ' · sale en ' + pct(x.searchImpressionShare) + ' · pierde ' + pct(x.searchRankLostImpressionShare) + ' por posición' : ''));
  });
  Logger.log('');

  // 4. Páginas
  Logger.log('==== 4. PÁGINAS ====');
  filas("SELECT landing_page_view.unexpanded_final_url, metrics.clicks, metrics.cost_micros FROM landing_page_view WHERE metrics.clicks > 0 AND " + rango +
    " ORDER BY metrics.clicks DESC LIMIT 20", 'las páginas').forEach(function (f) {
      var u = f.landingPageView.unexpandedFinalUrl, cl = Number(f.metrics.clicks) || 0, k = contP[u] || 0;
      Logger.log(u + ' · ' + cl + ' clics · ' + pesos((Number(f.metrics.costMicros) || 0) / 1e6) + ' · ' + n(k) + ' contactos · ' +
        (cl ? Math.round(1000 * k / cl) / 10 + '% de los clics termina en contacto' : ''));
    });
  Logger.log('');

  Logger.log('PLAN · ' + marca + ' · ' + dias + ' días · gasto ' + pesos(tot.g / dias) + '/día · contactos ' + n(tot.c / dias * 30) + '/mes · ' + cpa(tot.g, tot.c) +
    ' c/u · foco por dinero: ' + (foco.length ? foco.map(function (x) { return x.nombre.replace(/^AB · /, '') + ' (' + pct(x.pb) + ', ' + cpa(x.g, x.k) + ')'; }).join(' | ') : 'ninguna'));
  Logger.log('LISTO. Copia TODO el registro y mándalo. Este script no cambió nada.');
}
