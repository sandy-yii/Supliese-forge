// GAMESAIL - Apagar Display OTRA VEZ (23 nov 2026). Solo ASCII.
// POR QUE: el sabado 21 nov a las 19:47 las "recomendaciones aplicadas automaticamente" de Google
//   (no fue una persona ni un script nuestro) prendieron Display en las 7 campanas de busqueda de Gamesail.
//   Desde entonces: domingo 22 = 70% de los clics de Gamesail en banners; hoy 23 a las 9:30 = 103 de 110 clics.
//   Resend: el ultimo aviso real de Gamesail fue el sabado 21 a las 17:13, ANTES de que se prendiera.
//   Display ya se habia apagado el 16 nov por traer sitios basura y rafagas de madrugada.
// QUE HACE: en Gamesail (118-347-6484), solo en campanas de busqueda "AB ..." encendidas, apaga la Red de Display.
//   No toca la red de busqueda de Google, presupuestos, pujas, anuncios, palabras ni conversiones. No pausa nada.
// CANDADO: si ya hubo un cambio HOY hecho por una persona o un script (no cuenta lo que prendio Google), no aplica.
// DESHACER (el mismo dia): DESHACER = true y Ejecutar -> vuelve a prender Display en esas campanas.
// USO: cuenta de administrador o dentro de Gamesail > pegar > Autorizar > VISTA PREVIA > mandar registro > EJECUTAR con OK.
// ADEMAS (a mano, no se puede con script): Recomendaciones > Aplicar automaticamente > apagar
//   "Expandir tu alcance con la Red de Display de Google" (si no, Google lo vuelve a prender).

var CUENTA = '118-347-6484';
var DESHACER = false;

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre Gamesail (' + CUENTA + '). No se hizo nada.'); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Gamesail (' + CUENTA + '). No se hizo nada.'); return;
  }
  var vista = AdsApp.getExecutionInfo().isPreview();
  var quiero = DESHACER; // false = apagar Display; true = volver a prenderlo
  Logger.log('GAMESAIL - ' + (DESHACER ? 'DESHACER: prender Display' : 'APAGAR DISPLAY') + ' - ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR'));

  var ops = [], nombres = [];
  var it2 = AdsApp.search("SELECT campaign.resource_name, campaign.name, campaign.network_settings.target_content_network " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'");
  while (it2.hasNext()) {
    var c = it2.next().campaign;
    if (c.name.indexOf('AB') !== 0) continue;
    var prendido = !!(c.networkSettings && c.networkSettings.targetContentNetwork);
    if (prendido === quiero) continue;
    ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: quiero } },
      updateMask: 'networkSettings.targetContentNetwork' } });
    nombres.push(c.name);
    Logger.log('  ' + (quiero ? 'PRENDERIA Display en: ' : 'APAGARIA Display en: ') + c.name);
  }
  if (!ops.length) { Logger.log('  No hay nada que cambiar. OK'); return; }

  if (!vista && !DESHACER) {
    var hoy = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
    var it3 = AdsApp.search("SELECT change_event.client_type FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 50"), nuestros = 0;
    while (it3.hasNext()) {
      var t = it3.next().changeEvent.clientType;
      if (t !== 'GOOGLE_ADS_RECOMMENDATIONS_SUBSCRIPTION' && t !== 'GOOGLE_ADS_RECOMMENDATIONS') nuestros++;
    }
    if (nuestros) { Logger.log('ALTO: ya hubo ' + nuestros + ' cambio(s) HOY en Gamesail. No se aplico nada. Avisa a Claude.'); return; }
  }

  var malos = 0;
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('  ERROR en ' + nombres[i] + ': ' + r.getErrorMessages().join('; ')); }
    else if (!vista) Logger.log('  ' + (quiero ? 'PRENDIDO: ' : 'APAGADO: ') + nombres[i]);
  });
  Logger.log('Total: ' + ops.length + ' campanas - con error: ' + malos);
  Logger.log(vista ? 'LISTO. Vista previa: no se cambio nada. Manda el registro.' : 'LISTO. Manda el registro.');
}
