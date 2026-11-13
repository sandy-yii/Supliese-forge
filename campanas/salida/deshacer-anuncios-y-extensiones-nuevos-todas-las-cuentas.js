/**
 * Atelback · DESHACER «anuncios-y-extensiones-nuevos» — las cinco cuentas
 * Escrito a mano el 12 nov 2026. Úsalo SOLO si después de agregar los anuncios y extensiones nuevos baja una marca.
 *
 * QUÉ HACE (reconoce sola en qué cuenta está):
 *   - PAUSA los anuncios nuevos que agregó el otro script (los reconoce por sus títulos). Los anuncios viejos no se tocan.
 *   - QUITA de la cuenta los textos destacados, fragmentos y enlaces que agregó el otro script (los reconoce por su texto).
 *   - REACTIVA la palabra que se había pausado («planchadora de rodillo industrial» en Kingstar).
 * Con eso la cuenta queda como estaba antes. No borra anuncios: solo los pausa, y se pueden volver a prender.
 * Para deshacer solo una parte, pon en false lo que NO quieras deshacer:
 */
var DESHACER_ANUNCIOS = true;
var DESHACER_EXTENSIONES = true;
var DESHACER_PAUSA = true;
/*
 * CÓMO SE USA: en la cuenta que bajó > borrar todo > pegar completo > Autorizar > VISTA PREVIA > mandar el registro >
 * EJECUTAR con el OK.
 */

var CTA = ['Te Ayudamos a Elegir', 'Cotiza por WhatsApp', 'Solicita tu Cotización'];

var PLAN = {
  // ------------------------------------------------------------ KINGSTAR
  '993-525-8739': { marca: 'Kingstar (CLM)', pausar: [{ grupo: 'Mangles', palabra: 'planchadora de rodillo industrial' }], anuncios: [
    { camp: 'AB · Alta capacidad 60 kg o más', grupo: 'Lavadoras de alta capacidad',
      t: ['Lavadoras de Alta Capacidad', 'Lavadora Industrial 60 kg', 'Lavadora Industrial 100 kg', 'Lavadora Industrial 120 kg',
        'Lavadoras de 60 a 120 kg', 'Alta Capacidad para Lavandería', 'Lavandería Industrial', 'Kingstar México',
        'Equipo para Hoteles', 'Más Ropa por Ciclo', 'Lavadora Industrial Kingstar', 'Para Hoteles y Hospitales'],
      d: ['Lavadoras industriales de alta capacidad de 60, 100 y 120 kg. Pide tu cotización hoy.',
        'Más ropa por ciclo para lavanderías industriales, hoteles y hospitales.',
        'Te ayudamos a elegir la capacidad correcta para tu lavandería. Escríbenos por WhatsApp.',
        'Kingstar México: lavadoras industriales para tu lavandería. Habla con un asesor.'] },
    { camp: 'AB · Alta capacidad 60 kg o más', grupo: 'Secadoras de alta capacidad',
      t: ['Secadoras Industriales', 'Secadora Industrial 50 kg', 'Secadora Industrial 100 kg', 'Secadoras de Alta Capacidad',
        'Secadoras para Lavandería', 'Lavandería Industrial', 'Kingstar México', 'Secadoras para Hoteles',
        'Lavadora y Secadora Industrial', 'Secadora Industrial Kingstar', 'Para Hoteles y Hospitales', 'Secar Más Ropa por Ciclo'],
      d: ['Secadoras industriales de alta capacidad para lavanderías, hoteles y hospitales.',
        'Arma tu línea de lavado y secado con equipo Kingstar. Pide tu cotización.',
        'Te ayudamos a elegir la secadora correcta para tu volumen de ropa. Escríbenos.',
        'Kingstar México: secadoras industriales de alta capacidad. Habla con un asesor.'] },
    { camp: 'AB · Lavandería hotelera e institucional', grupo: 'Lavadoras para hotel y hospital',
      t: ['Lavadora Industrial para Hotel', 'Lavadoras para Hospitales', 'Lavadora Industrial 50 kg', 'Lavandería para Hotel',
        'Lavandería Hotelera', 'Lavandería para Hospital', 'Equipo para Hoteles', 'De 50 kg en Adelante',
        'Lavar, Secar y Planchar', 'Tu Ropa Blanca en Casa', 'Kingstar México', 'Lavadoras Industriales'],
      d: ['Lavadoras industriales de 50 kg en adelante para hoteles y hospitales. Cotiza hoy.',
        'Lava, seca, plancha y dobla tu ropa blanca en tu propia lavandería.',
        'Te ayudamos a planear la lavandería de tu hotel u hospital. Escríbenos por WhatsApp.',
        'Kingstar México: equipo para lavandería hotelera e institucional.'] },
    { camp: 'AB · Lavandería hotelera e institucional', grupo: 'Lavandería hotelera',
      t: ['Lavandería Hotelera', 'Lavandería para Hotel', 'Lavandería Industrial Hotel', 'Lavadora Industrial para Hotel',
        'Equipo para Hoteles', 'Tu Ropa Blanca en Casa', 'Lavar, Secar y Planchar', 'De 50 kg en Adelante',
        'Kingstar México', 'Lavadoras Industriales', 'Mangles para Hotel', 'Planea tu Lavandería'],
      d: ['Equipo para la lavandería de tu hotel: lavadoras, secadoras y mangles.',
        'Lava tu ropa blanca en el hotel: más control y sin depender de terceros.',
        'Te ayudamos a planear tu lavandería hotelera según tus habitaciones. Escríbenos.',
        'Kingstar México: lavadoras industriales de 50 kg en adelante para hoteles.'] },
    { camp: 'AB · Lavandería hotelera e institucional', grupo: 'Hospitales e institucional',
      t: ['Lavandería Hospitalaria', 'Lavandería para Hospital', 'Lavandería Institucional', 'Lavadoras para Hospitales',
        'Equipo para Hospitales', 'Lavadora Industrial 50 kg', 'Lavar, Secar y Planchar', 'De 50 kg en Adelante',
        'Kingstar México', 'Lavadoras Industriales', 'Planea tu Lavandería', 'Para Clínicas e Instituciones'],
      d: ['Equipo para lavandería hospitalaria e institucional: lavadoras, secadoras y mangles.',
        'Lavadoras industriales de 50 kg en adelante para hospitales y clínicas.',
        'Te ayudamos a planear la lavandería de tu institución. Escríbenos por WhatsApp.',
        'Kingstar México: equipo de lavandería para hospitales. Habla con un asesor.'] },
    { camp: 'AB · Mangles y planchado', grupo: 'Mangles',
      t: ['Mangle Industrial', 'Mangle de Planchado', 'Mangle Industrial Kingstar', 'Planchado de Sábanas',
        'Mangle para Sábanas', 'Planchar y Doblar', 'Ropa Plana Planchada', 'Mangles para Hoteles',
        'Mangles para Hospitales', 'Equipo de Planchado', 'Kingstar México', 'Mangle para Lavandería'],
      d: ['Mangles industriales de planchado para sábanas, manteles y ropa plana.',
        'Alimenta, plancha y dobla en un solo paso. Ideal para hoteles y hospitales.',
        'Te ayudamos a elegir el mangle correcto para tu volumen. Escríbenos por WhatsApp.',
        'Kingstar México: mangles de planchado para lavandería industrial.'] },
    { camp: 'AB · Lavadoras y secadoras de 20 a 45 kg', grupo: '20 a 45 kg',
      t: ['Lavadora Industrial 40 kg', 'Lavadora de 40 Kilos', 'Secadora Industrial 40 kg', 'Lavadoras de 20 a 45 kg',
        'Lavadora Industrial 45 kg', 'Lavar y Secar en Pareja', 'Lavadora y Secadora 40 kg', 'Lavandería Industrial',
        'Kingstar México', 'Lavadoras Industriales', 'Secadoras Industriales', 'Equipo para Lavandería'],
      d: ['Lavadoras y secadoras industriales de 20 a 45 kg para tu lavandería. Cotiza hoy.',
        'Lavadora y secadora de 40 kg que trabajan en pareja. Pide tu precio.',
        'Te ayudamos a elegir la capacidad correcta. Escríbenos por WhatsApp.',
        'Kingstar México: lavadoras industriales de 40 kg. Habla con un asesor.'] },
    { camp: 'AB · Túnel de lavado', grupo: 'Túnel de lavado para ropa',
      t: ['Túnel de Lavado', 'Túnel de Lavado para Ropa', 'Lavadora de Túnel', 'Túnel de Lavado Industrial',
        'Para Ropa, No para Autos', 'Lavar, Prensar y Secar', 'Lavandería Industrial', 'Alta Producción por Hora',
        'Para Hoteles y Hospitales', 'Proyecto de Lavandería', 'Kingstar México', 'Túnel para Lavandería'],
      d: ['Túnel de lavado para ropa: lava, prensa y seca en una sola línea industrial.',
        'Para lavanderías industriales, hoteles y hospitales con mucho volumen de ropa.',
        'Te ayudamos a planear tu proyecto de túnel de lavado. Escríbenos por WhatsApp.',
        'Kingstar México: túneles de lavado para lavandería industrial.'] },
    { camp: 'AB · Marca CLM', grupo: 'CLM',
      t: ['Kingstar México', 'CLM México', 'Lavadoras Kingstar', 'Equipos Kingstar', 'Kingstar Industrial',
        'Lavadoras de 15 a 120 kg', 'Serie SHS de Kingstar', 'Lavandería Industrial', 'Secadoras Kingstar',
        'Mangles Kingstar', 'Equipo para Lavandería', 'Lavadoras Industriales'],
      d: ['Kingstar México: lavadoras industriales serie SHS de 15 a 120 kg.',
        'Lavadoras, secadoras, mangles y túneles para lavandería industrial.',
        'Te ayudamos a elegir el equipo Kingstar para tu lavandería. Escríbenos por WhatsApp.',
        'Equipo para hoteles, hospitales y lavanderías industriales. Pide tu cotización.'] }
  ] },
  // ------------------------------------------------------------ GAMESAIL
  '118-347-6484': { marca: 'Gamesail',
    destacados: ['Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'De 17 a 130 kg', 'Montaje Suave', 'Para Ropa y Sábanas', 'Equipo para Hoteles'],
    fragmentos: { header: 'Tipos', values: ['Lavadoras industriales', 'Secadoras industriales', 'Mangles planchadores', 'Lavadoras por capacidad'] },
    enlaces: [
      { txt: 'Lavadoras para Ropa', d1: 'Para ropa, sábanas y blancos', d2: 'Pide tu cotización', ruta: '/lavadoras-para-ropa' },
      { txt: 'Lavadoras por Capacidad', d1: 'De 20, 30 y 50 kg', d2: 'Elige la capacidad correcta', ruta: '/lavadoras-por-capacidad' },
      { txt: 'Secadoras Industriales', d1: 'Secadoras de 50 y 100 kg', d2: 'Pide tu cotización', ruta: '/secadoras-industriales' },
      { txt: 'Mangles Planchadores', d1: 'Para sábanas y manteles', d2: 'Pide tu cotización', ruta: '/mangles' },
      { txt: 'Hoteles y Hospitales', d1: 'Equipo para tu lavandería', d2: 'Te ayudamos a planearla', ruta: '/hoteles-y-hospitales' }
    ],
    dominio: 'https://gamesail.mx',
    anuncios: [
    { camp: 'AB · Lavadoras para ropa y sábanas', grupo: 'Lavadoras industriales para ropa',
      t: ['Lavadoras Industriales', 'Lavadora Industrial de Ropa', 'Lavadoras para Ropa', 'Lavadoras para Sábanas',
        'Lavadoras y Secadoras', 'De 17 a 130 kg', 'Montaje Suave', 'Equipo Gamesail', 'Para Hoteles y Lavanderías',
        'Lavadoras Industriales Precio', 'Lavadoras Gamesail', 'Para Ropa y Blancos'],
      d: ['Lavadoras industriales Gamesail para ropa, sábanas y blancos. Pide tu precio.',
        'Lavadoras y secadoras industriales de 17 a 130 kg con montaje suave.',
        'Te ayudamos a elegir la lavadora correcta para tu negocio. Escríbenos por WhatsApp.',
        'Para hoteles, hospitales y lavanderías. Cotiza hoy con un asesor.'] },
    { camp: 'AB · Lavadoras por capacidad y precio', grupo: 'Lavadoras por capacidad',
      t: ['Lavadoras Industriales Precio', 'Lavadora Industrial 20 kg', 'Lavadora Industrial 30 kg', 'Lavadora Industrial 50 kg',
        'Precio por Capacidad', 'Lavadoras de 20, 30 y 50 kg', 'Elige tu Capacidad', 'Equipo Gamesail', 'Montaje Suave',
        'Lavadoras Industriales', 'Pide el Precio de tu Lavadora', 'Lavadoras Gamesail'],
      d: ['Lavadoras industriales de 20, 30 y 50 kg. Pide el precio de la capacidad que necesitas.',
        'Te ayudamos a elegir la capacidad correcta según tu volumen de ropa.',
        'Equipo Gamesail con montaje suave para lavanderías, hoteles y hospitales.',
        'Escríbenos por WhatsApp y recibe tu cotización con un asesor.'] },
    { camp: 'AB · Secadoras industriales', grupo: 'Secadoras para ropa',
      t: ['Secadoras Industriales', 'Secadora Industrial de Ropa', 'Secadoras para Ropa', 'Secadoras para Sábanas',
        'Secadora Industrial 50 kg', 'Secadora Industrial 100 kg', 'Secadoras Gamesail', 'Equipo Gamesail',
        'Para Hoteles y Lavanderías', 'Lavadoras y Secadoras', 'Secadoras Industriales Precio', 'Secado de Ropa Industrial'],
      d: ['Secadoras industriales de ropa de 50 y 100 kg. Pide tu cotización hoy.',
        'Seca ropa, sábanas y blancos para tu hotel, hospital o lavandería.',
        'Te ayudamos a elegir la secadora correcta. Escríbenos por WhatsApp.',
        'Equipo Gamesail: secadoras industriales para tu negocio. Habla con un asesor.'] },
    { camp: 'AB · Secadoras industriales', grupo: 'Secadoras por capacidad',
      t: ['Secadora Industrial 50 kg', 'Secadora Industrial 100 kg', 'Secadoras Industriales', 'Secadoras por Capacidad',
        'Secadora Industrial de Ropa', 'Secadoras Gamesail', 'Equipo Gamesail', 'Elige tu Capacidad',
        'Secadoras Industriales Precio', 'Para Hoteles y Lavanderías', 'Lavadoras y Secadoras', 'Secadoras para Sábanas'],
      d: ['Secadoras industriales de 50 y 100 kg. Pide el precio de la capacidad que necesitas.',
        'Te ayudamos a elegir la secadora correcta según tu volumen de ropa.',
        'Equipo Gamesail para hoteles, hospitales y lavanderías.',
        'Escríbenos por WhatsApp y recibe tu cotización con un asesor.'] },
    { camp: 'AB · Hoteles y hospitales', grupo: 'Hoteles',
      t: ['Lavadora Industrial para Hotel', 'Lavadoras para Hoteles', 'Secadora Industrial para Hotel', 'Lavandería para Hotel',
        'Equipo para Hoteles', 'Lavadoras y Secadoras', 'Para Ropa y Sábanas', 'De 17 a 130 kg', 'Equipo Gamesail',
        'Lavadoras Industriales', 'Planea tu Lavandería', 'Montaje Suave'],
      d: ['Lavadoras y secadoras industriales para la lavandería de tu hotel. Cotiza hoy.',
        'Lava sábanas, toallas y blancos en tu propio hotel con equipo Gamesail.',
        'Te ayudamos a elegir el equipo según tus habitaciones. Escríbenos por WhatsApp.',
        'Equipo de 17 a 130 kg con montaje suave. Habla con un asesor.'] },
    { camp: 'AB · Hoteles y hospitales', grupo: 'Hospitales',
      t: ['Lavadoras para Hospitales', 'Lavadora Industrial Hospital', 'Lavandería para Hospital', 'Equipo para Hospitales',
        'Lavadoras y Secadoras', 'Para Ropa y Sábanas', 'De 17 a 130 kg', 'Equipo Gamesail', 'Lavadoras Industriales',
        'Planea tu Lavandería', 'Para Clínicas', 'Montaje Suave'],
      d: ['Lavadoras y secadoras industriales para la lavandería de tu hospital. Cotiza hoy.',
        'Lava sábanas, batas y blancos en tu hospital o clínica con equipo Gamesail.',
        'Te ayudamos a elegir el equipo según tu volumen de ropa. Escríbenos por WhatsApp.',
        'Equipo de 17 a 130 kg con montaje suave. Habla con un asesor.'] },
    { camp: 'AB · Mangles y planchado', grupo: 'Mangles',
      t: ['Mangle Planchador', 'Calandria Industrial', 'Mangle para Sábanas', 'Dobladora de Ropa Industrial',
        'Mangles Planchadores', 'Mangle Industrial', 'Planchado de Sábanas', 'Mangle a Gas', 'Equipo Gamesail',
        'Para Hoteles y Hospitales', 'Mangles Gamesail', 'Planchar y Doblar'],
      d: ['Mangles planchadores y calandrias industriales para sábanas y manteles.',
        'Plancha y dobla tu ropa plana en tu hotel, hospital o lavandería.',
        'Te ayudamos a elegir el mangle correcto. Escríbenos por WhatsApp.',
        'Equipo Gamesail: mangles planchadores a gas. Pide tu cotización.'] },
    { camp: 'AB · Competencia depurada', grupo: 'Marcas de la competencia',
      t: ['Compara Antes de Comprar', 'Lavadoras Industriales', 'Lavadora Industrial Precio', 'Otra Opción en Lavadoras',
        'Lavadoras de 17 a 130 kg', 'Montaje Suave', 'Equipo Gamesail', 'Lavadoras y Secadoras', 'Para Ropa y Sábanas',
        'Lavadoras Gamesail', 'Compara Precio y Capacidad', 'Para Hoteles y Lavanderías'],
      d: ['Compara antes de comprar: lavadoras industriales Gamesail de 17 a 130 kg.',
        'Lavadoras y secadoras industriales con montaje suave para tu negocio.',
        'Compara precio y capacidad con lo que ya viste. Escríbenos por WhatsApp.',
        'Te ayudamos a elegir la lavadora correcta. Pide tu cotización hoy.'] },
    { camp: 'AB · Marca Gamesail', grupo: 'Gamesail',
      t: ['Gamesail', 'Gamesail México', 'Lavadoras Gamesail', 'Secadoras Gamesail', 'Equipo Gamesail',
        'Lavadoras Industriales', 'De 17 a 130 kg', 'Montaje Suave', 'Mangles Gamesail', 'Lavadoras y Secadoras',
        'Para Ropa y Sábanas', 'Para Hoteles y Lavanderías'],
      d: ['Gamesail: lavadoras industriales de 17 a 130 kg con montaje suave.',
        'Lavadoras, secadoras y mangles Gamesail para tu lavandería, hotel u hospital.',
        'Te ayudamos a elegir tu equipo Gamesail. Escríbenos por WhatsApp.',
        'Pide tu cotización de equipo Gamesail con un asesor.'] },
    { camp: 'AB · Marca Gamesail', grupo: 'Lavadoras Gamesail',
      t: ['Lavadoras Gamesail', 'Lavadora Gamesail', 'Gamesail', 'Gamesail México', 'Lavadoras Industriales',
        'De 17 a 130 kg', 'Montaje Suave', 'Equipo Gamesail', 'Lavadoras para Ropa', 'Lavadoras por Capacidad',
        'Para Ropa y Sábanas', 'Para Hoteles y Lavanderías'],
      d: ['Lavadoras industriales Gamesail de 17 a 130 kg con montaje suave.',
        'Lavadoras Gamesail para ropa, sábanas y blancos. Pide tu precio.',
        'Te ayudamos a elegir la capacidad correcta. Escríbenos por WhatsApp.',
        'Para hoteles, hospitales y lavanderías. Cotiza con un asesor.'] },
    { camp: 'AB · Marca Gamesail', grupo: 'Secadoras Gamesail',
      t: ['Secadoras Gamesail', 'Secadora Gamesail', 'Gamesail', 'Gamesail México', 'Secadoras Industriales',
        'Secadora Industrial 50 kg', 'Secadora Industrial 100 kg', 'Equipo Gamesail', 'Lavadoras y Secadoras',
        'Para Ropa y Sábanas', 'Para Hoteles y Lavanderías', 'Secadoras para Ropa'],
      d: ['Secadoras industriales Gamesail de 50 y 100 kg para tu negocio.',
        'Seca ropa, sábanas y blancos con equipo Gamesail. Pide tu precio.',
        'Te ayudamos a elegir la secadora correcta. Escríbenos por WhatsApp.',
        'Para hoteles, hospitales y lavanderías. Cotiza con un asesor.'] }
  ] },
  // ------------------------------------------------------------ GIRBAU
  '860-582-6837': { marca: 'Girbau',
    destacados: ['Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'Series GS y RMS', 'De 9 a 32 kg', 'Girbau Smart Plus', 'Girbau Occidente'],
    fragmentos: { header: 'Modelos', values: ['Serie GS', 'Serie RMS', 'Smart Plus'] },
    anuncios: [
    { camp: 'AB · Marca Girbau', grupo: 'Girbau',
      t: ['Girbau', 'Lavadoras Girbau', 'Girbau México', 'Girbau Occidente', 'Series GS y RMS', 'De 9 a 32 kg',
        'Girbau Smart Plus', 'Lavadora Industrial Girbau', 'Secadoras Girbau', 'Equipo Girbau', 'Lavadoras Industriales',
        'Para Hoteles y Lavanderías'],
      d: ['Girbau Occidente: lavadoras industriales Girbau series GS y RMS de 9 a 32 kg.',
        'Conoce la Girbau Smart Plus y el equipo para tu lavandería, hotel u hospital.',
        'Te ayudamos a elegir tu equipo Girbau. Escríbenos por WhatsApp.',
        'Pide tu cotización de lavadoras y secadoras Girbau con un asesor.'] },
    { camp: 'AB · Girbau por capacidad y sector', grupo: 'Capacidad',
      t: ['Lavadora Industrial Girbau', 'Lavadoras Girbau', 'Girbau de 9 a 32 kg', 'Secadora Girbau', 'Series GS y RMS',
        'Girbau por Capacidad', 'Elige tu Capacidad', 'Girbau Smart Plus', 'Girbau Occidente', 'Equipo Girbau',
        'Lavadoras Industriales', 'Para Hoteles y Lavanderías'],
      d: ['Lavadoras industriales Girbau de 9 a 32 kg, series GS y RMS. Cotiza hoy.',
        'Te ayudamos a elegir la capacidad Girbau correcta para tu volumen de ropa.',
        'Lavadoras y secadoras Girbau para hoteles, hospitales y lavanderías.',
        'Girbau Occidente: escríbenos por WhatsApp y habla con un asesor.'] },
    { camp: 'AB · Girbau por capacidad y sector', grupo: 'Sector',
      t: ['Girbau para Hoteles', 'Girbau para Hospitales', 'Girbau para Lavanderías', 'Mangle Girbau', 'Lavadoras Girbau',
        'Equipo Girbau', 'Series GS y RMS', 'Girbau Smart Plus', 'Girbau Occidente', 'Lavadoras Industriales',
        'Lavandería para Hotel', 'Lavandería para Hospital'],
      d: ['Equipo Girbau para hoteles, hospitales y lavanderías: lavadoras, secadoras y mangles.',
        'Te ayudamos a planear tu lavandería con equipo Girbau. Escríbenos por WhatsApp.',
        'Lavadoras industriales Girbau series GS y RMS de 9 a 32 kg.',
        'Girbau Occidente: pide tu cotización con un asesor.'] },
    { camp: 'AB · Girbau Smart Plus', grupo: 'Smart Plus',
      t: ['Girbau Smart Plus', 'Lavadora Smart Plus', 'Smart Plus de Girbau', 'Lavadoras Girbau', 'Equipo Girbau',
        'Girbau Occidente', 'Series GS y RMS', 'Lavadoras Industriales', 'Conoce la Smart Plus', 'Girbau México',
        'Para Hoteles y Lavanderías', 'Lavadora Industrial Girbau'],
      d: ['Conoce la Girbau Smart Plus pieza por pieza y pide tu cotización.',
        'Lavadoras industriales Girbau para tu lavandería, hotel u hospital.',
        'Te ayudamos a elegir tu equipo Girbau. Escríbenos por WhatsApp.',
        'Girbau Occidente: habla con un asesor y recibe tu precio.'] },
    { camp: 'AB · Servicio técnico Girbau', grupo: 'Servicio técnico',
      t: ['Servicio Técnico Girbau', 'Técnico Girbau', 'Reparación Girbau', 'Mantenimiento Girbau', 'Girbau Occidente',
        'Lavadoras Girbau', 'Equipo Girbau', 'Agenda tu Servicio', 'Habla con un Técnico', 'Diagnóstico de tu Equipo',
        'Mantenimiento Preventivo', 'Mantenimiento Correctivo'],
      d: ['Servicio técnico para lavadoras y secadoras Girbau. Agenda tu visita.',
        'Mantenimiento preventivo y correctivo para tu equipo Girbau.',
        'Habla con un técnico por WhatsApp y recibe el diagnóstico de tu equipo.',
        'Girbau Occidente: servicio para hoteles, hospitales y lavanderías.'] }
  ] },
  // ------------------------------------------------------------ QUICK LAUNDRY
  '256-397-2201': { marca: 'Quick Laundry',
    destacados: ['Cotiza por WhatsApp', 'Te Ayudamos a Elegir', 'Equipo LG y Maytag', 'Con o sin Fichero', 'Para tu Lavandería', 'Antes Supliese'],
    anuncios: [
    { camp: 'AB · Equipo para lavandería', grupo: 'Lavadoras para lavandería',
      t: ['Lavadoras para Lavanderías', 'Lavadoras para Negocio', 'Lavadoras para Lavandería', 'Lavadoras y Secadoras',
        'Precios de Lavadoras', 'Equipo para Lavandería', 'Lavadora Comercial', 'Equipo LG y Maytag', 'Con o sin Fichero',
        'Quick Laundry', 'Lavadoras Industriales', 'Para tu Negocio'],
      d: ['Lavadoras y secadoras comerciales LG y Maytag para lavanderías y negocios.',
        'Pide el precio de las lavadoras para tu lavandería. Te ayudamos a elegir.',
        'Equipo para lavandería con o sin fichero. Escríbenos por WhatsApp.',
        'Quick Laundry: lavadoras para negocio y lavandería. Cotiza con un asesor.'] },
    { camp: 'AB · Marcas comerciales', grupo: 'Maytag y LG',
      t: ['Lavadora Maytag Comercial', 'Lavadora LG Comercial', 'Lavadora Maytag Industrial', 'Lavadora Industrial LG',
        'Equipo LG y Maytag', 'Lavadoras y Secadoras', 'Centros de Lavado LG', 'Equipo Comercial', 'Para tu Lavandería',
        'Con o sin Fichero', 'Quick Laundry', 'Antes Supliese'],
      d: ['Lavadoras y secadoras comerciales LG y Maytag para tu lavandería.',
        'Centros de lavado LG y equipo Maytag con o sin fichero. Pide tu precio.',
        'Te ayudamos a elegir el modelo correcto. Escríbenos por WhatsApp.',
        'Quick Laundry: equipo comercial para lavanderías. Cotiza con un asesor.'] },
    { camp: 'AB · Marca Quick Laundry', grupo: 'Quick Laundry',
      t: ['Quick Laundry', 'Quick Laundry México', 'Antes Supliese', 'Equipo LG y Maytag', 'Equipo para Lavanderías',
        'Lavadoras y Secadoras', 'Con o sin Fichero', 'Para tu Lavandería', 'Lavadoras Comerciales', 'Lavadoras de Monedas',
        'Abre tu Lavandería', 'Elige Bien tu Equipo'],
      d: ['Quick Laundry: equipo comercial LG y Maytag para lavanderías.',
        'Lavadoras y secadoras con o sin fichero para tu lavandería.',
        'Te ayudamos a elegir el equipo de tu lavandería. Escríbenos por WhatsApp.',
        'Antes Supliese. Pide tu cotización con un asesor.'] },
    { camp: 'AB · Marca Quick Laundry', grupo: 'Supliese',
      t: ['Supliese', 'Supliese Ahora Quick Laundry', 'Quick Laundry', 'Antes Supliese', 'Equipo LG y Maytag',
        'Equipo para Lavanderías', 'Lavadoras y Secadoras', 'Con o sin Fichero', 'Para tu Lavandería',
        'Lavadoras Comerciales', 'Lavadoras de Monedas', 'Elige Bien tu Equipo'],
      d: ['Supliese ahora es Quick Laundry: equipo comercial LG y Maytag para lavanderías.',
        'Lavadoras y secadoras con o sin fichero para tu lavandería.',
        'Te ayudamos a elegir el equipo de tu lavandería. Escríbenos por WhatsApp.',
        'Pide tu cotización con un asesor de Quick Laundry.'] },
    { camp: 'AB · Emprendimiento', grupo: 'Abrir una lavandería',
      t: ['Pon tu Lavandería', 'Abre tu Lavandería', 'Poner una Lavandería', 'Quiero Poner una Lavandería',
        'Equipo para tu Lavandería', 'Asesoría para tu Lavandería', 'Te Ayudamos a Planearla', 'Elige el Equipo Correcto',
        'Lavadoras y Secadoras', 'Equipo LG y Maytag', 'Quick Laundry', 'Calcula tu Proyecto'],
      d: ['¿Vas a poner una lavandería? Te ayudamos a elegir el equipo según tu local.',
        'Lavadoras y secadoras LG y Maytag con o sin fichero para tu lavandería nueva.',
        'Calcula tu proyecto y platica con un asesor por WhatsApp.',
        'Quick Laundry: equipo para abrir tu lavandería. Pide tu cotización.'] }
  ] },
  // ------------------------------------------------------------ LAUNDRY SOLUTIONS
  '265-909-2662': { marca: 'Laundry Solutions',
    destacados: ['Agenda tu Servicio', 'Habla con un Técnico', 'Diagnóstico de tu Equipo', 'Mantenimiento Preventivo', 'Mantenimiento Correctivo', 'Lavadoras y Secadoras'],
    fragmentos: { header: 'Servicios', values: ['Diagnóstico', 'Reparación', 'Mantenimiento preventivo', 'Mantenimiento correctivo', 'Instalación', 'Pólizas de mantenimiento'] },
    anuncios: [] }
};

function filas(q, que) {
  var out = [];
  try { var it = AdsApp.search(q); while (it.hasNext()) out.push(it.next()); }
  catch (e) { Logger.log('(No se pudo revisar ' + que + ': ' + e.message + ')'); }
  return out;
}

function main() {
  var cid = AdsApp.currentAccount().getCustomerId(), P = PLAN[cid];
  if (!P) throw new Error('La cuenta ' + cid + ' no está en el plan. No se hizo nada.');
  var vista = AdsApp.getExecutionInfo().isPreview();
  Logger.log('DESHACER · ' + P.marca + ' · ' + (vista ? 'VISTA PREVIA: no cambia nada' : 'EJECUTAR: deshace'));
  Logger.log('');
  var ops = [], textos = [];

  if (DESHACER_ANUNCIOS) {
    Logger.log('==== ANUNCIOS NUEVOS QUE SE PAUSAN ====');
    var porGrupo = {};
    (P.anuncios || []).forEach(function (A) { porGrupo[A.camp + '|' + A.grupo] = A.t.concat(CTA).map(function (x) { return x.toLowerCase(); }); });
    var n = 0;
    filas("SELECT campaign.name, ad_group.name, ad_group_ad.resource_name, ad_group_ad.ad.responsive_search_ad.headlines FROM ad_group_ad " +
      "WHERE ad_group_ad.status = 'ENABLED' AND ad_group_ad.ad.type = 'RESPONSIVE_SEARCH_AD'", 'los anuncios').forEach(function (f) {
        var plan = porGrupo[f.campaign.name + '|' + f.adGroup.name]; if (!plan) return;
        var t = ((f.adGroupAd.ad.responsiveSearchAd || {}).headlines || []).map(function (h) { return String(h.text || '').toLowerCase(); });
        var iguales = t.filter(function (x) { return plan.indexOf(x) >= 0; }).length;
        if (iguales < 12) return;   // es un anuncio viejo: no se toca
        n++;
        Logger.log('PAUSA el anuncio nuevo de «' + f.campaign.name + ' › ' + f.adGroup.name + '» (el anuncio viejo sigue)');
        ops.push({ adGroupAdOperation: { update: { resourceName: f.adGroupAd.resourceName, status: 'PAUSED' }, updateMask: 'status' } });
        textos.push('pausar anuncio nuevo en ' + f.adGroup.name);
      });
    if (!n) Logger.log('No hay anuncios nuevos prendidos.');
    Logger.log('');
  }

  if (DESHACER_EXTENSIONES) {
    Logger.log('==== EXTENSIONES QUE SE QUITAN DE LA CUENTA ====');
    var dest = (P.destacados || []).map(function (x) { return x.toLowerCase(); });
    var enl = (P.enlaces || []).map(function (e) { return e.txt.toLowerCase(); });
    var frag = P.fragmentos ? P.fragmentos.header.toLowerCase() : null;
    var m = 0;
    filas("SELECT customer_asset.resource_name, customer_asset.field_type, asset.callout_asset.callout_text, asset.sitelink_asset.link_text, " +
      "asset.structured_snippet_asset.header FROM customer_asset WHERE customer_asset.status = 'ENABLED' " +
      "AND customer_asset.field_type IN ('CALLOUT', 'SITELINK', 'STRUCTURED_SNIPPET')", 'las extensiones').forEach(function (f) {
        var a = f.asset || {}, tipo = f.customerAsset.fieldType, txt = '';
        if (tipo === 'CALLOUT') txt = String((a.calloutAsset || {}).calloutText || '');
        if (tipo === 'SITELINK') txt = String((a.sitelinkAsset || {}).linkText || '');
        if (tipo === 'STRUCTURED_SNIPPET') txt = String((a.structuredSnippetAsset || {}).header || '');
        var es = (tipo === 'CALLOUT' && dest.indexOf(txt.toLowerCase()) >= 0) || (tipo === 'SITELINK' && enl.indexOf(txt.toLowerCase()) >= 0) ||
          (tipo === 'STRUCTURED_SNIPPET' && frag && txt.toLowerCase() === frag);
        if (!es) return;
        m++;
        Logger.log('QUITA ' + tipo + ' «' + txt + '» de la cuenta');
        ops.push({ customerAssetOperation: { remove: f.customerAsset.resourceName } });
        textos.push('quitar «' + txt + '»');
      });
    if (!m) Logger.log('No hay extensiones nuevas que quitar.');
    Logger.log('');
  }

  if (DESHACER_PAUSA) {
    Logger.log('==== PALABRAS QUE SE REACTIVAN ====');
    (P.pausar || []).forEach(function (x) {
      var r = filas("SELECT ad_group_criterion.resource_name FROM ad_group_criterion WHERE ad_group_criterion.type = 'KEYWORD' " +
        "AND ad_group_criterion.keyword.text = '" + x.palabra + "' AND ad_group.name = '" + x.grupo + "' AND ad_group_criterion.status = 'PAUSED'", 'la palabra');
      r.forEach(function (f) {
        Logger.log('REACTIVA «' + x.palabra + '»');
        ops.push({ adGroupCriterionOperation: { update: { resourceName: f.adGroupCriterion.resourceName, status: 'ENABLED' }, updateMask: 'status' } });
        textos.push('reactivar «' + x.palabra + '»');
      });
      if (!r.length) Logger.log('«' + x.palabra + '» no está pausada.');
    });
    if (!(P.pausar || []).length) Logger.log('Ninguna.');
    Logger.log('');
  }

  var malos = 0;
  if (ops.length) AdsApp.mutateAll(ops, { partialFailure: true }).forEach(function (r, i) {
    if (!r.isSuccessful()) { malos++; Logger.log('❌ ' + textos[i] + ': ' + r.getErrorMessages().join('; ')); }
    else if (!vista) Logger.log('✅ ' + textos[i]);
  });
  Logger.log('DESHACER · ' + P.marca + ' · ' + (vista ? 'vista previa' : 'ejecutado') + ' · operaciones: ' + ops.length + ' · con error: ' + malos);
}
