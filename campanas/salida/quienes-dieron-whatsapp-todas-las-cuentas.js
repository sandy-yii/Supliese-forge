/**
 * Atelback · ¿Quiénes dieron clic a WhatsApp? — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Resume los contactos por
 * WhatsApp que registró Google en los últimos 30 días, en todas las campañas (nuevas «AB ·» y anteriores):
 *   - por día y campaña, y de qué acción vienen (botón del anuncio o botón de la página);
 *   - qué buscó la persona, desde qué ciudad, en qué dispositivo y a qué hora.
 * Google no da nombres ni teléfonos: eso solo lo tiene el vendedor en su WhatsApp. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 * Google cuenta cada contacto en el día del clic al anuncio, no en el día en que escribió.
 */

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "paginas": {}, "subir_topes": true, "mensual": 19700, "subir": true, "subir_porque": "", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "paginas": {"AB · Autoservicio y monedas > Autoservicio": "https://quicklaundry.store/lavadoras-de-monedas"}, "subir_topes": false, "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y la marca, hasta el tope)", "fijos": ["Equipo para lavandería", "Emprendimiento", "Autoservicio y monedas", "Secadoras para lavandería", "Marcas comerciales", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "paginas": {"AB · Alta capacidad 60 kg o más > Lavadoras de alta capacidad": "https://kingstar.com.mx/lavadoras-alta-capacidad", "AB · Mangles y planchado > Mangles": "https://kingstar.com.mx/mangles"}, "subir_topes": false, "mensual": 18700, "subir": true, "subir_porque": "", "fijos": ["Alta capacidad 60 kg o más", "Túnel de lavado", "Lavandería hotelera e institucional", "Lavadoras y secadoras de 20 a 45 kg", "Mangles y planchado", "Marca CLM"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "paginas": {"AB · Reparación y mantenimiento > Reparación": "https://laundrysolutions.store/reparacion-lavadoras-industriales", "AB · Reparación y mantenimiento > Mantenimiento correctivo": "https://laundrysolutions.store/reparacion-lavadoras-industriales"}, "subir_topes": false, "mensual": 8200, "subir": true, "subir_porque": "", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "paginas": {}, "subir_topes": false, "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); la marca sale arriba con «ajustes»", "fijos": ["Marca Girbau", "Girbau Smart Plus", "Girbau por capacidad y sector", "Servicio técnico Girbau"], "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var WHATS = /whats|\bwa\b|mensaje|message|conversa|chat/i;
var DISPOSITIVO = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta', CONNECTED_TV: 'TV', OTHER: 'otro' };

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
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function num(x) { return Number(x || 0); }
function uno(x) { return (Math.round(x * 10) / 10).toString(); }
function corto(n) { return n.indexOf(PLAN.prefijo) === 0 ? n.replace(PLAN.prefijo, '') + ' (nueva)' : n + ' (anterior)'; }

// Junta por una llave y devuelve las filas ordenadas de mayor a menor
function sumar(lista, llave) {
  var t = {};
  lista.forEach(function (f) {
    var n = f.segments.conversionActionName, v = num((f.metrics || {}).allConversions);
    if (!v || !WHATS.test(n)) return;
    var k = llave(f);
    t[k] = (t[k] || 0) + v;
  });
  return Object.keys(t).map(function (k) { return [k, t[k]]; }).sort(function (a, b) { return b[1] - a[1]; });
}
function mostrar(titulo, filasOrdenadas, max) {
  Logger.log('');
  Logger.log('==== ' + titulo + ' ====');
  if (!filasOrdenadas.length) { Logger.log('Sin datos.'); return; }
  filasOrdenadas.slice(0, max || 30).forEach(function (r) { Logger.log(r[0] + ' · ' + uno(r[1])); });
}

function main() {
  revisarCuenta();
  Logger.log('¿QUIÉNES DIERON CLIC A WHATSAPP? · ' + PLAN.nombre + ' · últimos 30 días · solo lee');
  var DUR = 'segments.date DURING LAST_30_DAYS';

  // ---- Cada contacto de los últimos 7 días (WhatsApp, llamadas y formularios), para buscarlo en el teléfono del vendedor
  var CONTACTO = /whats|\bwa\b|mensaje|message|conversa|chat|llamad|call|tel[eé]fono|formul|lead|contact/i;
  var SEM = 'segments.date DURING LAST_7_DAYS';
  var busco = {}, ciudadDia = {};
  filas('SELECT segments.date, campaign.name, search_term_view.search_term, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM search_term_view WHERE ' + SEM, 'las búsquedas de la semana').forEach(function (f) {
    if (!num((f.metrics || {}).allConversions) || !CONTACTO.test(f.segments.conversionActionName)) return;
    var k = f.segments.date + '|' + f.campaign.name;
    (busco[k] = busco[k] || []).push('«' + f.searchTermView.searchTerm + '»');
  });
  filas('SELECT segments.date, campaign.name, segments.geo_target_city, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM geographic_view WHERE ' + SEM, 'las ciudades de la semana').forEach(function (f) {
    if (!num((f.metrics || {}).allConversions) || !CONTACTO.test(f.segments.conversionActionName)) return;
    var k = f.segments.date + '|' + f.campaign.name;
    (ciudadDia[k] = ciudadDia[k] || []).push(f.segments.geoTargetCity || '');
  });
  var cadaUno = filas('SELECT segments.date, segments.hour, segments.device, campaign.name, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM campaign WHERE ' + SEM, 'los contactos de la semana').filter(function (f) {
    return num((f.metrics || {}).allConversions) && CONTACTO.test(f.segments.conversionActionName);
  }).sort(function (a, b) {
    var x = a.segments.date + (100 + num(a.segments.hour)), y = b.segments.date + (100 + num(b.segments.hour));
    return x < y ? 1 : -1;
  });
  var rnsDia = [];
  Object.keys(ciudadDia).forEach(function (k) { ciudadDia[k].forEach(function (c) { if (c.indexOf('geoTargetConstants/') === 0) rnsDia.push(c); }); });
  var nombreDia = {};
  if (rnsDia.length) {
    filas("SELECT geo_target_constant.resource_name, geo_target_constant.name FROM geo_target_constant WHERE geo_target_constant.resource_name IN ('" +
      rnsDia.join("','") + "')", 'los nombres de las ciudades').forEach(function (f) { nombreDia[f.geoTargetConstant.resourceName] = f.geoTargetConstant.name; });
  }
  Logger.log('');
  Logger.log('==== CADA CONTACTO DE LOS ÚLTIMOS 7 DÍAS (hora del clic al anuncio, hora de la cuenta: ' + AdsApp.currentAccount().getTimeZone() + ') ====');
  if (!cadaUno.length) Logger.log('Ninguno.');
  cadaUno.forEach(function (f) {
    var h = num(f.segments.hour), k = f.segments.date + '|' + f.campaign.name;
    var ciudades = (ciudadDia[k] || []).map(function (c) { return nombreDia[c] || c; }).filter(function (c, i, a) { return c && a.indexOf(c) === i; });
    Logger.log(f.segments.date + ' entre ' + (h < 10 ? '0' : '') + h + ':00 y ' + (h < 9 ? '0' : '') + (h + 1) + ':00 · ' +
      uno(num(f.metrics.allConversions)) + ' × «' + f.segments.conversionActionName + '» · ' + corto(f.campaign.name) + ' · ' +
      (DISPOSITIVO[f.segments.device] || f.segments.device) +
      (busco[k] ? ' · buscó ' + busco[k].join(' o ') : '') + (ciudades.length ? ' · desde ' + ciudades.join(' o ') : ''));
  });
  Logger.log('Ojo: «Clic en WhatsApp» cuenta a quien tocó el botón y se le abrió WhatsApp, aunque no haya llegado a mandar mensaje.');

  var porDia = filas('SELECT segments.date, campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE ' + DUR, 'los días');
  var total = 0;
  sumar(porDia, function () { return 't'; }).forEach(function (r) { total = r[1]; });
  Logger.log('Total de contactos por WhatsApp que registró Google: ' + uno(total));

  mostrar('DE QUÉ BOTÓN VIENEN', sumar(porDia, function (f) { return '«' + f.segments.conversionActionName + '»'; }));
  mostrar('POR DÍA Y CAMPAÑA', sumar(porDia, function (f) { return f.segments.date + ' · ' + corto(f.campaign.name); })
    .sort(function (a, b) { return a[0] < b[0] ? 1 : -1; }), 60);
  mostrar('POR CAMPAÑA', sumar(porDia, function (f) { return corto(f.campaign.name); }));

  mostrar('QUÉ BUSCARON', sumar(filas('SELECT search_term_view.search_term, campaign.name, segments.conversion_action_name, metrics.all_conversions ' +
    'FROM search_term_view WHERE ' + DUR, 'las búsquedas'), function (f) { return '«' + f.searchTermView.searchTerm + '» · ' + corto(f.campaign.name); }), 40);

  var ciudades = sumar(filas('SELECT segments.geo_target_city, segments.conversion_action_name, metrics.all_conversions FROM geographic_view WHERE ' + DUR,
    'las ciudades'), function (f) { return f.segments.geoTargetCity || 'sin ciudad'; });
  var nombres = {};
  var rns = ciudades.map(function (r) { return r[0]; }).filter(function (r) { return r.indexOf('geoTargetConstants/') === 0; });
  if (rns.length) {
    filas("SELECT geo_target_constant.resource_name, geo_target_constant.name, geo_target_constant.canonical_name FROM geo_target_constant " +
      "WHERE geo_target_constant.resource_name IN ('" + rns.join("','") + "')", 'los nombres de las ciudades').forEach(function (f) {
      nombres[f.geoTargetConstant.resourceName] = f.geoTargetConstant.canonicalName || f.geoTargetConstant.name;
    });
  }
  mostrar('DESDE QUÉ CIUDAD', ciudades.map(function (r) { return [nombres[r[0]] || r[0], r[1]]; }));

  mostrar('DISPOSITIVO', sumar(filas('SELECT segments.device, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE ' + DUR,
    'los dispositivos'), function (f) { return DISPOSITIVO[f.segments.device] || f.segments.device; }));

  var porHora = filas('SELECT segments.day_of_week, segments.hour, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE ' + DUR, 'las horas');
  mostrar('A QUÉ HORA (del clic al anuncio)', sumar(porHora, function (f) { var h = num(f.segments.hour); return (h < 10 ? '0' : '') + h + ':00'; })
    .sort(function (a, b) { return a[0] < b[0] ? -1 : 1; }), 24);
  var DIA = { MONDAY: '1 lunes', TUESDAY: '2 martes', WEDNESDAY: '3 miércoles', THURSDAY: '4 jueves', FRIDAY: '5 viernes', SATURDAY: '6 sábado', SUNDAY: '7 domingo' };
  mostrar('QUÉ DÍA DE LA SEMANA', sumar(porHora, function (f) { return DIA[f.segments.dayOfWeek] || f.segments.dayOfWeek; })
    .sort(function (a, b) { return a[0] < b[0] ? -1 : 1; }), 7);

  Logger.log('');
  Logger.log('Google no da nombres ni teléfonos. Para saber quién fue y si era cliente real, compáralo con los chats del vendedor de esos días.');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
