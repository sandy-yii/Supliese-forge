/**
 * Atelback · Girbau: anuncios rechazados por «Destino no operativo» — pasar de girbauoccidente.com a girbaupro.com
 * Escrito a mano el 14 nov 2026 (no lo genera generar.py). SOLO para Girbau (860-582-6837).
 *
 * QUÉ PASÓ: el 14 nov a las 12:18 a.m. Google rechazó 11 anuncios y 6 grupos de recursos (Máximo rendimiento) de Girbau por
 * «Destino no operativo» y «Un sitio web por grupo de anuncios». girbauoccidente.com no responde (revisado a las 12:20 a.m.);
 * girbaupro.com sí responde y es la página que hoy usan los avisos de Girbau.
 *
 * QUÉ HACE:
 *   1. Lista TODO lo de Girbau que lleva a girbauoccidente.com: anuncios, grupos de recursos de Máximo rendimiento y enlaces
 *      a secciones, con su estado (aprobado o rechazado y por qué).
 *   2. Para cada dirección revisa que la misma página exista en girbaupro.com (que conteste 200). Si no existe, usa la
 *      portada https://girbaupro.com/.
 *   3. VISTA PREVIA: solo muestra qué cambiaría. EJECUTAR (con el OK): cambia la dirección final de esos anuncios y grupos de
 *      recursos a girbaupro.com. Así todo el grupo queda con un solo sitio y Google los vuelve a revisar.
 * CANDADOS:
 *   - Solo toca lo que lleva a girbauoccidente.com (que hoy no abre). Lo que ya va a girbaupro.com no se toca.
 *   - Si girbaupro.com no contesta al momento de correrlo, no cambia nada.
 *   - No toca presupuestos, pujas, palabras ni textos de los anuncios. No pausa nada.
 *   - Los enlaces a secciones solo se listan (se arreglan aparte si hace falta).
 *   - Para regresarlo (si girbauoccidente.com vuelve y se prefiere): cambia VIEJO y NUEVO de lugar y córrelo otra vez.
 *
 * CÓMO SE USA: en Girbau > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var CUENTA = '860-582-6837';
var VIEJO = 'girbauoccidente.com';
var NUEVO = 'girbaupro.com';

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function tieneViejo(urls) { return (urls || []).some(function (u) { return u.toLowerCase().indexOf(VIEJO) >= 0; }); }
var probadas = {};
function contesta(url) {
  if (url in probadas) return probadas[url];
  var ok = false;
  try { var r = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: true }); ok = r.getResponseCode() === 200; } catch (e) { ok = false; }
  probadas[url] = ok; return ok;
}
function nuevaUrl(u) {
  var n = u.replace(/^https?:\/\/(www\.)?girbauoccidente\.com/i, 'https://' + NUEVO);
  if (n === u) return u;
  if (contesta(n)) return n;
  return 'https://' + NUEVO + '/';
}
function temas(ps) {
  return ((ps || {}).policyTopicEntries || []).map(function (t) { return t.topic; }).join(', ');
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== CUENTA) throw new Error('Este script es solo para Girbau (' + CUENTA + '). Esta cuenta es ' + cid + '. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('GIRBAU · PÁGINA CAÍDA → ' + NUEVO + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR'));
  Logger.log('');
  Logger.log('Prueba de páginas: ' + VIEJO + ' ' + (contesta('https://' + VIEJO + '/') ? 'SÍ abre' : 'NO abre') +
    ' · ' + NUEVO + ' ' + (contesta('https://' + NUEVO + '/') ? 'SÍ abre' : 'NO abre'));
  if (!contesta('https://' + NUEVO + '/')) { Logger.log('⛔ ' + NUEVO + ' tampoco abre ahorita. No se cambia nada; avisa a Rodolfo.'); return; }
  Logger.log('');

  var ops = [], textos = [];

  // 1. Anuncios
  Logger.log('==== 1. ANUNCIOS ====');
  var nAd = 0;
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.status, ad_group_ad.ad.resource_name, ad_group_ad.ad.type, ad_group_ad.ad.final_urls, " +
    "ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad " +
    "WHERE ad_group_ad.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'los anuncios').forEach(function (f) {
      var a = f.adGroupAd, urls = (a.ad || {}).finalUrls || [], ps = a.policySummary || {};
      var est = (ps.approvalStatus || '?') + (temas(ps) ? ' (' + temas(ps) + ')' : '');
      if (!tieneViejo(urls)) {
        if (ps.approvalStatus === 'DISAPPROVED') Logger.log('ℹ️ rechazado pero NO va a ' + VIEJO + ': ' + f.campaign.name + ' › ' + f.adGroup.name + ' · ' + urls.join(' ') + ' · ' + est);
        return;
      }
      nAd++;
      var nuevas = urls.map(nuevaUrl);
      Logger.log((a.status === 'ENABLED' ? '' : '[' + a.status + '] ') + f.campaign.name + ' › ' + f.adGroup.name + ' · ' + est);
      Logger.log('   ' + urls.join(' ') + '  →  ' + nuevas.join(' '));
      if (a.ad.type === 'RESPONSIVE_SEARCH_AD') {
        ops.push({ adOperation: { update: { resourceName: a.ad.resourceName, finalUrls: nuevas }, updateMask: 'final_urls' } });
        textos.push('anuncio ' + f.campaign.name + ' › ' + f.adGroup.name);
      } else Logger.log('   (tipo ' + a.ad.type + ': se cambia a mano)');
    });
  if (!nAd) Logger.log('Ningún anuncio va a ' + VIEJO + '.');
  Logger.log('');

  // 2. Máximo rendimiento
  Logger.log('==== 2. GRUPOS DE RECURSOS (MÁXIMO RENDIMIENTO) ====');
  var nAg = 0;
  filas("SELECT campaign.name, asset_group.resource_name, asset_group.name, asset_group.status, asset_group.final_urls, asset_group.primary_status, " +
    "asset_group.primary_status_reasons FROM asset_group WHERE asset_group.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'los grupos de recursos')
    .forEach(function (f) {
      var g = f.assetGroup, urls = g.finalUrls || [];
      var est = (g.primaryStatus || '?') + ((g.primaryStatusReasons || []).length ? ' (' + g.primaryStatusReasons.join(', ') + ')' : '');
      if (!tieneViejo(urls)) { Logger.log('ok · ' + f.campaign.name + ' › ' + g.name + ' · ' + urls.join(' ') + ' · ' + est); return; }
      nAg++;
      var nuevas = urls.map(nuevaUrl);
      Logger.log(f.campaign.name + ' › ' + g.name + ' · ' + est);
      Logger.log('   ' + urls.join(' ') + '  →  ' + nuevas.join(' '));
      ops.push({ assetGroupOperation: { update: { resourceName: g.resourceName, finalUrls: nuevas }, updateMask: 'final_urls' } });
      textos.push('grupo de recursos ' + g.name);
    });
  if (!nAg) Logger.log('Ningún grupo de recursos va a ' + VIEJO + '.');
  Logger.log('');

  // 3. Enlaces a secciones (solo se listan)
  Logger.log('==== 3. ENLACES A SECCIONES QUE VAN A ' + VIEJO + ' (solo se listan) ====');
  var nS = 0;
  filas("SELECT asset.id, asset.sitelink_asset.link_text, asset.final_urls FROM asset WHERE asset.type = 'SITELINK'", 'los enlaces').forEach(function (f) {
    if (!tieneViejo(f.asset.finalUrls)) return;
    nS++; Logger.log('«' + ((f.asset.sitelinkAsset || {}).linkText || '?') + '» · ' + f.asset.finalUrls.join(' '));
  });
  if (!nS) Logger.log('Ninguno.');
  Logger.log('');

  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ ' + textos[i]);
    });
  }
  Logger.log('GIRBAU PÁGINA · ' + (vista ? 'vista previa' : 'ejecutado') + ' · anuncios: ' + nAd + ' · grupos de recursos: ' + nAg +
    ' · enlaces (solo lista): ' + nS + ' · con error: ' + malos);
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada. Mándame el registro.' : 'LISTO. Google los vuelve a revisar (normalmente horas). Mándame el registro.');
}
