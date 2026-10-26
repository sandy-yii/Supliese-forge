/**
 * Atelback · Datos de medición para la página — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. No cambia nada en la cuenta.
 *   1. Saca el ID de la cuenta (AW-…) y la etiqueta de cada conversión «AB ·», listos para pasárselos a quien programa la página.
 *   2. Lista todas las acciones de conversión, si son Principal o Secundaria y cuándo registraron algo por última vez.
 *   3. Revisa el etiquetado automático, los informes de llamadas y las conversiones mejoradas.
 *   4. Revisa el botón de llamada de cada campaña «AB ·»: si está aprobado, en revisión o rechazado, cuántas veces se mostró
 *      y cuántas llamadas hubo en los últimos 14 días.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA (no hace falta Ejecutar) > copiar todo el registro.
 */

var PLANES = [{"cuenta": "", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "telefono": "33 1185 9797"}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "telefono": "33 2601 2237"}, {"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "telefono": "33 1564 1538"}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "telefono": "33 1417 2994"}, {"cuenta": "860-582-6837", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "telefono": "33 2806 8994"}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

// Acciones que creó conversiones.js y la variable de la página donde va su etiqueta.
var ACCIONES = [
  { nombre: 'AB · Formulario enviado', variable: 'NEXT_PUBLIC_GADS_LABEL_FORMULARIO' },
  { nombre: 'AB · Clic en WhatsApp', variable: 'NEXT_PUBLIC_GADS_LABEL_WHATSAPP' },
  { nombre: 'AB · Clic en teléfono de la página', variable: 'NEXT_PUBLIC_GADS_LABEL_LLAMADA' },
  { nombre: 'AB · Clic en correo', variable: 'NEXT_PUBLIC_GADS_LABEL_CORREO' }
];
var APROBACION = { APPROVED: 'aprobado', APPROVED_LIMITED: 'aprobado con restricciones', DISAPPROVED: 'RECHAZADO', AREA_OF_INTEREST_ONLY: 'solo zona de interés', UNKNOWN: 'sin dato', UNSPECIFIED: 'sin dato' };
var REVISION = { REVIEW_IN_PROGRESS: 'en revisión', REVIEWED: 'revisado', UNDER_APPEAL: 'en apelación', ELIGIBLE_MAY_SERVE: 'puede mostrarse', UNKNOWN: 'sin dato', UNSPECIFIED: 'sin dato' };

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
function digitos(t) { return String(t || '').replace(/\D/g, '').slice(-10); }
function siNo(v) { return v ? 'sí' : 'NO'; }

function main() {
  var cid = revisarCuenta();
  Logger.log('DATOS DE MEDICIÓN · ' + PLAN.nombre + ' (' + cid + ') · ' + PLAN.url + ' · solo lectura, no cambia nada');

  // 1. ID y etiquetas para la página.
  var id = '', etiquetas = {};
  filas("SELECT conversion_action.name, conversion_action.tag_snippets FROM conversion_action WHERE conversion_action.status = 'ENABLED'",
    'las etiquetas').forEach(function (f) {
    var a = f.conversionAction;
    (a.tagSnippets || []).forEach(function (s) {
      var m = /send_to['"]?\s*:\s*['"](AW-\d+)\/([^'"]+)['"]/.exec(s.eventSnippet || '');
      if (m) { id = id || m[1]; etiquetas[a.name] = m[2]; }
      var g = /AW-\d+/.exec(s.globalSiteTag || '');
      if (g) id = id || g[0];
    });
  });
  Logger.log('');
  Logger.log('========== PARA LA PÁGINA ' + PLAN.url + ' (copiar tal cual) ==========');
  Logger.log('NEXT_PUBLIC_GADS_ID=' + (id || 'NO ENCONTRADO'));
  var faltan = [];
  ACCIONES.forEach(function (x) {
    if (!etiquetas[x.nombre]) faltan.push(x.nombre);
    Logger.log(x.variable + '=' + (etiquetas[x.nombre] || ''));
  });
  Logger.log('NEXT_PUBLIC_GA4_ID=   ← este no sale de Google Ads: es el ID «G-…» de Google Analytics, si ya hay propiedad');
  Logger.log('===================================================================');
  if (!id) Logger.log('AVISO: no salió el ID AW-…. Míralo en Objetivos > Conversiones > (acción) > Configurar etiqueta > Usar Google tag.');
  faltan.forEach(function (n) { Logger.log('AVISO: no se encontró la etiqueta de «' + n + '». ¿Existe y está habilitada? (se crea con conversiones.js)'); });

  // 2. Acciones de conversión y la última vez que registraron algo.
  var ultima = {}, total = {};
  filas('SELECT segments.conversion_action_name, segments.date, metrics.all_conversions FROM customer ' +
    'WHERE segments.date DURING LAST_30_DAYS AND metrics.all_conversions > 0', 'las conversiones de los últimos 30 días').forEach(function (f) {
    var n = f.segments.conversionActionName, d = f.segments.date;
    if (!ultima[n] || d > ultima[n]) ultima[n] = d;
    total[n] = (total[n] || 0) + Number(f.metrics.allConversions || 0);
  });
  Logger.log('');
  Logger.log('ACCIONES DE CONVERSIÓN (últimos 30 días):');
  filas("SELECT conversion_action.name, conversion_action.type, conversion_action.status, conversion_action.primary_for_goal " +
    "FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones de conversión').forEach(function (f) {
    var a = f.conversionAction;
    Logger.log('  ' + a.name + ' · ' + (a.primaryForGoal ? 'Principal' : 'Secundaria') + ' · ' + a.type + ' · ' +
      (ultima[a.name] ? Math.round(total[a.name] * 10) / 10 + ' en 30 días, la última el ' + ultima[a.name] : 'nada en 30 días'));
  });

  // 3. Ajustes de la cuenta que afectan la medición.
  Logger.log('');
  Logger.log('AJUSTES DE LA CUENTA:');
  var c = filas('SELECT customer.auto_tagging_enabled, customer.call_reporting_setting.call_reporting_enabled, ' +
    'customer.call_reporting_setting.call_conversion_reporting_enabled, customer.call_reporting_setting.call_conversion_action FROM customer',
    'los ajustes de la cuenta')[0];
  if (c) {
    var cr = c.customer.callReportingSetting || {};
    Logger.log('  Etiquetado automático: ' + siNo(c.customer.autoTaggingEnabled) + (c.customer.autoTaggingEnabled ? '' : '  ← sin esto no se atribuyen las conversiones'));
    Logger.log('  Informes de llamadas: ' + siNo(cr.callReportingEnabled) + (cr.callReportingEnabled ? '' : '  ← sin esto no se cuentan las llamadas desde anuncios'));
    Logger.log('  Llamadas como conversión: ' + siNo(cr.callConversionReportingEnabled));
  }
  var ec = filas('SELECT customer.conversion_tracking_setting.enhanced_conversions_for_leads_enabled FROM customer', 'las conversiones mejoradas')[0];
  if (ec) Logger.log('  Conversiones mejoradas para clientes potenciales: ' + siNo((ec.customer.conversionTrackingSetting || {}).enhancedConversionsForLeadsEnabled) +
    ' (opcional; ayuda a atribuir el formulario)');

  // 4. Botón de llamada de las campañas nuevas.
  Logger.log('');
  Logger.log('BOTÓN DE LLAMADA (teléfono del plan: ' + PLAN.telefono + '):');
  var nuestro = digitos(PLAN.telefono), tiene = {};
  filas("SELECT campaign.name, asset.call_asset.phone_number, asset.policy_summary.approval_status, asset.policy_summary.review_status " +
    "FROM campaign_asset WHERE campaign_asset.field_type = 'CALL' AND campaign_asset.status = 'ENABLED'", 'los teléfonos de las campañas')
    .forEach(function (f) {
      if (!esNueva(f.campaign.name)) return;
      var ps = f.asset.policySummary || {}, tel = digitos((f.asset.callAsset || {}).phoneNumber);
      (tiene[f.campaign.name] = tiene[f.campaign.name] || []).push('…' + tel.slice(-4) + (tel === nuestro ? '' : ' (NO es el del plan)') + ' · ' +
        (APROBACION[ps.approvalStatus] || ps.approvalStatus || 'sin dato') + ' · ' + (REVISION[ps.reviewStatus] || ps.reviewStatus || 'sin dato'));
    });
  filas("SELECT campaign.name, campaign.status, metrics.phone_impressions, metrics.phone_calls, metrics.clicks FROM campaign " +
    "WHERE campaign.status != 'REMOVED' AND segments.date DURING LAST_14_DAYS", 'las llamadas de las campañas').forEach(function (f) {
    if (!esNueva(f.campaign.name)) return;
    var m = f.metrics;
    Logger.log('  ' + f.campaign.name + (f.campaign.status === 'PAUSED' ? ' (en pausa)' : '') + ': ' +
      (tiene[f.campaign.name] ? tiene[f.campaign.name].join('; ') : 'SIN TELÉFONO') + ' · 14 días: ' + m.clicks + ' clics, botón mostrado ' +
      m.phoneImpressions + ' veces, ' + m.phoneCalls + ' llamadas');
  });
  Logger.log('');
  Logger.log('LISTO. No se cambió nada. Copia el bloque «PARA LA PÁGINA» para Rodolfo y manda todo el registro para revisarlo.');
}
