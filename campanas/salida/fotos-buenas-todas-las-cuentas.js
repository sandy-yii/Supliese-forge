/**
 * Atelback · ¿Qué fotos ya tenemos y cuáles son buenas? — las cinco cuentas
 * Escrito a mano el 13 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   1. TODAS LAS FOTOS de la cuenta: tamaño y forma (cuadrada, horizontal, vertical), si Google las aprobó,
 *      su calificación en Máximo rendimiento («Mejor», «Buena», «Baja», «Aprendiendo») y en qué campañas de búsqueda
 *      ya salen, con impresiones y clics de 30 días. Trae el enlace para verla.
 *   2. CAMPAÑAS DE BÚSQUEDA SIN FOTOS.
 *   3. CANDIDATAS: fotos aprobadas, con forma que sirve en búsqueda (cuadrada u horizontal) y calificadas «Mejor» o «Buena»
 *      (o con buen porcentaje de clics en búsqueda). Con este registro se arma el script que las pone en las campañas
 *      sin fotos, foto por campaña según lo que muestra (Vista previa, OK y deshacer).
 *   4. Un renglón final «FOTOS ·».
 * Gamesail: Google no deja fotos en búsqueda hasta que la cuenta cumpla 60 días (hacia el 25 dic).
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar TODO el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var ETIQUETA = { BEST: 'Mejor', GOOD: 'Buena', LOW: 'Baja', LEARNING: 'Aprendiendo', PENDING: 'Pendiente', UNKNOWN: 'sin calificación', UNSPECIFIED: 'sin calificación' };
var APROB = { APPROVED: 'aprobada', APPROVED_LIMITED: 'aprobada (limitada)', DISAPPROVED: 'RECHAZADA', AREA_OF_INTEREST_ONLY: 'limitada', UNKNOWN: '?', UNSPECIFIED: '?' };

function filas(q, que, callado) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) { var r = it.next(); r.metrics = r.metrics || {}; out.push(r); } }
  catch (e) { if (callado) return null; Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function forma(w, h) {
  if (!w || !h) return 'otra';
  var r = w / h;
  if (Math.abs(r - 1) < 0.03) return 'cuadrada';
  if (Math.abs(r - 1.91) < 0.06) return 'horizontal';
  if (Math.abs(r - 0.8) < 0.03) return 'vertical 4:5';
  if (Math.abs(r - 4) < 0.1) return 'logo horizontal 4:1';
  return 'otra (' + w + '×' + h + ')';
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  Logger.log('FOTOS · ' + marca + ' · solo lee, no cambia nada');
  Logger.log('');

  // Fotos de la cuenta
  var A = {};
  filas("SELECT asset.id, asset.name, asset.image_asset.full_size.width_pixels, asset.image_asset.full_size.height_pixels, " +
    "asset.image_asset.full_size.url, asset.image_asset.file_size, asset.policy_summary.approval_status FROM asset WHERE asset.type = 'IMAGE'", 'las fotos')
    .forEach(function (f) {
      var a = f.asset, im = a.imageAsset || {}, fs = im.fullSize || {};
      A[a.id] = { id: a.id, nombre: a.name || ('foto ' + a.id), w: +fs.widthPixels || 0, h: +fs.heightPixels || 0, url: fs.url || '',
        kb: Math.round((+im.fileSize || 0) / 1024), aprob: (a.policySummary || {}).approvalStatus || 'UNKNOWN',
        pmax: [], busq: {}, imp: 0, clics: 0 };
      A[a.id].forma = forma(A[a.id].w, A[a.id].h);
    });

  // Máximo rendimiento: calificación
  var pm = filas("SELECT campaign.name, asset_group.name, asset.id, asset_group_asset.field_type, asset_group_asset.performance_label, asset_group_asset.status " +
    "FROM asset_group_asset WHERE asset.type = 'IMAGE' AND asset_group_asset.status != 'REMOVED'", 'Máximo rendimiento', true);
  if (pm === null) pm = filas("SELECT campaign.name, asset_group.name, asset.id, asset_group_asset.field_type, asset_group_asset.status " +
    "FROM asset_group_asset WHERE asset.type = 'IMAGE' AND asset_group_asset.status != 'REMOVED'", 'Máximo rendimiento');
  pm.forEach(function (f) {
    var a = A[f.asset.id]; if (!a) return;
    a.pmax.push({ camp: f.campaign.name, grupo: f.assetGroup.name, label: f.assetGroupAsset.performanceLabel || 'UNKNOWN' });
  });

  // Búsqueda: dónde sale (campaña, grupo o cuenta)
  var busq = {};   // campaña de búsqueda -> tiene foto
  var C = {};
  filas("SELECT campaign.name FROM campaign WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas')
    .forEach(function (f) { C[f.campaign.name] = 0; });
  var deCuenta = 0;
  filas("SELECT asset.id, customer_asset.status FROM customer_asset WHERE customer_asset.field_type = 'AD_IMAGE' AND customer_asset.status = 'ENABLED'", 'fotos de la cuenta')
    .forEach(function (f) { deCuenta++; if (A[f.asset.id]) A[f.asset.id].busq['(toda la cuenta)'] = true; });
  filas("SELECT campaign.name, campaign.status, asset.id, campaign_asset.status FROM campaign_asset WHERE campaign_asset.field_type = 'AD_IMAGE' " +
    "AND campaign_asset.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'fotos por campaña')
    .forEach(function (f) { if (A[f.asset.id]) A[f.asset.id].busq[f.campaign.name] = true; if (f.campaign.name in C) C[f.campaign.name]++; });
  filas("SELECT campaign.name, campaign.status, asset.id, ad_group_asset.status FROM ad_group_asset WHERE ad_group_asset.field_type = 'AD_IMAGE' " +
    "AND ad_group_asset.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'fotos por grupo')
    .forEach(function (f) { if (A[f.asset.id]) A[f.asset.id].busq[f.campaign.name] = true; if (f.campaign.name in C) C[f.campaign.name]++; });
  // Números de 30 días en búsqueda
  ['campaign_asset', 'ad_group_asset', 'customer_asset'].forEach(function (t) {
    filas("SELECT asset.id, metrics.impressions, metrics.clicks FROM " + t + " WHERE " + t + ".field_type = 'AD_IMAGE' AND segments.date DURING LAST_30_DAYS",
      'números de fotos (' + t + ')').forEach(function (f) {
        var a = A[f.asset.id]; if (!a) return; a.imp += +f.metrics.impressions || 0; a.clics += +f.metrics.clicks || 0;
      });
  });
  var impT = 0, clT = 0;
  Object.keys(A).forEach(function (k) { impT += A[k].imp; clT += A[k].clics; });
  var ctrCuenta = impT ? clT / impT : 0;

  // 1. Todas las fotos
  Logger.log('==== 1. TODAS LAS FOTOS (' + Object.keys(A).length + ') ====');
  var lista = Object.keys(A).map(function (k) { return A[k]; }).sort(function (a, b) { return b.imp - a.imp; });
  lista.forEach(function (a) {
    var labels = a.pmax.map(function (p) { return (ETIQUETA[p.label] || p.label) + ' en ' + p.camp + ' › ' + p.grupo; });
    var dondeB = Object.keys(a.busq);
    Logger.log('• «' + a.nombre + '» · ' + a.forma + ' · ' + a.kb + ' KB · ' + (APROB[a.aprob] || a.aprob) +
      (labels.length ? ' · Máx. rendimiento: ' + labels.join('; ') : '') +
      (dondeB.length ? ' · búsqueda: ' + dondeB.join(', ') + ' (' + a.imp + ' impresiones, ' + a.clics + ' clics)' : ' · no sale en búsqueda'));
    if (a.url) Logger.log('    ver: ' + a.url);
  });
  if (!lista.length) Logger.log('La cuenta no tiene fotos.');
  Logger.log('');

  // 2. Campañas sin fotos
  Logger.log('==== 2. CAMPAÑAS DE BÚSQUEDA ====');
  var sin = [];
  Object.keys(C).sort().forEach(function (c) {
    var tiene = C[c] + deCuenta;
    if (!tiene) sin.push(c);
    Logger.log((tiene ? '✅ ' : '⚠️ SIN FOTOS · ') + c + (tiene ? ' · ' + C[c] + ' propias' + (deCuenta ? ' + ' + deCuenta + ' de la cuenta' : '') : ''));
  });
  if (!Object.keys(C).length) Logger.log('No hay campañas de búsqueda encendidas.');
  Logger.log('');

  // 3. Candidatas
  Logger.log('==== 3. FOTOS BUENAS QUE SE PUEDEN USAR EN BÚSQUEDA ====');
  var cand = lista.filter(function (a) {
    if (a.aprob === 'DISAPPROVED') return false;
    if (a.forma !== 'cuadrada' && a.forma !== 'horizontal') return false;
    var buenaPm = a.pmax.some(function (p) { return p.label === 'BEST' || p.label === 'GOOD'; });
    var buenaB = a.imp >= 100 && ctrCuenta && a.clics / a.imp >= ctrCuenta;
    a.porque = buenaPm ? 'calificada «Buena» o «Mejor» en Máximo rendimiento' : (buenaB ? 'buen porcentaje de clics en búsqueda' : '');
    return buenaPm || buenaB;
  });
  cand.forEach(function (a) { Logger.log('⭐ «' + a.nombre + '» · ' + a.forma + ' · ' + a.porque + (a.url ? ' · ' + a.url : '')); });
  if (!cand.length) Logger.log('Ninguna foto cumple (aprobada, cuadrada u horizontal y con buena calificación).');
  if (cid === '118-347-6484') Logger.log('Gamesail: Google no deja fotos en búsqueda hasta que la cuenta cumpla 60 días (hacia el 25 dic).');
  Logger.log('');
  Logger.log('FOTOS · ' + marca + ' · fotos: ' + lista.length + ' · buenas para búsqueda: ' + cand.length +
    ' (cuadradas ' + cand.filter(function (a) { return a.forma === 'cuadrada'; }).length + ') · campañas de búsqueda sin fotos: ' + sin.length +
    (sin.length ? ' (' + sin.join('; ') + ')' : ''));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
