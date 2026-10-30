// Parte compartida (campanas/parte-tablero.js): imprime las líneas «TABLERO» con los datos día por día desde 30 días
// antes del arranque hasta ayer. La usan «datos para el tablero» y la revisión diaria. Necesita filas, esNueva, num y mas.
function imprimirTablero(cid, ahora) {
  var DIAS_ANTES = 30, TROZO = 8000;
  function r2(x) { return Math.round(x * 100) / 100; }
  function r3(x) { return x === undefined || x === null || x === '' ? null : Math.round(Number(x) * 1000) / 1000; }
  var hoy = ahora.substring(0, 10), ayer = mas(hoy, -1);
  var inicio = '';
  var itc = AdsApp.campaigns().get();
  while (itc.hasNext()) {
    var cc = itc.next();
    if (!esNueva(cc.getName())) continue;
    var x = cc.getStartDate();
    if (!x) continue;
    var t = x.year + '-' + ('0' + x.month).slice(-2) + '-' + ('0' + x.day).slice(-2);
    if (!inicio || t < inicio) inicio = t;
  }
  if (!inicio || inicio > ayer) { Logger.log('TABLERO: las campañas «' + PLAN.prefijo + '» todavía no tienen un día completo.'); return; }
  var desde = mas(inicio, -DIAS_ANTES);
  var rango = "segments.date BETWEEN '" + desde + "' AND '" + ayer + "'";
  var rangoNuevo = "segments.date BETWEEN '" + inicio + "' AND '" + ayer + "'";
  Logger.log('DATOS PARA EL TABLERO · ' + PLAN.nombre + ' · ' + ahora + ' · del ' + desde + ' al ' + ayer + ' (arranque ' + inicio + ') · solo lee');

  // ---- Campañas, día por día: [impresiones, clics, costo, conversiones, llamadas, cuota, perdida por presupuesto, perdida por posición]
  var C = {};
  function campana(n) {
    var k = esNueva(n) ? n.substring(PLAN.prefijo.length) : n;
    return C[k] = C[k] || { n: esNueva(n) ? 1 : 0, d: {} };
  }
  filas('SELECT campaign.name, segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, ' +
    'metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share ' +
    'FROM campaign WHERE ' + rango + ' AND metrics.impressions > 0', 'las campañas').forEach(function (f) {
    var m = f.metrics || {};
    campana(f.campaign.name).d[f.segments.date] = [num(m.impressions), num(m.clicks), r2(num(m.costMicros) / 1e6), r2(num(m.conversions)), 0,
      r3(m.searchImpressionShare), r3(m.searchBudgetLostImpressionShare), r3(m.searchRankLostImpressionShare)];
  });
  filas('SELECT campaign.name, segments.date, metrics.phone_calls FROM campaign WHERE ' + rango + ' AND metrics.phone_calls > 0',
    'las llamadas').forEach(function (f) {
    var d = campana(f.campaign.name).d;
    if (!d[f.segments.date]) d[f.segments.date] = [0, 0, 0, 0, 0, null, null, null];
    d[f.segments.date][4] = num((f.metrics || {}).phoneCalls);
  });

  // ---- Búsquedas de las campañas nuevas, día por día: [costo útil, costo excluido, clics útiles, clics excluidos]
  var B = {}, nb = 0;
  filas('SELECT campaign.name, segments.date, search_term_view.status, metrics.cost_micros, metrics.clicks FROM search_term_view WHERE ' +
    rangoNuevo + ' AND metrics.impressions > 0', 'las búsquedas').forEach(function (f) {
    if (!esNueva(f.campaign.name)) return;
    var m = f.metrics || {}, s = f.searchTermView.status, e = s === 'EXCLUDED' || s === 'ADDED_EXCLUDED';
    var b = B[f.segments.date] = B[f.segments.date] || [0, 0, 0, 0];
    b[e ? 1 : 0] = r2(b[e ? 1 : 0] + num(m.costMicros) / 1e6);
    b[e ? 3 : 2] += num(m.clicks);
    nb++;
  });

  // ---- Conversiones por acción, día por día
  var K = {};
  filas('SELECT segments.date, segments.conversion_action_name, metrics.conversions FROM campaign WHERE ' + rango +
    ' AND metrics.conversions > 0', 'las conversiones').forEach(function (f) {
    var k = K[f.segments.date] = K[f.segments.date] || {}, a = f.segments.conversionActionName;
    k[a] = r2((k[a] || 0) + num((f.metrics || {}).conversions));
  });

  // ---- Resumen legible
  var nuevas = 0, viejas = 0, costo = 0, clics = 0;
  Object.keys(C).forEach(function (n) {
    if (C[n].n) nuevas++; else viejas++;
    Object.keys(C[n].d).forEach(function (d) { if (d >= inicio) { costo += C[n].d[d][2]; clics += C[n].d[d][1]; } });
  });
  Logger.log('Campañas con datos: ' + nuevas + ' nuevas y ' + viejas + ' anteriores · desde el arranque: ' + clics + ' clics, $' +
    costo.toFixed(2) + ' · ' + nb + ' filas de búsquedas · ' + Object.keys(K).length + ' día(s) con conversiones.');

  // ---- Líneas para el tablero (en trozos, para que el registro no las corte)
  var datos = JSON.stringify({ v: 1, cuenta: cid, marca: PLAN.nombre, generado: ahora, desde: desde, hasta: ayer, arranque: inicio,
    c: C, b: B, k: K });
  var partes = Math.ceil(datos.length / TROZO);
  Logger.log('');
  Logger.log('Copia todo el registro (incluidas las ' + partes + ' línea(s) que empiezan con TABLERO) y mándalo.');
  for (var i = 0; i < partes; i++) Logger.log('TABLERO ' + (i + 1) + '/' + partes + '|' + datos.substring(i * TROZO, (i + 1) * TROZO));
}
