document.addEventListener('DOMContentLoaded', () => {
    
    console.log('Página de Promociones cargada correctamente.');

    const promoContainer = document.querySelector('.promo-container');
    // Buscamos las tarjetas de promoción QUE ESTÉN DENTRO del contenedor
    const cards = promoContainer.querySelectorAll('.promo-card');

    if (cards.length > 0) {
        // --- SÍ HAY PROMOCIONES: Aplicar animación ---
        console.log(`Se encontraron ${cards.length} promociones.`);
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Cuando la tarjeta entra en pantalla, se vuelve visible
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.2 }); // Se activa cuando el 20% de la tarjeta es visible

        cards.forEach(card => {
            // Estado inicial: invisible y un poco más abajo
            card.style.opacity = 0;
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            
            // Empezar a observar
            observer.observe(card);
        });

    } else {
        // --- NO HAY PROMOCIONES: Mostrar mensaje ---
        console.log('No se encontraron promociones. Mostrando mensaje.');
        
        // Crear el HTML del mensaje (basado en tu imagen)
        const noPromosHTML = `
            <div class="no-promos-container">
                <span class="no-promos-text">No hay promociones disponibles</span>
                <div class="promo-dots">
                    <span class="promo-dot active"></span>
                    <span class="promo-dot"></span>
                    <span class="promo-dot"></span>
                </div>
            </div>
        `;
        
        // Insertar el HTML en el contenedor
        promoContainer.innerHTML = noPromosHTML;
    }
});