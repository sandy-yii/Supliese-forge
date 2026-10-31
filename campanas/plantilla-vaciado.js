/**
 * Atelback · Vaciado para la junta: qué funciona y dónde está el presupuesto — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Desde el arranque de
 * las campañas nuevas (20 oct) hasta ayer:
 *   1. TODAS las campañas, encendidas y pausadas: presupuesto diario, gasto, clics, contactos, costo por contacto y
 *      cuánto pierden por presupuesto. Así se ve qué presupuesto está en campañas que no sirven.
 *   2. Las palabras clave y las búsquedas que trajeron contactos (el «vaciado de keywords»).
 *   3. Los formularios del anuncio (formularios de Google Ads): en qué campañas están y a dónde mandan los datos.
 *   4. Los botones de llamada y de WhatsApp: número y si están aprobados.
 *   5. A qué dominio llevan los anuncios encendidos.
 * No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DESDE = '2026-10-20';
var CONTACTO = /whats|\bwa\b|mensaje|message|conversa|chat|llamad|call|tel[eé]fono|formul|lead|contact/i;
var DIAS_MES = 30.4;
var ESTADO = { ENABLED: 'encendida', PAUSED: 'PAUSADA', REMOVED: 'quitada' };

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
function num(x) { return Number(x || 0); }
function uno(x) { return (Math.round(x * 10) / 10).toString(); }
function dinero(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; }
function contactos(lista, llave) {
  var t = {};
  lista.forEach(function (f) {
    var v = num((f.metrics || {}).allConversions);
    if (!v || !CONTACTO.test(f.segments.conversionActionName)) return;
    var k = llave(f);
    t[k] = (t[k] || 0) + v;
  });
  return t;
}

function main() {
  revisarCuenta();
  var tz = AdsApp.currentAccount().getTimeZone();
  var ayer = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var RANGO = "segments.date BETWEEN '" + DESDE + "' AND '" + ayer + "'";
  Logger.log('VACIADO PARA LA JUNTA · ' + PLAN.nombre + ' · del ' + DESDE + ' al ' + ayer + ' · tope ' + dinero(PLAN.mensual) + ' al mes · solo lee');

  // ---- 1. Campañas
  var C = {};
  filas('SELECT campaign.name, campaign.status, campaign.advertising_channel_type, campaign_budget.amount_micros FROM campaign ' +
    "WHERE campaign.status != 'REMOVED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { estado: f.campaign.status, tipo: f.campaign.advertisingChannelType, diario: num(f.campaignBudget.amountMicros) / 1e6,
      gasto: 0, clics: 0, contactos: 0, perdido: null };
  });
  filas('SELECT campaign.name, metrics.cost_micros, metrics.clicks, metrics.search_budget_lost_impression_share FROM campaign WHERE ' + RANGO,
    'el gasto').forEach(function (f) {
    var c = C[f.campaign.name]; if (!c) return;
    c.gasto += num(f.metrics.costMicros) / 1e6; c.clics += num(f.metrics.clicks);
    if (f.metrics.searchBudgetLostImpressionShare !== undefined) c.perdido = num(f.metrics.searchBudgetLostImpressionShare);
  });
  var porCampana = contactos(filas('SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE ' + RANGO,
    'los contactos'), function (f) { return f.campaign.name; });
  Object.keys(porCampana).forEach(function (n) { if (C[n]) C[n].contactos = porCampana[n]; });

  Logger.log('');
  Logger.log('==== 1. CAMPAÑAS (desde el ' + DESDE + ') ====');
  Logger.log('campaña · estado · presupuesto al día · gastó · clics · contactos · costo por contacto · pierde por presupuesto');
  var nombres = Object.keys(C).sort(function (a, b) {
    return (C[a].estado === 'ENABLED' ? 0 : 1) - (C[b].estado === 'ENABLED' ? 0 : 1) || C[b].contactos - C[a].contactos || C[b].gasto - C[a].gasto;
  });
  var encendidas = 0, pausadas = 0;
  nombres.forEach(function (n) {
    var c = C[n];
    if (c.estado === 'ENABLED') encendidas += c.diario; else pausadas += c.diario;
    if (c.estado !== 'ENABLED' && !c.gasto) { Logger.log(n + ' · PAUSADA · ' + dinero(c.diario) + ' al día · sin gasto desde el arranque'); return; }
    Logger.log(n + ' · ' + (ESTADO[c.estado] || c.estado) + (c.tipo !== 'SEARCH' ? ' (' + c.tipo + ')' : '') + ' · ' + dinero(c.diario) + ' al día · ' +
      dinero(c.gasto) + ' · ' + c.clics + ' clics · ' + uno(c.contactos) + ' contactos · ' +
      (c.contactos ? dinero(c.gasto / c.contactos) + ' por contacto' : 'sin contactos') +
      (c.perdido !== null ? ' · pierde ' + Math.round(c.perdido * 100) + '% por presupuesto' : ''));
  });
  Logger.log('');
  Logger.log('Presupuesto de las ENCENDIDAS: ' + dinero(encendidas) + ' al día = ' + dinero(encendidas * DIAS_MES) + ' al mes (tope ' + dinero(PLAN.mensual) + ').');
  Logger.log('Presupuesto escrito en campañas PAUSADAS: ' + dinero(pausadas) + ' al día. No se gasta mientras estén pausadas; ' +
    'el espacio que queda hasta el tope es ' + dinero(Math.max(0, PLAN.mensual / DIAS_MES - encendidas)) + ' al día.');

  // ---- 2. Palabras clave y búsquedas con contactos
  var kw = contactos(filas('SELECT campaign.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, segments.conversion_action_name, ' +
    'metrics.all_conversions FROM keyword_view WHERE ' + RANGO, 'las palabras clave'), function (f) {
    return '«' + f.adGroupCriterion.keyword.text + '» (' + f.adGroupCriterion.keyword.matchType.toLowerCase() + ') · ' + f.campaign.name;
  });
  var costoKw = {};
  filas('SELECT campaign.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, metrics.cost_micros, metrics.clicks ' +
    'FROM keyword_view WHERE ' + RANGO, 'el costo de las palabras').forEach(function (f) {
    var k = '«' + f.adGroupCriterion.keyword.text + '» (' + f.adGroupCriterion.keyword.matchType.toLowerCase() + ') · ' + f.campaign.name;
    costoKw[k] = costoKw[k] || { gasto: 0, clics: 0 };
    costoKw[k].gasto += num(f.metrics.costMicros) / 1e6; costoKw[k].clics += num(f.metrics.clicks);
  });
  Logger.log('');
  Logger.log('==== 2a. PALABRAS CLAVE QUE TRAJERON CONTACTOS ====');
  var lk = Object.keys(kw).sort(function (a, b) { return kw[b] - kw[a]; });
  if (!lk.length) Logger.log('Ninguna todavía.');
  lk.forEach(function (k) {
    var c = costoKw[k] || { gasto: 0, clics: 0 };
    Logger.log(k + ' · ' + uno(kw[k]) + ' contactos · ' + c.clics + ' clics · ' + dinero(c.gasto) + ' · ' + dinero(c.gasto / kw[k]) + ' por contacto');
  });
  var bus = contactos(filas('SELECT campaign.name, search_term_view.search_term, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM search_term_view WHERE ' + RANGO, 'las búsquedas'), function (f) { return '«' + f.searchTermView.searchTerm + '» · ' + f.campaign.name; });
  Logger.log('');
  Logger.log('==== 2b. BÚSQUEDAS QUE TRAJERON CONTACTOS ====');
  var lb = Object.keys(bus).sort(function (a, b) { return bus[b] - bus[a]; });
  if (!lb.length) Logger.log('Ninguna todavía.');
  lb.slice(0, 40).forEach(function (k) { Logger.log(k + ' · ' + uno(bus[k])); });

  // ---- 3. Formularios del anuncio
  Logger.log('');
  Logger.log('==== 3. FORMULARIOS DEL ANUNCIO (de Google Ads) ====');
  var donde = {};
  filas("SELECT asset.resource_name, customer_asset.status FROM customer_asset WHERE customer_asset.field_type = 'LEAD_FORM'", 'los formularios de la cuenta')
    .forEach(function (f) { (donde[f.asset.resourceName] = donde[f.asset.resourceName] || []).push('toda la cuenta (' + f.customerAsset.status + ')'); });
  filas("SELECT asset.resource_name, campaign.name, campaign.status, campaign_asset.status FROM campaign_asset WHERE campaign_asset.field_type = 'LEAD_FORM'",
    'los formularios de las campañas').forEach(function (f) {
    (donde[f.asset.resourceName] = donde[f.asset.resourceName] || []).push('«' + f.campaign.name + '» (campaña ' + (ESTADO[f.campaign.status] || f.campaign.status) +
      ', formulario ' + f.campaignAsset.status + ')');
  });
  var forms = filas("SELECT asset.resource_name, asset.name, asset.lead_form_asset.business_name, asset.lead_form_asset.headline, " +
    "asset.lead_form_asset.delivery_methods FROM asset WHERE asset.type = 'LEAD_FORM'", 'los formularios');
  if (!forms.length) forms = filas("SELECT asset.resource_name, asset.name, asset.lead_form_asset.business_name FROM asset WHERE asset.type = 'LEAD_FORM'", 'los formularios');
  var formLeads = contactos(filas('SELECT segments.conversion_action_name, metrics.all_conversions FROM customer WHERE ' + RANGO, 'los envíos'), function (f) {
    return /formul|lead/i.test(f.segments.conversionActionName) ? f.segments.conversionActionName : '';
  });
  if (!forms.length) Logger.log('No hay formularios del anuncio en esta cuenta.');
  forms.forEach(function (f) {
    var a = f.asset, lf = a.leadFormAsset || {};
    var envio = (lf.deliveryMethods || []).map(function (d) {
      var w = d.webhook || {};
      return w.advertiserWebhookUrl ? 'webhook a ' + sitio(w.advertiserWebhookUrl) + ' (' + w.advertiserWebhookUrl.substring(0, 60) + ')' : JSON.stringify(d).substring(0, 80);
    });
    Logger.log('Formulario «' + (lf.headline || a.name || lf.businessName || a.resourceName) + '» · ' +
      (envio.length ? 'manda los datos por ' + envio.join(' y ') : 'sin envío automático (los datos solo se descargan en Google Ads)') + ' · en: ' +
      ((donde[a.resourceName] || []).join(', ') || 'ninguna campaña'));
  });
  Object.keys(formLeads).forEach(function (n) { if (n) Logger.log('   Envíos desde el arranque en «' + n + '»: ' + uno(formLeads[n])); });

  // ---- 4. Botones de llamada y WhatsApp
  Logger.log('');
  Logger.log('==== 4. BOTONES DEL ANUNCIO ====');
  filas("SELECT asset.type, asset.call_asset.phone_number, asset.business_message_asset.whatsapp_info.phone_number, asset.policy_summary.approval_status, " +
    "asset.policy_summary.review_status, asset.policy_summary.policy_topic_entries FROM asset WHERE asset.type IN ('CALL', 'BUSINESS_MESSAGE')", 'los botones')
    .forEach(function (f) {
      var a = f.asset, p = a.policySummary || {};
      var n = (a.callAsset || {}).phoneNumber || (((a.businessMessageAsset || {}).whatsappInfo) || {}).phoneNumber || '';
      var motivo = (p.policyTopicEntries || []).map(function (e) { return e.topic; }).join(', ');
      Logger.log((a.type === 'CALL' ? 'Llamada ' : 'WhatsApp ') + n + ' · ' + (p.approvalStatus || 'sin dato') +
        (p.reviewStatus ? ' (' + p.reviewStatus + ')' : '') + (motivo ? ' · motivo: ' + motivo : ''));
    });

  // ---- 5. Dominios
  Logger.log('');
  Logger.log('==== 5. A QUÉ DOMINIO LLEVAN LOS ANUNCIOS ENCENDIDOS ====');
  var dom = {};
  filas("SELECT ad_group_ad.ad.final_urls FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
    "AND campaign.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
    (f.adGroupAd.ad.finalUrls || []).forEach(function (u) { dom[sitio(u)] = (dom[sitio(u)] || 0) + 1; });
  });
  Object.keys(dom).forEach(function (d) { Logger.log(d + ' · ' + dom[d] + ' anuncio(s)'); });

  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
