// QUICK LAUNDRY - Display prendido en "AB - Equipo para lavanderia": quien, cuando, cuanto gasto y apagarlo (17 nov 2026)
// Solo para Quick Laundry 256-397-2201. Pegar dentro de la cuenta de Quick Laundry o en la de administrador.
// VISTA PREVIA: solo muestra quien lo prendio, los clics de Display de 7 dias y que apagaria. No cambia nada.
// EJECUTAR (con el OK): apaga Display solo en las campanas de busqueda "AB" que lo tengan prendido.
//   No toca presupuesto, pujas, palabras ni anuncios. No pausa nada.
// DESHACER: cambiar DESHACER a true y Ejecutar: vuelve a prender Display en las campanas de LISTA_DESHACER.
var CUENTA = '256-397-2201';
var DESHACER = false;
var LISTA_DESHACER = ['Equipo para lavander'];   // parte del nombre de la campana

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Quick Laundry (' + CUENTA + '). No se hizo nada.');
    return;
  }
  revisarYApagar();
}

function revisarYApagar() {
  var vista = AdsApp.getExecutionInfo().isPreview();
  var tz = AdsApp.currentAccount().getTimeZone();
  Logger.log('QUICK LAUNDRY - DISPLAY' + (DESHACER ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');

  // 1. Campanas de busqueda y su Display
  var camps = {}, ops = [], nombres = [];
  var it = AdsApp.search("SELECT campaign.resource_name, campaign.name, campaign.network_settings.target_content_network, " +
    "campaign.network_settings.target_search_network FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'");
  Logger.log('==== 1. CAMPANAS DE BUSQUEDA HOY ====');
  while (it.hasNext()) {
    var c = it.next().campaign, ns = c.networkSettings || {};
    camps[c.resourceName] = c.name;
    Logger.log('  ' + c.name + ' - Display ' + (ns.targetContentNetwork ? 'PRENDIDO' : 'apagado') +
      ' - socios ' + (ns.targetSearchNetwork ? 'PRENDIDO' : 'apagado'));
    if (DESHACER) {
      if (LISTA_DESHACER.some(function (x) { return c.name.indexOf(x) >= 0; }) && !ns.targetContentNetwork) {
        ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: true } },
          updateMask: 'networkSettings.targetContentNetwork' } });
        nombres.push(c.name);
      }
    } else if (c.name.indexOf('AB') === 0 && ns.targetContentNetwork) {
      ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: false } },
        updateMask: 'networkSettings.targetContentNetwork' } });
      nombres.push(c.name);
    }
  }
  Logger.log('');

  // 2. Quien lo prendio (ultimos 14 dias)
  Logger.log('==== 2. QUIEN CAMBIO LA RED DE LAS CAMPANAS (14 dias) ====');
  var desde = Utilities.formatDate(new Date(Date.now() - 14 * 864e5), tz, 'yyyy-MM-dd');
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var hay = 0;
  try {
    var ch = AdsApp.search("SELECT change_event.change_date_time, change_event.client_type, change_event.user_email, " +
      "change_event.changed_fields, change_event.campaign FROM change_event WHERE change_event.change_date_time >= '" + desde + " 00:00:00' " +
      "AND change_event.change_date_time <= '" + hoy + " 23:59:59' " +
      "AND change_event.change_resource_type = 'CAMPAIGN' ORDER BY change_event.change_date_time DESC LIMIT 200");
    while (ch.hasNext()) {
      var e = ch.next().changeEvent, f = String(e.changedFields || '');
      if (f.indexOf('network') < 0 && f.indexOf('Network') < 0) continue;
      hay++;
      Logger.log('  ' + e.changeDateTime + ' - ' + (camps[e.campaign] || e.campaign) + ' - desde: ' + e.clientType +
        ' - usuario: ' + e.userEmail + ' - campos: ' + f);
    }
  } catch (err) { Logger.log('  (No se pudo leer el historial: ' + err.message + ')'); }
  if (!hay) Logger.log('  Ningun cambio de red en 14 dias.');
  Logger.log('');

  // 3. Lo que trajo Display (7 dias, por dia)
  Logger.log('==== 3. DISPLAY Y SOCIOS EN QUICK LAUNDRY, ULTIMOS 7 DIAS ====');
  var RED = { CONTENT: 'DISPLAY', SEARCH_PARTNERS: 'SOCIOS' };
  var d = AdsApp.search("SELECT segments.date, segments.ad_network_type, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
    "FROM campaign WHERE segments.date DURING LAST_7_DAYS AND segments.ad_network_type IN ('CONTENT', 'SEARCH_PARTNERS') AND metrics.impressions > 0 " +
    "ORDER BY segments.date");
  var tc = 0, tg = 0, tv = 0;
  while (d.hasNext()) {
    var r = d.next(), m = r.metrics;
    var g = (Number(m.costMicros) || 0) / 1e6;
    tc += Number(m.clicks) || 0; tg += g; tv += Number(m.conversions) || 0;
    Logger.log('  ' + r.segments.date + ' - ' + (RED[r.segments.adNetworkType] || r.segments.adNetworkType) + ' - ' + r.campaign.name + ' - ' + m.impressions + ' impresiones - ' + m.clicks +
      ' clics - $' + Math.round(g) + ' - ' + (Math.round((Number(m.conversions) || 0) * 10) / 10) + ' contactos');
  }
  Logger.log('  TOTAL Display + socios 7 dias: ' + tc + ' clics - $' + Math.round(tg) + ' - ' + (Math.round(tv * 10) / 10) + ' contactos');
  Logger.log('');

  // 4. Apagar (o deshacer)
  Logger.log('==== 4. ' + (DESHACER ? 'VOLVER A PRENDER' : 'APAGAR') + ' ====');
  if (!ops.length) { Logger.log('  Nada que cambiar.' + (DESHACER ? '' : ' Display ya esta apagado en todas. OK')); return; }
  nombres.forEach(function (n) { Logger.log('  ' + (DESHACER ? 'prenderia Display en: ' : 'apagaria Display en: ') + n); });
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  for (var i = 0; i < res.length; i++) {
    if (!res[i].isSuccessful()) Logger.log('  ERROR en ' + nombres[i] + ': ' + res[i].getErrorMessages().join('; '));
    else if (!vista) Logger.log('  LISTO: ' + nombres[i]);
  }
  Logger.log('QL DISPLAY - ' + (vista ? 'vista previa' : 'ejecutado') + ' - campanas: ' + ops.length);
}
