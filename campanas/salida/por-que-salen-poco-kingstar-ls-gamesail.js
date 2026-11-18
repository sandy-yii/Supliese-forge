// POR QUE SALEN POCO - Kingstar, Laundry Solutions y Gamesail (solo lee, 18 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR (o dentro de una de las tres). VISTA PREVIA. No cambia nada.
// Para cada campana de busqueda: cuantas veces salio de las que pudo salir, y si perdio por PUJA (tope bajo)
// o por PRESUPUESTO. Ayer (primer dia sin Display) y 7 dias.
var CUENTAS = ['993-525-8739', '265-909-2662', '118-347-6484'];

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(CUENTAS).get();
    while (it.hasNext()) { AdsManagerApp.select(it.next()); revisar(); }
  } else { revisar(); }
}

function pct(x) { return (x === undefined || x === null || x === '' || isNaN(Number(x))) ? 's/d' : Math.round(Number(x) * 100) + '%'; }
function pesos(m) { return '$' + Math.round((Number(m) || 0) / 1e6); }

function revisar() {
  Logger.log('==== ' + AdsApp.currentAccount().getName() + ' ====');
  ['YESTERDAY', 'LAST_7_DAYS'].forEach(function (rango) {
    Logger.log(rango === 'YESTERDAY' ? '-- AYER --' : '-- 7 DIAS --');
    var q = "SELECT campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, campaign_budget.amount_micros, " +
      "metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.average_cpc, " +
      "metrics.search_impression_share, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share " +
      "FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH' " +
      "AND segments.date DURING " + rango + " ORDER BY metrics.cost_micros DESC";
    try {
      var it = AdsApp.search(q);
      while (it.hasNext()) {
        var r = it.next(), c = r.campaign, m = r.metrics || {}, ts = c.targetSpend || {};
        Logger.log('  ' + c.name + ' | ' + c.biddingStrategyType + (ts.cpcBidCeilingMicros ? ' tope ' + pesos(ts.cpcBidCeilingMicros) : '') +
          ' | presupuesto/dia ' + pesos((r.campaignBudget || {}).amountMicros) +
          ' | ' + (m.impressions || 0) + ' imp, ' + (m.clicks || 0) + ' clics, ' + pesos(m.costMicros) + ', clic prom ' + pesos(m.averageCpc) +
          ', ' + (Math.round((Number(m.conversions) || 0) * 10) / 10) + ' contactos' +
          ' | sale ' + pct(m.searchImpressionShare) + ' | pierde por PUJA ' + pct(m.searchRankLostImpressionShare) +
          ' | pierde por PRESUPUESTO ' + pct(m.searchBudgetLostImpressionShare));
      }
    } catch (e) { Logger.log('  (No se pudo leer: ' + e.message + ')'); }
  });
  Logger.log('');
}
