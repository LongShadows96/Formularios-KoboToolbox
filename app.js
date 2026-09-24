'use strict';

let formulariosData = [];
let categoriaActiva = 'Todos';
let koboWindow = null;

const KOBO_WINDOW_NAME = 'bocadeli_kobo_formularios';
const KOBO_HOSTS_PERMITIDOS = new Set([
    'ee.kobotoolbox.org'
]);

const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filter-container');
const resultsArea = document.getElementById('results-area');
const locationHelpBtn = document.getElementById('locationHelpBtn');
const locationModal = document.getElementById('locationModal');
const closeLocationModalBtn = document.getElementById('closeLocationModal');
const connectionStatus = document.getElementById('connectionStatus');

function normalizarTexto(valor = '') {
    return String(valor)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function setConnectionStatus() {
    if (!connectionStatus) return;

    const online = navigator.onLine;
    connectionStatus.textContent = online ? 'En línea' : 'Sin conexión';
    connectionStatus.classList.toggle('offline', !online);
    connectionStatus.classList.toggle('online', online);
}

function validarUrlKobo(url) {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'https:' && KOBO_HOSTS_PERMITIDOS.has(parsed.hostname)
            ? parsed.href
            : null;
    } catch {
        return null;
    }
}

function abrirFormularioKobo(url) {
    const urlSegura = validarUrlKobo(url);

    if (!urlSegura) {
        alert('El enlace del formulario no es válido o no pertenece al dominio autorizado de KoboToolbox.');
        return;
    }

    // Reutilizamos una sola ventana/pestaña de Kobo. Esto ayuda a conservar la misma
    // sesión del sitio y evita abrir múltiples pestañas durante la jornada.
    try {
        if (!koboWindow || koboWindow.closed) {
            koboWindow = window.open(urlSegura, KOBO_WINDOW_NAME);
        } else {
            koboWindow.location.href = urlSegura;
            koboWindow.focus();
        }

        if (!koboWindow) {
            // Fallback si el navegador bloquea la apertura de una nueva ventana.
            window.location.assign(urlSegura);
            return;
        }

        // Evita que Kobo pueda navegar la ventana del portal mediante window.opener.
        try {
            koboWindow.opener = null;
        } catch (error) {
            console.debug('No fue posible limpiar window.opener:', error);
        }
    } catch (error) {
        console.error('Error abriendo formulario:', error);
        window.location.assign(urlSegura);
    }
}

async function init() {
    setConnectionStatus();

    try {
        // El Service Worker ya aplica network-first y mantiene una copia local del JSON.
        // No usamos un timestamp en la URL para evitar llenar el caché con copias distintas.
        const respuesta = await fetch('./formularios.json', { cache: 'no-store' });

        if (!respuesta.ok) {
            throw new Error(`No se pudo obtener formularios.json (${respuesta.status})`);
        }

        const data = await respuesta.json();

        if (!data || !Array.isArray(data.formularios)) {
            throw new Error('formularios.json no contiene un arreglo "formularios" válido');
        }

        formulariosData = data.formularios.filter(formulario => {
            return formulario
                && typeof formulario.nombre === 'string'
                && typeof formulario.descripcion === 'string'
                && typeof formulario.categoria === 'string'
                && validarUrlKobo(formulario.url);
        });

        renderFilters();
        renderFormularios();
        console.log(`Portal cargado: ${formulariosData.length} formularios disponibles.`);
    } catch (error) {
        console.error('Error cargando formularios:', error);
        resultsArea.replaceChildren(crearMensajeEstado(
            'No fue posible cargar los formularios. Revisa la conexión o vuelve a intentar cuando tengas Internet.'
        ));
    }
}

function crearMensajeEstado(mensaje) {
    const p = document.createElement('p');
    p.className = 'empty-state';
    p.textContent = mensaje;
    return p;
}

function renderFilters() {
    const categorias = ['Todos', ...new Set(formulariosData.map(f => f.categoria))];
    filterContainer.replaceChildren();

    categorias.forEach(cat => {
        const count = cat === 'Todos'
            ? formulariosData.length
            : formulariosData.filter(f => f.categoria === cat).length;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `filter-btn ${categoriaActiva === cat ? 'active' : ''}`;
        btn.setAttribute('aria-pressed', categoriaActiva === cat ? 'true' : 'false');

        const label = document.createTextNode(`${cat} `);
        const badge = document.createElement('span');
        badge.className = 'count-badge';
        badge.textContent = `(${count})`;
        btn.append(label, badge);

        btn.addEventListener('click', () => {
            categoriaActiva = cat;
            renderFilters();
            renderFormularios();
        });

        filterContainer.appendChild(btn);
    });
}

function crearCard(formulario) {
    const card = document.createElement('article');
    card.className = 'card';

    const icon = document.createElement('div');
    icon.className = 'card-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = formulario.icono || '📄';

    const title = document.createElement('h3');
    title.textContent = formulario.nombre;

    const description = document.createElement('p');
    description.textContent = formulario.descripcion;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'btn-form';
    button.textContent = 'Abrir Formulario';
    button.addEventListener('click', () => abrirFormularioKobo(formulario.url));

    card.append(icon, title, description, button);
    return card;
}

function renderFormularios() {
    const busqueda = normalizarTexto(searchInput.value);

    const filtrados = formulariosData.filter(f => {
        const textoFormulario = normalizarTexto(`${f.nombre} ${f.descripcion} ${f.categoria}`);
        const coincideSearch = !busqueda || textoFormulario.includes(busqueda);
        const coincideCat = categoriaActiva === 'Todos' || f.categoria === categoriaActiva;
        return coincideSearch && coincideCat;
    });

    resultsArea.replaceChildren();

    if (filtrados.length === 0) {
        resultsArea.appendChild(crearMensajeEstado('No se encontraron resultados.'));
        return;
    }

    const grupos = [...new Set(filtrados.map(f => f.categoria))];

    grupos.forEach(grupo => {
        const section = document.createElement('section');
        section.className = 'category-group';

        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = grupo;

        const grid = document.createElement('div');
        grid.className = 'grid';

        filtrados
            .filter(f => f.categoria === grupo)
            .forEach(f => grid.appendChild(crearCard(f)));

        section.append(title, grid);
        resultsArea.appendChild(section);
    });
}

function abrirAyudaUbicacion() {
    if (!locationModal) return;
    locationModal.classList.remove('hidden');
    locationModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeLocationModalBtn?.focus();
}

function cerrarAyudaUbicacion() {
    if (!locationModal) return;
    locationModal.classList.add('hidden');
    locationModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    locationHelpBtn?.focus();
}

searchInput.addEventListener('input', renderFormularios);
window.addEventListener('online', setConnectionStatus);
window.addEventListener('offline', setConnectionStatus);
locationHelpBtn?.addEventListener('click', abrirAyudaUbicacion);
closeLocationModalBtn?.addEventListener('click', cerrarAyudaUbicacion);

locationModal?.addEventListener('click', event => {
    if (event.target === locationModal) cerrarAyudaUbicacion();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && locationModal && !locationModal.classList.contains('hidden')) {
        cerrarAyudaUbicacion();
    }
});

init();
