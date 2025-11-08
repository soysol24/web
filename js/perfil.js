document.addEventListener('DOMContentLoaded', () => {
    console.log('=== PERFIL.JS INICIADO ===');

    // Cargar header/footer
    if (typeof loadHeaderFooter === 'function') {
        loadHeaderFooter();
    }

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
    const editEmailInput = document.getElementById('edit-email');
    const editEmailConfirmInput = document.getElementById('edit-email-confirm');
    const editPassInput = document.getElementById('edit-pass');
    const editPassConfirmInput = document.getElementById('edit-pass-confirm');

    // Mensajes de error
    const errorEmail = document.getElementById('error-email');
    const errorEmailConfirm = document.getElementById('error-email-confirm');
    const errorPass = document.getElementById('error-pass');
    const errorPassConfirm = document.getElementById('error-pass-confirm');

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
    const inputs = [editEmailInput, editEmailConfirmInput, editPassInput, editPassConfirmInput];
    const errorMessages = [errorEmail, errorEmailConfirm, errorPass, errorPassConfirm];

    // Validar elementos críticos
    if (!viewProfileSection || !editProfileSection || !editButton || !saveButton) {
        console.error('❌ Faltan elementos críticos en el DOM');
        return;
    }

    console.log('✅ Todos los elementos cargados correctamente');

    // ========================================
    // FUNCIONES DE VALIDACIÓN
    // ========================================

    function showError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.closest('.profile-form-group').classList.add('error');
    }

    function clearError(inputElement, errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        inputElement.closest('.profile-form-group').classList.remove('error');
    }

    function clearAllErrors() {
        inputs.forEach((input, i) => clearError(input, errorMessages[i]));
    }

    function validateForm() {
        let isValid = true;
        clearAllErrors();

        const email = editEmailInput.value.trim();
        const emailConfirm = editEmailConfirmInput.value.trim();
        const pass = editPassInput.value.trim();
        const passConfirm = editPassConfirmInput.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // Validar email
        if (email === '') {
            showError(editEmailInput, errorEmail, 'El email no puede estar vacío.');
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError(editEmailInput, errorEmail, 'Introduce un email válido.');
            isValid = false;
        }

        // Validar confirmación de email
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

        // Validar confirmación de contraseña
        if (passConfirm === '') {
            showError(editPassConfirmInput, errorPassConfirm, 'Confirma tu contraseña.');
            isValid = false;
        } else if (pass !== passConfirm) {
            showError(editPassConfirmInput, errorPassConfirm, 'Las contraseñas no coinciden.');
            isValid = false;
        }

        return isValid;
    }

    // ========================================
    // FUNCIONES DE MODALES
    // ========================================

    function openConfirmModal() {
        console.log('📋 Abriendo modal de confirmación');
        modalOverlay.classList.add('show');
        confirmModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeConfirmModal() {
        console.log('❌ Cerrando modal de confirmación');
        modalOverlay.classList.remove('show');
        confirmModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    function openSuccessModal() {
        console.log('✅ Abriendo modal de éxito');
        modalOverlay.classList.add('show');
        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeSuccessModal() {
        console.log('❌ Cerrando modal de éxito');
        modalOverlay.classList.remove('show');
        successModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // ========================================
    // FUNCIONES DE VISTAS
    // ========================================

    function showEditView() {
        console.log('✏️ Cambiando a vista de edición');
        clearAllErrors();
        
        // Pre-cargar valores actuales
        editEmailInput.value = viewEmailInput.value;
        editEmailConfirmInput.value = '';
        editPassInput.value = '';
        editPassConfirmInput.value = '';
        
        viewProfileSection.classList.add('hidden');
        editProfileSection.classList.remove('hidden');
    }

    function showProfileView() {
        console.log('👁️ Cambiando a vista de perfil');
        clearAllErrors();
        editProfileSection.classList.add('hidden');
        viewProfileSection.classList.remove('hidden');
    }

    // ========================================
    // FUNCIÓN DE GUARDADO
    // ========================================

    function saveProfileChanges() {
        console.log('💾 Guardando cambios...');
        
        const newEmail = editEmailInput.value.trim();
        const newPass = editPassInput.value.trim();

        // AQUÍ VA TU LÓGICA DE GUARDADO REAL
        // Ejemplo con fetch:
        /*
        fetch('/api/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: newEmail, password: newPass })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Actualizar vista
                viewEmailInput.value = newEmail;
                openSuccessModal();
            }
        })
        .catch(error => console.error('Error:', error));
        */

        // Simulación de guardado (REEMPLAZA ESTO CON TU BACKEND)
        setTimeout(() => {
            // Actualizar campos de vista
            viewEmailInput.value = newEmail;
            // La contraseña se mantiene oculta como "**********"
            
            console.log('✅ Datos guardados exitosamente');
            openSuccessModal();
        }, 500);
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    // Botón "Editar"
    editButton.addEventListener('click', showEditView);

    // Botón "Cancelar"
    cancelButton.addEventListener('click', showProfileView);

    // Botón "Guardar" - Abre modal de confirmación
    saveButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('💾 Botón Guardar presionado');
        
        if (validateForm()) {
            openConfirmModal();
        } else {
            console.log('❌ Formulario con errores');
        }
    });

    // Modal de Confirmación - Botón "X"
    if (modalCloseX) {
        modalCloseX.addEventListener('click', closeConfirmModal);
    }

    // Modal de Confirmación - Botón "Cancelar"
    if (modalCancelBtn) {
        modalCancelBtn.addEventListener('click', closeConfirmModal);
    }

    // Modal de Confirmación - Botón "Guardar"
    if (modalConfirmBtn) {
        modalConfirmBtn.addEventListener('click', () => {
            closeConfirmModal();
            saveProfileChanges();
        });
    }

    // Modal de Éxito - Botón "Aceptar"
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            closeSuccessModal();
            showProfileView();
        });
    }

    // Cerrar modal al hacer clic en overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeConfirmModal();
                closeSuccessModal();
            }
        });
    }

    // Cerrar modales con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeConfirmModal();
            closeSuccessModal();
        }
    });

    // Limpiar errores mientras se escribe
    inputs.forEach((input, index) => {
        input.addEventListener('input', () => {
            clearError(input, errorMessages[index]);
        });
    });

    console.log('=== PERFIL.JS LISTO ===');
});