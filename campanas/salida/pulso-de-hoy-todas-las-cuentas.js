/**
 * Atelback · Pulso de hoy — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Compara lo que llevan
 * hoy las campañas nuevas «AB ·» hasta la hora actual contra el promedio de los 7 días anteriores hasta la misma hora.
 * Sirve para ver en unas horas si un cambio está funcionando, sin esperar al día siguiente. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo. Se puede correr varias veces al día.
 * Google tarda hasta 3 horas en mostrar algunos clics: la última hora casi siempre sale incompleta.
 */

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y Autoservicio)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Alta capacidad)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); hoy sube el tope por clic en el paso 3", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
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
function uno(x) { return (Math.round(x * 10) / 10).toString(); }
function cambio(a, b) { return b ? (a >= b ? '+' : '') + Math.round((a / b - 1) * 100) + '%' : (a ? 'nuevo' : '—'); }

function main() {
  revisarCuenta();
  var ahora = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd HH:mm');
  var hora = Number(ahora.substring(11, 13));
  Logger.log('PULSO DE HOY · ' + PLAN.nombre + ' · ' + ahora + ' · hoy hasta las ' + hora + ':00 contra los días anteriores a la misma hora · solo lee');
  if (hora < 1) { Logger.log('Todavía es muy temprano para comparar. Córrelo después de las 10 de la mañana.'); return; }

  var C = {}, T = { hoy: { clics: 0, costo: 0, imp: 0 }, antes: { clics: 0, costo: 0, imp: 0 } }, fechas = {};
  function sumar(cual, consulta, que) {
    filas(consulta, que).forEach(function (f) {
      var n = f.campaign.name, m = f.metrics || {};
      if (!esNueva(n)) return;
      if (cual === 'antes' && num(m.impressions)) fechas[f.segments.date] = true;   // días en que ya corrían las campañas nuevas
      if (num(f.segments.hour) >= hora) return;
      var c = C[n] = C[n] || { hoy: { clics: 0, costo: 0, imp: 0 }, antes: { clics: 0, costo: 0, imp: 0 } };
      [c[cual], T[cual]].forEach(function (t) { t.clics += num(m.clicks); t.costo += num(m.costMicros) / 1e6; t.imp += num(m.impressions); });
    });
  }
  sumar('hoy', 'SELECT campaign.name, segments.hour, metrics.clicks, metrics.cost_micros, metrics.impressions FROM campaign ' +
    "WHERE segments.date DURING TODAY AND campaign.status = 'ENABLED'", 'los números de hoy');
  sumar('antes', 'SELECT campaign.name, segments.date, segments.hour, metrics.clicks, metrics.cost_micros, metrics.impressions FROM campaign ' +
    "WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 'ENABLED'", 'los números de la semana');

  var dias = Object.keys(fechas).length || 1;
  function linea(h, a) {
    var pa = { clics: a.clics / dias, costo: a.costo / dias, imp: a.imp / dias };
    return h.clics + ' clics (promedio ' + uno(pa.clics) + ', ' + cambio(h.clics, pa.clics) + ') · ' +
      num(h.imp) + ' impresiones (' + cambio(h.imp, pa.imp) + ') · costo por clic $' + (h.clics ? (h.costo / h.clics).toFixed(2) : '—') +
      (a.clics ? ' (antes $' + (a.costo / a.clics).toFixed(2) + ')' : '');
  }
  Logger.log('Promedio de ' + dias + ' día(s) anteriores con las campañas nuevas encendidas.');
  Logger.log('');
  Logger.log('CAMPAÑAS NUEVAS, TOTAL: ' + linea(T.hoy, T.antes));
  Logger.log('');
  Object.keys(C).sort(function (a, b) { return C[b].hoy.clics - C[a].hoy.clics; }).forEach(function (n) {
    Logger.log(n.replace(PLAN.prefijo, '') + ': ' + linea(C[n].hoy, C[n].antes));
  });
  Logger.log('');
  Logger.log('Recuerda: la última hora suele salir incompleta. Este script no cambió nada.');
}
