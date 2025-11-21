// ========================================
// MÓDULO PORTAFOLIO
// ========================================

const PortafolioModule = (() => {
    let state = {
        images: [],
        slots: 6
    };

    let elements = {};

    const loadHTML = async () => {
        const container = document.getElementById('portafolio-section');
        if (!container) return;

        try {
            const response = await fetch('../HTML/portafolio.html');
            const html = await response.text();
            container.innerHTML = html;
            
            updateDOMReferences();
            setupEventListeners();
        } catch (error) {
            console.error('Error cargando HTML de portafolio:', error);
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const updateDOMReferences = () => {
        elements = {
            portfolioGrid: document.getElementById('portfolioGrid'),
            addImageSlotBtn: document.getElementById('addImageSlotBtn')
        };
    };

    const setupEventListeners = () => {
        if (elements.addImageSlotBtn) {
            elements.addImageSlotBtn.addEventListener('click', () => {
                state.slots++;
                render();
            });
        }
    };

    const render = () => {
        if (!elements.portfolioGrid) return;

        elements.portfolioGrid.innerHTML = '';

        for (let i = 0; i < state.slots; i++) {
            const slot = document.createElement('div');
            slot.classList.add('portfolio-slot');

            if (state.images[i]) {
                slot.classList.add('has-image');
                const img = document.createElement('img');
                img.src = state.images[i];
                img.alt = `Portfolio ${i + 1}`;
                slot.appendChild(img);

                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-portfolio-btn');
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', () => {
                    state.images[i] = null;
                    render();
                });
                slot.appendChild(deleteBtn);
            } else {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.style.display = 'none';
                input.addEventListener('change', (e) => handleImageUpload(e, i));

                const uploadBtn = document.createElement('button');
                uploadBtn.classList.add('upload-btn');
                uploadBtn.innerHTML = '<i class="fas fa-plus"></i><span>Agregar Imagen</span>';
                uploadBtn.addEventListener('click', () => input.click());

                slot.appendChild(input);
                slot.appendChild(uploadBtn);
            }

            elements.portfolioGrid.appendChild(slot);
        }
    };

    const handleImageUpload = (e, index) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('El archivo es demasiado grande. Máximo 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            state.images[index] = event.target.result;
            render();
        };
        reader.readAsDataURL(file);
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('portafolio-section');
        if (elements.portfolioGrid) {
            render();
        }
    };

    return {
        initialize,
        show
    };
})();
