/**
 * Atelback · ¿Por qué no sale el anuncio? Calidad y puja por palabra clave — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): SOLO LEE. Para cada palabra clave
 * encendida de las campañas nuevas «AB ·» muestra lo que decide si el anuncio sale y en qué lugar:
 *   - el nivel de calidad de Google (1 a 10) y sus tres partes: relevancia del anuncio, probabilidad de clic y página;
 *   - lo que Google pide pagar por clic para salir en la primera página y hasta arriba, contra el tope de la campaña;
 *   - si Google la tiene como «pocas búsquedas».
 * Al final dice qué arreglar primero. No cambia nada.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > copiar el registro y mandarlo.
 */

var PLANES = [{"cuenta": "118-347-6484", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail.mx/", "prefijo": "AB · ", "paginas": {}, "subir_topes": true, "mensual": 19700, "subir": true, "subir_porque": "", "fijos": [], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "prefijo": "AB · ", "paginas": {"AB · Autoservicio y monedas > Autoservicio": "https://quicklaundry.store/lavadoras-de-monedas"}, "subir_topes": false, "mensual": 12000, "subir": false, "subir_porque": "hoy ya sube con «ajustes» (Equipo, Emprendimiento y la marca, hasta el tope)", "fijos": ["Equipo para lavandería", "Emprendimiento", "Autoservicio y monedas", "Secadoras para lavandería", "Marcas comerciales", "Marca Quick Laundry"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "paginas": {"AB · Alta capacidad 60 kg o más > Lavadoras de alta capacidad": "https://kingstar.com.mx/lavadoras-alta-capacidad", "AB · Mangles y planchado > Mangles": "https://kingstar.com.mx/mangles"}, "subir_topes": false, "mensual": 18700, "subir": true, "subir_porque": "", "fijos": ["Alta capacidad 60 kg o más", "Túnel de lavado", "Lavandería hotelera e institucional", "Lavadoras y secadoras de 20 a 45 kg", "Mangles y planchado", "Marca CLM"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "paginas": {"AB · Reparación y mantenimiento > Reparación": "https://laundrysolutions.store/reparacion-lavadoras-industriales", "AB · Reparación y mantenimiento > Mantenimiento correctivo": "https://laundrysolutions.store/reparacion-lavadoras-industriales"}, "subir_topes": false, "mensual": 8200, "subir": true, "subir_porque": "", "fijos": ["Reparación y mantenimiento", "Servicio técnico industrial"], "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "paginas": {}, "subir_topes": false, "mensual": 6600, "subir": false, "subir_porque": "no usa su presupuesto (41%); la marca sale arriba con «ajustes»", "fijos": ["Marca Girbau", "Girbau Smart Plus", "Girbau por capacidad y sector", "Servicio técnico Girbau"], "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
var PLAN = null;

// Solo para la cuenta nueva de Gamesail: pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var NIVEL = { ABOVE_AVERAGE: 'buena', AVERAGE: 'normal', BELOW_AVERAGE: 'MALA' };

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
    Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')');
  }
  return out;
}
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }
function pesos(m) { return m ? '$' + (Number(m) / 1e6).toFixed(0) : '—'; }
var TIPO = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };

function main() {
  revisarCuenta();
  Logger.log('¿POR QUÉ NO SALE EL ANUNCIO? · ' + PLAN.nombre + ' · solo lee');

  var topes = {};
  filas("SELECT campaign.name, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, " +
    "campaign.target_impression_share.cpc_bid_ceiling_micros FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas').forEach(function (f) {
    var c = f.campaign;
    topes[c.name] = Number((c.targetSpend || {}).cpcBidCeilingMicros || (c.targetImpressionShare || {}).cpcBidCeilingMicros || 0);
  });

  var malaPagina = 0, malaRelevancia = 0, malaClic = 0, cortas = [], pocas = [], total = 0;
  var porCampana = {};
  filas('SELECT campaign.name, ad_group.name, ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ' +
    'ad_group_criterion.system_serving_status, ad_group_criterion.quality_info.quality_score, ' +
    'ad_group_criterion.quality_info.creative_quality_score, ad_group_criterion.quality_info.post_click_quality_score, ' +
    'ad_group_criterion.quality_info.search_predicted_ctr, ad_group_criterion.position_estimates.first_page_cpc_micros, ' +
    'ad_group_criterion.position_estimates.top_of_page_cpc_micros FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'las palabras clave').forEach(function (f) {
    if (!esNueva(f.campaign.name)) return;
    total++;
    var k = f.adGroupCriterion, q = k.qualityInfo || {}, e = k.positionEstimates || {}, tope = topes[f.campaign.name] || 0;
    var linea = '«' + k.keyword.text + '» (' + (TIPO[k.keyword.matchType] || k.keyword.matchType) + ') · calidad ' + (q.qualityScore || '—') + '/10' +
      ' · anuncio ' + (NIVEL[q.creativeQualityScore] || '—') + ' · clic esperado ' + (NIVEL[q.searchPredictedCtr] || '—') +
      ' · página ' + (NIVEL[q.postClickQualityScore] || '—') + ' · pide ' + pesos(e.firstPageCpcMicros) + ' para salir y ' +
      pesos(e.topOfPageCpcMicros) + ' para salir arriba · tope ' + pesos(tope) + (k.systemServingStatus === 'RARELY_SERVED' ? ' · POCAS BÚSQUEDAS' : '');
    (porCampana[f.campaign.name] = porCampana[f.campaign.name] || []).push(linea);
    if (q.postClickQualityScore === 'BELOW_AVERAGE') malaPagina++;
    if (q.creativeQualityScore === 'BELOW_AVERAGE') malaRelevancia++;
    if (q.searchPredictedCtr === 'BELOW_AVERAGE') malaClic++;
    if (k.systemServingStatus === 'RARELY_SERVED') pocas.push(k.keyword.text);
    else if (tope && Number(e.topOfPageCpcMicros) > tope) cortas.push(k.keyword.text + ' (pide ' + pesos(e.topOfPageCpcMicros) + ', tope ' + pesos(tope) + ')');
  });

  Object.keys(porCampana).sort().forEach(function (n) {
    Logger.log('');
    Logger.log('==== ' + n.replace(PLAN.prefijo, '') + ' ====');
    porCampana[n].forEach(function (l) { Logger.log(l); });
  });

  Logger.log('');
  Logger.log('==== RESULTADO (' + total + ' palabras clave) ====');
  if (malaPagina) Logger.log('❌ ' + malaPagina + ' palabra(s) con PÁGINA mala: Google cree que la página no responde a lo que se buscó o no es buena en celular. Lo arregla Rodolfo (texto de la búsqueda en la página, rapidez, teléfono visible).');
  if (malaRelevancia) Logger.log('❌ ' + malaRelevancia + ' palabra(s) con ANUNCIO poco relevante: el texto del anuncio no repite lo que la persona buscó. Se arregla con títulos nuevos.');
  if (malaClic) Logger.log('⚠️ ' + malaClic + ' palabra(s) con probabilidad de clic baja: el anuncio llama poco la atención frente a la competencia.');
  if (cortas.length) Logger.log('💲 ' + cortas.length + ' palabra(s) piden más que el tope para salir arriba: ' + cortas.slice(0, 15).join(' · '));
  if (pocas.length) Logger.log('⚠️ ' + pocas.length + ' palabra(s) con POCAS BÚSQUEDAS (Google no las activa): ' + pocas.slice(0, 15).join(' · '));
  if (!malaPagina && !malaRelevancia && !malaClic && !cortas.length && !pocas.length) Logger.log('✅ Calidad y topes bien.');
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
