// APAGAR LA APLICACION AUTOMATICA DE RECOMENDACIONES - las 5 cuentas (26 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR, o dentro de cada cuenta (entonces solo revisa esa). Vista previa, OK y Ejecutar.
// POR QUE: Google aplico solo 7 recomendaciones en Gamesail del 16 al 22 nov (asi se prendio Display) sin OK de nadie.
// QUE HACE:
//   1. Dice que tipos de recomendaciones se aplican solos en cada cuenta y cuantos cambios hizo Google solo en los ultimos 14 dias.
//   2. Pone en pausa cada aplicacion automatica que este encendida. No aplica, ni descarta, ni cambia ninguna recomendacion,
//      campana, anuncio, presupuesto o puja.
// SI GOOGLE NO DEJA HACERLO DESDE SCRIPT: el registro lo dice ("Google no deja...") y se hace con el prompt de la extension.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: las vuelve a encender.

var CUENTAS = { '118-347-6484': 'Gamesail', '993-525-8739': 'Kingstar', '256-397-2201': 'Quick Laundry',
  '265-909-2662': 'Laundry Solutions', '860-582-6837': 'Girbau' };
var DESHACER = [];

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview(), salida = [];
  Logger.log('APAGAR RECOMENDACIONES AUTOMATICAS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(Object.keys(CUENTAS)).get();
    while (it.hasNext()) { var a = it.next(); AdsManagerApp.select(a); salida = salida.concat(cuenta(a.getCustomerId(), vista)); }
  } else {
    var cid = AdsApp.currentAccount().getCustomerId();
    if (!CUENTAS[cid]) { Logger.log('Esta cuenta (' + cid + ') no esta en la lista. No se hizo nada.'); return; }
    salida = cuenta(cid, vista);
  }
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.map(function (r) { return "'" + r + "'"; }).join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function cuenta(cid, vista) {
  Logger.log('==== ' + CUENTAS[cid] + ' (' + cid + ') ====');
  var out = [];
  try {
    if (DESHACER.length) {
      var mias = DESHACER.filter(function (rn) { return rn.indexOf('customers/' + cid.replace(/-/g, '') + '/') === 0; });
      if (!mias.length) { Logger.log('  Nada que deshacer aqui.'); Logger.log(''); return []; }
      AdsApp.mutateAll(mias.map(function (rn) { return { recommendationSubscriptionOperation: { update: { resourceName: rn, status: 'ENABLED' }, updateMask: 'status' } }; }),
        { partialFailure: true }).forEach(function (r, i) {
          Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede volver a encender ' : 'LISTO: encendida otra vez ') : 'ERROR ') + mias[i] + (r.isSuccessful() ? '' : ': ' + r.getErrorMessages().join('; ')));
        });
      Logger.log(''); return [];
    }
    var tz = AdsApp.currentAccount().getTimeZone(), d = function (n) { return Utilities.formatDate(new Date(Date.now() - n * 86400000), tz, 'yyyy-MM-dd'); };
    try {
      var solos = leer("SELECT change_event.change_date_time, change_event.change_resource_type, change_event.client_type FROM change_event WHERE " +
        "change_event.change_date_time >= '" + d(14) + " 00:00:00' AND change_event.change_date_time <= '" + d(0) + " 23:59:59' LIMIT 1000")
        .filter(function (r) { return String(r.changeEvent.clientType).indexOf('RECOMMENDATIONS') >= 0; });
      Logger.log('  Cambios que Google hizo solo (recomendaciones) en los ultimos 14 dias: ' + solos.length);
    } catch (e) { Logger.log('  (No pude leer el historial de cambios: ' + e.message + ')'); }
    var subs;
    try { subs = leer("SELECT recommendation_subscription.resource_name, recommendation_subscription.type, recommendation_subscription.status FROM recommendation_subscription"); }
    catch (e) { Logger.log('  Google no deja leer la aplicacion automatica desde script en esta cuenta (' + e.message + '). Hazlo con el prompt de la extension.'); Logger.log(''); return []; }
    var prendidas = subs.filter(function (r) { return r.recommendationSubscription.status === 'ENABLED'; });
    Logger.log('  Aplicacion automatica: ' + subs.length + ' tipos configurados, ' + prendidas.length + ' encendidos.');
    subs.forEach(function (r) { Logger.log('    - ' + r.recommendationSubscription.type + ': ' + r.recommendationSubscription.status); });
    if (!prendidas.length) { Logger.log('  Nada que apagar.'); Logger.log(''); return []; }
    var res = AdsApp.mutateAll(prendidas.map(function (r) {
      return { recommendationSubscriptionOperation: { update: { resourceName: r.recommendationSubscription.resourceName, status: 'PAUSED' }, updateMask: 'status' } };
    }), { partialFailure: true });
    res.forEach(function (x, i) {
      var t = prendidas[i].recommendationSubscription;
      if (x.isSuccessful()) { Logger.log('  ' + (vista ? 'se puede apagar: ' : 'LISTO: apagada ') + t.type); if (!vista) out.push(t.resourceName); }
      else Logger.log('  Google no deja apagar ' + t.type + ' desde script: ' + x.getErrorMessages().join('; ') + ' -> hazlo con el prompt de la extension.');
    });
  } catch (e) {
    Logger.log('  Google no deja hacerlo desde script en esta cuenta: ' + e.message + ' -> hazlo con el prompt de la extension.');
  }
  Logger.log('');
  return out;
}
