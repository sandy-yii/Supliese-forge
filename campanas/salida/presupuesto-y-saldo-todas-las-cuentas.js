/**
 * Atelback · ¿Cuánto del dinero de la cuenta estamos usando y cuánto queda? — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. En la cuenta donde se corre:
 *   1. Gasto del mes hasta ayer, ritmo de los últimos 7 días y cuánto se gastaría en todo el mes a ese ritmo.
 *   2. Suma de los presupuestos diarios de las campañas encendidas (lo máximo que se permite gastar).
 *   3. El «presupuesto de la cuenta» de Google Ads (cuando existe): límite aprobado, lo ya gastado contra ese límite
 *      y lo que queda. Si la cuenta se paga con depósitos (pagos manuales), el saldo del depósito puede no aparecer aquí:
 *      en ese caso se ve en Facturación → Resumen.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el renglón «PRESUPUESTO ·».
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
function pesos(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function m(x) { return (Number(x) || 0) / 1e6; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var ayer = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var hace7 = Utilities.formatDate(new Date(Date.now() - 7 * 864e5), tz, 'yyyy-MM-dd');
  var inicioMes = hoy.substr(0, 8) + '01';
  var anio = Number(hoy.substr(0, 4)), mes = Number(hoy.substr(5, 2)), dia = Number(hoy.substr(8, 2));
  var diasMes = new Date(anio, mes, 0).getDate(), restantes = diasMes - dia + 1;   // de hoy al último día, incluido hoy
  Logger.log('PRESUPUESTO Y SALDO · ' + marca + ' · ' + hoy + ' · solo lee');
  Logger.log('');

  var gastoMes = 0;
  if (dia > 1) filas("SELECT metrics.cost_micros FROM customer WHERE segments.date BETWEEN '" + inicioMes + "' AND '" + ayer + "'", 'el gasto del mes')
    .forEach(function (f) { gastoMes += m(f.metrics.costMicros); });
  var gasto7 = 0;
  filas("SELECT metrics.cost_micros FROM customer WHERE segments.date BETWEEN '" + hace7 + "' AND '" + ayer + "'", 'el gasto de 7 días')
    .forEach(function (f) { gasto7 += m(f.metrics.costMicros); });
  var ritmo = gasto7 / 7, proyeccion = gastoMes + ritmo * restantes;

  var diario = 0;
  filas("SELECT campaign.name, campaign_budget.amount_micros FROM campaign WHERE campaign.status = 'ENABLED'", 'los presupuestos')
    .forEach(function (f) { diario += m((f.campaignBudget || {}).amountMicros); });

  Logger.log('==== 1. GASTO ====');
  Logger.log('Gastado del ' + inicioMes + ' al ' + ayer + ': ' + pesos(gastoMes));
  Logger.log('Ritmo de los últimos 7 días: ' + pesos(ritmo) + ' al día');
  Logger.log('Si sigue así, el mes cierra en: ' + pesos(proyeccion));
  Logger.log('');
  Logger.log('==== 2. PRESUPUESTOS DIARIOS (campañas encendidas) ====');
  Logger.log('Suma: ' + pesos(diario) + ' al día · al mes, como máximo: ' + pesos(diario * 30.4));
  Logger.log('Hoy se gasta el ' + (diario ? Math.round(100 * ritmo / diario) : 0) + '% de lo que permiten los presupuestos diarios.');
  Logger.log('');

  Logger.log('==== 3. PRESUPUESTO DE LA CUENTA EN GOOGLE ADS ====');
  var limiteTxt = 'no aparece', quedaTxt = '—', servidoTxt = '—';
  var ab = filas("SELECT account_budget.name, account_budget.status, account_budget.approved_spending_limit_micros, " +
    "account_budget.approved_spending_limit_type, account_budget.adjusted_spending_limit_micros, account_budget.amount_served_micros, " +
    "account_budget.approved_start_date_time, account_budget.approved_end_date_time, account_budget.approved_end_time_type " +
    "FROM account_budget", 'el presupuesto de la cuenta');
  ab.forEach(function (f) {
    var b = f.accountBudget;
    if (b.status && b.status !== 'APPROVED') return;
    var infinito = b.approvedSpendingLimitType === 'INFINITE';
    var limite = m(b.adjustedSpendingLimitMicros || b.approvedSpendingLimitMicros), servido = m(b.amountServedMicros);
    Logger.log('«' + (b.name || 'presupuesto de la cuenta') + '» · del ' + (b.approvedStartDateTime || '?') + ' al ' +
      (b.approvedEndTimeType === 'FOREVER' ? 'sin fecha de fin' : (b.approvedEndDateTime || '?')));
    Logger.log('   límite: ' + (infinito ? 'sin límite' : pesos(limite)) + ' · ya gastado contra este límite: ' + pesos(servido) +
      (infinito ? '' : ' · queda: ' + pesos(limite - servido) + ' (' + (limite ? Math.round(100 * servido / limite) : 0) + '% usado)'));
    limiteTxt = infinito ? 'sin límite' : pesos(limite); servidoTxt = pesos(servido); quedaTxt = infinito ? '—' : pesos(limite - servido);
  });
  if (!ab.length) Logger.log('Google no da un presupuesto de cuenta. Si la cuenta se paga con depósitos, el saldo se ve en Facturación → Resumen.');
  Logger.log('');

  Logger.log('PRESUPUESTO · ' + marca + ' · gastado en el mes ' + pesos(gastoMes) + ' · ritmo ' + pesos(ritmo) + '/día · el mes cierra en ~' +
    pesos(proyeccion) + ' · presupuestos diarios ' + pesos(diario) + '/día · límite de la cuenta ' + limiteTxt + ' · gastado contra el límite ' +
    servidoTxt + ' · queda ' + quedaTxt);
  Logger.log('LISTO. Este script no cambió nada.');
}
