/**
 * Atelback · Gamesail (118-347-6484): subir presupuesto POR PASOS, solo donde está dando frutos
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py).
 *
 * IDEA: en Gamesail las campañas que traen contactos baratos se quedan sin presupuesto a media tarde
 * («Por capacidad» $66 por contacto y pierde 52% de las búsquedas por presupuesto; «Competencia» $68, pierde 39%;
 * «Para ropa» $156, pierde 53%). Mientras tanto, Hoteles, Mangles y Marca no alcanzan a gastar lo suyo.
 * Este script sube SOLO a las que dan frutos, y lo hace de a poco para no reiniciar el aprendizaje de Google.
 *
 * REGLAS DE CADA CORRIDA (se corre cada 3–4 días, siempre con Vista previa primero):
 *   - Una campaña sube como máximo 30% por corrida, y nunca arriba de su META.
 *   - Solo sube si en los últimos 7 días: trajo al menos 2 contactos reales, su costo por contacto está en o abajo
 *     de su LÍMITE, y sigue perdiendo al menos 10% de las búsquedas por falta de presupuesto (si no pierde, más
 *     dinero no le sirve).
 *   - «Secadoras» (0 contactos con $643): baja como máximo 20% por corrida hasta su META, mientras no traiga contactos.
 *   - Si el presupuesto de una campaña ya cambió HOY, no la toca (candado).
 *   - Muestra cuánto queda del saldo aprobado de la cuenta y para cuántos días alcanza.
 * Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps).
 *
 * METAS (las de Gamesail en el plan de $20,000 al mes): Por capacidad $220 · Para ropa $248 · Competencia $60 ·
 * Secadoras $40. Las demás campañas no se tocan.
 *
 * QUÉ HACE:
 *   - VISTA PREVIA: muestra cada campaña con sus números de 7 días, su presupuesto de hoy y el que tendría. No cambia nada.
 *   - EJECUTAR (solo con el OK): pone esos presupuestos. No pausa, no enciende ni toca anuncios, palabras, pujas ni páginas.
 *
 * CÓMO SE USA: en Gamesail > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var CUENTA = '118-347-6484';
var SUBE_MAX = 0.30;      // +30% por corrida
var BAJA_MAX = 0.20;      // −20% por corrida
var PLAN = [
  { nombre: 'AB · Lavadoras por capacidad y precio', meta: 220, limite: 150 },
  { nombre: 'AB · Lavadoras para ropa y sábanas', meta: 248, limite: 250 },
  { nombre: 'AB · Competencia depurada', meta: 60, limite: 150 },
  { nombre: 'AB · Secadoras industriales', meta: 40, baja: true }
];

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
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

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  if (cid !== CUENTA) throw new Error('Este script es solo para Gamesail (' + CUENTA + '). Esta cuenta es ' + cid + '. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  Logger.log('GAMESAIL · SUBIR POR PASOS · ' + hoy + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  var C = {};
  filas("SELECT campaign.name, campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign " +
    "WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
      C[f.campaign.name] = { presupuesto: f.campaignBudget.resourceName, monto: m(f.campaignBudget.amountMicros),
        compartido: f.campaignBudget.explicitlyShared, gasto: 0, clics: 0, perdido: 0, cont: 0 };
    });
  filas("SELECT campaign.name, metrics.cost_micros, metrics.clicks, metrics.search_budget_lost_impression_share FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND segments.date DURING LAST_7_DAYS", 'los números de 7 días').forEach(function (f) {
      var c = C[f.campaign.name]; if (!c) return;
      c.gasto = m(f.metrics.costMicros); c.clics = Number(f.metrics.clicks) || 0; c.perdido = Number(f.metrics.searchBudgetLostImpressionShare) || 0;
    });
  filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND segments.date DURING LAST_7_DAYS", 'los contactos').forEach(function (f) {
      var a = f.segments.conversionActionName, c = C[f.campaign.name];
      if (c && esReal(a, tipos[a])) c.cont += Number(f.metrics.allConversions) || 0;
    });
  var movidoHoy = {};
  filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy + " 00:00:00' AND " +
    "change_event.change_date_time <= '" + hoy + " 23:59:59' AND change_event.change_resource_type = 'CAMPAIGN_BUDGET' LIMIT 2000",
    'los cambios de hoy').forEach(function (f) { movidoHoy[f.changeEvent.changeResourceName] = true; });

  var antes = 0, gasto7 = 0;
  Object.keys(C).forEach(function (k) { antes += C[k].monto; gasto7 += C[k].gasto; });
  var despues = antes, ops = [], textos = [];

  PLAN.forEach(function (p) {
    var c = C[p.nombre];
    if (!c) { Logger.log('AVISO: no encontré «' + p.nombre + '» encendida. No se toca.'); return; }
    var cpa = c.cont ? c.gasto / c.cont : 0;
    Logger.log('«' + p.nombre + '» · 7 días: ' + pesos(c.gasto) + ', ' + c.clics + ' clics, ' + n(c.cont) + ' contactos' +
      (c.cont ? ' (' + pesos(cpa) + ' c/u)' : '') + ', pierde ' + Math.round(c.perdido * 100) + '% por presupuesto');
    var nuevo = c.monto, porque = '';
    if (p.baja) {
      if (c.cont >= 1) porque = 'ya trae contactos: no baja';
      else if (c.monto <= p.meta + 0.5) porque = 'ya está en su meta';
      else { nuevo = Math.max(p.meta, Math.round(c.monto * (1 - BAJA_MAX))); porque = '0 contactos en 7 días'; }
    } else if (c.monto >= p.meta - 0.5) porque = 'ya está en su meta (' + pesos(p.meta) + ')';
    else if (c.cont < 2) porque = 'menos de 2 contactos en 7 días: no sube';
    else if (cpa > p.limite) porque = 'costo por contacto arriba de ' + pesos(p.limite) + ': no sube';
    else if (c.perdido < 0.10) porque = 'casi no pierde búsquedas por presupuesto: más dinero no le sirve';
    else { nuevo = Math.min(p.meta, Math.round(c.monto * (1 + SUBE_MAX))); porque = 'da frutos y se queda sin presupuesto'; }

    if (Math.abs(nuevo - c.monto) < 0.5) { Logger.log('   se queda en ' + pesos(c.monto) + ' al día · ' + porque); return; }
    if (c.compartido) { Logger.log('   AVISO: presupuesto compartido, no se toca'); return; }
    if (movidoHoy[c.presupuesto]) { Logger.log('   YA SE MOVIÓ HOY: no se toca hasta mañana'); return; }
    Logger.log('   ' + (nuevo > c.monto ? 'SUBE' : 'BAJA') + ' ' + pesos(c.monto) + ' → ' + pesos(nuevo) + ' al día · ' + porque +
      (nuevo < p.meta && !p.baja ? ' · meta ' + pesos(p.meta) + ' (siguiente paso en 3–4 días)' : ''));
    ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
    textos.push(p.nombre + ' a ' + pesos(nuevo));
    despues += nuevo - c.monto;
  });

  Logger.log('');
  Logger.log('Suma diaria de la cuenta: ' + pesos(antes) + ' → ' + pesos(despues) + ' · al mes, como máximo ' + pesos(despues * 30.4));
  filas("SELECT account_budget.approved_spending_limit_micros, account_budget.approved_spending_limit_type, account_budget.amount_served_micros " +
    "FROM account_budget WHERE account_budget.status = 'APPROVED'", 'el saldo de la cuenta').forEach(function (f) {
      var b = f.accountBudget;
      if (b.approvedSpendingLimitType === 'INFINITE' || !b.approvedSpendingLimitMicros) { Logger.log('Saldo aprobado de la cuenta: sin límite'); return; }
      var queda = m(b.approvedSpendingLimitMicros) - m(b.amountServedMicros), ritmo = Math.max(gasto7 / 7, despues * 0.8);
      Logger.log((queda < ritmo * 10 ? '⚠️ ' : '✔ ') + 'Saldo aprobado de la cuenta: quedan ' + pesos(queda) + ' (~' + Math.floor(queda / ritmo) + ' días con el presupuesto nuevo)');
    });

  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ ' + textos[i]);
    });
  }
  Logger.log('');
  Logger.log('GAMESAIL · ' + (vista ? 'vista previa' : 'ejecutado') + ' · cambios: ' + ops.length + ' · con error: ' + malos +
    ' · diario ' + pesos(antes) + ' → ' + pesos(despues));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
