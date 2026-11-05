/**
 * Atelback · Girbau: ¿Google registró el cambio del botón de llamada?
 * Escrito a mano el 5 nov 2026 (no lo genera generar.py). Solo para la cuenta Girbau 860-582-6837.
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   1. El botón de llamada de Eduardo: número, horario y estado de revisión de Google.
 *   2. Dónde está puesto (toda la cuenta, campañas o grupos) y si está activo ahí.
 *   3. Los cambios que Google registró en los botones de llamada en los últimos 3 días, con fecha y hora:
 *      es lo mismo que la columna «Última actualización» de Recursos.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var CUENTA = '860-582-6837';
var TELEFONO = '3328068994';

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function diez(n) { return String(n || '').replace(/\D/g, '').slice(-10); }

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== CUENTA) throw new Error('Este script es solo para Girbau (' + CUENTA + '). Estás en ' + cid + '. No se hizo nada.');
  var zona = AdsApp.currentAccount().getTimeZone();
  Logger.log('REVISAR BOTÓN DE LLAMADA · Girbau · solo lee');
  Logger.log('');

  // 1. El botón
  var mio = {};
  Logger.log('==== 1. BOTONES DE LLAMADA DE LA CUENTA ====');
  filas("SELECT asset.resource_name, asset.id, asset.call_asset.phone_number, asset.policy_summary.approval_status, " +
    "asset.policy_summary.review_status FROM asset WHERE asset.type = 'CALL'", 'los botones').forEach(function (f) {
    var a = f.asset, ps = a.policySummary || {}, n = (a.callAsset || {}).phoneNumber;
    var deEduardo = diez(n) === TELEFONO;
    if (deEduardo) mio[a.resourceName] = true;
    Logger.log((deEduardo ? '★ ' : '  ') + n + ' · id ' + a.id + ' · ' + (ps.approvalStatus || '?') + ' / ' + (ps.reviewStatus || '?') +
      (deEduardo ? ' (es el de Eduardo)' : ''));
  });
  if (!Object.keys(mio).length) Logger.log('No hay ningún botón con el número de Eduardo.');
  Logger.log('');

  // 2. Dónde está puesto
  Logger.log('==== 2. DÓNDE ESTÁ PUESTO EL BOTÓN DE EDUARDO ====');
  var puestos = 0;
  function lugar(texto, rn, estado) {
    if (!mio[rn]) return;
    puestos++;
    Logger.log(texto + ' · ' + (estado === 'ENABLED' ? 'activo' : estado));
  }
  filas("SELECT asset.resource_name, customer_asset.status FROM customer_asset WHERE customer_asset.field_type = 'CALL' " +
    "AND customer_asset.status != 'REMOVED'", 'la cuenta').forEach(function (f) { lugar('Toda la cuenta', f.asset.resourceName, f.customerAsset.status); });
  filas("SELECT asset.resource_name, campaign.name, campaign.status, campaign_asset.status FROM campaign_asset WHERE campaign_asset.field_type = 'CALL' " +
    "AND campaign_asset.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'las campañas').forEach(function (f) {
    lugar('Campaña «' + f.campaign.name + '» (' + f.campaign.status + ')', f.asset.resourceName, f.campaignAsset.status);
  });
  filas("SELECT asset.resource_name, campaign.name, campaign.status, ad_group.name, ad_group.status, ad_group_asset.status FROM ad_group_asset " +
    "WHERE ad_group_asset.field_type = 'CALL' AND ad_group_asset.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'",
    'los grupos').forEach(function (f) {
    lugar('Grupo «' + f.campaign.name + ' › ' + f.adGroup.name + '»', f.asset.resourceName, f.adGroupAsset.status);
  });
  if (!puestos) Logger.log('⚠️ No está puesto en ningún lado: por eso no aparece en Recursos y el anuncio no muestra el botón.');
  Logger.log('');

  // 3. Cambios registrados
  Logger.log('==== 3. CAMBIOS QUE GOOGLE REGISTRÓ EN LOS BOTONES (últimos 3 días) ====');
  var desde = Utilities.formatDate(new Date(Date.now() - 3 * 864e5), zona, 'yyyy-MM-dd');
  var hasta = Utilities.formatDate(new Date(Date.now() + 864e5), zona, 'yyyy-MM-dd');
  var cambios = filas("SELECT change_event.change_date_time, change_event.change_resource_name, change_event.client_type, " +
    "change_event.resource_change_operation, change_event.changed_fields FROM change_event " +
    "WHERE change_event.change_date_time >= '" + desde + "' AND change_event.change_date_time <= '" + hasta + "' " +
    "AND change_event.change_resource_type = 'ASSET' ORDER BY change_event.change_date_time DESC LIMIT 50", 'los cambios');
  var delBoton = 0;
  cambios.forEach(function (f) {
    var c = f.changeEvent;
    if (!mio[c.changeResourceName]) return;
    delBoton++;
    Logger.log(c.changeDateTime + ' · ' + c.resourceChangeOperation + ' · desde ' + c.clientType + ' · campos: ' + (c.changedFields || '?'));
  });
  Logger.log('');
  if (delBoton) Logger.log('✅ Google SÍ registró el cambio del botón de Eduardo (arriba la fecha y hora). Ahora toca esperar de 24 a 48 horas.');
  else Logger.log('⚠️ No aparece ningún cambio del botón de Eduardo en 3 días. Manda el registro.');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
