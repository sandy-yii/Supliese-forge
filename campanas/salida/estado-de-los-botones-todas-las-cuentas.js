/**
 * Atelback · ¿Ya aprobó Google los botones de llamada y WhatsApp? — las cinco cuentas
 * Escrito a mano el 5 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. En la cuenta donde se corre, los botones de LLAMADA y de WHATSAPP del vendedor
 * que están puestos en alguna campaña encendida: su estado de revisión en Google (aprobado, rechazado o en revisión),
 * el motivo si está rechazado y en cuántas campañas encendidas está.
 *
 * CÓMO SE USA: en cada cuenta > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var PLANES = {
  '256-397-2201': { marca: 'Quick Laundry', vendedor: 'Liliana', telefono: '3326012237' },
  '993-525-8739': { marca: 'Kingstar (CLM)', vendedor: 'Jorge', telefono: '3315641538' },
  '265-909-2662': { marca: 'Laundry Solutions', vendedor: 'Sergio', telefono: '3314172994' },
  '860-582-6837': { marca: 'Girbau', vendedor: 'Eduardo', telefono: '3328068994' },
  '118-347-6484': { marca: 'Gamesail', vendedor: 'Silvia', telefono: '3311859797' }
};
var ESTADO = { APPROVED: '✅ APROBADO', APPROVED_LIMITED: '✅ APROBADO (limitado)', DISAPPROVED: '❌ RECHAZADO', AREA_OF_INTEREST_ONLY: '⚠️ solo en algunas zonas' };

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
  var P = PLANES[cid];
  if (!P) throw new Error('La cuenta ' + cid + ' no está en la lista. No se hizo nada.');
  Logger.log('ESTADO DE LOS BOTONES · ' + P.marca + ' · vendedor ' + P.vendedor + ' · solo lee');
  Logger.log('');

  var A = {};
  filas("SELECT campaign.name, asset.resource_name, asset.type, asset.call_asset.phone_number, " +
    "asset.business_message_asset.whatsapp_info.phone_number, asset.policy_summary.approval_status, asset.policy_summary.review_status, " +
    "asset.policy_summary.policy_topic_entries, campaign_asset.status FROM campaign_asset " +
    "WHERE campaign_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE') AND campaign_asset.status = 'ENABLED' AND campaign.status = 'ENABLED'",
    'los botones').forEach(function (f) {
    var a = f.asset, ps = a.policySummary || {};
    var esLlamada = a.type === 'CALL';
    var n = esLlamada ? (a.callAsset || {}).phoneNumber : (((a.businessMessageAsset || {}).whatsappInfo) || {}).phoneNumber;
    var x = A[a.resourceName] = A[a.resourceName] || { tipo: esLlamada ? 'Llamada' : 'WhatsApp', numero: n, aprob: ps.approvalStatus,
      rev: ps.reviewStatus, motivos: (ps.policyTopicEntries || []).map(function (t) { return t.topic; }), campanas: [] };
    x.campanas.push(f.campaign.name);
  });

  var resumen = [];
  Object.keys(A).forEach(function (k) {
    var x = A[k], mio = diez(x.numero) === P.telefono;
    var estado = x.rev === 'REVIEW_IN_PROGRESS' || x.rev === 'UNDER_APPEAL' ? '⏳ EN REVISIÓN' : (ESTADO[x.aprob] || (x.aprob || '?'));
    Logger.log(x.tipo + ' ' + x.numero + (mio ? ' (de ' + P.vendedor + ')' : ' ⚠️ NO es el número de ' + P.vendedor) + ' · ' + estado +
      (x.motivos.length && /RECHAZADO/.test(estado) ? ' · motivo: ' + x.motivos.join(', ') : '') +
      ' · puesto en ' + x.campanas.length + ' campaña(s) encendida(s)');
    resumen.push(x.tipo + ' ' + estado.replace(/^[^A-ZÁÉÍÓÚ]+/, ''));
  });
  if (!Object.keys(A).length) Logger.log('No hay botones de llamada ni de WhatsApp puestos en campañas encendidas.');
  Logger.log('');
  Logger.log('BOTONES · ' + P.marca + ' · ' + (resumen.length ? resumen.join(' · ') : 'ninguno puesto'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
