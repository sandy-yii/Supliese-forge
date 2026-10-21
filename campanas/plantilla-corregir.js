/**
 * Atelback · Corregir lo que marcó la auditoría — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está):
 *   1. Pasa a Secundaria las conversiones que no son clientes (chat, chatbot, acciones locales, visitas…),
 *      para que Google aprenda a buscar clientes reales. Las de la página («AB ·») y las llamadas no se tocan.
 *   2. Enlaces de sitio y otros recursos que van a otro dominio o a una página que no carga: les pone la página
 *      de la cuenta. Si Google no deja editar alguno, lo deja en la lista «A MANO».
 * No toca campañas, presupuestos, anuncios ni palabras clave.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = {{PLANES}};
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
    var motivo = dominio(url) !== dominio(PLAN.url) ? 'va a otro dominio' : carga(url);
    if (!motivo) return;
    var r = AdsApp.mutate({ assetOperation: { update: { resourceName: rn, finalUrls: [PLAN.url] }, updateMask: 'finalUrls' } });
    if (r.isSuccessful()) hechos.push(nombre + ': ' + url + ' (' + motivo + ') → ' + PLAN.url);
    else aMano.push(nombre + ': ' + url + ' (' + motivo + '). Cámbialo en Recursos a ' + PLAN.url + ' (' + r.getErrorMessages().join('; ') + ')');
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
