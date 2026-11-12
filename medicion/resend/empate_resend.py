#!/usr/bin/env python3
"""Cuenta los leads que avisó Resend, por marca, canal y día (hora de México).

SOLO LECTURA: este script únicamente hace GET a la API de Resend.
Nunca envía, borra ni crea nada.

Nunca imprime ni guarda datos personales (nombres, teléfonos, correos de
clientes). Solo hora, marca, canal y conteos.

Uso:
  python3 medicion/resend/empate_resend.py reconocer [--dias 3]
      Muestra cómo vienen hoy los avisos (remitentes, dominios de destino y
      las 3 primeras palabras del asunto) para armar reglas.json.

  python3 medicion/resend/empate_resend.py empate --desde 2026-11-01 [--hasta 2026-11-12]
      Cuenta leads únicos por día × marca × canal y escribe:
        medicion/resend/salida/leads-por-dia.csv   (conteos)
        medicion/resend/salida/leads-por-hora.csv  (un renglón por lead: hora, marca, canal)

  python3 medicion/resend/empate_resend.py registro --desde 2026-11-01 [--url https://.../api/leads-registro]
      RECOMENDADO. Lee la ruta de solo lectura que publica Rodolfo (sin datos
      personales, con su propio token) en lugar de entrar a Resend.

Resend no tiene claves de solo lectura. Para 'reconocer' y 'empate', la clave la pone el proxy de la sesión (secreto de red para
api.resend.com) o la variable de entorno RESEND_API_KEY.
"""
import argparse
import collections
import csv
import datetime as dt
import json
import os
import re
import ssl
import sys
import time
import urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
REGLAS = os.path.join(AQUI, 'reglas.json')
SALIDA = os.path.join(AQUI, 'salida')
API = 'https://api.resend.com/emails'
MX = dt.timezone(dt.timedelta(hours=-6))  # Ciudad de México, sin horario de verano desde 2022
VENTANA_MISMO_LEAD = 180  # segundos: mismo asunto dentro de 3 min = mismo lead

# Asunto con código: [KS·WA·KS-3107] o [KS·FORM] ...
CODIGO = re.compile(r'\[\s*(QL|KS|LS|GIRBAU|GAMESAIL)\s*[·\-|]\s*(WA|FORM|TEL|LLAMADA|BOT)\s*(?:[·\-|]\s*([A-Za-z0-9_\-]+))?\s*\]', re.I)
CANAL = {'WA': 'whatsapp', 'FORM': 'formulario', 'TEL': 'llamada', 'LLAMADA': 'llamada', 'BOT': 'chatbot'}


def contexto_ssl():
    for ruta in (os.environ.get('SSL_CERT_FILE'), '/root/.ccr/ca-bundle.crt'):
        if ruta and os.path.exists(ruta):
            return ssl.create_default_context(cafile=ruta)
    return ssl.create_default_context()


def pedir(url, ctx):
    clave = os.environ.get('RESEND_API_KEY') or 're_la_pone_el_proxy'
    req = urllib.request.Request(url, method='GET', headers={
        'Authorization': 'Bearer ' + clave,
        'User-Agent': 'conteo-leads/1.0',
        'Accept': 'application/json',
    })
    for intento in range(4):
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=60) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and intento < 3:
                time.sleep(2 ** (intento + 1))
                continue
            cuerpo = e.read().decode('utf-8', 'replace')[:300]
            sys.exit('Resend respondió %s: %s' % (e.code, cuerpo))
    sys.exit('Resend no respondió después de varios intentos.')


def fecha(s):
    s = str(s).strip().replace(' ', 'T', 1)
    s = re.sub(r'\+00$', '+00:00', s)
    s = re.sub(r'(\.\d{6})\d+', r'\1', s)
    if s.endswith('Z'):
        s = s[:-1] + '+00:00'
    d = dt.datetime.fromisoformat(s)
    if d.tzinfo is None:
        d = d.replace(tzinfo=dt.timezone.utc)
    return d.astimezone(MX)


def leer_envios(desde_mx, ctx, archivo=None):
    """Devuelve los envíos desde `desde_mx` (más nuevos primero)."""
    if archivo:  # para pruebas sin conexión
        with open(archivo) as f:
            datos = json.load(f)
        return [e for e in datos if fecha(e['created_at']) >= desde_mx]
    envios, cursor = [], None
    while True:
        url = API + '?limit=100' + ('&after=' + cursor if cursor else '')
        pag = pedir(url, ctx)
        datos = pag.get('data') or []
        for e in datos:
            if fecha(e['created_at']) < desde_mx:
                return envios
            envios.append(e)
        if not pag.get('has_more') or not datos:
            return envios
        cursor = datos[-1]['id']
        time.sleep(0.6)  # Resend permite ~2 consultas por segundo


def lista(v):
    if v is None:
        return []
    return v if isinstance(v, list) else [v]


def dominio(correo):
    m = re.search(r'@([\w.\-]+)', str(correo))
    return m.group(1).lower() if m else '?'


def enmascarar(correo):
    m = re.search(r'([\w.+\-]+)@([\w.\-]+)', str(correo))
    if not m:
        return '?'
    return m.group(1)[:3] + '…@' + m.group(2).lower()


def inicio_asunto(asunto):
    palabras = re.sub(r'[\w.+\-]+@[\w.\-]+|\+?\d[\d\s\-]{6,}', '#', str(asunto or '')).split()
    return ' '.join(palabras[:3])


def cargar_reglas():
    if not os.path.exists(REGLAS):
        return []
    with open(REGLAS) as f:
        return json.load(f).get('reglas', [])


def clasificar(e, reglas):
    """(marca, canal, folio, es_para_vendedor) o None si no es aviso de lead."""
    asunto = e.get('subject') or ''
    m = CODIGO.search(asunto)
    marca = canal = folio = None
    if m:
        marca, canal, folio = m.group(1).lower(), CANAL[m.group(2).upper()], m.group(3)
    campos = {
        'from': str(e.get('from') or '').lower(),
        'to': ' '.join(lista(e.get('to'))).lower(),
        'subject': asunto.lower(),
    }
    para_vendedor = None
    for r in reglas:
        if all(str(v).lower() in campos.get(k, '') for k, v in r.get('si', {}).items()):
            if r.get('ignorar'):
                return None
            marca = marca or r.get('marca')
            canal = canal or r.get('canal')
            if 'para_vendedor' in r and para_vendedor is None:
                para_vendedor = r['para_vendedor']
    if not marca or not canal:
        return None
    return marca, canal, folio, (True if para_vendedor is None else para_vendedor)


def reconocer(args, ctx):
    desde = dt.datetime.now(MX).replace(hour=0, minute=0, second=0, microsecond=0) - dt.timedelta(days=args.dias - 1)
    envios = leer_envios(desde, ctx, args.archivo)
    print('Envíos desde %s: %d\n' % (desde.date(), len(envios)))
    for titulo, clave in (('Remitente', lambda e: enmascarar(e.get('from'))),
                          ('Dominio de destino', lambda e: ', '.join(sorted({dominio(t) for t in lista(e.get('to'))}))),
                          ('Inicio del asunto', lambda e: inicio_asunto(e.get('subject'))),
                          ('Último estado', lambda e: e.get('last_event') or '?')):
        c = collections.Counter(clave(e) for e in envios)
        print('== %s ==' % titulo)
        for k, n in c.most_common(25):
            print('  %4d  %s' % (n, k))
        print()
    print('Con esto se llena reglas.json. No se guardó nada.')


def empate(args, ctx):
    desde = dt.datetime.fromisoformat(args.desde).replace(tzinfo=MX)
    hasta = (dt.datetime.fromisoformat(args.hasta).replace(tzinfo=MX) if args.hasta
             else dt.datetime.now(MX)).replace(hour=23, minute=59, second=59)
    reglas = cargar_reglas()
    if not reglas:
        print('AVISO: reglas.json está vacío; solo se cuentan asuntos con código [MARCA·CANAL].')
    envios = [e for e in leer_envios(desde, ctx, args.archivo) if fecha(e['created_at']) <= hasta]

    leads = {}          # llave de lead -> (hora, marca, canal, estado)
    sin_clasificar = 0
    for e in sorted(envios, key=lambda x: fecha(x['created_at'])):
        c = clasificar(e, reglas)
        if not c:
            sin_clasificar += 1
            continue
        marca, canal, folio, para_vendedor = c
        if not para_vendedor:
            continue
        h = fecha(e['created_at'])
        if folio:
            llave = (marca, folio)
        else:  # sin folio: mismo asunto en menos de 3 min = el mismo lead
            base = (marca, canal, (e.get('subject') or '').strip().lower())
            llave = None
            for k, v in leads.items():
                if k[:3] == base and 0 <= (h - v[0]).total_seconds() <= VENTANA_MISMO_LEAD:
                    llave = k
                    break
            llave = llave or base + (h.isoformat(),)
        if llave not in leads:
            leads[llave] = (h, marca, canal, e.get('last_event') or '?')

    os.makedirs(SALIDA, exist_ok=True)
    por_dia = collections.Counter((v[0].date().isoformat(), v[1], v[2]) for v in leads.values())
    no_llego = collections.Counter((v[0].date().isoformat(), v[1], v[2]) for v in leads.values()
                                   if v[3] in ('bounced', 'failed', 'complained'))
    with open(os.path.join(SALIDA, 'leads-por-dia.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['fecha', 'marca', 'canal', 'leads', 'aviso_no_entregado'])
        for k in sorted(por_dia):
            w.writerow(list(k) + [por_dia[k], no_llego.get(k, 0)])
    with open(os.path.join(SALIDA, 'leads-por-hora.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['fecha_hora_mx', 'marca', 'canal', 'estado_envio'])
        for v in sorted(leads.values()):
            w.writerow([v[0].strftime('%Y-%m-%d %H:%M'), v[1], v[2], v[3]])

    print('Leads únicos del %s al %s (hora de México): %d' % (desde.date(), hasta.date(), len(leads)))
    print('Envíos que no son aviso de lead o no se reconocieron: %d\n' % sin_clasificar)
    total = collections.Counter()
    for (d, m, c), n in por_dia.items():
        total[(m, c)] += n
    for (m, c), n in sorted(total.items()):
        print('  %-9s %-11s %4d' % (m, c, n))
    print('\nArchivos en medicion/resend/salida/ (solo números y horas, sin datos personales).')


def registro(args, ctx):
    """Lee la ruta de solo lectura de Rodolfo (CSV sin datos personales) y cuenta por día."""
    base = os.environ.get('LEADS_REGISTRO_URL') or args.url
    if not base and not args.archivo:
        sys.exit('Falta la dirección de la ruta: LEADS_REGISTRO_URL o --url.')
    if args.archivo:
        with open(args.archivo) as f:
            texto = f.read()
    else:
        url = '%s?desde=%s&hasta=%s' % (base, args.desde, args.hasta or dt.date.today().isoformat())
        req = urllib.request.Request(url, method='GET', headers={
            'Authorization': 'Bearer la_pone_el_proxy', 'User-Agent': 'conteo-leads/1.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=60) as r:
            texto = r.read().decode('utf-8')
    filas = list(csv.DictReader(texto.splitlines()))
    vistos, por_dia = set(), collections.Counter()
    for f in filas:
        llave = (f.get('marca'), f.get('lead_id') or f.get('fecha_hora'))
        if llave in vistos or f.get('canal') == 'chatbot':
            continue
        vistos.add(llave)
        por_dia[(f['fecha_hora'][:10], f['marca'], f['canal'], f.get('origen') or '?')] += 1
    os.makedirs(SALIDA, exist_ok=True)
    with open(os.path.join(SALIDA, 'leads-por-dia.csv'), 'w', newline='') as fh:
        w = csv.writer(fh)
        w.writerow(['fecha', 'marca', 'canal', 'origen', 'leads'])
        for k in sorted(por_dia):
            w.writerow(list(k) + [por_dia[k]])
    print('Leads únicos (sin chatbot): %d' % len(vistos))
    for k in sorted(por_dia):
        print('  %s  %-9s %-11s %-11s %3d' % (k + (por_dia[k],)))


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sp = p.add_subparsers(dest='modo', required=True)
    r = sp.add_parser('reconocer')
    r.add_argument('--dias', type=int, default=3)
    r.add_argument('--archivo', help=argparse.SUPPRESS)
    e = sp.add_parser('empate')
    e.add_argument('--desde', required=True)
    e.add_argument('--hasta')
    e.add_argument('--archivo', help=argparse.SUPPRESS)
    g = sp.add_parser('registro')
    g.add_argument('--desde', required=True)
    g.add_argument('--hasta')
    g.add_argument('--url')
    g.add_argument('--archivo', help=argparse.SUPPRESS)
    args = p.parse_args()
    ctx = contexto_ssl()
    {'reconocer': reconocer, 'empate': empate, 'registro': registro}[args.modo](args, ctx)


if __name__ == '__main__':
    main()
