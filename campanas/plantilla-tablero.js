/**
 * Atelback · Datos para el tablero — {{NOMBRE}}
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Junta, día por día,
 * desde 30 días antes del arranque de las campañas «AB ·» hasta ayer: impresiones, clics, costo, conversiones,
 * llamadas y cuota de impresiones por campaña; el gasto en búsquedas que ya están excluidas contra el resto, y las
 * conversiones por acción. Al final imprime unas líneas que empiezan con «TABLERO» para cargarlas al tablero.
 * No cambia nada en la cuenta.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 * Se puede correr cuando sea: manda todos los días desde el arranque, así que no importa si un día no se corrió.
 */

var PLANES = {{PLANES}};
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';


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
function num(x) { return Number(x || 0); }

// Fechas como 'yyyy-MM-dd', sin depender de la zona horaria del servidor.
function aFecha(t) { var p = t.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
function aTexto(d) { return d.toISOString().substring(0, 10); }
function mas(t, dias) { var d = aFecha(t); d.setUTCDate(d.getUTCDate() + dias); return aTexto(d); }

function main() {
  var cid = revisarCuenta();
  var ahora = Utilities.formatDate(new Date(), AdsApp.currentAccount().getTimeZone(), 'yyyy-MM-dd HH:mm');
  imprimirTablero(cid, ahora);
  Logger.log('');
  Logger.log('LISTO. Este script no cambió nada.');
}

{{PARTE_TABLERO}}
