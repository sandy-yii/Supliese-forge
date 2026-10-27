/**
 * Atelback · Contactos día por día — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Muestra, día por día en
 * los últimos 30 días, los clics de las campañas nuevas «AB ·» y de las anteriores, y las conversaciones, llamadas y
 * clics a WhatsApp que registró Google. Sirve para ver en qué día dejaron de llegar los contactos. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var CONTACTO = /conversa|conversation|mensaje|message|whats|\bwa\b|llamad|call|formul|lead|contact|chat|bot/i;   // chat y bot: el chatbot de las páginas anteriores

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
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function num(x) { return Number(x || 0); }

function main() {
  revisarCuenta();
  Logger.log('CONTACTOS DÍA POR DÍA · ' + PLAN.nombre + ' · últimos 30 días · solo lee');
  var D = {};
  function dia(d) { return D[d] = D[d] || { nuevas: 0, anteriores: 0, contactos: {} }; }
  filas('SELECT segments.date, campaign.name, metrics.clicks FROM campaign WHERE segments.date DURING LAST_30_DAYS AND metrics.clicks > 0', 'los clics')
    .forEach(function (f) { dia(f.segments.date)[esNueva(f.campaign.name) ? 'nuevas' : 'anteriores'] += num(f.metrics.clicks); });
  filas('SELECT segments.date, segments.conversion_action_name, metrics.all_conversions FROM customer WHERE segments.date DURING LAST_30_DAYS', 'los contactos')
    .forEach(function (f) {
      var n = f.segments.conversionActionName, v = num((f.metrics || {}).allConversions);
      if (!v || !CONTACTO.test(n)) return;
      var c = dia(f.segments.date).contactos;
      c[n] = (c[n] || 0) + v;
    });
  Logger.log('');
  Logger.log('FECHA · clics nuevas · clics anteriores · contactos que registró Google');
  var total = 0;
  Object.keys(D).sort().forEach(function (d) {
    var x = D[d], partes = Object.keys(x.contactos).map(function (n) { total += x.contactos[n]; return n + ' ' + Math.round(x.contactos[n] * 10) / 10; });
    Logger.log(d + ' · ' + x.nuevas + ' · ' + x.anteriores + ' · ' + (partes.join(' | ') || '—'));
  });
  Logger.log('');
  Logger.log('Total de contactos registrados en 30 días: ' + Math.round(total * 10) / 10 + '. Este script no cambió nada.');
}
