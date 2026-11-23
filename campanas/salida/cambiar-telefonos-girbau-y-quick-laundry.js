// CAMBIAR TELEFONOS - Girbau y Quick Laundry (23 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR.
// POR QUE: el 20-nov cambiaron los vendedores y las paginas ya traen los numeros nuevos:
//   Girbau:        33 2806 8994  ->  33 5109 5680 (Teresa)
//   Quick Laundry: 33 2601 2237  ->  33 2806 8994 (Eduardo)
//   El numero viejo de Girbau ahora es el de Quick Laundry: si se queda en Girbau, esas llamadas le llegan al vendedor equivocado.
// QUE HACE en cada cuenta:
//   1. Busca donde esta el numero viejo: boton de llamada y boton de WhatsApp, en la cuenta, campanas y grupos.
//   2. Crea el boton NUEVO (llamada y WhatsApp) con el numero nuevo y lo pone EXACTAMENTE en los mismos lugares.
//   3. Solo si el nuevo quedo bien puesto, quita el viejo de esos lugares (no se borra el recurso, solo se despega).
//   No toca anuncios, palabras, presupuestos ni pujas. No pausa nada.
// VISTA PREVIA: muestra donde esta cada numero viejo y lo que haria. No cambia nada.
// EJECUTAR (con el OK): hace el cambio. Google revisa el boton nuevo (normalmente unas horas).
// DESHACER: copia en DESHACER lo que imprime "PARA DESHACER" y Ejecutar: quita los nuevos y vuelve a poner los viejos.
// WHATSAPP: Google solo admite uno por lugar, asi que se cambia en un solo paso (todo o nada).

var CAMBIOS = {
  '860-582-6837': { nombre: 'Girbau', viejo: '3328068994', nuevo: '33 5109 5680' },
  '256-397-2201': { nombre: 'Quick Laundry', viejo: '3326012237', nuevo: '33 2806 8994' }
};
var DESHACER = [];

function main() {
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('CAMBIAR TELEFONOS' + (DESHACER.length ? ' - DESHACER' : '') + (vista ? ' (VISTA PREVIA: no cambia nada)' : ' (EJECUTAR)'));
  Logger.log('');
  var ids = Object.keys(CAMBIOS), salida = [];
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(ids).get();
    while (it.hasNext()) {
      var a = it.next(); AdsManagerApp.select(a);
      try { salida = salida.concat(DESHACER.length ? deshacer(a.getCustomerId(), vista) : cuenta(a.getCustomerId(), vista)); }
      catch (e) { Logger.log('  ERROR: ' + e.message); }
      Logger.log('');
    }
  } else {
    var cid = AdsApp.currentAccount().getCustomerId();
    if (!CAMBIOS[cid]) { Logger.log('Esta cuenta no esta en la lista. No se hizo nada.'); return; }
    salida = DESHACER.length ? deshacer(cid, vista) : cuenta(cid, vista);
  }
  if (!vista && salida.length) Logger.log('PARA DESHACER: var DESHACER = [' + salida.join(', ') + '];');
  Logger.log(vista ? 'FIN. Vista previa: no se cambio nada. Mandame el registro.' : 'FIN. Mandame el registro.');
}

function leer(q) { var out = []; var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); return out; }
function digitos(s) { return String(s || '').replace(/\D/g, ''); }
function esViejo(num, viejo) { var d = digitos(num); return d.length >= 10 && d.slice(-10) === viejo; }

// Devuelve los lugares donde esta el numero viejo: [{tipo:'CALL'|'MSG', nivel, target, rn, asset, a}]
function buscar(info) {
  var lugares = [];
  var sel = 'asset.resource_name, asset.type, asset.call_asset.phone_number, asset.call_asset.country_code, ' +
    'asset.business_message_asset.message_provider, asset.business_message_asset.starter_message, ' +
    'asset.business_message_asset.whatsapp_info.phone_number, asset.business_message_asset.whatsapp_info.country_code, ' +
    'asset.business_message_asset.call_to_action.call_to_action_selection';
  function revisar(r, nivel, link, target, nombre) {
    var a = r.asset || {}, tipo = null;
    if (link.fieldType === 'CALL' && esViejo((a.callAsset || {}).phoneNumber, info.viejo)) tipo = 'CALL';
    if (link.fieldType === 'BUSINESS_MESSAGE' && esViejo(((a.businessMessageAsset || {}).whatsappInfo || {}).phoneNumber, info.viejo)) tipo = 'MSG';
    if (tipo) lugares.push({ tipo: tipo, nivel: nivel, target: target, nombre: nombre, rn: link.resourceName, asset: a.resourceName, a: a, campo: link.fieldType });
  }
  leer("SELECT customer_asset.resource_name, customer_asset.field_type, " + sel + " FROM customer_asset " +
    "WHERE customer_asset.status = 'ENABLED' AND customer_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE')").forEach(function (r) {
      revisar(r, 'cuenta', r.customerAsset, null, 'toda la cuenta');
    });
  leer("SELECT campaign.resource_name, campaign.name, campaign.status, campaign_asset.resource_name, campaign_asset.field_type, " + sel +
    " FROM campaign_asset WHERE campaign_asset.status = 'ENABLED' AND campaign.status != 'REMOVED' " +
    "AND campaign_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE')").forEach(function (r) {
      revisar(r, 'campana', r.campaignAsset, r.campaign.resourceName, r.campaign.name + (r.campaign.status === 'PAUSED' ? ' (en pausa)' : ''));
    });
  leer("SELECT ad_group.resource_name, ad_group.name, ad_group.status, campaign.name, ad_group_asset.resource_name, ad_group_asset.field_type, " + sel +
    " FROM ad_group_asset WHERE ad_group_asset.status = 'ENABLED' AND ad_group.status != 'REMOVED' " +
    "AND ad_group_asset.field_type IN ('CALL', 'BUSINESS_MESSAGE')").forEach(function (r) {
      revisar(r, 'grupo', r.adGroupAsset, r.adGroup.resourceName, r.campaign.name + ' > ' + r.adGroup.name);
    });
  return lugares;
}

function enlace(nivel, target, asset, campo) {
  if (nivel === 'cuenta') return { customerAssetOperation: { create: { asset: asset, fieldType: campo } } };
  if (nivel === 'campana') return { campaignAssetOperation: { create: { campaign: target, asset: asset, fieldType: campo } } };
  return { adGroupAssetOperation: { create: { adGroup: target, asset: asset, fieldType: campo } } };
}
function quitar(nivel, rn) {
  if (nivel === 'cuenta') return { customerAssetOperation: { remove: rn } };
  if (nivel === 'campana') return { campaignAssetOperation: { remove: rn } };
  return { adGroupAssetOperation: { remove: rn } };
}

function cuenta(cidGuiones, vista) {
  var info = CAMBIOS[cidGuiones], cid = cidGuiones.replace(/-/g, '');
  Logger.log('==== ' + info.nombre + ' (' + cidGuiones + '): ' + info.viejo + ' -> ' + info.nuevo + ' ====');
  var lugares = buscar(info);
  if (!lugares.length) { Logger.log('  El numero viejo no esta en ningun boton activo. Nada que cambiar.'); return []; }
  var porTipo = { CALL: [], MSG: [] };
  lugares.forEach(function (l) { porTipo[l.tipo].push(l); Logger.log('  ' + (l.tipo === 'CALL' ? 'Llamada ' : 'WhatsApp') + ' viejo en ' + l.nivel + ': ' + l.nombre); });

  if (!vista) {
    var tz = AdsApp.currentAccount().getTimeZone(), hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
    var ch = leer("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy +
      " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 20");
    if (ch.length) { Logger.log('  ALTO: ya hubo un cambio HOY en ' + info.nombre + '. No se aplico nada. Avisame.'); return []; }
  }

  // Fase 1: boton de LLAMADA nuevo en los mismos lugares (se agrega junto al viejo)
  var nuevosLinks = [], viejos = [];
  if (porTipo.CALL.length) {
    var tmpC = 'customers/' + cid + '/assets/-1', vistos = {};
    var ops = [{ assetOperation: { create: { resourceName: tmpC, callAsset: { countryCode: 'MX', phoneNumber: info.nuevo } } } }];
    var txt = ['crear llamada ' + info.nuevo];
    porTipo.CALL.forEach(function (l) {
      var k = l.nivel + '|' + l.target; if (vistos[k]) return; vistos[k] = 1;
      ops.push(enlace(l.nivel, l.target, tmpC, l.campo)); txt.push('  ponerlo en ' + l.nivel + ': ' + l.nombre);
    });
    var res = AdsApp.mutateAll(ops, { partialFailure: true }), okCall = true;
    for (var i = 0; i < res.length; i++) {
      if (!res[i].isSuccessful()) { okCall = false; Logger.log('  ERROR ' + txt[i] + ': ' + res[i].getErrorMessages().join('; ')); }
      else {
        Logger.log('  ' + (vista ? 'se puede: ' : 'LISTO: ') + txt[i]);
        if (!vista && i > 0) nuevosLinks.push(quitarTexto(ops[i], res[i].getResourceName()));
      }
    }
    // Fase 2: quitar la llamada vieja, solo si la nueva quedo bien
    if (!okCall) Logger.log('  El boton de llamada nuevo no quedo: el viejo se queda puesto.');
    else {
      var ops2 = porTipo.CALL.map(function (l) { return quitar(l.nivel, l.rn); });
      var res2 = AdsApp.mutateAll(ops2, { partialFailure: true });
      for (var j = 0; j < res2.length; j++) {
        var l2 = porTipo.CALL[j];
        Logger.log('  ' + (res2[j].isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + 'quitar llamada vieja de ' + l2.nivel + ': ' + l2.nombre +
          (res2[j].isSuccessful() ? '' : ': ' + res2[j].getErrorMessages().join('; ')));
        if (!vista && res2[j].isSuccessful()) viejos.push(viejoTexto(l2));
      }
    }
  }

  // Fase 3: WHATSAPP. Google permite uno solo por lugar, asi que se cambia en UN solo paso, todo o nada:
  // crea el nuevo, quita el viejo y pone el nuevo. Si algo falla, no se cambia nada y el viejo sigue.
  if (porTipo.MSG.length) {
    var b = porTipo.MSG[0].a.businessMessageAsset || {}, tmpM = 'customers/' + cid + '/assets/-2', vistosM = {};
    var opsM = [{ assetOperation: { create: { resourceName: tmpM, businessMessageAsset: { messageProvider: 'WHATSAPP',
      starterMessage: b.starterMessage || 'Hola, quiero una cotizacion', whatsappInfo: { countryCode: 'MX', phoneNumber: info.nuevo } } } } }];
    var txtM = ['crear WhatsApp ' + info.nuevo];
    porTipo.MSG.forEach(function (l) { opsM.push(quitar(l.nivel, l.rn)); txtM.push('  quitar el WhatsApp viejo de ' + l.nivel + ': ' + l.nombre); });
    porTipo.MSG.forEach(function (l) {
      var k = l.nivel + '|' + l.target; if (vistosM[k]) return; vistosM[k] = 1;
      opsM.push(enlace(l.nivel, l.target, tmpM, l.campo)); txtM.push('  poner el WhatsApp nuevo en ' + l.nivel + ': ' + l.nombre);
    });
    var resM = null;
    try { resM = AdsApp.mutateAll(opsM); } catch (e) { Logger.log('  ERROR WhatsApp: ' + e.message); }
    var okM = !!resM;
    if (resM) for (var m = 0; m < resM.length; m++) if (!resM[m].isSuccessful()) okM = false;
    if (!okM) {
      if (resM) for (var m2 = 0; m2 < resM.length; m2++)
        if (!resM[m2].isSuccessful() && resM[m2].getErrorMessages().length) Logger.log('  ERROR ' + txtM[m2] + ': ' + resM[m2].getErrorMessages().join('; '));
      Logger.log('  No se cambio nada del WhatsApp (todo o nada): el viejo sigue puesto.');
    } else {
      for (var m3 = 0; m3 < resM.length; m3++) {
        Logger.log('  ' + (vista ? 'se puede: ' : 'LISTO: ') + txtM[m3]);
        if (!vista && esCrearEnlace(opsM[m3])) nuevosLinks.push(quitarTexto(opsM[m3], resM[m3].getResourceName()));
      }
      if (!vista) porTipo.MSG.forEach(function (l) { viejos.push(viejoTexto(l)); });
    }
  }
  if (vista) return [];
  return ["{c: '" + cidGuiones + "', quitar: [" + nuevosLinks.join(', ') + "], poner: [" + viejos.join(', ') + "]}"];
}

function esCrearEnlace(op) {
  var o = op.customerAssetOperation || op.campaignAssetOperation || op.adGroupAssetOperation;
  return !!(o && o.create);
}
function viejoTexto(l) {
  return "{n: '" + l.nivel + "', t: " + (l.target ? "'" + l.target + "'" : 'null') + ", a: '" + l.asset + "', f: '" + l.campo + "'}";
}
function quitarTexto(op, rn) {
  var nivel = op.customerAssetOperation ? 'cuenta' : (op.campaignAssetOperation ? 'campana' : 'grupo');
  return "{n: '" + nivel + "', rn: '" + rn + "'}";
}

function deshacer(cidGuiones, vista) {
  var ops = [], txt = [];
  DESHACER.forEach(function (d) {
    if (d.c !== cidGuiones) return;
    (d.quitar || []).forEach(function (q) { ops.push(quitar(q.n, q.rn)); txt.push('quitar el nuevo de ' + q.n); });
    (d.poner || []).forEach(function (p) { ops.push(enlace(p.n, p.t, p.a, p.f)); txt.push('volver a poner el viejo en ' + p.n); });
  });
  Logger.log('==== ' + CAMBIOS[cidGuiones].nombre + ' (' + cidGuiones + ') ====');
  if (!ops.length) { Logger.log('  Nada que deshacer aqui.'); return []; }
  // Todo o nada: primero quita los nuevos y luego vuelve a poner los viejos (el WhatsApp solo admite uno por lugar)
  var res = AdsApp.mutateAll(ops);
  for (var i = 0; i < res.length; i++)
    Logger.log('  ' + (res[i].isSuccessful() ? (vista ? 'se puede: ' : 'LISTO: ') : 'ERROR ') + txt[i] + (res[i].isSuccessful() ? '' : ': ' + res[i].getErrorMessages().join('; ')));
  return [];
}
