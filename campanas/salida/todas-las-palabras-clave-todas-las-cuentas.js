// TODAS LAS PALABRAS CLAVE - las 5 cuentas (solo lee, 18 nov 2026)
// Pegar en la cuenta de ADMINISTRADOR. VISTA PREVIA. No cambia nada.
// Saca TODAS las palabras clave (no negativas) de cada cuenta, aunque no hayan tenido clics:
// campana, grupo, palabra, concordancia, estado, calificacion de Google (1-10) y 30 dias de impresiones, clics, gasto y contactos.
// Al final de cada cuenta: cuantas hay, cuantas trajeron contactos y cuantas no tuvieron ni un clic.
// El bloque "PARA PEGAR EN UNA HOJA" va separado por ; (se pega en Google Sheets > Datos > Dividir texto en columnas).
var CUENTAS = ['256-397-2201', '993-525-8739', '265-909-2662', '860-582-6837', '118-347-6484'];
var MARCAS = { '256-397-2201': 'Quick Laundry', '993-525-8739': 'Kingstar', '265-909-2662': 'Laundry Solutions', '860-582-6837': 'Girbau', '118-347-6484': 'Gamesail' };
var CONC = { EXACT: 'exacta', PHRASE: 'frase', BROAD: 'amplia' };
var hoja = [];

function main() {
  if (typeof AdsManagerApp !== 'undefined') {
    var it = AdsManagerApp.accounts().withIds(CUENTAS).get();
    while (it.hasNext()) { AdsManagerApp.select(it.next()); cuenta(); }
  } else { cuenta(); }
  Logger.log('==== PARA PEGAR EN UNA HOJA (separado por ;) ====');
  Logger.log('marca;campana;estado campana;grupo;palabra;concordancia;estado;calificacion;impresiones;clics;gasto;contactos');
  hoja.forEach(function (l) { Logger.log(l); });
  Logger.log('FIN. Este script no cambio nada.');
}

function limpio(t) { return String(t === undefined || t === null ? '' : t).replace(/;/g, ','); }

function cuenta() {
  var cid = AdsApp.currentAccount().getCustomerId(), marca = MARCAS[cid] || AdsApp.currentAccount().getName();
  var K = {}, orden = [];
  try {
    var it = AdsApp.search("SELECT campaign.name, campaign.status, ad_group.name, ad_group.status, ad_group_criterion.criterion_id, ad_group.id, " +
      "ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status, ad_group_criterion.quality_info.quality_score " +
      "FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE " +
      "AND ad_group_criterion.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
    while (it.hasNext()) {
      var r = it.next(), k = r.adGroup.id + '|' + r.adGroupCriterion.criterionId;
      var estado = r.campaign.status !== 'ENABLED' ? 'campana en pausa' : (r.adGroup.status !== 'ENABLED' ? 'grupo en pausa' :
        (r.adGroupCriterion.status === 'ENABLED' ? 'activa' : 'en pausa'));
      K[k] = { camp: r.campaign.name, campEstado: r.campaign.status === 'ENABLED' ? 'activa' : 'en pausa', grupo: r.adGroup.name,
        texto: r.adGroupCriterion.keyword.text, conc: CONC[r.adGroupCriterion.keyword.matchType] || r.adGroupCriterion.keyword.matchType,
        estado: estado, qs: ((r.adGroupCriterion.qualityInfo || {}).qualityScore) || '', imp: 0, clics: 0, gasto: 0, conv: 0 };
      orden.push(k);
    }
  } catch (e) { Logger.log(marca + ': no se pudieron leer las palabras: ' + e.message); return; }
  try {
    var m = AdsApp.search("SELECT ad_group.id, ad_group_criterion.criterion_id, metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions " +
      "FROM keyword_view WHERE segments.date DURING LAST_30_DAYS");
    while (m.hasNext()) {
      var x = m.next(), kk = x.adGroup.id + '|' + x.adGroupCriterion.criterionId, p = K[kk], mt = x.metrics || {};
      if (!p) continue;
      p.imp += Number(mt.impressions) || 0; p.clics += Number(mt.clicks) || 0;
      p.gasto += (Number(mt.costMicros) || 0) / 1e6; p.conv += Number(mt.conversions) || 0;
    }
  } catch (e) { Logger.log(marca + ': no se pudieron leer los numeros: ' + e.message); }

  var lista = orden.map(function (k) { return K[k]; }).sort(function (a, b) {
    return a.camp < b.camp ? -1 : a.camp > b.camp ? 1 : b.gasto - a.gasto;
  });
  var conCont = 0, sinClic = 0, activas = 0, camp = '';
  Logger.log('==== ' + marca + ' - ' + lista.length + ' palabras clave - 30 dias ====');
  lista.forEach(function (p) {
    if (p.camp !== camp) { camp = p.camp; Logger.log('-- ' + camp + (p.campEstado === 'activa' ? '' : ' (EN PAUSA)')); }
    if (p.conv > 0) conCont++;
    if (p.clics === 0) sinClic++;
    if (p.estado === 'activa') activas++;
    Logger.log('  ' + p.texto + ' [' + p.conc + '] - ' + p.grupo + ' - ' + p.estado + (p.qs ? ' - calif ' + p.qs : '') +
      ' - ' + p.imp + ' imp - ' + p.clics + ' clics - $' + Math.round(p.gasto) + ' - ' + (Math.round(p.conv * 10) / 10) + ' contactos');
    hoja.push([marca, p.camp, p.campEstado, p.grupo, p.texto, p.conc, p.estado, p.qs, p.imp, p.clics, Math.round(p.gasto), Math.round(p.conv * 10) / 10]
      .map(limpio).join(';'));
  });
  Logger.log('RESUMEN ' + marca + ': ' + lista.length + ' palabras (' + activas + ' activas) - trajeron contactos: ' + conCont +
    ' - sin ningun clic en 30 dias: ' + sinClic);
  Logger.log('');
}
