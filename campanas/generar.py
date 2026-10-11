#!/usr/bin/env python3
"""Revisa plan.py y genera, por cuenta, el script de Google Ads que crea las campañas en pausa y su ficha.

    python3 campanas/generar.py

Sale con código 1 si hay errores (textos fuera de límite o negativas que bloquean palabras propias).
"""
import json
import os
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import CUENTAS  # noqa: E402

AQUI = os.path.dirname(os.path.abspath(__file__))
SALIDA = os.path.join(AQUI, 'salida')
PREFIJO = 'AB · '
DIAS_MES = 30.4
ARRANQUE = 0.5
TIPOS = {'EXACT': 'exacta', 'PHRASE': 'frase', 'BROAD': 'amplia'}
PROHIBIDOS = set('!@%^*()={};~`<>?\\|,')


def leer(s):
    s = s.strip()
    if s.startswith('[') and s.endswith(']'):
        return s[1:-1].strip(), 'EXACT'
    if s.startswith('"') and s.endswith('"'):
        return s[1:-1].strip(), 'PHRASE'
    return s, 'BROAD'


def escribir(texto, tipo):
    return {'EXACT': '[%s]', 'PHRASE': '"%s"', 'BROAD': '%s'}[tipo] % texto


def sin_acentos(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


def fichas(s):
    return s.lower().split()


def contiene(q, n):
    return any(q[i:i + len(n)] == n for i in range(len(q) - len(n) + 1))


def bloquea(neg, consulta):
    """¿La negativa bloquea la consulta? Las negativas no cubren variantes: comparación literal."""
    texto, tipo = neg
    q, n = fichas(consulta), fichas(texto)
    if tipo == 'EXACT':
        return q == n
    if tipo == 'PHRASE':
        return contiene(q, n)
    return set(n) <= set(q)


def variante(t):
    """Forma aproximada de una variante cercana: sin acentos y sin plural simple."""
    return [re.sub(r'(es|s)$', '', w) if len(w) > 4 else w for w in fichas(sin_acentos(t))]


def activa(kw, consulta):
    """¿La palabra clave positiva puede activarse con la consulta? Las positivas sí cubren variantes cercanas."""
    texto, tipo = kw
    q, k = variante(consulta), variante(texto)
    if tipo == 'EXACT':
        return q == k
    if tipo == 'PHRASE':
        return contiene(q, k)
    return set(k) <= set(q)


def ampliar(negs):
    """Agrega la versión sin acentos de cada negativa."""
    out, vistos = [], set()
    for texto, tipo in negs:
        for t in (texto, sin_acentos(texto)):
            if (t, tipo) not in vistos:
                vistos.add((t, tipo))
                out.append((t, tipo))
    return out


def preparar(slug, c):
    errores, avisos = [], []
    lista = ampliar([leer(n) for grupo in c['negativas'].values() for n in grupo])
    suma = sum(k['pct'] for k in c['campanas'])
    if suma != 100:
        errores.append('Los porcentajes suman %d, no 100' % suma)
    campanas = []
    vistas = {}
    for k in c['campanas']:
        negs = k.get('negativas', [])
        if negs == 'SERVICIO':
            negs = c['negativas_servicio']
        negs_plan = list(negs)
        negs = ampliar([leer(n) for n in negs])
        diario = c['mensual'] * k['pct'] / 100 / DIAS_MES
        camp = dict(nombre=PREFIJO + k['nombre'], corto=k['nombre'], pct=k['pct'], cpc=k['cpc'], origen=k['origen'],
                    diario=round(diario), arranque=max(1, round(diario * ARRANQUE)), negativas=negs,
                    negativas_plan=negs_plan, grupos=[])
        for g in k['grupos']:
            kws = [leer(x) for x in g['kw']]
            h = list(dict.fromkeys(g['h'] + c['comunes']))[:15]
            d = g['d'][:4]
            donde = '%s > %s' % (k['nombre'], g['nombre'])
            for t in h:
                if len(t) > 30:
                    errores.append('%s: título de %d caracteres: «%s»' % (donde, len(t), t))
                if '!' in t:
                    errores.append('%s: título con «!»: «%s»' % (donde, t))
            for t in d:
                if len(t) > 90:
                    errores.append('%s: descripción de %d caracteres: «%s»' % (donde, len(t), t))
            if len(h) < 3 or len(d) < 2:
                errores.append('%s: el anuncio necesita al menos 3 títulos y 2 descripciones' % donde)
            if len(h) < 8:
                avisos.append('%s: solo %d títulos; Google recomienda 8 o más' % (donde, len(h)))
            for p in g['p']:
                if len(p) > 15:
                    errores.append('%s: ruta «%s» de más de 15 caracteres' % (donde, p))
            for texto, tipo in kws:
                if len(texto) > 80 or len(texto.split()) > 10 or PROHIBIDOS & set(texto):
                    errores.append('%s: palabra clave no válida «%s»' % (donde, texto))
                for consulta in {texto, sin_acentos(texto)}:
                    for n in lista + negs:
                        if bloquea(n, consulta):
                            origen = 'de la campaña' if n in negs else 'de la cuenta'
                            errores.append('%s: la negativa %s %s bloquea su propia palabra clave %s'
                                           % (donde, origen, escribir(*n), escribir(texto, tipo)))
                clave = (texto.lower(), tipo)
                if clave in vistas:
                    avisos.append('«%s» está en dos grupos: %s y %s' % (escribir(texto, tipo), vistas[clave], donde))
                vistas[clave] = donde
            camp['grupos'].append(dict(nombre=g['nombre'], kw=kws, h=h, d=d, p=list(g['p'])))
        campanas.append(camp)
    return dict(slug=slug, c=c, lista=lista, campanas=campanas, errores=errores, avisos=avisos)


def cruces(todas):
    """Palabras clave de una cuenta que otra cuenta también puede activar sin tenerlas bloqueadas."""
    filas = []
    for a in todas:
        for ca in a['campanas']:
            for ga in ca['grupos']:
                for texto, tipo in ga['kw']:
                    for b in todas:
                        if b is a:
                            continue
                        for cb in b['campanas']:
                            negs = b['lista'] + cb['negativas']
                            if any(bloquea(n, q) for n in negs for q in {texto, sin_acentos(texto)}):
                                continue
                            for gb in cb['grupos']:
                                for kb in gb['kw']:
                                    if activa(kb, texto):
                                        filas.append((a['c']['nombre'], escribir(texto, tipo), b['c']['nombre'],
                                                      '%s > %s' % (cb['corto'], gb['nombre']), escribir(*kb)))
    return filas


def js(p):
    c = p['c']
    plan = dict(
        cuenta=c['id'], nombre=c['nombre'], url=c['url'],
        lista=dict(nombre=PREFIJO + 'Negativas de la cuenta', kw=p['lista']),
        campanas=[dict(nombre=k['nombre'], diario=k['arranque'], cpc=k['cpc'], negativas=k['negativas'],
                       grupos=[dict(nombre=g['nombre'], kw=g['kw'], h=g['h'], d=g['d'], p=g['p']) for g in k['grupos']])
                  for k in p['campanas']])
    datos = json.dumps(plan, ensure_ascii=False)
    with open(os.path.join(AQUI, 'plantilla-script.js'), encoding='utf-8') as f:
        plantilla = f.read()
    return (plantilla.replace('{{NOMBRE}}', c['nombre']).replace('{{ID}}', c['id'])
            .replace('{{PENDIENTE}}', 'true' if 'PENDIENTE' in c['url'] else 'false')
            .replace('{{PLAN}}', datos))


def pesos(n):
    return '${:,.0f}'.format(n)


def ficha(p):
    c = p['c']
    o = ['# %s · campañas de arranque' % c['nombre'], '',
         'Cuenta %s · presupuesto mensual %s · %s' % (c['id'], pesos(c['mensual']), c['nota']), '',
         '**Página de destino:** %s%s' % (c['url'], ' — por confirmar antes de ejecutar' if c.get('url_confirmar') else ''),
         '', '**Configuración de todas las campañas:**', '',
         '- Red de Búsqueda solamente: sin socios de búsqueda ni Display.',
         '- México, solo personas que están en la zona (no "interesadas").',
         '- Idioma: español.',
         '- Puja: maximizar clics con tope de costo por clic.',
         '- Se crean **en pausa** y con el presupuesto de arranque (50%).', '',
         '## Presupuesto', '',
         '| Campaña | % | Diario completo | Diario de arranque | Mensual completo | Tope CPC | De dónde sale |',
         '|---|---:|---:|---:|---:|---:|---|']
    for k in p['campanas']:
        o.append('| %s | %d%% | %s | %s | %s | %s | %s |' % (k['corto'], k['pct'], pesos(k['diario']), pesos(k['arranque']),
                                                          pesos(k['diario'] * DIAS_MES), pesos(k['cpc']), k['origen']))
    o.append('| **Total** | 100%% | %s | %s | %s | | |' % (
        pesos(sum(k['diario'] for k in p['campanas'])), pesos(sum(k['arranque'] for k in p['campanas'])), pesos(c['mensual'])))
    o += ['', '## Campañas, palabras clave y anuncios', '']
    for k in p['campanas']:
        o.append('### %s' % k['nombre'])
        if k['negativas']:
            o.append('')
            o.append('Negativas de la campaña: ' + ', '.join(k['negativas_plan']))
        for g in k['grupos']:
            o += ['', '**%s**' % g['nombre'], '',
                  'Palabras clave: ' + ' · '.join(escribir(*kw) for kw in g['kw']), '',
                  'Títulos: ' + ' | '.join(g['h']), '',
                  'Descripciones:', ''] + ['- ' + d for d in g['d']] + ['', 'Ruta: /%s/%s' % tuple(g['p'])]
        o.append('')
    o += ['## Lista de negativas de la cuenta', '',
          'Se carga como una lista compartida, «%sNegativas de la cuenta», ligada a todas las campañas nuevas. '
          'El script agrega solo la versión sin acentos de cada una.' % PREFIJO, '']
    for motivo, negs in c['negativas'].items():
        o.append('- **%s:** %s' % (motivo, ', '.join(negs)))
    o += ['', '## Lo que sale del plan anterior', ''] + ['- ' + s for s in c['salen']]
    if c['cambios_actuales']:
        o += ['', '## Cambios en las campañas actuales (cada uno requiere tu OK)', ''] + ['- ' + s for s in c['cambios_actuales']]
    if p['avisos']:
        o += ['', '## Avisos del generador', ''] + ['- ' + s for s in p['avisos']]
    return '\n'.join(o) + '\n'


def main():
    todas = [preparar(slug, c) for slug, c in CUENTAS.items()]
    os.makedirs(SALIDA, exist_ok=True)
    hay_error = False
    for p in todas:
        carpeta = os.path.join(SALIDA, p['slug'])
        os.makedirs(carpeta, exist_ok=True)
        with open(os.path.join(carpeta, 'crear-campanas.js'), 'w', encoding='utf-8') as f:
            f.write(js(p))
        with open(os.path.join(carpeta, 'ficha.md'), 'w', encoding='utf-8') as f:
            f.write(ficha(p))
        for e in p['errores']:
            print('ERROR', p['c']['nombre'], '·', e)
            hay_error = True
        for a in p['avisos']:
            print('aviso', p['c']['nombre'], '·', a)
    filas = cruces(todas)
    o = ['# Cruces entre cuentas que quedan', '',
         'Palabras clave de una cuenta que otra cuenta del grupo también puede activar, porque no las tiene bloqueadas. '
         'Es una aproximación: compara el texto de la palabra clave como si fuera la búsqueda.', '',
         '| Cuenta | Palabra clave | También la puede activar | Campaña > grupo | Con |', '|---|---|---|---|---|']
    o += ['| %s | %s | %s | %s | %s |' % f for f in filas] or ['| — | Ninguno | | | |']
    with open(os.path.join(SALIDA, 'cruces.md'), 'w', encoding='utf-8') as f:
        f.write('\n'.join(o) + '\n')
    print('%d cruces entre cuentas (ver salida/cruces.md)' % len(filas))
    for f in filas:
        print('  cruce', ' | '.join(f))
    total = sum(len(g['kw']) for p in todas for k in p['campanas'] for g in k['grupos'])
    print('%d cuentas, %d campañas, %d palabras clave' % (len(todas), sum(len(p['campanas']) for p in todas), total))
    sys.exit(1 if hay_error else 0)


if __name__ == '__main__':
    main()
