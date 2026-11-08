/**
 * Atelback · Vaciado de contactos de VARIOS DÍAS (ya viene desde el viernes 6 nov) — las cinco cuentas
 * Escrito a mano el 5 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Da el detalle más fino que Google Ads guarda de cada contacto del día, para
 * buscarlo en el registro de los vendedores (el Drive del cliente):
 *   1. Totales del día: WhatsApp, formulario, llamada (botón del anuncio y teléfono de la página) y correo.
 *   2. CADA CONTACTO: hora (en tramos de una hora), tipo, campaña, grupo de anuncios y si fue desde celular o computadora.
 *   3. Qué buscó en Google la persona antes de contactar (palabras de búsqueda).
 *   4. Desde qué ciudad buscó.
 *   5. Las llamadas del botón del anuncio, una por una: hora exacta, duración, si se contestó y la lada.
 *   6. Las mismas filas en formato para pegar en una hoja de cálculo.
 *
 * LO QUE GOOGLE NO DA: nombre, teléfono completo ni correo de la persona. Google no los guarda para WhatsApp ni para
 * llamadas, y por decisión del 3 nov no le mandamos los datos del formulario. Esos datos solo los tiene el vendedor.
 * Para cruzar se usan la hora, el tipo, la sección (campaña y grupo), la ciudad y, en llamadas, la lada y la duración.
 *
 * QUÉ DÍA: si se corre después de las 12 del día, da HOY hasta la hora en que se corre (lo normal: en la noche, después
 * de las 9 p. m.). Si se corre en la mañana (antes de las 12), da AYER completo.
 * VARIOS DÍAS (por ejemplo, el fin de semana): escribe en DESDE la fecha del primer día, como '2026-11-06'. El script da
 * cada día desde esa fecha hasta hoy (hoy, hasta la hora en que se corre) y al final un resumen por día.
 * La hora de cada contacto es la del clic en el anuncio; el contacto suele ser minutos después.
 *
 * CÓMO SE USA: en cada cuenta > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var CONTACTO = /conversa|conversation|mensaje|message|whats|\bwa\b|llamad|call|tel[eé]fono|phone|formul|lead|contact|correo|mail/i;
// Vacío = un solo día (hoy en la tarde o noche, ayer en la mañana). Con fecha = desde ese día hasta hoy.
var DESDE = '2026-11-06';

var DISPOSITIVO = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta', CONNECTED_TV: 'TV', OTHER: 'otro' };

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
function uno(x) { return Math.round(x * 10) / 10; }
function dinero(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function dos(n) { return ('0' + n).slice(-2); }
function tramo(h) { return dos(h) + ':00–' + dos(h) + ':59'; }
function minutos(s) { s = Number(s || 0); return Math.floor(s / 60) + ' min ' + (s % 60) + ' s'; }
function tipo(nombre, tipoGoogle) {
  if (tipoGoogle === 'AD_CALL' || /anuncio|from ads|ad call/i.test(nombre)) return 'Llamada (botón del anuncio)';
  if (tipoGoogle === 'WEBSITE_CALL') return 'Llamada (número de Google en la página)';
  if (/whats|\bwa\b|mensaje|message|conversa|conversation/i.test(nombre)) return 'WhatsApp';
  if (/formul|lead/i.test(nombre)) return 'Formulario';
  if (/correo|mail/i.test(nombre)) return 'Correo (clic en el correo)';
  if (/llamad|call|tel[eé]fono|phone/i.test(nombre)) return 'Llamada (clic al teléfono de la página)';
  return 'Otro';
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var marca = MARCAS[cid] || AdsApp.currentAccount().getName();
  var zona = AdsApp.currentAccount().getTimeZone();
  var ahora = new Date();
  var hoy = Utilities.formatDate(ahora, zona, 'yyyy-MM-dd');
  var horaTexto = 'hasta las ' + Utilities.formatDate(ahora, zona, 'HH:mm');
  var tiposGoogle = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status != 'REMOVED'", 'las acciones')
    .forEach(function (f) { tiposGoogle[f.conversionAction.name] = f.conversionAction.type; });

  var dias = [];
  if (DESDE) {
    for (var t = new Date(DESDE + 'T12:00:00Z'); t.toISOString().substr(0, 10) <= hoy; t.setUTCDate(t.getUTCDate() + 1)) {
      var d = t.toISOString().substr(0, 10);
      dias.push({ dia: d, hasta: d === hoy ? horaTexto : 'día completo' });
    }
  } else if (Number(Utilities.formatDate(ahora, zona, 'H')) < 12) {
    dias.push({ dia: Utilities.formatDate(new Date(ahora.getTime() - 864e5), zona, 'yyyy-MM-dd'), hasta: 'día completo' });
  } else {
    dias.push({ dia: hoy, hasta: horaTexto });
  }
  var resumen = dias.map(function (x) { return vaciarDia(x.dia, x.hasta, marca, tiposGoogle); });
  if (dias.length > 1) {
    Logger.log('################ RESUMEN POR DÍA · ' + marca + ' ################');
    resumen.forEach(function (r) { Logger.log(r); });
  }
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}

function vaciarDia(dia, hasta, marca, tiposGoogle) {
  var cuando = "segments.date = '" + dia + "'";
  Logger.log('VACIADO DE CONTACTOS · ' + marca + ' · ' + dia + ' (' + hasta + ') · solo lee');
  Logger.log('');
  function esContacto(n) { return CONTACTO.test(n) || tiposGoogle[n] === 'AD_CALL' || tiposGoogle[n] === 'WEBSITE_CALL'; }

  // Cada contacto: campañas de búsqueda por grupo; las demás (Máximo rendimiento, etc.) por campaña
  var lista = [];
  filas('SELECT campaign.name, ad_group.name, segments.hour, segments.device, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM ad_group WHERE ' + cuando + " AND campaign.advertising_channel_type = 'SEARCH' AND metrics.all_conversions > 0", 'los contactos por grupo')
    .forEach(function (f) {
      var n = f.segments.conversionActionName || '';
      if (!esContacto(n)) return;
      lista.push({ hora: Number(f.segments.hour), tipo: tipo(n, tiposGoogle[n]), accion: n, campana: f.campaign.name, grupo: f.adGroup.name,
        disp: DISPOSITIVO[f.segments.device] || f.segments.device, v: Number(f.metrics.allConversions || 0) });
    });
  filas('SELECT campaign.name, campaign.advertising_channel_type, segments.hour, segments.device, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM campaign WHERE ' + cuando + " AND campaign.advertising_channel_type != 'SEARCH' AND metrics.all_conversions > 0", 'los contactos de otras campañas')
    .forEach(function (f) {
      var n = f.segments.conversionActionName || '';
      if (!esContacto(n)) return;
      lista.push({ hora: Number(f.segments.hour), tipo: tipo(n, tiposGoogle[n]), accion: n, campana: f.campaign.name,
        grupo: f.campaign.advertisingChannelType === 'PERFORMANCE_MAX' ? '(Máximo rendimiento, sin grupos)' : '—',
        disp: DISPOSITIVO[f.segments.device] || f.segments.device, v: Number(f.metrics.allConversions || 0) });
    });
  lista.sort(function (a, b) { return a.hora - b.hora || a.tipo.localeCompare(b.tipo); });

  // 1. Totales
  var T = {}, total = 0;
  lista.forEach(function (c) { T[c.tipo] = (T[c.tipo] || 0) + c.v; total += c.v; });
  var clics = 0, costo = 0;
  filas('SELECT metrics.clicks, metrics.cost_micros FROM customer WHERE ' + cuando, 'los clics').forEach(function (f) {
    clics += Number(f.metrics.clicks || 0); costo += Number(f.metrics.costMicros || 0) / 1e6;
  });
  var wa = T['WhatsApp'] || 0, form = T['Formulario'] || 0, correo = T['Correo (clic en el correo)'] || 0;
  var tel = 0;
  Object.keys(T).forEach(function (k) { if (k.indexOf('Llamada') === 0) tel += T[k]; });
  Logger.log('==== 1. TOTALES DEL DÍA ====');
  Logger.log('WhatsApp: ' + uno(wa));
  Logger.log('Formulario: ' + uno(form) + '   (hoy el formulario abre WhatsApp al enviar: al vendedor le llega como WhatsApp)');
  var detalle = Object.keys(T).filter(function (k) { return k.indexOf('Llamada') === 0; })
    .map(function (k) { return k.replace('Llamada ', '') + ' ' + uno(T[k]); }).join(', ');
  Logger.log('Llamada: ' + uno(tel) + (detalle ? '   (' + detalle + ')' : ''));
  Logger.log('Correo: ' + uno(correo));
  if (T['Otro']) Logger.log('Otro: ' + uno(T['Otro']));
  Logger.log('Total: ' + uno(total) + ' contacto(s) · ' + clics + ' clics · ' + dinero(costo));
  Logger.log('');

  // 2. Cada contacto
  Logger.log('==== 2. CADA CONTACTO (hora del clic · tipo · sección · dispositivo) ====');
  Logger.log('(En Máximo rendimiento Google no siempre da la hora real: si sale 00:00, tómala como «sin hora».)');
  var k = 0;
  lista.forEach(function (c) {
    k++;
    Logger.log('#' + k + ' · ' + tramo(c.hora) + ' · ' + c.tipo + ' · «' + c.campana + '» › ' + c.grupo + ' · ' + c.disp +
      (Math.abs(c.v - 1) > 0.05 ? ' · ' + uno(c.v) + ' contactos en ese tramo' : ''));
  });
  if (!lista.length) Logger.log('Ningún contacto registrado.');
  Logger.log('');

  // 3. Qué buscaron
  Logger.log('==== 3. QUÉ BUSCARON EN GOOGLE ANTES DE CONTACTAR (campañas de búsqueda) ====');
  var busq = filas('SELECT search_term_view.search_term, campaign.name, ad_group.name, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM search_term_view WHERE ' + cuando + ' AND metrics.all_conversions > 0', 'las búsquedas');
  var nb = 0;
  busq.forEach(function (f) {
    var n = f.segments.conversionActionName || '';
    if (!esContacto(n)) return;
    nb++;
    Logger.log('«' + f.searchTermView.searchTerm + '» → ' + tipo(n, tiposGoogle[n]) + ' · ' + f.adGroup.name + ' · ' + uno(Number(f.metrics.allConversions || 0)));
  });
  if (!nb) Logger.log('Google todavía no muestra las búsquedas de hoy (a veces tardan unas horas) o no hubo contactos de búsqueda.');
  Logger.log('');

  // 4. Desde qué ciudad
  Logger.log('==== 4. DESDE QUÉ CIUDAD ====');
  var lugares = filas('SELECT segments.geo_target_city, segments.conversion_action_name, metrics.all_conversions FROM user_location_view ' +
    'WHERE ' + cuando + ' AND metrics.all_conversions > 0', 'las ciudades');
  var ciudades = {}, porCiudad = {};
  lugares.forEach(function (f) {
    var n = f.segments.conversionActionName || '', c = f.segments.geoTargetCity;
    if (!esContacto(n) || !c) return;
    ciudades[c] = true;
    var clave = c + '|' + tipo(n, tiposGoogle[n]);
    porCiudad[clave] = (porCiudad[clave] || 0) + Number(f.metrics.allConversions || 0);
  });
  var nombres = {};
  var rns = Object.keys(ciudades);
  if (rns.length) {
    filas("SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name FROM geo_target_constant WHERE geo_target_constant.resource_name IN ('" +
      rns.join("','") + "')", 'los nombres de las ciudades').forEach(function (f) {
      nombres[f.geoTargetConstant.resourceName] = f.geoTargetConstant.canonicalName;
    });
  }
  Object.keys(porCiudad).forEach(function (clave) {
    var p = clave.split('|');
    Logger.log((nombres[p[0]] || p[0]) + ' · ' + p[1] + ' · ' + uno(porCiudad[clave]));
  });
  if (!Object.keys(porCiudad).length) Logger.log('Google no da la ciudad de los contactos de hoy (a veces tarda unas horas).');
  Logger.log('');

  // 5. Llamadas del botón del anuncio
  Logger.log('==== 5. LLAMADAS DEL BOTÓN DEL ANUNCIO, UNA POR UNA ====');
  var llamadas = filas('SELECT campaign.name, call_view.start_call_date_time, call_view.end_call_date_time, call_view.call_duration_seconds, ' +
    "call_view.call_status, call_view.caller_area_code, call_view.caller_country_code FROM call_view WHERE call_view.start_call_date_time >= '" + dia +
    " 00:00:00' AND call_view.start_call_date_time <= '" + dia + " 23:59:59' ORDER BY call_view.start_call_date_time", 'las llamadas');
  llamadas.forEach(function (f) {
    var c = f.callView;
    Logger.log(String(c.startCallDateTime).substr(11, 8) + ' · ' + minutos(c.callDurationSeconds) + ' · ' +
      (c.callStatus === 'MISSED' ? 'NO CONTESTADA' : 'contestada') + ' · lada ' + (c.callerAreaCode || '?') + ' · ' + f.campaign.name);
  });
  if (!llamadas.length) Logger.log('Ninguna llamada del botón del anuncio (o Google no da el detalle en esta cuenta).');
  Logger.log('');

  // 6. Para pegar en una hoja
  Logger.log('==== 6. PARA PEGAR EN UNA HOJA (separado por ;) ====');
  Logger.log('fecha;hora;marca;tipo;campaña;grupo;dispositivo;contactos');
  lista.forEach(function (c) {
    Logger.log([dia, tramo(c.hora), marca, c.tipo, c.campana, c.grupo, c.disp, uno(c.v)].join(';'));
  });
  llamadas.forEach(function (f) {
    var c = f.callView;
    Logger.log([dia, String(c.startCallDateTime).substr(11, 5), marca, 'Llamada del anuncio, ' + (c.callStatus === 'MISSED' ? 'no contestada' : 'contestada') +
      ', ' + minutos(c.callDurationSeconds) + ', lada ' + (c.callerAreaCode || '?'), f.campaign.name, '', '', 1].join(';'));
  });
  Logger.log('');
  var linea = 'VACIADO · ' + marca + ' · ' + dia + ' (' + hasta + ') · WhatsApp ' + uno(wa) + ' · formulario ' + uno(form) + ' · llamada ' + uno(tel) +
    ' · correo ' + uno(correo) + ' · total ' + uno(total) + ' · clics ' + clics + ' · gasto ' + dinero(costo);
  Logger.log(linea);
  Logger.log('');
  return linea;
}
