// ========================================
// CONTROLADOR PRINCIPAL DEL DASHBOARD
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar gestores comunes
    ModalManager.initializeCloseButtons();
    ConfirmationManager.initialize();
    
    // Objeto con todos los módulos
    const modules = {
        inicio: InicioModule,
        portafolio: PortafolioModule,
        promocion: PromocionModule,
        servicios: ServiciosModule,
        estilistas: EstilistasModule,
        reportes: ReportesModule,
        formulario: FormularioModule,
        comentarios: ComentariosModule,
        notificaciones: NotificacionesModule,
        historial: HistorialModule,
        perfil: PerfilModule
    };
    
    // Inicializar todos los módulos
    Object.values(modules).forEach(module => {
        if (module && typeof module.initialize === 'function') {
            module.initialize();
        }
    });
    
    // Inicializar navegación del sidebar
    NavigationManager.initializeSidebar(modules);
    
    // Configurar botón de notificaciones
    const notificationsBtn = document.getElementById('notificationsIconBtn');
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            NavigationManager.updateActiveNavItem('notificaciones');
            if (modules.notificaciones) {
                modules.notificaciones.show();
            }
        });
    }
    
    // Configurar botón de perfil
    const profileBtn = document.getElementById('profileIconBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            NavigationManager.updateActiveNavItem('perfil');
            if (modules.perfil) {
                modules.perfil.show();
            }
        });
    }
    
    // Configurar botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    const logoutModal = document.getElementById('logoutModal');
    const cancelLogout = document.getElementById('cancelLogout');
    const acceptLogout = document.getElementById('acceptLogout');
    
    if (logoutBtn && logoutModal) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            ModalManager.open(logoutModal);
        });
    }
    
    if (cancelLogout) {
        cancelLogout.addEventListener('click', () => {
            ModalManager.close(logoutModal);
        });
    }
    
    if (acceptLogout) {
        acceptLogout.addEventListener('click', () => {
            // Aquí iría la lógica de cierre de sesión
            window.location.href = 'login.html';
        });
    }
    
    // Mostrar módulo de inicio por defecto
    if (modules.inicio) {
        modules.inicio.show();
    }
});
