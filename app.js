let formulariosData = [];
let categoriaActiva = "Todos";

const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filter-container');
const resultsArea = document.getElementById('results-area');

// Función de inicio con Cache Busting
async function init() {
    try {
        // Forzamos al navegador a no usar caché añadiendo la hora actual al URL
        const respuesta = await fetch(`formularios.json?v=${Date.now()}`, {
            cache: 'no-store'
        });
        
        if (!respuesta.ok) throw new Error('No se pudo obtener el archivo');
        
        const data = await respuesta.json();
        formulariosData = data.formularios;
        
        renderFilters();
        renderFormularios();
        console.log("Datos actualizados desde el servidor");
    } catch (error) {
        console.error("Error cargando formularios:", error);
        resultsArea.innerHTML = '<p style="text-align:center; padding:20px;">Error al conectar con el servidor.</p>';
    }
}

function renderFilters() {
    const categorias = ["Todos", ...new Set(formulariosData.map(f => f.categoria))];
    filterContainer.innerHTML = '';

    categorias.forEach(cat => {
        const count = cat === "Todos" 
            ? formulariosData.length 
            : formulariosData.filter(f => f.categoria === cat).length;

        const btn = document.createElement('button');
        btn.className = `filter-btn ${categoriaActiva === cat ? 'active' : ''}`;
        btn.innerHTML = `${cat} <span class="count-badge">(${count})</span>`;
        btn.onclick = () => {
            categoriaActiva = cat;
            renderFilters();
            renderFormularios();
        };
        filterContainer.appendChild(btn);
    });
}

function renderFormularios() {
    const busqueda = searchInput.value.toLowerCase();
    
    let filtrados = formulariosData.filter(f => {
        const coincideSearch = f.nombre.toLowerCase().includes(busqueda) || 
                               f.descripcion.toLowerCase().includes(busqueda);
        const coincideCat = (categoriaActiva === "Todos" || f.categoria === categoriaActiva);
        return coincideSearch && coincideCat;
    });

    resultsArea.innerHTML = '';

    if (filtrados.length === 0) {
        resultsArea.innerHTML = '<p style="text-align:center; padding: 40px; color: #888;">No se encontraron resultados.</p>';
        return;
    }

    const grupos = [...new Set(filtrados.map(f => f.categoria))];

    grupos.forEach(grupo => {
        const section = document.createElement('section');
        section.className = 'category-group';
        
        const cardsHTML = filtrados.filter(f => f.categoria === grupo).map(f => `
            <div class="card">
                <div class="card-icon">${f.icono || '📄'}</div>
                <h3>${f.nombre}</h3>
                <p>${f.descripcion}</p>
                <a href="${f.url}" target="_blank" class="btn-form">Abrir Formulario</a>
            </div>
        `).join('');

        section.innerHTML = `
            <div class="category-title">${grupo}</div>
            <div class="grid">${cardsHTML}</div>
        `;
        resultsArea.appendChild(section);
    });
}

searchInput.addEventListener('input', renderFormularios);

// Ejecutar al cargar la página
init();