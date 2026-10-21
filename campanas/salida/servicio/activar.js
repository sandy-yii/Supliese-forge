/**
 * Atelback · Activar campañas de arranque — Servicio para Lavandería (265-909-2662)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE, todo en una sola operación (si algo falla, no se cambia nada):
 *   1. Habilita las campañas nuevas «AB ·» y les pone su presupuesto.
 *   2. Campañas anteriores habilitadas: las pausa o les baja el presupuesto a la mitad, según el plan.
 *   3. Pausa en las campañas anteriores las palabras clave, campañas y grupos que el plan indica.
 *   4. Si las campañas anteriores siguen activas: cambia sus anuncios a la página nueva (un solo sitio por
 *      grupo, como exige Google) y les aplica la lista «PB · Negativas basura».
 *      Si alguna campaña nueva se creó con una página anterior, también la pasa a la página nueva.
 *   5. Activa el etiquetado automático si está apagado.
 * No borra nada. No toca pujas, ubicaciones, idiomas ni facturación.
 *
 * CÓMO SE USA (dentro de la cuenta, no en una cuenta de administrador general):
 *   1. Correr antes «crear-campanas.js» y «conversiones.js».
 *   2. Herramientas > Acciones masivas > Secuencias de comandos > "+" > pegar este archivo completo > Autorizar.
 *   3. VISTA PREVIA: no cambia nada y deja en el registro la lista de cambios. Revisarla.
 *   4. Si está de acuerdo, EJECUTAR.
 */

var PLAN = {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "mismo_sitio": ["laundry-solutions-servicio.vercel.app"], "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8}], "anteriores": "MITAD", "pausar_palabras": [], "pausar_nombres": [], "basura": {"nombre": "PB · Negativas basura", "kw": [["curso", "BROAD"], ["cursos", "BROAD"], ["tutorial", "BROAD"], ["cómo reparar", "PHRASE"], ["como reparar", "PHRASE"], ["diagrama", "BROAD"], ["diagramas", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["manuales", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["easy", "BROAD"], ["de casa", "PHRASE"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["carga frontal", "PHRASE"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["empleo", "BROAD"], ["trabajo", "BROAD"], ["sueldo", "BROAD"]]}};

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

function plano(s) {
  return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Sitio (dominio sin www) de una URL.
function sitio(url) {
  var m = /^https?:\/\/([^\/?#]+)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') : '';
}

// URL nueva para un anuncio: si venía de una versión anterior del mismo sitio (PLAN.mismo_sitio), se conserva
// la sección (/mangles/…); si no, va a la página principal del plan.
function urlNueva(url) {
  var m = /^https?:\/\/([^\/?#]+)([^?#]*)/i.exec(url || '');
  if (m && (PLAN.mismo_sitio || []).indexOf(sitio(url)) >= 0 && m[2] && m[2] !== '/') {
    return PLAN.url.replace(/\/+$/, '') + m[2];
  }
  return PLAN.url;
}

// Página sin www, sin parámetros y sin la diagonal final, para comparar si un anuncio ya va a la página nueva.
function pagina(url) {
  var m = /^https?:\/\/([^\/?#]+)([^?#]*)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') + m[2].replace(/\/+$/, '') : '';
}

function micros(pesos) { return String(Math.round(pesos * 1000000)); }
function pesos(micros) { return Math.round(Number(micros) / 1000000); }

// ¿La negativa bloquea la palabra clave? Comparación literal, como hace Google con las negativas.
function bloquea(neg, texto) {
  var q = plano(texto).split(/\s+/), n = plano(neg[0]).split(/\s+/);
  if (neg[1] === 'EXACT') return q.join(' ') === n.join(' ');
  if (neg[1] === 'PHRASE') {
    for (var i = 0; i + n.length <= q.length; i++) {
      if (q.slice(i, i + n.length).join(' ') === n.join(' ')) return true;
    }
    return false;
  }
  return n.every(function (w) { return q.indexOf(w) >= 0; });
}

function main() {
  var cid = revisarCuenta();
  var c = cid.replace(/-/g, '');
  var ops = [], cambios = [], avisos = [];

  // ---- Campañas
  var campanas = [];
  var it = AdsApp.search('SELECT campaign.resource_name, campaign.name, campaign.status, campaign.advertising_channel_type, ' +
    'campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared ' +
    "FROM campaign WHERE campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var f = it.next();
    campanas.push({ rn: f.campaign.resourceName, nombre: f.campaign.name, estado: f.campaign.status,
      tipo: f.campaign.advertisingChannelType, presupuesto: f.campaignBudget.resourceName,
      monto: f.campaignBudget.amountMicros, compartido: f.campaignBudget.explicitlyShared });
  }
  var porNombre = {};
  campanas.forEach(function (k) { porNombre[k.nombre] = k; });
  var faltan = PLAN.campanas.filter(function (k) { return !porNombre[k.nombre]; }).map(function (k) { return k.nombre; });
  if (faltan.length) {
    throw new Error('Faltan campañas nuevas: ' + faltan.join(', ') + '. Corre primero «crear-campanas.js». No se cambió nada.');
  }
  function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
  var anteriores = campanas.filter(function (k) { return !esNueva(k.nombre) && k.estado === 'ENABLED'; });
  var siguen = PLAN.anteriores === 'MITAD' ? anteriores : [];
  var completo = PLAN.anteriores === 'PAUSAR' || anteriores.length === 0;
  Logger.log('Campañas anteriores habilitadas: ' + anteriores.length + '. Presupuesto de las nuevas: ' +
    (completo ? 'COMPLETO' : 'ARRANQUE (la mitad), porque las anteriores siguen con la otra mitad') + '.');

  // 1. Campañas nuevas
  PLAN.campanas.forEach(function (k) {
    var actual = porNombre[k.nombre];
    var monto = completo ? k.completo : k.arranque;
    if (actual.estado !== 'ENABLED') {
      ops.push({ campaignOperation: { update: { resourceName: actual.rn, status: 'ENABLED' }, updateMask: 'status' } });
    }
    if (pesos(actual.monto) !== monto) {
      ops.push({ campaignBudgetOperation: { update: { resourceName: actual.presupuesto, amountMicros: micros(monto) }, updateMask: 'amountMicros' } });
    }
    cambios.push('HABILITAR «' + k.nombre + '» · $' + pesos(actual.monto) + ' → $' + monto + ' al día');
  });

  // 2. Campañas anteriores
  var pausadas = {};
  anteriores.forEach(function (k) {
    if (PLAN.anteriores === 'PAUSAR') {
      ops.push({ campaignOperation: { update: { resourceName: k.rn, status: 'PAUSED' }, updateMask: 'status' } });
      pausadas[k.nombre] = true;
      cambios.push('PAUSAR campaña anterior «' + k.nombre + '» (' + k.tipo + ', $' + pesos(k.monto) + ' al día)');
    } else if (k.compartido) {
      avisos.push('«' + k.nombre + '» usa un presupuesto compartido: no se bajó a la mitad. Revísalo a mano.');
    } else {
      var mitad = Math.max(1, Math.round(pesos(k.monto) / 2));
      ops.push({ campaignBudgetOperation: { update: { resourceName: k.presupuesto, amountMicros: micros(mitad) }, updateMask: 'amountMicros' } });
      cambios.push('BAJAR a la mitad «' + k.nombre + '» · $' + pesos(k.monto) + ' → $' + mitad + ' al día');
    }
  });

  // 3a. Campañas y grupos anteriores que el plan pide pausar por nombre
  var nombres = (PLAN.pausar_nombres || []).map(plano);
  function coincideNombre(n) { return nombres.some(function (x) { return plano(n).indexOf(x) >= 0; }); }
  anteriores.forEach(function (k) {
    if (!pausadas[k.nombre] && coincideNombre(k.nombre)) {
      ops.push({ campaignOperation: { update: { resourceName: k.rn, status: 'PAUSED' }, updateMask: 'status' } });
      pausadas[k.nombre] = true;
      cambios.push('PAUSAR campaña «' + k.nombre + '» (pedido en la junta)');
    }
  });
  if (nombres.length) {
    var itg = AdsApp.search("SELECT ad_group.resource_name, ad_group.name, campaign.name FROM ad_group " +
      "WHERE ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'");
    while (itg.hasNext()) {
      var g = itg.next();
      if (esNueva(g.campaign.name) || pausadas[g.campaign.name] || !coincideNombre(g.adGroup.name)) continue;
      ops.push({ adGroupOperation: { update: { resourceName: g.adGroup.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
      cambios.push('PAUSAR grupo «' + g.adGroup.name + '» en «' + g.campaign.name + '» (pedido en la junta)');
    }
  }

  // 3b. Palabras clave de las campañas anteriores
  var palabrasActivas = [];
  var frases = (PLAN.pausar_palabras || []).map(plano);
  var itk = AdsApp.search('SELECT ad_group_criterion.resource_name, ad_group_criterion.keyword.text, campaign.name, ad_group.name ' +
    "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE " +
    "AND ad_group_criterion.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'");
  while (itk.hasNext()) {
    var r = itk.next();
    if (esNueva(r.campaign.name) || pausadas[r.campaign.name]) continue;
    var texto = r.adGroupCriterion.keyword.text;
    if (frases.some(function (x) { return plano(texto).indexOf(x) >= 0; })) {
      ops.push({ adGroupCriterionOperation: { update: { resourceName: r.adGroupCriterion.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
      cambios.push('PAUSAR palabra «' + texto + '» en «' + r.campaign.name + ' > ' + r.adGroup.name + '» (pedido en la junta)');
    } else {
      palabrasActivas.push(texto);
    }
  }

  // 4. Lo que sigue corriendo en las campañas anteriores: página nueva y negativas de basura
  var siguenBusqueda = siguen.filter(function (k) { return !pausadas[k.nombre] && k.tipo === 'SEARCH'; });
  siguen.forEach(function (k) {
    if (!pausadas[k.nombre] && k.tipo !== 'SEARCH') {
      avisos.push('«' + k.nombre + '» (' + k.tipo + ') sigue activa: revisa a mano su página de destino; el script solo copia anuncios de Búsqueda.');
    }
  });
  if (siguenBusqueda.length) {
    var activas = {};
    siguenBusqueda.forEach(function (k) { activas[k.nombre] = true; });
    // Google exige un solo sitio web por grupo de anuncios: los anuncios que van a otra página se cambian
    // a la página nueva (los adaptables de búsqueda) o se pausan (los de otro tipo, que ya no se pueden editar).
    var cambiadas = 0, pausados = 0;
    var ita = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.resource_name, ad_group_ad.ad.resource_name, ' +
      "ad_group_ad.ad.type, ad_group_ad.ad.final_urls FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' " +
      "AND ad_group.status != 'REMOVED' AND campaign.status = 'ENABLED'");
    while (ita.hasNext()) {
      var a = ita.next();
      if (!activas[a.campaign.name]) continue;
      var url = (a.adGroupAd.ad.finalUrls || [])[0] || '';
      if (sitio(url) === sitio(PLAN.url)) continue;
      if (a.adGroupAd.ad.type === 'RESPONSIVE_SEARCH_AD') {
        ops.push({ adOperation: { update: { resourceName: a.adGroupAd.ad.resourceName, finalUrls: [urlNueva(url)] }, updateMask: 'finalUrls' } });
        cambiadas++;
      } else {
        ops.push({ adGroupAdOperation: { update: { resourceName: a.adGroupAd.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
        pausados++;
      }
    }
    if (cambiadas) cambios.push('CAMBIAR la página de ' + cambiadas + ' anuncio(s) de las campañas anteriores a ' + PLAN.url);
    if (pausados) cambios.push('PAUSAR ' + pausados + ' anuncio(s) de otro tipo que van a otra página (un solo sitio por grupo)');

    var lista = null, yaEnLista = {};
    var its = AdsApp.search("SELECT shared_set.resource_name, shared_set.name FROM shared_set " +
      "WHERE shared_set.status = 'ENABLED' AND shared_set.type = 'NEGATIVE_KEYWORDS'");
    while (its.hasNext()) {
      var s = its.next().sharedSet;
      if (s.name === PLAN.basura.nombre) lista = s.resourceName;
    }
    if (lista) {
      var itc = AdsApp.search('SELECT shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion ' +
        "WHERE shared_criterion.shared_set = '" + lista + "'");
      while (itc.hasNext()) {
        var kw = itc.next().sharedCriterion.keyword;
        if (kw) yaEnLista[plano(kw.text) + '|' + kw.matchType] = true;
      }
    } else if (AdsApp.getExecutionInfo().isPreview()) {
      // Google no acepta agregar palabras ni campañas a una lista que todavía no existe; al ejecutar se crea primero.
      lista = null;
      cambios.push('CREAR la lista «' + PLAN.basura.nombre + '» con sus negativas y aplicarla (se revisa al ejecutar)');
    } else {
      var rl = AdsApp.mutate({ sharedSetOperation: { create: { name: PLAN.basura.nombre, type: 'NEGATIVE_KEYWORDS' } } });
      if (!rl.isSuccessful()) {
        throw new Error('No se pudo crear la lista «' + PLAN.basura.nombre + '»: ' + rl.getErrorMessages().join('; ') + '. No se cambió nada.');
      }
      lista = rl.getResourceName();
    }
    var agregadas = 0, omitidas = [];
    if (lista) PLAN.basura.kw.forEach(function (n) {
      if (yaEnLista[plano(n[0]) + '|' + n[1]]) return;
      var choca = palabrasActivas.filter(function (t) { return bloquea(n, t); });
      if (choca.length) { omitidas.push(n[0] + ' (bloquearía «' + choca[0] + '»)'); return; }
      ops.push({ sharedCriterionOperation: { create: { sharedSet: lista, keyword: { text: n[0], matchType: n[1] } } } });
      agregadas++;
    });
    var conLista = {};
    var itl = AdsApp.search("SELECT campaign.name, shared_set.name FROM campaign_shared_set WHERE campaign_shared_set.status = 'ENABLED'");
    while (itl.hasNext()) {
      var l = itl.next();
      if (l.sharedSet.name === PLAN.basura.nombre) conLista[l.campaign.name] = true;
    }
    if (lista) {
      siguenBusqueda.forEach(function (k) {
        if (!conLista[k.nombre]) ops.push({ campaignSharedSetOperation: { create: { campaign: k.rn, sharedSet: lista } } });
      });
      cambios.push('LISTA «' + PLAN.basura.nombre + '»: ' + agregadas + ' negativas nuevas, aplicada a ' +
        siguenBusqueda.map(function (k) { return '«' + k.nombre + '»'; }).join(', '));
    }
    if (omitidas.length) avisos.push('Negativas que no se agregaron porque bloquearían palabras activas: ' + omitidas.join('; '));
  }

  // 4b. Campañas nuevas creadas con una página anterior: se pasan a la página del plan (un solo sitio por grupo).
  var corregidas = 0;
  var itn = AdsApp.search('SELECT campaign.name, ad_group_ad.resource_name, ad_group_ad.ad.resource_name, ad_group_ad.ad.type, ' +
    "ad_group_ad.ad.final_urls FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status != 'REMOVED' " +
    "AND campaign.status != 'REMOVED'");
  while (itn.hasNext()) {
    var an = itn.next();
    if (!esNueva(an.campaign.name)) continue;
    var un = (an.adGroupAd.ad.finalUrls || [])[0] || '';
    if (sitio(un) === sitio(PLAN.url)) continue;
    if (an.adGroupAd.ad.type === 'RESPONSIVE_SEARCH_AD') {
      ops.push({ adOperation: { update: { resourceName: an.adGroupAd.ad.resourceName, finalUrls: [urlNueva(un)] }, updateMask: 'finalUrls' } });
    } else {
      ops.push({ adGroupAdOperation: { update: { resourceName: an.adGroupAd.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
    }
    corregidas++;
  }
  if (corregidas) cambios.push('CAMBIAR a ' + PLAN.url + ' ' + corregidas + ' anuncio(s) de las campañas nuevas que tenían otra página');

  // 5. Etiquetado automático
  var itu = AdsApp.search('SELECT customer.auto_tagging_enabled FROM customer');
  if (itu.hasNext() && !itu.next().customer.autoTaggingEnabled) {
    ops.push({ customerOperation: { update: { resourceName: 'customers/' + c, autoTaggingEnabled: true }, updateMask: 'autoTaggingEnabled' } });
    cambios.push('ACTIVAR el etiquetado automático de la cuenta');
  }

  cambios.forEach(function (x) { Logger.log(x); });
  avisos.forEach(function (x) { Logger.log('AVISO: ' + x); });
  Logger.log(PLAN.nombre + ': ' + ops.length + ' operaciones.');
  if (!ops.length) { Logger.log('No hay nada que cambiar.'); return; }
  var resultados = AdsApp.mutateAll(ops, { partialFailure: false });
  var errores = [];
  resultados.forEach(function (r, i) {
    if (!r.isSuccessful()) errores.push('#' + i + ' ' + JSON.stringify(ops[i]).substring(0, 300) + ' → ' + r.getErrorMessages().join('; '));
  });
  if (errores.length) {
    errores.forEach(function (e) { Logger.log(e); });
    throw new Error(errores.length + ' operaciones con error. No se cambió nada. Revisa el registro.');
  }
  if (AdsApp.getExecutionInfo().isPreview()) {
    Logger.log('VISTA PREVIA SIN ERRORES. Revisa la lista de arriba; para aplicarla, da EJECUTAR.');
  } else {
    Logger.log('LISTO. Si alguna campaña nueva se creó a mano con fecha de inicio 2026-12-31, cámbiala a hoy en su configuración.');
  }
}
