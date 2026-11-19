// TRAFICO DE HOY vs AYER A LA MISMA HORA - las 5 cuentas (solo lee, 19 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR. VISTA PREVIA. No cambia nada.
// Para cada cuenta: impresiones, clics (= visitas a la pagina desde el anuncio), gasto y contactos
// HOY hasta la ultima hora completa, contra AYER y contra el PROMEDIO de los 7 dias anteriores en la misma franja.
// Ademas: clics por hora, por red (alerta si vuelve Display), por pagina, y contactos por tipo.
var CUENTAS = ['256-397-2201', '118-347-6484', '993-525-8739', '265-909-2662', '860-582-6837'];
var G = { hoy: z(), ayer: z(), prom: z() };

function z() { return { i: 0, c: 0, g: 0, v: 0 }; }
function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(CUENTAS).get();
    while (it.hasNext()) { AdsManagerApp.select(it.next()); try { cuenta(); } catch (e) { Logger.log('  ERROR: ' + e.message); } }
  } else cuenta();
  Logger.log('==== SUMA DE LAS CUENTAS (misma franja) ====');
  Logger.log('  HOY        ' + txt(G.hoy));
  Logger.log('  AYER       ' + txt(G.ayer) + '  ' + dif(G.hoy.c, G.ayer.c));
  Logger.log('  PROMEDIO 7 ' + txt(G.prom) + '  ' + dif(G.hoy.c, G.prom.c));
  Logger.log('FIN. Este script no cambio nada. Mandame el registro.');
}

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function n(x) { return Number(x) || 0; }
function txt(t) { return t.i + ' imp, ' + Math.round(t.c) + ' clics, $' + Math.round(t.g) + ', ' + Math.round(t.v * 10) / 10 + ' contactos'; }
function dif(a, b) { return b ? '(clics ' + (a >= b ? '+' : '') + Math.round((a - b) / b * 100) + '%)' : ''; }

function cuenta() {
  var acc = AdsApp.currentAccount(), tz = acc.getTimeZone(), ahora = new Date();
  var hoy = Utilities.formatDate(ahora, tz, 'yyyy-MM-dd'), hora = Number(Utilities.formatDate(ahora, tz, 'H'));
  var ayer = Utilities.formatDate(new Date(ahora.getTime() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(ahora.getTime() - 7 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('==== ' + acc.getName() + ' (' + acc.getCustomerId() + ') | hora de la cuenta ' + Utilities.formatDate(ahora, tz, 'HH:mm') + ' ====');
  Logger.log('  Franja comparada: de 00:00 a ' + hora + ':00 (horas completas)');

  var T = { hoy: z(), ayer: z(), prom: z() }, porHora = {};
  leer("SELECT segments.date, segments.hour, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM customer " +
    "WHERE segments.date BETWEEN '" + desde + "' AND '" + hoy + "'").forEach(function (r) {
      var d = r.segments.date, h = n(r.segments.hour), m = r.metrics || {};
      if (d === hoy) porHora[h] = (porHora[h] || 0) + n(m.clicks);
      if (h >= hora) return;
      var k = d === hoy ? 'hoy' : (d === ayer ? 'ayer' : null);
      [k, 'prom'].forEach(function (key) {
        if (!key || (key === 'prom' && d === hoy)) return;
        var w = key === 'prom' ? 1 / 7 : 1;
        T[key].i += n(m.impressions) * w; T[key].c += n(m.clicks) * w; T[key].g += n(m.costMicros) / 1e6 * w; T[key].v += n(m.conversions) * w;
      });
    });
  ['hoy', 'ayer', 'prom'].forEach(function (k) { T[k].i = Math.round(T[k].i); G[k].i += T[k].i; G[k].c += T[k].c; G[k].g += T[k].g; G[k].v += T[k].v; });
  Logger.log('  HOY        ' + txt(T.hoy));
  Logger.log('  AYER       ' + txt(T.ayer) + '  ' + dif(T.hoy.c, T.ayer.c));
  Logger.log('  PROMEDIO 7 ' + txt(T.prom) + '  ' + dif(T.hoy.c, T.prom.c));
  var hs = Object.keys(porHora).map(Number).sort(function (a, b) { return a - b; });
  Logger.log('  Clics por hora hoy: ' + (hs.length ? hs.map(function (h) { return h + 'h:' + porHora[h]; }).join('  ') : 'ninguno'));

  var red = [];
  leer("SELECT segments.ad_network_type, metrics.clicks, metrics.impressions, metrics.cost_micros FROM customer WHERE segments.date DURING TODAY").forEach(function (r) {
    var t = r.segments.adNetworkType, c = n(r.metrics.clicks);
    red.push(t + ' ' + c + ' clics' + ((t === 'CONTENT' && c > 0) ? ' <<< ALERTA: DISPLAY' : ''));
  });
  Logger.log('  Por red hoy: ' + (red.join(' | ') || 'sin datos'));

  try {
    var pags = leer("SELECT landing_page_view.unexpanded_final_url, metrics.clicks FROM landing_page_view WHERE segments.date DURING TODAY " +
      "AND metrics.clicks > 0 ORDER BY metrics.clicks DESC LIMIT 8");
    Logger.log('  Paginas con clics hoy (Busqueda): ' + (pags.length ? pags.map(function (r) {
      return r.landingPageView.unexpandedFinalUrl.replace(/^https?:\/\//, '') + ' ' + r.metrics.clicks; }).join(' | ') : 'ninguna'));
  } catch (e) { Logger.log('  (No se pudo leer paginas: ' + e.message + ')'); }

  var conv = [];
  leer("SELECT segments.conversion_action_name, metrics.all_conversions, metrics.conversions FROM customer WHERE segments.date DURING TODAY").forEach(function (r) {
    var a = n(r.metrics.allConversions); if (!a) return;
    conv.push(r.segments.conversionActionName + ' ' + Math.round(a * 10) / 10 + (n(r.metrics.conversions) ? '' : ' (secundaria)'));
  });
  Logger.log('  Contactos de hoy por tipo: ' + (conv.join(' | ') || 'ninguno todavia'));
  Logger.log('');
}
