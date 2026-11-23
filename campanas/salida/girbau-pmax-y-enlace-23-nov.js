// GIRBAU: MAXIMO RENDIMIENTO Y ENLACE "Conoce Nuestras Lavadoras" (23 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR o dentro de Girbau. Solo trabaja Girbau (860-582-6837).
// POR QUE: la pagina ya no da precios, las lavadoras van de 9 a 32 kg y "garantia" esta vetada (nota de Rodolfo del 22-nov).
//   Los 6 grupos de Maximo rendimiento estan llenos (Google ya no deja agregar), asi que en cada grupo se cambia en UN paso:
//   se quitan los textos con "precio", "20 a 50 kg" o "garantia" y, si hace falta espacio, los que Google califica "Bajo"
//   (nunca los "Bueno" ni "Optimo"), y se ponen los nuevos. Todo o nada por grupo: si algo falla, ese grupo sigue igual.
// ENLACE: "Conoce Nuestras Lavadoras" decia "15 a 110 kg"; el nuevo dice "Lavadoras De 9 A 32 Kg". Primero se pone el nuevo.
// NO toca presupuestos, pujas, campanas ni anuncios de busqueda.
// VISTA PREVIA: muestra que quitaria y que pondria. EJECUTAR (con el OK): lo hace.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: quita lo nuevo y vuelve a poner lo viejo.

var CID = '860-582-6837';
var MALOS = /precio|20 a 50 kg|garant[i\u00ed]a/i;
var LIMITE = { HEADLINE: 15, DESCRIPTION: 5 };
var TITULOS = ['Pide Tu Cotizaci\u00f3n Girbau', 'Distribuidor Exclusivo Girbau', 'Cotiza Por WhatsApp'];
var CORTA = 'Pide Tu Cotizaci\u00f3n Girbau Por WhatsApp.';
var DESCRIPCION = {
  'T\u00fanel De Lavado Industrial': 'T\u00fanel De Lavado Girbau Para Grandes Capacidades, Con Sus Complementos. Pide Tu Cotizaci\u00f3n.',
  'Secadora Industrial': 'Secadoras Girbau De 13 A 62 Kg, A Gas, Electricidad O Vapor. Pide Tu Cotizaci\u00f3n Hoy.',
  'Mangles': 'Planchadoras De Rodillos Girbau De 1.50 A 3.20 m, A Gas, Electricidad O Vapor. Cotiza Hoy.',
  'Barreras sanitarias': 'Lavadoras De Barrera Sanitaria Girbau De 16 A 200 Kg. Pide Tu Cotizaci\u00f3n Por WhatsApp.',
  '*': 'Lavadoras Girbau De 9 A 32 Kg, Secadoras Y Planchadoras. Pide Tu Cotizaci\u00f3n Por WhatsApp.'
};
var ENLACE = { viejo: 'Conoce Nuestras Lavadoras', texto: 'Conoce Nuestras Lavadoras', d1: 'Lavadoras De 9 A 32 Kg', d2: 'Series GS Y RMS Girbau' };
// Orden para hacer espacio: primero "Bajo"; despues los que aun no tienen calificacion. Nunca "Bueno" ni "Optimo".
var ORDEN = { LOW: 1, UNKNOWN: 2, UNSPECIFIED: 2, PENDING: 3, LEARNING: 3 };

var DESHACER = [];

var tmpN = 0;
function tmp(cid) { tmpN++; return 'customers/' + cid + '/assets/-' + tmpN; }
function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function msg(r) { return r.getErrorMessages().join('; '); }

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('GIRBAU: MAXIMO RENDIMIENTO Y ENLACE' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds([CID]).get();
    if (!it.hasNext()) { Logger.log('No encontre la cuenta de Girbau.'); return; }
    AdsManagerApp.select(it.next());
  } else if (AdsApp.currentAccount().getCustomerId() !== CID) { Logger.log('Esta no es la cuenta de Girbau. No se hizo nada.'); return; }
  var cid = CID.replace(/-/g, '');
  if (DESHACER.length) { deshacer(vista); Logger.log(vista ? 'FIN. Vista previa.' : 'FIN. Mandame el registro.'); return; }
  var quitarL = [], ponerL = [];
  Logger.log('-- ENLACE "' + ENLACE.viejo + '" --');
  try { enlace(cid, vista, quitarL, ponerL); } catch (e) { Logger.log('  ERROR: ' + e.message + ' (el enlace sigue igual)'); }
  Logger.log('');
  Logger.log('-- MAXIMO RENDIMIENTO: cambiar textos con "precio", "20 a 50 kg" y "garantia" --');
  try { pmax(cid, vista, quitarL, ponerL); } catch (e) { Logger.log('  ERROR: ' + e.message); }
  Logger.log('');
  if (!vista && (quitarL.length || ponerL.length))
    Logger.log("PARA DESHACER: var DESHACER = [{quitar: [" + quitarL.join(', ') + "], poner: [" + ponerL.join(', ') + "]}];");
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function enlace(cid, vista, quitarL, ponerL) {
  var filas = leer("SELECT campaign.resource_name, campaign.name, campaign.status, campaign_asset.resource_name, campaign_asset.status, campaign_asset.field_type, " +
    "asset.resource_name, asset.final_urls, asset.sitelink_asset.link_text, asset.sitelink_asset.description1 FROM campaign_asset " +
    "WHERE campaign_asset.status = 'ENABLED' AND campaign_asset.field_type = 'SITELINK' AND campaign.status != 'REMOVED'");
  var viejos = filas.filter(function (r) {
    var s = r.asset.sitelinkAsset || {};
    return s.linkText === ENLACE.viejo && !/9 A 32/i.test(s.description1 || '');
  });
  if (!viejos.length) { Logger.log('  No encontre el enlace viejo. No se toca.'); return; }
  var url = viejos[0].asset.finalUrls[0], t = tmp(cid), vistos = {};
  var ops = [{ assetOperation: { create: { resourceName: t, finalUrls: [url], sitelinkAsset: { linkText: ENLACE.texto, description1: ENLACE.d1, description2: ENLACE.d2 } } } }];
  var txt = ['crear el nuevo: ' + ENLACE.d1 + ' / ' + ENLACE.d2 + ' -> ' + url];
  viejos.forEach(function (v) {
    if (vistos[v.campaign.resourceName]) return; vistos[v.campaign.resourceName] = 1;
    ops.push({ campaignAssetOperation: { create: { campaign: v.campaign.resourceName, asset: t, fieldType: 'SITELINK' } } });
    txt.push('  ponerlo en ' + v.campaign.name);
  });
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), bien = true;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { bien = false; Logger.log('  ERROR ' + txt[i] + ': ' + msg(r)); return; }
    Logger.log('  ' + (vista ? 'se puede: ' : 'LISTO: ') + txt[i]);
    if (!vista && i > 0) quitarL.push("{n: 'campana', rn: '" + r.getResourceName() + "'}");
  });
  if (!bien) { Logger.log('  El nuevo no quedo completo: el viejo se queda.'); return; }
  var res2 = AdsApp.mutateAll(viejos.map(function (v) { return { campaignAssetOperation: { remove: v.campaignAsset.resourceName } }; }), { partialFailure: true });
  res2.forEach(function (r, i) {
    var v = viejos[i];
    Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + 'quitar el viejo (15 a 110 kg) de ' + v.campaign.name + (r.isSuccessful() ? '' : ': ' + msg(r)));
    if (!vista && r.isSuccessful()) ponerL.push("{n: 'campana', t: '" + v.campaign.resourceName + "', a: '" + v.asset.resourceName + "', f: 'SITELINK'}");
  });
}

function pmax(cid, vista, quitarL, ponerL) {
  var grupos = {};
  leer("SELECT asset_group.resource_name, asset_group.name, asset_group.status, campaign.status, campaign.advertising_channel_type FROM asset_group " +
    "WHERE asset_group.status = 'ENABLED' AND campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'PERFORMANCE_MAX'").forEach(function (r) {
      grupos[r.assetGroup.resourceName] = { nombre: r.assetGroup.name, HEADLINE: [], DESCRIPTION: [] };
    });
  leer("SELECT asset_group.resource_name, asset_group.status, campaign.status, asset_group_asset.resource_name, asset_group_asset.field_type, " +
    "asset_group_asset.status, asset_group_asset.performance_label, asset.resource_name, asset.text_asset.text FROM asset_group_asset " +
    "WHERE asset_group_asset.status = 'ENABLED' AND asset_group.status = 'ENABLED' AND campaign.status = 'ENABLED' " +
    "AND asset_group_asset.field_type IN ('HEADLINE', 'DESCRIPTION')").forEach(function (r) {
      var g = grupos[r.assetGroup.resourceName]; if (!g || !r.asset.textAsset) return;
      g[r.assetGroupAsset.fieldType].push({ rn: r.assetGroupAsset.resourceName, asset: r.asset.resourceName, texto: r.asset.textAsset.text,
        label: r.assetGroupAsset.performanceLabel || 'UNKNOWN' });
    });
  var creados = {};
  Object.keys(grupos).forEach(function (grn) {
    var g = grupos[grn];
    // un texto "temporal" de un grupo anterior no sirve en otra corrida: solo se reusan los que ya existen de verdad
    Object.keys(creados).forEach(function (k) { if (/assets\/-/.test(creados[k])) delete creados[k]; });
    Logger.log('  > ' + g.nombre);
    var desc = DESCRIPCION[g.nombre] || DESCRIPCION['*'];
    var quiero = { HEADLINE: TITULOS.slice(), DESCRIPTION: [desc, CORTA] };
    var quitar = [], poner = [];
    ['HEADLINE', 'DESCRIPTION'].forEach(function (tipo) {
      var lista = g[tipo], tiene = {};
      lista.forEach(function (x) { tiene[x.texto.toLowerCase()] = 1; });
      var nuevos = quiero[tipo].filter(function (t) { return !tiene[t.toLowerCase()]; });
      var esQuerido = function (x) { return quiero[tipo].some(function (t) { return t.toLowerCase() === x.texto.toLowerCase(); }); };
      var fuera = lista.filter(function (x) { return MALOS.test(x.texto) && !esQuerido(x); });
      var resto = lista.filter(function (x) { return fuera.indexOf(x) < 0 && !esQuerido(x) && ORDEN[x.label]; })
        .sort(function (a, b) { return ORDEN[a.label] - ORDEN[b.label]; });
      // hacer espacio: quitar de "resto" lo justo; si no alcanza, se ponen menos nuevos
      while (lista.length - fuera.length + nuevos.length > LIMITE[tipo] && resto.length) fuera.push(resto.shift());
      while (lista.length - fuera.length + nuevos.length > LIMITE[tipo] && nuevos.length) nuevos.pop();
      fuera.forEach(function (x) { quitar.push({ tipo: tipo, x: x }); });
      nuevos.forEach(function (t) { poner.push({ tipo: tipo, t: t }); });
    });
    if (!quitar.length && !poner.length) { Logger.log('    Ya esta limpio. Nada que cambiar.'); return; }
    var ops = [], txt = [];
    quitar.forEach(function (q) { ops.push({ assetGroupAssetOperation: { remove: q.x.rn } }); txt.push('quitar "' + q.x.texto + '"' + (MALOS.test(q.x.texto) ? '' : ' (Google lo califica ' + q.x.label + ', para hacer espacio)')); });
    poner.forEach(function (p) {
      if (!creados[p.t]) { creados[p.t] = tmp(cid); ops.push({ assetOperation: { create: { resourceName: creados[p.t], textAsset: { text: p.t } } } }); txt.push(null); }
      ops.push({ assetGroupAssetOperation: { create: { assetGroup: grn, asset: creados[p.t], fieldType: p.tipo } } }); txt.push('poner "' + p.t + '"');
    });
    var res = null;
    try { res = AdsApp.mutateAll(ops); } catch (e) { Logger.log('    ERROR: ' + e.message); }
    var bien = !!res;
    if (res) res.forEach(function (r) { if (!r.isSuccessful()) bien = false; });
    if (!bien) {
      if (res) res.forEach(function (r, i) { if (!r.isSuccessful() && r.getErrorMessages().length) Logger.log('    ERROR ' + (txt[i] || 'crear texto') + ': ' + msg(r)); });
      Logger.log('    No se cambio nada en este grupo (todo o nada): sigue igual.');
      return;
    }
    res.forEach(function (r, i) {
      if (txt[i] === null) return;
      Logger.log('    ' + (vista ? 'se puede: ' : 'LISTO: ') + txt[i]);
      if (vista) return;
      var o = ops[i].assetGroupAssetOperation;
      if (o && o.create) quitarL.push("{n: 'pmax', rn: '" + r.getResourceName() + "'}");
    });
    if (!vista) quitar.forEach(function (q) { ponerL.push("{n: 'pmax', t: '" + grn + "', a: '" + q.x.asset + "', f: '" + q.tipo + "'}"); });
    // los textos creados en este grupo ya existen: los siguientes grupos los reusan
    if (!vista) res.forEach(function (r, i) { var a = ops[i].assetOperation; if (a && a.create) creados[a.create.textAsset.text] = r.getResourceName(); });
  });
}

function deshacer(vista) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    (d.quitar || []).forEach(function (q) {
      ops.push(q.n === 'pmax' ? { assetGroupAssetOperation: { remove: q.rn } } : { campaignAssetOperation: { remove: q.rn } }); txt.push('quitar lo nuevo (' + q.n + ')');
    });
    (d.poner || []).forEach(function (p) {
      ops.push(p.n === 'pmax' ? { assetGroupAssetOperation: { create: { assetGroup: p.t, asset: p.a, fieldType: p.f } } }
        : { campaignAssetOperation: { create: { campaign: p.t, asset: p.a, fieldType: p.f } } });
      txt.push('volver a poner lo viejo (' + p.f + ')');
    });
  });
  if (!ops.length) { Logger.log('Nada que deshacer.'); return; }
  // Todo o nada: primero quita lo nuevo (para dejar espacio) y luego vuelve a poner lo viejo
  var res = AdsApp.mutateAll(ops);
  res.forEach(function (r, i) { Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + txt[i] + (r.isSuccessful() ? '' : ': ' + msg(r))); });
}
