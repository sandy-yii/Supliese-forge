// GIRBAU - estan aprobados los anuncios? (solo lee, 19 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR (o dentro de Girbau). VISTA PREVIA. No cambia nada.
// Muestra: estado de cada campana, cada anuncio (aprobado / rechazado / en revision y por que),
// los grupos de recursos de Maximo rendimiento y las extensiones rechazadas.
var CUENTA = '860-582-6837';

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

function leer(q, que, f) {
  try { var it = AdsApp.search(q); while (it.hasNext()) f(it.next()); }
  catch (e) { Logger.log('(No se pudo leer ' + que + ': ' + e.message + ')'); }
}
function temas(ps) { return ((ps || {}).policyTopicEntries || []).map(function (t) { return t.topic; }).join(', '); }

function revisar() {
  Logger.log('GIRBAU - APROBACION DE ANUNCIOS (solo lee)');
  Logger.log('');
  Logger.log('==== 1. CAMPANAS ====');
  leer("SELECT campaign.name, campaign.primary_status, campaign.primary_status_reasons FROM campaign WHERE campaign.status = 'ENABLED'", 'las campanas', function (r) {
    var c = r.campaign;
    Logger.log('  ' + c.name + ' | ' + c.primaryStatus + ((c.primaryStatusReasons || []).length ? ' (' + c.primaryStatusReasons.join(', ') + ')' : ''));
  });
  Logger.log('');
  Logger.log('==== 2. ANUNCIOS (campanas activas) ====');
  var cuenta = { APPROVED: 0, APPROVED_LIMITED: 0, DISAPPROVED: 0, otro: 0 };
  leer("SELECT campaign.name, ad_group.name, ad_group_ad.status, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status, " +
    "ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
    "AND ad_group_ad.status = 'ENABLED'", 'los anuncios', function (r) {
      var ps = r.adGroupAd.policySummary || {}, a = ps.approvalStatus || '?';
      if (cuenta[a] !== undefined) cuenta[a]++; else cuenta.otro++;
      Logger.log('  ' + r.campaign.name + ' > ' + r.adGroup.name + ' | ' + a + ' | revision: ' + (ps.reviewStatus || '?') + (temas(ps) ? ' | ' + temas(ps) : ''));
    });
  Logger.log('  RESUMEN anuncios: aprobados ' + cuenta.APPROVED + ', aprobados con limite ' + cuenta.APPROVED_LIMITED + ', rechazados ' + cuenta.DISAPPROVED + ', otros/en revision ' + cuenta.otro);
  Logger.log('');
  Logger.log('==== 3. GRUPOS DE RECURSOS (MAXIMO RENDIMIENTO) ====');
  leer("SELECT campaign.name, asset_group.name, asset_group.status, asset_group.primary_status, asset_group.primary_status_reasons FROM asset_group " +
    "WHERE campaign.status = 'ENABLED' AND asset_group.status != 'REMOVED'", 'los grupos de recursos', function (r) {
      var g = r.assetGroup;
      Logger.log('  ' + g.name + ' | ' + g.status + ' | ' + g.primaryStatus + ((g.primaryStatusReasons || []).length ? ' (' + g.primaryStatusReasons.join(', ') + ')' : ''));
    });
  Logger.log('');
  Logger.log('==== 4. EXTENSIONES RECHAZADAS ====');
  var n = 0;
  leer("SELECT campaign.name, campaign.status, asset.name, asset.type, campaign_asset.field_type, asset.policy_summary.approval_status, asset.policy_summary.policy_topic_entries " +
    "FROM campaign_asset WHERE campaign.status = 'ENABLED' AND campaign_asset.status = 'ENABLED'", 'las extensiones', function (r) {
      var ps = (r.asset || {}).policySummary || {};
      if (ps.approvalStatus !== 'DISAPPROVED') return;
      n++; Logger.log('  ' + r.campaign.name + ' | ' + r.campaignAsset.fieldType + ' | ' + (r.asset.name || r.asset.type) + ' | ' + temas(ps));
    });
  if (!n) Logger.log('  Ninguna rechazada a nivel de campana.');
  Logger.log('');
  Logger.log('FIN. Este script no cambio nada. Mandame el registro.');
}
