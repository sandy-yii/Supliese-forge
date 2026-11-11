/**
 * Atelback · Presupuesto nuevo de $71,000 al mes (lo que invertía el cliente con la administración anterior) — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py). REEMPLAZA el paso 3 del reparto: ya no se recorta ninguna
 * campaña que traiga contactos.
 *
 * Presupuesto al mes que mandó el cliente: Quick Laundry (Supliese) $12,000 · Gamesail $20,000 · Kingstar (CLM) $20,000 ·
 * Girbau $10,000 · Laundry Solutions $9,000. Total $71,000 (antes del cambio se gastaban ~$53,500).
 *
 * CÓMO SE REPARTE DENTRO DE CADA CUENTA (datos del 26 oct al 8 nov):
 *   - Más dinero a lo que trae contactos baratos y pierde búsquedas por falta de presupuesto
 *     (Equipo de Quick Laundry, lavadoras de Gamesail, Alta capacidad y Hotelera de Kingstar, Marca Girbau,
 *     Servicio técnico de Laundry Solutions).
 *   - Lo que no trae contactos se queda chico o baja poco (Secadoras de Gamesail, «Campaña Search Marcas» vieja de Quick Laundry).
 *   - Topes por clic: solo Kingstar «Mangles y planchado», que pierde casi la mitad de las búsquedas por posición con contactos a $82.
 *
 * QUÉ HACE:
 *   - VISTA PREVIA: muestra cada campaña con su presupuesto de hoy y el nuevo. No cambia nada.
 *   - EJECUTAR (solo con el OK): pone esos presupuestos. Candado: si el presupuesto de una campaña ya cambió HOY, no la toca.
 * No pausa, no enciende ni toca anuncios, palabras clave, páginas ni conversiones.
 *
 * OJO: con más gasto, el límite de pago de cada cuenta se acaba antes. Ver campanas/2026-11-11-presupuesto-y-saldos.md.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var PLANES = {
  '256-397-2201': { marca: 'Quick Laundry', mes: 12000, campanas: [
    { nombre: 'AB · Equipo para lavandería', dia: 300 },
    { nombre: 'AB · Autoservicio y monedas', dia: 60 },
    { nombre: 'AB · Emprendimiento', dia: 17 },
    { nombre: 'AB · Marca Quick Laundry', dia: 6 },
    { nombre: 'AB · Secadoras para lavandería', dia: 3 },
    { nombre: 'AB · Marcas comerciales', dia: 3 },
    { nombre: 'Campaña Search Marcas', dia: 6 }          // vieja: $268 por contacto y compite con «Equipo» por las mismas búsquedas
  ] },
  '118-347-6484': { marca: 'Gamesail', mes: 20000, campanas: [
    { nombre: 'AB · Lavadoras para ropa y sábanas', dia: 220 },
    { nombre: 'AB · Lavadoras por capacidad y precio', dia: 188 },
    { nombre: 'AB · Competencia depurada', dia: 60 },
    { nombre: 'AB · Hoteles y hospitales', dia: 65 },
    { nombre: 'AB · Mangles y planchado', dia: 45 },
    { nombre: 'AB · Marca Gamesail', dia: 40 },
    { nombre: 'AB · Secadoras industriales', dia: 40 }   // 0 contactos con $468 en 14 días: baja mientras Rodolfo revisa su página
  ] },
  '993-525-8739': { marca: 'Kingstar (CLM)', mes: 20000, campanas: [
    { nombre: 'AB · Alta capacidad 60 kg o más', dia: 360 },
    { nombre: 'AB · Lavandería hotelera e institucional', dia: 110 },
    { nombre: 'AB · Mangles y planchado', dia: 70, tope: 22 },
    { nombre: 'AB · Túnel de lavado', dia: 73 },
    { nombre: 'AB · Lavadoras y secadoras de 20 a 45 kg', dia: 30 },
    { nombre: 'AB · Marca CLM', dia: 15 }
  ] },
  '860-582-6837': { marca: 'Girbau', mes: 10000, campanas: [
    { nombre: 'AB · Marca Girbau', dia: 150 },
    { nombre: 'Max Rendimiento - Girbau', dia: 140 },    // +20%: no más, porque está aprendiendo de los WhatsApp desde el 11 nov
    { nombre: 'AB · Girbau por capacidad y sector', dia: 30 },
    { nombre: 'AB · Girbau Smart Plus', dia: 6 },
    { nombre: 'AB · Servicio técnico Girbau', dia: 3 }
  ] },
  '265-909-2662': { marca: 'Laundry Solutions', mes: 9000, campanas: [
    { nombre: 'AB · Servicio técnico industrial', dia: 170 },
    { nombre: 'AB · Reparación y mantenimiento', dia: 100 },
    { nombre: 'AB · Refacciones Girbau y Gamesail', dia: 8 },
    { nombre: 'AB · Instalación', dia: 6 },
    { nombre: 'AB · Servicio a lavanderías', dia: 6 },
    { nombre: 'AB · Servicio a secadoras', dia: 6 }
  ] }
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(x) { return '$' + Math.round(x).toLocaleString('en-US'); }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var P = PLANES[cid];
  if (!P) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  Logger.log('PRESUPUESTO NUEVO · ' + P.marca + ' · ' + pesos(P.mes) + ' al mes · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
  Logger.log('');

  var C = {};
  filas("SELECT campaign.name, campaign.status, campaign.resource_name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "campaign_budget.resource_name, campaign_budget.amount_micros, campaign_budget.explicitly_shared FROM campaign WHERE campaign.status = 'ENABLED'",
    'las campañas').forEach(function (f) {
      C[f.campaign.name] = { rn: f.campaign.resourceName, puja: f.campaign.biddingStrategyType,
        tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6,
        presupuesto: f.campaignBudget.resourceName, monto: Number(f.campaignBudget.amountMicros || 0) / 1e6,
        compartido: f.campaignBudget.explicitlyShared };
    });
  var movidoHoy = {};
  filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy + " 00:00:00' AND " +
    "change_event.change_date_time <= '" + hoy + " 23:59:59' AND change_event.change_resource_type IN ('CAMPAIGN_BUDGET', 'CAMPAIGN') LIMIT 2000",
    'los cambios de hoy').forEach(function (f) { movidoHoy[f.changeEvent.changeResourceName] = true; });

  var antes = 0, despues = 0, ops = [], textos = [], fuera = [];
  Object.keys(C).forEach(function (n) { antes += C[n].monto; });
  despues = antes;
  P.campanas.forEach(function (k) {
    var c = C[k.nombre];
    if (!c) { Logger.log('AVISO: no encontré «' + k.nombre + '» encendida. No se toca.'); return; }
    var linea = '«' + k.nombre + '» · hoy ' + pesos(c.monto) + ' → ' + pesos(k.dia) + ' al día';
    if (Math.abs(c.monto - k.dia) < 0.5) { Logger.log(linea + ' · ya está'); }
    else if (c.compartido) { Logger.log(linea + ' · AVISO: presupuesto compartido, no se toca'); }
    else if (movidoHoy[c.presupuesto]) { Logger.log(linea + ' · YA SE MOVIÓ HOY, no se toca hasta mañana'); }
    else {
      Logger.log((k.dia > c.monto ? 'SUBE ' : 'BAJA ') + linea);
      ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(k.dia * 1e6) }, updateMask: 'amountMicros' } });
      textos.push(k.nombre + ' a ' + pesos(k.dia));
      despues += k.dia - c.monto;
    }
    if (k.tope) {
      if (c.puja !== 'TARGET_SPEND') Logger.log('   (no usa «maximizar clics»: su tope no se cambia)');
      else if (Math.abs(c.tope - k.tope) < 0.01) Logger.log('   tope por clic ya está en $' + k.tope);
      else {
        Logger.log('   TOPE por clic: $' + c.tope + ' → $' + k.tope);
        ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(k.tope * 1e6) } },
          updateMask: 'targetSpend.cpcBidCeilingMicros' } });
        textos.push(k.nombre + ' tope $' + k.tope);
      }
    }
  });
  Object.keys(C).forEach(function (n) {
    if (!P.campanas.some(function (k) { return k.nombre === n; })) fuera.push(n + ' (' + pesos(C[n].monto) + ')');
  });
  if (fuera.length) Logger.log('Encendidas que no están en el plan (no se tocan): ' + fuera.join(', '));
  Logger.log('');
  Logger.log('Suma diaria de la cuenta: ' + pesos(antes) + ' → ' + pesos(despues) + ' · al mes, como máximo ' + pesos(despues * 30.4) +
    ' (objetivo ' + pesos(P.mes) + ')');

  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ ' + textos[i]);
    });
  }
  Logger.log('');
  Logger.log('NUEVO · ' + P.marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · cambios: ' + ops.length + ' · con error: ' + malos +
    ' · diario ' + pesos(antes) + ' → ' + pesos(despues) + ' · al mes máx. ' + pesos(despues * 30.4));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
