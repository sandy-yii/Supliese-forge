/**
 * Atelback · Palabras que SÍ traen contactos: antes y ahora — las cinco cuentas y la Gamesail anterior
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   1. ANTES (20 oct 2025 – 19 oct 2026): las búsquedas que trajeron contactos REALES (WhatsApp, llamada o formulario;
 *      sin contar el chatbot ni Google Maps) y si hoy alguna de nuestras palabras clave las cubre.
 *      → Las que NO están cubiertas son las candidatas a agregar.
 *   2. AHORA (del 20 oct a ayer): las búsquedas que traen contactos.
 *   3. AHORA: las búsquedas que gastaron $80 o más sin traer ningún contacto. → Candidatas a palabras negativas.
 *   4. Un renglón final con los totales.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 * En la Gamesail anterior (645-094-0317) también sirve: ahí la parte 1 sale toda como «no cubierta», porque nuestras
 * campañas están en la cuenta nueva; esa lista se cruza a mano con la nueva.
 */

var ANTES = ['2025-10-20', '2026-10-19'];
var AHORA_DESDE = '2026-10-20';
var MIN_SIN_CONTACTO = 80;     // pesos gastados sin contacto para sugerir negativa
var MAX_LINEAS = 40;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail (nueva)', '645-094-0317': 'Gamesail (anterior)'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function limpio(t) { return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ ]/g, ' ').replace(/\s+/g, ' ').trim(); }
// Contacto real: WhatsApp, llamada o formulario; NO chatbot ni Google Maps ni leads subidos.
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form|lead|contact|correo|mail/i.test(accion);
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var ayer = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  Logger.log('PALABRAS QUE SÍ TRAEN · ' + marca + ' · solo lee');
  Logger.log('Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps).');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  // Palabras clave encendidas hoy en nuestras campañas
  var claves = [];
  filas("SELECT ad_group_criterion.keyword.text FROM keyword_view WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
    "AND ad_group_criterion.status = 'ENABLED' AND ad_group_criterion.negative = FALSE", 'las palabras clave')
    .forEach(function (f) { var k = limpio(f.adGroupCriterion.keyword.text); if (k && claves.indexOf(k) < 0) claves.push(k); });
  function cubierta(t) {
    var x = limpio(t);
    return claves.some(function (k) { return (' ' + x + ' ').indexOf(' ' + k + ' ') >= 0; });
  }

  function contactos(desde, hasta) {
    var R = {};
    filas("SELECT search_term_view.search_term, segments.conversion_action_name, metrics.all_conversions FROM search_term_view " +
      "WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "' AND metrics.all_conversions > 0", 'las búsquedas con contacto')
      .forEach(function (f) {
        var a = f.segments.conversionActionName;
        if (!esReal(a, tipos[a])) return;
        var t = f.searchTermView.searchTerm;
        R[t] = (R[t] || 0) + (Number(f.metrics.allConversions) || 0);
      });
    return R;
  }
  function costos(desde, hasta) {
    var R = {};
    filas("SELECT search_term_view.search_term, metrics.cost_micros, metrics.clicks FROM search_term_view WHERE segments.date BETWEEN '" +
      desde + "' AND '" + hasta + "' AND metrics.cost_micros > 0", 'el gasto por búsqueda').forEach(function (f) {
        var t = f.searchTermView.searchTerm, x = R[t] = R[t] || { costo: 0, clics: 0 };
        x.costo += (Number(f.metrics.costMicros) || 0) / 1e6; x.clics += Number(f.metrics.clicks) || 0;
      });
    return R;
  }

  // 1. Antes
  var cA = contactos(ANTES[0], ANTES[1]), gA = costos(ANTES[0], ANTES[1]);
  var lista = Object.keys(cA).sort(function (a, b) { return cA[b] - cA[a]; });
  var noCub = lista.filter(function (t) { return !cubierta(t); });
  Logger.log('==== 1. ANTES (' + ANTES[0] + ' a ' + ANTES[1] + '): BÚSQUEDAS CON CONTACTO REAL · ' + lista.length + ' ====');
  lista.slice(0, MAX_LINEAS).forEach(function (t) {
    var g = gA[t] || { costo: 0, clics: 0 };
    Logger.log((cubierta(t) ? '✔ ya la cubrimos · ' : '➕ NO la cubrimos · ') + '«' + t + '» · ' + n(cA[t]) + ' contactos · ' + pesos(g.costo) +
      ' · ' + (cA[t] >= 0.5 ? pesos(g.costo / cA[t]) + ' c/u' : ''));
  });
  if (lista.length > MAX_LINEAS) Logger.log('(… y ' + (lista.length - MAX_LINEAS) + ' más)');
  Logger.log('');
  Logger.log('-- Candidatas a agregar (antes traían contacto y hoy no las cubrimos): ' + noCub.length + ' --');
  noCub.slice(0, MAX_LINEAS).forEach(function (t) { Logger.log('➕ «' + t + '» · ' + n(cA[t]) + ' contactos antes'); });
  Logger.log('');

  // 2. Ahora: las que traen
  var cN = contactos(AHORA_DESDE, ayer), gN = costos(AHORA_DESDE, ayer);
  var listaN = Object.keys(cN).sort(function (a, b) { return cN[b] - cN[a]; });
  Logger.log('==== 2. AHORA (' + AHORA_DESDE + ' a ' + ayer + '): BÚSQUEDAS CON CONTACTO · ' + listaN.length + ' ====');
  listaN.slice(0, MAX_LINEAS).forEach(function (t) {
    var g = gN[t] || { costo: 0, clics: 0 };
    Logger.log('«' + t + '» · ' + n(cN[t]) + ' contactos · ' + g.clics + ' clics · ' + pesos(g.costo));
  });
  Logger.log('');

  // 3. Ahora: gastan sin traer
  var neg = Object.keys(gN).filter(function (t) { return !cN[t] && gN[t].costo >= MIN_SIN_CONTACTO; })
    .sort(function (a, b) { return gN[b].costo - gN[a].costo; });
  var gastoNeg = neg.reduce(function (s, t) { return s + gN[t].costo; }, 0);
  Logger.log('==== 3. AHORA: GASTARON ' + pesos(MIN_SIN_CONTACTO) + ' O MÁS SIN NINGÚN CONTACTO · ' + neg.length + ' · ' + pesos(gastoNeg) + ' ====');
  neg.slice(0, MAX_LINEAS).forEach(function (t) { Logger.log('➖ «' + t + '» · ' + gN[t].clics + ' clics · ' + pesos(gN[t].costo)); });
  Logger.log('(Ojo: una búsqueda general como «lavadoras industriales» puede gastar sin contacto y aun así ser buena; se revisan una por una antes de bloquear.)');
  Logger.log('');

  Logger.log('PALABRAS · ' + marca + ' · antes: ' + lista.length + ' búsquedas con contacto real, ' + noCub.length + ' no cubiertas hoy · ahora: ' +
    listaN.length + ' con contacto · ' + neg.length + ' gastan sin contacto (' + pesos(gastoNeg) + ')');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
