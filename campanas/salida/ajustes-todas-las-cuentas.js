/**
 * Atelback · Ajustes de presupuesto — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py (campo «ajustes» de cada cuenta). No se edita a mano.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): pausa las campañas anteriores
 * que indica el plan y pone a las campañas nuevas «AB ·» el presupuesto diario que indica el plan. Pausar se puede
 * deshacer en cualquier momento y conserva el historial. No toca anuncios, palabras clave, topes ni páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (dice cuánto se gastaría) > EJECUTAR.
 */

var PLANES = [{"cuenta": "", "nombre": "Gamesail", "prefijo": "AB · ", "ajustes": {}}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "prefijo": "AB · ", "ajustes": {"pausar": ["Campaña Modelo de Negocio"], "presupuesto": {"Equipo para lavandería": 119, "Emprendimiento": 74}}}, {"cuenta": "993-525-8739", "nombre": "CLM", "prefijo": "AB · ", "ajustes": {}}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "ajustes": {}}, {"cuenta": "860-582-6837", "nombre": "Girbau", "prefijo": "AB · ", "ajustes": {}}];
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
  Logger.log('AJUSTES DE PRESUPUESTO · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var aj = PLAN.ajustes || {};
  var pausar = aj.pausar || [], presupuesto = aj.presupuesto || {};
  if (!pausar.length && !Object.keys(presupuesto).length) { Logger.log('Nada que ajustar en esta cuenta por ahora.'); return; }

  var C = {};
  filas('SELECT campaign.resource_name, campaign.name, campaign.status, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { rn: f.campaign.resourceName, presupuesto: f.campaignBudget.resourceName,
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
