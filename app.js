let formulariosData = [];
let categoriaActiva = "Todos";

const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filter-container');
const resultsArea = document.getElementById('results-area');

// 1. Cargar Datos
async function init() {
    try {
        const response = await fetch('formularios.json');
        const data = await response.json();
        formulariosData = data.formularios;
        renderFilters();
        renderFormularios();
    } catch (error) {
        console.error("Error cargando JSON", error);
    }
}

// 2. Renderizar Botones de Filtro
function renderFilters() {
    const categorias = ["Todos", ...new Set(formulariosData.map(f => f.categoria))];
    filterContainer.innerHTML = '';

    categorias.forEach(cat => {
        const count = cat === "Todos" 
            ? formulariosData.length 
            : formulariosData.filter(f => f.categoria === cat).length;

        const btn = document.createElement('button');
        btn.className = `filter-btn ${categoriaActiva === cat ? 'active' : ''}`;
        btn.innerHTML = `${cat} <span class="count-badge">${count}</span>`;
        btn.onclick = () => {
            categoriaActiva = cat;
            renderFilters();
            renderFormularios();
        };
        filterContainer.appendChild(btn);
    });
}

// 3. Renderizar Formularios (con Agrupación)
function renderFormularios() {
    const busqueda = searchInput.value.toLowerCase();
    
    // Filtrar por categoría y búsqueda
    let filtrados = formulariosData.filter(f => {
        const coincideBusqueda = f.nombre.toLowerCase().includes(busqueda) || 
                                f.descripcion.toLowerCase().includes(busqueda);
        const coincideCat = (categoriaActiva === "Todos" || f.categoria === categoriaActiva);
        return coincideBusqueda && coincideCat;
    });

    resultsArea.innerHTML = '';

    // Agrupar por categoría
    const grupos = [...new Set(filtrados.map(f => f.categoria))];

    if (filtrados.length === 0) {
        resultsArea.innerHTML = '<p style="text-align:center; padding: 50px;">No se encontraron formularios.</p>';
        return;
    }

    grupos.forEach(grupo => {
        const section = document.createElement('section');
        section.className = 'category-group';
        
        const itemsDelGrupo = filtrados.filter(f => f.categoria === grupo);
        
        let htmlCards = itemsDelGrupo.map(f => `
            <div class="card">
                <div class="card-icon">${f.icono || '📄'}</div>
                <h3>${f.nombre}</h3>
                <p>${f.descripcion}</p>
                <a href="${f.url}" target="_blank" class="btn-form">Abrir formulario →</a>
            </div>
        `).join('');

        section.innerHTML = `
            <div class="category-title">${grupo}</div>
            <div class="grid">${htmlCards}</div>
        `;
        resultsArea.appendChild(section);
    });
}

// Evento de búsqueda
searchInput.addEventListener('input', renderFormularios);

init();