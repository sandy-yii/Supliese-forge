// KINGSTAR - subir el tope por clic +20% en "Lavanderia hotelera" y "Mangles" (18 nov 2026)
// POR QUE: hoy pierden la mayoria de las busquedas por PUJA (hotelera 67%, mangles 90%; ayer 30% y 31%),
// con presupuesto de sobra (pierden 0% por presupuesto). Subir el tope NO sube el presupuesto del dia:
// solo deja entrar a las subastas que hoy le gana la competencia.
// VISTA PREVIA: muestra el tope actual y el nuevo. No cambia nada.
// EJECUTAR (con el OK): sube el tope +20% (maximo $40 por clic).
// CANDADOS: solo estas 2 campanas; solo si en 7 dias pierden 25% o mas por puja y 20% o menos por presupuesto;
//   solo si trajeron al menos 1 contacto en 14 dias; si ya hubo un cambio HOY en la cuenta, no aplica nada.
//   Nunca baja un tope. No toca presupuesto, anuncios ni palabras. No pausa nada.
// DESHACER: copia en DESHACER los valores que imprime "PARA DESHACER" y Ejecutar: regresa esos topes.
var CUENTA = '993-525-8739';
var CAMPANAS = ['Lavander\u00eda hotelera', 'Mangles y planchado'];
var SUBE = 0.20, TOPE_MAX = 40;
var DESHACER = {};   // ejemplo: {'AB \u00b7 Mangles y planchado': 18}

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Kingstar (' + CUENTA + '). No se hizo nada.'); return;
  }
  correr();
}

function pct(x) { return Math.round((Number(x) || 0) * 100) + '%'; }
function pesos(m) { return Math.round((Number(m) || 0) / 1e4) / 100; }

function correr() {
  var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var vista = AdsApp.getExecutionInfo().isPreview(), modoDeshacer = Object.keys(DESHACER).length > 0;
  Logger.log('KINGSTAR - TOPE POR CLIC' + (modoDeshacer ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var S7 = {}, C14 = {};
  var a = AdsApp.search("SELECT campaign.name, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND segments.date DURING LAST_7_DAYS");
  while (a.hasNext()) { var r = a.next(); S7[r.campaign.name] = r.metrics || {}; }
  var desde = Utilities.formatDate(new Date(Date.now() - 14 * 864e5), tz, 'yyyy-MM-dd');
  var b = AdsApp.search("SELECT campaign.name, metrics.conversions FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND segments.date BETWEEN '" + desde + "' AND '" + hoy + "'");
  while (b.hasNext()) { var q = b.next(); C14[q.campaign.name] = Number((q.metrics || {}).conversions) || 0; }

  var ops = [], textos = [], deshacer = [];
  var c = AdsApp.search("SELECT campaign.name, campaign.resource_name, campaign.bidding_strategy_type, campaign.bidding_strategy, " +
    "campaign.target_spend.cpc_bid_ceiling_micros FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'");
  while (c.hasNext()) {
    var x = c.next().campaign, nombre = x.name;
    if (!CAMPANAS.some(function (p) { return nombre.indexOf(p) >= 0; })) continue;
    var m = S7[nombre] || {}, rank = Number(m.searchRankLostImpressionShare) || 0, bud = Number(m.searchBudgetLostImpressionShare) || 0;
    var actual = Number((x.targetSpend || {}).cpcBidCeilingMicros) || 0;
    Logger.log('> ' + nombre + ' | puja: ' + x.biddingStrategyType + ' | tope actual: $' + pesos(actual) +
      ' | 7 dias: pierde por puja ' + pct(rank) + ', por presupuesto ' + pct(bud) + ' | contactos 14 dias: ' + (Math.round((C14[nombre] || 0) * 10) / 10));
    if (x.biddingStrategy) { Logger.log('   Usa una estrategia compartida: no se toca desde aqui.'); continue; }
    if (x.biddingStrategyType !== 'TARGET_SPEND' || !actual) { Logger.log('   No es "maximizar clics" con tope: no se toca.'); continue; }
    var nuevo;
    if (modoDeshacer) {
      if (DESHACER[nombre] === undefined) continue;
      nuevo = Math.round(Number(DESHACER[nombre]) * 1e6);
    } else {
      if (rank < 0.25) { Logger.log('   Pierde menos de 25% por puja: no hace falta.'); continue; }
      if (bud > 0.20) { Logger.log('   Pierde mas de 20% por presupuesto: subir el tope daria menos clics. No se toca.'); continue; }
      if ((C14[nombre] || 0) < 1) { Logger.log('   Sin contactos en 14 dias: no se toca.'); continue; }
      nuevo = Math.min(Math.floor(actual * (1 + SUBE) / 1e6) * 1e6, TOPE_MAX * 1e6);
      if (nuevo <= actual) { Logger.log('   Ya esta en el maximo ($' + TOPE_MAX + ').'); continue; }
    }
    Logger.log('   ' + (vista ? 'subiria' : 'sube') + ' el tope: $' + pesos(actual) + ' -> $' + pesos(nuevo));
    ops.push({ campaignOperation: { update: { resourceName: x.resourceName, targetSpend: { cpcBidCeilingMicros: String(nuevo) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    textos.push(nombre); deshacer.push("'" + nombre + "': " + pesos(actual));
  }
  Logger.log('');
  if (!ops.length) { Logger.log('Nada que cambiar.'); return; }
  if (!vista && !modoDeshacer) {
    var ch = AdsApp.search("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20");
    if (ch.hasNext()) { Logger.log('ALTO: ya hubo un cambio HOY en Kingstar. No se aplico nada. Correlo manana.'); return; }
  }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  for (var i = 0; i < res.length; i++) {
    if (!res[i].isSuccessful()) Logger.log('ERROR ' + textos[i] + ': ' + res[i].getErrorMessages().join('; '));
    else if (!vista) Logger.log('LISTO ' + textos[i]);
  }
  Logger.log('PARA DESHACER: var DESHACER = {' + deshacer.join(', ') + '};');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}
