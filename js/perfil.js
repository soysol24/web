document.addEventListener('DOMContentLoaded', () => {
    console.log('=== PERFIL.JS INICIADO ===');



    // ========================================
    // REFERENCIAS A ELEMENTOS
    // ========================================

    // Vistas
    const viewProfileSection = document.getElementById('view-profile-section');
    const editProfileSection = document.getElementById('edit-profile-section');

    // Botones principales
    const editButton = document.getElementById('btn-edit');
    const cancelButton = document.getElementById('btn-cancel');
    const saveButton = document.getElementById('btn-save');

    // Inputs de vista (solo lectura)
    const viewEmailInput = document.getElementById('view-email');
    const viewPassInput = document.getElementById('view-pass');

    // Inputs de edición
    const editUsernameInput = document.getElementById('edit-username');
    const editEmailInput = document.getElementById('edit-email');
    const editEmailConfirmInput = document.getElementById('edit-email-confirm');
    const editPassInput = document.getElementById('edit-pass');
    const editPassConfirmInput = document.getElementById('edit-pass-confirm');
    const editPhoneInput = document.getElementById('edit-phone');


    // Mensajes de error
    const errorUsername = document.getElementById('error-username');
    const errorEmail = document.getElementById('error-email');
    const errorEmailConfirm = document.getElementById('error-email-confirm');
    const errorPass = document.getElementById('error-pass');
    const errorPassConfirm = document.getElementById('error-pass-confirm');
    const errorPhone = document.getElementById('error-phone');
   

    // Modal de confirmación
    const modalOverlay = document.getElementById('profile-modal-overlay');
    const confirmModal = document.getElementById('profile-confirm-modal');
    const modalCloseX = document.getElementById('modal-close-x');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');

    // Modal de éxito
    const successModal = document.getElementById('profile-success-modal');
    const successCloseBtn = document.getElementById('profile-close-modal');

    // Arrays para iteración
    const inputs = [
        editUsernameInput,
        editEmailInput,
        editEmailConfirmInput,
        editPassInput,
        editPassConfirmInput,
        editPhoneInput,
        
    ];

    const errorMessages = [
        errorUsername,
        errorEmail,
        errorEmailConfirm,
        errorPass,
        errorPassConfirm,
        errorPhone,
        
    ];

    if (!viewProfileSection || !editProfileSection || !editButton || !saveButton) {
        console.error('❌ Faltan elementos críticos en el DOM');
        return;
    }

    console.log('✅ Todos los elementos cargados correctamente');

    // ========================================
    // FUNCIONES DE VALIDACIÓN
    // ========================================

    function showError(input, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        input.closest('.profile-form-group').classList.add('error');
    }

    function clearError(input, errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        input.closest('.profile-form-group').classList.remove('error');
    }

    function clearAllErrors() {
        inputs.forEach((input, i) => clearError(input, errorMessages[i]));
    }

    function validateForm() {
        let isValid = true;
        clearAllErrors();

        const username = editUsernameInput.value.trim();
        const email = editEmailInput.value.trim();
        const emailConfirm = editEmailConfirmInput.value.trim();
        const pass = editPassInput.value.trim();
        const passConfirm = editPassConfirmInput.value.trim();
        const phone = editPhoneInput.value.trim();
      
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{8,}$/; // al menos 8 dígitos

        // Validar usuario
        if (username === '') {
            showError(editUsernameInput, errorUsername, 'El nombre de usuario no puede estar vacío.');
            isValid = false;
        } else if (username.length < 3) {
            showError(editUsernameInput, errorUsername, 'Debe tener al menos 3 caracteres.');
            isValid = false;
        }

        // Validar email
        if (email === '') {
            showError(editEmailInput, errorEmail, 'El email no puede estar vacío.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError(editEmailInput, errorEmail, 'Introduce un email válido.');
            isValid = false;
        }

        // Confirmar email
        if (emailConfirm === '') {
            showError(editEmailConfirmInput, errorEmailConfirm, 'Confirma tu email.');
            isValid = false;
        } else if (email !== emailConfirm) {
            showError(editEmailConfirmInput, errorEmailConfirm, 'Los emails no coinciden.');
            isValid = false;
        }

        // Validar contraseña
        if (pass === '') {
            showError(editPassInput, errorPass, 'La contraseña no puede estar vacía.');
            isValid = false;
        } else if (pass.length < 8) {
            showError(editPassInput, errorPass, 'Debe tener al menos 8 caracteres.');
            isValid = false;
        }

        // Confirmar contraseña
        if (passConfirm === '') {
            showError(editPassConfirmInput, errorPassConfirm, 'Confirma tu contraseña.');
            isValid = false;
        } else if (pass !== passConfirm) {
            showError(editPassConfirmInput, errorPassConfirm, 'Las contraseñas no coinciden.');
            isValid = false;
        }

        // Validar teléfono
        if (phone === '') {
            showError(editPhoneInput, errorPhone, 'El número de teléfono no puede estar vacío.');
            isValid = false;
        } else if (!phoneRegex.test(phone)) {
            showError(editPhoneInput, errorPhone, 'Introduce un número de teléfono válido (solo dígitos).');
            isValid = false;
        }

        // Confirmar teléfono
       

        return isValid;
    }

    // ========================================
    // MODALES
    // ========================================

    function openConfirmModal() {
        modalOverlay.classList.add('show');
        confirmModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeConfirmModal() {
        modalOverlay.classList.remove('show');
        confirmModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openSuccessModal() {
        modalOverlay.classList.add('show');
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSuccessModal() {
        modalOverlay.classList.remove('show');
        successModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // ========================================
    // VISTAS
    // ========================================

    function showEditView() {
        clearAllErrors();
        editUsernameInput.value = 'Usuario anterior';
        editEmailInput.value = viewEmailInput.value;
        editEmailConfirmInput.value = '';
        editPassInput.value = '';
        editPassConfirmInput.value = '';
        editPhoneInput.value = '';
      
        viewProfileSection.classList.add('hidden');
        editProfileSection.classList.remove('hidden');
    }

    function showProfileView() {
        clearAllErrors();
        editProfileSection.classList.add('hidden');
        viewProfileSection.classList.remove('hidden');
    }

    // ========================================
    // GUARDADO
    // ========================================

    function saveProfileChanges() {
        console.log('💾 Guardando cambios...');
        const newUsername = editUsernameInput.value.trim();
        const newEmail = editEmailInput.value.trim();
        const newPass = editPassInput.value.trim();
        const newPhone = editPhoneInput.value.trim();

        // Simulación (aquí iría fetch o API call)
        setTimeout(() => {
            viewEmailInput.value = newEmail;
            console.log('✅ Datos guardados:', {
                usuario: newUsername,
                email: newEmail,
                contraseña: newPass.replace(/./g, '*'),
                teléfono: newPhone
            });
            openSuccessModal();
        }, 600);
    }

    // ========================================
    // EVENTOS
    // ========================================

    editButton.addEventListener('click', showEditView);
    cancelButton.addEventListener('click', showProfileView);

    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (validateForm()) {
            openConfirmModal();
        }
    });

    modalCloseX?.addEventListener('click', closeConfirmModal);
    modalCancelBtn?.addEventListener('click', closeConfirmModal);
    modalConfirmBtn?.addEventListener('click', () => {
        closeConfirmModal();
        saveProfileChanges();
    });
    successCloseBtn?.addEventListener('click', () => {
        closeSuccessModal();
        showProfileView();
    });

    modalOverlay?.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeConfirmModal();
            closeSuccessModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeConfirmModal();
            closeSuccessModal();
        }
    });

    // Limpiar errores mientras se escribe
    inputs.forEach((input, i) => {
        input.addEventListener('input', () => clearError(input, errorMessages[i]));
    });

    console.log('=== PERFIL.JS LISTO ===');
});
