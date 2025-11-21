const FormularioModule = (() => {
    let forms = [
        {
            id: 1,
            questions: ['¿Cuál es tu nombre?', '¿Qué servicio deseas?', '¿Tienes alguna alergia?']
        },
        {
            id: 2,
            questions: ['¿Cuál es tu experiencia previa?', '¿Qué resultado esperas?']
        }
    ];

    const loadHTML = async () => {
        const container = document.getElementById('formulario-section');
        if (!container) return;
        try {
            const response = await fetch('../HTML/formulario.html');
            const html = await response.text();
            container.innerHTML = html;
            initializeEventListeners();
            renderForms();
        } catch (error) {
            container.innerHTML = '<p class="placeholder-text">Error cargando el módulo</p>';
        }
    };

    const initializeEventListeners = () => {
        const addFormBtn = document.getElementById('addFormBtn');
        const addFormModal = document.getElementById('addFormModal');
        const addFormularioForm = document.getElementById('addFormularioForm');
        const addQuestionBtn = document.getElementById('addQuestionBtn');
        const cancelFormBtn = document.querySelector('.cancel-form');

        if (addFormBtn) {
            addFormBtn.addEventListener('click', () => {
                clearFormModal();
                ModalManager.open(addFormModal);
            });
        }

        if (addQuestionBtn) {
            addQuestionBtn.addEventListener('click', addQuestionField);
        }

        if (addFormularioForm) {
            addFormularioForm.addEventListener('submit', handleFormSubmit);
        }

        if (cancelFormBtn) {
            cancelFormBtn.addEventListener('click', () => {
                ConfirmationManager.confirmCancel(() => {
                    ModalManager.close(addFormModal);
                    clearFormModal();
                });
            });
        }

        initializeRemoveButtons();
    };

    const addQuestionField = () => {
        const container = document.getElementById('formQuestionsContainer');
        if (!container) return;

        const questionItem = document.createElement('div');
        questionItem.className = 'form-question-item';
        questionItem.innerHTML = `
            <div class="form-group">
                <label>Pregunta</label>
                <input type="text" class="question-input" placeholder="Escribe la pregunta" required>
            </div>
            <button type="button" class="remove-question-btn" aria-label="Eliminar pregunta">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
        `;

        container.appendChild(questionItem);

        const removeBtn = questionItem.querySelector('.remove-question-btn');
        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                questionItem.remove();
            });
        }
    };

    const initializeRemoveButtons = () => {
        const removeButtons = document.querySelectorAll('.remove-question-btn');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const questionItem = btn.closest('.form-question-item');
                if (questionItem && document.querySelectorAll('.form-question-item').length > 1) {
                    questionItem.remove();
                }
            });
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const questionInputs = document.querySelectorAll('.question-input');
        const questions = Array.from(questionInputs)
            .map(input => input.value.trim())
            .filter(q => q !== '');

        if (questions.length === 0) {
            alert('Debes agregar al menos una pregunta');
            return;
        }

        ConfirmationManager.confirmSave(() => {
            const newForm = {
                id: Utils.generateId(),
                questions: questions
            };

            forms.push(newForm);
            renderForms();
            ModalManager.close(document.getElementById('addFormModal'));
            clearFormModal();
            ConfirmationManager.showSuccess('Formulario guardado exitosamente');
        });
    };

    const clearFormModal = () => {
        const container = document.getElementById('formQuestionsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="form-question-item">
                <div class="form-group">
                    <label>Pregunta</label>
                    <input type="text" class="question-input" placeholder="Escribe la pregunta" required>
                </div>
                <button type="button" class="remove-question-btn" aria-label="Eliminar pregunta">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
        `;

        initializeRemoveButtons();
    };

    const renderForms = () => {
        const formsList = document.getElementById('formsList');
        if (!formsList) return;

        if (forms.length === 0) {
            formsList.innerHTML = '<p class="placeholder-text">No hay formularios creados</p>';
            return;
        }

        formsList.innerHTML = forms.map((form, index) => `
            <div class="form-card">
                <h3>Formulario ${index + 1}</h3>
                <ul class="form-questions-list">
                    ${form.questions.map(q => `<li>• ${q}</li>`).join('')}
                </ul>
                <div class="form-actions">
                    <button class="edit-card-btn" onclick="FormularioModule.editForm(${form.id})">Editar</button>
                    <button class="delete-card-btn" onclick="FormularioModule.deleteForm(${form.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    };

    const editForm = (formId) => {
        alert('Función de edición en desarrollo');
    };

    const deleteForm = (formId) => {
        ConfirmationManager.confirmDelete(() => {
            forms = forms.filter(f => f.id !== formId);
            renderForms();
            ConfirmationManager.showSuccess('Formulario eliminado exitosamente');
        });
    };

    const initialize = async () => {
        await loadHTML();
    };

    const show = () => {
        NavigationManager.showSection('formulario-section');
    };

    return { 
        initialize, 
        show,
        editForm,
        deleteForm
    };
})();
