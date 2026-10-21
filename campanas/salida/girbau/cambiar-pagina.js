/**
 * Atelback · Cambiar la página de destino de las campañas nuevas — Girbau (860-582-6837)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: en todas las campañas de la cuenta, los anuncios activos que van a otra página:
 *   - los adaptables de búsqueda se cambian a la página del plan (si venían de una versión anterior del mismo
 *     sitio, se conserva la sección, por ejemplo /mangles/…);
 *   - los de otro tipo, que ya no se pueden editar, se pausan.
 * Así cada grupo queda con un solo sitio web, como exige Google. Deja en el registro el estado de aprobación
 * de cada anuncio y, si Google lo rechazó, el motivo. No toca textos, palabras clave ni presupuestos.
 *
 * CÓMO SE USA (dentro de la cuenta): pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 * Al cambiar la URL, Google vuelve a revisar los anuncios (suele tardar de unas horas a un día).
 */

var PLAN = {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://supliese-girbau-lavadoras.vercel.app/", "prefijo": "AB · ", "mismo_sitio": []};

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

// Si el anuncio venía de una versión anterior del mismo sitio (PLAN.mismo_sitio), se conserva la sección.
function urlNueva(url) {
  var m = /^https?:\/\/([^\/?#]+)([^?#]*)/i.exec(url || '');
  if (m && (PLAN.mismo_sitio || []).indexOf(sitio(url)) >= 0 && m[2] && m[2] !== '/') {
    return PLAN.url.replace(/\/+$/, '') + m[2];
  }
  return PLAN.url;
}

function main() {
  revisarCuenta();
  Logger.log('Página nueva: ' + PLAN.url);
  var ops = [], donde = [], yaBien = 0;
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.resource_name, ad_group_ad.ad.resource_name, ' +
    'ad_group_ad.ad.type, ad_group_ad.ad.final_urls, ad_group_ad.policy_summary.approval_status, ' +
    'ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad ' +
    "WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var f = it.next();
    var nombre = f.campaign.name + ' > ' + f.adGroup.name;
    var pol = f.adGroupAd.policySummary || {};
    var motivos = (pol.policyTopicEntries || []).map(function (e) { return e.topic + (e.type ? ' (' + e.type + ')' : ''); });
    Logger.log(nombre + ' · aprobación: ' + (pol.approvalStatus || 'sin dato') + (motivos.length ? ' · motivos: ' + motivos.join(', ') : ''));
    var url = (f.adGroupAd.ad.finalUrls || [])[0] || '';
    if (sitio(url) === sitio(PLAN.url)) { yaBien++; continue; }
    if (f.adGroupAd.ad.type === 'RESPONSIVE_SEARCH_AD') {
      var nueva = urlNueva(url);
      ops.push({ adOperation: { update: { resourceName: f.adGroupAd.ad.resourceName, finalUrls: [nueva] }, updateMask: 'finalUrls' } });
      donde.push('CAMBIAR ' + nombre + ': ' + url + ' → ' + nueva);
    } else {
      ops.push({ adGroupAdOperation: { update: { resourceName: f.adGroupAd.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
      donde.push('PAUSAR ' + nombre + ' (anuncio ' + f.adGroupAd.ad.type + ' a ' + url + ', no se puede editar)');
    }
  }
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
