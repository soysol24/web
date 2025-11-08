// Estado de la aplicación
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
let selectedDate = null;
let selectedTime = null;
let selectedStylist = null;

const months = [
    'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
    'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE'
];

// --- FUNCIONES DEL MODAL DE CANCELACIÓN ---

function openCancelModal() {
    const cancelModal = document.getElementById('cancel-modal');
    if (cancelModal) {
        cancelModal.classList.add('visible');
    }
}

function closeCancelModal() {
    const cancelModal = document.getElementById('cancel-modal');
    if (cancelModal) {
        cancelModal.classList.remove('visible');
    }
}

// --- FUNCIONES DEL MODAL DE ERROR ---
// (Estas funciones no cambian, siguen siendo correctas)

function openErrorModal(message) {
    const errorModal = document.getElementById('error-modal');
    const errorMessageElement = document.getElementById('error-modal-message');
    
    if (errorModal && errorMessageElement) {
        errorMessageElement.textContent = message;
        errorModal.classList.add('visible');
    } else {
        // Fallback por si el modal aún no carga
        console.error("El modal de error no se encontró en el DOM.");
        alert(message); // Muestra un alert como último recurso
    }
}

function closeErrorModal() {
    const errorModal = document.getElementById('error-modal');
    if (errorModal) {
        errorModal.classList.remove('visible');
    }
}


// --- FUNCIONES PRINCIPALES ---

// Función para generar el calendario
function generateCalendar(month, year) {
    // ... (Tu código de generateCalendar no cambia) ...
    const calendarGrid = document.querySelector('.calendar-grid');
    const monthDisplay = document.getElementById('currentMonth');
    
    monthDisplay.textContent = `${months[month]} ${year}`;
    calendarGrid.innerHTML = '';
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(year, month, day);
        currentDate.setHours(0, 0, 0, 0);

        if (currentDate < now) {
            dayElement.classList.add('disabled');
            dayElement.style.cursor = 'not-allowed';
            dayElement.style.opacity = '0.3';
        } else {
            if (day === selectedDate && month === currentMonth && year === currentYear) {
                dayElement.classList.add('active');
            }
            
            dayElement.addEventListener('click', function() {
                document.querySelectorAll('.calendar-day').forEach(d => {
                    d.classList.remove('active');
                });
                this.classList.add('active');
                selectedDate = day;
                updateTimeSlots();
            });
        }
        calendarGrid.appendChild(dayElement);
    }
}

// Actualizar disponibilidad de horarios
function updateTimeSlots() {
    // ... (Tu código de updateTimeSlots no cambia) ...
    if (!selectedDate) return;
    
    const timeSlots = document.querySelectorAll('.time-slot');
    const now = new Date();
    const selectedDateObj = new Date(currentYear, currentMonth, selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    const todayObj = new Date();
    todayObj.setHours(0, 0, 0, 0);
    
    const isToday = selectedDateObj.getTime() === todayObj.getTime();
    
    if (isToday) {
        const currentHour = now.getHours();
        
        timeSlots.forEach(slot => {
            let slotHour = parseInt(slot.textContent.split(':')[0]);
            const isPM = slot.textContent.includes('PM');
            const is12 = slotHour === 12;

            if (isPM && !is12) slotHour += 12;
            if (!isPM && is12) slotHour = 0;
            
            if (slotHour <= currentHour) {
                slot.style.opacity = '0.3';
                slot.style.cursor = 'not-allowed';
                slot.disabled = true;
                slot.classList.remove('selected');
                if (selectedTime === slot.textContent) selectedTime = null;
            } else {
                slot.style.opacity = '1';
                slot.style.cursor = 'pointer';
                slot.disabled = false;
            }
        });
    } else {
        timeSlots.forEach(slot => {
            slot.style.opacity = '1';
            slot.style.cursor = 'pointer';
            slot.disabled = false;
        });
    }
}

// Función para resetear toda la selección
function resetSelections() {
    // ... (Tu código de resetSelections no cambia) ...
    selectedDate = null;
    selectedTime = null;
    selectedStylist = null;
    
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    generateCalendar(currentMonth, currentYear);

    document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
    document.querySelectorAll('.stylist-card').forEach(c => c.classList.remove('selected'));
    
    const modalForm = document.getElementById('pre-cita-form');
    if (modalForm) {
        modalForm.reset();
    }
}

// --- INICIALIZACIÓN DE LA PÁGINA ---

document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar los modales dinámicamente
    cargarModalCancelacion();
    cargarYConfigurarModal();
    cargarErrorModal(); // <-- // NUEVO: Llamamos a la función para cargar el modal de error
    
    // Generar calendario inicial
    generateCalendar(currentMonth, currentYear);

    // ---- IMPORTANTE: ----
    // He quitado los listeners del modal de error de aquí,
    // porque AHORA se configuran dentro de la función 'cargarErrorModal'
    // ---- FIN DE LA NOTA ----
    
    // Animación de entrada
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Listeners del calendario
    document.getElementById('prevMonth').addEventListener('click', function() {
        // ... (Tu código de prevMonth no cambia) ...
        const now = new Date();
        const targetMonth = currentMonth - 1;
        const targetYear = targetMonth < 0 ? currentYear - 1 : currentYear;
        const normalizedMonth = targetMonth < 0 ? 11 : targetMonth;
        
        if (targetYear < now.getFullYear() || (targetYear === now.getFullYear() && normalizedMonth < now.getMonth())) {
            openErrorModal('No puedes navegar a meses anteriores al actual.');
            return;
        }
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
        // ... (Tu código de nextMonth no cambia) ...
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    // Listeners de horarios
    document.querySelectorAll('.time-slot').forEach(slot => {
        // ... (Tu código de time-slot no cambia) ...
        slot.addEventListener('click', function() {
            if (this.disabled) return;
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            selectedTime = this.textContent;
        });
    });

    // Listeners de estilistas
    document.querySelectorAll('.stylist-card').forEach((card, index) => {
        // ... (Tu código de stylist-card no cambia) ...
        card.addEventListener('click', function() {
            document.querySelectorAll('.stylist-card').forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            selectedStylist = index; 
        });
    });

    // Botón de cancelar (el principal) - Ahora abre el modal
    document.querySelector('.btn-cancel').addEventListener('click', function() {
        openCancelModal();
    });
});

// Función ASÍNCRONA para cargar el modal de cancelación
async function cargarModalCancelacion() {
    // ... (Tu código de cargarModalCancelacion no cambia) ...
    try {
        const response = await fetch('modals/agenda_confirm.html');
        if (!response.ok) {
            throw new Error(`Error al cargar el modal de cancelación: ${response.statusText}`);
        }
        const htmlModal = await response.text();
        
        const placeholder = document.getElementById('modal-placeholder-agendar');
        if (placeholder) {
            placeholder.innerHTML = htmlModal;
            
            document.getElementById('cancel-modal-close').addEventListener('click', closeCancelModal);
            document.getElementById('cancel-no').addEventListener('click', closeCancelModal);
            document.getElementById('cancel-yes').addEventListener('click', function() {
    // Redirige a servicios.html
    window.location.href = 'servicios.html';
});

            
            document.getElementById('cancel-modal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeCancelModal();
                }
            });
        }
    } catch (error) {
        console.error('No se pudo cargar el modal de cancelación:', error);
    }
}

// --- // NUEVA FUNCIÓN PARA CARGAR EL MODAL DE ERROR // ---
async function cargarErrorModal() {
    try {
        // 1. Buscamos el HTML del error
        const response = await fetch('modals/agenda_error.html'); 
        if (!response.ok) {
            throw new Error(`Error al cargar modals/agenda_error.html: ${response.statusText}`);
        }
        const htmlModal = await response.text();

        // 2. Lo insertamos en su placeholder
        const placeholder = document.getElementById('modal-placeholder-error');
        if (placeholder) {
            placeholder.innerHTML = htmlModal;

            // 3. (IMPORTANTE) Configuramos sus botones AHORA que el HTML existe
            document.getElementById('error-modal-ok').addEventListener('click', closeErrorModal);
            document.getElementById('error-modal-close-x').addEventListener('click', closeErrorModal);
            
            // 4. (IMPORTANTE) Configuramos el cierre al hacer clic en el fondo
            document.getElementById('error-modal').addEventListener('click', function(e) {
                if (e.target === this) {
                    closeErrorModal();
                }
            });
        }

    } catch (error) {
        console.error('No se pudo cargar el modal de error:', error);
    }
}


// Función ASÍNCRONA para cargar el modal de formulario
async function cargarYConfigurarModal() {
    
    try {
        // ... (Tu código de cargarYConfigurarModal no cambia, EXCEPTO el listener de .btn-confirm) ...
        const response = await fetch('modals/form.html'); 
        
        if (!response.ok) {
            throw new Error(`Error al cargar el modal: ${response.statusText}`);
        }
        
        const htmlModal = await response.text();
        document.getElementById('modal-placeholder-cita').innerHTML = htmlModal;

        const modal = document.getElementById('pre-cita-modal');
        const modalForm = document.getElementById('pre-cita-form');
        const modalCancelBtn = document.getElementById('modal-cancel');

        if (!modal || !modalForm || !modalCancelBtn) {
            console.error('Error: El HTML del modal se cargó, pero los IDs no coinciden.');
            return;
        }

        function openPreCitaModal() {
            modal.classList.add('visible');
        }

        function closePreCitaModal() {
            modal.classList.remove('visible');
        }

        modalCancelBtn.addEventListener('click', function() {
            closePreCitaModal();
            openCancelModal();
        });

        modalForm.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const formData = {
                alergias: document.getElementById('pregunta-alergias').value,
                condiciones: document.getElementById('pregunta-condiciones').value,
                extra: document.getElementById('pregunta-extra').value,
            };
            
            console.log('Datos del formulario:', formData);
            
            closePreCitaModal();
            alert('✅ ¡Cita confirmada exitosamente!\n\nTe esperamos.');
            resetSelections(); 
        });

        // Botón "Confirmar" PRINCIPAL (Esta lógica sigue igual, usando openErrorModal)
        document.querySelector('.btn-confirm').addEventListener('click', function() {
            
            if (!selectedDate || !selectedTime || selectedStylist === null) {
                let errorMessage = 'Por favor, completa lo siguiente:';
                if (!selectedDate) errorMessage += '\n- Selecciona una fecha';
                if (!selectedTime) errorMessage += '\n- Selecciona un horario';
                if (selectedStylist === null) errorMessage += '\n- Selecciona un estilista';
                
                openErrorModal(errorMessage); // Esto ya funciona bien
                return; 
            }

            const selectedDateObj = new Date(currentYear, currentMonth, selectedDate);
            selectedDateObj.setHours(0, 0, 0, 0);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            
            if (selectedDateObj < now) {
                openErrorModal('No puedes agendar una cita en una fecha pasada.');
                selectedDate = null;
                generateCalendar(currentMonth, currentYear);
                return;
            }
            
            const isToday = selectedDateObj.getTime() === now.getTime();
            if (isToday) {
                const currentHour = new Date().getHours();
                let slotHour = parseInt(selectedTime.split(':')[0]);
                const isPM = selectedTime.includes('PM');
                const is12 = slotHour === 12;
                
                if (isPM && !is12) slotHour += 12;
                if (!isPM && is12) slotHour = 0;
                
                if (slotHour <= currentHour) {
                    openErrorModal('La hora seleccionada ya pasó. Por favor selecciona otra hora.');
                    selectedTime = null;
                    document.querySelector('.time-slot.selected')?.classList.remove('selected');
                    updateTimeSlots();
                    return;
                }
            }
            // --- FIN DE VALIDACIONES ---

            openPreCitaModal();

        });

    } catch (error) {
        console.error('No se pudo cargar el modal de cita:', error);
        const btnConfirm = document.querySelector('.btn-confirm');
        btnConfirm.textContent = 'Error al cargar';
        btnConfirm.disabled = true;
    }
}