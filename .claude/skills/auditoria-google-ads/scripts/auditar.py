#!/usr/bin/env python3
"""Auditoría cuantitativa de cuentas de Google Ads a partir de exportaciones CSV.

Lee los informes que se descargan de la interfaz de Google Ads (en español o
en inglés) o las pestañas del script de extracción (assets/extraccion-google-ads.js)
guardadas como CSV, y produce un informe en Markdown con los hallazgos medibles,
más archivos CSV de trabajo (negativas sugeridas, keywords candidatas,
canibalización entre cuentas).

Uso:
    python auditar.py --datos DIR [--config config.json] [--salida DIR]

Organización de DIR:
    DIR/<Nombre de cuenta>/*.csv   una carpeta por cuenta (exportaciones de la UI)
    DIR/*.csv                      archivos con columna "Cuenta" (script de extracción)

Solo lee archivos; no se conecta a nada ni modifica ninguna cuenta.
"""
import argparse
import csv
import json
import os
import re
import sys
from collections import defaultdict
from itertools import combinations

# --------------------------------------------------------------------------
# Columnas: alias en español, inglés y campos GAQL -> nombre canónico
# --------------------------------------------------------------------------
ALIAS = {
    'cuenta': ['Cuenta', 'Account', 'customer.descriptive_name'],
    'termino': ['Término de búsqueda', 'Search term', 'search_term_view.search_term'],
    'keyword': ['Palabra clave', 'Keyword', 'Search keyword', 'ad_group_criterion.keyword.text'],
    'concordancia': ['Tipo de concordancia', 'Match type', 'Search terms match type', 'Keyword match type',
                     'segments.search_term_match_type', 'ad_group_criterion.keyword.match_type'],
    'agregado': ['Añadido/excluido', 'Added/Excluded', 'search_term_view.status'],
    'campana': ['Campaña', 'Campaign', 'campaign.name'],
    'grupo': ['Grupo de anuncios', 'Ad group', 'ad_group.name'],
    'clics': ['Clics', 'Clicks', 'metrics.clicks'],
    'impr': ['Impr.', 'Impressions', 'metrics.impressions'],
    'coste': ['Coste', 'Cost', 'metrics.cost_micros'],
    'conv': ['Conversiones', 'Conversions', 'metrics.conversions'],
    'valor': ['Valor de conv.', 'Conv. value', 'metrics.conversions_value'],
    'estado_kw': ['Estado de las palabras clave', 'Keyword status', 'ad_group_criterion.status'],
    'estado': ['Estado', 'Status', 'campaign.primary_status'],
    'motivos': ['Motivos del estado', 'Status reasons', 'campaign.primary_status_reasons'],
    'qs': ['Nivel de calidad', 'Quality Score', 'ad_group_criterion.quality_info.quality_score'],
    'tipo_campana': ['Tipo de campaña', 'Campaign type', 'campaign.advertising_channel_type'],
    'puja': ['Tipo de estrategia de puja', 'Bid strategy type', 'campaign.bidding_strategy_type'],
    'presupuesto': ['Presupuesto', 'Budget', 'campaign_budget.amount_micros'],
    'cuota': ['Cuota de impr. de búsqueda', 'Search impr. share', 'metrics.search_impression_share'],
    'perd_presup': ['% impr. perdidas de búsq. (presup.)', 'Cuota impr. perd. de búsq. (presupuesto)',
                    'Search lost IS (budget)', 'metrics.search_budget_lost_impression_share'],
    'perd_ranking': ['Cuota impr. perd. de búsq. (ranking)', 'Search lost IS (rank)',
                     'metrics.search_rank_lost_impression_share'],
    'mes': ['Mes', 'Month', 'segments.month'],
    'fecha_cambio': ['Fecha y hora', 'Date & time', 'change_event.change_date_time'],
    'usuario': ['Usuario', 'User', 'change_event.user_email'],
    'cambios': ['Cambios', 'Changes', 'change_event.changed_fields'],
    'accion_conv': ['conversion_action.name', 'Acción de conversión', 'Conversion action'],
    'principal': ['conversion_action.primary_for_goal', 'Acción principal', 'Primary action'],
    'categoria_conv': ['conversion_action.category', 'Categoría de la acción', 'Action category'],
    'conteo': ['conversion_action.counting_type', 'Recuento', 'Count'],
    'accion_seg': ['segments.conversion_action_name'],
    'negativa': ['campaign_criterion.keyword.text', 'shared_criterion.keyword.text',
                 'Palabra clave negativa', 'Negative keyword'],
    'lista': ['shared_set.name', 'Lista de palabras clave negativas', 'Negative keyword list'],
    'dispositivo': ['segments.device', 'Dispositivo', 'Device'],
    'dia_semana': ['segments.day_of_week', 'Día de la semana', 'Day of the week'],
    'hora': ['segments.hour', 'Hora del día', 'Hour of the day'],
    'tipo_ubicacion': ['geographic_view.location_type', 'Tipo de ubicación', 'Location type'],
    'url': ['landing_page_view.unexpanded_final_url', 'Página de destino', 'Landing page'],
    'velocidad': ['metrics.speed_score', 'Puntuación de velocidad móvil', 'Mobile speed score'],
    'aprobacion': ['ad_group_ad.policy_summary.approval_status', 'Estado de aprobación', 'Approval status'],
    'politicas': ['ad_group_ad.policy_summary.policy_topic_entries', 'Temas de políticas', 'Policy details'],
    'fuerza': ['ad_group_ad.ad_strength', 'Calidad del anuncio', 'Ad strength'],
    'red_socios': ['campaign.network_settings.target_partner_search_network'],
    'red_display': ['campaign.network_settings.target_content_network'],
    'geo_tipo': ['campaign.geo_target_type_setting.positive_geo_target_type'],
    'duracion': ['call_view.call_duration_seconds', 'Duración (segundos)', 'Duration (seconds)'],
    'estado_llamada': ['call_view.call_status', 'Estado', 'Status'],
    'tipo_criterio': ['campaign_criterion.type'],
}
# Columnas cuyo encabezado indica que el archivo usa formato numérico español.
PISTAS_ES = {'Coste', 'Clics', 'Conversiones', 'Impr.', 'Término de búsqueda', 'Palabra clave', 'Campaña'}

MESES = {'ene': 1, 'enero': 1, 'feb': 2, 'febrero': 2, 'mar': 3, 'marzo': 3, 'abr': 4, 'abril': 4,
         'may': 5, 'mayo': 5, 'jun': 6, 'junio': 6, 'jul': 7, 'julio': 7, 'ago': 8, 'agosto': 8,
         'sep': 9, 'sept': 9, 'septiembre': 9, 'oct': 10, 'octubre': 10, 'nov': 11, 'noviembre': 11,
         'dic': 12, 'diciembre': 12, 'jan': 1, 'january': 1, 'february': 2, 'march': 3, 'apr': 4,
         'april': 4, 'june': 6, 'july': 7, 'aug': 8, 'august': 8, 'september': 9, 'october': 10,
         'november': 11, 'dec': 12, 'december': 12}

CONFIG_BASE = {
    'moneda': 'MXN',
    'min_conv_cpa': 5,          # con menos conversiones, el CPA se marca como muestra chica
    'min_conv_candidata': 2,    # conversiones mínimas para proponer un término como keyword
    'marcas_propias': [],       # regex de las marcas del cliente (se excluyen de "competencia")
    'competidores': [],         # regex de marcas de la competencia
    'productos': r'precio|venta|comprar|cotiz',
    'lugares': r'cerca de m[ií]|tel[eé]fono|direcci[oó]n|sucursal|horario|www|\.com',
    'negativos': {
        'Empleo y cursos': r'empleo|trabajo|vacante|curso|capacitaci|tutorial|pdf|manual|gratis',
        'Usado y renta': r'usad[oa]s?|seminuev|segunda mano|remate|renta|rentar|alquil|arrend',
        'Información, no compra': r'qu[eé] es|c[oó]mo (hacer|funciona|reparar)|significado|wikipedia|diy',
    },
    'temas': [],
    'senales_debiles': r'chat|whats|clic|click|llamada desde|vista de p[aá]gina|page ?view|scroll',
}


def norm_txt(s):
    return re.sub(r'\s+', ' ', (s or '').strip().lower())


def numero(s, es):
    """Convierte '1.234,56', '12,5%', '--', '< 10%' o '1,234.56' a float."""
    if s is None:
        return 0.0
    if isinstance(s, (int, float)):
        return float(s)
    s = str(s).strip().replace('%', '').replace('<', '').replace('>', '').replace(' ', '').strip()
    if s in ('', '--', '-', '—'):
        return 0.0
    if ',' in s and '.' in s:
        s = s.replace('.', '').replace(',', '.') if s.rfind(',') > s.rfind('.') else s.replace(',', '')
    elif ',' in s:
        s = s.replace(',', '.') if es or not re.fullmatch(r'-?\d{1,3}(,\d{3})+', s) else s.replace(',', '')
    elif '.' in s and es and re.fullmatch(r'-?\d{1,3}(\.\d{3})+', s):
        s = s.replace('.', '')
    try:
        return float(s)
    except ValueError:
        return 0.0


def concordancia(s):
    s = norm_txt(s)
    if 'exact' in s:
        return 'Exacta'
    if 'frase' in s or 'phrase' in s:
        return 'Frase'
    if 'amplia' in s or 'broad' in s:
        return 'Amplia'
    return s or 'Sin dato'


def mes_de(s):
    """Devuelve 'AAAA-MM' a partir de 'enero de 2026', '21 sept 2026, 20:24', '2026-01-15'."""
    s = norm_txt(s)
    m = re.match(r'(\d{4})-(\d{2})', s)
    if m:
        return '%s-%s' % m.groups()
    anio = re.search(r'(20\d{2})', s)
    for palabra in re.findall(r'[a-záéíóú]+', s):
        if palabra in MESES and anio:
            return '%s-%02d' % (anio.group(1), MESES[palabra])
    return ''


# --------------------------------------------------------------------------
# Lectura
# --------------------------------------------------------------------------
def leer_csv(ruta):
    with open(ruta, encoding='utf-8-sig', newline='') as f:
        filas = list(csv.reader(f))
    todos = {a for lista in ALIAS.values() for a in lista}
    inicio = next((i for i, fila in enumerate(filas[:8]) if sum(c.strip() in todos for c in fila) >= 2), None)
    if inicio is None:
        return None, []
    cabeza = [c.strip() for c in filas[inicio]]
    mapa = {}
    for canon, lista in ALIAS.items():
        for i, c in enumerate(cabeza):
            if c in lista and canon not in mapa:
                mapa[canon] = i
    es = bool(PISTAS_ES & set(cabeza))
    # Las pestañas del script usan nombres GAQL y dan las cuotas como fracción 0-1.
    gaql = sum(bool(re.fullmatch(r'[a-z_]+(\.[a-z_]+)+', c)) for c in cabeza) >= 2
    datos = []
    for fila in filas[inicio + 1:]:
        if not fila or not any(x.strip() for x in fila):
            continue
        r = {k: (fila[i] if i < len(fila) else '') for k, i in mapa.items()}
        # Filas de totales: "Total: cuenta", "Total: buscar"... o campaña "--".
        claves = [norm_txt(r.get(k)) for k in ('termino', 'keyword', 'campana', 'grupo', 'concordancia', 'mes')]
        if any(c.startswith('total') for c in claves) or norm_txt(fila[0]).startswith('total'):
            continue
        if norm_txt(r.get('campana')) in ('--', '-'):
            continue
        for k in ('clics', 'impr', 'coste', 'conv', 'valor', 'qs', 'presupuesto', 'cuota', 'perd_presup',
                  'perd_ranking', 'velocidad', 'duracion'):
            if k in r:
                r[k] = numero(r[k], es)
                if gaql and k in ('cuota', 'perd_presup', 'perd_ranking') and r[k] <= 1:
                    r[k] *= 100
        datos.append(r)
    return tipo_de(mapa), datos


def tipo_de(mapa):
    # El orden importa: varios informes traen "campaña" y solo se distinguen por la
    # columna que los segmenta (dispositivo, hora, tipo de ubicación...). Si se
    # confundieran con el informe de campañas, el gasto se contaría dos veces.
    if 'termino' in mapa:
        return 'terminos'
    if 'negativa' in mapa or ('keyword' in mapa and 'coste' not in mapa):
        return 'negativas'
    if 'keyword' in mapa:
        return 'keywords'
    if 'aprobacion' in mapa:
        return 'anuncios'
    if 'url' in mapa:
        return 'paginas'
    if 'dispositivo' in mapa:
        return 'dispositivos'
    if 'hora' in mapa or 'dia_semana' in mapa:
        return 'horarios'
    if 'tipo_ubicacion' in mapa:
        return 'ubicacion'
    if 'red_socios' in mapa or 'geo_tipo' in mapa:
        return 'config_campanas'
    if 'duracion' in mapa:
        return 'llamadas'
    if 'tipo_criterio' in mapa:
        return 'criterios'
    if 'fecha_cambio' in mapa:
        return 'historial'
    if 'principal' in mapa or 'categoria_conv' in mapa:
        return 'conv_config'
    if 'accion_seg' in mapa:
        return 'conv_accion'
    if 'grupo' in mapa and 'campana' in mapa:
        return 'grupos'
    if 'campana' in mapa:
        return 'campanas'
    return None


def cargar(dir_datos):
    """Devuelve {cuenta: {tipo: [filas]}} y la lista de archivos ignorados."""
    cuentas = defaultdict(lambda: defaultdict(list))
    ignorados = []
    for raiz, _, archivos in os.walk(dir_datos):
        for nombre in sorted(archivos):
            if not nombre.lower().endswith('.csv'):
                continue
            ruta = os.path.join(raiz, nombre)
            tipo, filas = leer_csv(ruta)
            if not tipo:
                ignorados.append(ruta)
                continue
            carpeta = os.path.relpath(raiz, dir_datos)
            requerido = {'terminos': 'termino', 'keywords': 'keyword', 'campanas': 'campana', 'grupos': 'grupo',
                         'paginas': 'url'}.get(tipo)
            for r in filas:
                if requerido and not norm_txt(r.get(requerido)):
                    continue
                cuenta = r.get('cuenta') or (carpeta if carpeta != '.' else 'Cuenta')
                if any(str(v).startswith('ERROR:') for v in r.values()):
                    continue
                cuentas[cuenta][tipo].append(r)
    return cuentas, ignorados


# --------------------------------------------------------------------------
# Análisis
# --------------------------------------------------------------------------
def agrupar(filas, clave):
    acc = defaultdict(lambda: {'coste': 0.0, 'conv': 0.0, 'clics': 0.0, 'impr': 0.0, 'filas': []})
    for r in filas:
        k = clave(r)
        if not k:
            continue
        a = acc[k]
        for m in ('coste', 'conv', 'clics', 'impr'):
            a[m] += r.get(m, 0.0) or 0.0
        a['filas'].append(r)
    return acc


def cpa(coste, conv):
    return coste / conv if conv else None


def fmt_dinero(x):
    return '—' if x is None else '${:,.2f}'.format(x)


def fmt_cpa(coste, conv, minimo):
    if not conv:
        return 'sin conv.'
    v = '${:,.2f}'.format(coste / conv)
    return v + (' ⚠ muestra chica' if conv < minimo else '')


def pct(a, b):
    return 100.0 * a / b if b else 0.0


def analizar_cuenta(nombre, d, cfg):
    h = {'cuenta': nombre, 'secciones': []}
    terminos = d.get('terminos', [])
    keywords = d.get('keywords', [])
    campanas = d.get('campanas', [])
    minimo = cfg['min_conv_cpa']

    # Totales: el informe de campañas es el más completo; el de términos omite las
    # búsquedas de bajo volumen que Google no muestra, así que cubre menos gasto.
    base, fuente = ((campanas, 'campañas') if campanas else (keywords, 'keywords') if keywords else (terminos, 'términos'))
    total_coste = sum(r.get('coste', 0) for r in base)
    total_conv = sum(r.get('conv', 0) for r in base)
    cpa_cuenta = cpa(total_coste, total_conv)
    coste_terminos = sum(r.get('coste', 0) for r in terminos)
    h['totales'] = {'coste': total_coste, 'conv': total_conv, 'cpa': cpa_cuenta, 'fuente': fuente,
                    'cobertura_terminos': pct(coste_terminos, total_coste) if terminos and fuente != 'términos' else None}

    if campanas:
        h['campanas'] = analizar_campanas(campanas, minimo)
    if keywords:
        h['keywords'] = analizar_keywords(keywords, minimo)
    negativas = {re.sub(r'[\[\]"+]', '', norm_txt(r.get('negativa') or r.get('keyword'))).strip()
                 for r in d.get('negativas', [])} - {''}
    if d.get('negativas'):
        h['negativas_existentes'] = {'n': len(negativas),
                                     'listas': sorted({r.get('lista', '') for r in d['negativas'] if r.get('lista')})}
    if terminos:
        kws = {re.sub(r'[\[\]"+]', '', norm_txt(r.get('keyword'))).strip() for r in keywords}
        h['terminos'] = analizar_terminos(terminos, cfg, cpa_cuenta, kws, negativas)
    if d.get('historial'):
        h['historial'] = analizar_historial(d['historial'])
    if d.get('conv_config'):
        h['conversiones'] = analizar_conversiones(d['conv_config'], cfg)
    h['extras'] = analizar_extras(d, cfg)
    return h


def analizar_campanas(filas, minimo):
    g = agrupar(filas, lambda r: r.get('campana', '').strip())
    total = sum(a['coste'] for a in g.values()) or 1
    total_conv = sum(a['conv'] for a in g.values())
    cpa_t = cpa(total, total_conv)
    out = []
    for nombre, a in sorted(g.items(), key=lambda kv: -kv[1]['coste']):
        if a['coste'] <= 0:
            continue
        # Cuotas de impresión: promedio ponderado por coste (no se pueden sumar).
        def pond(k):
            vals = [(r.get(k, 0), r.get('coste', 0)) for r in a['filas'] if k in r]
            peso = sum(c for _, c in vals)
            return sum(v * c for v, c in vals) / peso if peso else None
        fila = {'campana': nombre, 'coste': a['coste'], 'conv': a['conv'], 'cpa': cpa(a['coste'], a['conv']),
                'pct_gasto': pct(a['coste'], total), 'pct_conv': pct(a['conv'], total_conv),
                'perd_presup': pond('perd_presup'), 'perd_ranking': pond('perd_ranking'),
                'tipo': a['filas'][0].get('tipo_campana', ''), 'puja': a['filas'][0].get('puja', ''),
                'muestra_chica': a['conv'] < minimo}
        alertas = []
        if cpa_t and fila['cpa'] and fila['cpa'] > 1.3 * cpa_t and fila['pct_gasto'] > fila['pct_conv'] + 10:
            alertas.append('absorbe gasto con CPA alto')
        if fila['perd_presup'] and fila['perd_presup'] > 20 and cpa_t and fila['cpa'] and fila['cpa'] < cpa_t:
            alertas.append('eficiente pero limitada por presupuesto')
        if a['conv'] == 0 and a['coste'] > (cpa_t or 0):
            alertas.append('gastó más de un CPA promedio sin convertir')
        fila['alertas'] = alertas
        out.append(fila)
    return {'filas': out, 'cpa_total': cpa_t}


def analizar_keywords(filas, minimo):
    total = sum(r.get('coste', 0) for r in filas) or 1
    por_conc = agrupar(filas, lambda r: concordancia(r.get('concordancia')))
    conc = [{'concordancia': k, 'n': len(a['filas']), 'coste': a['coste'], 'conv': a['conv'],
             'pct_gasto': pct(a['coste'], total), 'cpa': cpa(a['coste'], a['conv'])}
            for k, a in sorted(por_conc.items(), key=lambda kv: -kv[1]['coste'])]
    con_gasto = [r for r in filas if r.get('coste', 0) > 0]
    pausadas = [r for r in con_gasto if re.search(r'pausa|paused', norm_txt(r.get('estado_kw')))]
    no_aptas = [r for r in filas if re.search(r'no apto|not eligible|limitad|limited|rechaz|disapproved',
                                             norm_txt(r.get('estado')) + ' ' + norm_txt(r.get('motivos')))]
    qs = [r.get('qs') for r in filas if r.get('qs')]
    top = sorted(filas, key=lambda r: -r.get('coste', 0))
    return {
        'n': len(filas), 'con_gasto': len(con_gasto), 'concordancia': conc,
        'top1_pct': pct(sum(r['coste'] for r in top[:1]), total),
        'top5_pct': pct(sum(r['coste'] for r in top[:5]), total),
        'top': [{'keyword': r.get('keyword'), 'concordancia': concordancia(r.get('concordancia')),
                 'coste': r.get('coste', 0), 'conv': r.get('conv', 0), 'cpa': cpa(r.get('coste', 0), r.get('conv', 0)),
                 'grupo': r.get('grupo', '')} for r in top[:10]],
        'pausadas_con_historial': {'n': len(pausadas), 'coste': sum(r['coste'] for r in pausadas),
                                   'conv': sum(r.get('conv', 0) for r in pausadas)},
        'no_aptas': {'n': len(no_aptas), 'pct': pct(len(no_aptas), len(filas))},
        'qs': {'n': len(qs), 'media': (sum(qs) / len(qs)) if qs else None, 'bajos': sum(1 for q in qs if q <= 5)},
    }


def analizar_terminos(filas, cfg, cpa_cuenta, keywords_cuenta=frozenset(), negativas=frozenset()):
    minimo = cfg['min_conv_cpa']
    g = agrupar(filas, lambda r: norm_txt(r.get('termino')))
    total = sum(a['coste'] for a in g.values()) or 1
    orden = sorted(g.items(), key=lambda kv: -kv[1]['coste'])
    out = {'n': len(g), 'coste': total}

    out['concentracion'] = {'top1': pct(sum(a['coste'] for _, a in orden[:1]), total),
                            'top10': pct(sum(a['coste'] for _, a in orden[:10]), total)}

    # Desperdicio: ya gastaron al menos un CPA promedio y no convirtieron. Se excluyen
    # los términos idénticos a una keyword de la cuenta: suelen ser el núcleo del negocio
    # y su cero se explica por cómo Google reparte las conversiones entre variantes.
    umbral = cpa_cuenta or 0
    sin = [(t, a) for t, a in orden if a['conv'] == 0 and a['coste'] >= umbral and a['coste'] > 0
           and t not in keywords_cuenta and not ya_bloqueado(t, negativas)]
    cero_total = sum(a['coste'] for _, a in g.items() if a['conv'] == 0)
    out['desperdicio'] = {'umbral': umbral, 'n': len(sin), 'coste': sum(a['coste'] for _, a in sin),
                          'coste_sin_conv_total': cero_total, 'pct_sin_conv_total': pct(cero_total, total),
                          'top': [(t, a['coste'], a['clics']) for t, a in sin[:15]]}

    # Patrones de negativas configurables.
    pats = []
    for nombre, regex in cfg['negativos'].items():
        sel = [(t, a) for t, a in g.items() if re.search(regex, t, re.I)]
        c = sum(a['coste'] for _, a in sel)
        v = sum(a['conv'] for _, a in sel)
        z = sum(a['coste'] for _, a in sel if a['conv'] == 0)
        if sel:
            pats.append({'patron': nombre, 'n': len(sel), 'coste': c, 'conv': v, 'cpa': cpa(c, v),
                         'coste_sin_conv': z, 'ejemplos': [t for t, _ in sorted(sel, key=lambda x: -x[1]['coste'])[:5]]})
    out['negativos'] = sorted(pats, key=lambda p: -p['coste'])

    # Temas (intención): cada término cae en el primer tema que coincide.
    if cfg['temas']:
        res = defaultdict(lambda: [0.0, 0.0, 0])
        for t, a in g.items():
            tema = next((n for n, rx in cfg['temas'] if re.search(rx, t, re.I)), 'Otro / sin clasificar')
            res[tema][0] += a['coste']
            res[tema][1] += a['conv']
            res[tema][2] += 1
        out['temas'] = [{'tema': k, 'coste': c, 'pct': pct(c, total), 'conv': v, 'cpa': cpa(c, v), 'n': n,
                         'muestra_chica': v < minimo}
                        for k, (c, v, n) in sorted(res.items(), key=lambda kv: -kv[1][0])]

    # Marcas de la competencia: sola / con producto / con lugar o contacto.
    if cfg['competidores']:
        rx_c = '|'.join(cfg['competidores'])
        cats = defaultdict(lambda: [0.0, 0.0, 0])
        for t, a in g.items():
            if not re.search(rx_c, t, re.I):
                continue
            lugar = re.search(cfg['lugares'], t, re.I)
            prod = re.search(cfg['productos'], t, re.I)
            k = ('marca + lugar o contacto' if lugar and not prod else
                 'marca + producto + lugar' if lugar else
                 'marca + producto' if prod else 'marca sola')
            cats[k][0] += a['coste']
            cats[k][1] += a['conv']
            cats[k][2] += 1
        out['competencia'] = [{'patron': k, 'coste': c, 'conv': v, 'cpa': cpa(c, v), 'n': n}
                              for k, (c, v, n) in sorted(cats.items(), key=lambda kv: -kv[1][0])]

    # Marca propia: cuánto cuesta y dónde se paga.
    if cfg['marcas_propias']:
        rx_p = '|'.join(cfg['marcas_propias'])
        sel = [(t, a) for t, a in g.items() if re.search(rx_p, t, re.I)]
        out['marca_propia'] = {'n': len(sel), 'coste': sum(a['coste'] for _, a in sel),
                               'conv': sum(a['conv'] for _, a in sel),
                               'campanas': sorted({r.get('campana', '') for _, a in sel for r in a['filas']})}

    # Mismo término en varios grupos o campañas de la misma cuenta.
    multi = []
    for t, a in g.items():
        lugares = {(r.get('campana', ''), r.get('grupo', '')) for r in a['filas']}
        if len(lugares) > 1:
            multi.append((t, a['coste'], len(lugares)))
    out['duplicados_internos'] = {'n': len(multi), 'coste': sum(c for _, c, _ in multi),
                                  'pct': pct(sum(c for _, c, _ in multi), total),
                                  'top': sorted(multi, key=lambda x: -x[1])[:10]}

    # Términos que convierten y no están dados de alta como keyword.
    cand = []
    for t, a in g.items():
        agregado = norm_txt(' '.join(r.get('agregado', '') for r in a['filas']))
        if re.search(r'añadid|agregad|added|excluid|excluded', agregado):
            continue
        if a['conv'] >= cfg['min_conv_candidata'] and (cpa_cuenta is None or cpa(a['coste'], a['conv']) <= cpa_cuenta):
            cand.append({'termino': t, 'coste': a['coste'], 'conv': a['conv'], 'cpa': cpa(a['coste'], a['conv']),
                         'campana': a['filas'][0].get('campana', ''), 'grupo': a['filas'][0].get('grupo', '')})
    out['candidatas'] = sorted(cand, key=lambda c: -c['conv'])
    out['_por_termino'] = {t: (a['coste'], a['conv']) for t, a in g.items()}
    return out


def ya_bloqueado(termino, negativas):
    """Aproximación: el término contiene todas las palabras de alguna negativa existente."""
    palabras = set(termino.split())
    return any(set(n.split()) <= palabras for n in negativas)


def por_clave(filas, clave, minimo):
    g = agrupar(filas, clave)
    total = sum(a['coste'] for a in g.values()) or 1
    return [{'clave': k, 'coste': a['coste'], 'pct': pct(a['coste'], total), 'conv': a['conv'],
             'cpa': cpa(a['coste'], a['conv']), 'muestra_chica': a['conv'] < minimo, 'filas': a['filas']}
            for k, a in sorted(g.items(), key=lambda kv: -kv[1]['coste'])]


def analizar_extras(d, cfg):
    """Informes complementarios: anuncios, páginas, dispositivos, horarios, ubicación, llamadas."""
    m = cfg['min_conv_cpa']
    x = {}
    if d.get('anuncios'):
        est = por_clave(d['anuncios'], lambda r: (r.get('aprobacion') or 'sin dato').strip(), m)
        temas = defaultdict(int)
        for r in d['anuncios']:
            for t in re.split(r'\s*\|\s*|;\s*', r.get('politicas') or ''):
                if t.strip():
                    temas[t.strip()] += 1
        debiles = sum(1 for r in d['anuncios'] if re.search(r'poor|bajo|deficiente', norm_txt(r.get('fuerza'))))
        x['anuncios'] = {'por_estado': [{k: v for k, v in e.items() if k != 'filas'} | {'n': len(e['filas'])} for e in est],
                         'temas': sorted(temas.items(), key=lambda kv: -kv[1])[:8], 'fuerza_baja': debiles}
    if d.get('paginas'):
        pg = por_clave(d['paginas'], lambda r: (r.get('url') or '').strip(), m)
        for p in pg:
            vel = [r.get('velocidad') for r in p['filas'] if r.get('velocidad')]
            p['velocidad'] = max(vel) if vel else None
        x['paginas'] = [{k: v for k, v in p.items() if k != 'filas'} for p in pg[:10]]
    if d.get('dispositivos'):
        x['dispositivos'] = [{k: v for k, v in p.items() if k != 'filas'}
                             for p in por_clave(d['dispositivos'], lambda r: norm_txt(r.get('dispositivo')), m)]
    if d.get('horarios'):
        dias = por_clave(d['horarios'], lambda r: norm_txt(r.get('dia_semana')), m)
        horas = por_clave(d['horarios'], lambda r: str(r.get('hora', '')).strip(), m)
        x['horarios'] = {'dias': [{k: v for k, v in p.items() if k != 'filas'} for p in dias],
                         'horas_sin_conv': [(h['clave'], h['coste']) for h in horas if h['conv'] == 0 and h['coste'] > 0]}
    if d.get('ubicacion'):
        x['ubicacion'] = [{k: v for k, v in p.items() if k != 'filas'}
                          for p in por_clave(d['ubicacion'], lambda r: norm_txt(r.get('tipo_ubicacion')), m)]
    if d.get('config_campanas'):
        cc = d['config_campanas']
        x['config_campanas'] = {
            'socios_busqueda': sorted({r.get('campana', '') for r in cc if norm_txt(r.get('red_socios')) in ('true', 'verdadero')}),
            'display_en_busqueda': sorted({r.get('campana', '') for r in cc
                                           if norm_txt(r.get('red_display')) in ('true', 'verdadero')
                                           and 'search' in norm_txt(r.get('tipo_campana') or 'search')}),
            'presencia_o_interes': sorted({r.get('campana', '') for r in cc if 'interest' in norm_txt(r.get('geo_tipo'))}),
        }
    if d.get('llamadas'):
        ll = d['llamadas']
        dur = [r.get('duracion', 0) for r in ll]
        x['llamadas'] = {'n': len(ll), 'de_60s_o_mas': sum(1 for v in dur if v >= 60),
                         'perdidas': sum(1 for r in ll if re.search(r'missed|perdid', norm_txt(r.get('estado_llamada'))))}
    return x


def analizar_historial(filas):
    por_mes = defaultdict(int)
    por_usuario = defaultdict(int)
    for r in filas:
        por_mes[mes_de(r.get('fecha_cambio'))] += 1
        por_usuario[(r.get('usuario') or '').strip() or '(sin usuario)'] += 1
    meses = sorted(m for m in por_mes if m)
    vacios = []
    if meses:
        a, m = map(int, meses[0].split('-'))
        fin = tuple(map(int, meses[-1].split('-')))
        while (a, m) <= fin:
            k = '%d-%02d' % (a, m)
            if not por_mes.get(k):
                vacios.append(k)
            a, m = (a + 1, 1) if m == 12 else (a, m + 1)
    pausas = [r for r in filas if re.search(r'en pausa|paused', norm_txt(r.get('cambios')))]
    return {'total': len(filas), 'por_mes': dict(sorted(por_mes.items())), 'meses_sin_cambios': vacios,
            'por_usuario': dict(sorted(por_usuario.items(), key=lambda kv: -kv[1])),
            'pausas': len(pausas)}


def analizar_conversiones(filas, cfg):
    out = []
    for r in filas:
        nombre = r.get('accion_conv', '')
        principal = str(r.get('principal', '')).strip().lower() in ('true', 'verdadero', 'sí', 'si', 'yes', '1')
        debil = bool(re.search(cfg['senales_debiles'], norm_txt(nombre) + ' ' + norm_txt(r.get('categoria_conv')), re.I))
        out.append({'accion': nombre, 'principal': principal, 'categoria': r.get('categoria_conv', ''),
                    'conteo': r.get('conteo', ''), 'senal_debil': debil})
    return {'acciones': out, 'debiles_principales': [a['accion'] for a in out if a['principal'] and a['senal_debil']]}


def canibalizacion(resultados):
    """Términos idénticos pagados por dos cuentas del mismo grupo."""
    pares = []
    con_terminos = [(r['cuenta'], r['terminos']['_por_termino']) for r in resultados if 'terminos' in r]
    for (na, ta), (nb, tb) in combinations(con_terminos, 2):
        comunes = set(ta) & set(tb)
        if not comunes:
            continue
        ca = sum(ta[t][0] for t in comunes)
        cb = sum(tb[t][0] for t in comunes)
        tot_a = sum(v[0] for v in ta.values()) or 1
        tot_b = sum(v[0] for v in tb.values()) or 1
        top = sorted(comunes, key=lambda t: -(ta[t][0] + tb[t][0]))
        pares.append({'a': na, 'b': nb, 'n': len(comunes), 'coste_a': ca, 'coste_b': cb,
                      'pct_a': pct(ca, tot_a), 'pct_b': pct(cb, tot_b),
                      'top': [(t, ta[t][0], ta[t][1], tb[t][0], tb[t][1]) for t in top]})
    return sorted(pares, key=lambda p: -(p['coste_a'] + p['coste_b']))


# --------------------------------------------------------------------------
# Informe
# --------------------------------------------------------------------------
def informe(resultados, pares, cfg, ignorados):
    m = cfg['min_conv_cpa']
    L = ['# Auditoría cuantitativa de Google Ads', '',
         'Generado por `auditar.py`. Las cifras salen de las exportaciones; las conclusiones e',
         'interpretaciones se agregan después, con el criterio de `references/checklist.md`.',
         'Un CPA marcado con ⚠ tiene menos de %d conversiones: no basta para decidir solo con él.' % m, '']
    if ignorados:
        L += ['> Archivos que el análisis automático no usa (revísalos a mano si importan): ' + ', '.join(os.path.basename(x) for x in ignorados), '']

    L += ['## Resumen por cuenta', '',
          '"Términos visibles" es la parte del gasto que aparece en el informe de términos de búsqueda;',
          'Google oculta las búsquedas de bajo volumen, así que los porcentajes de esa sección se calculan sobre esa parte.', '',
          '| Cuenta | Gasto | Conversiones | CPA | Fuente del total | Términos visibles |', '|---|---:|---:|---:|---|---:|']
    for r in resultados:
        t = r['totales']
        cob = '—' if t['cobertura_terminos'] is None else '%.0f%%' % t['cobertura_terminos']
        L.append('| %s | %s | %.1f | %s | %s | %s |' % (r['cuenta'], fmt_dinero(t['coste']), t['conv'],
                                                      fmt_cpa(t['coste'], t['conv'], m), t['fuente'], cob))
    L.append('')

    if pares:
        L += ['## Canibalización entre cuentas', '',
              'Términos idénticos que pagan dos cuentas del grupo. Si Google las trata como anunciantes',
              'distintos, se suben el CPC entre ellas; si las trata como el mismo negocio, su política de',
              '"ventaja injusta" solo deja salir un anuncio y Google elige cuál. En ambos casos se reparte territorio.', '',
              '| Cuenta A | Cuenta B | Términos comunes | Gasto A en ellos | % de A (visible) | Gasto B en ellos | % de B (visible) |',
              '|---|---|---:|---:|---:|---:|---:|']
        for p in pares:
            L.append('| %s | %s | %d | %s | %.1f%% | %s | %.1f%% |' % (
                p['a'], p['b'], p['n'], fmt_dinero(p['coste_a']), p['pct_a'], fmt_dinero(p['coste_b']), p['pct_b']))
        L.append('')

    for r in resultados:
        L += ['---', '', '## %s' % r['cuenta'], '']
        if 'campanas' in r:
            c = r['campanas']
            L += ['### Campañas', '', '| Campaña | Gasto | % gasto | % conv. | CPA | Perd. presup. | Perd. ranking | Alertas |',
                  '|---|---:|---:|---:|---:|---:|---:|---|']
            for f in c['filas']:
                L.append('| %s | %s | %.1f%% | %.1f%% | %s | %s | %s | %s |' % (
                    f['campana'], fmt_dinero(f['coste']), f['pct_gasto'], f['pct_conv'], fmt_cpa(f['coste'], f['conv'], m),
                    '—' if f['perd_presup'] is None else '%.0f%%' % f['perd_presup'],
                    '—' if f['perd_ranking'] is None else '%.0f%%' % f['perd_ranking'], '; '.join(f['alertas'])))
            L.append('')
        if 'keywords' in r:
            k = r['keywords']
            L += ['### Palabras clave', '',
                  '- %d palabras clave, %d con gasto. La primera concentra %.1f%% del gasto; las 5 primeras, %.1f%%.' % (
                      k['n'], k['con_gasto'], k['top1_pct'], k['top5_pct']),
                  '- En pausa pero con gasto en el periodo: %d (%s, %.1f conv.).' % (
                      k['pausadas_con_historial']['n'], fmt_dinero(k['pausadas_con_historial']['coste']),
                      k['pausadas_con_historial']['conv']),
                  '- No aptas, limitadas o rechazadas: %d (%.0f%%).' % (k['no_aptas']['n'], k['no_aptas']['pct'])]
            if k['qs']['n']:
                L.append('- Nivel de calidad: media %.1f en %d keywords; %d con 5 o menos.' % (
                    k['qs']['media'], k['qs']['n'], k['qs']['bajos']))
            L += ['', '| Concordancia | Keywords | Gasto | % gasto | CPA |', '|---|---:|---:|---:|---:|']
            for c in k['concordancia']:
                L.append('| %s | %d | %s | %.1f%% | %s |' % (c['concordancia'], c['n'], fmt_dinero(c['coste']),
                                                          c['pct_gasto'], fmt_cpa(c['coste'], c['conv'] or 0, m)))
            L += ['', '| Top keywords por gasto | Concordancia | Gasto | CPA | Grupo |', '|---|---|---:|---:|---|']
            for t in k['top']:
                L.append('| %s | %s | %s | %s | %s |' % (t['keyword'], t['concordancia'], fmt_dinero(t['coste']),
                                                       fmt_cpa(t['coste'], t['conv'], m), t['grupo']))
            L.append('')
        if 'terminos' in r:
            t = r['terminos']
            d = t['desperdicio']
            L += ['### Términos de búsqueda', '',
                  '- %d términos distintos. El primero concentra %.1f%% del gasto; los 10 primeros, %.1f%%.' % (
                      t['n'], t['concentracion']['top1'], t['concentracion']['top10']),
                  '- Gasto en términos sin ninguna conversión: %s (%.1f%%).' % (
                      fmt_dinero(d['coste_sin_conv_total']), d['pct_sin_conv_total']),
                  '- Términos que ya gastaron al menos un CPA promedio (%s) sin convertir: %d, por %s.' % (
                      fmt_dinero(d['umbral']), d['n'], fmt_dinero(d['coste'])),
                  '- Mismo término en varios grupos o campañas: %d términos, %s (%.1f%% del gasto).' % (
                      t['duplicados_internos']['n'], fmt_dinero(t['duplicados_internos']['coste']), t['duplicados_internos']['pct']),
                  '- Términos que convierten a CPA igual o mejor que la cuenta y no son keyword: %d.' % len(t['candidatas']), '']
            if t['negativos']:
                L += ['| Patrón de negativa | Términos | Gasto | Conv. | Gasto sin conv. | Ejemplos |', '|---|---:|---:|---:|---:|---|']
                for p in t['negativos']:
                    L.append('| %s | %d | %s | %.1f | %s | %s |' % (p['patron'], p['n'], fmt_dinero(p['coste']), p['conv'],
                                                                fmt_dinero(p['coste_sin_conv']), ' · '.join(p['ejemplos'][:3])))
                L.append('')
            if t.get('temas'):
                L += ['| Tema (intención) | Gasto | % gasto | Conv. | CPA |', '|---|---:|---:|---:|---:|']
                for x in t['temas']:
                    L.append('| %s | %s | %.1f%% | %.1f | %s |' % (x['tema'], fmt_dinero(x['coste']), x['pct'], x['conv'],
                                                                fmt_cpa(x['coste'], x['conv'], m)))
                L.append('')
            if t.get('competencia'):
                L += ['| Búsquedas de competencia | Términos | Gasto | Conv. | CPA |', '|---|---:|---:|---:|---:|']
                for x in t['competencia']:
                    L.append('| %s | %d | %s | %.1f | %s |' % (x['patron'], x['n'], fmt_dinero(x['coste']), x['conv'],
                                                             fmt_cpa(x['coste'], x['conv'], m)))
                L.append('')
            if t.get('marca_propia'):
                mp = t['marca_propia']
                L += ['- Marca propia: %d términos, %s, %.1f conv. Se paga en: %s.' % (
                    mp['n'], fmt_dinero(mp['coste']), mp['conv'], ', '.join(mp['campanas']) or '—'), '']
        if 'negativas_existentes' in r:
            ne = r['negativas_existentes']
            L += ['- Negativas que ya existen en la cuenta: %d%s. Los candidatos a negativa ya bloqueados se omiten.' % (
                ne['n'], (' (listas: %s)' % ', '.join(ne['listas'])) if ne['listas'] else ''), '']
        L += informe_extras(r.get('extras', {}), m)
        if 'historial' in r:
            hh = r['historial']
            L += ['### Historial de cambios', '',
                  '- %d cambios. Pausas registradas: %d.' % (hh['total'], hh['pausas']),
                  '- Por mes: ' + ', '.join('%s: %d' % kv for kv in hh['por_mes'].items() if kv[0]),
                  '- Meses sin ningún cambio: ' + (', '.join(hh['meses_sin_cambios']) or 'ninguno'),
                  '- Por usuario: ' + ', '.join('%s: %d' % kv for kv in list(hh['por_usuario'].items())[:6]), '']
        if 'conversiones' in r:
            cv = r['conversiones']
            L += ['### Acciones de conversión', '', '| Acción | Principal | Categoría | Recuento | Señal débil |', '|---|---|---|---|---|']
            for a in cv['acciones']:
                L.append('| %s | %s | %s | %s | %s |' % (a['accion'], 'sí' if a['principal'] else 'no', a['categoria'],
                                                       a['conteo'], '⚠' if a['senal_debil'] else ''))
            if cv['debiles_principales']:
                L.append('\n**Señales débiles marcadas como principales:** ' + ', '.join(cv['debiles_principales']) +
                         '. Las pujas automáticas aprenden a traer más de eso, no clientes.')
            L.append('')
    return '\n'.join(L)


def informe_extras(x, m):
    L = []
    def tabla(titulo, filas):
        out = ['| %s | Gasto | %% gasto | Conv. | CPA |' % titulo, '|---|---:|---:|---:|---:|']
        for f in filas:
            out.append('| %s | %s | %.1f%% | %.1f | %s |' % (f['clave'] or '—', fmt_dinero(f['coste']), f['pct'],
                                                         f['conv'], fmt_cpa(f['coste'], f['conv'], m)))
        return out + ['']
    if 'config_campanas' in x:
        c = x['config_campanas']
        L += ['### Configuración de campañas', '',
              '- Con socios de búsqueda: ' + (', '.join(c['socios_busqueda']) or 'ninguna'),
              '- De búsqueda con red de Display: ' + (', '.join(c['display_en_busqueda']) or 'ninguna'),
              '- Segmentación "presencia o interés" (incluye gente fuera de la zona): ' + (', '.join(c['presencia_o_interes']) or 'ninguna'), '']
    if 'ubicacion' in x:
        L += ['### Presencia vs. interés', ''] + tabla('Tipo de ubicación', x['ubicacion'])
    if 'dispositivos' in x:
        L += ['### Dispositivos', ''] + tabla('Dispositivo', x['dispositivos'])
    if 'horarios' in x:
        hs = x['horarios']
        L += ['### Días y horas', ''] + tabla('Día', hs['dias'])
        if hs['horas_sin_conv']:
            L += ['- Horas con gasto y cero conversiones: ' + ', '.join('%sh (%s)' % (h, fmt_dinero(c)) for h, c in hs['horas_sin_conv']), '']
    if 'paginas' in x:
        L += ['### Páginas de destino', '', '| Página | Gasto | Conv. | CPA | Velocidad móvil |', '|---|---:|---:|---:|---:|']
        for p in x['paginas']:
            L.append('| %s | %s | %.1f | %s | %s |' % (p['clave'], fmt_dinero(p['coste']), p['conv'],
                                                     fmt_cpa(p['coste'], p['conv'], m), p['velocidad'] or '—'))
        L.append('')
    if 'anuncios' in x:
        a = x['anuncios']
        L += ['### Anuncios y políticas', '', '| Estado de aprobación | Anuncios | Gasto | Conv. |', '|---|---:|---:|---:|']
        for e in a['por_estado']:
            L.append('| %s | %d | %s | %.1f |' % (e['clave'], e['n'], fmt_dinero(e['coste']), e['conv']))
        if a['temas']:
            L.append('\n- Temas de políticas más frecuentes: ' + ', '.join('%s (%d)' % kv for kv in a['temas']))
        L += ['- Anuncios con fuerza baja: %d' % a['fuerza_baja'], '']
    if 'llamadas' in x:
        ll = x['llamadas']
        L += ['### Llamadas', '', '- %d llamadas; %d de 60 s o más; %d perdidas.' % (ll['n'], ll['de_60s_o_mas'], ll['perdidas']), '']
    return L


def escribir_csvs(resultados, pares, salida):
    with open(os.path.join(salida, 'negativas_a_revisar.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['cuenta', 'termino', 'coste', 'clics', 'motivo'])
        for r in resultados:
            t = r.get('terminos')
            if not t:
                continue
            for termino, coste, clics in t['desperdicio']['top']:
                w.writerow([r['cuenta'], termino, round(coste, 2), int(clics), 'gastó al menos un CPA promedio sin convertir; revisar intención antes de excluir'])
    with open(os.path.join(salida, 'keywords_candidatas.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['cuenta', 'termino', 'coste', 'conversiones', 'cpa', 'campana', 'grupo'])
        for r in resultados:
            for c in r.get('terminos', {}).get('candidatas', []):
                w.writerow([r['cuenta'], c['termino'], round(c['coste'], 2), round(c['conv'], 2),
                            round(c['cpa'], 2), c['campana'], c['grupo']])
    with open(os.path.join(salida, 'canibalizacion_cuentas.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.writer(f)
        w.writerow(['cuenta_a', 'cuenta_b', 'termino', 'coste_a', 'conv_a', 'coste_b', 'conv_b'])
        for p in pares:
            for t, ca, va, cb, vb in p['top']:
                w.writerow([p['a'], p['b'], t, round(ca, 2), round(va, 2), round(cb, 2), round(vb, 2)])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--datos', required=True, help='carpeta con los CSV (una subcarpeta por cuenta)')
    ap.add_argument('--config', help='JSON con marcas, competidores, temas y patrones de negativas')
    ap.add_argument('--salida', default='auditoria-salida', help='carpeta de resultados')
    args = ap.parse_args()

    cfg = dict(CONFIG_BASE)
    if args.config:
        with open(args.config, encoding='utf-8') as f:
            extra = json.load(f)
        if 'negativos' in extra:
            cfg['negativos'] = dict(CONFIG_BASE['negativos'], **extra.pop('negativos'))
        cfg.update(extra)

    cuentas, ignorados = cargar(args.datos)
    if not cuentas:
        sys.exit('No encontré informes reconocibles en %s. Revisa references/exportaciones.md.' % args.datos)

    resultados = [analizar_cuenta(n, d, cfg) for n, d in sorted(cuentas.items())]
    pares = canibalizacion(resultados)

    os.makedirs(args.salida, exist_ok=True)
    with open(os.path.join(args.salida, 'informe.md'), 'w', encoding='utf-8') as f:
        f.write(informe(resultados, pares, cfg, ignorados))
    escribir_csvs(resultados, pares, args.salida)
    for r in resultados:
        r.get('terminos', {}).pop('_por_termino', None)
    with open(os.path.join(args.salida, 'hallazgos.json'), 'w', encoding='utf-8') as f:
        json.dump({'cuentas': resultados, 'canibalizacion': [dict(p, top=p['top'][:25]) for p in pares]},
                  f, ensure_ascii=False, indent=1, default=str)

    print('Cuentas: %s' % ', '.join('%s (%s)' % (n, ', '.join(sorted(d))) for n, d in sorted(cuentas.items())))
    print('Listo: %s' % os.path.abspath(args.salida))


if __name__ == '__main__':
    main()
