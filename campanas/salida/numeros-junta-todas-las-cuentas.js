/**
 * Atelback · Números para la junta — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Compara los 30 días
 * antes de que arrancaran las campañas nuevas «AB ·» contra los días desde que arrancaron, y lista por campaña,
 * conversiones y búsquedas reales. No cambia nada en la cuenta.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS_ANTES = 30;

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
function dinero(x) { return '$' + x.toFixed(2); }
function uno(x) { return (Math.round(x * 10) / 10).toString(); }
function pct(x) { return x === undefined || x === null || x === '' ? 'sin dato' : Math.round(Number(x) * 100) + '%'; }

// Fechas como 'yyyy-MM-dd', sin depender de la zona horaria del servidor.
function aFecha(t) { var p = t.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
function aTexto(d) { return d.toISOString().substring(0, 10); }
function mas(t, dias) { var d = aFecha(t); d.setUTCDate(d.getUTCDate() + dias); return aTexto(d); }
function entre(a, b) { return Math.round((aFecha(b) - aFecha(a)) / 864e5); }

function vacio() { return { imp: 0, clics: 0, costo: 0, conv: 0, llamadas: 0 }; }
function sumar(t, m) {
  t.imp += num(m.impressions); t.clics += num(m.clicks); t.costo += num(m.costMicros) / 1e6; t.conv += num(m.conversions);
}
function linea(t, dias) {
  var d = dias || 1;
  return 'impresiones ' + uno(t.imp / d) + ' · clics ' + uno(t.clics / d) + ' · costo ' + dinero(t.costo / d) +
    ' · CPC ' + (t.clics ? dinero(t.costo / t.clics) : 'sin clics') + ' · CTR ' + (t.imp ? uno(t.clics / t.imp * 100) + '%' : 'sin dato') +
    ' · conversiones ' + uno(t.conv / d) + ' · llamadas ' + uno(t.llamadas / d);
}

function main() {
  revisarCuenta();
  var tz = AdsApp.currentAccount().getTimeZone();
  var ahora = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
  var hoy = ahora.substring(0, 10), ayer = mas(hoy, -1);
  Logger.log('NÚMEROS PARA LA JUNTA · ' + PLAN.nombre + ' · hora de la cuenta: ' + ahora + ' (' + tz + ') · solo lee, no cambia nada');

  // Arranque: la fecha de inicio más temprana de las campañas nuevas.
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
  if (!inicio || inicio > hoy) throw new Error('No hay campañas «' + PLAN.prefijo + '» que ya hayan arrancado. No hay nada que comparar.');

  var antesDe = mas(inicio, -DIAS_ANTES), antesA = mas(inicio, -1);
  var dias = entre(inicio, hoy);   // días completos desde el arranque, sin contar hoy
  var P = { antes: [antesDe, antesA], ahora: dias ? [inicio, ayer] : null, hoy: [hoy, hoy], todo: [inicio, hoy] };
  Logger.log('Arranque de las campañas nuevas: ' + inicio + ' · días completos desde entonces: ' + dias + ' · ANTES = ' + antesDe + ' a ' + antesA);
  function rango(r) { return "segments.date BETWEEN '" + r[0] + "' AND '" + r[1] + "'"; }

  // ---- Totales por periodo: todas, nuevas y anteriores
  var tot = {}, porCampana = {};
  ['antes', 'ahora', 'hoy', 'todo'].forEach(function (k) {
    tot[k] = { todas: vacio(), nuevas: vacio(), anteriores: vacio() };
    if (!P[k]) return;
    filas('SELECT campaign.name, campaign.status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign ' +
      'WHERE ' + rango(P[k]) + ' AND metrics.impressions > 0', 'los números (' + k + ')').forEach(function (f) {
      var m = f.metrics || {};
      sumar(tot[k].todas, m);
      sumar(tot[k][esNueva(f.campaign.name) ? 'nuevas' : 'anteriores'], m);
      if (k === 'todo' || k === 'antes') {
        var c = porCampana[f.campaign.name] = porCampana[f.campaign.name] || { estado: f.campaign.status, antes: vacio(), todo: vacio(), cuota: null };
        sumar(c[k], m);
      }
    });
    filas('SELECT campaign.name, metrics.phone_calls FROM campaign WHERE ' + rango(P[k]) + ' AND metrics.phone_calls > 0',
      'las llamadas (' + k + ')').forEach(function (f) {
      var n = num((f.metrics || {}).phoneCalls);
      tot[k].todas.llamadas += n;
      tot[k][esNueva(f.campaign.name) ? 'nuevas' : 'anteriores'].llamadas += n;
      if (porCampana[f.campaign.name] && (k === 'todo' || k === 'antes')) porCampana[f.campaign.name][k].llamadas += n;
    });
  });
  filas('SELECT campaign.name, metrics.search_impression_share FROM campaign WHERE ' + rango(P.todo) + " AND campaign.status = 'ENABLED'",
    'la cuota de impresiones').forEach(function (f) {
    if (porCampana[f.campaign.name]) porCampana[f.campaign.name].cuota = (f.metrics || {}).searchImpressionShare;
  });

  Logger.log('');
  Logger.log('================ PROMEDIO POR DÍA ================');
  Logger.log('ANTES (' + DIAS_ANTES + ' días, todas las campañas): ' + linea(tot.antes.todas, DIAS_ANTES));
  if (P.ahora) {
    Logger.log('AHORA (' + dias + ' día(s) completos, todas): ' + linea(tot.ahora.todas, dias));
    Logger.log('   solo nuevas «' + PLAN.prefijo + '»: ' + linea(tot.ahora.nuevas, dias));
    Logger.log('   solo anteriores: ' + linea(tot.ahora.anteriores, dias));
  }
  Logger.log('HOY hasta ' + ahora.substring(11) + ' (todas): ' + linea(tot.hoy.todas, 1));
  Logger.log('   solo nuevas: ' + linea(tot.hoy.nuevas, 1));

  Logger.log('');
  Logger.log('================ POR CAMPAÑA ================');
  Logger.log('(DESDE EL ARRANQUE = ' + inicio + ' a hoy, en total; ANTES = los ' + DIAS_ANTES + ' días previos, en total)');
  Object.keys(porCampana).sort(function (a, b) { return porCampana[b].todo.clics - porCampana[a].todo.clics; }).forEach(function (n) {
    var c = porCampana[n];
    Logger.log((esNueva(n) ? 'NUEVA ' : 'ANTERIOR ') + '«' + n + '» (' + c.estado + ')');
    if (c.todo.imp) Logger.log('   desde el arranque: ' + linea(c.todo, 1) + ' · cuota de impresiones ' + pct(c.cuota));
    if (c.antes.imp) Logger.log('   antes: ' + linea(c.antes, 1));
  });

  // ---- Conversiones por acción
  Logger.log('');
  Logger.log('================ CONVERSIONES POR ACCIÓN ================');
  var acciones = {};
  filas('SELECT conversion_action.name, conversion_action.primary_for_goal, conversion_action.status FROM conversion_action ' +
    "WHERE conversion_action.status != 'REMOVED'", 'las acciones de conversión').forEach(function (f) {
    acciones[f.conversionAction.name] = { principal: f.conversionAction.primaryForGoal, estado: f.conversionAction.status, antes: 0, todo: 0 };
  });
  ['antes', 'todo'].forEach(function (k) {
    filas('SELECT segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE ' + rango(P[k]),
      'las conversiones (' + k + ')').forEach(function (f) {
      var n = f.segments.conversionActionName;
      var a = acciones[n] = acciones[n] || { principal: null, estado: '', antes: 0, todo: 0 };
      a[k] += num((f.metrics || {}).allConversions);
    });
  });
  Object.keys(acciones).forEach(function (n) {
    var a = acciones[n];
    if (!a.antes && !a.todo && a.principal !== true) return;   // sin datos y sin peso: no se lista
    Logger.log('«' + n + '» · ' + (a.principal === true ? 'Principal' : a.principal === false ? 'Secundaria' : '¿?') + ' · ' + a.estado +
      ' · antes: ' + uno(a.antes) + ' · desde el arranque: ' + uno(a.todo));
  });

  // ---- Búsquedas reales
  function busquedas(r, soloNuevas, orden, titulo) {
    Logger.log('');
    Logger.log('================ ' + titulo + ' ================');
    var lista = filas('SELECT search_term_view.search_term, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions ' +
      'FROM search_term_view WHERE ' + rango(r) + ' AND metrics.impressions > 0 ORDER BY ' + orden + ' DESC LIMIT 500', 'las búsquedas')
      .filter(function (f) { return !soloNuevas || esNueva(f.campaign.name); });
    var clics = 0, costo = 0;
    lista.forEach(function (f) { clics += num(f.metrics.clicks); costo += num(f.metrics.costMicros) / 1e6; });
    Logger.log(lista.length + ' búsqueda(s) distintas visibles · ' + clics + ' clics · ' + dinero(costo));
    lista.slice(0, 25).forEach(function (f) {
      var m = f.metrics;
      Logger.log('«' + f.searchTermView.searchTerm + '» · ' + f.campaign.name + ' · ' + num(m.impressions) + ' impr · ' + num(m.clicks) + ' clics · ' +
        dinero(num(m.costMicros) / 1e6) + (num(m.conversions) ? ' · ' + uno(num(m.conversions)) + ' conv' : ''));
    });
  }
  busquedas(P.todo, true, 'metrics.clicks', 'BÚSQUEDAS DE LAS CAMPAÑAS NUEVAS (desde el arranque)');
  busquedas(P.antes, false, 'metrics.cost_micros', 'BÚSQUEDAS ANTES (' + DIAS_ANTES + ' días, todas las campañas, por gasto)');

  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
