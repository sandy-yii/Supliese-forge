# Supliese-forge

- **Cómo se crean las campañas depende del acceso.** En las cuentas donde la usuaria ya es administradora con su propio usuario (Girbau desde el 20 oct 2026), se usa el script `campanas/salida/<cuenta>/crear-campanas.js` (Vista previa y luego Ejecutar). En las demás, se hacen a mano con la extensión Claude in Chrome usando los prompts por partes de `campanas/salida/<cuenta>/prompt-extension/`, sin script, Google Ads Editor ni cargas masivas. Todo se genera con `python3 campanas/generar.py`.
- Nada se activa, pausa ni edita en las cuentas sin el OK explícito de la usuaria, cuenta por cuenta.
