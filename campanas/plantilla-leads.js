/**
 * Atelback · ¿Están llegando leads? — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. En una sola revisión:
 *   - contactos que registró Google hoy y ayer (WhatsApp desde el anuncio o la página, formularios, llamadas), por campaña;
 *   - llamadas desde el anuncio de hoy y ayer, contestadas o no;
 *   - si el botón de WhatsApp y el de llamada del anuncio ya están aprobados;
 *   - visitas de hoy y de ayer.
 * No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo. Se puede correr varias veces al día.
 * Google tarda unas horas en mostrar algunos contactos: lo de hoy puede salir incompleto.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var CONTACTO = /conversa|conversation|mensaje|message|whats|\bwa\b|llamad|call|formul|lead|contact/i;
var APROBACION = { APPROVED: 'APROBADO ✅', APPROVED_LIMITED: 'aprobado con restricciones', DISAPPROVED: 'RECHAZADO ❌',
  AREA_OF_INTEREST_ONLY: 'aprobado con restricciones' };

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
function digitos(t) { return String(t || '').replace(/\D/g, '').slice(-10); }
function estado(p) {
  p = p || {};
  if (p.reviewStatus === 'REVIEW_IN_PROGRESS' || p.reviewStatus === 'UNDER_REVIEW') return 'en revisión ⏳';
  return APROBACION[p.approvalStatus] || (p.approvalStatus ? p.approvalStatus : 'sin dato (revísalo en Recursos)');
}

function main() {
  revisarCuenta();
  var tz = AdsApp.currentAccount().getTimeZone();
  var ahora = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
  var hoy = ahora.substring(0, 10), ayer = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var vendedor = digitos(PLAN.telefono);
  Logger.log('¿ESTÁN LLEGANDO LEADS? · ' + PLAN.nombre + ' · ' + ahora + ' · vendedor ' + PLAN.telefono + ' · solo lee');

  // ---- Visitas
  var clics = { hoy: 0, ayer: 0 };
  [['hoy', 'TODAY'], ['ayer', 'YESTERDAY']].forEach(function (d) {
    filas('SELECT metrics.clicks FROM customer WHERE segments.date DURING ' + d[1], 'las visitas').forEach(function (f) { clics[d[0]] += num((f.metrics || {}).clicks); });
  });
  Logger.log('Visitas desde los anuncios · hoy hasta ' + ahora.substring(11) + ': ' + clics.hoy + ' · ayer: ' + clics.ayer);

  // ---- Contactos registrados
  Logger.log('');
  Logger.log('==== CONTACTOS QUE REGISTRÓ GOOGLE ====');
  var total = { hoy: 0, ayer: 0 };
  [['hoy', 'TODAY'], ['ayer', 'YESTERDAY']].forEach(function (d) {
    var lineas = [];
    filas('SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE segments.date DURING ' + d[1],
      'los contactos de ' + d[0]).forEach(function (f) {
      var n = f.segments.conversionActionName, v = num((f.metrics || {}).allConversions);
      if (!v || !CONTACTO.test(n)) return;
      total[d[0]] += v;
      lineas.push('   «' + n + '» · ' + f.campaign.name + ' · ' + uno(v));
    });
    Logger.log(d[0].toUpperCase() + ': ' + (lineas.length ? '' : 'ninguno todavía'));
    lineas.forEach(function (l) { Logger.log(l); });
  });

  // ---- Llamadas
  Logger.log('');
  Logger.log('==== LLAMADAS DESDE EL ANUNCIO (hoy y ayer) ====');
  var llamadas = filas('SELECT campaign.name, call_view.start_call_date_time, call_view.call_duration_seconds, call_view.call_status FROM call_view ' +
    "WHERE call_view.start_call_date_time >= '" + ayer + " 00:00:00' ORDER BY call_view.start_call_date_time DESC", 'las llamadas');
  if (!llamadas.length) Logger.log('Ninguna.');
  var perdidas = 0;
  llamadas.forEach(function (f) {
    var c = f.callView, perdida = c.callStatus === 'MISSED';
    if (perdida) perdidas++;
    Logger.log(c.startCallDateTime + ' · ' + f.campaign.name + ' · ' + (perdida ? 'NO CONTESTADA ❌' : 'contestada') + ' · ' + num(c.callDurationSeconds) + ' s');
  });

  // ---- Botones del anuncio
  Logger.log('');
  Logger.log('==== BOTONES DEL ANUNCIO ====');
  var enCuenta = {};
  ['BUSINESS_MESSAGE', 'CALL'].forEach(function (t) {
    filas("SELECT asset.resource_name FROM customer_asset WHERE customer_asset.field_type = '" + t + "' AND customer_asset.status = 'ENABLED'", 'los recursos de la cuenta')
      .forEach(function (f) { enCuenta[f.asset.resourceName] = true; });
  });
  var whatsOk = false;
  filas("SELECT asset.resource_name, asset.business_message_asset.whatsapp_info.phone_number, asset.policy_summary.approval_status, " +
    "asset.policy_summary.review_status FROM asset WHERE asset.type = 'BUSINESS_MESSAGE'", 'los botones de WhatsApp').forEach(function (f) {
    var a = f.asset, n = ((a.businessMessageAsset || {}).whatsappInfo || {}).phoneNumber;
    if (!enCuenta[a.resourceName] || digitos(n) !== vendedor) return;
    var e = estado(a.policySummary);
    if (/APROBADO/.test(e)) whatsOk = true;
    Logger.log('WhatsApp ' + n + ' (toda la cuenta) · ' + e);
  });
  filas("SELECT asset.resource_name, asset.call_asset.phone_number, asset.policy_summary.approval_status, asset.policy_summary.review_status " +
    "FROM asset WHERE asset.type = 'CALL'", 'los botones de llamada').forEach(function (f) {
    var a = f.asset, n = (a.callAsset || {}).phoneNumber;
    if (digitos(n) !== vendedor) return;
    Logger.log('Llamada ' + n + ' · ' + estado(a.policySummary));
  });

  // ---- Resultado
  Logger.log('');
  Logger.log('==== RESULTADO ====');
  if (total.hoy + total.ayer > 0) Logger.log('✅ Sí están llegando: ' + uno(total.ayer) + ' contacto(s) ayer y ' + uno(total.hoy) + ' hoy (hasta ahora). Confirma con el vendedor que le llegaron.');
  else Logger.log('⏳ Google todavía no registra contactos ni ayer ni hoy. Pregunta al vendedor: los WhatsApp desde la página no siempre los cuenta Google.');
  if (perdidas) Logger.log('❌ ' + perdidas + ' llamada(s) no se contestaron: que el vendedor devuelva la llamada.');
  if (!whatsOk) Logger.log('⏳ El WhatsApp del anuncio aún no sale como aprobado en el script: revísalo en Recursos > Mensajes.');
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
