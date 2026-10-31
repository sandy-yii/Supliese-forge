/**
 * Atelback · Ajustes — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py (campo «ajustes» de cada cuenta). No se edita a mano.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): pausa las campañas anteriores
 * y las palabras clave que indica el plan, y pone a las campañas nuevas «AB ·» el presupuesto diario y el tope de costo
 * por clic que indica el plan.
 * Pausar se puede deshacer en cualquier momento y conserva el historial. No toca anuncios, topes ni páginas.
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
    FALLO = true;
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
var FALLO = false;   // si una revisión falla, no se enciende ninguna campaña anterior
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('AJUSTES · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var aj = PLAN.ajustes || {};
  var pausar = aj.pausar || [], presupuesto = aj.presupuesto || {}, palabras = aj.pausar_palabras || [], topes = aj.topes || {},
      encender = aj.encender_palabras || [],
      arriba = aj.arriba || {}, activar = aj.activar || {}, presencia = aj.presencia || [];
  if (!pausar.length && !Object.keys(presupuesto).length && !palabras.length && !encender.length && !Object.keys(topes).length && !Object.keys(arriba).length &&
      !Object.keys(activar).length && !presencia.length) { Logger.log('Nada que ajustar en esta cuenta por ahora.'); return; }

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
  function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; }
  var nuestra = sitio(PLAN.url), noEncendio = [];
  // El dominio que se deja al pasar al de siempre sigue siendo nuestro (en la misma corrida, el paso anterior ya los cambia)
  var tambien = (PLAN.tambien || []).map(function (d) { return d.replace(/^www\./, ''); });
  function otra(s) { return s !== nuestra && tambien.indexOf(s) < 0; }

  // Campañas anteriores que se vuelven a encender: solo si todos sus anuncios ya llevan a la página de la marca
  Object.keys(activar).forEach(function (n) {
    var monto = activar[n], f = filas("SELECT campaign.resource_name, campaign.status, campaign.advertising_channel_type, campaign_budget.resource_name, " +
      "campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign WHERE campaign.name = '" + n.replace(/'/g, "\\'") + "' AND campaign.status != 'REMOVED'", 'la campaña ' + n)[0];
    if (!f) { que.push('«' + n + '»: no existe en esta cuenta. Se salta.'); return; }
    if (f.campaign.status === 'ENABLED') { que.push('«' + n + '»: ya está encendida.'); return; }
    var malas = {};
    FALLO = false;
    filas("SELECT ad_group_ad.ad.final_urls FROM ad_group_ad WHERE campaign.resource_name = '" + f.campaign.resourceName + "' AND ad_group_ad.status = 'ENABLED' " +
      "AND ad_group.status = 'ENABLED'", 'los anuncios de ' + n).forEach(function (a) {
      (a.adGroupAd.ad.finalUrls || []).forEach(function (u) { if (otra(sitio(u))) malas[sitio(u) || '(sin dirección)'] = true; });
    });
    filas("SELECT asset_group.final_urls FROM asset_group WHERE campaign.resource_name = '" + f.campaign.resourceName + "' AND asset_group.status = 'ENABLED'",
      'los grupos de recursos de ' + n).forEach(function (a) {
      (a.assetGroup.finalUrls || []).forEach(function (u) { if (otra(sitio(u))) malas[sitio(u) || '(sin dirección)'] = true; });
    });
    // Enlaces de sitio y otros recursos de la campaña que llevan a una página
    filas("SELECT campaign.resource_name, asset.final_urls, campaign_asset.field_type FROM campaign_asset WHERE campaign.resource_name = '" + f.campaign.resourceName + "' " +
      "AND campaign_asset.status = 'ENABLED'", 'los enlaces de ' + n).forEach(function (a) {
      (a.asset.finalUrls || []).forEach(function (u) { if (otra(sitio(u))) malas[sitio(u) + ' (enlace de sitio u otro recurso)'] = true; });
    });
    if (FALLO) {
      que.push('NO SE ENCIENDE «' + n + '»: no se pudo revisar a dónde mandan todos sus anuncios y enlaces (ver arriba). Manda este registro.');
      noEncendio.push(n);
      return;
    }
    if (Object.keys(malas).length) {
      que.push('NO SE ENCIENDE «' + n + '»: todavía manda a ' + Object.keys(malas).join(', ') + ' y no a ' + nuestra + '. Primero hay que cambiarle la página.');
      noEncendio.push(n);
      return;
    }
    ops.push({ campaignOperation: { update: { resourceName: f.campaign.resourceName, status: 'ENABLED',
      geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE' } }, updateMask: 'status,geoTargetTypeSetting.positiveGeoTargetType' } });
    donde.push('encender «' + n + '»');
    if (f.campaignBudget.explicitlyShared) {
      que.push('ENCENDER «' + n + '» (manda a ' + nuestra + '; solo personas en México). AVISO: su presupuesto es compartido; revísalo a mano.');
    } else {
      ops.push({ campaignBudgetOperation: { update: { resourceName: f.campaignBudget.resourceName, amountMicros: Math.round(monto * 1e6) }, updateMask: 'amountMicros' } });
      donde.push('presupuesto de «' + n + '»');
      que.push('ENCENDER «' + n + '» con ' + dinero(monto) + ' al día (antes tenía ' + dinero(Number(f.campaignBudget.amountMicros || 0) / 1e6) +
        '; manda a ' + nuestra + '; solo personas en México)');
    }
    despues += monto;
  });
  // Campañas encendidas que deben mostrarse solo a personas que están en México
  presencia.forEach(function (n) {
    var c = C[n];
    if (!c) return;
    ops.push({ campaignOperation: { update: { resourceName: c.rn, geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE' } },
      updateMask: 'geoTargetTypeSetting.positiveGeoTargetType' } });
    donde.push('zona de «' + n + '»');
    que.push('ZONA «' + n + '»: solo personas que están en México (antes también «interesadas» desde otros países)');
  });
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
  // Palabras clave pausadas que el plan vuelve a encender
  if (encender.length) {
    var pausadas = {};
    filas('SELECT campaign.name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
      "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'PAUSED' " +
      "AND campaign.status != 'REMOVED' AND ad_group.status != 'REMOVED'", 'las palabras clave pausadas').forEach(function (f) {
      var k = f.adGroupCriterion.keyword;
      pausadas[[f.campaign.name, f.adGroup.name, k.text.toLowerCase(), k.matchType].join('|')] = f.adGroupCriterion.resourceName;
    });
    encender.forEach(function (w) {
      var nombre = PLAN.prefijo + w[0] + ' > ' + w[1], rn = pausadas[[PLAN.prefijo + w[0], w[1], w[2].toLowerCase(), w[3]].join('|')];
      if (!rn) { que.push('«' + w[2] + '» en ' + nombre + ': no está pausada (ya encendida o no existe). Se salta.'); return; }
      ops.push({ adGroupCriterionOperation: { update: { resourceName: rn, status: 'ENABLED' }, updateMask: 'status' } });
      donde.push('encendido de la palabra «' + w[2] + '»');
      que.push('ENCENDER PALABRA «' + w[2] + '» en ' + nombre);
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
    // Las bajadas pagan las campañas que se encienden: si alguna no se encendió, no se baja nada
    if (nuevo < c.monto && noEncendio.length) { que.push('«' + n + '»: se queda en ' + dinero(c.monto) + ' (iba a bajar para pagar «' + noEncendio.join('», «') + '», que no se encendió).'); return; }
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
  // Nunca por encima del tope mensual acordado de la cuenta (1% de margen por redondeo)
  if (PLAN.mensual && despues * DIAS_MES > PLAN.mensual * 1.01) {
    throw new Error('Con estos cambios la cuenta quedaría en ' + dinero(despues * DIAS_MES) + ' al mes, arriba de su tope de ' +
      dinero(PLAN.mensual) + '. No se cambió nada: manda el registro.');
  }

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
