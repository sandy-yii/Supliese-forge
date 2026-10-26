/**
 * Atelback · Ajustes — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py (campo «ajustes» de cada cuenta). No se edita a mano.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): pausa las campañas anteriores
 * y las palabras clave que indica el plan, y pone a las campañas nuevas «AB ·» el presupuesto diario y el tope de costo
 * por clic que indica el plan.
 * Pausar se puede deshacer en cualquier momento y conserva el historial. No toca anuncios, topes ni páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (dice cuánto se gastaría) > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "prefijo": "AB · ", "ajustes": {}}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "prefijo": "AB · ", "ajustes": {"presupuesto": {"Equipo para lavandería": 150, "Emprendimiento": 69, "Autoservicio y monedas": 34, "Marca Quick Laundry": 14}, "arriba": {"Marca Quick Laundry": {"cuota": 0.8, "tope": 10}}}}, {"cuenta": "993-525-8739", "nombre": "CLM", "prefijo": "AB · ", "ajustes": {"presupuesto": {"Alta capacidad 60 kg o más": 222, "Lavandería hotelera e institucional": 117}, "arriba": {"Marca CLM": {"cuota": 0.8, "tope": 15}}}}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "ajustes": {"pausar_palabras": [["Servicio técnico industrial", "Servicio técnico", "técnico lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Reparación", "reparación lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Mantenimiento preventivo", "mantenimiento lavadoras industriales", "BROAD"]], "presupuesto": {"Reparación y mantenimiento": 130, "Servicio técnico industrial": 64}}}, {"cuenta": "860-582-6837", "nombre": "Girbau", "prefijo": "AB · ", "ajustes": {"arriba": {"Marca Girbau": {"cuota": 0.8, "tope": 25}}}}];
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
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('AJUSTES · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var aj = PLAN.ajustes || {};
  var pausar = aj.pausar || [], presupuesto = aj.presupuesto || {}, palabras = aj.pausar_palabras || [], topes = aj.topes || {},
      arriba = aj.arriba || {};
  if (!pausar.length && !Object.keys(presupuesto).length && !palabras.length && !Object.keys(topes).length && !Object.keys(arriba).length) { Logger.log('Nada que ajustar en esta cuenta por ahora.'); return; }

  var C = {};
  filas('SELECT campaign.resource_name, campaign.name, campaign.status, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    'campaign.target_impression_share.location, campaign.target_impression_share.location_fraction_micros, ' +
    'campaign.target_impression_share.cpc_bid_ceiling_micros, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { rn: f.campaign.resourceName, presupuesto: f.campaignBudget.resourceName, puja: f.campaign.biddingStrategyType,
      tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6, cuota: f.campaign.targetImpressionShare || {},
      monto: Number(f.campaignBudget.amountMicros || 0) / 1e6, compartido: f.campaignBudget.explicitlyShared };
  });
  var antes = 0;
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });

  var ops = [], donde = [], que = [], despues = antes;
  pausar.forEach(function (n) {
    var c = C[n];
    if (!c) { que.push('«' + n + '»: no está encendida (ya en pausa o con otro nombre). Se salta.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, status: 'PAUSED' }, updateMask: 'status' } });
    donde.push('pausa de «' + n + '»');
    que.push('PAUSAR «' + n + '» (gastaba hasta ' + dinero(c.monto) + ' al día)');
    despues -= c.monto;
  });
  if (palabras.length) {
    var kws = {};
    filas('SELECT campaign.name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
      "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
      "AND campaign.status != 'REMOVED' AND ad_group.status != 'REMOVED'", 'las palabras clave').forEach(function (f) {
      var k = f.adGroupCriterion.keyword;
      kws[[f.campaign.name, f.adGroup.name, k.text.toLowerCase(), k.matchType].join('|')] = f.adGroupCriterion.resourceName;
    });
    palabras.forEach(function (w) {
      var nombre = PLAN.prefijo + w[0] + ' > ' + w[1], rn = kws[[PLAN.prefijo + w[0], w[1], w[2].toLowerCase(), w[3]].join('|')];
      if (!rn) { que.push('«' + w[2] + '» en ' + nombre + ': no está encendida. Se salta.'); return; }
      ops.push({ adGroupCriterionOperation: { update: { resourceName: rn, status: 'PAUSED' }, updateMask: 'status' } });
      donde.push('pausa de la palabra «' + w[2] + '»');
      que.push('PAUSAR PALABRA «' + w[2] + '» en ' + nombre);
    });
  }
  Object.keys(topes).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevoTope = topes[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja !== 'TARGET_SPEND') { que.push('AVISO «' + n + '»: no puja por clics con tope (' + c.puja + '). Se salta.'); return; }
    if (c.tope >= nuevoTope) { que.push('«' + n + '»: su tope ya es $' + c.tope + ' o más.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(nuevoTope * 1e6) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    donde.push('tope CPC de «' + n + '»');
    que.push('TOPE CPC «' + n + '»: $' + c.tope + ' → $' + nuevoTope + ' (entra a más subastas; no cambia el presupuesto)');
  });
  // Campañas que deben salir hasta arriba: «Cuota de impresiones objetivo», parte superior absoluta de la página
  Object.keys(arriba).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], a = arriba[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja === 'TARGET_IMPRESSION_SHARE' && c.cuota.location === 'ABSOLUTE_TOP_OF_PAGE' &&
        Math.round(Number(c.cuota.locationFractionMicros || 0) / 1e4) === Math.round(a.cuota * 100) &&
        Math.round(Number(c.cuota.cpcBidCeilingMicros || 0) / 1e6) === a.tope) {
      que.push('«' + n + '»: ya pide salir hasta arriba el ' + Math.round(a.cuota * 100) + '% de las veces con tope $' + a.tope + '.');
      return;
    }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetImpressionShare: { location: 'ABSOLUTE_TOP_OF_PAGE',
      locationFractionMicros: Math.round(a.cuota * 1e6), cpcBidCeilingMicros: Math.round(a.tope * 1e6) } }, updateMask: 'targetImpressionShare.location,targetImpressionShare.locationFractionMicros,targetImpressionShare.cpcBidCeilingMicros' } });
    donde.push('puja para salir arriba en «' + n + '»');
    que.push('SALIR ARRIBA «' + n + '»: de «maximizar clics» (tope $' + c.tope + ') a «salir hasta arriba el ' + Math.round(a.cuota * 100) +
      '% de las veces», pagando como máximo $' + a.tope + ' por clic. El presupuesto no cambia.');
  });
  Object.keys(presupuesto).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevo = presupuesto[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (Math.round(c.monto) === Math.round(nuevo)) { que.push('«' + n + '»: ya tiene ' + dinero(nuevo) + ' al día.'); return; }
    if (c.compartido) { que.push('AVISO «' + n + '»: su presupuesto es compartido; cámbialo a mano a ' + dinero(nuevo) + ' al día.'); return; }
    ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
    donde.push('presupuesto de «' + n + '»');
    que.push('PRESUPUESTO «' + n + '»: ' + dinero(c.monto) + ' → ' + dinero(nuevo) + ' al día');
    despues += nuevo - c.monto;
  });

  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  que.forEach(function (t) { Logger.log(t); });
  Logger.log('');
  Logger.log('Presupuesto diario de todas las campañas encendidas: ' + dinero(antes) + ' → ' + dinero(despues) +
    ' (al mes, hasta ' + dinero(antes * DIAS_MES) + ' → ' + dinero(despues * DIAS_MES) + ').');
  if (!ops.length) { Logger.log('Nada que cambiar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo con el gasto, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '. Para deshacer una pausa, actívala de nuevo en Campañas.');
  }
}
