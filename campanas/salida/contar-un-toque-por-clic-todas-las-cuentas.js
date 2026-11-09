/**
 * Atelback · Contar UN contacto por clic en nuestras acciones «AB · …», y revisar qué metas cuentan — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * POR QUÉ: el diagnóstico del 9 nov mostró en Quick Laundry búsquedas con 1 clic y 10 «contactos» («speed queen méxico»)
 * y 20 contactos de madrugada con 18 clics. Eso pasa cuando una misma persona toca el botón de WhatsApp varias veces
 * y la acción está en «Cada una»: cuenta cada toque. Con «Una» cuenta una sola vez por clic en el anuncio, que es lo
 * que se puede cruzar con lo que anota el vendedor.
 *
 * QUÉ HACE:
 *   1. VISTA PREVIA: lista las acciones «AB · …» encendidas y cómo cuentan (Una o Cada una).
 *      EJECUTAR (solo con el OK): las que están en «Cada una» pasan a «Una». No cambia nada más.
 *   2. SOLO LEE: qué metas (categorías) cuentan en la columna «Conversiones» de la cuenta. Avisa si la meta de
 *      Contacto (donde está «AB · Clic en WhatsApp») o la de Formulario NO cuentan.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var CONTEO = { ONE_PER_CLICK: 'Una', MANY_PER_CLICK: 'Cada una' };
var META = { CONTACT: 'Contacto', SUBMIT_LEAD_FORM: 'Envío de formulario', PHONE_CALL_LEAD: 'Llamada', OUTBOUND_CLICK: 'Clic saliente',
  QUALIFIED_LEAD: 'Lead calificado', CONVERTED_LEAD: 'Lead convertido', GET_DIRECTIONS: 'Cómo llegar', ENGAGEMENT: 'Interacción',
  PAGE_VIEW: 'Vista de página', DEFAULT: 'Otra', DOWNLOAD: 'Descarga' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('UN CONTACTO POR CLIC · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica el cambio'));
  Logger.log('');

  Logger.log('==== 1. CÓMO CUENTAN NUESTRAS ACCIONES «AB · …» ====');
  var ops = [], textos = [], cats = {};
  filas("SELECT conversion_action.resource_name, conversion_action.name, conversion_action.counting_type, conversion_action.category, " +
    "conversion_action.include_in_conversions_metric FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) {
      var a = f.conversionAction;
      if (!/^AB\s*·/.test(a.name)) return;
      cats[a.category] = cats[a.category] || [];
      cats[a.category].push(a.name);
      var cambia = a.countingType === 'MANY_PER_CLICK';
      Logger.log(a.name + ' · cuenta: ' + (CONTEO[a.countingType] || a.countingType) + (cambia ? ' → pasa a «Una»' : ' · ya está bien') +
        (a.includeInConversionsMetric ? '' : ' · ⚠️ NO sale en la columna «Conversiones»'));
      if (cambia) {
        ops.push({ conversionActionOperation: { update: { resourceName: a.resourceName, countingType: 'ONE_PER_CLICK' }, updateMask: 'countingType' } });
        textos.push(a.name);
      }
    });
  Logger.log('');

  Logger.log('==== 2. QUÉ METAS CUENTAN EN LA COLUMNA «CONVERSIONES» (solo lee) ====');
  var avisos = [];
  filas("SELECT customer_conversion_goal.category, customer_conversion_goal.origin, customer_conversion_goal.biddable FROM customer_conversion_goal",
    'las metas').forEach(function (f) {
      var g = f.customerConversionGoal, nuestras = g.origin === 'WEBSITE' ? cats[g.category] : null;
      Logger.log((g.biddable ? 'CUENTA     ' : 'no cuenta  ') + '· ' + (META[g.category] || g.category) + ' (' + g.origin + ')' +
        (nuestras ? ' · ahí están: ' + nuestras.join(', ') : ''));
      if (nuestras && !g.biddable) avisos.push((META[g.category] || g.category) + ' no cuenta y ahí está ' + nuestras.join(', '));
    });
  if (avisos.length) Logger.log('⚠️ ' + avisos.join(' | '));
  Logger.log('');

  var malos = 0;
  if (!vista && ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (r.isSuccessful()) Logger.log('✅ ' + textos[i] + ' ahora cuenta «Una» por clic.');
      else { malos++; Logger.log('❌ ' + textos[i] + ' no se pudo cambiar: ' + r.getErrorMessages().join('; ')); }
    });
    Logger.log('');
  }
  Logger.log('CONTEO · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · pasan a «Una»: ' + ops.length +
    (vista ? '' : ' (con error: ' + malos + ')') + ' · metas nuestras que no cuentan: ' + (avisos.length ? avisos.join(' | ') : 'ninguna'));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
