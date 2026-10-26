/**
 * Atelback · Más leads en las campañas nuevas — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está):
 *   1. Si ya no hay campañas anteriores encendidas, pasa a su presupuesto completo del plan las campañas nuevas «AB ·»
 *      que siguen con el de arranque (la mitad). Si un presupuesto ya se movió después (con «ajustes» o «subir
 *      presupuesto»), no lo toca.
 *   2. A las campañas nuevas que pierden la mitad o más de sus impresiones por puja (últimos 7 días), les sube el
 *      tope de CPC un 50%, o hasta lo que Google pide para la primera página. Nunca pasa del doble del tope del plan.
 * No toca anuncios, palabras clave, páginas ni campañas anteriores.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (dice cuánto se gastaría) > EJECUTAR.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS_MES = 30.4;

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function micros(pesos) { return Math.round(pesos * 1e6); }
function pesos(m) { return Number(m || 0) / 1e6; }
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('MÁS LEADS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var planDe = {};
  PLAN.campanas.forEach(function (k) { planDe[k.nombre] = k; });

  var nuevas = [], anteriores = [];
  filas('SELECT campaign.resource_name, campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    'campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign ' +
    "WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    var x = { nombre: f.campaign.name, rn: f.campaign.resourceName, puja: f.campaign.biddingStrategyType,
      tope: pesos((f.campaign.targetSpend || {}).cpcBidCeilingMicros), presupuesto: f.campaignBudget.resourceName,
      monto: pesos(f.campaignBudget.amountMicros), compartido: f.campaignBudget.explicitlyShared };
    (esNueva(x.nombre) ? nuevas : anteriores).push(x);
  });
  if (!nuevas.length) throw new Error('No hay campañas «' + PLAN.prefijo + '» encendidas. Corre «activar.js». No se hizo nada.');

  var cuota = {};
  filas('SELECT campaign.name, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share FROM campaign ' +
    "WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 'ENABLED'", 'la cuota de impresiones').forEach(function (f) {
    // Si una campaña aún no tiene datos, Google no manda «metrics».
    var m = f.metrics || {};
    cuota[f.campaign.name] = { puja: m.searchRankLostImpressionShare, presupuesto: m.searchBudgetLostImpressionShare };
  });
  var primera = {};
  filas('SELECT campaign.name, ad_group_criterion.position_estimates.first_page_cpc_micros FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'lo que pide Google por palabra').forEach(function (f) {
    var v = pesos((f.adGroupCriterion.positionEstimates || {}).firstPageCpcMicros);
    if (v) (primera[f.campaign.name] = primera[f.campaign.name] || []).push(v);
  });

  var ops = [], donde = [], que = [], antes = 0, despues = 0;
  var completo = anteriores.length === 0;
  if (!completo) {
    Logger.log('Siguen encendidas ' + anteriores.length + ' campaña(s) anterior(es): ' + anteriores.map(function (a) { return '«' + a.nombre + '»'; }).join(', ') +
      '. Las nuevas se quedan con su presupuesto actual; pasan a completo cuando pauses las anteriores.');
  }
  nuevas.forEach(function (x) {
    var k = planDe[x.nombre];
    antes += x.monto;
    var monto = x.monto;
    // 1. Presupuesto completo
    var fijo = (PLAN.fijos || []).indexOf(x.nombre.replace(PLAN.prefijo, '')) >= 0;   // su presupuesto lo pone «ajustes»
    if (completo && k && !fijo && x.monto <= k.arranque && x.monto < k.completo) {
      if (x.compartido) {
        que.push('AVISO «' + x.nombre + '»: su presupuesto es compartido con otras campañas; súbelo a mano a $' + k.completo + ' al día.');
      } else {
        monto = k.completo;
        ops.push({ campaignBudgetOperation: { update: { resourceName: x.presupuesto, amountMicros: micros(monto) }, updateMask: 'amountMicros' } });
        donde.push('presupuesto de «' + x.nombre + '»');
        que.push('PRESUPUESTO «' + x.nombre + '»: ' + dinero(x.monto) + ' → ' + dinero(monto) + ' al día');
      }
    }
    despues += monto;
    // 2. Tope de CPC
    var c = cuota[x.nombre];
    if (x.puja !== 'TARGET_SPEND' || !x.tope || !c || !(Number(c.puja) >= 0.5)) return;
    var maximo = k ? k.cpc * 2 : x.tope * 2;
    if (x.tope >= maximo) {
      que.push('AVISO «' + x.nombre + '»: pierde ' + Math.round(c.puja * 100) + '% por puja, pero su tope ($' + x.tope + ') ya es el doble del plan. Se revisa con las palabras clave.');
      return;
    }
    var pide = (primera[x.nombre] || []).sort(function (a, b) { return a - b; });
    var mediana = pide.length ? pide[Math.floor(pide.length / 2)] : 0;
    var nuevo = Math.ceil(Math.min(maximo, Math.max(x.tope * 1.5, mediana)));
    if (nuevo <= x.tope) return;
    ops.push({ campaignOperation: { update: { resourceName: x.rn, targetSpend: { cpcBidCeilingMicros: micros(nuevo) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    donde.push('tope CPC de «' + x.nombre + '»');
    que.push('TOPE CPC «' + x.nombre + '»: $' + x.tope + ' → $' + nuevo + ' (pierde ' + Math.round(c.puja * 100) + '% de impresiones por puja' +
      (mediana ? '; Google pide ~$' + Math.round(mediana) + ' para la primera página' : '') + ')');
  });

  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  if (!que.length) Logger.log('Nada que cambiar: las campañas nuevas ya tienen su presupuesto y su tope no las frena.');
  que.forEach(function (t) { Logger.log(t); });
  Logger.log('');
  Logger.log('Presupuesto diario de las campañas nuevas: ' + dinero(antes) + ' → ' + dinero(despues) +
    ' (al mes, hasta ' + dinero(despues * DIAS_MES) + '). Los topes de CPC no cambian el presupuesto: solo dejan entrar a más subastas.');
  if (!ops.length) return;

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo con el gasto, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '.');
  }
}
