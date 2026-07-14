📝 PORTAL DE FORMULARIOS BOCADELI (PWA)
Bienvenido al repositorio oficial del Portal de Formularios Bocadeli. Esta es una Aplicación Web Progresiva (PWA) de alto rendimiento diseñada para centralizar todos los formularios de KoboToolbox en una interfaz profesional, rápida y moderna.
🚀 INSTALACIÓN Y DESPLIEGUE (GitHub Pages)
Para poner la aplicación en línea hoy mismo, sigue estos pasos:
Sube los archivos: Sube todos los archivos del proyecto (index.html, style.css, app.js, pwa.js, sw.js, manifest.json, formularios.json y tu logo.png) a un repositorio de GitHub.
Activa la web:
En tu repositorio, ve a la pestaña Settings (Configuración).
En el menú de la izquierda, entra en Pages.
En Build and deployment, selecciona la rama main (o master) y dale a Save.
Espera un momento: GitHub te dará un enlace (ej: https://tu-usuario.github.io/tu-repositorio/). Esa es la dirección oficial de tu portal.
✍️ CÓMO AGREGAR MÁS FORMULARIOS
No necesitas tocar el código de la aplicación. Todo se controla desde el archivo formularios.json.
Pasos para agregar uno nuevo:
Abre el archivo formularios.json.
Añade un nuevo bloque de código como este (asegúrate de poner una coma , después del bloque anterior):
code
JSON
{
    "nombre": "Nombre del Formulario",
    "descripcion": "Descripción detallada de para qué sirve este registro.",
    "url": "https://enlace-de-kobo.com/tu-formulario",
    "categoria": "Ventas",
    "icono": "📋"
}
Categoría: Si pones una categoría nueva que no existe, la App creará automáticamente una nueva sección y un botón de filtro nuevo.
Iconos: Puedes usar cualquier Emoji (📋, ⌛, 🚚, 📍, 🗺️, 🔍, 📊).
🔄 LA REGLA DE ORO PARA ACTUALIZAR (Versiones)
Las PWA guardan una copia de la App en el celular del usuario para que cargue instantáneamente. Si solo cambias el JSON, el celular del usuario no se enterará del cambio.
Para forzar la actualización en todos los teléfonos sin que el usuario tenga que borrar datos:
Haz tus cambios en formularios.json.
Abre el archivo sw.js.
Busca la primera línea: const CACHE_NAME = 'bocadeli-cache-v1.2';
Sube el número: Cámbialo a v1.3, v1.4, etc.
Sube los cambios a GitHub.
¿Qué pasará? Cuando el usuario abra la App, el sistema detectará el cambio de versión en el sw.js, borrará el caché viejo automáticamente y mostrará los nuevos formularios al instante.
📱 CÓMO INSTALAR EN EL CELULAR
Android (Chrome, Edge, Samsung Internet)
Aparecerá un botón en la parte inferior que dice "Instalar Aplicación". Al tocarlo, el portal se guardará con su icono de Bocadeli en la pantalla de inicio y funcionará como una App nativa.
iOS (iPhone / iPad)
Abre el portal en Safari.
Toca el botón Compartir (cuadrado con flecha hacia arriba).
Busca y selecciona "Añadir a pantalla de inicio".
📂 ESTRUCTURA DE ARCHIVOS
index.html: Estructura base, buscador y filtros.
style.css: Diseño corporativo, tarjetas Fluent y modo responsive.
app.js: Lógica de búsqueda en tiempo real y carga dinámica de formularios.
pwa.js: Sensor de instalaciones y detector de actualizaciones automáticas.
sw.js: El Service Worker (gestiona el modo offline y la limpieza de caché).
formularios.json: Tu "Base de Datos" (donde guardas los links de Kobo).
manifest.json: Configura cómo se ve la App al instalarse (nombre, colores, iconos).
