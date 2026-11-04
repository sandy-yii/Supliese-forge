/**
 * Atelback · Quitar números viejos de los botones de llamada y WhatsApp — las cinco cuentas
 * Escrito a mano el 4 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE (reconoce sola en qué cuenta está):
 *   - Revisa los botones de LLAMADA y de WHATSAPP puestos en la cuenta, en las campañas (encendidas, en pausa o anteriores)
 *     y en los grupos de anuncios.
 *   - Los que son del vendedor de la marca se quedan como están.
 *   - Los que tienen OTRO número (números viejos, de otra marca o de la agencia anterior) se QUITAN de donde están puestos,
 *     estén encendidos o en pausa. Así ningún anuncio puede mostrar un número que no es del vendedor.
 *   - No borra el número de la biblioteca de Google (se puede volver a poner si hiciera falta), no toca anuncios,
 *     campañas, presupuestos ni palabras clave, y no enciende ni apaga campañas.
 *
 * CÓMO SE USA: en cada cuenta > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR solo con el OK.
 */

var PLANES = [
  { cuenta: '256-397-2201', nombre: 'Quick Laundry', vendedor: 'Liliana', telefono: '3326012237' },
  { cuenta: '993-525-8739', nombre: 'Kingstar (CLM)', vendedor: 'Jorge', telefono: '3315641538' },
  { cuenta: '265-909-2662', nombre: 'Laundry Solutions', vendedor: 'Sergio', telefono: '3314172994' },
  { cuenta: '860-582-6837', nombre: 'Girbau', vendedor: 'Eduardo', telefono: '3328068994' },
  { cuenta: '118-347-6484', nombre: 'Gamesail', vendedor: 'Silvia', telefono: '3311859797' }
];

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
function bonito(n) { var d = diez(n); return d.length === 10 ? d.substr(0, 2) + ' ' + d.substr(2, 4) + ' ' + d.substr(6) : (n || '?'); }

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var PLAN = null;
  PLANES.forEach(function (p) { if (p.cuenta === cid) PLAN = p; });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en la lista. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('NÚMEROS DE LOS BOTONES · ' + PLAN.nombre + ' · vendedor ' + PLAN.vendedor + ' ' + bonito(PLAN.telefono) +
    (vista ? ' · VISTA PREVIA (no cambia nada)' : ' · EJECUTANDO'));
  Logger.log('');

  var campos = "('CALL', 'BUSINESS_MESSAGE')";
  var datos = 'asset.type, asset.call_asset.phone_number, asset.business_message_asset.whatsapp_info.phone_number';
  var lugares = [];
  filas('SELECT customer_asset.resource_name, customer_asset.status, ' + datos + ' FROM customer_asset ' +
    'WHERE customer_asset.field_type IN ' + campos + " AND customer_asset.status != 'REMOVED'", 'los botones de la cuenta')
    .forEach(function (f) {
      lugares.push({ donde: 'toda la cuenta', estado: f.customerAsset.status, a: f.asset,
        op: { customerAssetOperation: { remove: f.customerAsset.resourceName } } });
    });
  filas('SELECT campaign.name, campaign.status, campaign_asset.resource_name, campaign_asset.status, ' + datos + ' FROM campaign_asset ' +
    'WHERE campaign_asset.field_type IN ' + campos + " AND campaign_asset.status != 'REMOVED' AND campaign.status != 'REMOVED'",
    'los botones de las campañas')
    .forEach(function (f) {
      lugares.push({ donde: '«' + f.campaign.name + '» (campaña ' + f.campaign.status + ')', estado: f.campaignAsset.status, a: f.asset,
        op: { campaignAssetOperation: { remove: f.campaignAsset.resourceName } } });
    });
  filas('SELECT campaign.name, ad_group.name, ad_group_asset.resource_name, ad_group_asset.status, ' + datos + ' FROM ad_group_asset ' +
    'WHERE ad_group_asset.field_type IN ' + campos + " AND ad_group_asset.status != 'REMOVED' AND ad_group.status != 'REMOVED' " +
    "AND campaign.status != 'REMOVED'", 'los botones de los grupos')
    .forEach(function (f) {
      lugares.push({ donde: '«' + f.campaign.name + ' › ' + f.adGroup.name + '»', estado: f.adGroupAsset.status, a: f.asset,
        op: { adGroupAssetOperation: { remove: f.adGroupAsset.resourceName } } });
    });

  var ops = [], textos = [], bien = 0;
  lugares.forEach(function (l) {
    var tipo = l.a.type === 'CALL' ? 'Llamada' : 'WhatsApp';
    var n = l.a.type === 'CALL' ? (l.a.callAsset || {}).phoneNumber : (((l.a.businessMessageAsset || {}).whatsappInfo) || {}).phoneNumber;
    var linea = tipo + ' ' + bonito(n) + ' · ' + l.donde + ' · ' + (l.estado === 'ENABLED' ? 'puesto' : 'en pausa');
    if (diez(n) === PLAN.telefono) { bien++; Logger.log('✅ SE QUEDA · ' + linea + ' (es de ' + PLAN.vendedor + ')'); return; }
    ops.push(l.op);
    textos.push(linea);
    Logger.log('❌ SE QUITA · ' + linea + ' (no es el número de ' + PLAN.vendedor + ')');
  });

  Logger.log('');
  if (!ops.length) {
    Logger.log('✅ Todos los botones de esta cuenta son de ' + PLAN.vendedor + '. No hay nada que quitar.');
    Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
    return;
  }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR al quitar ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log(bien + ' botón(es) del vendedor se quedan. ' + ops.length + ' con otro número ' + (vista ? 'se quitarían' : 'se quitaron') +
    (malos ? ' (' + malos + ' con error)' : '') + '.');
  Logger.log(vista ? (malos ? 'VISTA PREVIA CON ERRORES: manda el registro antes de ejecutar.' : 'VISTA PREVIA SIN ERRORES. Manda el registro; EJECUTAR solo con el OK.')
                   : 'LISTO. Los números viejos ya no están puestos en ningún lugar de esta cuenta.');
}
