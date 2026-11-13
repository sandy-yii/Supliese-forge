/**
 * Atelback · Laundry Solutions: que el dinero de «Reparación» no se vaya en gente que quiere COMPRAR una lavadora
 * Escrito a mano el 13 nov 2026 (no lo genera generar.py). SOLO para la cuenta 265-909-2662.
 *
 * POR QUÉ: en 30 días, «Reparación y mantenimiento» gastó en búsquedas como «lavadora industrial», «lavadoras industriales
 * precios» o «costo lavadora industrial»: gente que quiere comprar equipo, no reparar. No trajeron ningún contacto, y la
 * campaña pierde 34% de las búsquedas por presupuesto. Ese dinero se queda para quien busca reparación o servicio.
 *
 * QUÉ HACE: agrega esas búsquedas como NEGATIVAS EXACTAS en las campañas de búsqueda de Laundry Solutions.
 *   «Exacta» = solo bloquea esa búsqueda tal cual. «reparación lavadora industrial» o «precio reparación lavadora» siguen saliendo.
 * CANDADOS PARA NO FRENAR LEADS:
 *   - Solo búsquedas que NO tienen ninguna palabra de servicio (reparación, mantenimiento, técnico, refacción, falla, etc.).
 *   - Solo búsquedas que en 30 días no tuvieron NINGUNA conversión (de ningún tipo).
 *   - Solo búsquedas con 2 clics o más, o $20 o más de gasto.
 *   - No toca presupuestos, pujas, anuncios ni palabras clave. No pausa nada.
 *   - Si en esta cuenta ya hubo un cambio HOY, en Ejecutar no hace nada (un cambio por cuenta al día).
 *   - DESHACER: pega en LISTA_DESHACER las búsquedas que salen en el renglón «NEGATIVAS ·» y córrelo: las quita.
 *
 * CÓMO SE USA: en Laundry Solutions > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var CUENTA = '265-909-2662';
var MIN_CLICS = 2, MIN_GASTO = 20, MAX_NEGATIVAS = 60;
var LISTA_DESHACER = [];   // por ejemplo ['lavadora industrial', 'costo lavadora industrial']

var SERVICIO = /repar|arregl|manten|servic|t[eé]cnic|refacc|pieza|repuest|instal|falla|no (centrifug|enciend|calient|gir|prend|drena|seca)|error|c[oó]digo|tarjeta|motor|bomba|empaque|balero|rodamient|banda|resistencia|v[aá]lvula|p[oó]liza|diagn|garant|soporte|taller|laundry solutions|servicioparalavanderias|revisi|calibr|limpieza de|desarm|ajust/i;
var PRODUCTO = /lavadora|lavadoras|secadora|secadoras|lavander[ií]a|centro de lavado|planchador|mangle|lorsa|girbau|speed ?queen|maytag|lg |wascomat|dexter|electrolux|alliance|primus|unimac|ipso|huebsch/i;

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) { var r = it.next(); r.metrics = r.metrics || {}; out.push(r); } }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(Number(x) || 0).toLocaleString('en-US'); }
function norm(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  if (cid !== CUENTA) throw new Error('Este script es solo para Laundry Solutions (' + CUENTA + '). Esta cuenta es ' + cid + '. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  Logger.log('NEGATIVAS DE COMPRADORES · Laundry Solutions · 30 días · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR'));
  Logger.log('');

  // Campañas de búsqueda encendidas
  var C = {};
  filas("SELECT campaign.id, campaign.name, campaign.resource_name FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas')
    .forEach(function (f) { C[f.campaign.id] = { nombre: f.campaign.name, rn: f.campaign.resourceName, ya: {} }; });

  // Negativas exactas que ya existen
  filas("SELECT campaign.id, campaign_criterion.resource_name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type FROM campaign_criterion " +
    "WHERE campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD' AND campaign.status = 'ENABLED'", 'las negativas actuales')
    .forEach(function (f) {
      var c = C[f.campaign.id]; if (!c || f.campaignCriterion.keyword.matchType !== 'EXACT') return;
      c.ya[norm(f.campaignCriterion.keyword.text)] = f.campaignCriterion.resourceName;
    });

  var ops = [], textos = [];

  // DESHACER
  if (LISTA_DESHACER.length) {
    var quitar = {}; LISTA_DESHACER.forEach(function (t) { quitar[norm(t)] = true; });
    Logger.log('==== DESHACER: quitar estas negativas ====');
    Object.keys(C).forEach(function (id) {
      Object.keys(C[id].ya).forEach(function (t) {
        if (!quitar[t]) return;
        Logger.log('QUITA «' + t + '» · ' + C[id].nombre);
        ops.push({ campaignCriterionOperation: { remove: C[id].ya[t] } }); textos.push('quitar «' + t + '» en ' + C[id].nombre);
      });
    });
    return aplicar(ops, textos, vista, 'DESHACER');
  }

  // Búsquedas de 30 días
  var B = {};
  filas("SELECT campaign.id, search_term_view.search_term, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM search_term_view " +
    "WHERE segments.date DURING LAST_30_DAYS AND campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las búsquedas')
    .forEach(function (f) {
      if (!C[f.campaign.id]) return;
      var t = norm(f.searchTermView.searchTerm), k = f.campaign.id + '|' + t;
      var b = B[k] = B[k] || { camp: f.campaign.id, t: t, clics: 0, gasto: 0, conv: 0 };
      b.clics += +f.metrics.clicks || 0; b.gasto += (+f.metrics.costMicros || 0) / 1e6; b.conv += +f.metrics.allConversions || 0;
    });
  // Si una búsqueda trajo algo en CUALQUIER campaña, no se toca en ninguna
  var trajo = {};
  Object.keys(B).forEach(function (k) { if (B[k].conv > 0) trajo[B[k].t] = true; });

  Logger.log('==== BÚSQUEDAS DE COMPRADORES QUE SE BLOQUEAN (exactas) ====');
  var total = 0, gastoTotal = 0, saltadas = [];
  Object.keys(B).map(function (k) { return B[k]; }).sort(function (a, b) { return b.gasto - a.gasto; }).forEach(function (b) {
    if (total >= MAX_NEGATIVAS) return;
    if (b.clics < MIN_CLICS && b.gasto < MIN_GASTO) return;
    if (!PRODUCTO.test(b.t)) return;
    if (SERVICIO.test(b.t)) { if (b.gasto >= MIN_GASTO) saltadas.push(b.t); return; }
    if (trajo[b.t]) { saltadas.push(b.t + ' (trajo conversión)'); return; }
    var c = C[b.camp];
    if (c.ya[b.t]) return;
    Logger.log('NEGATIVA «' + b.t + '» · ' + b.clics + ' clics · ' + pesos(b.gasto) + ' · 0 contactos · ' + c.nombre);
    ops.push({ campaignCriterionOperation: { create: { campaign: c.rn, negative: true, keyword: { text: b.t, matchType: 'EXACT' } } } });
    textos.push(b.t); total++; gastoTotal += b.gasto;
  });
  if (!ops.length) Logger.log('No hay búsquedas de compradores que bloquear. 👍');
  Logger.log('');
  if (saltadas.length) {
    Logger.log('Se quedan (tienen palabra de servicio o trajeron algo): ' + saltadas.slice(0, 15).map(function (t) { return '«' + t + '»'; }).join(', '));
    Logger.log('');
  }
  Logger.log('Gasto de 30 días en estas búsquedas: ' + pesos(gastoTotal) + '. Ese dinero se queda para búsquedas de reparación y servicio.');

  // Un cambio por cuenta al día
  if (!vista && ops.length) {
    var cambios = filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy + " 00:00:00' AND " +
      "change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 50", 'los cambios de hoy');
    if (cambios.length) {
      Logger.log('');
      Logger.log('⏸ Ya hubo ' + cambios.length + ' cambio(s) HOY en esta cuenta. Para no mover dos cosas el mismo día, no se aplicó nada. Córrelo mañana.');
      return;
    }
  }
  aplicar(ops, textos, vista, 'NEGATIVAS');
}

function aplicar(ops, textos, vista, que) {
  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ ' + textos[i]);
    });
  }
  Logger.log('');
  Logger.log(que + ' · Laundry Solutions · ' + (vista ? 'vista previa' : 'ejecutado') + ' · ' + ops.length + ' · con error: ' + malos +
    (que === 'NEGATIVAS' && ops.length ? ' · lista para deshacer: [' + textos.map(function (t) { return "'" + t.replace(/'/g, "\\'") + "'"; }).join(', ') + ']' : ''));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
