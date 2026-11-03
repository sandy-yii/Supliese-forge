/**
 * Atelback · ¿Un sitio web por grupo? — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Google rechaza los
 * anuncios de un grupo cuando dentro de él hay direcciones de dominios distintos (anuncios encendidos o pausados y
 * palabras clave con URL propia). Este script revisa todos los grupos de todas las campañas y dice:
 *   - qué grupos tienen dominios mezclados y cuáles son;
 *   - qué anuncios están rechazados por «un sitio web por grupo» y su estado de revisión;
 *   - primero las campañas encendidas, que son las que importan.
 * No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

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
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : ''; }
// Dominio de nivel superior (supliese.com, kingstar.com.mx): es el que cuenta para «un sitio por grupo».
function dominio(url) {
  var h = sitio(url).split('.');
  if (h.length < 2) return '';
  var n = (h.length >= 3 && /^(com|net|org|gob|edu)$/.test(h[h.length - 2]) && h[h.length - 1].length === 2) ? 3 : 2;
  return h.slice(-n).join('.');
}
var ESTADO = { ENABLED: 'encendido', PAUSED: 'pausado' };

function main() {
  revisarCuenta();
  Logger.log('¿UN SITIO WEB POR GRUPO? · ' + PLAN.nombre + ' · dominio de la marca: ' + dominio(PLAN.url) + ' · solo lee');

  var G = {};
  function grupo(f) {
    var k = f.campaign.name + ' > ' + f.adGroup.name;
    return G[k] = G[k] || { campana: f.campaign.name, encendida: f.campaign.status === 'ENABLED' && f.adGroup.status === 'ENABLED',
      dominios: {}, anuncios: [], palabras: [] };
  }
  filas('SELECT campaign.name, campaign.status, ad_group.name, ad_group.status, ad_group_ad.status, ad_group_ad.ad.id, ad_group_ad.ad.type, ' +
    'ad_group_ad.ad.final_urls, ad_group_ad.ad.final_mobile_urls, ad_group_ad.ad.display_url, ad_group_ad.policy_summary.approval_status, ' +
    'ad_group_ad.policy_summary.review_status, ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad ' +
    "WHERE ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'los anuncios')
    .forEach(function (f) {
      var g = grupo(f), ad = f.adGroupAd.ad, pol = f.adGroupAd.policySummary || {};
      var urls = (ad.finalUrls || []).concat(ad.finalMobileUrls || []);
      if (ad.displayUrl) urls.push(/^https?:/i.test(ad.displayUrl) ? ad.displayUrl : 'https://' + ad.displayUrl);
      var doms = {};
      urls.forEach(function (u) { var d = dominio(u); if (d) { doms[d] = true; g.dominios[d] = true; } });
      var temas = (pol.policyTopicEntries || []).map(function (e) { return e.topic; });
      g.anuncios.push({ id: ad.id, tipo: ad.type, estado: ESTADO[f.adGroupAd.status] || f.adGroupAd.status, dominios: Object.keys(doms),
        url: (ad.finalUrls || [])[0] || ad.displayUrl || '(sin URL)', aprobacion: pol.approvalStatus || '', revision: pol.reviewStatus || '',
        unSitio: temas.some(function (t) { return /ONE_WEBSITE/i.test(t); }), temas: temas });
    });
  filas('SELECT campaign.name, campaign.status, ad_group.name, ad_group.status, ad_group_criterion.keyword.text, ad_group_criterion.final_urls, ' +
    "ad_group_criterion.final_mobile_urls FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED' " +
    "AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'las palabras clave').forEach(function (f) {
    var urls = (f.adGroupCriterion.finalUrls || []).concat(f.adGroupCriterion.finalMobileUrls || []);
    if (!urls.length) return;
    var g = grupo(f);
    urls.forEach(function (u) { var d = dominio(u); if (d) g.dominios[d] = true; });
    g.palabras.push('«' + (f.adGroupCriterion.keyword || {}).text + '» → ' + urls[0]);
  });

  var nombres = Object.keys(G).sort(function (a, b) { return (G[b].encendida ? 1 : 0) - (G[a].encendida ? 1 : 0) || (a < b ? -1 : 1); });
  var mezclados = 0, rechazados = 0, problemas = [];
  nombres.forEach(function (n) {
    var g = G[n], doms = Object.keys(g.dominios), malos = g.anuncios.filter(function (a) { return a.unSitio; });
    if (doms.length <= 1 && !malos.length) return;
    if (doms.length > 1) mezclados++;
    rechazados += malos.length;
    problemas.push(n);
    Logger.log('');
    Logger.log('==== ' + n + (g.encendida ? ' · ENCENDIDO' : ' · en pausa (no sale)') + ' ====');
    Logger.log('Dominios dentro del grupo: ' + (doms.join(' · ') || '(ninguno)') + (doms.length > 1 ? '  ❌ MEZCLADOS' : '  ✅ uno solo'));
    g.anuncios.forEach(function (a) {
      Logger.log('   anuncio ' + a.id + ' · ' + a.tipo + ' · ' + a.estado + ' · ' + a.url + ' · ' + (a.aprobacion || 'sin dato') +
        (a.revision ? ' (' + a.revision + ')' : '') + (a.unSitio ? ' · RECHAZADO POR UN SITIO POR GRUPO' : '') +
        (a.dominios.length > 1 ? ' · este anuncio trae ' + a.dominios.join(' y ') : ''));
    });
    g.palabras.forEach(function (p) { Logger.log('   palabra clave con URL propia: ' + p); });
  });

  Logger.log('');
  Logger.log('==== RESULTADO ====');
  var encendidos = problemas.filter(function (n) { return G[n].encendida; });
  if (!problemas.length) Logger.log('✅ Ningún grupo tiene dominios mezclados ni anuncios rechazados por «un sitio web por grupo».');
  else {
    Logger.log(problemas.length + ' grupo(s) con algo que revisar: ' + mezclados + ' con dominios mezclados, ' + rechazados + ' anuncio(s) marcados por la regla.');
    Logger.log(encendidos.length ? '❌ ENCENDIDOS con problema: ' + encendidos.join(' · ')
                                 : '✅ Ningún grupo encendido tiene problema: los que salen arriba están en pausa y no afectan.');
    Logger.log('Si un grupo tiene UN solo dominio pero sus anuncios siguen marcados, es un rechazo viejo: Google lo quita al volver a revisar.');
  }
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
