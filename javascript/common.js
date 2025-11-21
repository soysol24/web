// ========================================
// FUNCIONES COMUNES COMPARTIDAS
// ========================================

/**
 * Utilidades generales
 */
const Utils = {
    /**
     * Formatea una fecha al formato DD/MM/YYYY
     */
    formatDate: (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    },

    /**
     * Formatea hora en formato 12 horas
     */
    formatTime: (time) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'pm' : 'am';
        const formattedHour = h % 12 === 0 ? 12 : h % 12;
        return `${formattedHour}:${minute} ${ampm}`;
    },

    /**
     * Genera un ID único
     */
    generateId: () => Date.now(),

    /**
     * Formatea un precio
     */
    formatPrice: (price) => {
        if (typeof price === 'number') {
            return `$${price}`;
        }
        return price.startsWith('$') ? price : `$${price}`;
    }
};

/**
 * Gestor de modales
 */
const ModalManager = {
    /**
     * Abre un modal
     */
    open: (modal) => {
        if (modal) {
            modal.classList.add('active');
            setTimeout(() => {
                const content = modal.querySelector('.modal-content');
                if (content) {
                    content.style.transform = 'scale(1)';
                }
            }, 10);
        }
    },

    /**
     * Cierra un modal
     */
    close: (modal) => {
        if (modal) {
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = 'scale(0.7)';
            }
            setTimeout(() => {
                modal.classList.remove('active');
            }, 200);
        }
    },

    /**
     * Inicializa los botones de cerrar de todos los modales
     */
    initializeCloseButtons: () => {
        const closeButtons = document.querySelectorAll('.close-modal-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = btn.closest('.modal-overlay');
                if (modal) {
                    ModalManager.close(modal);
                }
            });
        });

        // Cerrar al hacer clic fuera del modal
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    ModalManager.close(modal);
                }
            });
        });
    }
};

/**
 * Gestor de navegación
 */
const NavigationManager = {
    /**
     * Oculta todas las secciones
     */
    hideAllSections: () => {
        document.querySelectorAll('.content-section').forEach(section => {
            section.style.display = 'none';
        });
    },

    /**
     * Muestra una sección específica
     */
    showSection: (sectionId) => {
        NavigationManager.hideAllSections();
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.display = 'block';
        }
    },

    /**
     * Actualiza el elemento activo del sidebar
     */
    updateActiveNavItem: (viewName) => {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    },

    /**
     * Inicializa la navegación del sidebar
     */
    initializeSidebar: (modules) => {
        const navItems = document.querySelectorAll('.sidebar-nav .nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = item.dataset.view;
                
                if (modules[view] && typeof modules[view].show === 'function') {
                    NavigationManager.updateActiveNavItem(view);
                    modules[view].show();
                }
            });
        });
    }
};

/**
 * Gestor de confirmaciones
 */
const ConfirmationManager = {
    confirmSaveModal: null,
    confirmDeleteModal: null,
    confirmCancelModal: null,
    successModal: null,
    
    /**
     * Inicializa los modales de confirmación
     */
    initialize: () => {
        ConfirmationManager.confirmSaveModal = document.getElementById('confirmSaveItemModal');
        ConfirmationManager.confirmDeleteModal = document.getElementById('confirmDeleteItemModal');
        ConfirmationManager.confirmCancelModal = document.getElementById('confirmCancelItemModal');
        ConfirmationManager.successModal = document.getElementById('saveItemSuccessModal');
    },

    /**
     * Muestra confirmación de guardado
     */
    confirmSave: (message, onConfirm) => {
        const messageEl = document.getElementById('confirmSaveItemMessage');
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        const acceptBtn = document.getElementById('acceptSaveItem');
        const cancelBtn = document.getElementById('cancelSaveItem');
        
        if (acceptBtn && cancelBtn) {
            // Remover listeners anteriores
            const newAcceptBtn = acceptBtn.cloneNode(true);
            acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
            
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            
            // Agregar nuevos listeners
            newAcceptBtn.addEventListener('click', () => {
                ModalManager.close(ConfirmationManager.confirmSaveModal);
                if (onConfirm) onConfirm();
            });
            
            newCancelBtn.addEventListener('click', () => {
                ModalManager.close(ConfirmationManager.confirmSaveModal);
            });
        }
        
        ModalManager.open(ConfirmationManager.confirmSaveModal);
    },

    /**
     * Muestra confirmación de eliminación
     */
    confirmDelete: (onConfirm) => {
        const acceptBtn = document.getElementById('acceptDeleteItem');
        const cancelBtn = document.getElementById('cancelDeleteItem');
        
        if (acceptBtn && cancelBtn) {
            const newAcceptBtn = acceptBtn.cloneNode(true);
            acceptBtn.parentNode.replaceChild(newAcceptBtn, acceptBtn);
            
            const newCancelBtn = cancelBtn.cloneNode(true);
            cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
            
            newAcceptBtn.addEventListener('click', () => {
                ModalManager.close(ConfirmationManager.confirmDeleteModal);
                if (onConfirm) onConfirm();
            });
            
            newCancelBtn.addEventListener('click', () => {
                ModalManager.close(ConfirmationManager.confirmDeleteModal);
            });
        }
        
        ModalManager.open(ConfirmationManager.confirmDeleteModal);
    },

    /**
     * Muestra mensaje de éxito
     */
    showSuccess: (message) => {
        const messageEl = document.getElementById('saveItemSuccessMessage');
        if (messageEl) {
            messageEl.textContent = message;
        }
        
        const okBtn = document.getElementById('okItemSuccess');
        if (okBtn) {
            const newOkBtn = okBtn.cloneNode(true);
            okBtn.parentNode.replaceChild(newOkBtn, okBtn);
            
            newOkBtn.addEventListener('click', () => {
                ModalManager.close(ConfirmationManager.successModal);
            });
        }
        
        ModalManager.open(ConfirmationManager.successModal);
    }
};

/**
 * Gestor de imágenes
 */
const ImageManager = {
    /**
     * Configurar subida de imagen
     */
    setupImageUpload: (uploadAreaId, callback) => {
        const uploadArea = document.getElementById(uploadAreaId);
        if (!uploadArea) return;
        
        const input = uploadArea.querySelector('input[type="file"]');
        if (!input) return;
        
        uploadArea.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.click();
            }
        });
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                alert('El archivo es demasiado grande. Máximo 5MB.');
                input.value = '';
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                if (callback) {
                    callback(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        });
    },

    /**
     * Actualizar vista previa de imagen
     */
    updatePreview: (uploadAreaId, imageData) => {
        const uploadArea = document.getElementById(uploadAreaId);
        if (!uploadArea) return;
        
        if (imageData) {
            uploadArea.style.backgroundImage = `url(${imageData})`;
            uploadArea.style.backgroundSize = 'cover';
            uploadArea.style.backgroundPosition = 'center';
            uploadArea.querySelector('i')?.remove();
            uploadArea.querySelector('span')?.remove();
        } else {
            uploadArea.style.backgroundImage = '';
            if (!uploadArea.querySelector('i')) {
                const icon = document.createElement('i');
                icon.className = 'fas fa-upload';
                icon.setAttribute('aria-hidden', 'true');
                const span = document.createElement('span');
                span.textContent = 'Subir imagen';
                uploadArea.appendChild(icon);
                uploadArea.appendChild(span);
            }
        }
    }
};

/**
 * Gestor de formularios
 */
const FormManager = {
    /**
     * Resetea un formulario
     */
    reset: (formId) => {
        const form = document.getElementById(formId);
        if (form) {
            form.reset();
        }
    },

    /**
     * Obtiene los datos de un formulario
     */
    getData: (formId) => {
        const form = document.getElementById(formId);
        if (!form) return null;
        
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    },

    /**
     * Establece los datos de un formulario
     */
    setData: (formId, data) => {
        const form = document.getElementById(formId);
        if (!form) return;
        
        Object.keys(data).forEach(key => {
            const input = form.querySelector(`[name="${key}"]`);
            if (input) {
                input.value = data[key];
            }
        });
    }
};

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Utils,
        ModalManager,
        NavigationManager,
        ConfirmationManager,
        ImageManager,
        FormManager
    };
}
