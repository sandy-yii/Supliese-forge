/**
 * Atelback · Anuncios nuevos con las palabras que busca la gente — las cinco cuentas
 * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.
 *
 * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): agrega un anuncio nuevo, encendido,
 * en los grupos donde Google dice «anuncio poco relevante». Sus títulos repiten lo que la persona buscó. El anuncio que
 * ya está en el grupo se queda como está: no se pausa, no se edita y no se borra. Tampoco toca presupuestos, topes,
 * palabras clave ni páginas. Si el anuncio nuevo ya existe, no lo repite.
 *
 * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro > EJECUTAR.
 */

var PLANES = [{"cuenta": "118-347-6484", "nombre": "Gamesail", "url": "https://gamesail.mx/", "anuncios": []}, {"cuenta": "256-397-2201", "nombre": "Quick Laundry (cuenta Supliese Gómez)", "url": "https://quicklaundry.store/", "anuncios": [{"campana": "AB · Equipo para lavandería", "grupo": "Lavadoras para lavandería", "h": ["Lavadoras para Lavanderías", "Lavadoras para Negocio", "Lavadoras Industriales", "Lavadoras y Secadoras", "Equipo para Lavandería", "Precios de Lavadoras", "Lavadoras para tu Negocio", "Lavadora Industrial", "Cotiza por WhatsApp", "Pide tu Precio Hoy", "Para Lavandería Comercial", "Quick Laundry", "Te Ayudamos a Elegir"], "d": ["Lavadoras para lavandería y para negocio, industriales y semi industriales. Cotiza hoy.", "Lavadoras y secadoras para lavandería. Te damos precio y te ayudamos a elegir.", "Equipo para lavandería nueva o que va a crecer. Escríbenos por WhatsApp y cotiza.", "Quick Laundry: lavadoras industriales para lavandería con asesoría para elegir."], "p": ["lavadoras", "negocio"], "url": "https://quicklaundry.store/"}]}, {"cuenta": "993-525-8739", "nombre": "CLM", "url": "https://kingstar.com.mx/", "anuncios": []}, {"cuenta": "265-909-2662", "nombre": "Servicio para Lavandería", "url": "https://laundrysolutions.store/", "anuncios": [{"campana": "AB · Reparación y mantenimiento", "grupo": "Reparación", "h": ["Reparación Lavadora Industrial", "Reparación de Lavadoras", "Lavadoras Industriales", "Reparamos tu Lavadora", "Técnicos en Reparación", "Reparación en tu Negocio", "Agenda tu Reparación", "Diagnóstico de tu Equipo", "Habla con un Técnico", "Servicio Técnico Industrial", "Cotiza por WhatsApp"], "d": ["Reparación de lavadoras industriales con técnicos en equipo industrial. Agenda tu visita.", "Reparamos lavadoras industriales de lavanderías, hoteles y hospitales.", "Escríbenos por WhatsApp: te damos diagnóstico y cotización de la reparación.", "Reparación de lavadora industrial y mantenimiento correctivo. Habla con un técnico."], "p": ["reparacion", "industrial"], "url": "https://laundrysolutions.store/reparacion-lavadoras-industriales"}]}, {"cuenta": "860-582-6837", "nombre": "Girbau", "url": "https://girbaupro.com/", "anuncios": []}];
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

function firma(titulos) { return titulos.map(function (t) { return t.toLowerCase(); }).sort().join('|'); }

function main() {
  revisarCuenta();
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('ANUNCIOS NUEVOS · ' + PLAN.nombre + (vista ? ' · VISTA PREVIA (no cambia nada)' : ''));
  if (!PLAN.anuncios.length) { Logger.log('Nada que agregar en esta cuenta.'); return; }

  var grupos = {};
  var it = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group.resource_name FROM ad_group ' +
    "WHERE ad_group.status != 'REMOVED' AND campaign.status != 'REMOVED'");
  while (it.hasNext()) {
    var g = it.next();
    grupos[g.campaign.name + ' > ' + g.adGroup.name] = { rn: g.adGroup.resourceName, anuncios: 0, firmas: {} };
  }
  var ita = AdsApp.search('SELECT campaign.name, ad_group.name, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad ' +
    "WHERE ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD' AND ad_group_ad.status != 'REMOVED' AND ad_group.status != 'REMOVED'");
  while (ita.hasNext()) {
    var a = ita.next(), gr = grupos[a.campaign.name + ' > ' + a.adGroup.name];
    if (!gr) continue;
    gr.anuncios++;
    gr.firmas[firma(((a.adGroupAd.ad.responsiveSearchAd || {}).headlines || []).map(function (h) { return h.text; }))] = true;
  }

  var ops = [], donde = [];
  PLAN.anuncios.forEach(function (n) {
    var nombre = n.campana + ' > ' + n.grupo, gr = grupos[nombre];
    if (!gr) { Logger.log('AVISO: no existe el grupo ' + nombre + '. Se salta.'); return; }
    if (gr.firmas[firma(n.h)]) { Logger.log('«' + nombre + '»: el anuncio nuevo ya está. No se repite.'); return; }
    if (gr.anuncios >= 3) { Logger.log('AVISO «' + nombre + '»: ya tiene ' + gr.anuncios + ' anuncios (Google permite 3). Se salta.'); return; }
    ops.push({ adGroupAdOperation: { create: { adGroup: gr.rn, status: 'ENABLED', ad: { finalUrls: [n.url || PLAN.url],
      responsiveSearchAd: { headlines: n.h.map(function (t) { return { text: t }; }), descriptions: n.d.map(function (t) { return { text: t }; }),
        path1: n.p[0], path2: n.p[1] } } } } });
    donde.push('anuncio nuevo en «' + nombre + '» (' + n.h.length + ' títulos, ' + n.d.length + ' descripciones, a ' + (n.url || PLAN.url) +
      ') · títulos: ' + n.h.join(' · ') + ' · el anuncio que ya tenía se queda');
  });
  if (!ops.length) { Logger.log('Nada que agregar.'); return; }

  var res = AdsApp.mutateAll(ops, { partialFailure: true });
  var malos = 0;
  res.forEach(function (r, i) {
    if (r.isSuccessful()) Logger.log((vista ? 'SE HARÍA: ' : 'HECHO: ') + donde[i]);
    else { malos++; Logger.log('AVISO: Google no acepta ' + donde[i] + ': ' + r.getErrorMessages().join('; ')); }
  });
  Logger.log('');
  if (vista) Logger.log((ops.length - malos) + ' anuncio(s) por agregar' + (malos ? '; ' + malos + ' que Google no acepta se omiten' : '') + '. Da EJECUTAR.');
  else Logger.log('LISTO: ' + (ops.length - malos) + ' anuncio(s) agregados' + (malos ? ', ' + malos + ' rechazados por Google' : '') +
    '. Google los revisa en unas horas; mañana el script «por qué no sale» dirá si mejoró la relevancia.');
}
