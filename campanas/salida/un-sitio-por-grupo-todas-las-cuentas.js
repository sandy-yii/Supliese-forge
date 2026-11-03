/**
 * Atelback · ¿Un sitio web por grupo? — las cinco cuentas
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

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "paginas": {}, "subir_topes": true, "mensual": 19700, "subir": true, "subir_porque": "", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://supliese.com/", "prefijo": "AB · ", "paginas": {"AB · Autoservicio y monedas > Autoservicio": "https://supliese.com/lavadoras-de-monedas", "AB · Equipo para lavandería > Lavadoras para lavandería": "https://supliese.com/lavadoras-para-negocio", "AB · Equipo para lavandería > Semi industrial": "https://supliese.com/lavadoras-para-negocio"}, "subir_topes": false, "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y la marca, hasta el tope)", "fijos": ["Equipo para lavandería", "Emprendimiento", "Autoservicio y monedas", "Secadoras para lavandería", "Marcas comerciales", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://clmmexico.com/", "prefijo": "AB · ", "paginas": {"AB · Alta capacidad 60 kg o más > Lavadoras de alta capacidad": "https://clmmexico.com/lavadoras-alta-capacidad", "AB · Mangles y planchado > Mangles": "https://clmmexico.com/mangles", "AB · Lavadoras y secadoras de 20 a 45 kg > 20 a 45 kg": "https://clmmexico.com/lavadoras-40-kg", "AB · Lavandería hotelera e institucional > Lavandería hotelera": "https://clmmexico.com/lavanderia-hotelera", "AB · Lavandería hotelera e institucional > Hospitales e institucional": "https://clmmexico.com/lavanderia-hotelera", "AB · Lavandería hotelera e institucional > Lavadoras para hotel y hospital": "https://clmmexico.com/lavanderia-hotelera", "AB · Túnel de lavado > Túnel de lavado para ropa": "https://clmmexico.com/tunel-de-lavado"}, "subir_topes": false, "mensual": 18700, "subir": true, "subir_porque": "", "fijos": ["Alta capacidad 60 kg o más", "Túnel de lavado", "Lavandería hotelera e institucional", "Lavadoras y secadoras de 20 a 45 kg", "Mangles y planchado", "Marca CLM"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://servicioparalavanderias.com/", "prefijo": "AB · ", "paginas": {"AB · Reparación y mantenimiento > Reparación": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales", "AB · Reparación y mantenimiento > Mantenimiento correctivo": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales", "AB · Reparación y mantenimiento > Mantenimiento preventivo": "https://servicioparalavanderias.com/mantenimiento", "AB · Servicio a lavanderías > Pólizas": "https://servicioparalavanderias.com/mantenimiento", "AB · Servicio técnico industrial > Servicio técnico": "https://servicioparalavanderias.com/reparacion-lavadoras-industriales"}, "subir_topes": false, "mensual": 8200, "subir": true, "subir_porque": "", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "paginas": {}, "subir_topes": false, "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); la marca sale arriba con «ajustes»", "fijos": ["Marca Girbau", "Girbau Smart Plus", "Girbau por capacidad y sector", "Servicio técnico Girbau"], "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
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
