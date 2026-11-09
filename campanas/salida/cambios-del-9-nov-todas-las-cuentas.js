/**
 * Atelback · CAMBIOS DEL 9 NOV EN UN SOLO SCRIPT — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py), después de revisar los registros de «todo lo de hoy».
 * Junta, sin cambiarlos, estos cuatro scripts:
 *   1. Paso 2 del presupuesto (reparto-por-pasos-todas-las-cuentas.js). Gamesail «Secadoras industriales» queda EN ESPERA
 *      (0 contactos con $468 en 14 días): no sube.
 *   2. Acciones de conversión de la agencia anterior a SECUNDARIAS (acciones-viejas-a-secundarias-todas-las-cuentas.js).
 *   3. Apagar Display en las campañas de búsqueda «AB · …» (apagar-display-en-busqueda-todas-las-cuentas.js).
 *   4. Contar UN contacto por clic en las acciones «AB · …» y revisar qué metas cuentan (contar-un-toque-por-clic-todas-las-cuentas.js).
 * En GIRBAU las partes 2 y 4 solo se muestran (como vista previa) hasta el viernes 13: su Máximo rendimiento aprende de
 * esas acciones y no se mueve junto con el paso del presupuesto.
 *
 * VISTA PREVIA no cambia nada. EJECUTAR aplica las partes encendidas, solo con el OK de Sandy, cuenta por cuenta.
 * Para dejar fuera una parte, ponla en false aquí abajo antes de Ejecutar.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var HACER_REPARTO = true;    // parte 1
var HACER_ACCIONES = true;   // parte 2
var HACER_DISPLAY = true;    // parte 3
var HACER_CONTEO = true;     // parte 4
var GIRBAU_DESDE = '2026-11-13';

// ======================= reparto-por-pasos-todas-las-cuentas.js (sin cambios) =======================
function REPARTO(Logger, AdsApp) {
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

  var ops = [], textos = [], sumaDespues = sumaAntes;
  lista.forEach(function (k) {
    if (!conPresupuesto(k) || k.vaPres === k.enPres) return;
    var c = C[k.nombre], v = valor(k, k.vaPres), r = R[k.nombre] || { costo: 0, contactos: 0 };
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

return main;
}

// ======================= acciones-viejas-a-secundarias-todas-las-cuentas.js (sin cambios) =======================
function ACCIONES(Logger, AdsApp) {
/**
 * Atelback · Pasar a SECUNDARIAS las acciones de conversión de la agencia anterior — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py). Pendiente D9.
 *
 * QUÉ HACE:
 *   - En VISTA PREVIA solo lee y lo dice todo. Por cada acción PRINCIPAL que no es «AB · …»:
 *       cuántas conversiones contó en los últimos 365 días y el último día que contó algo.
 *     Así se ve cuáles están muertas y cuáles alguien sigue usando.
 *   - Con EJECUTAR (solo con el OK de Sandy, cuenta por cuenta) las pasa de PRINCIPAL a SECUNDARIA.
 *     NO borra ninguna, NO las apaga y NO pierde su historial. Se pueden regresar a principal cuando se quiera.
 *
 * SE QUEDAN COMO PRINCIPALES (no las toca):
 *   - Todas las «AB · …».
 *   - Las de llamadas desde el anuncio (tipo AD_CALL o CLICK_TO_CALL: «Calls from ads», «Llamadas desde anuncios»…). Con esas cuenta
 *     Google las llamadas del botón de llamada que pusimos; si se vuelven secundarias, las llamadas dejan de contar.
 *   - Las que se cargan desde un sistema de clientes («Lead Calificado», «Cliente potencial de llamada»), mientras
 *     CARGAS_TAMBIEN sea false. Desde el 9 nov está en true: Sandy confirmó que ya nadie las usa, así que también pasan.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK.
 */

var CARGAS_TAMBIEN = true;    // Sandy confirmó el 9 nov que nadie usa las cargas («Lead Calificado», «Cliente potencial de llamada»): también pasan
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var CARGAS = { UPLOAD_CLICKS: 1, UPLOAD_CALLS: 1, STORE_SALES_DIRECT_UPLOAD: 1, STORE_SALES: 1, SALESFORCE: 1 };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hasta = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - 365 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('ACCIONES VIEJAS A SECUNDARIAS · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica los cambios'));
  Logger.log('Historial revisado: del ' + desde + ' al ' + hasta + '.');
  Logger.log('');

  var H = {};
  filas("SELECT segments.conversion_action_name, segments.date, metrics.all_conversions FROM customer WHERE segments.date BETWEEN '" +
    desde + "' AND '" + hasta + "' AND metrics.all_conversions > 0", 'el historial').forEach(function (f) {
      var a = f.segments.conversionActionName, x = H[a] = H[a] || { total: 0, ultimo: '' };
      x.total += Number(f.metrics.allConversions) || 0;
      if (f.segments.date > x.ultimo) x.ultimo = f.segments.date;
    });
  function hist(nombre) {
    var x = H[nombre];
    return x ? n(x.total) + ' en 365 días · la última el ' + x.ultimo : '0 en 365 días';
  }

  var cambiar = [], quedan = [], ops = [], textos = [];
  filas("SELECT conversion_action.resource_name, conversion_action.name, conversion_action.type, conversion_action.primary_for_goal " +
    "FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones').forEach(function (f) {
      var a = f.conversionAction;
      if (!a.primaryForGoal) return;
      if (/^AB\s*·/.test(a.name)) { quedan.push(a.name + ' · nuestra · ' + hist(a.name)); return; }
      if (a.type === 'AD_CALL' || a.type === 'CLICK_TO_CALL') { quedan.push(a.name + ' · llamadas del botón del anuncio, se queda principal · ' + hist(a.name)); return; }
      if (CARGAS[a.type] && !CARGAS_TAMBIEN) { quedan.push(a.name + ' · carga desde un sistema de clientes, espera al cliente · ' + hist(a.name)); return; }
      cambiar.push(a.name + ' (' + a.type + ') · ' + hist(a.name));
      ops.push({ conversionActionOperation: { update: { resourceName: a.resourceName, primaryForGoal: false }, updateMask: 'primaryForGoal' } });
      textos.push(a.name);
    });

  Logger.log('==== PASAN A SECUNDARIAS (' + cambiar.length + ') ====');
  cambiar.forEach(function (t) { Logger.log(t); });
  if (!cambiar.length) Logger.log('Ninguna. No hay acciones viejas principales que mover.');
  Logger.log('');
  Logger.log('==== SE QUEDAN COMO PRINCIPALES (' + quedan.length + ') ====');
  quedan.forEach(function (t) { Logger.log(t); });
  Logger.log('');

  var malos = 0;
  if (!vista && ops.length) {
    var res = AdsApp.mutateAll(ops, { partialFailure: true });
    res.forEach(function (r, i) {
      if (r.isSuccessful()) Logger.log('✅ ' + textos[i] + ' ahora es secundaria.');
      else { malos++; Logger.log('❌ ' + textos[i] + ' no se pudo cambiar por script (hay que hacerlo a mano): ' + r.getErrorMessages().join('; ')); }
    });
    Logger.log('');
  }

  Logger.log('ACCIONES VIEJAS · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · a secundarias: ' + cambiar.length +
    (vista ? '' : ' (con error: ' + malos + ')') + ' · se quedan principales: ' + quedan.length);
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada. Manda el registro y espera el OK para Ejecutar.'
    : 'LISTO. Cambios aplicados. Copia todo el registro y mándalo.');
}

return main;
}

// ======================= apagar-display-en-busqueda-todas-las-cuentas.js (sin cambios) =======================
function DISPLAY(Logger, AdsApp) {
/**
 * Atelback · Apagar la red de Display en las campañas de BÚSQUEDA «AB · …» — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * POR QUÉ: las campañas «AB · …» se diseñaron «solo Red de Búsqueda, sin socios ni Display» (fichas de cada cuenta),
 * pero varias quedaron con Display encendido. El script de horario del 9 nov mostró que ese Display trae clics baratos
 * de madrugada que casi no se vuelven contactos y se come el presupuesto que necesitan las búsquedas
 * (Equipo de Quick Laundry, Alta capacidad de Kingstar y Reparación de Laundry Solutions pierden 44–50% por presupuesto).
 *
 * QUÉ HACE:
 *   - VISTA PREVIA: solo lee. Lista las campañas de búsqueda «AB · …» encendidas que tienen Display, con lo que
 *     Display les dio en los últimos 30 días (clics, gasto, contactos) contra lo que les dio la búsqueda.
 *   - EJECUTAR (solo con el OK de Sandy, cuenta por cuenta): les apaga Display. La búsqueda en Google sigue igual.
 * No toca presupuestos, anuncios, palabras clave, Máximo rendimiento ni campañas que no sean «AB · …».
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK.
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
function pesos(m) { return '$' + Math.round((Number(m) || 0) / 1e6).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var hasta = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - 30 * 864e5), tz, 'yyyy-MM-dd');
  Logger.log('APAGAR DISPLAY EN BÚSQUEDA · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica el cambio'));
  Logger.log('Lo que dio cada red del ' + desde + ' al ' + hasta + '.');
  Logger.log('');

  var S = {};
  filas("SELECT campaign.name, segments.ad_network_type, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM campaign " +
    "WHERE campaign.advertising_channel_type = 'SEARCH' AND segments.date BETWEEN '" + desde + "' AND '" + hasta + "'", 'las redes')
    .forEach(function (f) {
      var x = S[f.campaign.name] = S[f.campaign.name] || { d: { c: 0, g: 0, v: 0 }, b: { c: 0, g: 0, v: 0 } };
      var t = f.segments.adNetworkType === 'CONTENT' ? x.d : x.b, m = f.metrics;
      t.c += Number(m.clicks) || 0; t.g += Number(m.costMicros) || 0; t.v += Number(m.allConversions) || 0;
    });

  var ops = [], textos = [], tot = { c: 0, g: 0, v: 0 };
  filas("SELECT campaign.resource_name, campaign.name, campaign.network_settings.target_content_network FROM campaign " +
    "WHERE campaign.status = 'ENABLED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas').forEach(function (f) {
      var c = f.campaign;
      if (!/^AB\s*·/.test(c.name) || !(c.networkSettings || {}).targetContentNetwork) return;
      var x = S[c.name] || { d: { c: 0, g: 0, v: 0 }, b: { c: 0, g: 0, v: 0 } };
      tot.c += x.d.c; tot.g += x.d.g; tot.v += x.d.v;
      Logger.log('«' + c.name + '» · Display: ' + x.d.c + ' clics · ' + pesos(x.d.g) + ' · ' + n(x.d.v) + ' contactos' +
        '  ||  Búsqueda: ' + x.b.c + ' clics · ' + pesos(x.b.g) + ' · ' + n(x.b.v) + ' contactos');
      ops.push({ campaignOperation: { update: { resourceName: c.resourceName, networkSettings: { targetContentNetwork: false } },
        updateMask: 'networkSettings.targetContentNetwork' } });
      textos.push(c.name);
    });
  if (!ops.length) Logger.log('Ninguna campaña de búsqueda «AB · …» tiene Display encendido. No hay nada que cambiar.');
  Logger.log('');

  var malos = 0;
  if (!vista && ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (r.isSuccessful()) Logger.log('✅ «' + textos[i] + '»: Display apagado. Sigue en la búsqueda de Google.');
      else { malos++; Logger.log('❌ «' + textos[i] + '» no se pudo cambiar: ' + r.getErrorMessages().join('; ')); }
    });
    Logger.log('');
  }
  Logger.log('DISPLAY · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · se apaga en ' + ops.length + ' campaña(s)' +
    (vista ? '' : ' (con error: ' + malos + ')') + ' · Display en 30 días: ' + tot.c + ' clics, ' + pesos(tot.g) + ', ' + n(tot.v) + ' contactos');
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}

return main;
}

// ======================= contar-un-toque-por-clic-todas-las-cuentas.js (sin cambios) =======================
function CONTEO(Logger, AdsApp) {
/**
 * Atelback · Contar UN contacto por clic en nuestras acciones «AB · …», y revisar qué metas cuentan — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * POR QUÉ: el diagnóstico del 9 nov mostró en Quick Laundry búsquedas con 1 clic y 10 «contactos» («speed queen méxico»)
 * y 20 contactos de madrugada con 18 clics. Eso pasa cuando una misma persona toca el botón de WhatsApp varias veces
 * y la acción está en «Cada una»: cuenta cada toque. Con «Una» cuenta una sola vez por clic en el anuncio, que es lo
 * que se puede cruzar con lo que anota el vendedor.
 *
 * QUÉ HACE:
 *   1. VISTA PREVIA: lista las acciones «AB · …» encendidas y cómo cuentan (Una o Cada una).
 *      EJECUTAR (solo con el OK): las que están en «Cada una» pasan a «Una». No cambia nada más.
 *   2. SOLO LEE: qué metas (categorías) cuentan en la columna «Conversiones» de la cuenta. Avisa si la meta de
 *      Contacto (donde está «AB · Clic en WhatsApp») o la de Formulario NO cuentan.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR solo con el OK.
 */

var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var CONTEO = { ONE_PER_CLICK: 'Una', MANY_PER_CLICK: 'Cada una' };
var META = { CONTACT: 'Contacto', SUBMIT_LEAD_FORM: 'Envío de formulario', PHONE_CALL_LEAD: 'Llamada', OUTBOUND_CLICK: 'Clic saliente',
  QUALIFIED_LEAD: 'Lead calificado', CONVERTED_LEAD: 'Lead convertido', GET_DIRECTIONS: 'Cómo llegar', ENGAGEMENT: 'Interacción',
  PAGE_VIEW: 'Vista de página', DEFAULT: 'Otra', DOWNLOAD: 'Descarga' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var marca = MARCAS[cid] || cuenta.getName();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('UN CONTACTO POR CLIC · ' + marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica el cambio'));
  Logger.log('');

  Logger.log('==== 1. CÓMO CUENTAN NUESTRAS ACCIONES «AB · …» ====');
  var ops = [], textos = [], cats = {};
  filas("SELECT conversion_action.resource_name, conversion_action.name, conversion_action.counting_type, conversion_action.category, " +
    "conversion_action.include_in_conversions_metric FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones')
    .forEach(function (f) {
      var a = f.conversionAction;
      if (!/^AB\s*·/.test(a.name)) return;
      cats[a.category] = cats[a.category] || [];
      cats[a.category].push(a.name);
      var cambia = a.countingType === 'MANY_PER_CLICK';
      Logger.log(a.name + ' · cuenta: ' + (CONTEO[a.countingType] || a.countingType) + (cambia ? ' → pasa a «Una»' : ' · ya está bien') +
        (a.includeInConversionsMetric ? '' : ' · ⚠️ NO sale en la columna «Conversiones»'));
      if (cambia) {
        ops.push({ conversionActionOperation: { update: { resourceName: a.resourceName, countingType: 'ONE_PER_CLICK' }, updateMask: 'countingType' } });
        textos.push(a.name);
      }
    });
  Logger.log('');

  Logger.log('==== 2. QUÉ METAS CUENTAN EN LA COLUMNA «CONVERSIONES» (solo lee) ====');
  var avisos = [];
  filas("SELECT customer_conversion_goal.category, customer_conversion_goal.origin, customer_conversion_goal.biddable FROM customer_conversion_goal",
    'las metas').forEach(function (f) {
      var g = f.customerConversionGoal, nuestras = g.origin === 'WEBSITE' ? cats[g.category] : null;
      Logger.log((g.biddable ? 'CUENTA     ' : 'no cuenta  ') + '· ' + (META[g.category] || g.category) + ' (' + g.origin + ')' +
        (nuestras ? ' · ahí están: ' + nuestras.join(', ') : ''));
      if (nuestras && !g.biddable) avisos.push((META[g.category] || g.category) + ' no cuenta y ahí está ' + nuestras.join(', '));
    });
  if (avisos.length) Logger.log('⚠️ ' + avisos.join(' | '));
  Logger.log('');

  var malos = 0;
  if (!vista && ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (r.isSuccessful()) Logger.log('✅ ' + textos[i] + ' ahora cuenta «Una» por clic.');
      else { malos++; Logger.log('❌ ' + textos[i] + ' no se pudo cambiar: ' + r.getErrorMessages().join('; ')); }
    });
    Logger.log('');
  }
  Logger.log('CONTEO · ' + marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · pasan a «Una»: ' + ops.length +
    (vista ? '' : ' (con error: ' + malos + ')') + ' · metas nuestras que no cuentan: ' + (avisos.length ? avisos.join(' | ') : 'ninguna'));
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada.' : 'LISTO. Copia todo el registro y mándalo.');
}

return main;
}

// ======================= El que corre todo =======================
var RESUMEN = [];
function registro(guardar) {
  return { log: function (x) { Logger.log(x); if (guardar(String(x))) RESUMEN.push(String(x)); } };
}
// Para Girbau antes del viernes 13: la parte corre como VISTA PREVIA aunque se le dé Ejecutar (no puede cambiar nada).
function soloLee() {
  return {
    search: function (q) { return AdsApp.search(q); },
    currentAccount: function () { return AdsApp.currentAccount(); },
    getExecutionInfo: function () { return { isPreview: function () { return true; } }; },
    mutateAll: function () { throw new Error('esta parte solo lee en esta cuenta hoy'); }
  };
}
function parte(titulo, hacer, motivo, crear, guardar, ads) {
  Logger.log('');
  Logger.log('########################################################################');
  Logger.log('# ' + titulo);
  Logger.log('########################################################################');
  if (!hacer) { Logger.log('No se corre: ' + motivo); RESUMEN.push(titulo + ' · no se corrió: ' + motivo); return; }
  if (ads !== AdsApp) { Logger.log('(En esta cuenta, hoy esta parte SOLO SE MUESTRA: no cambia nada aunque se dé Ejecutar.)');
    RESUMEN.push(titulo + ' · solo se muestra hoy en esta cuenta'); }
  try { crear(registro(guardar), ads)(); }
  catch (e) { Logger.log('❌ Esta parte se detuvo: ' + e.message); RESUMEN.push(titulo + ' · ❌ se detuvo: ' + e.message); }
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var hoy = Utilities.formatDate(new Date(), cuenta.getTimeZone(), 'yyyy-MM-dd');
  var vista = AdsApp.getExecutionInfo().isPreview();
  var girbauEspera = cid === '860-582-6837' && hoy < GIRBAU_DESDE;
  Logger.log('CAMBIOS DEL 9 NOV · cuenta ' + cid + ' · ' + hoy + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica las partes encendidas'));

  parte('1. PASO DEL PRESUPUESTO', HACER_REPARTO, 'apagado arriba (HACER_REPARTO = false).', REPARTO,
    function (x) { return /^(BAJA|SUBE|TOPE|FRENO|EN ESPERA|AVISO|ERROR|Nada que cambiar|Hoy no hay nada|✅ Los tres pasos|Suma de presupuestos|VISTA PREVIA|LISTO\. Cambios|Terminó)/.test(x); },
    AdsApp);
  parte('2. ACCIONES VIEJAS A SECUNDARIAS', HACER_ACCIONES, 'apagado arriba (HACER_ACCIONES = false).', ACCIONES,
    function (x) { return /^(ACCIONES VIEJAS ·|❌)/.test(x); }, girbauEspera ? soloLee() : AdsApp);
  parte('3. APAGAR DISPLAY EN BÚSQUEDA', HACER_DISPLAY, 'apagado arriba (HACER_DISPLAY = false).', DISPLAY,
    function (x) { return /^(DISPLAY ·|❌)/.test(x); }, AdsApp);
  parte('4. UN CONTACTO POR CLIC Y METAS', HACER_CONTEO, 'apagado arriba (HACER_CONTEO = false).', CONTEO,
    function (x) { return /^(CONTEO ·|❌|⚠️)/.test(x); }, girbauEspera ? soloLee() : AdsApp);

  Logger.log('');
  Logger.log('################################ RESUMEN ################################');
  RESUMEN.forEach(function (x) { Logger.log(x); });
  Logger.log(vista ? 'FIN · VISTA PREVIA: no se cambió nada. Copia TODO el registro y mándalo; Ejecutar solo con el OK.'
    : 'FIN · Se aplicaron las partes encendidas. Copia TODO el registro y mándalo.');
}
