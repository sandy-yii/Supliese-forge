/**
 * Atelback · Empate diario: Google Ads vs Resend vs hoja de los vendedores — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   Por cada día (últimos 7 días y hoy hasta ahora) cuenta los contactos reales que registró Google Ads,
 *   separados por medio: WhatsApp, formulario y llamada. Se cuentan por el día y la hora en que LLEGARON
 *   (no por el día del clic), para empatarlos con Resend (que ve WhatsApp y formulario, no llamadas)
 *   y con la hoja de los vendedores (que ve todo).
 *   Al final, la hora de cada contacto de AYER, para empatarlos uno por uno con Resend.
 * Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps).
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA >
 * copiar los renglones que empiezan con «EMPATE ·» (o todo el registro) y mandarlos.
 */

var DIAS = 7;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};

function filas(q, que, callado) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { if (callado) return null; Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}
function medio(accion, tipo) {
  if (/whats|\bwa\b|conversa|conversation|mensaje|message/i.test(accion)) return 'WA';
  if (/formul|form/i.test(accion)) return 'FORM';
  if (/llamad|call|tel[eé]fono|phone/i.test(accion) || /CALL/.test(tipo || '')) return 'TEL';
  return 'OTRO';
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  function dia(ms) { return Utilities.formatDate(new Date(ms), tz, 'yyyy-MM-dd'); }
  var ahora = Date.now(), hoy = dia(ahora), ayer = dia(ahora - 864e5), desde = dia(ahora - DIAS * 864e5);
  Logger.log('EMPATE DIARIO · ' + marca + ' · del ' + desde + ' a hoy ' + hoy + ' · solo lee');
  Logger.log('Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps). Por día en que LLEGÓ.');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'",
    'las acciones').forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  // Por día y medio
  var porLlegada = true;
  var rows = filas("SELECT segments.date, segments.conversion_action_name, metrics.all_conversions_by_conversion_date FROM customer " +
    "WHERE segments.date BETWEEN '" + desde + "' AND '" + hoy + "'", '', true);
  if (!rows) {
    porLlegada = false;
    rows = filas("SELECT segments.date, segments.conversion_action_name, metrics.all_conversions FROM customer " +
      "WHERE segments.date BETWEEN '" + desde + "' AND '" + hoy + "'", 'los contactos por día');
  }
  var D = {}, acciones = {};
  rows.forEach(function (f) {
    var a = f.segments.conversionActionName;
    var c = Number(porLlegada ? f.metrics.allConversionsByConversionDate : f.metrics.allConversions) || 0;
    if (!c || !esReal(a, tipos[a])) return;
    var md = medio(a, tipos[a]);
    var x = D[f.segments.date] = D[f.segments.date] || { WA: 0, FORM: 0, TEL: 0, OTRO: 0 };
    x[md] += c;
    acciones[a] = md;
  });
  if (!porLlegada) Logger.log('(Esta cuenta no da el día de llegada; se usa el día del clic.)');
  Logger.log('Acciones que cuentan y su medio: ' + (Object.keys(acciones).map(function (a) { return a + ' → ' + acciones[a]; }).join(' | ') || 'ninguna con contactos'));
  Logger.log('');

  for (var t = Date.parse(desde + 'T12:00:00Z'); dia(t) <= hoy; t += 864e5) {
    var k = dia(t), x = D[k] || { WA: 0, FORM: 0, TEL: 0, OTRO: 0 };
    var tot = x.WA + x.FORM + x.TEL + x.OTRO;
    Logger.log('EMPATE · ' + marca + ' · ' + k + (k === hoy ? ' (hasta ahora)' : '') +
      ' · WhatsApp ' + n(x.WA) + ' · Formulario ' + n(x.FORM) + ' · Llamada ' + n(x.TEL) +
      (x.OTRO ? ' · Otro ' + n(x.OTRO) : '') + ' · TOTAL ' + n(tot) +
      ' · (para Resend: ' + n(x.WA + x.FORM) + ')');
  }

  // Horas de ayer, para empatar uno por uno con Resend (hora de la cuenta).
  Logger.log('');
  var h = filas("SELECT segments.hour, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE segments.date = '" + ayer + "'",
    '', true);
  if (!h) { Logger.log('(Google no dio las horas de ayer en esta cuenta.)'); return; }
  var H = {};
  h.forEach(function (f) {
    var a = f.segments.conversionActionName, c = Number(f.metrics.allConversions) || 0;
    if (!c || !esReal(a, tipos[a])) return;
    var key = ('0' + f.segments.hour).slice(-2) + 'h ' + medio(a, tipos[a]);
    H[key] = (H[key] || 0) + c;
  });
  var ks = Object.keys(H).sort();
  Logger.log('HORAS DE AYER (' + ayer + ', hora del clic): ' + (ks.length ? ks.map(function (k) { return k + ' ' + n(H[k]); }).join(' · ') : 'sin contactos'));
}
