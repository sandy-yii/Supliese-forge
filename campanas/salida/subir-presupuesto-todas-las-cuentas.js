/**
 * Atelback · Subir presupuesto a lo que funciona — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está), con los últimos 3 días completos:
 *   1. Sube 20% el presupuesto de las campañas nuevas «AB ·» que se quedan sin dinero (pierden 20% o más de sus
 *      impresiones por presupuesto), traen clics y pagan por clic lo del plan o menos. Las que siguen aprendiendo no suben.
 *   2. Solo si hace falta espacio para subir, baja el presupuesto de las campañas nuevas que casi no lo usan (gastan
 *      menos del 30%), hasta 1.5 veces lo que sí gastan y sin bajar de $10 al día. Ese dinero no se estaba usando.
 *   3. Nunca pasa el tope mensual de la cuenta: la suma de presupuestos diarios de todas las campañas encendidas,
 *      por 30.4 días, queda igual o por debajo del presupuesto mensual del plan.
 * No toca campañas anteriores, anuncios, palabras clave, topes de CPC ni páginas.
 *
 * CÓMO SE USA: cada 2 o 3 días, pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y Autoservicio)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": true, "subir_porque": "", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); hoy sube el tope por clic con «ajustes»", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS_MES = 30.4;
var DIAS = 3;              // días completos que se revisan
var SUBE = 0.20;           // cuánto sube cada vez
var PIERDE_MIN = 0.20;     // pérdida por presupuesto a partir de la cual sube
var CLICS_MIN = 5;         // clics mínimos en esos días para considerar que funciona
var USA_MIN = 0.30;        // por debajo de este uso del presupuesto, se le baja
var PISO = 10;             // presupuesto diario mínimo de una campaña nueva

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
function num(x) { return Number(x || 0); }
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }
function pct(x) { return Math.round(x * 100) + '%'; }
function mas(t, dias) { var p = t.split('-'); var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().substring(0, 10); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  if (PLAN.subir === false) { Logger.log('SUBIR PRESUPUESTO · ' + PLAN.nombre + ' · hoy no toca en esta cuenta: ' + PLAN.subir_porque + '. No se hizo nada.'); return; }
  var hoy = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  var desde = mas(hoy, -DIAS), hasta = mas(hoy, -1);
  var tope = PLAN.mensual / DIAS_MES;
  Logger.log('SUBIR PRESUPUESTO · ' + PLAN.nombre + ' · días ' + desde + ' a ' + hasta + ' · tope ' + dinero(PLAN.mensual) + ' al mes (' +
    dinero(tope) + ' al día)' + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var planDe = {};
  PLAN.campanas.forEach(function (k) { planDe[k.nombre] = k; });

  var C = {};
  filas('SELECT campaign.name, campaign.primary_status_reasons, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { nueva: esNueva(f.campaign.name), aprende: (f.campaign.primaryStatusReasons || []).indexOf('BIDDING_STRATEGY_LEARNING') >= 0,
      rn: f.campaignBudget.resourceName, monto: num(f.campaignBudget.amountMicros) / 1e6, compartido: f.campaignBudget.explicitlyShared,
      costo: 0, clics: 0, pierde: null };
  });
  filas('SELECT campaign.name, metrics.cost_micros, metrics.clicks, metrics.search_budget_lost_impression_share FROM campaign ' +
    "WHERE segments.date BETWEEN '" + desde + "' AND '" + hasta + "' AND campaign.status = 'ENABLED'", 'los números').forEach(function (f) {
    var c = C[f.campaign.name], m = f.metrics || {};
    if (!c) return;
    c.costo = num(m.costMicros) / 1e6; c.clics = num(m.clicks);
    if (m.searchBudgetLostImpressionShare !== undefined) c.pierde = num(m.searchBudgetLostImpressionShare);
  });

  var antes = 0;
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });
  var nuevo = {}, que = [], nota = [];

  // Campañas nuevas que casi no usan su presupuesto: de ahí sale el espacio si hace falta
  var donantes = Object.keys(C).filter(function (n) {
    var c = C[n];
    if (!c.nueva || c.compartido || !c.monto) return false;
    return c.costo / (c.monto * DIAS) < USA_MIN && Math.max(PISO, Math.ceil(c.costo / DIAS * 1.5)) < c.monto;
  }).sort(function (a, b) { return (C[b].monto - C[b].costo / DIAS) - (C[a].monto - C[a].costo / DIAS); });

  // 1. Candidatas a subir, de la más barata por clic contra su plan a la más cara
  var sube = Object.keys(C).filter(function (n) {
    var c = C[n], k = planDe[n];
    if (!c.nueva) return false;
    var porClic = c.clics ? c.costo / c.clics : 0;
    if (c.pierde === null || c.pierde < PIERDE_MIN) return false;
    if (c.compartido) { nota.push('«' + n + '»: su presupuesto es compartido; súbelo a mano si quieres.'); return false; }
    if (c.aprende) { nota.push('«' + n + '» pierde ' + pct(c.pierde) + ' por presupuesto, pero sigue aprendiendo: sube la próxima vez.'); return false; }
    if (c.clics < CLICS_MIN) { nota.push('«' + n + '» pierde ' + pct(c.pierde) + ' por presupuesto, pero con ' + c.clics + ' clics todavía no se ve si funciona.'); return false; }
    if (k && porClic > k.cpc) { nota.push('«' + n + '» pierde ' + pct(c.pierde) + ' por presupuesto, pero paga ' + dinero(porClic) + ' por clic, más que los ' + dinero(k.cpc) + ' del plan: no sube.'); return false; }
    return true;
  }).sort(function (a, b) {
    var ka = planDe[a], kb = planDe[b];
    return (C[a].costo / C[a].clics) / (ka ? ka.cpc : 1) - (C[b].costo / C[b].clics) / (kb ? kb.cpc : 1);
  });

  var espacio = tope - antes;
  function liberar(falta) {
    while (falta > 0 && donantes.length) {
      var n = donantes[0], c = C[n], piso = Math.max(PISO, Math.ceil(c.costo / DIAS * 1.5));
      var actual = (n in nuevo) ? nuevo[n] : c.monto, quita = Math.min(actual - piso, Math.ceil(falta));
      if (quita <= 0) { donantes.shift(); continue; }
      nuevo[n] = actual - quita; espacio += quita; falta -= quita;
      if (nuevo[n] <= piso) donantes.shift();
    }
  }
  sube.forEach(function (n) {
    var c = C[n], deseado = Math.ceil(c.monto * (1 + SUBE)), extra = deseado - c.monto;
    if (extra > espacio) liberar(extra - espacio);
    if (espacio < 1) { nota.push('«' + n + '» merece subir, pero la cuenta ya llegó a su tope mensual. Opción: pausar una campaña anterior para liberar dinero.'); return; }
    if (extra > espacio) { extra = Math.floor(espacio); deseado = c.monto + extra; }
    nuevo[n] = deseado; espacio -= extra;
    que.push('SUBE «' + n + '»: ' + dinero(c.monto) + ' → ' + dinero(deseado) + ' al día (pierde ' + pct(c.pierde) + ' por presupuesto; ' +
      c.clics + ' clics a $' + (c.costo / c.clics).toFixed(2) + ' en ' + DIAS + ' días)');
  });

  Object.keys(nuevo).forEach(function (n) {
    var c = C[n];
    if (nuevo[n] < c.monto) que.unshift('BAJA «' + n + '»: ' + dinero(c.monto) + ' → ' + dinero(nuevo[n]) + ' al día (en ' + DIAS +
      ' días usó ' + pct(c.costo / (c.monto * DIAS)) + ' de su presupuesto; ese dinero pasa a la que sí funciona)');
  });
  var despues = 0;
  Object.keys(C).forEach(function (n) { despues += (n in nuevo) ? nuevo[n] : C[n].monto; });
  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  if (!que.length) Logger.log('Nada que cambiar hoy.');
  que.forEach(function (t) { Logger.log(t); });
  nota.forEach(function (t) { Logger.log('NOTA: ' + t); });
  Logger.log('');
  Logger.log('Suma de presupuestos diarios (todas las campañas encendidas): ' + dinero(antes) + ' → ' + dinero(despues) +
    ' · al mes, como máximo: ' + dinero(antes * DIAS_MES) + ' → ' + dinero(despues * DIAS_MES) + ' · tope del plan ' + dinero(PLAN.mensual));
  var ops = [], donde = [];
  Object.keys(nuevo).forEach(function (n) {
    ops.push({ campaignBudgetOperation: { update: { resourceName: C[n].rn, amountMicros: Math.round(nuevo[n] * 1e6) }, updateMask: 'amountMicros' } });
    donde.push('presupuesto de «' + n + '»');
  });
  if (!ops.length) return;

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Si estás de acuerdo, da EJECUTAR.');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') + '. Vuelve a correrlo en 2 o 3 días.');
  }
}
