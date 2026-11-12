/**
 * Atelback · Subir el tope por clic donde perdemos por puja, SIN frenar contactos — las cinco cuentas
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py).
 *
 * IDEA: en las campañas de «maximizar clics», el tope por clic es lo máximo que se paga por un clic. Si es bajo,
 * la competencia nos gana la subasta y el anuncio no sale. Subirlo NO sube el presupuesto del día: deja entrar a
 * más subastas.
 *
 * CANDADOS PARA NO FRENAR LEADS (todas se tienen que cumplir, si no, no se toca):
 *   - Solo campañas de «maximizar clics» que YA tienen tope. Nunca baja un tope; solo sube.
 *   - En los últimos 14 días trajo al menos 2 contactos, y su costo por contacto es igual o mejor que el de su cuenta.
 *   - Pierde al menos 25% de las búsquedas por PUJA («ranking»).
 *   - Pierde 20% o menos por PRESUPUESTO. Si el presupuesto ya se acaba, un clic más caro daría MENOS clics con el
 *     mismo dinero y podría bajar los contactos: en ese caso no se toca.
 *   - Sube como máximo 20% por corrida y nunca arriba de TOPE_MAXIMO.
 *   - Si el tope o el presupuesto de la campaña ya cambió HOY, no la toca.
 * No toca presupuestos, anuncios, palabras, páginas ni conversiones. No pausa ni enciende nada.
 * Google solo ve a quien acepta cookies: los contactos reales son más. Por eso estos candados son conservadores.
 *
 * QUÉ HACE:
 *   - VISTA PREVIA: muestra cada campaña, sus números y el tope que tendría. No cambia nada.
 *   - EJECUTAR (solo con el OK): sube esos topes.
 * Se puede repetir cada semana; cada vez revisa de nuevo los candados.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var SUBE_MAX = 0.20;        // +20% por corrida
var TOPE_MAXIMO = 40;       // nunca más de $40 por clic
var PIERDE_PUJA_MIN = 0.25;
var PIERDE_PRESUPUESTO_MAX = 0.20;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + (Math.round((Number(x) || 0) * 100) / 100).toLocaleString('en-US'); }
function pct(x) { return Math.round((Number(x) || 0) * 100) + '%'; }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  Logger.log('TOPES POR CLIC SIN FRENAR · ' + marca + ' · 14 días · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  var C = {}, gastoCuenta = 0, contCuenta = 0;
  filas("SELECT campaign.name, campaign.resource_name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "campaign_budget.resource_name FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
      C[f.campaign.name] = { rn: f.campaign.resourceName, puja: f.campaign.biddingStrategyType, presupuesto: f.campaignBudget.resourceName,
        tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6, gasto: 0, clics: 0, cont: 0, rank: 0, budget: 0 };
    });
  filas("SELECT campaign.name, metrics.cost_micros, metrics.clicks, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND segments.date DURING LAST_14_DAYS", 'los números').forEach(function (f) {
      var c = C[f.campaign.name]; if (!c) return;
      c.gasto = (+f.metrics.costMicros || 0) / 1e6; c.clics = +f.metrics.clicks || 0;
      c.rank = +f.metrics.searchRankLostImpressionShare || 0; c.budget = +f.metrics.searchBudgetLostImpressionShare || 0;
      gastoCuenta += c.gasto;
    });
  filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND segments.date DURING LAST_14_DAYS", 'los contactos').forEach(function (f) {
      var c = C[f.campaign.name], a = f.segments.conversionActionName;
      if (c && esReal(a, tipos[a])) { var v = +f.metrics.allConversions || 0; c.cont += v; contCuenta += v; }
    });
  var cpaCuenta = contCuenta ? gastoCuenta / contCuenta : 0;
  Logger.log('Costo por contacto de la cuenta (14 días): ' + (cpaCuenta ? pesos(cpaCuenta) : 'sin contactos'));
  Logger.log('');

  var movidoHoy = {};
  filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy + " 00:00:00' AND " +
    "change_event.change_date_time <= '" + hoy + " 23:59:59' AND change_event.change_resource_type IN ('CAMPAIGN', 'CAMPAIGN_BUDGET') LIMIT 2000",
    'los cambios de hoy').forEach(function (f) { movidoHoy[f.changeEvent.changeResourceName] = true; });

  var ops = [], textos = [];
  Object.keys(C).sort().forEach(function (k) {
    var c = C[k];
    if (c.puja !== 'TARGET_SPEND') return;   // solo «maximizar clics»
    var cpa = c.cont ? c.gasto / c.cont : 0, cpc = c.clics ? c.gasto / c.clics : 0;
    var linea = '«' + k + '» · tope ' + (c.tope ? pesos(c.tope) : 'sin tope') + ' · clic promedio ' + pesos(cpc) + ' · ' + n(c.cont) + ' contactos' +
      (cpa ? ' (' + pesos(cpa) + ' c/u)' : '') + ' · pierde ' + pct(c.rank) + ' por puja y ' + pct(c.budget) + ' por presupuesto';
    var no = '';
    if (!c.tope) no = 'no tiene tope: no hay nada que subir';
    else if (c.cont < 2) no = 'menos de 2 contactos en 14 días';
    else if (cpaCuenta && cpa > cpaCuenta) no = 'su costo por contacto es más caro que el de la cuenta';
    else if (c.rank < PIERDE_PUJA_MIN) no = 'casi no pierde por puja';
    else if (c.budget > PIERDE_PRESUPUESTO_MAX) no = 'ya se le acaba el presupuesto: un clic más caro daría menos clics';
    else if (c.tope >= TOPE_MAXIMO) no = 'ya está en el tope máximo (' + pesos(TOPE_MAXIMO) + ')';
    else if (movidoHoy[c.rn] || movidoHoy[c.presupuesto]) no = 'ya se movió hoy: mañana';
    if (no) { Logger.log(linea); Logger.log('   se queda igual · ' + no); return; }
    var nuevo = Math.min(TOPE_MAXIMO, Math.round(c.tope * (1 + SUBE_MAX)));
    if (nuevo <= c.tope) nuevo = c.tope + 1;
    Logger.log(linea);
    Logger.log('   SUBE el tope ' + pesos(c.tope) + ' → ' + pesos(nuevo) + ' · el presupuesto del día no cambia');
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(nuevo * 1e6) } }, updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    textos.push(k + ' tope ' + pesos(nuevo));
  });
  if (!textos.length && !Object.keys(C).some(function (k) { return C[k].puja === 'TARGET_SPEND'; }))
    Logger.log('Esta cuenta no tiene campañas de «maximizar clics»: no hay topes que subir.');

  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ ' + textos[i]);
    });
  }
  Logger.log('');
  Logger.log('TOPES · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · suben: ' + ops.length + (ops.length ? ' (' + textos.join('; ') + ')' : '') + ' · con error: ' + malos);
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
