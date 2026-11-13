/**
 * Atelback · Poner fotos que YA están en la cuenta en las campañas de búsqueda que no tienen — las cinco cuentas
 * Escrito a mano el 13 nov 2026 (no lo genera generar.py). Para el MARTES 17 NOV.
 *
 * QUÉ HACE: solo AGREGA fotos (como extensión de imagen) a las campañas de búsqueda que hoy no tienen ninguna.
 *   Cada foto se escogió a mano viendo la foto: que muestre lo que vende esa campaña, sin texto encima, sin logos
 *   encima, sin paquetes ni promociones. Todas son cuadradas y ya están en la biblioteca de la cuenta.
 * CANDADOS PARA NO FRENAR LEADS:
 *   - No quita, no pausa y no edita nada. No toca anuncios, presupuestos, pujas ni palabras.
 *   - Si la foto ya está en esa campaña, no la repite.
 *   - Si en la cuenta ya hubo un cambio HOY, en Ejecutar no hace nada (un cambio por cuenta al día).
 *   - DESHACER = true: quita SOLO las fotos de esta lista en estas campañas.
 * Gamesail: no tiene fotos y Google no deja usarlas en búsqueda hasta los 60 días de la cuenta (hacia el 25 dic).
 *
 * CÓMO SE USA: en cada cuenta > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro > EJECUTAR con el OK.
 */

var DESHACER = false;

// Fotos por su número de imagen de Google (el que sale al final del enlace «ver: …/simgad/NÚMERO»).
var PLAN = {
  '993-525-8739': { marca: 'Kingstar (CLM)', campanas: {
    'AB · Mangles y planchado': [
      ['9243985702590758723', 'mangle planchador azul Kingstar'],
      ['5314044768796479327', 'mangle planchador de frente'],
      ['3585959393282806207', 'mangle trabajando con sábanas en lavandería']],
    'AB · Marca CLM': [
      ['14814500904667714755', 'lavadora Kingstar de frente (ya da clics en otras campañas)'],
      ['7035450757804544430', 'lavadora Kingstar (buen porcentaje de clics)'],
      ['9100778040944466096', 'lavadora y secadora Kingstar']]
  } },
  '256-397-2201': { marca: 'Quick Laundry', campanas: {
    'AB · Secadoras para lavandería': [
      ['10309492578459350191', 'lavadora y secadora comerciales blancas'],
      ['5230482245028526643', 'torre de lavadora y secadora LG'],
      ['16477196321157476011', 'lavadora y secadora de lavandería (buen porcentaje de clics)']],
    'AB · Marcas comerciales': [
      ['3341166814496327923', 'lavadora LG comercial (ya da clics)'],
      ['10685393628238248844', 'lavadora LG comercial'],
      ['5230482245028526643', 'torre de lavadora y secadora LG']]
  } },
  '860-582-6837': { marca: 'Girbau', campanas: {
    'AB · Girbau Smart Plus': [
      ['4675301498054236622', 'pantalla Girbau con la app en el celular'],
      ['18229313092619750899', 'lavadora Girbau con pantalla (buen porcentaje de clics)'],
      ['2674901675896339189', 'lavadoras Girbau de frente']],
    'AB · Girbau por capacidad y sector': [
      ['7656649880153350453', 'fila de lavadoras en lavandería (ya da clics)'],
      ['7822040894781453538', 'lavandería comercial con lavadoras'],
      ['17670184629828878386', 'lavandería con toallas (hotel)'],
      ['4333647061646976098', 'planchadora Girbau']],
    'AB · Servicio técnico Girbau': [
      ['9834447630767586194', 'lavadora por dentro (piezas)'],
      ['7428618473544896461', 'técnico operando equipo Girbau']]
  } },
  '265-909-2662': { marca: 'Laundry Solutions', campanas: {
    'AB · Refacciones Girbau y Gamesail': [
      ['3500538010796139737', 'refacciones: empaques, baleros, válvulas (buen porcentaje de clics)'],
      ['16471656758600380318', 'secadora abierta con herramientas']],
    'AB · Servicio a lavanderías': [
      ['8157739432148077125', 'lavandería de autoservicio'],
      ['16471656758600380318', 'secadora abierta con herramientas']],
    'AB · Instalación': [
      ['8223010747171963961', 'fila de lavadoras industriales instaladas'],
      ['5251500209091591388', 'lavadoras industriales de varios tamaños']]
  } }
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}

function main() {
  var cuenta = AdsApp.currentAccount(), cid = cuenta.getCustomerId(), tz = cuenta.getTimeZone();
  var vista = AdsApp.getExecutionInfo().isPreview();
  var P = PLAN[cid];
  if (!P) {
    Logger.log('FOTOS A CAMPAÑAS · ' + cuenta.getName() + ' · nada que hacer en esta cuenta' +
      (cid === '118-347-6484' ? ' (Gamesail: fotos en búsqueda hasta que la cuenta cumpla 60 días, hacia el 25 dic).' : '.'));
    return;
  }
  var hoy = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  Logger.log('FOTOS A CAMPAÑAS SIN FOTOS · ' + P.marca + ' · ' + (DESHACER ? 'DESHACER · ' : '') + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR'));
  Logger.log('');

  var A = {};   // número de imagen -> asset
  filas("SELECT asset.resource_name, asset.id, asset.name, asset.image_asset.full_size.url FROM asset WHERE asset.type = 'IMAGE'", 'las fotos')
    .forEach(function (f) {
      var u = ((f.asset.imageAsset || {}).fullSize || {}).url || '', m = u.match(/simgad\/(\d+)/);
      if (m && !A[m[1]]) A[m[1]] = { rn: f.asset.resourceName, id: f.asset.id, nombre: f.asset.name || ('foto ' + f.asset.id) };
    });
  var C = {};
  filas("SELECT campaign.name, campaign.resource_name, campaign.status FROM campaign WHERE campaign.status != 'REMOVED' AND campaign.advertising_channel_type = 'SEARCH'", 'las campañas')
    .forEach(function (f) { C[f.campaign.name] = { rn: f.campaign.resourceName, status: f.campaign.status }; });
  var ya = {};   // campaña|assetId -> resource de campaign_asset
  filas("SELECT campaign.name, campaign.status, asset.id, campaign_asset.resource_name, campaign_asset.status FROM campaign_asset " +
    "WHERE campaign_asset.field_type = 'AD_IMAGE' AND campaign_asset.status != 'REMOVED'", 'las fotos de cada campaña')
    .forEach(function (f) { ya[f.campaign.name + '|' + f.asset.id] = f.campaignAsset.resourceName; });

  var ops = [], textos = [], avisos = 0;
  Object.keys(P.campanas).forEach(function (nombre) {
    var c = C[nombre];
    Logger.log('▶ ' + nombre + (c ? (c.status !== 'ENABLED' ? ' (campaña en pausa)' : '') : ' · ⚠️ NO SE ENCONTRÓ la campaña: se salta'));
    if (!c) { avisos++; return; }
    P.campanas[nombre].forEach(function (x) {
      var a = A[x[0]];
      if (!a) { Logger.log('   ⚠️ no está en la cuenta la foto ' + x[0] + ' (' + x[1] + '): se salta'); avisos++; return; }
      var k = nombre + '|' + a.id;
      if (DESHACER) {
        if (!ya[k]) return;
        Logger.log('   QUITA «' + a.nombre + '» · ' + x[1]);
        ops.push({ campaignAssetOperation: { remove: ya[k] } }); textos.push('quitar ' + x[1] + ' de ' + nombre);
        return;
      }
      if (ya[k]) { Logger.log('   ya la tiene: «' + a.nombre + '» · ' + x[1]); return; }
      Logger.log('   AGREGA «' + a.nombre + '» · ' + x[1]);
      ops.push({ campaignAssetOperation: { create: { campaign: c.rn, asset: a.rn, fieldType: 'AD_IMAGE' } } });
      textos.push(x[1] + ' en ' + nombre);
    });
  });
  Logger.log('');

  if (!vista && ops.length && !DESHACER) {
    var cambios = filas("SELECT change_event.change_resource_name FROM change_event WHERE change_event.change_date_time >= '" + hoy + " 00:00:00' AND " +
      "change_event.change_date_time <= '" + hoy + " 23:59:59' LIMIT 50", 'los cambios de hoy');
    if (cambios.length) {
      Logger.log('⏸ Ya hubo ' + cambios.length + ' cambio(s) HOY en esta cuenta. Para no mover dos cosas el mismo día, no se aplicó nada. Córrelo mañana.');
      return;
    }
  }
  var malos = 0;
  if (ops.length) {
    AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
      if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
      else if (!vista) Logger.log('✅ ' + textos[i]);
    });
  }
  Logger.log('FOTOS A CAMPAÑAS · ' + P.marca + ' · ' + (DESHACER ? 'deshacer · ' : '') + (vista ? 'vista previa' : 'ejecutado') +
    ' · operaciones: ' + ops.length + ' · con error: ' + malos + ' · avisos: ' + avisos);
  Logger.log(vista ? 'LISTO. Vista previa: no se cambió nada. Si hay ❌ o ⚠️, mándamelo antes de ejecutar.' : 'LISTO. Copia todo el registro y mándalo.');
}
