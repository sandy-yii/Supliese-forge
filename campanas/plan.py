# Plan de campañas de arranque del grupo Supliese, con los cambios de la junta del 11 de octubre de 2026.
#
# Notación de palabras clave y negativas:
#   [texto]   exacta
#   "texto"   frase
#   texto     amplia (solo se usa en negativas)
#
# Las negativas no cubren variantes (acentos, plurales). El generador agrega solo la versión sin acentos;
# los plurales se escriben a mano.

CUENTAS = {}

# Horario en que se muestra el botón de llamada (hora de la cuenta). Fuera de este horario el anuncio sale sin el botón.
# Atención de 9 a 18 h (dicho el 22 oct). Si atienden sábado, agregar sabado=dict(desde=9, hasta=18).
HORARIO_LLAMADAS = dict(dias=['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'], desde=9, hasta=18)

# ---------------------------------------------------------------- Gamesail
CUENTAS['gamesail'] = dict(
    nombre='Gamesail', id='118-347-6484', id_anterior='645-094-0317', mensual=19700,  # cuenta nueva desde el 26 oct (AW-18531600046)
    telefono='33 1185 9797',  # botón de llamada de los anuncios (lista de Rodolfo, 21 oct)
    url='https://gamesail.mx/',  # página nueva desde el 22 oct; antes https://gamesail-lavadoras.vercel.app/
    mismo_sitio=['gamesail-lavadoras.vercel.app'],  # versión anterior del mismo sitio: se conserva la sección
    nota='Cuenta nueva. Equipo industrial: lavadoras para ropa y sábanas, capacidades, secadoras, hoteles y hospitales, mangles.',
    comunes=['Equipo Gamesail', 'Cotiza con un Asesor', 'Solicita tu Cotización'],
    negativas={
        'Doméstico': ['doméstica', 'domésticas', 'casera', 'caseras', '"para casa"', '"de casa"', '"carga frontal"',
                      'mabe', 'easy', 'samsung', 'whirlpool', 'lg', '"8 kg"', '"9 kg"', '"10 kg"', '"12 kg"'],
        'Marcas que no se venden aquí': ['battistella', 'tolkar', 'fagor', '"speed queen"', 'ipso', 'alliance', 'girbau',
                                         'maytag', 'huebsch', 'milnor'],
        'Lavado por encargo, no venta': ['tintorería', 'tintorerías', '"cerca de mí"', '"cerca de mi"'],
        'Usado y renta': ['usada', 'usadas', 'usado', 'usados', 'seminueva', 'seminuevas', '"segunda mano"', 'remate',
                          'renta', 'alquiler', 'arrendamiento'],
        'Información, no compra': ['empleo', 'vacante', 'vacantes', 'curso', 'cursos', 'manual', 'pdf', '"cómo hacer"'],
        'Territorio de Servicio para Lavandería': ['refacciones', 'refacción', 'partes', 'repuestos', 'reparación',
                                                   'mantenimiento', 'servicio', 'técnico'],
        'Territorio de Quick Laundry': ['"poner una lavandería"', '"abrir una lavandería"', '"negocio de lavandería"',
                                        'franquicia', 'franquicias', 'autoservicio', 'monedas', '"semi industrial"',
                                        '"semi industriales"', 'semindustrial', 'supliese', '"quick laundry"'],
        'Territorio de CLM': ['túnel', 'clm', 'kingstar', '"king star"', '"40 kg"', '"40 kilos"', '"45 kg"', '"45 kilos"', '"60 kg"', '"60 kilos"',
                              '"lavadora industrial 100 kg"', '"lavadoras industriales 100 kg"', '"lavadora de 100 kilos"',
                              '"lavadoras de 100 kilos"', '[lavandería hotelera]', '"lavandería para hospital"',
                              '"lavandería institucional"', '[mangle industrial]', '"mangle de planchado"',
                              '"planchadora de rodillo"'],
        'Lavado de autos': ['autos', 'carros', 'coches', 'autolavado', '"car wash"', 'carwash', 'vehículos'],
    },
    campanas=[
        dict(nombre='Lavadoras para ropa y sábanas', pct=30, cpc=14, origen='Cambio de la junta: menos genérico, énfasis en ropa y sábanas', grupos=[
            dict(nombre='Lavadoras industriales para ropa',
                 kw=['[lavadoras industriales]', '[lavadora industrial para ropa]', '"lavadora industrial para ropa"',
                     '"lavadoras industriales de ropa"', '"lavadora industrial de ropa"', '"lavadoras y secadoras industriales"'],
                 h=['Lavadoras Industriales', 'Lavadoras para Ropa', 'Para Ropa, Sábanas y Blancos', 'Lavadoras de 20 a 50 kg',
                    'Lavado de Ropa en Volumen', 'Lavadoras y Secadoras', 'Para Hoteles y Hospitales', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras industriales para ropa y sábanas, de 20 a 50 kg. Cotiza hoy con un asesor.',
                    'Equipo Gamesail para lavar ropa, sábanas y blancos en volumen. Te ayudamos a elegir.',
                    'Lavadoras y secadoras industriales para hoteles, hospitales y lavanderías de ropa.',
                    'Solicita tu cotización y elige la capacidad que necesita tu operación.'],
                 p=('lavadoras', 'ropa')),
            dict(nombre='Lavadoras para sábanas',
                 kw=['"lavadora industrial para sábanas"', '"lavadoras para sábanas"', '"lavadora de sábanas industrial"',
                     '"lavadora industrial para blancos"'],
                 h=['Lavadoras para Sábanas', 'Lavadora Industrial Sábanas', 'Sábanas, Toallas y Blancos',
                    'Lavadoras de 20 a 50 kg', 'Lavado de Blancos en Volumen', 'Para Hoteles y Hospitales', 'Lavadoras y Secadoras',
                    'Te Ayudamos a Elegir'],
                 d=['Lavadoras industriales para sábanas, toallas y blancos. Cotiza hoy con un asesor.',
                    'Equipo Gamesail para lavar blancos en volumen, de 20 a 50 kg. Te ayudamos a elegir.',
                    'Ideal para hoteles, hospitales y lavanderías que procesan sábanas todos los días.',
                    'Solicita tu cotización y elige la capacidad que necesita tu operación.'],
                 p=('lavadoras', 'sabanas')),
        ]),
        dict(nombre='Lavadoras por capacidad y precio', pct=18, cpc=12, origen='Plan', grupos=[
            dict(nombre='Lavadoras por capacidad',
                 kw=['[lavadora industrial 20 kg precio]', '[lavadora industrial 30 kg precio]', '[lavadora industrial 50 kg precio]',
                     '"lavadora industrial 20 kg"', '"lavadora industrial 30 kg"', '"lavadora industrial 50 kg"',
                     '"lavadoras industriales precio"', '"centro de lavado industrial"'],
                 h=['Lavadoras de 20, 30 y 50 kg', 'Lavadora Industrial 20 kg', 'Lavadora Industrial 30 kg',
                    'Lavadora Industrial 50 kg', 'Precios de Lavadoras', 'Cotiza por Capacidad', 'Para Ropa y Sábanas',
                    'Elige la Capacidad Ideal'],
                 d=['Lavadoras industriales de 20, 30 y 50 kg para ropa y sábanas. Pide el precio hoy.',
                    'Te ayudamos a elegir la capacidad según los kilos de ropa que lavas al día.',
                    'Equipo Gamesail para lavanderías, hoteles y hospitales. Cotiza con un asesor.',
                    'Solicita tu cotización con la capacidad que necesitas y recibe precio por equipo.'],
                 p=('lavadoras', 'capacidad')),
        ]),
        dict(nombre='Secadoras industriales', pct=18, cpc=14, origen='Cambio de la junta: secadoras de 50, 100, 130 y 200 kg', grupos=[
            dict(nombre='Secadoras para ropa',
                 kw=['"secadoras industriales de ropa"', '"secadoras industriales"', '[secadora industrial de ropa]',
                     '"secadora industrial para ropa"', '"secadora industrial para sábanas"'],
                 h=['Secadoras Industriales', 'Secadoras para Ropa', 'Secadoras de 50 a 200 kg', 'Para Ropa, Sábanas y Blancos',
                    'Secadoras para Sábanas', 'Para Hoteles y Hospitales', 'Lavadoras y Secadoras', 'Te Ayudamos a Elegir'],
                 d=['Secadoras industriales para ropa y sábanas de 50, 100, 130 y 200 kg. Cotiza hoy.',
                    'Equipo Gamesail para secar ropa y blancos en volumen. Te ayudamos a elegir.',
                    'Secadoras para hoteles, hospitales y lavanderías de ropa. Habla con un asesor.',
                    'Solicita tu cotización y elige la capacidad que necesita tu operación.'],
                 p=('secadoras', 'ropa')),
            dict(nombre='Secadoras por capacidad',
                 kw=['"secadora industrial 50 kg"', '"secadora industrial 100 kg"', '"secadora industrial 130 kg"',
                     '"secadora industrial 200 kg"', '"secadora de 100 kilos"', '"secadora de 200 kilos"',
                     '"secadora industrial 30 kg"'],
                 h=['Secadoras de 50 a 200 kg', 'Secadora Industrial 50 kg', 'Secadora Industrial 100 kg',
                    'Secadora Industrial 130 kg', 'Secadora Industrial 200 kg', 'Secadoras para Ropa', 'Cotiza por Capacidad',
                    'Elige la Capacidad Ideal'],
                 d=['Secadoras industriales de 50, 100, 130 y 200 kg para ropa y sábanas. Pide precio.',
                    'Te ayudamos a elegir la capacidad según los kilos de ropa que secas al día.',
                    'Equipo Gamesail para lavanderías, hoteles y hospitales. Cotiza con un asesor.',
                    'Solicita tu cotización con la capacidad que necesitas y recibe precio por equipo.'],
                 p=('secadoras', 'capacidad')),
        ]),
        dict(nombre='Hoteles y hospitales', pct=12, cpc=16,
             origen='Cambio de la junta: lavandería hotelera. Gamesail se queda con lavadoras y secadoras; CLM con la lavandería completa',
             grupos=[
            dict(nombre='Hoteles',
                 kw=['"lavadora industrial para hotel"', '"lavadoras para lavandería hotelera"', '"secadoras para lavandería hotelera"',
                     '"secadora industrial para hotel"', '"equipo para lavandería hotelera"'],
                 h=['Lavadoras para Hoteles', 'Lavandería Hotelera', 'Secadoras para Hoteles', 'Para Sábanas y Toallas',
                    'Lavado de Blancos en Volumen', 'Lavadoras de 20 a 50 kg', 'Secadoras de 50 a 200 kg', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras y secadoras industriales para la lavandería de tu hotel. Cotiza hoy.',
                    'Equipo Gamesail para sábanas, toallas y blancos en volumen. Te ayudamos a elegir.',
                    'Lavadoras de 20 a 50 kg y secadoras de 50 a 200 kg para hoteles de cualquier tamaño.',
                    'Solicita tu cotización y habla con un asesor sobre la operación de tu hotel.'],
                 p=('hoteles', 'lavanderia')),
            dict(nombre='Hospitales',
                 kw=['"lavadora industrial para hospital"', '"lavadoras para hospitales"', '"secadora industrial para hospital"'],
                 h=['Lavadoras para Hospitales', 'Secadoras para Hospitales', 'Para Sábanas y Batas', 'Lavado de Blancos en Volumen',
                    'Lavadoras de 20 a 50 kg', 'Secadoras de 50 a 200 kg', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras y secadoras industriales para la lavandería de tu hospital. Cotiza hoy.',
                    'Equipo Gamesail para sábanas, batas y blancos en volumen. Te ayudamos a elegir.',
                    'Lavadoras de 20 a 50 kg y secadoras de 50 a 200 kg para hospitales y clínicas.',
                    'Solicita tu cotización y habla con un asesor sobre tu operación.'],
                 p=('hospitales', 'lavadoras')),
        ]),
        dict(nombre='Mangles y planchado', pct=8, cpc=16, origen='Plan. «mangle industrial» pasa a CLM para no competir', grupos=[
            dict(nombre='Mangles',
                 kw=['"mangle planchador"', '"dobladora de ropa industrial"', '"calandria industrial"', '"mangle para sábanas"'],
                 h=['Mangle Planchador', 'Mangles para Sábanas', 'Dobladora de Ropa Industrial', 'Calandria Industrial',
                    'Planchado de Blancos', 'Para Hoteles y Hospitales', 'Te Ayudamos a Elegir'],
                 d=['Mangles planchadores y dobladoras para sábanas y blancos. Cotiza hoy con un asesor.',
                    'Equipo Gamesail para planchar y doblar ropa en volumen. Te ayudamos a elegir.',
                    'Para hoteles, hospitales y lavanderías que planchan sábanas todos los días.',
                    'Solicita tu cotización y elige el equipo que necesita tu operación.'],
                 p=('mangles', 'planchado')),
        ]),
        dict(nombre='Competencia depurada', pct=7, cpc=10,
             origen='Plan: solo marcas con buen costo y en exacta. Maytag pasa a Quick Laundry y Girbau a su cuenta',
             negativas=['teléfono', 'telefono', 'dirección', 'direccion', 'sucursal', 'sucursales', 'ubicación', 'horario',
                        'contacto', 'www', 'guadalajara', 'monterrey', 'cdmx', 'puebla', 'querétaro'],
             grupos=[
            dict(nombre='Marcas de la competencia',
                 kw=['[atlika lavadoras industriales]', '[lavadora industrial atlika]', '[servex lavadoras]', '[lavadora industrial servex]',
                     '[domus lavadora industrial]', '[wascomat lavadora industrial]', '[lorsa lavadora industrial]',
                     '[unimac lavadora industrial]', '[primus lavadora industrial]'],
                 h=['Lavadoras Industriales', 'Compara Antes de Comprar', 'Lavadoras para Ropa', 'Lavadoras de 20 a 50 kg',
                    'Secadoras de 50 a 200 kg', 'Para Ropa, Sábanas y Blancos', 'Te Ayudamos a Elegir'],
                 d=['Compara opciones antes de comprar. Lavadoras industriales para ropa y sábanas.',
                    'Equipo Gamesail de 20 a 50 kg y secadoras de 50 a 200 kg. Cotiza hoy con un asesor.',
                    'Lavadoras y secadoras industriales para hoteles, hospitales y lavanderías.',
                    'Solicita tu cotización y compara precio y capacidad con lo que ya viste.'],
                 p=('lavadoras', 'cotiza')),
        ]),
        dict(nombre='Marca Gamesail', pct=7, cpc=8, origen='Cambio de la junta: lavadoras Gamesail y secadoras Gamesail', grupos=[
            dict(nombre='Gamesail',
                 kw=['[gamesail]', '"gamesail méxico"', '[gamesail lavadoras industriales]'],
                 h=['Gamesail México', 'Lavadoras Industriales', 'Secadoras Industriales', 'Lavadoras de 20 a 50 kg',
                    'Secadoras de 50 a 200 kg', 'Para Ropa, Sábanas y Blancos', 'Sitio Oficial Gamesail'],
                 d=['Lavadoras y secadoras industriales Gamesail para ropa y sábanas. Cotiza hoy.',
                    'Lavadoras de 20 a 50 kg y secadoras de 50 a 200 kg. Habla con un asesor.',
                    'Equipo para hoteles, hospitales y lavanderías de ropa. Te ayudamos a elegir.',
                    'Solicita tu cotización y elige la capacidad que necesita tu operación.'],
                 p=('gamesail', 'equipo')),
            dict(nombre='Lavadoras Gamesail',
                 kw=['"lavadoras gamesail"', '"lavadora gamesail"'],
                 h=['Lavadoras Gamesail', 'Lavadora Industrial Gamesail', 'Lavadoras de 20 a 50 kg', 'Para Ropa, Sábanas y Blancos',
                    'Sitio Oficial Gamesail', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras industriales Gamesail de 20 a 50 kg para ropa y sábanas. Cotiza hoy.',
                    'Elige la capacidad según los kilos de ropa que lavas al día. Habla con un asesor.',
                    'Para hoteles, hospitales y lavanderías de ropa. Solicita tu cotización.'],
                 p=('lavadoras', 'gamesail')),
            dict(nombre='Secadoras Gamesail',
                 kw=['"secadoras gamesail"', '"secadora gamesail"'],
                 h=['Secadoras Gamesail', 'Secadora Industrial Gamesail', 'Secadoras de 50 a 200 kg', 'Para Ropa, Sábanas y Blancos',
                    'Sitio Oficial Gamesail', 'Te Ayudamos a Elegir'],
                 d=['Secadoras industriales Gamesail de 50, 100, 130 y 200 kg. Cotiza hoy.',
                    'Elige la capacidad según los kilos de ropa que secas al día. Habla con un asesor.',
                    'Para hoteles, hospitales y lavanderías de ropa. Solicita tu cotización.'],
                 p=('secadoras', 'gamesail')),
        ]),
    ],
    salen=['Refacciones Gamesail (8%): pasa a Servicio para Lavandería',
           '[lavadoras semi industriales]: es territorio de Quick Laundry',
           '«lavadoras industriales para negocio» y «lavadora industrial» en frase: demasiado genéricas',
           '[maytag lavadora industrial]: Maytag la vende Quick Laundry',
           '«mangle industrial»: pasa a CLM'],
    cambios_actuales=[],
    activacion=dict(anteriores='MITAD'),
)

# ---------------------------------------------------------------- Quick Laundry (cuenta Supliese Gómez)
CUENTAS['quick-laundry'] = dict(
    # 30 oct (junta): las páginas regresan al dominio de siempre del cliente, que Google ya conoce. Cuando Rodolfo confirme
    # que ya muestra las páginas nuevas, se corre salida/quick-laundry/migrar-a-….js y luego aplicado=True.
    migrar=dict(url='https://supliese.com/', aplicado=False),
    subir_topes=False,  # 28 oct: no subir el costo por clic («más leads» ya no sube topes en esta cuenta)
    nombre='Quick Laundry (cuenta Supliese Gómez)', id='256-397-2201', mensual=12000,
    telefono='33 2601 2237',  # botón de llamada de los anuncios (lista de Rodolfo, 21 oct)
    url='https://quicklaundry.store/',  # desde el 22 oct; antes https://www.supliese.com/
    # 23 oct: «Modelo de Negocio» pagaba $15.54 por clic contra $4.29 de las nuevas; su dinero pasa a las dos nuevas
    # que se queda sin presupuesto (Equipo pierde 65% el 22 oct y 26% el 25). +50% ahora.
    # 26 oct: más leads. Emprendimiento y Autoservicio gastan 174-194% de su presupuesto: +20%.
    # 27 oct: más leads, sin pausar nada (decisión de la usuaria: «Search Marcas» sigue encendida con sus $95).
    # El espacio que queda hasta el tope de $12,000 ($395 al día) va a lo que más trae: Equipo para lavandería (se queda
    # sin presupuesto), Emprendimiento (gasta 161% del suyo) y la marca, que pide salir hasta arriba.
    # 27 oct (2): se vuelve a encender «Modelo de Negocio» (10 conversaciones de WhatsApp en 30 días, con el número de Liliana).
    # Cubre lo mismo que Emprendimiento, que baja; Secadoras y Marcas comerciales casi no tienen búsquedas. Total $394 = tope.
    # 27 oct (3): Equipo se queda sin presupuesto (pierde 33%) con clic a $6; Secadoras y Marcas comerciales no gastaron nada.
    # 28 oct: página de lavadoras de monedas que publicó Rodolfo («página mala» en «lavadora de monedas»).
    paginas={'Autoservicio y monedas > Autoservicio': 'https://quicklaundry.store/lavadoras-de-monedas'},
    # 28 oct: se ejecutó «bajar el costo por clic» (sesión del tablero): pausó «Campaña Modelo de Negocio», dejó a la
    # mitad «Campaña Search Marcas» y pasó ese dinero a Equipo para lavandería. Para no deshacerlo, «ajustes» ya no
    # enciende Modelo de Negocio ni toca el presupuesto de Equipo, Secadoras y Marcas comerciales.
    # 31 oct (vaciado del 20 al 30 oct): «Modelo de Negocio» trajo 6 contactos a $145 cada uno, igual que Equipo ($142):
    # se vuelve a encender. Emprendimiento cubre lo mismo y trajo 1 a $443: baja a $10. Sandy pidió no gastar más: Modelo
    # se paga con lo que bajan Emprendimiento, Secadoras y Marcas comerciales; Equipo se queda igual. Total $370 al día.
    ajustes=dict(presupuesto={'Equipo para lavandería': 226, 'Emprendimiento': 10, 'Autoservicio y monedas': 34,
                              'Secadoras para lavandería': 3, 'Marcas comerciales': 3, 'Marca Quick Laundry': 14},
                 arriba={'Marca Quick Laundry': dict(cuota=0.8, tope=10)},
                 activar={'Campaña Modelo de Negocio': 45},
                 presencia=['Campaña Search Marcas']),
    # 27 oct (3): Google califica «anuncio poco relevante» en lavadoras para negocio / para lavanderías / industriales para
    # lavandería / y secadoras para lavandería. Se agrega un segundo anuncio que repite esas búsquedas; el que ya hay se queda.
    anuncios_nuevos={'Equipo para lavandería > Lavadoras para lavandería': dict(
        h=['Lavadoras para Lavanderías', 'Lavadoras para Negocio', 'Lavadoras Industriales', 'Lavadoras y Secadoras',
           'Equipo para Lavandería', 'Precios de Lavadoras', 'Lavadoras para tu Negocio', 'Lavadora Industrial',
           'Cotiza por WhatsApp', 'Pide tu Precio Hoy', 'Para Lavandería Comercial', 'Quick Laundry', 'Te Ayudamos a Elegir'],
        d=['Lavadoras para lavandería y para negocio, industriales y semi industriales. Cotiza hoy.',
           'Lavadoras y secadoras para lavandería. Te damos precio y te ayudamos a elegir.',
           'Equipo para lavandería nueva o que va a crecer. Escríbenos por WhatsApp y cotiza.',
           'Quick Laundry: lavadoras industriales para lavandería con asesoría para elegir.'],
        p=('lavadoras', 'negocio'))},
    subir=False, subir_porque='hoy ya sube con «ajustes» (Equipo, Emprendimiento y la marca, hasta el tope)',
    nota='Marca nueva Quick Laundry en los anuncios; se sigue pujando por «supliese». Negocio de lavandería: equipo comercial, emprendimiento y autoservicio.',
    comunes=['Quick Laundry', 'Cotiza con un Asesor', 'Solicita tu Cotización'],
    negativas={
        'Franquicias (junta)': ['franquicia', 'franquicias', 'franchise', 'franquiciatario'],
        'Territorio de Gamesail': ['hotel', 'hoteles', 'hotelera', 'hospital', 'hospitales', 'clínica', 'mangle', 'mangles',
                                   'planchadora', 'dobladora', 'calandria', 'gamesail', '"50 kg"', '"50 kilos"', '"100 kg"',
                                   '"100 kilos"', '"130 kg"', '"200 kg"'],
        'Territorio de CLM': ['túnel', 'clm', 'kingstar', '"king star"', '"60 kg"'],
        'Territorio de Girbau': ['girbau'],
        'Territorio de Servicio para Lavandería': ['refacciones', 'refacción', 'partes', 'repuestos', 'reparación',
                                                   'mantenimiento', 'servicio'],
        'Cadenas de lavandería': ['lavax', '"lava 1"', 'aquamatic', '5asec', '"cerca de mí"', '"cerca de mi"'],
        'Usado y renta': ['usada', 'usadas', 'usado', 'usados', 'seminueva', 'seminuevas', 'remate', 'renta', 'alquiler'],
        'Información, no compra': ['empleo', 'vacante', 'vacantes', 'curso', 'cursos', 'pdf', 'manual', 'gratis'],
        'Doméstico': ['"para casa"', 'doméstica', 'domésticas', 'mabe', 'samsung', 'whirlpool', '"carga frontal"'],
    },
    campanas=[
        dict(nombre='Equipo para lavandería', pct=40, cpc=8, origen='Plan; recibe parte del presupuesto de Franquicias', grupos=[
            dict(nombre='Lavadoras para lavandería',
                 kw=['"lavadoras para lavanderías"', '"lavadoras industriales para lavandería"', '[lavadoras para lavandería precios]',
                     '[lavadoras para negocio]', '"lavadoras y secadoras para lavandería"', '"equipo para lavandería"'],
                 h=['Equipo para Lavanderías', 'Lavadoras para Lavandería', 'Lavadoras y Secadoras', 'Equipo Comercial',
                    'Precios de Equipo', 'Equipa tu Lavandería', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras y secadoras para lavandería. Te ayudamos a elegir el equipo. Cotiza hoy.',
                    'Equipo comercial y semi industrial para lavanderías nuevas o que van a crecer.',
                    'Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo y capacidad.',
                    'Solicita tu cotización y recibe precio del equipo que necesita tu lavandería.'],
                 p=('equipo', 'lavanderia')),
            dict(nombre='Semi industrial',
                 kw=['"lavadoras semi industriales"', '"lavadora semi industrial"', '"lavadora comercial"'],
                 h=['Lavadoras Semi Industriales', 'Lavadora Comercial', 'Equipo para Lavanderías', 'Lavadoras y Secadoras',
                    'Equipa tu Lavandería', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras semi industriales y comerciales para lavandería. Cotiza hoy.',
                    'Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo y capacidad.',
                    'Solicita tu cotización y recibe precio del equipo que necesita tu lavandería.'],
                 p=('lavadoras', 'comerciales')),
        ]),
        dict(nombre='Emprendimiento', pct=25, cpc=7,
             origen='Plan, sin «cuánto cuesta poner una lavandería» (junta: trae preguntones)',
             negativas=['"cuanto cuesta"', '"cuánto cuesta"', '"cuanto cuestan"', '"cuánto cuestan"', '"cuanto se necesita"',
                        '"cuánto se necesita"', '"cuanto se invierte"', '"cuánto se invierte"', '"cuanto dinero"',
                        '"cuánto dinero"', '"cuanto gana"', '"cuánto gana"', '"cuanto deja"', '"cuánto deja"'],
             grupos=[
            dict(nombre='Abrir una lavandería',
                 kw=['"abrir una lavandería"', '"poner una lavandería"', '"abrir mi lavandería"', '"poner mi lavandería"'],
                 h=['Abre tu Lavandería', 'Pon tu Propia Lavandería', 'Asesoría para tu Lavandería', 'Equipo para tu Lavandería',
                    'Te Ayudamos a Planearla', 'Elige el Equipo Correcto', 'Lavadoras y Secadoras'],
                 d=['Te asesoramos para elegir el equipo de tu lavandería según tu espacio y tu plan.',
                    'Quick Laundry: lavadoras y secadoras para abrir tu lavandería, con asesoría.',
                    'Platica con un asesor sobre el local, el equipo y los pasos para abrir tu lavandería.',
                    'Solicita tu cotización de equipo para tu lavandería nueva.'],
                 p=('lavanderia', 'abrir')),
        ]),
        dict(nombre='Autoservicio y monedas', pct=14, cpc=7, origen='Plan; recibe parte del presupuesto de Franquicias', grupos=[
            dict(nombre='Autoservicio',
                 kw=['[lavadoras de monedas]', '[equipo para lavandería autoservicio]', '"lavadoras de autoservicio"',
                     '"lavadora para lavandería autoservicio"', '"lavadora de monedas"', '"secadora de monedas"'],
                 h=['Lavadoras de Monedas', 'Equipo para Autoservicio', 'Lavandería de Autoservicio', 'Secadoras de Monedas',
                    'Lavadoras y Secadoras', 'Equipa tu Lavandería', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras y secadoras de monedas para lavandería de autoservicio. Cotiza hoy.',
                    'Quick Laundry: equipo para autoservicio con asesoría para elegir modelo.',
                    'Equipa tu lavandería de autoservicio con lavadoras y secadoras comerciales.',
                    'Solicita tu cotización y recibe precio del equipo para tu autoservicio.'],
                 p=('autoservicio', 'monedas')),
        ]),
        dict(nombre='Secadoras para lavandería', pct=8, cpc=8, origen='Plan, más secadoras semi industriales', grupos=[
            dict(nombre='Secadoras para lavandería',
                 kw=['"secadora de ropa para lavandería"', '"secadora lavandería"', '"secadora semi industrial"',
                     '"secadoras semi industriales"'],
                 h=['Secadoras para Lavandería', 'Secadoras Semi Industriales', 'Secadora Comercial', 'Lavadoras y Secadoras',
                    'Equipa tu Lavandería', 'Te Ayudamos a Elegir'],
                 d=['Secadoras de ropa para lavandería, comerciales y semi industriales. Cotiza hoy.',
                    'Quick Laundry: equipo para tu lavandería con asesoría para elegir modelo.',
                    'Solicita tu cotización y recibe precio de la secadora que necesitas.'],
                 p=('secadoras', 'lavanderia')),
        ]),
        dict(nombre='Marcas comerciales', pct=8, cpc=7, origen='Plan sin Girbau (tiene cuenta propia)',
             negativas=['teléfono', 'telefono', 'dirección', 'direccion', 'sucursal', 'servicio'],
             grupos=[
            dict(nombre='Maytag y LG',
                 kw=['"lavadora maytag industrial"', '"lavadora maytag comercial"', '"lg lavadora industrial"',
                     '"lavadora lg comercial"'],
                 h=['Lavadoras Comerciales', 'Equipo para Lavanderías', 'Lavadoras y Secadoras', 'Equipa tu Lavandería',
                    'Precios de Equipo', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras y secadoras comerciales para lavandería. Cotiza hoy con un asesor.',
                    'Quick Laundry: equipo comercial para tu lavandería con asesoría para elegir modelo.',
                    'Solicita tu cotización y recibe precio del equipo que necesita tu lavandería.'],
                 p=('lavadoras', 'comerciales')),
        ]),
        dict(nombre='Marca Quick Laundry', pct=5, cpc=6,
             origen='Marca nueva; se conserva «supliese» para quien busca el nombre anterior',
             negativas=['"precio por kilo"', '"por kilo"', '"servicio de lavado"', 'domicilio', 'horario', 'horarios'],
             grupos=[
            dict(nombre='Quick Laundry',
                 kw=['[quick laundry]', '"quick laundry méxico"', '[quicklaundry]', '"quick laundry equipo"'],
                 h=['Quick Laundry', 'Quick Laundry México', 'Equipo para Lavanderías', 'Lavadoras y Secadoras',
                    'Antes Supliese', 'Te Ayudamos a Elegir'],
                 d=['Quick Laundry, antes Supliese: equipo para lavanderías. Cotiza hoy con un asesor.',
                    'Lavadoras y secadoras comerciales para abrir o equipar tu lavandería.',
                    'Solicita tu cotización y recibe precio del equipo que necesita tu lavandería.'],
                 p=('quick', 'laundry')),
            dict(nombre='Supliese',
                 kw=['[supliese]', '"supliese"', '[supliese gómez]'],
                 h=['Supliese Ahora es', 'Quick Laundry', 'Equipo para Lavanderías', 'Lavadoras y Secadoras',
                    'Antes Supliese', 'Te Ayudamos a Elegir'],
                 d=['Supliese ahora es Quick Laundry: el mismo equipo para lavanderías. Cotiza hoy.',
                    'Lavadoras y secadoras comerciales para abrir o equipar tu lavandería.',
                    'Solicita tu cotización y recibe precio del equipo que necesita tu lavandería.'],
                 p=('quick', 'laundry')),
        ]),
    ],
    salen=['Franquicias (10%): sale por la junta; «franquicia» queda como negativa en toda la cuenta',
           '[cuánto cuesta poner una lavandería]: sale por la junta; además se bloquea en Emprendimiento',
           '«lavadora industrial girbau precios»: Girbau tiene cuenta propia',
           '«secadoras para lavanderías»: costaba $99 por conversión'],
    cambios_actuales=['Pausar las palabras clave que contienen «franquicia» (grupo Franquicias de lavanderías, campaña Modelo de Negocio) — pedido en la junta',
                      'Pausar «cuánto cuesta poner una lavandería» si existe en las campañas actuales',
                      'Al activar: bajar las campañas actuales a la mitad de su presupuesto'],
    activacion=dict(anteriores='MITAD',
                    pausar_palabras=['franquicia', 'cuánto cuesta poner una lavandería'],
                    pausar_nombres=['competencia']),
)

# ---------------------------------------------------------------- CLM
CUENTAS['clm'] = dict(
    # 30 oct (junta): las páginas regresan al dominio de siempre del cliente, que Google ya conoce. Cuando Rodolfo confirme
    # que ya muestra las páginas nuevas, se corre salida/clm/migrar-a-….js y luego aplicado=True.
    migrar=dict(url='https://clmmexico.com/', aplicado=False),
    subir_topes=False,  # 28 oct: no subir el costo por clic («más leads» ya no sube topes en esta cuenta)
    nombre='CLM', id='993-525-8739', mensual=18700,
    telefono='33 1564 1538',  # botón de llamada de los anuncios (lista de Rodolfo, 21 oct)
    url='https://kingstar.com.mx/',
    # 26 oct: más leads dentro del tope de la cuenta ($18,700). Alta capacidad gastó 98% y perdió 32% por presupuesto ayer;
    # Lavandería hotelera usó 0 a 16% del suyo. +20% a una con dinero de la otra.
    # 27 oct: «Marca CLM» pide salir arriba y se quedaba sin presupuesto (pierde 90%): sube con dinero de Lavandería
    # hotelera, que casi no usa el suyo. Así la cuenta también queda justo en su tope ($615 al día).
    # 27 oct: Gamesail no tiene anuncios (falta su forma de pago) y nadie del grupo atiende sus búsquedas de equipo grande.
    # Mientras tanto las atiende Kingstar con el presupuesto que ya tiene y no usa. Al encender Gamesail: aplicado=False.
    preparado=dict(
        aplicado=True,   # ejecutado en la cuenta el 27 oct, sin errores
        titulo='Cubrir las búsquedas de Gamesail mientras arranca', archivo='cubrir-gamesail',
        quitar_negativas=['Territorio de Gamesail (equipo grande)'],
        grupos={
            'Alta capacidad 60 kg o más': [
                dict(nombre='Secadoras de alta capacidad',
                     kw=['"secadora industrial 100 kg"', '"secadoras de 100 kilos"', '"secadora industrial 130 kg"',
                         '"secadora industrial 200 kg"', '"secadoras industriales de alta capacidad"', '"secadora industrial 50 kg"'],
                     h=['Secadoras Industriales', 'Secadoras de 100 a 200 kg', 'Secadora Industrial 100 kg', 'Alta Capacidad',
                        'Para Lavandería Industrial', 'Te Ayudamos a Elegir'],
                     d=['Secadoras industriales de alta capacidad, de 50 a 200 kg. Cotiza hoy.',
                        'Equipo para lavanderías industriales, hoteles y hospitales de gran volumen.',
                        'Solicita tu cotización y habla con un asesor sobre la capacidad que necesitas.'],
                     p=('secadoras', 'industriales'))],
            'Lavandería hotelera e institucional': [
                dict(nombre='Lavadoras para hotel y hospital',
                     kw=['"lavadora industrial para hotel"', '"lavadoras industriales para hotel"', '"lavadoras para lavandería hotelera"',
                         '"lavadora industrial para hospital"', '"lavadoras para hospitales"', '"lavadora industrial 50 kg"'],
                     h=['Lavadoras para Hotel', 'Lavadoras para Hospital', 'Lavadora Industrial 50 kg', 'Equipo de Alta Capacidad',
                        'Lavandería Hotelera', 'Te Ayudamos a Elegir'],
                     d=['Lavadoras industriales para hoteles y hospitales, de alta capacidad. Cotiza hoy.',
                        'Te ayudamos a elegir el equipo según los kilos de ropa que procesas al día.',
                        'Solicita tu cotización y habla con un asesor sobre tu proyecto.'],
                     p=('lavadoras', 'hotel'))]}),
    # 27 oct (3): Mangles, Hotelera y 20 a 45 kg ya pagan casi su tope por clic y pierden 44-69% de las búsquedas por puja,
    # gastando menos de la mitad de su presupuesto (los topes ya no se suben: ver 28 oct abajo). Túnel trajo un
    # WhatsApp con 2 clics y se queda sin presupuesto: recibe $30 de Marca CLM, que casi no tiene búsquedas.
    # 28 oct: páginas por tipo de equipo que publicó Rodolfo («página mala» en Google). Cada grupo lleva a la suya; lo demás, a la de inicio.
    paginas={'Alta capacidad 60 kg o más > Lavadoras de alta capacidad': 'https://kingstar.com.mx/lavadoras-alta-capacidad',
             'Mangles y planchado > Mangles': 'https://kingstar.com.mx/mangles'},
    # 31 oct (vaciado del 20 al 30 oct): Alta capacidad (5 contactos) y Túnel (2, pierde 24% por presupuesto) sí gastan su
    # presupuesto; Mangles (3 contactos a $66) gasta unos $18 al día porque lo frena la puja, no el dinero; 20 a 45 kg (0
    # contactos), Hotelera (1) y Marca (sin gasto) no usan el suyo. Se mueve a las que lo gastan. Total $615 = tope.
    ajustes=dict(presupuesto={'Alta capacidad 60 kg o más': 280, 'Túnel de lavado': 110, 'Lavandería hotelera e institucional': 80,
                              'Lavadoras y secadoras de 20 a 45 kg': 50, 'Mangles y planchado': 60, 'Marca CLM': 35},
                 # 28 oct: «bajar el costo por clic» regresó Hotelera a $18 y 20 a 45 kg a $15 (el tope del plan). Ya no se
                 # suben topes en esta cuenta: el lugar se gana con las páginas nuevas, no pagando más por clic.
                 # 27 oct: quien busca «clm» o «kingstar» ya quiere la marca: sale hasta arriba
                 arriba={'Marca CLM': dict(cuota=0.8, tope=15)}),
    mismo_sitio=['supliese-clm-lavadoras.vercel.app'],  # versión anterior del mismo sitio: se conserva la sección
    nota='Alta capacidad, lavandería hotelera e institucional completa, túnel de lavado para ropa, mangles, 20 a 45 kg.',
    comunes=['CLM México', 'Cotiza con un Asesor', 'Solicita tu Cotización'],
    negativas={
        'Lavado de autos (junta)': ['auto', 'autos', 'carro', 'carros', 'coche', 'coches', 'automóvil', 'automóviles',
                                    'vehículo', 'vehículos', 'camión', 'camiones', 'camioneta', 'camionetas', 'moto', 'motos',
                                    '"car wash"', 'carwash', 'autolavado', 'autolavados', '"auto lavado"', 'lavacoches',
                                    'tráiler', 'trailer', 'tráileres', 'encerado', 'detallado'],
        'Territorio de Quick Laundry': ['"poner una lavandería"', '"abrir una lavandería"', '"negocio de lavandería"',
                                        'franquicia', 'franquicias', 'autoservicio', 'monedas', 'supliese', '"quick laundry"'],
        'Territorio de Servicio para Lavandería': ['refacciones', 'refacción', 'partes', 'repuestos', 'reparación',
                                                   'mantenimiento', 'servicio'],
        'Territorio de Gamesail': ['gamesail', '"20 kg"', '"30 kg"', '"30 kilos"'],
        # Equipo grande de Gamesail. Mientras Gamesail no tenga anuncios, lo atiende Kingstar (preparado «cubrir-gamesail»);
        # cuando Gamesail se encienda, se pone aplicado=False en «preparado» y estas exclusiones vuelven solas.
        'Territorio de Gamesail (equipo grande)': ['"50 kg"', '"50 kilos"', '"130 kg"', '"200 kg"',
                                   '"secadora industrial 100 kg"', '"secadora de 100 kilos"', '"secadoras de 100 kilos"',
                                   '"lavadora industrial para hotel"', '"lavadoras industriales para hotel"',
                                   '"lavadoras para lavandería hotelera"', '"lavadora para lavandería hotelera"',
                                   '"secadoras para lavandería hotelera"', '"lavadora industrial para hospital"',
                                   '"lavadoras para hospitales"', '"mangle planchador"', 'dobladora', 'calandria',
                                   '"para sábanas"'],
        'Territorio de Girbau': ['girbau'],
        'Doméstico': ['"para casa"', 'doméstica', 'domésticas', 'mabe', 'samsung', 'whirlpool', 'lg', '"carga frontal"'],
        'Usado y renta': ['usada', 'usadas', 'usado', 'usados', 'seminueva', 'remate', 'renta', 'alquiler'],
        'Información, no compra': ['empleo', 'vacante', 'curso', 'cursos', 'manual', 'pdf'],
        # 23 oct: búsquedas reales que «Alta capacidad» atrajo y no son de 40 kg o más (lavadoras de casa de 15 a 28 kg)
        'Doméstico y capacidades chicas (23 oct)': ['hisense', '"fuzzy logic"', '"heavy duty"', 'cobija', 'cobijas', 'edredón',
                                                    'edredones', '"15 kg"', '"15 kilos"', '"20 kilos"', '"30kg"',
                                                    # 26 oct: siguen llegando 10, 22 y 25 kg; se excluye la capacidad en cualquier búsqueda
                                                    '"10 kg"', '"22 kg"', '"24 kg"', '"24kg"', '"25 kg"', '"26 kg"', '"28 kg"',
                                                    '"24 kilos"', '"25 kilos"', '"26 kilos"', '"28 kilos"'],
        # 27 oct: buscan un modelo de otra marca (Speed Queen, Dexter, Wascomat) o una lavadora de casa grande
        'Otras marcas y de casa (27 oct)': ['"speed queen"', 'dexter', 'wascomat', 'unimac', 'electrolux', 'primus', 'lorsa',
                                            'alliance', 'ipso', 'cobertor', 'cobertores', '"king size"', '[lavadora grande]',
                                            '[lavadoras grandes]', '[lavadora potente]',
                                            # 29 oct: siguen llegando otra marca y lavadoras chicas
                                            'domus', '"18 kg"', '"18 kilos"'],
    },
    campanas=[
        dict(nombre='Alta capacidad 60 kg o más', pct=30, cpc=18, origen='Plan', grupos=[
            dict(nombre='Lavadoras de alta capacidad',
                 kw=['"lavadoras de 100 kilos"', '"lavadora industrial 100 kg"', '"lavadora industrial 60 kg"',
                     '"lavadoras de alta capacidad"', '"lavadora industrial de alta capacidad"'],
                 h=['Lavadoras de Alta Capacidad', 'Lavadora Industrial 100 kg', 'Lavadora Industrial 60 kg',
                    'De 60 kg en Adelante', 'Lavandería Industrial', 'Proyectos de Lavandería', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras industriales de alta capacidad, de 60 kg en adelante. Cotiza hoy.',
                    'Equipo CLM para lavanderías industriales, hoteles y hospitales de gran volumen.',
                    'Te ayudamos a dimensionar la lavandería según los kilos que procesas al día.',
                    'Solicita tu cotización y habla con un asesor sobre tu proyecto.'],
                 p=('alta', 'capacidad')),
        ]),
        dict(nombre='Lavandería hotelera e institucional', pct=25, cpc=18,
             origen='Cambio de la junta: lavandería hotelera. CLM se queda con la lavandería completa; Gamesail con lavadoras sueltas',
             grupos=[
            dict(nombre='Lavandería hotelera',
                 kw=['[lavandería hotelera]', '"proyecto de lavandería hotelera"', '"lavandería industrial para hotel"',
                     '"lavandería para hotel"'],
                 h=['Lavandería Hotelera', 'Lavandería para Hoteles', 'Proyectos de Lavandería', 'Equipo de Alta Capacidad',
                    'Túnel de Lavado para Ropa', 'Mangles y Planchado', 'Te Ayudamos a Planearla'],
                 d=['Lavandería hotelera completa: lavado, secado y planchado de alta capacidad. Cotiza hoy.',
                    'CLM diseña y equipa la lavandería de tu hotel según los kilos que procesas al día.',
                    'Túnel de lavado, lavadoras de alta capacidad y mangles para hoteles.',
                    'Solicita tu cotización y habla con un asesor sobre tu proyecto.'],
                 p=('lavanderia', 'hotelera')),
            dict(nombre='Hospitales e institucional',
                 kw=['"lavandería para hospital"', '"lavandería hospitalaria"', '"lavandería institucional"'],
                 h=['Lavandería Hospitalaria', 'Lavandería Institucional', 'Proyectos de Lavandería', 'Equipo de Alta Capacidad',
                    'Túnel de Lavado para Ropa', 'Te Ayudamos a Planearla'],
                 d=['Lavandería para hospitales e instituciones: lavado, secado y planchado. Cotiza hoy.',
                    'CLM diseña y equipa tu lavandería según los kilos que procesas al día.',
                    'Solicita tu cotización y habla con un asesor sobre tu proyecto.'],
                 p=('lavanderia', 'hospital')),
        ]),
        dict(nombre='Mangles y planchado', pct=15, cpc=18, origen='Plan', grupos=[
            dict(nombre='Mangles',
                 kw=['"mangle de planchado"', '"mangle industrial"', '"planchadora de rodillo industrial"'],
                 h=['Mangle Industrial', 'Mangle de Planchado', 'Planchadora de Rodillo', 'Planchado de Alta Capacidad',
                    'Para Hoteles y Hospitales', 'Te Ayudamos a Elegir'],
                 d=['Mangles industriales y planchadoras de rodillo de alta capacidad. Cotiza hoy.',
                    'Equipo CLM para planchar sábanas y blancos en hoteles, hospitales y lavanderías.',
                    'Solicita tu cotización y habla con un asesor sobre tu operación.'],
                 p=('mangles', 'planchado')),
        ]),
        dict(nombre='Lavadoras y secadoras de 20 a 45 kg', pct=15, cpc=15,
             origen='Plan más 40 kg (junta). Sin 30 kg: es de Gamesail', grupos=[
            dict(nombre='20 a 45 kg',
                 kw=['"lavadoras y secadoras de 20 a 45 kg"', '"lavadora industrial 40 kg"', '"secadora industrial 40 kg"',
                     '"lavadora de 40 kilos"', '"lavadora industrial 45 kg"', '"secadora industrial 45 kg"'],
                 h=['Lavadora Industrial 40 kg', 'Secadora Industrial 40 kg', 'Lavadoras de 20 a 45 kg', 'Capacidad de 40 kg',
                    'Lavandería Industrial', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras y secadoras industriales de 20 a 45 kg, incluida la de 40 kg. Cotiza hoy.',
                    'Equipo CLM para lavanderías industriales, hoteles y hospitales.',
                    'Solicita tu cotización y habla con un asesor sobre la capacidad que necesitas.'],
                 p=('lavadoras', '40-kg')),
        ]),
        dict(nombre='Túnel de lavado', pct=10, cpc=30,
             origen='Plan más «túnel de lavado para ropa» (junta). Negativas de lavado de autos en toda la cuenta',
             grupos=[
            dict(nombre='Túnel de lavado para ropa',
                 kw=['"túnel de lavado industrial"', '"túnel de lavado para ropa"', '"túnel de lavado de ropa"',
                     '"lavadora de túnel"', '"sistema de lavado continuo"', '"túnel de lavado para hotel"',
                     '"túnel de lavado para lavandería"'],
                 h=['Túnel de Lavado para Ropa', 'Túnel de Lavado Industrial', 'Lavado Continuo de Ropa', 'Para Hoteles y Hospitales',
                    'Lavandería de Gran Volumen', 'Proyectos de Lavandería', 'Te Ayudamos a Planearlo'],
                 d=['Túnel de lavado para ropa: lavado continuo para lavanderías de gran volumen.',
                    'CLM diseña e instala túneles de lavado para hoteles, hospitales y lavanderías.',
                    'Te ayudamos a dimensionar el túnel según los kilos de ropa que procesas al día.',
                    'Solicita tu cotización y habla con un asesor sobre tu proyecto.'],
                 p=('tunel', 'ropa')),
        ]),
        dict(nombre='Marca CLM', pct=5, cpc=8, origen='Plan', grupos=[
            dict(nombre='CLM',
                 kw=['[clm méxico]', '[clmmexico]', '"clm lavandería"', '"clm lavadoras"', '"clm lavandería industrial"',
                     # 23 oct: el nombre nuevo de la marca
                     '[kingstar]', '"kingstar méxico"', '"kingstar lavadoras"', '"kingstar lavandería"', '"king star lavadoras"'],
                 h=['CLM México', 'Lavandería Industrial', 'Túnel de Lavado para Ropa', 'Equipo de Alta Capacidad',
                    'Sitio Oficial CLM', 'Te Ayudamos a Elegir'],
                 d=['CLM México: lavandería industrial, túnel de lavado y alta capacidad. Cotiza hoy.',
                    'Equipo para hoteles, hospitales y lavanderías de gran volumen.',
                    'Solicita tu cotización y habla con un asesor sobre tu proyecto.'],
                 p=('clm', 'lavanderia')),
        ]),
    ],
    salen=['Competencia (5%): sale por la junta; su presupuesto pasa a lavandería hotelera',
           '«lavadora industrial 30 kg»: es de Gamesail',
           '«lavadoras industriales para hoteles»: en el reparto por producto es de Gamesail',
           '[clm] solo: es una sigla ambigua; se usa «clm méxico» y «clm lavandería»'],
    cambios_actuales=['Si existe una campaña o grupo de competencia en la cuenta actual: pausarlo (pedido en la junta)',
                      'Al activar: bajar las campañas actuales a la mitad de su presupuesto'],
    activacion=dict(anteriores='MITAD', pausar_nombres=['competencia']),
)

# ---------------------------------------------------------------- Servicio para Lavandería
CUENTAS['servicio'] = dict(
    # 30 oct (junta): las páginas regresan al dominio de siempre del cliente, que Google ya conoce. Cuando Rodolfo confirme
    # que ya muestra las páginas nuevas, se corre salida/servicio/migrar-a-….js y luego aplicado=True.
    migrar=dict(url='https://servicioparalavanderias.com/', aplicado=False),
    subir_topes=False,  # 28 oct: no subir el costo por clic («más leads» ya no sube topes en esta cuenta)
    nombre='Servicio para Lavandería', id='265-909-2662', mensual=8200,
    telefono='33 1417 2994',  # botón de llamada de los anuncios (lista de Rodolfo, 21 oct)
    url='https://laundrysolutions.store/',
    mismo_sitio=['laundry-solutions-servicio.vercel.app'],  # versión anterior del mismo sitio: se conserva la sección
    nota='Servicio técnico, reparación y mantenimiento industrial. Refacciones solo Girbau y Gamesail.',
    comunes=['Servicio Técnico Industrial', 'Agenda tu Servicio', 'Habla con un Técnico'],
    # 28 oct: página de reparación que publicó Rodolfo («página mala» en «reparación de lavadoras industriales»).
    paginas={'Reparación y mantenimiento > Reparación': 'https://laundrysolutions.store/reparacion-lavadoras-industriales',
             'Reparación y mantenimiento > Mantenimiento correctivo': 'https://laundrysolutions.store/reparacion-lavadoras-industriales'},
    # 27 oct (3): «reparación de lavadoras industriales», la búsqueda con más volumen, tiene «anuncio poco relevante».
    # Segundo anuncio en el grupo que repite la búsqueda; el que ya hay se queda.
    anuncios_nuevos={'Reparación y mantenimiento > Reparación': dict(
        h=['Reparación Lavadora Industrial', 'Reparación de Lavadoras', 'Lavadoras Industriales', 'Reparamos tu Lavadora',
           'Técnicos en Reparación', 'Reparación en tu Negocio', 'Agenda tu Reparación', 'Diagnóstico de tu Equipo',
           'Habla con un Técnico', 'Servicio Técnico Industrial', 'Cotiza por WhatsApp'],
        d=['Reparación de lavadoras industriales con técnicos en equipo industrial. Agenda tu visita.',
           'Reparamos lavadoras industriales de lavanderías, hoteles y hospitales.',
           'Escríbenos por WhatsApp: te damos diagnóstico y cotización de la reparación.',
           'Reparación de lavadora industrial y mantenimiento correctivo. Habla con un técnico.'],
        p=('reparacion', 'industrial'))},
    # 26 oct: las amplias «técnico / reparación / mantenimiento lavadoras industriales» salían en búsquedas de COMPRA
    # («lavadoras industriales», «precio de lavadora industrial») y le subían el precio a Quick Laundry. Se pausan.
    # 31 oct: sin las amplias, Servicio se quedó sin búsquedas (0 clics el 28 y 29). Se vuelve a encender solo
    # «reparación lavadoras industriales» (amplia), ahora con más exclusiones de compra; técnico y mantenimiento siguen pausadas.
    ajustes=dict(pausar_palabras=[
        ['Servicio técnico industrial', 'Servicio técnico', 'técnico lavadoras industriales', 'BROAD'],
        ['Reparación y mantenimiento', 'Mantenimiento preventivo', 'mantenimiento lavadoras industriales', 'BROAD']],
        encender_palabras=[['Reparación y mantenimiento', 'Reparación', 'reparación lavadoras industriales', 'BROAD']],
        # La cuenta ya está en su tope mensual ($8,200): Reparación sube 20% con dinero que Servicio técnico no usaba
        # antes de las amplias (0 impresiones del 21 al 23 oct).
        # 27 oct: «subir» ya los llevó a 156 y 75; el plan queda igual para que «ajustes» no los regrese.
        presupuesto={'Reparación y mantenimiento': 156, 'Servicio técnico industrial': 75}),
    # PREPARADO, SIN APLICAR (27 oct): que Laundry Solutions venda refacciones de cualquier marca, no solo Girbau y
    # Gamesail. La venta de equipo nuevo se queda en las cuentas de Girbau y Gamesail (cuando un equipo no tiene arreglo,
    # el vendedor lo manda a esas páginas). Dentro de los $8,200. Se aplica con salida/servicio/preparado-refacciones-cualquier-marca.js.
    # Cuando ya se haya ejecutado en la cuenta, cambiar aplicado a True: así los scripts de todos los días lo incluyen
    # y no vuelven a poner las exclusiones de refacciones genéricas.
    preparado=dict(
        aplicado=False,
        titulo='Refacciones de cualquier marca (preparado, sin aplicar)', archivo='refacciones-cualquier-marca',
        quitar_negativas=['Partes genéricas (junta)'],
        grupos={'Refacciones Girbau y Gamesail': [
            dict(nombre='Refacciones industriales',
                 kw=['"refacciones para lavadora industrial"', '"refacciones para lavadoras industriales"',
                     '"refacciones para secadora industrial"', '"refacciones para secadoras industriales"',
                     '"partes para lavadora industrial"', '"partes para lavadoras industriales"',
                     '"refacciones lavandería industrial"', '"repuestos para lavadora industrial"'],
                 h=['Refacciones Industriales', 'Partes Lavadora Industrial', 'Refacciones para Secadoras',
                    'Para Lavadoras y Secadoras', 'Instalación por Técnicos', 'Cotiza tu Refacción',
                    'Te Ayudamos con la Pieza', 'Asesoría para Renovar Equipo'],
                 d=['Refacciones para lavadoras y secadoras industriales. Cotiza con un técnico.',
                    'Envíanos el modelo de tu equipo y te ayudamos a encontrar la pieza correcta.',
                    'Instalamos la refacción con nuestros técnicos para que tu equipo vuelva a trabajar.',
                    'Si tu equipo ya no tiene arreglo, te asesoramos para renovarlo con equipo nuevo.'],
                 p=('refacciones', 'industriales'))]}),
    negativas={
        'Compra de equipo, no servicio (26 oct)': ['[lavadoras industriales]', '[lavadora industrial]', '[lavadoras para lavanderia]',
                                                   '[lavadoras para lavandería]', '[lavadoras comerciales]',
                                                   '[lavadoras industriales precio]', '[lavadora industrial precio]',
                                                   '"precio de lavadora industrial"', '"precio de lavadoras industriales"',
                                                   '"precio lavadoras industriales"', '"costo lavadora industrial"',
                                                   '"costo de lavadora industrial"', '"costo de lavadoras industriales"',
                                                   '"cuánto cuesta una lavadora industrial"', '"cuánto cuestan las lavadoras industriales"',
                                                   '"cuánto vale una lavadora industrial"', '"para negocio"', '"commercial washer"',
                                                   # 31 oct: búsquedas de compra que entraron por la amplia el 26 oct
                                                   '[lavadora industrial de monedas]', '[lavadoras y secadoras industriales]',
                                                   '[maquinas lavanderia industrial]', '[lavadora ropa industrial]',
                                                   '[lavadora para lavanderia]', '[lavadoras para lavanderias autoservicio]',
                                                   '[maquinas para lavanderia autoservicio]', '"kg precio"',
                                                   '"comprar lavadora"', '"comprar lavadoras"'],
        'Partes genéricas (junta)': ['"partes para lavadora industrial"', '"partes para lavadoras industriales"',
                                     '"refacciones para lavadora industrial"', '"refacciones para lavadoras industriales"',
                                     '"refacciones para secadora industrial"', '"refacciones para secadoras industriales"',
                                     '"refacciones lavandería industrial"'],
        'Aprender a reparar': ['curso', 'cursos', 'tutorial', '"cómo reparar"', 'diagrama', 'diagramas', 'pdf', 'manual',
                               'manuales'],
        'Doméstico': ['mabe', 'samsung', 'whirlpool', 'lg', 'easy', '"de casa"', '"para casa"', 'doméstica', 'domésticas',
                      '"carga frontal"'],
        'Empleo': ['vacante', 'vacantes', 'empleo', 'trabajo', 'sueldo'],
        'Otras cuentas del grupo': ['franquicia', 'franquicias', '"poner una lavandería"', 'supliese', '"quick laundry"', 'clm', 'kingstar', '"king star"'],
    },
    campanas=[
        dict(nombre='Servicio técnico industrial', pct=32, cpc=15, origen='Plan', negativas='SERVICIO', grupos=[
            dict(nombre='Servicio técnico',
                 # Google rechaza las palabras que empiezan con «servicio técnico» (No cumple las directrices editoriales).
                 kw=['"técnico de lavadoras industriales"', '"técnico en lavadoras industriales"',
                     '"técnico en lavandería industrial"', '"técnico de secadoras industriales"'],
                 h=['Servicio Técnico Industrial', 'Técnicos en Lavadoras', 'Lavadoras Industriales', 'Lavanderías Industriales',
                    'Secadoras Industriales', 'Mantenimiento Correctivo', 'Mantenimiento Preventivo'],
                 d=['Servicio técnico para lavadoras y secadoras industriales. Agenda tu servicio hoy.',
                    'Técnicos para lavanderías industriales, hoteles y hospitales. Habla con un técnico.',
                    'Mantenimiento correctivo y preventivo para que tu lavandería no se detenga.',
                    'Agenda una visita y recibe el diagnóstico de tu equipo.'],
                 p=('servicio', 'tecnico')),
        ]),
        dict(nombre='Reparación y mantenimiento', pct=40, cpc=15,
             origen='Plan más mantenimiento correctivo (junta); absorbe «Servicio a lavadoras»', negativas='SERVICIO', grupos=[
            dict(nombre='Reparación',
                 kw=['"reparación de lavadoras industriales"', '"reparación de lavadora industrial"'],
                 h=['Reparación de Lavadoras', 'Lavadoras Industriales', 'Reparación Industrial', 'Mantenimiento Correctivo',
                    'Técnicos en Lavadoras', 'Diagnóstico de tu Equipo'],
                 d=['Reparación de lavadoras industriales para lavanderías, hoteles y hospitales.',
                    'Técnicos en lavadoras y secadoras industriales. Agenda tu servicio hoy.',
                    'Agenda una visita y recibe el diagnóstico de tu equipo.'],
                 p=('reparacion', 'lavadoras')),
            dict(nombre='Mantenimiento correctivo',
                 kw=['"mantenimiento correctivo lavadora industrial"', '"mantenimiento correctivo lavadoras industriales"',
                     '"mantenimiento correctivo lavadora"'],
                 h=['Mantenimiento Correctivo', 'Lavadoras Industriales', 'Reparación de Lavadoras', 'Técnicos en Lavadoras',
                    'Diagnóstico de tu Equipo', 'Agenda una Visita'],
                 d=['Mantenimiento correctivo para lavadoras industriales. Agenda tu servicio hoy.',
                    'Técnicos para lavanderías industriales, hoteles y hospitales. Habla con un técnico.',
                    'Agenda una visita y recibe el diagnóstico de tu equipo.'],
                 p=('mantenimiento', 'correctivo')),
            dict(nombre='Mantenimiento preventivo',
                 kw=['"mantenimiento preventivo lavadoras industriales"', '"mantenimiento lavandería industrial"',
                     '"mantenimiento de lavadoras industriales"'],
                 h=['Mantenimiento Preventivo', 'Lavadoras Industriales', 'Lavanderías Industriales', 'Técnicos en Lavadoras',
                    'Evita Paros de tu Equipo', 'Agenda una Visita'],
                 d=['Mantenimiento preventivo para lavadoras y secadoras industriales. Agenda hoy.',
                    'Técnicos para lavanderías industriales, hoteles y hospitales. Habla con un técnico.',
                    'Agenda una visita y recibe el diagnóstico de tu equipo.'],
                 p=('mantenimiento', 'preventivo')),
        ]),
        dict(nombre='Refacciones Girbau y Gamesail', pct=12, cpc=12,
             origen='Cambio de la junta: refacciones solo de esas dos marcas. Las genéricas van a negativas',
             grupos=[
            dict(nombre='Refacciones Girbau',
                 kw=['[refacciones girbau]', '"refacciones girbau"', '"refacciones para lavadora girbau"',
                     '"refacciones para secadora girbau"', '"partes girbau"', 'refacciones girbau'],
                 h=['Refacciones Girbau', 'Refacciones Originales', 'Para Lavadoras y Secadoras', 'Instalación por Técnicos',
                    'Pide tu Refacción', 'Cotiza tu Refacción'],
                 d=['Refacciones Girbau para lavadoras y secadoras. Cotiza tu refacción hoy.',
                    'Te ayudamos a identificar la pieza y la instalamos con nuestros técnicos.',
                    'Envíanos el modelo de tu equipo y recibe cotización de la refacción.'],
                 p=('refacciones', 'girbau')),
            dict(nombre='Refacciones Gamesail',
                 kw=['[refacciones gamesail]', '"refacciones gamesail"', '"partes gamesail"', 'refacciones gamesail'],
                 h=['Refacciones Gamesail', 'Refacciones Originales', 'Para Lavadoras y Secadoras', 'Instalación por Técnicos',
                    'Pide tu Refacción', 'Cotiza tu Refacción'],
                 d=['Refacciones Gamesail para lavadoras y secadoras. Cotiza tu refacción hoy.',
                    'Te ayudamos a identificar la pieza y la instalamos con nuestros técnicos.',
                    'Envíanos el modelo de tu equipo y recibe cotización de la refacción.'],
                 p=('refacciones', 'gamesail')),
        ]),
        dict(nombre='Servicio a secadoras', pct=8, cpc=15, origen='Plan', negativas='SERVICIO', grupos=[
            dict(nombre='Secadoras',
                 kw=['"reparación de secadoras industriales"', '"servicio a secadoras industriales"',
                     '"mantenimiento de secadoras industriales"', 'reparación secadoras industriales'],
                 h=['Reparación de Secadoras', 'Secadoras Industriales', 'Mantenimiento Correctivo', 'Mantenimiento Preventivo',
                    'Técnicos en Secadoras', 'Agenda una Visita'],
                 d=['Reparación y mantenimiento de secadoras industriales. Agenda tu servicio hoy.',
                    'Técnicos para lavanderías industriales, hoteles y hospitales.',
                    'Agenda una visita y recibe el diagnóstico de tu equipo.'],
                 p=('secadoras', 'servicio')),
        ]),
        dict(nombre='Instalación', pct=5, cpc=15, origen='Plan', negativas='SERVICIO', grupos=[
            dict(nombre='Instalación',
                 kw=['"instalación de lavandería industrial"', '"instalación de equipo de lavandería"', 'instalación lavandería industrial'],
                 h=['Instalación de Lavanderías', 'Instalación de Equipo', 'Lavanderías Industriales', 'Técnicos Especializados',
                    'Agenda una Visita'],
                 d=['Instalación de equipo para lavanderías industriales. Agenda una visita hoy.',
                    'Técnicos para lavanderías, hoteles y hospitales. Habla con un técnico.'],
                 p=('instalacion', 'lavanderia')),
        ]),
        dict(nombre='Servicio a lavanderías', pct=3, cpc=12, origen='Plan, prueba', negativas='SERVICIO', grupos=[
            dict(nombre='Pólizas',
                 kw=['"mantenimiento para lavandería de autoservicio"', '"póliza de mantenimiento lavandería"',
                     'mantenimiento lavandería autoservicio'],
                 h=['Póliza de Mantenimiento', 'Lavanderías de Autoservicio', 'Mantenimiento Preventivo', 'Evita Paros de tu Equipo',
                    'Agenda una Visita'],
                 d=['Pólizas de mantenimiento para lavanderías de autoservicio. Agenda hoy.',
                    'Mantenimiento preventivo y correctivo para que tu lavandería no se detenga.'],
                 p=('mantenimiento', 'lavanderias')),
        ]),
    ],
    # Negativas de campaña para todo lo que no es refacciones: el servicio técnico Girbau es de la cuenta Girbau.
    negativas_servicio=['refacciones', 'refacción', 'partes', 'repuestos', 'venta', 'comprar', 'cotizar equipo', 'girbau',
                        '"precio lavadora industrial"', '"lavadora industrial precio"'],
    salen=['Refacciones industriales genéricas: pasan a negativas («partes para lavadora industrial»)',
           '«Servicio a lavadoras» (6%): se junta con Reparación y mantenimiento',
           'Interpretación: «mantenimiento correctivo lavadora, lavadoras industriales» se tomó como dos keywords de mantenimiento correctivo; «lavadoras industriales» sola es venta y es de Gamesail'],
    cambios_actuales=['Al activar: bajar las campañas actuales a la mitad de su presupuesto',
                      'Revisar la campaña actual de refacciones (tenía todos sus anuncios rechazados)'],
    activacion=dict(anteriores='MITAD'),
)

# ---------------------------------------------------------------- Girbau
CUENTAS['girbau'] = dict(
    # 30 oct (junta): las páginas regresan al dominio de siempre del cliente, que Google ya conoce. Cuando Rodolfo confirme
    # que ya muestra las páginas nuevas, se corre salida/girbau/migrar-a-….js y luego aplicado=True.
    migrar=dict(url='https://girbauoccidente.com/', aplicado=False),
    subir_topes=False,  # 28 oct: no subir el costo por clic («más leads» ya no sube topes en esta cuenta)
    nombre='Girbau', id='860-582-6837', mensual=6600,
    telefono='33 2806 8994',  # botón de llamada de los anuncios (lista de Rodolfo, 21 oct)
    url='https://girbaupro.com/',
    # 26 oct: Marca gasta 41% de su presupuesto y pierde 50% de las subastas por puja: lo que falta es tope, no presupuesto.
    # El tope lo sube «más leads» (paso 3) de $10 a $15; si también lo subiera «ajustes», al ejecutar «más leads» lo llevaría a $20.
    # 27 oct: el anuncio de marca sale hasta abajo de la página. Quien busca «Girbau» ya quiere Girbau: la campaña de marca
    # pide salir hasta arriba el 80% de las veces, con máximo $25 por clic (hoy paga unos $10). Solo gasta el 41% de su presupuesto.
    # 27 oct (2): se vuelve a encender «Max Rendimiento - Girbau» (5 conversaciones y llamadas contestadas en 30 días),
    # con dinero de las campañas nuevas que no tienen búsquedas. Total $187 al día, debajo del tope de $217.
    # 28 oct: el tope de la marca se queda en $25 por clic: la prioridad ahora es no subir el costo por clic.
    ajustes=dict(arriba={'Marca Girbau': dict(cuota=0.8, tope=25)},
                 # 29 oct: la marca no tuvo impresiones el 28: desde que se encendió «Max Rendimiento - Girbau» (27 oct) esa
                 # campaña se queda con las búsquedas de «girbau» (5 clics a $6.68 y 1 WhatsApp). La marca se queda en $62.
                 # 31 oct (vaciado): Max Rendimiento trajo 5 contactos a $40 y no pierde por presupuesto ($117, sin cambio); la marca
                 # trajo 2 y pierde 27% por presupuesto: recibe lo de Smart Plus, capacidad y servicio técnico (sin gasto). Total $214.
                 presupuesto={'Marca Girbau': 88, 'Girbau Smart Plus': 3, 'Girbau por capacidad y sector': 3, 'Servicio técnico Girbau': 3},
                 activar={'Max Rendimiento - Girbau': 117}),
    subir=False, subir_porque='no usa su presupuesto (41%); la marca sale arriba con «ajustes»',
    mismo_sitio=['supliese-girbau-lavadoras.vercel.app'],  # versión anterior del mismo sitio: se conserva la sección
    nota='Solo búsquedas con la marca Girbau. Nuevo modelo Smart Plus y capacidades de 12 y 14 kg.',
    comunes=['Girbau', 'Cotiza con un Asesor', 'Solicita tu Cotización'],
    negativas={
        'Genérico sin marca (junta)': ['[lavadora industrial]', '[lavadoras industriales]', '[lavadora industrial precio]',
                                       '[lavadoras industriales precio]', '[precio lavadora industrial]',
                                       '[lavadora industrial 12 kg]', '[lavadora industrial 14 kg]',
                                       '[lavadora industrial 30 kg]', '[lavadora industrial 30 kg precio]'],
        'Refacciones (las atiende Servicio para Lavandería)': ['refacciones', 'refacción', 'partes', 'repuestos'],
        'Negocio de lavandería': ['franquicia', 'franquicias', '"poner una lavandería"'],
        'Otras marcas': ['lorsa', 'lorza', 'wascomat', 'unimac', 'maytag', 'alliance', '"speed queen"', 'primus', 'electrolux',
                         'lg', 'imesa', 'sertec', 'edro', 'lavartind', 'whirlpool', 'braun',
                         'gamesail', 'clm', 'kingstar', '"king star"', 'supliese', '"quick laundry"'],
        'Girbau de otro país (filial de EE. UU.)': ['"continental girbau"'],
        'Información, no compra': ['empleo', 'curso', 'cursos', 'manual', 'pdf', 'usada', 'usadas', 'renta'],
    },
    campanas=[
        dict(nombre='Marca Girbau', pct=45, cpc=10, origen='Plan', grupos=[
            dict(nombre='Girbau',
                 kw=['[girbau]', '"girbau"', '"lavadoras girbau"', '"girbau méxico"', '"distribuidor girbau"', '"girbau occidente"'],
                 h=['Girbau Occidente', 'Distribuidor Girbau', 'Lavadoras Girbau', 'Nueva Girbau Smart Plus',
                    'Lavadoras de 12 y 14 kg', 'Secadoras y Mangles Girbau'],
                 d=['Lavadoras, secadoras y mangles Girbau. Cotiza hoy con un asesor.',
                    'Conoce la nueva Girbau Smart Plus y las lavadoras de 12 y 14 kg.',
                    'Equipo Girbau para lavanderías, hoteles y hospitales. Te ayudamos a elegir.'],
                 p=('girbau', 'equipo')),
        ]),
        dict(nombre='Girbau Smart Plus', pct=20, cpc=10, origen='Cambio de la junta: modelo nuevo', grupos=[
            dict(nombre='Smart Plus',
                 kw=['"girbau smart plus"', '"smart plus girbau"', '"lavadora girbau smart plus"'],
                 h=['Girbau Smart Plus', 'Nueva Girbau Smart Plus', 'Lavadora Smart Plus', 'Distribuidor Girbau',
                    'Conoce el Nuevo Modelo'],
                 d=['Conoce la nueva Girbau Smart Plus. Cotiza hoy con un asesor.',
                    'Te explicamos el nuevo modelo y te ayudamos a elegir la capacidad.',
                    'Equipo Girbau para lavanderías, hoteles y hospitales.'],
                 p=('smart-plus', 'girbau')),
        ]),
        dict(nombre='Girbau por capacidad y sector', pct=25, cpc=10, origen='Plan más 12 y 14 kg (junta)', grupos=[
            dict(nombre='Capacidad',
                 kw=['"lavadora girbau 12 kg"', '"lavadora girbau 14 kg"', '"girbau 12 kg"', '"girbau 14 kg"',
                     '"secadora girbau"', '"lavadora industrial girbau"'],
                 h=['Lavadora Girbau 12 kg', 'Lavadora Girbau 14 kg', 'Lavadoras de 12 y 14 kg', 'Secadoras Girbau',
                    'Distribuidor Girbau', 'Te Ayudamos a Elegir'],
                 d=['Lavadoras Girbau de 12 y 14 kg y secadoras Girbau. Cotiza hoy con un asesor.',
                    'Te ayudamos a elegir la capacidad según los kilos de ropa que lavas al día.',
                    'Equipo Girbau para lavanderías, hoteles y hospitales.'],
                 p=('girbau', 'capacidad')),
            dict(nombre='Sector',
                 kw=['"lavadora girbau para hotel"', '"mangle girbau"', '"girbau para lavandería"'],
                 h=['Girbau para Hoteles', 'Mangles Girbau', 'Girbau para Lavanderías', 'Distribuidor Girbau',
                    'Te Ayudamos a Elegir'],
                 d=['Lavadoras, secadoras y mangles Girbau para hoteles y lavanderías. Cotiza hoy.',
                    'Te ayudamos a elegir el equipo Girbau para tu operación.'],
                 p=('girbau', 'sector')),
        ]),
        dict(nombre='Servicio técnico Girbau', pct=10, cpc=10,
             origen='Sale de la antigua campaña de refacciones; las refacciones pasan a Servicio para Lavandería', grupos=[
            dict(nombre='Servicio técnico',
                 kw=['"técnico girbau"', '"reparación girbau"', '"mantenimiento girbau"'],
                 h=['Servicio Técnico Girbau', 'Técnicos Girbau', 'Mantenimiento Girbau', 'Distribuidor Girbau',
                    'Agenda tu Servicio'],
                 d=['Servicio técnico y mantenimiento para equipo Girbau. Agenda hoy.',
                    'Técnicos para lavadoras, secadoras y mangles Girbau.'],
                 p=('servicio', 'girbau')),
        ]),
    ],
    salen=['Refacciones Girbau (25%): pasa a Servicio para Lavandería; «refacciones» queda como negativa',
           'Genérico «lavadora industrial»: va a negativas en exacta. En frase bloquearía «lavadora industrial girbau»'],
    cambios_actuales=['Al activar: pausar las dos campañas actuales, que armó la agencia anterior («Girbau Búsqueda | Nerea» y '
                      'Máximo Rendimiento); las reemplazan las campañas nuevas. Requiere tu OK',
                      'Al pausarlas, las campañas nuevas pasan de la mitad a su presupuesto completo ($217 al día), para no bajar el gasto',
                      'Las búsquedas genéricas («lavadora industrial») que hoy recoge la campaña actual dejan de salir en Girbau: '
                      'son de Gamesail y CLM'],
    activacion=dict(anteriores='PAUSAR'),
)
