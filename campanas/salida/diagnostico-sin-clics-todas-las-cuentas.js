/**
 * Atelback · ¿Por qué no hay clics? — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * SOLO LEE: no cambia nada en la cuenta. Para cada campaña nueva «AB ·» dice si ya está saliendo y, si no, por qué:
 * fecha de inicio, estado y motivos de Google, horario, anuncios aprobados, palabras clave con pocas búsquedas,
 * tope de CPC contra lo que Google pide para salir en la primera página, y cuota de impresiones perdida por puja
 * o por presupuesto. Además revisa la facturación de la cuenta.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA (basta, no cambia nada) > abrir «Registros».
 * El mismo archivo sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está.
 */

var PLANES = [{"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail-lavadoras.vercel.app/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194, "cpc": 14}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117, "cpc": 12}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117, "cpc": 14}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78, "cpc": 16}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52, "cpc": 16}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45, "cpc": 10}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45, "cpc": 8}]}, {"cuenta": "256-397-2201", "anterior": "", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://www.supliese.com/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Equipo para lavandería", "arranque": 79, "completo": 158, "cpc": 8}, {"nombre": "AB · Emprendimiento", "arranque": 49, "completo": 99, "cpc": 7}, {"nombre": "AB · Autoservicio y monedas", "arranque": 28, "completo": 55, "cpc": 7}, {"nombre": "AB · Secadoras para lavandería", "arranque": 16, "completo": 32, "cpc": 8}, {"nombre": "AB · Marcas comerciales", "arranque": 16, "completo": 32, "cpc": 7}, {"nombre": "AB · Marca Quick Laundry", "arranque": 10, "completo": 20, "cpc": 6}]}, {"cuenta": "993-525-8739", "anterior": "", "nombre": "CLM", "url": "https://kingstar.com.mx/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Alta capacidad 60 kg o más", "arranque": 92, "completo": 185, "cpc": 18}, {"nombre": "AB · Lavandería hotelera e institucional", "arranque": 77, "completo": 154, "cpc": 18}, {"nombre": "AB · Mangles y planchado", "arranque": 46, "completo": 92, "cpc": 18}, {"nombre": "AB · Lavadoras y secadoras de 20 a 45 kg", "arranque": 46, "completo": 92, "cpc": 15}, {"nombre": "AB · Túnel de lavado", "arranque": 31, "completo": 62, "cpc": 30}, {"nombre": "AB · Marca CLM", "arranque": 15, "completo": 31, "cpc": 8}]}, {"cuenta": "265-909-2662", "anterior": "", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Servicio técnico industrial", "arranque": 43, "completo": 86, "cpc": 15}, {"nombre": "AB · Reparación y mantenimiento", "arranque": 54, "completo": 108, "cpc": 15}, {"nombre": "AB · Refacciones Girbau y Gamesail", "arranque": 16, "completo": 32, "cpc": 12}, {"nombre": "AB · Servicio a secadoras", "arranque": 11, "completo": 22, "cpc": 15}, {"nombre": "AB · Instalación", "arranque": 7, "completo": 13, "cpc": 15}, {"nombre": "AB · Servicio a lavanderías", "arranque": 4, "completo": 8, "cpc": 12}]}, {"cuenta": "860-582-6837", "anterior": "", "nombre": "Girbau", "url": "https://girbaupro.com/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "PAUSAR", "campanas": [{"nombre": "AB · Marca Girbau", "arranque": 49, "completo": 98, "cpc": 10}, {"nombre": "AB · Girbau Smart Plus", "arranque": 22, "completo": 43, "cpc": 10}, {"nombre": "AB · Girbau por capacidad y sector", "arranque": 27, "completo": 54, "cpc": 10}, {"nombre": "AB · Servicio técnico Girbau", "arranque": 11, "completo": 22, "cpc": 10}]}];
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
function pesos(micros) { return '$' + (Number(micros || 0) / 1e6).toFixed(2); }
function pct(x) { return x === undefined || x === null || x === '' ? 'sin dato' : Math.round(Number(x) * 100) + '%'; }

function main() {
  revisarCuenta();
  var cuenta = AdsApp.currentAccount();
  var tz = cuenta.getTimeZone();
  var ahora = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
  var hoy = ahora.substring(0, 10);
  Logger.log('¿POR QUÉ NO HAY CLICS? · ' + PLAN.nombre + ' · hora de la cuenta: ' + ahora + ' (' + tz + ')');
  var GRAVE = [], AVISO = [], BIEN = [];

  // ---- Cuenta: estado y facturación
  filas('SELECT customer.status FROM customer', 'el estado de la cuenta').forEach(function (f) {
    if (f.customer.status !== 'ENABLED') GRAVE.push('La cuenta está ' + f.customer.status + ': no puede mostrar anuncios.');
  });
  var pagos = filas('SELECT billing_setup.status FROM billing_setup', 'la facturación');
  if (pagos.length && !pagos.some(function (f) { return f.billingSetup.status === 'APPROVED'; })) {
    GRAVE.push('La forma de pago no está aprobada (' + pagos.map(function (f) { return f.billingSetup.status; }).join(', ') +
      '). Revisa Facturación: sin pago aprobado no salen anuncios.');
  }

  // ---- Campañas nuevas
  var datos = {};
  filas('SELECT campaign.resource_name, campaign.name, campaign.status, campaign.serving_status, campaign.primary_status, ' +
    'campaign.primary_status_reasons, campaign.bidding_strategy_type, campaign.target_spend.cpc_bid_ceiling_micros, ' +
    "campaign.manual_cpc.enhanced_cpc_enabled, campaign_budget.amount_micros FROM campaign WHERE campaign.status = 'ENABLED'", 'las campañas')
    .forEach(function (f) {
      if (!esNueva(f.campaign.name)) return;
      datos[f.campaign.name] = { c: f.campaign, presupuesto: f.campaignBudget.amountMicros, tope: (f.campaign.targetSpend || {}).cpcBidCeilingMicros,
        hoy: { imp: 0, clics: 0, costo: 0 }, semana: { imp: 0, clics: 0 }, cuota: null, palabras: 0, pocas: 0, caras: [], grupos: 0, anuncios: 0, horario: 0 };
    });
  var nombres = Object.keys(datos);
  if (!nombres.length) {
    GRAVE.push('No hay campañas «' + PLAN.prefijo + '» encendidas en esta cuenta. Corre «activar.js».');
  }

  // Fecha de inicio y fin (si empieza otro día, hoy no sale).
  var itc = AdsApp.campaigns().withCondition('Status = ENABLED').get();
  while (itc.hasNext()) {
    var cc = itc.next();
    var d = datos[cc.getName()];
    if (!d) continue;
    var ini = cc.getStartDate(), fin = cc.getEndDate();
    var f2 = function (x) { return x.year + '-' + ('0' + x.month).slice(-2) + '-' + ('0' + x.day).slice(-2); };
    d.inicio = ini ? f2(ini) : '';
    d.fin = fin ? f2(fin) : '';
  }

  filas('SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign ' +
    "WHERE segments.date DURING TODAY AND campaign.status = 'ENABLED'", 'los números de hoy').forEach(function (f) {
    var d = datos[f.campaign.name];
    if (d) { d.hoy.imp += Number(f.metrics.impressions || 0); d.hoy.clics += Number(f.metrics.clicks || 0); d.hoy.costo += Number(f.metrics.costMicros || 0); }
  });
  filas('SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.search_impression_share, ' +
    'metrics.search_rank_lost_impression_share, metrics.search_budget_lost_impression_share FROM campaign ' +
    "WHERE segments.date DURING LAST_7_DAYS AND campaign.status = 'ENABLED'", 'los números de la semana').forEach(function (f) {
    var d = datos[f.campaign.name];
    if (!d) return;
    d.semana.imp += Number(f.metrics.impressions || 0);
    d.semana.clics += Number(f.metrics.clicks || 0);
    d.cuota = { tiene: f.metrics.searchImpressionShare, puja: f.metrics.searchRankLostImpressionShare, presupuesto: f.metrics.searchBudgetLostImpressionShare };
  });
  filas("SELECT campaign.name FROM campaign_criterion WHERE campaign_criterion.type = 'AD_SCHEDULE' AND campaign.status = 'ENABLED'", 'los horarios')
    .forEach(function (f) { var d = datos[f.campaign.name]; if (d) d.horario++; });
  filas("SELECT campaign.name, ad_group_ad.policy_summary.approval_status FROM ad_group_ad WHERE ad_group_ad.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'los anuncios').forEach(function (f) {
    var d = datos[f.campaign.name];
    if (d && /APPROVED/.test(f.adGroupAd.policySummary.approvalStatus || '')) d.anuncios++;
  });
  filas("SELECT campaign.name, ad_group.name FROM ad_group WHERE ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'los grupos')
    .forEach(function (f) { var d = datos[f.campaign.name]; if (d) d.grupos++; });
  filas('SELECT campaign.name, ad_group_criterion.keyword.text, ad_group_criterion.system_serving_status, ' +
    'ad_group_criterion.approval_status, ad_group_criterion.position_estimates.first_page_cpc_micros FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'", 'las palabras clave').forEach(function (f) {
    var d = datos[f.campaign.name];
    if (!d) return;
    var k = f.adGroupCriterion;
    if (k.approvalStatus === 'DISAPPROVED') return;
    d.palabras++;
    if (k.systemServingStatus === 'RARELY_SERVED') d.pocas++;
    var primera = Number((k.positionEstimates || {}).firstPageCpcMicros || 0);
    if (d.tope && primera > Number(d.tope)) d.caras.push(k.keyword.text + ' (pide ' + pesos(primera) + ')');
  });

  // ---- Conclusión por campaña
  Logger.log('');
  Logger.log('================ CAMPAÑA POR CAMPAÑA ================');
  nombres.forEach(function (n) {
    var d = datos[n], c = d.c, por = [];
    Logger.log(n + ' · ' + (c.primaryStatus || '') + ((c.primaryStatusReasons || []).length ? ' (' + c.primaryStatusReasons.join(', ') + ')' : '') +
      ' · ' + pesos(d.presupuesto) + '/día · ' + (c.biddingStrategyType || '') + (d.tope ? ' tope CPC ' + pesos(d.tope) : '') +
      ' · inicio ' + (d.inicio || '?') + ' · hoy ' + d.hoy.imp + ' impr., ' + d.hoy.clics + ' clics, ' + pesos(d.hoy.costo) +
      ' · 7 días ' + d.semana.imp + ' impr., ' + d.semana.clics + ' clics' +
      (d.cuota ? ' · cuota de impr. ' + pct(d.cuota.tiene) + ', perdida por puja ' + pct(d.cuota.puja) + ', por presupuesto ' + pct(d.cuota.presupuesto) : ''));
    if (d.inicio && d.inicio > hoy) por.push('empieza el ' + d.inicio + ': cambia la fecha de inicio a hoy (Configuración de la campaña)');
    if (d.fin && d.fin < hoy) por.push('terminó el ' + d.fin + ': quita la fecha de finalización');
    if (c.servingStatus && c.servingStatus !== 'SERVING') por.push('Google dice que no se está publicando (' + c.servingStatus + ')');
    if (!d.grupos) por.push('no tiene grupos de anuncios encendidos');
    if (!d.anuncios) por.push('no tiene anuncios aprobados encendidos (pueden seguir en revisión)');
    if (!d.palabras) por.push('no tiene palabras clave encendidas');
    if (d.horario) por.push('tiene horario de anuncios (' + d.horario + ' franja(s)): fuera de ese horario no sale');
    var imp = d.semana.imp + d.hoy.imp;
    if (por.length) { GRAVE.push(n + ': ' + por.join('; ') + '.'); return; }
    if (d.hoy.clics) { BIEN.push(n + ': hoy lleva ' + d.hoy.clics + ' clic(s).'); return; }
    var porque = [];
    if (d.palabras && d.pocas / d.palabras >= 0.5) porque.push(d.pocas + ' de ' + d.palabras + ' palabras clave tienen pocas búsquedas');
    if (d.caras.length) porque.push(d.caras.length + ' palabra(s) piden más que el tope de CPC para salir en la primera página: ' + d.caras.slice(0, 5).join(', '));
    if (d.cuota && Number(d.cuota.puja) >= 0.5) porque.push('pierde ' + pct(d.cuota.puja) + ' de las impresiones por puja: el tope de CPC es bajo');
    if (d.cuota && Number(d.cuota.presupuesto) >= 0.2) porque.push('pierde ' + pct(d.cuota.presupuesto) + ' por presupuesto');
    if (imp) {
      (porque.length ? AVISO : BIEN).push(n + ': sí está saliendo (' + imp + ' impresiones), todavía sin clics hoy' + (porque.length ? '. Además: ' + porque.join('; ') : '') + '.');
    } else if (porque.length) {
      AVISO.push(n + ': sin impresiones todavía. Lo más probable: ' + porque.join('; ') + '.');
    } else {
      AVISO.push(n + ': sin impresiones todavía, pero no hay nada que la bloquee. Es normal en las primeras horas; si mañana sigue en 0, manda este registro.');
    }
  });

  Logger.log('');
  Logger.log('================ RESULTADO ================');
  GRAVE.forEach(function (t) { Logger.log('❌ ' + t); });
  AVISO.forEach(function (t) { Logger.log('⚠️ ' + t); });
  BIEN.forEach(function (t) { Logger.log('✅ ' + t); });
  Logger.log('');
  Logger.log(GRAVE.length ? 'HAY ' + GRAVE.length + ' COSA(S) QUE IMPIDEN QUE SALGAN ANUNCIOS. Manda este registro.'
                          : 'NADA BLOQUEA LOS ANUNCIOS. Manda este registro para revisar los avisos.');
}
