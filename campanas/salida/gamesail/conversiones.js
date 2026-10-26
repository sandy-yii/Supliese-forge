/**
 * Atelback · Conversiones de la página — Gamesail (118-347-6484)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE:
 *   1. Crea las acciones de conversión de la página (formulario, WhatsApp, teléfono, correo) si no existen.
 *   2. Crea «Llamadas desde anuncios» si la cuenta no tiene una.
 *   3. Activa el etiquetado automático si está apagado.
 *   4. Deja en el registro el ID y las etiquetas que van en la página (variables para el código de medición).
 * No modifica ni borra las acciones de conversión que ya existen: solo las lista.
 *
 * CÓMO SE USA (dentro de la cuenta):
 *   1. Herramientas > Acciones masivas > Secuencias de comandos > "+" > pegar este archivo completo > Autorizar.
 *   2. VISTA PREVIA: no crea nada. Revisar el registro.
 *   3. EJECUTAR. Al final del registro salen las variables para la página: se le pasan a quien programa el sitio.
 */

var PLAN = {"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/"};

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

// Acciones de la página. «variable» es el nombre de la variable de entorno del código de medición.
var ACCIONES = [
  { nombre: 'AB · Formulario enviado', categoria: 'SUBMIT_LEAD_FORM', principal: true, variable: 'NEXT_PUBLIC_GADS_LABEL_FORMULARIO' },
  { nombre: 'AB · Clic en WhatsApp', categoria: 'CONTACT', principal: true, variable: 'NEXT_PUBLIC_GADS_LABEL_WHATSAPP' },
  { nombre: 'AB · Clic en teléfono de la página', categoria: 'CONTACT', principal: false, variable: 'NEXT_PUBLIC_GADS_LABEL_LLAMADA' },
  { nombre: 'AB · Clic en correo', categoria: 'CONTACT', principal: false, variable: 'NEXT_PUBLIC_GADS_LABEL_CORREO' }
];
var LLAMADAS = 'AB · Llamadas desde anuncios';

function main() {
  var cid = revisarCuenta();
  var c = cid.replace(/-/g, '');
  var vista = AdsApp.getExecutionInfo().isPreview();

  var existentes = [], porNombre = {}, hayLlamadas = false;
  var it = AdsApp.search('SELECT conversion_action.name, conversion_action.type, conversion_action.status, ' +
    'conversion_action.primary_for_goal, conversion_action.category FROM conversion_action ' +
    "WHERE conversion_action.status != 'REMOVED'");
  while (it.hasNext()) {
    var a = it.next().conversionAction;
    existentes.push(a);
    porNombre[a.name] = a;
    if (a.type === 'AD_CALL' && a.status === 'ENABLED') hayLlamadas = true;
  }

  Logger.log('Acciones de conversión que ya existen (no se modifican):');
  existentes.forEach(function (a) {
    Logger.log('  ' + a.name + ' · ' + a.type + ' · ' + a.status + ' · ' + (a.primaryForGoal ? 'Principal' : 'Secundaria'));
  });
  existentes.forEach(function (a) {
    if (a.primaryForGoal && /chat|bot|mensaje|visita|engagement|local/i.test(a.name)) {
      Logger.log('AVISO: «' + a.name + '» es Principal y no parece un cliente. Conviene pasarla a Secundaria a mano.');
    }
  });

  var ops = [];
  ACCIONES.forEach(function (x) {
    if (porNombre[x.nombre]) { Logger.log('Ya existe «' + x.nombre + '»: no se crea otra.'); return; }
    ops.push({ nombre: x.nombre, op: { conversionActionOperation: { create: {
      name: x.nombre, type: 'WEBPAGE', category: x.categoria, status: 'ENABLED', countingType: 'ONE_PER_CLICK',
      primaryForGoal: x.principal, clickThroughLookbackWindowDays: 30,
      valueSettings: { defaultValue: 1, defaultCurrencyCode: 'MXN', alwaysUseDefaultValue: true } } } } });
  });
  if (!hayLlamadas && !porNombre[LLAMADAS]) {
    ops.push({ nombre: LLAMADAS, op: { conversionActionOperation: { create: {
      name: LLAMADAS, type: 'AD_CALL', category: 'PHONE_CALL_LEAD', status: 'ENABLED', countingType: 'ONE_PER_CLICK',
      primaryForGoal: true, phoneCallDurationSeconds: 60, clickThroughLookbackWindowDays: 30,
      valueSettings: { defaultValue: 1, defaultCurrencyCode: 'MXN', alwaysUseDefaultValue: true } } } } });
  } else {
    Logger.log('La cuenta ya mide llamadas desde anuncios: no se crea otra acción.');
  }

  var itu = AdsApp.search('SELECT customer.auto_tagging_enabled FROM customer');
  if (itu.hasNext() && !itu.next().customer.autoTaggingEnabled) {
    ops.push({ nombre: 'Etiquetado automático', op: { customerOperation: {
      update: { resourceName: 'customers/' + c, autoTaggingEnabled: true }, updateMask: 'autoTaggingEnabled' } } });
  }

  // Una por una: si una falla (por ejemplo, la de llamadas), las demás sí se crean.
  var fallas = 0;
  ops.forEach(function (o) {
    var r = AdsApp.mutate(o.op);
    if (r.isSuccessful()) Logger.log((vista ? 'Vista previa sin error: ' : 'Hecho: ') + o.nombre);
    else { fallas++; Logger.log('ERROR en «' + o.nombre + '»: ' + r.getErrorMessages().join('; ')); }
  });

  if (vista) {
    Logger.log(fallas ? 'VISTA PREVIA CON ' + fallas + ' ERROR(ES): revisa el registro antes de ejecutar.'
                      : 'VISTA PREVIA SIN ERRORES. Da EJECUTAR; al final saldrán las variables para la página.');
    return;
  }

  var id = '', etiquetas = {};
  var its = AdsApp.search("SELECT conversion_action.name, conversion_action.tag_snippets FROM conversion_action " +
    "WHERE conversion_action.status = 'ENABLED'");
  while (its.hasNext()) {
    var f = its.next().conversionAction;
    (f.tagSnippets || []).forEach(function (s) {
      var m = /send_to['"]?\s*:\s*['"](AW-\d+)\/([^'"]+)['"]/.exec(s.eventSnippet || '');
      if (m) { id = m[1]; etiquetas[f.name] = m[2]; }
    });
  }
  Logger.log('');
  Logger.log('VARIABLES PARA LA PÁGINA ' + PLAN.url + ' (pásalas a quien programa el sitio):');
  Logger.log('NEXT_PUBLIC_GADS_ID=' + (id || 'NO ENCONTRADO: revisa Objetivos > Conversiones > (acción) > Configurar etiqueta'));
  ACCIONES.forEach(function (x) {
    Logger.log(x.variable + '=' + (etiquetas[x.nombre] || ''));
  });
  Logger.log(fallas ? 'TERMINÓ CON ' + fallas + ' ERROR(ES): revisa el registro.' : 'LISTO.');
}
