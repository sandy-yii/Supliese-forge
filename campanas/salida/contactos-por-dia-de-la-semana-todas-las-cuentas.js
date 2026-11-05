/**
 * Atelback · ¿Por qué no llegan contactos en fin de semana? — las cinco cuentas
 * Escrito a mano el 5 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Con los últimos 90 días (incluye la época de la agencia anterior) y los últimos 14:
 *   1. Por día de la semana: impresiones, clics, gasto y contactos (WhatsApp, llamada, correo o formulario).
 *      Así se ve si el fin de semana hay menos búsquedas, menos clics o solo menos contactos.
 *   2. Si alguna campaña encendida tiene horario de anuncios (por ejemplo, solo de lunes a viernes).
 *   3. El horario del botón de llamada.
 *   4. Cómo van los contactos HOY (hasta la hora en que se corre) y en lo que va del MES, con el ritmo al que va el mes.
 *
 * CÓMO SE USA: en cada cuenta > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var DIAS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
var NOMBRE = { MONDAY: 'lunes', TUESDAY: 'martes', WEDNESDAY: 'miércoles', THURSDAY: 'jueves', FRIDAY: 'viernes', SATURDAY: 'sábado', SUNDAY: 'domingo' };
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
function grupo(n) {
  if (/whats|\bwa\b|mensaje|message|conversa|conversation/i.test(n)) return 'wa';
  if (/formul|lead|correo|mail/i.test(n)) return 'form';
  return 'tel';
}

// Contactos por tipo, clics y gasto de un rango (DURING o BETWEEN)
function resumen(donde) {
  var r = { clics: 0, costo: 0, wa: 0, tel: 0, form: 0 };
  filas('SELECT metrics.clicks, metrics.cost_micros FROM customer WHERE ' + donde, 'los clics').forEach(function (f) {
    r.clics += Number(f.metrics.clicks || 0); r.costo += Number(f.metrics.costMicros || 0) / 1e6;
  });
  var conv, porFecha = true;
  try {
    conv = filas('SELECT segments.conversion_action_name, metrics.all_conversions_by_conversion_date FROM customer WHERE ' + donde +
      ' AND metrics.all_conversions_by_conversion_date > 0', 'los contactos', true);
  } catch (e) {
    porFecha = false;
    conv = filas('SELECT segments.conversion_action_name, metrics.all_conversions FROM customer WHERE ' + donde + ' AND metrics.all_conversions > 0', 'los contactos');
  }
  conv.forEach(function (f) {
    var n = f.segments.conversionActionName || '';
    if (!CONTACTO.test(n)) return;
    r[grupo(n)] += Number(porFecha ? f.metrics.allConversionsByConversionDate : f.metrics.allConversions) || 0;
  });
  r.total = r.wa + r.tel + r.form;
  return r;
}
function linea(r) {
  return uno(r.total) + ' contactos (WhatsApp ' + uno(r.wa) + ', llamada ' + uno(r.tel) + ', correo o formulario ' + uno(r.form) + ') · ' +
    r.clics + ' clics · ' + dinero(r.costo) + (r.total ? ' · ' + dinero(r.costo / r.total) + ' por contacto' : '');
}

function periodo(desde, hasta, titulo) {
  var D = {};
  DIAS.forEach(function (d) { D[d] = { impr: 0, clics: 0, costo: 0, wa: 0, tel: 0, form: 0, veces: 0 }; });
  filas("SELECT segments.day_of_week, segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros FROM customer " +
    "WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "'", 'los días').forEach(function (f) {
    var d = D[f.segments.dayOfWeek];
    if (!d) return;
    d.impr += Number(f.metrics.impressions || 0); d.clics += Number(f.metrics.clicks || 0); d.costo += Number(f.metrics.costMicros || 0) / 1e6;
  });
  // Cuántas veces aparece cada día en el periodo (para sacar promedios)
  for (var t = new Date(desde + 'T12:00:00Z'); t <= new Date(hasta + 'T12:00:00Z'); t.setUTCDate(t.getUTCDate() + 1)) D[DIAS[(t.getUTCDay() + 6) % 7]].veces++;

  var conv, porFecha = true;
  try {
    conv = filas("SELECT segments.day_of_week, segments.conversion_action_name, metrics.all_conversions_by_conversion_date FROM customer " +
      "WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "' AND metrics.all_conversions_by_conversion_date > 0", 'los contactos', true);
  } catch (e) {
    porFecha = false;
    conv = filas("SELECT segments.day_of_week, segments.conversion_action_name, metrics.all_conversions FROM customer " +
      "WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "' AND metrics.all_conversions > 0", 'los contactos');
  }
  conv.forEach(function (f) {
    var n = f.segments.conversionActionName || '', d = D[f.segments.dayOfWeek];
    if (!d || !CONTACTO.test(n)) return;
    d[grupo(n)] += Number(porFecha ? f.metrics.allConversionsByConversionDate : f.metrics.allConversions) || 0;
  });

  Logger.log('==== ' + titulo + ' (' + desde + ' a ' + hasta + ') · promedio por día ====');
  var sem = { clics: 0, cont: 0, n: 0 }, fin = { clics: 0, cont: 0, n: 0 };
  DIAS.forEach(function (k) {
    var d = D[k], v = d.veces || 1, cont = d.wa + d.tel + d.form;
    Logger.log(NOMBRE[k] + ' · ' + uno(d.impr / v) + ' impresiones · ' + uno(d.clics / v) + ' clics · ' + dinero(d.costo / v) + ' · ' +
      uno(cont / v) + ' contactos (WhatsApp ' + uno(d.wa / v) + ', llamada ' + uno(d.tel / v) + ', correo o formulario ' + uno(d.form / v) + ')');
    var g = (k === 'SATURDAY' || k === 'SUNDAY') ? fin : sem;
    g.clics += d.clics; g.cont += cont; g.n += d.veces;
  });
  var r = function (g) { return g.n ? uno(g.clics / g.n) + ' clics y ' + uno(g.cont / g.n) + ' contactos al día' : '—'; };
  Logger.log('→ Entre semana: ' + r(sem) + ' · Fin de semana: ' + r(fin) + (porFecha ? '' : ' (contactos por día del clic)'));
  Logger.log('');
  return { sem: sem, fin: fin };
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var marca = MARCAS[cid] || AdsApp.currentAccount().getName();
  var zona = AdsApp.currentAccount().getTimeZone();
  var f = function (dias) { return Utilities.formatDate(new Date(Date.now() - dias * 864e5), zona, 'yyyy-MM-dd'); };
  var hora = Utilities.formatDate(new Date(), zona, 'HH:mm');
  var hoy = Utilities.formatDate(new Date(), zona, 'yyyy-MM-dd');
  Logger.log('CONTACTOS POR DÍA DE LA SEMANA Y CÓMO VA HOY · ' + marca + ' · solo lee');
  Logger.log('');

  // Cómo va hoy y el mes
  var rHoy = resumen('segments.date DURING TODAY');
  var dia = Number(hoy.substr(8, 2)), diasMes = new Date(Number(hoy.substr(0, 4)), Number(hoy.substr(5, 2)), 0).getDate();
  var primero = hoy.substr(0, 8) + '01';
  var rMes = dia > 1 ? resumen("segments.date BETWEEN '" + primero + "' AND '" + f(1) + "'") : null;
  Logger.log('==== HOY ' + hoy + ' hasta las ' + hora + ' ====');
  Logger.log(linea(rHoy));
  Logger.log('(Google tarda hasta 3 horas en mostrar algunos contactos: el número de hoy todavía puede subir.)');
  Logger.log('');
  if (rMes) {
    var ritmo = rMes.total / (dia - 1);
    Logger.log('==== ESTE MES, del 1 a ayer (' + (dia - 1) + ' días completos) ====');
    Logger.log(linea(rMes));
    Logger.log('Ritmo: ' + uno(ritmo) + ' contactos al día · a este ritmo el mes cierra en unos ' + Math.round(ritmo * diasMes) + ' contactos');
    Logger.log('');
  }
  var largo = periodo(f(90), f(1), 'ÚLTIMOS 90 DÍAS');
  var corto = periodo(f(14), f(1), 'ÚLTIMOS 14 DÍAS');

  Logger.log('==== HORARIO DE ANUNCIOS DE LAS CAMPAÑAS ENCENDIDAS ====');
  var H = {};
  filas("SELECT campaign.name, campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour, " +
    "campaign_criterion.ad_schedule.end_hour FROM campaign_criterion WHERE campaign_criterion.type = 'AD_SCHEDULE' " +
    "AND campaign.status = 'ENABLED'", 'los horarios').forEach(function (r) {
    var s = r.campaignCriterion.adSchedule;
    (H[r.campaign.name] = H[r.campaign.name] || []).push(NOMBRE[s.dayOfWeek] + ' ' + s.startHour + '–' + s.endHour);
  });
  Object.keys(H).forEach(function (n) {
    var finde = H[n].some(function (t) { return /^(sábado|domingo)/.test(t); });
    Logger.log('«' + n + '»: ' + H[n].join(', ') + (finde ? '' : ' ⚠️ NO sale en fin de semana'));
  });
  if (!Object.keys(H).length) Logger.log('Ninguna campaña encendida tiene horario: los anuncios salen todos los días, a todas horas.');
  Logger.log('');

  Logger.log('==== HORARIO DEL BOTÓN DE LLAMADA ====');
  filas("SELECT asset.call_asset.phone_number, asset.call_asset.ad_schedule_targets FROM asset WHERE asset.type = 'CALL'", 'los botones')
    .forEach(function (r) {
      var h = (r.asset.callAsset.adScheduleTargets || []).map(function (t) { return NOMBRE[t.dayOfWeek]; });
      var dias = h.filter(function (d, i) { return h.indexOf(d) === i; });
      Logger.log(r.asset.callAsset.phoneNumber + ': ' + (dias.length ? dias.join(', ') : 'todos los días') +
        (dias.length && dias.indexOf('sábado') < 0 && dias.indexOf('domingo') < 0 ? ' (en fin de semana el anuncio sale sin botón de llamada)' : ''));
    });
  Logger.log('');
  Logger.log('HOY · ' + marca + ' · hasta las ' + hora + ' · ' + linea(rHoy));
  if (rMes) Logger.log('MES · ' + marca + ' · del 1 a ayer · ' + linea(rMes) + ' · ritmo ' + uno(rMes.total / (dia - 1)) + ' al día');
  Logger.log('RESUMEN · ' + marca + ' · 90 días: entre semana ' + uno(largo.sem.cont / (largo.sem.n || 1)) + ' contactos al día, fin de semana ' +
    uno(largo.fin.cont / (largo.fin.n || 1)) + ' · 14 días: entre semana ' + uno(corto.sem.cont / (corto.sem.n || 1)) + ', fin de semana ' +
    uno(corto.fin.cont / (corto.fin.n || 1)) + ' · clics fin de semana vs entre semana (90 días): ' +
    (largo.sem.clics ? Math.round((largo.fin.clics / (largo.fin.n || 1)) / (largo.sem.clics / largo.sem.n) * 100) + '%' : '—'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
