// GIRBAU - a que pagina lleva cada anuncio y si abre (solo lee, 19 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR (o dentro de Girbau). VISTA PREVIA. No cambia nada.
// Para cada anuncio y grupo de recursos: su direccion final, si Google la tiene rechazada, y si la pagina abre
// probandola desde los servidores de Google (codigo 200 = abre; 404 = no existe; 0 = no responde).
var CUENTA = '860-582-6837';
var probadas = {};

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Girbau (' + CUENTA + '). No se hizo nada.'); return;
  }
  revisar();
}

function codigo(url) {
  if (url in probadas) return probadas[url];
  var c = 0;
  try { c = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true }).getResponseCode(); } catch (e) { c = 0; }
  probadas[url] = c; return c;
}
function leer(q, que, f) {
  try { var it = AdsApp.search(q); while (it.hasNext()) f(it.next()); }
  catch (e) { Logger.log('(No se pudo leer ' + que + ': ' + e.message + ')'); }
}

function revisar() {
  Logger.log('GIRBAU - PAGINAS DE LOS ANUNCIOS (solo lee)');
  Logger.log('');
  Logger.log('==== 1. ANUNCIOS ====');
  leer("SELECT campaign.name, ad_group.name, ad_group_ad.ad.final_urls, ad_group_ad.policy_summary.approval_status FROM ad_group_ad " +
    "WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND ad_group_ad.status = 'ENABLED'", 'los anuncios', function (r) {
      var urls = (r.adGroupAd.ad || {}).finalUrls || [];
      Logger.log('  ' + r.campaign.name + ' > ' + r.adGroup.name + ' | ' + ((r.adGroupAd.policySummary || {}).approvalStatus || '?'));
      urls.forEach(function (u) { Logger.log('     ' + u + '  ->  ' + codigo(u)); });
    });
  Logger.log('');
  Logger.log('==== 2. GRUPOS DE RECURSOS (MAXIMO RENDIMIENTO) ====');
  leer("SELECT campaign.name, asset_group.name, asset_group.final_urls, asset_group.primary_status FROM asset_group " +
    "WHERE campaign.status = 'ENABLED' AND asset_group.status = 'ENABLED'", 'los grupos de recursos', function (r) {
      var g = r.assetGroup;
      Logger.log('  ' + g.name + ' | ' + g.primaryStatus);
      (g.finalUrls || []).forEach(function (u) { Logger.log('     ' + u + '  ->  ' + codigo(u)); });
    });
  Logger.log('');
  Logger.log('==== 3. ENLACES (SITELINKS) ====');
  leer("SELECT campaign.name, campaign.status, asset.sitelink_asset.link_text, asset.final_urls, asset.policy_summary.approval_status FROM campaign_asset " +
    "WHERE campaign.status = 'ENABLED' AND campaign_asset.status = 'ENABLED' AND campaign_asset.field_type = 'SITELINK'", 'los enlaces', function (r) {
      var a = r.asset || {};
      (a.finalUrls || []).forEach(function (u) {
        Logger.log('  ' + r.campaign.name + ' | "' + ((a.sitelinkAsset || {}).linkText || '?') + '" | ' + ((a.policySummary || {}).approvalStatus || '?') + ' | ' + u + '  ->  ' + codigo(u));
      });
    });
  Logger.log('');
  Logger.log('FIN. Este script no cambio nada. Mandame el registro.');
}
