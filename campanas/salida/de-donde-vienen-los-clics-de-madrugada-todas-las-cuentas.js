/**
 * Atelback · ¿De dónde vienen los clics de madrugada? (apps, páginas y ciudades) — las cinco cuentas
 * Escrito a mano el 16 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   1. DISPLAY: en qué apps, páginas o canales de YouTube salió el anuncio en los últimos 7 días, con clics, gasto y contactos.
 *      Si Google lo da por hora, solo los de 12 a 6 a.m.
 *   2. CIUDADES de los clics de 12 a 6 a.m. (7 días), con la red (búsqueda o Display).
 *   3. Un renglón final «MADRUGADA ·».
 * Sirve para saber si los «contactos» de medianoche son gente real o clics de apps (juegos, apps de celular) y robots.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var TIPO = { MOBILE_APPLICATION: 'app de celular', WEBSITE: 'página web', YOUTUBE_VIDEO: 'video de YouTube', YOUTUBE_CHANNEL: 'canal de YouTube', GOOGLE_PRODUCTS: 'producto de Google', MOBILE_APP_CATEGORY: 'categoría de apps' };
var RED = { SEARCH: 'búsqueda', SEARCH_PARTNERS: 'socios', CONTENT: 'Display', YOUTUBE_SEARCH: 'YouTube', YOUTUBE_WATCH: 'YouTube', MIXED: 'Máx. rendimiento' };

function filas(q, que, callado) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) { var r = it.next(); r.metrics = r.metrics || {}; r.segments = r.segments || {}; out.push(r); } }
  catch (e) { if (callado) return null; Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(Number(x) || 0).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  Logger.log('¿DE DÓNDE VIENEN LOS CLICS DE MADRUGADA? · ' + marca + ' · últimos 7 días · solo lee');
  Logger.log('');

  // 1. Lugares de Display
  Logger.log('==== 1. DÓNDE SALIÓ EL ANUNCIO EN DISPLAY (apps, páginas, YouTube) ====');
  var porHora = true;
  var P = filas('SELECT campaign.name, detail_placement_view.display_name, detail_placement_view.target_url, detail_placement_view.placement_type, ' +
    'segments.hour, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM detail_placement_view ' +
    'WHERE segments.date DURING LAST_7_DAYS AND segments.hour < 6 AND metrics.clicks > 0', 'los lugares', true);
  if (P === null) {
    porHora = false;
    P = filas('SELECT campaign.name, detail_placement_view.display_name, detail_placement_view.target_url, detail_placement_view.placement_type, ' +
      'metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM detail_placement_view WHERE segments.date DURING LAST_7_DAYS AND metrics.clicks > 0', 'los lugares');
  }
  Logger.log(porHora ? '(solo clics de 12 a 6 a.m.)' : '(Google no da la hora aquí: son los clics de todo el día)');
  var L = {}, clicsDisplay = 0, gastoDisplay = 0, apps = 0;
  P.forEach(function (f) {
    var d = f.detailPlacementView, k = (d.displayName || d.targetUrl || '?') + '|' + d.placementType;
    var l = L[k] = L[k] || { nombre: d.displayName || '?', url: d.targetUrl || '', tipo: TIPO[d.placementType] || d.placementType, clics: 0, gasto: 0, conv: 0, camps: {} };
    l.clics += +f.metrics.clicks || 0; l.gasto += (+f.metrics.costMicros || 0) / 1e6; l.conv += +f.metrics.allConversions || 0; l.camps[f.campaign.name] = true;
  });
  Object.keys(L).map(function (k) { return L[k]; }).sort(function (a, b) { return b.clics - a.clics; }).slice(0, 30).forEach(function (l) {
    clicsDisplay += l.clics; gastoDisplay += l.gasto; if (l.tipo === 'app de celular') apps += l.clics;
    Logger.log('• ' + l.nombre + ' (' + l.tipo + ')' + (l.url ? ' · ' + l.url : '') + ' · ' + l.clics + ' clics · ' + pesos(l.gasto) +
      ' · ' + n(l.conv) + ' «contactos» · ' + Object.keys(l.camps).join(', '));
  });
  if (!P.length) Logger.log('Sin clics en Display.');
  Logger.log('');

  // 2. Ciudades de madrugada
  Logger.log('==== 2. DESDE QUÉ CIUDAD FUERON LOS CLICS DE DISPLAY (7 días; Google no da la hora por ciudad) ====');
  var G = filas('SELECT segments.geo_target_city, segments.ad_network_type, metrics.clicks, metrics.cost_micros, metrics.all_conversions ' +
    "FROM user_location_view WHERE segments.date DURING LAST_7_DAYS AND segments.ad_network_type = 'CONTENT' AND metrics.clicks > 0", 'las ciudades');
  var C = {};
  G.forEach(function (f) {
    var c = f.segments.geoTargetCity || '(sin ciudad)', k = c + '|' + (RED[f.segments.adNetworkType] || f.segments.adNetworkType);
    var x = C[k] = C[k] || { clics: 0, gasto: 0, conv: 0 };
    x.clics += +f.metrics.clicks || 0; x.gasto += (+f.metrics.costMicros || 0) / 1e6; x.conv += +f.metrics.allConversions || 0;
  });
  var nombres = {}, rns = Object.keys(C).map(function (k) { return k.split('|')[0]; }).filter(function (r) { return r.indexOf('geoTargetConstants') >= 0; });
  if (rns.length) filas("SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name FROM geo_target_constant WHERE geo_target_constant.resource_name IN ('" +
    rns.filter(function (r, i) { return rns.indexOf(r) === i; }).join("','") + "')", 'los nombres de ciudades')
    .forEach(function (f) { nombres[f.geoTargetConstant.resourceName] = f.geoTargetConstant.canonicalName; });
  Object.keys(C).sort(function (a, b) { return C[b].clics - C[a].clics; }).slice(0, 25).forEach(function (k) {
    var p = k.split('|');
    Logger.log('• ' + (nombres[p[0]] || p[0]) + ' · ' + p[1] + ' · ' + C[k].clics + ' clics · ' + pesos(C[k].gasto) + ' · ' + n(C[k].conv) + ' «contactos»');
  });
  if (!G.length) Logger.log('Google no dio ciudades para esas horas.');
  Logger.log('');
  Logger.log('MADRUGADA · ' + marca + ' · Display ' + (porHora ? 'de 12 a 6 a.m.' : 'todo el día') + ': ' + clicsDisplay + ' clics, ' + pesos(gastoDisplay) +
    ' (en apps de celular: ' + apps + ' clics) · lugares distintos: ' + Object.keys(L).length);
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
