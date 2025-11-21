const ServiciosModule = (() => {
    let state = { items: [
        { id: 1, name: 'Promoción Especial', duration: '2 horas', description: 'Corte + Tinte', includes: 'Tratamiento capilar', price: '$500', validity: '30 días' }
    ], editingId: null };
    let elements = {};

    const loadHTML = async () => {
        const container = document.getElementById('servicios-section');
        if (!container) return;
        try {
            const response = await fetch('../HTML/servicios.html');
            const html = await response.text();
            container.innerHTML = html;
            updateDOMReferences();
            setupEventListeners();
        } catch (error) {
            console.error('Error:', error);
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const updateDOMReferences = () => {
        elements = {
            grid: document.getElementById('servicesGrid'),
            addBtn: document.getElementById('addPromotionBtn'),
            modal: document.getElementById('addPromotionModal'),
            form: document.getElementById('addPromotionForm')
        };
    };

    const setupEventListeners = () => {
        if (elements.addBtn) {
            elements.addBtn.addEventListener('click', () => {
                state.editingId = null;
                elements.form.reset();
                ModalManager.open(elements.modal);
            });
        }
        if (elements.form) {
            elements.form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                if (state.editingId) {
                    const item = state.items.find(i => i.id === state.editingId);
                    Object.assign(item, data);
                } else {
                    state.items.push({ id: Date.now(), ...data });
                }
                ModalManager.close(elements.modal);
                render();
            });
        }
        const cancelBtn = document.querySelector('.cancel-service');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => ModalManager.close(elements.modal));
        }
    };

    const render = () => {
        if (!elements.grid) return;
        elements.grid.innerHTML = state.items.map(item => `
            <div class="service-card">
                <h4>${item.name}</h4>
                <p><i class="fas fa-clock"></i> ${item.duration}</p>
                <p>${item.description}</p>
                <p><i class="fas fa-check"></i> ${item.includes}</p>
                <p class="price">${item.price}</p>
                <p><i class="fas fa-calendar"></i> ${item.validity}</p>
                <div class="card-actions">
                    <button class="btn-icon edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('');
        
        elements.grid.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = parseInt(btn.dataset.id);
                state.items = state.items.filter(i => i.id !== id);
                render();
            });
        });
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('servicios-section');
        render();
    };

    return { initialize, show };
})();
