// TODO EN UNO - las 5 cuentas (23 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR (la que ve las 5 cuentas). Un solo script, una sola corrida.
// Excepcion autorizada por Sandy el 23-nov: hoy va todo lo que AGREGA, en las 5 cuentas a la vez.
// NO toca presupuestos, topes ni pujas. NO pausa nada. Solo quita lo que se reemplaza en el mismo paso.
//
// QUE HACE, por cuenta:
//   Girbau:        1) Telefono y WhatsApp nuevos (33 5109 5680, Teresa)  2) Textos destacados y fragmento de modelos
//                  3) Textos nuevos en Maximo rendimiento (sin "precio"; los viejos se quitan el jueves)
//   Quick Laundry: 1) Telefono y WhatsApp nuevos (33 2806 8994, Eduardo)
//   Gamesail:      1) Enlaces nuevos (#equipos y #capacidades)  2) Textos destacados y fragmento de equipos
//                  3) Anuncios NUEVOS al lado de los viejos: secadoras de 15 a 100 kg y sin "precios" (los viejos siguen)
//   Kingstar:      1) Enlace nuevo de secadoras (#secadoras)  2) Anuncio NUEVO de secadoras de 15 a 100 kg al lado del viejo
//   Laundry Sol.:  1) Textos destacados y fragmento de servicios
// Cada parte va por separado: si una falla, las demas siguen, y lo viejo se queda puesto.
// VISTA PREVIA: muestra todo lo que haria. No cambia nada.
// EJECUTAR (con el OK): lo hace. Google revisa lo nuevo (normalmente unas horas).
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: quita lo nuevo y vuelve a poner lo viejo.

var CUENTAS = {
  '860-582-6837': 'Girbau',
  '256-397-2201': 'Quick Laundry',
  '118-347-6484': 'Gamesail',
  '993-525-8739': 'Kingstar',
  '265-909-2662': 'Laundry Solutions'
};

var TELEFONOS = {
  '860-582-6837': { viejo: '3328068994', nuevo: '33 5109 5680' },
  '256-397-2201': { viejo: '3326012237', nuevo: '33 2806 8994' }
};

var ENLACES = {
  '118-347-6484': [
    { viejo: 'https://gamesail.mx/#tamanos', texto: 'Nuestros Equipos', d1: 'Lavadoras y secadoras', d2: 'Pide tu cotizaci\u00f3n', url: 'https://gamesail.mx/#equipos' },
    { viejo: 'https://gamesail.mx/#modelos', texto: 'Ver Capacidades', d1: 'Elige la capacidad ideal', d2: 'Te ayudamos a elegir', url: 'https://gamesail.mx/#capacidades' }
  ],
  '993-525-8739': [
    { viejo: 'https://clmmexico.com/#modelos', texto: 'Secadoras a Gas', d1: 'De 15 a 100 kg', d2: 'Solicita tu cotizaci\u00f3n', url: 'https://clmmexico.com/#secadoras' }
  ]
};

var DESTACADOS = {
  '265-909-2662': { textos: ['Certificaci\u00f3n ISO 9001', 'P\u00f3lizas de mantenimiento', 'Refacciones originales'],
    fragmento: { header: 'Servicios', values: ['Puesta en marcha', 'Instalaci\u00f3n', 'Mantenimiento preventivo', 'Reparaci\u00f3n', 'Refacciones originales'] } },
  '118-347-6484': { textos: ['Certificaci\u00f3n ISO 9001', 'Cotiza por WhatsApp', 'Cotiza varios equipos', 'Oficinas en GDL y CDMX', 'Hoteles y hospitales', 'Lavadoras desde 17 kg'],
    fragmento: { header: 'Tipos', values: ['Lavadoras industriales', 'Secadoras industriales', 'Barrera sanitaria', 'Mangles planchadores', 'Centrifugadoras'] } },
  '860-582-6837': { textos: ['Distribuidor exclusivo', 'Certificaci\u00f3n ISO 9001', 'Cotiza por WhatsApp', 'Lavadoras de 9 a 32 kg', 'Secadoras y planchadoras', 'Oficinas en GDL y CDMX'],
    fragmento: { header: 'Modelos', values: ['Serie GS', 'Serie RMS', 'Secadoras ED', 'Planchadoras PB', 'Barrera sanitaria BW'] } }
};

// Anuncios: se copia el anuncio que tiene textos que ya no coinciden con la pagina, con estos cambios. El viejo no se toca.
var ANUNCIOS = ['118-347-6484', '993-525-8739'];
var CAMBIAR_TITULO = {
  'Secadora Industrial 130 kg': 'Secadora Industrial El\u00e9ctrica',
  'Secadora Industrial 200 kg': 'Secadora a Gas Industrial',
  'Secadoras de 100 a 200 kg': 'Secadoras de 15 a 100 kg',
  'Precios de Lavadoras': 'Cotiza por WhatsApp'
};
var CAMBIAR_TEXTO = [
  [/de 50 a 200 kg/gi, 'de 15 a 100 kg'],
  [/de 50, 100, 130 y 200 kg/gi, 'de 15 a 100 kg'],
  [/ Pide precio\./g, ' Cotiza hoy.'],
  [/ Pide el precio hoy\./g, ' Pide tu cotizaci\u00f3n hoy.'],
  [/ y recibe precio por equipo\./g, '. Te respondemos por WhatsApp.'],
  [/compara precio y capacidad/g, 'compara capacidad']
];

// Maximo rendimiento de Girbau: se AGREGAN estos textos a cada grupo de recursos (los de "precio" se quitan el jueves)
var PMAX = {
  '860-582-6837': {
    titulos: ['Pide Tu Cotizaci\u00f3n Girbau', 'Distribuidor Exclusivo Girbau', 'Cotiza Por WhatsApp'],
    descripcion: {
      'T\u00fanel De Lavado Industrial': 'T\u00fanel De Lavado Girbau Para Grandes Capacidades, Con Sus Complementos. Pide Tu Cotizaci\u00f3n.',
      'Secadora Industrial': 'Secadoras Girbau De 13 A 62 Kg, A Gas, Electricidad O Vapor. Pide Tu Cotizaci\u00f3n Hoy.',
      'Mangles': 'Planchadoras De Rodillos Girbau De 1.50 A 3.20 m, A Gas, Electricidad O Vapor. Cotiza Hoy.',
      'Barreras sanitarias': 'Lavadoras De Barrera Sanitaria Girbau De 16 A 200 Kg. Pide Tu Cotizaci\u00f3n Por WhatsApp.',
      '*': 'Lavadoras Girbau De 9 A 32 Kg, Secadoras Y Planchadoras. Pide Tu Cotizaci\u00f3n Por WhatsApp.'
    }
  }
};

var DESHACER = [];

// ---------------------------------------------------------------------------------------------------------------
var tmpN = 0;
function tmp(cid) { tmpN++; return 'customers/' + cid + '/assets/-' + tmpN; }
function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function msg(r) { return r.getErrorMessages().join('; '); }

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview(), salida = [];
  Logger.log('TODO EN UNO' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var ids = Object.keys(CUENTAS);
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get();
    while (it.hasNext()) { var a = it.next(); AdsManagerApp.select(a); salida = salida.concat(unaCuenta(a.getCustomerId(), vista)); }
  } else {
    var cidG = AdsApp.currentAccount().getCustomerId();
    if (!CUENTAS[cidG]) { Logger.log('Esta cuenta no esta en la lista. Pegalo en la cuenta de administrador.'); return; }
    Logger.log('OJO: esta pegado dentro de una sola cuenta; solo se trabaja ' + CUENTAS[cidG] + '. Para las 5, pegalo en la de administrador.');
    salida = unaCuenta(cidG, vista);
  }
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function unaCuenta(cidG, vista) {
  var cid = cidG.replace(/-/g, '');
  Logger.log('==================== ' + CUENTAS[cidG] + ' (' + cidG + ') ====================');
  if (DESHACER.length) { try { deshacer(cidG, vista); } catch (e) { Logger.log('  ERROR: ' + e.message); } Logger.log(''); return []; }
  var u = { quitar: [], poner: [] };
  var partes = [
    ['TELEFONO Y WHATSAPP', TELEFONOS[cidG], telefonos],
    ['ENLACES DE SITIO', ENLACES[cidG], enlaces],
    ['TEXTOS DESTACADOS Y FRAGMENTO', DESTACADOS[cidG], destacados],
    ['ANUNCIOS NUEVOS', ANUNCIOS.indexOf(cidG) >= 0 ? true : null, anuncios],
    ['TEXTOS NUEVOS EN MAXIMO RENDIMIENTO', PMAX[cidG], pmax]
  ];
  partes.forEach(function (p) {
    if (!p[1]) return;
    Logger.log('  -- ' + p[0] + ' --');
    try { p[2](cid, p[1], vista, u); } catch (e) { Logger.log('    ERROR: ' + e.message + ' (esta parte no se aplico; lo demas sigue)'); }
  });
  Logger.log('');
  if (vista || (!u.quitar.length && !u.poner.length)) return [];
  return ["{c: '" + cidG + "', quitar: [" + u.quitar.join(', ') + "], poner: [" + u.poner.join(', ') + "]}"];
}

// ---------- enlaces entre recursos y niveles ----------
function enlace(nivel, target, asset, campo) {
  if (nivel === 'cuenta') return { customerAssetOperation: { create: { asset: asset, fieldType: campo } } };
  if (nivel === 'campana') return { campaignAssetOperation: { create: { campaign: target, asset: asset, fieldType: campo } } };
  return { adGroupAssetOperation: { create: { adGroup: target, asset: asset, fieldType: campo } } };
}
function quitar(nivel, rn) {
  if (nivel === 'cuenta') return { customerAssetOperation: { remove: rn } };
  if (nivel === 'campana') return { campaignAssetOperation: { remove: rn } };
  if (nivel === 'anuncio') return { adGroupAdOperation: { remove: rn } };
  if (nivel === 'pmax') return { assetGroupAssetOperation: { remove: rn } };
  return { adGroupAssetOperation: { remove: rn } };
}
function nivelDe(op) {
  if (op.customerAssetOperation) return 'cuenta';
  if (op.campaignAssetOperation) return 'campana';
  if (op.adGroupAdOperation) return 'anuncio';
  if (op.assetGroupAssetOperation) return 'pmax';
  return 'grupo';
}
function esCrearEnlace(op) {
  var o = op.customerAssetOperation || op.campaignAssetOperation || op.adGroupAssetOperation || op.assetGroupAssetOperation || op.adGroupAdOperation;
  return !!(o && o.create);
}
function qTxt(op, rn) { return "{n: '" + nivelDe(op) + "', rn: '" + rn + "'}"; }
function pTxt(n, t, a, f) { return "{n: '" + n + "', t: " + (t ? "'" + t + "'" : 'null') + ", a: '" + a + "', f: '" + f + "'}"; }
function ok(vista) { return vista ? 'se puede: ' : 'LISTO: '; }

// ---------- 1) telefono y WhatsApp ----------
function digitos(s) { return String(s || '').replace(/\D/g, ''); }
function esViejo(num, viejo) { var d = digitos(num); return d.length >= 10 && d.slice(-10) === viejo; }
function buscarTel(info) {
  var lugares = [];
  var sel = 'asset.resource_name, asset.call_asset.phone_number, asset.business_message_asset.starter_message, ' +
    'asset.business_message_asset.whatsapp_info.phone_number';
  function revisar(r, nivel, link, target, nombre) {
    var a = r.asset || {}, tipo = null;
    if (link.fieldType === 'CALL' && esViejo((a.callAsset || {}).phoneNumber, info.viejo)) tipo = 'CALL';
    if (link.fieldType === 'BUSINESS_MESSAGE' && esViejo(((a.businessMessageAsset || {}).whatsappInfo || {}).phoneNumber, info.viejo)) tipo = 'MSG';
    if (tipo) lugares.push({ tipo: tipo, nivel: nivel, target: target, nombre: nombre, rn: link.resourceName, asset: a.resourceName, a: a, campo: link.fieldType });
  }
  leer("SELECT customer_asset.resource_name, customer_asset.field_type, customer_asset.status, " + sel + " FROM customer_asset " +
    "WHERE customer_asset.status = 'ENABLED' AND customer_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE')").forEach(function (r) {
      revisar(r, 'cuenta', r.customerAsset, null, 'toda la cuenta');
    });
  leer("SELECT campaign.resource_name, campaign.name, campaign.status, campaign_asset.resource_name, campaign_asset.field_type, campaign_asset.status, " + sel +
    " FROM campaign_asset WHERE campaign_asset.status = 'ENABLED' AND campaign.status != 'REMOVED' " +
    "AND campaign_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE')").forEach(function (r) {
      revisar(r, 'campana', r.campaignAsset, r.campaign.resourceName, r.campaign.name + (r.campaign.status === 'PAUSED' ? ' (en pausa)' : ''));
    });
  leer("SELECT ad_group.resource_name, ad_group.name, ad_group.status, campaign.name, ad_group_asset.resource_name, ad_group_asset.field_type, ad_group_asset.status, " + sel +
    " FROM ad_group_asset WHERE ad_group_asset.status = 'ENABLED' AND ad_group.status != 'REMOVED' " +
    "AND ad_group_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE')").forEach(function (r) {
      revisar(r, 'grupo', r.adGroupAsset, r.adGroup.resourceName, r.campaign.name + ' > ' + r.adGroup.name);
    });
  return lugares;
}

function telefonos(cid, info, vista, u) {
  Logger.log('    ' + info.viejo + ' -> ' + info.nuevo);
  var lugares = buscarTel(info);
  if (!lugares.length) { Logger.log('    El numero viejo ya no esta en ningun boton. Nada que cambiar.'); return; }
  var porTipo = { CALL: [], MSG: [] };
  lugares.forEach(function (l) { porTipo[l.tipo].push(l); Logger.log('    ' + (l.tipo === 'CALL' ? 'Llamada ' : 'WhatsApp') + ' viejo en ' + l.nivel + ': ' + l.nombre); });

  // Llamada: primero se pone la nueva en los mismos lugares; solo si quedo bien se quita la vieja
  if (porTipo.CALL.length) {
    var tC = tmp(cid), vistos = {};
    var ops = [{ assetOperation: { create: { resourceName: tC, callAsset: { countryCode: 'MX', phoneNumber: info.nuevo } } } }];
    var txt = ['crear boton de llamada ' + info.nuevo];
    porTipo.CALL.forEach(function (l) {
      var k = l.nivel + '|' + l.target; if (vistos[k]) return; vistos[k] = 1;
      ops.push(enlace(l.nivel, l.target, tC, l.campo)); txt.push('  ponerlo en ' + l.nivel + ': ' + l.nombre);
    });
    var res = AdsApp.mutateAll(ops, { partialFailure: true }), okCall = true;
    for (var i = 0; i < res.length; i++) {
      if (!res[i].isSuccessful()) { okCall = false; Logger.log('    ERROR ' + txt[i] + ': ' + msg(res[i])); }
      else { Logger.log('    ' + ok(vista) + txt[i]); if (!vista && i > 0) u.quitar.push(qTxt(ops[i], res[i].getResourceName())); }
    }
    if (!okCall) Logger.log('    El boton de llamada nuevo no quedo completo: el viejo se queda puesto.');
    else {
      var res2 = AdsApp.mutateAll(porTipo.CALL.map(function (l) { return quitar(l.nivel, l.rn); }), { partialFailure: true });
      for (var j = 0; j < res2.length; j++) {
        var l2 = porTipo.CALL[j];
        Logger.log('    ' + (res2[j].isSuccessful() ? ok(vista) : 'ERROR ') + 'quitar llamada vieja de ' + l2.nivel + ': ' + l2.nombre + (res2[j].isSuccessful() ? '' : ': ' + msg(res2[j])));
        if (!vista && res2[j].isSuccessful()) u.poner.push(pTxt(l2.nivel, l2.target, l2.asset, l2.campo));
      }
    }
  }

  // WhatsApp: Google admite uno solo por lugar, asi que va en UN paso, todo o nada
  if (porTipo.MSG.length) {
    var b = porTipo.MSG[0].a.businessMessageAsset || {}, tM = tmp(cid), vistosM = {};
    var opsM = [{ assetOperation: { create: { resourceName: tM, businessMessageAsset: { messageProvider: 'WHATSAPP',
      starterMessage: b.starterMessage || 'Hola, quiero una cotizaci\u00f3n', whatsappInfo: { countryCode: 'MX', phoneNumber: info.nuevo } } } } }];
    var txtM = ['crear WhatsApp ' + info.nuevo];
    porTipo.MSG.forEach(function (l) { opsM.push(quitar(l.nivel, l.rn)); txtM.push('  quitar el WhatsApp viejo de ' + l.nivel + ': ' + l.nombre); });
    porTipo.MSG.forEach(function (l) {
      var k = l.nivel + '|' + l.target; if (vistosM[k]) return; vistosM[k] = 1;
      opsM.push(enlace(l.nivel, l.target, tM, l.campo)); txtM.push('  poner el WhatsApp nuevo en ' + l.nivel + ': ' + l.nombre);
    });
    var resM = null;
    try { resM = AdsApp.mutateAll(opsM); } catch (e) { Logger.log('    ERROR WhatsApp: ' + e.message); }
    var okM = !!resM;
    if (resM) for (var m = 0; m < resM.length; m++) if (!resM[m].isSuccessful()) okM = false;
    if (!okM) {
      if (resM) for (var m2 = 0; m2 < resM.length; m2++)
        if (!resM[m2].isSuccessful() && resM[m2].getErrorMessages().length) Logger.log('    ERROR ' + txtM[m2] + ': ' + msg(resM[m2]));
      Logger.log('    No se cambio nada del WhatsApp (todo o nada): el viejo sigue puesto.');
    } else {
      for (var m3 = 0; m3 < resM.length; m3++) {
        Logger.log('    ' + ok(vista) + txtM[m3]);
        if (!vista && esCrearEnlace(opsM[m3])) u.quitar.push(qTxt(opsM[m3], resM[m3].getResourceName()));
      }
      if (!vista) porTipo.MSG.forEach(function (l) { u.poner.push(pTxt(l.nivel, l.target, l.asset, l.campo)); });
    }
  }
}

// ---------- 2) enlaces de sitio ----------
var paginas = {};
function seccionExiste(url) {
  var base = url.split('#')[0], ancla = url.split('#')[1];
  if (!(base in paginas)) {
    try { var r = UrlFetchApp.fetch(base, { muteHttpExceptions: true, followRedirects: true });
      paginas[base] = r.getResponseCode() === 200 ? r.getContentText() : ''; } catch (e) { paginas[base] = ''; }
  }
  return paginas[base] !== '' && (!ancla || paginas[base].indexOf('id="' + ancla + '"') >= 0);
}
function enlaces(cid, lista, vista, u) {
  var links = leer("SELECT customer_asset.resource_name, customer_asset.status, customer_asset.field_type, asset.resource_name, asset.final_urls, asset.sitelink_asset.link_text " +
    "FROM customer_asset WHERE customer_asset.status = 'ENABLED' AND customer_asset.field_type = 'SITELINK'");
  lista.forEach(function (c) {
    var viejos = links.filter(function (r) { return ((r.asset || {}).finalUrls || [])[0] === c.viejo; });
    Logger.log('    > "' + c.texto + '" -> ' + c.url);
    if (!viejos.length) { Logger.log('      No encontre el enlace viejo (' + c.viejo + '). No se toca.'); return; }
    if (!seccionExiste(c.url)) { Logger.log('      La seccion nueva no existe en la pagina. No se toca.'); return; }
    var t = tmp(cid);
    var res = AdsApp.mutateAll([
      { assetOperation: { create: { resourceName: t, finalUrls: [c.url], sitelinkAsset: { linkText: c.texto, description1: c.d1, description2: c.d2 } } } },
      { customerAssetOperation: { create: { asset: t, fieldType: 'SITELINK' } } }
    ], { partialFailure: true });
    if (!res[0].isSuccessful() || !res[1].isSuccessful()) {
      Logger.log('      ERROR al crear: ' + res[0].getErrorMessages().concat(res[1].getErrorMessages()).join('; ') + ' (el viejo se queda)'); return;
    }
    Logger.log('      ' + ok(vista) + 'crear el nuevo');
    if (!vista) u.quitar.push("{n: 'cuenta', rn: '" + res[1].getResourceName() + "'}");
    var res2 = AdsApp.mutateAll(viejos.map(function (v) { return { customerAssetOperation: { remove: v.customerAsset.resourceName } }; }), { partialFailure: true });
    res2.forEach(function (r, i) {
      var v = viejos[i];
      Logger.log('      ' + (r.isSuccessful() ? ok(vista) : 'ERROR ') + 'quitar el viejo "' + v.asset.sitelinkAsset.linkText + '"' + (r.isSuccessful() ? '' : ': ' + msg(r)));
      if (!vista && r.isSuccessful()) u.poner.push(pTxt('cuenta', null, v.asset.resourceName, 'SITELINK'));
    });
  });
}

// ---------- 3) textos destacados y fragmento ----------
function destacados(cid, info, vista, u) {
  var ya = leer("SELECT customer_asset.field_type, customer_asset.status, asset.callout_asset.callout_text, asset.structured_snippet_asset.header FROM customer_asset " +
    "WHERE customer_asset.status = 'ENABLED' AND customer_asset.field_type IN ('CALLOUT', 'STRUCTURED_SNIPPET')");
  var textos = {}, headers = {};
  ya.forEach(function (r) {
    var a = r.asset || {};
    if (a.calloutAsset) textos[String(a.calloutAsset.calloutText).toLowerCase()] = 1;
    if (a.structuredSnippetAsset) headers[String(a.structuredSnippetAsset.header).toLowerCase()] = 1;
  });
  var ops = [], txt = [];
  info.textos.forEach(function (t) {
    if (textos[t.toLowerCase()]) { Logger.log('    Ya estaba: "' + t + '"'); return; }
    var a = tmp(cid);
    ops.push({ assetOperation: { create: { resourceName: a, calloutAsset: { calloutText: t } } } }); txt.push('texto destacado "' + t + '"');
    ops.push({ customerAssetOperation: { create: { asset: a, fieldType: 'CALLOUT' } } }); txt.push('');
  });
  var f = info.fragmento;
  if (f && headers[f.header.toLowerCase()]) Logger.log('    Ya habia un fragmento "' + f.header + '". No se agrega otro.');
  else if (f) {
    var aF = tmp(cid);
    ops.push({ assetOperation: { create: { resourceName: aF, structuredSnippetAsset: { header: f.header, values: f.values } } } });
    txt.push('fragmento ' + f.header + ': ' + f.values.join(', '));
    ops.push({ customerAssetOperation: { create: { asset: aF, fieldType: 'STRUCTURED_SNIPPET' } } }); txt.push('');
  }
  if (!ops.length) { Logger.log('    Nada que agregar.'); return; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  for (var i = 0; i < res.length; i += 2) {
    if (res[i].isSuccessful() && res[i + 1].isSuccessful()) {
      Logger.log('    ' + ok(vista) + 'agregar ' + txt[i]);
      if (!vista) u.quitar.push("{n: 'cuenta', rn: '" + res[i + 1].getResourceName() + "'}");
    } else Logger.log('    ERROR ' + txt[i] + ': ' + res[i].getErrorMessages().concat(res[i + 1].getErrorMessages()).join('; '));
  }
}

// ---------- 4) anuncios nuevos al lado de los viejos ----------
function corregir(t, esTitulo) {
  var n = esTitulo && CAMBIAR_TITULO[t] ? CAMBIAR_TITULO[t] : t;
  CAMBIAR_TEXTO.forEach(function (p) { n = n.replace(p[0], p[1]); });
  return n;
}
function anuncios(cid, x, vista, u) {
  var filas = leer("SELECT ad_group.resource_name, ad_group.name, ad_group.status, campaign.name, campaign.status, ad_group_ad.status, ad_group_ad.ad.id, " +
    "ad_group_ad.ad.final_urls, ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions, " +
    "ad_group_ad.ad.responsive_search_ad.path1, ad_group_ad.ad.responsive_search_ad.path2 FROM ad_group_ad " +
    "WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'");
  var grupos = {};
  filas.forEach(function (r) { (grupos[r.adGroup.resourceName] = grupos[r.adGroup.resourceName] || []).push(r); });
  var ops = [], txt = [];
  Object.keys(grupos).forEach(function (g) {
    var lista = grupos[g], sucio = null, limpio = false;
    lista.forEach(function (r) {
      var rsa = r.adGroupAd.ad.responsiveSearchAd || {}, cambia = false;
      (rsa.headlines || []).forEach(function (h) { if (corregir(h.text, true) !== h.text) cambia = true; });
      (rsa.descriptions || []).forEach(function (d) { if (corregir(d.text, false) !== d.text) cambia = true; });
      if (cambia) { if (!sucio) sucio = r; } else limpio = true;
    });
    if (!sucio) return;
    var nombre = sucio.campaign.name + ' > ' + sucio.adGroup.name;
    if (limpio) { Logger.log('    Ya tiene un anuncio corregido: ' + nombre + '. No se agrega otro.'); return; }
    var rsa = sucio.adGroupAd.ad.responsiveSearchAd, vistos = {}, hs = [], ds = [];
    rsa.headlines.forEach(function (h) {
      var t = corregir(h.text, true); if (vistos[t.toLowerCase()] || t.length > 30) return; vistos[t.toLowerCase()] = 1;
      var o = { text: t }; if (h.pinnedField) o.pinnedField = h.pinnedField; hs.push(o);
    });
    rsa.descriptions.forEach(function (d) {
      var t = corregir(d.text, false); if (vistos[t.toLowerCase()] || t.length > 90) return; vistos[t.toLowerCase()] = 1;
      var o = { text: t }; if (d.pinnedField) o.pinnedField = d.pinnedField; ds.push(o);
    });
    var ad = { finalUrls: sucio.adGroupAd.ad.finalUrls, responsiveSearchAd: { headlines: hs, descriptions: ds } };
    if (rsa.path1) ad.responsiveSearchAd.path1 = rsa.path1;
    if (rsa.path2) ad.responsiveSearchAd.path2 = rsa.path2;
    ops.push({ adGroupAdOperation: { create: { adGroup: g, status: 'ENABLED', ad: ad } } });
    var cambios = [];
    rsa.headlines.concat(rsa.descriptions).forEach(function (h, i) {
      var t = corregir(h.text, i < rsa.headlines.length); if (t !== h.text) cambios.push('"' + h.text + '" -> "' + t + '"');
    });
    txt.push('anuncio nuevo en ' + nombre + ' (el viejo sigue). Cambia: ' + cambios.join(' | '));
  });
  if (!ops.length) { Logger.log('    Ningun anuncio necesita cambio.'); return; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  res.forEach(function (r, i) {
    Logger.log('    ' + (r.isSuccessful() ? ok(vista) : 'ERROR ') + txt[i] + (r.isSuccessful() ? '' : ': ' + msg(r)));
    if (!vista && r.isSuccessful()) u.quitar.push("{n: 'anuncio', rn: '" + r.getResourceName() + "'}");
  });
}

// ---------- 5) textos nuevos en Maximo rendimiento ----------
function pmax(cid, info, vista, u) {
  var grupos = {};
  leer("SELECT asset_group.resource_name, asset_group.name, asset_group.status, campaign.status FROM asset_group " +
    "WHERE asset_group.status = 'ENABLED' AND campaign.status = 'ENABLED'").forEach(function (r) {
      grupos[r.assetGroup.resourceName] = { nombre: r.assetGroup.name, ya: {} };
    });
  leer("SELECT asset_group.resource_name, asset_group.status, campaign.status, asset_group_asset.field_type, asset_group_asset.status, asset.text_asset.text " +
    "FROM asset_group_asset WHERE asset_group_asset.status = 'ENABLED' AND asset_group.status = 'ENABLED' AND campaign.status = 'ENABLED' " +
    "AND asset_group_asset.field_type IN ('HEADLINE', 'DESCRIPTION')").forEach(function (r) {
      var g = grupos[r.assetGroup.resourceName]; if (g && r.asset.textAsset) g.ya[r.assetGroupAsset.fieldType + '|' + r.asset.textAsset.text.toLowerCase()] = 1;
    });
  if (!Object.keys(grupos).length) { Logger.log('    No hay grupos de recursos activos.'); return; }
  var ops = [], txt = [], creados = {};
  function recurso(texto) {
    if (!creados[texto]) { creados[texto] = tmp(cid); ops.push({ assetOperation: { create: { resourceName: creados[texto], textAsset: { text: texto } } } }); txt.push(null); }
    return creados[texto];
  }
  Object.keys(grupos).forEach(function (rn) {
    var g = grupos[rn], desc = info.descripcion[g.nombre] || info.descripcion['*'];
    info.titulos.forEach(function (t) {
      if (g.ya['HEADLINE|' + t.toLowerCase()]) return;
      ops.push({ assetGroupAssetOperation: { create: { assetGroup: rn, asset: recurso(t), fieldType: 'HEADLINE' } } }); txt.push(g.nombre + ': titulo "' + t + '"');
    });
    if (!g.ya['DESCRIPTION|' + desc.toLowerCase()]) {
      ops.push({ assetGroupAssetOperation: { create: { assetGroup: rn, asset: recurso(desc), fieldType: 'DESCRIPTION' } } }); txt.push(g.nombre + ': descripcion "' + desc + '"');
    }
  });
  if (!ops.length) { Logger.log('    Ya estaban todos.'); return; }
  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  res.forEach(function (r, i) {
    if (txt[i] === null) { if (!r.isSuccessful()) Logger.log('    ERROR al crear un texto: ' + msg(r)); return; }
    Logger.log('    ' + (r.isSuccessful() ? ok(vista) + 'agregar ' : 'NO SE PUDO agregar ') + txt[i] + (r.isSuccessful() ? '' : ': ' + msg(r) + ' (el grupo sigue igual)'));
    if (!vista && r.isSuccessful()) u.quitar.push("{n: 'pmax', rn: '" + r.getResourceName() + "'}");
  });
}

// ---------- deshacer ----------
function deshacer(cidG, vista) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.c !== cidG) return;
    (d.quitar || []).forEach(function (q) { ops.push(quitar(q.n, q.rn)); txt.push('quitar lo nuevo (' + q.n + ')'); });
    (d.poner || []).forEach(function (p) { ops.push(enlace(p.n, p.t, p.a, p.f)); txt.push('volver a poner lo viejo (' + p.f + ' en ' + p.n + ')'); });
  });
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return; }
  // Todo o nada: primero quita lo nuevo y luego vuelve a poner lo viejo (el WhatsApp solo admite uno por lugar)
  var res = AdsApp.mutateAll(ops);
  for (var i = 0; i < res.length; i++)
    Logger.log('  ' + (res[i].isSuccessful() ? ok(vista) : 'ERROR ') + txt[i] + (res[i].isSuccessful() ? '' : ': ' + msg(res[i])));
}
