/**
 * Atelback · Agregar las palabras clave nuevas del plan — Servicio para Lavandería · Refacciones de cualquier marca (preparado, sin aplicar)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): compara las palabras clave de
 * cada grupo de las campañas «AB ·» con el plan y agrega las que faltan, encendidas. También agrega a la lista
 * «AB · Negativas de la cuenta» las exclusiones del plan que le falten. No quita ni cambia ninguna de las que ya
 * existen, ni toca anuncios, presupuestos o páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "quitar": [["partes para lavadora industrial", "PHRASE"], ["partes para lavadoras industriales", "PHRASE"], ["refacciones para lavadora industrial", "PHRASE"], ["refacciones para lavadoras industriales", "PHRASE"], ["refacciones para secadora industrial", "PHRASE"], ["refacciones para secadoras industriales", "PHRASE"], ["refacciones lavandería industrial", "PHRASE"], ["refacciones lavanderia industrial", "PHRASE"]], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["lavadoras industriales", "EXACT"], ["lavadora industrial", "EXACT"], ["lavadoras para lavanderia", "EXACT"], ["lavadoras para lavandería", "EXACT"], ["lavadoras comerciales", "EXACT"], ["lavadoras industriales precio", "EXACT"], ["lavadora industrial precio", "EXACT"], ["precio de lavadora industrial", "PHRASE"], ["precio de lavadoras industriales", "PHRASE"], ["precio lavadoras industriales", "PHRASE"], ["costo lavadora industrial", "PHRASE"], ["costo de lavadora industrial", "PHRASE"], ["costo de lavadoras industriales", "PHRASE"], ["cuánto cuesta una lavadora industrial", "PHRASE"], ["cuanto cuesta una lavadora industrial", "PHRASE"], ["cuánto cuestan las lavadoras industriales", "PHRASE"], ["cuanto cuestan las lavadoras industriales", "PHRASE"], ["cuánto vale una lavadora industrial", "PHRASE"], ["cuanto vale una lavadora industrial", "PHRASE"], ["para negocio", "PHRASE"], ["commercial washer", "PHRASE"], ["curso", "BROAD"], ["cursos", "BROAD"], ["tutorial", "BROAD"], ["cómo reparar", "PHRASE"], ["como reparar", "PHRASE"], ["diagrama", "BROAD"], ["diagramas", "BROAD"], ["pdf", "BROAD"], ["manual", "BROAD"], ["manuales", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["easy", "BROAD"], ["de casa", "PHRASE"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["carga frontal", "PHRASE"], ["vacante", "BROAD"], ["vacantes", "BROAD"], ["empleo", "BROAD"], ["trabajo", "BROAD"], ["sueldo", "BROAD"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["clm", "BROAD"], ["kingstar", "BROAD"], ["king star", "PHRASE"]]}, "campanas": [{"nombre": "AB · Servicio técnico industrial", "grupos": [{"nombre": "Servicio técnico", "kw": [["técnico de lavadoras industriales", "PHRASE"], ["técnico en lavadoras industriales", "PHRASE"], ["técnico en lavandería industrial", "PHRASE"], ["técnico de secadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Reparación y mantenimiento", "grupos": [{"nombre": "Reparación", "kw": [["reparación de lavadoras industriales", "PHRASE"], ["reparación de lavadora industrial", "PHRASE"]]}, {"nombre": "Mantenimiento correctivo", "kw": [["mantenimiento correctivo lavadora industrial", "PHRASE"], ["mantenimiento correctivo lavadoras industriales", "PHRASE"], ["mantenimiento correctivo lavadora", "PHRASE"]]}, {"nombre": "Mantenimiento preventivo", "kw": [["mantenimiento preventivo lavadoras industriales", "PHRASE"], ["mantenimiento lavandería industrial", "PHRASE"], ["mantenimiento de lavadoras industriales", "PHRASE"]]}]}, {"nombre": "AB · Refacciones Girbau y Gamesail", "grupos": [{"nombre": "Refacciones Girbau", "kw": [["refacciones girbau", "EXACT"], ["refacciones girbau", "PHRASE"], ["refacciones para lavadora girbau", "PHRASE"], ["refacciones para secadora girbau", "PHRASE"], ["partes girbau", "PHRASE"], ["refacciones girbau", "BROAD"]]}, {"nombre": "Refacciones Gamesail", "kw": [["refacciones gamesail", "EXACT"], ["refacciones gamesail", "PHRASE"], ["partes gamesail", "PHRASE"], ["refacciones gamesail", "BROAD"]]}, {"nombre": "Refacciones industriales", "kw": [["refacciones para lavadora industrial", "PHRASE"], ["refacciones para lavadoras industriales", "PHRASE"], ["refacciones para secadora industrial", "PHRASE"], ["refacciones para secadoras industriales", "PHRASE"], ["partes para lavadora industrial", "PHRASE"], ["partes para lavadoras industriales", "PHRASE"], ["refacciones lavandería industrial", "PHRASE"], ["repuestos para lavadora industrial", "PHRASE"]], "h": ["Refacciones Industriales", "Partes Lavadora Industrial", "Refacciones para Secadoras", "Para Lavadoras y Secadoras", "Instalación por Técnicos", "Cotiza tu Refacción", "Te Ayudamos con la Pieza", "Asesoría para Renovar Equipo", "Servicio Técnico Industrial", "Agenda tu Servicio", "Habla con un Técnico"], "d": ["Refacciones para lavadoras y secadoras industriales. Cotiza con un técnico.", "Envíanos el modelo de tu equipo y te ayudamos a encontrar la pieza correcta.", "Instalamos la refacción con nuestros técnicos para que tu equipo vuelva a trabajar.", "Si tu equipo ya no tiene arreglo, te asesoramos para renovarlo con equipo nuevo."], "p": ["refacciones", "industriales"]}]}, {"nombre": "AB · Servicio a secadoras", "grupos": [{"nombre": "Secadoras", "kw": [["reparación de secadoras industriales", "PHRASE"], ["servicio a secadoras industriales", "PHRASE"], ["mantenimiento de secadoras industriales", "PHRASE"], ["reparación secadoras industriales", "BROAD"]]}]}, {"nombre": "AB · Instalación", "grupos": [{"nombre": "Instalación", "kw": [["instalación de lavandería industrial", "PHRASE"], ["instalación de equipo de lavandería", "PHRASE"], ["instalación lavandería industrial", "BROAD"]]}]}, {"nombre": "AB · Servicio a lavanderías", "grupos": [{"nombre": "Pólizas", "kw": [["mantenimiento para lavandería de autoservicio", "PHRASE"], ["póliza de mantenimiento lavandería", "PHRASE"], ["mantenimiento lavandería autoservicio", "BROAD"]]}]}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var TIPOS = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function clave(texto, tipo) { return texto.toLowerCase() + '|' + tipo; }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('PALABRAS CLAVE NUEVAS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));

  var campanasRn = {};
  var itc = AdsApp.search("SELECT campaign.name, campaign.resource_name FROM campaign WHERE campaign.status != 'REMOVED'");
  while (itc.hasNext()) { var cc = itc.next().campaign; campanasRn[cc.name] = cc.resourceName; }
  var grupos = {};
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group.resource_name FROM ad_group ' +
    "WHERE ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var g = it.next();
    grupos[g.campaign.name + ' > ' + g.adGroup.name] = { rn: g.adGroup.resourceName, hay: {} };
  }
  var itk = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type ' +
    "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE " +
    "AND ad_group_criterion.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (itk.hasNext()) {
    var k = itk.next();
    var gr = grupos[k.campaign.name + ' > ' + k.adGroup.name];
    if (gr) gr.hay[clave(k.adGroupCriterion.keyword.text, k.adGroupCriterion.keyword.matchType)] = true;
  }

  var ops = [], donde = [], faltan = [], temporal = 0;

  // Exclusiones de la cuenta que faltan en la lista
  var lista = '', yaEnLista = {};
  var its = AdsApp.search("SELECT shared_set.resource_name, shared_set.name FROM shared_set " +
    "WHERE shared_set.status = 'ENABLED' AND shared_set.type = 'NEGATIVE_KEYWORDS'");
  while (its.hasNext()) { var ss = its.next().sharedSet; if (ss.name === PLAN.lista.nombre) lista = ss.resourceName; }
  if (!lista) {
    Logger.log('AVISO: no existe la lista «' + PLAN.lista.nombre + '». Las exclusiones no se agregan.');
  } else {
    var itn = AdsApp.search("SELECT shared_criterion.resource_name, shared_criterion.keyword.text, shared_criterion.keyword.match_type FROM shared_criterion " +
      "WHERE shared_criterion.shared_set = '" + lista + "'");
    while (itn.hasNext()) {
      var sc = itn.next().sharedCriterion, kn = sc.keyword;
      if (kn) yaEnLista[clave(kn.text, kn.matchType)] = sc.resourceName || true;
    }
    // Exclusiones que el plan ya no quiere (por ejemplo, porque ahora esas búsquedas sí se atienden)
    (PLAN.quitar || []).forEach(function (w) {
      var rn = yaEnLista[clave(w[0], w[1])];
      if (typeof rn !== 'string') return;
      ops.push({ sharedCriterionOperation: { remove: rn } });
      donde.push('quitar la exclusión «' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') de la lista de la cuenta');
    });
    PLAN.lista.kw.forEach(function (w) {
      if (yaEnLista[clave(w[0], w[1])]) return;
      ops.push({ sharedCriterionOperation: { create: { sharedSet: lista, keyword: { text: w[0], matchType: w[1] } } } });
      donde.push('exclusión «' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en la lista de la cuenta');
    });
  }
  PLAN.campanas.forEach(function (c) {
    c.grupos.forEach(function (g) {
      var nombre = c.nombre + ' > ' + g.nombre;
      var gr = grupos[nombre];
      if (!gr && g.h && campanasRn[c.nombre]) {
        // Grupo nuevo en una campaña que ya existe: se crea con su anuncio y sus palabras clave
        var rnGrupo = 'customers/' + AdsApp.currentAccount().getCustomerId().replace(/-/g, '') + '/adGroups/' + (--temporal);
        ops.push({ adGroupOperation: { create: { resourceName: rnGrupo, campaign: campanasRn[c.nombre], name: g.nombre, status: 'ENABLED', type: 'SEARCH_STANDARD' } } });
        donde.push('grupo nuevo «' + nombre + '»');
        ops.push({ adGroupAdOperation: { create: { adGroup: rnGrupo, status: 'ENABLED', ad: { finalUrls: [PLAN.url],
          responsiveSearchAd: { headlines: g.h.map(function (t) { return { text: t }; }), descriptions: g.d.map(function (t) { return { text: t }; }),
            path1: g.p[0], path2: g.p[1] } } } } });
        donde.push('anuncio de «' + nombre + '» (' + g.h.length + ' títulos, ' + g.d.length + ' descripciones, a ' + PLAN.url + ')');
        gr = grupos[nombre] = { rn: rnGrupo, hay: {} };
      }
      if (!gr) { faltan.push(nombre); return; }
      g.kw.forEach(function (w) {
        if (gr.hay[clave(w[0], w[1])]) return;
        ops.push({ adGroupCriterionOperation: { create: { adGroup: gr.rn, status: 'ENABLED', keyword: { text: w[0], matchType: w[1] } } } });
        donde.push('«' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en ' + nombre);
      });
    });
  });
  faltan.forEach(function (n) { Logger.log('AVISO: no existe el grupo ' + n + ' (¿falta correr «crear-campanas.js»?). Se salta.'); });
  if (!ops.length) { Logger.log('Nada que agregar: las campañas ya tienen todas las palabras clave y exclusiones del plan.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    var otro = /^(quitar|grupo|anuncio)/.test(donde[i]);
    if (r.isSuccessful()) Logger.log((otro ? (vista ? 'SE HARÍA: ' : 'HECHO: ') : (vista ? 'SE AGREGARÍA ' : 'AGREGADA ')) + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) {
    Logger.log((ops.length - malos) + ' cambio(s) por hacer' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  } else {
    Logger.log('LISTO: ' + (ops.length - malos) + ' cambio(s) hechos' + (malos ? ', ' + malos + ' rechazadas por Google' : '') + '.');
  }
}
