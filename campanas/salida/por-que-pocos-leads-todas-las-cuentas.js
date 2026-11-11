/**
 * Atelback · ¿Por qué están llegando pocos leads? — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   1. DÍA POR DÍA (últimos 14 días y hoy hasta ahora): clics, gasto y contactos reales por el día en que LLEGARON
 *      (no por el día del clic), para compararlo con la hoja de los vendedores.
 *   2. HOY hasta esta hora contra el promedio de los 7 días anteriores hasta la misma hora.
 *   3. LO QUE FRENA ANUNCIOS: campañas encendidas que no salen o salen limitadas, estrategia de puja en aprendizaje,
 *      grupos sin ningún anuncio aprobado, y el saldo aprobado de la cuenta.
 *   4. QUÉ CUENTA GOOGLE COMO CONTACTO HOY: metas que cuentan, acciones principales y cuántos contactos dio cada una en 7 días.
 *   5. QUÉ CAMBIÓ en los últimos 3 días y quién lo cambió (nosotros, Google o alguien más).
 *   6. Un renglón final «POCOS ·».
 * Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps).
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var DIAS = 14;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var SEMANA = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];

function filas(q, que, callado) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { if (callado) return null; Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function m(x) { return (Number(x) || 0) / 1e6; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}
function quien(email, cliente) {
  var e = String(email || '').toLowerCase();
  if (/gamesailmx/.test(e)) return 'nosotros (gamesailmx)';
  if (/RECOMMENDATION|INTERNAL_TOOL|OTHER/.test(cliente || '') && !e) return 'Google (' + cliente + ')';
  if (!e) return 'sistema (' + (cliente || '?') + ')';
  return 'OTRA PERSONA (' + e.substr(0, 3) + '…, ' + (cliente || '?') + ')';
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  function dia(ms) { return Utilities.formatDate(new Date(ms), tz, 'yyyy-MM-dd'); }
  var ahora = Date.now(), hoy = dia(ahora), desde = dia(ahora - DIAS * 864e5), hace7 = dia(ahora - 7 * 864e5), hace3 = dia(ahora - 3 * 864e5);
  var hora = Number(Utilities.formatDate(new Date(ahora), tz, 'H'));
  var avisos = [];
  Logger.log('¿POR QUÉ POCOS LEADS? · ' + marca + ' · hoy ' + hoy + ' a las ' + hora + ':00 · solo lee');
  Logger.log('Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps).');
  Logger.log('');

  var tipos = {}, principal = {};
  filas("SELECT conversion_action.name, conversion_action.type, conversion_action.status, conversion_action.primary_for_goal FROM conversion_action " +
    "WHERE conversion_action.status = 'ENABLED'", 'las acciones').forEach(function (f) {
      var a = f.conversionAction; tipos[a.name] = a.type; principal[a.name] = a.primaryForGoal;
    });

  // ---------- 1. Día por día ----------
  var D = {};
  function d(k) { return D[k] = D[k] || { clics: 0, gasto: 0, imp: 0, cont: 0 }; }
  filas("SELECT segments.date, metrics.clicks, metrics.cost_micros, metrics.impressions FROM customer WHERE segments.date BETWEEN '" + desde + "' AND '" + hoy + "'",
    'los clics por día').forEach(function (f) { var x = d(f.segments.date); x.clics += Number(f.metrics.clicks) || 0; x.gasto += m(f.metrics.costMicros); x.imp += Number(f.metrics.impressions) || 0; });
  var porAccion7 = {};
  var cont = filas("SELECT segments.date, segments.conversion_action_name, metrics.all_conversions_by_conversion_date FROM customer WHERE segments.date BETWEEN '" +
    desde + "' AND '" + hoy + "'", '', true);
  var porLlegada = !!cont;
  if (!cont) cont = filas("SELECT segments.date, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE segments.date BETWEEN '" +
    desde + "' AND '" + hoy + "'", 'los contactos por día');
  cont.forEach(function (f) {
    var a = f.segments.conversionActionName, c = Number(porLlegada ? f.metrics.allConversionsByConversionDate : f.metrics.allConversions) || 0;
    if (!c) return;
    if (f.segments.date >= hace7 && f.segments.date < hoy) porAccion7[a] = (porAccion7[a] || 0) + c;
    if (esReal(a, tipos[a])) d(f.segments.date).cont += c;
  });
  Logger.log('==== 1. DÍA POR DÍA (contactos por el día en que ' + (porLlegada ? 'LLEGARON' : 'fue el clic') + ') ====');
  Logger.log('día · clics · gasto · contactos · costo por contacto');
  var dias = Object.keys(D).sort(), prev = [], ayer = dia(ahora - 864e5);
  dias.forEach(function (k) {
    var x = D[k], w = SEMANA[new Date(k + 'T12:00:00Z').getUTCDay()];
    Logger.log(w + ' ' + k.substr(5) + ' · ' + x.clics + ' clics · ' + pesos(x.gasto) + ' · ' + n(x.cont) + ' contactos · ' +
      (x.cont >= 0.5 ? pesos(x.gasto / x.cont) : '—') + (k === hoy ? '  ← HOY, hasta ahora' : ''));
    if (k < ayer && k >= dia(ahora - 8 * 864e5)) prev.push(x);
  });
  var prom = function (campo) { return prev.length ? prev.reduce(function (s, x) { return s + x[campo]; }, 0) / prev.length : 0; };
  var Y = D[ayer] || { clics: 0, gasto: 0, cont: 0 };
  Logger.log('Ayer: ' + n(Y.cont) + ' contactos y ' + Y.clics + ' clics · promedio de los 7 días antes: ' + n(prom('cont')) + ' contactos y ' + n(prom('clics')) + ' clics');
  if (prom('cont') >= 1 && Y.cont < prom('cont') * 0.6) avisos.push('ayer ' + n(Y.cont) + ' contactos contra ' + n(prom('cont')) + ' de promedio');
  if (prom('clics') >= 10 && Y.clics < prom('clics') * 0.6) avisos.push('ayer ' + Y.clics + ' clics contra ' + n(prom('clics')) + ' de promedio (salen menos anuncios)');
  Logger.log('');

  // ---------- 2. Hoy hasta esta hora ----------
  var H = { hoy: { clics: 0, cont: 0 }, antes: { clics: 0, cont: 0 } };
  filas("SELECT segments.date, segments.hour, metrics.clicks FROM customer WHERE segments.date BETWEEN '" + hace7 + "' AND '" + hoy + "'", 'los clics por hora')
    .forEach(function (f) { if (Number(f.segments.hour) >= hora) return; (f.segments.date === hoy ? H.hoy : H.antes).clics += Number(f.metrics.clicks) || 0; });
  filas("SELECT segments.date, segments.hour, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE segments.date BETWEEN '" + hace7 + "' AND '" + hoy + "'",
    'los contactos por hora').forEach(function (f) {
      var a = f.segments.conversionActionName;
      if (Number(f.segments.hour) >= hora || !esReal(a, tipos[a])) return;
      (f.segments.date === hoy ? H.hoy : H.antes).cont += Number(f.metrics.allConversions) || 0;
    });
  Logger.log('==== 2. HOY HASTA LAS ' + hora + ':00 CONTRA EL PROMEDIO DE LOS 7 DÍAS ANTERIORES A LA MISMA HORA ====');
  Logger.log('Hoy: ' + H.hoy.clics + ' clics · ' + n(H.hoy.cont) + ' contactos · promedio: ' + n(H.antes.clics / 7) + ' clics · ' + n(H.antes.cont / 7) + ' contactos');
  Logger.log('(Google tarda hasta 3 horas en mostrar algunos clics y contactos: la última hora casi siempre sale incompleta.)');
  Logger.log('');

  // ---------- 3. Lo que frena anuncios ----------
  Logger.log('==== 3. LO QUE PUEDE ESTAR FRENANDO LOS ANUNCIOS ====');
  var nombre = {}, problemas = 0;
  filas("SELECT campaign.resource_name, campaign.name, campaign.primary_status, campaign.primary_status_reasons, campaign.bidding_strategy_type, " +
    "campaign.bidding_strategy_system_status, campaign_budget.amount_micros FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas')
    .forEach(function (f) {
      var c = f.campaign; nombre[c.resourceName] = c.name;
      var st = c.primaryStatus, rz = (c.primaryStatusReasons || []).join(', '), bs = c.biddingStrategySystemStatus || '';
      var mal = st && st !== 'ELIGIBLE' && !(st === 'LIMITED' && /^BUDGET_CONSTRAINED$/.test(rz));   // limitada solo por presupuesto: normal, no frena
      var aprende = /LEARNING/.test(bs), limitada = /LIMITED|MISCONFIGURED|NO_CONVERSIONS|NOT_ENOUGH/.test(bs) && !/^ENABLED$/.test(bs);
      Logger.log((mal || limitada ? '⚠️ ' : '✔ ') + '«' + c.name + '» · ' + pesos(m(f.campaignBudget.amountMicros)) + '/día · estado: ' + (st || '?') +
        (rz ? ' (' + rz + ')' : '') + ' · puja: ' + c.biddingStrategyType + (bs ? ' · ' + bs : '') + (aprende ? '  ← APRENDIENDO' : ''));
      if (mal) { problemas++; avisos.push('«' + c.name + '» ' + st + (rz ? ' (' + rz + ')' : '')); }
      if (aprende) avisos.push('«' + c.name + '» está aprendiendo (' + bs + ')');
      if (limitada) avisos.push('«' + c.name + '» puja limitada (' + bs + ')');
    });
  var G = {};
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status FROM ad_group_ad " +
    "WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND ad_group_ad.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
      var k = f.campaign.name + ' › ' + f.adGroup.name, g = G[k] = G[k] || { ok: 0, no: 0, rev: 0 }, p = f.adGroupAd.policySummary || {};
      if (p.approvalStatus === 'DISAPPROVED') g.no++;
      else if (p.reviewStatus === 'REVIEW_IN_PROGRESS' || p.reviewStatus === 'UNDER_APPEAL') g.rev++;
      else g.ok++;
    });
  var sinAnuncio = Object.keys(G).filter(function (k) { return !G[k].ok; });
  var rech = Object.keys(G).reduce(function (s, k) { return s + G[k].no; }, 0);
  sinAnuncio.forEach(function (k) { Logger.log('⚠️ GRUPO SIN ANUNCIO APROBADO: ' + k + ' · rechazados ' + G[k].no + ' · en revisión ' + G[k].rev); });
  if (sinAnuncio.length) avisos.push(sinAnuncio.length + ' grupos sin ningún anuncio aprobado');
  Logger.log('Anuncios rechazados en campañas encendidas: ' + rech + ' · grupos sin ningún anuncio aprobado: ' + sinAnuncio.length);
  var gasto7 = prom('gasto') || 1;
  filas("SELECT account_budget.status, account_budget.approved_spending_limit_micros, account_budget.approved_spending_limit_type, " +
    "account_budget.amount_served_micros FROM account_budget WHERE account_budget.status = 'APPROVED'", 'el saldo de la cuenta').forEach(function (f) {
      var b = f.accountBudget;
      if (b.approvedSpendingLimitType === 'INFINITE' || !b.approvedSpendingLimitMicros) { Logger.log('Saldo de la cuenta: sin límite'); return; }
      var queda = m(b.approvedSpendingLimitMicros) - m(b.amountServedMicros);
      Logger.log((queda < gasto7 * 5 ? '⚠️ ' : '✔ ') + 'Saldo aprobado de la cuenta: quedan ' + pesos(queda) + ' (~' + Math.floor(queda / gasto7) + ' días al ritmo de la semana)');
      if (queda < gasto7 * 5) avisos.push('el saldo aprobado de la cuenta se acaba en ~' + Math.floor(queda / gasto7) + ' días');
    });
  Logger.log('');

  // ---------- 4. Qué cuenta Google ----------
  Logger.log('==== 4. QUÉ CUENTA GOOGLE COMO CONTACTO HOY ====');
  filas("SELECT customer_conversion_goal.category, customer_conversion_goal.origin, customer_conversion_goal.biddable FROM customer_conversion_goal",
    'las metas').forEach(function (f) {
      var g = f.customerConversionGoal;
      if (g.biddable) Logger.log('Meta que cuenta: ' + g.category + ' · ' + g.origin);
    });
  Object.keys(tipos).sort(function (a, b) { return (porAccion7[b] || 0) - (porAccion7[a] || 0); }).forEach(function (a) {
    if (!principal[a] && !porAccion7[a]) return;
    Logger.log((principal[a] ? 'PRINCIPAL  ' : 'secundaria ') + '«' + a + '» · ' + n(porAccion7[a]) + ' en 7 días' + (esReal(a, tipos[a]) ? '' : ' (no cuenta como contacto real)'));
  });
  Logger.log('');

  // ---------- 5. Qué cambió ----------
  Logger.log('==== 5. QUÉ CAMBIÓ DEL ' + hace3 + ' A HOY ====');
  var cambios = filas("SELECT change_event.change_date_time, change_event.change_resource_type, change_event.client_type, change_event.user_email, " +
    "change_event.resource_change_operation, change_event.changed_fields, change_event.campaign FROM change_event WHERE change_event.change_date_time >= '" +
    hace3 + " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' ORDER BY change_event.change_date_time DESC LIMIT 150", 'el historial de cambios');
  var otros = 0;
  cambios.forEach(function (f) {
    var c = f.changeEvent, q = quien(c.userEmail, c.clientType);
    if (/OTRA PERSONA|Google/.test(q)) otros++;
    Logger.log(String(c.changeDateTime).substr(0, 16) + ' · ' + q + ' · ' + c.resourceChangeOperation + ' ' + c.changeResourceType +
      (c.campaign && nombre[c.campaign] ? ' · «' + nombre[c.campaign] + '»' : '') + (c.changedFields ? ' · ' + c.changedFields : ''));
  });
  if (!cambios.length) Logger.log('Sin cambios en esos días.');
  if (otros) avisos.push(otros + ' cambios hechos por otra persona o por Google en 3 días');
  Logger.log('');

  Logger.log('POCOS · ' + marca + ' · ayer ' + n(Y.cont) + ' contactos (prom. ' + n(prom('cont')) + ') · hoy hasta las ' + hora + ':00: ' + n(H.hoy.cont) +
    ' (prom. ' + n(H.antes.cont / 7) + ') · clics hoy ' + H.hoy.clics + ' (prom. ' + n(H.antes.clics / 7) + ') · ' +
    (avisos.length ? 'AVISOS: ' + avisos.join(' | ') : 'sin avisos'));
  Logger.log('LISTO. Copia TODO el registro y mándalo. Este script no cambió nada.');
}
