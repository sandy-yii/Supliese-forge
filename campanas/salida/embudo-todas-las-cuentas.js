/**
 * Atelback · Embudo: cuánta gente vio, cuánta dio clic y cuánta escribió o llamó — las cinco cuentas
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py). Para la junta con el cliente.
 *
 * QUÉ HACE: SOLO LEE. No cambia nada.
 *   Del DESDE a ayer: impresiones (veces que se mostró un anuncio), clics, contactos reales (WhatsApp, llamada,
 *   formulario; sin chatbot ni Google Maps), inversión, y de cada 100 clics cuántos escribieron o llamaron.
 *   También por campaña, para ver cuáles llevan más gente.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA >
 * copiar los renglones que empiezan con «EMBUDO ·» (o todo el registro) y mandarlos.
 */

var DESDE = '2026-11-01';
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
function miles(x) { return Math.round(Number(x) || 0).toLocaleString('en-US'); }
function pesos(x) { return '$' + miles(x); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function esReal(accion, tipo) {
  if (/coudibot|chatbot|chat \(|local action|acciones locales|website visits|directions|calificad|qualified|cliente potencial de llamada|android/i.test(accion)) return false;
  if (tipo === 'GOOGLE_HOSTED' || tipo === 'UPLOAD_CLICKS' || tipo === 'UPLOAD_CALLS') return false;
  return /^AB\s*·|whats|\bwa\b|conversa|conversation|mensaje|message|llamad|call|tel[eé]fono|phone|formul|form/i.test(accion);
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var ayer = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var rango = "segments.date BETWEEN '" + DESDE + "' AND '" + ayer + "'";
  Logger.log('EMBUDO · ' + marca + ' · del ' + DESDE + ' al ' + ayer + ' · solo lee');
  Logger.log('');

  var tipos = {};
  filas("SELECT conversion_action.name, conversion_action.type FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) { tipos[f.conversionAction.name] = f.conversionAction.type; });

  var C = {}, T = { imp: 0, clics: 0, gasto: 0, cont: 0 };
  filas("SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign WHERE " + rango, 'las campañas')
    .forEach(function (f) {
      var c = C[f.campaign.name] = C[f.campaign.name] || { imp: 0, clics: 0, gasto: 0, cont: 0 };
      c.imp += Number(f.metrics.impressions) || 0; c.clics += Number(f.metrics.clicks) || 0; c.gasto += (Number(f.metrics.costMicros) || 0) / 1e6;
    });
  filas("SELECT campaign.name, segments.conversion_action_name, metrics.all_conversions FROM campaign WHERE " + rango, 'los contactos')
    .forEach(function (f) {
      var a = f.segments.conversionActionName;
      if (!esReal(a, tipos[a])) return;
      var c = C[f.campaign.name] = C[f.campaign.name] || { imp: 0, clics: 0, gasto: 0, cont: 0 };
      c.cont += Number(f.metrics.allConversions) || 0;
    });

  Object.keys(C).sort(function (a, b) { return C[b].clics - C[a].clics; }).forEach(function (k) {
    var c = C[k];
    T.imp += c.imp; T.clics += c.clics; T.gasto += c.gasto; T.cont += c.cont;
    if (!c.imp && !c.cont) return;
    Logger.log('  «' + k + '» · ' + miles(c.imp) + ' impresiones · ' + miles(c.clics) + ' clics · ' + n(c.cont) + ' contactos' +
      (c.clics ? ' · ' + n(c.cont / c.clics * 100) + ' de cada 100 clics' : '') + ' · ' + pesos(c.gasto));
  });
  Logger.log('');
  Logger.log('EMBUDO · ' + marca + ' · ' + DESDE + ' a ' + ayer + ' · impresiones ' + miles(T.imp) + ' · clics ' + miles(T.clics) +
    ' · contactos ' + n(T.cont) + ' · de cada 100 clics escribieron o llamaron ' + (T.clics ? n(T.cont / T.clics * 100) : 0) +
    ' · inversión ' + pesos(T.gasto));
}
