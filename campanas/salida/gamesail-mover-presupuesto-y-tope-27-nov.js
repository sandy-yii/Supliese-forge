// GAMESAIL - MAS DINERO A LO QUE TRAE, SIN GASTAR MAS (viernes 27 nov 2026)
// Pegar dentro de la cuenta Gamesail (118-347-6484). Vista previa, OK y Ejecutar.
// QUE HACE (el presupuesto diario total de Gamesail queda IGUAL):
//   1. "AB \u00b7 Secadoras industriales": presupuesto -20% ($868 por contacto en 30 dias; 1 contacto en 7 dias).
//   2. "AB \u00b7 Lavadoras por capacidad y precio": recibe ese mismo dinero (contacto mas barato, $96; pierde 21% por presupuesto).
//   3. "AB \u00b7 Hoteles y hospitales": tope por clic +20% ($20 -> $24). Pierde 26% de busquedas por PUJA y 0% por presupuesto.
//      Su presupuesto no se mueve, asi que no puede gastar mas de lo que ya tiene.
// SEGUROS:
//   - Nada se pausa ni se apaga. No toca estrategias, anuncios ni palabras.
//   - Cada campana recibe un solo cambio. Maximo 20%.
//   - Por capacidad solo recibe si en los ultimos 3 dias perdio 10% o mas por presupuesto.
//   - Hoteles solo sube el tope si en 7 dias perdio 20% o mas por puja y 20% o menos por presupuesto.
//   - Si ya hubo un cambio HOY en la cuenta (sin contar fotos), no se aplica nada.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: todo regresa como estaba.

var CUENTA = '118-347-6484';
var QUITAR = 'AB \u00b7 Secadoras industriales';
var DAR = 'AB \u00b7 Lavadoras por capacidad y precio';
var TOPE = 'AB \u00b7 Hoteles y hospitales';
var PCT = 20, MIN_PERDIDA = 0.10;
var DESHACER = [];

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function q(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
function pesos(n) { return '$' + n.toFixed(2); }
function r2(n) { return Math.round(n * 100) / 100; }

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Gamesail (' + CUENTA + '). No se hizo nada.'); return;
  }
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('GAMESAIL - MAS DINERO A LO QUE TRAE' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  try {
    if (DESHACER.length) deshacer(vista); else correr(vista);
  } catch (e) { Logger.log('ERROR: ' + e.message + ' (no se cambio nada)'); }
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function correr(vista) {
  var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var d = function (n) { return Utilities.formatDate(new Date(Date.now() - n * 86400000), tz, 'yyyy-MM-dd'); };
  var FOTO = { ASSET: 1, AD_GROUP_ASSET: 1, CAMPAIGN_ASSET: 1, CUSTOMER_ASSET: 1 };
  if (!vista && leer("SELECT change_event.change_resource_name, change_event.change_resource_type FROM change_event WHERE change_event.change_date_time >= '" + hoy +
    " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 100").filter(function (r) { return !FOTO[r.changeEvent.changeResourceType]; }).length) {
    Logger.log('ALTO: ya hubo un cambio HOY en Gamesail. No se aplico nada. Avisame.'); return;
  }
  var nombres = [QUITAR, DAR, TOPE], c = {};
  leer("SELECT campaign.name, campaign.resource_name, campaign.bidding_strategy_type, campaign.bidding_strategy, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND campaign.name IN (" + nombres.map(q).join(', ') + ")").forEach(function (r) {
    c[r.campaign.name] = { rn: r.campaign.resourceName, tipo: r.campaign.biddingStrategyType, compartida: !!r.campaign.biddingStrategy,
      tope: Number((r.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6, brn: r.campaignBudget.resourceName,
      monto: Number(r.campaignBudget.amountMicros) / 1e6, pcomp: r.campaignBudget.explicitlyShared, p3: 0, g3: 0, c3: 0, rank7: 0, bud7: 0 };
  });
  for (var i = 0; i < nombres.length; i++) if (!c[nombres[i]]) { Logger.log('No encontre la campana activa "' + nombres[i] + '". No se hizo nada.'); return; }
  leer("SELECT campaign.name, metrics.search_budget_lost_impression_share, metrics.cost_micros, metrics.conversions FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND campaign.name IN (" + nombres.map(q).join(', ') + ") AND segments.date BETWEEN '" + d(3) + "' AND '" + d(1) + "'").forEach(function (r) {
    var x = c[r.campaign.name]; x.p3 = Number(r.metrics.searchBudgetLostImpressionShare || 0); x.g3 = Number(r.metrics.costMicros) / 1e6; x.c3 = Number(r.metrics.conversions || 0);
  });
  leer("SELECT campaign.name, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND campaign.name IN (" + nombres.map(q).join(', ') + ") AND segments.date BETWEEN '" + d(7) + "' AND '" + d(1) + "'").forEach(function (r) {
    var x = c[r.campaign.name]; x.rank7 = Number(r.metrics.searchRankLostImpressionShare || 0); x.bud7 = Number(r.metrics.searchBudgetLostImpressionShare || 0);
  });
  nombres.forEach(function (n) {
    var x = c[n];
    Logger.log('"' + n + '": presupuesto ' + pesos(x.monto) + ' al dia, tope por clic ' + (x.tope ? pesos(x.tope) : 'sin tope') + '. Ultimos 3 dias: gasto ' + pesos(x.g3) + ', ' +
      x.c3.toFixed(0) + ' contactos, pierde ' + Math.round(x.p3 * 100) + '% por presupuesto. Ultimos 7 dias: pierde ' + Math.round(x.rank7 * 100) + '% por puja.');
  });
  Logger.log('');

  var ops = [], txt = [], undo = [];
  // 1 y 2: mover presupuesto de Secadoras a Por capacidad (mismo total)
  var o = c[QUITAR], r = c[DAR];
  if (o.pcomp || r.pcomp) Logger.log('Presupuesto compartido: no se mueve presupuesto.');
  else if (r.p3 < MIN_PERDIDA) Logger.log('"' + DAR + '" ya casi no se queda sin dinero: no se mueve presupuesto.');
  else {
    var mueve = r2(Math.min(o.monto * PCT / 100, r.monto * PCT / 100));
    ops.push({ campaignBudgetOperation: { update: { resourceName: o.brn, amountMicros: Math.round(r2(o.monto - mueve) * 1e6) }, updateMask: 'amountMicros' } });
    txt.push('presupuesto "' + QUITAR + '": ' + pesos(o.monto) + ' -> ' + pesos(r2(o.monto - mueve)) + ' (-' + pesos(mueve) + ')');
    undo.push("{presupuesto: '" + o.brn + "', monto: " + o.monto.toFixed(2) + "}");
    ops.push({ campaignBudgetOperation: { update: { resourceName: r.brn, amountMicros: Math.round(r2(r.monto + mueve) * 1e6) }, updateMask: 'amountMicros' } });
    txt.push('presupuesto "' + DAR + '": ' + pesos(r.monto) + ' -> ' + pesos(r2(r.monto + mueve)) + ' (+' + pesos(mueve) + ')');
    undo.push("{presupuesto: '" + r.brn + "', monto: " + r.monto.toFixed(2) + "}");
  }
  // 3: tope por clic de Hoteles y hospitales
  var h = c[TOPE];
  if (h.compartida || h.tipo !== 'TARGET_SPEND' || !h.tope) Logger.log('"' + TOPE + '" no es "maximizar clics" con tope propio: no se toca el tope.');
  else if (h.rank7 < 0.20) Logger.log('"' + TOPE + '" pierde menos de 20% por puja: no hace falta subir el tope.');
  else if (h.bud7 > 0.20) Logger.log('"' + TOPE + '" pierde mas de 20% por presupuesto: subir el tope daria menos clics. No se toca.');
  else {
    var nuevo = Math.floor(h.tope * (1 + PCT / 100) * 100) / 100;
    ops.push({ campaignOperation: { update: { resourceName: h.rn, targetSpend: { cpcBidCeilingMicros: String(Math.round(nuevo * 1e6)) } }, updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    txt.push('tope por clic "' + TOPE + '": ' + pesos(h.tope) + ' -> ' + pesos(nuevo));
    undo.push("{campana: '" + h.rn + "', tope: " + h.tope.toFixed(2) + "}");
  }
  if (!ops.length) { Logger.log('Nada que cambiar.'); return; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), salida = [], fallo = false;
  res.forEach(function (x, i) {
    if (x.isSuccessful()) { Logger.log((vista ? 'se puede: ' : 'LISTO: ') + txt[i]); salida.push(undo[i]); }
    else { fallo = true; Logger.log('ERROR ' + txt[i] + ': ' + x.getErrorMessages().join('; ')); }
  });
  Logger.log('Presupuesto diario total de Gamesail: igual.');
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.join(', ') + '];');
  if (fallo && !vista) Logger.log('OJO: algo fallo. Corre el DESHACER para dejar todo como estaba y avisame.');
}

function deshacer(vista) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.presupuesto) {
      ops.push({ campaignBudgetOperation: { update: { resourceName: d.presupuesto, amountMicros: Math.round(d.monto * 1e6) }, updateMask: 'amountMicros' } });
      txt.push('regresar presupuesto a ' + pesos(d.monto));
    } else if (d.campana) {
      ops.push({ campaignOperation: { update: { resourceName: d.campana, targetSpend: { cpcBidCeilingMicros: String(Math.round(d.tope * 1e6)) } }, updateMask: 'targetSpend.cpcBidCeilingMicros' } });
      txt.push('regresar tope por clic a ' + pesos(d.tope));
    }
  });
  if (!ops.length) { Logger.log('Nada que deshacer.'); return; }
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (x, i) {
    Logger.log((x.isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + txt[i] + (x.isSuccessful() ? '' : ': ' + x.getErrorMessages().join('; ')));
  });
}
