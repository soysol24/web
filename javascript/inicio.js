// ========================================
// MÓDULO INICIO - CALENDARIO
// ========================================

const InicioModule = (() => {
    // Estado del módulo
    let state = {
        currentDate: new Date(),
        selectedDay: null,
        isEditMode: false,
        appointments: [
            { id: 1, date: '2025-02-15', time: '10:00', description: 'Juan - Corte', color: '#FF6B6B', client: 'Juan Perez', service: 'Corte', stylist: 'Estilista 1', duration: 60 },
            { id: 2, date: '2025-02-15', time: '14:30', description: 'Maria - Tinte', color: '#6B6BFF', client: 'Maria Lopez', service: 'Tinte', stylist: 'Estilista 2', duration: 120 },
            { id: 3, date: '2025-02-27', time: '16:00', description: 'Carlos - Manicure', color: '#51CF66', client: 'Carlos Gomez', service: 'Manicure', stylist: 'Estilista 1', duration: 45 },
        ],
        editingAppointmentId: null
    };

    // Referencias DOM
    let elements = {};

    /**
     * Carga el HTML del módulo
     */
    const loadHTML = async () => {
        const container = document.getElementById('inicio-section');
        if (!container) return;

        try {
            const response = await fetch('../HTML/inicio.html');
            const html = await response.text();
            container.innerHTML = html;
            
            // Actualizar referencias DOM
            updateDOMReferences();
            setupEventListeners();
        } catch (error) {
            console.error('Error cargando HTML de inicio:', error);
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    /**
     * Actualiza las referencias a elementos DOM
     */
    const updateDOMReferences = () => {
        elements = {
            prevMonthBtn: document.getElementById('prevMonthBtn'),
            nextMonthBtn: document.getElementById('nextMonthBtn'),
            monthViewBtn: document.getElementById('monthViewBtn'),
            dayViewBtn: document.getElementById('dayViewBtn'),
            editCalendarBtn: document.getElementById('editCalendarBtn'),
            currentMonthYear: document.getElementById('currentMonthYear'),
            currentDay: document.getElementById('currentDay'),
            monthCalendarGrid: document.querySelector('.month-calendar-grid'),
            dayTimeline: document.querySelector('.day-timeline'),
            calendarMonthView: document.getElementById('calendarMonthView'),
            calendarDayView: document.getElementById('calendarDayView'),
            addAppointmentModal: document.getElementById('addAppointmentModal'),
            addAppointmentForm: document.getElementById('addAppointmentForm'),
            cancelAddAppointment: document.getElementById('cancelAddAppointment')
        };
    };

    /**
     * Configura los event listeners
     */
    const setupEventListeners = () => {
        if (elements.prevMonthBtn) {
            elements.prevMonthBtn.addEventListener('click', () => {
                state.currentDate.setMonth(state.currentDate.getMonth() - 1);
                renderMonthCalendar();
            });
        }

        if (elements.nextMonthBtn) {
            elements.nextMonthBtn.addEventListener('click', () => {
                state.currentDate.setMonth(state.currentDate.getMonth() + 1);
                renderMonthCalendar();
            });
        }

        if (elements.monthViewBtn) {
            elements.monthViewBtn.addEventListener('click', showMonthView);
        }

        if (elements.dayViewBtn) {
            elements.dayViewBtn.addEventListener('click', () => {
                if (state.selectedDay) {
                    showDayView();
                }
            });
        }

        if (elements.editCalendarBtn) {
            elements.editCalendarBtn.addEventListener('click', toggleEditMode);
        }

        if (elements.addAppointmentForm) {
            elements.addAppointmentForm.addEventListener('submit', handleAppointmentSubmit);
        }

        if (elements.cancelAddAppointment) {
            elements.cancelAddAppointment.addEventListener('click', () => {
                ModalManager.close(elements.addAppointmentModal);
            });
        }
    };

    /**
     * Renderiza el calendario mensual
     */
    const renderMonthCalendar = () => {
        if (!elements.monthCalendarGrid || !elements.currentMonthYear) return;

        const year = state.currentDate.getFullYear();
        const month = state.currentDate.getMonth();
        const monthName = state.currentDate.toLocaleDateString('es-ES', { month: 'long' });
        elements.currentMonthYear.textContent = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;

        // Limpiar grid
        const headers = elements.monthCalendarGrid.querySelectorAll('.day-header');
        elements.monthCalendarGrid.innerHTML = '';
        headers.forEach(header => elements.monthCalendarGrid.appendChild(header));

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        // Días del mes anterior
        const startDay = firstDay === 0 ? 6 : firstDay - 1;
        for (let i = startDay - 1; i >= 0; i--) {
            const dayDiv = createDayElement(prevMonthDays - i, true);
            elements.monthCalendarGrid.appendChild(dayDiv);
        }

        // Días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dayDiv = createDayElement(day, false, date);
            elements.monthCalendarGrid.appendChild(dayDiv);
        }

        // Días del mes siguiente
        const totalCells = elements.monthCalendarGrid.children.length - 7;
        const remainingCells = (7 - (totalCells % 7)) % 7;
        for (let day = 1; day <= remainingCells; day++) {
            const dayDiv = createDayElement(day, true);
            elements.monthCalendarGrid.appendChild(dayDiv);
        }
    };

    /**
     * Crea un elemento de día para el calendario
     */
    const createDayElement = (dayNumber, isOtherMonth, date = null) => {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        if (isOtherMonth) dayDiv.classList.add('other-month');

        const dayNum = document.createElement('div');
        dayNum.classList.add('day-number');
        dayNum.textContent = dayNumber;
        dayDiv.appendChild(dayNum);

        if (date && !isOtherMonth) {
            const dateKey = formatDateKey(date);
            dayDiv.dataset.date = dateKey;

            // Verificar si es hoy
            if (dateKey === formatDateKey(new Date())) {
                dayDiv.classList.add('today');
            }

            // Agregar citas del día
            const apptContainer = document.createElement('div');
            apptContainer.classList.add('day-appointments');
            const dayAppointments = getAppointmentsForDay(date);
            
            dayAppointments.forEach(app => {
                const apptDiv = document.createElement('div');
                apptDiv.classList.add('mini-appointment');
                apptDiv.style.backgroundColor = app.color;
                apptDiv.textContent = `${app.time} - ${app.description}`;
                apptContainer.appendChild(apptDiv);
            });

            dayDiv.appendChild(apptContainer);

            // Agregar botón de añadir en modo edición
            if (state.isEditMode) {
                const addBtn = document.createElement('button');
                addBtn.classList.add('add-day-btn');
                addBtn.innerHTML = '<i class="fas fa-plus"></i>';
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    state.selectedDay = date;
                    openAddAppointmentModal(date);
                });
                dayDiv.appendChild(addBtn);
            }

            // Click para ver día completo
            dayDiv.addEventListener('click', () => {
                state.selectedDay = date;
                showDayView();
            });
        }

        return dayDiv;
    };

    /**
     * Renderiza el calendario diario
     */
    const renderDayCalendar = () => {
        if (!state.selectedDay || !elements.dayTimeline || !elements.currentDay) return;

        const dayName = state.selectedDay.toLocaleDateString('es-ES', { weekday: 'long' });
        const dayNum = state.selectedDay.getDate();
        const monthName = state.selectedDay.toLocaleDateString('es-ES', { month: 'long' });
        const year = state.selectedDay.getFullYear();
        elements.currentDay.textContent = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${dayNum} de ${monthName} ${year}`;

        elements.dayTimeline.innerHTML = '';

        const dayAppts = getAppointmentsForDay(state.selectedDay);

        for (let hour = 8; hour <= 20; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');

            const timeLabel = document.createElement('div');
            timeLabel.classList.add('time-label');
            const hourStr = hour.toString().padStart(2, '0');
            timeLabel.textContent = `${hourStr}:00`;

            const slotContent = document.createElement('div');
            slotContent.classList.add('slot-content');

            const hourAppts = dayAppts.filter(app => {
                const appHour = parseInt(app.time.split(':')[0]);
                return appHour === hour;
            });

            hourAppts.forEach(app => {
                const apptDiv = document.createElement('div');
                apptDiv.classList.add('appointment-block');
                apptDiv.style.backgroundColor = app.color;
                apptDiv.innerHTML = `
                    <div class="appointment-time">${Utils.formatTime(app.time)}</div>
                    <div class="appointment-description">${app.description}</div>
                `;
                slotContent.appendChild(apptDiv);
            });

            if (state.isEditMode) {
                const addBtn = document.createElement('button');
                addBtn.classList.add('add-hour-btn');
                addBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar';
                addBtn.addEventListener('click', () => {
                    openAddAppointmentModal(state.selectedDay, `${hourStr}:00`);
                });
                slotContent.appendChild(addBtn);
            }

            timeSlot.appendChild(timeLabel);
            timeSlot.appendChild(slotContent);
            elements.dayTimeline.appendChild(timeSlot);
        }
    };

    /**
     * Muestra la vista mensual
     */
    const showMonthView = () => {
        if (elements.calendarMonthView) elements.calendarMonthView.classList.add('active');
        if (elements.calendarDayView) elements.calendarDayView.classList.remove('active');
        if (elements.monthViewBtn) elements.monthViewBtn.classList.add('active');
        if (elements.dayViewBtn) elements.dayViewBtn.classList.remove('active');
        renderMonthCalendar();
    };

    /**
     * Muestra la vista diaria
     */
    const showDayView = () => {
        if (elements.calendarMonthView) elements.calendarMonthView.classList.remove('active');
        if (elements.calendarDayView) elements.calendarDayView.classList.add('active');
        if (elements.monthViewBtn) elements.monthViewBtn.classList.remove('active');
        if (elements.dayViewBtn) elements.dayViewBtn.classList.add('active');
        renderDayCalendar();
    };

    /**
     * Toggle modo edición
     */
    const toggleEditMode = () => {
        state.isEditMode = !state.isEditMode;
        if (elements.editCalendarBtn) {
            elements.editCalendarBtn.classList.toggle('active');
        }
        if (elements.calendarMonthView.classList.contains('active')) {
            renderMonthCalendar();
        } else {
            renderDayCalendar();
        }
    };

    /**
     * Abre el modal para agregar cita
     */
    const openAddAppointmentModal = (date, time = '') => {
        if (!elements.addAppointmentForm) return;

        elements.addAppointmentForm.reset();
        const dateInput = document.getElementById('appointmentDate');
        const timeInput = document.getElementById('appointmentTime');

        if (dateInput) dateInput.value = formatInputDate(date);
        if (timeInput && time) timeInput.value = time;

        ModalManager.open(elements.addAppointmentModal);
    };

    /**
     * Maneja el envío del formulario de cita
     */
    const handleAppointmentSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const newAppointment = {
            id: Utils.generateId(),
            client: formData.get('client'),
            service: formData.get('service'),
            stylist: formData.get('stylist'),
            date: formData.get('date'),
            time: formData.get('time'),
            description: `${formData.get('client')} - ${formData.get('service')}`,
            color: ['#FF6B6B', '#6B6BFF', '#51CF66', '#7B68EE', '#FFB36B'][Math.floor(Math.random() * 5)],
            duration: 60
        };

        state.appointments.push(newAppointment);
        
        ModalManager.close(elements.addAppointmentModal);
        ConfirmationManager.showSuccess('La cita se ha guardado exitosamente');

        // Actualizar vista
        if (elements.calendarMonthView.classList.contains('active')) {
            renderMonthCalendar();
        } else {
            renderDayCalendar();
        }
    };

    /**
     * Obtiene las citas de un día específico
     */
    const getAppointmentsForDay = (date) => {
        const dateKey = formatDateKey(date);
        return state.appointments.filter(app => app.date === dateKey);
    };

    /**
     * Formatea una fecha para comparación (YYYY-MM-DD)
     */
    const formatDateKey = (date) => {
        return date.toISOString().split('T')[0];
    };

    /**
     * Formatea una fecha para input de fecha
     */
    const formatInputDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    /**
     * Inicializa el módulo
     */
    const initialize = async () => {
        await loadHTML();
    };

    /**
     * Muestra el módulo
     */
    const show = () => {
        NavigationManager.showSection('inicio-section');
        if (elements.monthCalendarGrid) {
            renderMonthCalendar();
        }
    };

    // API pública
    return {
        initialize,
        show
    };
})();
