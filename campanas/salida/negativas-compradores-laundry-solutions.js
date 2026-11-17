// LAUNDRY SOLUTIONS - Negativas de COMPRADORES (version corta, solo ASCII, 17 nov 2026)
// Solo para la cuenta 265-909-2662. Se puede pegar dentro de Laundry Solutions o en la cuenta de administrador.
// POR QUE: Laundry Solutions vende SERVICIO (reparacion, mantenimiento). En 30 dias gasto en busquedas de gente que
//   quiere COMPRAR equipo ("lavadora industrial precio", "costo lavadora industrial") sin traer contactos.
// QUE HACE: agrega esas busquedas como NEGATIVAS EXACTAS, solo en la campana donde aparecieron.
//   Exacta = bloquea solo esa frase tal cual. "reparacion lavadora industrial" sigue saliendo.
// CANDADOS PARA NO FRENAR LEADS:
//   - Nunca bloquea una busqueda con palabra de servicio (repar, manten, tecnico, refacc, falla, etc.).
//   - Nunca bloquea una busqueda que trajo cualquier conversion en 30 dias (en cualquier campana).
//   - Busquedas con marca (Girbau, Speed Queen, LG...) solo si ademas dicen precio/costo/venta/comprar.
//   - Solo si tuvo 2 clics o mas, o $20 o mas de gasto. Maximo 60.
//   - Si ya hubo un cambio HOY en la cuenta, en Ejecutar no aplica nada.
//   - No toca presupuestos, pujas, anuncios ni palabras clave. No pausa nada.
// DESHACER: pega en LISTA_DESHACER la lista que sale al final ("lista para deshacer") y Ejecutar: las quita.
// USO: borrar todo > pegar > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR solo con el OK.

var CUENTA = '265-909-2662';
var MIN_CLICS = 2, MIN_GASTO = 20, MAX_NEGATIVAS = 60;
var LISTA_DESHACER = [];

var SERVICIO = /repar|arregl|manten|servic|t[eé]cnic|refacc|pieza|repuest|instal|falla|no (centrifug|enciend|calient|gir|prend|drena|seca)|error|c[oó]digo|tarjeta|motor|bomba|empaque|balero|rodamient|banda|resistencia|v[aá]lvula|p[oó]liza|diagn|garant|soporte|taller|laundry solutions|revisi|calibr|limpieza de|desarm|ajust/i;
var PRODUCTO = /lavadora|lavadoras|secadora|secadoras|lavander[ií]a|centro de lavado|planchador|mangle|lorsa|girbau|speed ?queen|maytag|lg |wascomat|dexter|electrolux|alliance|primus|unimac|ipso|huebsch/i;
var MARCA = /girbau|gamesail|speed ?queen|maytag|lg |wascomat|dexter|electrolux|alliance|primus|unimac|ipso|huebsch/i;
var COMPRA = /precio|costo|cuesta|cuanto|venta|vendo|vende|comprar|compra |cotiz|nueva|nuevo|barat|mercado libre|usad|segunda mano|renta|distribuid|proveedor|catalogo|catálogo/i;

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CUENTA]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta ' + CUENTA); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CUENTA) {
    Logger.log('Este script es solo para Laundry Solutions (' + CUENTA + '). No se hizo nada.');
    return;
  }
  negativas();
}

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) { var r = it.next(); r.metrics = r.metrics || {}; out.push(r); } }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(Number(x) || 0); }
function norm(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

function negativas() {
  var tz = AdsApp.currentAccount().getTimeZone();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  Logger.log('NEGATIVAS DE COMPRADORES - Laundry Solutions - 30 dias - ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR'));
  Logger.log('');

  var C = {};
  filas("SELECT campaign.id, campaign.name, campaign.resource_name FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campanas')
    .forEach(function (f) { C[f.campaign.id] = { nombre: f.campaign.name, rn: f.campaign.resourceName, ya: {} }; });
  filas("SELECT campaign.id, campaign_criterion.resource_name, campaign_criterion.keyword.text, campaign_criterion.keyword.match_type FROM campaign_criterion " +
    "WHERE campaign_criterion.negative = TRUE AND campaign_criterion.type = 'KEYWORD' AND campaign.status = 'ENABLED'", 'las negativas actuales')
    .forEach(function (f) {
      var c = C[f.campaign.id]; if (!c || f.campaignCriterion.keyword.matchType !== 'EXACT') return;
      c.ya[norm(f.campaignCriterion.keyword.text)] = f.campaignCriterion.resourceName;
    });

  var ops = [], textos = [];

  if (LISTA_DESHACER.length) {
    var quitar = {}; LISTA_DESHACER.forEach(function (t) { quitar[norm(t)] = true; });
    Logger.log('==== DESHACER: quitar estas negativas ====');
    Object.keys(C).forEach(function (id) {
      Object.keys(C[id].ya).forEach(function (t) {
        if (!quitar[t]) return;
        Logger.log('QUITA "' + t + '" - ' + C[id].nombre);
        ops.push({ campaignCriterionOperation: { remove: C[id].ya[t] } }); textos.push('quitar "' + t + '" en ' + C[id].nombre);
      });
    });
    return aplicar(ops, textos, vista, 'DESHACER');
  }

  var B = {};
  filas("SELECT campaign.id, search_term_view.search_term, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM search_term_view " +
    "WHERE segments.date DURING LAST_30_DAYS AND campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las busquedas')
    .forEach(function (f) {
      if (!C[f.campaign.id]) return;
      var t = norm(f.searchTermView.searchTerm), k = f.campaign.id + '|' + t;
      var b = B[k] = B[k] || { camp: f.campaign.id, t: t, clics: 0, gasto: 0, conv: 0 };
      b.clics += Number(f.metrics.clicks) || 0; b.gasto += (Number(f.metrics.costMicros) || 0) / 1e6; b.conv += Number(f.metrics.allConversions) || 0;
    });
  var trajo = {};
  Object.keys(B).forEach(function (k) { if (B[k].conv > 0) trajo[B[k].t] = true; });

  Logger.log('==== BUSQUEDAS DE COMPRADORES QUE SE BLOQUEAN (exactas) ====');
  var total = 0, gastoTotal = 0, seQuedan = [];
  Object.keys(B).map(function (k) { return B[k]; }).sort(function (a, b) { return b.gasto - a.gasto; }).forEach(function (b) {
    if (total >= MAX_NEGATIVAS) return;
    if (b.clics < MIN_CLICS && b.gasto < MIN_GASTO) return;
    if (!PRODUCTO.test(b.t)) return;
    if (SERVICIO.test(b.t)) { if (b.gasto >= MIN_GASTO) seQuedan.push(b.t + ' (servicio)'); return; }
    if (trajo[b.t]) { seQuedan.push(b.t + ' (trajo contacto)'); return; }
    if (MARCA.test(b.t) && !COMPRA.test(b.t)) { seQuedan.push(b.t + ' (marca, puede ser cliente de servicio)'); return; }
    var c = C[b.camp];
    if (c.ya[b.t]) return;
    Logger.log('NEGATIVA "' + b.t + '" - ' + b.clics + ' clics - ' + pesos(b.gasto) + ' - 0 contactos - ' + c.nombre);
    ops.push({ campaignCriterionOperation: { create: { campaign: c.rn, negative: true, keyword: { text: b.t, matchType: 'EXACT' } } } });
    textos.push(b.t); total++; gastoTotal += b.gasto;
  });
  if (!ops.length) Logger.log('No hay busquedas de compradores que bloquear.');
  Logger.log('');
  if (seQuedan.length) {
    Logger.log('SE QUEDAN (no se bloquean):');
    seQuedan.slice(0, 20).forEach(function (t) { Logger.log('  ' + t); });
    Logger.log('');
  }
  Logger.log('Gasto de 30 dias en las busquedas que se bloquean: ' + pesos(gastoTotal) + '. Ese dinero se queda para reparacion y servicio.');

  if (!vista && ops.length) {
    var cambios = filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy + " 00:00:00' AND " +
      "change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 50", 'los cambios de hoy');
    if (cambios.length) {
      Logger.log('');
      Logger.log('ALTO: ya hubo ' + cambios.length + ' cambio(s) HOY en esta cuenta. No se aplico nada. Correlo manana.');
      return;
    }
  }
  aplicar(ops, textos, vista, 'NEGATIVAS');
}

function aplicar(ops, textos, vista, que) {
  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('ERROR ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('LISTO ' + textos[i]);
    });
  }
  Logger.log('');
  Logger.log(que + ' - Laundry Solutions - ' + (vista ? 'vista previa' : 'ejecutado') + ' - ' + ops.length + ' - con error: ' + malos);
  if (que === 'NEGATIVAS' && ops.length) {
    Logger.log('Lista para deshacer: [' + textos.map(function (t) { return "'" + t.replace(/'/g, "\\'") + "'"; }).join(', ') + ']');
  }
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Copia todo el registro y mandamelo.');
}
