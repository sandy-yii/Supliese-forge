/**
 * Atelback · Pasar los anuncios a supliese.com — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): corre, en este orden, los
 * mismos pasos que los scripts sueltos:
 *   1. Anuncios y secciones a supliese.com
 *   2. Enlaces de sitio a supliese.com
 * Primero las exclusiones, para que el presupuesto que sube no se vaya en búsquedas que no sirven.
 * Si un paso falla, se detiene ahí y no corre los siguientes.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (cada paso dice qué haría) > EJECUTAR.
 * En la vista previa cada paso ve la cuenta como está hoy; al ejecutar, cada uno ve lo que dejó el anterior.
 */

function paso1() {
/**
 * Atelback · Cambiar la página de destino de las campañas nuevas — Quick Laundry (cuenta Supliese Gómez) (256-397-2201)
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

var PLAN = {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://supliese.com/", "prefijo": "AB · ", "paginas": {"AB · Autoservicio y monedas > Autoservicio": "https://supliese.com/lavadoras-de-monedas"}, "telefono": "33 2601 2237", "mismo_sitio": ["quicklaundry.store"]};

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
 * Atelback · Corregir lo que marcó la auditoría — Quick Laundry (cuenta Supliese Gómez)
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

var PLANES = [{"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://supliese.com/", "prefijo": "AB · ", "paginas": {"AB · Autoservicio y monedas > Autoservicio": "https://supliese.com/lavadoras-de-monedas"}, "subir_topes": false, "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y la marca, hasta el tope)", "fijos": ["Emprendimiento", "Autoservicio y monedas", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}];
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

function main() {
  Logger.log('');
  Logger.log('########## PASO 1 DE 2 · ANUNCIOS Y SECCIONES A SUPLIESE.COM ##########');
  try { paso1(); } catch (e) {
    Logger.log('ERROR en el paso 1: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('########## PASO 2 DE 2 · ENLACES DE SITIO A SUPLIESE.COM ##########');
  try { paso2(); } catch (e) {
    Logger.log('ERROR en el paso 2: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');
    return;
  }
  Logger.log('');
  Logger.log('LISTO: se corrieron los 2 pasos. Copia todo el registro y mándalo.');
}
