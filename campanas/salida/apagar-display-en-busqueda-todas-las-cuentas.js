/**
 * Atelback · Apagar la red de Display en las campañas de BÚSQUEDA «AB · …» — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * POR QUÉ: las campañas «AB · …» se diseñaron «solo Red de Búsqueda, sin socios ni Display» (fichas de cada cuenta),
 * pero varias quedaron con Display encendido. El script de horario del 9 nov mostró que ese Display trae clics baratos
 * de madrugada que casi no se vuelven contactos y se come el presupuesto que necesitan las búsquedas
 * (Equipo de Quick Laundry, Alta capacidad de Kingstar y Reparación de Laundry Solutions pierden 44–50% por presupuesto).
 *
 * QUÉ HACE:
 *   - VISTA PREVIA: solo lee. Lista las campañas de búsqueda «AB · …» encendidas que tienen Display, con lo que
 *     Display les dio en los últimos 30 días (clics, gasto, contactos) contra lo que les dio la búsqueda.
 *   - EJECUTAR (solo con el OK de Sandy, cuenta por cuenta): les apaga Display. La búsqueda en Google sigue igual.
 * No toca presupuestos, anuncios, palabras clave, Máximo rendimiento ni campañas que no sean «AB · …».
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(m) { return '$' + Math.round((Number(m) || 0) / 1e6).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hasta = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - 30 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('APAGAR DISPLAY EN BÚSQUEDA · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica el cambio'));
  Logger.log('Lo que dio cada red del ' + desde + ' al ' + hasta + '.');
  Logger.log('');

  var S = {};
  filas("SELECT campaign.name, segments.ad_network_type, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM campaign " +
    "WHERE campaign.advertising_channel_type = 'SEARCH' AND segments.date BETWEEN '" + desde + "' AND '" + hasta + "'", 'las redes')
    .forEach(function (f) {
      var x = S[f.campaign.name] = S[f.campaign.name] || { d: { c: 0, g: 0, v: 0 }, b: { c: 0, g: 0, v: 0 } };
      var t = f.segments.adNetworkType === 'CONTENT' ? x.d : x.b, m = f.metrics;
      t.c += Number(m.clicks) || 0; t.g += Number(m.costMicros) || 0; t.v += Number(m.allConversions) || 0;
    });

  var ops = [], textos = [], tot = { c: 0, g: 0, v: 0 };
  filas("SELECT campaign.resource_name, campaign.name, campaign.network_settings.target_content_network FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas').forEach(function (f) {
      var c = f.campaign;
      if (!/^AB\s*·/.test(c.name) || !(c.networkSettings || {}).targetContentNetwork) return;
      var x = S[c.name] || { d: { c: 0, g: 0, v: 0 }, b: { c: 0, g: 0, v: 0 } };
      tot.c += x.d.c; tot.g += x.d.g; tot.v += x.d.v;
      Logger.log('«' + c.name + '» · Display: ' + x.d.c + ' clics · ' + pesos(x.d.g) + ' · ' + n(x.d.v) + ' contactos' +
        '  ||  Búsqueda: ' + x.b.c + ' clics · ' + pesos(x.b.g) + ' · ' + n(x.b.v) + ' contactos');
      ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: false } },
        updateMask: 'networkSettings.targetContentNetwork' } });
      textos.push(c.name);
    });
  if (!ops.length) Logger.log('Ninguna campaña de búsqueda «AB · …» tiene Display encendido. No hay nada que cambiar.');
  Logger.log('');

  var malos = 0;
  if (!vista && ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (r.isSuccessful()) Logger.log('✅ «' + textos[i] + '»: Display apagado. Sigue en la búsqueda de Google.');
      else { malos++; Logger.log('❌ «' + textos[i] + '» no se pudo cambiar: ' + r.getErrorMessages().join('; ')); }
    });
    Logger.log('');
  }
  Logger.log('DISPLAY · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · se apaga en ' + ops.length + ' campaña(s)' +
    (vista ? '' : ' (con error: ' + malos + ')') + ' · Display en 30 días: ' + tot.c + ' clics, ' + pesos(tot.g) + ', ' + n(tot.v) + ' contactos');
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
