/**
 * Atelback · Girbau: ¿ya aprobó Google girbauoccidente.com?
 * Escrito a mano el 3 nov 2026 (no lo genera generar.py). Solo para la cuenta Girbau 860-582-6837.
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   1. El anuncio de prueba «Girbau Búsqueda | Nerea › Barreras sanitarias»: estado, revisión de Google, motivo y la fecha
 *      en que Google revisó la página por última vez (si es del 29 oct, sigue siendo la revisión vieja).
 *   2. A qué dominio van todos los anuncios y cuáles están rechazados.
 *   3. Enlaces de sitio y botón de llamada: su dirección y su estado.
 *   4. Que girbauoccidente.com abra y muestre el teléfono de Eduardo.
 *   Al final dice qué sigue.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var CUENTA = '860-582-6837';
var NUEVO = 'girbauoccidente.com';
var TELEFONO = '3328068994';
var CAMBIO_DE_DOMINIO = '2026-11-01'; // Rodolfo conectó girbauoccidente.com este día

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
function sitio(url) { var m = /^https?:\/\/([^\/?#]+)/i.exec(url || ''); return m ? m[1].toLowerCase().replace(/^www\./, '') : '(sin URL)'; }
var APROBACION = { APPROVED: 'APROBADO', APPROVED_LIMITED: 'APROBADO (limitado)', DISAPPROVED: 'RECHAZADO', AREA_OF_INTEREST_ONLY: 'solo en algunas zonas', UNKNOWN: 'sin dato', UNSPECIFIED: 'sin dato' };
var REVISION = { REVIEW_IN_PROGRESS: 'Google lo está revisando', REVIEWED: 'revisado', UNDER_APPEAL: 'APELACIÓN EN PROCESO', ELIGIBLE_MAY_SERVE: 'puede salir mientras revisan' };
function apr(x) { return APROBACION[x] || x || 'sin dato'; }
function rev(x) { return REVISION[x] || x || ''; }

// Describe los motivos de Google, con la fecha de la última revisión de la página si la trae.
function motivos(entries) {
  var fechas = [];
  var txt = (entries || []).map(function (e) {
    var s = e.topic + (e.type ? ' (' + e.type + ')' : '');
    (e.evidences || []).forEach(function (ev) {
      var d = ev.destinationNotWorking;
      if (d) {
        if (d.lastCheckedDateTime) fechas.push(String(d.lastCheckedDateTime).slice(0, 10));
        s += ' · revisó ' + (d.expandedUrl || '') + ' en ' + (d.device || '?') + ' el ' + (d.lastCheckedDateTime || '?') +
             (d.httpErrorCode ? ' · error HTTP ' + d.httpErrorCode : '') + (d.dnsErrorType ? ' · error DNS ' + d.dnsErrorType : '');
      }
      if (ev.destinationMismatch) s += ' · dirección distinta: ' + JSON.stringify(ev.destinationMismatch);
    });
    return s;
  });
  return { texto: txt.join(' | '), fechas: fechas };
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== CUENTA) throw new Error('Este script es solo para Girbau (' + CUENTA + '). Estás en ' + cid + '. No se hizo nada.');
  Logger.log('GIRBAU · ¿YA APROBÓ GOOGLE ' + NUEVO + '? · solo lee');

  // 1. Anuncio de prueba
  Logger.log('');
  Logger.log('==== 1. ANUNCIO DE PRUEBA (Nerea › Barreras sanitarias) ====');
  var prueba = filas('SELECT campaign.name, campaign.status, ad_group.name, ad_group_ad.status, ad_group_ad.ad.id, ad_group_ad.ad.final_urls, ' +
    'ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status, ad_group_ad.policy_summary.policy_topic_entries ' +
    "FROM ad_group_ad WHERE campaign.name LIKE '%Nerea%' AND ad_group.name = 'Barreras sanitarias' AND ad_group_ad.status != 'REMOVED'", 'el anuncio de prueba');
  var veredicto = 'no encontrado';
  if (!prueba.length) Logger.log('❓ No encontré el anuncio de prueba. Revisa el nombre de la campaña y del grupo.');
  prueba.forEach(function (f) {
    var p = f.adGroupAd.policySummary || {}, m = motivos(p.policyTopicEntries);
    var url = (f.adGroupAd.ad.finalUrls || [])[0] || '(sin URL)';
    Logger.log('Anuncio ' + f.adGroupAd.ad.id + ' · campaña ' + f.campaign.status + ' · anuncio ' + f.adGroupAd.status + ' · ' + url);
    Logger.log('Estado: ' + apr(p.approvalStatus) + (p.reviewStatus ? ' · ' + rev(p.reviewStatus) : '') + (m.texto ? ' · ' + m.texto : ''));
    if (sitio(url) !== NUEVO) veredicto = 'otra url';
    else if (/^APPROVED/.test(p.approvalStatus || '')) veredicto = 'aprobado';
    else if (p.reviewStatus === 'UNDER_APPEAL' || p.reviewStatus === 'REVIEW_IN_PROGRESS') veredicto = 'revisando';
    else if (m.fechas.length && m.fechas.every(function (d) { return d < CAMBIO_DE_DOMINIO; })) veredicto = 'vieja';
    else if (m.fechas.length) veredicto = 'nueva';
    else veredicto = 'rechazado';
  });

  // 2. Anuncios por dominio
  Logger.log('');
  Logger.log('==== 2. ANUNCIOS POR DOMINIO (campañas y grupos no borrados) ====');
  var cuenta = {}, rechazados = [];
  filas('SELECT campaign.name, campaign.status, ad_group.name, ad_group_ad.status, ad_group_ad.ad.id, ad_group_ad.ad.final_urls, ' +
    'ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad ' +
    "WHERE ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'los anuncios')
    .forEach(function (f) {
      var url = (f.adGroupAd.ad.finalUrls || [])[0] || '';
      var enc = f.campaign.status === 'ENABLED' ? 'encendidas' : 'en pausa';
      var k = sitio(url) + ' · ' + enc;
      cuenta[k] = (cuenta[k] || 0) + 1;
      var p = f.adGroupAd.policySummary || {};
      if (p.approvalStatus === 'DISAPPROVED')
        rechazados.push(f.campaign.name + ' › ' + f.adGroup.name + ' (' + enc + ') · ' + url + ' · ' + motivos(p.policyTopicEntries).texto);
    });
  Object.keys(cuenta).sort().forEach(function (k) { Logger.log(k + ': ' + cuenta[k] + ' anuncio(s)'); });
  Logger.log(rechazados.length ? 'Rechazados:' : 'Ningún anuncio rechazado.');
  rechazados.forEach(function (r) { Logger.log('   ' + r); });

  // 3. Enlaces de sitio y llamada
  Logger.log('');
  Logger.log('==== 3. ENLACES DE SITIO Y BOTÓN DE LLAMADA ====');
  var vistos = {};
  ['customer_asset', 'campaign_asset'].forEach(function (tabla) {
    filas('SELECT ' + tabla + '.field_type, ' + tabla + '.status, asset.id, asset.final_urls, asset.sitelink_asset.link_text, ' +
      'asset.call_asset.phone_number, asset.policy_summary.approval_status, asset.policy_summary.review_status, asset.policy_summary.policy_topic_entries ' +
      (tabla === 'campaign_asset' ? ', campaign.name, campaign.status ' : '') + 'FROM ' + tabla +
      ' WHERE ' + tabla + ".field_type IN ('SITELINK', 'CALL') AND " + tabla + ".status != 'REMOVED'" +
      (tabla === 'campaign_asset' ? " AND campaign.status = 'ENABLED'" : ''), 'los recursos (' + tabla + ')')
      .forEach(function (f) {
        var a = f.asset, ca = f.customerAsset || f.campaignAsset;
        var clave = a.id + '|' + (f.campaign ? f.campaign.name : 'cuenta');
        if (vistos[clave]) return; vistos[clave] = true;
        var p = a.policySummary || {}, m = motivos(p.policyTopicEntries);
        var que = ca.fieldType === 'CALL' ? 'Llamada ' + ((a.callAsset || {}).phoneNumber || '') :
          'Enlace «' + ((a.sitelinkAsset || {}).linkText || '') + '» → ' + ((a.finalUrls || [])[0] || '');
        Logger.log((f.campaign ? f.campaign.name : 'Toda la cuenta') + ' · ' + que + ' · ' + apr(p.approvalStatus) +
          (p.reviewStatus ? ' · ' + rev(p.reviewStatus) : '') + (m.texto ? ' · ' + m.texto : ''));
      });
  });

  // 4. La página
  Logger.log('');
  Logger.log('==== 4. LA PÁGINA ====');
  try {
    var r = UrlFetchApp.fetch('https://' + NUEVO + '/', { muteHttpExceptions: true, followRedirects: true });
    var html = r.getContentText().replace(/\D/g, '');
    Logger.log('https://' + NUEVO + '/ responde ' + r.getResponseCode() + ' · teléfono 33 2806 8994 ' +
      (html.indexOf(TELEFONO) >= 0 ? 'SÍ aparece' : 'NO aparece'));
  } catch (e) {
    Logger.log('❌ No pude abrir https://' + NUEVO + '/: ' + e.message);
  }

  // Qué sigue
  Logger.log('');
  Logger.log('==== QUÉ SIGUE ====');
  var QUE = {
    'aprobado': '✅ Google YA APROBÓ ' + NUEVO + '. Siguiente: correr fin-de-semana-girbauoccidente.com.js (Vista previa primero) y avisar a Claude.',
    'revisando': '⏳ Google todavía lo está revisando (apelación en proceso). No hay que hacer nada; vuelve a correrlo mañana.',
    'vieja': '⏳ Sigue rechazado con la revisión VIEJA (antes del 1 nov). La apelación no ha llegado. Si el 5 nov sigue así, se escribe a soporte.',
    'nueva': '❌ Google volvió a revisar la página DESPUÉS del 1 nov y la sigue rechazando. Manda este registro a Claude: hay que verlo con Rodolfo.',
    'rechazado': '❌ Rechazado sin fecha de revisión. Manda este registro a Claude.',
    'otra url': '❓ El anuncio de prueba ya no va a ' + NUEVO + '. Manda este registro a Claude.',
    'no encontrado': '❓ No encontré el anuncio de prueba. Manda este registro a Claude.'
  };
  Logger.log(QUE[veredicto]);
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
