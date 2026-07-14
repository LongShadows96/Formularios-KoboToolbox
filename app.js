document.addEventListener('DOMContentLoaded', () => {
    fetchFormularios();
});

async function fetchFormularios() {
    const container = document.getElementById('forms-container');
    
    try {
        const response = await fetch('formularios.json');
        if (!response.ok) throw new Error('Error al cargar datos');
        const data = await response.json();
        
        container.innerHTML = ''; // Limpiar loader

        data.formularios.forEach(form => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-icon-box">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        ${form.svgPath || '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline>'}
                    </svg>
                </div>
                <h3>${form.nombre}</h3>
                <p>${form.descripcion}</p>
                <a href="${form.url}" target="_blank" rel="noopener" class="btn-open">Abrir Formulario</a>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        container.innerHTML = `<p style="text-align:center; width:100%;">Error al cargar el archivo formularios.json</p>`;
    }
}