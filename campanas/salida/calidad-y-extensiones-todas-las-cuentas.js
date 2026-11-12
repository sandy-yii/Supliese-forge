/**
 * Atelback · Calidad de anuncios y extensiones — las cinco cuentas
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada (no frena ningún lead).
 * Google decide quién sale y qué tan arriba por «puja × calidad». Este script dice dónde está baja la calidad
 * y por qué, para arreglarla después con otro script (con Vista previa y OK):
 *   1. PALABRAS CLAVE de los últimos 30 días con su calificación (1 a 10) y en qué falla cada una:
 *      «clics esperados» (si la gente le da clic al anuncio), «relevancia del anuncio» (si el anuncio habla de lo que
 *      buscó) y «experiencia en la página» (si la página es útil y rápida). Ordenadas por gasto.
 *   2. ANUNCIOS: la fuerza de cada anuncio (Excelente, Buena, Regular, Mala).
 *   3. EXTENSIONES: qué tiene cada campaña (enlaces a secciones, textos destacados, fragmentos, precios, imágenes,
 *      llamada, logo) y cuáles le faltan.
 *   4. Un renglón final «CALIDAD ·» con lo más importante.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var NIVEL = { BELOW_AVERAGE: 'BAJA', AVERAGE: 'normal', ABOVE_AVERAGE: 'buena', UNSPECIFIED: '?', UNKNOWN: '?' };
var FUERZA = { EXCELLENT: 'Excelente', GOOD: 'Buena', AVERAGE: 'Regular', POOR: 'Mala', PENDING: 'En revisión', NO_ADS: 'Sin anuncios', UNSPECIFIED: '?', UNKNOWN: '?' };
var EXT = { SITELINK: 'enlaces a secciones', CALLOUT: 'textos destacados', STRUCTURED_SNIPPET: 'fragmentos', PRICE: 'precios',
  AD_IMAGE: 'imágenes', CALL: 'llamada', BUSINESS_LOGO: 'logo', BUSINESS_NAME: 'nombre del negocio', PROMOTION: 'promoción' };
var DESEADAS = ['SITELINK', 'CALLOUT', 'STRUCTURED_SNIPPET', 'AD_IMAGE', 'CALL', 'PRICE'];
var CONCORD = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(Number(x) || 0).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  Logger.log('CALIDAD Y EXTENSIONES · ' + marca + ' · últimos 30 días · solo lee');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  // 1. Palabras clave
  Logger.log('==== 1. PALABRAS CLAVE: CALIFICACIÓN Y EN QUÉ FALLA (por gasto) ====');
  var K = {};
  filas("SELECT campaign.name, ad_group.id, ad_group.name, ad_group_criterion.criterion_id, ad_group_criterion.keyword.text, " +
    "ad_group_criterion.keyword.match_type, ad_group_criterion.quality_info.quality_score, ad_group_criterion.quality_info.creative_quality_score, " +
    "ad_group_criterion.quality_info.post_click_quality_score, ad_group_criterion.quality_info.search_predicted_ctr, " +
    "metrics.impressions, metrics.clicks, metrics.cost_micros FROM keyword_view WHERE segments.date DURING LAST_30_DAYS " +
    "AND campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND ad_group_criterion.status = 'ENABLED' AND metrics.impressions > 0",
    'las palabras clave').forEach(function (f) {
      var c = f.adGroupCriterion, q = c.qualityInfo || {}, id = f.adGroup.id + '~' + c.criterionId;
      K[id] = { camp: f.campaign.name, grupo: f.adGroup.name, txt: c.keyword.text, conc: CONCORD[c.keyword.matchType] || c.keyword.matchType,
        qs: q.qualityScore || 0, anuncio: NIVEL[q.creativeQualityScore] || '?', pagina: NIVEL[q.postClickQualityScore] || '?',
        ctr: NIVEL[q.searchPredictedCtr] || '?', imp: +f.metrics.impressions || 0, clics: +f.metrics.clicks || 0,
        gasto: (+f.metrics.costMicros || 0) / 1e6, cont: 0 };
    });
  filas("SELECT ad_group.id, ad_group_criterion.criterion_id, segments.conversion_action_name, metrics.all_conversions FROM keyword_view " +
    "WHERE segments.date DURING LAST_30_DAYS AND campaign.status = 'ENABLED' AND metrics.all_conversions > 0", 'los contactos por palabra')
    .forEach(function (f) {
      var k = K[f.adGroup.id + '~' + f.adGroupCriterion.criterionId], a = f.segments.conversionActionName;
      if (k && esReal(a, tipos[a])) k.cont += +f.metrics.allConversions || 0;
    });
  var lista = Object.keys(K).map(function (k) { return K[k]; }).sort(function (a, b) { return b.gasto - a.gasto; });
  var bajas = 0, fallas = { anuncio: 0, pagina: 0, ctr: 0 };
  lista.slice(0, 40).forEach(function (k) {
    var falla = [];
    if (k.ctr === 'BAJA') { falla.push('clics esperados'); fallas.ctr++; }
    if (k.anuncio === 'BAJA') { falla.push('relevancia del anuncio'); fallas.anuncio++; }
    if (k.pagina === 'BAJA') { falla.push('experiencia en la página'); fallas.pagina++; }
    var marcaQs = k.qs && k.qs <= 5 ? ' ⚠️' : '';
    if (k.qs && k.qs <= 5) bajas++;
    Logger.log('«' + k.txt + '» (' + k.conc + ') · calificación ' + (k.qs || 'sin dato') + '/10' + marcaQs +
      ' · clics esperados ' + k.ctr + ', anuncio ' + k.anuncio + ', página ' + k.pagina +
      (falla.length ? ' · FALLA EN: ' + falla.join(' y ') : '') +
      ' · ' + k.clics + ' clics, ' + n(k.cont) + ' contactos, ' + pesos(k.gasto) + ' · ' + k.camp + ' › ' + k.grupo);
  });
  if (!lista.length) Logger.log('Sin palabras clave con impresiones (por ejemplo, solo Máximo rendimiento).');
  Logger.log('');

  // 2. Anuncios
  Logger.log('==== 2. FUERZA DE LOS ANUNCIOS ====');
  var flojos = 0;
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.ad_strength FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' " +
    "AND campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'", 'los anuncios')
    .forEach(function (f) {
      var s = f.adGroupAd.adStrength, malo = s === 'POOR' || s === 'AVERAGE';
      if (malo) flojos++;
      Logger.log((malo ? '⚠️ ' : '') + (FUERZA[s] || s) + ' · ' + f.campaign.name + ' › ' + f.adGroup.name);
    });
  Logger.log('');

  // 3. Extensiones
  Logger.log('==== 3. EXTENSIONES POR CAMPAÑA ====');
  var deCuenta = {};
  filas("SELECT customer_asset.field_type FROM customer_asset WHERE customer_asset.status = 'ENABLED'", 'las extensiones de la cuenta')
    .forEach(function (f) { deCuenta[f.customerAsset.fieldType] = true; });
  var C = {};
  filas("SELECT campaign.name, campaign.advertising_channel_type FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas')
    .forEach(function (f) { C[f.campaign.name] = {}; });
  filas("SELECT campaign.name, campaign_asset.field_type FROM campaign_asset WHERE campaign.status = 'ENABLED' AND campaign_asset.status = 'ENABLED'", 'las extensiones de campaña')
    .forEach(function (f) { if (C[f.campaign.name]) C[f.campaign.name][f.campaignAsset.fieldType] = true; });
  filas("SELECT campaign.name, ad_group_asset.field_type FROM ad_group_asset WHERE campaign.status = 'ENABLED' AND ad_group_asset.status = 'ENABLED'", 'las extensiones de grupo')
    .forEach(function (f) { if (C[f.campaign.name]) C[f.campaign.name][f.adGroupAsset.fieldType] = true; });
  Logger.log('A nivel cuenta (aplican a todas): ' + (Object.keys(deCuenta).map(function (k) { return EXT[k] || k; }).join(', ') || 'ninguna'));
  var faltantes = 0;
  Object.keys(C).forEach(function (c) {
    var tiene = DESEADAS.filter(function (t) { return C[c][t] || deCuenta[t]; });
    var falta = DESEADAS.filter(function (t) { return !(C[c][t] || deCuenta[t]); });
    faltantes += falta.length;
    Logger.log((falta.length >= 3 ? '⚠️ ' : '') + c + ' · tiene: ' + (tiene.map(function (t) { return EXT[t]; }).join(', ') || 'nada') +
      ' · le falta: ' + (falta.map(function (t) { return EXT[t]; }).join(', ') || 'nada'));
  });
  Logger.log('');

  Logger.log('CALIDAD · ' + marca + ' · palabras con calificación 5 o menos (de las 40 con más gasto): ' + bajas +
    ' · fallan en clics esperados ' + fallas.ctr + ', en anuncio ' + fallas.anuncio + ', en página ' + fallas.pagina +
    ' · anuncios regulares o malos: ' + flojos + ' · extensiones que faltan (suma de campañas): ' + faltantes);
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
