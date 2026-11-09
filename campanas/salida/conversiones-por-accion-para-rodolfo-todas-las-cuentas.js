/**
 * Atelback · Conversiones del fin de semana por acción, para Rodolfo (tablero C91) — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Responde lo que pidió Rodolfo, sin buscarlo a mano en la pantalla:
 *   1. Del sábado 7 al lunes 9 de noviembre: cuántas conversiones tiene cada acción (WhatsApp, llamada, formulario…),
 *      contadas por el día del clic (como sale en la pantalla de Google Ads) y por el día en que pasó.
 *   2. Las conversiones que NO son WhatsApp, una por una: día, hora del clic, campaña y acción.
 *   3. Las acciones de conversión encendidas: cuáles son principales y si alguna principal NO es «AB · …».
 *   4. Si hay formularios dentro del anuncio (formulario de clientes potenciales) puestos en alguna campaña.
 *      Esos datos se quedan en Google Ads y no llegan ni a la página ni al correo.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var DESDE = '2026-11-07', HASTA = '2026-11-09';
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function hh(h) { return ('0' + h).slice(-2) + ':00'; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  var rango = "segments.date BETWEEN '" + DESDE + "' AND '" + HASTA + "'";
  Logger.log('CONVERSIONES POR ACCIÓN · ' + marca + ' · del ' + DESDE + ' al ' + HASTA + ' (el lunes, hasta ahora) · zona ' +
    cuenta.getTimeZone() + ' · solo lee');
  Logger.log('');

  // 1. Por acción
  Logger.log('==== 1. CONVERSIONES POR ACCIÓN ====');
  var A = {};
  filas("SELECT segments.conversion_action_name, metrics.all_conversions FROM customer WHERE " + rango, 'por día del clic')
    .forEach(function (f) {
      var a = f.segments.conversionActionName;
      (A[a] = A[a] || { clic: 0, paso: 0 }).clic += Number(f.metrics.allConversions) || 0;
    });
  var porPaso = filas("SELECT segments.conversion_action_name, metrics.all_conversions_by_conversion_date FROM customer WHERE " + rango,
    'por día en que pasó');
  porPaso.forEach(function (f) {
    var a = f.segments.conversionActionName;
    (A[a] = A[a] || { clic: 0, paso: 0 }).paso += Number(f.metrics.allConversionsByConversionDate) || 0;
  });
  var nombres = Object.keys(A).filter(function (a) { return A[a].clic || A[a].paso; });
  nombres.forEach(function (a) {
    Logger.log(a + ' · ' + n(A[a].clic) + ' por día del clic (como en la pantalla) · ' + n(A[a].paso) + ' por día en que pasó');
  });
  if (!nombres.length) Logger.log('Ninguna conversión en ese rango.');
  Logger.log('');

  // 2. Las que no son WhatsApp
  Logger.log('==== 2. LAS QUE NO SON WHATSAPP, UNA POR UNA (hora del clic) ====');
  var otras = 0;
  filas("SELECT campaign.name, campaign.advertising_channel_type, segments.conversion_action_name, segments.date, segments.hour, " +
    "metrics.all_conversions FROM campaign WHERE " + rango, 'el detalle').forEach(function (f) {
      var a = f.segments.conversionActionName, c = Number(f.metrics.allConversions) || 0;
      if (!c || /whats/i.test(a)) return;
      otras++;
      Logger.log(f.segments.date + ' · ' + hh(f.segments.hour) + '–' + hh(f.segments.hour).replace(':00', ':59') + ' · ' + a +
        ' · «' + f.campaign.name + '» · ' + n(c) +
        (f.campaign.advertisingChannelType === 'PERFORMANCE_MAX' ? ' (Máximo rendimiento: la hora no es confiable)' : ''));
    });
  if (!otras) Logger.log('Ninguna: todas las conversiones del rango son de WhatsApp.');
  Logger.log('');

  // 3. Acciones encendidas
  Logger.log('==== 3. ACCIONES DE CONVERSIÓN ENCENDIDAS ====');
  var raras = [];
  filas("SELECT conversion_action.name, conversion_action.type, conversion_action.category, conversion_action.primary_for_goal, " +
    "conversion_action.include_in_conversions_metric FROM conversion_action WHERE conversion_action.status = 'ENABLED'",
    'las acciones').forEach(function (f) {
      var a = f.conversionAction, principal = a.primaryForGoal || a.includeInConversionsMetric;
      var esAB = /^AB\s*·/.test(a.name);
      if (principal && !esAB) raras.push(a.name);
      Logger.log((principal ? 'PRINCIPAL  ' : 'secundaria ') + '· ' + a.name + ' · tipo ' + a.type + ' · ' + a.category +
        (principal && !esAB ? '  ⚠️ principal y NO es «AB · …»' : ''));
    });
  Logger.log('');

  // 4. Formularios dentro del anuncio
  Logger.log('==== 4. FORMULARIOS DENTRO DEL ANUNCIO (clientes potenciales) ====');
  var lf = filas("SELECT campaign.name, campaign.status, asset.name, asset.lead_form_asset.headline, campaign_asset.status FROM campaign_asset " +
    "WHERE campaign_asset.field_type = 'LEAD_FORM' AND campaign_asset.status = 'ENABLED'", 'los formularios del anuncio');
  lf.forEach(function (f) {
    Logger.log('«' + f.campaign.name + '» (' + f.campaign.status + ') · ' + ((f.asset.leadFormAsset || {}).headline || f.asset.name || 'formulario'));
  });
  if (!lf.length) Logger.log('Ninguno puesto en campañas. Nada se queda guardado dentro de Google Ads.');
  Logger.log('');

  Logger.log('RODOLFO · ' + marca + ' · ' + (nombres.length ? nombres.map(function (a) { return a + ' ' + n(A[a].clic); }).join(' · ') : 'sin conversiones') +
    ' · no-WhatsApp: ' + otras + ' · principales que no son AB: ' + (raras.length ? raras.join(', ') : 'ninguna') +
    ' · formularios en el anuncio: ' + lf.length);
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
