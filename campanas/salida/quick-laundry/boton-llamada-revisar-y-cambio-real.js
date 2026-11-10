/**
 * Atelback · Quick Laundry: revisar el botón de llamada y, si sigue rechazado, hacerle un cambio real para que Google lo revise
 * Escrito a mano el 10 nov 2026 a partir de girbau/boton-llamada-cambio-real.js (que en Girbau sí destrabó la revisión).
 * Solo para la cuenta Quick Laundry 256-397-2201.
 *
 * POR QUÉ: el botón de Liliana sigue rechazado (UNVERIFIED_PHONE_NUMBER). Keerthi (caso 9-5942000041700) mandó una
 * revisión manual el 5 nov con plazo de 24 a 48 horas hábiles, que vence hoy. Si ya está aprobado, no se toca.
 * Si Google lo tiene EN REVISIÓN, tampoco se toca (cambiarlo reiniciaría la revisión). Solo si sigue RECHAZADO.
 *
 * QUÉ HACE: solo en el botón de llamada de Liliana (33 2601 2237) que esté rechazado, cambia CÓMO está escrito el horario,
 * sin cambiar el horario en sí: de lunes a viernes de 9:00 a 18:00 queda escrito como dos tramos por día, de 9:00 a 13:00
 * y de 13:00 a 18:00. El botón se sigue mostrando exactamente las mismas horas. Si ya estaba en dos tramos, los vuelve a
 * juntar en uno (también es un cambio real). No toca el número, anuncios, campañas, presupuestos ni nada más.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR solo con el OK.
 * Después, en Google Ads > Campañas > Recursos, la columna «Última actualización» del botón debe decir la fecha de hoy.
 * Google tarda de 24 a 48 horas en revisarlo.
 */

var CUENTA = '256-397-2201';
var TELEFONO = '3326012237';
var CORTE = 13;   // hora en la que se parte cada tramo
var MIN = { ZERO: 0, FIFTEEN: 15, THIRTY: 30, FORTY_FIVE: 45 };
var DIAS = { MONDAY: 'lunes', TUESDAY: 'martes', WEDNESDAY: 'miércoles', THURSDAY: 'jueves', FRIDAY: 'viernes', SATURDAY: 'sábado', SUNDAY: 'domingo' };
var ORDEN = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

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
function diez(n) { return String(n || '').replace(/\D/g, '').slice(-10); }
function texto(h) {
  return h.map(function (t) {
    return DIAS[t.dayOfWeek] + ' ' + t.startHour + ':' + ('0' + (MIN[t.startMinute] || 0)).slice(-2) + '–' + t.endHour + ':' + ('0' + (MIN[t.endMinute] || 0)).slice(-2);
  }).join(', ');
}
function limpio(t) {
  return { dayOfWeek: t.dayOfWeek, startHour: Number(t.startHour), startMinute: t.startMinute || 'ZERO', endHour: Number(t.endHour), endMinute: t.endMinute || 'ZERO' };
}

// Si algún tramo pasa por las 13:00, se parte en dos. Si no, se juntan los tramos seguidos del mismo día.
function cambiar(h) {
  var parte = h.some(function (t) { return t.startHour < CORTE && (t.endHour > CORTE || (t.endHour === CORTE && MIN[t.endMinute] > 0)); });
  var out = [];
  if (parte) {
    h.forEach(function (t) {
      if (t.startHour < CORTE && (t.endHour > CORTE || (t.endHour === CORTE && MIN[t.endMinute] > 0))) {
        out.push({ dayOfWeek: t.dayOfWeek, startHour: t.startHour, startMinute: t.startMinute, endHour: CORTE, endMinute: 'ZERO' });
        out.push({ dayOfWeek: t.dayOfWeek, startHour: CORTE, startMinute: 'ZERO', endHour: t.endHour, endMinute: t.endMinute });
      } else out.push(t);
    });
  } else {
    var orden = h.slice().sort(function (a, b) {
      return ORDEN.indexOf(a.dayOfWeek) - ORDEN.indexOf(b.dayOfWeek) || (a.startHour * 60 + MIN[a.startMinute]) - (b.startHour * 60 + MIN[b.startMinute]);
    });
    orden.forEach(function (t) {
      var u = out[out.length - 1];
      if (u && u.dayOfWeek === t.dayOfWeek && u.endHour === t.startHour && u.endMinute === t.startMinute) { u.endHour = t.endHour; u.endMinute = t.endMinute; }
      else out.push(limpio(t));
    });
  }
  return { nuevo: out, como: parte ? 'partido en dos tramos por día (mismas horas)' : 'juntado en un tramo por día (mismas horas)' };
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== CUENTA) throw new Error('Este script es solo para Quick Laundry (' + CUENTA + '). Estás en ' + cid + '. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('BOTÓN DE LLAMADA · Quick Laundry · revisar y, si sigue rechazado, cambio real para que Google lo revise' + (vista ? ' · VISTA PREVIA (no cambia nada)' : ' · EJECUTANDO'));
  Logger.log('');

  var ops = [], textos = [];
  filas("SELECT asset.resource_name, asset.call_asset.phone_number, asset.call_asset.ad_schedule_targets, " +
    "asset.policy_summary.approval_status, asset.policy_summary.review_status FROM asset WHERE asset.type = 'CALL'", 'los botones de llamada')
    .forEach(function (f) {
      var a = f.asset, ps = a.policySummary || {}, n = (a.callAsset || {}).phoneNumber;
      if (diez(n) !== TELEFONO) return;
      var estado = (ps.approvalStatus || '?') + ' / ' + (ps.reviewStatus || '?');
      if (/^APPROVED/.test(ps.approvalStatus || '')) { Logger.log('✅ ' + n + ' ya está APROBADO (' + estado + '). No hace falta cambiarlo.'); return; }
      if (ps.reviewStatus === 'REVIEW_IN_PROGRESS' || ps.reviewStatus === 'UNDER_APPEAL') {
        Logger.log('⏳ ' + n + ' está EN REVISIÓN con Google (' + estado + '). No se toca: cambiarlo reiniciaría la revisión.'); return; }
      var h = ((a.callAsset || {}).adScheduleTargets || []).map(limpio);
      if (!h.length) { Logger.log('❌ ' + n + ' está rechazado (' + estado + ') y no tiene horario escrito: no se le inventa uno por script. Avísame.'); return; }
      var c = cambiar(h);
      Logger.log('Botón ' + n + ' · ' + estado);
      Logger.log('   horario hoy:   ' + texto(h));
      Logger.log('   queda escrito: ' + texto(c.nuevo) + ' → ' + c.como);
      ops.push({ assetOperation: { update: { resourceName: a.resourceName, callAsset: { adScheduleTargets: c.nuevo } }, updateMask: 'callAsset.adScheduleTargets' } });
      textos.push('botón ' + n);
    });

  Logger.log('');
  if (!ops.length) { Logger.log('No hay botón de llamada de Liliana que cambiar. No se hizo nada.'); return; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) Logger.log(malos ? 'VISTA PREVIA CON ERRORES: manda el registro (si Google no deja cambiarlo por script, se hace con la extensión).'
                              : 'VISTA PREVIA SIN ERRORES. Manda el registro; EJECUTAR solo con el OK.');
  else Logger.log(malos ? 'Terminó con error(es): manda el registro.'
                        : 'LISTO. Revisa en Recursos que «Última actualización» diga hoy. Google lo revisa en 24 a 48 horas.');
}
