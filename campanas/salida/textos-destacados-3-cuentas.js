// TEXTOS DESTACADOS que faltan - Gamesail, Quick Laundry y Laundry Solutions (19 nov 2026)
// Solo ASCII (los acentos van como \u00e1, etc.) para que se pegue sin errores.
// Se pega en la CUENTA DE ADMINISTRADOR (recorre las 3 cuentas). Tambien sirve pegado dentro de una de ellas.
//
// POR QUE: TrueClicks (lectura del 19 nov) mostro que estas 3 cuentas NO tienen ningun texto destacado
//   a nivel cuenta (Gamesail 0% de campanas con ellos). Son las frases cortas bajo el anuncio
//   ("Cotiza por WhatsApp", "Te Ayudamos a Elegir"). Hacen el anuncio mas grande y suben la calidad.
//   Los textos son los mismos que se revisaron el 12 nov (script anuncios-y-extensiones-nuevos, que nunca se corrio).
// QUE HACE: SOLO AGREGA textos destacados a nivel cuenta. No toca anuncios, palabras, presupuestos,
//   pujas, paginas ni conversiones. No pausa ni borra nada. Las campanas que ya tienen sus propios
//   textos destacados siguen usando los suyos.
// CANDADOS PARA NO FRENAR LEADS:
//   - Si la cuenta ya tiene textos destacados, no agrega nada.
//   - Si ya hubo un cambio HOY en la cuenta, en Ejecutar no aplica nada en esa cuenta (un cambio por cuenta al dia).
//   - Revisa que cada texto tenga 25 caracteres o menos.
//   - Girbau NO va: esta semana no se mueve nada en Girbau (apelacion en curso). Va la semana del 24.
// DESHACER (el mismo dia si algo sale mal): poner DESHACER = true y Ejecutar. Quita de la cuenta
//   SOLO estos textos destacados; todo queda como antes.
// USO: borrar todo > pegar > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR solo con el OK.

var DESHACER = false;

var PLAN = {
  '118-347-6484': { marca: 'Gamesail',
    textos: ['Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'De 17 a 130 kg', 'Montaje Suave', 'Para Ropa y S\u00e1banas', 'Equipo para Hoteles'] },
  '256-397-2201': { marca: 'Quick Laundry',
    textos: ['Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'Equipo LG y Maytag', 'Con o sin Fichero', 'Para tu Lavander\u00eda'] },
  '265-909-2662': { marca: 'Laundry Solutions',
    textos: ['Agenda tu Servicio', 'Habla con un T\u00e9cnico', 'Diagn\u00f3stico de tu Equipo', 'Mantenimiento Preventivo', 'Mantenimiento Correctivo', 'Lavadoras y Secadoras'] }
};

function main() {
  var ids = Object.keys(PLAN);
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get(), vistas = 0;
    while (it.hasNext()) { AdsManagerApp.select(it.next()); cuenta(); vistas++; }
    if (vistas < ids.length) Logger.log('AVISO: solo encontre ' + vistas + ' de ' + ids.length + ' cuentas desde el administrador.');
  } else {
    cuenta();
  }
  Logger.log('');
  Logger.log(AdsApp.getExecutionInfo().isPreview() ? 'LISTO. Vista previa: no se cambio nada. Manda todo el registro.' : 'LISTO. Copia todo el registro y mandalo.');
}

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function norm(t) { return String(t || '').toLowerCase().replace(/\s+/g, ' ').trim(); }

function cuenta() {
  var c = AdsApp.currentAccount(), cid = c.getCustomerId(), cidNum = cid.replace(/-/g, '');
  var P = PLAN[cid];
  Logger.log('');
  if (!P) { Logger.log('La cuenta ' + cid + ' no esta en el plan. No se hizo nada en ella.'); return; }
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('==== TEXTOS DESTACADOS - ' + P.marca + ' (' + cid + ') - ' + (vista ? 'VISTA PREVIA: no cambia nada' : (DESHACER ? 'DESHACER' : 'EJECUTAR: agrega')) + ' ====');

  var actuales = filas("SELECT customer_asset.resource_name, asset.callout_asset.callout_text FROM customer_asset " +
    "WHERE customer_asset.field_type = 'CALLOUT' AND customer_asset.status = 'ENABLED'", 'los textos destacados de la cuenta');
  var ops = [], textos = [];

  if (DESHACER) {
    var nuestros = {}; P.textos.forEach(function (t) { nuestros[norm(t)] = true; });
    actuales.forEach(function (f) {
      var t = f.asset.calloutAsset.calloutText;
      if (!nuestros[norm(t)]) return;
      Logger.log('QUITA de la cuenta "' + t + '"');
      ops.push({ customerAssetOperation: { remove: f.customerAsset.resourceName } });
      textos.push('quitar "' + t + '"');
    });
    if (!ops.length) Logger.log('No hay textos de este script en la cuenta. Nada que deshacer.');
    aplicar(ops, textos, vista);
    return;
  }

  if (actuales.length) {
    Logger.log('La cuenta ya tiene ' + actuales.length + ' texto(s) destacado(s): no se agrega nada.');
    actuales.forEach(function (f) { Logger.log('   ya esta: "' + f.asset.calloutAsset.calloutText + '"'); });
    return;
  }

  var tmp = -1, vistos = {};
  P.textos.forEach(function (t) {
    if (vistos[norm(t)]) return; vistos[norm(t)] = true;
    if (t.length > 25) { Logger.log('SE OMITE (mas de 25 caracteres): "' + t + '"'); return; }
    var rn = 'customers/' + cidNum + '/assets/' + (tmp--);
    Logger.log('AGREGA "' + t + '"');
    ops.push({ assetOperation: { create: { resourceName: rn, calloutAsset: { calloutText: t } } } });
    textos.push('crear "' + t + '"');
    ops.push({ customerAssetOperation: { create: { asset: rn, fieldType: 'CALLOUT' } } });
    textos.push('ligar "' + t + '" a la cuenta');
  });

  if (!vista && ops.length) {
    var tz = c.getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    var cambios = filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 50", 'los cambios de hoy');
    if (cambios.length) {
      Logger.log('ALTO: ya hubo ' + cambios.length + ' cambio(s) HOY en ' + P.marca + '. No se aplico nada aqui. Correlo manana.');
      return;
    }
  }
  aplicar(ops, textos, vista);
}

function aplicar(ops, textos, vista) {
  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('ERROR ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('OK ' + textos[i]);
    });
  }
  Logger.log('Operaciones: ' + ops.length + ' - con error: ' + malos + (vista && malos ? ' -> mandame esto antes de ejecutar' : ''));
}
