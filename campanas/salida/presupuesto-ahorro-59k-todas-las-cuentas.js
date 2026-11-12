/**
 * Atelback · Presupuesto OPCIÓN AHORRO (~$59,500 al mes) — las cinco cuentas
 * Escrito a mano el 12 nov 2026 (no lo genera generar.py). Es la alternativa económica a «presupuesto-nuevo-71k».
 * Se corre UNA de las dos, la que el cliente apruebe. Nunca las dos.
 *
 * IDEA: casi el mismo gasto de hoy (~$55,000 al mes de presupuesto), pero acomodado:
 *   - Sube solo donde el contacto sale barato y se pierden búsquedas por falta de presupuesto:
 *     Quick Laundry «Equipo» ($129) y «Autoservicio» ($52), Gamesail «Por capacidad» ($66) y «Competencia» ($68),
 *     Girbau (el contacto más barato de las 5 marcas, $68), Kingstar «Mangles» ($114).
 *   - No sube (o baja poco) lo caro: Kingstar «Alta capacidad» ($233) apenas +5%, «Túnel» ($494, página con 0 contactos),
 *     Laundry Solutions «Reparación» ($402), Gamesail «Secadoras» (0 contactos con $643) y «Para ropa» ($156).
 *   - Lo que no alcanza a gastar su presupuesto se ajusta a lo que sí gasta (Gamesail Hoteles, Mangles y Marca).
 * Por marca, al mes: Quick Laundry ~$12,000 · Gamesail ~$15,800 · Kingstar ~$16,700 · Girbau ~$8,900 · Laundry Solutions ~$6,000.
 *
 * CANDADO SIN BRUSQUEDAD: ninguna campaña baja más de 20% en una corrida. Si el plan pide bajar más, baja 20% hoy
 * y el resto en otra corrida (otro día). Además, si el presupuesto de una campaña ya cambió HOY, no la toca.
 *
 * QUÉ HACE:
 *   - VISTA PREVIA: muestra cada campaña con su presupuesto de hoy y el nuevo. No cambia nada.
 *   - EJECUTAR (solo con el OK): pone esos presupuestos y los topes por clic indicados.
 * No pausa, no enciende ni toca anuncios, palabras clave, páginas ni conversiones.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var PLANES = {
  '256-397-2201': { marca: 'Quick Laundry', mes: 12000, campanas: [
    { nombre: 'AB · Equipo para lavandería', dia: 285 },               // $129 por contacto · pierde 48% por presupuesto
    { nombre: 'AB · Autoservicio y monedas', dia: 55, tope: 17 },      // $52 por contacto · pierde 44% por posición
    { nombre: 'AB · Emprendimiento', dia: 17 },
    { nombre: 'AB · Marca Quick Laundry', dia: 4 },
    { nombre: 'AB · Secadoras para lavandería', dia: 3 },
    { nombre: 'AB · Marcas comerciales', dia: 3 },
    { nombre: 'Campaña Search Marcas', dia: 28 }                       // vieja, $230 por contacto: baja 20%
  ] },
  '118-347-6484': { marca: 'Gamesail', mes: 15800, campanas: [
    { nombre: 'AB · Lavadoras por capacidad y precio', dia: 220 },     // $66: la mejor de la cuenta
    { nombre: 'AB · Lavadoras para ropa y sábanas', dia: 150 },        // $156: más cara, no sube
    { nombre: 'AB · Competencia depurada', dia: 60 },                  // $68
    { nombre: 'AB · Hoteles y hospitales', dia: 35 },                  // gasta ~$29 al día
    { nombre: 'AB · Mangles y planchado', dia: 25 },                   // gasta ~$21 al día
    { nombre: 'AB · Marca Gamesail', dia: 10 },                        // gasta ~$5 al día
    { nombre: 'AB · Secadoras industriales', dia: 20 }                 // 0 contactos con $643 mientras Rodolfo revisa la página
  ] },
  '993-525-8739': { marca: 'Kingstar (CLM)', mes: 16700, campanas: [
    { nombre: 'AB · Alta capacidad 60 kg o más', dia: 310 },           // $233 · hoy $296: +5%
    { nombre: 'AB · Lavandería hotelera e institucional', dia: 85, tope: 21 },  // hoy $80
    { nombre: 'AB · Mangles y planchado', dia: 65, tope: 22 },         // $114: la más barata · hoy $50
    { nombre: 'AB · Túnel de lavado', dia: 58 },                       // $494 y 0 contactos en su página · hoy $73: −20%
    { nombre: 'AB · Lavadoras y secadoras de 20 a 45 kg', dia: 21 },   // se queda igual
    { nombre: 'AB · Marca CLM', dia: 10 }                              // hoy $5
  ] },
  '860-582-6837': { marca: 'Girbau', mes: 8900, campanas: [
    { nombre: 'AB · Marca Girbau', dia: 120 },
    { nombre: 'Max Rendimiento - Girbau', dia: 140 },    // +20%: no más, porque aprende de los WhatsApp desde el 11 nov
    { nombre: 'AB · Girbau por capacidad y sector', dia: 25 },
    { nombre: 'AB · Girbau Smart Plus', dia: 6 },
    { nombre: 'AB · Servicio técnico Girbau', dia: 3 }
  ] },
  '265-909-2662': { marca: 'Laundry Solutions', mes: 6000, campanas: [
    { nombre: 'AB · Servicio técnico industrial', dia: 125 },          // $141
    { nombre: 'AB · Reparación y mantenimiento', dia: 55 },            // $402: caro, no sube
    { nombre: 'AB · Refacciones Girbau y Gamesail', dia: 6 },
    { nombre: 'AB · Instalación', dia: 4 },
    { nombre: 'AB · Servicio a lavanderías', dia: 4 },
    { nombre: 'AB · Servicio a secadoras', dia: 4 }
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
  Logger.log('PRESUPUESTO AHORRO · ' + P.marca + ' · ' + pesos(P.mes) + ' al mes · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
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
    var obj = k.dia, nota = '';
    if (obj < c.monto * 0.8) { obj = Math.round(c.monto * 0.8); nota = ' · (el plan pide ' + pesos(k.dia) + '; hoy baja solo 20%)'; }
    var linea = '«' + k.nombre + '» · hoy ' + pesos(c.monto) + ' → ' + pesos(obj) + ' al día' + nota;
    if (Math.abs(c.monto - obj) < 0.5) { Logger.log(linea + ' · ya está'); }
    else if (c.compartido) { Logger.log(linea + ' · AVISO: presupuesto compartido, no se toca'); }
    else if (movidoHoy[c.presupuesto]) { Logger.log(linea + ' · YA SE MOVIÓ HOY, no se toca hasta mañana'); }
    else {
      Logger.log((obj > c.monto ? 'SUBE ' : 'BAJA ') + linea);
      ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(obj * 1e6) }, updateMask: 'amountMicros' } });
      textos.push(k.nombre + ' a ' + pesos(obj));
      despues += obj - c.monto;
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
  Logger.log('AHORRO · ' + P.marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · cambios: ' + ops.length + ' · con error: ' + malos +
    ' · diario ' + pesos(antes) + ' → ' + pesos(despues) + ' · al mes máx. ' + pesos(despues * 30.4));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}
