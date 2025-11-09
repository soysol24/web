// ================== Header & Footer ==================
function loadHeaderFooter() {
    fetch('header_footer.html')
        .then(res => res.text())
        .then(html => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            document.body.appendChild(tempDiv);

            const headerTemplate = document.getElementById('header-template');
            document.getElementById('header-placeholder').appendChild(headerTemplate.content.cloneNode(true));

            const footerTemplate = document.getElementById('footer-template');
            document.getElementById('footer-placeholder').appendChild(footerTemplate.content.cloneNode(true));

            initDropdowns();
            initBellIcon(); // ✅ se inicializa al final
        });
}

function initDropdowns() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const link = dropdown.querySelector('a');
        const menu = dropdown.querySelector('.dropdown-menu');

        link.addEventListener('mouseenter', () => menu.classList.add('visible'));
        link.addEventListener('mouseleave', () => menu.classList.remove('visible'));
        dropdown.addEventListener('mouseleave', () => menu.classList.remove('visible'));
    });
}

// ================== Modales ==================
function loadModalNotificaciones() {
    fetch('modals/notificaciones.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html); // ✅ FIX
            initNotificacionesModal();
        })
        .catch(err => console.error('Error cargando notificaciones:', err));
}

function loadModalAuth() {
    fetch('modals/register.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html); // ✅ FIX
            initializeModalEvents();
        })
        .catch(err => console.error('Error cargando modal auth:', err));
}

function loadModalProfileMenu() {
    const modalPlaceholder = document.getElementById('modal-placeholder');

    fetch('modals/profile_menu.html')
        .then(res => res.text())
        .then(html => {
            modalPlaceholder.insertAdjacentHTML('beforeend', html); // ✅ FIX
            initProfileMenuEvents();
            return fetch('modals/logout_confirm.html');
        })
        .then(res => res.text())
        .then(html => {
            const logoutPlaceholder = document.getElementById('modal-placeholder-logout');
            if (logoutPlaceholder) {
                logoutPlaceholder.insertAdjacentHTML('beforeend', html); // ✅ FIX
                initLogoutModalEvents();
            }
        })
        .catch(err => console.error('Error cargando modales de perfil:', err));
}

function loadModalAgendar() {
    fetch('modals/agendar_servicios.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('modal-placeholder').insertAdjacentHTML('beforeend', html); // ✅ FIX
            initAgendarModal();
        })
        .catch(err => console.error('Error al cargar modal de agendar:', err));
}

// ================== Modal Logout ==================
function initLogoutModalEvents() {
    const logoutModal = document.getElementById('logoutModal');
    if (!logoutModal) return;

    const confirmBtn = document.getElementById('confirmLogout');
    const cancelBtn = document.getElementById('cancelLogout');
    const closeBtn = logoutModal.querySelector('.logout-close-btn');

    if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
            localStorage.setItem('isLoggedIn', 'false');
            logoutModal.style.display = 'none';
            alert('Has cerrado sesión.');
            window.location.reload();
        });
    }
    if (cancelBtn) cancelBtn.addEventListener('click', () => logoutModal.style.display = 'none');
    if (closeBtn) closeBtn.addEventListener('click', () => logoutModal.style.display = 'none');

    logoutModal.addEventListener('click', e => {
        if (e.target === logoutModal) logoutModal.style.display = 'none';
    });
}

// ================== Modal Agendar ==================
function initAgendarModal() {
    const modal = document.getElementById('agendarModal');
    if (!modal) return;

    const closeBtn = modal.querySelector('.close-btn-agendar');
    const cancelBtn = modal.querySelector('.btn-agendar-cancel');
    const form = modal.querySelector('#agendarForm');

    const closeModal = () => modal.style.display = 'none';
    closeBtn?.addEventListener('click', closeModal);
    cancelBtn?.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

    form.addEventListener('submit', e => {
        e.preventDefault();
        const servicioSeleccionado = form.servicio.value;
        if (!servicioSeleccionado) {
            alert('Por favor selecciona un servicio.');
            return;
        }
        closeModal();
        alert(`Servicio "${servicioSeleccionado}" seleccionado. Redirigiendo...`);
        window.location.href = 'servicios.html';
    });
}

// ================== Modal Notificaciones ==================
function initBellIcon() {
    const bellIcon = document.querySelector('.fa-bell');
    if (!bellIcon) return;

    bellIcon.addEventListener('click', () => {
        const modal = document.getElementById('notificaciones-modal');
        if (modal) {
            modal.style.display = 'block';
            loadNotificaciones();
        }
    });
}

function initNotificacionesModal() {
    const modal = document.getElementById('notificaciones-modal');
    if (!modal) console.error('Modal de notificaciones no encontrado');
}

function loadNotificaciones() {
    const lista = document.getElementById('notificaciones-list');
    if (!lista) return;
    lista.innerHTML = '';
    ['Tienes un nuevo mensaje.', 'Tu cita ha sido confirmada.', 'Promoción disponible esta semana.']
        .forEach(noti => {
            const li = document.createElement('li');
            li.textContent = noti;
            lista.appendChild(li);
        });
}

// ================== Modal Auth ==================
function initializeModalEvents() {
    const modal = document.getElementById('authModal');
    if (!modal) return;

    const showLoginBtn = document.getElementById('showLogin');
    const showRegisterBtn = document.getElementById('showRegister');
    const registerView = document.getElementById('registerView');
    const loginView = document.getElementById('loginView');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    const handleAuthSuccess = () => {
        localStorage.setItem('isLoggedIn', 'true');
        modal.style.display = 'none';
        const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
        if (redirectUrl) {
            window.location.href = redirectUrl;
            sessionStorage.removeItem('redirectAfterAuth');
        } else {
            alert('¡Autenticación exitosa!');
        }
    };

    registerForm.addEventListener('submit', e => {
        e.preventDefault();
        alert('¡Cuenta creada con éxito! Por favor, inicia sesión.');
        registerView.style.display = 'none';
        loginView.style.display = 'block';
        registerForm.reset();
    });

    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        handleAuthSuccess();
    });

    showLoginBtn?.addEventListener('click', e => {
        e.preventDefault();
        registerView.style.display = 'none';
        loginView.style.display = 'block';
    });

    showRegisterBtn?.addEventListener('click', e => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
    });
}

// ================== Menú de Perfil ==================
function initProfileMenuEvents() {
    const logoutBtn = document.getElementById('logoutButton');
    if (!logoutBtn) return;
    logoutBtn.addEventListener('click', e => {
        e.preventDefault();
        document.getElementById('profileMenuModal').style.display = 'none';
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) logoutModal.style.display = 'flex';
    });
}

function toggleProfileMenu() {
    const profileModal = document.getElementById('profileMenuModal');
    if (!profileModal) return;
    const isVisible = profileModal.style.display === 'block';
    closeAllModals();
    profileModal.style.display = isVisible ? 'none' : 'block';
}

// ================== Cierre Global ==================
function closeAllModals() {
    document.querySelectorAll('#authModal, #notificaciones-modal, #profileMenuModal, #logoutModal, #agendarModal')
        .forEach(m => m.style.display = 'none');
}

// ================== CLICK GLOBAL UNIFICADO ✅ ==================
document.addEventListener('click', e => {
    const target = e.target;

    // --- Abrir AGENDAR ---
    if (target.closest('.btn-agendar')) {
        e.preventDefault();
        const modal = document.getElementById('agendarModal');
        if (modal) modal.style.display = 'flex';
        return;
    }

    // --- Abrir LOGOUT ---
    if (target.closest('#logoutButton')) {
        e.preventDefault();
        const profileMenu = document.getElementById('profileMenuModal');
        if (profileMenu) profileMenu.style.display = 'none';
        const logoutModal = document.getElementById('logoutModal');
        if (logoutModal) logoutModal.style.display = 'flex';
        return;
    }

    // --- Icono de usuario (auth o perfil) ---
    const authTrigger = target.closest('.auth-trigger');
    if (authTrigger) {
        e.preventDefault();
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            toggleProfileMenu();
        } else {
            const targetUrl = authTrigger.getAttribute('data-target');
            sessionStorage.setItem('redirectAfterAuth', targetUrl);
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'flex';
        }
        return;
    }

    // --- Click fuera del menú de perfil ---
    const profileModal = document.getElementById('profileMenuModal');
    if (profileModal && profileModal.style.display === 'block' && !profileModal.contains(target)) {
        profileModal.style.display = 'none';
    }
});

// ================== Inicialización ==================
document.addEventListener('DOMContentLoaded', () => {
    loadHeaderFooter();
    loadModalNotificaciones();
    loadModalAgendar();
    loadModalAuth();
    loadModalProfileMenu();
});
