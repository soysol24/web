document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // I. DATOS Y ESTADO GLOBAL
    // =================================================================
    let currentDate = new Date();
    let selectedDay = null;
    let isEditMode = false;
    let currentAddDayElement = null;
    let contextMenu = null;
    let activeContextMenuAppointment = null;
    let portfolioImages = [];
    let portfolioSlots = 6;
    
    // Datos simulados
    let promotions = [
        { 
            id: 1, 
            name: 'Promoción Especial Verano', 
            duration: '2 horas',
            description: 'Corte + Tinte + Peinado',
            includes: 'Tratamiento capilar incluido', 
            price: '$500',
            form: 'Formulario 1',
            validity: '30 días',
            image: null
        }
    ];
    
    let services = [
        { 
            id: 1, 
            name: 'Corte de Cabello', 
            duration: '45 minutos',
            description: 'Corte profesional personalizado', 
            includes: 'Lavado y peinado',
            price: '$200',
            form: 'Formulario 2',
            image: null
        }
    ];
    
    let stylists = [
        { 
            id: 1, 
            name: 'María González', 
            phone: '555-1234', 
            user: 'maria.gonzalez',
            services: 'Corte, Tinte, Peinado', 
            schedule: 'Lun-Vie 9:00-18:00',
            occupation: 'Estilista Senior',
            image: null
        }
    ];

    let forms = [
        {
            id: 1,
            name: 'Formulario 1',
            questions: ['¿Alergias?', '¿Tratamientos previos?']
        }
    ];
    
    let editingPromotionId = null;
    let editingServiceId = null;
    let editingStylistId = null;
    let editingFormId = null;

    let appointments = [
        { id: 1, date: '2025-02-15', time: '10:00', description: 'Juan - Corte', color: 'red', client: 'Juan Perez', service: 'Corte', stylist: 'Estilista 1' },
        { id: 2, date: '2025-02-15', time: '14:30', description: 'Maria - Tinte', color: 'blue', client: 'Maria Lopez', service: 'Tinte', stylist: 'Estilista 2' },
        { id: 3, date: '2025-02-27', time: '16:00', description: 'Carlos - Manicure', color: 'green', client: 'Carlos Gomez', service: 'Manicure', stylist: 'Estilista 1' },
        { id: 4, date: '2025-02-27', time: '09:00', description: 'Sofia - Corte', color: 'purple', client: 'Sofia Diaz', service: 'Corte', stylist: 'Estilista 2' },
    ];

    // =================================================================
    // II. ELEMENTOS DEL DOM
    // =================================================================
    const currentMonthYearSpan = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonthBtn');
    const nextMonthBtn = document.getElementById('nextMonthBtn');
    const monthViewBtn = document.getElementById('monthViewBtn');
    const dayViewBtn = document.getElementById('dayViewBtn');
    const editCalendarBtn = document.getElementById('editCalendarBtn');
    const calendarMonthView = document.getElementById('calendarMonthView');
    const monthCalendarGrid = calendarMonthView.querySelector('.month-calendar-grid');
    const calendarDayView = document.getElementById('calendarDayView');
    const currentDaySpan = document.getElementById('currentDay');
    const dayTimeline = calendarDayView.querySelector('.day-timeline');
    const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');

    // Secciones
    const portfolioSection = document.querySelector('.portfolio-section');
    const calendarSection = document.querySelector('.calendar-section');
    const portfolioGrid = document.getElementById('portfolioGrid');
    const addImageSlotBtn = document.getElementById('addImageSlotBtn');
    
    const promotionSection = document.querySelector('.promotion-section');
    const servicesSection = document.querySelector('.services-section');
    const stylistsSection = document.querySelector('.stylists-section');
    const reportsSection = document.querySelector('.reports-section');
    const formSection = document.querySelector('.form-section');
    const commentsSection = document.querySelector('.comments-section');
    const profileSection = document.querySelector('.profile-section');
    
    const promotionsGrid = document.getElementById('promotionsGrid');
    const servicesGrid = document.getElementById('servicesGrid');
    const stylistsList = document.getElementById('stylistsList');
    const formsList = document.getElementById('formsList');
    
    const addPromotionBtn = document.getElementById('addPromotionBtn');
    const addServiceBtn = document.getElementById('addServiceBtn');
    const addStylistBtn = document.getElementById('addStylistBtn');
    const addFormBtn = document.getElementById('addFormBtn');
    
    // Modales
    const addPromotionModal = document.getElementById('addPromotionModal');
    const addServiceModal = document.getElementById('addServiceModal');
    const addStylistModal = document.getElementById('addStylistModal');
    const addFormModal = document.getElementById('addFormModal');
    const addAppointmentModal = document.getElementById('addAppointmentModal');
    const confirmSaveModal = document.getElementById('confirmSaveModal');
    const confirmCancelModal = document.getElementById('confirmCancelModal');
    const saveSuccessModal = document.getElementById('saveSuccessModal');
    const confirmAcceptModal = document.getElementById('confirmAcceptModal');
    const confirmRejectModal = document.getElementById('confirmRejectModal');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal'); 
    const confirmRescheduleModal = document.getElementById('confirmRescheduleModal');
    const actionSuccessModal = document.getElementById('actionSuccessModal');
    const logoutModal = document.getElementById('logoutModal');
    
    // Botones
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');
    const cancelAddAppointmentBtn = document.getElementById('cancelAddAppointment');
    const addAppointmentForm = document.getElementById('addAppointmentForm');
    const acceptSaveConfirmBtn = document.getElementById('acceptSaveConfirm');
    const cancelSaveConfirmBtn = document.getElementById('cancelSaveConfirm');
    const acceptCancelConfirmBtn = document.getElementById('acceptCancelConfirm');
    const okSuccessConfirmBtn = document.getElementById('okSuccessConfirm');
    const acceptAcceptConfirmBtn = document.getElementById('acceptAcceptConfirm');
    const cancelAcceptConfirmBtn = document.getElementById('cancelAcceptConfirm');
    const acceptRejectConfirmBtn = document.getElementById('acceptRejectConfirm');
    const cancelRejectConfirmBtn = document.getElementById('cancelRejectConfirm');
    const acceptDeleteConfirmBtn = document.getElementById('acceptDeleteConfirm');
    const cancelDeleteConfirmBtn = document.getElementById('cancelDeleteConfirm');
    const acceptRescheduleConfirmBtn = document.getElementById('acceptRescheduleConfirm');
    const cancelRescheduleConfirmBtn = document.getElementById('cancelRescheduleConfirm');
    const okActionSuccessBtn = document.getElementById('okActionSuccess');
    const actionSuccessTitle = document.getElementById('actionSuccessTitle');
    const actionSuccessMessage = document.getElementById('actionSuccessMessage');
    
    const profileIconBtn = document.getElementById('profileIconBtn');
    const logoutProfileBtn = document.getElementById('logoutProfileBtn');
    const profileForm = document.getElementById('profileForm');
    const cancelLogoutBtn = document.getElementById('cancelLogout');
    const acceptLogoutBtn = document.getElementById('acceptLogout');

    // Campos del Formulario
    const clientNameInput = document.getElementById('clientName');
    const serviceTypeInput = document.getElementById('serviceType');
    const stylistInput = document.getElementById('stylist');
    const appointmentDateInput = document.getElementById('appointmentDate');
    const appointmentTimeInput = document.getElementById('appointmentTime');
    const modalTitle = addAppointmentModal.querySelector('h3');

    // =================================================================
    // III. FUNCIONES DE UTILIDAD
    // =================================================================
    const getMonthName = (date) => date.toLocaleDateString('es-ES', { month: 'long' });
    const getDayName = (date) => date.toLocaleDateString('es-ES', { weekday: 'long' });
    const formatDateKey = (date) => date.toISOString().split('T')[0];
    const formatInputDate = (date) => date.toISOString().split('T')[0];
    const formatTime = (time) => {
        const [hour, minute] = time.split(':');
        const h = parseInt(hour);
        const ampm = h >= 12 ? 'pm' : 'am';
        const formattedHour = h % 12 === 0 ? 12 : h % 12;
        return `${formattedHour}:${minute} ${ampm}`;
    };

    const getAppointmentsForDay = (date) => {
        const dateKey = formatDateKey(date);
        return appointments.filter(app => app.date === dateKey);
    };
    
    const refreshViews = () => {
        if (calendarMonthView.classList.contains('active')) {
            renderMonthCalendar();
        } else if (calendarDayView.classList.contains('active')) {
            renderDayCalendar();
        }
    };
    
    const resetAddAppointmentForm = () => { 
        addAppointmentForm.reset();
        activeContextMenuAppointment = null;
        if (modalTitle) modalTitle.textContent = 'AGENDAR NUEVA CITA';
    };

    const openEditModal = (appointmentId) => {
        const appointment = appointments.find(app => app.id === appointmentId);
        if (!appointment) return;

        resetAddAppointmentForm();
        clientNameInput.value = appointment.client;
        serviceTypeInput.value = appointment.service;
        stylistInput.value = appointment.stylist;
        appointmentDateInput.value = appointment.date;
        appointmentTimeInput.value = appointment.time;
        
        activeContextMenuAppointment = appointmentId; 
        
        if (modalTitle) modalTitle.textContent = 'EDITAR CITA';
        openModal(addAppointmentModal);
    }

    const hideAllSections = () => {
        if (portfolioSection) portfolioSection.style.display = 'none';
        if (promotionSection) promotionSection.style.display = 'none';
        if (servicesSection) servicesSection.style.display = 'none';
        if (stylistsSection) stylistsSection.style.display = 'none';
        if (reportsSection) reportsSection.style.display = 'none';
        if (formSection) formSection.style.display = 'none';
        if (commentsSection) commentsSection.style.display = 'none';
        if (profileSection) profileSection.style.display = 'none';
        if (calendarSection) calendarSection.style.display = 'none';
    };

    // =================================================================
    // III-B. FUNCIONES DE PORTAFOLIO
    // =================================================================
    const renderPortfolio = () => {
        portfolioGrid.innerHTML = '';
        
        for (let i = 0; i < portfolioSlots; i++) {
            const portfolioItem = document.createElement('div');
            portfolioItem.classList.add('portfolio-item');
            portfolioItem.dataset.index = i;
            
            const uploadArea = document.createElement('div');
            uploadArea.classList.add('portfolio-upload-area');
            uploadArea.innerHTML = `
                <i class="fas fa-upload"></i>
                <span>Subir imagen</span>
            `;
            
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.classList.add('portfolio-hidden-input');
            
            const imageContainer = document.createElement('div');
            imageContainer.classList.add('portfolio-image-container');
            
            const img = document.createElement('img');
            img.classList.add('portfolio-image');
            img.alt = `Imagen de portafolio ${i + 1}`;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.classList.add('portfolio-actions');
            actionsDiv.innerHTML = `
                <button class="portfolio-action-btn delete" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            imageContainer.appendChild(img);
            imageContainer.appendChild(actionsDiv);
            
            portfolioItem.appendChild(uploadArea);
            portfolioItem.appendChild(imageContainer);
            portfolioItem.appendChild(fileInput);
            
            if (portfolioImages[i]) {
                img.src = portfolioImages[i];
                portfolioItem.classList.add('has-image');
            }
            
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        portfolioImages[i] = event.target.result;
                        img.src = event.target.result;
                        portfolioItem.classList.add('has-image');
                    };
                    reader.readAsDataURL(file);
                }
            });
            
            const deleteBtn = actionsDiv.querySelector('.delete');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                portfolioImages[i] = null;
                img.src = '';
                portfolioItem.classList.remove('has-image');
                fileInput.value = '';
            });
            
            portfolioGrid.appendChild(portfolioItem);
        }
    };

    const showPortfolioView = () => {
        hideAllSections();
        portfolioSection.style.display = 'block';
        renderPortfolio();
    };

    // =================================================================
    // III-C. FUNCIONES DE PROMOCIONES
    // =================================================================
    const renderPromotions = () => {
        promotionsGrid.innerHTML = '';
        
        if (promotions.length === 0) {
            promotionsGrid.innerHTML = '<p class="placeholder-text">No hay promociones agregadas. Haz clic en "Agregar" para crear una.</p>';
            return;
        }
        
        promotions.forEach(promo => {
            const card = document.createElement('div');
            card.classList.add('promotion-card');
            card.innerHTML = `
                <h3>${promo.name}</h3>
                <p style="font-size: 14px; color: #666; margin: 10px 0;">
                    <strong>Duración:</strong> ${promo.duration}<br>
                    <strong>Precio:</strong> ${promo.price}
                </p>
                <div class="promotion-actions">
                    <button class="edit-card-btn" data-id="${promo.id}">Editar</button>
                    <button class="delete-card-btn" data-id="${promo.id}">Eliminar</button>
                </div>
            `;
            
            const editBtn = card.querySelector('.edit-card-btn');
            const deleteBtn = card.querySelector('.delete-card-btn');
            
            editBtn.addEventListener('click', () => editPromotion(promo.id));
            deleteBtn.addEventListener('click', () => deletePromotion(promo.id));
            
            promotionsGrid.appendChild(card);
        });
    };
    
    const editPromotion = (id) => {
        const promo = promotions.find(p => p.id === id);
        if (!promo) return;
        
        editingPromotionId = id;
        
        document.getElementById('promotionName').value = promo.name;
        document.getElementById('promotionDuration').value = promo.duration;
        document.getElementById('promotionDescription').value = promo.description;
        document.getElementById('promotionIncludes').value = promo.includes;
        document.getElementById('promotionPrice').value = promo.price;
        document.getElementById('promotionValidity').value = promo.validity;
        
        const modalTitle = addPromotionModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Editar promoción';
        
        openModal(addPromotionModal);
    };
    
    const deletePromotion = (id) => {
        if (confirm('¿Está seguro de que desea eliminar esta promoción?')) {
            promotions = promotions.filter(p => p.id !== id);
            renderPromotions();
        }
    };
    
    const showPromotionView = () => {
        hideAllSections();
        promotionSection.style.display = 'block';
        renderPromotions();
        updateFormSelects();
    };
    
    const resetPromotionForm = () => {
        document.getElementById('addPromotionForm').reset();
        editingPromotionId = null;
        const modalTitle = addPromotionModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Nueva promoción';
    };

    // =================================================================
    // III-D. FUNCIONES DE SERVICIOS
    // =================================================================
    const renderServices = () => {
        servicesGrid.innerHTML = '';
        
        if (services.length === 0) {
            servicesGrid.innerHTML = '<p class="placeholder-text">No hay servicios agregados. Haz clic en "Agregar" para crear uno.</p>';
            return;
        }
        
        services.forEach(service => {
            const card = document.createElement('div');
            card.classList.add('service-card');
            card.innerHTML = `
                <h3>${service.name}</h3>
                <p style="font-size: 14px; color: #666; margin: 10px 0;">
                    <strong>Duración:</strong> ${service.duration}<br>
                    <strong>Precio:</strong> ${service.price}
                </p>
                <div class="service-actions">
                    <button class="edit-card-btn" data-id="${service.id}">Editar</button>
                    <button class="delete-card-btn" data-id="${service.id}">Eliminar</button>
                </div>
            `;
            
            const editBtn = card.querySelector('.edit-card-btn');
            const deleteBtn = card.querySelector('.delete-card-btn');
            
            editBtn.addEventListener('click', () => editService(service.id));
            deleteBtn.addEventListener('click', () => deleteService(service.id));
            
            servicesGrid.appendChild(card);
        });
    };
    
    const editService = (id) => {
        const service = services.find(s => s.id === id);
        if (!service) return;
        
        editingServiceId = id;
        
        document.getElementById('serviceName').value = service.name;
        document.getElementById('serviceDuration').value = service.duration;
        document.getElementById('serviceDescription').value = service.description;
        document.getElementById('serviceIncludes').value = service.includes;
        document.getElementById('servicePrice').value = service.price;
        
        const modalTitle = addServiceModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Editar servicio';
        
        openModal(addServiceModal);
    };
    
    const deleteService = (id) => {
        if (confirm('¿Está seguro de que desea eliminar este servicio?')) {
            services = services.filter(s => s.id !== id);
            renderServices();
        }
    };
    
    const showServicesView = () => {
        hideAllSections();
        servicesSection.style.display = 'block';
        renderServices();
        updateFormSelects();
    };
    
    const resetServiceForm = () => {
        document.getElementById('addServiceForm').reset();
        editingServiceId = null;
        const modalTitle = addServiceModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Nuevo servicio';
    };

    // =================================================================
    // III-E. FUNCIONES DE ESTILISTAS
    // =================================================================
    const renderStylists = () => {
        stylistsList.innerHTML = '';
        
        if (stylists.length === 0) {
            stylistsList.innerHTML = '<p class="placeholder-text">No hay estilistas agregados. Haz clic en "Agregar" para crear uno.</p>';
            return;
        }
        
        stylists.forEach(stylist => {
            const card = document.createElement('div');
            card.classList.add('stylist-card');
            
            const imageHtml = stylist.image 
                ? `<img src="${stylist.image}" class="stylist-image" alt="${stylist.name}">`
                : `<div class="stylist-image"></div>`;
            
            card.innerHTML = `
                ${imageHtml}
                <div class="stylist-info">
                    <p><strong>Nombre:</strong> ${stylist.name}</p>
                    <p><strong>Teléfono:</strong> ${stylist.phone}</p>
                    <p><strong>Servicios:</strong> ${stylist.services}</p>
                    <p><strong>Ocupación:</strong> ${stylist.occupation}</p>
                </div>
                <div class="stylist-actions">
                    <button class="schedule-btn" data-id="${stylist.id}">Ver Horario</button>
                    <button class="edit-card-btn" data-id="${stylist.id}">Editar</button>
                    <button class="delete-card-btn" data-id="${stylist.id}">Eliminar</button>
                </div>
            `;
            
            const scheduleBtn = card.querySelector('.schedule-btn');
            const editBtn = card.querySelector('.edit-card-btn');
            const deleteBtn = card.querySelector('.delete-card-btn');
            
            scheduleBtn.addEventListener('click', () => {
                alert(`Horario de ${stylist.name}: ${stylist.schedule}`);
            });
            
            editBtn.addEventListener('click', () => editStylist(stylist.id));
            deleteBtn.addEventListener('click', () => deleteStylist(stylist.id));
            
            stylistsList.appendChild(card);
        });
    };
    
    const editStylist = (id) => {
        const stylist = stylists.find(s => s.id === id);
        if (!stylist) return;
        
        editingStylistId = id;
        
        document.getElementById('stylistName').value = stylist.name;
        document.getElementById('stylistPhone').value = stylist.phone;
        document.getElementById('stylistUser').value = stylist.user;
        document.getElementById('stylistOccupation').value = stylist.occupation;
        
        const modalTitle = addStylistModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Editar estilista';
        
        openModal(addStylistModal);
    };
    
    const deleteStylist = (id) => {
        if (confirm('¿Está seguro de que desea eliminar este estilista?')) {
            stylists = stylists.filter(s => s.id !== id);
            renderStylists();
        }
    };
    
    const showStylistsView = () => {
        hideAllSections();
        stylistsSection.style.display = 'block';
        renderStylists();
    };
    
    const resetStylistForm = () => {
        document.getElementById('addStylistForm').reset();
        editingStylistId = null;
        const modalTitle = addStylistModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Nuevo estilista';
    };

    // =================================================================
    // III-F. FUNCIONES DE FORMULARIOS
    // =================================================================
    const renderForms = () => {
        if (!formsList) return;
        
        formsList.innerHTML = '';
        
        if (forms.length === 0) {
            formsList.innerHTML = '<p class="placeholder-text">No hay formularios agregados. Haz clic en "Agregar" para crear uno.</p>';
            return;
        }
        
        forms.forEach(form => {
            const card = document.createElement('div');
            card.classList.add('form-card');
            
            const questionsList = form.questions.map(q => `<li>${q}</li>`).join('');
            
            card.innerHTML = `
                <h3>${form.name}</h3>
                <ul class="form-questions-list">
                    ${questionsList}
                </ul>
                <div class="service-actions">
                    <button class="edit-card-btn" data-id="${form.id}">Editar</button>
                    <button class="delete-card-btn" data-id="${form.id}">Eliminar</button>
                </div>
            `;
            
            const editBtn = card.querySelector('.edit-card-btn');
            const deleteBtn = card.querySelector('.delete-card-btn');
            
            editBtn.addEventListener('click', () => editForm(form.id));
            deleteBtn.addEventListener('click', () => deleteForm(form.id));
            
            formsList.appendChild(card);
        });
    };
    
    const editForm = (id) => {
        const form = forms.find(f => f.id === id);
        if (!form) return;
        
        editingFormId = id;
        
        const container = document.getElementById('formQuestionsContainer');
        container.innerHTML = '';
        
        form.questions.forEach(q => {
            addQuestionField(q);
        });
        
        const modalTitle = addFormModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Editar Formulario';
        
        openModal(addFormModal);
    };
    
    const deleteForm = (id) => {
        if (confirm('¿Está seguro de que desea eliminar este formulario?')) {
            forms = forms.filter(f => f.id !== id);
            renderForms();
            updateFormSelects();
        }
    };
    
    const showFormsView = () => {
        hideAllSections();
        if (formSection) formSection.style.display = 'block';
        renderForms();
    };
    
    const resetFormForm = () => {
        const container = document.getElementById('formQuestionsContainer');
        container.innerHTML = `
            <div class="form-question-item">
                <div class="form-group">
                    <label>Pregunta</label>
                    <input type="text" class="question-input" placeholder="Escribe la pregunta" required>
                </div>
                <button type="button" class="remove-question-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        attachQuestionRemoveListeners();
        editingFormId = null;
        const modalTitle = addFormModal.querySelector('h3');
        if (modalTitle) modalTitle.textContent = 'Formulario';
    };

    const addQuestionField = (value = '') => {
        const container = document.getElementById('formQuestionsContainer');
        const questionItem = document.createElement('div');
        questionItem.classList.add('form-question-item');
        questionItem.innerHTML = `
            <div class="form-group">
                <label>Pregunta</label>
                <input type="text" class="question-input" placeholder="Escribe la pregunta" value="${value}" required>
            </div>
            <button type="button" class="remove-question-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(questionItem);
        attachQuestionRemoveListeners();
    };

    const attachQuestionRemoveListeners = () => {
        document.querySelectorAll('.remove-question-btn').forEach(btn => {
            btn.onclick = function() {
                const container = document.getElementById('formQuestionsContainer');
                if (container.children.length > 1) {
                    this.closest('.form-question-item').remove();
                }
            };
        });
    };

    const updateFormSelects = () => {
        const selects = [
            document.getElementById('promotionForm'),
            document.getElementById('serviceForm')
        ];
        
        selects.forEach(select => {
            if (!select) return;
            
            const currentValue = select.value;
            select.innerHTML = '<option value="" disabled selected>Seleccionar</option>';
            
            forms.forEach(form => {
                const option = document.createElement('option');
                option.value = form.name;
                option.textContent = form.name;
                select.appendChild(option);
            });
            
            if (currentValue) select.value = currentValue;
        });
    };

    // =================================================================
    // III-G. FUNCIONES DE PERFIL
    // =================================================================
    const showProfileView = () => {
        hideAllSections();
        if (profileSection) profileSection.style.display = 'block';
    };

    // =================================================================
    // IV. MENÚ CONTEXTUAL
    // =================================================================
    const createContextMenu = () => {
        if (!contextMenu) {
            contextMenu = document.createElement('div');
            contextMenu.className = 'appointment-context-menu';
            contextMenu.innerHTML = `
                <div class="context-menu-item accept" data-action="accept">
                    <i class="fas fa-check"></i>
                    <span>Aceptar</span>
                </div>
                <div class="context-menu-item reject" data-action="reject">
                    <i class="fas fa-times"></i>
                    <span>Rechazar</span>
                </div>
                <div class="context-menu-item cancel" data-action="delete">
                    <i class="fas fa-trash-alt"></i>
                    <span>Eliminar Cita</span>
                </div>
                <div class="context-menu-item reschedule" data-action="reschedule">
                    <i class="fas fa-calendar-alt"></i>
                    <span>Reagendar</span>
                </div>
            `;
            document.body.appendChild(contextMenu);

            contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.dataset.action;
                    handleContextMenuAction(action);
                });
            });
        }
    };

    const showContextMenu = (x, y, appointmentId) => {
        createContextMenu();
        activeContextMenuAppointment = appointmentId;
        
        contextMenu.style.left = `${x}px`;
        contextMenu.style.top = `${y}px`;
        contextMenu.classList.add('active');

        setTimeout(() => {
            const rect = contextMenu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                contextMenu.style.left = `${x - rect.width - 10}px`;
            }
            if (rect.bottom > window.innerHeight) {
                contextMenu.style.top = `${y - rect.height - 10}px`;
            }
        }, 0);
    };

    const hideContextMenu = () => {
        if (contextMenu) {
            contextMenu.classList.remove('active');
        }
    };

    const handleContextMenuAction = (action) => {
        const appointment = appointments.find(app => app.id === activeContextMenuAppointment);
        if (!appointment) return;

        hideContextMenu(); 

        switch (action) {
            case 'accept':
                openModal(confirmAcceptModal);
                break;
            case 'reject':
                openModal(confirmRejectModal);
                break;
            case 'delete': 
                openModal(confirmDeleteModal);
                break;
            case 'reschedule':
                openModal(confirmRescheduleModal);
                break;
        }
    };

    // =================================================================
    // V. FUNCIONES DE RENDERIZADO
    // =================================================================
    const renderMonthCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        currentMonthYearSpan.textContent = `${getMonthName(currentDate).charAt(0).toUpperCase() + getMonthName(currentDate).slice(1)} ${year}`;
        
        Array.from(monthCalendarGrid.querySelectorAll('.calendar-day:not(.day-header)')).forEach(el => el.remove());
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 
        const lastDayOfMonth = new Date(year, month + 1, 0).getDate();

        const prevMonthDays = new Date(year, month, 0).getDate();
        for (let i = 0; i < startDayIndex; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day', 'inactive');
            dayDiv.innerHTML = `<span class="day-number">${prevMonthDays - startDayIndex + i + 1}</span>`;
            monthCalendarGrid.appendChild(dayDiv);
        }

        for (let day = 1; day <= lastDayOfMonth; day++) {
            const currentDay = new Date(year, month, day);
            const isToday = formatDateKey(currentDay) === formatDateKey(new Date());

            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day');
            
            if (selectedDay && formatDateKey(selectedDay) === formatDateKey(currentDay)) {
                dayDiv.classList.add('selected');
            }

            dayDiv.classList.toggle('edit-mode', isEditMode);
            if (isToday) {
                dayDiv.classList.add('today');
            }
            
            dayDiv.dataset.date = formatDateKey(currentDay);

            const dayNumberSpan = document.createElement('span');
            dayNumberSpan.classList.add('day-number');
            dayNumberSpan.textContent = day;
            dayDiv.appendChild(dayNumberSpan);

            const appointmentsDiv = document.createElement('div');
            appointmentsDiv.classList.add('appointments');
            
            const dayAppointments = getAppointmentsForDay(currentDay);
            
            if (isEditMode) {
                const addAppointmentBtn = document.createElement('button');
                addAppointmentBtn.classList.add('add-appointment-btn');
                addAppointmentBtn.innerHTML = '<i class="fas fa-plus"></i>';
                
                addAppointmentBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    currentAddDayElement = currentDay;
                    openModal(addAppointmentModal);
                    resetAddAppointmentForm();
                    appointmentDateInput.value = formatInputDate(currentDay);
                    appointmentTimeInput.value = '';
                    clientNameInput.focus();
                });
                dayDiv.appendChild(addAppointmentBtn);
            } else {
                dayAppointments.forEach(app => {
                    const appElement = document.createElement('div');
                    appElement.classList.add('appointment', app.color);
                    appElement.dataset.appointmentId = app.id;
                    
                    const appText = document.createElement('span');
                    appText.textContent = `${app.time} ${app.description.substring(0, 15)}...`;
                    appElement.appendChild(appText);
                    
                    const appOptions = document.createElement('span');
                    appOptions.classList.add('appointment-options');
                    appOptions.innerHTML = '<i class="fas fa-ellipsis-v"></i>';
                    appElement.appendChild(appOptions);
                    
                    appOptions.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const rect = appOptions.getBoundingClientRect();
                        showContextMenu(rect.right, rect.top, app.id);
                    });
                    
                    appointmentsDiv.appendChild(appElement);
                });
                dayDiv.appendChild(appointmentsDiv);
            }

            dayDiv.addEventListener('click', (e) => {
                if (!isEditMode && !e.target.closest('.appointment-options')) {
                    selectedDay = currentDay;
                    monthCalendarGrid.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
                    dayDiv.classList.add('selected');
                    showDayView();
                }
            });

            monthCalendarGrid.appendChild(dayDiv);
        }

        const totalDaysRendered = monthCalendarGrid.querySelectorAll('.calendar-day').length - 7;
        const remainingCells = 42 - totalDaysRendered;
        
        for (let i = 1; i <= remainingCells; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('calendar-day', 'inactive');
            dayDiv.innerHTML = `<span class="day-number">${i}</span>`;
            monthCalendarGrid.appendChild(dayDiv);
        }
    };
    
    const renderDayCalendar = () => {
        dayTimeline.querySelectorAll('.time-slot, .event-slot').forEach(el => el.remove());

        const displayDay = selectedDay || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        currentDaySpan.textContent = `${getDayName(displayDay).charAt(0).toUpperCase() + getDayName(displayDay).slice(1)} ${displayDay.getDate()} de ${getMonthName(displayDay)}`;

        const dayAppointments = getAppointmentsForDay(displayDay);
        
        dayAppointments.sort((a, b) => {
            const timeA = new Date(`2000/01/01 ${a.time}`);
            const timeB = new Date(`2000/01/01 ${b.time}`);
            return timeA - timeB;
        });

        for (let hour = 8; hour < 22; hour++) {
            const hourString = `${hour.toString().padStart(2, '0')}:00`;
            
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.textContent = formatTime(hourString);
            dayTimeline.appendChild(timeSlot);

            const eventSlot = document.createElement('div');
            eventSlot.classList.add('event-slot');
            dayTimeline.appendChild(eventSlot);

            const addBtnDayView = document.createElement('button');
            addBtnDayView.classList.add('add-appointment-btn', 'add-appointment-btn-day-view');
            addBtnDayView.innerHTML = '<i class="fas fa-plus"></i>';
            
            if (isEditMode) {
                addBtnDayView.style.display = 'flex';
                addBtnDayView.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    const targetDate = selectedDay || new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                    currentAddDayElement = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate(), hour, 0);
                    
                    openModal(addAppointmentModal);
                    resetAddAppointmentForm();
                    appointmentDateInput.value = formatInputDate(currentAddDayElement);
                    appointmentTimeInput.value = `${hour.toString().padStart(2, '0')}:00`;
                    clientNameInput.focus();
                });
            } else {
                addBtnDayView.style.display = 'none';
            }
            eventSlot.appendChild(addBtnDayView);

            dayAppointments.filter(app => {
                const appHour = parseInt(app.time.split(':')[0]);
                return appHour === hour;
            }).forEach(app => {
                const appElement = document.createElement('div');
                appElement.classList.add('day-event', app.color);
                appElement.dataset.appointmentId = app.id;
                appElement.innerHTML = `
                    <span class="event-description">${formatTime(app.time)} ${app.client} - ${app.service}</span>
                    <i class="fas fa-ellipsis-v event-options"></i>
                `;
                
                if (isEditMode) {
                    appElement.style.opacity = '0.5';
                    appElement.style.pointerEvents = 'none';
                } else {
                    const optionsIcon = appElement.querySelector('.event-options');
                    optionsIcon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const rect = optionsIcon.getBoundingClientRect();
                        showContextMenu(rect.right, rect.top, app.id);
                    });
                }
                
                eventSlot.appendChild(appElement);
            });
        }
    };

    // =================================================================
    // VI. NAVEGACIÓN Y MANEJO DE VISTAS
    // =================================================================
    const showMonthView = () => {
        hideAllSections();
        calendarSection.style.display = 'block';
        calendarMonthView.classList.add('active');
        calendarDayView.classList.remove('active');
        monthViewBtn.classList.add('active');
        dayViewBtn.classList.remove('active');
        prevMonthBtn.style.display = 'inline-block';
        nextMonthBtn.style.display = 'inline-block';
        
        const prevDayBtn = document.getElementById('prevDayBtn');
        const nextDayBtn = document.getElementById('nextDayBtn');
        if (prevDayBtn) prevDayBtn.style.display = 'none';
        if (nextDayBtn) nextDayBtn.style.display = 'none';
        
        renderMonthCalendar();
    };

    const showDayView = () => {
        hideAllSections();
        calendarSection.style.display = 'block';
        calendarDayView.classList.add('active');
        calendarMonthView.classList.remove('active');
        dayViewBtn.classList.add('active');
        monthViewBtn.classList.remove('active');
        prevMonthBtn.style.display = 'none';
        nextMonthBtn.style.display = 'none';
        
        const prevDayBtn = document.getElementById('prevDayBtn');
        const nextDayBtn = document.getElementById('nextDayBtn');
        if (prevDayBtn) prevDayBtn.style.display = 'inline-block';
        if (nextDayBtn) nextDayBtn.style.display = 'inline-block';
        
        renderDayCalendar();
    };

    const openModal = (modalElement) => {
        if (!modalElement) return;
        modalElement.classList.add('active');
        const firstFocusable = modalElement.querySelector('input, select, button, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            setTimeout(() => firstFocusable.focus(), 100);
        }
    };

    const closeModal = (modalElement) => {
        if (!modalElement) return;
        modalElement.classList.remove('active');
    };

    // =================================================================
    // VII. EVENT LISTENERS
    // =================================================================
    document.addEventListener('click', (e) => {
        if (contextMenu && !contextMenu.contains(e.target)) {
            hideContextMenu();
        }
    });

    // Navegación del sidebar
    sidebarNavItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            sidebarNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.dataset.view;
            
            switch(view) {
                case 'calendar-month':
                    showMonthView();
                    break;
                case 'calendar-day':
                    showDayView();
                    break;
                case 'portfolio':
                    showPortfolioView();
                    break;
                case 'promotion':
                    showPromotionView();
                    break;
                case 'services':
                    showServicesView();
                    break;
                case 'stylists':
                    showStylistsView();
                    break;
                case 'reports':
                    hideAllSections();
                    if (reportsSection) reportsSection.style.display = 'block';
                    break;
                case 'form':
                    showFormsView();
                    break;
                case 'comments':
                    hideAllSections();
                    if (commentsSection) commentsSection.style.display = 'block';
                    break;
                default:
                    showMonthView();
            }
        });
    });

    // Botón de perfil
    if (profileIconBtn) {
        profileIconBtn.addEventListener('click', () => {
            showProfileView();
        });
    }

    // Cerrar sesión desde perfil
    if (logoutProfileBtn) {
        logoutProfileBtn.addEventListener('click', () => {
            openModal(logoutModal);
        });
    }

    // Cerrar sesión desde sidebar
    document.querySelector('.logout-section .nav-link')?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(logoutModal);
    });

    // Modal de cerrar sesión
    if (cancelLogoutBtn) {
        cancelLogoutBtn.addEventListener('click', () => closeModal(logoutModal));
    }

    if (acceptLogoutBtn) {
        acceptLogoutBtn.addEventListener('click', () => {
            alert('Cerrando sesión...');
            closeModal(logoutModal);
        });
    }

    // Editar perfil
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Perfil actualizado exitosamente');
        });
    }

    // Botón para agregar más espacios de imagen
    if (addImageSlotBtn) {
        addImageSlotBtn.addEventListener('click', () => {
            portfolioSlots++;
            renderPortfolio();
        });
    }
    
    // Botones para abrir modales
    if (addPromotionBtn) {
        addPromotionBtn.addEventListener('click', () => {
            resetPromotionForm();
            updateFormSelects();
            openModal(addPromotionModal);
        });
    }
    
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', () => {
            resetServiceForm();
            updateFormSelects();
            openModal(addServiceModal);
        });
    }
    
    if (addStylistBtn) {
        addStylistBtn.addEventListener('click', () => {
            resetStylistForm();
            openModal(addStylistModal);
        });
    }

    if (addFormBtn) {
        addFormBtn.addEventListener('click', () => {
            resetFormForm();
            openModal(addFormModal);
        });
    }
    
    // Cerrar modales con botones de cancelar
    document.querySelectorAll('.cancel-promotion').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(addPromotionModal);
            resetPromotionForm();
        });
    });
    
    document.querySelectorAll('.cancel-service').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(addServiceModal);
            resetServiceForm();
        });
    });
    
    document.querySelectorAll('.cancel-stylist').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(addStylistModal);
            resetStylistForm();
        });
    });

    document.querySelectorAll('.cancel-form').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(addFormModal);
            resetFormForm();
        });
    });
    
    // Formulario de Promoción
    const addPromotionForm = document.getElementById('addPromotionForm');
    if (addPromotionForm) {
        addPromotionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const promotionData = {
                name: document.getElementById('promotionName').value,
                duration: document.getElementById('promotionDuration').value,
                description: document.getElementById('promotionDescription').value,
                includes: document.getElementById('promotionIncludes').value,
                price: document.getElementById('promotionPrice').value,
                validity: document.getElementById('promotionValidity').value,
                form: document.getElementById('promotionForm').value || 'Sin asignar'
            };
            
            if (editingPromotionId) {
                promotions = promotions.map(p => 
                    p.id === editingPromotionId ? { ...p, ...promotionData } : p
                );
            } else {
                const newId = promotions.length > 0 ? Math.max(...promotions.map(p => p.id)) + 1 : 1;
                promotions.push({ id: newId, ...promotionData, image: null });
            }
            
            renderPromotions();
            closeModal(addPromotionModal);
            resetPromotionForm();
            alert(editingPromotionId ? 'Promoción actualizada exitosamente' : 'Promoción creada exitosamente');
        });
    }
    
    // Formulario de Servicio
    const addServiceForm = document.getElementById('addServiceForm');
    if (addServiceForm) {
        addServiceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const serviceData = {
                name: document.getElementById('serviceName').value,
                duration: document.getElementById('serviceDuration').value,
                description: document.getElementById('serviceDescription').value,
                includes: document.getElementById('serviceIncludes').value,
                price: document.getElementById('servicePrice').value,
                form: document.getElementById('serviceForm').value || 'Sin asignar'
            };
            
            if (editingServiceId) {
                services = services.map(s => 
                    s.id === editingServiceId ? { ...s, ...serviceData } : s
                );
            } else {
                const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
                services.push({ id: newId, ...serviceData, image: null });
            }
            
            renderServices();
            closeModal(addServiceModal);
            resetServiceForm();
            alert(editingServiceId ? 'Servicio actualizado exitosamente' : 'Servicio creado exitosamente');
        });
    }
    
    // Formulario de Estilista
    const addStylistForm = document.getElementById('addStylistForm');
    if (addStylistForm) {
        addStylistForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const stylistData = {
                name: document.getElementById('stylistName').value,
                phone: document.getElementById('stylistPhone').value,
                user: document.getElementById('stylistUser').value,
                services: document.getElementById('stylistServices').value || 'Sin asignar',
                schedule: document.getElementById('stylistSchedule').value || 'Sin asignar',
                occupation: document.getElementById('stylistOccupation').value
            };
            
            if (editingStylistId) {
                stylists = stylists.map(s => 
                    s.id === editingStylistId ? { ...s, ...stylistData } : s
                );
            } else {
                const newId = stylists.length > 0 ? Math.max(...stylists.map(s => s.id)) + 1 : 1;
                stylists.push({ id: newId, ...stylistData, image: null });
            }
            
            renderStylists();
            closeModal(addStylistModal);
            resetStylistForm();
            alert(editingStylistId ? 'Estilista actualizado exitosamente' : 'Estilista creado exitosamente');
        });
    }

    // Formulario de Formularios
    const addFormularioForm = document.getElementById('addFormularioForm');
    if (addFormularioForm) {
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        
        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', () => {
                addQuestionField();
            });
        }

        attachQuestionRemoveListeners();

        addFormularioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const questionInputs = document.querySelectorAll('.question-input');
            const questions = Array.from(questionInputs).map(input => input.value.trim()).filter(q => q);
            
            if (questions.length === 0) {
                alert('Debes agregar al menos una pregunta');
                return;
            }

            const formName = `Formulario ${forms.length + 1}`;
            
            if (editingFormId) {
                forms = forms.map(f => 
                    f.id === editingFormId ? { ...f, questions } : f
                );
            } else {
                const newId = forms.length > 0 ? Math.max(...forms.map(f => f.id)) + 1 : 1;
                forms.push({ id: newId, name: formName, questions });
            }
            
            renderForms();
            updateFormSelects();
            closeModal(addFormModal);
            resetFormForm();
            alert(editingFormId ? 'Formulario actualizado exitosamente' : 'Formulario creado exitosamente');
        });
    }

    // Navegación de calendario
    monthViewBtn.addEventListener('click', showMonthView);
    dayViewBtn.addEventListener('click', showDayView);

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        selectedDay = null; 
        renderMonthCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        selectedDay = null; 
        renderMonthCalendar();
    });
    
    const prevDayBtn = document.getElementById('prevDayBtn');
    const nextDayBtn = document.getElementById('nextDayBtn');

    if (prevDayBtn) {
        prevDayBtn.addEventListener('click', () => {
            if (selectedDay) {
                selectedDay.setDate(selectedDay.getDate() - 1);
                currentDate = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate()); 
                renderDayCalendar();
            }
        });
    }

    if (nextDayBtn) {
        nextDayBtn.addEventListener('click', () => {
            if (selectedDay) {
                selectedDay.setDate(selectedDay.getDate() + 1);
                currentDate = new Date(selectedDay.getFullYear(), selectedDay.getMonth(), selectedDay.getDate()); 
                renderDayCalendar();
            }
        });
    }

    editCalendarBtn.addEventListener('click', () => {
        isEditMode = !isEditMode;
        editCalendarBtn.classList.toggle('active', isEditMode);
        editCalendarBtn.textContent = isEditMode ? 'Guardar Cambios' : 'Editar';

        calendarMonthView.classList.toggle('edit-mode', isEditMode);
        calendarDayView.classList.toggle('edit-mode', isEditMode);
        
        refreshViews();
    });

    // Manejo de cierre de modales
    const allModals = document.querySelectorAll('.modal-overlay');
    allModals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                if (modal === addAppointmentModal && (clientNameInput.value || serviceTypeInput.value || stylistInput.value || appointmentDateInput.value || appointmentTimeInput.value)) {
                    openModal(confirmCancelModal);
                } else {
                    closeModal(modal);
                }
            }
        });
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal-overlay');
            if (modal === addAppointmentModal && (clientNameInput.value || serviceTypeInput.value || stylistInput.value || appointmentDateInput.value || appointmentTimeInput.value)) {
                openModal(confirmCancelModal);
            } else {
                closeModal(modal);
            }
        });
    });

    // Guardado y Edición de Cita
    addAppointmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        openModal(confirmSaveModal);
    });

    cancelAddAppointmentBtn.addEventListener('click', () => {
        openModal(confirmCancelModal);
    });

    acceptSaveConfirmBtn.addEventListener('click', () => {
        closeModal(confirmSaveModal);
        
        const appointmentData = {
            date: appointmentDateInput.value,
            time: appointmentTimeInput.value,
            description: `${clientNameInput.value} - ${serviceTypeInput.value}`,
            client: clientNameInput.value,
            service: serviceTypeInput.value,
            stylist: stylistInput.value
        };

        if (activeContextMenuAppointment) {
            appointments = appointments.map(app => 
                app.id === activeContextMenuAppointment ? { ...app, ...appointmentData, color: app.color || 'orange' } : app
            );
        } else {
            const newId = appointments.length > 0 ? Math.max(...appointments.map(app => app.id)) + 1 : 1;
            appointments.push({ id: newId, ...appointmentData, color: 'orange' });
        }
        
        refreshViews();
        closeModal(addAppointmentModal);
        resetAddAppointmentForm();
        openModal(saveSuccessModal);
    });

    cancelSaveConfirmBtn.addEventListener('click', () => {
        closeModal(confirmSaveModal);
    });

    acceptCancelConfirmBtn.addEventListener('click', () => {
        closeModal(confirmCancelModal);
        closeModal(addAppointmentModal);
        resetAddAppointmentForm();
    });

    const cancelCancelConfirmBtn = document.getElementById('cancelCancelConfirm');
    if (cancelCancelConfirmBtn) {
        cancelCancelConfirmBtn.addEventListener('click', () => {
            closeModal(confirmCancelModal);
        });
    }

    okSuccessConfirmBtn.addEventListener('click', () => {
        closeModal(saveSuccessModal);
    });

    // =================================================================
    // VIII. LÓGICA DE CONFIRMACIÓN DE ACCIONES
    // =================================================================
    const handleActionSuccess = (title, message) => {
        actionSuccessTitle.textContent = title;
        actionSuccessMessage.textContent = message;
        refreshViews();
        activeContextMenuAppointment = null; 
        openModal(actionSuccessModal);
    };

    if (acceptAcceptConfirmBtn) {
        acceptAcceptConfirmBtn.addEventListener('click', () => {
            const appointment = appointments.find(app => app.id === activeContextMenuAppointment);
            if (appointment) appointment.color = 'green'; 
            closeModal(confirmAcceptModal);
            handleActionSuccess('CITA ACEPTADA', 'La cita ha sido confirmada exitosamente.');
        });
    }
    if (cancelAcceptConfirmBtn) cancelAcceptConfirmBtn.addEventListener('click', () => closeModal(confirmAcceptModal));

    if (acceptRejectConfirmBtn) {
        acceptRejectConfirmBtn.addEventListener('click', () => {
            const appointment = appointments.find(app => app.id === activeContextMenuAppointment);
            if (appointment) appointment.color = 'red'; 
            closeModal(confirmRejectModal);
            handleActionSuccess('CITA RECHAZADA', 'La cita ha sido marcada como rechazada.');
        });
    }
    if (cancelRejectConfirmBtn) cancelRejectConfirmBtn.addEventListener('click', () => closeModal(confirmRejectModal));

    if (acceptDeleteConfirmBtn) {
        acceptDeleteConfirmBtn.addEventListener('click', () => {
            appointments = appointments.filter(app => app.id !== activeContextMenuAppointment);
            closeModal(confirmDeleteModal);
            handleActionSuccess('CITA ELIMINADA', 'La cita ha sido eliminada permanentemente.');
        });
    }
    if (cancelDeleteConfirmBtn) cancelDeleteConfirmBtn.addEventListener('click', () => closeModal(confirmDeleteModal));

    if (acceptRescheduleConfirmBtn) {
        acceptRescheduleConfirmBtn.addEventListener('click', () => {
            const appointment = appointments.find(app => app.id === activeContextMenuAppointment);
            if (appointment) {
                openEditModal(appointment.id);
            }
            closeModal(confirmRescheduleModal);
        });
    }
    if (cancelRescheduleConfirmBtn) cancelRescheduleConfirmBtn.addEventListener('click', () => closeModal(confirmRescheduleModal));

    if (okActionSuccessBtn) okActionSuccessBtn.addEventListener('click', () => closeModal(actionSuccessModal));

    // =================================================================
    // IX. INICIALIZACIÓN
    // =================================================================
    updateFormSelects();
    showMonthView();
});