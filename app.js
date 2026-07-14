let formulariosData = [];
let categoriaActiva = "Todos";

const searchInput = document.getElementById('searchInput');
const filterContainer = document.getElementById('filter-container');
const resultsArea = document.getElementById('results-area');

async function init() {
    try {
        const response = await fetch('formularios.json');
        const data = await response.json();
        formulariosData = data.formularios;
        renderFilters();
        renderFormularios();
    } catch (error) {
        resultsArea.innerHTML = '<p style="text-align:center;">Error al cargar formularios.json</p>';
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
        const matchSearch = f.nombre.toLowerCase().includes(busqueda) || 
                            f.descripcion.toLowerCase().includes(busqueda);
        const matchCat = (categoriaActiva === "Todos" || f.categoria === categoriaActiva);
        return matchSearch && matchCat;
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
init();