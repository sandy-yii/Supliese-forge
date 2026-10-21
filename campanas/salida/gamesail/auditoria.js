/**
 * Atelback · Auditoría antes de recibir clientes — Gamesail (CUENTA NUEVA)
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * SOLO LEE: no cambia nada en la cuenta. Revisa que lo que dejaron los otros scripts esté bien y que los anuncios
 * puedan traer clientes: campañas encendidas y su presupuesto, ubicación e idioma, anuncios aprobados y con la página
 * correcta, un solo sitio por grupo, palabras clave, conversiones, etiquetado automático y que la página cargue.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA (basta con la vista previa) > leer el reporte en Registros.
 */

var PLAN = {"cuenta": "", "anterior": "645-094-0317", "nombre": "Gamesail", "url": "https://gamesail-lavadoras.vercel.app/", "prefijo": "AB · ", "lista": "AB · Negativas de la cuenta", "anteriores": "MITAD", "campanas": [{"nombre": "AB · Lavadoras para ropa y sábanas", "arranque": 97, "completo": 194}, {"nombre": "AB · Lavadoras por capacidad y precio", "arranque": 58, "completo": 117}, {"nombre": "AB · Secadoras industriales", "arranque": 58, "completo": 117}, {"nombre": "AB · Hoteles y hospitales", "arranque": 39, "completo": 78}, {"nombre": "AB · Mangles y planchado", "arranque": 26, "completo": 52}, {"nombre": "AB · Competencia depurada", "arranque": 23, "completo": 45}, {"nombre": "AB · Marca Gamesail", "arranque": 23, "completo": 45}]};

// Solo si es una cuenta nueva (el plan no trae su número): pega aquí su número, por ejemplo '123-456-7890'.
var CUENTA_NUEVA = '';

var MAL = [], AVISOS = [], BIEN = [];
function mal(t) { MAL.push(t); }
function aviso(t) { AVISOS.push(t); }
function bien(t) { BIEN.push(t); }

function revisarCuenta() {
  var cid = AdsApp.currentAccount().getCustomerId();
  var esperada = PLAN.cuenta || CUENTA_NUEVA;
  if (!esperada) throw new Error('Es una cuenta nueva: pega su número en CUENTA_NUEVA, arriba del script.');
  if (PLAN.anterior && cid === PLAN.anterior) throw new Error('Esta es la cuenta anterior (' + cid + '), no la nueva.');
  if (cid !== esperada) throw new Error('Este script es para la cuenta ' + esperada + ' y se está corriendo en ' + cid + '.');
  return cid;
}

function sitio(url) {
  var m = /^https?:\/\/([^\/?#]+)/i.exec(url || '');
  return m ? m[1].toLowerCase().replace(/^www\./, '') : '';
}
function pesos(micros) { return Math.round(Number(micros || 0) / 1000000); }
function esNueva(nombre) { return nombre.indexOf(PLAN.prefijo) === 0; }

// Corre una consulta; si Google no acepta algún campo, lo reporta y sigue con lo demás.
function filas(consulta, que) {
  var out = [];
  try {
    var it = AdsApp.search(consulta);
    while (it.hasNext()) out.push(it.next());
  } catch (e) {
    aviso('No se pudo revisar ' + que + ': ' + e.message);
  }
  return out;
}

function main() {
  revisarCuenta();
  var destino = sitio(PLAN.url);
  Logger.log('AUDITORÍA · ' + PLAN.nombre + ' · página esperada: ' + PLAN.url);

  // ---- Cuenta
  var cu = filas('SELECT customer.auto_tagging_enabled, customer.status, customer.currency_code FROM customer', 'la cuenta');
  if (cu.length) {
    var k = cu[0].customer;
    if (k.autoTaggingEnabled) bien('Etiquetado automático activado.');
    else mal('El etiquetado automático está APAGADO: Google Ads no podrá saber qué anuncio trajo a cada cliente. Corre «conversiones.js» o actívalo en Administración > Configuración de la cuenta.');
    if (k.status && k.status !== 'ENABLED') mal('La cuenta tiene estado ' + k.status + '.');
  }

  // ---- Campañas
  var camp = filas('SELECT campaign.resource_name, campaign.name, campaign.status, campaign.serving_status, ' +
    'campaign.primary_status, campaign.primary_status_reasons, campaign.advertising_channel_type, campaign_budget.amount_micros ' +
    "FROM campaign WHERE campaign.status != 'REMOVED'", 'las campañas');
  var porNombre = {};
  camp.forEach(function (f) { porNombre[f.campaign.name] = f; });
  var anterioresActivas = camp.filter(function (f) { return !esNueva(f.campaign.name) && f.campaign.status === 'ENABLED'; });
  var total = 0;
  PLAN.campanas.forEach(function (k) {
    var f = porNombre[k.nombre];
    if (!f) { mal('No existe la campaña «' + k.nombre + '». Corre «crear-campanas.js».'); return; }
    var monto = pesos(f.campaignBudget.amountMicros);
    total += f.campaign.status === 'ENABLED' ? monto : 0;
    var razones = (f.campaign.primaryStatusReasons || []).join(', ');
    if (f.campaign.status !== 'ENABLED') {
      mal('«' + k.nombre + '» está ' + f.campaign.status + ': no sale. Corre «activar.js».');
    } else if (monto !== k.arranque && monto !== k.completo) {
      aviso('«' + k.nombre + '» está encendida con $' + monto + ' al día; el plan dice $' + k.arranque + ' (arranque) o $' + k.completo + ' (completo).');
    } else {
      bien('«' + k.nombre + '» encendida · $' + monto + ' al día · estado de Google: ' + (f.campaign.primaryStatus || f.campaign.servingStatus || 'sin dato') +
        (razones ? ' (' + razones + ')' : ''));
    }
    if (f.campaign.status === 'ENABLED' && /NOT_ELIGIBLE|REMOVED|ENDED/.test(f.campaign.primaryStatus || '')) {
      mal('«' + k.nombre + '» no puede salir según Google: ' + f.campaign.primaryStatus + (razones ? ' · ' + razones : '') + '.');
    } else if (f.campaign.status === 'ENABLED' && /PENDING|LIMITED/.test(f.campaign.primaryStatus || '')) {
      aviso('«' + k.nombre + '»: Google la marca ' + f.campaign.primaryStatus + (razones ? ' (' + razones + ')' : '') + '. Si es por anuncios en revisión, se resuelve solo en unas horas.');
    }
  });
  if (total) bien('Gasto diario de las campañas nuevas encendidas: $' + total + '.');
  if (PLAN.anteriores === 'PAUSAR' && anterioresActivas.length) {
    mal('Siguen encendidas campañas anteriores que el plan pide pausar: ' + anterioresActivas.map(function (f) { return '«' + f.campaign.name + '»'; }).join(', ') + '.');
  } else if (anterioresActivas.length) {
    bien('Campañas anteriores encendidas (a la mitad del presupuesto, según el plan): ' +
      anterioresActivas.map(function (f) { return '«' + f.campaign.name + '» $' + pesos(f.campaignBudget.amountMicros); }).join(', ') + '.');
  }

  // ---- Ubicación, idioma y lista de negativas de las campañas nuevas
  var crit = filas('SELECT campaign.name, campaign_criterion.type, campaign_criterion.negative, ' +
    'campaign_criterion.location.geo_target_constant, campaign_criterion.language.language_constant ' +
    "FROM campaign_criterion WHERE campaign.status != 'REMOVED'", 'la ubicación y el idioma');
  var listas = filas("SELECT campaign.name, shared_set.name FROM campaign_shared_set WHERE campaign_shared_set.status = 'ENABLED'",
    'las listas de negativas');
  PLAN.campanas.forEach(function (k) {
    if (!porNombre[k.nombre]) return;
    var mias = crit.filter(function (f) { return f.campaign.name === k.nombre; });
    var mexico = mias.some(function (f) { return !f.campaignCriterion.negative && f.campaignCriterion.location &&
      /\/2484$/.test(f.campaignCriterion.location.geoTargetConstant || ''); });
    var espanol = mias.some(function (f) { return f.campaignCriterion.language && /\/1003$/.test(f.campaignCriterion.language.languageConstant || ''); });
    var lista = listas.some(function (f) { return f.campaign.name === k.nombre && f.sharedSet.name === PLAN.lista; });
    var faltan = [];
    if (!mexico) faltan.push('ubicación México');
    if (!espanol) faltan.push('idioma español');
    if (!lista) faltan.push('lista «' + PLAN.lista + '»');
    if (faltan.length && crit.length) mal('«' + k.nombre + '» no tiene: ' + faltan.join(', ') + '. Agrégalo en su configuración.');
  });

  // ---- Anuncios: página, aprobación y un solo sitio por grupo
  var ads = filas('SELECT campaign.name, campaign.status, ad_group.name, ad_group.status, ad_group_ad.status, ad_group_ad.ad.type, ' +
    'ad_group_ad.ad.final_urls, ad_group_ad.policy_summary.approval_status, ad_group_ad.policy_summary.review_status, ' +
    'ad_group_ad.policy_summary.policy_topic_entries FROM ad_group_ad ' +
    "WHERE ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'", 'los anuncios');
  var sitios = {}, urlsActivas = {}, porCampana = {};
  ads.forEach(function (f) {
    var url = (f.adGroupAd.ad.finalUrls || [])[0] || '';
    var g = f.campaign.name + ' > ' + f.adGroup.name;
    sitios[g] = sitios[g] || {};
    if (sitio(url)) sitios[g][sitio(url)] = true;
    var activo = f.campaign.status === 'ENABLED' && f.adGroup.status === 'ENABLED' && f.adGroupAd.status === 'ENABLED';
    if (!activo) return;
    if (url) urlsActivas[url] = true;
    var pol = f.adGroupAd.policySummary || {};
    var c = porCampana[f.campaign.name] = porCampana[f.campaign.name] || { ok: 0, revision: 0, malos: [] };
    if (sitio(url) !== destino) mal(g + ': el anuncio va a ' + url + ', no a ' + destino + '. Corre «cambiar-pagina.js».');
    var estado = pol.approvalStatus || '';
    if (estado === 'DISAPPROVED') {
      c.malos.push(g + ' (' + (pol.policyTopicEntries || []).map(function (e) { return e.topic; }).join(', ') + ')');
    } else if (estado === 'APPROVED' || estado === 'APPROVED_LIMITED') {
      c.ok++;
      if (estado === 'APPROVED_LIMITED') aviso(g + ': anuncio aprobado pero limitado (' + (pol.policyTopicEntries || []).map(function (e) { return e.topic; }).join(', ') + ').');
    } else {
      c.revision++;
    }
  });
  Object.keys(sitios).forEach(function (g) {
    var s = Object.keys(sitios[g]);
    if (s.length > 1) mal(g + ': mezcla ' + s.length + ' sitios (' + s.join(', ') + '). Google rechaza los grupos con más de un sitio, aunque haya anuncios en pausa. Corre «cambiar-pagina.js».');
  });
  Object.keys(porCampana).forEach(function (n) {
    var c = porCampana[n];
    if (c.malos.length) mal('«' + n + '»: anuncios rechazados en ' + c.malos.join('; ') + '.');
    if (c.ok) bien('«' + n + '»: ' + c.ok + ' anuncio(s) aprobado(s)' + (c.revision ? ' y ' + c.revision + ' en revisión' : '') + '.');
    else if (c.revision) aviso('«' + n + '»: ' + c.revision + ' anuncio(s) todavía en revisión de Google; suelen aprobarse en unas horas.');
  });
  PLAN.campanas.forEach(function (k) {
    var f = porNombre[k.nombre];
    if (f && f.campaign.status === 'ENABLED' && !porCampana[k.nombre]) mal('«' + k.nombre + '» está encendida pero no tiene ningún anuncio activo.');
  });

  // ---- Palabras clave de las campañas nuevas
  var kws = filas('SELECT campaign.name, ad_group_criterion.keyword.text, ad_group_criterion.approval_status, ' +
    'ad_group_criterion.system_serving_status FROM ad_group_criterion ' +
    "WHERE ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status = 'ENABLED' " +
    "AND ad_group.status = 'ENABLED' AND campaign.status != 'REMOVED'", 'las palabras clave');
  PLAN.campanas.forEach(function (k) {
    if (!porNombre[k.nombre]) return;
    var mias = kws.filter(function (f) { return f.campaign.name === k.nombre; });
    var rechazadas = mias.filter(function (f) { return f.adGroupCriterion.approvalStatus === 'DISAPPROVED'; });
    var poco = mias.filter(function (f) { return f.adGroupCriterion.systemServingStatus === 'RARELY_SERVED'; });
    if (!mias.length && kws.length) mal('«' + k.nombre + '» no tiene palabras clave activas.');
    if (rechazadas.length) aviso('«' + k.nombre + '»: palabras rechazadas: ' + rechazadas.map(function (f) { return f.adGroupCriterion.keyword.text; }).join(', ') + '.');
    if (poco.length) aviso('«' + k.nombre + '»: palabras con pocas búsquedas (casi no saldrán): ' + poco.map(function (f) { return f.adGroupCriterion.keyword.text; }).join(', ') + '.');
  });

  // ---- Conversiones
  var conv = filas('SELECT conversion_action.name, conversion_action.status, conversion_action.primary_for_goal, conversion_action.type ' +
    "FROM conversion_action WHERE conversion_action.status != 'REMOVED'", 'las conversiones');
  var nombresConv = conv.map(function (f) { return f.conversionAction.name; });
  ['AB · Formulario enviado', 'AB · Clic en WhatsApp'].forEach(function (n) {
    if (conv.length && nombresConv.indexOf(n) < 0) mal('Falta la conversión «' + n + '». Corre «conversiones.js».');
  });
  if (conv.length && nombresConv.indexOf('AB · Formulario enviado') >= 0) bien('Conversiones de la página creadas.');
  conv.forEach(function (f) {
    var a = f.conversionAction;
    if (a.primaryForGoal && a.status === 'ENABLED' && /chat|bot|mensaje|visita|engagement|local/i.test(a.name)) {
      aviso('«' + a.name + '» es Principal y no parece un cliente: conviene pasarla a Secundaria.');
    }
  });
  var semana = filas('SELECT segments.conversion_action_name, metrics.all_conversions FROM campaign ' +
    "WHERE segments.date DURING LAST_7_DAYS AND metrics.all_conversions > 0", 'las conversiones de la semana');
  var conDatos = {};
  semana.forEach(function (f) { conDatos[f.segments.conversionActionName] = (conDatos[f.segments.conversionActionName] || 0) + Number(f.metrics.allConversions || 0); });
  if (!conDatos['AB · Formulario enviado'] && !conDatos['AB · Clic en WhatsApp']) {
    aviso('Todavía no hay conversiones de la página en los últimos 7 días. Es normal si Rodolfo apenas puso el código; haz una prueba: un clic en WhatsApp y un formulario desde el celular.');
  }

  // ---- Recursos con otro sitio
  var recursos = filas("SELECT campaign.name, asset.type, asset.final_urls FROM campaign_asset WHERE campaign_asset.status != 'REMOVED' " +
    "AND campaign.status = 'ENABLED'", 'los enlaces de sitio');
  recursos.forEach(function (f) {
    (f.asset.finalUrls || []).forEach(function (u) {
      if (sitio(u) && sitio(u) !== destino) aviso('«' + f.campaign.name + '»: ' + f.asset.type + ' apunta a ' + u + '. Cámbialo en Recursos.');
    });
  });

  // ---- La página carga
  urlsActivas[PLAN.url] = true;
  Object.keys(urlsActivas).forEach(function (u) {
    try {
      var r = UrlFetchApp.fetch(u, { muteHttpExceptions: true, followRedirects: false });
      var code = r.getResponseCode();
      if (code >= 200 && code < 300) {
        bien('La página ' + u + ' carga (código ' + code + ').');
      } else if (code >= 300 && code < 400) {
        var h = r.getHeaders(), to = h.Location || h.location || '';
        if (sitio(to) && sitio(to) !== sitio(u)) mal('La página ' + u + ' redirige a otro sitio (' + to + '). Google puede rechazar los anuncios.');
        else aviso('La página ' + u + ' redirige a ' + to + ' dentro del mismo sitio.');
      } else {
        mal('La página ' + u + ' responde con error ' + code + '. Los anuncios que van ahí serán rechazados.');
      }
    } catch (e) {
      aviso('No se pudo abrir ' + u + ' desde el script: ' + e.message + '. Ábrela tú en el celular.');
    }
  });
  try {
    var rb = UrlFetchApp.fetch('https://' + destino + '/robots.txt', { muteHttpExceptions: true });
    if (rb.getResponseCode() === 200 && /user-agent:\s*adsbot-google[^\n]*\n(?:[^\n]*\n)*?\s*disallow:\s*\/\s*$/im.test(rb.getContentText())) {
      mal('robots.txt de ' + destino + ' bloquea a AdsBot-Google: Google no podrá revisar la página.');
    }
  } catch (e) { /* sin robots.txt no hay bloqueo */ }

  // ---- Hoy
  var hoy = filas('SELECT campaign.name, metrics.impressions, metrics.clicks, metrics.cost_micros FROM campaign ' +
    "WHERE segments.date DURING TODAY AND campaign.status = 'ENABLED'", 'los números de hoy');
  var imp = 0, clics = 0;
  hoy.forEach(function (f) { if (esNueva(f.campaign.name)) { imp += Number(f.metrics.impressions || 0); clics += Number(f.metrics.clicks || 0); } });
  (imp ? bien : aviso)('Hoy, campañas nuevas: ' + imp + ' impresiones y ' + clics + ' clics' + (imp ? '.' : '. Si se activaron hace poco o los anuncios están en revisión, es normal.'));

  aviso('Revisa a mano: verificación del anunciante (Administración > Verificación del anunciante) y que no haya avisos de pago en Facturación.');

  // ---- Reporte
  Logger.log('');
  Logger.log('================ RESULTADO ================');
  MAL.forEach(function (t) { Logger.log('❌ ' + t); });
  AVISOS.forEach(function (t) { Logger.log('⚠️ ' + t); });
  BIEN.forEach(function (t) { Logger.log('✅ ' + t); });
  Logger.log('');
  Logger.log(MAL.length ? 'HAY ' + MAL.length + ' PROBLEMA(S) QUE IMPIDEN O FRENAN LOS CLIENTES. Corrígelos o manda este registro.'
                        : 'SIN PROBLEMAS GRAVES. La cuenta está lista para recibir clientes' + (AVISOS.length ? '; revisa los avisos.' : '.'));
}
