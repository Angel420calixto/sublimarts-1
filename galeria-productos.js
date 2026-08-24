'use strict';

/*
 * Capa de presentación de la galería.
 * No crea ni descarga imágenes: conserva los <img> que ya escribiste
 * dentro de cada .product-card en categoria1.html.
 */
document.addEventListener('DOMContentLoaded', () => {
    const mobileQuery = window.matchMedia('(max-width: 768px)');
    const galleries = [];

    document.querySelectorAll('.collection').forEach((collection) => {
        let grid = collection.querySelector(':scope .product-grid');
        const cards = Array.from(collection.querySelectorAll('.product-card'));

        if (!cards.length) return;

        /* Si una versión anterior construyó un carrusel pequeño, esta parte
           vuelve a poner sus mismas fichas dentro de una cuadrícula grande. */
        const previousShowcase = collection.querySelector('.collection-showcase');
        if (previousShowcase) {
            grid = document.createElement('div');
            grid.className = 'product-grid';
            grid.id = previousShowcase.id || `${collection.id || 'coleccion'}-gallery`;
            grid.dataset.gallery = collection.id || 'coleccion';
            previousShowcase.replaceWith(grid);
        }

        if (!grid) return;

        cards.forEach((card, index) => {
            card.classList.toggle('product-card--feature', index === 0);
            grid.append(card);
        });

        grid.classList.add('gallery-compact');

        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'gallery-toggle';
        toggle.setAttribute('aria-controls', grid.id);
        toggle.setAttribute('aria-expanded', 'false');

        const gallery = { grid, cards, toggle, expanded: false };
        galleries.push(gallery);

        grid.insertAdjacentElement('afterend', toggle);

        toggle.addEventListener('click', () => {
            gallery.expanded = !gallery.expanded;
            renderGallery(gallery);

            if (!gallery.expanded) {
                collection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        renderGallery(gallery);
    });

    function initialVisibleCount() {
        /* 1 referencia + 4 cuadros en PC; 1 referencia + 3 cuadros en móvil. */
        return mobileQuery.matches ? 4 : 5;
    }

    function renderGallery(gallery) {
        const limit = initialVisibleCount();
        const hasMore = gallery.cards.length > limit;

        gallery.cards.forEach((card, index) => {
            const visible = gallery.expanded || index < limit;
            card.hidden = !visible;
            card.setAttribute('aria-hidden', String(!visible));
        });

        gallery.grid.classList.toggle('is-expanded', gallery.expanded);
        gallery.toggle.hidden = !hasMore;
        gallery.toggle.setAttribute('aria-expanded', String(gallery.expanded));
        gallery.toggle.innerHTML = gallery.expanded
            ? 'Ver menos <span aria-hidden="true">↑</span>'
            : `Ver ${gallery.cards.length - limit} diseños más <span aria-hidden="true">↓</span>`;
    }

    mobileQuery.addEventListener('change', () => {
        galleries.forEach((gallery) => {
            /* Al cambiar de tamaño conservamos "Ver todos" solo si el usuario
               ya lo pidió; en caso contrario aplicamos el límite correcto. */
            renderGallery(gallery);
        });
    });
});
