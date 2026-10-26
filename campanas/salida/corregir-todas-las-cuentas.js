/**
 * Atelback · Corregir lo que marcó la auditoría — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está):
 *   1. Pasa a Secundaria las conversiones que no son clientes (chat, chatbot, acciones locales, visitas…),
 *      para que Google aprenda a buscar clientes reales. Las de la página («AB ·») y las llamadas no se tocan.
 *   2. Enlaces de sitio y otros recursos que no van a la página de la marca (otro dominio, otra sección o una
 *      página que no carga): les pone la página de la marca. Si Google no deja editar alguno, lo deja en «A MANO».
 * No toca campañas, presupuestos, anuncios ni palabras clave.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "subir": true, "subir_porque": "", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y Autoservicio)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Alta capacidad)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Reparación y mantenimiento)", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); hoy sube el tope por clic en el paso 3", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

// Conversiones que no son clientes. Se pasan a Secundaria si hoy son Principal.
var NO_CLIENTE = /chat|bot|local actions|acciones locales|engagement|website visits|visitas|directions|c[oó]mo llegar|clicks? to call|store visit/i;

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function sitio(url) {
  var m = /^https?:\/\/([^\/?#]+)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') : '';
}
function dominio(url) {
  var h = sitio(url).split('.');
  var n = (h.length >= 3 && /^(com|net|org|gob|edu)$/.test(h[h.length - 2]) && h[h.length - 1].length === 2) ? 3 : 2;
  return h.slice(-n).join('.');
}
// Página sin www, sin parámetros y sin la diagonal final, para comparar si un anuncio ya va a la página de la marca.
function pagina(url) {
  var m = /^https?:\/\/([^\/?#]+)([^?#]*)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') + m[2].replace(/\/+$/, '') : '';
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
function carga(url) {
  try {
    var code = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true }).getResponseCode();
    return code < 400 ? '' : 'error ' + code;
  } catch (e) {
    return 'no abre (' + e.message + ')';
  }
}

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('CORRECCIONES · ' + PLAN.nombre + ' · página de la cuenta: ' + PLAN.url + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var hechos = [], aMano = [];

  // 1. Conversiones que no son clientes → Secundaria
  filas('SELECT conversion_action.resource_name, conversion_action.name, conversion_action.type, conversion_action.status, ' +
    "conversion_action.primary_for_goal FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las conversiones')
    .forEach(function (f) {
      var a = f.conversionAction;
      if (!a.primaryForGoal || a.name.indexOf(PLAN.prefijo) === 0 || a.type === 'AD_CALL' || !NO_CLIENTE.test(a.name)) return;
      var r = AdsApp.mutate({ conversionActionOperation: { update: { resourceName: a.resourceName, primaryForGoal: false }, updateMask: 'primaryForGoal' } });
      if (r.isSuccessful()) hechos.push('Conversión «' + a.name + '»: Principal → Secundaria');
      else aMano.push('Conversión «' + a.name + '»: pásala a Secundaria en Objetivos > Conversiones (' + r.getErrorMessages().join('; ') + ')');
    });

  // 2. Recursos (enlaces de sitio, etc.) que van a otro dominio o que no cargan
  var recursos = {};
  function junta(lista, donde) {
    lista.forEach(function (f) {
      var a = f.asset || {};
      if (!a.resourceName) return;
      recursos[a.resourceName] = recursos[a.resourceName] || { a: a, donde: [] };
      recursos[a.resourceName].donde.push(donde(f));
    });
  }
  junta(filas("SELECT asset.resource_name, asset.type, asset.name, asset.final_urls, asset.sitelink_asset.link_text FROM customer_asset " +
    "WHERE customer_asset.status != 'REMOVED'", 'los recursos de la cuenta'), function () { return 'cuenta'; });
  junta(filas("SELECT campaign.name, campaign.status, asset.resource_name, asset.type, asset.name, asset.final_urls, asset.sitelink_asset.link_text " +
    "FROM campaign_asset WHERE campaign_asset.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'los recursos de las campañas'),
    function (f) { return '«' + f.campaign.name + '»'; });
  junta(filas("SELECT campaign.name, ad_group.name, ad_group.status, asset.resource_name, asset.type, asset.name, asset.final_urls, " +
    "asset.sitelink_asset.link_text FROM ad_group_asset WHERE ad_group_asset.status != 'REMOVED' AND ad_group.status != 'REMOVED'",
    'los recursos de los grupos'), function (f) { return '«' + f.campaign.name + ' > ' + f.adGroup.name + '»'; });

  Object.keys(recursos).forEach(function (rn) {
    var x = recursos[rn], a = x.a;
    var url = (a.finalUrls || [])[0];
    if (!url) return;
    var nombre = a.type + ' «' + ((a.sitelinkAsset && a.sitelinkAsset.linkText) || a.name || '') + '» (' + x.donde.join(', ') + ')';
    var motivo = dominio(url) !== dominio(PLAN.url) ? 'va a otro dominio'
      : pagina(url.split('#')[0]) !== pagina(PLAN.url) ? 'no va a la página de la marca' : carga(url);
    if (!motivo) return;
    // Los enlaces de sitio llevan una marca (#…) distinta cada uno: van a la misma página, pero Google no los ve repetidos.
    var nueva = PLAN.url;
    if (a.type === 'SITELINK') {
      var texto = ((a.sitelinkAsset && a.sitelinkAsset.linkText) || 'enlace').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      nueva = PLAN.url + '#' + (texto.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'enlace');
    }
    var r = AdsApp.mutate({ assetOperation: { update: { resourceName: rn, finalUrls: [nueva] }, updateMask: 'finalUrls' } });
    if (r.isSuccessful()) hechos.push(nombre + ': ' + url + ' (' + motivo + ') → ' + nueva);
    else aMano.push(nombre + ': ' + url + ' (' + motivo + '). Cámbialo en Recursos a ' + nueva + ' (' + r.getErrorMessages().join('; ') + ')');
  });

  Logger.log('');
  Logger.log(vista ? '================ SE HARÍA ================' : '================ HECHO ================');
  if (!hechos.length) Logger.log('Nada que cambiar.');
  hechos.forEach(function (t) { Logger.log('✅ ' + t); });
  if (aMano.length) {
    Logger.log('');
    Logger.log('================ A MANO ================');
    aMano.forEach(function (t) { Logger.log('✋ ' + t); });
  }
  Logger.log('');
  Logger.log(vista ? 'Si la lista está bien, da EJECUTAR.' : 'LISTO. Corre otra vez la auditoría para confirmar.');
}
