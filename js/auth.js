// ==========================================
// 📁 auth.js - SISTEMA DE AUTENTICACIÓN
// ==========================================

class AuthManager {
    constructor() {
        this.isUserLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.authModal = null;
        this.logoutModal = null;
        this.profileModal = null;
    }

    // ============================
    // SESIÓN
    // ============================
    isLoggedIn() {
        return this.isUserLoggedIn;
    }

    login() {
        this.isUserLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        this.closeAuthModal();

        const redirectUrl = sessionStorage.getItem('redirectAfterAuth');
        if (redirectUrl) {
            window.location.href = redirectUrl;
            sessionStorage.removeItem('redirectAfterAuth');
        } else {
            alert('¡Autenticación exitosa!');
        }
    }

    logout() {
        this.isUserLoggedIn = false;
        localStorage.removeItem('isLoggedIn');
        this.hideLogoutModal();

        if (this.profileModal) this.profileModal.style.display = 'none';
        window.location.href = 'inicio.html';
    }

    // ============================
    // MODAL DE AUTH
    // ============================
    async loadAuthModal() {
        const placeholder = document.getElementById('modal-placeholder');
        try {
            const res = await fetch('modals/register.html');
            const html = await res.text();
            placeholder.innerHTML += html;
            this.authModal = document.getElementById('authModal');
            this.initAuthModalEvents();
        } catch (err) {
            console.error('Error cargando modal auth:', err);
        }
    }

    initAuthModalEvents() {
        if (!this.authModal) return;

        const showLoginBtn = document.getElementById('showLogin');
        const showRegisterBtn = document.getElementById('showRegister');
        const registerView = document.getElementById('registerView');
        const loginView = document.getElementById('loginView');
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const closeBtn = this.authModal.querySelector('.close-btn');

        if (showLoginBtn) showLoginBtn.addEventListener('click', e => {
            e.preventDefault();
            registerView.style.display = 'none';
            loginView.style.display = 'block';
        });

        if (showRegisterBtn) showRegisterBtn.addEventListener('click', e => {
            e.preventDefault();
            loginView.style.display = 'none';
            registerView.style.display = 'block';
        });

        if (registerForm) registerForm.addEventListener('submit', e => {
            e.preventDefault();
            alert('¡Cuenta creada con éxito! Por favor, inicia sesión.');
            registerView.style.display = 'none';
            loginView.style.display = 'block';
            registerForm.reset();
        });

        if (loginForm) loginForm.addEventListener('submit', e => {
            e.preventDefault();
            this.login();
        });

        if (closeBtn) closeBtn.addEventListener('click', () => this.closeAuthModal());

        // Cerrar al hacer clic fuera
        this.authModal.addEventListener('click', e => {
            if (e.target === this.authModal) this.closeAuthModal();
        });

        // Cerrar con ESC
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.authModal.style.display === 'flex') {
                this.closeAuthModal();
            }
        });
    }

    openAuthModal() {
        if (this.authModal) this.authModal.style.display = 'flex';
    }

    closeAuthModal() {
        if (this.authModal) this.authModal.style.display = 'none';
    }

    // ============================
    // MODAL DE LOGOUT
    // ============================
    async loadLogoutModal() {
        const placeholder = document.getElementById('modal-placeholder-logout');
        try {
            const res = await fetch('modals/logout_confirm.html');
            const html = await res.text();
            placeholder.innerHTML = html; // reemplaza contenido
            this.logoutModal = document.getElementById('logoutModal');
            this.initLogoutModalEvents();
        } catch (err) {
            console.error('Error cargando modal logout:', err);
        }
    }

    initLogoutModalEvents() {
        if (!this.logoutModal) return;

        const confirmBtn = document.getElementById('confirmLogout');
        const cancelBtn = document.getElementById('cancelLogout');
        const closeBtn = this.logoutModal.querySelector('.logout-close-btn');

        if (confirmBtn) confirmBtn.addEventListener('click', () => this.logout());
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hideLogoutModal());
        if (closeBtn) closeBtn.addEventListener('click', () => this.hideLogoutModal());

        this.logoutModal.addEventListener('click', e => {
            if (e.target === this.logoutModal) this.hideLogoutModal();
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this.logoutModal.classList.contains('show')) {
                this.hideLogoutModal();
            }
        });
    }

    showLogoutModal() {
        if (this.logoutModal) {
            this.logoutModal.style.display = 'flex';
            setTimeout(() => this.logoutModal.classList.add('show'), 10);
        }
    }

    hideLogoutModal() {
        if (this.logoutModal) {
            this.logoutModal.classList.remove('show');
            setTimeout(() => {
                this.logoutModal.style.display = 'none';
            }, 300);
        }
    }

    // ============================
    // MODAL DE PERFIL
    // ============================
    async loadProfileMenu() {
        const placeholder = document.getElementById('modal-placeholder');
        try {
            const res = await fetch('modals/profile_menu.html');
            const html = await res.text();
            placeholder.innerHTML += html;
            this.profileModal = document.getElementById('profileMenuModal');
            this.initProfileMenuEvents();
        } catch (err) {
            console.error('Error cargando menú de perfil:', err);
        }
    }

    initProfileMenuEvents() {
        const logoutBtn = document.getElementById('logoutButton');
        if (logoutBtn) logoutBtn.addEventListener('click', e => {
            e.preventDefault();
            if (this.profileModal) this.profileModal.style.display = 'none';
            this.showLogoutModal();
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', e => {
            if (this.profileModal && this.profileModal.style.display === 'block') {
                if (!this.profileModal.contains(e.target) && !e.target.closest('.auth-trigger')) {
                    this.profileModal.style.display = 'none';
                }
            }
        });
    }

    toggleProfileMenu() {
        if (!this.profileModal) return;
        const visible = this.profileModal.style.display === 'block';
        this.closeAllModals();
        this.profileModal.style.display = visible ? 'none' : 'block';
    }

    // ============================
    // AUTH TRIGGERS
    // ============================
    attachAuthTriggers() {
        document.querySelectorAll('.auth-trigger').forEach(trigger => {
            trigger.addEventListener('click', e => {
                e.preventDefault();
                const targetUrl = trigger.getAttribute('data-target');
                if (this.isUserLoggedIn) {
                    this.toggleProfileMenu();
                } else {
                    this.openAuthModal();
                    if (targetUrl) sessionStorage.setItem('redirectAfterAuth', targetUrl);
                }
            });
        });
    }

    closeAllModals() {
        if (this.authModal) this.authModal.style.display = 'none';
        if (this.logoutModal) this.logoutModal.style.display = 'none';
        if (this.profileModal) this.profileModal.style.display = 'none';
    }

    // ============================
    // INICIALIZACIÓN
    // ============================
    async init() {
        await this.loadAuthModal();
        await this.loadProfileMenu();
        await this.loadLogoutModal();
        this.attachAuthTriggers();
    }
}

// ============================
// INICIALIZACIÓN GLOBAL
// ============================
const authManager = new AuthManager();