/**
 * Atelback · Bajar el costo por clic — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py (campo «bajar_cpc» de cada cuenta). No se edita a mano.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está):
 *   1. Pausa las campañas anteriores que indica el plan y deja a la mitad el presupuesto de las que indica «mitad».
 *   2. Pasa ese dinero diario a la campaña nueva que indica el plan (la de costo por clic más bajo), sin pasar el tope
 *      mensual de la cuenta.
 *   3. Baja el tope de costo por clic de las campañas nuevas que indica el plan (solo baja, nunca sube).
 * Pausar se puede deshacer en cualquier momento y conserva el historial. No toca anuncios, palabras clave ni páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "telefono": "33 1185 9797", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}], "bajar": {}}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y Autoservicio)", "telefono": "33 2601 2237", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}], "bajar": {"pausar": ["Campaña Modelo de Negocio"], "mitad": ["Campaña Search Marcas"], "pasar_a": "Equipo para lavandería"}}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Alta capacidad)", "telefono": "33 1564 1538", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}], "bajar": {"topes": {"Lavandería hotelera e institucional": 18, "Lavadoras y secadoras de 20 a 45 kg": 15}}}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "telefono": "33 1417 2994", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}], "bajar": {}}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); hoy sube el tope por clic en el paso 3", "telefono": "33 2806 8994", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}], "bajar": {}}];
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
function pesos2(x) { return '$' + x.toFixed(2); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('BAJAR EL COSTO POR CLIC · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var b = PLAN.bajar || {};
  var pausar = b.pausar || [], mitad = b.mitad || [], topes = b.topes || {};
  if (b.porque) Logger.log(b.porque);
  if (!pausar.length && !mitad.length && !Object.keys(topes).length) { Logger.log('Nada que cambiar en esta cuenta.'); return; }

  var C = {};
  filas('SELECT campaign.resource_name, campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    "campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'",
    'las campañas').forEach(function (f) {
    C[f.campaign.name] = { rn: f.campaign.resourceName, presupuesto: f.campaignBudget.resourceName, puja: f.campaign.biddingStrategyType,
      tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6,
      monto: Number(f.campaignBudget.amountMicros || 0) / 1e6, compartido: f.campaignBudget.explicitlyShared };
  });
  // Costo por clic de los últimos 7 días, para que el registro muestre de dónde sale el ahorro.
  var K = {};
  filas('SELECT campaign.name, metrics.clicks, metrics.cost_micros FROM campaign WHERE segments.date DURING LAST_7_DAYS', 'los clics').forEach(function (f) {
    var k = K[f.campaign.name] = K[f.campaign.name] || { clics: 0, costo: 0 };
    k.clics += Number(f.metrics.clicks || 0); k.costo += Number(f.metrics.costMicros || 0) / 1e6;
  });
  function cpc(n) { var k = K[n]; return k && k.clics ? pesos2(k.costo / k.clics) + ' por clic en 7 días' : 'sin clics en 7 días'; }

  var antes = 0;
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });
  var ops = [], donde = [], que = [], libre = 0;

  pausar.forEach(function (n) {
    var c = C[n];
    if (!c) { que.push('«' + n + '»: no está encendida (ya en pausa o con otro nombre). Se salta.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, status: 'PAUSED' }, updateMask: 'status' } });
    donde.push('pausa de «' + n + '»');
    que.push('PAUSAR «' + n + '» (' + cpc(n) + '; gastaba hasta ' + dinero(c.monto) + ' al día)');
    libre += c.monto;
  });
  mitad.forEach(function (n) {
    var c = C[n];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.compartido) { que.push('AVISO «' + n + '»: su presupuesto es compartido; bájalo a mano a ' + dinero(c.monto / 2) + ' al día.'); return; }
    var nuevo = Math.round(c.monto / 2);
    ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
    donde.push('presupuesto de «' + n + '»');
    que.push('A LA MITAD «' + n + '» (' + cpc(n) + '): ' + dinero(c.monto) + ' → ' + dinero(nuevo) + ' al día');
    libre += c.monto - nuevo;
  });

  var despues = antes - libre;
  if (b.pasar_a && libre > 0) {
    var n = PLAN.prefijo + b.pasar_a, c = C[n];
    var cabe = Math.max(0, PLAN.mensual / DIAS_MES - despues), suma = Math.min(libre, cabe);
    if (!c) que.push('«' + n + '»: no está encendida; el dinero liberado no se pasa a ninguna campaña.');
    else if (c.compartido) que.push('AVISO «' + n + '»: su presupuesto es compartido; súbelo a mano ' + dinero(suma) + ' al día.');
    else if (suma >= 1) {
      var nuevo = Math.round(c.monto + suma);
      ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
      donde.push('presupuesto de «' + n + '»');
      que.push('PASAR EL DINERO a «' + n + '» (' + cpc(n) + '): ' + dinero(c.monto) + ' → ' + dinero(nuevo) + ' al día');
      despues += nuevo - c.monto;
    }
  }

  Object.keys(topes).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevoTope = topes[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja !== 'TARGET_SPEND') { que.push('AVISO «' + n + '»: no puja por clics con tope (' + c.puja + '). Se salta.'); return; }
    if (c.tope && c.tope <= nuevoTope) { que.push('«' + n + '»: su tope ya es $' + c.tope + ' o menos.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(nuevoTope * 1e6) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    donde.push('tope CPC de «' + n + '»');
    que.push('BAJAR TOPE CPC «' + n + '» (' + cpc(n) + '): $' + (c.tope || 'sin tope') + ' → $' + nuevoTope +
      ' (cada clic cuesta menos; puede entrar a menos subastas)');
  });

  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  que.forEach(function (t) { Logger.log(t); });
  Logger.log('');
  Logger.log('Presupuesto diario de todas las campañas encendidas: ' + dinero(antes) + ' → ' + dinero(despues) +
    ' (al mes, hasta ' + dinero(antes * DIAS_MES) + ' → ' + dinero(despues * DIAS_MES) + '; tope de la cuenta ' + dinero(PLAN.mensual) + ').');
  if (!ops.length) { Logger.log('Nada que cambiar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '. Para deshacer una pausa, actívala de nuevo en Campañas.');
  }
}
