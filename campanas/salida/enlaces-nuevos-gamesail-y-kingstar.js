// ENLACES QUE YA NO SIRVEN - Gamesail y Kingstar (23 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR (o dentro de cada cuenta: entonces solo cambia esa).
// POR QUE: el 18-21 nov cambiaron las paginas (nota de Rodolfo del 22-nov):
//   Gamesail: #tamanos y #modelos ya no existen (abren la portada arriba).
//   Kingstar: "12 Modelos" lleva a #modelos, que ya no muestra la tabla de 12 modelos.
// QUE HACE (solo enlaces de sitio a nivel de cuenta):
//   1. Crea el enlace nuevo, revisando antes que la seccion exista en la pagina.
//   2. Solo si el nuevo quedo bien puesto, quita el viejo de la cuenta (el recurso no se borra).
//   No toca anuncios, palabras, presupuestos ni pujas.
// VISTA PREVIA: muestra que haria. EJECUTAR (con el OK): hace el cambio.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar.

var CAMBIOS = {
  '118-347-6484': { nombre: 'Gamesail', cambios: [
    { viejo: 'https://gamesail.mx/#tamanos', texto: 'Nuestros Equipos', d1: 'Lavadoras y secadoras', d2: 'Pide tu cotizaci\u00f3n', url: 'https://gamesail.mx/#equipos' },
    { viejo: 'https://gamesail.mx/#modelos', texto: 'Ver Capacidades', d1: 'Elige la capacidad ideal', d2: 'Te ayudamos a elegir', url: 'https://gamesail.mx/#capacidades' }
  ] },
  '993-525-8739': { nombre: 'Kingstar', cambios: [
    { viejo: 'https://clmmexico.com/#modelos', texto: 'Secadoras a Gas', d1: 'De 15 a 100 kg', d2: 'Solicita tu cotizaci\u00f3n', url: 'https://clmmexico.com/#secadoras' }
  ] }
};
var DESHACER = [];

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview(), salida = [];
  Logger.log('ENLACES NUEVOS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(Object.keys(CAMBIOS)).get();
    while (it.hasNext()) {
      var a = it.next(); AdsManagerApp.select(a);
      try { salida = salida.concat(DESHACER.length ? deshacer(a.getCustomerId(), vista) : cuenta(a.getCustomerId(), vista)); }
      catch (e) { Logger.log('  ERROR: ' + e.message); }
      Logger.log('');
    }
  } else {
    // Pegado dentro de una sola cuenta: solo trabaja en esa cuenta.
    var cidG = AdsApp.currentAccount().getCustomerId();
    if (!CAMBIOS[cidG]) { Logger.log('Esta cuenta (' + cidG + ') no esta en la lista. No se hizo nada.'); return; }
    salida = DESHACER.length ? deshacer(cidG, vista) : cuenta(cidG, vista);
  }
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
var paginas = {};
function seccionExiste(url) {
  var base = url.split('#')[0], ancla = url.split('#')[1];
  if (!(base in paginas)) {
    try { var r = UrlFetchApp.fetch(base, { muteHttpExceptions: true, followRedirects: true });
      paginas[base] = r.getResponseCode() === 200 ? r.getContentText() : ''; } catch (e) { paginas[base] = ''; }
  }
  return paginas[base] !== '' && (!ancla || paginas[base].indexOf('id="' + ancla + '"') >= 0);
}

function cuenta(cidG, vista) {
  var info = CAMBIOS[cidG], cid = cidG.replace(/-/g, '');
  Logger.log('==== ' + info.nombre + ' (' + cidG + ') ====');
  if (!vista) {
    var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    if (leer("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20").length) {
      Logger.log('  ALTO: ya hubo un cambio HOY en ' + info.nombre + '. No se aplico nada.'); return [];
    }
  }
  var links = leer("SELECT customer_asset.resource_name, asset.resource_name, asset.final_urls, asset.sitelink_asset.link_text FROM customer_asset " +
    "WHERE customer_asset.status = 'ENABLED' AND customer_asset.field_type = 'SITELINK'");
  var salida = [], n = 0;
  info.cambios.forEach(function (c) {
    var viejos = links.filter(function (r) { return ((r.asset || {}).finalUrls || [])[0] === c.viejo; });
    Logger.log('  > "' + c.texto + '" -> ' + c.url);
    if (!viejos.length) { Logger.log('     No encontre el enlace viejo (' + c.viejo + '). No se toca.'); return; }
    if (!seccionExiste(c.url)) { Logger.log('     La seccion nueva no existe en la pagina. No se toca.'); return; }
    n++;
    var tmp = 'customers/' + cid + '/assets/-' + n;
    var res = AdsApp.mutateAll([
      { assetOperation: { create: { resourceName: tmp, finalUrls: [c.url], sitelinkAsset: { linkText: c.texto, description1: c.d1, description2: c.d2 } } } },
      { customerAssetOperation: { create: { asset: tmp, fieldType: 'SITELINK' } } }
    ], { partialFailure: true });
    if (!res[0].isSuccessful() || !res[1].isSuccessful()) {
      Logger.log('     ERROR al crear: ' + res[0].getErrorMessages().concat(res[1].getErrorMessages()).join('; ') + ' (el viejo se queda)'); return;
    }
    Logger.log('     ' + (vista ? 'se puede crear' : 'LISTO: creado') + ' el nuevo.');
    var nuevo = vista ? '' : res[1].getResourceName();
    var res2 = AdsApp.mutateAll(viejos.map(function (v) { return { customerAssetOperation: { remove: v.customerAsset.resourceName } }; }), { partialFailure: true });
    res2.forEach(function (r, i) {
      var v = viejos[i];
      Logger.log('     ' + (r.isSuccessful() ? (vista ? 'se puede quitar' : 'LISTO: quitado') : 'ERROR al quitar') + ' el viejo "' + v.asset.sitelinkAsset.linkText + '"' +
        (r.isSuccessful() ? '' : ': ' + r.getErrorMessages().join('; ')));
      if (!vista && r.isSuccessful()) salida.push("{c: '" + cidG + "', quitar: '" + nuevo + "', poner: '" + v.asset.resourceName + "'}");
    });
  });
  return salida;
}

function deshacer(cidG, vista) {
  Logger.log('==== ' + CAMBIOS[cidG].nombre + ' (' + cidG + ') ====');
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.c !== cidG) return;
    ops.push({ customerAssetOperation: { create: { asset: d.poner, fieldType: 'SITELINK' } } }); txt.push('volver a poner el viejo');
    if (d.quitar) { ops.push({ customerAssetOperation: { remove: d.quitar } }); txt.push('quitar el nuevo'); }
  });
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return []; }
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + txt[i] + (r.isSuccessful() ? '' : ': ' + r.getErrorMessages().join('; ')));
  });
  return [];
}
