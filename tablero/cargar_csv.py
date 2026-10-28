"""Carga al tablero lo que entrega la extensión de Chrome (tablero/prompt-extension-datos.txt) y regenera las páginas.

    python3 tablero/cargar_csv.py archivo [archivo ...] [--cuenta 256-397-2201]

Acepta dos cosas:
  - El CSV que descarga Google Ads de la vista de Campañas segmentada por día (o por semana), en español o en inglés.
  - El reporte de la extensión con bloques «TABLERO-CSV cuenta=...» (por semana).
Los datos por semana se reparten parejo entre sus 7 días. La cuenta se toma del bloque, de --cuenta, del nombre
del archivo o, si no, de los nombres de las campañas «AB ·» del plan.
"""
import csv
import io
import json
import os
import re
import subprocess
import sys
import unicodedata
from datetime import date, timedelta

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(AQUI, 'datos.json')
sys.path.insert(0, os.path.join(AQUI, '..', 'campanas'))
import plan  # noqa: E402

PREFIJO = 'AB · '
MESES = {'ene': 1, 'jan': 1, 'feb': 2, 'mar': 3, 'abr': 4, 'apr': 4, 'may': 5, 'jun': 6, 'jul': 7, 'ago': 8, 'aug': 8,
         'sep': 9, 'set': 9, 'oct': 10, 'nov': 11, 'dic': 12, 'dec': 12}
CUENTA = re.compile(r'\d{3}-\d{3}-\d{4}')


def llano(t):
    t = unicodedata.normalize('NFD', str(t).lower())
    return re.sub(r'\s+', ' ', ''.join(c for c in t if unicodedata.category(c) != 'Mn')).strip()


# Columna → posibles encabezados (sin acentos, en minúsculas; basta con que el encabezado empiece así).
COLUMNAS = {
    'dia': ['dia', 'day', 'fecha', 'date'],
    'semana': ['semana', 'week'],
    'campana': ['campana', 'campaign'],
    'imp': ['impr', 'impresiones', 'impressions'],
    'clics': ['clics', 'clicks'],
    'costo': ['costo', 'cost'],
    'conv': ['conversiones', 'conversions', 'conv.'],
    'llam': ['llamadas telefonicas', 'llamadas', 'phone calls'],
    'perdP': ['cuota de impr. de busqueda perdida (presupuesto)', 'cuota de impresiones de busqueda perdida (presupuesto)',
              'search lost is (budget)', 'perdidapresupuesto'],
    'perdR': ['cuota de impr. de busqueda perdida (ranking)', 'cuota de impresiones de busqueda perdida (ranking)',
              'cuota de impr. de busqueda perdida (clasificacion)', 'search lost is (rank)', 'perdidaranking'],
    'cuota': ['cuota de impr. de busqueda', 'cuota de impresiones de busqueda', 'search impr. share', 'cuota'],
}


def mapear(encabezados):
    m = {}
    hs = [llano(x) for x in encabezados]
    for clave in ['perdP', 'perdR', 'llam', 'semana', 'dia', 'campana', 'imp', 'clics', 'costo', 'conv', 'cuota']:
        for i, x in enumerate(hs):
            if i in m.values():
                continue
            if any(x == p or (x.startswith(p) and clave not in ('conv', 'costo', 'cuota')) for p in COLUMNAS[clave]):
                m[clave] = i
                break
    return m


def numero(x):
    x = str(x or '').strip().replace('MXN', '').replace('$', '').replace(' ', '').replace(' ', '')
    if x in ('', '--', '-', '—'):
        return 0.0
    if ',' in x and '.' in x:
        x = x.replace(',', '') if x.rfind('.') > x.rfind(',') else x.replace('.', '').replace(',', '.')
    elif ',' in x:
        x = x.replace(',', '.') if re.fullmatch(r'\d+,\d{1,2}', x) else x.replace(',', '')
    return float(x)


def cuota(x):
    x = str(x or '').strip().replace(' ', '')
    if x in ('', '--', '-', '—'):
        return None
    if x.startswith('<'):
        return 0.0999
    if x.startswith('>'):
        return 0.9001
    return round(numero(x.rstrip('%')) / 100, 3)


def fecha(x):
    x = llano(x)
    m = re.match(r'(\d{4})-(\d{2})-(\d{2})', x)
    if m:
        return date(int(m[1]), int(m[2]), int(m[3]))
    m = re.match(r'(\d{1,2})/(\d{1,2})/(\d{4})', x)
    if m:
        return date(int(m[3]), int(m[2]), int(m[1]))
    m = re.match(r'([a-z]{3})[a-z.]* (\d{1,2}), (\d{4})', x)
    if m and m[1] in MESES:
        return date(int(m[3]), MESES[m[1]], int(m[2]))
    m = re.match(r'(\d{1,2}) (?:de )?([a-z]{3})[a-z.]* (?:de )?(\d{4})', x)
    if m and m[2] in MESES:
        return date(int(m[3]), MESES[m[2]], int(m[1]))
    raise ValueError('No entiendo la fecha «%s»' % x)


def texto(ruta):
    with open(ruta, 'rb') as f:
        crudo = f.read()
    for cod in ('utf-16', 'utf-8-sig') if crudo[:2] in (b'\xff\xfe', b'\xfe\xff') else ('utf-8-sig', 'latin-1'):
        try:
            return crudo.decode(cod)
        except UnicodeDecodeError:
            pass
    raise SystemExit('No pude leer ' + ruta)


def tabla(lineas):
    """Busca la fila de encabezados y devuelve (encabezados, filas)."""
    muestra = '\n'.join(lineas[:20])
    sep = '\t' if muestra.count('\t') > muestra.count(',') else ','
    filas = list(csv.reader(io.StringIO('\n'.join(lineas)), delimiter=sep))
    for i, f in enumerate(filas):
        m = mapear(f)
        if 'campana' in m and ('dia' in m or 'semana' in m) and 'clics' in m:
            return m, filas[i + 1:]
    return None, []


def cuenta_por_campanas(nombres):
    votos = {}
    for c in plan.CUENTAS.values():
        propias = {k['nombre'] for k in c['campanas']}
        votos[c['id']] = sum(1 for n in nombres if n.startswith(PREFIJO) and n[len(PREFIJO):] in propias)
    mejor = max(votos, key=votos.get)
    return mejor if votos[mejor] and CUENTA.fullmatch(mejor) else None


def bloque(m, filas, cuenta, origen, tope=None, inicio=None):
    C, fechas = {}, []
    for f in filas:
        if not f or len(f) <= max(m.values()):
            continue
        nombre = f[m['campana']].strip()
        if not nombre or llano(nombre).startswith('total') or llano(nombre) in ('--', 'campana', 'campaign'):
            continue
        semanal = 'semana' in m and 'dia' not in m
        try:
            d0 = fecha(f[m['semana' if semanal else 'dia']])
        except ValueError:
            continue
        v = dict(imp=numero(f[m['imp']]) if 'imp' in m else 0, clics=numero(f[m['clics']]), costo=numero(f[m['costo']]) if 'costo' in m else 0,
                 conv=numero(f[m['conv']]) if 'conv' in m else 0, llam=numero(f[m['llam']]) if 'llam' in m else 0)
        sh = [cuota(f[m[k]]) if k in m else None for k in ('cuota', 'perdP', 'perdR')]
        nueva = nombre.startswith(PREFIJO)
        clave = nombre[len(PREFIJO):] if nueva else nombre
        c = C.setdefault(clave, dict(n=1 if nueva else 0, d={}))
        # Una semana se reparte entre sus días; la semana en curso, solo entre los días que ya pasaron.
        ds = [d0 + timedelta(days=k) for k in range(7 if semanal else 1)]
        ds = [d for d in ds if (not tope or d <= tope) and (not inicio or not nueva or d >= inicio)] or ds[-1:]
        dias = len(ds)
        for d in ds:
            t = d.isoformat()
            r = c['d'].setdefault(t, [0, 0, 0, 0, 0, None, None, None])
            r[0] = round(r[0] + v['imp'] / dias, 2)
            r[1] = round(r[1] + v['clics'] / dias, 3)
            r[2] = round(r[2] + v['costo'] / dias, 2)
            r[3] = round(r[3] + v['conv'] / dias, 3)
            r[4] = round(r[4] + v['llam'] / dias, 3)
            r[5], r[6], r[7] = sh
            fechas.append(t)
    if not C:
        raise SystemExit('No encontré filas de campañas en ' + origen)
    cuenta = cuenta or cuenta_por_campanas([(PREFIJO if c['n'] else '') + n for n, c in C.items()])
    if not cuenta:
        raise SystemExit('No sé de qué cuenta es %s: pásala con --cuenta 123-456-7890.' % origen)
    nuevas = [t for c in C.values() if c['n'] for t, r in c['d'].items() if r[0] > 0]
    if not nuevas:
        raise SystemExit('En %s no hay campañas «AB ·» con impresiones.' % origen)
    arranque = min(nuevas)
    hasta = max(fechas)
    desde = (date.fromisoformat(arranque) - timedelta(days=30)).isoformat()
    for c in C.values():  # lo de la semana repartida que cae después del último día con datos no cuenta
        c['d'] = {t: r for t, r in c['d'].items() if t <= hasta}
    marca = next((x['nombre'] for x in plan.CUENTAS.values() if x['id'] == cuenta), cuenta)
    return dict(v=1, fuente='extension', cuenta=cuenta, marca=marca, generado=date.today().isoformat(), desde=desde, hasta=hasta,
                arranque=arranque, c=C, b={}, k={})


def leer(ruta, cuenta_arg):
    t = texto(ruta)
    lineas = t.splitlines()
    out = []
    marcas = [i for i, l in enumerate(lineas) if 'TABLERO-CSV' in l]
    if marcas:
        for j, i in enumerate(marcas):
            fin = marcas[j + 1] if j + 1 < len(marcas) else len(lineas)
            cu = CUENTA.search(lineas[i])
            ht = re.search(r'hasta=(\d{4}-\d{2}-\d{2})', lineas[i])
            ar = re.search(r'arranque=(\d{4}-\d{2}-\d{2})', lineas[i])
            trozo = [l.strip().strip('`') for l in lineas[i + 1:fin] if l.strip() and not l.strip().startswith('```')]
            m, filas = tabla(trozo)
            if m:
                out.append(bloque(m, filas, cu.group(0) if cu else cuenta_arg, ruta, date.fromisoformat(ht.group(1)) if ht else None,
                                  date.fromisoformat(ar.group(1)) if ar else None))
        return out
    m, filas = tabla(lineas)
    if not m:
        raise SystemExit('No encontré la tabla de campañas en ' + ruta)
    cu = cuenta_arg or (CUENTA.search(os.path.basename(ruta)) or [None])[0]
    return [bloque(m, filas, cu, ruta)]


def main():
    args = sys.argv[1:]
    cuenta = None
    if '--cuenta' in args:
        i = args.index('--cuenta')
        cuenta = args[i + 1]
        del args[i:i + 2]
    if not args:
        raise SystemExit(__doc__)
    with open(DATOS, encoding='utf-8') as f:
        datos = json.load(f)
    cuentas = datos.setdefault('cuentas', {})
    for ruta in args:
        for b in leer(ruta, cuenta):
            previo = cuentas.get(b['cuenta'])
            if previo and previo.get('fuente') != 'extension' and previo['hasta'] >= b['hasta']:
                print('Se queda lo del script para %s (trae más detalle y llega hasta el %s).' % (b['marca'], previo['hasta']))
                continue
            cuentas[b['cuenta']] = b
            print('Cargado %s (%s) · del %s al %s · arranque %s · %d campañas' % (b['marca'], b['cuenta'], b['desde'], b['hasta'],
                                                                                  b['arranque'], len(b['c'])))
    with open(DATOS, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
        f.write('\n')
    subprocess.run([sys.executable, os.path.join(AQUI, 'generar_tablero.py')], check=True)


if __name__ == '__main__':
    main()
