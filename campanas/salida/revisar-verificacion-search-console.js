/**
 * Atelback · ¿Por qué no verifica Search Console? — los cinco sitios
 * Escrito a mano el 4 nov 2026 (no lo genera generar.py).
 *
 * QUÉ HACE: SOLO LEE. No cambia nada en ninguna cuenta. Abre la portada de cada sitio como lo haría Google, sin seguir
 * redirecciones, y dice:
 *   - si responde bien (200) o redirige a otra dirección (www, otro dominio…);
 *   - si en el código está la etiqueta google-site-verification CORRECTA de ese sitio (la de gamesailmx);
 *   - si está el teléfono +52 y su enlace tel:.
 * Sirve en cualquier cuenta de Google Ads (no toca la cuenta).
 *
 * CÓMO SE USA: en cualquier cuenta > pegar completo > Autorizar > VISTA PREVIA > copiar todo el registro y mandarlo.
 */

var SITIOS = [
  { sitio: 'https://supliese.com/', token: 'I0QBGhTTy7pUkGUxwDwc2Opj2OXHrJTF6x_m8C7f6Fc', tel: '523326012237' },
  { sitio: 'https://girbauoccidente.com/', token: 'D0FJSaiox7PHr2Xo7qui3QBuKwnCKw2G_42-3Ok-i94', tel: '523328068994' },
  { sitio: 'https://clmmexico.com/', token: '6ZpYClU99ltHw7TzbdTMDgMHuVb8hijzDn6aNwr_hGk', tel: '523315641538' },
  { sitio: 'https://servicioparalavanderias.com/', token: 'PrZBxiE0NTrW0hix9voubRjme_lkSBCywRpQJeyDdZc', tel: '523314172994' },
  { sitio: 'https://gamesail.mx/', token: '-84Qb1hp4cu2KyF87JroNMP3zl9iaE3ipnE6lhLTUSw', tel: '523311859797' }
];

function revisar(url, s, saltos) {
  var r;
  try {
    r = UrlFetchApp.fetch(url, { muteHttpExceptions: true, followRedirects: false,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Google-Site-Verification/1.0)' } });
  } catch (e) {
    Logger.log('   ' + url + ' · NO ABRE: ' + e.message);
    return;
  }
  var code = r.getResponseCode();
  var h = r.getHeaders();
  var destino = h.Location || h.location || '';
  if (code >= 300 && code < 400) {
    Logger.log('   ' + url + ' · REDIRIGE (' + code + ') a ' + destino);
    if (saltos < 3 && destino) revisar(destino.indexOf('http') === 0 ? destino : url.replace(/\/$/, '') + destino, s, saltos + 1);
    return;
  }
  var html = r.getContentText();
  var metas = [], m, re = /<meta[^>]+google-site-verification[^>]*>/gi;
  while ((m = re.exec(html))) metas.push(m[0]);
  var buena = html.indexOf(s.token) >= 0;
  var digitos = html.replace(/\D/g, '');
  Logger.log('   ' + url + ' · responde ' + code + ' · ' + html.length + ' caracteres');
  Logger.log('   etiqueta correcta de gamesailmx: ' + (buena ? 'SÍ' : 'NO') +
    (metas.length ? ' · etiquetas google-site-verification encontradas: ' + metas.length + ' → ' + metas.join(' | ') : ' · no hay ninguna etiqueta google-site-verification'));
  var head = (/<head[\s\S]*?<\/head>/i.exec(html) || [''])[0];
  if (buena && head.indexOf(s.token) < 0) Logger.log('   ⚠️ la etiqueta está en la página pero NO dentro de <head>: Google solo la acepta en <head>.');
  Logger.log('   teléfono +52: ' + (digitos.indexOf(s.tel) >= 0 ? 'sí' : 'NO') + ' · enlace tel:+' + s.tel + ': ' +
    (html.indexOf('tel:+' + s.tel) >= 0 ? 'sí' : 'NO'));
}

function main() {
  Logger.log('VERIFICACIÓN DE SEARCH CONSOLE · los cinco sitios · solo lee');
  SITIOS.forEach(function (s) {
    Logger.log('');
    Logger.log(s.sitio);
    revisar(s.sitio, s, 0);
    var www = s.sitio.replace('https://', 'https://www.');
    Logger.log('  (versión con www)');
    revisar(www, s, 0);
  });
  Logger.log('');
  Logger.log('LISTO. Copia todo el registro y mándalo. Este script no cambió nada.');
}
