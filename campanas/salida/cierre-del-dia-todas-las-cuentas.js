/**
 * Atelback · Cierre del día — las cinco cuentas
 * Escrito a mano el 4 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Resume lo de HOY (desde las 0:00 hasta la hora en que se corre) en TODAS las
 * campañas que tuvieron movimiento hoy, nuevas «AB ·» y anteriores (incluida Máximo rendimiento):
 *   - clics, gasto y costo por clic de la cuenta y de cada campaña;
 *   - contactos de hoy por tipo (WhatsApp, llamada, formulario, otros) y por campaña;
 *   - una línea final «PARA LA JUNTA» lista para el informe del día siguiente.
 * Sirve para correrlo cada noche (de preferencia después de las 9 p. m.) y presentar el día a la mañana siguiente.
 * Google tarda hasta 3 horas en mostrar algunos contactos: lo de las últimas horas puede subir un poco al día siguiente.
 *
 * CÓMO SE USA: en cada cuenta > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry',
  '993-525-8739': 'Kingstar (CLM)',
  '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau',
  '118-347-6484': 'Gamesail'
};
// Qué cuenta como contacto (mismo criterio que los demás informes).
var CONTACTO = /conversa|conversation|mensaje|message|whats|\bwa\b|llamad|call|formul|lead|contact/i;

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function dinero(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function uno(x) { return Math.round(x * 10) / 10; }
function tipo(nombre) {
  if (/whats|\bwa\b|mensaje|message|conversa|conversation/i.test(nombre)) return 'WhatsApp';
  if (/formul|lead/i.test(nombre)) return 'Formulario';
  if (/llamad|call|tel[eé]fono/i.test(nombre)) return 'Llamada';
  return 'Otro';
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var marca = MARCAS[cid] || AdsApp.currentAccount().getName();
  var zona = AdsApp.currentAccount().getTimeZone();
  var hoy = Utilities.formatDate(new Date(), zona, 'yyyy-MM-dd');
  var hora = Utilities.formatDate(new Date(), zona, 'HH:mm');
  Logger.log('CIERRE DEL DÍA · ' + marca + ' · ' + hoy + ' hasta las ' + hora + ' · solo lee');
  Logger.log('');

  // Campañas con movimiento hoy (todas: nuevas y anteriores, de cualquier tipo)
  var C = {}, tot = { clics: 0, costo: 0, impr: 0 };
  filas("SELECT campaign.name, campaign.status, campaign.advertising_channel_type, metrics.clicks, metrics.cost_micros, metrics.impressions " +
    "FROM campaign WHERE segments.date DURING TODAY AND metrics.impressions > 0", 'las campañas de hoy').forEach(function (f) {
    var c = { nombre: f.campaign.name, tipo: f.campaign.advertisingChannelType, clics: Number(f.metrics.clicks || 0),
      costo: Number(f.metrics.costMicros || 0) / 1e6, impr: Number(f.metrics.impressions || 0), contactos: 0 };
    C[c.nombre] = c;
    tot.clics += c.clics; tot.costo += c.costo; tot.impr += c.impr;
  });

  // Contactos de hoy por acción y campaña
  var porTipo = { WhatsApp: 0, Llamada: 0, Formulario: 0, Otro: 0 }, total = 0, acciones = {};
  filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign " +
    "WHERE segments.date DURING TODAY AND metrics.all_conversions > 0", 'los contactos de hoy').forEach(function (f) {
    var n = f.segments.conversionActionName || '', v = Number(f.metrics.allConversions || 0);
    if (!CONTACTO.test(n)) return;
    total += v;
    porTipo[tipo(n)] += v;
    acciones[n] = (acciones[n] || 0) + v;
    if (C[f.campaign.name]) C[f.campaign.name].contactos += v;
  });

  Logger.log('==== HOY, TODA LA CUENTA ====');
  Logger.log(tot.clics + ' clics · ' + dinero(tot.costo) + ' · costo por clic ' + (tot.clics ? '$' + (tot.costo / tot.clics).toFixed(2) : '—') +
    ' · ' + uno(total) + ' contacto(s)');
  Logger.log('');
  Logger.log('==== POR CAMPAÑA (hoy) ====');
  Object.keys(C).sort(function (a, b) { return C[b].costo - C[a].costo; }).forEach(function (k) {
    var c = C[k];
    Logger.log(k + (c.tipo === 'PERFORMANCE_MAX' ? ' (Máximo rendimiento)' : '') + ' · ' + c.clics + ' clics · ' + dinero(c.costo) +
      ' · ' + uno(c.contactos) + ' contacto(s)');
  });
  if (!Object.keys(C).length) Logger.log('Ninguna campaña tuvo movimiento hoy.');
  Logger.log('');
  Logger.log('==== CONTACTOS DE HOY POR ACCIÓN ====');
  Object.keys(acciones).forEach(function (n) { Logger.log('«' + n + '»: ' + uno(acciones[n])); });
  if (!Object.keys(acciones).length) Logger.log('Ninguno registrado todavía.');
  Logger.log('');
  Logger.log('PARA LA JUNTA · ' + marca + ' · ' + hoy + ' hasta ' + hora + ' · contactos ' + uno(total) +
    ' (WhatsApp ' + uno(porTipo.WhatsApp) + ', llamada ' + uno(porTipo.Llamada) + ', formulario ' + uno(porTipo.Formulario) +
    (porTipo.Otro ? ', otros ' + uno(porTipo.Otro) : '') + ') · clics ' + tot.clics + ' · gasto ' + dinero(tot.costo) +
    ' · costo por clic ' + (tot.clics ? '$' + (tot.costo / tot.clics).toFixed(2) : '—'));
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
