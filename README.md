# 📦 Portal de Formularios Bocadeli (PWA)

Bienvenido al repositorio oficial del **Portal de Formularios de Bocadeli**. Esta es una Aplicación Web Progresiva (PWA) diseñada para centralizar y facilitar el acceso a los formularios de recolección de datos (KoboToolbox) para el personal en campo.

---

## 🚀 Guía de Despliegue Rápido

1. **Subir archivos**: Sube todos los archivos de esta carpeta a un repositorio en GitHub.
2. **Activar Web**: Ve a `Settings` > `Pages` en tu repositorio.
3. **Configurar Rama**: En la sección *Build and deployment*, selecciona la rama `main` (o `master`) y la carpeta `/ (root)`. Dale a **Save**.
4. **Listo**: En un par de minutos, GitHub te dará un enlace (ej: `https://usuario.github.io/portal/`). **Esa es la URL que debes compartir.**

---

## 📝 Cómo agregar más formularios

No necesitas tocar el código HTML. Todo se gestiona desde el archivo `formularios.json`.

1. Abre el archivo `formularios.json`.
2. Copia y pega un bloque de formulario existente y edita sus datos:

```json
{
    "nombre": "Nombre del Formulario",
    "descripcion": "Breve explicación de para qué sirve.",
    "url": "https://enlace-de-kobo.com",
    "categoria": "Comercial",
    "icono": "📝"
}