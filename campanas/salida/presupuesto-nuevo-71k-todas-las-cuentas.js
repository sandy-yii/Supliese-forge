/**
 * Atelback · Presupuesto nuevo de $71,000 al mes (presupuesto que mandó el cliente; en las cuentas, la administración anterior gastaba en promedio ~$59,500 al mes) — las cinco cuentas
 * Escrito a mano el 11 nov 2026 (no lo genera generar.py). REEMPLAZA el paso 3 del reparto: ya no se recorta ninguna
 * campaña que traiga contactos.
 *
 * Presupuesto al mes que mandó el cliente: Quick Laundry (Supliese) $12,000 · Gamesail $20,000 · Kingstar (CLM) $20,000 ·
 * Girbau $10,000 · Laundry Solutions $9,000. Total $71,000 (hoy, con nosotros, se gastan ~$53,500 al mes).
 *
 * CÓMO SE REPARTE DENTRO DE CADA CUENTA (actualizado el 11 nov con «datos-para-planear», del 20 oct al 10 nov,
 * contando solo WhatsApp, llamada y formulario):
 *   - Más dinero a lo que trae contactos baratos y pierde búsquedas por falta de presupuesto:
 *     Quick Laundry «Equipo» ($129) y «Autoservicio» ($52); Gamesail «Por capacidad» ($66), «Competencia» ($68) y «Para ropa» ($156);
 *     Kingstar «Alta capacidad» ($233) y «Hotelera» ($242); Girbau «Marca» ($141) y Máximo rendimiento ($50);
 *     Laundry Solutions «Servicio técnico» ($141).
 *   - Baja poco (máx. 20%) lo caro: «Campaña Search Marcas» vieja de Quick Laundry ($230) y «Túnel» de Kingstar ($494).
 *   - Baja lo que no trae contactos (Secadoras de Gamesail: 0 con $643) o lo que no alcanza a gastar su presupuesto
 *     (Gamesail Hoteles, Mangles y Marca ya salen en 76–83% de las búsquedas: bajarles no les quita nada).
 *   - Topes por clic donde se pierde por POSICIÓN con contactos baratos: Kingstar Mangles $18→$22 ($114 por contacto),
 *     Kingstar Hotelera $18→$21, Quick Laundry Autoservicio $14→$17 ($52 por contacto).
 *   - Girbau Máximo rendimiento sube solo a $140 (+20%) porque aprende de los WhatsApp desde el 11 nov; la semana siguiente, otro +20%.
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
    { nombre: 'AB · Equipo para lavandería', dia: 285 },               // $129 por contacto · pierde 48% por presupuesto
    { nombre: 'AB · Autoservicio y monedas', dia: 55, tope: 17 },      // $52 por contacto · pierde 44% por posición
    { nombre: 'AB · Emprendimiento', dia: 17 },
    { nombre: 'AB · Marca Quick Laundry', dia: 4 },                    // gasta $1 al día: no le falta
    { nombre: 'AB · Secadoras para lavandería', dia: 3 },
    { nombre: 'AB · Marcas comerciales', dia: 3 },
    { nombre: 'Campaña Search Marcas', dia: 28 }                       // vieja, $230 por contacto: baja 20%, sin brusquedad
  ] },
  '118-347-6484': { marca: 'Gamesail', mes: 20000, campanas: [
    { nombre: 'AB · Lavadoras para ropa y sábanas', dia: 248 },        // $156 · pierde 53% por presupuesto
    { nombre: 'AB · Lavadoras por capacidad y precio', dia: 220 },     // $66 · pierde 52% por presupuesto: la mejor de la cuenta
    { nombre: 'AB · Competencia depurada', dia: 60 },                  // $68 · pierde 39% por presupuesto
    { nombre: 'AB · Hoteles y hospitales', dia: 40 },                  // gasta ~$29 al día y ya sale en 76%
    { nombre: 'AB · Mangles y planchado', dia: 30 },                   // gasta ~$21 al día y ya sale en 81%
    { nombre: 'AB · Marca Gamesail', dia: 20 },                        // gasta ~$5 al día y ya sale en 83%
    { nombre: 'AB · Secadoras industriales', dia: 40 }                 // 0 contactos con $643: baja mientras Rodolfo revisa su página
  ] },
  '993-525-8739': { marca: 'Kingstar (CLM)', mes: 20000, campanas: [
    { nombre: 'AB · Alta capacidad 60 kg o más', dia: 392 },           // $233 · pierde 39% por presupuesto
    { nombre: 'AB · Lavandería hotelera e institucional', dia: 105, tope: 21 },
    { nombre: 'AB · Mangles y planchado', dia: 65, tope: 22 },         // $114: la más barata, pierde 45% por posición
    { nombre: 'AB · Túnel de lavado', dia: 60 },                       // $494 y su página tiene 0 contactos en 96 clics
    { nombre: 'AB · Lavadoras y secadoras de 20 a 45 kg', dia: 21 },   // $716 por contacto: se queda igual
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
    { nombre: 'AB · Servicio técnico industrial', dia: 170 },          // $141 · pierde 47% por presupuesto
    { nombre: 'AB · Reparación y mantenimiento', dia: 100 },           // $402: caro; sube poco
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
