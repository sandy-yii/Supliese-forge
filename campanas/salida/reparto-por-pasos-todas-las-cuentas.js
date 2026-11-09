/**
 * Atelback · Nuevo reparto del presupuesto, en tres pasos — Quick Laundry, Kingstar, Laundry Solutions y Gamesail
 * Escrito a mano el 5 nov 2026 (no lo genera generar.py). Acordado con el cliente en la junta del 5 nov:
 * mover el presupuesto como se propuso (≈ $53,300 al mes en total, lo mismo que gastaba la agencia anterior),
 * pero poco a poco, para no frenar los contactos.
 *
 * QUÉ HACE (reconoce sola en qué cuenta está y qué paso toca):
 *   - Cada paso mueve un tercio del camino entre el presupuesto de hoy y el acordado:
 *       paso 1 desde el jueves 5 nov · paso 2 desde el lunes 9 nov · paso 3 desde el jueves 12 nov.
 *   - Las que bajan, bajan un tercio en cada paso. Gamesail sube un tercio en cada paso, con el mismo dinero que sale
 *     de las otras, así el gasto total del grupo se queda casi igual mientras dura el cambio.
 *   - Si un paso ya se aplicó, no lo repite. Si todavía no es la fecha del siguiente, no hace nada y lo dice.
 *     Cada campaña avanza como máximo un paso por corrida: si un día se olvida, no da un salto doble.
 *     Candado (9 nov): si su presupuesto o su tope ya cambió HOY, no se mueve otra vez hoy aunque se vuelva a correr.
 *   - Nunca sube una campaña que va a la baja ni baja una que va a la alza (si alguien ya la movió, la deja).
 *   - Los 3 topes de costo por clic autorizados el 5 nov también suben en tres pasos, un tercio cada vez:
 *       Gamesail «Hoteles y hospitales» $16 → $20 · Laundry Solutions «Reparación» $15 → $18 · Girbau «Por capacidad» $20 → $24.
 *     El tope no sube el gasto: el presupuesto diario sigue mandando. Solo deja entrar a más búsquedas.
 *   - FRENO para no perder contactos: si una campaña que va a la baja trajo 2 o más contactos en los últimos 7 días a un
 *     costo por contacto igual o mejor que el de su cuenta, ese paso NO la baja y lo dice. Se revisa en el siguiente paso.
 * No toca anuncios, palabras clave, páginas, campañas anteriores ni ninguna otra campaña. No enciende ni pausa nada.
 * En Girbau el presupuesto no cambia: solo sube el tope de «Por capacidad y sector».
 *
 * CÓMO SE USA: en cada cuenta, en la fecha del paso > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK. Mientras dure el cambio NO se corren «ajustes», «subir presupuesto», «más leads» ni «activar».
 */

var FECHAS = ['2026-11-05', '2026-11-09', '2026-11-12'];   // desde cuándo se puede aplicar el paso 1, 2 y 3

// de: presupuesto al día antes del cambio · a: presupuesto al día acordado
var PLANES = [
  { cuenta: '256-397-2201', nombre: 'Quick Laundry', campanas: [
    { nombre: 'AB · Emprendimiento', de: 20, a: 10 }
  ] },
  { cuenta: '993-525-8739', nombre: 'Kingstar (CLM)', campanas: [
    { nombre: 'AB · Alta capacidad 60 kg o más', de: 330, a: 227 },
    { nombre: 'AB · Lavandería hotelera e institucional', de: 100, a: 40 },
    { nombre: 'AB · Túnel de lavado', de: 80, a: 70 },
    { nombre: 'AB · Lavadoras y secadoras de 20 a 45 kg', de: 50, a: 6 }
  ] },
  { cuenta: '265-909-2662', nombre: 'Laundry Solutions', campanas: [
    { nombre: 'AB · Reparación y mantenimiento', de: 156, a: 55, tope: { de: 15, a: 18 } },
    { nombre: 'AB · Refacciones Girbau y Gamesail', de: 10, a: 1 },
    { nombre: 'AB · Instalación', de: 10, a: 1 },
    { nombre: 'AB · Servicio a lavanderías', de: 8, a: 1 },
    { nombre: 'AB · Servicio a secadoras', de: 10, a: 1 }
  ] },
  { cuenta: '118-347-6484', nombre: 'Gamesail', campanas: [
    { nombre: 'AB · Lavadoras para ropa y sábanas', de: 97, a: 194 },
    { nombre: 'AB · Lavadoras por capacidad y precio', de: 58, a: 117 },
    { nombre: 'AB · Secadoras industriales', de: 58, a: 117, espera: '0 contactos en 14 días con $468 (26 oct–8 nov): no sube hasta que traiga' },   // 9 nov
    { nombre: 'AB · Hoteles y hospitales', de: 39, a: 78, tope: { de: 16, a: 20 } },
    { nombre: 'AB · Mangles y planchado', de: 26, a: 52 },
    { nombre: 'AB · Competencia depurada', de: 23, a: 45 },
    { nombre: 'AB · Marca Gamesail', de: 23, a: 45 }
  ] },
  { cuenta: '860-582-6837', nombre: 'Girbau', campanas: [
    { nombre: 'AB · Girbau por capacidad y sector', tope: { de: 20, a: 24 } }   // sin cambio de presupuesto
  ] }
];

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
function tercio(de, a, paso) { return paso >= 3 ? a : Math.round(de + (a - de) * paso / 3); }
function conPresupuesto(k) { return typeof k.de === 'number'; }
function valor(k, paso) { return tercio(k.de, k.a, paso); }
function valorTope(k, paso) { return tercio(k.tope.de, k.tope.a, paso); }
function baja(k) { return conPresupuesto(k) && k.a < k.de; }
// ¿La campaña ya está en el paso (o más allá)? Un tope solo cuenta si la campaña usa «maximizar clics».
function llegoPres(k, c, paso) { var v = valor(k, paso); return baja(k) ? c.monto <= v + 0.5 : c.monto >= v - 0.5; }
function llegoTope(k, c, paso) { return c.tope >= valorTope(k, paso) - 0.005; }
// En qué paso va (0 a 3) y a cuál le toca ir hoy: uno más, sin pasar del paso que permite la fecha.
function enPaso(fn) { for (var p = 3; p >= 1; p--) if (fn(p)) return p; return 0; }

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var PLAN = null;
  PLANES.forEach(function (p) { if (p.cuenta === cid) PLAN = p; });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en la lista. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  Logger.log('NUEVO REPARTO POR PASOS · ' + PLAN.nombre + ' · ' + hoy + (vista ? ' · VISTA PREVIA (no cambia nada)' : ' · EJECUTANDO'));
  Logger.log('');

  // Campañas de la cuenta
  var C = {}, sumaAntes = 0;
  filas('SELECT campaign.name, campaign.status, campaign.resource_name, campaign.bidding_strategy_type, ' +
    'campaign.target_spend.cpc_bid_ceiling_micros, campaign_budget.resource_name, campaign_budget.amount_micros, ' +
    "campaign_budget.explicitly_shared FROM campaign WHERE campaign.status != 'REMOVED'", 'las campañas').forEach(function (f) {
    C[f.campaign.name] = { rn: f.campaign.resourceName, estado: f.campaign.status, puja: f.campaign.biddingStrategyType,
      tope: Number((f.campaign.targetSpend || {}).cpcBidCeilingMicros || 0) / 1e6,
      presupuesto: f.campaignBudget.resourceName, monto: Number(f.campaignBudget.amountMicros || 0) / 1e6,
      compartido: f.campaignBudget.explicitlyShared };
    if (f.campaign.status === 'ENABLED') sumaAntes += C[f.campaign.name].monto;
  });

  var faltan = [];
  PLAN.campanas.forEach(function (k) { if (!C[k.nombre]) faltan.push(k.nombre); });
  if (faltan.length) Logger.log('AVISO: no encontré ' + faltan.map(function (n) { return '«' + n + '»'; }).join(', ') + '. Esa(s) no se tocan.');
  PLAN.campanas.forEach(function (k) {
    if (k.espera && C[k.nombre]) Logger.log('EN ESPERA «' + k.nombre + '»: no se mueve en este paso. ' + k.espera + '.');
  });
  var lista = PLAN.campanas.filter(function (k) { return C[k.nombre] && !k.espera; });

  // Cada campaña avanza como máximo UN paso por corrida (se corre una vez por fecha), y solo hasta el paso que permite la fecha.
  var pasoFecha = FECHAS.filter(function (f) { return hoy >= f; }).length;
  var completo = true, toca = false;
  lista.forEach(function (k) {
    var c = C[k.nombre];
    k.enPres = conPresupuesto(k) ? enPaso(function (p) { return llegoPres(k, c, p); }) : 3;
    k.enTope = (k.tope && c.puja === 'TARGET_SPEND') ? enPaso(function (p) { return llegoTope(k, c, p); }) : 3;
    k.vaPres = Math.max(k.enPres, Math.min(pasoFecha, k.enPres + 1));
    k.vaTope = Math.max(k.enTope, Math.min(pasoFecha, k.enTope + 1));
    if (k.enPres < 3 || k.enTope < 3) completo = false;
    if (k.vaPres > k.enPres || k.vaTope > k.enTope) toca = true;
  });
  Logger.log('== CAMINO DE CADA CAMPAÑA (al día) ==');
  lista.forEach(function (k) {
    var c = C[k.nombre];
    if (conPresupuesto(k)) Logger.log('«' + k.nombre + '» presupuesto: hoy ' + dinero(c.monto) + ' · paso 1 ' + dinero(valor(k, 1)) +
      ' · paso 2 ' + dinero(valor(k, 2)) + ' · paso 3 ' + dinero(valor(k, 3)) + (c.estado !== 'ENABLED' ? ' (campaña ' + c.estado + ')' : ''));
    if (k.tope) Logger.log('«' + k.nombre + '» tope por clic: hoy $' + c.tope + ' · paso 1 $' + valorTope(k, 1) + ' · paso 2 $' + valorTope(k, 2) +
      ' · paso 3 $' + valorTope(k, 3));
  });
  Logger.log('');
  if (completo) { Logger.log('✅ Los tres pasos ya están aplicados en ' + PLAN.nombre + '. No hay nada que cambiar.'); return; }
  if (!toca) {
    Logger.log('Hoy no hay nada que cambiar en ' + PLAN.nombre + '. ' + (pasoFecha < 3 ? 'El siguiente paso toca desde el ' + FECHAS[pasoFecha] + '.'
      : 'Lo que falta se aplica en la siguiente corrida, otro día (un paso por día).'));
    return;
  }

  // Freno: contactos y costo por contacto de los últimos 7 días completos
  var hace7 = Utilities.formatDate(new Date(Date.now() - 7 * 864e5), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  var ayer = Utilities.formatDate(new Date(Date.now() - 864e5), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  var R = {}, cuenta = { costo: 0, contactos: 0 };
  filas("SELECT campaign.name, metrics.cost_micros, metrics.conversions FROM campaign WHERE segments.date BETWEEN '" + hace7 + "' AND '" + ayer + "'",
    'los contactos de 7 días').forEach(function (f) {
    var r = { costo: Number(f.metrics.costMicros || 0) / 1e6, contactos: Number(f.metrics.conversions || 0) };
    R[f.campaign.name] = r; cuenta.costo += r.costo; cuenta.contactos += r.contactos;
  });
  var cpcCuenta = cuenta.contactos ? cuenta.costo / cuenta.contactos : 0;
  Logger.log('Últimos 7 días (' + hace7 + ' a ' + ayer + '): ' + Math.round(cuenta.contactos * 10) / 10 + ' contactos en la cuenta' +
    (cpcCuenta ? ' · ' + dinero(cpcCuenta) + ' por contacto' : ''));
  Logger.log('');

  // Candado: si el presupuesto o el tope de una campaña ya se movió HOY (por este u otro script, o a mano), hoy no se vuelve a mover.
  // Así, correrlo dos veces el mismo día nunca da dos pasos seguidos.
  var movidoHoy = {};
  filas("SELECT change_event.change_resource_name, change_event.change_resource_type FROM change_event WHERE change_event.change_date_time >= '" +
    hoy + " 00:00:00' AND change_event.change_date_time <= '" + hoy + " 23:59:59' AND change_event.change_resource_type IN ('CAMPAIGN_BUDGET', 'CAMPAIGN') LIMIT 2000",
    'los cambios de hoy').forEach(function (f) { movidoHoy[f.changeEvent.changeResourceName] = true; });

  var ops = [], textos = [], sumaDespues = sumaAntes;
  lista.forEach(function (k) {
    if (!conPresupuesto(k) || k.vaPres === k.enPres) return;
    var c = C[k.nombre], v = valor(k, k.vaPres), r = R[k.nombre] || { costo: 0, contactos: 0 };
    if (movidoHoy[c.presupuesto]) { Logger.log('YA SE MOVIÓ HOY «' + k.nombre + '»: su presupuesto ya cambió hoy; el siguiente paso, en la siguiente fecha.'); return; }
    if (baja(k) && c.monto > v + 0.5 && r.contactos >= 2 && cpcCuenta && r.costo / r.contactos <= cpcCuenta) {
      Logger.log('FRENO «' + k.nombre + '»: no baja en este paso. Trajo ' + Math.round(r.contactos * 10) / 10 + ' contactos en 7 días a ' +
        dinero(r.costo / r.contactos) + ' cada uno (la cuenta va en ' + dinero(cpcCuenta) + '). Se queda en ' + dinero(c.monto) + '.');
      return;
    }
    var nuevo = baja(k) ? Math.min(c.monto, v) : Math.max(c.monto, v);
    if (Math.abs(nuevo - c.monto) < 0.5) return;
    if (c.compartido) { Logger.log('AVISO «' + k.nombre + '»: su presupuesto es compartido con otras campañas; no lo toqué.'); return; }
    ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
    textos.push((nuevo < c.monto ? 'BAJA' : 'SUBE') + ' «' + k.nombre + '» (paso ' + k.vaPres + ' de 3): ' + dinero(c.monto) + ' → ' + dinero(nuevo) + ' al día');
    if (c.estado === 'ENABLED') sumaDespues += nuevo - c.monto;
  });
  lista.forEach(function (k) {
    var c = C[k.nombre];
    if (!k.tope) return;
    if (c.puja !== 'TARGET_SPEND') { Logger.log('AVISO «' + k.nombre + '»: no usa «maximizar clics»; su tope no se cambia.'); return; }
    if (k.vaTope === k.enTope) return;
    if (movidoHoy[c.rn]) { Logger.log('YA SE MOVIÓ HOY «' + k.nombre + '»: la campaña ya cambió hoy; su tope sube en la siguiente fecha.'); return; }
    var t = valorTope(k, k.vaTope);
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(t * 1e6) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    textos.push('TOPE «' + k.nombre + '» (paso ' + k.vaTope + ' de 3): costo por clic máximo $' + c.tope + ' → $' + t + ' (no cambia el presupuesto)');
  });

  Logger.log(vista ? '================ SE HARÍA ================' : '================ CAMBIOS ================');
  textos.forEach(function (t) { Logger.log(t); });
  if (!ops.length) { Logger.log('Nada que cambiar.'); return; }
  Logger.log('');
  Logger.log('Suma de presupuestos diarios de la cuenta (campañas encendidas): ' + dinero(sumaAntes) + ' → ' + dinero(sumaDespues) +
    ' · al mes, como máximo ' + dinero(sumaDespues * 30.4));

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('ERROR en ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) Logger.log(malos ? 'VISTA PREVIA CON ' + malos + ' ERROR(ES): manda el registro antes de ejecutar.'
                              : 'VISTA PREVIA SIN ERRORES. Manda el registro; EJECUTAR solo con el OK.');
  else Logger.log(malos ? 'Terminó con ' + malos + ' error(es): manda el registro.'
                        : 'LISTO. Cambios aplicados en ' + PLAN.nombre + (pasoFecha < 3 ? '. El siguiente paso toca desde el ' + FECHAS[pasoFecha] + '.' : '.'));
}
