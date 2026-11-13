/**
 * Atelback · Campañas que NO traen (o traen caro): por qué y qué arreglar — las cinco cuentas
 * Escrito a mano el 13 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada (no frena ningún lead).
 *   1. TODAS LAS CAMPAÑAS (últimos 30 días): clics, gasto, contactos reales y costo por contacto, y en qué grupo cae:
 *        ✅ trae · 💸 cara (cuesta 1.5 veces o más que el promedio de la cuenta) · ❌ no trae (15 clics o más y 0 contactos).
 *   2. POR CADA CAMPAÑA ❌ o 💸, el «por qué»:
 *        a) A qué página llegan los clics y cuántos contactos da cada una (y si otra página de la cuenta convierte mejor).
 *        b) Qué buscó la gente: las búsquedas con más clics, y cuáles gastaron sin traer nada (candidatas a negativa; se revisan a mano).
 *        c) Palabras clave: calificación de Google (1 a 10) y en qué falla (clics esperados, anuncio o página).
 *        d) Cuántas veces sale: lo que pierde por PUJA/CALIDAD y por PRESUPUESTO.
 *        e) Celular contra computadora.
 *        f) La fuerza de sus anuncios.
 *        g) «QUÉ HACER»: lo que más pesa, en orden.
 *   3. Un renglón final «FLOJAS ·».
 * Contacto real = WhatsApp, llamada o formulario (sin chatbot ni Google Maps).
 * OJO: Google solo ve a quien acepta cookies (más o menos 1 de cada 3). Una campaña con «0» aquí puede tener leads en Resend:
 * por eso el registro se cruza con Resend por página antes de mover algo.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var DIAS = 'LAST_30_DAYS';
var MIN_CLICS_NO_TRAE = 15;   // clics sin contacto para decir «no trae»
var CARA_VECES = 1.5;         // costo por contacto 1.5 veces el de la cuenta = «cara»
var MIN_GASTO_NEGATIVA = 50;  // pesos gastados sin contacto para sugerir revisar una búsqueda
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var NIVEL = { BELOW_AVERAGE: 'BAJA', AVERAGE: 'normal', ABOVE_AVERAGE: 'buena' };
var FUERZA = { EXCELLENT: 'Excelente', GOOD: 'Buena', AVERAGE: 'Regular', POOR: 'Mala', PENDING: 'En revisión' };
var DISP = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) { var r = it.next(); r.metrics = r.metrics || {}; r.segments = r.segments || {}; out.push(r); } }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(Number(x) || 0).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function pct(x) { return Math.round((Number(x) || 0) * 100) + '%'; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}
function corta(u) { return String(u || '').replace(/^https?:\/\/(www\.)?/, '').replace(/\?.*$/, ''); }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  Logger.log('CAMPAÑAS QUE NO TRAEN · ' + marca + ' · últimos 30 días · solo lee, no cambia nada');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });
  function real(f) { var a = f.segments.conversionActionName; return esReal(a, tipos[a]) ? (+f.metrics.allConversions || 0) : 0; }

  // 1. Todas las campañas
  var C = {}, gastoCta = 0, contCta = 0;
  filas("SELECT campaign.id, campaign.name, campaign.advertising_channel_type, metrics.clicks, metrics.cost_micros, metrics.impressions " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND segments.date DURING " + DIAS, 'las campañas').forEach(function (f) {
      C[f.campaign.id] = { id: f.campaign.id, nombre: f.campaign.name, tipo: f.campaign.advertisingChannelType,
        clics: +f.metrics.clicks || 0, gasto: (+f.metrics.costMicros || 0) / 1e6, imp: +f.metrics.impressions || 0, cont: 0,
        rank: null, budget: null, is: null };
      gastoCta += C[f.campaign.id].gasto;
    });
  filas("SELECT campaign.id, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE campaign.status = 'ENABLED' " +
    "AND segments.date DURING " + DIAS, 'los contactos').forEach(function (f) {
      var c = C[f.campaign.id], v = real(f); if (c && v) { c.cont += v; contCta += v; }
    });
  filas("SELECT campaign.id, metrics.search_impression_share, metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH' AND segments.date DURING " + DIAS, 'cuántas veces sale')
    .forEach(function (f) {
      var c = C[f.campaign.id]; if (!c) return;
      c.is = f.metrics.searchImpressionShare; c.rank = f.metrics.searchRankLostImpressionShare; c.budget = f.metrics.searchBudgetLostImpressionShare;
    });
  var cpaCta = contCta ? gastoCta / contCta : 0;

  Logger.log('==== 1. TODAS LAS CAMPAÑAS ====');
  Logger.log('Cuenta: ' + pesos(gastoCta) + ' · ' + n(contCta) + ' contactos que ve Google · ' + (cpaCta ? pesos(cpaCta) + ' por contacto' : 'sin contactos'));
  var lista = Object.keys(C).map(function (k) { return C[k]; }).filter(function (c) { return c.clics > 0; })
    .sort(function (a, b) { return b.gasto - a.gasto; });
  var flojas = [];
  lista.forEach(function (c) {
    var cpa = c.cont ? c.gasto / c.cont : 0;
    c.grupo = '✅ trae';
    if (c.cont < 0.5 && c.clics >= MIN_CLICS_NO_TRAE) c.grupo = '❌ no trae';
    else if (cpaCta && cpa >= cpaCta * CARA_VECES && c.gasto >= 300) c.grupo = '💸 cara';
    else if (c.cont < 0.5) c.grupo = '· pocos clics aún';
    if (c.grupo === '❌ no trae' || c.grupo === '💸 cara') flojas.push(c);
    Logger.log(c.grupo + ' · ' + c.nombre + ' · ' + c.clics + ' clics · ' + pesos(c.gasto) + ' · ' + n(c.cont) + ' contactos' +
      (cpa ? ' (' + pesos(cpa) + ' c/u)' : ''));
  });
  if (!flojas.length) Logger.log('Ninguna campaña sale como «no trae» ni «cara». 👍');
  Logger.log('');

  // Páginas de toda la cuenta (para comparar)
  var P = {};
  filas("SELECT campaign.id, landing_page_view.unexpanded_final_url, metrics.clicks FROM landing_page_view WHERE segments.date DURING " + DIAS +
    " AND metrics.clicks > 0", 'las páginas').forEach(function (f) {
      var u = corta(f.landingPageView.unexpandedFinalUrl), k = f.campaign.id + '|' + u;
      P[k] = P[k] || { camp: f.campaign.id, url: u, clics: 0, cont: 0 }; P[k].clics += +f.metrics.clicks || 0;
    });
  filas("SELECT campaign.id, landing_page_view.unexpanded_final_url, segments.conversion_action_name, metrics.all_conversions FROM landing_page_view " +
    "WHERE segments.date DURING " + DIAS, 'contactos por página').forEach(function (f) {
      var u = corta(f.landingPageView.unexpandedFinalUrl), k = f.campaign.id + '|' + u, v = real(f);
      if (!v) return; P[k] = P[k] || { camp: f.campaign.id, url: u, clics: 0, cont: 0 }; P[k].cont += v;
    });
  var porUrl = {};
  Object.keys(P).forEach(function (k) {
    var p = P[k], u = porUrl[p.url] = porUrl[p.url] || { clics: 0, cont: 0 }; u.clics += p.clics; u.cont += p.cont;
  });
  var mejores = Object.keys(porUrl).filter(function (u) { return porUrl[u].clics >= 20 && porUrl[u].cont >= 2; })
    .sort(function (a, b) { return porUrl[b].cont / porUrl[b].clics - porUrl[a].cont / porUrl[a].clics; });

  // 2. Por campaña floja
  Logger.log('==== 2. POR QUÉ NO TRAEN (una por una) ====');
  var causas = {};
  flojas.forEach(function (c) {
    Logger.log('');
    Logger.log('▶ ' + c.grupo.toUpperCase() + ' · ' + c.nombre + ' · ' + c.clics + ' clics · ' + pesos(c.gasto) + ' · ' + n(c.cont) + ' contactos');
    var hacer = [];

    // a) Páginas
    var mias = Object.keys(P).map(function (k) { return P[k]; }).filter(function (p) { return p.camp === c.id; })
      .sort(function (a, b) { return b.clics - a.clics; });
    Logger.log('  a) PÁGINAS:');
    mias.slice(0, 5).forEach(function (p) {
      var g = porUrl[p.url], tasa = g.clics ? g.cont / g.clics * 100 : 0;
      Logger.log('     ' + p.url + ' · aquí ' + p.clics + ' clics, ' + n(p.cont) + ' contactos · en toda la cuenta ' + n(tasa) + ' de cada 100 clics');
    });
    if (!mias.length) Logger.log('     (Google no dio páginas; puede ser Máximo rendimiento)');
    var principal = mias[0];
    if (principal) {
      var tPrin = porUrl[principal.url].clics ? porUrl[principal.url].cont / porUrl[principal.url].clics : 0;
      var otra = mejores.filter(function (u) { return u !== principal.url; })[0];
      if (otra && porUrl[otra].cont / porUrl[otra].clics >= Math.max(tPrin * 2, 0.02)) {
        hacer.push('PÁGINA: su página (' + principal.url + ') convierte ' + n(tPrin * 100) + ' de cada 100; ' + otra + ' convierte ' +
          n(porUrl[otra].cont / porUrl[otra].clics * 100) + '. Que Rodolfo le copie a la suya lo que funciona en esa (precio «desde», botón de WhatsApp arriba, fotos). Mandar anuncios a otra página solo si es del MISMO producto.');
        causas.pagina = (causas.pagina || 0) + 1;
      } else if (principal.clics >= MIN_CLICS_NO_TRAE && principal.cont < 0.5) {
        hacer.push('PÁGINA: ' + principal.url + ' recibe clics y no da contactos en Google. Cruzar con Resend; si ahí tampoco, revisar la página con Rodolfo (S11).');
        causas.pagina = (causas.pagina || 0) + 1;
      }
    }

    // b) Búsquedas
    var B = {};
    filas("SELECT search_term_view.search_term, metrics.clicks, metrics.cost_micros FROM search_term_view WHERE campaign.id = " + c.id +
      " AND segments.date DURING " + DIAS + " AND metrics.clicks > 0", 'las búsquedas').forEach(function (f) {
        var t = f.searchTermView.searchTerm, b = B[t] = B[t] || { clics: 0, gasto: 0, cont: 0 };
        b.clics += +f.metrics.clicks || 0; b.gasto += (+f.metrics.costMicros || 0) / 1e6;
      });
    filas("SELECT search_term_view.search_term, segments.conversion_action_name, metrics.all_conversions FROM search_term_view WHERE campaign.id = " + c.id +
      " AND segments.date DURING " + DIAS + " AND metrics.all_conversions > 0", 'contactos por búsqueda').forEach(function (f) {
        var t = f.searchTermView.searchTerm, v = real(f); if (v && B[t]) B[t].cont += v;
      });
    var bus = Object.keys(B).sort(function (a, b) { return B[b].clics - B[a].clics; });
    var gastoSin = 0, gastoBus = 0, candidatas = [];
    bus.forEach(function (t) {
      gastoBus += B[t].gasto;
      if (B[t].cont < 0.5) { gastoSin += B[t].gasto; if (B[t].gasto >= MIN_GASTO_NEGATIVA) candidatas.push(t); }
    });
    Logger.log('  b) QUÉ BUSCÓ LA GENTE (las 12 con más clics):');
    bus.slice(0, 12).forEach(function (t) {
      Logger.log('     «' + t + '» · ' + B[t].clics + ' clics · ' + pesos(B[t].gasto) + ' · ' + n(B[t].cont) + ' contactos' +
        (B[t].cont < 0.5 && B[t].gasto >= MIN_GASTO_NEGATIVA ? ' · ⚠️ revisar si es negativa' : ''));
    });
    if (!bus.length) Logger.log('     (sin búsquedas visibles)');
    if (candidatas.length) {
      Logger.log('     Gastaron ' + pesos(MIN_GASTO_NEGATIVA) + ' o más sin traer nada: ' + candidatas.slice(0, 10).map(function (t) { return '«' + t + '»'; }).join(', '));
      hacer.push('BÚSQUEDAS: ' + candidatas.length + ' búsquedas gastaron sin traer nada. Revisar cuáles NO son de lo que vendemos y ponerlas como negativas (solo esas).');
      causas.busquedas = (causas.busquedas || 0) + 1;
    }

    // c) Palabras clave
    var K = filas("SELECT ad_group_criterion.keyword.text, ad_group_criterion.quality_info.quality_score, ad_group_criterion.quality_info.search_predicted_ctr, " +
      "ad_group_criterion.quality_info.creative_quality_score, ad_group_criterion.quality_info.post_click_quality_score, metrics.clicks, metrics.cost_micros " +
      "FROM keyword_view WHERE campaign.id = " + c.id + " AND ad_group_criterion.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
      "AND segments.date DURING " + DIAS + " AND metrics.impressions > 0", 'las palabras clave')
      .sort(function (a, b) { return (+b.metrics.costMicros || 0) - (+a.metrics.costMicros || 0); });
    var fallaAnuncio = 0, fallaPagina = 0, fallaCtr = 0, conQs = 0;
    Logger.log('  c) PALABRAS CLAVE (las 8 con más gasto):');
    K.forEach(function (f, i) {
      var q = f.adGroupCriterion.qualityInfo || {};
      if (q.qualityScore) conQs++;
      if (q.creativeQualityScore === 'BELOW_AVERAGE') fallaAnuncio++;
      if (q.postClickQualityScore === 'BELOW_AVERAGE') fallaPagina++;
      if (q.searchPredictedCtr === 'BELOW_AVERAGE') fallaCtr++;
      if (i < 8) Logger.log('     «' + f.adGroupCriterion.keyword.text + '» · calificación ' + (q.qualityScore || 'sin dato') + '/10 · clics esperados ' +
        (NIVEL[q.searchPredictedCtr] || '?') + ', anuncio ' + (NIVEL[q.creativeQualityScore] || '?') + ', página ' + (NIVEL[q.postClickQualityScore] || '?') +
        ' · ' + (+f.metrics.clicks || 0) + ' clics · ' + pesos((+f.metrics.costMicros || 0) / 1e6));
    });
    if (!K.length) Logger.log('     (sin palabras clave con impresiones)');
    if (conQs && fallaPagina / conQs >= 0.5) { hacer.push('CALIDAD: Google califica BAJA la página en ' + fallaPagina + ' de ' + conQs + ' palabras. Lo arregla Rodolfo con el pedido S11.'); causas.calidadPagina = (causas.calidadPagina || 0) + 1; }
    if (conQs && (fallaAnuncio + fallaCtr) / conQs >= 0.5) { hacer.push('ANUNCIOS: fallan en «anuncio» o «clics esperados». Lo cubre el script de anuncios y extensiones nuevos.'); causas.anuncios = (causas.anuncios || 0) + 1; }

    // d) Cuántas veces sale
    if (c.is != null) {
      Logger.log('  d) SALE en ' + pct(c.is) + ' de las búsquedas · pierde ' + pct(c.rank) + ' por puja/calidad y ' + pct(c.budget) + ' por presupuesto');
      if (c.rank >= 0.5) { hacer.push('SALE POCO por puja/calidad (' + pct(c.rank) + '). Primero calidad (anuncios y página); subir puja solo si ya trae contactos.'); causas.rank = (causas.rank || 0) + 1; }
    }

    // e) Dispositivo
    var D = {};
    filas("SELECT segments.device, metrics.clicks, metrics.cost_micros FROM campaign WHERE campaign.id = " + c.id + " AND segments.date DURING " + DIAS, 'los dispositivos')
      .forEach(function (f) { var k = DISP[f.segments.device] || f.segments.device; D[k] = D[k] || { clics: 0, gasto: 0, cont: 0 }; D[k].clics += +f.metrics.clicks || 0; D[k].gasto += (+f.metrics.costMicros || 0) / 1e6; });
    filas("SELECT segments.device, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE campaign.id = " + c.id + " AND segments.date DURING " + DIAS, 'contactos por dispositivo')
      .forEach(function (f) { var k = DISP[f.segments.device] || f.segments.device, v = real(f); if (v) { D[k] = D[k] || { clics: 0, gasto: 0, cont: 0 }; D[k].cont += v; } });
    Logger.log('  e) DISPOSITIVO: ' + (Object.keys(D).filter(function (k) { return D[k].clics; }).map(function (k) {
      return k + ' ' + D[k].clics + ' clics, ' + pesos(D[k].gasto) + ', ' + n(D[k].cont) + ' contactos';
    }).join(' · ') || 'sin dato'));

    // f) Anuncios
    var F = {};
    filas("SELECT ad_group_ad.ad_strength FROM ad_group_ad WHERE campaign.id = " + c.id + " AND ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' " +
      "AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'", 'los anuncios').forEach(function (f) {
        var s = FUERZA[f.adGroupAd.adStrength] || f.adGroupAd.adStrength; F[s] = (F[s] || 0) + 1;
      });
    Logger.log('  f) ANUNCIOS: ' + (Object.keys(F).map(function (k) { return F[k] + ' ' + k; }).join(', ') || 'sin anuncios de búsqueda'));

    // g) Qué hacer
    if (!hacer.length) hacer.push('No se ve una causa clara en Google. Cruzar con Resend por página: puede que sí traiga y Google no lo vea (cookies).');
    Logger.log('  g) QUÉ HACER (en orden):');
    hacer.forEach(function (h, i) { Logger.log('     ' + (i + 1) + '. ' + h); });
  });

  Logger.log('');
  var nombres = { pagina: 'página', busquedas: 'búsquedas que no son', calidadPagina: 'calidad de página', anuncios: 'anuncios', rank: 'sale poco por puja/calidad' };
  Logger.log('FLOJAS · ' + marca + ' · no traen: ' + flojas.filter(function (c) { return c.grupo === '❌ no trae'; }).length +
    ' · caras: ' + flojas.filter(function (c) { return c.grupo === '💸 cara'; }).length +
    ' · causas: ' + (Object.keys(causas).map(function (k) { return nombres[k] + ' ' + causas[k]; }).join(', ') || 'ninguna clara'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
