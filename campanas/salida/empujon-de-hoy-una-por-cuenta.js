// EMPUJON DE HOY - un solo cambio por cuenta, solo donde YA llegan contactos (19 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR. Sirve para Quick Laundry, Gamesail, Kingstar y Laundry Solutions.
// (Girbau no: ahi lo que frena son los anuncios en revision, no el dinero.)
//
// QUE HACE: en cada cuenta busca UNA campana de Busqueda que:
//   - trajo contactos en los ultimos 14 dias,
//   - su costo por contacto no es mas de 1.5 veces el promedio de la marca,
//   - y esta dejando de salir en busquedas (7 dias):
//       * si pierde 15% o mas por PRESUPUESTO  -> sube su presupuesto diario +20%
//       * si pierde 25% o mas por PUJA (y 20% o menos por presupuesto) -> sube su tope por clic +20% (max $40)
//   De las que pasan, escoge la que mas contactos esta perdiendo. Solo esa.
// CANDADOS: un cambio por cuenta; si ya hubo un cambio HOY en la cuenta, no hace nada ahi;
//   no toca campanas cambiadas en los ultimos 3 dias (ej. Kingstar Hotelera);
//   no pasa del presupuesto al mes que mando el cliente; no toca presupuestos compartidos ni estrategias.
//   No pausa, no apaga, no cambia anuncios, palabras, paginas ni metas. No baja nada.
// VISTA PREVIA: muestra lo que haria en cada cuenta y cuanto mas se gastaria al dia. No cambia nada.
// EJECUTAR: solo aplica en las cuentas que pongas en OK, ej: var OK = ['256-397-2201', '118-347-6484'];
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: regresa los valores de antes.

var OK = [];
var DESHACER = [];

var CUENTAS = {
  '256-397-2201': { nombre: 'Quick Laundry', mensual: 12000 },
  '118-347-6484': { nombre: 'Gamesail', mensual: 20000 },
  '993-525-8739': { nombre: 'Kingstar', mensual: 20000 },
  '265-909-2662': { nombre: 'Laundry Solutions', mensual: 9000 }
};
var SUBE = 0.20, TOPE_MAX = 40, DIAS_MES = 30.4;
var MIN_PRESUPUESTO = 0.15, MIN_PUJA = 0.25, MAX_PRES_PARA_PUJA = 0.20, VECES_PROMEDIO = 1.5;

var vista = false, salidaDeshacer = [], extraTotal = 0;

function main() {
  vista = AdsApp.getExecutionInfo().isPreview();
  var ids = Object.keys(CUENTAS);
  Logger.log('EMPUJON DE HOY' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  if (!vista && !DESHACER.length) Logger.log('Cuentas con OK: ' + (OK.length ? OK.join(', ') : 'NINGUNA (no se aplicara nada)'));
  Logger.log('');
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get();
    while (it.hasNext()) { var a = it.next(); AdsManagerApp.select(a); unaCuenta(a.getCustomerId()); }
  } else {
    var cid = AdsApp.currentAccount().getCustomerId();
    if (!CUENTAS[cid]) { Logger.log('Esta cuenta no esta en la lista. No se hizo nada.'); return; }
    unaCuenta(cid);
  }
  Logger.log('');
  if (salidaDeshacer.length) Logger.log('PARA DESHACER: var DESHACER = [' + salidaDeshacer.join(', ') + '];');
  if (!DESHACER.length) Logger.log('Gasto extra al dia si se aplica todo lo propuesto: $' + Math.round(extraTotal) + ' (como maximo).');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function pct(x) { return Math.round((Number(x) || 0) * 100) + '%'; }
function pesos(m) { return Math.round((Number(m) || 0) / 1e4) / 100; }
function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }

function unaCuenta(cid) {
  var info = CUENTAS[cid];
  Logger.log('==== ' + info.nombre + ' (' + cid + ') ====');
  try {
    if (DESHACER.length) return deshacer(cid);
    proponer(cid, info);
  } catch (e) { Logger.log('  ERROR al revisar: ' + e.message); }
  Logger.log('');
}

function deshacer(cid) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.c !== cid) return;
    var micros = String(Math.round(Number(d.v) * 1e6));
    if (d.t === 'b') ops.push({ campaignBudgetOperation: { update: { resourceName: d.rn, amountMicros: micros }, updateMask: 'amountMicros' } });
    else ops.push({ campaignOperation: { update: { resourceName: d.rn, targetSpend: { cpcBidCeilingMicros: micros } }, updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    txt.push(d.n + ' -> $' + d.v);
  });
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return; }
  aplicar(ops, txt);
}

function proponer(cid, info) {
  var tz = AdsApp.currentAccount().getTimeZone(), ahora = new Date();
  var hoy = Utilities.formatDate(ahora, tz, 'yyyy-MM-dd');
  var hace3 = Utilities.formatDate(new Date(ahora.getTime() - 3 * 864e5), tz, 'yyyy-MM-dd');
  var hace14 = Utilities.formatDate(new Date(ahora.getTime() - 14 * 864e5), tz, 'yyyy-MM-dd');

  // Cambios recientes: hoy (candado de cuenta) y ultimos 3 dias (por campana)
  var cambioHoy = false, recientes = {};
  leer("SELECT change_event.campaign, change_event.change_date_time FROM change_event WHERE change_event.change_date_time >= '" +
    hace3 + " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 1000").forEach(function (r) {
      var ce = r.changeEvent || {};
      if (String(ce.changeDateTime || '').indexOf(hoy) === 0) cambioHoy = true;
      if (ce.campaign) recientes[ce.campaign] = true;
    });

  // Presupuesto diario total de la cuenta (campanas encendidas)
  var vistos = {}, diario = 0;
  leer("SELECT campaign_budget.resource_name, campaign_budget.amount_micros FROM campaign WHERE campaign.status = 'ENABLED'").forEach(function (r) {
    var b = r.campaignBudget || {};
    if (b.resourceName && !vistos[b.resourceName]) { vistos[b.resourceName] = 1; diario += (Number(b.amountMicros) || 0) / 1e6; }
  });
  var limiteDiario = info.mensual / DIAS_MES;
  Logger.log('  Presupuesto diario de la cuenta: $' + Math.round(diario) + ' (al mes ~$' + Math.round(diario * DIAS_MES) +
    ' de $' + info.mensual + ' que mando el cliente)');

  // Contactos y costo 14 dias
  var C = {}, convTot = 0, costoTot = 0;
  leer("SELECT campaign.resource_name, metrics.conversions, metrics.cost_micros FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND segments.date BETWEEN '" + hace14 + "' AND '" + hoy + "'").forEach(function (r) {
      var m = r.metrics || {}, cv = Number(m.conversions) || 0, co = (Number(m.costMicros) || 0) / 1e6;
      C[r.campaign.resourceName] = { conv: cv, costo: co }; convTot += cv; costoTot += co;
    });
  var promedio = convTot ? costoTot / convTot : 0;
  Logger.log('  Promedio de la marca (14 dias): ' + Math.round(convTot) + ' contactos en Google, $' + Math.round(promedio) + ' por contacto');

  // Busquedas perdidas 7 dias
  var S = {};
  leer("SELECT campaign.resource_name, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share, " +
    "metrics.search_impression_share FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH' " +
    "AND segments.date DURING LAST_7_DAYS").forEach(function (r) { S[r.campaign.resourceName] = r.metrics || {}; });

  var mejor = null;
  leer("SELECT campaign.name, campaign.resource_name, campaign.bidding_strategy_type, campaign.bidding_strategy, " +
    "campaign.target_spend.cpc_bid_ceiling_micros, campaign_budget.resource_name, campaign_budget.amount_micros, " +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'").forEach(function (r) {
      var x = r.campaign, b = r.campaignBudget || {}, rn = x.resourceName;
      var c = C[rn] || { conv: 0, costo: 0 }, m = S[rn] || {};
      var bud = Number(m.searchBudgetLostImpressionShare) || 0, rank = Number(m.searchRankLostImpressionShare) || 0;
      var cpa = c.conv ? c.costo / c.conv : 0;
      var linea = '  - ' + x.name + ' | contactos 14d: ' + (Math.round(c.conv * 10) / 10) + (c.conv ? ' ($' + Math.round(cpa) + ' c/u)' : '') +
        ' | sale en ' + pct(m.searchImpressionShare) + ', pierde por presupuesto ' + pct(bud) + ', por puja ' + pct(rank);
      var porque = '';
      if (c.conv < 1) porque = 'sin contactos en 14 dias';
      else if (promedio && cpa > promedio * VECES_PROMEDIO) porque = 'contacto caro (mas de 1.5 veces el promedio)';
      else if (recientes[rn]) porque = 'se cambio en los ultimos 3 dias: primero medir';
      var op = null;
      if (!porque) {
        if (bud >= MIN_PRESUPUESTO) {
          if (b.explicitlyShared) porque = 'pierde por presupuesto pero el presupuesto es compartido';
          else {
            var act = (Number(b.amountMicros) || 0) / 1e6, nuevo = Math.floor(act * (1 + SUBE));
            var cabe = Math.floor(limiteDiario - diario);
            if (nuevo - act > cabe) nuevo = Math.floor(act + Math.max(cabe, 0));
            if (nuevo <= act) porque = 'pierde por presupuesto, pero la cuenta ya esta en su limite del mes';
            else op = { tipo: 'b', rn: b.resourceName, antes: act, despues: nuevo, extra: nuevo - act, score: bud * c.conv,
              texto: 'presupuesto diario $' + act + ' -> $' + nuevo };
          }
        } else if (rank >= MIN_PUJA && bud <= MAX_PRES_PARA_PUJA) {
          var tope = Number((x.targetSpend || {}).cpcBidCeilingMicros) || 0;
          if (x.biddingStrategy) porque = 'pierde por puja pero usa estrategia compartida';
          else if (x.biddingStrategyType !== 'TARGET_SPEND' || !tope) porque = 'pierde por puja pero no es "maximizar clics" con tope (no se cambia la estrategia)';
          else {
            var t0 = tope / 1e6, t1 = Math.min(Math.floor(t0 * (1 + SUBE)), TOPE_MAX);
            if (t1 <= t0) porque = 'tope ya en el maximo ($' + TOPE_MAX + ')';
            else op = { tipo: 't', rn: rn, antes: t0, despues: t1, extra: 0, score: rank * c.conv, texto: 'tope por clic $' + t0 + ' -> $' + t1 };
          }
        } else porque = 'casi no pierde busquedas: mas dinero no le serviria';
      }
      Logger.log(linea);
      Logger.log('      ' + (op ? 'CANDIDATA: ' + op.texto : 'no: ' + porque));
      if (op) { op.nombre = x.name; if (!mejor || op.score > mejor.score) mejor = op; }
    });

  if (!mejor) { Logger.log('  >> Hoy no hay un cambio seguro en esta cuenta. No se toca.'); return; }
  Logger.log('  >> PROPUESTA (una sola): ' + mejor.nombre + ': ' + mejor.texto +
    (mejor.extra ? ' (gasto extra maximo $' + mejor.extra + ' al dia)' : ' (no sube el presupuesto del dia)'));
  extraTotal += mejor.extra;
  if (cambioHoy) { Logger.log('  ALTO: ya hubo un cambio HOY en esta cuenta. No se aplica. Se puede correr manana.'); return; }
  if (!vista && OK.indexOf(cid) < 0) { Logger.log('  Sin OK para esta cuenta: no se aplica.'); return; }

  var micros = String(Math.round(mejor.despues * 1e6)), ops = [];
  if (mejor.tipo === 'b') ops.push({ campaignBudgetOperation: { update: { resourceName: mejor.rn, amountMicros: micros }, updateMask: 'amountMicros' } });
  else ops.push({ campaignOperation: { update: { resourceName: mejor.rn, targetSpend: { cpcBidCeilingMicros: micros } }, updateMask: 'targetSpend.cpcBidCeilingMicros' } });
  if (aplicar(ops, [mejor.nombre]))
    salidaDeshacer.push("{c: '" + cid + "', t: '" + mejor.tipo + "', rn: '" + mejor.rn + "', v: " + mejor.antes + ", n: '" + mejor.nombre.replace(/[^ -~]|'/g, '') + "'}");
}

function aplicar(ops, textos) {
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), ok = true;
  for (var i = 0; i < res.length; i++) {
    if (!res[i].isSuccessful()) { ok = false; Logger.log('  ERROR ' + textos[i] + ': ' + res[i].getErrorMessages().join('; ')); }
    else Logger.log('  ' + (vista ? 'se puede aplicar (revisado por Google): ' : 'LISTO: ') + textos[i]);
  }
  return ok;
}
