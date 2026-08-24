"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       SELECTORES
       ========================================================= */

    const $ = (selector, scope = document) =>
        scope.querySelector(selector);

    const $$ = (selector, scope = document) =>
        [...scope.querySelectorAll(selector)];


    /* =========================================================
       CONFIGURACIÓN
       ========================================================= */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =========================================================
       FUNCIONES GENERALES
       ========================================================= */

    const safeOpenDialog = (dialog) => {

        if (!dialog) return;

        if (typeof dialog.showModal === "function") {

            if (!dialog.open) {
                dialog.showModal();
            }

        } else {

            dialog.setAttribute("open", "");

        }

        document.body.classList.add("modal-open");
    };


    const safeCloseDialog = (dialog) => {

        if (!dialog) return;

        if (
            typeof dialog.close === "function" &&
            dialog.open
        ) {

            dialog.close();

        } else {

            dialog.removeAttribute("open");

        }

        if (!$(".product-modal[open]")) {
            document.body.classList.remove("modal-open");
        }
    };


    /* =========================================================
       MENÚ MÓVIL
       ========================================================= */

    const mobileToggle = $("#mobileToggle");
    const mobileNav = $("#mobileNav");


    const closeMobileMenu = () => {

        if (!mobileToggle || !mobileNav) return;

        mobileToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileToggle.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        mobileNav.classList.remove(
            "is-open",
            "activo"
        );

        document.body.classList.remove(
            "menu-abierto"
        );
    };


    const openMobileMenu = () => {

        if (!mobileToggle || !mobileNav) return;

        mobileToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileToggle.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

        mobileNav.classList.add(
            "is-open",
            "activo"
        );

        document.body.classList.add(
            "menu-abierto"
        );
    };


    if (mobileToggle && mobileNav) {

        mobileToggle.addEventListener(
            "click",
            () => {

                const isOpen =
                    mobileToggle.getAttribute(
                        "aria-expanded"
                    ) === "true";

                if (isOpen) {

                    closeMobileMenu();

                } else {

                    openMobileMenu();

                }

            }
        );


        $$("#mobileNav a").forEach((link) => {

            link.addEventListener(
                "click",
                closeMobileMenu
            );

        });


        document.addEventListener(
            "keydown",
            (event) => {

                if (event.key === "Escape") {
                    closeMobileMenu();
                }

            }
        );

    }


    /* =========================================================
       HERO
       ========================================================= */

    const heroSlides = $$(".hero__slide");
    const heroDots = $("#heroDots");


    if (heroSlides.length) {

        let heroIndex = Math.max(
            0,
            heroSlides.findIndex(
                slide =>
                    slide.classList.contains(
                        "is-active"
                    )
            )
        );


        const setHeroSlide = (index) => {

            heroIndex =
                (index + heroSlides.length) %
                heroSlides.length;


            heroSlides.forEach(
                (slide, i) => {

                    slide.classList.toggle(
                        "is-active",
                        i === heroIndex
                    );

                }
            );


            if (heroDots) {

                $$(".hero-dot", heroDots)
                    .forEach(
                        (dot, i) => {

                            dot.classList.toggle(
                                "is-active",
                                i === heroIndex
                            );

                            dot.setAttribute(
                                "aria-current",
                                i === heroIndex
                                    ? "true"
                                    : "false"
                            );

                        }
                    );

            }

        };


        if (heroDots) {

            heroDots.innerHTML = "";


            heroSlides.forEach(
                (_, index) => {

                    const dot =
                        document.createElement(
                            "button"
                        );

                    dot.type = "button";

                    dot.className =
                        "hero-dot";

                    dot.setAttribute(
                        "aria-label",
                        `Mostrar portada ${index + 1}`
                    );

                    dot.setAttribute(
                        "aria-current",
                        index === heroIndex
                            ? "true"
                            : "false"
                    );


                    dot.addEventListener(
                        "click",
                        () =>
                            setHeroSlide(index)
                    );


                    heroDots.appendChild(dot);

                }
            );


            $$(".hero-dot", heroDots)
                [heroIndex]
                ?.classList.add(
                    "is-active"
                );

        }


        if (
            !prefersReducedMotion &&
            heroSlides.length > 1
        ) {

            window.setInterval(
                () =>
                    setHeroSlide(
                        heroIndex + 1
                    ),
                6500
            );

        }

    }


    /* =========================================================
       CREAR NAVEGACIÓN DE COLECCIONES
       ========================================================= */

    const collections =
        $$(".collection");


    if (collections.length) {

        createCollectionNavigation(
            collections
        );

    }


    function createCollectionNavigation(
        sections
    ) {

        const header =
            $(".site-header");

        if (!header) return;


        /*
         * No duplicar navegación si el JS
         * se ejecuta nuevamente.
         */

        const existing =
            $("#catalogCollectionNav");

        if (existing) {
            existing.remove();
        }


        const navigation =
            document.createElement("nav");

        navigation.id =
            "catalogCollectionNav";

        navigation.className =
            "catalog-collection-nav";

        navigation.setAttribute(
            "aria-label",
            "Colecciones del catálogo"
        );


        const inner =
            document.createElement("div");

        inner.className =
            "catalog-collection-nav__inner";


        sections.forEach(
            (section, index) => {

                const title =
                    section.querySelector(
                        ".collection__header h2"
                    );


                if (!title) return;


                const id =
                    section.id;


                if (!id) return;


                const link =
                    document.createElement(
                        "a"
                    );


                link.href =
                    `#${id}`;


                link.dataset.target =
                    id;


                link.textContent =
                    title.textContent.trim();


                link.setAttribute(
                    "aria-label",
                    `Ir a ${title.textContent.trim()}`
                );


                if (index === 0) {

                    link.classList.add(
                        "is-active"
                    );

                }


                link.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();


                        const target =
                            document.getElementById(
                                id
                            );


                        if (!target) return;


                        const headerHeight =
                            header.offsetHeight;


                        const navHeight =
                            navigation.offsetHeight;


                        const top =
                            target.getBoundingClientRect()
                                .top +
                            window.scrollY -
                            headerHeight -
                            navHeight -
                            12;


                        window.scrollTo({

                            top,

                            behavior:
                                prefersReducedMotion
                                    ? "auto"
                                    : "smooth"

                        });


                        setActiveCollection(
                            id
                        );

                    }
                );


                inner.appendChild(
                    link
                );

            }
        );


        navigation.appendChild(
            inner
        );


        header.insertAdjacentElement(
            "afterend",
            navigation
        );


        /* -----------------------------------------
           Detectar sección visible
           ----------------------------------------- */

        const observer =
            new IntersectionObserver(
                (entries) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                setActiveCollection(
                                    entry.target.id
                                );

                            }

                        }
                    );

                },
                {
                    rootMargin:
                        "-30% 0px -55% 0px",

                    threshold: 0
                }
            );


        sections.forEach(
            section =>
                observer.observe(
                    section
                )
        );


        function setActiveCollection(
            id
        ) {

            $(
                ".catalog-collection-nav__inner"
            );

            $$(".catalog-collection-nav a")
                .forEach(
                    link => {

                        const active =
                            link.dataset.target === id;


                        link.classList.toggle(
                            "is-active",
                            active
                        );

                    }
                );


            const activeLink =
                $(
                    `.catalog-collection-nav a[data-target="${id}"]`
                );


            if (activeLink) {

                activeLink.scrollIntoView({
                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth",

                    block: "nearest",

                    inline: "center"
                });

            }

        }

    }


    /* =========================================================
       CONVERTIR CADA GALERÍA EN:

       FILA 1 → 5 CUADROS
       FILA 2 → 5 CUADROS
       DERECHA → IMAGEN PROTAGONISTA
       ========================================================= */

    collections.forEach(
        (collection) => {

            setupCollectionSlider(
                collection
            );

        }
    );


    function setupCollectionSlider(
        collection
    ) {

        const gallery =
            $(".product-grid", collection);


        if (!gallery) return;


        /*
         * Evitar inicializar dos veces.
         */

        if (
            gallery.dataset.sliderReady ===
            "true"
        ) {

            return;

        }


        gallery.dataset.sliderReady =
            "true";


        const cards =
            $$(".product-card", gallery);


        if (!cards.length) return;


        /*
         * La primera tarjeta siempre será
         * la imagen protagonista.
         *
         * Esto coincide con la estructura
         * actual del HTML.
         */

        const feature =
            cards[0];


        feature.classList.add(
            "collection-feature"
        );


        /*
         * Las demás tarjetas son las que
         * entrarán al carrusel.
         */

        const sliderCards =
            cards.slice(1);


        /*
         * Crear estructura nueva.
         */

        const layout =
            document.createElement(
                "div"
            );

        layout.className =
            "collection-showcase";


        /* =========================================
           PROTAGONISTA
           ========================================= */

        const featureWrapper =
            document.createElement(
                "div"
            );

        featureWrapper.className =
            "collection-showcase__feature";


        featureWrapper.appendChild(
            feature
        );


        /* =========================================
           ÁREA DEL CARRUSEL
           ========================================= */

        const carouselArea =
            document.createElement(
                "div"
            );

        carouselArea.className =
            "collection-showcase__carousel";


        /* =========================================
           FILA 1
           ========================================= */

        const rowOne =
            createSliderRow(
                sliderCards,
                0,
                "Fila superior"
            );


        /* =========================================
           FILA 2
           ========================================= */

        const rowTwo =
            createSliderRow(
                sliderCards,
                1,
                "Fila inferior"
            );


        carouselArea.appendChild(
            rowOne
        );

        carouselArea.appendChild(
            rowTwo
        );


        layout.appendChild(
            carouselArea
        );

        layout.appendChild(
            featureWrapper
        );


        /*
         * Reemplazar el grid original.
         */

        gallery.replaceWith(
            layout
        );


        /*
         * Si hay suficientes tarjetas,
         * inicializar flechas.
         */

        setupRowControls(
            rowOne
        );

        setupRowControls(
            rowTwo
        );

    }


    /* =========================================================
       CREAR FILA
       ========================================================= */

    function createSliderRow(
        cards,
        rowIndex,
        label
    ) {

        const row =
            document.createElement(
                "div"
            );

        row.className =
            "collection-slider-row";


        row.dataset.row =
            String(rowIndex);


        /* =========================================
           BOTÓN ANTERIOR
           ========================================= */

        const prev =
            document.createElement(
                "button"
            );


        prev.type = "button";

        prev.className =
            "collection-slider-arrow collection-slider-arrow--prev";


        prev.setAttribute(
            "aria-label",
            `${label}: diseños anteriores`
        );


        prev.innerHTML =
            `<i class="fa-solid fa-chevron-left"></i>`;


        /* =========================================
           VIEWPORT
           ========================================= */

        const viewport =
            document.createElement(
                "div"
            );


        viewport.className =
            "collection-slider-viewport";


        viewport.setAttribute(
            "tabindex",
            "0"
        );


        /* =========================================
           TRACK
           ========================================= */

        const track =
            document.createElement(
                "div"
            );


        track.className =
            "collection-slider-track";


        /*
         * Distribuir tarjetas:
         *
         * row 0:
         * 1, 3, 5, 7...
         *
         * row 1:
         * 2, 4, 6, 8...
         *
         * Esto permite mantener 2 filas.
         */

        cards.forEach(
            (card, index) => {

                const belongsToRow =
                    index % 2 === rowIndex;


                if (
                    belongsToRow
                ) {

                    track.appendChild(
                        card
                    );

                }

            }
        );


        viewport.appendChild(
            track
        );


        /* =========================================
           BOTÓN SIGUIENTE
           ========================================= */

        const next =
            document.createElement(
                "button"
            );


        next.type = "button";

        next.className =
            "collection-slider-arrow collection-slider-arrow--next";


        next.setAttribute(
            "aria-label",
            `${label}: siguientes diseños`
        );


        next.innerHTML =
            `<i class="fa-solid fa-chevron-right"></i>`;


        row.appendChild(
            prev
        );

        row.appendChild(
            viewport
        );

        row.appendChild(
            next
        );


        return row;

    }


    /* =========================================================
       CONTROLES DE CADA FILA
       ========================================================= */

    function setupRowControls(
        row
    ) {

        if (!row) return;


        const viewport =
            $(".collection-slider-viewport", row);


        const track =
            $(".collection-slider-track", row);


        const prev =
            $(".collection-slider-arrow--prev", row);


        const next =
            $(".collection-slider-arrow--next", row);


        if (
            !viewport ||
            !track ||
            !prev ||
            !next
        ) {

            return;

        }


        const updateButtons =
            () => {

                const maxScroll =
                    viewport.scrollWidth -
                    viewport.clientWidth;


                const current =
                    viewport.scrollLeft;


                const canPrev =
                    current > 5;


                const canNext =
                    current <
                    maxScroll - 5;


                prev.disabled =
                    !canPrev;


                next.disabled =
                    !canNext;


                prev.classList.toggle(
                    "is-disabled",
                    !canPrev
                );


                next.classList.toggle(
                    "is-disabled",
                    !canNext
                );

            };


        const getScrollAmount =
            () => {

                /*
                 * Desplazamiento equivalente
                 * a aproximadamente 5 tarjetas.
                 */

                const cards =
                    $$(".product-card", track);


                if (!cards.length) {
                    return viewport.clientWidth;
                }


                const first =
                    cards[0];


                const cardWidth =
                    first.getBoundingClientRect()
                        .width;


                const gap =
                    parseFloat(
                        getComputedStyle(
                            track
                        ).columnGap
                    ) || 8;


                return (
                    (cardWidth + gap) * 5
                );

            };


        prev.addEventListener(
            "click",
            () => {

                viewport.scrollBy({

                    left:
                        -getScrollAmount(),

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"

                });

            }
        );


        next.addEventListener(
            "click",
            () => {

                viewport.scrollBy({

                    left:
                        getScrollAmount(),

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"

                });

            }
        );


        viewport.addEventListener(
            "scroll",
            updateButtons,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateButtons
        );


        /*
         * Soporte para rueda del mouse
         * sobre el carrusel.
         */

        viewport.addEventListener(
            "wheel",
            (event) => {

                if (
                    Math.abs(
                        event.deltaY
                    ) <=
                    Math.abs(
                        event.deltaX
                    )
                ) {

                    return;

                }


                const maxScroll =
                    viewport.scrollWidth -
                    viewport.clientWidth;


                const canScroll =
                    maxScroll > 0;


                if (!canScroll) {
                    return;
                }


                event.preventDefault();


                viewport.scrollLeft +=
                    event.deltaY;

            },
            {
                passive: false
            }
        );


        /*
         * Soporte teclado.
         */

        viewport.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    event.preventDefault();

                    viewport.scrollBy({

                        left:
                            getScrollAmount(),

                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"

                    });

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    event.preventDefault();

                    viewport.scrollBy({

                        left:
                            -getScrollAmount(),

                        behavior:
                            prefersReducedMotion
                                ? "auto"
                                : "smooth"

                    });

                }

            }
        );


        /*
         * Esperar a que el navegador
         * calcule correctamente los tamaños.
         */

        requestAnimationFrame(
            () => {

                updateButtons();

            }
        );

    }


    /* =========================================================
       MODAL DE PRODUCTO
       ========================================================= */

    const productModal =
        $("#productModal");

    const modalClose =
        $("#modalClose");

    const modalImage =
        $("#modalImage");

    const modalCollection =
        $("#modalCollection");

    const modalTitle =
        $("#modalTitle");

    const modalMeasure =
        $("#modalMeasure");

    const modalPrice =
        $("#modalPrice");

    const modalWhatsapp =
        $("#modalWhatsapp");

    const modalDetails =
        $("#modalDetails");


    const getCardData =
        (card) => {

            if (!card) return null;


            const image =
                $(".product-card__image", card);


            const title =
                $("h3", card);


            const meta =
                $$(".product-card__meta span", card);


            if (!image) return null;


            const collection =
                card
                    .closest(
                        ".collection"
                    )
                    ?.querySelector(
                        ".collection__header h2"
                    )
                    ?.textContent
                    ?.trim()
                    ||
                    "SublimArts";


            return {

                src:
                    image.currentSrc ||
                    image.src ||
                    "",

                alt:
                    image.alt ||
                    "Cuadro en aluminio HD",

                title:
                    title?.textContent?.trim()
                    ||
                    "Cuadro",

                measure:
                    meta[0]
                        ?.textContent
                        ?.trim()
                    ||
                    "30 × 40 cm",

                price:
                    meta[1]
                        ?.textContent
                        ?.trim()
                    ||
                    "$20.000 CLP",

                collection

            };

        };


    const updateProductModal =
        (data) => {

            if (
                !data ||
                !productModal
            ) {

                return;

            }


            if (modalImage) {

                modalImage.src =
                    data.src;

                modalImage.alt =
                    data.alt;

            }


            if (modalCollection) {

                modalCollection.textContent =
                    data.collection;

            }


            if (modalTitle) {

                modalTitle.textContent =
                    data.title;

            }


            if (modalMeasure) {

                modalMeasure.textContent =
                    data.measure;

            }


            if (modalPrice) {

                modalPrice.textContent =
                    data.price;

            }


            if (modalWhatsapp) {

                const message =
                    encodeURIComponent(

                        `Hola SublimArts, quiero consultar por el diseño "${data.title}" (${data.measure}, ${data.price}).`

                    );


                modalWhatsapp.href =
                    `https://wa.me/56912345678?text=${message}`;

            }


            if (modalDetails) {

                try {

                    const url =
                        new URL(
                            modalDetails.getAttribute(
                                "href"
                            ) ||
                            "visualizacion.html",

                            window.location.href
                        );


                    url.searchParams.set(
                        "producto",
                        data.title
                    );


                    url.searchParams.set(
                        "coleccion",
                        data.collection
                    );


                    modalDetails.href =
                        url.toString();


                } catch {

                    /*
                     * Conservar URL original.
                     */

                }

            }

        };


    const openProduct =
        (card) => {

            const data =
                getCardData(card);


            if (
                !data ||
                !data.src ||
                !productModal
            ) {

                return;

            }


            updateProductModal(
                data
            );


            safeOpenDialog(
                productModal
            );

        };


    /* =========================================================
       EVENTO CLICK EN CUALQUIER CUADRO
       ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".product-card__button"
                );


            if (!button) return;


            const card =
                button.closest(
                    ".product-card"
                );


            if (!card) return;


            event.preventDefault();


            openProduct(
                card
            );

        }
    );


    /* =========================================================
       CERRAR MODAL
       ========================================================= */

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            () =>
                safeCloseDialog(
                    productModal
                )
        );

    }


    if (productModal) {

        productModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    productModal
                ) {

                    safeCloseDialog(
                        productModal
                    );

                }

            }
        );


        productModal.addEventListener(
            "close",
            () => {

                document.body.classList.remove(
                    "modal-open"
                );

            }
        );

    }


    /* =========================================================
       DESACTIVAR VISUALIZADOR ANTIGUO
       ========================================================= */

    const wallButton =
        $("#wallButton");

    const wallModal =
        $("#wallModal");


    if (wallButton) {
        wallButton.remove();
    }


    if (wallModal) {
        wallModal.remove();
    }


    /* =========================================================
       CAMBIAR TEXTO QUE TODAVÍA MENCIONA
       EL VISUALIZADOR ANTIGUO
       ========================================================= */

    $$(".catalog-intro__copy p")
        .forEach(
            paragraph => {

                const text =
                    paragraph.textContent ||
                    "";


                if (
                    /visualizador en pared/i
                        .test(text)
                ) {

                    paragraph.textContent =
                        "Explora las colecciones de Anime y Gaming. Cada tarjeta es una muestra real de diseño: haz clic para ampliar, revisar medidas y consultar el diseño directamente.";

                }

            }
        );


    /* =========================================================
       CORREGIR IMAGEN DE LA FRANJA DE ALUMINIO
       ========================================================= */

    const aluminumImage =
        $(".aluminum-strip__image img");


    if (
        aluminumImage &&
        !aluminumImage.getAttribute(
            "src"
        )
    ) {

        const firstImage =
            $(".product-card__image");


        if (firstImage?.src) {

            aluminumImage.src =
                firstImage.currentSrc ||
                firstImage.src;

        }

    }


    /* =========================================================
       ESC — CERRAR MODAL / MENÚ
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key !==
                "Escape"
            ) {

                return;

            }


            if (
                productModal?.open
            ) {

                safeCloseDialog(
                    productModal
                );

            }


            closeMobileMenu();

        }
    );


    /* =========================================================
       OBSERVADOR DEL MODAL
       ========================================================= */

    const modalObserver =
        new MutationObserver(
            () => {

                const modalOpen =
                    Boolean(
                        $(
                            ".product-modal[open]"
                        )
                    );


                document.body.classList.toggle(
                    "modal-open",
                    modalOpen
                );

            }
        );


    modalObserver.observe(
        document.body,
        {
            subtree: true,
            attributes: true,
            attributeFilter: [
                "open"
            ]
        }
    );


    /* =========================================================
       SCROLL SUAVE GENERAL
       ========================================================= */

    if (!prefersReducedMotion) {

        document.documentElement.style
            .scrollBehavior =
            "smooth";

    }


    /* =========================================================
       FINAL
       ========================================================= */

    console.log(
        "SublimArts — catálogo horizontal inicializado."
    );

});