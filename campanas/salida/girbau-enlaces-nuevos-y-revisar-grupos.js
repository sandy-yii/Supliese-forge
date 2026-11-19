// GIRBAU - enlaces nuevos en Maximo rendimiento + revisar por que 2 grupos salen limitados (19 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR (o dentro de Girbau).
// PARTE 1 (cambia, con OK): los 3 enlaces (sitelinks) de "Max Rendimiento - Girbau" rechazados por
//   "Destino no operativo" son de cuando la pagina estaba caida. Sus secciones YA existen y abren.
//   Este script crea una copia NUEVA de cada uno (mismo texto, misma seccion) para que Google la revise de nuevo.
//   Los viejos se quedan como estan (no se borran ni se pausan).
//   Candados: solo crea la copia si la pagina abre (200) Y la seccion existe en la pagina; maximo 20 enlaces
//   en la campana; si ya hubo un cambio HOY en Girbau, no crea nada.
// PARTE 2 (solo lee): para los grupos de recursos LIMITADOS muestra cada foto, texto y logo y si Google
//   lo tiene rechazado o limitado y por que. Con eso armamos el arreglo de fotos de otro dia.
// VISTA PREVIA: no cambia nada. EJECUTAR (con el OK): solo crea los enlaces nuevos.
// DESHACER: copia en DESHACER la lista que imprime "PARA DESHACER" y Ejecutar: quita los enlaces nuevos.
var CUENTA = '860-582-6837';
var CAMPANA = 'Max Rendimiento - Girbau';
var DESHACER = [];

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Girbau (' + CUENTA + '). No se hizo nada.'); return;
  }
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('GIRBAU - ENLACES Y GRUPOS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  if (DESHACER.length) { quitar(vista); return; }
  enlaces(vista);
  Logger.log('');
  grupos();
  Logger.log('');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
var paginas = {};
function pagina(url) {
  var base = url.split('#')[0];
  if (!(base in paginas)) {
    var r = { codigo: 0, html: '' };
    try { var x = UrlFetchApp.fetch(base, { muteHttpExceptions: true, followRedirects: true }); r.codigo = x.getResponseCode(); r.html = x.getContentText(); }
    catch (e) { r.codigo = 0; }
    paginas[base] = r;
  }
  return paginas[base];
}
function temas(ps) { return ((ps || {}).policyTopicEntries || []).map(function (t) { return t.topic; }).join(', '); }

function enlaces(vista) {
  Logger.log('==== PARTE 1. ENLACES DE "' + CAMPANA + '" ====');
  var cid = AdsApp.currentAccount().getCustomerId().replace(/-/g, '');
  var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var filas = leer("SELECT campaign.name, campaign.status, campaign.resource_name, asset.resource_name, asset.sitelink_asset.link_text, " +
    "asset.sitelink_asset.description1, asset.sitelink_asset.description2, asset.final_urls, asset.policy_summary.approval_status, " +
    "asset.policy_summary.policy_topic_entries FROM campaign_asset WHERE campaign.status = 'ENABLED' AND campaign_asset.status = 'ENABLED' " +
    "AND campaign_asset.field_type = 'SITELINK'").filter(function (r) { return r.campaign.name === CAMPANA; });
  if (!filas.length) { Logger.log('  No encontre enlaces en esa campana.'); return; }
  var campRn = filas[0].campaign.resourceName, total = filas.length, ops = [], textos = [], n = 0;
  filas.forEach(function (r) {
    var a = r.asset || {}, s = a.sitelinkAsset || {}, ps = a.policySummary || {}, url = (a.finalUrls || [])[0] || '';
    Logger.log('  "' + s.linkText + '" | ' + (ps.approvalStatus || '?') + (temas(ps) ? ' (' + temas(ps) + ')' : '') + ' | ' + url);
    if (ps.approvalStatus !== 'DISAPPROVED') return;
    var p = pagina(url), ancla = url.indexOf('#') >= 0 ? url.split('#')[1] : '';
    var existe = !ancla || p.html.indexOf('id="' + ancla + '"') >= 0;
    Logger.log('     pagina: ' + p.codigo + (ancla ? ' | seccion #' + ancla + (existe ? ' SI existe' : ' NO existe') : ''));
    if (p.codigo !== 200 || !existe) { Logger.log('     No se copia: la pagina o la seccion no abre. Hay que verlo con Rodolfo.'); return; }
    if (total + n + 1 > 20) { Logger.log('     No se copia: la campana ya tiene 20 enlaces.'); return; }
    n++;
    var tmp = 'customers/' + cid + '/assets/-' + n, sl = { linkText: s.linkText };
    if (s.description1) sl.description1 = s.description1;
    if (s.description2) sl.description2 = s.description2;
    ops.push({ assetOperation: { create: { resourceName: tmp, sitelinkAsset: sl, finalUrls: [url] } } });
    ops.push({ campaignAssetOperation: { create: { campaign: campRn, asset: tmp, fieldType: 'SITELINK' } } });
    textos.push('crear enlace "' + s.linkText + '"', 'ponerlo en la campana');
    Logger.log('     ' + (vista ? 'crearia' : 'crea') + ' una copia nueva (mismo texto y seccion).');
  });
  if (!ops.length) { Logger.log('  Nada que copiar.'); return; }
  if (!vista) {
    var ch = leer("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20");
    if (ch.length) { Logger.log('  ALTO: ya hubo un cambio HOY en Girbau. No se creo nada. Correlo manana.'); return; }
  }
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), quitar = [];
  for (var i = 0; i < res.length; i++) {
    if (!res[i].isSuccessful()) Logger.log('  ERROR ' + textos[i] + ': ' + res[i].getErrorMessages().join('; '));
    else if (!vista) {
      Logger.log('  LISTO ' + textos[i]);
      if (ops[i].campaignAssetOperation) quitar.push("'" + res[i].getResourceName() + "'");
    }
  }
  if (vista) Logger.log('  (Revisado por Google: se puede aplicar.)');
  if (quitar.length) Logger.log('PARA DESHACER: var DESHACER = [' + quitar.join(', ') + '];');
}

function quitar(vista) {
  var ops = DESHACER.map(function (rn) { return { campaignAssetOperation: { remove: rn } }; });
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  for (var i = 0; i < res.length; i++)
    Logger.log((res[i].isSuccessful() ? (vista ? 'se quitaria ' : 'QUITADO ') : 'ERROR ') + DESHACER[i] +
      (res[i].isSuccessful() ? '' : ': ' + res[i].getErrorMessages().join('; ')));
  Logger.log('FIN.');
}

function grupos() {
  Logger.log('==== PARTE 2. GRUPOS DE RECURSOS LIMITADOS (solo lee) ====');
  var lim = {};
  leer("SELECT campaign.status, asset_group.resource_name, asset_group.name, asset_group.primary_status, asset_group.primary_status_reasons, asset_group.final_urls " +
    "FROM asset_group WHERE campaign.status = 'ENABLED' AND asset_group.status = 'ENABLED'").forEach(function (r) {
      var g = r.assetGroup;
      if (g.primaryStatus === 'ELIGIBLE') return;
      lim[g.resourceName] = { nombre: g.name, cuenta: {} };
      Logger.log('  > ' + g.name + ' | ' + g.primaryStatus + ' (' + (g.primaryStatusReasons || []).join(', ') + ') | pagina: ' + (g.finalUrls || []).join(' '));
    });
  if (!Object.keys(lim).length) { Logger.log('  Ningun grupo limitado.'); return; }
  var q1 = "SELECT campaign.status, asset_group.resource_name, asset.type, asset.name, asset.text_asset.text, asset.image_asset.full_size.width_pixels, " +
    "asset.image_asset.full_size.height_pixels, asset_group_asset.field_type, asset_group_asset.primary_status, asset_group_asset.primary_status_reasons, " +
    "asset_group_asset.policy_summary.approval_status, asset_group_asset.policy_summary.policy_topic_entries FROM asset_group_asset " +
    "WHERE asset_group_asset.status = 'ENABLED' AND campaign.status = 'ENABLED'";
  var filas;
  try { filas = leer(q1); }
  catch (e) {
    Logger.log('  (Lectura corta: ' + e.message + ')');
    filas = leer("SELECT campaign.status, asset_group.resource_name, asset.type, asset.name, asset.text_asset.text, asset_group_asset.field_type, " +
      "asset.policy_summary.approval_status, asset.policy_summary.policy_topic_entries FROM asset_group_asset " +
      "WHERE asset_group_asset.status = 'ENABLED' AND campaign.status = 'ENABLED'");
  }
  filas.forEach(function (r) {
    var g = lim[r.assetGroup.resourceName]; if (!g) return;
    var aga = r.assetGroupAsset || {}, a = r.asset || {}, ps = aga.policySummary || a.policySummary || {};
    var tipo = aga.fieldType, est = ps.approvalStatus || aga.primaryStatus || '?';
    g.cuenta[tipo] = (g.cuenta[tipo] || 0) + 1;
    var malo = est === 'DISAPPROVED' || est === 'APPROVED_LIMITED' || est === 'LIMITED' || est === 'NOT_ELIGIBLE' || temas(ps);
    if (!malo) return;
    var img = a.imageAsset && a.imageAsset.fullSize ? ' ' + a.imageAsset.fullSize.widthPixels + 'x' + a.imageAsset.fullSize.heightPixels : '';
    Logger.log('     ' + g.nombre + ' | ' + tipo + ' | ' + (a.name || (a.textAsset || {}).text || a.type) + img + ' | ' + est +
      (temas(ps) ? ' | ' + temas(ps) : '') + ((aga.primaryStatusReasons || []).length ? ' | ' + aga.primaryStatusReasons.join(', ') : ''));
  });
  Object.keys(lim).forEach(function (k) {
    var g = lim[k], c = g.cuenta;
    Logger.log('  ' + g.nombre + ' tiene: ' + Object.keys(c).map(function (t) { return t + ' ' + c[t]; }).join(', '));
  });
}
