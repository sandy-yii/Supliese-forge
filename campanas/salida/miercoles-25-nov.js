// MIERCOLES 25 NOV 2026 - un cambio por cuenta, con el OK de Sandy del 24-nov
// Pegar en la cuenta de ADMINISTRADOR. Correr el MIERCOLES 25 (Vista previa, OK y Ejecutar).
// QUE HACE:
//   Gamesail:          "AB \u00b7 Lavadoras para ropa y s\u00e1banas" presupuesto +20% (la que mas contactos trae y se queda sin dinero).
//   Girbau:            "AB \u00b7 Marca Girbau" presupuesto +20% (se queda sin dinero).
//   Kingstar:          "AB \u00b7 Lavander\u00eda hotelera e institucional" presupuesto +20% (se queda sin dinero).
//   Laundry Solutions: palabras NEGATIVAS de compra en sus 2 campanas (paga por gente que quiere comprar maquinas,
//                      no reparar). Ninguna de esas busquedas trajo contactos. No se bloquea "venta" ni "comprar"
//                      porque la gente tambien busca venta de refacciones, que si vende.
// SEGUROS:
//   - El presupuesto solo sube si en los ultimos 3 dias la campana perdio 10% o mas de busquedas por presupuesto.
//   - Si el presupuesto es compartido con otras campanas, no se toca.
//   - Si en una cuenta ya hubo un cambio HOY, esa cuenta no se toca (asi no se sube dos veces).
//   - No toca pujas, estrategias, anuncios ni pausa nada.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: regresa los presupuestos y quita las negativas.

var PCT = 20, MIN_PERDIDA = 0.10;
var CUENTAS = {
  '118-347-6484': { nombre: 'Gamesail', subir: 'AB \u00b7 Lavadoras para ropa y s\u00e1banas' },
  '860-582-6837': { nombre: 'Girbau', subir: 'AB \u00b7 Marca Girbau' },
  '993-525-8739': { nombre: 'Kingstar', subir: 'AB \u00b7 Lavander\u00eda hotelera e institucional' },
  '265-909-2662': { nombre: 'Laundry Solutions', negativas: {
    campanas: ['AB \u00b7 Servicio t\u00e9cnico industrial', 'AB \u00b7 Reparaci\u00f3n y mantenimiento'],
    palabras: [
      ['lavadoras industriales usadas', 'PHRASE'], ['lavadora industrial usada', 'PHRASE'],
      ['lorsa', 'BROAD'], ['mautra', 'BROAD'], ['sertec', 'BROAD'], ['servex', 'BROAD'], ['danube', 'BROAD'],
      ['precio de una lavadora', 'PHRASE'], ['costo de una lavadora', 'PHRASE'],
      ['lavadora industrial precio', 'PHRASE'], ['lavadoras industriales precio', 'PHRASE'], ['lavadoras industriales precios', 'PHRASE'],
      ['lavander\u00eda industrial precio', 'PHRASE'],
      ['lavadoras industriales para lavander\u00eda', 'EXACT'], ['equipos para lavander\u00eda', 'EXACT'],
      ['lavadoras profesionales para lavanderia', 'EXACT'], ['lavadora industrial para lavanderia', 'EXACT'],
      ['centro de lavado industrial', 'EXACT'], ['lavadora comercial', 'EXACT'], ['equipos de lavander\u00eda industrial', 'EXACT'],
      ['maquinas lavadoras de ropa industriales', 'EXACT'], ['lavadoras de uso industrial', 'EXACT'],
      ['lavadora y secadora industrial', 'EXACT'], ['cu\u00e1les son las lavadoras industriales', 'EXACT']
    ] } }
};
var DESHACER = [];

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function msg(r) { return r.getErrorMessages().join('; '); }
function q(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview(), salida = [];
  Logger.log('MIERCOLES 25' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var ids = Object.keys(CUENTAS);
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get();
    while (it.hasNext()) { var a = it.next(); AdsManagerApp.select(a); salida = salida.concat(unaCuenta(a.getCustomerId(), vista)); }
  } else {
    var cidG = AdsApp.currentAccount().getCustomerId();
    if (!CUENTAS[cidG]) { Logger.log('Esta cuenta no esta en la lista. Pegalo en la cuenta de administrador.'); return; }
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
      Logger.log('  ALTO: ya hubo un cambio HOY en ' + info.nombre + '. No se aplico nada (asi no se cambia dos veces). Avisame.');
      Logger.log(''); return [];
    }
    if (info.subir) out = out.concat(subir(cidG, info.subir, vista, tz));
    if (info.negativas) out = out.concat(negativas(cidG, info.negativas, vista));
  } catch (e) { Logger.log('  ERROR: ' + e.message + ' (no se cambio nada en esta cuenta)'); }
  Logger.log('');
  return out;
}

function subir(cidG, nombre, vista, tz) {
  var d = function (n) { return Utilities.formatDate(new Date(Date.now() - n * 86400000), tz, 'yyyy-MM-dd'); };
  var f = leer("SELECT campaign.name, campaign.status, campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared, " +
    "metrics.search_budget_lost_impression_share, metrics.clicks, metrics.conversions FROM campaign WHERE campaign.name = " + q(nombre) +
    " AND campaign.status = 'ENABLED' AND segments.date BETWEEN '" + d(3) + "' AND '" + d(1) + "'");
  if (!f.length) { Logger.log('  No encontre la campana activa "' + nombre + '". No se toca.'); return []; }
  var r = f[0], b = r.campaignBudget, perdida = Number(r.metrics.searchBudgetLostImpressionShare || 0);
  var antes = Number(b.amountMicros) / 1e6, nuevo = Math.round(antes * (1 + PCT / 100) * 100) / 100;
  Logger.log('  "' + nombre + '": presupuesto $' + antes.toFixed(2) + ' al dia; ultimos 3 dias: pierde ' + Math.round(perdida * 100) +
    '% de busquedas por presupuesto, ' + r.metrics.clicks + ' clics, ' + Number(r.metrics.conversions).toFixed(0) + ' contactos.');
  if (b.explicitlyShared) { Logger.log('  El presupuesto es compartido con otras campanas. No se toca.'); return []; }
  if (perdida < MIN_PERDIDA) { Logger.log('  Ya casi no se queda sin dinero (menos de 10%). No hace falta subirlo; se queda igual.'); return []; }
  var res = AdsApp.mutateAll([{ campaignBudgetOperation: { update: { resourceName: b.resourceName, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } }]);
  if (!res[0].isSuccessful()) { Logger.log('  ERROR al subir: ' + msg(res[0])); return []; }
  Logger.log('  ' + (vista ? 'se puede: ' : 'LISTO: ') + 'presupuesto $' + antes.toFixed(2) + ' -> $' + nuevo.toFixed(2) + ' (+' + PCT + '%)');
  return vista ? [] : ["{c: '" + cidG + "', presupuesto: '" + b.resourceName + "', monto: " + antes.toFixed(2) + "}"];
}

function negativas(cidG, cfg, vista) {
  var camps = leer("SELECT campaign.resource_name, campaign.name, campaign.status FROM campaign WHERE campaign.status = 'ENABLED'")
    .filter(function (r) { return cfg.campanas.indexOf(r.campaign.name) >= 0; });
  if (!camps.length) { Logger.log('  No encontre las campanas. No se toca.'); return []; }
  var ya = {};
  leer("SELECT campaign.resource_name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type, campaign_criterion.negative, campaign_criterion.type " +
    "FROM campaign_criterion WHERE campaign_criterion.type = 'KEYWORD' AND campaign_criterion.negative = TRUE").forEach(function (r) {
      ya[r.campaign.resourceName + '|' + String(r.campaignCriterion.keyword.text).toLowerCase() + '|' + r.campaignCriterion.keyword.matchType] = 1;
    });
  var ops = [], txt = [];
  camps.forEach(function (c) {
    cfg.palabras.forEach(function (p) {
      if (ya[c.campaign.resourceName + '|' + p[0].toLowerCase() + '|' + p[1]]) return;
      ops.push({ campaignCriterionOperation: { create: { campaign: c.campaign.resourceName, negative: true, keyword: { text: p[0], matchType: p[1] } } } });
      txt.push(c.campaign.name + ': negativa "' + p[0] + '" (' + (p[1] === 'BROAD' ? 'contiene la palabra' : p[1] === 'PHRASE' ? 'contiene la frase' : 'exacta') + ')');
    });
  });
  if (!ops.length) { Logger.log('  Ya estaban todas. Nada que agregar.'); return []; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), creadas = [], bien = 0;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) { bien++; if (!vista) creadas.push("'" + r.getResourceName() + "'"); }
    else Logger.log('  ERROR ' + txt[i] + ': ' + msg(r));
  });
  Logger.log('  ' + (vista ? 'se puede agregar ' : 'LISTO: agregadas ') + bien + ' palabras negativas en ' + camps.length + ' campanas:');
  cfg.palabras.forEach(function (p) { Logger.log('    - ' + p[0] + ' (' + (p[1] === 'BROAD' ? 'contiene la palabra' : p[1] === 'PHRASE' ? 'contiene la frase' : 'exacta') + ')'); });
  return vista || !creadas.length ? [] : ["{c: '" + cidG + "', quitar: [" + creadas.join(', ') + "]}"];
}

function deshacer(cidG, vista) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.c !== cidG) return;
    if (d.presupuesto) { ops.push({ campaignBudgetOperation: { update: { resourceName: d.presupuesto, amountMicros: Math.round(d.monto * 1e6) }, updateMask: 'amountMicros' } }); txt.push('regresar el presupuesto a $' + d.monto); }
    (d.quitar || []).forEach(function (rn) { ops.push({ campaignCriterionOperation: { remove: rn } }); txt.push('quitar negativa'); });
  });
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return; }
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + txt[i] + (r.isSuccessful() ? '' : ': ' + msg(r)));
  });
}
