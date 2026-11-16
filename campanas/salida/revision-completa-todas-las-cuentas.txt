/**
 * Atelback · REVISIÓN COMPLETA EN UN SOLO SCRIPT — las cinco cuentas · SOLO LEE, NO CAMBIA NADA
 * Escrito a mano el 16 nov 2026 (no lo genera generar.py). Junta, sin cambiar lo que leen:
 *   A. Vaciado y embudo (vaciado-y-embudo-todas-las-cuentas.js): contactos, clics, gasto, búsquedas, ciudades, llamadas y
 *      clics de 12 a 6 a.m. por red. Lunes antes de las 12: viernes, sábado y domingo. Otros días en la mañana: ayer;
 *      en la tarde o noche: hoy.
 *   B. ¿De dónde vienen los clics de madrugada? (apps, páginas y ciudades, 7 días).
 *   C. Display: quién lo prendió (7 días) y en qué campañas está encendido. AQUÍ NO SE APAGA.
 *   D. Anuncios y grupos de Máximo rendimiento RECHAZADOS o limitados, con el motivo y la página a la que llevan.
 * Ninguna parte cambia nada, aunque se le dé Ejecutar: no hay ni una operación de cambio en este archivo.
 * UNA SOLA CORRIDA: en la cuenta de ADMINISTRADOR recorre las 5 cuentas; en una cuenta normal, solo esa.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var DESPUES_DE_CADA_CUENTA = function () {};

function MOD_VACIADO() {
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
      DESPUES_DE_CADA_CUENTA();
      Logger.log('');
    }
    if (!vistos) Logger.log('AVISO: esta cuenta de administrador no tiene ninguna de las 5 cuentas.');
  } else {
    todos = unaCuenta();
    DESPUES_DE_CADA_CUENTA();
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
  } else if (Number(Utilities.formatDate(ahora, zona, 'H')) < 12 && Utilities.formatDate(ahora, zona, 'u') === '1') {
    [3, 2, 1].forEach(function (n) {   // lunes en la mañana: viernes, sábado y domingo
      dias.push({ dia: Utilities.formatDate(new Date(ahora.getTime() - n * 864e5), zona, 'yyyy-MM-dd'), hasta: 'día completo' });
    });
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

  // 7. Madrugada
  Logger.log('==== 7. CLICS DE LAS 12 A LAS 6 A.M. (para ver ráfagas raras) ====');
  var M = {}, mClics = 0, mGasto = 0;
  var RED = { SEARCH: 'búsqueda de Google', SEARCH_PARTNERS: 'SOCIOS de búsqueda', CONTENT: 'DISPLAY', YOUTUBE_SEARCH: 'YouTube', YOUTUBE_WATCH: 'YouTube', MIXED: 'Máximo rendimiento', UNKNOWN: '?' };
  filas('SELECT campaign.name, segments.hour, segments.ad_network_type, metrics.clicks, metrics.cost_micros FROM campaign WHERE ' + cuando +
    ' AND segments.hour < 6 AND metrics.clicks > 0', 'los clics de la madrugada').forEach(function (f) {
      var h = Number(f.segments.hour), c = Number(f.metrics.clicks || 0), g = Number(f.metrics.costMicros || 0) / 1e6;
      var m = M[h] = M[h] || { clics: 0, gasto: 0, camps: [] };
      m.clics += c; m.gasto += g; m.camps.push(f.campaign.name + ' ' + c + ' (' + (RED[f.segments.adNetworkType] || f.segments.adNetworkType) + ')'); mClics += c; mGasto += g;
    });
  var prendidas = [];
  filas("SELECT campaign.name, campaign.network_settings.target_content_network, campaign.network_settings.target_partner_search_network FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las redes de las campañas').forEach(function (f) {
      var n = f.campaign.networkSettings || {}, r = [];
      if (n.targetContentNetwork) r.push('Display'); if (n.targetPartnerSearchNetwork) r.push('socios de búsqueda');
      if (r.length) prendidas.push(f.campaign.name + ' (' + r.join(' y ') + ')');
    });
  Logger.log(prendidas.length ? '⚠️ Campañas de búsqueda con Display o socios PRENDIDOS hoy: ' + prendidas.join('; ') : 'Display y socios de búsqueda: apagados en todas las campañas de búsqueda. ✅');
  Object.keys(M).sort(function (a, b) { return a - b; }).forEach(function (h) {
    Logger.log(tramo(Number(h)) + ' · ' + M[h].clics + ' clics · ' + dinero(M[h].gasto) + ' · ' + M[h].camps.join(', ') + (M[h].clics >= 8 ? ' ⚠️ muchos para esa hora' : ''));
  });
  Logger.log(mClics ? 'Madrugada: ' + mClics + ' clics y ' + dinero(mGasto) + ' de ' + miles(clics) + ' clics del día.' : 'Sin clics de 12 a 6 a.m.');
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

return main;
}

function MOD_MADRUGADA() {
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var TIPO = { MOBILE_APPLICATION: 'app de celular', WEBSITE: 'página web', YOUTUBE_VIDEO: 'video de YouTube', YOUTUBE_CHANNEL: 'canal de YouTube', GOOGLE_PRODUCTS: 'producto de Google', MOBILE_APP_CATEGORY: 'categoría de apps' };
var RED = { SEARCH: 'búsqueda', SEARCH_PARTNERS: 'socios', CONTENT: 'Display', YOUTUBE_SEARCH: 'YouTube', YOUTUBE_WATCH: 'YouTube', MIXED: 'Máx. rendimiento' };

function filas(q, que, callado) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) { var r = it.next(); r.metrics = r.metrics || {}; r.segments = r.segments || {}; out.push(r); } }
  catch (e) { if (callado) return null; Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(Number(x) || 0).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  Logger.log('¿DE DÓNDE VIENEN LOS CLICS DE MADRUGADA? · ' + marca + ' · últimos 7 días · solo lee');
  Logger.log('');

  // 1. Lugares de Display
  Logger.log('==== 1. DÓNDE SALIÓ EL ANUNCIO EN DISPLAY (apps, páginas, YouTube) ====');
  var porHora = true;
  var P = filas('SELECT campaign.name, detail_placement_view.display_name, detail_placement_view.target_url, detail_placement_view.placement_type, ' +
    'segments.hour, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM detail_placement_view ' +
    'WHERE segments.date DURING LAST_7_DAYS AND segments.hour < 6 AND metrics.clicks > 0', 'los lugares', true);
  if (P === null) {
    porHora = false;
    P = filas('SELECT campaign.name, detail_placement_view.display_name, detail_placement_view.target_url, detail_placement_view.placement_type, ' +
      'metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM detail_placement_view WHERE segments.date DURING LAST_7_DAYS AND metrics.clicks > 0', 'los lugares');
  }
  Logger.log(porHora ? '(solo clics de 12 a 6 a.m.)' : '(Google no da la hora aquí: son los clics de todo el día)');
  var L = {}, clicsDisplay = 0, gastoDisplay = 0, apps = 0;
  P.forEach(function (f) {
    var d = f.detailPlacementView, k = (d.displayName || d.targetUrl || '?') + '|' + d.placementType;
    var l = L[k] = L[k] || { nombre: d.displayName || '?', url: d.targetUrl || '', tipo: TIPO[d.placementType] || d.placementType, clics: 0, gasto: 0, conv: 0, camps: {} };
    l.clics += +f.metrics.clicks || 0; l.gasto += (+f.metrics.costMicros || 0) / 1e6; l.conv += +f.metrics.allConversions || 0; l.camps[f.campaign.name] = true;
  });
  Object.keys(L).map(function (k) { return L[k]; }).sort(function (a, b) { return b.clics - a.clics; }).slice(0, 30).forEach(function (l) {
    clicsDisplay += l.clics; gastoDisplay += l.gasto; if (l.tipo === 'app de celular') apps += l.clics;
    Logger.log('• ' + l.nombre + ' (' + l.tipo + ')' + (l.url ? ' · ' + l.url : '') + ' · ' + l.clics + ' clics · ' + pesos(l.gasto) +
      ' · ' + n(l.conv) + ' «contactos» · ' + Object.keys(l.camps).join(', '));
  });
  if (!P.length) Logger.log('Sin clics en Display.');
  Logger.log('');

  // 2. Ciudades de madrugada
  Logger.log('==== 2. DESDE QUÉ CIUDAD FUERON LOS CLICS DE 12 A 6 A.M. ====');
  var G = filas('SELECT segments.geo_target_city, segments.ad_network_type, segments.hour, metrics.clicks, metrics.cost_micros, metrics.all_conversions ' +
    'FROM geographic_view WHERE segments.date DURING LAST_7_DAYS AND segments.hour < 6 AND metrics.clicks > 0', 'las ciudades', true);
  if (G === null) G = filas('SELECT segments.geo_target_city, segments.ad_network_type, segments.hour, metrics.clicks, metrics.cost_micros, metrics.all_conversions ' +
    'FROM user_location_view WHERE segments.date DURING LAST_7_DAYS AND segments.hour < 6 AND metrics.clicks > 0', 'las ciudades');
  var C = {};
  G.forEach(function (f) {
    var c = f.segments.geoTargetCity || '(sin ciudad)', k = c + '|' + (RED[f.segments.adNetworkType] || f.segments.adNetworkType);
    var x = C[k] = C[k] || { clics: 0, gasto: 0, conv: 0 };
    x.clics += +f.metrics.clicks || 0; x.gasto += (+f.metrics.costMicros || 0) / 1e6; x.conv += +f.metrics.allConversions || 0;
  });
  var nombres = {}, rns = Object.keys(C).map(function (k) { return k.split('|')[0]; }).filter(function (r) { return r.indexOf('geoTargetConstants') >= 0; });
  if (rns.length) filas("SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name FROM geo_target_constant WHERE geo_target_constant.resource_name IN ('" +
    rns.filter(function (r, i) { return rns.indexOf(r) === i; }).join("','") + "')", 'los nombres de ciudades')
    .forEach(function (f) { nombres[f.geoTargetConstant.resourceName] = f.geoTargetConstant.canonicalName; });
  Object.keys(C).sort(function (a, b) { return C[b].clics - C[a].clics; }).slice(0, 25).forEach(function (k) {
    var p = k.split('|');
    Logger.log('• ' + (nombres[p[0]] || p[0]) + ' · ' + p[1] + ' · ' + C[k].clics + ' clics · ' + pesos(C[k].gasto) + ' · ' + n(C[k].conv) + ' «contactos»');
  });
  if (!G.length) Logger.log('Google no dio ciudades para esas horas.');
  Logger.log('');
  Logger.log('MADRUGADA · ' + marca + ' · Display ' + (porHora ? 'de 12 a 6 a.m.' : 'todo el día') + ': ' + clicsDisplay + ' clics, ' + pesos(gastoDisplay) +
    ' (en apps de celular: ' + apps + ' clics) · lugares distintos: ' + Object.keys(L).length);
}

return main;
}

function MOD_DISPLAY() {
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var DESDE_DONDE = {
  GOOGLE_ADS_WEB_CLIENT: 'a mano, en la pantalla de Google Ads',
  GOOGLE_ADS_AUTOMATED_RULE: 'una regla automática de la cuenta',
  GOOGLE_ADS_SCRIPTS: 'un script de Google Ads',
  GOOGLE_ADS_BULK_UPLOAD: 'una carga masiva',
  GOOGLE_ADS_API: 'la API (otra herramienta o agencia)',
  GOOGLE_ADS_EDITOR: 'Google Ads Editor',
  GOOGLE_ADS_MOBILE_APP: 'la app de Google Ads en el celular',
  GOOGLE_ADS_RECOMMENDATIONS: 'RECOMENDACIONES de Google aplicadas solas (aplicación automática)',
  GOOGLE_ADS_RECOMMENDATIONS_SUBSCRIPTION: 'RECOMENDACIONES de Google aplicadas solas (aplicación automática)',
  SEARCH_ADS_360_SYNC: 'Search Ads 360',
  SEARCH_ADS_360_POST: 'Search Ads 360',
  INTERNAL_TOOL: 'una herramienta interna de Google',
  OTHER: 'otro'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function campos(cf) {
  if (!cf) return '';
  if (typeof cf === 'string') return cf;
  if (cf.paths) return cf.paths.join(',');
  return JSON.stringify(cf);
}
function display(r) { return r && r.campaign && r.campaign.networkSettings ? r.campaign.networkSettings.targetContentNetwork : undefined; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - 7 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('DISPLAY · QUIÉN LO PRENDE · ' + marca + ' · solo lee');
  Logger.log('');

  // 1. Quién cambió la red de las campañas
  Logger.log('==== 1. CAMBIOS A LA RED DE LAS CAMPAÑAS (del ' + desde + ' a hoy) ====');
  var quien = {}, n = 0, nombres = {};
  filas("SELECT campaign.resource_name, campaign.name FROM campaign WHERE campaign.status != 'REMOVED'", 'los nombres de campaña')
    .forEach(function (f) { nombres[f.campaign.resourceName] = f.campaign.name; });
  filas("SELECT change_event.change_date_time, change_event.client_type, change_event.user_email, change_event.changed_fields, " +
    "change_event.old_resource, change_event.new_resource, change_event.campaign FROM change_event " +
    "WHERE change_event.change_resource_type = 'CAMPAIGN' AND change_event.change_date_time >= '" + desde + " 00:00:00' " +
    "AND change_event.change_date_time <= '" + hoy + " 23:59:59' ORDER BY change_event.change_date_time ASC LIMIT 1000", 'el historial de cambios')
    .forEach(function (f) {
      var ce = f.changeEvent, cf = campos(ce.changedFields);
      if (!/network|content/i.test(cf)) return;
      var antes = display(ce.oldResource), despues = display(ce.newResource);
      var que = despues === true ? 'PRENDIÓ Display' : despues === false ? 'apagó Display' : 'cambió la red (' + cf + ')';
      var origen = DESDE_DONDE[ce.clientType] || ce.clientType;
      n++;
      Logger.log(ce.changeDateTime + ' · «' + (nombres[ce.campaign] || ce.campaign) + '» · ' + que + ' · desde ' + origen +
        ' · usuario: ' + (ce.userEmail || '(sin correo)'));
      if (despues === true) { var k = origen + ' · ' + (ce.userEmail || '(sin correo)'); quien[k] = (quien[k] || 0) + 1; }
    });
  if (!n) Logger.log('Google no registra cambios a la red de las campañas en estos 7 días.');
  var quienTxt = Object.keys(quien).map(function (k) { return k + ' (' + quien[k] + ')'; }).join(' | ');
  if (quienTxt) Logger.log('→ Lo volvió a prender: ' + quienTxt);
  Logger.log('');

  // 2. Solo lista (en la revisión no se apaga nada)
  Logger.log('==== 2. CAMPAÑAS DE BÚSQUEDA CON DISPLAY ENCENDIDO (solo se listan) ====');
  var prendidas = [];
  filas("SELECT campaign.name, campaign.network_settings.target_content_network FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas').forEach(function (f) {
      if ((f.campaign.networkSettings || {}).targetContentNetwork) prendidas.push(f.campaign.name);
    });
  Logger.log(prendidas.length ? '⚠️ Display encendido en: ' + prendidas.join('; ') + '  → para apagarlo: display-quien-lo-prende-y-apagar-todas-las-cuentas.js' : 'Display apagado en todas. ✅');
  Logger.log('DISPLAY · ' + marca + ' · encendido en ' + prendidas.length + ' campaña(s) · quién lo prendió: ' + (quienTxt || 'no aparece en el historial'));
  Logger.log('');
}

return main;
}

function REVISAR_RECHAZOS() {
  var MARCAS = { '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions', '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail' };
  function filas(q, que) { var out = []; try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); } catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); } return out; }
  var cid = AdsApp.currentAccount().getCustomerId(), marca = MARCAS[cid] || AdsApp.currentAccount().getName();
  Logger.log('==== D. ANUNCIOS RECHAZADOS O LIMITADOS · ' + marca + ' ====');
  var nR = 0, nL = 0, dominios = {};
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.ad.final_urls, ad_group_ad.policy_summary.approval_status, " +
    "ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
    "AND campaign.status = 'ENABLED' AND ad_group_ad.policy_summary.approval_status IN ('DISAPPROVED', 'APPROVED_LIMITED', 'AREA_OF_INTEREST_ONLY')", 'los anuncios')
    .forEach(function (f) {
      var ps = f.adGroupAd.policySummary || {}, urls = (f.adGroupAd.ad || {}).finalUrls || [];
      var temas = (ps.policyTopicEntries || []).map(function (t) { return t.topic; }).join(', ');
      if (ps.approvalStatus === 'DISAPPROVED') nR++; else nL++;
      urls.forEach(function (u) { var m = u.match(/^https?:\/\/(www\.)?([^\/]+)/i); if (m) dominios[m[2]] = (dominios[m[2]] || 0) + 1; });
      Logger.log((ps.approvalStatus === 'DISAPPROVED' ? '❌ RECHAZADO' : '⚠️ limitado') + ' · ' + f.campaign.name + ' › ' + f.adGroup.name +
        ' · ' + (temas || 'sin motivo') + ' · ' + urls.join(' '));
    });
  filas("SELECT campaign.name, asset_group.name, asset_group.final_urls, asset_group.primary_status, asset_group.primary_status_reasons FROM asset_group " +
    "WHERE asset_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'los grupos de Máximo rendimiento').forEach(function (f) {
      var g = f.assetGroup, r = (g.primaryStatusReasons || []).join(', ');
      if (g.primaryStatus === 'ELIGIBLE' && !/DISAPPROVED|LIMITED/i.test(r)) return;
      nR++;
      Logger.log('❌ Máx. rendimiento · ' + f.campaign.name + ' › ' + g.name + ' · ' + g.primaryStatus + (r ? ' (' + r + ')' : '') + ' · ' + (g.finalUrls || []).join(' '));
    });
  if (!nR && !nL) Logger.log('Ninguno. ✅');
  Logger.log('RECHAZOS · ' + marca + ' · rechazados: ' + nR + ' · limitados: ' + nL + (Object.keys(dominios).length ? ' · páginas: ' + Object.keys(dominios).map(function (k) { return k + ' ' + dominios[k]; }).join(', ') : ''));
  Logger.log('');
}

function main() {
  var madrugada = MOD_MADRUGADA(), display = MOD_DISPLAY();
  DESPUES_DE_CADA_CUENTA = function () {
    Logger.log('');
    try { madrugada(); } catch (e) { Logger.log('(Parte B falló: ' + e.message + ')'); }
    Logger.log('');
    try { display(); } catch (e) { Logger.log('(Parte C falló: ' + e.message + ')'); }
    try { REVISAR_RECHAZOS(); } catch (e) { Logger.log('(Parte D falló: ' + e.message + ')'); }
    Logger.log('------------------------------------------------------------');
  };
  MOD_VACIADO()();
}
