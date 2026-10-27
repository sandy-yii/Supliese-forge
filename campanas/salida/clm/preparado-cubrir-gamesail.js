/**
 * Atelback · Agregar las palabras clave nuevas del plan — CLM · Cubrir las búsquedas de Gamesail mientras arranca
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): compara las palabras clave de
 * cada grupo de las campañas «AB ·» con el plan y agrega las que faltan, encendidas. También agrega a la lista
 * «AB · Negativas de la cuenta» las exclusiones del plan que le falten. No quita ni cambia ninguna de las que ya
 * existen, ni toca anuncios, presupuestos o páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://kingstar.com.mx/", "quitar": [["50 kg", "PHRASE"], ["50 kilos", "PHRASE"], ["130 kg", "PHRASE"], ["200 kg", "PHRASE"], ["secadora industrial 100 kg", "PHRASE"], ["secadora de 100 kilos", "PHRASE"], ["secadoras de 100 kilos", "PHRASE"], ["lavadora industrial para hotel", "PHRASE"], ["lavadoras industriales para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["lavadoras para lavanderia hotelera", "PHRASE"], ["lavadora para lavandería hotelera", "PHRASE"], ["lavadora para lavanderia hotelera", "PHRASE"], ["secadoras para lavandería hotelera", "PHRASE"], ["secadoras para lavanderia hotelera", "PHRASE"], ["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["mangle planchador", "PHRASE"], ["dobladora", "BROAD"], ["calandria", "BROAD"], ["para sábanas", "PHRASE"], ["para sabanas", "PHRASE"]], "lista": {"nombre": "AB · Negativas de la cuenta", "kw": [["auto", "BROAD"], ["autos", "BROAD"], ["carro", "BROAD"], ["carros", "BROAD"], ["coche", "BROAD"], ["coches", "BROAD"], ["automóvil", "BROAD"], ["automovil", "BROAD"], ["automóviles", "BROAD"], ["automoviles", "BROAD"], ["vehículo", "BROAD"], ["vehiculo", "BROAD"], ["vehículos", "BROAD"], ["vehiculos", "BROAD"], ["camión", "BROAD"], ["camion", "BROAD"], ["camiones", "BROAD"], ["camioneta", "BROAD"], ["camionetas", "BROAD"], ["moto", "BROAD"], ["motos", "BROAD"], ["car wash", "PHRASE"], ["carwash", "BROAD"], ["autolavado", "BROAD"], ["autolavados", "BROAD"], ["auto lavado", "PHRASE"], ["lavacoches", "BROAD"], ["tráiler", "BROAD"], ["trailer", "BROAD"], ["tráileres", "BROAD"], ["traileres", "BROAD"], ["encerado", "BROAD"], ["detallado", "BROAD"], ["poner una lavandería", "PHRASE"], ["poner una lavanderia", "PHRASE"], ["abrir una lavandería", "PHRASE"], ["abrir una lavanderia", "PHRASE"], ["negocio de lavandería", "PHRASE"], ["negocio de lavanderia", "PHRASE"], ["franquicia", "BROAD"], ["franquicias", "BROAD"], ["autoservicio", "BROAD"], ["monedas", "BROAD"], ["supliese", "BROAD"], ["quick laundry", "PHRASE"], ["refacciones", "BROAD"], ["refacción", "BROAD"], ["refaccion", "BROAD"], ["partes", "BROAD"], ["repuestos", "BROAD"], ["reparación", "BROAD"], ["reparacion", "BROAD"], ["mantenimiento", "BROAD"], ["servicio", "BROAD"], ["gamesail", "BROAD"], ["20 kg", "PHRASE"], ["30 kg", "PHRASE"], ["30 kilos", "PHRASE"], ["girbau", "BROAD"], ["para casa", "PHRASE"], ["doméstica", "BROAD"], ["domestica", "BROAD"], ["domésticas", "BROAD"], ["domesticas", "BROAD"], ["mabe", "BROAD"], ["samsung", "BROAD"], ["whirlpool", "BROAD"], ["lg", "BROAD"], ["carga frontal", "PHRASE"], ["usada", "BROAD"], ["usadas", "BROAD"], ["usado", "BROAD"], ["usados", "BROAD"], ["seminueva", "BROAD"], ["remate", "BROAD"], ["renta", "BROAD"], ["alquiler", "BROAD"], ["empleo", "BROAD"], ["vacante", "BROAD"], ["curso", "BROAD"], ["cursos", "BROAD"], ["manual", "BROAD"], ["pdf", "BROAD"], ["hisense", "BROAD"], ["fuzzy logic", "PHRASE"], ["heavy duty", "PHRASE"], ["cobija", "BROAD"], ["cobijas", "BROAD"], ["edredón", "BROAD"], ["edredon", "BROAD"], ["edredones", "BROAD"], ["15 kg", "PHRASE"], ["15 kilos", "PHRASE"], ["20 kilos", "PHRASE"], ["30kg", "PHRASE"], ["10 kg", "PHRASE"], ["22 kg", "PHRASE"], ["24 kg", "PHRASE"], ["24kg", "PHRASE"], ["25 kg", "PHRASE"], ["26 kg", "PHRASE"], ["28 kg", "PHRASE"], ["24 kilos", "PHRASE"], ["25 kilos", "PHRASE"], ["26 kilos", "PHRASE"], ["28 kilos", "PHRASE"]]}, "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "grupos": [{"nombre": "Lavadoras de alta capacidad", "kw": [["lavadoras de 100 kilos", "PHRASE"], ["lavadora industrial 100 kg", "PHRASE"], ["lavadora industrial 60 kg", "PHRASE"], ["lavadoras de alta capacidad", "PHRASE"], ["lavadora industrial de alta capacidad", "PHRASE"]]}, {"nombre": "Secadoras de alta capacidad", "kw": [["secadora industrial 100 kg", "PHRASE"], ["secadoras de 100 kilos", "PHRASE"], ["secadora industrial 130 kg", "PHRASE"], ["secadora industrial 200 kg", "PHRASE"], ["secadoras industriales de alta capacidad", "PHRASE"], ["secadora industrial 50 kg", "PHRASE"]], "h": ["Secadoras Industriales", "Secadoras de 100 a 200 kg", "Secadora Industrial 100 kg", "Alta Capacidad", "Para Lavandería Industrial", "Te Ayudamos a Elegir", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Secadoras industriales de alta capacidad, de 50 a 200 kg. Cotiza hoy.", "Equipo para lavanderías industriales, hoteles y hospitales de gran volumen.", "Solicita tu cotización y habla con un asesor sobre la capacidad que necesitas."], "p": ["secadoras", "industriales"]}]}, {"nombre": "AB · Lavandería hotelera e institucional", "grupos": [{"nombre": "Lavandería hotelera", "kw": [["lavandería hotelera", "EXACT"], ["proyecto de lavandería hotelera", "PHRASE"], ["lavandería industrial para hotel", "PHRASE"], ["lavandería para hotel", "PHRASE"]]}, {"nombre": "Hospitales e institucional", "kw": [["lavandería para hospital", "PHRASE"], ["lavandería hospitalaria", "PHRASE"], ["lavandería institucional", "PHRASE"]]}, {"nombre": "Lavadoras para hotel y hospital", "kw": [["lavadora industrial para hotel", "PHRASE"], ["lavadoras industriales para hotel", "PHRASE"], ["lavadoras para lavandería hotelera", "PHRASE"], ["lavadora industrial para hospital", "PHRASE"], ["lavadoras para hospitales", "PHRASE"], ["lavadora industrial 50 kg", "PHRASE"]], "h": ["Lavadoras para Hotel", "Lavadoras para Hospital", "Lavadora Industrial 50 kg", "Equipo de Alta Capacidad", "Lavandería Hotelera", "Te Ayudamos a Elegir", "CLM México", "Cotiza con un Asesor", "Solicita tu Cotización"], "d": ["Lavadoras industriales para hoteles y hospitales, de alta capacidad. Cotiza hoy.", "Te ayudamos a elegir el equipo según los kilos de ropa que procesas al día.", "Solicita tu cotización y habla con un asesor sobre tu proyecto."], "p": ["lavadoras", "hotel"]}]}, {"nombre": "AB · Mangles y planchado", "grupos": [{"nombre": "Mangles", "kw": [["mangle de planchado", "PHRASE"], ["mangle industrial", "PHRASE"], ["planchadora de rodillo industrial", "PHRASE"]]}]}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "grupos": [{"nombre": "20 a 45 kg", "kw": [["lavadoras y secadoras de 20 a 45 kg", "PHRASE"], ["lavadora industrial 40 kg", "PHRASE"], ["secadora industrial 40 kg", "PHRASE"], ["lavadora de 40 kilos", "PHRASE"], ["lavadora industrial 45 kg", "PHRASE"], ["secadora industrial 45 kg", "PHRASE"]]}]}, {"nombre": "AB · Túnel de lavado", "grupos": [{"nombre": "Túnel de lavado para ropa", "kw": [["túnel de lavado industrial", "PHRASE"], ["túnel de lavado para ropa", "PHRASE"], ["túnel de lavado de ropa", "PHRASE"], ["lavadora de túnel", "PHRASE"], ["sistema de lavado continuo", "PHRASE"], ["túnel de lavado para hotel", "PHRASE"], ["túnel de lavado para lavandería", "PHRASE"]]}]}, {"nombre": "AB · Marca CLM", "grupos": [{"nombre": "CLM", "kw": [["clm méxico", "EXACT"], ["clmmexico", "EXACT"], ["clm lavandería", "PHRASE"], ["clm lavadoras", "PHRASE"], ["clm lavandería industrial", "PHRASE"], ["kingstar", "EXACT"], ["kingstar méxico", "PHRASE"], ["kingstar lavadoras", "PHRASE"], ["kingstar lavandería", "PHRASE"], ["king star lavadoras", "PHRASE"]]}]}]}];
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
