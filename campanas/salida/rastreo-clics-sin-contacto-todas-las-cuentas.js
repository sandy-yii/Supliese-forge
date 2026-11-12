/**
 * Atelback · Rastreo: hay impresiones y clics, pero nadie escribe — las cinco cuentas
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Compara HOY (hasta la hora en que se corre) contra el promedio de los
 * 7 días anteriores a la misma hora, y busca dónde se rompe el camino anuncio → clic → página → contacto:
 *   1. Hoy contra el promedio, hasta esta hora: impresiones, clics, contactos.
 *   2. De qué RED vienen los clics (Búsqueda, Socios de búsqueda, Display/YouTube). Si aparece Display o socios
 *      de golpe, suelen ser clics baratos que no escriben.
 *   3. A qué PÁGINA llegan los clics de hoy y cuántos contactos dio cada una. Una página con muchos clics y 0 contactos
 *      que antes sí daba es la primera sospechosa (botón de WhatsApp roto, formulario caído, página lenta).
 *   4. QUÉ BUSCÓ la gente hoy (las 25 búsquedas con más clics). Si son búsquedas que no son de compra, ahí está.
 *   5. Celular contra computadora, hoy y en los 7 días.
 *   6. ANUNCIOS con problema de política o de página («destino no funciona»).
 *   7. QUÉ CAMBIÓ en la cuenta ayer y hoy, y quién lo cambió.
 * Contacto = WhatsApp, llamada o formulario (sin chatbot ni Google Maps). Ojo: Google solo ve a quien acepta cookies.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var RED = { SEARCH: 'Búsqueda de Google', SEARCH_PARTNERS: 'Socios de búsqueda', CONTENT: 'Display', YOUTUBE_SEARCH: 'YouTube',
  YOUTUBE_WATCH: 'YouTube', MIXED: 'Mixta (Máximo rendimiento)', GOOGLE_TV: 'Google TV', UNKNOWN: 'otra' };
var DISP = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta', CONNECTED_TV: 'TV', OTHER: 'otro' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function miles(x) { return Math.round(Number(x) || 0).toLocaleString('en-US'); }
function pesos(x) { return '$' + miles(x); }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  function dia(ms) { return Utilities.formatDate(new Date(ms), tz, 'yyyy-MM-dd'); }
  var ahora = Date.now(), hoy = dia(ahora), ayer = dia(ahora - 864e5), hace7 = dia(ahora - 7 * 864e5);
  var hora = Number(Utilities.formatDate(new Date(ahora), tz, 'H'));
  var antes = "segments.date BETWEEN '" + hace7 + "' AND '" + ayer + "'", deHoy = "segments.date = '" + hoy + "'";
  Logger.log('RASTREO · ' + marca + ' · hoy ' + hoy + ' hasta las ' + hora + ':00 contra los 7 días anteriores a la misma hora · solo lee');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });
  function contactos(rows) {
    var t = 0; rows.forEach(function (f) { var a = f.segments.conversionActionName; if (esReal(a, tipos[a])) t += Number(f.metrics.allConversions) || 0; }); return t;
  }

  // 1. Hoy contra promedio a la misma hora
  Logger.log('==== 1. HOY CONTRA EL PROMEDIO, HASTA LAS ' + hora + ':00 ====');
  var hasta = ' AND segments.hour < ' + hora;
  var H = { imp: 0, clics: 0 }, P = { imp: 0, clics: 0 };
  filas('SELECT segments.hour, metrics.impressions, metrics.clicks FROM customer WHERE ' + deHoy + hasta, 'hoy').forEach(function (f) { H.imp += +f.metrics.impressions || 0; H.clics += +f.metrics.clicks || 0; });
  filas('SELECT segments.hour, metrics.impressions, metrics.clicks FROM customer WHERE ' + antes + hasta, 'los 7 días').forEach(function (f) { P.imp += +f.metrics.impressions || 0; P.clics += +f.metrics.clicks || 0; });
  var ch = contactos(filas('SELECT segments.hour, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE ' + deHoy + hasta, 'contactos de hoy'));
  var cp = contactos(filas('SELECT segments.hour, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE ' + antes + hasta, 'contactos de 7 días'));
  Logger.log('Impresiones: hoy ' + miles(H.imp) + ' · promedio ' + miles(P.imp / 7));
  Logger.log('Clics: hoy ' + miles(H.clics) + ' · promedio ' + n(P.clics / 7));
  Logger.log('Contactos: hoy ' + n(ch) + ' · promedio ' + n(cp / 7) + (P.clics ? ' · de cada 100 clics: hoy ' + (H.clics ? n(ch / H.clics * 100) : 0) + ', promedio ' + n(cp / P.clics * 100) : ''));
  Logger.log('');

  // 2. Red
  Logger.log('==== 2. DE QUÉ RED VIENEN LOS CLICS (hoy hasta ahora · promedio de un día COMPLETO) ====');
  var R = {};
  [[deHoy, 'h'], [antes, 'p']].forEach(function (x) {
    filas('SELECT segments.ad_network_type, metrics.clicks, metrics.cost_micros FROM customer WHERE ' + x[0], 'la red').forEach(function (f) {
      var k = RED[f.segments.adNetworkType] || f.segments.adNetworkType, r = R[k] = R[k] || { h: 0, p: 0, gh: 0 };
      r[x[1]] += +f.metrics.clicks || 0; if (x[1] === 'h') r.gh += (+f.metrics.costMicros || 0) / 1e6;
    });
  });
  Object.keys(R).forEach(function (k) {
    var r = R[k], alerta = (/Display|Socios|YouTube/.test(k) && r.h > 0) ? ' ⚠️ revisar' : '';
    Logger.log(k + ': hoy ' + r.h + ' clics (' + pesos(r.gh) + ') · promedio ' + n(r.p / 7) + ' al día' + alerta);
  });
  Logger.log('');

  // 3. Páginas
  Logger.log('==== 3. A QUÉ PÁGINA LLEGAN LOS CLICS (hoy · 7 días) ====');
  var G = {};
  [[deHoy, 'h'], [antes, 'p']].forEach(function (x) {
    filas('SELECT landing_page_view.unexpanded_final_url, metrics.clicks FROM landing_page_view WHERE ' + x[0] + ' AND metrics.clicks > 0', 'las páginas').forEach(function (f) {
      var u = f.landingPageView.unexpandedFinalUrl, g = G[u] = G[u] || { h: 0, p: 0, ch: 0, cp: 0 }; g[x[1]] += +f.metrics.clicks || 0;
    });
    filas('SELECT landing_page_view.unexpanded_final_url, segments.conversion_action_name, metrics.all_conversions FROM landing_page_view WHERE ' + x[0], 'contactos por página').forEach(function (f) {
      var a = f.segments.conversionActionName, u = f.landingPageView.unexpandedFinalUrl;
      if (!esReal(a, tipos[a])) return; var g = G[u] = G[u] || { h: 0, p: 0, ch: 0, cp: 0 }; g['c' + x[1]] += +f.metrics.allConversions || 0;
    });
  });
  Object.keys(G).sort(function (a, b) { return G[b].h - G[a].h; }).forEach(function (u) {
    var g = G[u], tasa = g.p ? g.cp / g.p * 100 : 0;
    var alerta = (g.h >= 8 && g.ch === 0 && tasa >= 3) ? ' ⚠️ muchos clics hoy y 0 contactos; antes sí daba' : '';
    Logger.log(u + ' · hoy ' + g.h + ' clics, ' + n(g.ch) + ' contactos · 7 días ' + g.p + ' clics, ' + n(g.cp) + ' contactos (' + n(tasa) + ' de cada 100)' + alerta);
  });
  if (!Object.keys(G).length) Logger.log('Google no dio páginas de destino.');
  Logger.log('');

  // 4. Búsquedas
  Logger.log('==== 4. QUÉ BUSCÓ LA GENTE HOY (las 25 con más clics) ====');
  var B = filas('SELECT search_term_view.search_term, campaign.name, metrics.clicks, metrics.cost_micros FROM search_term_view WHERE ' + deHoy +
    ' AND metrics.clicks > 0 ORDER BY metrics.clicks DESC LIMIT 25', 'las búsquedas');
  B.forEach(function (f) { Logger.log('«' + f.searchTermView.searchTerm + '» · ' + f.metrics.clicks + ' clics · ' + pesos((+f.metrics.costMicros || 0) / 1e6) + ' · ' + f.campaign.name); });
  if (!B.length) Logger.log('Google todavía no muestra las búsquedas de hoy (tardan unas horas). Si no salen, córrelo otra vez en la noche.');
  Logger.log('');

  // 5. Dispositivo
  Logger.log('==== 5. CELULAR CONTRA COMPUTADORA ====');
  var D = {};
  [[deHoy, 'h'], [antes, 'p']].forEach(function (x) {
    filas('SELECT segments.device, metrics.clicks FROM customer WHERE ' + x[0], 'los dispositivos').forEach(function (f) {
      var k = DISP[f.segments.device] || f.segments.device, d = D[k] = D[k] || { h: 0, p: 0 }; d[x[1]] += +f.metrics.clicks || 0;
    });
  });
  Object.keys(D).forEach(function (k) { Logger.log(k + ': hoy ' + D[k].h + ' clics · promedio ' + n(D[k].p / 7)); });
  Logger.log('');

  // 6. Anuncios con problema
  Logger.log('==== 6. ANUNCIOS CON PROBLEMA ====');
  var malos = 0;
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad " +
    "WHERE ad_group_ad.status = 'ENABLED' AND campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND ad_group_ad.policy_summary.approval_status != 'APPROVED'",
    'los anuncios').forEach(function (f) {
      var p = f.adGroupAd.policySummary, temas = (p.policyTopicEntries || []).map(function (t) { return t.topic; }).join(', ');
      malos++; Logger.log('⚠️ «' + f.campaign.name + '» › ' + f.adGroup.name + ' · ' + p.approvalStatus + (temas ? ' · ' + temas : ''));
    });
  if (!malos) Logger.log('Todos los anuncios encendidos están aprobados.');
  Logger.log('');

  // 7. Cambios
  Logger.log('==== 7. QUÉ CAMBIÓ AYER Y HOY ====');
  var cambios = filas("SELECT change_event.change_date_time, change_event.change_resource_type, change_event.client_type, change_event.user_email, " +
    "change_event.changed_fields, campaign.name FROM change_event WHERE change_event.change_date_time >= '" + ayer + " 00:00:00' AND " +
    "change_event.change_date_time <= '" + hoy + " 23:59:59' ORDER BY change_event.change_date_time DESC LIMIT 60", 'los cambios');
  cambios.forEach(function (f) {
    var c = f.changeEvent, e = String(c.userEmail || '').toLowerCase();
    var quien = /gamesailmx/.test(e) ? 'nosotros' : (e ? 'OTRA PERSONA (' + e.substr(0, 3) + '…)' : 'Google/sistema');
    Logger.log(String(c.changeDateTime).substr(0, 16) + ' · ' + quien + ' · ' + c.changeResourceType + ' · ' + (c.changedFields || '') + ' · ' + ((f.campaign || {}).name || ''));
  });
  if (!cambios.length) Logger.log('Nadie cambió nada ayer ni hoy.');
  Logger.log('');
  Logger.log('RASTREO · ' + marca + ' · hasta las ' + hora + ':00 · clics hoy ' + H.clics + ' (prom. ' + n(P.clics / 7) + ') · contactos hoy ' + n(ch) + ' (prom. ' + n(cp / 7) + ')');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
