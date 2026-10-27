/**
 * Atelback · ¿A dónde llegan los contactos de los anuncios? — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Revisa los botones que
 * Google pone en el anuncio y que no pasan por la página:
 *   - botón de mensaje / WhatsApp: a qué número manda, si está aprobado y en qué campañas sale;
 *   - botón de llamada: a qué número marca y si está aprobado;
 *   - llamadas de los últimos 30 días: cuántas hubo y cuántas no se contestaron;
 *   - conversaciones y llamadas que Google registró, por campaña;
 *   - formularios dentro del anuncio.
 * Compara cada número con el del vendedor de la marca. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "prefijo": "AB · ", "telefono": "33 1185 9797", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18}}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "prefijo": "AB · ", "telefono": "33 2601 2237", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18}}, {"cuenta": "993-525-8739", "nombre": "CLM", "prefijo": "AB · ", "telefono": "33 1564 1538", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18}}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "telefono": "33 1417 2994", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18}}, {"cuenta": "860-582-6837", "nombre": "Girbau", "prefijo": "AB · ", "telefono": "33 2806 8994", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18}}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

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
function digitos(t) { return String(t || '').replace(/\D/g, '').slice(-10); }
function num(x) { return Number(x || 0); }
var APROBACION = { APPROVED: 'aprobado', APPROVED_LIMITED: 'aprobado con restricciones', DISAPPROVED: 'RECHAZADO',
  AREA_OF_INTEREST_ONLY: 'aprobado con restricciones', UNKNOWN: 'sin dato', UNSPECIFIED: 'sin dato' };
function aprobacion(p) {
  p = p || {};
  var motivos = (p.policyTopicEntries || []).map(function (e) { return e.topic; }).filter(function (t) { return t; });
  return (APROBACION[p.approvalStatus] || p.approvalStatus || 'sin dato') + (p.reviewStatus === 'REVIEW_IN_PROGRESS' ? ' (en revisión)' : '') +
    (motivos.length ? ' · motivo de Google: ' + motivos.join(', ') : '');
}

function main() {
  revisarCuenta();
  var vendedor = digitos(PLAN.telefono);
  Logger.log('¿A DÓNDE LLEGAN LOS CONTACTOS? · ' + PLAN.nombre + ' · número del vendedor: ' + PLAN.telefono + ' · solo lee');
  var MAL = [], OJO = [], BIEN = [];

  // ---- Dónde está puesto cada recurso (cuenta o campaña)
  var donde = {};
  function ligar(consulta, que, nivel) {
    filas(consulta, que).forEach(function (f) {
      var rn = f.asset.resourceName;
      (donde[rn] = donde[rn] || []).push(nivel === 'cuenta' ? 'toda la cuenta' : '«' + f.campaign.name + '»' + (f.campaign.status === 'ENABLED' ? '' : ' (' + f.campaign.status + ')'));
    });
  }
  ['CALL', 'BUSINESS_MESSAGE', 'LEAD_FORM'].forEach(function (tipo) {
    ligar("SELECT asset.resource_name, customer_asset.status FROM customer_asset WHERE customer_asset.field_type = '" + tipo + "' AND customer_asset.status = 'ENABLED'",
      'los recursos de la cuenta (' + tipo + ')', 'cuenta');
    ligar("SELECT asset.resource_name, campaign.name, campaign.status FROM campaign_asset WHERE campaign_asset.field_type = '" + tipo + "' " +
      "AND campaign_asset.status = 'ENABLED' AND campaign.status != 'REMOVED'", 'los recursos de las campañas (' + tipo + ')', 'campaña');
  });

  // ---- Botón de mensaje / WhatsApp en el anuncio
  Logger.log('');
  Logger.log('==== BOTÓN DE MENSAJE / WHATSAPP EN EL ANUNCIO ====');
  var mensajes = filas('SELECT asset.resource_name, asset.name, asset.business_message_asset.message_provider, asset.business_message_asset.starter_message, ' +
    'asset.business_message_asset.whatsapp_info.phone_number, asset.business_message_asset.whatsapp_info.country_code, asset.policy_summary.approval_status, ' +
    "asset.policy_summary.review_status, asset.policy_summary.policy_topic_entries FROM asset WHERE asset.type = 'BUSINESS_MESSAGE'", 'los botones de mensaje');
  if (!mensajes.length) Logger.log('No hay botón de mensaje en los anuncios (o Google no deja leerlo con scripts).');
  mensajes.forEach(function (f) {
    var a = f.asset, b = a.businessMessageAsset || {}, w = b.whatsappInfo || {};
    var numero = digitos(w.phoneNumber), lugares = donde[a.resourceName] || [];
    Logger.log('Botón ' + (b.messageProvider || '') + ' → ' + (w.phoneNumber || '(sin número)') + ' · ' + aprobacion(a.policySummary) +
      ' · sale en: ' + (lugares.join(', ') || 'ninguna campaña (no se usa)') + (b.starterMessage ? ' · mensaje inicial: «' + b.starterMessage + '»' : ''));
    if (lugares.length && numero && numero !== vendedor) MAL.push('El botón de WhatsApp del anuncio manda al ' + w.phoneNumber + ', NO al vendedor (' + PLAN.telefono + '). Sale en: ' + lugares.join(', ') + '. Los mensajes de esos clientes le llegan a otra persona.');
    else if (lugares.length && numero === vendedor) BIEN.push('El botón de WhatsApp del anuncio manda al vendedor (' + PLAN.telefono + ').');
  });

  var nuevasConMensaje = mensajes.some(function (f) {
    return (donde[f.asset.resourceName] || []).some(function (l) { return l === 'toda la cuenta' || l.indexOf('«' + PLAN.prefijo) === 0; });
  });
  if (!nuevasConMensaje) MAL.push('Las campañas nuevas «' + PLAN.prefijo + '» NO tienen botón de WhatsApp en el anuncio: se pierde el canal que más conversaciones traía.');

  // ---- Botón de llamada
  Logger.log('');
  Logger.log('==== BOTÓN DE LLAMADA EN EL ANUNCIO ====');
  var llamadas = filas('SELECT asset.resource_name, asset.call_asset.phone_number, asset.call_asset.country_code, asset.policy_summary.approval_status, ' +
    "asset.policy_summary.review_status, asset.policy_summary.policy_topic_entries FROM asset WHERE asset.type = 'CALL'", 'los botones de llamada');
  if (!llamadas.length) OJO.push('No hay botón de llamada en la cuenta.');
  var hayVendedor = false;
  llamadas.forEach(function (f) {
    var a = f.asset, numero = digitos((a.callAsset || {}).phoneNumber), lugares = donde[a.resourceName] || [];
    Logger.log('Llamada → ' + (a.callAsset || {}).phoneNumber + ' · ' + aprobacion(a.policySummary) + ' · sale en: ' + (lugares.join(', ') || 'ninguna campaña (no se usa)'));
    if (!lugares.length) return;
    if (numero !== vendedor) MAL.push('El botón de llamada marca al ' + (a.callAsset || {}).phoneNumber + ', NO al vendedor (' + PLAN.telefono + '). Sale en: ' + lugares.join(', ') + '.');
    else hayVendedor = true;
    if ((a.policySummary || {}).approvalStatus === 'DISAPPROVED') MAL.push('Google RECHAZÓ el botón de llamada ' + (a.callAsset || {}).phoneNumber + ': no se muestra.');
  });
  if (hayVendedor) BIEN.push('El botón de llamada marca al vendedor (' + PLAN.telefono + ').');

  // ---- Llamadas reales de los últimos 30 días
  Logger.log('');
  Logger.log('==== LLAMADAS DESDE EL ANUNCIO, ÚLTIMOS 30 DÍAS ====');
  var hace30 = Utilities.formatDate(new Date(Date.now() - 30 * 864e5), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  // call_view no acepta segments.date: se filtra por la hora de la llamada
  var vistas = filas('SELECT campaign.name, call_view.start_call_date_time, call_view.call_duration_seconds, call_view.call_status, ' +
    "call_view.caller_area_code FROM call_view WHERE call_view.start_call_date_time >= '" + hace30 + " 00:00:00' ORDER BY call_view.start_call_date_time DESC", 'las llamadas');
  var perdidas = 0;
  vistas.forEach(function (f) {
    var c = f.callView, perdida = c.callStatus === 'MISSED';
    if (perdida) perdidas++;
    Logger.log(c.startCallDateTime + ' · ' + f.campaign.name + ' · ' + (perdida ? 'NO CONTESTADA' : 'contestada') + ' · ' + num(c.callDurationSeconds) + ' s · lada ' + (c.callerAreaCode || '?'));
  });
  if (!vistas.length) Logger.log('Ninguna llamada desde el botón del anuncio en 30 días.');
  if (perdidas) MAL.push(perdidas + ' llamada(s) desde el anuncio NO se contestaron en 30 días.');

  // ---- Conversaciones y llamadas que Google registró, por campaña
  Logger.log('');
  Logger.log('==== CONVERSACIONES Y LLAMADAS REGISTRADAS, ÚLTIMOS 30 DÍAS ====');
  var hay = 0;
  filas('SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE segments.date DURING LAST_30_DAYS', 'las conversiones')
    .forEach(function (f) {
      var n = f.segments.conversionActionName, v = num((f.metrics || {}).allConversions);
      if (!v || !/conversa|conversation|mensaje|message|whats|llamad|call/i.test(n)) return;
      hay++;
      Logger.log('«' + n + '» · ' + f.campaign.name + ' · ' + Math.round(v * 10) / 10);
    });
  if (!hay) Logger.log('Ninguna.');
  else OJO.push('Hubo conversaciones o llamadas registradas por Google (arriba). Confirma con el vendedor que le llegaron; si no, se fueron al número del botón que no es suyo.');

  // ---- Formularios dentro del anuncio
  var formularios = filas("SELECT asset.resource_name, asset.lead_form_asset.business_name FROM asset WHERE asset.type = 'LEAD_FORM'", 'los formularios del anuncio');
  Logger.log('');
  Logger.log('==== FORMULARIOS DENTRO DEL ANUNCIO ====');
  Logger.log(formularios.length ? formularios.length + ' formulario(s). Sus contactos se descargan en Google Ads > Recursos > Formularios.' : 'Ninguno.');
  if (formularios.some(function (f) { return (donde[f.asset.resourceName] || []).length; }))
    OJO.push('Hay formularios dentro del anuncio activos: sus contactos NO le llegan solos al vendedor; hay que descargarlos en Google Ads > Recursos.');

  Logger.log('');
  Logger.log('==== RESULTADO ====');
  MAL.forEach(function (t) { Logger.log('❌ ' + t); });
  OJO.forEach(function (t) { Logger.log('⚠️ ' + t); });
  BIEN.forEach(function (t) { Logger.log('✅ ' + t); });
  if (!MAL.length && !OJO.length) Logger.log('✅ Los botones del anuncio mandan al vendedor y no hubo llamadas perdidas.');
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
