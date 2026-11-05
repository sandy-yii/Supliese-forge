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
 *   - Nunca sube una campaña que va a la baja ni baja una que va a la alza (si alguien ya la movió, la deja).
 *   - Gamesail, en el paso 1: tope de costo por clic de «Hoteles y hospitales» de $16 a $20 (autorizado para Gamesail).
 * No toca anuncios, palabras clave, páginas, campañas anteriores ni ninguna otra campaña. No enciende ni pausa nada.
 * Girbau no cambia: no hace falta correrlo ahí.
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
    { nombre: 'AB · Reparación y mantenimiento', de: 156, a: 55 },
    { nombre: 'AB · Refacciones Girbau y Gamesail', de: 10, a: 1 },
    { nombre: 'AB · Instalación', de: 10, a: 1 },
    { nombre: 'AB · Servicio a lavanderías', de: 8, a: 1 },
    { nombre: 'AB · Servicio a secadoras', de: 10, a: 1 }
  ] },
  { cuenta: '118-347-6484', nombre: 'Gamesail', campanas: [
    { nombre: 'AB · Lavadoras para ropa y sábanas', de: 97, a: 194 },
    { nombre: 'AB · Lavadoras por capacidad y precio', de: 58, a: 117 },
    { nombre: 'AB · Secadoras industriales', de: 58, a: 117 },
    { nombre: 'AB · Hoteles y hospitales', de: 39, a: 78, tope: 20 },
    { nombre: 'AB · Mangles y planchado', de: 26, a: 52 },
    { nombre: 'AB · Competencia depurada', de: 23, a: 45 },
    { nombre: 'AB · Marca Gamesail', de: 23, a: 45 }
  ] },
  { cuenta: '860-582-6837', nombre: 'Girbau', campanas: [] }
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
function valor(k, paso) { return paso >= 3 ? k.a : Math.round(k.de + (k.a - k.de) * paso / 3); }
function baja(k) { return k.a < k.de; }
// ¿La campaña ya está en el paso (o más allá)?
function llego(k, actual, paso) { var v = valor(k, paso); return baja(k) ? actual <= v + 0.5 : actual >= v - 0.5; }

function main() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var PLAN = null;
  PLANES.forEach(function (p) { if (p.cuenta === cid) PLAN = p; });
  if (!PLAN) throw new Error('La cuenta ' + cid + ' no está en la lista. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hoy = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd');
  Logger.log('NUEVO REPARTO POR PASOS · ' + PLAN.nombre + ' · ' + hoy + (vista ? ' · VISTA PREVIA (no cambia nada)' : ' · EJECUTANDO'));
  Logger.log('');
  if (!PLAN.campanas.length) { Logger.log('En ' + PLAN.nombre + ' el presupuesto no cambia. No se hizo nada.'); return; }

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
  var lista = PLAN.campanas.filter(function (k) { return C[k.nombre]; });

  // Qué paso toca: el primero que todavía no está aplicado
  var paso = 0;
  for (var p = 1; p <= 3; p++) {
    if (!lista.every(function (k) { return llego(k, C[k.nombre].monto, p); })) { paso = p; break; }
  }
  Logger.log('== CAMINO DE CADA CAMPAÑA (al día) ==');
  lista.forEach(function (k) {
    Logger.log('«' + k.nombre + '»: hoy ' + dinero(C[k.nombre].monto) + ' · paso 1 ' + dinero(valor(k, 1)) + ' · paso 2 ' + dinero(valor(k, 2)) +
      ' · paso 3 ' + dinero(valor(k, 3)) + (C[k.nombre].estado !== 'ENABLED' ? ' (campaña ' + C[k.nombre].estado + ')' : ''));
  });
  Logger.log('');
  if (!paso) { Logger.log('✅ Los tres pasos ya están aplicados en ' + PLAN.nombre + '. No hay nada que cambiar.'); return; }
  if (hoy < FECHAS[paso - 1]) {
    Logger.log('El paso ' + paso + ' toca desde el ' + FECHAS[paso - 1] + '. Hoy no hay nada que cambiar en ' + PLAN.nombre + '.');
    return;
  }

  var ops = [], textos = [], sumaDespues = sumaAntes;
  lista.forEach(function (k) {
    var c = C[k.nombre], v = valor(k, paso);
    var nuevo = baja(k) ? Math.min(c.monto, v) : Math.max(c.monto, v);
    if (Math.abs(nuevo - c.monto) < 0.5) return;
    if (c.compartido) { Logger.log('AVISO «' + k.nombre + '»: su presupuesto es compartido con otras campañas; no lo toqué.'); return; }
    ops.push({ campaignBudgetOperation: { update: { resourceName: c.presupuesto, amountMicros: Math.round(nuevo * 1e6) }, updateMask: 'amountMicros' } });
    textos.push((nuevo < c.monto ? 'BAJA' : 'SUBE') + ' «' + k.nombre + '»: ' + dinero(c.monto) + ' → ' + dinero(nuevo) + ' al día');
    if (c.estado === 'ENABLED') sumaDespues += nuevo - c.monto;
  });
  lista.forEach(function (k) {
    var c = C[k.nombre];
    if (!k.tope || paso !== 1) return;
    if (c.puja !== 'TARGET_SPEND') { Logger.log('AVISO «' + k.nombre + '»: no usa «maximizar clics»; su tope no se cambia.'); return; }
    if (c.tope >= k.tope) return;
    ops.push({ campaignOperation: { update: { resourceName: c.rn, targetSpend: { cpcBidCeilingMicros: Math.round(k.tope * 1e6) } },
      updateMask: 'targetSpend.cpcBidCeilingMicros' } });
    textos.push('TOPE «' + k.nombre + '»: costo por clic máximo $' + c.tope + ' → $' + k.tope);
  });

  Logger.log(vista ? '================ PASO ' + paso + ' DE 3 · SE HARÍA ================' : '================ PASO ' + paso + ' DE 3 · CAMBIOS ================');
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
                        : 'LISTO. Paso ' + paso + ' de 3 aplicado en ' + PLAN.nombre + (paso < 3 ? '. El paso ' + (paso + 1) + ' toca desde el ' + FECHAS[paso] + '.' : '. Reparto completo.'));
}
