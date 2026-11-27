// GAMESAIL - REGRESAR LA PUJA DE "Para ropa y sabanas" COMO ESTABA (viernes 27 nov 2026)
// Pegar dentro de la cuenta Gamesail (118-347-6484). Vista previa, OK y Ejecutar.
// POR QUE: hoy 27 nov a las 10:27 a.m., desde la app de Google Ads en el celular, con gamesailmx@gmail.com, la campana
//   "AB \u00b7 Lavadoras para ropa y s\u00e1banas" paso de "Maximizar clics con tope de $16" a "Maximizar el valor de conversion".
//   Eso reinicia el aprendizaje, quita el tope por clic y no lo aprobo nadie en el plan.
// QUE HACE: la regresa a "Maximizar clics" con tope de $16, como estaba ayer. Solo esa campana.
//   No toca presupuesto, anuncios, palabras ni otras campanas. No pausa nada.
// SEGURO: si la campana ya esta en "Maximizar clics", no hace nada.
// DESHACER: pon DESHACER = true y Ejecutar: la deja otra vez en "Maximizar el valor de conversion".

var CUENTA = '118-347-6484';
var CAMPANA = 'AB \u00b7 Lavadoras para ropa y s\u00e1banas';
var TOPE = 16;
var DESHACER = false;

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Gamesail (' + CUENTA + '). No se hizo nada.'); return;
  }
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('GAMESAIL - PUJA DE PARA ROPA' + (DESHACER ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var it2 = AdsApp.search("SELECT campaign.name, campaign.resource_name, campaign.bidding_strategy_type, campaign.bidding_strategy, " +
    "campaign.target_spend.cpc_bid_ceiling_micros FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.name = '" + CAMPANA + "'");
  if (!it2.hasNext()) { Logger.log('No encontre la campana activa "' + CAMPANA + '". No se hizo nada.'); return; }
  var c = it2.next().campaign;
  var tope = Number((c.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6;
  Logger.log('"' + CAMPANA + '": puja actual ' + c.biddingStrategyType + (tope ? ', tope por clic $' + tope.toFixed(2) : ''));
  if (c.biddingStrategy) { Logger.log('Usa una estrategia compartida: no se toca desde aqui. Avisame.'); return; }
  var intentos;
  if (DESHACER) {
    if (c.biddingStrategyType === 'MAXIMIZE_CONVERSION_VALUE') { Logger.log('Ya esta en "Maximizar el valor de conversion". Nada que hacer.'); return; }
    intentos = [{ update: { resourceName: c.resourceName, maximizeConversionValue: { targetRoas: 0 } }, updateMask: 'maximizeConversionValue.targetRoas' }];
  } else {
    if (c.biddingStrategyType === 'TARGET_SPEND') { Logger.log('Ya esta en "Maximizar clics". Nada que hacer.'); return; }
    intentos = [
      { update: { resourceName: c.resourceName, targetSpend: { cpcBidCeilingMicros: String(TOPE * 1e6) } }, updateMask: 'targetSpend.cpcBidCeilingMicros' },
      { update: { resourceName: c.resourceName, targetSpend: { cpcBidCeilingMicros: String(TOPE * 1e6) } }, updateMask: 'targetSpend' }
    ];
  }
  for (var i = 0; i < intentos.length; i++) {
    var r = AdsApp.mutateAll([{ campaignOperation: intentos[i] }], { partialFailure: true })[0];
    if (r.isSuccessful()) {
      Logger.log((vista ? 'se puede: ' : 'LISTO: ') + (DESHACER ? 'regresa a "Maximizar el valor de conversion"' : 'regresa a "Maximizar clics" con tope de $' + TOPE));
      Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
      return;
    }
    Logger.log('Intento ' + (i + 1) + ' no paso: ' + r.getErrorMessages().join('; '));
  }
  Logger.log('Google no dejo hacerlo desde script. No se cambio nada. Avisame y lo hacemos a mano.');
}
