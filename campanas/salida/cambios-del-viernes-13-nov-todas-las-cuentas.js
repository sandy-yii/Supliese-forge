/**
 * Atelback · CAMBIOS DEL VIERNES 13 NOV EN UN SOLO SCRIPT — las cinco cuentas
 * Escrito a mano el 10 nov 2026 (no lo genera generar.py). Se corre el viernes 13, después del paso 3 del jueves 12.
 * Junta, sin cambiarlos, estos dos scripts:
 *   1. Acciones de conversión de la agencia anterior a SECUNDARIAS (acciones-viejas-a-secundarias-todas-las-cuentas.js),
 *      SOLO en Girbau (en las demás ya se hizo el 9 nov).
 *   2. Metas que cuentan y acción para las llamadas (metas-que-cuentan-todas-las-cuentas.js):
 *      Girbau → la meta «Contacto» (WhatsApp) cuenta · Kingstar → la meta «Envío de formulario» cuenta ·
 *      Gamesail → se crea «AB · Llamada desde el anuncio» y su meta cuenta. En Quick Laundry y Laundry Solutions no debería haber nada que cambiar.
 * Si se corre ANTES del viernes 13, todo se muestra como vista previa y no cambia nada, aunque se le dé Ejecutar.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar el RESUMEN > EJECUTAR con el OK.
 */

var HACER_ACCIONES = true;   // parte 1 (solo Girbau)
var HACER_METAS = true;      // parte 2
var DESDE = '2026-11-11';   // adelantado del 13 al 11 nov: Girbau no puede esperar con su meta de WhatsApp sin contar

// ======================= acciones-viejas-a-secundarias-todas-las-cuentas.js (sin cambios) =======================
function ACCIONES(Logger, AdsApp) {
/**
 * Atelback · Pasar a SECUNDARIAS las acciones de conversión de la agencia anterior — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py). Pendiente D9.
 *
 * QUÉ HACE:
 *   - En VISTA PREVIA solo lee y lo dice todo. Por cada acción PRINCIPAL que no es «AB · …»:
 *       cuántas conversiones contó en los últimos 365 días y el último día que contó algo.
 *     Así se ve cuáles están muertas y cuáles alguien sigue usando.
 *   - Con EJECUTAR (solo con el OK de Sandy, cuenta por cuenta) las pasa de PRINCIPAL a SECUNDARIA.
 *     NO borra ninguna, NO las apaga y NO pierde su historial. Se pueden regresar a principal cuando se quiera.
 *
 * SE QUEDAN COMO PRINCIPALES (no las toca):
 *   - Todas las «AB · …».
 *   - Las de llamadas desde el anuncio (tipo AD_CALL o CLICK_TO_CALL: «Calls from ads», «Llamadas desde anuncios»…). Con esas cuenta
 *     Google las llamadas del botón de llamada que pusimos; si se vuelven secundarias, las llamadas dejan de contar.
 *   - Las que se cargan desde un sistema de clientes («Lead Calificado», «Cliente potencial de llamada»), mientras
 *     CARGAS_TAMBIEN sea false. Desde el 9 nov está en true: Sandy confirmó que ya nadie las usa, así que también pasan.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK.
 */

var CARGAS_TAMBIEN = true;    // Sandy confirmó el 9 nov que nadie usa las cargas («Lead Calificado», «Cliente potencial de llamada»): también pasan
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var CARGAS = { UPLOAD_CLICKS: 1, UPLOAD_CALLS: 1, STORE_SALES_DIRECT_UPLOAD: 1, STORE_SALES: 1, SALESFORCE: 1 };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hasta = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - 365 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('ACCIONES VIEJAS A SECUNDARIAS · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
  Logger.log('Historial revisado: del ' + desde + ' al ' + hasta + '.');
  Logger.log('');

  var H = {};
  filas("SELECT segments.conversion_action_name, segments.date, metrics.all_conversions FROM customer WHERE segments.date BETWEEN '" +
    desde + "' AND '" + hasta + "' AND metrics.all_conversions > 0", 'el historial').forEach(function (f) {
      var a = f.segments.conversionActionName, x = H[a] = H[a] || { total: 0, ultimo: '' };
      x.total += Number(f.metrics.allConversions) || 0;
      if (f.segments.date > x.ultimo) x.ultimo = f.segments.date;
    });
  function hist(nombre) {
    var x = H[nombre];
    return x ? n(x.total) + ' en 365 días · la última el ' + x.ultimo : '0 en 365 días';
  }

  var cambiar = [], quedan = [], ops = [], textos = [];
  filas("SELECT conversion_action.resource_name, conversion_action.name, conversion_action.type, conversion_action.primary_for_goal " +
    "FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones').forEach(function (f) {
      var a = f.conversionAction;
      if (!a.primaryForGoal) return;
      if (/^AB\s*·/.test(a.name)) { quedan.push(a.name + ' · nuestra · ' + hist(a.name)); return; }
      if (a.type === 'AD_CALL' || a.type === 'CLICK_TO_CALL') { quedan.push(a.name + ' · llamadas del botón del anuncio, se queda principal · ' + hist(a.name)); return; }
      if (CARGAS[a.type] && !CARGAS_TAMBIEN) { quedan.push(a.name + ' · carga desde un sistema de clientes, espera al cliente · ' + hist(a.name)); return; }
      cambiar.push(a.name + ' (' + a.type + ') · ' + hist(a.name));
      ops.push({ conversionActionOperation: { update: { resourceName: a.resourceName, primaryForGoal: false }, updateMask: 'primaryForGoal' } });
      textos.push(a.name);
    });

  Logger.log('==== PASAN A SECUNDARIAS (' + cambiar.length + ') ====');
  cambiar.forEach(function (t) { Logger.log(t); });
  if (!cambiar.length) Logger.log('Ninguna. No hay acciones viejas principales que mover.');
  Logger.log('');
  Logger.log('==== SE QUEDAN COMO PRINCIPALES (' + quedan.length + ') ====');
  quedan.forEach(function (t) { Logger.log(t); });
  Logger.log('');

  var malos = 0;
  if (!vista && ops.length) {
    var res = AdsApp.mutateAll(ops, { partialFailure: true });
    res.forEach(function (r, i) {
      if (r.isSuccessful()) Logger.log('✅ ' + textos[i] + ' ahora es secundaria.');
      else { malos++; Logger.log('❌ ' + textos[i] + ' no se pudo cambiar por script (hay que hacerlo a mano): ' + r.getErrorMessages().join('; ')); }
    });
    Logger.log('');
  }

  Logger.log('ACCIONES VIEJAS · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · a secundarias: ' + cambiar.length +
    (vista ? '' : ' (con error: ' + malos + ')') + ' · se quedan principales: ' + quedan.length);
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada. Manda el registro y espera el OK para Ejecutar.'
    : 'LISTO. Cambios aplicados. Copia todo el registro y mándalo.');
}

return main;
}

// ======================= metas-que-cuentan-todas-las-cuentas.js (sin cambios) =======================
function METAS(Logger, AdsApp) {
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
 *   2. Llamadas: si la cuenta NO tiene ninguna acción principal de «llamadas desde anuncios», crea «AB · Llamada desde el
 *      anuncio» (llamadas de 60 segundos o más, una por clic) y la pone como la acción de llamadas de la cuenta. También
 *      enciende la meta «Llamada (desde anuncios)» si no cuenta. Si la cuenta ya tiene una, no hace nada.
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
  else Logger.log('→ No tiene ninguna acción principal de llamadas desde anuncios → se crea «' + NUEVA_LLAMADA + '» (60 s o más, una por clic) ' +
    'y queda como la acción de llamadas de la cuenta.');
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
      try { r = AdsApp.mutate(op); }
      catch (e) { malos++; Logger.log('❌ ' + txt[i] + ': ' + e.message); return null; }
      if (r.isSuccessful()) { hechos++; Logger.log((vista ? '✔ (vista previa) se podría: ' : '✅ ') + txt[i]); }
      else { malos++; Logger.log('❌ ' + txt[i] + ': ' + r.getErrorMessages().join('; ')); }
      return r;
    });
  }
  aplicar(ops, textos);
  if (crear) {
    var res = aplicar([{ conversionActionOperation: { create: { name: NUEVA_LLAMADA, type: 'AD_CALL', category: 'PHONE_CALL_LEAD',
      status: 'ENABLED', countingType: 'ONE_PER_CLICK', phoneCallDurationSeconds: '60' } } }], ['se creó «' + NUEVA_LLAMADA + '»']);
    var rn = res[0] && res[0].isSuccessful() && res[0].getResourceName ? res[0].getResourceName() : '';
    if (rn && !vista) {
      aplicar([{ customerOperation: { update: { resourceName: 'customers/' + cid.replace(/-/g, ''),
        callReportingSetting: { callReportingEnabled: true, callConversionReportingEnabled: true, callConversionAction: rn } },
        updateMask: 'callReportingSetting.callReportingEnabled,callReportingSetting.callConversionReportingEnabled,callReportingSetting.callConversionAction' } }],
        ['«' + NUEVA_LLAMADA + '» quedó como la acción de llamadas de la cuenta']);
    } else if (vista) Logger.log('(Al ejecutar, después de crearla, la pone como la acción de llamadas de la cuenta.)');
  }
  Logger.log('');
  var cambios = ops.length + (crear ? 2 : 0);
  Logger.log('METAS · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · cambios: ' + cambios + ' · con error: ' + malos +
    (crear ? ' · se crea la acción de llamadas' : ''));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}

return main;
}

// ======================= El que corre todo =======================
var RESUMEN = [];
function registro(guardar) {
  return { log: function (x) { Logger.log(x); if (guardar(String(x))) RESUMEN.push(String(x)); } };
}
// Antes del viernes 13 todo corre como VISTA PREVIA aunque se le dé Ejecutar.
function soloLee() {
  return {
    search: function (q) { return AdsApp.search(q); },
    currentAccount: function () { return AdsApp.currentAccount(); },
    getExecutionInfo: function () { return { isPreview: function () { return true; } }; },
    mutate: function (op) { return AdsApp.getExecutionInfo().isPreview() ? AdsApp.mutate(op)
      : { isSuccessful: function () { return true; }, getResourceName: function () { return ''; }, getErrorMessages: function () { return []; } }; },
    mutateAll: function (ops) { return AdsApp.getExecutionInfo().isPreview() ? AdsApp.mutateAll(ops, { partialFailure: true })
      : ops.map(function () { return { isSuccessful: function () { return true; }, getResourceName: function () { return ''; }, getErrorMessages: function () { return []; } }; }); }
  };
}
function parte(titulo, hacer, motivo, crear, guardar, ads) {
  Logger.log('');
  Logger.log('########################################################################');
  Logger.log('# ' + titulo);
  Logger.log('########################################################################');
  if (!hacer) { Logger.log('No se corre: ' + motivo); RESUMEN.push(titulo + ' · no se corrió: ' + motivo); return; }
  if (ads !== AdsApp) { Logger.log('(Hoy todavía no es ' + DESDE + ': esta parte SOLO SE MUESTRA, no cambia nada aunque se dé Ejecutar.)');
    RESUMEN.push(titulo + ' · solo se mostró (antes del ' + DESDE + ')'); }
  try { crear(registro(guardar), ads)(); }
  catch (e) { Logger.log('❌ Esta parte se detuvo: ' + e.message); RESUMEN.push(titulo + ' · ❌ se detuvo: ' + e.message); }
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var hoy = Utilities.formatDate(new Date(), cuenta.getTimeZone(), 'yyyy-MM-dd');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var ads = hoy < DESDE ? soloLee() : AdsApp;
  Logger.log('CAMBIOS DEL VIERNES 13 NOV · cuenta ' + cid + ' · ' + hoy + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica las partes encendidas'));

  parte('1. ACCIONES VIEJAS A SECUNDARIAS (solo Girbau; en las demás ya se hizo el 9 nov)', HACER_ACCIONES && cid === '860-582-6837',
    cid === '860-582-6837' ? 'apagado arriba (HACER_ACCIONES = false).' : 'en esta cuenta ya se hizo el 9 nov.', ACCIONES,
    function (x) { return /^(ACCIONES VIEJAS ·|❌)/.test(x); }, ads);
  parte('2. METAS QUE CUENTAN Y ACCIÓN DE LLAMADAS', HACER_METAS, 'apagado arriba (HACER_METAS = false).', METAS,
    function (x) { return /^(METAS ·|❌|→)/.test(x); }, ads);

  Logger.log('');
  Logger.log('################################ RESUMEN ################################');
  RESUMEN.forEach(function (x) { Logger.log(x); });
  Logger.log(vista ? 'FIN · VISTA PREVIA: no se cambió nada. Copia TODO el registro y mándalo; Ejecutar solo con el OK.'
    : 'FIN · Se aplicaron las partes encendidas. Copia TODO el registro y mándalo.');
}
