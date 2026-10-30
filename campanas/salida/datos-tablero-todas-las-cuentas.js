/**
 * Atelback · Datos para el tablero — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Junta, día por día,
 * desde 30 días antes del arranque de las campañas «AB ·» hasta ayer: impresiones, clics, costo, conversiones,
 * llamadas y cuota de impresiones por campaña; el gasto en búsquedas que ya están excluidas contra el resto, y las
 * conversiones por acción. Al final imprime unas líneas que empiezan con «TABLERO» para cargarlas al tablero.
 * No cambia nada en la cuenta.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 * Se puede correr cuando sea: manda todos los días desde el arranque, así que no importa si un día no se corrió.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "telefono": "33 1185 9797", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y Autoservicio)", "telefono": "33 2601 2237", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Alta capacidad)", "telefono": "33 1564 1538", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "telefono": "33 1417 2994", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); hoy sube el tope por clic en el paso 3", "telefono": "33 2806 8994", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';


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

// Fechas como 'yyyy-MM-dd', sin depender de la zona horaria del servidor.
function aFecha(t) { var p = t.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
function aTexto(d) { return d.toISOString().substring(0, 10); }
function mas(t, dias) { var d = aFecha(t); d.setUTCDate(d.getUTCDate() + dias); return aTexto(d); }

function main() {
  var cid = revisarCuenta();
  var ahora = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd HH:mm');
  imprimirTablero(cid, ahora);
  Logger.log('');
  Logger.log('LISTO. Este script no cambió nada.');
}

// Parte compartida (campanas/parte-tablero.js): imprime las líneas «TABLERO» con los datos día por día desde 30 días
// antes del arranque hasta ayer. La usan «datos para el tablero» y la revisión diaria. Necesita filas, esNueva, num y mas.
function imprimirTablero(cid, ahora) {
  var DIAS_ANTES = 30, TROZO = 8000;
  function r2(x) { return Math.round(x * 100) / 100; }
  function r3(x) { return x === undefined || x === null || x === '' ? null : Math.round(Number(x) * 1000) / 1000; }
  var hoy = ahora.substring(0, 10), ayer = mas(hoy, -1);
  var inicio = '';
  var itc = AdsApp.campaigns().get();
  while (itc.hasNext()) {
    var cc = itc.next();
    if (!esNueva(cc.getName())) continue;
    var x = cc.getStartDate();
    if (!x) continue;
    var t = x.year + '-' + ('0' + x.month).slice(-2) + '-' + ('0' + x.day).slice(-2);
    if (!inicio || t < inicio) inicio = t;
  }
  if (!inicio || inicio > ayer) { Logger.log('TABLERO: las campañas «' + PLAN.prefijo + '» todavía no tienen un día completo.'); return; }
  var desde = mas(inicio, -DIAS_ANTES);
  var rango = "segments.date BETWEEN '" + desde + "' AND '" + ayer + "'";
  var rangoNuevo = "segments.date BETWEEN '" + inicio + "' AND '" + ayer + "'";
  Logger.log('DATOS PARA EL TABLERO · ' + PLAN.nombre + ' · ' + ahora + ' · del ' + desde + ' al ' + ayer + ' (arranque ' + inicio + ') · solo lee');

  // ---- Campañas, día por día: [impresiones, clics, costo, conversiones, llamadas, cuota, perdida por presupuesto, perdida por posición]
  var C = {};
  function campana(n) {
    var k = esNueva(n) ? n.substring(PLAN.prefijo.length) : n;
    return C[k] = C[k] || { n: esNueva(n) ? 1 : 0, d: {} };
  }
  filas('SELECT campaign.name, segments.date, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, ' +
    'metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share ' +
    'FROM campaign WHERE ' + rango + ' AND metrics.impressions > 0', 'las campañas').forEach(function (f) {
    var m = f.metrics || {};
    campana(f.campaign.name).d[f.segments.date] = [num(m.impressions), num(m.clicks), r2(num(m.costMicros) / 1e6), r2(num(m.conversions)), 0,
      r3(m.searchImpressionShare), r3(m.searchBudgetLostImpressionShare), r3(m.searchRankLostImpressionShare)];
  });
  filas('SELECT campaign.name, segments.date, metrics.phone_calls FROM campaign WHERE ' + rango + ' AND metrics.phone_calls > 0',
    'las llamadas').forEach(function (f) {
    var d = campana(f.campaign.name).d;
    if (!d[f.segments.date]) d[f.segments.date] = [0, 0, 0, 0, 0, null, null, null];
    d[f.segments.date][4] = num((f.metrics || {}).phoneCalls);
  });

  // ---- Búsquedas de las campañas nuevas, día por día: [costo útil, costo excluido, clics útiles, clics excluidos]
  var B = {}, nb = 0;
  filas('SELECT campaign.name, segments.date, search_term_view.status, metrics.cost_micros, metrics.clicks FROM search_term_view WHERE ' +
    rangoNuevo + ' AND metrics.impressions > 0', 'las búsquedas').forEach(function (f) {
    if (!esNueva(f.campaign.name)) return;
    var m = f.metrics || {}, s = f.searchTermView.status, e = s === 'EXCLUDED' || s === 'ADDED_EXCLUDED';
    var b = B[f.segments.date] = B[f.segments.date] || [0, 0, 0, 0];
    b[e ? 1 : 0] = r2(b[e ? 1 : 0] + num(m.costMicros) / 1e6);
    b[e ? 3 : 2] += num(m.clicks);
    nb++;
  });

  // ---- Conversiones por acción, día por día
  var K = {};
  filas('SELECT segments.date, segments.conversion_action_name, metrics.conversions FROM campaign WHERE ' + rango +
    ' AND metrics.conversions > 0', 'las conversiones').forEach(function (f) {
    var k = K[f.segments.date] = K[f.segments.date] || {}, a = f.segments.conversionActionName;
    k[a] = r2((k[a] || 0) + num((f.metrics || {}).conversions));
  });

  // ---- Resumen legible
  var nuevas = 0, viejas = 0, costo = 0, clics = 0;
  Object.keys(C).forEach(function (n) {
    if (C[n].n) nuevas++; else viejas++;
    Object.keys(C[n].d).forEach(function (d) { if (d >= inicio) { costo += C[n].d[d][2]; clics += C[n].d[d][1]; } });
  });
  Logger.log('Campañas con datos: ' + nuevas + ' nuevas y ' + viejas + ' anteriores · desde el arranque: ' + clics + ' clics, $' +
    costo.toFixed(2) + ' · ' + nb + ' filas de búsquedas · ' + Object.keys(K).length + ' día(s) con conversiones.');

  // ---- Líneas para el tablero (en trozos, para que el registro no las corte)
  var datos = JSON.stringify({ v: 1, cuenta: cid, marca: PLAN.nombre, generado: ahora, desde: desde, hasta: ayer, arranque: inicio,
    c: C, b: B, k: K });
  var partes = Math.ceil(datos.length / TROZO);
  Logger.log('');
  Logger.log('Copia todo el registro (incluidas las ' + partes + ' línea(s) que empiezan con TABLERO) y mándalo.');
  for (var i = 0; i < partes; i++) Logger.log('TABLERO ' + (i + 1) + '/' + partes + '|' + datos.substring(i * TROZO, (i + 1) * TROZO));
}

