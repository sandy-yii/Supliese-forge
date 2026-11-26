// MOVER PRESUPUESTO SIN GASTAR MAS - Kingstar (jueves 26 nov 2026)
// Pegar dentro de la cuenta de Kingstar (993-525-8739) o en la de administrador. Vista previa, OK y Ejecutar.
// QUE HACE (el presupuesto diario total de Kingstar queda IGUAL):
//   Le sube +20% a "AB \u00b7 Lavander\u00eda hotelera e institucional" (hoteles e instituciones: el contacto mas barato
//   de Kingstar en 30 dias y se queda sin dinero) y le quita lo mismo a "AB \u00b7 Alta capacidad 60 kg o m\u00e1s"
//   (la campana mas grande; baja como 5%, sigue encendida y trayendo).
// SEGUROS:
//   - La que recibe sube como maximo +20%, y solo si en los ultimos 3 dias perdio 10% o mas de busquedas por presupuesto.
//   - La que da baja como maximo -20%. Nada se pausa ni se apaga.
//   - Si un presupuesto es compartido, no se toca. Si ya hubo un cambio HOY en la cuenta, no se toca.
//   - No toca pujas, estrategias ni anuncios.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: regresa los presupuestos como estaban.

var PCT = 20, MIN_PERDIDA = 0.10;
var CUENTAS = {
  '993-525-8739': { nombre: 'Kingstar', quitar: 'AB \u00b7 Alta capacidad 60 kg o m\u00e1s', dar: ['AB \u00b7 Lavander\u00eda hotelera e institucional'] }
};
var DESHACER = [];

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function q(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
function pesos(n) { return '$' + n.toFixed(2); }
function r2(n) { return Math.round(n * 100) / 100; }

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview(), salida = [];
  Logger.log('MOVER PRESUPUESTO SIN GASTAR MAS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var ids = Object.keys(CUENTAS);
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get();
    while (it.hasNext()) { var a = it.next(); AdsManagerApp.select(a); salida = salida.concat(unaCuenta(a.getCustomerId(), vista)); }
  } else {
    var cidG = AdsApp.currentAccount().getCustomerId();
    if (!CUENTAS[cidG]) { Logger.log('Esta cuenta (' + cidG + ') no esta en la lista. No se hizo nada.'); return; }
    salida = unaCuenta(cidG, vista);
  }
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function unaCuenta(cidG, vista) {
  var info = CUENTAS[cidG], out = [];
  Logger.log('==== ' + info.nombre + ' (' + cidG + ') ====');
  try {
    if (DESHACER.length) { deshacer(cidG, vista); Logger.log(''); return []; }
    var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    if (!vista && leer("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20").length) {
      Logger.log('  ALTO: ya hubo un cambio HOY en ' + info.nombre + '. No se aplico nada. Avisame.'); Logger.log(''); return [];
    }
    out = mover(cidG, info, vista, tz);
  } catch (e) { Logger.log('  ERROR: ' + e.message + ' (no se cambio nada en esta cuenta)'); }
  Logger.log('');
  return out;
}

function mover(cidG, info, vista, tz) {
  var d = function (n) { return Utilities.formatDate(new Date(Date.now() - n * 86400000), tz, 'yyyy-MM-dd'); };
  var nombres = [info.quitar].concat(info.dar);
  var filas = leer("SELECT campaign.name, campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared, " +
    "metrics.search_budget_lost_impression_share, metrics.cost_micros, metrics.conversions FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND campaign.name IN (" + nombres.map(q).join(', ') + ") AND segments.date BETWEEN '" + d(3) + "' AND '" + d(1) + "'");
  var c = {};
  filas.forEach(function (r) {
    c[r.campaign.name] = { rn: r.campaignBudget.resourceName, monto: Number(r.campaignBudget.amountMicros) / 1e6, compartido: r.campaignBudget.explicitlyShared,
      perdida: Number(r.metrics.searchBudgetLostImpressionShare || 0), gasto: Number(r.metrics.costMicros) / 1e6, conv: Number(r.metrics.conversions) };
  });
  for (var i = 0; i < nombres.length; i++) {
    var x = c[nombres[i]];
    if (!x) { Logger.log('  No encontre la campana activa "' + nombres[i] + '". No se toca esta cuenta.'); return []; }
    if (x.compartido) { Logger.log('  "' + nombres[i] + '" tiene presupuesto compartido. No se toca esta cuenta.'); return []; }
    Logger.log('  "' + nombres[i] + '": ' + pesos(x.monto) + ' al dia; ultimos 3 dias: gasto ' + pesos(x.gasto) + ', ' + x.conv.toFixed(0) +
      ' contactos' + (x.conv > 0 ? ' (' + pesos(x.gasto / x.conv) + ' por contacto)' : '') + ', pierde ' + Math.round(x.perdida * 100) + '% por presupuesto.');
  }
  var origen = c[info.quitar], recibe = [];
  info.dar.forEach(function (n) {
    if (c[n].perdida < MIN_PERDIDA) Logger.log('  "' + n + '" ya casi no se queda sin dinero: no recibe.');
    else recibe.push({ nombre: n, sube: r2(c[n].monto * PCT / 100) });
  });
  if (!recibe.length) { Logger.log('  Ninguna campana necesita mas dinero. No se mueve nada.'); return []; }
  var total = r2(recibe.reduce(function (s, x) { return s + x.sube; }, 0)), tope = r2(origen.monto * PCT / 100);
  if (total > tope) { recibe.forEach(function (x) { x.sube = r2(x.sube * tope / total); }); total = r2(recibe.reduce(function (s, x) { return s + x.sube; }, 0)); }
  var ops = [], txt = [], antes = [];
  ops.push({ campaignBudgetOperation: { update: { resourceName: origen.rn, amountMicros: Math.round(r2(origen.monto - total) * 1e6) }, updateMask: 'amountMicros' } });
  txt.push('"' + info.quitar + '": ' + pesos(origen.monto) + ' -> ' + pesos(r2(origen.monto - total)) + ' (-' + pesos(total) + ')'); antes.push(origen);
  recibe.forEach(function (x) {
    var y = c[x.nombre];
    ops.push({ campaignBudgetOperation: { update: { resourceName: y.rn, amountMicros: Math.round(r2(y.monto + x.sube) * 1e6) }, updateMask: 'amountMicros' } });
    txt.push('"' + x.nombre + '": ' + pesos(y.monto) + ' -> ' + pesos(r2(y.monto + x.sube)) + ' (+' + pesos(x.sube) + ')'); antes.push(y);
  });
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), salida = [], fallo = false;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) { Logger.log('  ' + (vista ? 'se puede: ' : 'LISTO: ') + txt[i]); if (!vista) salida.push("{c: '" + cidG + "', presupuesto: '" + antes[i].rn + "', monto: " + antes[i].monto.toFixed(2) + "}"); }
    else { fallo = true; Logger.log('  ERROR ' + txt[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('  Gasto diario total de la marca: igual (se movieron ' + pesos(total) + ').');
  if (fallo && !vista) Logger.log('  OJO: algo fallo. Corre el DESHACER de abajo para dejar todo como estaba y avisame.');
  return salida;
}

function deshacer(cidG, vista) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.c !== cidG) return;
    ops.push({ campaignBudgetOperation: { update: { resourceName: d.presupuesto, amountMicros: Math.round(d.monto * 1e6) }, updateMask: 'amountMicros' } });
    txt.push('regresar el presupuesto a $' + d.monto);
  });
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return; }
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + txt[i] + (r.isSuccessful() ? '' : ': ' + r.getErrorMessages().join('; ')));
  });
}
