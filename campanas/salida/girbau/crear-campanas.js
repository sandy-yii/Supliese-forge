/**
 * Atelback · Crear campañas de arranque — Girbau (860-582-6837)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE: crea campañas nuevas de Búsqueda EN PAUSA, con sus grupos, palabras clave, anuncios, negativas,
 * ubicación e idioma, y una lista de negativas compartida. Todo va en una sola operación: si algo falla,
 * no se crea nada. NO modifica, pausa, activa ni borra nada que ya exista en la cuenta.
 *
 * CÓMO SE USA (dentro de la cuenta 860-582-6837, no en el MCC):
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

var PLAN = {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "ubicacion_de": null, "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadora industrial", "EXACT"], ["lavadoras industriales", "EXACT"], ["lavadora industrial precio", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["precio lavadora industrial", "EXACT"], ["lavadora industrial 12 kg", "EXACT"], ["lavadora industrial 14 kg", "EXACT"], ["lavadora industrial 30 kg", "EXACT"], ["lavadora industrial 30 kg precio", "EXACT"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["lorsa", "BROAD"], ["lorza", "BROAD"], ["wascomat", "BROAD"], ["unimac", "BROAD"], ["maytag", "BROAD"], ["alliance", "BROAD"], ["speed queen", "PHRASE"], ["primus", "BROAD"], ["electrolux", "BROAD"], ["lg", "BROAD"], ["imesa", "BROAD"], ["sertec", "BROAD"], ["edro", "BROAD"], ["lavartind", "BROAD"], ["whirlpool", "BROAD"], ["braun", "BROAD"], ["gamesail", "BROAD"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["continental girbau", "PHRASE"], ["empleo", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["usada", "BROAD"], ["usadas", "BROAD"], ["renta", "BROAD"]]}, "campanas": [{"nombre": "AB · Marca Girbau", "diario": 49, "cpc": 10, "negativas": [], "grupos": [{"nombre": "Girbau", "kw": [["girbau", "EXACT"], ["girbau", "PHRASE"], ["lavadoras girbau", "PHRASE"], ["girbau méxico", "PHRASE"], ["distribuidor girbau", "PHRASE"], ["girbau occidente", "PHRASE"]], "h": ["Girbau Occidente", "Distribuidor Girbau", "Lavadoras Girbau", "Nueva Girbau Smart Plus", "Lavadoras de 12 y 14 kg", "Secadoras y Mangles Girbau", "Girbau", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras, secadoras y mangles Girbau. Cotiza hoy con un asesor.", "Conoce la nueva Girbau Smart Plus y las lavadoras de 12 y 14 kg.", "Equipo Girbau para lavanderías, hoteles y hospitales. Te ayudamos a elegir."], "p": ["girbau", "equipo"]}]}, {"nombre": "AB · Girbau Smart Plus", "diario": 22, "cpc": 10, "negativas": [], "grupos": [{"nombre": "Smart Plus", "kw": [["girbau smart plus", "PHRASE"], ["smart plus girbau", "PHRASE"], ["lavadora girbau smart plus", "PHRASE"]], "h": ["Girbau Smart Plus", "Nueva Girbau Smart Plus", "Lavadora Smart Plus", "Distribuidor Girbau", "Conoce el Nuevo Modelo", "Girbau", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Conoce la nueva Girbau Smart Plus. Cotiza hoy con un asesor.", "Te explicamos el nuevo modelo y te ayudamos a elegir la capacidad.", "Equipo Girbau para lavanderías, hoteles y hospitales."], "p": ["smart-plus", "girbau"]}]}, {"nombre": "AB · Girbau por capacidad y sector", "diario": 27, "cpc": 10, "negativas": [], "grupos": [{"nombre": "Capacidad", "kw": [["lavadora girbau 12 kg", "PHRASE"], ["lavadora girbau 14 kg", "PHRASE"], ["girbau 12 kg", "PHRASE"], ["girbau 14 kg", "PHRASE"], ["secadora girbau", "PHRASE"], ["lavadora industrial girbau", "PHRASE"]], "h": ["Lavadora Girbau 12 kg", "Lavadora Girbau 14 kg", "Lavadoras de 12 y 14 kg", "Secadoras Girbau", "Distribuidor Girbau", "Te Ayudamos a Elegir", "Girbau", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras Girbau de 12 y 14 kg y secadoras Girbau. Cotiza hoy con un asesor.", "Te ayudamos a elegir la capacidad según los kilos de ropa que lavas al día.", "Equipo Girbau para lavanderías, hoteles y hospitales."], "p": ["girbau", "capacidad"]}, {"nombre": "Sector", "kw": [["lavadora girbau para hotel", "PHRASE"], ["mangle girbau", "PHRASE"], ["girbau para lavandería", "PHRASE"]], "h": ["Girbau para Hoteles", "Mangles Girbau", "Girbau para Lavanderías", "Distribuidor Girbau", "Te Ayudamos a Elegir", "Girbau", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras, secadoras y mangles Girbau para hoteles y lavanderías. Cotiza hoy.", "Te ayudamos a elegir el equipo Girbau para tu operación."], "p": ["girbau", "sector"]}]}, {"nombre": "AB · Servicio técnico Girbau", "diario": 11, "cpc": 10, "negativas": [], "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico girbau", "PHRASE"], ["reparación girbau", "PHRASE"], ["mantenimiento girbau", "PHRASE"]], "h": ["Servicio Técnico Girbau", "Técnicos Girbau", "Mantenimiento Girbau", "Distribuidor Girbau", "Agenda tu Servicio", "Girbau", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Servicio técnico y mantenimiento para equipo Girbau. Agenda hoy.", "Técnicos para lavadoras, secadoras y mangles Girbau."], "p": ["servicio", "girbau"]}]}]};

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
  Logger.log('Versión del script: por pasos, 21 oct 2026.');
  Logger.log(PLAN.nombre + ': ' + (paso1.length + paso2.length + paso3.length) + ' operaciones y ' + claves.length + ' palabras clave.');

  if (vista) {
    // En la vista previa no se crea nada. Se revisan campañas, grupos, anuncios y palabras clave;
    // la ubicación, el idioma y las listas solo se pueden revisar cuando la campaña ya existe, al ejecutar.
    var todas = paso1.concat(paso3, claves.map(opClave));
    var rv = AdsApp.mutateAll(todas, { partialFailure: true });
    var malas = [], omitidas = [], sinRevisar = 0;
    var base = paso1.length + paso3.length;
    rv.forEach(function (r, i) {
      if (r.isSuccessful()) return;
      // La vista previa no puede revisar lo que depende de una campaña que todavía no existe: Google responde
      // con un error genérico. Eso no es un error real; se revisa al ejecutar, paso por paso.
      if (/int[eé]ntelo de nuevo|try again|internal/i.test(r.getErrorMessages().join(' '))) { sinRevisar++; return; }
      if (i < base) malas.push(errorDe(r, todas[i]));
      else omitidas.push(claves[i - base]);
    });
    if (sinRevisar) Logger.log(sinRevisar + ' operaciones no se pueden revisar en la vista previa porque dependen de campañas que aún no existen; se revisan al ejecutar.');
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
