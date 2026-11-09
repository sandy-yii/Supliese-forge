/**
 * Atelback · TODO LO DE HOY EN UN SOLO SCRIPT (lunes 9 nov 2026) — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py). Junta, sin cambiarlos, estos cuatro scripts:
 *   1. CAMBIA · Paso 2 del presupuesto (reparto-por-pasos-todas-las-cuentas.js), con su freno para no perder contactos.
 *   2. CAMBIA · Acciones de conversión de la agencia anterior a SECUNDARIAS (acciones-viejas-a-secundarias-todas-las-cuentas.js).
 *      No borra nada. En Girbau NO se hace hasta el viernes 13 (para no mover dos cosas a la vez en Máximo rendimiento).
 *   3. SOLO LEE · ¿Por qué llegan pocos contactos? (servicio/por-que-llegan-pocos-contactos.js), últimos 14 días.
 *   4. SOLO LEE · Horario, zona y contactos de madrugada (horario-y-zona-de-los-contactos-todas-las-cuentas.js), 30 días.
 * Al final imprime un RESUMEN con lo importante de las cuatro partes.
 *
 * VISTA PREVIA no cambia nada. EJECUTAR aplica las partes 1 y 2, solo con el OK de Sandy, cuenta por cuenta.
 * Si el OK es solo para una de las dos, apaga la otra aquí abajo (false) antes de Ejecutar.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var HACER_REPARTO = true;    // parte 1
var HACER_ACCIONES = true;   // parte 2
var ACCIONES_GIRBAU_DESDE = '2026-11-13';

// ======================= reparto-por-pasos-todas-las-cuentas.js (sin cambios) =======================
function REPARTO(Logger) {
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
function ACCIONES(Logger) {
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

// ======================= servicio/por-que-llegan-pocos-contactos.js (sin cambios) =======================
function DIAG(Logger) {
/**
 * Atelback · ¿Por qué llegan pocos contactos? — pensado para Laundry Solutions (265-909-2662), sirve en las 5 cuentas
 * Escrito a mano el 8 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. Revisa los últimos 14 días completos (hasta ayer) y busca dónde se va el dinero
 * sin traer contactos:
 *   1. Cada campaña encendida: presupuesto, clics, gasto, contactos, costo por contacto y cuánto se pierde por
 *      presupuesto o por posición.
 *   2. Las palabras clave: clics, gasto, contactos y nivel de calidad.
 *   3. Lo que la gente buscó: lo que más gastó sin traer contactos, y las búsquedas que parecen de lavadora de casa
 *      o de quien no es cliente (marcas caseras, tutoriales, empleo, códigos de error…).
 *   4. A qué página llegaron y cuántos contactos dio cada una.
 *   5. Qué está contando Google como contacto (WhatsApp, llamada, formulario) y el último día que contó cada uno.
 *   6. Celular contra computadora.
 *   7. Anuncios rechazados o limitados en campañas encendidas.
 *
 * CÓMO SE USA: en Laundry Solutions > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var DIAS = 14;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
// Búsquedas que suelen ser de lavadora de casa o de alguien que no va a contratar
var CASERA = /(mabe|whirlpool|samsung|\blg\b|easy|acros|koblenz|daewoo|frigidaire|hisense|midea|casa|hogar|dom[eé]stic|autom[aá]tica|carga superior|carga frontal|centro de lavado|tutorial|c[oó]mo (se |hacer|arreglar|reparar|quitar|desarmar)|gratis|empleo|trabajo|vacante|sueldo|curso|pdf|manual|youtube|c[oó]digo|error|\bfalla\b|usad[ao]s?|segunda mano|mercado libre|a domicilio)/i;

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(micros) { return '$' + Math.round((Number(micros) || 0) / 1e6).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function cpc(costo, conv) { return conv >= 0.5 ? 'costo por contacto ' + pesos(costo / conv) : 'ningún contacto'; }
function pct(x) { return (x === undefined || x === null || x === '') ? '—' : Math.round(Number(x) * 100) + '%'; }

function main() {
  var cuenta = AdsApp.currentAccount();
  var cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var hasta = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - DIAS * 864e5), tz, 'yyyy-MM-dd');
  var rango = "segments.date BETWEEN '" + desde + "' AND '" + hasta + "'";
  Logger.log('¿POR QUÉ LLEGAN POCOS CONTACTOS? · ' + marca + ' · del ' + desde + ' al ' + hasta + ' (' + DIAS + ' días) · solo lee');
  Logger.log('«Contactos» = lo que Google cuenta: toques de WhatsApp, llamadas y formularios.');
  Logger.log('');

  // 1. Campañas
  Logger.log('==== 1. CAMPAÑAS ENCENDIDAS ====');
  var tot = { clics: 0, costo: 0, conv: 0 }, sinNada = [];
  filas("SELECT campaign.name, campaign_budget.amount_micros, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.all_conversions, metrics.average_cpc, " +
    "metrics.search_impression_share, metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share " +
    "FROM campaign WHERE campaign.status = 'ENABLED' AND " + rango + " ORDER BY metrics.cost_micros DESC", 'las campañas')
    .forEach(function (f) {
      var m = f.metrics, c = f.campaign, conv = Number(m.allConversions) || 0, costo = Number(m.costMicros) || 0;
      tot.clics += Number(m.clicks) || 0; tot.costo += costo; tot.conv += conv;
      var tope = c.targetSpend && c.targetSpend.cpcBidCeilingMicros ? ' · tope por clic ' + pesos(c.targetSpend.cpcBidCeilingMicros) : '';
      Logger.log('«' + c.name + '» · presupuesto ' + pesos((f.campaignBudget || {}).amountMicros) + ' al día' + tope);
      Logger.log('    ' + (m.clicks || 0) + ' clics · ' + pesos(costo) + ' · ' + n(conv) + ' contactos · ' + cpc(costo, conv) +
        ' · clic promedio ' + pesos(m.averageCpc));
      Logger.log('    sale en ' + pct(m.searchImpressionShare) + ' de las búsquedas · se pierde ' + pct(m.searchBudgetLostImpressionShare) +
        ' por presupuesto y ' + pct(m.searchRankLostImpressionShare) + ' por posición o calidad');
      if (conv < 0.5 && costo > 0) sinNada.push(c.name + ' (' + pesos(costo) + ')');
    });
  Logger.log('TOTAL · ' + tot.clics + ' clics · ' + pesos(tot.costo) + ' · ' + n(tot.conv) + ' contactos · ' + cpc(tot.costo, tot.conv));
  Logger.log('');

  // 2. Palabras clave
  Logger.log('==== 2. PALABRAS CLAVE (las que tuvieron clics) ====');
  filas("SELECT campaign.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, " +
    "ad_group_criterion.quality_info.quality_score, metrics.clicks, metrics.cost_micros, metrics.all_conversions " +
    "FROM keyword_view WHERE campaign.status = 'ENABLED' AND metrics.clicks > 0 AND " + rango + " ORDER BY metrics.cost_micros DESC LIMIT 40",
    'las palabras clave').forEach(function (f) {
      var k = f.adGroupCriterion, m = f.metrics, conv = Number(m.allConversions) || 0;
      var tipo = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' }[k.keyword.matchType] || k.keyword.matchType;
      var cal = (k.qualityInfo || {}).qualityScore;
      Logger.log('«' + k.keyword.text + '» (' + tipo + ') · ' + f.campaign.name + ' · ' + m.clicks + ' clics · ' + pesos(m.costMicros) +
        ' · ' + n(conv) + ' contactos' + (cal ? ' · calidad ' + cal + '/10' : ''));
    });
  Logger.log('');

  // 3. Búsquedas
  Logger.log('==== 3. QUÉ BUSCÓ LA GENTE ====');
  var terms = filas("SELECT search_term_view.search_term, campaign.name, metrics.clicks, metrics.cost_micros, metrics.all_conversions " +
    "FROM search_term_view WHERE metrics.clicks > 0 AND " + rango + " ORDER BY metrics.cost_micros DESC LIMIT 300", 'las búsquedas');
  var conContacto = [], sinContacto = [], caseras = [], costoCasero = 0, costoSin = 0;
  terms.forEach(function (f) {
    var t = f.searchTermView.searchTerm, m = f.metrics, conv = Number(m.allConversions) || 0, costo = Number(m.costMicros) || 0;
    var linea = '«' + t + '» · ' + f.campaign.name + ' · ' + m.clicks + ' clics · ' + pesos(costo) + (conv ? ' · ' + n(conv) + ' contactos' : '');
    if (conv >= 0.5) conContacto.push(linea); else { sinContacto.push(linea); costoSin += costo; }
    if (CASERA.test(t) && conv < 0.5) { caseras.push(linea); costoCasero += costo; }
  });
  Logger.log('-- Trajeron contactos (' + conContacto.length + ') --');
  conContacto.forEach(function (l) { Logger.log(l); });
  if (!conContacto.length) Logger.log('Ninguna.');
  Logger.log('-- Gastaron sin traer contactos (las 25 que más gastaron) · en total ' + pesos(costoSin) + ' --');
  sinContacto.slice(0, 25).forEach(function (l) { Logger.log(l); });
  Logger.log('-- Parecen de lavadora de casa o de quien no va a contratar (' + caseras.length + ') · ' + pesos(costoCasero) + ' --');
  caseras.slice(0, 30).forEach(function (l) { Logger.log(l); });
  if (!caseras.length) Logger.log('Ninguna. Las búsquedas sí son de servicio industrial.');
  Logger.log('');

  // 4. Páginas
  Logger.log('==== 4. A QUÉ PÁGINA LLEGARON ====');
  filas("SELECT landing_page_view.unexpanded_final_url, metrics.clicks, metrics.cost_micros, metrics.all_conversions " +
    "FROM landing_page_view WHERE metrics.clicks > 0 AND " + rango + " ORDER BY metrics.clicks DESC LIMIT 20", 'las páginas')
    .forEach(function (f) {
      var m = f.metrics;
      Logger.log(f.landingPageView.unexpandedFinalUrl + ' · ' + m.clicks + ' clics · ' + pesos(m.costMicros) + ' · ' + n(m.allConversions) + ' contactos');
    });
  Logger.log('');

  // 5. Qué cuenta Google
  Logger.log('==== 5. QUÉ CUENTA GOOGLE COMO CONTACTO ====');
  var porAccion = {};
  filas("SELECT segments.conversion_action_name, segments.date, metrics.all_conversions FROM customer WHERE " +
    "segments.date BETWEEN '" + Utilities.formatDate(new Date(Date.now() - 30 * 864e5), tz, 'yyyy-MM-dd') + "' AND '" + hasta + "'",
    'las conversiones').forEach(function (f) {
      var a = f.segments.conversionActionName, c = Number(f.metrics.allConversions) || 0;
      if (!c) return;
      var x = porAccion[a] = porAccion[a] || { total: 0, ultimo: '' };
      x.total += c; if (f.segments.date > x.ultimo) x.ultimo = f.segments.date;
    });
  filas("SELECT conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.include_in_conversions_metric " +
    "FROM conversion_action WHERE conversion_action.status = 'ENABLED'", 'las acciones de conversión').forEach(function (f) {
      var a = f.conversionAction, x = porAccion[a.name];
      Logger.log(a.name + ' · ' + (x ? n(x.total) + ' en 30 días · último el ' + x.ultimo : '⚠️ 0 en 30 días') +
        (a.includeInConversionsMetric ? '' : ' · (no cuenta como conversión principal)'));
    });
  Logger.log('');

  // 6. Dispositivo
  Logger.log('==== 6. CELULAR CONTRA COMPUTADORA ====');
  var DISP = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta' };
  filas("SELECT segments.device, metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM customer WHERE " + rango, 'los dispositivos')
    .forEach(function (f) {
      var m = f.metrics;
      if (!Number(m.clicks)) return;
      Logger.log((DISP[f.segments.device] || f.segments.device) + ' · ' + m.clicks + ' clics · ' + pesos(m.costMicros) + ' · ' + n(m.allConversions) +
        ' contactos · ' + cpc(Number(m.costMicros), Number(m.allConversions)));
    });
  Logger.log('');

  // 7. Anuncios
  Logger.log('==== 7. ANUNCIOS RECHAZADOS O LIMITADOS (campañas encendidas) ====');
  var malos = 0;
  filas("SELECT campaign.name, ad_group.name, ad_group_ad.policy_summary.approval_status FROM ad_group_ad WHERE campaign.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND ad_group_ad.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
      var s = f.adGroupAd.policySummary.approvalStatus;
      if (s === 'APPROVED') return;
      malos++;
      Logger.log(f.campaign.name + ' › ' + f.adGroup.name + ' · ' + ({ DISAPPROVED: '❌ rechazado', APPROVED_LIMITED: '⚠️ limitado', AREA_OF_INTEREST_ONLY: '⚠️ solo en algunas zonas' }[s] || s));
    });
  if (!malos) Logger.log('Todos los anuncios encendidos están aprobados.');
  Logger.log('');

  Logger.log('DIAGNÓSTICO · ' + marca + ' · ' + DIAS + ' días · ' + tot.clics + ' clics · ' + pesos(tot.costo) + ' · ' + n(tot.conv) + ' contactos · ' +
    'búsquedas sin contacto ' + pesos(costoSin) + ' · parecen caseras ' + caseras.length + ' (' + pesos(costoCasero) + ') · campañas sin contactos: ' +
    (sinNada.length ? sinNada.join(', ') : 'ninguna'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}

return main;
}

// ======================= horario-y-zona-de-los-contactos-todas-las-cuentas.js (sin cambios) =======================
function HORARIO(Logger) {
/**
 * Atelback · ¿Por qué llegan contactos de madrugada? Horario, zona y red de las campañas — las cinco cuentas
 * Escrito a mano el 9 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada. En la cuenta donde se corre:
 *   1. La zona horaria de la cuenta (las horas de los reportes salen en esa zona).
 *   2. Cada campaña encendida: en qué horario sale, en qué zona (y si es «personas que están ahí» o también
 *      «interesadas»), y en qué red (solo Google, socios de búsqueda, Display, Máximo rendimiento).
 *   3. Últimos 30 días por tramo del día (madrugada 0–6, mañana 7–12, tarde 13–18, noche 19–23):
 *      clics, gasto y contactos.
 *   4. Los contactos de madrugada uno por uno: hora, campaña, red y dispositivo.
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro.
 */

var DIAS = 30;
var MARCAS = {
  '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar (CLM)', '265-909-2662': 'Laundry Solutions',
  '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail'
};
var DIA = { MONDAY: 'lun', TUESDAY: 'mar', WEDNESDAY: 'mié', THURSDAY: 'jue', FRIDAY: 'vie', SATURDAY: 'sáb', SUNDAY: 'dom' };
var RED = { SEARCH: 'Google', SEARCH_PARTNERS: 'socios de búsqueda', CONTENT: 'Display', YOUTUBE: 'YouTube', YOUTUBE_SEARCH: 'YouTube',
  YOUTUBE_WATCH: 'YouTube', MIXED: 'Máximo rendimiento (varias redes)', GOOGLE_TV: 'Google TV' };
var DISP = { MOBILE: 'celular', DESKTOP: 'computadora', TABLET: 'tableta', CONNECTED_TV: 'tele', OTHER: 'otro' };

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}
function pesos(m) { return '$' + Math.round((Number(m) || 0) / 1e6).toLocaleString('en-US'); }
function n(x) { return Math.round((Number(x) || 0) * 10) / 10; }
function tramo(h) { return h <= 6 ? 'madrugada (0–6 h)' : h <= 12 ? 'mañana (7–12 h)' : h <= 18 ? 'tarde (13–18 h)' : 'noche (19–23 h)'; }
function hh(h) { return ('0' + h).slice(-2) + ':00'; }

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var marca = MARCAS[cid] || cuenta.getName();
  var hasta = Utilities.formatDate(new Date(Date.now() - 864e5), tz, 'yyyy-MM-dd');
  var desde = Utilities.formatDate(new Date(Date.now() - DIAS * 864e5), tz, 'yyyy-MM-dd');
  var rango = "segments.date BETWEEN '" + desde + "' AND '" + hasta + "'";
  Logger.log('HORARIO Y ZONA · ' + marca + ' · del ' + desde + ' al ' + hasta + ' · solo lee');
  Logger.log('');

  Logger.log('==== 1. ZONA HORARIA DE LA CUENTA ====');
  Logger.log(tz + (/Mexico_City|Monterrey|Merida|Chihuahua|Matamoros|Bahia_Banderas/.test(tz)
    ? ' · hora del centro de México: las horas de abajo son hora de México.'
    : ' · ⚠️ NO es hora del centro de México: las horas de abajo están corridas respecto a México.'));
  Logger.log('');

  // 2. Configuración de cada campaña
  Logger.log('==== 2. HORARIO, ZONA Y RED DE CADA CAMPAÑA ENCENDIDA ====');
  var C = {};
  filas("SELECT campaign.id, campaign.name, campaign.advertising_channel_type, campaign.geo_target_type_setting.positive_geo_target_type, " +
    "campaign.network_settings.target_google_search, campaign.network_settings.target_search_network, " +
    "campaign.network_settings.target_content_network, campaign.network_settings.target_partner_search_network " +
    "FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
      C[f.campaign.id] = { c: f.campaign, horario: [], zonas: [], fuera: [] };
    });
  filas("SELECT campaign.id, campaign_criterion.ad_schedule.day_of_week, campaign_criterion.ad_schedule.start_hour, " +
    "campaign_criterion.ad_schedule.end_hour FROM campaign_criterion WHERE campaign_criterion.type = 'AD_SCHEDULE' AND campaign.status = 'ENABLED'",
    'los horarios').forEach(function (f) {
      var s = f.campaignCriterion.adSchedule, x = C[f.campaign.id];
      if (x) x.horario.push(DIA[s.dayOfWeek] + ' ' + s.startHour + '–' + s.endHour + ' h');
    });
  var geos = {};
  filas("SELECT campaign.id, campaign_criterion.location.geo_target_constant, campaign_criterion.negative FROM campaign_criterion " +
    "WHERE campaign_criterion.type = 'LOCATION' AND campaign.status = 'ENABLED'", 'las zonas').forEach(function (f) {
      var g = f.campaignCriterion.location.geoTargetConstant, x = C[f.campaign.id];
      geos[g] = g;
      if (x) (f.campaignCriterion.negative ? x.fuera : x.zonas).push(g);
    });
  var ids = Object.keys(geos);
  if (ids.length) {
    filas("SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name FROM geo_target_constant WHERE " +
      "geo_target_constant.resource_name IN ('" + ids.join("','") + "')", 'los nombres de las zonas').forEach(function (f) {
        geos[f.geoTargetConstant.resourceName] = f.geoTargetConstant.canonicalName;
      });
  }
  var avisos = [];
  Object.keys(C).forEach(function (id) {
    var x = C[id], c = x.c, ns = c.networkSettings || {};
    var redes = ['Google'];
    if (ns.targetPartnerSearchNetwork) redes.push('⚠️ socios de búsqueda');
    if (ns.targetContentNetwork) redes.push('⚠️ Display');
    var pmax = c.advertisingChannelType === 'PERFORMANCE_MAX';
    var tipo = (c.geoTargetTypeSetting || {}).positiveGeoTargetType;
    Logger.log('«' + c.name + '»' + (pmax ? ' (Máximo rendimiento: sale en todas las redes de Google)' : ''));
    Logger.log('    horario: ' + (x.horario.length ? x.horario.join(' · ') : 'todo el día, todos los días'));
    Logger.log('    zona: ' + (x.zonas.length ? x.zonas.map(function (g) { return geos[g]; }).join(' · ') : '⚠️ sin zona (todo el mundo)') +
      (x.fuera.length ? ' · excluye: ' + x.fuera.map(function (g) { return geos[g]; }).join(' · ') : ''));
    Logger.log('    a quién: ' + (tipo === 'PRESENCE' ? 'solo personas que están en la zona' :
      tipo === 'PRESENCE_OR_INTEREST' ? '⚠️ personas en la zona o interesadas en ella (puede salir fuera de México)' : (tipo || '?')));
    if (!pmax) Logger.log('    red: ' + redes.join(' + '));
    if (!x.horario.length) avisos.push(c.name + ': sale de madrugada');
    if (tipo === 'PRESENCE_OR_INTEREST') avisos.push(c.name + ': incluye «interesadas»');
    if (!pmax && ns.targetPartnerSearchNetwork) avisos.push(c.name + ': socios de búsqueda');
    if (!pmax && ns.targetContentNetwork) avisos.push(c.name + ': Display');
  });
  Logger.log('');

  // 3. Por tramo del día
  Logger.log('==== 3. ÚLTIMOS ' + DIAS + ' DÍAS POR TRAMO DEL DÍA ====');
  var T = {}, noche = [], total = { clics: 0, costo: 0, conv: 0 };
  ['madrugada (0–6 h)', 'mañana (7–12 h)', 'tarde (13–18 h)', 'noche (19–23 h)'].forEach(function (k) { T[k] = { clics: 0, costo: 0, conv: 0 }; });
  filas("SELECT campaign.name, campaign.advertising_channel_type, segments.hour, segments.ad_network_type, segments.device, " +
    "metrics.clicks, metrics.cost_micros, metrics.all_conversions FROM campaign WHERE " + rango, 'las horas').forEach(function (f) {
      var h = Number(f.segments.hour), m = f.metrics, t = T[tramo(h)], conv = Number(m.allConversions) || 0;
      t.clics += Number(m.clicks) || 0; t.costo += Number(m.costMicros) || 0; t.conv += conv;
      total.clics += Number(m.clicks) || 0; total.costo += Number(m.costMicros) || 0; total.conv += conv;
      if (h <= 6 && conv > 0) noche.push({ h: h, txt: hh(h) + ' · «' + f.campaign.name + '» · ' + (RED[f.segments.adNetworkType] || f.segments.adNetworkType) +
        ' · ' + (DISP[f.segments.device] || f.segments.device) + ' · ' + n(conv) + ' contacto(s) · ' + (Number(m.clicks) || 0) + ' clics en esa hora' +
        (f.campaign.advertisingChannelType === 'PERFORMANCE_MAX' ? ' (en Máximo rendimiento la hora no es confiable)' : '') });
    });
  Object.keys(T).forEach(function (k) {
    var t = T[k];
    Logger.log(k + ' · ' + t.clics + ' clics · ' + pesos(t.costo) + ' · ' + n(t.conv) + ' contactos' +
      (total.conv ? ' (' + Math.round(100 * t.conv / total.conv) + '% de los contactos)' : '') +
      (t.conv >= 0.5 ? ' · costo por contacto ' + pesos(t.costo / t.conv) : ''));
  });
  Logger.log('');

  Logger.log('==== 4. CONTACTOS DE MADRUGADA, UNO POR UNO ====');
  noche.sort(function (a, b) { return a.h - b.h; }).forEach(function (x) { Logger.log(x.txt); });
  if (!noche.length) Logger.log('Ninguno en ' + DIAS + ' días.');
  Logger.log('');

  var mad = T['madrugada (0–6 h)'];
  Logger.log('HORARIO · ' + marca + ' · zona horaria ' + tz + ' · madrugada: ' + n(mad.conv) + ' de ' + n(total.conv) + ' contactos, ' +
    pesos(mad.costo) + ' de ' + pesos(total.costo) + ' · ' + (avisos.length ? 'avisos: ' + avisos.join(' | ') : 'sin avisos'));
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}

return main;
}

// ======================= El que corre todo =======================
var RESUMEN = [];
function registro(guardar) {
  return { log: function (x) { Logger.log(x); if (guardar(String(x))) RESUMEN.push(String(x)); } };
}
function parte(titulo, hacer, motivo, crear, guardar) {
  Logger.log('');
  Logger.log('########################################################################');
  Logger.log('# ' + titulo);
  Logger.log('########################################################################');
  if (!hacer) { Logger.log('No se corre: ' + motivo); RESUMEN.push(titulo + ' · no se corrió: ' + motivo); return; }
  try { crear(registro(guardar))(); }
  catch (e) { Logger.log('❌ Esta parte se detuvo: ' + e.message); RESUMEN.push(titulo + ' · ❌ se detuvo: ' + e.message); }
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId();
  var hoy = Utilities.formatDate(new Date(), cuenta.getTimeZone(), 'yyyy-MM-dd');
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('TODO LO DE HOY · cuenta ' + cid + ' · ' + hoy + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: aplica las partes 1 y 2'));

  parte('1. PASO DEL PRESUPUESTO (cambia con Ejecutar)', HACER_REPARTO, 'apagado arriba (HACER_REPARTO = false).', REPARTO,
    function (x) { return /^(BAJA|SUBE|TOPE|FRENO|AVISO|ERROR|Nada que cambiar|Hoy no hay nada|✅ Los tres pasos|Suma de presupuestos|VISTA PREVIA|LISTO\. Cambios|Terminó)/.test(x); });

  var girbauEspera = cid === '860-582-6837' && hoy < ACCIONES_GIRBAU_DESDE;
  parte('2. ACCIONES VIEJAS A SECUNDARIAS (cambia con Ejecutar)', HACER_ACCIONES && !girbauEspera,
    girbauEspera ? 'en Girbau se hace desde el ' + ACCIONES_GIRBAU_DESDE + ', después del paso 3 del presupuesto.' : 'apagado arriba (HACER_ACCIONES = false).',
    ACCIONES, function (x) { return /^(ACCIONES VIEJAS ·|❌)/.test(x); });

  parte('3. ¿POR QUÉ LLEGAN POCOS CONTACTOS? (solo lee)', true, '', DIAG, function (x) { return /^DIAGNÓSTICO ·/.test(x); });
  parte('4. HORARIO, ZONA Y CONTACTOS DE MADRUGADA (solo lee)', true, '', HORARIO, function (x) { return /^HORARIO ·/.test(x); });

  Logger.log('');
  Logger.log('################################ RESUMEN ################################');
  RESUMEN.forEach(function (x) { Logger.log(x); });
  Logger.log(vista ? 'FIN · VISTA PREVIA: no se cambió nada. Copia TODO el registro y mándalo; Ejecutar solo con el OK.'
    : 'FIN · Se aplicaron las partes 1 y 2 que estaban encendidas. Copia TODO el registro y mándalo.');
}
