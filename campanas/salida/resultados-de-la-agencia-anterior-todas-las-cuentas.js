/**
 * Atelback · Resultados de la administración anterior (Nerea / agencia anterior) — las cinco cuentas y la Gamesail anterior
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Para el periodo en que la cuenta la manejaba la administración anterior
 * (por defecto, los 12 meses antes de que arrancaran nuestras campañas, del 20 oct 2025 al 19 oct 2026):
 *   1. Mes por mes: gasto, clics, «conversiones» (las que contaban como principales) y TODAS las conversiones.
 *   2. Mes por mes, de qué tipo eran: WhatsApp o chat, llamada, formulario, «lead calificado» (subido por el CRM),
 *      acciones locales de Google Maps (cómo llegar, visitas) y otras.
 *   3. Los 30 días justo antes del cambio (20 sep – 19 oct 2026), campaña por campaña.
 *   4. Un resumen: promedio al mes y costo por cada tipo.
 * Así se puede comparar con la misma regla lo que contaba Google antes y lo que cuenta ahora.
 *
 * CÓMO SE USA: en cada cuenta (también en la Gamesail anterior, 645-094-0317, si deja correr scripts) > borrar todo >
 * pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var DESDE = '2025-10-20';        // inicio del periodo que se revisa (cámbialo si la administración anterior empezó en otra fecha)
var HASTA = '2026-10-19';        // último día antes de que arrancaran las campañas nuevas
var ULTIMOS30 = ['2026-09-20', '2026-10-19'];

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail (nueva)', '645-094-0317': 'Gamesail (anterior)'
};
var TIPOS = ['WhatsApp / chat', 'Llamada', 'Formulario', 'Lead calificado (CRM)', 'Google Maps (local)', 'Otra'];

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function m(x) { return (Number(x) || 0) / 1e6; }
function pesos(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function cpa(costo, conv) { return conv >= 0.5 ? pesos(costo / conv) : '—'; }
function tipoDe(nombre, tipoGoogle, categoria) {
  if (/^AB\s*·/.test(nombre)) return 'Otra';
  if (tipoGoogle === 'UPLOAD_CLICKS' || tipoGoogle === 'UPLOAD_CALLS' || /calificad|qualified/i.test(nombre) || categoria === 'QUALIFIED_LEAD' || categoria === 'CONVERTED_LEAD') return 'Lead calificado (CRM)';
  if (tipoGoogle === 'GOOGLE_HOSTED' || /local action|acciones locales|c[oó]mo llegar|directions/i.test(nombre)) return 'Google Maps (local)';
  if (/whats|\bwa\b|chat|coudibot|chatbot|conversa|mensaje|message/i.test(nombre)) return 'WhatsApp / chat';
  if (/llamad|call|tel[eé]fono|phone/i.test(nombre) || tipoGoogle === 'AD_CALL' || tipoGoogle === 'WEBSITE_CALL' || tipoGoogle === 'CLICK_TO_CALL') return 'Llamada';
  if (/formul|form|lead|contacto|submit/i.test(nombre) || categoria === 'SUBMIT_LEAD_FORM') return 'Formulario';
  return 'Otra';
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  var rango = "segments.date BETWEEN '" + DESDE + "' AND '" + HASTA + "'";
  Logger.log('RESULTADOS DE LA ADMINISTRACIÓN ANTERIOR · ' + marca + ' (' + cid + ') · del ' + DESDE + ' al ' + HASTA + ' · solo lee');
  Logger.log('«Conversiones» = las que la cuenta contaba como principales. «Todas» = incluye secundarias. Así las reportaba Google, no los vendedores.');
  Logger.log('');

  // Tipo de cada acción (también las que hoy están apagadas o quitadas)
  var tipoAccion = {};
  filas("SELECT conversion_action.name, conversion_action.type, conversion_action.category FROM conversion_action", 'las acciones')
    .forEach(function (f) { var a = f.conversionAction; tipoAccion[a.name] = tipoDe(a.name, a.type, a.category); });

  // 1. Mes por mes
  var M = {}, tot = { gasto: 0, clics: 0, conv: 0, todas: 0 };
  filas("SELECT segments.month, metrics.cost_micros, metrics.clicks, metrics.conversions, metrics.all_conversions FROM customer WHERE " + rango,
    'el mes a mes').forEach(function (f) {
      var k = f.segments.month.substr(0, 7), x = M[k] = M[k] || { gasto: 0, clics: 0, conv: 0, todas: 0, tipos: {} };
      x.gasto += m(f.metrics.costMicros); x.clics += Number(f.metrics.clicks) || 0;
      x.conv += Number(f.metrics.conversions) || 0; x.todas += Number(f.metrics.allConversions) || 0;
    });
  var porTipo = {};
  filas("SELECT segments.month, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE " + rango, 'las conversiones por acción')
    .forEach(function (f) {
      var k = f.segments.month.substr(0, 7), a = f.segments.conversionActionName, c = Number(f.metrics.allConversions) || 0;
      if (!c || !M[k]) return;
      var t = tipoAccion[a] || tipoDe(a, '', '');
      M[k].tipos[t] = (M[k].tipos[t] || 0) + c;
      var p = porTipo[t] = porTipo[t] || { total: 0, acciones: {} };
      p.total += c; p.acciones[a] = (p.acciones[a] || 0) + c;
    });
  var meses = Object.keys(M).sort();
  Logger.log('==== 1. MES POR MES ====');
  Logger.log('mes · gasto · clics · conversiones · costo por conversión · todas · ' + TIPOS.join(' · '));
  meses.forEach(function (k) {
    var x = M[k];
    tot.gasto += x.gasto; tot.clics += x.clics; tot.conv += x.conv; tot.todas += x.todas;
    Logger.log(k + ' · ' + pesos(x.gasto) + ' · ' + x.clics + ' · ' + n(x.conv) + ' · ' + cpa(x.gasto, x.conv) + ' · ' + n(x.todas) + ' · ' +
      TIPOS.map(function (t) { return n(x.tipos[t]); }).join(' · '));
  });
  if (!meses.length) Logger.log('Sin datos en ese periodo.');
  Logger.log('');

  // 2. De qué acciones salían
  Logger.log('==== 2. DE QUÉ ACCIONES SALÍAN LAS CONVERSIONES (todo el periodo) ====');
  TIPOS.forEach(function (t) {
    var p = porTipo[t];
    if (!p) return;
    Logger.log(t + ' · ' + n(p.total) + ' en total');
    Object.keys(p.acciones).sort(function (a, b) { return p.acciones[b] - p.acciones[a]; }).forEach(function (a) {
      Logger.log('    «' + a + '» · ' + n(p.acciones[a]));
    });
  });
  Logger.log('');

  // 3. Los últimos 30 días antes del cambio, por campaña
  Logger.log('==== 3. ÚLTIMOS 30 DÍAS ANTES DEL CAMBIO (' + ULTIMOS30[0] + ' a ' + ULTIMOS30[1] + '), POR CAMPAÑA ====');
  var t30 = { gasto: 0, conv: 0, todas: 0 };
  filas("SELECT campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.conversions, metrics.all_conversions FROM campaign " +
    "WHERE segments.date BETWEEN '" + ULTIMOS30[0] + "' AND '" + ULTIMOS30[1] + "' AND metrics.cost_micros > 0 ORDER BY metrics.cost_micros DESC", 'las campañas')
    .forEach(function (f) {
      var x = f.metrics, g = m(x.costMicros);
      t30.gasto += g; t30.conv += Number(x.conversions) || 0; t30.todas += Number(x.allConversions) || 0;
      Logger.log('«' + f.campaign.name + '» · ' + pesos(g) + ' · ' + (x.clicks || 0) + ' clics · ' + n(x.conversions) + ' conversiones (' +
        cpa(g, Number(x.conversions)) + ' c/u) · ' + n(x.allConversions) + ' todas');
    });
  Logger.log('TOTAL 30 días · ' + pesos(t30.gasto) + ' · ' + n(t30.conv) + ' conversiones · ' + n(t30.todas) + ' todas');
  Logger.log('');

  // 4. Resumen
  var nm = meses.length || 1;
  var reales = ['WhatsApp / chat', 'Llamada', 'Formulario'].reduce(function (s, t) { return s + ((porTipo[t] || {}).total || 0); }, 0);
  var calif = (porTipo['Lead calificado (CRM)'] || {}).total || 0;
  Logger.log('==== 4. RESUMEN ====');
  Logger.log('Gasto: ' + pesos(tot.gasto) + ' en ' + meses.length + ' meses · ' + pesos(tot.gasto / nm) + ' al mes');
  Logger.log('Conversiones principales: ' + n(tot.conv) + ' · ' + n(tot.conv / nm) + ' al mes · ' + cpa(tot.gasto, tot.conv) + ' c/u');
  Logger.log('Contactos de página (WhatsApp/chat, llamada, formulario): ' + n(reales) + ' · ' + n(reales / nm) + ' al mes · ' + cpa(tot.gasto, reales) + ' c/u');
  Logger.log('Leads calificados subidos por el CRM: ' + n(calif) + ' · ' + n(calif / nm) + ' al mes · ' + cpa(tot.gasto, calif) + ' c/u');
  Logger.log('');
  Logger.log('ANTERIOR · ' + marca + ' · ' + DESDE + ' a ' + HASTA + ' · gasto ' + pesos(tot.gasto / nm) + '/mes · conversiones ' + n(tot.conv / nm) +
    '/mes · contactos de página ' + n(reales / nm) + '/mes · leads calificados ' + n(calif / nm) + '/mes · últimos 30 días: ' + pesos(t30.gasto) + ', ' +
    n(t30.conv) + ' conversiones');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
