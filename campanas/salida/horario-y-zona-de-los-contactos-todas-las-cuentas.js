/**
 * Atelback · ¿Por qué llegan contactos de madrugada? Horario, zona y red de las campañas — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. En la cuenta donde se corre:
 *   1. La zona horaria de la cuenta (las horas de los reportes salen en esa zona).
 *   2. Cada campaña encendida: en qué horario sale, en qué zona (y si es «personas que están ahí» o también
 *      «interesadas»), y en qué red (solo Google, socios de búsqueda, Display, Máximo rendimiento).
 *   3. Últimos 30 días por tramo del día (madrugada 0–6, mañana 7–12, tarde 13–18, noche 19–23):
 *      clics, gasto y contactos.
 *   4. Los contactos de madrugada uno por uno: hora, campaña, red y dispositivo.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var DIAS = 30;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var DIA = { MONDAY: 'lun', TUESDAY: 'mar', WEDNESDAY: 'mié', THURSDAY: 'jue', FRIDAY: 'vie', SATURDAY: 'sáb', SUNDAY: 'dom' };
var RED = { SEARCH: 'Google', SEARCH_PARTNERS: 'socios de búsqueda', CONTENT: 'Display', YOUTUBE: 'YouTube', YOUTUBE_SEARCH: 'YouTube',
  YOUTUBE_WATCH: 'YouTube', MIXED: 'Máximo rendimiento (varias redes)', GOOGLE_TV: 'Google TV' };
var DISP = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta', CONNECTED_TV: 'tele', OTHER: 'otro' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(m) { return '$' + Math.round((Number(m) || 0) / 1e6).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function tramo(h) { return h <= 6 ? 'madrugada (0–6 h)' : h <= 12 ? 'mañana (7–12 h)' : h <= 18 ? 'tarde (13–18 h)' : 'noche (19–23 h)'; }
function hh(h) { return ('0' + h).slice(-2) + ':00'; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var hasta = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - DIAS * 864e5), tz, 'yyyy-MM-dd');
  var rango = "segments.date BETWEEN '" + desde + "' AND '" + hasta + "'";
  Logger.log('HORARIO Y ZONA · ' + marca + ' · del ' + desde + ' al ' + hasta + ' · solo lee');
  Logger.log('');

  Logger.log('==== 1. ZONA HORARIA DE LA CUENTA ====');
  Logger.log(tz + (/Mexico_City|Monterrey|Merida|Chihuahua|Matamoros|Bahia_Banderas/.test(tz)
    ? ' · hora del centro de México: las horas de abajo son hora de México.'
    : ' · ⚠️ NO es hora del centro de México: las horas de abajo están corridas respecto a México.'));
  Logger.log('');

  // 2. Configuración de cada campaña
  Logger.log('==== 2. HORARIO, ZONA Y RED DE CADA CAMPAÑA ENCENDIDA ====');
  var C = {};
  filas("SELECT campaign.id, campaign.name, campaign.advertising_channel_type, campaign.geo_target_type_setting.positive_geo_target_type, " +
    "campaign.network_settings.target_google_search, campaign.network_settings.target_search_network, " +
    "campaign.network_settings.target_content_network, campaign.network_settings.target_partner_search_network " +
    "FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
      C[f.campaign.id] = { c: f.campaign, horario: [], zonas: [], fuera: [] };
    });
  filas("SELECT campaign.id, campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour, " +
    "campaign_criterion.ad_schedule.end_hour FROM campaign_criterion WHERE campaign_criterion.type = 'AD_SCHEDULE' AND campaign.status = 'ENABLED'",
    'los horarios').forEach(function (f) {
      var s = f.campaignCriterion.adSchedule, x = C[f.campaign.id];
      if (x) x.horario.push(DIA[s.dayOfWeek] + ' ' + s.startHour + '–' + s.endHour + ' h');
    });
  var geos = {};
  filas("SELECT campaign.id, campaign_criterion.location.geo_target_constant, campaign_criterion.negative FROM campaign_criterion " +
    "WHERE campaign_criterion.type = 'LOCATION' AND campaign.status = 'ENABLED'", 'las zonas').forEach(function (f) {
      var g = f.campaignCriterion.location.geoTargetConstant, x = C[f.campaign.id];
      geos[g] = g;
      if (x) (f.campaignCriterion.negative ? x.fuera : x.zonas).push(g);
    });
  var ids = Object.keys(geos);
  if (ids.length) {
    filas("SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name FROM geo_target_constant WHERE " +
      "geo_target_constant.resource_name IN ('" + ids.join("','") + "')", 'los nombres de las zonas').forEach(function (f) {
        geos[f.geoTargetConstant.resourceName] = f.geoTargetConstant.canonicalName;
      });
  }
  var avisos = [];
  Object.keys(C).forEach(function (id) {
    var x = C[id], c = x.c, ns = c.networkSettings || {};
    var redes = ['Google'];
    if (ns.targetPartnerSearchNetwork) redes.push('⚠️ socios de búsqueda');
    if (ns.targetContentNetwork) redes.push('⚠️ Display');
    var pmax = c.advertisingChannelType === 'PERFORMANCE_MAX';
    var tipo = (c.geoTargetTypeSetting || {}).positiveGeoTargetType;
    Logger.log('«' + c.name + '»' + (pmax ? ' (Máximo rendimiento: sale en todas las redes de Google)' : ''));
    Logger.log('    horario: ' + (x.horario.length ? x.horario.join(' · ') : 'todo el día, todos los días'));
    Logger.log('    zona: ' + (x.zonas.length ? x.zonas.map(function (g) { return geos[g]; }).join(' · ') : '⚠️ sin zona (todo el mundo)') +
      (x.fuera.length ? ' · excluye: ' + x.fuera.map(function (g) { return geos[g]; }).join(' · ') : ''));
    Logger.log('    a quién: ' + (tipo === 'PRESENCE' ? 'solo personas que están en la zona' :
      tipo === 'PRESENCE_OR_INTEREST' ? '⚠️ personas en la zona o interesadas en ella (puede salir fuera de México)' : (tipo || '?')));
    if (!pmax) Logger.log('    red: ' + redes.join(' + '));
    if (!x.horario.length) avisos.push(c.name + ': sale de madrugada');
    if (tipo === 'PRESENCE_OR_INTEREST') avisos.push(c.name + ': incluye «interesadas»');
    if (!pmax && ns.targetPartnerSearchNetwork) avisos.push(c.name + ': socios de búsqueda');
    if (!pmax && ns.targetContentNetwork) avisos.push(c.name + ': Display');
  });
  Logger.log('');

  // 3. Por tramo del día
  Logger.log('==== 3. ÚLTIMOS ' + DIAS + ' DÍAS POR TRAMO DEL DÍA ====');
  var T = {}, noche = [], total = { clics: 0, costo: 0, conv: 0 };
  ['madrugada (0–6 h)', 'mañana (7–12 h)', 'tarde (13–18 h)', 'noche (19–23 h)'].forEach(function (k) { T[k] = { clics: 0, costo: 0, conv: 0 }; });
  filas("SELECT campaign.name, campaign.advertising_channel_type, segments.hour, segments.ad_network_type, segments.device, " +
    "metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM campaign WHERE " + rango, 'las horas').forEach(function (f) {
      var h = Number(f.segments.hour), m = f.metrics, t = T[tramo(h)], conv = Number(m.allConversions) || 0;
      t.clics += Number(m.clicks) || 0; t.costo += Number(m.costMicros) || 0; t.conv += conv;
      total.clics += Number(m.clicks) || 0; total.costo += Number(m.costMicros) || 0; total.conv += conv;
      if (h <= 6 && conv > 0) noche.push({ h: h, txt: hh(h) + ' · «' + f.campaign.name + '» · ' + (RED[f.segments.adNetworkType] || f.segments.adNetworkType) +
        ' · ' + (DISP[f.segments.device] || f.segments.device) + ' · ' + n(conv) + ' contacto(s) · ' + (Number(m.clicks) || 0) + ' clics en esa hora' +
        (f.campaign.advertisingChannelType === 'PERFORMANCE_MAX' ? ' (en Máximo rendimiento la hora no es confiable)' : '') });
    });
  Object.keys(T).forEach(function (k) {
    var t = T[k];
    Logger.log(k + ' · ' + t.clics + ' clics · ' + pesos(t.costo) + ' · ' + n(t.conv) + ' contactos' +
      (total.conv ? ' (' + Math.round(100 * t.conv / total.conv) + '% de los contactos)' : '') +
      (t.conv >= 0.5 ? ' · costo por contacto ' + pesos(t.costo / t.conv) : ''));
  });
  Logger.log('');

  Logger.log('==== 4. CONTACTOS DE MADRUGADA, UNO POR UNO ====');
  noche.sort(function (a, b) { return a.h - b.h; }).forEach(function (x) { Logger.log(x.txt); });
  if (!noche.length) Logger.log('Ninguno en ' + DIAS + ' días.');
  Logger.log('');

  var mad = T['madrugada (0–6 h)'];
  Logger.log('HORARIO · ' + marca + ' · zona horaria ' + tz + ' · madrugada: ' + n(mad.conv) + ' de ' + n(total.conv) + ' contactos, ' +
    pesos(mad.costo) + ' de ' + pesos(total.costo) + ' · ' + (avisos.length ? 'avisos: ' + avisos.join(' | ') : 'sin avisos'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
