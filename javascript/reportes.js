const ReportesModule = (() => {
    const loadHTML = async () => {
        const container = document.getElementById('reportes-section');
        if (!container) return;
        try {
            const response = await fetch('../HTML/reportes.html');
            const html = await response.text();
            container.innerHTML = html;
        } catch (error) {
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('reportes-section');
    };

    return { initialize, show };
})();
