const HistorialModule = (() => {
    let state = {
        history: [
            { id: 1, status: 'Realizada', date: '2025-02-15', service: 'Corte', stylist: 'María González', total: '$200' },
            { id: 2, status: 'Confirmada', date: '2025-02-18', service: 'Tinte', stylist: 'Carlos Ruiz', total: '$500' }
        ]
    };

    const loadHTML = async () => {
        const container = document.getElementById('historial-section');
        if (!container) return;
        try {
            const response = await fetch('../HTML/historial.html');
            const html = await response.text();
            container.innerHTML = html;
            render();
        } catch (error) {
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const render = () => {
        const tbody = document.getElementById('historyTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = state.history.map(h => `
            <tr>
                <td><span class="status-badge">${h.status}</span></td>
                <td>${Utils.formatDate(h.date)}</td>
                <td>${h.service}</td>
                <td>${h.stylist}</td>
                <td>${h.total}</td>
            </tr>
        `).join('');
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('historial-section');
    };

    return { initialize, show };
})();
