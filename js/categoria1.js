"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, scope = document) =>
        scope?.querySelector?.(selector) || null;

    const $$ = (selector, scope = document) =>
        scope?.querySelectorAll
            ? [...scope.querySelectorAll(selector)]
            : [];

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const header = $(".site-header");
    const mobileToggle = $("#mobileToggle");
    const mobileNav = $("#mobileNav");

    const desktopCatalogToggle = $("#desktopCatalogToggle");
    const desktopCatalogMenu = $("#desktopCatalogMenu");
    const desktopCollectionLinks = $("#desktopCollectionLinks");

    const mobileCatalogToggle = $("#mobileCatalogToggle");
    const mobileCatalogSubmenu = $("#mobileCatalogSubmenu");
    const mobileCollectionLinks = $("#mobileCollectionLinks");

    const collections = $$(".collection");

    /* =========================================================
       UTILIDADES
       ========================================================= */

    const getHeaderHeight = () =>
        header
            ? Math.ceil(
                  header.getBoundingClientRect().height
              )
            : 0;

    const updateHeaderHeight = () => {
        document.documentElement.style.setProperty(
            "--site-header-height",
            `${getHeaderHeight()}px`
        );
    };

    /* =========================================================
       MENÚ DESKTOP
       ========================================================= */

    const closeDesktopCatalog = () => {
        if (
            !desktopCatalogToggle ||
            !desktopCatalogMenu
        ) {
            return;
        }

        desktopCatalogToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        desktopCatalogMenu.classList.remove(
            "is-open"
        );
    };

    const openDesktopCatalog = () => {
        if (
            !desktopCatalogToggle ||
            !desktopCatalogMenu
        ) {
            return;
        }

        desktopCatalogToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        desktopCatalogMenu.classList.add(
            "is-open"
        );
    };

    const toggleDesktopCatalog = () => {
        const isOpen =
            desktopCatalogToggle?.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            closeDesktopCatalog();
        } else {
            openDesktopCatalog();
        }
    };

    /* =========================================================
       SUBMENÚ MOBILE
       ========================================================= */

    const closeMobileCatalog = () => {
        if (
            !mobileCatalogToggle ||
            !mobileCatalogSubmenu
        ) {
            return;
        }

        mobileCatalogToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        mobileCatalogToggle.classList.remove(
            "is-open"
        );

        mobileCatalogSubmenu.classList.remove(
            "is-open"
        );

        mobileCatalogSubmenu.hidden = true;
    };

    const openMobileCatalog = () => {
        if (
            !mobileCatalogToggle ||
            !mobileCatalogSubmenu
        ) {
            return;
        }

        mobileCatalogToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        mobileCatalogToggle.classList.add(
            "is-open"
        );

        mobileCatalogSubmenu.classList.add(
            "is-open"
        );

        mobileCatalogSubmenu.hidden = false;
    };

    const toggleMobileCatalog = () => {
        const isOpen =
            mobileCatalogToggle?.getAttribute(
                "aria-expanded"
            ) === "true";

        if (isOpen) {
            closeMobileCatalog();
        } else {
            openMobileCatalog();
        }
    };

    /* =========================================================
       MENÚ MOBILE PRINCIPAL
       ========================================================= */

    const closeMobileMenu = () => {
        if (
            !mobileToggle ||
            !mobileNav
        ) {
            return;
        }

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

        closeMobileCatalog();

        document.body.classList.remove(
            "menu-abierto"
        );
    };

    const openMobileMenu = () => {
        if (
            !mobileToggle ||
            !mobileNav
        ) {
            return;
        }

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

    const closeAllMenus = () => {
        closeDesktopCatalog();
        closeMobileMenu();
    };

    /* =========================================================
       HEADER / NAVEGACIÓN
       ========================================================= */

    updateHeaderHeight();

    if (
        header &&
        "ResizeObserver" in window
    ) {
        const headerObserver =
            new ResizeObserver(
                updateHeaderHeight
            );

        headerObserver.observe(header);
    } else {
        window.addEventListener(
            "resize",
            updateHeaderHeight,
            {
                passive: true
            }
        );
    }

    if (desktopCatalogToggle) {
        desktopCatalogToggle.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                toggleDesktopCatalog();
            }
        );
    }

    if (
        mobileToggle &&
        mobileNav
    ) {
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
    }

    if (mobileCatalogToggle) {
        mobileCatalogToggle.addEventListener(
            "click",
            (event) => {
                event.preventDefault();

                toggleMobileCatalog();
            }
        );
    }

    document.addEventListener(
        "click",
        (event) => {

            if (
                desktopCatalogMenu &&
                desktopCatalogToggle &&
                !event.target.closest(
                    ".nav-dropdown"
                )
            ) {
                closeDesktopCatalog();
            }

            if (
                mobileNav &&
                mobileToggle &&
                !event.target.closest(
                    "#mobileNav"
                ) &&
                !event.target.closest(
                    "#mobileToggle"
                )
            ) {
                closeMobileMenu();
            }
        }
    );

    document.addEventListener(
        "keydown",
        (event) => {
            if (
                event.key !== "Escape"
            ) {
                return;
            }

            closeAllMenus();
        }
    );

    /* =========================================================
       HERO
       ========================================================= */

    const heroSlides =
        $$(".hero__slide");

    const heroDots =
        $("#heroDots");

    if (heroSlides.length) {

        let heroIndex =
            Math.max(
                0,
                heroSlides.findIndex(
                    (slide) =>
                        slide.classList.contains(
                            "is-active"
                        )
                )
            );

        if (heroIndex < 0) {
            heroIndex = 0;
        }

        const setHeroSlide =
            (index) => {

                heroIndex =
                    (
                        index +
                        heroSlides.length
                    ) %
                    heroSlides.length;

                heroSlides.forEach(
                    (
                        slide,
                        i
                    ) => {

                        slide.classList.toggle(
                            "is-active",
                            i === heroIndex
                        );

                    }
                );

                $$(".hero-dot", heroDots)
                    .forEach(
                        (
                            dot,
                            i
                        ) => {

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

            };

        if (heroDots) {

            heroDots.innerHTML =
                "";

            heroSlides.forEach(
                (
                    _,
                    index
                ) => {

                    const dot =
                        document.createElement(
                            "button"
                        );

                    dot.type =
                        "button";

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
                        () => {
                            setHeroSlide(
                                index
                            );
                        }
                    );

                    heroDots.appendChild(
                        dot
                    );

                }
            );

            $(
                ".hero-dot",
                heroDots
            )?.classList.add(
                "is-active"
            );

        }

        if (
            !prefersReducedMotion &&
            heroSlides.length > 1
        ) {

            window.setInterval(
                () => {

                    if (
                        !document.hidden
                    ) {

                        setHeroSlide(
                            heroIndex + 1
                        );

                    }

                },
                6500
            );

        }

    }

    /* =========================================================
       COLECCIONES
       ========================================================= */

    const validCollections =
        collections.filter(
            (section) =>
                section.id &&
                $(
                    ".collection__header h2",
                    section
                )
        );

    const getCollectionName =
        (section) =>
            $(
                ".collection__header h2",
                section
            )
                ?.textContent
                ?.trim() ||
            section.id;

    /* =========================================================
       SCROLL A COLECCIÓN
       ========================================================= */

    const scrollToCollection =
        (section) => {

            if (!section) {
                return;
            }

            closeDesktopCatalog();
            closeMobileCatalog();

            const top =
                section.getBoundingClientRect()
                    .top +
                window.scrollY -
                getHeaderHeight() -
                16;

            window.scrollTo({

                top:
                    Math.max(
                        0,
                        top
                    ),

                behavior:
                    prefersReducedMotion
                        ? "auto"
                        : "smooth"

            });

        };

    /* =========================================================
       CREAR LINK DE COLECCIÓN
       ========================================================= */

    const makeCollectionLink =
        (
            section,
            className,
            closeMobile = false
        ) => {

            const link =
                document.createElement(
                    "a"
                );

            const name =
                getCollectionName(
                    section
                );

            link.href =
                `#${section.id}`;

            link.dataset.target =
                section.id;

            link.className =
                className;

            link.textContent =
                name;

            link.setAttribute(
                "aria-label",
                `Ir a ${name}`
            );

            link.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    scrollToCollection(
                        section
                    );

                    if (
                        closeMobile
                    ) {
                        closeMobileMenu();
                    }

                }
            );

            return link;
        };

    /* =========================================================
       GENERAR SUBMENÚ DE COLECCIONES
       ========================================================= */

    const buildCollectionNavigation =
        () => {

            if (
                !desktopCollectionLinks &&
                !mobileCollectionLinks
            ) {
                return;
            }

            validCollections.forEach(
                (section) => {

                    if (
                        desktopCollectionLinks
                    ) {

                        desktopCollectionLinks.appendChild(
                            makeCollectionLink(
                                section,
                                "nav-dropdown__collection-link"
                            )
                        );

                    }

                    if (
                        mobileCollectionLinks
                    ) {

                        mobileCollectionLinks.appendChild(
                            makeCollectionLink(
                                section,
                                "mobile-nav__collection-link",
                                true
                            )
                        );

                    }

                }
            );

        };

    buildCollectionNavigation();

    /* =========================================================
       COLECCIÓN ACTIVA
       ========================================================= */

    const setActiveCollection =
        (id) => {

            $$(".nav-dropdown__collection-link")
                .forEach(
                    (link) => {

                        const active =
                            link.dataset.target ===
                            id;

                        link.classList.toggle(
                            "is-active",
                            active
                        );

                        if (active) {

                            link.setAttribute(
                                "aria-current",
                                "true"
                            );

                        } else {

                            link.removeAttribute(
                                "aria-current"
                            );

                        }

                    }
                );

            $$(".mobile-nav__collection-link")
                .forEach(
                    (link) => {

                        const active =
                            link.dataset.target ===
                            id;

                        link.classList.toggle(
                            "is-active",
                            active
                        );

                        if (active) {

                            link.setAttribute(
                                "aria-current",
                                "true"
                            );

                        } else {

                            link.removeAttribute(
                                "aria-current"
                            );

                        }

                    }
                );

        };

    /* =========================================================
       INTERSECTION OBSERVER
       ========================================================= */

    if (
        validCollections.length &&
        "IntersectionObserver" in window
    ) {

        const collectionObserver =
            new IntersectionObserver(

                (entries) => {

                    const visible =
                        entries
                            .filter(
                                (entry) =>
                                    entry.isIntersecting
                            )
                            .sort(
                                (
                                    a,
                                    b
                                ) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            )[0];

                    if (visible) {

                        /*
                         * IMPORTANTE:
                         *
                         * Aquí SOLO se actualiza
                         * el estado visual.
                         *
                         * NO se ejecuta
                         * scrollIntoView().
                         *
                         * Esto evita que el observer
                         * interfiera con el scroll.
                         */

                        setActiveCollection(
                            visible.target.id
                        );

                    }

                },

                {
                    root: null,

                    rootMargin:
                        `-${getHeaderHeight() + 20}px 0px -55% 0px`,

                    threshold:
                        [
                            0.05,
                            0.15,
                            0.30,
                            0.50
                        ]

                }

            );

        validCollections.forEach(
            (section) => {

                collectionObserver.observe(
                    section
                );

            }
        );

    }

    if (
        validCollections[0]
    ) {

        setActiveCollection(
            validCollections[0].id
        );

    }

    /* =========================================================
       GALERÍAS
       ========================================================= */

    validCollections.forEach(
        (collection) => {

            setupCollectionSlider(
                collection
            );

        }
    );

    /* =========================================================
       CREAR GALERÍA DE COLECCIÓN
       ========================================================= */

    function setupCollectionSlider(
        collection
    ) {

        const gallery =
            $(".product-grid", collection);

        if (
            !gallery ||
            gallery.dataset.sliderReady ===
                "true"
        ) {
            return;
        }

        const cards =
            $$(".product-card", gallery);

        if (!cards.length) {
            return;
        }

        gallery.dataset.sliderReady =
            "true";

        /*
         * IMPORTANTE:
         *
         * Los productos que antes estaban
         * ocultos por "Ver más" ahora forman
         * parte del carrusel.
         */

        cards.forEach(
            (card) => {

                card.classList.remove(
                    "is-hidden-product"
                );

                card.removeAttribute(
                    "hidden"
                );

            }
        );

        /*
         * Primera imagen =
         * protagonista.
         */

        const feature =
            cards[0];

        const sliderCards =
            cards.slice(1);

        feature.classList.add(
            "collection-feature"
        );

        const layout =
            document.createElement(
                "div"
            );

        layout.className =
            "collection-showcase";

        /* =====================================================
           ÁREA DEL CARRUSEL
           ===================================================== */

        const carouselArea =
            document.createElement(
                "div"
            );

        carouselArea.className =
            "collection-showcase__carousel";

        /* =====================================================
           PROTAGONISTA
           ===================================================== */

        const featureWrapper =
            document.createElement(
                "div"
            );

        featureWrapper.className =
            "collection-showcase__feature";

        featureWrapper.appendChild(
            feature
        );

        /* =====================================================
           FILAS
           ===================================================== */

        const rowOne =
            createSliderRow(
                sliderCards,
                0,
                "Fila superior"
            );

        const rowTwo =
            createSliderRow(
                sliderCards,
                1,
                "Fila inferior"
            );

        carouselArea.append(
            rowOne,
            rowTwo
        );

        /*
         * IZQUIERDA:
         * carruseles
         *
         * DERECHA:
         * protagonista
         */

        layout.append(
            carouselArea,
            featureWrapper
        );

        /*
         * Sustituir únicamente
         * el grid de productos.
         */

        gallery.replaceWith(
            layout
        );

        setupRowControls(
            rowOne
        );

        setupRowControls(
            rowTwo
        );

        /*
         * El viejo botón Ver Más
         * ya no tiene utilidad.
         */

        const oldMore =
            $(".collection__more", collection);

        if (oldMore) {
            oldMore.remove();
        }

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

        /* =====================================================
           ANTERIOR
           ===================================================== */

        const prev =
            document.createElement(
                "button"
            );

        prev.type =
            "button";

        prev.className =
            "collection-slider-arrow collection-slider-arrow--prev";

        prev.setAttribute(
            "aria-label",
            `${label}: diseños anteriores`
        );

        prev.innerHTML =
            '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';

        /* =====================================================
           VIEWPORT
           ===================================================== */

        const viewport =
            document.createElement(
                "div"
            );

        viewport.className =
            "collection-slider-viewport";

        viewport.tabIndex =
            0;

        viewport.setAttribute(
            "role",
            "region"
        );

        viewport.setAttribute(
            "aria-label",
            label
        );

        /* =====================================================
           TRACK
           ===================================================== */

        const track =
            document.createElement(
                "div"
            );

        track.className =
            "collection-slider-track";

        /*
         * Distribución:
         *
         * fila superior:
         * 1, 3, 5, 7...
         *
         * fila inferior:
         * 2, 4, 6, 8...
         */

        cards.forEach(
            (
                card,
                index
            ) => {

                if (
                    index % 2 ===
                    rowIndex
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

        /* =====================================================
           SIGUIENTE
           ===================================================== */

        const next =
            document.createElement(
                "button"
            );

        next.type =
            "button";

        next.className =
            "collection-slider-arrow collection-slider-arrow--next";

        next.setAttribute(
            "aria-label",
            `${label}: siguientes diseños`
        );

        next.innerHTML =
            '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';

        row.append(
            prev,
            viewport,
            next
        );

        return row;
    }

    /* =========================================================
       CONTROLES DE CARRUSEL
       ========================================================= */

    function setupRowControls(
        row
    ) {

        if (!row) {
            return;
        }

        const viewport =
            $(
                ".collection-slider-viewport",
                row
            );

        const track =
            $(
                ".collection-slider-track",
                row
            );

        const prev =
            $(
                ".collection-slider-arrow--prev",
                row
            );

        const next =
            $(
                ".collection-slider-arrow--next",
                row
            );

        if (
            !viewport ||
            !track ||
            !prev ||
            !next
        ) {
            return;
        }

        /* =====================================================
           ESTADO DE BOTONES
           ===================================================== */

        const updateButtons =
            () => {

                const maxScroll =
                    Math.max(
                        0,
                        viewport.scrollWidth -
                            viewport.clientWidth
                    );

                const current =
                    viewport.scrollLeft;

                const tolerance =
                    3;

                const canPrev =
                    current >
                    tolerance;

                const canNext =
                    current <
                    maxScroll -
                        tolerance;

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

                viewport.classList.toggle(
                    "has-overflow",
                    maxScroll >
                        tolerance
                );

            };

        /* =====================================================
           CANTIDAD DE DESPLAZAMIENTO
           ===================================================== */

        const getScrollAmount =
            () => {

                const firstCard =
                    $(
                        ".product-card",
                        track
                    );

                if (!firstCard) {

                    return viewport.clientWidth;

                }

                const cardWidth =
                    firstCard.getBoundingClientRect()
                        .width;

                const styles =
                    getComputedStyle(
                        track
                    );

                const gap =
                    parseFloat(
                        styles.columnGap ||
                        styles.gap
                    ) || 8;

                /*
                 * Cinco productos.
                 */

                return (
                    cardWidth +
                    gap
                ) * 5;

            };

        /* =====================================================
           MOVIMIENTO
           ===================================================== */

        const move =
            (direction) => {

                viewport.scrollBy({

                    left:
                        getScrollAmount() *
                        direction,

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"

                });

            };

        /* =====================================================
           BOTÓN ANTERIOR
           ===================================================== */

        prev.addEventListener(
            "click",
            () => {
                move(-1);
            }
        );

        /* =====================================================
           BOTÓN SIGUIENTE
           ===================================================== */

        next.addEventListener(
            "click",
            () => {
                move(1);
            }
        );

        /* =====================================================
           SCROLL HORIZONTAL NATIVO
           ===================================================== */

        viewport.addEventListener(
            "scroll",
            updateButtons,
            {
                passive: true
            }
        );

        /*
         * NO EXISTE:
         *
         * wheel
         * preventDefault()
         *
         * Por lo tanto la rueda del mouse
         * continúa controlando el scroll
         * vertical de la página.
         */

        /* =====================================================
           TECLADO
           ===================================================== */

        viewport.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    event.preventDefault();

                    move(1);

                }

                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    event.preventDefault();

                    move(-1);

                }

            }
        );

        /* =====================================================
           RESIZE
           ===================================================== */

        if (
            "ResizeObserver" in
            window
        ) {

            const resizeObserver =
                new ResizeObserver(
                    updateButtons
                );

            resizeObserver.observe(
                viewport
            );

        } else {

            window.addEventListener(
                "resize",
                updateButtons,
                {
                    passive: true
                }
            );

        }

        requestAnimationFrame(
            updateButtons
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

    /* =========================================================
       ABRIR MODAL
       ========================================================= */

    const safeOpenDialog =
        (dialog) => {

            if (!dialog) {
                return;
            }

            if (
                typeof dialog.showModal ===
                    "function" &&
                !dialog.open
            ) {

                dialog.showModal();

            } else {

                dialog.setAttribute(
                    "open",
                    ""
                );

            }

        };

    /* =========================================================
       CERRAR MODAL
       ========================================================= */

    const safeCloseDialog =
        (dialog) => {

            if (!dialog) {
                return;
            }

            if (
                typeof dialog.close ===
                    "function" &&
                dialog.open
            ) {

                dialog.close();

            } else {

                dialog.removeAttribute(
                    "open"
                );

            }

        };

    /* =========================================================
       OBTENER DATOS DEL PRODUCTO
       ========================================================= */

    const getCardData =
        (card) => {

            if (!card) {
                return null;
            }

            const image =
                $(
                    ".product-card__image",
                    card
                );

            const title =
                $("h3", card);

            const meta =
                $$(".product-card__meta span", card);

            if (!image) {
                return null;
            }

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
                    title
                        ?.textContent
                        ?.trim() ||
                    "Cuadro",

                measure:
                    meta[0]
                        ?.textContent
                        ?.trim() ||
                    "30 × 40 cm",

                price:
                    meta[1]
                        ?.textContent
                        ?.trim() ||
                    "$20.000 CLP",

                collection

            };

        };

    /* =========================================================
       ACTUALIZAR MODAL
       ========================================================= */

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
                     * Mantener enlace original.
                     */

                }

            }

        };

    /* =========================================================
       CLICK EN PRODUCTO
       ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            const button =
                event.target.closest(
                    ".product-card__button"
                );

            if (!button) {
                return;
            }

            const card =
                button.closest(
                    ".product-card"
                );

            const data =
                getCardData(
                    card
                );

            if (
                !data ||
                !data.src ||
                !productModal
            ) {
                return;
            }

            event.preventDefault();

            updateProductModal(
                data
            );

            safeOpenDialog(
                productModal
            );

        }
    );

    /* =========================================================
       CERRAR MODAL
       ========================================================= */

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            () => {

                safeCloseDialog(
                    productModal
                );

            }
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
       ELIMINAR RESTOS DEL VISUALIZADOR ANTIGUO
       ========================================================= */

    $("#wallButton")?.remove();

    $("#wallModal")?.remove();

    $$(".catalog-intro__copy p")
        .forEach(
            (paragraph) => {

                if (
                    /visualizador en pared/i.test(
                        paragraph.textContent ||
                            ""
                    )
                ) {

                    paragraph.textContent =
                        "Explora las colecciones de Anime y Gaming. Cada tarjeta es una muestra real de diseño: haz clic para ampliar, revisar medidas y consultar el diseño directamente.";

                }

            }
        );

    /* =========================================================
       IMAGEN DE FRANJA DE ALUMINIO
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
       ESC GLOBAL
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

            closeAllMenus();

        }
    );

    /* =========================================================
       ESTADO FINAL
       ========================================================= */

    updateHeaderHeight();

    console.log(
        "SublimArts — catálogo optimizado: scroll natural, carruseles y navegación corregidos."
    );

});