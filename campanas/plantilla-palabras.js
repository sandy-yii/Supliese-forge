/**
 * Atelback · Agregar las palabras clave nuevas del plan — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): compara las palabras clave de
 * cada grupo de las campañas «AB ·» con el plan y agrega las que faltan, encendidas. No quita ni cambia ninguna
 * de las que ya existen, ni toca anuncios, presupuestos o páginas.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = {{PLANES}};
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

  var ops = [], donde = [], faltan = [];
  PLAN.campanas.forEach(function (c) {
    c.grupos.forEach(function (g) {
      var nombre = c.nombre + ' > ' + g.nombre;
      var gr = grupos[nombre];
      if (!gr) { faltan.push(nombre); return; }
      g.kw.forEach(function (w) {
        if (gr.hay[clave(w[0], w[1])]) return;
        ops.push({ adGroupCriterionOperation: { create: { adGroup: gr.rn, status: 'ENABLED', keyword: { text: w[0], matchType: w[1] } } } });
        donde.push('«' + w[0] + '» (' + (TIPOS[w[1]] || w[1]) + ') en ' + nombre);
      });
    });
  });
  faltan.forEach(function (n) { Logger.log('AVISO: no existe el grupo ' + n + ' (¿falta correr «crear-campanas.js»?). Se salta.'); });
  if (!ops.length) { Logger.log('Nada que agregar: las campañas ya tienen todas las palabras clave del plan.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) Logger.log((vista ? 'SE AGREGARÍA ' : 'AGREGADA ') + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) {
    Logger.log((ops.length - malos) + ' palabra(s) por agregar' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  } else {
    Logger.log('LISTO: ' + (ops.length - malos) + ' palabra(s) agregadas' + (malos ? ', ' + malos + ' rechazadas por Google' : '') + '.');
  }
}
