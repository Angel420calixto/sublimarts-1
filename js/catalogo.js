/* ================================================
   SublimArts — js/catalogo.js
   Sidebar mobile, filtros por categoría, búsqueda,
   orden, "cargar más" y enlaces de WhatsApp dinámicos.
   ================================================ */

const NUMERO_WHATSAPP = '56912345678'; // TODO: confirmar número de contacto real

const MENSAJES_WHATSAPP = {
    general: 'Hola SublimArts, quiero más información sobre el catálogo de cuadros',
    'Cuadros personalizados': 'Hola, me gustaría cotizar un cuadro personalizado en aluminio HD',
    'Tu foto, tu cuadro': 'Hola, quiero enviarles una fotografía propia para convertirla en cuadro de aluminio HD'
};

function construirEnlaceWhatsapp(servicio) {
    const mensaje = MENSAJES_WHATSAPP[servicio] || MENSAJES_WHATSAPP.general;
    return `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

function initEnlacesWhatsapp() {
    document.querySelectorAll('.boton-whatsapp').forEach((el) => {
        const servicio = el.getAttribute('data-servicio') || 'general';
        el.setAttribute('href', construirEnlaceWhatsapp(servicio));
    });
}

/* ================================================
   SIDEBAR MOBILE
   ================================================ */
function initSidebar() {
    const boton = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    if (!boton || !sidebar || !overlay) return;

    function abrir() {
        sidebar.classList.add('activo');
        overlay.classList.add('activo');
        boton.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }
    function cerrar() {
        sidebar.classList.remove('activo');
        overlay.classList.remove('activo');
        boton.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    boton.addEventListener('click', () => {
        sidebar.classList.contains('activo') ? cerrar() : abrir();
    });
    overlay.addEventListener('click', cerrar);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('activo')) cerrar();
    });
    sidebar.querySelectorAll('a').forEach((enlace) => {
        enlace.addEventListener('click', () => {
            if (window.innerWidth <= 900) cerrar();
        });
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) cerrar();
    });
}

/* ================================================
   CATÁLOGO: FILTROS + BÚSQUEDA + ORDEN + CARGAR MÁS
   ================================================ */
function initCatalogo() {
    const grid = document.getElementById('grid-catalogo');
    const tabs = document.querySelectorAll('.tab-categoria');
    const buscador = document.getElementById('buscadorCatalogo');
    const orden = document.getElementById('ordenCatalogo');
    const botonCargarMas = document.getElementById('botonCargarMas');
    const mensajeVacio = document.getElementById('catalogoVacio');
    if (!grid) return;

    const tarjetas = Array.from(grid.querySelectorAll('.tarjeta-cuadro'));
    let categoriaActiva = 'todo';
    let textoBusqueda = '';
    let ocultasVisibles = false; // controla si ya se reveló el segundo bloque

    function aplicarFiltros() {
        let visiblesCount = 0;

        tarjetas.forEach((tarjeta) => {
            const coincideCategoria = categoriaActiva === 'todo' || tarjeta.dataset.categoria === categoriaActiva;
            const coincideTexto = tarjeta.dataset.nombre.toLowerCase().includes(textoBusqueda);
            const esBloqueOculto = tarjeta.classList.contains('tarjeta-oculta');

            const debeMostrarse = coincideCategoria && coincideTexto && (!esBloqueOculto || ocultasVisibles);
            tarjeta.style.display = debeMostrarse ? '' : 'none';
            if (debeMostrarse) visiblesCount++;
        });

        if (mensajeVacio) mensajeVacio.hidden = visiblesCount > 0;

        // Oculta "Cargar más" si ya no quedan tarjetas del bloque oculto que mostrar,
        // o si el filtro/búsqueda activo ya reveló todo lo relevante.
        if (botonCargarMas) {
            const quedanOcultas = tarjetas.some((t) =>
                t.classList.contains('tarjeta-oculta') &&
                !ocultasVisibles &&
                (categoriaActiva === 'todo' || t.dataset.categoria === categoriaActiva) &&
                t.dataset.nombre.toLowerCase().includes(textoBusqueda)
            );
            botonCargarMas.hidden = !quedanOcultas;
        }
    }

    function aplicarOrden(criterio) {
        const ordenadas = [...tarjetas].sort((a, b) => {
            if (criterio === 'az') return a.dataset.nombre.localeCompare(b.dataset.nombre);
            if (criterio === 'za') return b.dataset.nombre.localeCompare(a.dataset.nombre);
            if (criterio === 'tamano') return a.dataset.tamano.localeCompare(b.dataset.tamano);
            return 0; // "recientes" = orden original del HTML
        });
        ordenadas.forEach((tarjeta) => grid.appendChild(tarjeta));
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => {
                t.classList.remove('activo');
                t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('activo');
            tab.setAttribute('aria-selected', 'true');
            categoriaActiva = tab.dataset.filtro;
            aplicarFiltros();
        });
    });

    if (buscador) {
        buscador.addEventListener('input', () => {
            textoBusqueda = buscador.value.trim().toLowerCase();
            aplicarFiltros();
        });
    }

    if (orden) {
        orden.addEventListener('change', () => aplicarOrden(orden.value));
    }

    if (botonCargarMas) {
        botonCargarMas.addEventListener('click', () => {
            botonCargarMas.classList.add('girando');
            ocultasVisibles = true;
            setTimeout(() => {
                aplicarFiltros();
                botonCargarMas.classList.remove('girando');
            }, 350);
        });
    }

    aplicarFiltros();
}

/* ================================================
   INICIALIZACIÓN
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {
    initEnlacesWhatsapp();
    initSidebar();
    initCatalogo();
});