/**
 * Atelback · Revisión diaria — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Resume cómo le fue
 * ayer a cada campaña nueva «AB ·» contra su promedio desde el arranque: estado, presupuesto, clics, costo por clic,
 * cuota de impresiones, conversiones y llamadas, anuncios rechazados, zona (solo México), búsquedas reales de ayer, recomendaciones
 * que da Google, el estado del teléfono del botón de llamada y avisos de qué mover. Al final imprime las líneas «TABLERO» con
 * los datos día por día para los tableros. No cambia nada en la cuenta.
 * La campanita de notificaciones de Google Ads no se puede leer desde un script; las recomendaciones sí.
 *
 * CÓMO SE USA: cada mañana, pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var MOTIVOS = {
  SEARCH_VOLUME_LIMITED: 'pocas búsquedas', BUDGET_CONSTRAINED: 'limitada por presupuesto',
  BIDDING_STRATEGY_LEARNING: 'aprendiendo', BIDDING_STRATEGY_LIMITED: 'puja limitada', BIDDING_STRATEGY_CONSTRAINED: 'puja limitada por el tope',
  HAS_ADS_LIMITED_BY_POLICY: 'anuncios con restricciones', HAS_ADS_DISAPPROVED: 'anuncios rechazados',
  MOST_ADS_UNDER_REVIEW: 'anuncios en revisión', CALL_EXTENSION_UNDER_REVIEW: 'teléfono en revisión', CALL_EXTENSION_DISAPPROVED: 'teléfono rechazado'
};
var ESTADOS = { ELIGIBLE: 'apta', LIMITED: 'limitada', LEARNING: 'aprendiendo', NOT_ELIGIBLE: 'NO APTA', PENDING: 'pendiente', PAUSED: 'en pausa', MISCONFIGURED: 'mal configurada' };

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function num(x) { return Number(x || 0); }
function dinero(x) { return '$' + Math.round(x).toLocaleString('es-MX'); }
function pesos(x) { return '$' + x.toFixed(2); }
function uno(x) { return (Math.round(x * 10) / 10).toString(); }
function pct(x) { return x === undefined || x === null || x === '' ? '—' : Math.round(Number(x) * 100) + '%'; }
function aFecha(t) { var p = t.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
function mas(t, dias) { var d = aFecha(t); d.setUTCDate(d.getUTCDate() + dias); return d.toISOString().substring(0, 10); }
function entre(a, b) { return Math.round((aFecha(b) - aFecha(a)) / 864e5); }
function vacio() { return { imp: 0, clics: 0, costo: 0, conv: 0, llamadas: 0 }; }
function sumar(t, m) { t.imp += num(m.impressions); t.clics += num(m.clicks); t.costo += num(m.costMicros) / 1e6; t.conv += num(m.conversions); }
function cpc(t) { return t.clics ? t.costo / t.clics : 0; }
function corto(t, dias) {
  var d = dias || 1;
  return uno(t.clics / d) + ' clics · ' + dinero(t.costo / d) + ' · CPC ' + (t.clics ? pesos(cpc(t)) : '—') +
    ' · CTR ' + (t.imp ? uno(t.clics / t.imp * 100) + '%' : '—') + ' · conv ' + uno(t.conv / d) + ' · llamadas ' + uno(t.llamadas / d);
}
function cambio(a, b) { return b ? (a >= b ? '+' : '') + Math.round((a / b - 1) * 100) + '%' : 'nuevo'; }

function main() {
  revisarCuenta();
  var tz = AdsApp.currentAccount().getTimeZone();
  var ahora = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
  var hoy = ahora.substring(0, 10), ayer = mas(hoy, -1);
  var planDe = {};
  PLAN.campanas.forEach(function (k) { planDe[k.nombre] = k; });

  var inicio = '';
  var itc = AdsApp.campaigns().get();
  while (itc.hasNext()) {
    var cc = itc.next();
    if (!esNueva(cc.getName())) continue;
    var x = cc.getStartDate();
    if (!x) continue;
    var t = x.year + '-' + ('0' + x.month).slice(-2) + '-' + ('0' + x.day).slice(-2);
    if (!inicio || t < inicio) inicio = t;
  }
  if (!inicio || inicio > ayer) throw new Error('Las campañas «' + PLAN.prefijo + '» todavía no tienen un día completo. Córrelo mañana.');
  var dias = entre(inicio, hoy);                // días completos, ayer incluido
  var previos = dias - 1;                       // días completos antes de ayer
  function rango(a, b) { return "segments.date BETWEEN '" + a + "' AND '" + b + "'"; }
  Logger.log('REVISIÓN DIARIA · ' + PLAN.nombre + ' · ' + ahora + ' · día ' + dias + ' desde el arranque (' + inicio + ') · AYER = ' + ayer + ' · solo lee');

  // ---- Campañas
  var C = {};
  filas('SELECT campaign.name, campaign.status, campaign.primary_status, campaign.primary_status_reasons, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    "campaign_budget.amount_micros FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { nueva: esNueva(f.campaign.name), estado: f.campaign.primaryStatus, motivos: f.campaign.primaryStatusReasons || [],
      presupuesto: num(f.campaignBudget.amountMicros) / 1e6, tope: num((f.campaign.targetSpend || {}).cpcBidCeilingMicros) / 1e6,
      ayer: vacio(), antes: vacio(), hoy: vacio(), cuota: {}, aprobados: 0, limitados: 0, rechazados: [], revision: 0 };
  });
  function cargar(cual, donde) {
    filas('SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions FROM campaign WHERE ' + donde +
      " AND campaign.status = 'ENABLED'", 'los números (' + cual + ')').forEach(function (f) {
      if (C[f.campaign.name]) sumar(C[f.campaign.name][cual], f.metrics || {});
    });
    filas('SELECT campaign.name, metrics.phone_calls FROM campaign WHERE ' + donde + " AND campaign.status = 'ENABLED' AND metrics.phone_calls > 0",
      'las llamadas (' + cual + ')').forEach(function (f) {
      if (C[f.campaign.name]) C[f.campaign.name][cual].llamadas += num((f.metrics || {}).phoneCalls);
    });
  }
  cargar('ayer', 'segments.date DURING YESTERDAY');
  if (previos > 0) cargar('antes', rango(inicio, mas(ayer, -1)));
  cargar('hoy', 'segments.date DURING TODAY');
  filas('SELECT campaign.name, metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share ' +
    "FROM campaign WHERE segments.date DURING YESTERDAY AND campaign.status = 'ENABLED'", 'la cuota de impresiones').forEach(function (f) {
    var m = f.metrics || {};
    if (C[f.campaign.name]) C[f.campaign.name].cuota = { tiene: m.searchImpressionShare, presupuesto: m.searchBudgetLostImpressionShare, puja: m.searchRankLostImpressionShare };
  });
  filas('SELECT campaign.name, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status, ad_group.name FROM ad_group_ad ' +
    "WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
    var c = C[f.campaign.name], p = f.adGroupAd.policySummary || {};
    if (!c) return;
    if (p.approvalStatus === 'DISAPPROVED') c.rechazados.push(f.adGroup.name);
    else if (p.approvalStatus === 'APPROVED_LIMITED' || p.approvalStatus === 'AREA_OF_INTEREST_ONLY') c.limitados++;
    else if (p.approvalStatus === 'APPROVED') c.aprobados++;
    else c.revision++;
  });

  // ---- Totales
  var T = { ayer: vacio(), antes: vacio(), hoy: vacio() }, V = { ayer: vacio() };
  Object.keys(C).forEach(function (n) {
    var c = C[n];
    ['ayer', 'antes', 'hoy'].forEach(function (k) {
      if (!c.nueva) { if (k === 'ayer') ['imp', 'clics', 'costo', 'conv', 'llamadas'].forEach(function (q) { V.ayer[q] += c.ayer[q]; }); return; }
      ['imp', 'clics', 'costo', 'conv', 'llamadas'].forEach(function (q) { T[k][q] += c[k][q]; });
    });
  });
  Logger.log('');
  Logger.log('==== CAMPAÑAS NUEVAS · TOTAL ====');
  Logger.log('AYER: ' + corto(T.ayer));
  if (previos > 0) {
    Logger.log('PROMEDIO DE LOS ' + previos + ' DÍA(S) ANTERIORES: ' + corto(T.antes, previos));
    Logger.log('AYER CONTRA EL PROMEDIO: clics ' + cambio(T.ayer.clics, T.antes.clics / previos) + ' · costo por clic ' +
      cambio(cpc(T.ayer), cpc(T.antes)) + ' · gasto ' + cambio(T.ayer.costo, T.antes.costo / previos));
  }
  Logger.log('HOY hasta ' + ahora.substring(11) + ': ' + corto(T.hoy));
  if (V.ayer.imp) Logger.log('ANTERIORES encendidas, ayer: ' + corto(V.ayer));

  // ---- Por campaña
  Logger.log('');
  Logger.log('==== POR CAMPAÑA (ayer · y promedio de los días anteriores) ====');
  var A = { grave: [], mover: [], ojo: [] };
  var nombres = Object.keys(C).filter(function (n) { return C[n].nueva; })
    .sort(function (a, b) { return C[b].ayer.costo - C[a].ayer.costo; });
  nombres.forEach(function (n) {
    var c = C[n], k = planDe[n] || {};
    var motivos = c.motivos.map(function (r) { return MOTIVOS[r] || r; });
    var gasto = c.presupuesto ? Math.round(c.ayer.costo / c.presupuesto * 100) : 0;
    Logger.log(n.replace(PLAN.prefijo, '') + ' · ' + (ESTADOS[c.estado] || c.estado) + (motivos.length ? ' (' + motivos.join(', ') + ')' : '') +
      ' · presupuesto ' + dinero(c.presupuesto) + '/día, ayer gastó ' + gasto + '% · tope CPC ' + (c.tope ? pesos(c.tope) : '—'));
    Logger.log('   ayer: ' + num(c.ayer.imp) + ' impr · ' + corto(c.ayer) + ' · cuota ' + pct(c.cuota.tiene) + ', pierde ' + pct(c.cuota.presupuesto) +
      ' por presupuesto y ' + pct(c.cuota.puja) + ' por puja');
    if (previos > 0) Logger.log('   antes: ' + corto(c.antes, previos));
    Logger.log('   anuncios: ' + c.aprobados + ' aprobados' + (c.limitados ? ', ' + c.limitados + ' con restricciones' : '') +
      (c.revision ? ', ' + c.revision + ' en revisión' : '') + (c.rechazados.length ? ', RECHAZADOS en: ' + c.rechazados.join(', ') : ''));

    var corto2 = n.replace(PLAN.prefijo, '');
    var aprende = c.motivos.indexOf('BIDDING_STRATEGY_LEARNING') >= 0;
    if (c.rechazados.length) A.grave.push(corto2 + ': tiene anuncios rechazados (' + c.rechazados.join(', ') + ').');
    if (c.estado === 'NOT_ELIGIBLE') A.grave.push(corto2 + ': Google dice que no puede salir.');
    if (Number(c.cuota.presupuesto) >= 0.2 && c.ayer.clics && (!k.cpc || cpc(c.ayer) <= k.cpc)) {
      A.mover.push(corto2 + ': se queda sin presupuesto (pierde ' + pct(c.cuota.presupuesto) + ') con clic a ' + pesos(cpc(c.ayer)) +
        '. Candidata a subir presupuesto' + (aprende ? ' cuando termine de aprender.' : '.'));
    }
    if (Number(c.cuota.puja) >= 0.5) A.ojo.push(corto2 + ': pierde ' + pct(c.cuota.puja) + ' de las subastas por puja: el tope de CPC es bajo.');
    if (c.motivos.indexOf('SEARCH_VOLUME_LIMITED') >= 0 || (!c.ayer.imp && !c.antes.imp)) A.ojo.push(corto2 + ': casi no sale (pocas búsquedas). Necesita palabras más abiertas.');
    if (c.ayer.costo > 0 && !c.ayer.clics) A.ojo.push(corto2 + ': ayer gastó sin clics.');
  });

  // ---- Conversiones de ayer
  Logger.log('');
  Logger.log('==== CONVERSIONES DE AYER (todas las campañas) ====');
  var hayAB = false, alguna = false;
  filas('SELECT segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE segments.date DURING YESTERDAY', 'las conversiones')
    .forEach(function (f) {
      var v = num((f.metrics || {}).allConversions);
      if (!v) return;
      alguna = true;
      if (esNueva(f.segments.conversionActionName)) hayAB = true;
      Logger.log('«' + f.segments.conversionActionName + '»: ' + uno(v));
    });
  if (!alguna) Logger.log('Ninguna.');
  if (!hayAB) filas('SELECT segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE ' + rango(inicio, hoy), 'las conversiones desde el arranque')
    .forEach(function (f) { if (num((f.metrics || {}).allConversions) && esNueva(f.segments.conversionActionName)) hayAB = true; });
  if (!hayAB && T.ayer.clics + T.antes.clics >= 20) A.ojo.push('Medición: ninguna conversión «' + PLAN.prefijo + '» (formulario o WhatsApp) desde el arranque, con ' + (T.ayer.clics + T.antes.clics) + ' clics. Revisar con Rodolfo que la página las mande.');

  // ---- Zona: Gamesail y el grupo solo surten en México
  Logger.log('');
  Logger.log('==== ZONA (solo México) ====');
  var MEXICO = 'MX', zonas = {}, fuera = [];
  filas('SELECT campaign.name, campaign.geo_target_type_setting.positive_geo_target_type FROM campaign WHERE campaign.status = \'ENABLED\'', 'el tipo de zona')
    .forEach(function (f) {
      zonas[f.campaign.name] = { tipo: (f.campaign.geoTargetTypeSetting || {}).positiveGeoTargetType, lugares: [] };
    });
  filas("SELECT campaign.name, campaign_criterion.location.geo_target_constant FROM campaign_criterion WHERE campaign_criterion.type = 'LOCATION' " +
    "AND campaign_criterion.negative = FALSE AND campaign.status = 'ENABLED'", 'las zonas').forEach(function (f) {
    if (zonas[f.campaign.name]) zonas[f.campaign.name].lugares.push(f.campaignCriterion.location.geoTargetConstant);
  });
  var todos = {};
  Object.keys(zonas).forEach(function (n) { zonas[n].lugares.forEach(function (l) { todos[l] = true; }); });
  var pais = {};
  var lista = Object.keys(todos);
  if (lista.length) filas('SELECT geo_target_constant.resource_name, geo_target_constant.country_code, geo_target_constant.name FROM geo_target_constant ' +
    "WHERE geo_target_constant.resource_name IN ('" + lista.join("','") + "')", 'los nombres de las zonas').forEach(function (f) {
    pais[f.geoTargetConstant.resourceName] = { pais: f.geoTargetConstant.countryCode, nombre: f.geoTargetConstant.name };
  });
  Object.keys(zonas).forEach(function (n) {
    var z = zonas[n], otros = z.lugares.filter(function (l) { return pais[l] && pais[l].pais !== MEXICO; })
      .map(function (l) { return pais[l].nombre + ' (' + pais[l].pais + ')'; });
    var corto3 = n.replace(PLAN.prefijo, '');
    if (!z.lugares.length) A.grave.push(corto3 + ': no tiene zona, así que sale en TODOS los países. Ponerle México.');
    if (otros.length) A.grave.push(corto3 + ': también sale fuera de México: ' + otros.join(', ') + '. Quitarlos.');
    if (z.tipo && z.tipo !== 'PRESENCE') A.ojo.push(corto3 + ': muestra anuncios a personas «interesadas» en México aunque estén en otro país. Cambiar a «Presencia: personas que están en la zona».');
    if (!z.lugares.length || otros.length || (z.tipo && z.tipo !== 'PRESENCE')) fuera.push(corto3);
  });
  Logger.log(fuera.length ? 'Revisar zona en: ' + fuera.join(', ') + ' (detalle abajo, en QUÉ MOVER).' : 'Todas las campañas encendidas salen solo para personas en México.');
  filas('SELECT geographic_view.country_criterion_id, metrics.clicks, metrics.cost_micros FROM geographic_view WHERE segments.date DURING YESTERDAY ' +
    'AND metrics.clicks > 0', 'los clics por país').forEach(function (f) {
    var id = String(f.geographicView.countryCriterionId);
    if (id !== '2484') A.ojo.push('Ayer hubo ' + num(f.metrics.clicks) + ' clic(s) desde fuera de México (país ' + id + '), ' + pesos(num(f.metrics.costMicros) / 1e6) + '.');
  });

  // ---- Búsquedas reales de ayer
  Logger.log('');
  Logger.log('==== BÚSQUEDAS DE AYER (campañas nuevas, por gasto) ====');
  var bs = filas('SELECT search_term_view.search_term, campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions ' +
    'FROM search_term_view WHERE segments.date DURING YESTERDAY AND metrics.impressions > 0 ORDER BY metrics.cost_micros DESC LIMIT 300', 'las búsquedas')
    .filter(function (f) { return esNueva(f.campaign.name); });
  if (!bs.length) Logger.log('Ninguna visible todavía (Google tarda unas horas en mostrarlas).');
  bs.slice(0, 30).forEach(function (f) {
    var m = f.metrics;
    Logger.log('«' + f.searchTermView.searchTerm + '» · ' + f.campaign.name.replace(PLAN.prefijo, '') + ' · ' + num(m.impressions) + ' impr · ' +
      num(m.clicks) + ' clics · ' + pesos(num(m.costMicros) / 1e6) + (num(m.conversions) ? ' · ' + uno(num(m.conversions)) + ' conv' : ''));
  });

  // ---- Recomendaciones de Google (solo se listan; ninguna se aplica)
  Logger.log('');
  Logger.log('==== RECOMENDACIONES DE GOOGLE (no se aplica ninguna) ====');
  var REC = {
    CALL_EXTENSION: 'agregar teléfono (botón de llamada)', CALL_ASSET: 'agregar teléfono (botón de llamada)',
    SITELINK_EXTENSION: 'agregar enlaces de sitio', SITELINK_ASSET: 'agregar enlaces de sitio', CALLOUT_EXTENSION: 'agregar textos destacados',
    CALLOUT_ASSET: 'agregar textos destacados', LEAD_FORM_ASSET: 'agregar formulario de contacto en el anuncio', LEAD_FORM_EXTENSION: 'agregar formulario de contacto en el anuncio',
    IMAGE_ASSET: 'agregar imágenes', IMAGE_EXTENSION: 'agregar imágenes', KEYWORD: 'agregar palabras clave', RESPONSIVE_SEARCH_AD: 'agregar un anuncio',
    RESPONSIVE_SEARCH_AD_ASSET: 'agregar títulos o descripciones', RESPONSIVE_SEARCH_AD_IMPROVE_AD_STRENGTH: 'mejorar la calidad del anuncio',
    CAMPAIGN_BUDGET: 'subir presupuesto', FORECASTING_CAMPAIGN_BUDGET: 'subir presupuesto (por temporada)', MARGINAL_ROI_CAMPAIGN_BUDGET: 'subir presupuesto',
    MOVE_UNUSED_BUDGET: 'mover presupuesto que no se usa', KEYWORD_MATCH_TYPE: 'cambiar concordancia de palabras', MAXIMIZE_CLICKS_OPT_IN: 'pujar por maximizar clics',
    RAISE_TARGET_CPA_BID_TOO_LOW: 'subir el CPA objetivo', TARGET_CPA_OPT_IN: 'pujar por costo por conversión',
    CONVERSION_TRACKING_OPT_IN: 'instalar medición de conversiones', UPGRADE_LOCAL_CAMPAIGN_TO_PERFORMANCE_MAX: 'pasar a Máximo rendimiento'
  };
  // Las que van contra el plan (amplia, display, socios, Máximo rendimiento, conversiones con pocos datos).
  var CONTRA = { USE_BROAD_MATCH_KEYWORD: 'usar concordancia amplia', DISPLAY_EXPANSION_OPT_IN: 'salir también en la Red de Display',
    SEARCH_PARTNERS_OPT_IN: 'salir en socios de búsqueda', PERFORMANCE_MAX_OPT_IN: 'pasar a Máximo rendimiento',
    MAXIMIZE_CONVERSIONS_OPT_IN: 'pujar por maximizar conversiones', MAXIMIZE_CONVERSION_VALUE_OPT_IN: 'pujar por valor de conversión',
    ENHANCED_CPC_OPT_IN: 'CPC mejorado', OPTIMIZE_AD_ROTATION: 'rotación optimizada', AI_MAX_OPT_IN: 'activar AI Max' };
  var nombreDe = {};
  filas("SELECT campaign.resource_name, campaign.name FROM campaign WHERE campaign.status != 'REMOVED'", 'los nombres de campaña')
    .forEach(function (f) { nombreDe[f.campaign.resourceName] = f.campaign.name; });
  var recs = {};
  filas('SELECT recommendation.type, recommendation.campaign, recommendation.dismissed FROM recommendation', 'las recomendaciones').forEach(function (f) {
    var r = f.recommendation;
    if (r.dismissed) return;
    var tipo = String(r.type), quien = r.campaign ? (nombreDe[r.campaign] || 'una campaña') : 'toda la cuenta';
    (recs[tipo] = recs[tipo] || []).push(quien.replace(PLAN.prefijo, ''));
  });
  var tipos = Object.keys(recs);
  if (!tipos.length) Logger.log('Ninguna por ahora.');
  tipos.forEach(function (tipo) {
    var sms = /MESSAGE|SMS/.test(tipo), txt = CONTRA[tipo] ? CONTRA[tipo] + ' · NO APLICAR: va contra el plan' : sms ? 'agregar mensajes de texto (SMS) para que escriban desde el anuncio' : (REC[tipo] || tipo);
    var lugares = recs[tipo].filter(function (x, i, a) { return a.indexOf(x) === i; });
    Logger.log((CONTRA[tipo] ? '🚫 ' : sms ? '💬 ' : '• ') + txt + ' — ' + lugares.slice(0, 6).join(', ') + (lugares.length > 6 ? ' y ' + (lugares.length - 6) + ' más' : '') + ' [' + tipo + ']');
    if (sms) A.ojo.push('Google recomienda agregar mensajes de texto (SMS): vale la pena para traer contactos; se arma con tu OK.');
  });

  // ---- Teléfono del botón de llamada
  Logger.log('');
  Logger.log('==== TELÉFONO DEL BOTÓN DE LLAMADA ====');
  var APROB = { APPROVED: 'aprobado', APPROVED_LIMITED: 'aprobado con restricciones', DISAPPROVED: 'RECHAZADO', AREA_OF_INTEREST_ONLY: 'aprobado solo en algunas zonas', UNKNOWN: 'sin dato' };
  var REVISION = { REVIEW_IN_PROGRESS: 'en revisión', REVIEWED: 'revisado', UNDER_APPEAL: 'en apelación', ELIGIBLE_MAY_SERVE: 'puede salir mientras lo revisan' };
  function digitos(x) { return String(x || '').replace(/\D/g, '').slice(-10); }
  var nuestro = digitos(PLAN.telefono);
  var tels = filas("SELECT asset.resource_name, asset.call_asset.phone_number, asset.policy_summary.approval_status, asset.policy_summary.review_status, " +
    "asset.policy_summary.policy_topic_entries FROM asset WHERE asset.type = 'CALL'", 'los teléfonos');
  if (!tels.length) { Logger.log('La cuenta no tiene ningún teléfono para el botón de llamada.'); A.grave.push('No hay teléfono en la cuenta: el anuncio no muestra el botón «Llamar».'); }
  var esta = false;
  tels.forEach(function (f) {
    var a = f.asset, ps = a.policySummary || {}, num_ = digitos((a.callAsset || {}).phoneNumber), propio = nuestro && num_ === nuestro;
    if (propio) esta = true;
    var temas = (ps.policyTopicEntries || []).map(function (e) { return e.topic; }).filter(Boolean);
    Logger.log((propio ? '★ ' : '  ') + (a.callAsset || {}).phoneNumber + ' · ' + (APROB[ps.approvalStatus] || ps.approvalStatus || 'sin dato') + ' · ' +
      (REVISION[ps.reviewStatus] || ps.reviewStatus || '') + (temas.length ? ' · motivos: ' + temas.join(', ') : '') + (propio ? ' · (el del plan)' : ''));
    if (propio && ps.approvalStatus === 'DISAPPROVED') A.grave.push('El teléfono del plan está RECHAZADO' + (temas.length ? ' (' + temas.join(', ') + ')' : '') + ': el botón «Llamar» no sale.');
    else if (propio && ps.reviewStatus === 'REVIEW_IN_PROGRESS') A.ojo.push('El teléfono del plan sigue en revisión de Google.');
  });
  if (nuestro && tels.length && !esta) A.ojo.push('El teléfono del plan (' + PLAN.telefono + ') no está en la cuenta.');
  var conTel = {};
  filas("SELECT campaign.name, asset.call_asset.phone_number, campaign_asset.status FROM campaign_asset WHERE campaign_asset.field_type = 'CALL' " +
    "AND campaign.status = 'ENABLED' AND campaign_asset.status = 'ENABLED'", 'los teléfonos por campaña').forEach(function (f) {
    if (!nuestro || digitos((f.asset.callAsset || {}).phoneNumber) === nuestro) conTel[f.campaign.name] = true;
  });
  var cuenta = filas("SELECT asset.call_asset.phone_number FROM customer_asset WHERE customer_asset.field_type = 'CALL' AND customer_asset.status = 'ENABLED'",
    'el teléfono de la cuenta').some(function (f) { return !nuestro || digitos((f.asset.callAsset || {}).phoneNumber) === nuestro; });
  var nuevasEnc = Object.keys(C).filter(function (n) { return C[n].nueva; });
  var sinTel = nuevasEnc.filter(function (n) { return !conTel[n]; });
  Logger.log(cuenta ? 'Puesto a nivel de cuenta: sale en todas las campañas.' :
    'En ' + (nuevasEnc.length - sinTel.length) + ' de ' + nuevasEnc.length + ' campañas nuevas encendidas' + (sinTel.length ? '; faltan: ' + sinTel.map(function (n) { return n.replace(PLAN.prefijo, ''); }).join(', ') : '') + '.');
  if (!cuenta && sinTel.length) A.ojo.push('Campañas nuevas sin botón de llamada: ' + sinTel.map(function (n) { return n.replace(PLAN.prefijo, ''); }).join(', ') + '.');
  Logger.log('Llamadas desde el anuncio: ayer ' + T.ayer.llamadas + (previos > 0 ? ' · desde el arranque ' + (T.ayer.llamadas + T.antes.llamadas) : '') + '.');

  // ---- Avisos
  Logger.log('');
  Logger.log('==== QUÉ MOVER ====');
  A.grave.forEach(function (t) { Logger.log('❌ ' + t); });
  A.mover.forEach(function (t) { Logger.log('⬆️ ' + t); });
  A.ojo.forEach(function (t) { Logger.log('⚠️ ' + t); });
  if (!A.grave.length && !A.mover.length && !A.ojo.length) Logger.log('✅ Nada urgente.');

  // ---- Datos para los tableros
  Logger.log('');
  Logger.log('==== DATOS PARA LOS TABLEROS ====');
  imprimirTablero(AdsApp.currentAccount().getCustomerId(), ahora);
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro (incluidas las líneas TABLERO) y mándalo. Este script no cambió nada.');
}

{{PARTE_TABLERO}}
