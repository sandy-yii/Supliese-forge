// APAGAR DISPLAY - Kingstar, Laundry Solutions y Gamesail (version corta, 16 nov 2026)
// Vista previa: solo dice que apagaria. Ejecutar: lo apaga.
var CUENTAS = ['993-525-8739', '265-909-2662', '118-347-6484'];

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(CUENTAS).get();
    while (it.hasNext()) {
      AdsManagerApp.select(it.next());
      apagar();
    }
  } else {
    apagar();
  }
}

function apagar() {
  var cuenta = AdsApp.currentAccount().getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('CUENTA: ' + cuenta + (vista ? ' (VISTA PREVIA)' : ' (EJECUTAR)'));
  var ops = [];
  var nombres = [];
  var it = AdsApp.search("SELECT campaign.resource_name, campaign.name, campaign.network_settings.target_content_network " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'");
  while (it.hasNext()) {
    var c = it.next().campaign;
    if (c.name.indexOf('AB') !== 0) continue;
    if (!c.networkSettings || !c.networkSettings.targetContentNetwork) continue;
    ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: false } },
      updateMask: 'networkSettings.targetContentNetwork' } });
    nombres.push(c.name);
    Logger.log('  Display encendido en: ' + c.name);
  }
  if (!ops.length) { Logger.log('  Display ya esta apagado en todas. OK'); return; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  for (var i = 0; i < res.length; i++) {
    if (!res[i].isSuccessful()) Logger.log('  ERROR en ' + nombres[i] + ': ' + res[i].getErrorMessages().join('; '));
    else if (!vista) Logger.log('  APAGADO: ' + nombres[i]);
  }
  Logger.log('  Total: ' + ops.length + ' campanas');
}
