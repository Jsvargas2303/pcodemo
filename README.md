# Colombia B2B Marketplace — demo protegido

Copia desplegable del mockup conceptual de SV2 Labs. Las páginas HTML están cifradas con [StatiCrypt](https://github.com/robinmoisson/staticrypt). No es un sitio oficial.

## Contenido

- `index.html` — Inicio (versión clásica)
- `inmersivo.html` — Experiencia inmersiva
- `buscar.html` — Búsqueda de exportadores
- `empresa.html` — Ficha de ejemplo
- `css/`, `js/`, `fonts/` — recursos sin cifrar (necesarios para que el demo funcione una vez desbloqueado)
- `login-template.html` — plantilla de la pantalla de acceso
- `.staticrypt.json` — sal compartida (no es un secreto; hay que conservarla para que «Recordarme» siga funcionando entre páginas y redespliegues)

## Cómo verlo

Suba esta carpeta a Vercel, Netlify o cualquier hosting de archivos estáticos. Abra el sitio e ingrese la contraseña que le compartieron por un canal aparte. Marque «Recordarme en esta sesión» (viene activado) para no volver a escribirla al cambiar de página en la misma sesión del navegador.

También puede previsualizarlo en local:

```bash
python3 -m http.server 4173
```

Luego abra `http://localhost:4173`. El cifrado usa la Web Crypto API, así que hace falta `localhost` o HTTPS (no basta con abrir el HTML como `file://` en todos los navegadores).

## Cómo volver a cifrar

Si edita el HTML en claro, cifre de nuevo los cuatro archivos con `npx staticrypt`, la plantilla `login-template.html` y el archivo `.staticrypt.json` de esta carpeta (así la sal no cambia). Pase la contraseña con `-p` o con la variable de entorno `STATICRYPT_PASSWORD`. No deje páginas sin cifrar en este directorio antes de publicar.
