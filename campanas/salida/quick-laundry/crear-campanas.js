/**
 * Atelback · Crear campañas de arranque — Quick Laundry (cuenta Supliese Gómez) (256-397-2201)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: crea campañas nuevas de Búsqueda EN PAUSA, con sus grupos, palabras clave, anuncios, negativas,
 * ubicación e idioma, y una lista de negativas compartida. Todo va en una sola operación: si algo falla,
 * no se crea nada. NO modifica, pausa, activa ni borra nada que ya exista en la cuenta.
 *
 * CÓMO SE USA (dentro de la cuenta 256-397-2201, no en el MCC):
 *   1. Herramientas > Acciones masivas > Scripts > "+" > pegar este archivo completo.
 *   2. Autorizar.
 *   3. VISTA PREVIA. Si el registro termina en "VISTA PREVIA SIN ERRORES", dar EJECUTAR.
 *   4. Revisar las campañas creadas. Se activan solo con el OK del cliente.
 */

// Ubicación: 2484 = México completo. Si el plan trae «ubicacion_de», se copian las ubicaciones incluidas y
// excluidas de esa campaña actual (solo se leen, no se toca la campaña).
var UBICACIONES = [2484];
var EXCLUIDAS = [];
// Idioma: 1003 = español.
var IDIOMAS = [1003];
// Si es true, la página de destino se copia de los anuncios actuales de la cuenta (la que más anuncios usan).
var COPIAR_URL = false;

var PLAN = {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://www.supliese.com/", "ubicacion_de": null, "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["franquicia", "BROAD"], ["franquicias", "BROAD"], ["franchise", "BROAD"], ["franquiciatario", "BROAD"], ["hotel", "BROAD"], ["hoteles", "BROAD"], ["hotelera", "BROAD"], ["hospital", "BROAD"], ["hospitales", "BROAD"], ["clínica", "BROAD"], ["clinica", "BROAD"], ["mangle", "BROAD"], ["mangles", "BROAD"], ["planchadora", "BROAD"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["gamesail", "BROAD"], ["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["100 kg", "PHRASE"], ["100 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["túnel", "BROAD"], ["tunel", "BROAD"], ["clm", "BROAD"], ["60 kg", "PHRASE"], ["girbau", "BROAD"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["lavax", "BROAD"], ["lava 1", "PHRASE"], ["aquamatic", "BROAD"], ["5asec", "BROAD"], ["cerca de mí", "PHRASE"], ["cerca de mi", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["seminuevas", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["gratis", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["carga frontal", "PHRASE"]]}, "campanas": [{"nombre": "AB · Equipo para lavandería", "diario": 79, "cpc": 8, "negativas": [], "grupos": [{"nombre": "Lavadoras para lavandería", "kw": [["lavadoras para lavanderías", "PHRASE"], ["lavadoras industriales para lavandería", "PHRASE"], ["lavadoras para lavandería precios", "EXACT"], ["lavadoras para negocio", "EXACT"], ["lavadoras y secadoras para lavandería", "PHRASE"], ["equipo para lavandería", "PHRASE"]], "h": ["Equipo para Lavanderías", "Lavadoras para Lavandería", "Lavadoras y Secadoras", "Equipo Comercial", "Precios de Equipo", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras para lavandería. Te ayudamos a elegir el equipo. Cotiza hoy.", "Equipo comercial y semi industrial para lavanderías nuevas o que van a crecer.", "Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo y capacidad.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["equipo", "lavanderia"]}, {"nombre": "Semi industrial", "kw": [["lavadoras semi industriales", "PHRASE"], ["lavadora semi industrial", "PHRASE"], ["lavadora comercial", "PHRASE"]], "h": ["Lavadoras Semi Industriales", "Lavadora Comercial", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras semi industriales y comerciales para lavandería. Cotiza hoy.", "Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo y capacidad.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["lavadoras", "comerciales"]}]}, {"nombre": "AB · Emprendimiento", "diario": 49, "cpc": 7, "negativas": [["cuanto cuesta", "PHRASE"], ["cuánto cuesta", "PHRASE"], ["cuanto cuestan", "PHRASE"], ["cuánto cuestan", "PHRASE"], ["cuanto se necesita", "PHRASE"], ["cuánto se necesita", "PHRASE"], ["cuanto se invierte", "PHRASE"], ["cuánto se invierte", "PHRASE"], ["cuanto dinero", "PHRASE"], ["cuánto dinero", "PHRASE"], ["cuanto gana", "PHRASE"], ["cuánto gana", "PHRASE"], ["cuanto deja", "PHRASE"], ["cuánto deja", "PHRASE"]], "grupos": [{"nombre": "Abrir una lavandería", "kw": [["abrir una lavandería", "PHRASE"], ["poner una lavandería", "PHRASE"], ["abrir mi lavandería", "PHRASE"], ["poner mi lavandería", "PHRASE"]], "h": ["Abre tu Lavandería", "Pon tu Propia Lavandería", "Asesoría para tu Lavandería", "Equipo para tu Lavandería", "Te Ayudamos a Planearla", "Elige el Equipo Correcto", "Lavadoras y Secadoras", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Te asesoramos para elegir el equipo de tu lavandería según tu espacio y tu plan.", "Quick Laundry: lavadoras y secadoras para abrir tu lavandería, con asesoría.", "Platica con un asesor sobre el local, el equipo y los pasos para abrir tu lavandería.", "Solicita tu cotización de equipo para tu lavandería nueva."], "p": ["lavanderia", "abrir"]}]}, {"nombre": "AB · Autoservicio y monedas", "diario": 28, "cpc": 7, "negativas": [], "grupos": [{"nombre": "Autoservicio", "kw": [["lavadoras de monedas", "EXACT"], ["equipo para lavandería autoservicio", "EXACT"], ["lavadoras de autoservicio", "PHRASE"], ["lavadora para lavandería autoservicio", "PHRASE"], ["lavadora de monedas", "PHRASE"], ["secadora de monedas", "PHRASE"]], "h": ["Lavadoras de Monedas", "Equipo para Autoservicio", "Lavandería de Autoservicio", "Secadoras de Monedas", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras de monedas para lavandería de autoservicio. Cotiza hoy.", "Quick Laundry: equipo para autoservicio con asesoría para elegir modelo.", "Equipa tu lavandería de autoservicio con lavadoras y secadoras comerciales.", "Solicita tu cotización y recibe precio del equipo para tu autoservicio."], "p": ["autoservicio", "monedas"]}]}, {"nombre": "AB · Secadoras para lavandería", "diario": 16, "cpc": 8, "negativas": [], "grupos": [{"nombre": "Secadoras para lavandería", "kw": [["secadora de ropa para lavandería", "PHRASE"], ["secadora lavandería", "PHRASE"], ["secadora semi industrial", "PHRASE"], ["secadoras semi industriales", "PHRASE"]], "h": ["Secadoras para Lavandería", "Secadoras Semi Industriales", "Secadora Comercial", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Secadoras de ropa para lavandería, comerciales y semi industriales. Cotiza hoy.", "Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo.", "Solicita tu cotización y recibe precio de la secadora que necesitas."], "p": ["secadoras", "lavanderia"]}]}, {"nombre": "AB · Marcas comerciales", "diario": 16, "cpc": 7, "negativas": [["teléfono", "BROAD"], ["telefono", "BROAD"], ["dirección", "BROAD"], ["direccion", "BROAD"], ["sucursal", "BROAD"], ["servicio", "BROAD"]], "grupos": [{"nombre": "Maytag y LG", "kw": [["lavadora maytag industrial", "PHRASE"], ["lavadora maytag comercial", "PHRASE"], ["lg lavadora industrial", "PHRASE"], ["lavadora lg comercial", "PHRASE"]], "h": ["Lavadoras Comerciales", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Equipa tu Lavandería", "Precios de Equipo", "Te Ayudamos a Elegir", "Quick Laundry", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras y secadoras comerciales para lavandería. Cotiza hoy con un asesor.", "Quick Laundry: equipo comercial para tu lavandería con asesoría para elegir modelo.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["lavadoras", "comerciales"]}]}, {"nombre": "AB · Marca Quick Laundry", "diario": 10, "cpc": 6, "negativas": [["precio por kilo", "PHRASE"], ["por kilo", "PHRASE"], ["servicio de lavado", "PHRASE"], ["domicilio", "BROAD"], ["horario", "BROAD"], ["horarios", "BROAD"]], "grupos": [{"nombre": "Quick Laundry", "kw": [["quick laundry", "EXACT"], ["quick laundry méxico", "PHRASE"], ["quicklaundry", "EXACT"], ["quick laundry equipo", "PHRASE"]], "h": ["Quick Laundry", "Quick Laundry México", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Antes Supliese", "Te Ayudamos a Elegir", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Quick Laundry, antes Supliese: equipo para lavanderías. Cotiza hoy con un asesor.", "Lavadoras y secadoras comerciales para abrir o equipar tu lavandería.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["quick", "laundry"]}, {"nombre": "Supliese", "kw": [["supliese", "EXACT"], ["supliese", "PHRASE"], ["supliese gómez", "EXACT"]], "h": ["Supliese Ahora es", "Quick Laundry", "Equipo para Lavanderías", "Lavadoras y Secadoras", "Antes Supliese", "Te Ayudamos a Elegir", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Supliese ahora es Quick Laundry: el mismo equipo para lavanderías. Cotiza hoy.", "Lavadoras y secadoras comerciales para abrir o equipar tu lavandería.", "Solicita tu cotización y recibe precio del equipo que necesita tu lavandería."], "p": ["quick", "laundry"]}]}]};

// Solo si es una cuenta nueva (el plan no trae su número): pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var esperada = PLAN.cuenta || CUENTA_NUEVA;
  if (!esperada) {
    throw new Error('Es una cuenta nueva: pega su número en CUENTA_NUEVA, arriba del script. No se hizo nada.');
  }
  if (PLAN.anterior && cid === PLAN.anterior) {
    throw new Error('Esta es la cuenta anterior (' + cid + '), no la nueva. No se hizo nada.');
  }
  if (cid !== esperada) {
    throw new Error('Este script es para la cuenta ' + esperada + ' y se está corriendo en ' + cid + '. No se hizo nada.');
  }
  return cid;
}

function main() {
  var cid = revisarCuenta();
  if (COPIAR_URL) {
    PLAN.url = urlDeAnunciosActuales();
  }
  Logger.log('Página de destino: ' + PLAN.url);
  if (PLAN.ubicacion_de) {
    ubicacionesDe(PLAN.ubicacion_de);
  }
  var c = cid.replace(/-/g, '');

  var choques = [];
  var nombres = {};
  PLAN.campanas.forEach(function (k) { nombres[k.nombre] = true; });
  var it = AdsApp.search("SELECT campaign.name FROM campaign WHERE campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var n = it.next().campaign.name;
    if (nombres[n]) choques.push('campaña «' + n + '»');
  }
  // Si la lista ya existe (por ejemplo, de un intento anterior a mano), se reutiliza: solo se le agregan las palabras que falten.
  var listaExistente = null;
  var it2 = AdsApp.search("SELECT shared_set.resource_name, shared_set.name FROM shared_set " +
    "WHERE shared_set.status = 'ENABLED' AND shared_set.type = 'NEGATIVE_KEYWORDS'");
  while (it2.hasNext()) {
    var s = it2.next().sharedSet;
    if (s.name === PLAN.lista.nombre) listaExistente = s.resourceName;
  }
  if (choques.length) {
    throw new Error('Ya existen: ' + choques.join(', ') + '. No se creó nada, para no duplicar.');
  }

  var siguiente = -1;
  function temporal(tipo) { return 'customers/' + c + '/' + tipo + '/' + (siguiente--); }
  function micros(pesos) { return String(Math.round(pesos * 1000000)); }

  // Se crea por pasos, porque Google no acepta la ubicación, el idioma ni las listas de una campaña que todavía no existe:
  //   paso 1: lista de negativas, presupuestos y campañas (en pausa)
  //   paso 2: ubicación, idioma, negativas y lista de cada campaña, y las palabras de la lista
  //   paso 3: grupos de anuncios y anuncios
  //   paso 4: palabras clave, una por una (si Google rechaza alguna, se omite y se avisa)
  // Si el paso 2 o el 3 fallan, se quita lo creado en el paso 1 para que la cuenta quede como estaba.
  var paso1 = [], paso2 = [], paso3 = [], claves = [];
  var lista, yaEnLista = {}, listaNueva = false;
  if (listaExistente) {
    lista = listaExistente;
    var it3 = AdsApp.search("SELECT shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion " +
      "WHERE shared_criterion.shared_set = '" + listaExistente + "'");
    while (it3.hasNext()) {
      var kw = it3.next().sharedCriterion.keyword;
      if (kw) yaEnLista[kw.text.toLowerCase() + '|' + kw.matchType] = true;
    }
  } else {
    lista = temporal('sharedSets');
    listaNueva = true;
    paso1.push({ sharedSetOperation: { create: { resourceName: lista, name: PLAN.lista.nombre, type: 'NEGATIVE_KEYWORDS' } } });
  }
  var agregadas = 0;
  PLAN.lista.kw.forEach(function (k) {
    if (yaEnLista[k[0].toLowerCase() + '|' + k[1]]) return;
    paso2.push({ sharedCriterionOperation: { create: { sharedSet: lista, keyword: { text: k[0], matchType: k[1] } } } });
    agregadas++;
  });
  Logger.log('Lista «' + PLAN.lista.nombre + '»: ' + (listaExistente ? 'ya existía, se reutiliza' : 'nueva') +
    ' · ' + agregadas + ' palabras por agregar.');

  var resumen = [];
  PLAN.campanas.forEach(function (k) {
    var presupuesto = temporal('campaignBudgets');
    paso1.push({ campaignBudgetOperation: { create: {
      resourceName: presupuesto, name: k.nombre + ' · presupuesto', amountMicros: micros(k.diario),
      deliveryMethod: 'STANDARD', explicitlyShared: false } } });
    var campana = temporal('campaigns');
    paso1.push({ campaignOperation: { create: {
      resourceName: campana, name: k.nombre, status: 'PAUSED', advertisingChannelType: 'SEARCH',
      campaignBudget: presupuesto,
      targetSpend: { cpcBidCeilingMicros: micros(k.cpc) },
      networkSettings: { targetGoogleSearch: true, targetSearchNetwork: false, targetContentNetwork: false,
                         targetPartnerSearchNetwork: false },
      geoTargetTypeSetting: { positiveGeoTargetType: 'PRESENCE', negativeGeoTargetType: 'PRESENCE' },
      containsEuPoliticalAdvertising: 'DOES_NOT_CONTAIN_EU_POLITICAL_ADVERTISING' } } });
    UBICACIONES.forEach(function (u) {
      paso2.push({ campaignCriterionOperation: { create: { campaign: campana, location: { geoTargetConstant: 'geoTargetConstants/' + u } } } });
    });
    EXCLUIDAS.forEach(function (u) {
      paso2.push({ campaignCriterionOperation: { create: { campaign: campana, negative: true, location: { geoTargetConstant: 'geoTargetConstants/' + u } } } });
    });
    IDIOMAS.forEach(function (l) {
      paso2.push({ campaignCriterionOperation: { create: { campaign: campana, language: { languageConstant: 'languageConstants/' + l } } } });
    });
    paso2.push({ campaignSharedSetOperation: { create: { campaign: campana, sharedSet: lista } } });
    k.negativas.forEach(function (n) {
      paso2.push({ campaignCriterionOperation: { create: { campaign: campana, negative: true, keyword: { text: n[0], matchType: n[1] } } } });
    });
    var palabras = 0;
    k.grupos.forEach(function (g) {
      var grupo = temporal('adGroups');
      paso3.push({ adGroupOperation: { create: { resourceName: grupo, campaign: campana, name: g.nombre, status: 'ENABLED', type: 'SEARCH_STANDARD' } } });
      g.kw.forEach(function (w) {
        claves.push({ grupo: grupo, donde: k.nombre + ' > ' + g.nombre, texto: w[0], tipo: w[1] });
        palabras++;
      });
      paso3.push({ adGroupAdOperation: { create: { adGroup: grupo, status: 'ENABLED', ad: {
        finalUrls: [PLAN.url],
        responsiveSearchAd: {
          headlines: g.h.map(function (t) { return { text: t }; }),
          descriptions: g.d.map(function (t) { return { text: t }; }),
          path1: g.p[0], path2: g.p[1] } } } } });
    });
    resumen.push(k.nombre + ' · $' + k.diario + '/día de arranque · tope CPC $' + k.cpc + ' · ' + k.grupos.length + ' grupos · ' + palabras + ' palabras clave');
  });

  function opClave(x) {
    return { adGroupCriterionOperation: { create: { adGroup: x.grupo, status: 'ENABLED', keyword: { text: x.texto, matchType: x.tipo } } } };
  }
  function errorDe(r, op) { return JSON.stringify(op).substring(0, 300) + ' → ' + r.getErrorMessages().join('; '); }
  // Cambia los nombres temporales (…/-3) por los reales que devolvió Google.
  function conReales(op, reales) {
    return JSON.parse(JSON.stringify(op).replace(/customers\/\d+\/\w+\/-\d+/g, function (m) { return reales[m] || m; }));
  }
  function correr(ops, parcial, reales) {
    var enviar = reales ? ops.map(function (o) { return conReales(o, reales); }) : ops;
    var res = enviar.length ? AdsApp.mutateAll(enviar, { partialFailure: parcial }) : [];
    var errores = [];
    res.forEach(function (r, i) {
      if (!r.isSuccessful()) errores.push(errorDe(r, enviar[i]));
      else if (reales) {
        var temp = JSON.stringify(ops[i]).match(/"resourceName":"(customers\/\d+\/\w+\/-\d+)"/);
        if (temp && r.getResourceName()) reales[temp[1]] = r.getResourceName();
      }
    });
    return { res: res, errores: errores };
  }

  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log(PLAN.nombre + ': ' + (paso1.length + paso2.length + paso3.length) + ' operaciones y ' + claves.length + ' palabras clave.');

  if (vista) {
    // En la vista previa no se crea nada. Se revisan campañas, grupos, anuncios y palabras clave;
    // la ubicación, el idioma y las listas solo se pueden revisar cuando la campaña ya existe, al ejecutar.
    var todas = paso1.concat(paso3, claves.map(opClave));
    var rv = AdsApp.mutateAll(todas, { partialFailure: true });
    var malas = [], omitidas = [];
    var base = paso1.length + paso3.length;
    rv.forEach(function (r, i) {
      if (r.isSuccessful()) return;
      if (i < base) malas.push(errorDe(r, todas[i]));
      else omitidas.push(claves[i - base]);
    });
    omitidas.forEach(function (x) {
      Logger.log('AVISO: Google no acepta la palabra clave «' + x.texto + '» (' + x.donde + '); se omitirá.');
    });
    if (malas.length) {
      malas.forEach(function (e) { Logger.log(e); });
      throw new Error(malas.length + ' operaciones con error en la vista previa. No ejecutes; manda el registro.');
    }
    resumen.forEach(function (r) { Logger.log(r); });
    Logger.log('La ubicación (México), el idioma (español) y la lista de negativas se agregan al ejecutar.');
    Logger.log('VISTA PREVIA SIN ERRORES' + (omitidas.length ? ' (con ' + omitidas.length + ' palabra(s) que se omitirán)' : '') +
      '. Para crear las campañas (en pausa), da EJECUTAR.');
    return;
  }

  var reales = {};
  var r1 = correr(paso1, false, reales);
  if (r1.errores.length) {
    r1.errores.forEach(function (e) { Logger.log(e); });
    throw new Error('Paso 1 con ' + r1.errores.length + ' error(es). No se creó nada. Revisa el registro.');
  }
  Logger.log('Paso 1 listo: lista, presupuestos y campañas en pausa.');

  function deshacer(motivo, errores) {
    errores.forEach(function (e) { Logger.log(e); });
    var quitar = [];
    Object.keys(reales).forEach(function (temp) {
      if (/\/campaigns\//.test(temp)) quitar.push({ campaignOperation: { remove: reales[temp] } });
    });
    if (listaNueva && reales[lista]) quitar.push({ sharedSetOperation: { remove: reales[lista] } });
    var rq = AdsApp.mutateAll(quitar, { partialFailure: true });
    var quedan = rq.filter(function (r) { return !r.isSuccessful(); }).length;
    throw new Error(motivo + ' Se quitaron las campañas creadas en el paso 1' +
      (quedan ? ', pero ' + quedan + ' no se pudieron quitar: bórralas a mano (empiezan con «AB ·»)' : ' y la cuenta quedó como estaba') +
      '. Revisa el registro.');
  }

  var r2 = correr(paso2, false, reales);
  if (r2.errores.length) deshacer('Paso 2 (ubicación, idioma y negativas) con ' + r2.errores.length + ' error(es).', r2.errores);
  Logger.log('Paso 2 listo: ubicación, idioma y negativas.');

  var r3 = correr(paso3, false, reales);
  if (r3.errores.length) deshacer('Paso 3 (grupos y anuncios) con ' + r3.errores.length + ' error(es).', r3.errores);
  Logger.log('Paso 3 listo: grupos y anuncios.');

  var r4 = correr(claves.map(opClave), true, reales);
  var fallidas = 0;
  r4.res.forEach(function (r, i) {
    if (r.isSuccessful()) return;
    fallidas++;
    Logger.log('AVISO: no se agregó la palabra clave «' + claves[i].texto + '» (' + claves[i].donde + '): ' + r.getErrorMessages().join('; '));
  });
  resumen.forEach(function (r) { Logger.log(r); });
  Logger.log('CREADO. Todas las campañas quedaron EN PAUSA' + (fallidas ? ', sin ' + fallidas + ' palabra(s) clave que Google no aceptó' : '') +
    '. Se activan solo con el OK del cliente.');
}

function urlDeAnunciosActuales() {
  var cuenta = {};
  var it = AdsApp.search("SELECT ad_group_ad.ad.final_urls FROM ad_group_ad " +
                         "WHERE ad_group_ad.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    (it.next().adGroupAd.ad.finalUrls || []).forEach(function (u) { cuenta[u] = (cuenta[u] || 0) + 1; });
  }
  var urls = Object.keys(cuenta).sort(function (a, b) { return cuenta[b] - cuenta[a]; });
  if (!urls.length) {
    throw new Error('No encontré anuncios con página de destino en la cuenta. No se creó nada.');
  }
  urls.forEach(function (u) { Logger.log('  en anuncios actuales: ' + u + ' (' + cuenta[u] + ' anuncios)'); });
  return urls[0];
}

function ubicacionesDe(nombre) {
  var incluidas = [], excluidas = [], radios = 0, encontrada = false;
  var it = AdsApp.search("SELECT campaign.name, campaign_criterion.type, campaign_criterion.negative, " +
                         "campaign_criterion.location.geo_target_constant FROM campaign_criterion " +
                         "WHERE campaign.name = '" + nombre.replace(/'/g, "\\'") + "' AND campaign.status != 'REMOVED' " +
                         "AND campaign_criterion.type IN ('LOCATION', 'PROXIMITY')");
  while (it.hasNext()) {
    var r = it.next().campaignCriterion;
    encontrada = true;
    if (r.type === 'PROXIMITY') { radios++; continue; }
    var id = String(r.location.geoTargetConstant).split('/').pop();
    (r.negative ? excluidas : incluidas).push(id);
  }
  if (radios) {
    throw new Error('«' + nombre + '» usa radios alrededor de una dirección; el script no los copia. No se creó nada.');
  }
  if (!incluidas.length) {
    throw new Error((encontrada ? '«' + nombre + '» no tiene ubicaciones incluidas' : 'No encontré la campaña «' + nombre +
                    '» o no tiene ubicaciones') + '. No se creó nada: revisa el nombre o elige la zona a mano.');
  }
  UBICACIONES = incluidas;
  EXCLUIDAS = excluidas;
  Logger.log('Ubicaciones copiadas de «' + nombre + '»:');
  Logger.log('  incluidas: ' + nombresDeUbicaciones(incluidas));
  if (excluidas.length) Logger.log('  excluidas: ' + nombresDeUbicaciones(excluidas));
}

function nombresDeUbicaciones(ids) {
  var nombres = {};
  try {
    var it = AdsApp.search("SELECT geo_target_constant.id, geo_target_constant.canonical_name FROM geo_target_constant " +
                           "WHERE geo_target_constant.id IN (" + ids.join(', ') + ")");
    while (it.hasNext()) {
      var g = it.next().geoTargetConstant;
      nombres[String(g.id)] = g.canonicalName;
    }
  } catch (e) {
    // Si no se pueden leer los nombres, se muestran solo los números.
  }
  return ids.map(function (i) { return nombres[i] ? nombres[i] + ' (' + i + ')' : i; }).join(' · ');
}
