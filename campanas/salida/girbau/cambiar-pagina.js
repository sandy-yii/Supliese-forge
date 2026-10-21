/**
 * Atelback · Cambiar la página de destino de las campañas nuevas — Girbau (860-582-6837)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: en las campañas nuevas «AB ·», cambia la URL final de los anuncios a la página del plan.
 * También deja en el registro el estado de aprobación de cada anuncio y, si Google lo rechazó, el motivo.
 * No toca textos, palabras clave, presupuestos ni campañas anteriores.
 *
 * CÓMO SE USA (dentro de la cuenta): pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 * Al cambiar la URL, Google vuelve a revisar los anuncios (suele tardar de unas horas a un día).
 */

var PLAN = {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://supliese-girbau-lavadoras.vercel.app/", "prefijo": "AB · "};

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

// Página sin www, sin parámetros y sin la diagonal final.
function pagina(url) {
  var m = /^https?:\/\/([^\/?#]+)([^?#]*)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') + m[2].replace(/\/+$/, '') : '';
}

function main() {
  revisarCuenta();
  Logger.log('Página nueva: ' + PLAN.url);
  var destino = pagina(PLAN.url);
  var ops = [], donde = [], yaBien = 0, otros = 0;
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.ad.resource_name, ad_group_ad.ad.type, ' +
    'ad_group_ad.ad.final_urls, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.policy_topic_entries ' +
    "FROM ad_group_ad WHERE ad_group_ad.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var f = it.next();
    if (f.campaign.name.indexOf(PLAN.prefijo) !== 0) continue;
    var nombre = f.campaign.name + ' > ' + f.adGroup.name;
    var pol = f.adGroupAd.policySummary || {};
    var motivos = (pol.policyTopicEntries || []).map(function (e) { return e.topic + (e.type ? ' (' + e.type + ')' : ''); });
    Logger.log(nombre + ' · aprobación: ' + (pol.approvalStatus || 'sin dato') + (motivos.length ? ' · motivos: ' + motivos.join(', ') : ''));
    var url = (f.adGroupAd.ad.finalUrls || [])[0] || '';
    if (pagina(url) === destino) { yaBien++; continue; }
    if (f.adGroupAd.ad.type !== 'RESPONSIVE_SEARCH_AD') { otros++; continue; }
    ops.push({ adOperation: { update: { resourceName: f.adGroupAd.ad.resourceName, finalUrls: [PLAN.url] }, updateMask: 'finalUrls' } });
    donde.push(nombre + ': ' + url + ' → ' + PLAN.url);
  }
  donde.forEach(function (d) { Logger.log('CAMBIAR ' + d); });
  if (yaBien) Logger.log(yaBien + ' anuncio(s) ya van a la página nueva.');
  if (otros) Logger.log('AVISO: ' + otros + ' anuncio(s) de otro tipo no se pueden cambiar con este script; cámbialos a mano.');
  if (!ops.length) { Logger.log('No hay anuncios que cambiar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  if (AdsApp.getExecutionInfo().isPreview()) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                     : 'VISTA PREVIA SIN ERRORES. Da EJECUTAR para cambiar ' + ops.length + ' anuncio(s).');
  } else {
    Logger.log((ops.length - malos) + ' anuncio(s) cambiados' + (malos ? ', ' + malos + ' con error' : '') +
      '. Google los vuelve a revisar; suele tardar de unas horas a un día.');
  }
}
