/**
 * Atelback · ¿Qué hay en la cuenta anterior de Gamesail? (645-094-0317)
 * Escrito a mano el 4 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Saca todo lo que Google deja ver con el acceso que tengas:
 *   1. Datos de la cuenta (nombre, moneda, zona horaria, etiquetado).
 *   2. Quién tiene acceso y con qué nivel, y qué cuentas de administrador (agencias) están vinculadas.
 *   3. Facturación: perfil de pagos y presupuestos de cuenta.
 *   4. Campañas: estado, tipo, presupuesto y gasto por mes (septiembre, octubre, noviembre) y de los últimos 7 días.
 *   5. Acciones de conversión.
 * Si alguna parte dice «no se pudo», es que tu nivel de acceso no la deja ver: eso también nos sirve.
 *
 * CÓMO SE USA: en la cuenta 645-094-0317 > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var CUENTA = '645-094-0317';

function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
    return null;
  }
  return out;
}
function dinero(x) { return '$' + Math.round(x).toLocaleString('en-US'); }
function n(x) { return Number(x || 0); }

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  if (cid !== CUENTA) throw new Error('Este script es para la cuenta anterior de Gamesail (' + CUENTA + '). Estás en ' + cid + '. No se hizo nada.');
  Logger.log('CUENTA ANTERIOR DE GAMESAIL · ' + CUENTA + ' · solo lee');

  // 1. Cuenta
  Logger.log('');
  Logger.log('==== 1. LA CUENTA ====');
  (filas('SELECT customer.descriptive_name, customer.currency_code, customer.time_zone, customer.auto_tagging_enabled, ' +
    'customer.status, customer.manager, customer.test_account FROM customer', 'los datos de la cuenta') || []).forEach(function (f) {
    var c = f.customer;
    Logger.log('Nombre: ' + c.descriptiveName + ' · moneda ' + c.currencyCode + ' · zona ' + c.timeZone + ' · estado ' + c.status +
      ' · etiquetado automático ' + (c.autoTaggingEnabled ? 'sí' : 'no'));
  });

  // 2. Accesos
  Logger.log('');
  Logger.log('==== 2. QUIÉN TIENE ACCESO ====');
  var usuarios = filas('SELECT customer_user_access.email_address, customer_user_access.access_role, customer_user_access.access_creation_date_time, ' +
    'customer_user_access.inviter_user_email_address FROM customer_user_access', 'los usuarios (solo lo ve un administrador)');
  if (usuarios) {
    if (!usuarios.length) Logger.log('No aparece ningún usuario.');
    usuarios.forEach(function (f) {
      var u = f.customerUserAccess;
      Logger.log(u.emailAddress + ' · ' + u.accessRole + ' · desde ' + (u.accessCreationDateTime || '?') +
        (u.inviterUserEmailAddress ? ' · lo invitó ' + u.inviterUserEmailAddress : ''));
    });
  }
  var mcc = filas('SELECT customer_manager_link.manager_customer, customer_manager_link.status FROM customer_manager_link',
    'las cuentas de administrador vinculadas');
  if (mcc) {
    if (!mcc.length) Logger.log('No hay cuentas de administrador (agencias) vinculadas.');
    mcc.forEach(function (f) {
      Logger.log('Cuenta de administrador vinculada: ' + f.customerManagerLink.managerCustomer + ' · ' + f.customerManagerLink.status);
    });
  }

  // 3. Facturación
  Logger.log('');
  Logger.log('==== 3. FACTURACIÓN ====');
  var fac = filas('SELECT billing_setup.status, billing_setup.payments_account, billing_setup.payments_account_info.payments_account_id, ' +
    'billing_setup.payments_account_info.payments_account_name, billing_setup.payments_account_info.payments_profile_id, ' +
    'billing_setup.payments_account_info.payments_profile_name, billing_setup.start_date_time FROM billing_setup', 'la facturación');
  if (fac) {
    if (!fac.length) Logger.log('No aparece ninguna configuración de facturación.');
    fac.forEach(function (f) {
      var b = f.billingSetup, i = b.paymentsAccountInfo || {};
      Logger.log('Estado ' + b.status + ' · cuenta de pagos ' + (i.paymentsAccountId || '?') + ' «' + (i.paymentsAccountName || '') + '» · ' +
        'perfil de pagos ' + (i.paymentsProfileId || '?') + ' «' + (i.paymentsProfileName || '') + '» · desde ' + (b.startDateTime || '?'));
    });
  }
  var pres = filas('SELECT account_budget.status, account_budget.name, account_budget.approved_spending_limit_micros, ' +
    'account_budget.amount_served_micros, account_budget.approved_start_date_time, account_budget.approved_end_date_time FROM account_budget',
    'los presupuestos de cuenta');
  if (pres) pres.forEach(function (f) {
    var a = f.accountBudget;
    Logger.log('Presupuesto de cuenta «' + (a.name || '') + '» · ' + a.status + ' · límite ' +
      (a.approvedSpendingLimitMicros ? dinero(n(a.approvedSpendingLimitMicros) / 1e6) : 'sin límite') + ' · gastado ' +
      dinero(n(a.amountServedMicros) / 1e6) + ' · del ' + (a.approvedStartDateTime || '?') + ' al ' + (a.approvedEndDateTime || 'sin fin'));
  });
  Logger.log('El saldo prepagado («Fondos disponibles») solo se ve en Facturación > Resumen; Google no lo da a los scripts.');

  // 4. Campañas
  Logger.log('');
  Logger.log('==== 4. CAMPAÑAS ====');
  var C = {};
  (filas("SELECT campaign.name, campaign.status, campaign.advertising_channel_type, campaign.serving_status, campaign_budget.amount_micros " +
    "FROM campaign WHERE campaign.status != 'REMOVED'", 'las campañas') || []).forEach(function (f) {
    C[f.campaign.name] = { estado: f.campaign.status, tipo: f.campaign.advertisingChannelType, sirve: f.campaign.servingStatus,
      diario: n(f.campaignBudget.amountMicros) / 1e6, mes: {}, semana: 0, conv: 0 };
  });
  [['septiembre', '2026-09-01', '2026-09-30'], ['octubre', '2026-10-01', '2026-10-31'], ['noviembre', '2026-11-01', '2026-11-30']].forEach(function (m) {
    (filas("SELECT campaign.name, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date BETWEEN '" + m[1] + "' AND '" + m[2] + "'",
      'el gasto de ' + m[0]) || []).forEach(function (f) {
      var c = C[f.campaign.name]; if (!c) return;
      c.mes[m[0]] = (c.mes[m[0]] || 0) + n(f.metrics.costMicros) / 1e6;
      c.conv += n(f.metrics.conversions);
    });
  });
  (filas('SELECT campaign.name, metrics.cost_micros FROM campaign WHERE segments.date DURING LAST_7_DAYS', 'el gasto de los últimos 7 días') || [])
    .forEach(function (f) { var c = C[f.campaign.name]; if (c) c.semana += n(f.metrics.costMicros) / 1e6; });
  var tot = { septiembre: 0, octubre: 0, noviembre: 0 }, semana = 0, encendidas = [];
  Object.keys(C).sort().forEach(function (k) {
    var c = C[k];
    ['septiembre', 'octubre', 'noviembre'].forEach(function (m) { tot[m] += c.mes[m] || 0; });
    semana += c.semana;
    if (c.estado === 'ENABLED') encendidas.push(k);
    Logger.log(k + ' · ' + c.estado + ' (' + c.sirve + ') · ' + c.tipo + ' · ' + dinero(c.diario) + ' al día · sep ' + dinero(c.mes.septiembre || 0) +
      ' · oct ' + dinero(c.mes.octubre || 0) + ' · nov ' + dinero(c.mes.noviembre || 0) + ' · últimos 7 días ' + dinero(c.semana) +
      ' · conversiones sep-nov ' + Math.round(c.conv * 10) / 10);
  });
  Logger.log('TOTAL · sep ' + dinero(tot.septiembre) + ' · oct ' + dinero(tot.octubre) + ' · nov ' + dinero(tot.noviembre) + ' · últimos 7 días ' + dinero(semana));
  Logger.log(encendidas.length ? '⚠️ Campañas encendidas: ' + encendidas.join(' · ') : '✅ Ninguna campaña encendida.');

  // 5. Conversiones
  Logger.log('');
  Logger.log('==== 5. ACCIONES DE CONVERSIÓN ====');
  (filas("SELECT conversion_action.name, conversion_action.type, conversion_action.status, conversion_action.primary_for_goal FROM conversion_action " +
    "WHERE conversion_action.status != 'REMOVED'", 'las conversiones') || []).forEach(function (f) {
    var a = f.conversionAction;
    Logger.log(a.name + ' · ' + a.type + ' · ' + a.status + (a.primaryForGoal ? ' · principal' : ''));
  });

  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
