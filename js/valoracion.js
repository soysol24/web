// Usamos un 'DOMContentLoaded' asíncrono
document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. Cargar el Modal PRIMERO ---
    try {
        // Esta es la ruta correcta, relativa al HTML que carga este script
        const response = await fetch('modals/valoracion_confirm.html'); 
        
        if (!response.ok) {
            throw new Error('No se pudo cargar el modal de confirmación.');
        }
        
        const modalHTML = await response.text();
        // Se inyecta en el placeholder
        document.getElementById('modal-placeholder').innerHTML = modalHTML;

    } catch (error) {
        console.error('Error fatal al cargar modal:', error);
        alert('Error al cargar la página. Inténtalo de nuevo.');
        return; // Detiene la ejecución si el modal falla
    }

    // --- 2. Ahora que el modal EXISTE, configuramos TODO ---

    // --- Lógica del Sistema de Estrellas ---
    const stars = document.querySelectorAll('.star-rating i');
    const ratingValueInput = document.getElementById('ratingValue');
    let currentRating = 0;

    stars.forEach(star => {
        // Evento al pasar el ratón por encima
        star.addEventListener('mouseover', () => {
            resetStars(); // Limpia estrellas
            const rating = star.getAttribute('data-value');
            highlightStars(rating); // Ilumina hasta esa estrella
        });

        // Evento al quitar el ratón
        star.addEventListener('mouseleave', () => {
            resetStars(); // Limpia
            highlightStars(currentRating); // Vuelve a la calificación guardada
        });

        // Evento al hacer clic
        star.addEventListener('click', () => {
            const rating = star.getAttribute('data-value');
            currentRating = rating; // Guarda la calificación
            ratingValueInput.value = currentRating; // Actualiza el input oculto
            highlightStars(currentRating);
        });
    });

    function highlightStars(rating) {
        for (let i = 0; i < rating; i++) {
            stars[i].classList.remove('far'); // Quita icono vacío
            stars[i].classList.add('fas'); // Añade icono lleno
        }
    }

    function resetStars() {
        stars.forEach(star => {
            star.classList.remove('fas'); // Quita icono lleno
            star.classList.add('far'); // Añade icono vacío
        });
    }

    // --- Lógica del Modal de Confirmación ---
    // Ahora estamos seguros de que estos elementos existen
    const modal = document.getElementById('confirmar-modal');
    const publicarBtn = document.getElementById('publicarBtn');
    const closeBtn = document.getElementById('closeConfirmModal');
    const btnSi = document.getElementById('confirmar-si');
    const btnNo = document.getElementById('confirmar-no');
    const comentarioInput = document.getElementById('comentario');

    // Verificación (buena práctica)
    if (!modal || !publicarBtn || !closeBtn || !btnSi || !btnNo) {
        console.error("Error: Faltan elementos del modal después de la carga.");
        return;
    }

    function openModal() {
        modal.classList.add('visible');
    }

    function closeModal() {
        modal.classList.remove('visible');
    }

    publicarBtn.addEventListener('click', () => {
        // Validación
        if (currentRating == 0 && comentarioInput.value.trim() === "") {
            alert('Por favor, selecciona una calificación o escribe un comentario.');
            return;
        }
        openModal(); // Abre el modal de confirmación
    });

    // Listeners de los botones del modal
    closeBtn.addEventListener('click', closeModal);
    btnNo.addEventListener('click', closeModal);

    btnSi.addEventListener('click', () => {
        console.log("Comentario Enviado:");
        console.log("Calificación:", currentRating);
        console.log("Comentario:", comentarioInput.value);
        
        // Simulación de envío
        alert('¡Gracias por tu valoración!');
        
        closeModal();
        
        // Limpiar formulario
        document.getElementById('valoracionForm').reset();
        currentRating = 0;
        ratingValueInput.value = 0;
        resetStars();
    });
});