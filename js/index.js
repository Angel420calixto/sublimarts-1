// ============================================================
// SUBLIMARTS - INDEX.JS
// Optimización de navegación, servicios, filtros y modal
// ============================================================

(() => {
    "use strict";

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    /*
     * IMPORTANTE:
     * Se conserva el sistema de WhatsApp original mediante
     * data-message en cada enlace.
     *
     * No se inventa ni reemplaza el número de WhatsApp.
     */

    const SERVICES_PAGE = "servicios.html";


    // ============================================================
    // DATOS DE LOS SERVICIOS
    // ============================================================

    const SERVICE_DATA = [
        {
            title: "Impresión de fotografías",
            category: "impresiones",
            categoryLabel: "Impresión",
            description:
                "Impresión de fotografías en papel fotográfico de máxima calidad, con un tamaño máximo de A4. Ideal para conservar, regalar o utilizar tus fotografías en proyectos y recuerdos personalizados."
        },

        {
            title: "Fotografía para licenciaturas",
            category: "licenciaturas",
            categoryLabel: "Licenciaturas",
            description:
                "Servicio de fotografía para licenciaturas de cursos, pensado para capturar el momento y obtener las fotografías necesarias para crear un recuerdo completo de esta etapa."
        },

        {
            title: "Cuadro tradicional",
            category: "tradicionales",
            categoryLabel: "Clásico",
            description:
                "Confección de cuadros tradicionales utilizando papel fotográfico y marco de madera. Una alternativa clásica y elegante para conservar tus fotografías."
        },

        {
            title: "Cuadro de licenciatura Premium",
            category: "licenciaturas",
            categoryLabel: "Premium",
            description:
                "Una alternativa Premium para tu recuerdo de licenciatura: fotografía sublimada sobre aluminio de 0,45 mm y marco de aluminio. Disponible en distintas medidas, hasta 30 × 40 cm."
        },

        {
            title: "Álbumes fotográficos personalizados",
            category: "albumes",
            categoryLabel: "Álbumes",
            description:
                "Álbumes confeccionados con papel fotográfico tradicional, diseñados a pedido para reunir tus mejores momentos y contar una historia completa."
        },

        {
            title: "Álbumes para momentos especiales",
            category: "albumes",
            categoryLabel: "Historias",
            description:
                "Álbumes personalizados para bautizos, matrimonios, vacaciones, celebraciones, aniversarios y otros momentos importantes que quieras conservar de una manera especial."
        },

        {
            title: "Cuadros sublimados en aluminio",
            category: "aluminio",
            categoryLabel: "SublimArts",
            description:
                "Cuadros sublimados en aluminio disponibles en A4, A3 y hasta 30 × 40 cm, con diferentes estilos y composiciones: seccionados, hexagonales, múltiples placas formando una sola imagen y otras propuestas personalizadas."
        }
    ];


    // ============================================================
    // INICIO
    // ============================================================

    document.addEventListener("DOMContentLoaded", () => {

        injectOptimizationStyles();

        setupNavigation();

        setupPortfolio();

        setupModal();

        setupWhatsApp();

        setupQuoteForm();

        setupComparison();

        setupImages();

        setupFooterYear();

    });


    // ============================================================
    // ESTILOS DINÁMICOS
    // ============================================================

    function injectOptimizationStyles() {

        if (
            document.querySelector(
                "#sublimarts-js-optimizations"
            )
        ) {
            return;
        }


        const style =
            document.createElement("style");


        style.id =
            "sublimarts-js-optimizations";


        style.textContent = `

            /* ==================================================
               NAV FIJO
               ================================================== */

            .site-header {
                position: fixed !important;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                transition:
                    background-color .25s ease,
                    backdrop-filter .25s ease,
                    box-shadow .25s ease;
            }

            .site-header.sublimarts-scrolled {
                background: rgba(17, 18, 20, .94);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                box-shadow: 0 8px 30px rgba(0, 0, 0, .18);
            }

            html {
                scroll-padding-top: 90px;
            }

            section[id] {
                scroll-margin-top: 90px;
            }


            /* ==================================================
               PORTAFOLIO
               ================================================== */

            #portafolio .masonry {
                grid-auto-flow: dense;
                align-items: stretch;
            }

            #portafolio .portfolio-item {
                min-width: 0;
                min-height: 0;
            }

            #portafolio .portfolio-item img {
                object-fit: contain !important;
                object-position: center !important;
                background: #101114;
            }

            #portafolio .portfolio-item:hover img {
                transform: scale(1.025);
            }

            #portafolio .portfolio-item span {
                z-index: 2;
                opacity: 1;
                background:
                    linear-gradient(
                        180deg,
                        transparent 28%,
                        rgba(0, 0, 0, .80) 100%
                    );
                justify-content: flex-end;
            }


            /* ==================================================
               IMÁGENES GENERALES
               ================================================== */

            .product-image,
            .product-card-image,
            .comparison-image,
            .category-grid a,
            .service-grid article > img,
            .about > div:first-child {
                background: #101114;
            }


            .product-image img,
            .product-card-image img,
            .comparison-image img,
            .category-grid img,
            .service-grid article > img,
            .about > div:first-child img {
                object-fit: contain !important;
                object-position: center !important;
            }


            /* ==================================================
               HERO
               NO SE MODIFICA
               ================================================== */

            .hero-image img {
                object-fit: cover !important;
            }


            /* ==================================================
               COMPARACIÓN
               ================================================== */

            .comparison-grid article {
                position: relative;
            }

            .comparison-image {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .comparison-grid article .comparison-overlay {
                position: absolute;
                inset: auto 0 0;
                z-index: 3;
                padding: 48px 25px 22px;
                pointer-events: none;
                background:
                    linear-gradient(
                        180deg,
                        transparent 0%,
                        rgba(0, 0, 0, .88) 100%
                    );
            }

            .comparison-grid article .comparison-overlay h3 {
                margin: 0;
                color: var(--cream);
                font-size: 34px;
                line-height: .95;
            }

            .comparison-grid article .comparison-overlay .eyebrow {
                margin-bottom: 7px;
            }

            .comparison-grid article .comparison-overlay ul {
                margin: 10px 0 0;
                padding-left: 18px;
                color: var(--muted);
                font-size: 11px;
                line-height: 1.6;
            }


            /* ==================================================
               MODAL
               ================================================== */

            .image-modal img {
                object-fit: contain !important;
                object-position: center !important;
            }

            .image-modal > div {
                max-height: 94vh;
            }


            /* ==================================================
               FILTROS
               ================================================== */

            #portafolio .filters {
                scrollbar-width: thin;
                scrollbar-color: var(--sand) transparent;
            }


            /* ==================================================
               MOBILE
               ================================================== */

            @media (max-width: 760px) {

                .site-header {
                    position: fixed !important;
                }

                html {
                    scroll-padding-top: 78px;
                }

                section[id] {
                    scroll-margin-top: 78px;
                }

                #portafolio .portfolio-item img {
                    object-fit: contain !important;
                }

                .comparison-image {
                    min-height: 220px;
                }

                .comparison-grid article .comparison-overlay {
                    padding: 35px 18px 16px;
                }

                .comparison-grid article .comparison-overlay h3 {
                    font-size: 28px;
                }

                .comparison-grid article .comparison-overlay ul {
                    font-size: 10px;
                }

                .image-modal img {
                    max-height: 55vh !important;
                }
            }
        `;


        document.head.appendChild(style);
    }


    // ============================================================
    // NAVEGACIÓN
    // ============================================================

    function setupNavigation() {

        const header =
            document.querySelector(
                ".site-header"
            );


        const nav =
            document.querySelector(
                "#main-nav"
            );


        const menuButton =
            document.querySelector(
                "#menu-button"
            );


        if (!header) {
            return;
        }


        // --------------------------------------------------------
        // Efecto al desplazarse
        // --------------------------------------------------------

        function updateHeader() {

            if (
                window.scrollY > 25
            ) {

                header.classList.add(
                    "sublimarts-scrolled"
                );

            } else {

                header.classList.remove(
                    "sublimarts-scrolled"
                );

            }
        }


        updateHeader();


        window.addEventListener(
            "scroll",
            updateHeader,
            {
                passive: true
            }
        );


        // --------------------------------------------------------
        // Menú móvil
        // --------------------------------------------------------

        if (
            nav &&
            menuButton
        ) {

            menuButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();


                    const open =
                        nav.classList.toggle(
                            "open"
                        );


                    menuButton.setAttribute(
                        "aria-expanded",
                        String(open)
                    );


                    menuButton.setAttribute(
                        "aria-label",
                        open
                            ? "Cerrar menú"
                            : "Abrir menú"
                    );

                }
            );


            // ----------------------------------------------------
            // Cerrar al seleccionar enlace
            // ----------------------------------------------------

            nav.querySelectorAll(
                "a"
            ).forEach((link) => {

                link.addEventListener(
                    "click",
                    () => {

                        nav.classList.remove(
                            "open"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuButton.setAttribute(
                            "aria-label",
                            "Abrir menú"
                        );

                    }
                );

            });


            // ----------------------------------------------------
            // Cerrar fuera
            // ----------------------------------------------------

            document.addEventListener(
                "click",
                (event) => {

                    if (
                        nav.classList.contains(
                            "open"
                        ) &&
                        !nav.contains(
                            event.target
                        ) &&
                        !menuButton.contains(
                            event.target
                        )
                    ) {

                        nav.classList.remove(
                            "open"
                        );


                        menuButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        menuButton.setAttribute(
                            "aria-label",
                            "Abrir menú"
                        );

                    }

                }
            );

        }


        // --------------------------------------------------------
        // Dropdown
        // --------------------------------------------------------

        const dropdown =
            document.querySelector(
                ".nav-dropdown"
            );


        if (!dropdown) {
            return;
        }


        const dropdownButton =
            dropdown.querySelector(
                "button"
            );


        if (!dropdownButton) {
            return;
        }


        dropdownButton.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();


                const open =
                    dropdown.classList.toggle(
                        "open"
                    );


                dropdownButton.setAttribute(
                    "aria-expanded",
                    String(open)
                );

            }
        );


        document.addEventListener(
            "click",
            (event) => {

                if (
                    !dropdown.contains(
                        event.target
                    )
                ) {

                    dropdown.classList.remove(
                        "open"
                    );


                    dropdownButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    // ============================================================
    // PORTAFOLIO / SERVICIOS
    // ============================================================

    function setupPortfolio() {

        const portfolio =
            document.querySelector(
                "#portafolio"
            );


        if (!portfolio) {
            return;
        }


        const items =
            portfolio.querySelectorAll(
                ".portfolio-item"
            );


        const filters =
            portfolio.querySelectorAll(
                "[data-filter]"
            );


        // --------------------------------------------------------
        // Encabezado
        // --------------------------------------------------------

        const heading =
            portfolio.querySelector(
                ".section-heading"
            );


        if (heading) {

            const eyebrow =
                heading.querySelector(
                    ".eyebrow"
                );


            const title =
                heading.querySelector(
                    "h2"
                );


            const description =
                heading.querySelector(
                    "p:not(.eyebrow)"
                );


            if (eyebrow) {

                eyebrow.textContent =
                    "SERVICIOS · FOTOGRAFÍA · RECUERDOS";

            }


            if (title) {

                title.textContent =
                    "Una fotografía puede convertirse en mucho más.";

            }


            if (description) {

                description.textContent =
                    "Elige cómo quieres conservar tus momentos: impresión fotográfica, fotografía para licenciaturas, cuadros tradicionales, alternativas Premium en aluminio, álbumes personalizados o nuestras propuestas de sublimación.";

            }

        }


        // --------------------------------------------------------
        // Asignar información a las tarjetas
        // --------------------------------------------------------

        items.forEach(
            (item, index) => {

                const service =
                    SERVICE_DATA[index];


                if (!service) {
                    return;
                }


                item.dataset.category =
                    service.category;


                item.dataset.title =
                    service.title;


                item.dataset.description =
                    service.description;


                const label =
                    item.querySelector(
                        "span"
                    );


                if (label) {

                    const small =
                        label.querySelector(
                            "small"
                        );


                    if (small) {

                        small.textContent =
                            service.categoryLabel;

                    }

                }


                const image =
                    item.querySelector(
                        "img"
                    );


                if (image) {

                    image.loading =
                        "lazy";

                    image.decoding =
                        "async";

                    image.style.objectFit =
                        "contain";

                    image.style.objectPosition =
                        "center";

                }

            }
        );


        // --------------------------------------------------------
        // Filtros
        // --------------------------------------------------------

        const filterNames = {

            todo:
                "Todo",

            impresiones:
                "Impresión de fotos",

            licenciaturas:
                "Licenciaturas",

            albumes:
                "Álbumes",

            tradicionales:
                "Cuadros tradicionales",

            aluminio:
                "Aluminio HD"

        };


        filters.forEach(
            (filter) => {

                const category =
                    filter.dataset.filter;


                if (
                    Object.prototype.hasOwnProperty.call(
                        filterNames,
                        category
                    )
                ) {

                    filter.textContent =
                        filterNames[
                            category
                        ];

                }


                filter.setAttribute(
                    "role",
                    "tab"
                );


                filter.addEventListener(
                    "click",
                    () => {

                        filters.forEach(
                            (button) => {

                                button.classList.remove(
                                    "active"
                                );


                                button.setAttribute(
                                    "aria-selected",
                                    "false"
                                );

                            }
                        );


                        filter.classList.add(
                            "active"
                        );


                        filter.setAttribute(
                            "aria-selected",
                            "true"
                        );


                        items.forEach(
                            (item) => {

                                const visible =
                                    category ===
                                    "todo" ||
                                    item.dataset.category ===
                                    category;


                                item.hidden =
                                    !visible;

                            }
                        );

                    }
                );

            }
        );


        // --------------------------------------------------------
        // Estado inicial
        // --------------------------------------------------------

        const firstFilter =
            portfolio.querySelector(
                '[data-filter="todo"]'
            );


        if (firstFilter) {

            firstFilter.classList.add(
                "active"
            );


            firstFilter.setAttribute(
                "aria-selected",
                "true"
            );

        }

    }


    // ============================================================
    // MODAL
    // ============================================================

    function setupModal() {

        const modal =
            document.querySelector(
                "#image-modal"
            );


        if (!modal) {
            return;
        }


        const modalImage =
            document.querySelector(
                "#modal-image"
            );


        const modalCategory =
            document.querySelector(
                "#modal-category"
            );


        const modalTitle =
            document.querySelector(
                "#modal-title"
            );


        const modalDescription =
            document.querySelector(
                "#modal-description"
            );


        const modalAction =
            modal.querySelector(
                ".wa-link"
            );


        const items =
            document.querySelectorAll(
                "#portafolio .portfolio-item"
            );


        // --------------------------------------------------------
        // Cambiar botón del modal
        // --------------------------------------------------------

        if (modalAction) {

            modalAction.classList.remove(
                "wa-link"
            );


            modalAction.classList.add(
                "modal-service-link"
            );


            modalAction.textContent =
                "Ver más";


            const icon =
                document.createElement(
                    "i"
                );


            icon.className =
                "fa-solid fa-arrow-right";


            modalAction.appendChild(
                icon
            );

        }


        // --------------------------------------------------------
        // Abrir
        // --------------------------------------------------------

        items.forEach(
            (item) => {

                item.addEventListener(
                    "click",
                    () => {

                        const image =
                            item.dataset.image ||
                            item.querySelector(
                                "img"
                            )?.currentSrc ||
                            item.querySelector(
                                "img"
                            )?.src ||
                            "";


                        const title =
                            item.dataset.title ||
                            "Servicio SublimArts";


                        const category =
                            item.dataset.category ||
                            "";


                        const description =
                            item.dataset.description ||
                            "";


                        const alt =
                            item.querySelector(
                                "img"
                            )?.alt ||
                            title;


                        if (modalImage) {

                            modalImage.src =
                                image;

                            modalImage.alt =
                                alt;

                            modalImage.style.objectFit =
                                "contain";

                        }


                        if (modalCategory) {

                            const service =
                                SERVICE_DATA.find(
                                    (entry) =>
                                        entry.title ===
                                        title
                                );


                            modalCategory.textContent =
                                service?.categoryLabel ||
                                category;

                        }


                        if (modalTitle) {

                            modalTitle.textContent =
                                title;

                        }


                        if (modalDescription) {

                            modalDescription.textContent =
                                description;

                        }


                        // ------------------------------------------------
                        // VER MÁS
                        // ------------------------------------------------

                        if (modalAction) {

                            modalAction.href =
                                `${SERVICES_PAGE}?servicio=${encodeURIComponent(
                                    title
                                )}`;

                            modalAction.target =
                                "_self";

                            modalAction.removeAttribute(
                                "rel"
                            );

                        }


                        if (
                            typeof modal.showModal ===
                            "function"
                        ) {

                            modal.showModal();

                        } else {

                            modal.setAttribute(
                                "open",
                                ""
                            );

                        }

                    }
                );

            }
        );


        // --------------------------------------------------------
        // Cerrar
        // --------------------------------------------------------

        const closeButton =
            modal.querySelector(
                ".close-modal"
            );


        if (closeButton) {

            closeButton.addEventListener(
                "click",
                () => {

                    closeModal(
                        modal
                    );

                }
            );

        }


        // --------------------------------------------------------
        // Cerrar haciendo click fuera
        // --------------------------------------------------------

        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    modal
                ) {

                    closeModal(
                        modal
                    );

                }

            }
        );


        // --------------------------------------------------------
        // ESC
        // --------------------------------------------------------

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape" &&
                    modal.open
                ) {

                    closeModal(
                        modal
                    );

                }

            }
        );

    }


    function closeModal(modal) {

        if (
            typeof modal.close ===
            "function"
        ) {

            modal.close();

        } else {

            modal.removeAttribute(
                "open"
            );

        }

    }


    // ============================================================
    // WHATSAPP
    // ============================================================

    function setupWhatsApp() {

        /*
         * No se modifica el número.
         *
         * Se respeta el href/data-message que ya tenga
         * cada elemento del HTML.
         */

        document
            .querySelectorAll(
                ".wa-link"
            )
            .forEach(
                (link) => {

                    if (
                        link.classList.contains(
                            "modal-service-link"
                        )
                    ) {
                        return;
                    }


                    const message =
                        link.dataset.message;


                    /*
                     * Si el HTML ya tiene un enlace válido
                     * de WhatsApp, no lo destruimos.
                     */

                    if (
                        link.href &&
                        link.href.includes(
                            "wa.me"
                        )
                    ) {

                        link.target =
                            "_blank";

                        link.rel =
                            "noopener noreferrer";

                        return;

                    }


                    /*
                     * Si no tiene wa.me, se conserva
                     * el href existente.
                     */

                    if (
                        link.getAttribute(
                            "href"
                        ) ===
                        "#contacto"
                    ) {

                        /*
                         * No inventamos el número.
                         *
                         * El mensaje queda disponible
                         * mediante data-message para
                         * el sistema existente.
                         */

                        link.dataset.message =
                            message ||
                            "Hola SublimArts, quiero más información.";

                    }

                }
            );

    }


    // ============================================================
    // FORMULARIO
    // ============================================================

    function setupQuoteForm() {

        const form =
            document.querySelector(
                "#quote-form"
            );


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const data =
                    new FormData(
                        form
                    );


                const name =
                    String(
                        data.get(
                            "name"
                        ) ||
                        ""
                    ).trim();


                const email =
                    String(
                        data.get(
                            "email"
                        ) ||
                        ""
                    ).trim();


                const notice =
                    document.querySelector(
                        "#form-notice"
                    );


                const validEmail =
                    /^\S+@\S+\.\S+$/.test(
                        email
                    );


                if (
                    name.length < 2 ||
                    !validEmail
                ) {

                    if (notice) {

                        notice.textContent =
                            "Revisa tu nombre y correo para continuar.";

                    }

                    return;
                }


                const service =
                    data.get(
                        "service"
                    ) ||
                    "un servicio";


                const date =
                    data.get(
                        "date"
                    ) ||
                    "por definir";


                const message =
                    String(
                        data.get(
                            "message"
                        ) ||
                        ""
                    ).trim();


                const whatsappMessage =
                    `Hola SublimArts, soy ${name}. ` +
                    `Quiero cotizar ${service}. ` +
                    `Fecha aproximada: ${date}. ` +
                    `${message}`;


                if (notice) {

                    notice.textContent =
                        "Tu solicitud está lista para enviar.";

                }


                /*
                 * No se genera un wa.me nuevo aquí porque
                 * el número real debe permanecer en la
                 * configuración existente del proyecto.
                 *
                 * Si tu formulario original ya tenía su
                 * integración de WhatsApp, esta función
                 * conserva su estructura.
                 */

                form.dataset.whatsappMessage =
                    whatsappMessage;

            }
        );

    }


    // ============================================================
    // COMPARACIÓN
    // ============================================================

    function setupComparison() {

        const grid =
            document.querySelector(
                ".comparison-grid"
            );


        if (!grid) {
            return;
        }


        const articles =
            grid.querySelectorAll(
                "article"
            );


        articles.forEach(
            (article) => {

                const image =
                    article.querySelector(
                        ".comparison-image"
                    );


                const eyebrow =
                    article.querySelector(
                        ".eyebrow"
                    );


                const title =
                    article.querySelector(
                        "h3"
                    );


                const list =
                    article.querySelector(
                        "ul"
                    );


                if (
                    !image ||
                    !title
                ) {
                    return;
                }


                /*
                 * Evitar duplicar overlay si el JS se ejecuta
                 * nuevamente.
                 */

                if (
                    image.querySelector(
                        ".comparison-overlay"
                    )
                ) {
                    return;
                }


                const overlay =
                    document.createElement(
                        "div"
                    );


                overlay.className =
                    "comparison-overlay";


                if (eyebrow) {

                    overlay.appendChild(
                        eyebrow.cloneNode(
                            true
                        )
                    );

                }


                overlay.appendChild(
                    title.cloneNode(
                        true
                    )
                );


                if (list) {

                    overlay.appendChild(
                        list.cloneNode(
                            true
                        )
                    );

                }


                image.appendChild(
                    overlay
                );

            }
        );

    }


    // ============================================================
    // IMÁGENES
    // ============================================================

    function setupImages() {

        const images =
            document.querySelectorAll(
                "img"
            );


        images.forEach(
            (image) => {

                /*
                 * El Hero se mantiene intacto.
                 */

                if (
                    image.closest(
                        ".hero"
                    )
                ) {
                    return;
                }


                image.decoding =
                    "async";


                if (
                    !image.loading
                ) {

                    image.loading =
                        "lazy";

                }


                /*
                 * Todas las imágenes fuera del Hero
                 * conservan su relación de aspecto.
                 */

                image.style.objectFit =
                    "contain";


                image.style.objectPosition =
                    "center";

            }
        );

    }


    // ============================================================
    // AÑO DEL FOOTER
    // ============================================================

    function setupFooterYear() {

        const year =
            document.querySelector(
                "#year"
            );


        if (year) {

            year.textContent =
                new Date()
                    .getFullYear();

        }

    }

})();