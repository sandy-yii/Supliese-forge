#!/usr/bin/env python3
"""Revisa plan.py y genera, por cuenta, el script de Google Ads que crea las campañas en pausa y su ficha.

    python3 campanas/generar.py

Sale con código 1 si hay errores (textos fuera de límite o negativas que bloquean palabras propias).
"""
import copy
import json
import os
import shutil
import re
import sys
import unicodedata

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from plan import CUENTAS, HORARIO_LLAMADAS  # noqa: E402

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


BASURA = {'Doméstico', 'Marcas que no se venden aquí', 'Lavado por encargo, no venta', 'Usado y renta',
          'Información, no compra', 'Lavado de autos', 'Lavado de autos (junta)', 'Cadenas de lavandería',
          'Aprender a reparar', 'Empleo', 'Otras marcas', 'Girbau de otro país (filial de EE. UU.)'}


def numero(c):
    """Número de la cuenta para los scripts; vacío si es una cuenta nueva que todavía no tiene número."""
    return c['id'] if re.match(r'^\d{3}-\d{3}-\d{4}$', c['id']) else ''


def plantilla(nombre, c, plan):
    with open(os.path.join(AQUI, nombre), encoding='utf-8') as f:
        texto = f.read()
    return (texto.replace('{{NOMBRE}}', c['nombre']).replace('{{ID}}', c['id'])
            .replace('{{PLAN}}', json.dumps(plan, ensure_ascii=False)))


def js_activar(p):
    c = p['c']
    act = c.get('activacion', {})
    basura = ampliar([leer(n) for k, grupo in c['negativas'].items() if k in BASURA for n in grupo])
    plan = dict(cuenta=numero(c), anterior=c.get('id_anterior', ''), nombre=c['nombre'], url=c['url'], prefijo=PREFIJO,
                mismo_sitio=c.get('mismo_sitio', []),
                campanas=[dict(nombre=k['nombre'], arranque=k['arranque'], completo=k['diario']) for k in p['campanas']],
                anteriores=act.get('anteriores', 'MITAD'), pausar_palabras=act.get('pausar_palabras', []),
                pausar_nombres=act.get('pausar_nombres', []),
                basura=dict(nombre='PB · Negativas basura', kw=basura))
    return plantilla('plantilla-activar.js', c, plan)


def js_conversiones(p):
    c = p['c']
    return plantilla('plantilla-conversiones.js', c, dict(cuenta=numero(c), anterior=c.get('id_anterior', ''),
                                                          nombre=c['nombre'], url=c['url']))


def plan_auditoria(p):
    c = p['c']
    act = c.get('activacion', {})
    return dict(cuenta=numero(c), anterior=c.get('id_anterior', ''), nombre=c['nombre'], url=c['url'], prefijo=PREFIJO,
                mensual=c['mensual'], subir=c.get('subir', True), subir_porque=c.get('subir_porque', ''),
                fijos=list(c.get('ajustes', {}).get('presupuesto', {}).keys()),
                lista=PREFIJO + 'Negativas de la cuenta', anteriores=act.get('anteriores', 'MITAD'),
                campanas=[dict(nombre=k['nombre'], arranque=k['arranque'], completo=k['diario'], cpc=k['cpc']) for k in p['campanas']])


def js_auditoria(planes, nombre='las cinco cuentas'):
    with open(os.path.join(AQUI, 'plantilla-auditoria.js'), encoding='utf-8') as f:
        texto = f.read()
    return texto.replace('{{NOMBRE}}', nombre).replace('{{PLANES}}', json.dumps(planes, ensure_ascii=False))


def js_corregir(planes, nombre='las cinco cuentas'):
    with open(os.path.join(AQUI, 'plantilla-corregir.js'), encoding='utf-8') as f:
        texto = f.read()
    return texto.replace('{{NOMBRE}}', nombre).replace('{{PLANES}}', json.dumps(planes, ensure_ascii=False))


def js_diagnostico(planes, nombre='las cinco cuentas', archivo='plantilla-diagnostico.js'):
    with open(os.path.join(AQUI, archivo), encoding='utf-8') as f:
        texto = f.read()
    return texto.replace('{{NOMBRE}}', nombre).replace('{{PLANES}}', json.dumps(planes, ensure_ascii=False))


def js_todo_en_uno(pasos):
    """Junta varios scripts en uno: cada uno corre dentro de su propia función, en orden, y si uno falla se detiene."""
    o = ['/**',
         ' * Atelback · Todo en uno — las cinco cuentas',
         ' * Generado por campanas/generar.py a partir de campanas/plan.py. No se edita a mano: se cambia el plan y se regenera.',
         ' *',
         ' * QUÉ HACE (sirve en cualquiera de las cuentas del plan: reconoce sola en cuál está): corre, en este orden, los',
         ' * mismos pasos que los scripts sueltos:',
         ] + [' *   %d. %s' % (i, n.capitalize()) for i, (n, _) in enumerate(pasos, 1)] + [
         ' * Primero las exclusiones, para que el presupuesto que sube no se vaya en búsquedas que no sirven.',
         ' * Si un paso falla, se detiene ahí y no corre los siguientes.',
         ' *',
         ' * CÓMO SE USA: pegar completo > Autorizar > VISTA PREVIA > revisar el registro (cada paso dice qué haría) > EJECUTAR.',
         ' * En la vista previa cada paso ve la cuenta como está hoy; al ejecutar, cada uno ve lo que dejó el anterior.',
         ' */', '']
    for i, (nombre, texto) in enumerate(pasos, 1):
        o += ['function paso%d() {' % i, texto, '  main();', '}', '']
    o += ['function main() {']
    for i, (nombre, _) in enumerate(pasos, 1):
        o += ["  Logger.log('');",
              "  Logger.log('########## PASO %d DE %d · %s ##########');" % (i, len(pasos), nombre),
              '  try { paso%d(); } catch (e) {' % i,
              "    Logger.log('ERROR en el paso %d: ' + e.message + '. Se detiene aquí: los pasos siguientes no se corrieron.');" % i,
              '    return;', '  }']
    o += ["  Logger.log('');", "  Logger.log('LISTO: se corrieron los %d pasos. Copia todo el registro y mándalo.');" % len(pasos), '}', '']
    return '\n'.join(o)


def plan_palabras(p, nuevos=(), quitar=()):
    """nuevos: nombres de grupos que pueden no existir todavía; esos llevan su anuncio para crearlos."""
    c = p['c']
    def grupo(g):
        d = dict(nombre=g['nombre'], kw=g['kw'])
        if g['nombre'] in nuevos:
            d.update(h=g['h'], d=g['d'], p=g['p'])
        return d
    return dict(cuenta=numero(c), nombre=c['nombre'], url=c['url'], quitar=list(quitar),
                lista=dict(nombre=PREFIJO + 'Negativas de la cuenta', kw=p['lista']),
                campanas=[dict(nombre=k['nombre'], grupos=[grupo(g) for g in k['grupos']]) for k in p['campanas']])


def preparado(slug, c):
    """Versión de la cuenta con su cambio «preparado» (aún no decidido): grupos nuevos y exclusiones que se quitan."""
    pre = c['preparado']
    c2 = copy.deepcopy(c)
    for k in c2['campanas']:
        k['grupos'] += copy.deepcopy(pre.get('grupos', {}).get(k['nombre'], []))
    quitar = []
    for nombre in pre.get('quitar_negativas', []):
        quitar += ampliar([leer(n) for n in c2['negativas'].pop(nombre)])
    return preparar(slug, c2), [g['nombre'] for gs in pre.get('grupos', {}).values() for g in gs], quitar


def plan_llamadas(p):
    c = p['c']
    return dict(cuenta=numero(c), nombre=c['nombre'], prefijo=PREFIJO, telefono=c['telefono'], horario=HORARIO_LLAMADAS)


def plan_ajustes(p):
    c = p['c']
    return dict(cuenta=numero(c), nombre=c['nombre'], prefijo=PREFIJO, ajustes=c.get('ajustes', {}))


def js_pagina(p):
    c = p['c']
    return plantilla('plantilla-pagina.js', c, dict(cuenta=numero(c), anterior=c.get('id_anterior', ''),
                                                    nombre=c['nombre'], url=c['url'], prefijo=PREFIJO,
                                                    mismo_sitio=c.get('mismo_sitio', [])))


def js(p):
    c = p['c']
    plan = dict(
        cuenta=numero(c), anterior=c.get('id_anterior', ''), nombre=c['nombre'], url=c['url'], ubicacion_de=c.get('ubicacion_de'),
        lista=dict(nombre=PREFIJO + 'Negativas de la cuenta', kw=p['lista']),
        campanas=[dict(nombre=k['nombre'], diario=k['arranque'], cpc=k['cpc'], negativas=k['negativas'],
                       grupos=[dict(nombre=g['nombre'], kw=g['kw'], h=g['h'], d=g['d'], p=g['p']) for g in k['grupos']])
                  for k in p['campanas']])
    datos = json.dumps(plan, ensure_ascii=False)
    with open(os.path.join(AQUI, 'plantilla-script.js'), encoding='utf-8') as f:
        plantilla = f.read()
    return (plantilla.replace('{{NOMBRE}}', c['nombre']).replace('{{ID}}', c['id'])
            .replace('{{COPIAR_URL}}', 'true' if c['url'] == 'COPIAR_DE_ANUNCIOS' else 'false')
            .replace('{{PLAN}}', datos))


def pesos(n):
    return '${:,.0f}'.format(n)


def ficha(p):
    c = p['c']
    o = ['# %s · campañas de arranque' % c['nombre'], '',
         'Cuenta %s · presupuesto mensual %s · %s' % (c['id'], pesos(c['mensual']), c['nota']), '',
         '**Página de destino:** %s' % ('se copia de los anuncios actuales de la cuenta (la más usada); '
                                        'el registro de la vista previa dice cuál es' if c['url'] == 'COPIAR_DE_ANUNCIOS' else c['url']),
         '', '**Configuración de todas las campañas:**', '',
         '- Red de Búsqueda solamente: sin socios de búsqueda ni Display.',
         '- %s, solo personas que están en la zona (no "interesadas").' % (
             'Las mismas ubicaciones que la campaña actual «%s» (el registro de la vista previa dice cuáles son)' % c['ubicacion_de']
             if c.get('ubicacion_de') else 'México'),
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


INICIO = '2026-12-31'


def prompt(p, expres=False):
    """Instrucciones para la extensión Claude in Chrome: crear las campañas a mano en la interfaz de Google Ads.

    Se entregan en partes (reglas y lista de negativas, y luego una campaña por parte), porque un texto largo
    se corta al pegarlo en la extensión.

    Con expres=True es el plan B: solo la campaña con más presupuesto de la cuenta, y sale habilitada hoy."""
    c = p['c']
    campanas = [max(p['campanas'], key=lambda k: k['pct'])] if expres else p['campanas']
    if expres:
        estado, fecha = 'Habilitada', 'hoy (la que trae por defecto), sin fecha de fin'
    else:
        estado, fecha = 'En pausa', INICIO
    copiar = c['url'] == 'COPIAR_DE_ANUNCIOS'
    url = 'LA PÁGINA DE DESTINO QUE ANOTASTE EN EL PASO 0' if copiar else c['url']
    zona = c.get('ubicacion_de')
    o = ['PLAN B EXPRÉS: esta campaña sale ACTIVA HOY. Úsalo solo si ya diste el OK para activar esta cuenta.', ''] if expres else []
    o += ['Vas a crear campañas nuevas de Búsqueda en Google Ads, en la cuenta %s (%s). Trabaja en una pestaña nueva.' % (c['nombre'], c['id']),
         '',
         'REGLAS (no negociables):',
         '- Hazlo todo a mano en la interfaz de Google Ads, clic por clic. No uses Scripts, Google Ads Editor, cargas masivas ni hojas de cálculo: la cuenta no puede autorizar scripts.',
         '- No modifiques, pauses, actives, borres ni edites absolutamente nada de lo que ya existe en la cuenta: campañas, anuncios, palabras clave, presupuestos, listas, configuración ni facturación. Solo puedes CREAR lo que está en estas instrucciones.',
         ('- Antes de empezar, confirma que el número de cuenta arriba a la derecha sea %s. Si no lo es, detente y pregúntame.' % c['id']
          if numero(c) else
          '- Es una cuenta nueva: antes de empezar, dime el número de cuenta que ves arriba a la derecha y espera mi OK.%s'
          % (' Si es %s (la cuenta anterior), detente.' % c['id_anterior'] if c.get('id_anterior') else '')),
         ('- La campaña nueva SÍ sale hoy: deja la fecha de inicio de hoy y, al publicarla, déjala "Habilitada". No actives nada más.'
          if expres else
          '- Ninguna campaña nueva debe quedar activa. En cada una pon como fecha de inicio el %s y, en cuanto la publiques, cámbiala a "En pausa".' % INICIO),
         '- Si Google ofrece crear recursos automáticamente, AI Max, expansión de URL final, concordancia amplia en toda la campaña, recomendaciones o "aplicar sugerencias": recházalo o déjalo apagado.',
         '- Si algo te pide confirmar un cambio distinto a crear lo de estas instrucciones, o aparece un error que no entiendes, detente y pregúntame.',
         '- Si ya existe una lista o una campaña con el mismo nombre (de un intento anterior o como borrador), no la dupliques. Si es la lista, ábrela y agrega solo las palabras que le falten. Si es una campaña o un borrador, detente y dime qué encontraste.',
         '- Copia los textos exactamente como están, con acentos. No inventes ni cambies títulos, descripciones ni palabras clave.',
         '- Las palabras clave se pegan tal cual, una por línea: [texto] es concordancia exacta y "texto" es concordancia de frase.',
         '']
    if copiar:
        o += ['PASO 0 · Página de destino (solo leer):',
              'Ve a Campañas > Anuncios, mira la columna o el detalle de "URL final" de los anuncios actuales y anota la que más se repite. No edites ningún anuncio. Dime cuál anotaste y úsala en todos los anuncios nuevos.', '']
    if zona:
        o += ['PASO 0 · Ubicaciones (solo leer):',
              'Abre la campaña actual "%s" > Configuración > Ubicaciones y anota las ubicaciones incluidas y excluidas. No edites nada. Dime cuáles anotaste y usa exactamente las mismas en todas las campañas nuevas.' % zona, '']
    o += ['PASO 1 · Lista de palabras clave negativas:',
          'Herramientas > Biblioteca compartida > Listas de exclusión (o "Listas de palabras clave negativas") > "+". Nombre: "%sNegativas de la cuenta". Pega estas palabras, una por línea:' % PREFIJO,
          ''] + [escribir(*n) for n in p['lista']] + ['',
          'PASO 2 · Crear cada campaña. Para cada una:',
          '- Nueva campaña > "Crear una campaña sin la orientación de un objetivo" > Búsqueda.',
          '- Nombre: el que se indica abajo.',
          '- Redes: quita "Red de Búsqueda de socios" y "Red de Display".',
          '- Ubicaciones: %s. En "Opciones de ubicación", elige "Presencia: personas que están o que suelen estar en tus ubicaciones incluidas" (no "Presencia o interés").' % ('las que anotaste en el PASO 0' if zona else 'México'),
          '- Idioma: solo español (si aparece inglés u otro, quítalo).',
          '- Fechas: inicio %s.' % fecha,
          '- Presupuesto diario y puja: el que se indica. Puja: "Clics" (maximizar clics) con "Límite máximo de oferta de CPC".',
          '- Grupos de anuncios: crea los que se indican, cada uno con sus palabras clave y un anuncio adaptable de búsqueda con sus títulos, descripciones y rutas. URL final: %s' % url,
          '- Al terminar, publica, deja la campaña "%s" y en Palabras clave' % estado + ' > Palabras clave negativas: agrega la lista "%sNegativas de la cuenta" y, si se indican, las negativas propias de la campaña.' % PREFIJO,
          '',
          'En esta parte haz solo %sel PASO 1. NO crees campañas todavía: %s '
          'Cuando termines, dime qué hiciste y espera la Parte 2.' % (
              'el PASO 0 y ' if (copiar or zona) else '',
              'te mando la campaña en la Parte 2.' if len(campanas) == 1 else
              'te mando cada campaña en un mensaje aparte (Parte 2 a Parte %d).' % (len(campanas) + 1))]
    partes = ['\n'.join(o) + '\n']
    for i, k in enumerate(campanas, 1):
        o = ['PARTE %d de %d · cuenta %s (%s)' % (i + 1, len(campanas) + 1, c['nombre'], c['id']),
             'Mismas reglas de la Parte 1: hazlo a mano, no toques nada existente, fecha de inicio %s, "%s" al publicarla, '
             'y la configuración del PASO 2 (solo Búsqueda, %s con "Presencia", solo español, maximizar clics con límite de CPC, lista "%sNegativas de la cuenta").'
             % (fecha, estado, 'las ubicaciones del PASO 0' if zona else 'México', PREFIJO),
             '',
             'CAMPAÑA %d de %d: %s' % (i, len(campanas), k['nombre']),
              'Presupuesto diario: $%d MXN · Límite de CPC: $%d MXN' % (k['arranque'], k['cpc'])]
        if k['negativas']:
            o += ['Negativas propias de esta campaña (además de la lista):'] + [escribir(*n) for n in k['negativas']]
        for g in k['grupos']:
            o += ['', '  Grupo de anuncios: %s' % g['nombre'], '  Palabras clave:'] + ['  ' + escribir(*kw) for kw in g['kw']]
            o += ['  Anuncio adaptable de búsqueda:', '  URL final: %s' % url, '  Ruta: %s / %s' % tuple(g['p']), '  Títulos:']
            o += ['  - ' + h for h in g['h']] + ['  Descripciones:'] + ['  - ' + d for d in g['d']]
        o += ['', 'AL TERMINAR ESTA CAMPAÑA: dime su estado (debe decir "%s"), su presupuesto, cuántos grupos, palabras clave y anuncios '
                  'tiene, y si algún anuncio o palabra clave quedó "Rechazado" o "Limitado" y por qué. No actives nada más.' % estado]
        if i < len(campanas):
            o.append('Luego espera la Parte %d.' % (i + 2))
        else:
            o.append('Es la última parte: dame también la lista de todas las campañas que creaste en esta cuenta, con su estado.')
        partes.append('\n'.join(o) + '\n')
    return partes


def main():
    todas = []
    for slug, c in CUENTAS.items():
        # Un cambio preparado que ya se aplicó en la cuenta pasa a ser parte del plan de todos los días
        todas.append(preparado(slug, c)[0] if c.get('preparado', {}).get('aplicado') else preparar(slug, c))
    os.makedirs(SALIDA, exist_ok=True)
    hay_error = False
    for p in todas:
        carpeta = os.path.join(SALIDA, p['slug'])
        os.makedirs(carpeta, exist_ok=True)
        with open(os.path.join(carpeta, 'crear-campanas.js'), 'w', encoding='utf-8') as f:
            f.write(js(p))
        with open(os.path.join(carpeta, 'conversiones.js'), 'w', encoding='utf-8') as f:
            f.write(js_conversiones(p))
        with open(os.path.join(carpeta, 'activar.js'), 'w', encoding='utf-8') as f:
            f.write(js_activar(p))
        with open(os.path.join(carpeta, 'cambiar-pagina.js'), 'w', encoding='utf-8') as f:
            f.write(js_pagina(p))
        with open(os.path.join(carpeta, 'auditoria.js'), 'w', encoding='utf-8') as f:
            f.write(js_auditoria([plan_auditoria(p)], p['c']['nombre']))
        with open(os.path.join(carpeta, 'corregir.js'), 'w', encoding='utf-8') as f:
            f.write(js_corregir([plan_auditoria(p)], p['c']['nombre']))
        with open(os.path.join(carpeta, 'ficha.md'), 'w', encoding='utf-8') as f:
            f.write(ficha(p))
        viejo = os.path.join(carpeta, 'prompt-extension.txt')
        if os.path.exists(viejo):
            os.remove(viejo)
        carpeta_prompt = os.path.join(carpeta, 'prompt-extension')
        shutil.rmtree(carpeta_prompt, ignore_errors=True)
        os.makedirs(carpeta_prompt)
        partes = prompt(p)
        for i, texto in enumerate(partes, 1):
            with open(os.path.join(carpeta_prompt, 'parte-%d-de-%d.txt' % (i, len(partes))), 'w', encoding='utf-8') as f:
                f.write(texto)
        carpeta_expres = os.path.join(carpeta, 'plan-b-expres')
        shutil.rmtree(carpeta_expres, ignore_errors=True)
        os.makedirs(carpeta_expres)
        for i, texto in enumerate(prompt(p, expres=True), 1):
            with open(os.path.join(carpeta_expres, 'parte-%d-de-2.txt' % i), 'w', encoding='utf-8') as f:
                f.write(texto)
        for e in p['errores']:
            print('ERROR', p['c']['nombre'], '·', e)
            hay_error = True
        for a in p['avisos']:
            print('aviso', p['c']['nombre'], '·', a)
    with open(os.path.join(SALIDA, 'auditoria-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_auditoria([plan_auditoria(p) for p in todas]))
    with open(os.path.join(SALIDA, 'corregir-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_corregir([plan_auditoria(p) for p in todas]))
    with open(os.path.join(SALIDA, 'diagnostico-sin-clics-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas]))
    with open(os.path.join(SALIDA, 'mas-leads-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-mas-leads.js'))
    with open(os.path.join(SALIDA, 'palabras-nuevas-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_palabras(p) for p in todas], archivo='plantilla-palabras.js'))
    with open(os.path.join(SALIDA, 'numeros-junta-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-informe.js'))
    with open(os.path.join(SALIDA, 'revision-diaria-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-diaria.js'))
    with open(os.path.join(SALIDA, 'pulso-de-hoy-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-pulso.js'))
    with open(os.path.join(SALIDA, 'etiquetas-para-rodolfo-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-etiquetas.js'))
    with open(os.path.join(SALIDA, 'ajustes-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_ajustes(p) for p in todas], archivo='plantilla-ajustes.js'))
    with open(os.path.join(SALIDA, 'subir-presupuesto-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-subir.js'))
    pasos = [('EXCLUSIONES Y PALABRAS CLAVE', js_diagnostico([plan_palabras(p) for p in todas], archivo='plantilla-palabras.js')),
             ('AJUSTES', js_diagnostico([plan_ajustes(p) for p in todas], archivo='plantilla-ajustes.js')),
             ('TOPES DE COSTO POR CLIC', js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-mas-leads.js')),
             ('SUBIR PRESUPUESTO', js_diagnostico([plan_auditoria(p) for p in todas], archivo='plantilla-subir.js'))]
    with open(os.path.join(SALIDA, 'todo-en-uno-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_todo_en_uno(pasos))
    with open(os.path.join(SALIDA, 'boton-llamada-todas-las-cuentas.js'), 'w', encoding='utf-8') as f:
        f.write(js_diagnostico([plan_llamadas(p) for p in todas], archivo='plantilla-llamadas.js'))
    for i, p in enumerate(todas):
        if 'preparado' not in p['c'] or p['c']['preparado'].get('aplicado'):
            continue
        pv, nuevos, quitar = preparado(p['slug'], p['c'])
        for e in pv['errores']:
            print('ERROR preparado', p['c']['nombre'], '·', e)
            hay_error = True
        otras = todas[:i] + [pv] + todas[i + 1:]
        print('preparado %s: %d cruces si se aplica' % (p['c']['nombre'], len(cruces(otras))))
        with open(os.path.join(SALIDA, p['slug'], 'preparado-' + p['c']['preparado']['archivo'] + '.js'), 'w', encoding='utf-8') as f:
            f.write(js_diagnostico([plan_palabras(pv, nuevos, quitar)], nombre=p['c']['nombre'] + ' · ' + p['c']['preparado']['titulo'],
                                   archivo='plantilla-palabras.js'))
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
