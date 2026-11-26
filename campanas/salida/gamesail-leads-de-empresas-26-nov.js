// GAMESAIL: MAS LEADS DE EMPRESAS (hoteles, hospitales, lavanderias) Y FOTOS DE LA CUENTA ANTERIOR - jueves 26 nov 2026
// SOLO AGREGA. No quita, no pausa, no edita anuncios que ya salen, no toca presupuestos ni topes.
//
// COMO SE USA (dos pasos, el mismo script):
//   PASO 1 - en la cuenta ANTERIOR de Gamesail (645-094-0317): pegar y dar VISTA PREVIA. Solo lee las fotos.
//            Copia la linea que empieza con "var FOTOS =" y pegala abajo, en lugar de la linea de FOTOS que esta vacia.
//            (Si tu cuenta de administrador ve las dos cuentas, puedes saltarte este paso: el script las lee solo.)
//   PASO 2 - en la cuenta NUEVA de Gamesail (118-347-6484): pegar (con FOTOS ya llenas), VISTA PREVIA, mandame el registro, y con mi OK EJECUTAR.
//
// QUE AGREGA EN LA CUENTA NUEVA:
//   1. Palabras de empresas en "AB \u00b7 Hoteles y hospitales" (lavanderia hotelera, lavanderia hospitalaria, barrera sanitaria...).
//   2. Negativas en esa campana para gente que busca empleo o cursos, no equipo.
//   3. Anuncios nuevos al lado de los que ya salen (no se editan los viejos):
//      - Hoteles y Hospitales con las capacidades que hoy dice la pagina (50 a 150 kg, barrera sanitaria 30 a 120 kg, secadoras 30 a 100 kg).
//      - "Para ropa" y "Por capacidad" con un anuncio que habla a hoteles, hospitales y lavanderias.
//   4. Las fotos de la cuenta anterior, como imagenes de la cuenta (salen en los anuncios de busqueda cuando Google las elige).
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: quita todo lo que se agrego.

var NUEVA = '118-347-6484', ANTERIOR = '645-094-0317';
var FOTOS = [];
var DESHACER = [];

var CAMPANA_EMPRESAS = 'AB \u00b7 Hoteles y hospitales';
var PALABRAS = {
  'Hoteles': ['lavadoras para hoteles', 'lavander\u00eda hotelera', 'lavander\u00eda para hotel'],
  'Hospitales': ['lavander\u00eda hospitalaria', 'lavadora barrera sanitaria', 'lavadora de barrera sanitaria', 'equipo de lavander\u00eda hospitalaria']
};
var NEGATIVAS = [['empleo', 'BROAD'], ['trabajo', 'BROAD'], ['vacantes', 'BROAD'], ['curso', 'BROAD'], ['pdf', 'BROAD'], ['manual', 'BROAD']];

var ANUNCIOS = [
  { campana: 'AB \u00b7 Hoteles y hospitales', grupo: 'Hoteles', url: 'https://gamesail.mx/hoteles-y-hospitales',
    titulos: ['Lavadoras para Hoteles', 'Lavadoras de 50 a 150 kg', 'Secadoras de 30 a 100 kg', 'Lavander\u00eda de Hotel',
      'S\u00e1banas, Toallas y Blancos', 'Secadoras a Gas o Vapor', 'Montaje Suave, Acero Inox.', 'Certificaci\u00f3n ISO 9001',
      'Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'Lavadora Industrial Hotel', 'Equipo Gamesail'],
    descripciones: ['Lavadoras de montaje suave de 50 a 150 kg y secadoras de 30 a 100 kg para tu hotel.',
      'Para s\u00e1banas, toallas y blancos todos los d\u00edas. Cotiza por WhatsApp con un asesor.',
      'Te ayudamos a elegir la capacidad seg\u00fan la ropa que lava tu hotel al d\u00eda.',
      'Cotizamos equipo, capacidad y cantidad. Te contestamos por WhatsApp o tel\u00e9fono.'] },
  { campana: 'AB \u00b7 Hoteles y hospitales', grupo: 'Hospitales', url: 'https://gamesail.mx/hoteles-y-hospitales',
    titulos: ['Lavadoras para Hospitales', 'Lavadora Barrera Sanitaria', 'Barrera Sanitaria 30-120 kg', 'Lavander\u00eda Hospitalaria',
      'Secadoras de 30 a 100 kg', 'Para S\u00e1banas y Batas', 'Certificaci\u00f3n ISO 9001', 'Cotiza por WhatsApp',
      'Te Ayudamos a Elegir', 'Para Cl\u00ednicas y Hospitales', 'Equipo Gamesail'],
    descripciones: ['Lavadoras de barrera sanitaria de 30 a 120 kg para la lavander\u00eda de tu hospital.',
      'Tambi\u00e9n para lavander\u00edas que dan servicio a hospitales y cl\u00ednicas. Cotiza hoy.',
      'Secadoras de 30 a 100 kg, a gas o a vapor, para s\u00e1banas, batas y blancos.',
      'Te contestamos por WhatsApp o tel\u00e9fono en horario h\u00e1bil. Pide tu cotizaci\u00f3n.'] },
  { campana: 'AB \u00b7 Lavadoras para ropa y s\u00e1banas', grupo: 'Lavadoras industriales para ropa', url: 'https://gamesail.mx/lavadoras-para-ropa',
    titulos: ['Lavadoras Industriales', 'Para Hoteles y Hospitales', 'Para Lavander\u00edas Industriales', 'De 17 a 150 kg',
      'Montaje Suave, Acero Inox.', 'Lavadora y Secadora Juntas', 'Certificaci\u00f3n ISO 9001', 'Cotiza por WhatsApp',
      'Te Ayudamos a Elegir', 'Para Restaurantes e Industria', 'Equipo para Tu Negocio', 'Lavadora Industrial de Ropa'],
    descripciones: ['Lavadoras de montaje suave de 17 a 150 kg para hoteles, hospitales y lavander\u00edas.',
      'Lavan s\u00e1banas, toallas y blancos todos los d\u00edas. Cotiza lavadora y secadora juntas.',
      'Cu\u00e9ntanos cu\u00e1nta ropa lavas al d\u00eda y te ayudamos a elegir capacidad y cantidad.',
      'Te contestamos por WhatsApp o tel\u00e9fono en horario h\u00e1bil. Certificaci\u00f3n ISO 9001.'] },
  { campana: 'AB \u00b7 Lavadoras por capacidad y precio', grupo: 'Lavadoras por capacidad', url: 'https://gamesail.mx/lavadoras-por-capacidad',
    titulos: ['Lavadoras Industriales', 'Lavadoras de 20, 30 y 50 kg', 'De 17 a 150 kg', 'Para Hoteles y Hospitales',
      'Para Lavander\u00edas Industriales', 'Elige la Capacidad', 'Montaje Suave, Acero Inox.', 'Certificaci\u00f3n ISO 9001',
      'Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'Equipo para Tu Negocio', 'Barrera Sanitaria'],
    descripciones: ['Lavadoras de montaje suave de 17 a 150 kg para hoteles, hospitales y lavander\u00edas.',
      'Cu\u00e9ntanos cu\u00e1nta ropa lavas al d\u00eda y te ayudamos a elegir capacidad y cantidad.',
      'El precio depende de la capacidad y del modelo: te lo damos por WhatsApp.',
      'Te contestamos por WhatsApp o tel\u00e9fono en horario h\u00e1bil. Certificaci\u00f3n ISO 9001.'] }
];
var MAX_FOTOS = 20;

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function q(s) { return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }
function msg(r) { return r.getErrorMessages().join('; '); }

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('GAMESAIL: LEADS DE EMPRESAS Y FOTOS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var mcc = typeof AdsManagerApp !== 'undefined';
  var cid = mcc ? null : AdsApp.currentAccount().getCustomerId();
  if (!mcc && cid === ANTERIOR) { listarFotos(); return; }
  if (mcc) {
    if (!FOTOS.length && !DESHACER.length) {
      var itA = AdsManagerApp.accounts().withIds([ANTERIOR]).get();
      if (itA.hasNext()) { AdsManagerApp.select(itA.next()); FOTOS = leerFotos(); Logger.log('Le\u00ed ' + FOTOS.length + ' fotos de la cuenta anterior.'); Logger.log(''); }
      else Logger.log('La cuenta anterior no est\u00e1 en tu administrador: las fotos se agregan con el PASO 1 (ver arriba). Lo dem\u00e1s s\u00ed se hace.');
    }
    var itN = AdsManagerApp.accounts().withIds([NUEVA]).get();
    if (!itN.hasNext()) { Logger.log('No encontr\u00e9 la cuenta nueva de Gamesail en tu administrador. No se hizo nada.'); return; }
    AdsManagerApp.select(itN.next());
  } else if (cid !== NUEVA) { Logger.log('Esta cuenta (' + cid + ') no es de Gamesail. No se hizo nada.'); return; }

  if (DESHACER.length) { deshacer(vista); return; }
  var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  if (!vista && leer("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
    " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20").length) {
    Logger.log('ALTO: ya hubo un cambio HOY en Gamesail. No se aplic\u00f3 nada. Av\u00edsame.'); return;
  }
  var cidN = NUEVA.replace(/-/g, ''), quitar = [];
  quitar = quitar.concat(palabras(vista)).concat(negativas(vista)).concat(anuncios(vista)).concat(fotos(cidN, vista));
  if (!vista && quitar.length) Logger.log('PARA DESHACER: var DESHACER = [' + quitar.map(function (r) { return "'" + r + "'"; }).join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambi\u00f3 nada. M\u00e1ndame el registro.' : 'FIN. M\u00e1ndame el registro.');
}

// ---------- fotos de la cuenta anterior ----------
function leerFotos() {
  var vistas = {}, out = [];
  leer("SELECT asset.name, asset.image_asset.full_size.url, asset.image_asset.full_size.width_pixels, asset.image_asset.full_size.height_pixels " +
    "FROM asset WHERE asset.type = 'IMAGE'").forEach(function (r) {
      var f = r.asset.imageAsset && r.asset.imageAsset.fullSize; if (!f || !f.url || vistas[f.url]) return;
      var w = Number(f.widthPixels), h = Number(f.heightPixels), ra = w / h, tipo = null;
      if (Math.abs(ra - 1.91) < 0.03 && w >= 600) tipo = 'horizontal';
      else if (Math.abs(ra - 1) < 0.02 && w >= 300) tipo = 'cuadrada';
      else if (Math.abs(ra - 0.8) < 0.02 && w >= 480) tipo = 'vertical';
      if (!tipo) return;
      vistas[f.url] = 1; out.push({ n: String(r.asset.name || 'foto'), u: f.url, w: w, h: h, t: tipo });
    });
  out.sort(function (a, b) { return b.w * b.h - a.w * a.h; });
  return out.slice(0, MAX_FOTOS);
}

function listarFotos() {
  Logger.log('PASO 1 - CUENTA ANTERIOR DE GAMESAIL: solo leo las fotos, no cambio nada.');
  var f = leerFotos();
  if (!f.length) { Logger.log('No encontr\u00e9 fotos con medidas que sirvan para anuncios de b\u00fasqueda (horizontales 1.91:1, cuadradas o verticales 4:5).'); return; }
  f.forEach(function (x, i) { Logger.log((i + 1) + '. ' + x.n + ' (' + x.t + ', ' + x.w + 'x' + x.h + ') ' + x.u); });
  Logger.log('');
  Logger.log('COPIA ESTA L\u00cdNEA Y P\u00c9GALA EN EL SCRIPT EN LUGAR DE LA L\u00cdNEA DE FOTOS QUE EST\u00c1 VAC\u00cdA:');
  Logger.log('var FOTOS = ' + JSON.stringify(f) + ';');
}

function fotos(cidN, vista) {
  if (!FOTOS.length) { Logger.log('4. FOTOS: no hay fotos cargadas (falta el PASO 1). Se salta.'); Logger.log(''); return []; }
  Logger.log('4. FOTOS DE LA CUENTA ANTERIOR (' + FOTOS.length + ')');
  var ya = leer("SELECT asset.name FROM customer_asset WHERE customer_asset.field_type = 'AD_IMAGE' AND customer_asset.status = 'ENABLED'");
  var nombres = {}; ya.forEach(function (r) { nombres[String(r.asset.name)] = 1; });
  var cupo = MAX_FOTOS - ya.length, out = [], n = 0;
  FOTOS.forEach(function (f, i) {
    var nombre = 'Gamesail anterior ' + (i + 1) + ' - ' + f.n;
    if (nombres[nombre]) { Logger.log('  Ya estaba: ' + nombre); return; }
    if (cupo <= 0) { Logger.log('  Sin lugar (m\u00e1ximo ' + MAX_FOTOS + ' im\u00e1genes en la cuenta): ' + nombre); return; }
    var datos;
    try { datos = Utilities.base64Encode(UrlFetchApp.fetch(f.u).getBlob().getBytes()); }
    catch (e) { Logger.log('  No pude descargar ' + nombre + ': ' + e.message); return; }
    n++; var tmp = 'customers/' + cidN + '/assets/-' + n;
    var res = AdsApp.mutateAll([
      { assetOperation: { create: { resourceName: tmp, name: nombre, type: 'IMAGE', imageAsset: { data: datos } } } },
      { customerAssetOperation: { create: { asset: tmp, fieldType: 'AD_IMAGE' } } }
    ], { partialFailure: true });
    if (res[0].isSuccessful() && res[1].isSuccessful()) {
      cupo--; Logger.log('  ' + (vista ? 'se puede agregar: ' : 'LISTO: agregada ') + nombre + ' (' + f.t + ')');
      if (!vista) out.push(res[1].getResourceName());
    } else Logger.log('  ERROR ' + nombre + ': ' + msg(res[0]) + ' ' + msg(res[1]));
  });
  Logger.log('');
  return out;
}

// ---------- palabras, negativas y anuncios ----------
function grupos() {
  var g = {};
  leer("SELECT campaign.name, campaign.resource_name, ad_group.name, ad_group.resource_name FROM ad_group WHERE campaign.status = 'ENABLED' AND ad_group.status = 'ENABLED'")
    .forEach(function (r) { g[r.campaign.name + '|' + r.adGroup.name] = { grupo: r.adGroup.resourceName, campana: r.campaign.resourceName }; });
  return g;
}

function palabras(vista) {
  Logger.log('1. PALABRAS DE EMPRESAS en "' + CAMPANA_EMPRESAS + '"');
  var g = grupos(), ya = {}, ops = [], txt = [];
  leer("SELECT ad_group.name, ad_group_criterion.keyword.text FROM ad_group_criterion WHERE campaign.name = " + q(CAMPANA_EMPRESAS) +
    " AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.status != 'REMOVED'").forEach(function (r) {
      ya[r.adGroup.name + '|' + String(r.adGroupCriterion.keyword.text).toLowerCase()] = 1;
    });
  Object.keys(PALABRAS).forEach(function (grupo) {
    var x = g[CAMPANA_EMPRESAS + '|' + grupo];
    if (!x) { Logger.log('  No encontr\u00e9 el grupo "' + grupo + '". Se salta.'); return; }
    PALABRAS[grupo].forEach(function (p) {
      if (ya[grupo + '|' + p.toLowerCase()]) { Logger.log('  Ya estaba en ' + grupo + ': "' + p + '"'); return; }
      ops.push({ adGroupCriterionOperation: { create: { adGroup: x.grupo, status: 'ENABLED', keyword: { text: p, matchType: 'PHRASE' } } } });
      txt.push(grupo + ': "' + p + '" (contiene la frase)');
    });
  });
  return aplicar(ops, txt, vista);
}

function negativas(vista) {
  Logger.log('2. NEGATIVAS en "' + CAMPANA_EMPRESAS + '" (empleo y cursos, no equipo)');
  var c = leer("SELECT campaign.resource_name FROM campaign WHERE campaign.name = " + q(CAMPANA_EMPRESAS) + " AND campaign.status = 'ENABLED'");
  if (!c.length) { Logger.log('  No encontr\u00e9 la campa\u00f1a. Se salta.'); Logger.log(''); return []; }
  var ya = {}, ops = [], txt = [];
  leer("SELECT campaign_criterion.keyword.text FROM campaign_criterion WHERE campaign.name = " + q(CAMPANA_EMPRESAS) +
    " AND campaign_criterion.type = 'KEYWORD' AND campaign_criterion.negative = TRUE").forEach(function (r) { ya[String(r.campaignCriterion.keyword.text).toLowerCase()] = 1; });
  NEGATIVAS.forEach(function (p) {
    if (ya[p[0]]) { Logger.log('  Ya estaba: "' + p[0] + '"'); return; }
    ops.push({ campaignCriterionOperation: { create: { campaign: c[0].campaign.resourceName, negative: true, keyword: { text: p[0], matchType: p[1] } } } });
    txt.push('negativa "' + p[0] + '"');
  });
  return aplicar(ops, txt, vista);
}

function anuncios(vista) {
  Logger.log('3. ANUNCIOS NUEVOS (al lado de los que ya salen)');
  var g = grupos(), cuantos = {}, ops = [], txt = [];
  leer("SELECT campaign.name, ad_group.name FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND campaign.status = 'ENABLED'")
    .forEach(function (r) { var k = r.campaign.name + '|' + r.adGroup.name; cuantos[k] = (cuantos[k] || 0) + 1; });
  ANUNCIOS.forEach(function (a) {
    var k = a.campana + '|' + a.grupo, x = g[k];
    if (!x) { Logger.log('  No encontr\u00e9 el grupo "' + a.grupo + '". Se salta.'); return; }
    if ((cuantos[k] || 0) >= 3) { Logger.log('  "' + a.grupo + '" ya tiene 3 anuncios (el m\u00e1ximo). Se salta.'); return; }
    var mal = a.titulos.filter(function (t) { return t.length > 30; }).concat(a.descripciones.filter(function (d) { return d.length > 90; }));
    if (mal.length) { Logger.log('  Texto muy largo en "' + a.grupo + '": ' + mal.join(' | ') + '. Se salta.'); return; }
    ops.push({ adGroupAdOperation: { create: { adGroup: x.grupo, status: 'ENABLED', ad: { finalUrls: [a.url], responsiveSearchAd: {
      headlines: a.titulos.map(function (t) { return { text: t }; }), descriptions: a.descripciones.map(function (d) { return { text: d }; }) } } } } });
    txt.push('anuncio nuevo en "' + a.grupo + '" (' + a.titulos.length + ' t\u00edtulos, ' + a.descripciones.length + ' descripciones) -> ' + a.url);
  });
  return aplicar(ops, txt, vista);
}

function aplicar(ops, txt, vista) {
  if (!ops.length) { Logger.log('  Nada que agregar.'); Logger.log(''); return []; }
  var out = [];
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    if (r.isSuccessful()) { Logger.log('  ' + (vista ? 'se puede agregar: ' : 'LISTO: ') + txt[i]); if (!vista) out.push(r.getResourceName()); }
    else Logger.log('  ERROR ' + txt[i] + ': ' + msg(r));
  });
  Logger.log('');
  return out;
}

function deshacer(vista) {
  var ops = DESHACER.map(function (rn) {
    if (rn.indexOf('/adGroupCriteria/') > 0) return { adGroupCriterionOperation: { remove: rn } };
    if (rn.indexOf('/adGroupAds/') > 0) return { adGroupAdOperation: { remove: rn } };
    if (rn.indexOf('/campaignCriteria/') > 0) return { campaignCriterionOperation: { remove: rn } };
    return { customerAssetOperation: { remove: rn } };
  });
  AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    Logger.log('  ' + (r.isSuccessful() ? (vista ? 'se puede quitar ' : 'LISTO: quitado ') : 'ERROR al quitar ') + DESHACER[i] + (r.isSuccessful() ? '' : ': ' + msg(r)));
  });
  Logger.log('FIN.');
}
