// COMO VAN HOY - Kingstar y Quick Laundry (solo lee, 18 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR. VISTA PREVIA. No cambia nada.
// Por campana: si esta saliendo (estado de Google), impresiones, clics, gasto y contactos de HOY y de AYER a la misma hora no se puede,
// asi que se compara con el dia completo de ayer.
var CUENTAS = ['993-525-8739', '256-397-2201'];

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(CUENTAS).get();
    while (it.hasNext()) { AdsManagerApp.select(it.next()); revisar(); }
  } else { revisar(); }
}

function pesos(m) { return '$' + Math.round((Number(m) || 0) / 1e6); }
function pct(x) { return (x === undefined || x === null || x === '' || isNaN(Number(x))) ? 's/d' : Math.round(Number(x) * 100) + '%'; }

function revisar() {
  var cuenta = AdsApp.currentAccount();
  Logger.log('==== ' + cuenta.getName() + ' (hora de la cuenta: ' + Utilities.formatDate(new Date(), cuenta.getTimeZone(), 'HH:mm') + ') ====');
  ['TODAY', 'YESTERDAY'].forEach(function (rango) {
    Logger.log(rango === 'TODAY' ? '-- HOY --' : '-- AYER (dia completo) --');
    var tot = { i: 0, c: 0, g: 0, v: 0 };
    try {
      var it = AdsApp.search("SELECT campaign.name, campaign.primary_status, campaign.primary_status_reasons, metrics.impressions, metrics.clicks, " +
        "metrics.cost_micros, metrics.conversions, metrics.search_impression_share, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share " +
        "FROM campaign WHERE campaign.status = 'ENABLED' AND segments.date DURING " + rango + " ORDER BY metrics.cost_micros DESC");
      while (it.hasNext()) {
        var r = it.next(), c = r.campaign, m = r.metrics || {};
        tot.i += Number(m.impressions) || 0; tot.c += Number(m.clicks) || 0; tot.g += Number(m.costMicros) || 0; tot.v += Number(m.conversions) || 0;
        Logger.log('  ' + c.name + ' | estado ' + c.primaryStatus + ((c.primaryStatusReasons || []).length ? ' (' + c.primaryStatusReasons.join(', ') + ')' : '') +
          ' | ' + (m.impressions || 0) + ' imp, ' + (m.clicks || 0) + ' clics, ' + pesos(m.costMicros) + ', ' + (Math.round((Number(m.conversions) || 0) * 10) / 10) + ' contactos' +
          ' | sale ' + pct(m.searchImpressionShare) + ', pierde por puja ' + pct(m.searchRankLostImpressionShare) + ', por presupuesto ' + pct(m.searchBudgetLostImpressionShare));
      }
    } catch (e) { Logger.log('  (No se pudo leer: ' + e.message + ')'); }
    Logger.log('  TOTAL: ' + tot.i + ' imp, ' + tot.c + ' clics, ' + pesos(tot.g) + ', ' + (Math.round(tot.v * 10) / 10) + ' contactos');
  });
  Logger.log('');
}
