/**
 * Atelback · ¿Por qué llegan pocos contactos? — pensado para Laundry Solutions (265-909-2662), sirve en las 5 cuentas
 * Escrito a mano el 8 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Revisa los últimos 14 días completos (hasta ayer) y busca dónde se va el dinero
 * sin traer contactos:
 *   1. Cada campaña encendida: presupuesto, clics, gasto, contactos, costo por contacto y cuánto se pierde por
 *      presupuesto o por posición.
 *   2. Las palabras clave: clics, gasto, contactos y nivel de calidad.
 *   3. Lo que la gente buscó: lo que más gastó sin traer contactos, y las búsquedas que parecen de lavadora de casa
 *      o de quien no es cliente (marcas caseras, tutoriales, empleo, códigos de error…).
 *   4. A qué página llegaron y cuántos contactos dio cada una.
 *   5. Qué está contando Google como contacto (WhatsApp, llamada, formulario) y el último día que contó cada uno.
 *   6. Celular contra computadora.
 *   7. Anuncios rechazados o limitados en campañas encendidas.
 *
 * CÓMO SE USA: en Laundry Solutions > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var DIAS = 14;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
// Búsquedas que suelen ser de lavadora de casa o de alguien que no va a contratar
var CASERA = /(mabe|whirlpool|samsung|\blg\b|easy|acros|koblenz|daewoo|frigidaire|hisense|midea|casa|hogar|dom[eé]stic|autom[aá]tica|carga superior|carga frontal|centro de lavado|tutorial|c[oó]mo (se |hacer|arreglar|reparar|quitar|desarmar)|gratis|empleo|trabajo|vacante|sueldo|curso|pdf|manual|youtube|c[oó]digo|error|\bfalla\b|usad[ao]s?|segunda mano|mercado libre|a domicilio)/i;

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(micros) { return '$' + Math.round((Number(micros) || 0) / 1e6).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function cpc(costo, conv) { return conv >= 0.5 ? 'costo por contacto ' + pesos(costo / conv) : 'ningún contacto'; }
function pct(x) { return (x === undefined || x === null || x === '') ? '—' : Math.round(Number(x) * 100) + '%'; }

function main() {
  var cuenta = AdsApp.currentAccount();
  var cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var hasta = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - DIAS * 864e5), tz, 'yyyy-MM-dd');
  var rango = "segments.date BETWEEN '" + desde + "' AND '" + hasta + "'";
  Logger.log('¿POR QUÉ LLEGAN POCOS CONTACTOS? · ' + marca + ' · del ' + desde + ' al ' + hasta + ' (' + DIAS + ' días) · solo lee');
  Logger.log('«Contactos» = lo que Google cuenta: toques de WhatsApp, llamadas y formularios.');
  Logger.log('');

  // 1. Campañas
  Logger.log('==== 1. CAMPAÑAS ENCENDIDAS ====');
  var tot = { clics: 0, costo: 0, conv: 0 }, sinNada = [];
  filas("SELECT campaign.name, campaign_budget.amount_micros, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions, metrics.average_cpc, " +
    "metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND " + rango + " ORDER BY metrics.cost_micros DESC", 'las campañas')
    .forEach(function (f) {
      var m = f.metrics, c = f.campaign, conv = Number(m.allConversions) || 0, costo = Number(m.costMicros) || 0;
      tot.clics += Number(m.clicks) || 0; tot.costo += costo; tot.conv += conv;
      var tope = c.targetSpend && c.targetSpend.cpcBidCeilingMicros ? ' · tope por clic ' + pesos(c.targetSpend.cpcBidCeilingMicros) : '';
      Logger.log('«' + c.name + '» · presupuesto ' + pesos((f.campaignBudget || {}).amountMicros) + ' al día' + tope);
      Logger.log('    ' + (m.clicks || 0) + ' clics · ' + pesos(costo) + ' · ' + n(conv) + ' contactos · ' + cpc(costo, conv) +
        ' · clic promedio ' + pesos(m.averageCpc));
      Logger.log('    sale en ' + pct(m.searchImpressionShare) + ' de las búsquedas · se pierde ' + pct(m.searchBudgetLostImpressionShare) +
        ' por presupuesto y ' + pct(m.searchRankLostImpressionShare) + ' por posición o calidad');
      if (conv < 0.5 && costo > 0) sinNada.push(c.name + ' (' + pesos(costo) + ')');
    });
  Logger.log('TOTAL · ' + tot.clics + ' clics · ' + pesos(tot.costo) + ' · ' + n(tot.conv) + ' contactos · ' + cpc(tot.costo, tot.conv));
  Logger.log('');

  // 2. Palabras clave
  Logger.log('==== 2. PALABRAS CLAVE (las que tuvieron clics) ====');
  filas("SELECT campaign.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, " +
    "ad_group_criterion.quality_info.quality_score, metrics.clicks, metrics.cost_micros, metrics.all_conversions " +
    "FROM keyword_view WHERE campaign.status = 'ENABLED' AND metrics.clicks > 0 AND " + rango + " ORDER BY metrics.cost_micros DESC LIMIT 40",
    'las palabras clave').forEach(function (f) {
      var k = f.adGroupCriterion, m = f.metrics, conv = Number(m.allConversions) || 0;
      var tipo = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' }[k.keyword.matchType] || k.keyword.matchType;
      var cal = (k.qualityInfo || {}).qualityScore;
      Logger.log('«' + k.keyword.text + '» (' + tipo + ') · ' + f.campaign.name + ' · ' + m.clicks + ' clics · ' + pesos(m.costMicros) +
        ' · ' + n(conv) + ' contactos' + (cal ? ' · calidad ' + cal + '/10' : ''));
    });
  Logger.log('');

  // 3. Búsquedas
  Logger.log('==== 3. QUÉ BUSCÓ LA GENTE ====');
  var terms = filas("SELECT search_term_view.search_term, campaign.name, metrics.clicks, metrics.cost_micros, metrics.all_conversions " +
    "FROM search_term_view WHERE metrics.clicks > 0 AND " + rango + " ORDER BY metrics.cost_micros DESC LIMIT 300", 'las búsquedas');
  var conContacto = [], sinContacto = [], caseras = [], costoCasero = 0, costoSin = 0;
  terms.forEach(function (f) {
    var t = f.searchTermView.searchTerm, m = f.metrics, conv = Number(m.allConversions) || 0, costo = Number(m.costMicros) || 0;
    var linea = '«' + t + '» · ' + f.campaign.name + ' · ' + m.clicks + ' clics · ' + pesos(costo) + (conv ? ' · ' + n(conv) + ' contactos' : '');
    if (conv >= 0.5) conContacto.push(linea); else { sinContacto.push(linea); costoSin += costo; }
    if (CASERA.test(t) && conv < 0.5) { caseras.push(linea); costoCasero += costo; }
  });
  Logger.log('-- Trajeron contactos (' + conContacto.length + ') --');
  conContacto.forEach(function (l) { Logger.log(l); });
  if (!conContacto.length) Logger.log('Ninguna.');
  Logger.log('-- Gastaron sin traer contactos (las 25 que más gastaron) · en total ' + pesos(costoSin) + ' --');
  sinContacto.slice(0, 25).forEach(function (l) { Logger.log(l); });
  Logger.log('-- Parecen de lavadora de casa o de quien no va a contratar (' + caseras.length + ') · ' + pesos(costoCasero) + ' --');
  caseras.slice(0, 30).forEach(function (l) { Logger.log(l); });
  if (!caseras.length) Logger.log('Ninguna. Las búsquedas sí son de servicio industrial.');
  Logger.log('');

  // 4. Páginas
  Logger.log('==== 4. A QUÉ PÁGINA LLEGARON ====');
  filas("SELECT landing_page_view.unexpanded_final_url, metrics.clicks, metrics.cost_micros, metrics.all_conversions " +
    "FROM landing_page_view WHERE metrics.clicks > 0 AND " + rango + " ORDER BY metrics.clicks DESC LIMIT 20", 'las páginas')
    .forEach(function (f) {
      var m = f.metrics;
      Logger.log(f.landingPageView.unexpandedFinalUrl + ' · ' + m.clicks + ' clics · ' + pesos(m.costMicros) + ' · ' + n(m.allConversions) + ' contactos');
    });
  Logger.log('');

  // 5. Qué cuenta Google
  Logger.log('==== 5. QUÉ CUENTA GOOGLE COMO CONTACTO ====');
  var porAccion = {};
  filas("SELECT segments.conversion_action_name, segments.date, metrics.all_conversions FROM customer WHERE " +
    "segments.date BETWEEN '" + Utilities.formatDate(new Date(Date.now() - 30 * 864e5), tz, 'yyyy-MM-dd') + "' AND '" + hasta + "'",
    'las conversiones').forEach(function (f) {
      var a = f.segments.conversionActionName, c = Number(f.metrics.allConversions) || 0;
      if (!c) return;
      var x = porAccion[a] = porAccion[a] || { total: 0, ultimo: '' };
      x.total += c; if (f.segments.date > x.ultimo) x.ultimo = f.segments.date;
    });
  filas("SELECT conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.include_in_conversions_metric " +
    "FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones de conversión').forEach(function (f) {
      var a = f.conversionAction, x = porAccion[a.name];
      Logger.log(a.name + ' · ' + (x ? n(x.total) + ' en 30 días · último el ' + x.ultimo : '⚠️ 0 en 30 días') +
        (a.includeInConversionsMetric ? '' : ' · (no cuenta como conversión principal)'));
    });
  Logger.log('');

  // 6. Dispositivo
  Logger.log('==== 6. CELULAR CONTRA COMPUTADORA ====');
  var DISP = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta' };
  filas("SELECT segments.device, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM customer WHERE " + rango, 'los dispositivos')
    .forEach(function (f) {
      var m = f.metrics;
      if (!Number(m.clicks)) return;
      Logger.log((DISP[f.segments.device] || f.segments.device) + ' · ' + m.clicks + ' clics · ' + pesos(m.costMicros) + ' · ' + n(m.allConversions) +
        ' contactos · ' + cpc(Number(m.costMicros), Number(m.allConversions)));
    });
  Logger.log('');

  // 7. Anuncios
  Logger.log('==== 7. ANUNCIOS RECHAZADOS O LIMITADOS (campañas encendidas) ====');
  var malos = 0;
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.policy_summary.approval_status FROM ad_group_ad WHERE campaign.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND ad_group_ad.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
      var s = f.adGroupAd.policySummary.approvalStatus;
      if (s === 'APPROVED') return;
      malos++;
      Logger.log(f.campaign.name + ' › ' + f.adGroup.name + ' · ' + ({ DISAPPROVED: '❌ rechazado', APPROVED_LIMITED: '⚠️ limitado', AREA_OF_INTEREST_ONLY: '⚠️ solo en algunas zonas' }[s] || s));
    });
  if (!malos) Logger.log('Todos los anuncios encendidos están aprobados.');
  Logger.log('');

  Logger.log('DIAGNÓSTICO · ' + marca + ' · ' + DIAS + ' días · ' + tot.clics + ' clics · ' + pesos(tot.costo) + ' · ' + n(tot.conv) + ' contactos · ' +
    'búsquedas sin contacto ' + pesos(costoSin) + ' · parecen caseras ' + caseras.length + ' (' + pesos(costoCasero) + ') · campañas sin contactos: ' +
    (sinNada.length ? sinNada.join(', ') : 'ninguna'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
