/**
 * Atelback · Que nuestras acciones «AB · …» cuenten en la columna «Conversiones», y acción para las llamadas — las cinco cuentas
 * Escrito a mano el 10 nov 2026 (no lo genera generar.py). Para correr el viernes 13 nov, después del paso 3 del presupuesto.
 *
 * POR QUÉ (revisión del 9 nov):
 *   - Girbau: la meta «Contacto», donde está «AB · Clic en WhatsApp», NO cuenta. Su Máximo rendimiento aprende sin ver los WhatsApp.
 *   - Kingstar: la meta «Envío de formulario», donde está «AB · Formulario enviado», NO cuenta.
 *   - Gamesail: no tiene ninguna acción para las llamadas del botón del anuncio, y su meta «Llamada (desde anuncios)» no cuenta.
 *
 * QUÉ HACE:
 *   1. Metas: si una meta de sitio web tiene una acción «AB · …» principal y la meta NO cuenta, la enciende para que cuente
 *      (biddable). No apaga ninguna meta.
 *   2. Llamadas: enciende la meta «Llamada (desde anuncios)» si no cuenta. Si la cuenta NO tiene ninguna acción principal de
 *      «llamadas desde anuncios», lo avisa: esa acción se crea a mano con la extensión (por script Google la rechaza).
 *   En VISTA PREVIA solo lo dice. Con EJECUTAR lo aplica (solo con el OK de Sandy).
 * No toca presupuestos, campañas, anuncios ni las acciones que ya existen.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var META = { CONTACT: 'Contacto', SUBMIT_LEAD_FORM: 'Envío de formulario', PHONE_CALL_LEAD: 'Llamada', OUTBOUND_CLICK: 'Clic saliente' };
var NUEVA_LLAMADA = 'AB · Llamada desde el anuncio';

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function nombreMeta(g) { return (META[g.category] || g.category) + ' (' + g.origin + ')'; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('METAS QUE CUENTAN · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
  Logger.log('');

  var acciones = filas("SELECT conversion_action.resource_name, conversion_action.name, conversion_action.type, conversion_action.category, " +
    "conversion_action.primary_for_goal FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones');
  var nuestrasPorMeta = {}, hayLlamada = null;
  acciones.forEach(function (f) {
    var a = f.conversionAction;
    if (/^AB\s*·/.test(a.name) && a.primaryForGoal) (nuestrasPorMeta[a.category] = nuestrasPorMeta[a.category] || []).push(a.name);
    if (a.type === 'AD_CALL' && a.primaryForGoal) hayLlamada = a.name;
    if (a.name === NUEVA_LLAMADA) hayLlamada = hayLlamada || a.name;
  });
  var metas = filas("SELECT customer_conversion_goal.resource_name, customer_conversion_goal.category, customer_conversion_goal.origin, " +
    "customer_conversion_goal.biddable FROM customer_conversion_goal", 'las metas').map(function (f) { return f.customerConversionGoal; });

  // 1. Metas con acciones nuestras que no cuentan
  Logger.log('==== 1. METAS CON ACCIONES «AB · …» ====');
  var ops = [], textos = [];
  metas.forEach(function (g) {
    if (g.origin !== 'WEBSITE' || !nuestrasPorMeta[g.category]) return;
    if (g.biddable) { Logger.log('✔ ' + nombreMeta(g) + ' ya cuenta · ' + nuestrasPorMeta[g.category].join(', ')); return; }
    Logger.log('→ ' + nombreMeta(g) + ' NO cuenta y ahí está ' + nuestrasPorMeta[g.category].join(', ') + ' → se enciende');
    ops.push({ customerConversionGoalOperation: { update: { resourceName: g.resourceName, biddable: true }, updateMask: 'biddable' } });
    textos.push('meta ' + nombreMeta(g) + ' cuenta');
  });
  Logger.log('');

  // 2. Llamadas desde el anuncio
  Logger.log('==== 2. LLAMADAS DESDE EL ANUNCIO ====');
  var crear = !hayLlamada;
  if (!crear) Logger.log('✔ Ya tiene acción principal de llamadas desde anuncios: «' + hayLlamada + '». No se crea otra.');
  else Logger.log('→ No tiene ninguna acción principal de llamadas desde anuncios → falta crear «' + NUEVA_LLAMADA + '» (60 s o más, una por clic).');
  metas.forEach(function (g) {
    if (g.category !== 'PHONE_CALL_LEAD' || g.origin !== 'CALL_FROM_ADS') return;
    if (g.biddable) { Logger.log('✔ La meta ' + nombreMeta(g) + ' ya cuenta.'); return; }
    Logger.log('→ La meta ' + nombreMeta(g) + ' NO cuenta → se enciende');
    ops.push({ customerConversionGoalOperation: { update: { resourceName: g.resourceName, biddable: true }, updateMask: 'biddable' } });
    textos.push('meta ' + nombreMeta(g) + ' cuenta');
  });
  Logger.log('');

  var malos = 0, hechos = 0;
  // Una operación a la vez y sin «partial_failure»: las metas (customerConversionGoal) no aceptan ese modo.
  function aplicar(lista, txt) {
    return lista.map(function (op, i) {
      var r;
      try { r = AdsApp.mutate(op, { partialFailure: false }); }
      catch (e) { malos++; Logger.log('❌ ' + txt[i] + ': ' + e.message); return null; }
      if (r.isSuccessful()) { hechos++; Logger.log((vista ? '✔ (vista previa) se podría: ' : '✅ ') + txt[i]); }
      else { malos++; Logger.log('❌ ' + txt[i] + ': ' + r.getErrorMessages().join('; ')); }
      return r;
    });
  }
  aplicar(ops, textos);
  if (crear) Logger.log('→ La acción «' + NUEVA_LLAMADA + '» no se crea por script (Google la rechaza con un error que el script no reconoce). ' +
    'Se crea a mano con la extensión: prompt crear-accion-llamadas-gamesail.')
  Logger.log('');
  var cambios = ops.length;
  Logger.log('METAS · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · cambios: ' + cambios + ' · con error: ' + malos +
    (crear ? ' · falta la acción de llamadas (va con la extensión)' : ''));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
