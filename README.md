# Portal de Formularios Bocadeli (PWA)

Portal PWA para centralizar formularios de KoboToolbox en una sola interfaz.

## Navegadores compatibles

El portal no está configurado exclusivamente para Chrome. Está diseñado para funcionar en navegadores modernos con HTTPS, entre ellos:

- Firefox
- Chrome
- Microsoft Edge
- Samsung Internet
- Safari en iPhone/iPad
- Otros navegadores modernos compatibles con JavaScript, Service Worker y HTTPS

La instalación como PWA puede variar según el navegador. Si el navegador no ofrece un cuadro automático de instalación, el portal muestra un botón **Cómo instalar** con una guía general.

## Permisos de ubicación de Kobo

El portal no puede forzar por JavaScript que un navegador mantenga de forma permanente el permiso de ubicación de KoboToolbox. La ubicación es solicitada por `https://ee.kobotoolbox.org` y cada navegador administra su propio permiso.

Esto significa que:

1. Si un usuario trabaja únicamente con Firefox, debe autorizar la ubicación de Kobo en Firefox.
2. Si posteriormente abre Kobo en Chrome, Safari u otro navegador, debe autorizarlo también allí.
3. Los permisos de ubicación no se comparten entre navegadores.
4. Algunos navegadores pueden otorgar permisos temporales. Cuando exista una opción como **Recordar esta decisión**, **Permitir** de forma persistente o equivalente, conviene utilizarla.
5. En Firefox, si aparece **Recordar esta decisión**, debe marcarse; de lo contrario, el permiso puede quedar temporal.

### Android

- Mantener activa la ubicación del teléfono.
- Dar permiso de ubicación al navegador que se utilice: Firefox, Chrome, Edge, Samsung Internet u otro.
- Usar **Ubicación precisa** si el equipo la ofrece y el proceso de campo la requiere.
- Dentro de Kobo, permitir el acceso a la ubicación y guardar/recordar la decisión cuando el navegador lo permita.

### iPhone / iPad

- Mantener activos los Servicios de localización de iOS.
- Conceder acceso de ubicación al navegador utilizado.
- Autorizar también el sitio de Kobo cuando el navegador lo solicite.
- En Safari, los permisos del sitio se pueden revisar desde la configuración de Safari o la configuración del sitio web.

> Importante: por diseño de seguridad de los navegadores, una aplicación web no puede activar silenciosamente un permiso de ubicación que el usuario o el sistema operativo haya bloqueado, revocado o configurado como temporal.

## Comportamiento de los formularios

Los formularios Kobo se abren desde una acción directa del usuario y el portal intenta reutilizar la misma ventana/pestaña de Kobo durante la sesión cuando el navegador lo permite. Si el navegador no permite esa reutilización o bloquea la apertura, el portal navega directamente al formulario como alternativa.

Este comportamiento no depende de Chrome y funciona con las capacidades estándar del navegador.

## Correcciones técnicas incluidas

- Eliminado el `cache busting` con timestamp que generaba copias distintas de `formularios.json`.
- `formularios.json` usa estrategia **network-first** con una única copia de respaldo.
- El Service Worker precarga `manifest.json`, `offline.html` e `icon.svg`.
- Se agregó fallback de navegación sin conexión.
- No se cachean recursos externos de KoboToolbox.
- Buscador por nombre, descripción y categoría, ignorando tildes.
- Validación de enlaces HTTPS y del dominio de KoboToolbox.
- Las tarjetas se crean con nodos DOM para evitar insertar directamente HTML desde el JSON.
- Indicador de conexión en línea/sin conexión.
- Manejo de errores del Service Worker.
- Instalación PWA con alternativa visual para Firefox, Safari/iPhone y navegadores que no soportan `beforeinstallprompt`.
- Guía de permisos de ubicación independiente del navegador.

## Despliegue en GitHub Pages

Suba estos archivos al repositorio:

- `index.html`
- `style.css`
- `app.js`
- `pwa.js`
- `sw.js`
- `manifest.json`
- `formularios.json`
- `offline.html`
- `logo.png`
- `icon.svg`

Luego vaya a **Settings > Pages** y publique la rama correspondiente.

## Actualizar formularios

Los formularios se administran desde `formularios.json`.

```json
{
  "nombre": "Nombre del Formulario",
  "descripcion": "Descripción del formulario.",
  "url": "https://ee.kobotoolbox.org/x/XXXXXXXX",
  "categoria": "Comercial",
  "icono": "📋"
}
```

No es necesario cambiar la versión del Service Worker cuando solo se modifica `formularios.json`, porque el portal consulta primero la versión del servidor y actualiza su copia local.

Cuando modifique código o archivos estáticos (`app.js`, `pwa.js`, `style.css`, `index.html`, etc.), cambie `CACHE_NAME` en `sw.js` para forzar la actualización del App Shell.


## Versión 2.2 — corrección de apertura de formularios

Se eliminó la reutilización de una única ventana/pestaña de Kobo. Esa lógica podía dejar una referencia de ventana inválida después de que el usuario cerrara el formulario, especialmente en navegadores móviles.

Ahora cada botón **Abrir Formulario** es un enlace HTTPS normal que abre el formulario seleccionado en una pestaña independiente con `target="_blank"` y `rel="noopener noreferrer"`. Esto funciona de forma más consistente en Firefox, Chrome, Edge, Samsung Internet y Safari/iOS. Cerrar un formulario ya no afecta los botones de los demás formularios.

El permiso de ubicación sigue perteneciendo al sitio `ee.kobotoolbox.org` dentro del navegador utilizado; abrir una pestaña nueva no borra un permiso persistente concedido al sitio.
