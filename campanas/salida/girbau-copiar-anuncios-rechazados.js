// GIRBAU - anuncio NUEVO al lado de cada anuncio rechazado por "destino no operativo" (19 nov 2026)
// POR QUE: los 3 anuncios rechazados (Marca Girbau, Capacidad, Sector) llevan a https://girbauoccidente.com/,
// que ya abre (200 probado desde Google), y otros 2 anuncios con la MISMA pagina ya estan aprobados.
// El rechazo es de cuando la pagina no abria. Un anuncio nuevo se revisa desde cero (normalmente en horas).
// QUE HACE: copia cada anuncio rechazado (mismos titulos, descripciones y pagina) y solo cambia la ruta visible
// (ej. girbauoccidente.com/Girbau/Cotiza). NO borra, NO pausa y NO edita los anuncios que ya estan.
// CANDADOS: solo si la pagina abre (200) desde Google; solo si el grupo tiene menos de 3 anuncios activos;
//   si ya hubo un cambio HOY en Girbau, en Ejecutar no hace nada.
// VISTA PREVIA: muestra que copiaria. EJECUTAR (con el OK): crea las copias.
// DESHACER: pega en DESHACER la lista que imprime "PARA DESHACER" y Ejecutar: quita solo esas copias.
var CUENTA = '860-582-6837';
var DESHACER = [];

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Girbau (' + CUENTA + '). No se hizo nada.'); return;
  }
  correr();
}

function abre(url) {
  try { return UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true }).getResponseCode() === 200; } catch (e) { return false; }
}
function textos(lista) {
  return (lista || []).map(function (t) { var o = { text: t.text }; if (t.pinnedField) o.pinnedField = t.pinnedField; return o; });
}

function correr() {
  var vista = AdsApp.getExecutionInfo().isPreview(), tz = AdsApp.currentAccount().getTimeZone();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  if (DESHACER.length) {
    Logger.log('GIRBAU - DESHACER COPIAS' + (vista ? ' (VISTA PREVIA)' : ' (EJECUTAR)'));
    var ops = DESHACER.map(function (rn) { return { adGroupAdOperation: { remove: rn } }; });
    DESHACER.forEach(function (rn) { Logger.log('  quitaria: ' + rn); });
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      Logger.log((r.isSuccessful() ? '  LISTO ' : '  ERROR ') + DESHACER[i] + (r.isSuccessful() ? '' : ': ' + r.getErrorMessages().join('; ')));
    });
    return;
  }
  Logger.log('GIRBAU - COPIAR ANUNCIOS RECHAZADOS' + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var activos = {};
  var a = AdsApp.search("SELECT ad_group.resource_name FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
    "AND campaign.status = 'ENABLED' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'");
  while (a.hasNext()) { var g = a.next().adGroup.resourceName; activos[g] = (activos[g] || 0) + 1; }

  var ops = [], nombres = [];
  var it = AdsApp.search("SELECT campaign.name, ad_group.name, ad_group.resource_name, ad_group_ad.ad.final_urls, " +
    "ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions, " +
    "ad_group_ad.ad.responsive_search_ad.path1, ad_group_ad.ad.responsive_search_ad.path2, " +
    "ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad " +
    "WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED' " +
    "AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'");
  while (it.hasNext()) {
    var r = it.next(), aga = r.adGroupAd, ps = aga.policySummary || {};
    if (ps.approvalStatus !== 'DISAPPROVED') continue;
    var temas = (ps.policyTopicEntries || []).map(function (t) { return t.topic; });
    var nombre = r.campaign.name + ' > ' + r.adGroup.name;
    Logger.log('> ' + nombre + ' | rechazado: ' + temas.join(', '));
    if (temas.indexOf('DESTINATION_NOT_WORKING') < 0) { Logger.log('   Rechazado por otro motivo: no se copia.'); continue; }
    var ad = aga.ad || {}, rsa = ad.responsiveSearchAd || {}, urls = ad.finalUrls || [];
    if (!urls.length || !urls.every(abre)) { Logger.log('   La pagina NO abre desde Google: no se copia (' + urls.join(' ') + ').'); continue; }
    if ((activos[r.adGroup.resourceName] || 0) >= 3) { Logger.log('   El grupo ya tiene 3 anuncios activos: no se copia.'); continue; }
    var p1 = rsa.path1 || 'Girbau', p2 = (rsa.path2 === 'Cotiza') ? 'Mexico' : 'Cotiza';
    ops.push({ adGroupAdOperation: { create: { adGroup: r.adGroup.resourceName, status: 'ENABLED', ad: {
      finalUrls: urls, responsiveSearchAd: { headlines: textos(rsa.headlines), descriptions: textos(rsa.descriptions), path1: p1, path2: p2 } } } } });
    nombres.push(nombre);
    Logger.log('   ' + (vista ? 'crearia' : 'crea') + ' copia: ' + (rsa.headlines || []).length + ' titulos, ' + (rsa.descriptions || []).length +
      ' descripciones, pagina ' + urls.join(' ') + ', ruta /' + p1 + '/' + p2 + ' (antes /' + (rsa.path1 || '') + '/' + (rsa.path2 || '') + ')');
  }
  Logger.log('');
  if (!ops.length) { Logger.log('Nada que copiar.'); return; }
  if (!vista) {
    var ch = AdsApp.search("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20");
    if (ch.hasNext()) { Logger.log('ALTO: ya hubo un cambio HOY en Girbau. No se aplico nada. Correlo manana.'); return; }
  }
  var hechos = [];
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (res, i) {
    if (!res.isSuccessful()) Logger.log('ERROR ' + nombres[i] + ': ' + res.getErrorMessages().join('; '));
    else if (!vista) { Logger.log('LISTO ' + nombres[i]); hechos.push("'" + res.getResourceName() + "'"); }
  });
  if (hechos.length) Logger.log('PARA DESHACER: var DESHACER = [' + hechos.join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Google revisa los anuncios nuevos (normalmente en horas). Mandame el registro.');
}
