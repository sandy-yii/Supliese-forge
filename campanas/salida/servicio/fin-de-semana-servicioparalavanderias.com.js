/**
 * Atelback · Paquete del fin de semana: servicioparalavanderias.com, presupuestos y anuncios — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): corre, en este orden, los
 * mismos pasos que los scripts sueltos:
 *   1. Anuncios y secciones a servicioparalavanderias.com
 *   2. Enlaces de sitio a servicioparalavanderias.com
 *   3. Exclusiones y palabras clave
 *   4. Anuncios nuevos
 *   5. Presupuestos y campañas que sí traen contactos
 * Primero las exclusiones, para que el presupuesto que sube no se vaya en búsquedas que no sirven.
 * Si un paso falla, se detiene ahí y no corre los siguientes.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (cada paso dice qué haría) > EJECUTAR.
 * En la vista previa cada paso ve la cuenta como está hoy; al ejecutar, cada uno ve lo que dejó el anterior.
 */

function paso1() {
/**
 * Atelback · Cambiar la página de destino de las campañas nuevas — Servicio para Lavandería (265-909-2662)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: en todas las campañas de la cuenta, los anuncios activos que van a otra página:
 *   - los adaptables de búsqueda se cambian a su página: la propia de su grupo si el plan le da una (por ejemplo
 *     /mangles), o la de inicio de la marca. Una página propia que no abre se salta y el grupo se queda en la de inicio;
 *   - los de otro tipo, que ya no se pueden editar, se quitan (pausados también cuentan para Google).
 * Revisa anuncios habilitados y pausados. Además lista los enlaces de sitio y otros recursos, y las plantillas
 * de seguimiento, que apunten a otro sitio: esos se corrigen a mano.
 * Así cada grupo queda con un solo sitio web, como exige Google. Deja en el registro el estado de aprobación
 * de cada anuncio y, si Google lo rechazó, el motivo. No toca textos, palabras clave ni presupuestos.
 *
 * CÓMO SE USA (dentro de la cuenta): pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 * Al cambiar la URL, Google vuelve a revisar los anuncios (suele tardar de unas horas a un día).
 */

var PLAN = {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://servicioparalavanderias.com/", "prefijo": "AB · ", "paginas": {"AB · Reparación y mantenimiento > Reparación": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales", "AB · Reparación y mantenimiento > Mantenimiento correctivo": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales"}, "telefono": "33 1417 2994", "mismo_sitio": ["laundry-solutions-servicio.vercel.app", "laundrysolutions.store"]};

// Solo si es una cuenta nueva (el plan no trae su número): pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var esperada = PLAN.cuenta || CUENTA_NUEVA;
  if (!esperada) {
    throw new Error('Es una cuenta nueva: pega su número en CUENTA_NUEVA, arriba del script. No se hizo nada.');
  }
  if (PLAN.anterior && cid === PLAN.anterior) {
    throw new Error('Esta es la cuenta anterior (' + cid + '), no la nueva. No se hizo nada.');
  }
  if (cid !== esperada) {
    throw new Error('Este script es para la cuenta ' + esperada + ' y se está corriendo en ' + cid + '. No se hizo nada.');
  }
  return cid;
}

// Sitio (dominio sin www) de una URL.
function sitio(url) {
  var m = /^https?:\/\/([^\/?#]+)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') : '';
}

// Cada grupo va a su página propia si el plan le da una y esa página abre; si no, a la página de la marca.
var CARGA = {};
function urlNueva(campana, grupo) {
  var u = (PLAN.paginas || {})[campana + ' > ' + grupo];
  return u && CARGA[u] ? u : PLAN.url;
}
// Una página es nuestra si es la de la marca o alguna de las páginas propias de los grupos.
function permitida(u) {
  var todas = [PLAN.url].concat(Object.keys(PLAN.paginas || {}).map(function (k) { return PLAN.paginas[k]; }));
  return todas.some(function (t) { return pagina(t) === pagina(u); });
}
function revisarPaginas() {
  Object.keys(PLAN.paginas || {}).forEach(function (k) {
    var u = PLAN.paginas[k];
    if (u in CARGA) return;
    try {
      var code = UrlFetchApp.fetch(u, { muteHttpExceptions: true, followRedirects: true }).getResponseCode();
      CARGA[u] = code < 400;
      Logger.log((CARGA[u] ? 'Abre bien: ' : 'AVISO: no abre (error ' + code + '), esos grupos se quedan en la página de inicio: ') + u);
    } catch (e) {
      CARGA[u] = false;
      Logger.log('AVISO: no se pudo abrir ' + u + ' (' + e.message + '); esos grupos se quedan en la página de inicio.');
    }
  });
}

// Página sin www, sin parámetros y sin la diagonal final, para comparar si un anuncio ya va a la página de la marca.
function pagina(url) {
  var m = /^https?:\/\/([^\/?#]+)([^?#]*)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') + m[2].replace(/\/+$/, '') : '';
}

function main() {
  revisarCuenta();
  Logger.log('Página de la marca: ' + PLAN.url);
  // La página de la marca tiene que abrir antes de mandar anuncios ahí (por ejemplo, al pasar al dominio de siempre)
  try {
    var r0 = UrlFetchApp.fetch(PLAN.url, { muteHttpExceptions: true, followRedirects: true });
    if (r0.getResponseCode() >= 400) throw new Error('responde con error ' + r0.getResponseCode());
    var digitos = String(PLAN.telefono || '').replace(/\D/g, '').slice(-10);
    if (digitos && r0.getContentText().replace(/\D/g, '').indexOf(digitos) < 0) {
      Logger.log('AVISO: en ' + PLAN.url + ' no se ve escrito el teléfono del vendedor (' + PLAN.telefono + '). ' +
        'Google lo necesita para aprobar el botón de llamada: avísale a Rodolfo.');
    }
  } catch (e) {
    throw new Error('La página ' + PLAN.url + ' no abre todavía (' + e.message + '). No se cambió nada.');
  }
  revisarPaginas();
  var ops = [], donde = [], yaBien = 0;
  var destino = sitio(PLAN.url);
  // Lo que va a una página que no es nuestra (otro dominio u otra sección) se cambia.
  function otroSitio(urls) { return (urls || []).some(function (u) { return sitio(u) && !permitida(u); }); }
  // Un anuncio va mal si no va a la página que le toca a su grupo.
  function fuera(urls, esperada) { return (urls || []).some(function (u) { return sitio(u) && pagina(u) !== pagina(esperada); }); }
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.resource_name, ad_group_ad.ad.resource_name, ' +
    'ad_group_ad.ad.type, ad_group_ad.ad.final_urls, ad_group_ad.ad.final_mobile_urls, ad_group_ad.policy_summary.approval_status, ' +
    'ad_group_ad.policy_summary.review_status, ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad ' +
    "WHERE ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  var enRevision = 0;
  while (it.hasNext()) {
    var f = it.next();
    var nombre = f.campaign.name + ' > ' + f.adGroup.name;
    var pol = f.adGroupAd.policySummary || {};
    var motivos = (pol.policyTopicEntries || []).map(function (e) { return e.topic + (e.type ? ' (' + e.type + ')' : ''); });
    var revisando = /IN_PROGRESS|UNDER_APPEAL/.test(pol.reviewStatus || '');
    if (revisando) enRevision++;
    Logger.log(nombre + ' · aprobación: ' + (pol.approvalStatus || 'sin dato') + (revisando ? ' (en revisión)' : '') +
      (motivos.length ? ' · motivos: ' + motivos.join(', ') : ''));
    var ad = f.adGroupAd.ad;
    var url = (ad.finalUrls || [])[0] || '';
    var movil = ad.finalMobileUrls || [];
    var esperada = urlNueva(f.campaign.name, f.adGroup.name);
    if (ad.type === 'RESPONSIVE_SEARCH_AD') {
      if (!fuera(ad.finalUrls, esperada) && !fuera(movil, esperada)) { yaBien++; continue; }
      var nueva = fuera(ad.finalUrls, esperada) ? esperada : url;
      var cambio = { resourceName: ad.resourceName, finalUrls: [nueva] };
      var mascara = 'finalUrls';
      // La URL para celulares también cuenta: si va a otra página, se borra y el anuncio usa la principal.
      if (fuera(movil, esperada)) { cambio.finalMobileUrls = []; mascara += ',finalMobileUrls'; }
      ops.push({ adOperation: { update: cambio, updateMask: mascara } });
      donde.push('CAMBIAR ' + nombre + ': ' + url + (movil.length ? ' (celular: ' + movil[0] + ')' : '') + ' → ' + nueva);
    } else if (!otroSitio(ad.finalUrls) && !otroSitio(movil)) {
      yaBien++;   // no se puede editar, pero va a una página nuestra: se queda
    } else {
      // Pausarlo no basta: para Google los anuncios pausados también cuentan. Ya no se puede editar, así que se quita.
      ops.push({ adGroupAdOperation: { remove: f.adGroupAd.resourceName } });
      donde.push('QUITAR ' + nombre + ' (anuncio ' + ad.type + ' a ' + url + ': ya no se puede editar y, aunque esté en pausa, cuenta como otro sitio)');
    }
  }

  // Palabras clave con URL propia a otro sitio: también cuentan. Se borra su URL y usan la del anuncio.
  var itk = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ' +
    'ad_group_criterion.final_urls, ad_group_criterion.final_mobile_urls FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED' AND ad_group.status != 'REMOVED' " +
    "AND campaign.status != 'REMOVED'");
  while (itk.hasNext()) {
    var k = itk.next();
    var gc = k.adGroupCriterion;
    if (!otroSitio(gc.finalUrls) && !otroSitio(gc.finalMobileUrls)) continue;
    ops.push({ adGroupCriterionOperation: { update: { resourceName: gc.resourceName, finalUrls: [], finalMobileUrls: [] },
      updateMask: 'finalUrls,finalMobileUrls' } });
    donde.push('LIMPIAR la URL de la palabra clave «' + (gc.keyword ? gc.keyword.text : '') + '» en ' + k.campaign.name + ' > ' + k.adGroup.name +
      ' (iba a ' + ((gc.finalUrls || [])[0] || (gc.finalMobileUrls || [])[0]) + ')');
  }
  if (enRevision) Logger.log(enRevision + ' anuncio(s) están en revisión de Google: su estado puede seguir diciendo «Rechazado» hasta que termine.');
  revisarOtros();
  donde.forEach(function (d) { Logger.log(d); });
  if (yaBien) Logger.log(yaBien + ' anuncio(s) ya van a ' + sitio(PLAN.url) + '.');
  if (!ops.length) { Logger.log('No hay anuncios que cambiar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (AdsApp.getExecutionInfo().isPreview()) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Da EJECUTAR para aplicar ' + ops.length + ' cambio(s).');
  } else {
    Logger.log((ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') +
      '. Google vuelve a revisar los anuncios; suele tardar de unas horas a un día.');
  }
}

// Recursos (enlaces de sitio, etc.) y plantillas de seguimiento que apuntan a otro sitio. Solo se reportan.
function revisarOtros() {
  var destino = sitio(PLAN.url), avisos = [];
  function revisa(consulta, nombre) {
    try {
      var it = AdsApp.search(consulta);
      while (it.hasNext()) {
        var f = it.next();
        var urls = (f.asset && f.asset.finalUrls) || [];
        urls.forEach(function (u) {
          if (sitio(u) && sitio(u) !== destino) avisos.push(nombre(f) + ' · ' + (f.asset.type || 'recurso') + ' a ' + u);
        });
      }
    } catch (e) { Logger.log('No se pudo revisar: ' + e.message); }
  }
  revisa("SELECT asset.type, asset.final_urls FROM customer_asset WHERE customer_asset.status != 'REMOVED'",
    function () { return 'Cuenta'; });
  revisa("SELECT campaign.name, campaign.status, asset.type, asset.final_urls FROM campaign_asset WHERE campaign_asset.status != 'REMOVED' " +
    "AND campaign.status != 'REMOVED'", function (f) { return f.campaign.name; });
  revisa("SELECT campaign.name, ad_group.name, ad_group.status, asset.type, asset.final_urls FROM ad_group_asset " +
    "WHERE ad_group_asset.status != 'REMOVED' AND ad_group.status != 'REMOVED'",
    function (f) { return f.campaign.name + ' > ' + f.adGroup.name; });
  try {
    var itc = AdsApp.search("SELECT campaign.name, campaign.tracking_url_template, campaign.final_url_suffix FROM campaign " +
      "WHERE campaign.status != 'REMOVED'");
    while (itc.hasNext()) {
      var c = itc.next().campaign;
      if (c.trackingUrlTemplate || c.finalUrlSuffix) {
        avisos.push(c.name + ' · plantilla de seguimiento: ' + (c.trackingUrlTemplate || '') + ' ' + (c.finalUrlSuffix || ''));
      }
    }
  } catch (e) { Logger.log('No se pudo revisar las plantillas: ' + e.message); }
  if (avisos.length) {
    Logger.log('REVISAR A MANO (Recursos o configuración de la campaña; el script no los cambia):');
    avisos.forEach(function (a) { Logger.log('  ' + a); });
  } else {
    Logger.log('Recursos y plantillas de seguimiento: ninguno apunta a otro sitio.');
  }
}

  main();
}

function paso2() {
/**
 * Atelback · Corregir lo que marcó la auditoría — Servicio para Lavandería
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

var PLANES = [{"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://servicioparalavanderias.com/", "prefijo": "AB · ", "paginas": {"AB · Reparación y mantenimiento > Reparación": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales", "AB · Reparación y mantenimiento > Mantenimiento correctivo": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales"}, "subir_topes": false, "mensual": 8200, "subir": true, "subir_porque": "", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}];
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

  main();
}

function paso3() {
/**
 * Atelback · Agregar las palabras clave nuevas del plan — Servicio para Lavandería
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): compara las palabras clave de
 * cada grupo de las campañas «AB ·» con el plan y agrega las que faltan, encendidas. También agrega a la lista
 * «AB · Negativas de la cuenta» las exclusiones del plan que le falten. No quita ni cambia ninguna de las que ya
 * existen, ni toca anuncios, presupuestos o páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://servicioparalavanderias.com/", "quitar": [], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadoras industriales", "EXACT"], ["lavadora industrial", "EXACT"], ["lavadoras para lavanderia", "EXACT"], ["lavadoras para lavandería", "EXACT"], ["lavadoras comerciales", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["lavadora industrial precio", "EXACT"], ["precio de lavadora industrial", "PHRASE"], ["precio de lavadoras industriales", "PHRASE"], ["precio lavadoras industriales", "PHRASE"], ["costo lavadora industrial", "PHRASE"], ["costo de lavadora industrial", "PHRASE"], ["costo de lavadoras industriales", "PHRASE"], ["cuánto cuesta una lavadora industrial", "PHRASE"], ["cuanto cuesta una lavadora industrial", "PHRASE"], ["cuánto cuestan las lavadoras industriales", "PHRASE"], ["cuanto cuestan las lavadoras industriales", "PHRASE"], ["cuánto vale una lavadora industrial", "PHRASE"], ["cuanto vale una lavadora industrial", "PHRASE"], ["para negocio", "PHRASE"], ["commercial washer", "PHRASE"], ["partes para lavadora industrial", "PHRASE"], ["partes para lavadoras industriales", "PHRASE"], ["refacciones para lavadora industrial", "PHRASE"], ["refacciones para lavadoras industriales", "PHRASE"], ["refacciones para secadora industrial", "PHRASE"], ["refacciones para secadoras industriales", "PHRASE"], ["refacciones lavandería industrial", "PHRASE"], ["refacciones lavanderia industrial", "PHRASE"], ["curso", "BROAD"], ["cursos", "BROAD"], ["tutorial", "BROAD"], ["cómo reparar", "PHRASE"], ["como reparar", "PHRASE"], ["diagrama", "BROAD"], ["diagramas", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["manuales", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["easy", "BROAD"], ["de casa", "PHRASE"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["carga frontal", "PHRASE"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["empleo", "BROAD"], ["trabajo", "BROAD"], ["sueldo", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"]]}, "campanas": [{"nombre": "AB · Servicio técnico industrial", "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico de lavadoras industriales", "PHRASE"], ["técnico en lavadoras industriales", "PHRASE"], ["técnico en lavandería industrial", "PHRASE"], ["técnico de secadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Reparación y mantenimiento", "grupos": [{"nombre": "Reparación", "kw": [["reparación de lavadoras industriales", "PHRASE"], ["reparación de lavadora industrial", "PHRASE"]]}, {"nombre": "Mantenimiento correctivo", "kw": [["mantenimiento correctivo lavadora industrial", "PHRASE"], ["mantenimiento correctivo lavadoras industriales", "PHRASE"], ["mantenimiento correctivo lavadora", "PHRASE"]]}, {"nombre": "Mantenimiento preventivo", "kw": [["mantenimiento preventivo lavadoras industriales", "PHRASE"], ["mantenimiento lavandería industrial", "PHRASE"], ["mantenimiento de lavadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Refacciones Girbau y Gamesail", "grupos": [{"nombre": "Refacciones Girbau", "kw": [["refacciones girbau", "EXACT"], ["refacciones girbau", "PHRASE"], ["refacciones para lavadora girbau", "PHRASE"], ["refacciones para secadora girbau", "PHRASE"], ["partes girbau", "PHRASE"], ["refacciones girbau", "BROAD"]]}, {"nombre": "Refacciones Gamesail", "kw": [["refacciones gamesail", "EXACT"], ["refacciones gamesail", "PHRASE"], ["partes gamesail", "PHRASE"], ["refacciones gamesail", "BROAD"]]}]}, {"nombre": "AB · Servicio a secadoras", "grupos": [{"nombre": "Secadoras", "kw": [["reparación de secadoras industriales", "PHRASE"], ["servicio a secadoras industriales", "PHRASE"], ["mantenimiento de secadoras industriales", "PHRASE"], ["reparación secadoras industriales", "BROAD"]]}]}, {"nombre": "AB · Instalación", "grupos": [{"nombre": "Instalación", "kw": [["instalación de lavandería industrial", "PHRASE"], ["instalación de equipo de lavandería", "PHRASE"], ["instalación lavandería industrial", "BROAD"]]}]}, {"nombre": "AB · Servicio a lavanderías", "grupos": [{"nombre": "Pólizas", "kw": [["mantenimiento para lavandería de autoservicio", "PHRASE"], ["póliza de mantenimiento lavandería", "PHRASE"], ["mantenimiento lavandería autoservicio", "BROAD"]]}]}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var TIPOS = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function clave(texto, tipo) { return texto.toLowerCase() + '|' + tipo; }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('PALABRAS CLAVE NUEVAS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));

  var campanasRn = {};
  var itc = AdsApp.search("SELECT campaign.name, campaign.resource_name FROM campaign WHERE campaign.status != 'REMOVED'");
  while (itc.hasNext()) { var cc = itc.next().campaign; campanasRn[cc.name] = cc.resourceName; }
  var grupos = {};
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group.resource_name FROM ad_group ' +
    "WHERE ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var g = it.next();
    grupos[g.campaign.name + ' > ' + g.adGroup.name] = { rn: g.adGroup.resourceName, hay: {} };
  }
  var itk = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
    "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE " +
    "AND ad_group_criterion.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (itk.hasNext()) {
    var k = itk.next();
    var gr = grupos[k.campaign.name + ' > ' + k.adGroup.name];
    if (gr) gr.hay[clave(k.adGroupCriterion.keyword.text, k.adGroupCriterion.keyword.matchType)] = true;
  }

  var ops = [], donde = [], faltan = [], temporal = 0;

  // Exclusiones de la cuenta que faltan en la lista
  var lista = '', yaEnLista = {};
  var its = AdsApp.search("SELECT shared_set.resource_name, shared_set.name FROM shared_set " +
    "WHERE shared_set.status = 'ENABLED' AND shared_set.type = 'NEGATIVE_KEYWORDS'");
  while (its.hasNext()) { var ss = its.next().sharedSet; if (ss.name === PLAN.lista.nombre) lista = ss.resourceName; }
  if (!lista) {
    Logger.log('AVISO: no existe la lista «' + PLAN.lista.nombre + '». Las exclusiones no se agregan.');
  } else {
    var itn = AdsApp.search("SELECT shared_criterion.resource_name, shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion " +
      "WHERE shared_criterion.shared_set = '" + lista + "'");
    while (itn.hasNext()) {
      var sc = itn.next().sharedCriterion, kn = sc.keyword;
      if (kn) yaEnLista[clave(kn.text, kn.matchType)] = sc.resourceName || true;
    }
    // Exclusiones que el plan ya no quiere (por ejemplo, porque ahora esas búsquedas sí se atienden)
    (PLAN.quitar || []).forEach(function (w) {
      var rn = yaEnLista[clave(w[0], w[1])];
      if (typeof rn !== 'string') return;
      ops.push({ sharedCriterionOperation: { remove: rn } });
      donde.push('quitar la exclusión «' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') de la lista de la cuenta');
    });
    PLAN.lista.kw.forEach(function (w) {
      if (yaEnLista[clave(w[0], w[1])]) return;
      ops.push({ sharedCriterionOperation: { create: { sharedSet: lista, keyword: { text: w[0], matchType: w[1] } } } });
      donde.push('exclusión «' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en la lista de la cuenta');
    });
  }
  PLAN.campanas.forEach(function (c) {
    c.grupos.forEach(function (g) {
      var nombre = c.nombre + ' > ' + g.nombre;
      var gr = grupos[nombre];
      if (!gr && g.h && campanasRn[c.nombre]) {
        // Grupo nuevo en una campaña que ya existe: se crea con su anuncio y sus palabras clave
        var rnGrupo = 'customers/' + AdsApp.currentAccount().getCustomerId().replace(/-/g, '') + '/adGroups/' + (--temporal);
        ops.push({ adGroupOperation: { create: { resourceName: rnGrupo, campaign: campanasRn[c.nombre], name: g.nombre, status: 'ENABLED', type: 'SEARCH_STANDARD' } } });
        donde.push('grupo nuevo «' + nombre + '»');
        ops.push({ adGroupAdOperation: { create: { adGroup: rnGrupo, status: 'ENABLED', ad: { finalUrls: [g.url || PLAN.url],
          responsiveSearchAd: { headlines: g.h.map(function (t) { return { text: t }; }), descriptions: g.d.map(function (t) { return { text: t }; }),
            path1: g.p[0], path2: g.p[1] } } } } });
        donde.push('anuncio de «' + nombre + '» (' + g.h.length + ' títulos, ' + g.d.length + ' descripciones, a ' + (g.url || PLAN.url) + ')');
        gr = grupos[nombre] = { rn: rnGrupo, hay: {} };
      }
      if (!gr) { faltan.push(nombre); return; }
      g.kw.forEach(function (w) {
        if (gr.hay[clave(w[0], w[1])]) return;
        ops.push({ adGroupCriterionOperation: { create: { adGroup: gr.rn, status: 'ENABLED', keyword: { text: w[0], matchType: w[1] } } } });
        donde.push('«' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en ' + nombre);
      });
    });
  });
  faltan.forEach(function (n) { Logger.log('AVISO: no existe el grupo ' + n + ' (¿falta correr «crear-campanas.js»?). Se salta.'); });
  if (!ops.length) { Logger.log('Nada que agregar: las campañas ya tienen todas las palabras clave y exclusiones del plan.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    var otro = /^(quitar|grupo|anuncio)/.test(donde[i]);
    if (r.isSuccessful()) Logger.log((otro ? (vista ? 'SE HARÍA: ' : 'HECHO: ') : (vista ? 'SE AGREGARÍA ' : 'AGREGADA ')) + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) {
    Logger.log((ops.length - malos) + ' cambio(s) por hacer' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  } else {
    Logger.log('LISTO: ' + (ops.length - malos) + ' cambio(s) hechos' + (malos ? ', ' + malos + ' rechazadas por Google' : '') + '.');
  }
}

  main();
}

function paso4() {
/**
 * Atelback · Anuncios nuevos con las palabras que busca la gente — Servicio para Lavandería
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): agrega un anuncio nuevo, encendido,
 * en los grupos donde Google dice «anuncio poco relevante». Sus títulos repiten lo que la persona buscó. El anuncio que
 * ya está en el grupo se queda como está: no se pausa, no se edita y no se borra. Tampoco toca presupuestos, topes,
 * palabras clave ni páginas. Si el anuncio nuevo ya existe, no lo repite.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://servicioparalavanderias.com/", "anuncios": [{"campana": "AB · Reparación y mantenimiento", "grupo": "Reparación", "h": ["Reparación Lavadora Industrial", "Reparación de Lavadoras", "Lavadoras Industriales", "Reparamos tu Lavadora", "Técnicos en Reparación", "Reparación en tu Negocio", "Agenda tu Reparación", "Diagnóstico de tu Equipo", "Habla con un Técnico", "Servicio Técnico Industrial", "Cotiza por WhatsApp"], "d": ["Reparación de lavadoras industriales con técnicos en equipo industrial. Agenda tu visita.", "Reparamos lavadoras industriales de lavanderías, hoteles y hospitales.", "Escríbenos por WhatsApp: te damos diagnóstico y cotización de la reparación.", "Reparación de lavadora industrial y mantenimiento correctivo. Habla con un técnico."], "p": ["reparacion", "industrial"], "url": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales"}]}];
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

function firma(titulos) { return titulos.map(function (t) { return t.toLowerCase(); }).sort().join('|'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('ANUNCIOS NUEVOS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  if (!PLAN.anuncios.length) { Logger.log('Nada que agregar en esta cuenta.'); return; }

  var grupos = {};
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group.resource_name FROM ad_group ' +
    "WHERE ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var g = it.next();
    grupos[g.campaign.name + ' > ' + g.adGroup.name] = { rn: g.adGroup.resourceName, anuncios: 0, firmas: {} };
  }
  var ita = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad ' +
    "WHERE ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED'");
  while (ita.hasNext()) {
    var a = ita.next(), gr = grupos[a.campaign.name + ' > ' + a.adGroup.name];
    if (!gr) continue;
    gr.anuncios++;
    gr.firmas[firma(((a.adGroupAd.ad.responsiveSearchAd || {}).headlines || []).map(function (h) { return h.text; }))] = true;
  }

  var ops = [], donde = [];
  PLAN.anuncios.forEach(function (n) {
    var nombre = n.campana + ' > ' + n.grupo, gr = grupos[nombre];
    if (!gr) { Logger.log('AVISO: no existe el grupo ' + nombre + '. Se salta.'); return; }
    if (gr.firmas[firma(n.h)]) { Logger.log('«' + nombre + '»: el anuncio nuevo ya está. No se repite.'); return; }
    if (gr.anuncios >= 3) { Logger.log('AVISO «' + nombre + '»: ya tiene ' + gr.anuncios + ' anuncios (Google permite 3). Se salta.'); return; }
    ops.push({ adGroupAdOperation: { create: { adGroup: gr.rn, status: 'ENABLED', ad: { finalUrls: [n.url || PLAN.url],
      responsiveSearchAd: { headlines: n.h.map(function (t) { return { text: t }; }), descriptions: n.d.map(function (t) { return { text: t }; }),
        path1: n.p[0], path2: n.p[1] } } } } });
    donde.push('anuncio nuevo en «' + nombre + '» (' + n.h.length + ' títulos, ' + n.d.length + ' descripciones, a ' + (n.url || PLAN.url) +
      ') · títulos: ' + n.h.join(' · ') + ' · el anuncio que ya tenía se queda');
  });
  if (!ops.length) { Logger.log('Nada que agregar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) Logger.log((vista ? 'SE HARÍA: ' : 'HECHO: ') + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) Logger.log((ops.length - malos) + ' anuncio(s) por agregar' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  else Logger.log('LISTO: ' + (ops.length - malos) + ' anuncio(s) agregados' + (malos ? ', ' + malos + ' rechazados por Google' : '') +
    '. Google los revisa en unas horas; mañana el script «por qué no sale» dirá si mejoró la relevancia.');
}

  main();
}

function paso5() {
/**
 * Atelback · Ajustes — Servicio para Lavandería
 * Generado por campanas/generar.py a partir de campanas/plan.py (campo «ajustes» de cada cuenta). No se edita a mano.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): pausa las campañas anteriores
 * y las palabras clave que indica el plan, y pone a las campañas nuevas «AB ·» el presupuesto diario y el tope de costo
 * por clic que indica el plan.
 * Pausar se puede deshacer en cualquier momento y conserva el historial. No toca anuncios, topes ni páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (dice cuánto se gastaría) > EJECUTAR.
 */

var PLANES = [{"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "url": "https://servicioparalavanderias.com/", "ajustes": {"pausar_palabras": [["Servicio técnico industrial", "Servicio técnico", "técnico lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Reparación", "reparación lavadoras industriales", "BROAD"], ["Reparación y mantenimiento", "Mantenimiento preventivo", "mantenimiento lavadoras industriales", "BROAD"]], "presupuesto": {"Reparación y mantenimiento": 156, "Servicio técnico industrial": 75}}, "tambien": ["laundrysolutions.store"], "mensual": 8200}];
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
    FALLO = true;
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
var FALLO = false;   // si una revisión falla, no se enciende ninguna campaña anterior
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('AJUSTES · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var aj = PLAN.ajustes || {};
  var pausar = aj.pausar || [], presupuesto = aj.presupuesto || {}, palabras = aj.pausar_palabras || [], topes = aj.topes || {},
      arriba = aj.arriba || {}, activar = aj.activar || {}, presencia = aj.presencia || [];
  if (!pausar.length && !Object.keys(presupuesto).length && !palabras.length && !Object.keys(topes).length && !Object.keys(arriba).length &&
      !Object.keys(activar).length && !presencia.length) { Logger.log('Nada que ajustar en esta cuenta por ahora.'); return; }

  var C = {};
  filas('SELECT campaign.resource_name, campaign.name, campaign.status, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    'campaign.target_impression_share.location, campaign.target_impression_share.location_fraction_micros, ' +
    'campaign.target_impression_share.cpc_bid_ceiling_micros, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { rn: f.campaign.resourceName, presupuesto: f.campaignBudget.resourceName, puja: f.campaign.biddingStrategyType,
      tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6, cuota: f.campaign.targetImpressionShare || {},
      monto: Number(f.campaignBudget.amountMicros || 0) / 1e6, compartido: f.campaignBudget.explicitlyShared };
  });
  var antes = 0;
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });

  var ops = [], donde = [], que = [], despues = antes;
  function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; }
  var nuestra = sitio(PLAN.url), noEncendio = [];
  // El dominio que se deja al pasar al de siempre sigue siendo nuestro (en la misma corrida, el paso anterior ya los cambia)
  var tambien = (PLAN.tambien || []).map(function (d) { return d.replace(/^www\./, ''); });
  function otra(s) { return s !== nuestra && tambien.indexOf(s) < 0; }

  // Campañas anteriores que se vuelven a encender: solo si todos sus anuncios ya llevan a la página de la marca
  Object.keys(activar).forEach(function (n) {
    var monto = activar[n], f = filas("SELECT campaign.resource_name, campaign.status, campaign.advertising_channel_type, campaign_budget.resource_name, " +
      "campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign WHERE campaign.name = '" + n.replace(/'/g, "\\'") + "' AND campaign.status != 'REMOVED'", 'la campaña ' + n)[0];
    if (!f) { que.push('«' + n + '»: no existe en esta cuenta. Se salta.'); return; }
    if (f.campaign.status === 'ENABLED') { que.push('«' + n + '»: ya está encendida.'); return; }
    var malas = {};
    FALLO = false;
    filas("SELECT ad_group_ad.ad.final_urls FROM ad_group_ad WHERE campaign.resource_name = '" + f.campaign.resourceName + "' AND ad_group_ad.status = 'ENABLED' " +
      "AND ad_group.status = 'ENABLED'", 'los anuncios de ' + n).forEach(function (a) {
      (a.adGroupAd.ad.finalUrls || []).forEach(function (u) { if (otra(sitio(u))) malas[sitio(u) || '(sin dirección)'] = true; });
    });
    filas("SELECT asset_group.final_urls FROM asset_group WHERE campaign.resource_name = '" + f.campaign.resourceName + "' AND asset_group.status = 'ENABLED'",
      'los grupos de recursos de ' + n).forEach(function (a) {
      (a.assetGroup.finalUrls || []).forEach(function (u) { if (otra(sitio(u))) malas[sitio(u) || '(sin dirección)'] = true; });
    });
    // Enlaces de sitio y otros recursos de la campaña que llevan a una página
    filas("SELECT campaign.resource_name, asset.final_urls, campaign_asset.field_type FROM campaign_asset WHERE campaign.resource_name = '" + f.campaign.resourceName + "' " +
      "AND campaign_asset.status = 'ENABLED'", 'los enlaces de ' + n).forEach(function (a) {
      (a.asset.finalUrls || []).forEach(function (u) { if (otra(sitio(u))) malas[sitio(u) + ' (enlace de sitio u otro recurso)'] = true; });
    });
    if (FALLO) {
      que.push('NO SE ENCIENDE «' + n + '»: no se pudo revisar a dónde mandan todos sus anuncios y enlaces (ver arriba). Manda este registro.');
      noEncendio.push(n);
      return;
    }
    if (Object.keys(malas).length) {
      que.push('NO SE ENCIENDE «' + n + '»: todavía manda a ' + Object.keys(malas).join(', ') + ' y no a ' + nuestra + '. Primero hay que cambiarle la página.');
      noEncendio.push(n);
      return;
    }
    ops.push({ campaignOperation: { update: { resourceName: f.campaign.resourceName, status: 'ENABLED',
      geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE' } }, updateMask: 'status,geoTargetTypeSetting.positiveGeoTargetType' } });
    donde.push('encender «' + n + '»');
    if (f.campaignBudget.explicitlyShared) {
      que.push('ENCENDER «' + n + '» (manda a ' + nuestra + '; solo personas en México). AVISO: su presupuesto es compartido; revísalo a mano.');
    } else {
      ops.push({ campaignBudgetOperation: { update: { resourceName: f.campaignBudget.resourceName, amountMicros: Math.round(monto * 1e6) }, updateMask: 'amountMicros' } });
      donde.push('presupuesto de «' + n + '»');
      que.push('ENCENDER «' + n + '» con ' + dinero(monto) + ' al día (antes tenía ' + dinero(Number(f.campaignBudget.amountMicros || 0) / 1e6) +
        '; manda a ' + nuestra + '; solo personas en México)');
    }
    despues += monto;
  });
  // Campañas encendidas que deben mostrarse solo a personas que están en México
  presencia.forEach(function (n) {
    var c = C[n];
    if (!c) return;
    ops.push({ campaignOperation: { update: { resourceName: c.rn, geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE' } },
      updateMask: 'geoTargetTypeSetting.positiveGeoTargetType' } });
    donde.push('zona de «' + n + '»');
    que.push('ZONA «' + n + '»: solo personas que están en México (antes también «interesadas» desde otros países)');
  });
  pausar.forEach(function (n) {
    var c = C[n];
    if (!c) { que.push('«' + n + '»: no está encendida (ya en pausa o con otro nombre). Se salta.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, status: 'PAUSED' }, updateMask: 'status' } });
    donde.push('pausa de «' + n + '»');
    que.push('PAUSAR «' + n + '» (gastaba hasta ' + dinero(c.monto) + ' al día)');
    despues -= c.monto;
  });
  if (palabras.length) {
    var kws = {};
    filas('SELECT campaign.name, ad_group.name, ad_group_criterion.resource_name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
      "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
      "AND campaign.status != 'REMOVED' AND ad_group.status != 'REMOVED'", 'las palabras clave').forEach(function (f) {
      var k = f.adGroupCriterion.keyword;
      kws[[f.campaign.name, f.adGroup.name, k.text.toLowerCase(), k.matchType].join('|')] = f.adGroupCriterion.resourceName;
    });
    palabras.forEach(function (w) {
      var nombre = PLAN.prefijo + w[0] + ' > ' + w[1], rn = kws[[PLAN.prefijo + w[0], w[1], w[2].toLowerCase(), w[3]].join('|')];
      if (!rn) { que.push('«' + w[2] + '» en ' + nombre + ': no está encendida. Se salta.'); return; }
      ops.push({ adGroupCriterionOperation: { update: { resourceName: rn, status: 'PAUSED' }, updateMask: 'status' } });
      donde.push('pausa de la palabra «' + w[2] + '»');
      que.push('PAUSAR PALABRA «' + w[2] + '» en ' + nombre);
    });
  }
  Object.keys(topes).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevoTope = topes[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja !== 'TARGET_SPEND') { que.push('AVISO «' + n + '»: no puja por clics con tope (' + c.puja + '). Se salta.'); return; }
    if (c.tope >= nuevoTope) { que.push('«' + n + '»: su tope ya es $' + c.tope + ' o más.'); return; }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(nuevoTope * 1e6) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    donde.push('tope CPC de «' + n + '»');
    que.push('TOPE CPC «' + n + '»: $' + c.tope + ' → $' + nuevoTope + ' (entra a más subastas; no cambia el presupuesto)');
  });
  // Campañas que deben salir hasta arriba: «Cuota de impresiones objetivo», parte superior absoluta de la página
  Object.keys(arriba).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], a = arriba[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (c.puja === 'TARGET_IMPRESSION_SHARE' && c.cuota.location === 'ABSOLUTE_TOP_OF_PAGE' &&
        Math.round(Number(c.cuota.locationFractionMicros || 0) / 1e4) === Math.round(a.cuota * 100) &&
        Math.round(Number(c.cuota.cpcBidCeilingMicros || 0) / 1e6) === a.tope) {
      que.push('«' + n + '»: ya pide salir hasta arriba el ' + Math.round(a.cuota * 100) + '% de las veces con tope $' + a.tope + '.');
      return;
    }
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetImpressionShare: { location: 'ABSOLUTE_TOP_OF_PAGE',
      locationFractionMicros: Math.round(a.cuota * 1e6), cpcBidCeilingMicros: Math.round(a.tope * 1e6) } }, updateMask: 'targetImpressionShare.location,targetImpressionShare.locationFractionMicros,targetImpressionShare.cpcBidCeilingMicros' } });
    donde.push('puja para salir arriba en «' + n + '»');
    que.push('SALIR ARRIBA «' + n + '»: de «maximizar clics» (tope $' + c.tope + ') a «salir hasta arriba el ' + Math.round(a.cuota * 100) +
      '% de las veces», pagando como máximo $' + a.tope + ' por clic. El presupuesto no cambia.');
  });
  Object.keys(presupuesto).forEach(function (corto) {
    var n = PLAN.prefijo + corto, c = C[n], nuevo = presupuesto[corto];
    if (!c) { que.push('«' + n + '»: no está encendida. Se salta.'); return; }
    if (Math.round(c.monto) === Math.round(nuevo)) { que.push('«' + n + '»: ya tiene ' + dinero(nuevo) + ' al día.'); return; }
    // Las bajadas pagan las campañas que se encienden: si alguna no se encendió, no se baja nada
    if (nuevo < c.monto && noEncendio.length) { que.push('«' + n + '»: se queda en ' + dinero(c.monto) + ' (iba a bajar para pagar «' + noEncendio.join('», «') + '», que no se encendió).'); return; }
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
  // Nunca por encima del tope mensual acordado de la cuenta (1% de margen por redondeo)
  if (PLAN.mensual && despues * DIAS_MES > PLAN.mensual * 1.01) {
    throw new Error('Con estos cambios la cuenta quedaría en ' + dinero(despues * DIAS_MES) + ' al mes, arriba de su tope de ' +
      dinero(PLAN.mensual) + '. No se cambió nada: manda el registro.');
  }

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

  main();
}

function main() {
  Logger.log('');
  Logger.log('########## PASO 1 DE 5 · ANUNCIOS Y SECCIONES A SERVICIOPARALAVANDERIAS.COM ##########');
  try { paso1(); } catch (e) {
    Logger.log('ERROR en el paso 1: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 2 DE 5 · ENLACES DE SITIO A SERVICIOPARALAVANDERIAS.COM ##########');
  try { paso2(); } catch (e) {
    Logger.log('ERROR en el paso 2: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 3 DE 5 · EXCLUSIONES Y PALABRAS CLAVE ##########');
  try { paso3(); } catch (e) {
    Logger.log('ERROR en el paso 3: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 4 DE 5 · ANUNCIOS NUEVOS ##########');
  try { paso4(); } catch (e) {
    Logger.log('ERROR en el paso 4: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 5 DE 5 · PRESUPUESTOS Y CAMPAÑAS QUE SÍ TRAEN CONTACTOS ##########');
  try { paso5(); } catch (e) {
    Logger.log('ERROR en el paso 5: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('LISTO: se corrieron los 5 pasos. Copia todo el registro y mándalo.');
}
