/**
 * Atelback · Datos para instalar la medición en la página — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Imprime, listo para
 * mandárselo a quien programa la página:
 *   - el ID de la etiqueta de la cuenta (AW-…) y el «send_to» de cada acción de conversión de la página «AB ·»;
 *   - qué campañas encendidas mandan gente a la página de la marca y cuáles a otra dirección.
 * No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y la marca, hasta el tope)", "fijos": ["Equipo para lavandería", "Emprendimiento", "Autoservicio y monedas", "Secadoras para lavandería", "Marcas comerciales", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": true, "subir_porque": "", "fijos": ["Alta capacidad 60 kg o más", "Lavandería hotelera e institucional", "Marca CLM"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": true, "subir_porque": "", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); la marca sale arriba con «ajustes»", "fijos": ["Marca Girbau", "Girbau Smart Plus", "Girbau por capacidad y sector", "Servicio técnico Girbau"], "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var ACCIONES = ['AB · Clic en WhatsApp', 'AB · Formulario enviado', 'AB · Clic en teléfono de la página', 'AB · Clic en correo'];
var CATEGORIAS = { CONTACT: 'Contacto', SUBMIT_LEAD_FORM: 'Enviar formulario de clientes potenciales', PHONE_CALL_LEAD: 'Llamada' };
var CONTEO = { ONE_PER_CLICK: 'Una', MANY_PER_CLICK: 'Todas' };

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. Si es Gamesail, pega su número en CUENTA_NUEVA. No se hizo nada.');
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
function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : '(sin dirección)'; }

function main() {
  var cid = revisarCuenta();
  var nuestra = sitio(PLAN.url);
  Logger.log('DATOS PARA LA MEDICIÓN · ' + PLAN.nombre + ' · cuenta ' + cid + ' · página ' + PLAN.url + ' · solo lee');

  // ---- Etiqueta y acciones
  var id = '', acciones = {}, otras = [];
  filas('SELECT conversion_action.name, conversion_action.status, conversion_action.category, conversion_action.counting_type, ' +
    "conversion_action.primary_for_goal, conversion_action.tag_snippets FROM conversion_action WHERE conversion_action.status = 'ENABLED' " +
    "AND conversion_action.type = 'WEBPAGE'", 'las acciones de conversión').forEach(function (f) {
    var a = f.conversionAction, envio = '';
    (a.tagSnippets || []).forEach(function (s) {
      var m = /send_to['"]?\s*:\s*['"](AW-\d+)\/([^'"]+)['"]/.exec(s.eventSnippet || '');
      if (m) { id = id || m[1]; envio = m[1] + '/' + m[2]; }
    });
    var x = { envio: envio, principal: a.primaryForGoal, categoria: CATEGORIAS[a.category] || a.category, conteo: CONTEO[a.countingType] || a.countingType };
    if (ACCIONES.indexOf(a.name) >= 0) acciones[a.name] = x; else if (/whats|wa\b|formul|contact/i.test(a.name)) otras.push(a.name + (envio ? ' (' + envio + ')' : ''));
  });

  Logger.log('');
  Logger.log('==== PARA RODOLFO · ' + PLAN.nombre + ' → ' + nuestra + ' ====');
  Logger.log('ID de la etiqueta: ' + (id || 'NO ENCONTRADO (revisa Objetivos > Conversiones > Configuración de la etiqueta)'));
  ACCIONES.forEach(function (n) {
    var x = acciones[n];
    if (!x) { Logger.log('«' + n + '»: NO EXISTE en esta cuenta (falta correr «conversiones.js»).'); return; }
    Logger.log('«' + n + '» · send_to: ' + (x.envio || 'SIN ETIQUETA') + ' · ' + x.categoria + ' · conteo ' + x.conteo + ' · ' + (x.principal ? 'Principal' : 'Secundaria'));
  });
  if (otras.length) Logger.log('Otras acciones de la página que ya existen (no usar, son de las páginas anteriores): ' + otras.join(' · '));

  // ---- Campañas y a dónde mandan
  var campanas = {};
  filas('SELECT campaign.name, campaign.status, ad_group_ad.ad.final_urls FROM ad_group_ad ' +
    "WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND ad_group_ad.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
    var c = campanas[f.campaign.name] = campanas[f.campaign.name] || {};
    (f.adGroupAd.ad.finalUrls || []).forEach(function (u) { c[sitio(u)] = true; });
  });
  var aqui = [], fuera = [];
  Object.keys(campanas).forEach(function (n) {
    var sitios = Object.keys(campanas[n]);
    if (sitios.length === 1 && sitios[0] === nuestra) aqui.push(n);
    else fuera.push(n + ' → ' + sitios.join(', '));
  });
  Logger.log('');
  Logger.log('Campañas encendidas que mandan a ' + nuestra + ' (' + aqui.length + '): ' + (aqui.join(' · ') || 'ninguna'));
  Logger.log('Campañas encendidas que mandan a otra dirección (' + fuera.length + '): ' + (fuera.join(' · ') || 'ninguna'));
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
