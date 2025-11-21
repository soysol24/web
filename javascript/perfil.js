const PerfilModule = (() => {
    const loadHTML = async () => {
        const container = document.getElementById('perfil-section');
        if (!container) return;
        try {
            const response = await fetch('../HTML/perfil.html');
            const html = await response.text();
            container.innerHTML = html;
            setupEventListeners();
        } catch (error) {
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const setupEventListeners = () => {
        const form = document.getElementById('profileForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                ConfirmationManager.showSuccess('Perfil actualizado exitosamente');
            });
        }

        const logoutBtn = document.getElementById('logoutProfileBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                const modal = document.getElementById('logoutModal');
                ModalManager.open(modal);
            });
        }
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('perfil-section');
    };

    return { initialize, show };
})();
