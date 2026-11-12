/**
 * Atelback · Vaciado de la noche + embudo (impresiones y clics) — las cinco cuentas, UNA SOLA CORRIDA si se puede
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py). Reemplaza a «vaciado-de-contactos-de-la-noche»: da lo mismo
 * de siempre y además cuántas veces se mostraron los anuncios (impresiones) y cuántos clics hubo, en total y por campaña.
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   0. EMBUDO DEL DÍA POR CAMPAÑA: impresiones, clics, contactos y de cada 100 clics cuántos escribieron o llamaron.
 *   1. Totales del día: WhatsApp, formulario, llamada y correo, con impresiones, clics y gasto.
 *   2. Cada contacto: hora (en tramos de una hora), tipo, campaña, grupo y dispositivo.
 *   3. Qué buscó en Google la persona antes de contactar.
 *   4. Desde qué ciudad buscó.
 *   5. Las llamadas del botón del anuncio, una por una.
 *   6. Las mismas filas para pegar en una hoja de cálculo.
 *   Al final, un renglón «VACIADO ·» por marca y día, y si corre en la cuenta de administrador, la SUMA DE LAS 5 MARCAS.
 *
 * UNA SOLA CORRIDA: si se pega en una cuenta de ADMINISTRADOR (MCC) que tenga las 5 cuentas, recorre las 5 sola.
 * Si se pega en una cuenta normal, hace solo esa cuenta (como siempre).
 *
 * QUÉ DÍA: si se corre después de las 12 del día, da HOY hasta la hora en que se corre. Si se corre antes de las 12,
 * da AYER completo. VARIOS DÍAS: escribe en DESDE la fecha del primer día, por ejemplo '2026-11-06'.
 * La hora de cada contacto es la del clic en el anuncio; el contacto suele ser minutos después.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var CONTACTO = /conversa|conversation|mensaje|message|whats|\bwa\b|llamad|call|tel[eé]fono|phone|formul|lead|contact|correo|mail/i;
// Vacío = un solo día (hoy en la tarde o noche, ayer en la mañana). Con fecha = desde ese día hasta hoy.
var DESDE = '';

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
function miles(x) { return Math.round(Number(x) || 0).toLocaleString('en-US'); }
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
  var todos = [];
  var esMcc = typeof AdsManagerApp !== 'undefined';
  if (esMcc) {
    var it = AdsManagerApp.accounts().withIds(Object.keys(MARCAS)).get(), vistos = 0;
    while (it.hasNext()) {
      var cuenta = it.next();
      AdsManagerApp.select(cuenta);
      vistos++;
      todos = todos.concat(unaCuenta());
      Logger.log('');
    }
    if (!vistos) Logger.log('AVISO: esta cuenta de administrador no tiene ninguna de las 5 cuentas.');
  } else {
    todos = unaCuenta();
  }
  if (todos.length > 1) {
    Logger.log('################ RESUMEN ################');
    var porDia = {};
    todos.forEach(function (r) {
      Logger.log(r.linea);
      var s = porDia[r.dia] = porDia[r.dia] || { imp: 0, clics: 0, total: 0, wa: 0, form: 0, tel: 0, gasto: 0, marcas: 0 };
      s.imp += r.imp; s.clics += r.clics; s.total += r.total; s.wa += r.wa; s.form += r.form; s.tel += r.tel; s.gasto += r.gasto; s.marcas++;
    });
    if (esMcc) {
      Logger.log('');
      Object.keys(porDia).sort().forEach(function (d) {
        var s = porDia[d];
        Logger.log('SUMA DE LAS ' + s.marcas + ' MARCAS · ' + d + ' · impresiones ' + miles(s.imp) + ' · clics ' + miles(s.clics) +
          ' · contactos ' + uno(s.total) + ' (WhatsApp ' + uno(s.wa) + ', formulario ' + uno(s.form) + ', llamada ' + uno(s.tel) + ')' +
          ' · de cada 100 clics ' + (s.clics ? uno(s.total / s.clics * 100) : 0) + ' · gasto ' + dinero(s.gasto));
      });
    }
  }
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}

function unaCuenta() {
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
  return dias.map(function (x) { return vaciarDia(x.dia, x.hasta, marca, tiposGoogle); });
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
  var clics = 0, costo = 0, imp = 0;
  filas('SELECT metrics.clicks, metrics.cost_micros, metrics.impressions FROM customer WHERE ' + cuando, 'los clics').forEach(function (f) {
    clics += Number(f.metrics.clicks || 0); costo += Number(f.metrics.costMicros || 0) / 1e6; imp += Number(f.metrics.impressions || 0);
  });

  // 0. Embudo por campaña
  var E = {};
  filas('SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign WHERE ' + cuando + ' AND metrics.impressions > 0',
    'el embudo por campaña').forEach(function (f) {
      var e = E[f.campaign.name] = E[f.campaign.name] || { imp: 0, clics: 0, gasto: 0, cont: 0 };
      e.imp += Number(f.metrics.impressions || 0); e.clics += Number(f.metrics.clicks || 0); e.gasto += Number(f.metrics.costMicros || 0) / 1e6;
    });
  lista.forEach(function (c) { var e = E[c.campana] = E[c.campana] || { imp: 0, clics: 0, gasto: 0, cont: 0 }; e.cont += c.v; });
  Logger.log('==== 0. EMBUDO DEL DÍA POR CAMPAÑA (se mostró → clic → contacto) ====');
  Object.keys(E).sort(function (a, b) { return E[b].clics - E[a].clics; }).forEach(function (k) {
    var e = E[k];
    Logger.log('«' + k + '» · ' + miles(e.imp) + ' impresiones · ' + miles(e.clics) + ' clics · ' + uno(e.cont) + ' contactos' +
      (e.clics ? ' · ' + uno(e.cont / e.clics * 100) + ' de cada 100 clics' : '') + ' · ' + dinero(e.gasto));
  });
  if (!Object.keys(E).length) Logger.log('Ninguna campaña se mostró este día.');
  Logger.log('');
  var wa = T['WhatsApp'] || 0, form = T['Formulario'] || 0, correo = T['Correo (clic en el correo)'] || 0;
  var tel = 0;
  Object.keys(T).forEach(function (k) { if (k.indexOf('Llamada') === 0) tel += T[k]; });
  Logger.log('==== 1. TOTALES DEL DÍA ====');
  Logger.log('WhatsApp: ' + uno(wa));
  Logger.log('Formulario: ' + uno(form) + '   (al vendedor le llega por correo: revisar que se anote en la hoja)');
  var detalle = Object.keys(T).filter(function (k) { return k.indexOf('Llamada') === 0; })
    .map(function (k) { return k.replace('Llamada ', '') + ' ' + uno(T[k]); }).join(', ');
  Logger.log('Llamada: ' + uno(tel) + (detalle ? '   (' + detalle + ')' : ''));
  Logger.log('Correo: ' + uno(correo));
  if (T['Otro']) Logger.log('Otro: ' + uno(T['Otro']));
  Logger.log('Total: ' + uno(total) + ' contacto(s) · ' + miles(imp) + ' impresiones · ' + miles(clics) + ' clics' +
    (clics ? ' · de cada 100 clics, ' + uno(total / clics * 100) + ' contactaron' : '') + ' · ' + dinero(costo));
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
    ' · correo ' + uno(correo) + ' · total ' + uno(total) + ' · impresiones ' + miles(imp) + ' · clics ' + miles(clics) + ' · gasto ' + dinero(costo);
  Logger.log(linea);
  Logger.log('');
  return { linea: linea, dia: dia, imp: imp, clics: clics, total: total, wa: wa, form: form, tel: tel, gasto: costo };
}
