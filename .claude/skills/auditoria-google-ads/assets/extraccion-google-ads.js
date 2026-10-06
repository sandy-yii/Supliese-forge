// EXTRACCIÓN PARA AUDITORÍA DE GOOGLE ADS — solo lectura.
// Vuelca los informes de una o varias cuentas a un Google Sheet, una pestaña por informe.
// No cambia nada en las cuentas: solo consulta (AdsApp.search) y escribe en la hoja.
//
// Dónde se pega: Google Ads > Herramientas > Acciones masivas > Scripts > "+".
// Funciona en un MCC (recorre CUENTAS) o en una cuenta suelta (ignora CUENTAS).
// Al autorizar, Google pide permiso para la cuenta y para Google Sheets: es lo esperado.
//
// Después: en la hoja, Archivo > Descargar > CSV, pestaña por pestaña, y esos CSV
// se pasan a scripts/auditar.py (todas en una misma carpeta; la columna "Cuenta" separa).

var HOJA = 'PEGAR_AQUI_LA_URL_DE_UNA_HOJA_VACIA';

var DESDE = '2026-01-01';          // periodo de la auditoría (AAAA-MM-DD)
var HASTA = '2026-09-30';
// change_event solo devuelve los últimos 30 días; el historial largo (hasta 2 años)
// se descarga desde la interfaz: Herramientas > Historial de cambios.
var CAMBIOS_DIAS = 29;

var CUENTAS = [];                  // ej. ['1234567890', '9876543210']; vacío = todas las del MCC

var REPORTES = [
  { tab: '01 Campanas', de: 'campaign', fecha: true, campos:
    'segments.month, campaign.name, campaign.status, campaign.primary_status, campaign.primary_status_reasons, campaign.advertising_channel_type, campaign.bidding_strategy_type, campaign_budget.amount_micros, campaign_budget.explicitly_shared, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value, metrics.all_conversions, metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share' },

  // Configuración que no aparece en el informe normal: redes y tipo de segmentación geográfica.
  { tab: '02 Config campanas', de: 'campaign', donde: 'campaign.status != "REMOVED"', campos:
    'campaign.name, campaign.status, campaign.network_settings.target_search_network, campaign.network_settings.target_partner_search_network, campaign.network_settings.target_content_network, campaign.geo_target_type_setting.positive_geo_target_type, campaign.geo_target_type_setting.negative_geo_target_type, campaign.bidding_strategy_type' },

  { tab: '03 Grupos', de: 'ad_group', fecha: true, campos:
    'segments.month, campaign.name, ad_group.name, ad_group.status, ad_group.primary_status, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  { tab: '04 Palabras clave', de: 'keyword_view', fecha: true, campos:
    'campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score, ad_group_criterion.quality_info.creative_quality_score, ad_group_criterion.quality_info.post_click_quality_score, ad_group_criterion.quality_info.search_predicted_ctr, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  { tab: '05 Terminos de busqueda', de: 'search_term_view', fecha: true,
    fin: 'ORDER BY metrics.cost_micros DESC LIMIT 20000', campos:
    'campaign.name, ad_group.name, search_term_view.search_term, search_term_view.status, segments.search_term_match_type, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  // Negativas que ya existen: sin esto se proponen negativas que la cuenta ya tiene.
  { tab: '06 Negativas campana', de: 'campaign_criterion',
    donde: 'campaign_criterion.negative = TRUE AND campaign_criterion.type = KEYWORD', campos:
    'campaign.name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type' },
  { tab: '07 Negativas grupo', de: 'ad_group_criterion',
    donde: 'ad_group_criterion.negative = TRUE AND ad_group_criterion.type = KEYWORD', campos:
    'campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type' },
  { tab: '08 Listas negativas', de: 'shared_criterion',
    donde: 'shared_set.type = NEGATIVE_KEYWORDS', campos:
    'shared_set.name, shared_set.status, shared_criterion.keyword.text, shared_criterion.keyword.match_type' },

  // Anuncios: rechazos y limitaciones por políticas, fuerza del anuncio y URL final.
  { tab: '09 Anuncios', de: 'ad_group_ad', fecha: true, campos:
    'campaign.name, ad_group.name, ad_group_ad.ad.id, ad_group_ad.ad.type, ad_group_ad.status, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status, ad_group_ad.policy_summary.policy_topic_entries, ad_group_ad.ad_strength, ad_group_ad.ad.final_urls, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  { tab: '10 Paginas de destino', de: 'landing_page_view', fecha: true, campos:
    'landing_page_view.unexpanded_final_url, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.mobile_friendly_clicks_percentage, metrics.speed_score' },

  { tab: '11 Dispositivos', de: 'campaign', fecha: true, campos:
    'campaign.name, segments.device, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  { tab: '12 Dia y hora', de: 'campaign', fecha: true, campos:
    'campaign.name, segments.day_of_week, segments.hour, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  // Presencia vs. interés: cuánto se gasta en gente que solo "se interesa" por la zona.
  { tab: '13 Tipo de ubicacion', de: 'geographic_view', fecha: true, campos:
    'campaign.name, geographic_view.location_type, geographic_view.country_criterion_id, metrics.clicks, metrics.cost_micros, metrics.conversions' },

  { tab: '14 Ubicaciones y horarios', de: 'campaign_criterion',
    donde: 'campaign_criterion.type IN (LOCATION, AD_SCHEDULE, PROXIMITY)', campos:
    'campaign.name, campaign_criterion.type, campaign_criterion.negative, campaign_criterion.location.geo_target_constant, campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour, campaign_criterion.ad_schedule.end_hour, campaign_criterion.bid_modifier' },

  { tab: '15 Config conversiones', de: 'conversion_action', campos:
    'conversion_action.name, conversion_action.status, conversion_action.primary_for_goal, conversion_action.include_in_conversions_metric, conversion_action.category, conversion_action.type, conversion_action.origin, conversion_action.counting_type, conversion_action.click_through_lookback_window_days, conversion_action.attribution_model_settings.attribution_model, conversion_action.value_settings.default_value, conversion_action.value_settings.always_use_default_value' },

  { tab: '16 Conversiones por accion', de: 'customer', fecha: true, campos:
    'segments.month, segments.conversion_action_name, segments.conversion_action_category, metrics.conversions, metrics.all_conversions, metrics.all_conversions_value' },

  // Requiere informes de llamadas activados; si no hay, la pestaña queda vacía.
  { tab: '17 Llamadas', de: 'call_view', campos:
    'campaign.name, call_view.start_call_date_time, call_view.call_duration_seconds, call_view.call_status, call_view.type' },

  { tab: '18 Historial de cambios', de: 'change_event', cambios: true, campos:
    'change_event.change_date_time, change_event.user_email, change_event.client_type, change_event.change_resource_type, change_event.resource_change_operation, change_event.changed_fields, change_event.campaign, change_event.ad_group' },

  { tab: '19 Presupuestos', de: 'campaign_budget', campos:
    'campaign_budget.name, campaign_budget.amount_micros, campaign_budget.explicitly_shared, campaign_budget.status, campaign_budget.reference_count, campaign_budget.delivery_method' }
];

function main() {
  if (HOJA.indexOf('docs.google.com') < 0) { throw new Error('Falta pegar la URL de la hoja en HOJA.'); }
  var libro = SpreadsheetApp.openByUrl(HOJA);
  var datos = {};
  REPORTES.forEach(function (r) { datos[r.tab] = []; });

  var esMcc = false;
  try { esMcc = (typeof AdsManagerApp !== 'undefined' && !!AdsManagerApp.accounts); } catch (e) {}

  if (esMcc) {
    var sel = AdsManagerApp.accounts();
    if (CUENTAS.length) { sel = sel.withIds(CUENTAS); }
    var it = sel.get(), vistas = 0;
    while (it.hasNext()) {
      var c = it.next();
      AdsManagerApp.select(c);
      juntar(c.getName() + ' (' + c.getCustomerId() + ')', datos);
      vistas++;
    }
    if (CUENTAS.length && vistas < CUENTAS.length) {
      Logger.log('AVISO: se encontraron ' + vistas + ' de ' + CUENTAS.length + ' cuentas; las que faltan no cuelgan de este MCC.');
    }
  } else {
    var a = AdsApp.currentAccount();
    juntar(a.getName() + ' (' + a.getCustomerId() + ')', datos);
  }

  REPORTES.forEach(function (r) {
    escribir(libro, r.tab, ['Cuenta'].concat(r.campos.split(', ')), datos[r.tab]);
  });
  escribir(libro, '00 Leeme', ['Dato', 'Valor'], [
    ['Periodo', DESDE + ' a ' + HASTA],
    ['Generado', Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd HH:mm') + ' GMT'],
    ['Montos', 'En la moneda de cada cuenta (micros ya convertidos)'],
    ['Cuotas de impresión', 'Fracción 0-1; no se suman, se promedian ponderando por gasto']
  ]);
  Logger.log('Listo: ' + HOJA);
}

function juntar(cuenta, datos) {
  Logger.log('== ' + cuenta);
  REPORTES.forEach(function (r) {
    var campos = r.campos.split(', ');
    try {
      var filas = AdsApp.search(consulta(r)), n = 0;
      while (filas.hasNext()) {
        var f = filas.next();
        datos[r.tab].push([cuenta].concat(campos.map(function (campo) { return valor(leer(f, campo), campo); })));
        n++;
      }
      Logger.log('   ' + r.tab + ': ' + n);
    } catch (e) {
      // Un informe que falla (p. ej. sin informes de llamadas) no detiene a los demás.
      Logger.log('   ' + r.tab + ': ERROR ' + e);
      datos[r.tab].push([cuenta, 'ERROR: ' + e]);
    }
  });
}

function consulta(r) {
  var condiciones = [];
  if (r.fecha) { condiciones.push('segments.date BETWEEN "' + DESDE + '" AND "' + HASTA + '"'); }
  if (r.cambios) {
    var hasta = new Date(), desde = new Date(hasta.getTime() - CAMBIOS_DIAS * 86400000);
    condiciones.push('change_event.change_date_time >= "' + fmt(desde) + '"');
    condiciones.push('change_event.change_date_time <= "' + fmt(hasta) + '"');
  }
  if (r.donde) { condiciones.push(r.donde); }
  var q = 'SELECT ' + r.campos + ' FROM ' + r.de;
  if (condiciones.length) { q += ' WHERE ' + condiciones.join(' AND '); }
  if (r.cambios) { q += ' ORDER BY change_event.change_date_time DESC LIMIT 10000'; }
  if (r.fin) { q += ' ' + r.fin; }
  return q;
}

function fmt(d) { return Utilities.formatDate(d, 'GMT', 'yyyy-MM-dd'); }

// 'ad_group.primary_status' -> fila.adGroup.primaryStatus
function leer(fila, campo) {
  var v = fila, partes = campo.split('.');
  for (var i = 0; i < partes.length; i++) {
    if (v === null || v === undefined) { return ''; }
    v = v[partes[i].replace(/_([a-z])/g, function (m, c) { return c.toUpperCase(); })];
  }
  return (v === null || v === undefined) ? '' : v;
}

function valor(v, campo) {
  if (v === '') { return ''; }
  if (Object.prototype.toString.call(v) === '[object Array]') {
    // Listas de objetos (p. ej. temas de políticas) se resumen por su nombre.
    return v.map(function (x) { return (x && typeof x === 'object') ? (x.topic || x.type || JSON.stringify(x)) : x; }).join(' | ');
  }
  if (typeof v === 'object') { return JSON.stringify(v); }
  if (/micros$/.test(campo)) { return Math.round(Number(v) / 10000) / 100; }
  if (typeof v === 'string' && v !== '' && !isNaN(v)) { return Number(v); }
  return v;
}

function escribir(libro, nombre, cabeza, filas) {
  var h = libro.getSheetByName(nombre) || libro.insertSheet(nombre);
  h.clear();
  var ancho = cabeza.length;
  h.getRange(1, 1, 1, ancho).setValues([cabeza]).setFontWeight('bold');
  h.setFrozenRows(1);
  for (var i = 0; i < filas.length; i += 2000) {
    var trozo = filas.slice(i, i + 2000).map(function (f) {
      var c = f.slice(0, ancho);
      while (c.length < ancho) { c.push(''); }
      return c;
    });
    h.getRange(2 + i, 1, trozo.length, ancho).setValues(trozo);
  }
}
