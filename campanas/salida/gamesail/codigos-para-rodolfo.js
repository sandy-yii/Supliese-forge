/**
 * Atelback · Códigos de medición para la página — Gamesail (118-347-6484)
 * Escrito a mano el 4 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. Saca el ID de Google Ads y las etiquetas de las acciones «AB ·» para que Rodolfo las ponga en
 * gamesail.mx. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var CUENTA = '118-347-6484';
var VARIABLES = {
  'AB · Clic en WhatsApp': 'NEXT_PUBLIC_GADS_LABEL_WHATSAPP',
  'AB · Formulario enviado': 'NEXT_PUBLIC_GADS_LABEL_FORMULARIO',
  'AB · Clic en teléfono de la página': 'NEXT_PUBLIC_GADS_LABEL_LLAMADA',
  'AB · Clic en correo': 'NEXT_PUBLIC_GADS_LABEL_CORREO'
};

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== CUENTA) throw new Error('Este script es solo para Gamesail (' + CUENTA + '). Estás en ' + cid + '. No se hizo nada.');
  var id = '', etiquetas = {}, todas = [];
  var it = AdsApp.search("SELECT conversion_action.name, conversion_action.type, conversion_action.status, conversion_action.tag_snippets " +
    "FROM conversion_action WHERE conversion_action.status != 'REMOVED'");
  while (it.hasNext()) {
    var f = it.next().conversionAction;
    todas.push(f.name + ' · ' + f.type + ' · ' + f.status);
    (f.tagSnippets || []).forEach(function (s) {
      var m = /send_to['"]?\s*:\s*['"](AW-\d+)\/([^'"]+)['"]/.exec(s.eventSnippet || '');
      if (m) { id = m[1]; etiquetas[f.name] = m[2]; }
    });
  }
  Logger.log('ACCIONES DE CONVERSIÓN EN LA CUENTA:');
  todas.forEach(function (t) { Logger.log('  ' + t); });
  Logger.log('');
  Logger.log('CÓDIGOS PARA RODOLFO (gamesail.mx):');
  Logger.log('NEXT_PUBLIC_GADS_ID=' + (id || 'NO ENCONTRADO'));
  Object.keys(VARIABLES).forEach(function (n) {
    Logger.log(VARIABLES[n] + '=' + (etiquetas[n] || 'NO ENCONTRADO (falta la acción «' + n + '»)'));
  });
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
