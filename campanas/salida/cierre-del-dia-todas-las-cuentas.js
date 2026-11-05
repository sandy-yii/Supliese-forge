/**
 * Atelback · Reporte de contactos del día — las cinco cuentas
 * Escrito a mano el 4 nov 2026 y ampliado el 5 nov (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Se puede correr a cualquier hora y da dos días:
 *   - AYER, día completo (es el que va al reporte para el cliente y el que se compara con los vendedores);
 *   - HOY, desde las 0:00 hasta la hora en que se corre (para ver cómo va).
 * Para cada día, en TODAS las campañas (nuevas «AB ·» y anteriores, incluida Máximo rendimiento):
 *   - contactos por tipo, separados como los cuenta el vendedor:
 *       WhatsApp · llamada (botón del anuncio / clic al teléfono de la página) · correo o formulario;
 *   - contactos por campaña, clics, gasto y costo por clic;
 *   - cada llamada del botón del anuncio con su hora, duración y si se contestó, para buscarla en el teléfono del vendedor;
 *   - una línea final «REPORTE» lista para el informe.
 * Los contactos se cuentan en el día en que la persona tocó el botón (no el día del clic al anuncio), igual que el vendedor.
 * Google tarda hasta 3 horas en mostrar algunos contactos: por eso el número que vale es el de AYER.
 *
 * CÓMO SE USA: cada mañana, en cada cuenta > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry',
  '993-525-8739': 'Kingstar (CLM)',
  '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau',
  '118-347-6484': 'Gamesail'
};
// Qué cuenta como contacto (mismo criterio que los demás informes).
var CONTACTO = /conversa|conversation|mensaje|message|whats|\bwa\b|llamad|call|tel[eé]fono|phone|formul|lead|contact|correo|mail/i;

function filas(consulta, que, callar) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    if (callar) throw e;
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function dinero(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function uno(x) { return Math.round(x * 10) / 10; }
function minutos(s) { s = Number(s || 0); return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }

// Tipo de contacto, como lo ve el vendedor. «tipoGoogle» es el tipo de la acción en Google Ads.
function tipo(nombre, tipoGoogle) {
  if (tipoGoogle === 'AD_CALL') return { grupo: 'Llamada', sub: 'botón del anuncio' };
  if (tipoGoogle === 'WEBSITE_CALL') return { grupo: 'Llamada', sub: 'número de Google en la página' };
  if (/whats|\bwa\b|mensaje|message|conversa|conversation/i.test(nombre)) return { grupo: 'WhatsApp', sub: 'WhatsApp' };
  if (/formul|lead/i.test(nombre)) return { grupo: 'Correo o formulario', sub: 'formulario' };
  if (/correo|mail/i.test(nombre)) return { grupo: 'Correo o formulario', sub: 'clic en el correo' };
  if (/anuncio|from ads|ad call/i.test(nombre)) return { grupo: 'Llamada', sub: 'botón del anuncio' };
  if (/llamad|call|tel[eé]fono|phone/i.test(nombre)) return { grupo: 'Llamada', sub: 'clic al teléfono de la página' };
  return { grupo: 'Otro', sub: 'otro' };
}

function dia(cual, fecha, tiposGoogle, marca, hora) {
  var rango = cual === 'AYER' ? 'YESTERDAY' : 'TODAY';
  var titulo = cual === 'AYER' ? 'AYER ' + fecha + ' · día completo' : 'HOY ' + fecha + ' · hasta las ' + hora;
  Logger.log('################ ' + titulo + ' ################');

  // Clics y gasto por campaña
  var C = {}, tot = { clics: 0, costo: 0 };
  filas("SELECT campaign.name, campaign.advertising_channel_type, metrics.clicks, metrics.cost_micros, metrics.impressions " +
    "FROM campaign WHERE segments.date DURING " + rango + " AND metrics.impressions > 0", 'las campañas').forEach(function (f) {
    var c = { nombre: f.campaign.name, pmax: f.campaign.advertisingChannelType === 'PERFORMANCE_MAX',
      clics: Number(f.metrics.clicks || 0), costo: Number(f.metrics.costMicros || 0) / 1e6, contactos: 0 };
    C[c.nombre] = c;
    tot.clics += c.clics; tot.costo += c.costo;
  });

  // Contactos por acción y campaña, en el día del contacto. Si Google no lo permite, en el día del clic.
  var conv = [], porFecha = true;
  try {
    conv = filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions_by_conversion_date FROM campaign " +
      "WHERE segments.date DURING " + rango + " AND metrics.all_conversions_by_conversion_date > 0", 'los contactos', true);
  } catch (e) {
    porFecha = false;
    conv = filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign " +
      "WHERE segments.date DURING " + rango + " AND metrics.all_conversions > 0", 'los contactos');
  }
  var grupos = { 'WhatsApp': 0, 'Llamada': 0, 'Correo o formulario': 0, 'Otro': 0 }, subs = {}, acciones = {}, total = 0;
  conv.forEach(function (f) {
    var n = f.segments.conversionActionName || '';
    var v = Number(porFecha ? f.metrics.allConversionsByConversionDate : f.metrics.allConversions) || 0;
    if (!CONTACTO.test(n) && tiposGoogle[n] !== 'AD_CALL' && tiposGoogle[n] !== 'WEBSITE_CALL') return;
    var t = tipo(n, tiposGoogle[n]);
    total += v;
    grupos[t.grupo] += v;
    subs[t.sub] = (subs[t.sub] || 0) + v;
    acciones[n] = { v: ((acciones[n] || {}).v || 0) + v, t: t };
    if (C[f.campaign.name]) C[f.campaign.name].contactos += v;
    else C[f.campaign.name] = { nombre: f.campaign.name, clics: 0, costo: 0, contactos: v };
  });

  Logger.log('Toda la cuenta: ' + uno(total) + ' contacto(s) · ' + tot.clics + ' clics · ' + dinero(tot.costo) + ' · costo por clic ' +
    (tot.clics ? '$' + (tot.costo / tot.clics).toFixed(2) : '—') + (porFecha ? '' : ' (contactos contados en el día del clic)'));
  Logger.log('');
  Logger.log('== CONTACTOS POR TIPO ==');
  Logger.log('WhatsApp: ' + uno(grupos['WhatsApp']));
  Logger.log('Llamada: ' + uno(grupos['Llamada']) + ' (botón del anuncio ' + uno(subs['botón del anuncio'] || 0) +
    ', clic al teléfono de la página ' + uno(subs['clic al teléfono de la página'] || 0) +
    (subs['número de Google en la página'] ? ', número de Google en la página ' + uno(subs['número de Google en la página']) : '') + ')');
  Logger.log('Correo o formulario: ' + uno(grupos['Correo o formulario']) + ' (formulario ' + uno(subs['formulario'] || 0) +
    ', clic en el correo ' + uno(subs['clic en el correo'] || 0) + ')');
  if (grupos['Otro']) Logger.log('Otro: ' + uno(grupos['Otro']));
  Logger.log('');
  Logger.log('== POR ACCIÓN (para revisar que no se cuente doble) ==');
  Object.keys(acciones).forEach(function (n) {
    Logger.log('«' + n + '» → ' + acciones[n].t.grupo + ' (' + acciones[n].t.sub + '): ' + uno(acciones[n].v) +
      (n.indexOf('AB · ') === 0 ? '' : ' · acción anterior, no «AB ·»'));
  });
  if (!Object.keys(acciones).length) Logger.log('Ninguno registrado.');
  Logger.log('');
  Logger.log('== POR CAMPAÑA ==');
  Object.keys(C).sort(function (a, b) { return C[b].costo - C[a].costo; }).forEach(function (k) {
    var c = C[k];
    Logger.log(k + (c.pmax ? ' (Máximo rendimiento)' : '') + ' · ' + c.clics + ' clics · ' + dinero(c.costo) + ' · ' + uno(c.contactos) + ' contacto(s)');
  });
  if (!Object.keys(C).length) Logger.log('Ninguna campaña tuvo movimiento.');
  Logger.log('');

  // Llamadas reales del botón del anuncio (hora, duración y si se contestó)
  Logger.log('== LLAMADAS DEL BOTÓN DEL ANUNCIO (para buscarlas en el teléfono del vendedor) ==');
  var llamadas = filas("SELECT campaign.name, call_view.start_call_date_time, call_view.call_duration_seconds, call_view.call_status, " +
    "call_view.caller_area_code FROM call_view WHERE call_view.start_call_date_time >= '" + fecha + " 00:00:00' " +
    "AND call_view.start_call_date_time <= '" + fecha + " 23:59:59' ORDER BY call_view.start_call_date_time", 'las llamadas');
  var noContestadas = 0;
  llamadas.forEach(function (f) {
    var c = f.callView, perdida = c.callStatus === 'MISSED';
    if (perdida) noContestadas++;
    Logger.log(String(c.startCallDateTime).substr(11, 5) + ' · ' + minutos(c.callDurationSeconds) + ' · ' + (perdida ? 'NO CONTESTADA' : 'contestada') +
      ' · lada ' + (c.callerAreaCode || '?') + ' · ' + f.campaign.name);
  });
  if (!llamadas.length) Logger.log('Ninguna (o Google no da el detalle de llamadas en esta cuenta).');
  Logger.log('');

  return 'REPORTE · ' + marca + ' · ' + (cual === 'AYER' ? 'ayer ' + fecha + ' (día completo)' : 'hoy ' + fecha + ' hasta ' + hora) +
    ' · WhatsApp ' + uno(grupos['WhatsApp']) +
    ' · llamadas ' + uno(grupos['Llamada']) + ' (anuncio ' + uno(subs['botón del anuncio'] || 0) + ', página ' + uno(subs['clic al teléfono de la página'] || 0) + ')' +
    ' · correo o formulario ' + uno(grupos['Correo o formulario']) +
    (grupos['Otro'] ? ' · otros ' + uno(grupos['Otro']) : '') +
    ' · total ' + uno(total) + ' · clics ' + tot.clics + ' · gasto ' + dinero(tot.costo) +
    (llamadas.length ? ' · llamadas del anuncio no contestadas ' + noContestadas : '');
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var marca = MARCAS[cid] || AdsApp.currentAccount().getName();
  var zona = AdsApp.currentAccount().getTimeZone();
  var ahora = new Date();
  var hoy = Utilities.formatDate(ahora, zona, 'yyyy-MM-dd');
  var ayer = Utilities.formatDate(new Date(ahora.getTime() - 864e5), zona, 'yyyy-MM-dd');
  var hora = Utilities.formatDate(ahora, zona, 'HH:mm');
  Logger.log('REPORTE DE CONTACTOS · ' + marca + ' · corrido el ' + hoy + ' a las ' + hora + ' · solo lee');
  Logger.log('');

  // Tipo de cada acción en Google Ads (para separar las llamadas del botón del anuncio)
  var tiposGoogle = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status != 'REMOVED'",
    'las acciones de contacto').forEach(function (f) { tiposGoogle[f.conversionAction.name] = f.conversionAction.type; });

  var lineaAyer = dia('AYER', ayer, tiposGoogle, marca, hora);
  var lineaHoy = dia('HOY', hoy, tiposGoogle, marca, hora);

  Logger.log('Cómo comparar con el vendedor: hoy el formulario de la página abre WhatsApp al enviar, así que al vendedor le llega como');
  Logger.log('WhatsApp. Un «clic al teléfono de la página» es un toque al número: la persona pudo no terminar la llamada.');
  Logger.log('');
  Logger.log(lineaAyer);
  Logger.log(lineaHoy);
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
