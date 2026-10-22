/**
 * Atelback · Botón de llamada en las campañas nuevas — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): agrega el teléfono de la marca
 * como recurso de llamada a cada campaña «AB ·», para que el anuncio muestre el botón «Llamar». Solo se muestra en el
 * horario del plan. Si el número ya existe en la cuenta, lo reutiliza. No toca anuncios, palabras, presupuestos ni
 * campañas anteriores, ni quita ningún teléfono que ya exista.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 * Google revisa el número (suele tardar de unas horas a un día). Ayuda que el mismo número aparezca en la página.
 */

var PLANES = [{"cuenta": "", "nombre": "Gamesail", "prefijo": "AB · ", "telefono": "33 1185 9797", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18, "sabado": {"desde": 9, "hasta": 14}}}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "prefijo": "AB · ", "telefono": "33 2601 2237", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18, "sabado": {"desde": 9, "hasta": 14}}}, {"cuenta": "993-525-8739", "nombre": "CLM", "prefijo": "AB · ", "telefono": "33 1564 1538", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18, "sabado": {"desde": 9, "hasta": 14}}}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "prefijo": "AB · ", "telefono": "33 1417 2994", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18, "sabado": {"desde": 9, "hasta": 14}}}, {"cuenta": "860-582-6837", "nombre": "Girbau", "prefijo": "AB · ", "telefono": "33 2806 8994", "horario": {"dias": ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], "desde": 9, "hasta": 18, "sabado": {"desde": 9, "hasta": 14}}}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var DIAS = { MONDAY: 'lunes', TUESDAY: 'martes', WEDNESDAY: 'miércoles', THURSDAY: 'jueves', FRIDAY: 'viernes', SATURDAY: 'sábado', SUNDAY: 'domingo' };

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  PLANES.forEach(function (p) {
    if (p.cuenta === cid || (!p.cuenta && CUENTA_NUEVA && CUENTA_NUEVA === cid)) PLAN = p;
  });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  return cid;
}

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
// Últimos 10 dígitos: así «+52 1 33 …», «33 …» y «(33) …» cuentan como el mismo número.
function digitos(t) { return String(t || '').replace(/\D/g, '').slice(-10); }

function horario() {
  var h = PLAN.horario, out = [];
  h.dias.forEach(function (d) { out.push({ dayOfWeek: d, startHour: h.desde, startMinute: 'ZERO', endHour: h.hasta, endMinute: 'ZERO' }); });
  if (h.sabado) out.push({ dayOfWeek: 'SATURDAY', startHour: h.sabado.desde, startMinute: 'ZERO', endHour: h.sabado.hasta, endMinute: 'ZERO' });
  return out;
}
function horarioTexto() {
  var h = PLAN.horario;
  return DIAS[h.dias[0]] + ' a ' + DIAS[h.dias[h.dias.length - 1]] + ' de ' + h.desde + ' a ' + h.hasta + ' h' +
    (h.sabado ? '; sábado de ' + h.sabado.desde + ' a ' + h.sabado.hasta + ' h' : '');
}

function main() {
  var cid = revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('BOTÓN DE LLAMADA · ' + PLAN.nombre + ' · ' + PLAN.telefono + ' · ' + horarioTexto() + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  var nuestro = digitos(PLAN.telefono);
  if (nuestro.length !== 10) throw new Error('El teléfono del plan («' + PLAN.telefono + '») no tiene 10 dígitos. No se hizo nada.');

  var campanas = filas("SELECT campaign.resource_name, campaign.name, campaign.status FROM campaign WHERE campaign.status != 'REMOVED'", 'las campañas')
    .filter(function (f) { return esNueva(f.campaign.name); });
  if (!campanas.length) throw new Error('No hay campañas «' + PLAN.prefijo + '» en esta cuenta. No se hizo nada.');

  // ¿El número ya existe como recurso de la cuenta?
  var existente = '';
  filas("SELECT asset.resource_name, asset.call_asset.phone_number FROM asset WHERE asset.type = 'CALL'", 'los teléfonos de la cuenta')
    .forEach(function (f) { if (!existente && digitos((f.asset.callAsset || {}).phoneNumber) === nuestro) existente = f.asset.resourceName; });

  // Teléfonos que ya tiene cada campaña nueva.
  var tiene = {};
  filas("SELECT campaign.name, asset.call_asset.phone_number FROM campaign_asset WHERE campaign_asset.field_type = 'CALL' " +
    "AND campaign_asset.status != 'REMOVED'", 'los teléfonos de las campañas').forEach(function (f) {
    (tiene[f.campaign.name] = tiene[f.campaign.name] || []).push(digitos((f.asset.callAsset || {}).phoneNumber));
  });

  var ops = [], donde = [], avisos = [];
  var recurso = existente || ('customers/' + cid.replace(/-/g, '') + '/assets/-1');
  var faltan = campanas.filter(function (f) {
    var t = tiene[f.campaign.name] || [];
    if (t.indexOf(nuestro) >= 0) { Logger.log('Ya lo tiene: «' + f.campaign.name + '»'); return false; }
    if (t.length) { avisos.push('«' + f.campaign.name + '» ya tiene otro teléfono (…' + t.join(', …') + '). No se toca: revísala a mano.'); return false; }
    return true;
  });
  if (faltan.length && !existente) {
    ops.push({ assetOperation: { create: { resourceName: recurso, callAsset: { countryCode: 'MX', phoneNumber: nuestro, adScheduleTargets: horario() } } } });
    donde.push('el teléfono ' + PLAN.telefono);
  }
  faltan.forEach(function (f) {
    ops.push({ campaignAssetOperation: { create: { campaign: f.campaign.resourceName, asset: recurso, fieldType: 'CALL' } } });
    donde.push('«' + f.campaign.name + '»' + (f.campaign.status === 'PAUSED' ? ' (está en pausa)' : ''));
  });
  avisos.forEach(function (t) { Logger.log('AVISO: ' + t); });
  if (existente && faltan.length) Logger.log('El número ya existe en la cuenta: se reutiliza tal como está, con su horario actual.');
  if (!ops.length) { Logger.log('Nada que agregar: las campañas nuevas ya tienen su botón de llamada.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) Logger.log((vista ? 'SE AGREGARÍA ' : 'AGREGADO ') + donde[i]);
    else { malos++; Logger.log('ERROR en ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) {
    Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.' : 'VISTA PREVIA SIN ERRORES. Da EJECUTAR.');
  } else {
    Logger.log('LISTO: ' + (ops.length - malos) + ' cambio(s) aplicados' + (malos ? ', ' + malos + ' con error' : '') +
      '. Google revisa el número en unas horas; mientras, puede salir «En revisión».');
  }
}
