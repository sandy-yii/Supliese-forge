"""Genera los dos tableros de avance de Google Ads a partir de tablero/datos.json y campanas/plan.py.

    python3 tablero/generar_tablero.py

Salen dos páginas en tablero/salida/:
  mi-tablero.html      para Atelback: ¿está funcionando la estrategia?, por marca y por campaña, y pendientes.
  tablero-duenos.html  para los dueños: reparto del gasto y de las visitas, gasto contra tope y lo que se ha hecho.
  costo-por-contacto.html  para los dueños: solo el costo por contacto, antes (con y sin el chat) contra la medición nueva.
  avance-supliese.html  para los dueños: logros, línea de tiempo, una tarjeta por marca y el costo por contacto.

Mientras no haya datos reales cargados (ver cargar.py), las dos páginas salen con datos de ejemplo marcados como tales.
"""
import json
import os
import random
import sys
from datetime import date, timedelta

AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(AQUI, '..', 'campanas'))
import plan  # noqa: E402

DATOS = os.path.join(AQUI, 'datos.json')
SALIDA = os.path.join(AQUI, 'salida')

# Marca que ven los dueños, cuenta del plan y página. El orden fija el color de cada marca (no cambiarlo).
MARCAS = [
    dict(id='quick-laundry', nombre='Quick Laundry', cuenta_nombre='Supliese Gómez', pagina='quicklaundry.store'),
    dict(id='clm', nombre='Kingstar México', cuenta_nombre='CLM', pagina='kingstar.com.mx'),
    dict(id='servicio', nombre='Laundry Solutions', cuenta_nombre='Servicio para Lavandería', pagina='laundrysolutions.store'),
    dict(id='girbau', nombre='Girbau', cuenta_nombre='Girbau', pagina='girbaupro.com'),
    dict(id='gamesail', nombre='Gamesail', cuenta_nombre='Cuenta nueva', pagina='gamesail.mx'),
]


def marcas():
    out = []
    for m in MARCAS:
        c = plan.CUENTAS[m['id']]
        out.append(dict(m, cuenta=c['id'], tope=c['mensual'],
                        campanas={k['nombre']: dict(cpc=k['cpc'], pct=k['pct']) for k in c['campanas']}))
    return out


def ejemplo(ms, hasta='2026-10-25', arranque='2026-10-20'):
    """Datos inventados con la misma forma que manda el script, para ver el tablero antes de cargar números reales."""
    rnd = random.Random(7)
    fin = date.fromisoformat(hasta)
    ini = date.fromisoformat(arranque)
    desde = ini - timedelta(days=30)
    ritmo = {'quick-laundry': 0.95, 'clm': 0.8, 'servicio': 1.02, 'girbau': 0.6}
    out = {}
    for m in ms:
        if m['id'] not in ritmo:
            continue
        diario = m['tope'] / 30.4
        C = {'Campaña anterior (búsqueda)': dict(n=0, d={}), 'Campaña anterior (marca)': dict(n=0, d={})}
        for k in m['campanas']:
            C[k] = dict(n=1, d={})
        B, K = {}, {}
        d = desde
        while d <= fin:
            t = d.isoformat()
            if d < ini:
                for i, n in enumerate(['Campaña anterior (búsqueda)', 'Campaña anterior (marca)']):
                    costo = diario * (0.55 if i == 0 else 0.15) * rnd.uniform(0.7, 1.2)
                    cpc = (sum(v['cpc'] for v in m['campanas'].values()) / len(m['campanas'])) * rnd.uniform(1.0, 1.5)
                    clics = max(1, round(costo / cpc))
                    C[n]['d'][t] = [clics * rnd.randint(9, 16), clics, round(costo, 2), 0, rnd.choice([0, 0, 1]),
                                    round(rnd.uniform(0.15, 0.35), 3), round(rnd.uniform(0.3, 0.6), 3), round(rnd.uniform(0.2, 0.4), 3)]
            else:
                dia = (d - ini).days
                util = excl = 0.0
                for n, k in m['campanas'].items():
                    costo = diario * ritmo[m['id']] * k['pct'] / 100 * rnd.uniform(0.75, 1.25) * (0.7 if dia == 0 else 1)
                    cpc = k['cpc'] * rnd.uniform(0.55, 0.85)
                    clics = max(0, round(costo / cpc))
                    if not clics:
                        continue
                    perd = round(rnd.uniform(0.05, 0.45 if m['id'] in ('quick-laundry', 'clm') else 0.2), 3)
                    cuota = round(rnd.uniform(0.25, 0.6), 3)
                    C[n]['d'][t] = [clics * rnd.randint(7, 13), clics, round(costo, 2), 0, rnd.choice([0, 0, 0, 1]),
                                    cuota, perd, round(max(0, 1 - cuota - perd), 3)]
                    e = costo * max(0.04, 0.3 - dia * 0.04) * rnd.uniform(0.6, 1.3)
                    excl += e
                    util += costo - e
                B[t] = [round(util, 2), round(excl, 2), 0, 0]
            d += timedelta(days=1)
        out[m['cuenta']] = dict(v=1, cuenta=m['cuenta'], marca=m['nombre'], generado=hasta + ' 09:00', desde=desde.isoformat(),
                                hasta=hasta, arranque=arranque, c=C, b=B, k=K)
    return out


def main():
    with open(DATOS, encoding='utf-8') as f:
        datos = json.load(f)
    ms = marcas()
    cuentas = datos.get('cuentas', {})
    es_ejemplo = not cuentas
    if es_ejemplo:
        cuentas = ejemplo(ms)
    for m in ms:
        m['datos'] = cuentas.get(m['cuenta'])
    todo = dict(generado=date.today().isoformat(), ejemplo=es_ejemplo, marcas=ms,
                pendientes=datos.get('pendientes', []), hitos=datos.get('hitos', []), notas=datos.get('notas', {}))
    with open(os.path.join(AQUI, 'plantilla.html'), encoding='utf-8') as f:
        html = f.read()
    js = json.dumps(todo, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
    os.makedirs(SALIDA, exist_ok=True)
    for archivo, modo, titulo in [('mi-tablero.html', 'interno', 'Tablero Atelback Supliese'),
                                  ('tablero-duenos.html', 'duenos', 'Avance Supliese Google Ads'),
                                  ('costo-por-contacto.html', 'lead', 'Costo por contacto Supliese'),
                                  ('avance-supliese.html', 'avance', 'Avance Supliese')]:
        out = html.replace('__TITULO__', titulo).replace('"__MODO__"', json.dumps(modo)).replace('/*__DATOS__*/null', js)
        with open(os.path.join(SALIDA, archivo), 'w', encoding='utf-8') as f:
            f.write(out)
    reales = [m['nombre'] for m in ms if m['datos'] and not es_ejemplo]
    print('Tableros generados en tablero/salida/ ·', 'DATOS DE EJEMPLO' if es_ejemplo else 'datos reales de: ' + ', '.join(reales))


if __name__ == '__main__':
    main()
