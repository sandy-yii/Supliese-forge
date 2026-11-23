// TEXTOS DESTACADOS Y FRAGMENTOS QUE FALTAN - Laundry Solutions, Gamesail y Girbau (23 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR.
// POR QUE: los anuncios salen mas grandes y con mas razones para escribir cuando tienen textos destacados
//   ("Certificaci\u00f3n ISO 9001", "Cotiza por WhatsApp"...) y fragmentos (lista de servicios o equipos).
//   Gamesail solo los tiene en 3 grupos de Marca y Competencia; Girbau no los tiene en sus campanas de busqueda;
//   Laundry Solutions no tiene fragmentos.
// QUE HACE: SOLO AGREGA, a nivel de cuenta. No quita, no pausa y no edita nada.
//   Si una campana o grupo ya tiene sus propios textos destacados, Google sigue usando los suyos.
//   Todos los textos salen de lo que dice hoy cada pagina (sin precios, sin "garant\u00eda" ni "ahorro").
// HOY: solo corre en las cuentas de la lista HOY (un cambio por cuenta al dia).
// VISTA PREVIA: muestra que agregaria. EJECUTAR (con el OK): lo agrega.
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: quita lo que se agrego.

var HOY = ['265-909-2662'];

var CAMBIOS = {
  '265-909-2662': { nombre: 'Laundry Solutions',
    destacados: ['Certificaci\u00f3n ISO 9001', 'P\u00f3lizas de mantenimiento', 'Refacciones originales'],
    fragmento: { header: 'Servicios', values: ['Puesta en marcha', 'Instalaci\u00f3n', 'Mantenimiento preventivo', 'Reparaci\u00f3n', 'Refacciones originales'] } },
  '118-347-6484': { nombre: 'Gamesail',
    destacados: ['Certificaci\u00f3n ISO 9001', 'Cotiza por WhatsApp', 'Cotiza varios equipos', 'Oficinas en GDL y CDMX', 'Hoteles y hospitales', 'Lavadoras desde 17 kg'],
    fragmento: { header: 'Tipos', values: ['Lavadoras industriales', 'Secadoras industriales', 'Barrera sanitaria', 'Mangles planchadores', 'Centrifugadoras'] } },
  '860-582-6837': { nombre: 'Girbau',
    destacados: ['Distribuidor exclusivo', 'Certificaci\u00f3n ISO 9001', 'Cotiza por WhatsApp', 'Lavadoras de 9 a 32 kg', 'Secadoras y planchadoras', 'Oficinas en GDL y CDMX'],
    fragmento: { header: 'Modelos', values: ['Serie GS', 'Serie RMS', 'Secadoras ED', 'Planchadoras PB', 'Barrera sanitaria BW'] } }
};
var DESHACER = [];

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview(), salida = [];
  Logger.log('TEXTOS DESTACADOS Y FRAGMENTOS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var ids = DESHACER.length ? DESHACER.map(function (d) { return d.c; }) : HOY;
  ids = ids.filter(function (id) { return CAMBIOS[id]; });
  if (!ids.length) { Logger.log('No hay cuentas para hoy. No se hizo nada.'); return; }
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get();
    while (it.hasNext()) {
      var a = it.next(); AdsManagerApp.select(a);
      try { salida = salida.concat(DESHACER.length ? deshacer(a.getCustomerId(), vista) : cuenta(a.getCustomerId(), vista)); }
      catch (e) { Logger.log('  ERROR: ' + e.message); }
      Logger.log('');
    }
  } else {
    // Pegado dentro de una sola cuenta: solo trabaja en esa cuenta, y solo si le toca hoy.
    var cidG = AdsApp.currentAccount().getCustomerId();
    if (ids.indexOf(cidG) < 0) { Logger.log('Esta cuenta (' + cidG + ') no toca hoy. No se hizo nada.'); return; }
    salida = DESHACER.length ? deshacer(cidG, vista) : cuenta(cidG, vista);
  }
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }

function cuenta(cidG, vista) {
  var info = CAMBIOS[cidG], cid = cidG.replace(/-/g, '');
  Logger.log('==== ' + info.nombre + ' (' + cidG + ') ====');
  if (!vista) {
    var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    if (leer("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20").length) {
      Logger.log('  ALTO: ya hubo un cambio HOY en ' + info.nombre + '. No se aplico nada. Avisame.'); return [];
    }
  }
  var ya = leer("SELECT customer_asset.field_type, asset.callout_asset.callout_text, asset.structured_snippet_asset.header FROM customer_asset " +
    "WHERE customer_asset.status = 'ENABLED' AND customer_asset.field_type IN ('CALLOUT', 'STRUCTURED_SNIPPET')");
  var textos = {}, headers = {};
  ya.forEach(function (r) {
    var a = r.asset || {};
    if (a.calloutAsset) textos[String(a.calloutAsset.calloutText).toLowerCase()] = 1;
    if (a.structuredSnippetAsset) headers[String(a.structuredSnippetAsset.header).toLowerCase()] = 1;
  });
  var ops = [], txt = [], n = 0;
  info.destacados.forEach(function (t) {
    if (textos[t.toLowerCase()]) { Logger.log('  Ya estaba: "' + t + '"'); return; }
    n++; var tmp = 'customers/' + cid + '/assets/-' + n;
    ops.push({ assetOperation: { create: { resourceName: tmp, calloutAsset: { calloutText: t } } } }); txt.push('texto destacado "' + t + '"');
    ops.push({ customerAssetOperation: { create: { asset: tmp, fieldType: 'CALLOUT' } } }); txt.push('');
  });
  var f = info.fragmento;
  if (f) {
    if (headers[f.header.toLowerCase()]) Logger.log('  Ya habia un fragmento "' + f.header + '". No se agrega otro.');
    else {
      n++; var tmpF = 'customers/' + cid + '/assets/-' + n;
      ops.push({ assetOperation: { create: { resourceName: tmpF, structuredSnippetAsset: { header: f.header, values: f.values } } } });
      txt.push('fragmento ' + f.header + ': ' + f.values.join(', '));
      ops.push({ customerAssetOperation: { create: { asset: tmpF, fieldType: 'STRUCTURED_SNIPPET' } } }); txt.push('');
    }
  }
  if (!ops.length) { Logger.log('  Nada que agregar.'); return []; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true }), quitar = [];
  for (var i = 0; i < res.length; i += 2) {
    var ok = res[i].isSuccessful() && res[i + 1].isSuccessful();
    if (ok) {
      Logger.log('  ' + (vista ? 'se puede agregar ' : 'LISTO: agregado ') + txt[i]);
      if (!vista) quitar.push("'" + res[i + 1].getResourceName() + "'");
    } else {
      Logger.log('  ERROR ' + txt[i] + ': ' + res[i].getErrorMessages().concat(res[i + 1].getErrorMessages()).join('; '));
    }
  }
  if (vista || !quitar.length) return [];
  return ["{c: '" + cidG + "', quitar: [" + quitar.join(', ') + "]}"];
}

function deshacer(cidG, vista) {
  Logger.log('==== ' + CAMBIOS[cidG].nombre + ' (' + cidG + ') ====');
  var ops = [];
  DESHACER.forEach(function (d) { if (d.c === cidG) (d.quitar || []).forEach(function (rn) { ops.push({ customerAssetOperation: { remove: rn } }); }); });
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return []; }
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r) {
    Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede quitar' : 'LISTO: quitado') : 'ERROR: ' + r.getErrorMessages().join('; ')));
  });
  return [];
}
