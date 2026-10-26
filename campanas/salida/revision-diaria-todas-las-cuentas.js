/**
 * Atelback · Revisión diaria — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Resume cómo le fue
 * ayer a cada campaña nueva «AB ·» contra su promedio desde el arranque: estado, presupuesto, clics, costo por clic,
 * cuota de impresiones, conversiones y llamadas, anuncios rechazados, zona (solo México), búsquedas reales de ayer y avisos de qué mover.
 * No cambia nada en la cuenta.
 *
 * CÓMO SE USA: cada mañana, pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "mensual": 19700, "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "mensual": 12000, "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "mensual": 18700, "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mensual": 8200, "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "mensual": 6600, "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
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

  // ---- Avisos
  Logger.log('');
  Logger.log('==== QUÉ MOVER ====');
  A.grave.forEach(function (t) { Logger.log('❌ ' + t); });
  A.mover.forEach(function (t) { Logger.log('⬆️ ' + t); });
  A.ojo.forEach(function (t) { Logger.log('⚠️ ' + t); });
  if (!A.grave.length && !A.mover.length && !A.ojo.length) Logger.log('✅ Nada urgente.');
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
