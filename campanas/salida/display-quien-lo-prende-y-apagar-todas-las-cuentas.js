/**
 * Atelback · ¿Quién vuelve a prender Display? Y apagarlo otra vez — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * POR QUÉ: el 9 nov se apagó Display en las campañas de búsqueda «AB · …» de Kingstar y Laundry Solutions, y las vistas
 * previas de ese día lo confirmaron. El 11 nov aparece encendido otra vez. Ninguno de nuestros scripts lo prende.
 *
 * QUÉ HACE:
 *   1. SOLO LEE: en los últimos 7 días, cada cambio a las campañas que haya tocado la red de Display (o la configuración
 *      de redes): cuándo, quién (correo del usuario) y desde dónde (pantalla de Google Ads, recomendaciones aplicadas
 *      solas, script, reglas automáticas, API…).
 *   2. VISTA PREVIA: lista las campañas «AB · …» de búsqueda con Display encendido. EJECUTAR (solo con el OK): lo apaga.
 *
 * CÓMO SE USA: en Kingstar y Laundry Solutions (sirve en las 5) > borrar todo > pegar completo > Autorizar > VISTA PREVIA >
 * mandar el registro > EJECUTAR con el OK.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var DESDE_DONDE = {
  GOOGLE_ADS_WEB_CLIENT: 'a mano, en la pantalla de Google Ads',
  GOOGLE_ADS_AUTOMATED_RULE: 'una regla automática de la cuenta',
  GOOGLE_ADS_SCRIPTS: 'un script de Google Ads',
  GOOGLE_ADS_BULK_UPLOAD: 'una carga masiva',
  GOOGLE_ADS_API: 'la API (otra herramienta o agencia)',
  GOOGLE_ADS_EDITOR: 'Google Ads Editor',
  GOOGLE_ADS_MOBILE_APP: 'la app de Google Ads en el celular',
  GOOGLE_ADS_RECOMMENDATIONS: 'RECOMENDACIONES de Google aplicadas solas (aplicación automática)',
  SEARCH_ADS_360_SYNC: 'Search Ads 360',
  SEARCH_ADS_360_POST: 'Search Ads 360',
  INTERNAL_TOOL: 'una herramienta interna de Google',
  OTHER: 'otro'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function campos(cf) {
  if (!cf) return '';
  if (typeof cf === 'string') return cf;
  if (cf.paths) return cf.paths.join(',');
  return JSON.stringify(cf);
}
function display(r) { return r && r.campaign && r.campaign.networkSettings ? r.campaign.networkSettings.targetContentNetwork : undefined; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - 7 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('DISPLAY · QUIÉN LO PRENDE Y APAGARLO · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: lo apaga'));
  Logger.log('');

  // 1. Quién cambió la red de las campañas
  Logger.log('==== 1. CAMBIOS A LA RED DE LAS CAMPAÑAS (del ' + desde + ' a hoy) ====');
  var quien = {}, n = 0, nombres = {};
  filas("SELECT campaign.resource_name, campaign.name FROM campaign WHERE campaign.status != 'REMOVED'", 'los nombres de campaña')
    .forEach(function (f) { nombres[f.campaign.resourceName] = f.campaign.name; });
  filas("SELECT change_event.change_date_time, change_event.client_type, change_event.user_email, change_event.changed_fields, " +
    "change_event.old_resource, change_event.new_resource, change_event.campaign FROM change_event " +
    "WHERE change_event.change_resource_type = 'CAMPAIGN' AND change_event.change_date_time >= '" + desde + " 00:00:00' " +
    "AND change_event.change_date_time <= '" + hoy + " 23:59:59' ORDER BY change_event.change_date_time ASC LIMIT 1000", 'el historial de cambios')
    .forEach(function (f) {
      var ce = f.changeEvent, cf = campos(ce.changedFields);
      if (!/network|content/i.test(cf)) return;
      var antes = display(ce.oldResource), despues = display(ce.newResource);
      var que = despues === true ? 'PRENDIÓ Display' : despues === false ? 'apagó Display' : 'cambió la red (' + cf + ')';
      var origen = DESDE_DONDE[ce.clientType] || ce.clientType;
      n++;
      Logger.log(ce.changeDateTime + ' · «' + (nombres[ce.campaign] || ce.campaign) + '» · ' + que + ' · desde ' + origen +
        ' · usuario: ' + (ce.userEmail || '(sin correo)'));
      if (despues === true) { var k = origen + ' · ' + (ce.userEmail || '(sin correo)'); quien[k] = (quien[k] || 0) + 1; }
    });
  if (!n) Logger.log('Google no registra cambios a la red de las campañas en estos 7 días.');
  var quienTxt = Object.keys(quien).map(function (k) { return k + ' (' + quien[k] + ')'; }).join(' | ');
  if (quienTxt) Logger.log('→ Lo volvió a prender: ' + quienTxt);
  Logger.log('');

  // 2. Apagarlo otra vez
  Logger.log('==== 2. CAMPAÑAS DE BÚSQUEDA «AB · …» CON DISPLAY ENCENDIDO ====');
  var ops = [], textos = [];
  filas("SELECT campaign.resource_name, campaign.name, campaign.network_settings.target_content_network FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas').forEach(function (f) {
      var c = f.campaign;
      if (!/^AB\s*·/.test(c.name) || !(c.networkSettings || {}).targetContentNetwork) return;
      Logger.log('«' + c.name + '» tiene Display encendido → se apaga');
      ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: false } },
        updateMask: 'networkSettings.targetContentNetwork' } });
      textos.push(c.name);
    });
  if (!ops.length) Logger.log('Ninguna tiene Display encendido. No hay nada que apagar.');
  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ «' + textos[i] + '»: ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ «' + textos[i] + '»: Display apagado.');
    });
  }
  Logger.log('');
  Logger.log('DISPLAY · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · se apaga en ' + ops.length + ' campaña(s) · con error: ' + malos +
    ' · quién lo prendió: ' + (quienTxt || 'no aparece en el historial'));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
