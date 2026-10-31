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

var PLAN = {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "paginas": {"AB · Autoservicio y monedas > Autoservicio": "https://quicklaundry.store/lavadoras-de-monedas"}, "telefono": "33 2601 2237", "mismo_sitio": []};

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
