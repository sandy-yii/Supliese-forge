"""Carga al tablero el registro del script «datos-tablero-todas-las-cuentas.js» y regenera las páginas.

    python3 tablero/cargar.py registro.txt [otro-registro.txt ...]

Busca las líneas «TABLERO i/n|...», las une y guarda los datos de esa cuenta en tablero/datos.json, reemplazando
lo que hubiera de la misma cuenta (el script siempre manda todos los días, así que no se pierde nada).
"""
import json
import os
import re
import subprocess
import sys

AQUI = os.path.dirname(os.path.abspath(__file__))
DATOS = os.path.join(AQUI, 'datos.json')
LINEA = re.compile(r'TABLERO (\d+)/(\d+)\|(.*)$')


def leer(texto):
    """Devuelve los bloques completos que haya en el texto (puede traer varias cuentas)."""
    bloques, partes, total = [], {}, 0
    for renglon in texto.splitlines():
        m = LINEA.search(renglon.rstrip('\r'))
        if not m:
            continue
        i, n, trozo = int(m.group(1)), int(m.group(2)), m.group(3)
        if i == 1:
            partes, total = {}, n
        partes[i] = trozo
        if total and len(partes) == total:
            bloques.append(json.loads(''.join(partes[k] for k in range(1, total + 1))))
            partes, total = {}, 0
    if partes:
        raise SystemExit('Faltan líneas TABLERO: llegaron %d de %d. Copia el registro completo.' % (len(partes), total))
    return bloques


def main():
    if len(sys.argv) < 2:
        raise SystemExit(__doc__)
    with open(DATOS, encoding='utf-8') as f:
        datos = json.load(f)
    cuentas = datos.setdefault('cuentas', {})
    for ruta in sys.argv[1:]:
        with open(ruta, encoding='utf-8') as f:
            bloques = leer(f.read())
        if not bloques:
            print('Sin líneas TABLERO en', ruta)
        for b in bloques:
            cuentas[b['cuenta']] = b
            print('Cargado %s (%s) · del %s al %s · %d campañas' % (b['marca'], b['cuenta'], b['desde'], b['hasta'], len(b['c'])))
    with open(DATOS, 'w', encoding='utf-8') as f:
        json.dump(datos, f, ensure_ascii=False, indent=1)
        f.write('\n')
    subprocess.run([sys.executable, os.path.join(AQUI, 'generar_tablero.py')], check=True)


if __name__ == '__main__':
    main()
