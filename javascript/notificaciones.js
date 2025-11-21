const NotificacionesModule = (() => {
    let state = {
        notifications: [
            { id: 1, client: 'Juan Pérez', service: 'Corte', date: '2025-02-20', time: '10:00', status: 'pendientes' },
            { id: 2, client: 'María López', service: 'Tinte', date: '2025-02-21', time: '14:00', status: 'pendientes' }
        ]
    };

    const loadHTML = async () => {
        const container = document.getElementById('notificaciones-section');
        if (!container) return;
        try {
            const response = await fetch('../HTML/notificaciones.html');
            const html = await response.text();
            container.innerHTML = html;
            setupEventListeners();
            render('pendientes');
        } catch (error) {
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const setupEventListeners = () => {
        document.querySelectorAll('.notification-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.notification-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                render(tab.dataset.status);
            });
        });
    };

    const render = (status) => {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;
        
        const filtered = state.notifications.filter(n => n.status === status);
        if (filtered.length === 0) {
            container.innerHTML = '<p class="placeholder-text">No hay notificaciones en esta categoría.</p>';
            return;
        }
        
        container.innerHTML = filtered.map(n => `
            <div class="notification-card">
                <h4>${n.client}</h4>
                <p>${n.service} - ${Utils.formatDate(n.date)} ${n.time}</p>
            </div>
        `).join('');
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('notificaciones-section');
    };

    return { initialize, show };
})();
