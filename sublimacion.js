"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const $ = (selector, scope = document) =>
        scope?.querySelector?.(selector) || null;

    const $$ = (selector, scope = document) =>
        scope?.querySelectorAll
            ? [...scope.querySelectorAll(selector)]
            : [];

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /* =========================================================
       HELPERS
       ========================================================= */

    const lockBody = () => {
        document.body.classList.add("menu-abierto");
    };

    const unlockBody = () => {
        document.body.classList.remove("menu-abierto");
    };

    const smoothScrollTo = (target) => {
        if (!target) return;

        const header = $(".header-principal");

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            headerHeight -
            12;

        window.scrollTo({
            top: Math.max(0, top),
            behavior: reduceMotion
                ? "auto"
                : "smooth"
        });
    };

    /* =========================================================
       NAVEGACIÓN DESKTOP + MOBILE
       ========================================================= */

    const menuButton =
        $("#botonMenuMobile");

    const menu =
        $("#menuPrincipal");

    const overlay =
        $("#menuOverlay");

    const categoryButton =
        $(".enlace-menu-desplegable");

    const categoryMenu =
        $("#submenuCategorias");

    /* =========================================================
       SUBMENÚ CATEGORÍAS
       ========================================================= */

    const closeCategoryMenu = () => {

        if (
            !categoryButton ||
            !categoryMenu
        ) {
            return;
        }

        categoryButton.setAttribute(
            "aria-expanded",
            "false"
        );

        categoryMenu.classList.remove(
            "abierto"
        );

        categoryMenu.hidden = true;
    };

    const openCategoryMenu = () => {

        if (
            !categoryButton ||
            !categoryMenu
        ) {
            return;
        }

        categoryButton.setAttribute(
            "aria-expanded",
            "true"
        );

        categoryMenu.classList.add(
            "abierto"
        );

        categoryMenu.hidden = false;
    };

    const toggleCategoryMenu = (
        event
    ) => {

        event?.preventDefault();
        event?.stopPropagation();

        const open =
            categoryButton?.getAttribute(
                "aria-expanded"
            ) === "true";

        if (open) {
            closeCategoryMenu();
        } else {
            openCategoryMenu();
        }
    };

    /* =========================================================
       MENÚ MOBILE
       ========================================================= */

    const closeMobileMenu = () => {

        if (
            !menuButton ||
            !menu
        ) {
            return;
        }

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
        );

        menu.classList.remove(
            "activo"
        );

        overlay?.classList.remove(
            "activo"
        );

        unlockBody();
    };

    const openMobileMenu = () => {

        if (
            !menuButton ||
            !menu
        ) {
            return;
        }

        menuButton.setAttribute(
            "aria-expanded",
            "true"
        );

        menuButton.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

        menu.classList.add(
            "activo"
        );

        overlay?.classList.add(
            "activo"
        );

        lockBody();
    };

    menuButton?.addEventListener(
        "click",
        () => {

            const open =
                menuButton.getAttribute(
                    "aria-expanded"
                ) === "true";

            if (open) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }

        }
    );

    overlay?.addEventListener(
        "click",
        closeMobileMenu
    );

    categoryButton?.addEventListener(
        "click",
        toggleCategoryMenu
    );

    /* =========================================================
       ENLACES DEL SUBMENÚ
       ========================================================= */

    $$(".submenu a").forEach(
        (link) => {

            link.addEventListener(
                "click",
                () => {

                    closeCategoryMenu();
                    closeMobileMenu();

                }
            );

        }
    );

    /* =========================================================
       ENLACES INTERNOS
       ========================================================= */

    $$(".enlace-menu[href^='#']").forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const id =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !id ||
                        id === "#"
                    ) {
                        return;
                    }

                    const target =
                        $(id);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    closeCategoryMenu();
                    closeMobileMenu();

                    smoothScrollTo(
                        target
                    );

                    history.replaceState(
                        null,
                        "",
                        id
                    );
                }
            );

        }
    );

    /* =========================================================
       CERRAR CATEGORÍAS AL HACER CLICK FUERA
       ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            if (
                categoryMenu &&
                categoryButton &&
                !event.target.closest(
                    ".menu-con-desplegable"
                )
            ) {
                closeCategoryMenu();
            }

        }
    );

    /* =========================================================
       ESC
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape"
            ) {

                closeCategoryMenu();
                closeMobileMenu();

            }

        }
    );

    /* =========================================================
       CAMBIO DESKTOP / MOBILE
       ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900
            ) {
                closeMobileMenu();
            }

        },
        {
            passive: true
        }
    );

    /* =========================================================
       HERO / PORTADA
       ========================================================= */

    const heroSlides =
        $$(".hero-slide");

    const heroIndicators =
        $$(".hero-indicador");

    let heroIndex =
        heroSlides.findIndex(
            (slide) =>
                slide.classList.contains(
                    "activo"
                )
        );

    if (
        heroIndex < 0
    ) {
        heroIndex = 0;
    }

    const showHeroSlide =
        (index) => {

            if (
                !heroSlides.length
            ) {
                return;
            }

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
                        "activo",
                        i === heroIndex
                    );

                }
            );

            heroIndicators.forEach(
                (
                    indicator,
                    i
                ) => {

                    indicator.classList.toggle(
                        "activo",
                        i === heroIndex
                    );

                    indicator.setAttribute(
                        "aria-current",
                        i === heroIndex
                            ? "true"
                            : "false"
                    );

                }
            );

        };

    heroIndicators.forEach(
        (
            indicator,
            index
        ) => {

            indicator.addEventListener(
                "click",
                () => {

                    showHeroSlide(
                        index
                    );

                }
            );

        }
    );

    let heroTimer =
        null;

    const startHero = () => {

        if (
            reduceMotion ||
            heroSlides.length < 2
        ) {
            return;
        }

        clearInterval(
            heroTimer
        );

        heroTimer =
            setInterval(
                () => {

                    if (
                        !document.hidden
                    ) {

                        showHeroSlide(
                            heroIndex + 1
                        );

                    }

                },
                6000
            );
    };

    startHero();

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                clearInterval(
                    heroTimer
                );

            } else {

                startHero();

            }

        }
    );

    /* =========================================================
       CARRUSEL "QUÉ ES"
       ========================================================= */

    const infoCarousel =
        $("#infoCarrusel");

    const infoSlides =
        $$(".info-slide", infoCarousel);

    const infoDots =
        $$(".info-indicador", infoCarousel);

    const infoPrev =
        $(
            ".info-carrusel-flecha.anterior",
            infoCarousel
        );

    const infoNext =
        $(
            ".info-carrusel-flecha.siguiente",
            infoCarousel
        );

    let infoIndex =
        infoSlides.findIndex(
            (slide) =>
                slide.classList.contains(
                    "activo"
                )
        );

    if (
        infoIndex < 0
    ) {
        infoIndex = 0;
    }

    const showInfoSlide =
        (index) => {

            if (
                !infoSlides.length
            ) {
                return;
            }

            infoIndex =
                (
                    index +
                    infoSlides.length
                ) %
                infoSlides.length;

            infoSlides.forEach(
                (
                    slide,
                    i
                ) => {

                    slide.classList.toggle(
                        "activo",
                        i === infoIndex
                    );

                }
            );

            infoDots.forEach(
                (
                    dot,
                    i
                ) => {

                    dot.classList.toggle(
                        "activo",
                        i === infoIndex
                    );

                    dot.setAttribute(
                        "aria-current",
                        i === infoIndex
                            ? "true"
                            : "false"
                    );

                }
            );

        };

    infoPrev?.addEventListener(
        "click",
        () => {

            showInfoSlide(
                infoIndex - 1
            );

        }
    );

    infoNext?.addEventListener(
        "click",
        () => {

            showInfoSlide(
                infoIndex + 1
            );

        }
    );

    infoDots.forEach(
        (
            dot,
            index
        ) => {

            dot.addEventListener(
                "click",
                () => {

                    showInfoSlide(
                        index
                    );

                }
            );

        }
    );

    infoCarousel?.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key ===
                "ArrowLeft"
            ) {

                event.preventDefault();

                showInfoSlide(
                    infoIndex - 1
                );

            }

            if (
                event.key ===
                "ArrowRight"
            ) {

                event.preventDefault();

                showInfoSlide(
                    infoIndex + 1
                );

            }

        }
    );

    /* =========================================================
       MODAL DE SERVICIOS
       ========================================================= */

    const serviceModal =
        $("#modalServicio");

    const serviceModalClose =
        $("#cerrarModalServicio");

    const serviceModalImage =
        $("#modalServicioImagen");

    const serviceModalTitle =
        $("#modalServicioTitulo");

    const serviceModalDescription =
        $("#modalServicioDescripcion");

    const serviceModalLink =
        $("#modalServicioVerMas");

    const serviceCards =
        $$(".servicio-fotografia-card");

    const serviceLinks = {

        "impresion-fotografica":
            "contacto.html",

        "fotografia-licenciaturas":
            "contacto.html",

        "cuadro-premium-aluminio":
            "contacto.html",

        "album-fotografico":
            "contacto.html",

        "aluminio-formatos":
            "contacto.html"

    };

    const openDialog =
        (dialog) => {

            if (!dialog) {
                return;
            }

            if (
                typeof dialog.showModal ===
                "function"
            ) {

                if (
                    !dialog.open
                ) {

                    dialog.showModal();

                }

            } else {

                dialog.setAttribute(
                    "open",
                    ""
                );

            }

        };

    const closeDialog =
        (dialog) => {

            if (!dialog) {
                return;
            }

            if (
                typeof dialog.close ===
                "function"
            ) {

                if (
                    dialog.open
                ) {

                    dialog.close();

                }

            } else {

                dialog.removeAttribute(
                    "open"
                );

            }

        };

    const openServiceModal =
        (card) => {

            if (
                !card ||
                !serviceModal
            ) {
                return;
            }

            const title =
                card.dataset.title ||
                $(
                    "h3",
                    card
                )
                    ?.textContent
                    ?.trim() ||
                "Servicio SublimArts";

            const description =
                card.dataset.description ||
                $(
                    "p",
                    card
                )
                    ?.textContent
                    ?.trim() ||
                "";

            const image =
                card.dataset.image ||
                $(
                    "img",
                    card
                )
                    ?.currentSrc ||
                $(
                    "img",
                    card
                )
                    ?.src ||
                "";

            const serviceId =
                card.dataset.servicio ||
                "";

            if (
                serviceModalTitle
            ) {

                serviceModalTitle.textContent =
                    title;

            }

            if (
                serviceModalDescription
            ) {

                serviceModalDescription.textContent =
                    description;

            }

            if (
                serviceModalImage
            ) {

                serviceModalImage.src =
                    image;

                serviceModalImage.alt =
                    title;

            }

            if (
                serviceModalLink
            ) {

                serviceModalLink.href =
                    serviceLinks[
                        serviceId
                    ] ||
                    "contacto.html";

                const separator =
                    serviceModalLink.href.includes(
                        "?"
                    )
                        ? "&"
                        : "?";

                serviceModalLink.href +=
                    `${separator}servicio=${encodeURIComponent(
                        serviceId ||
                        title
                    )}`;

            }

            openDialog(
                serviceModal
            );

        };

    serviceCards.forEach(
        (card) => {

            const button =
                $(
                    ".servicio-ver-mas",
                    card
                );

            button?.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();
                    event.stopPropagation();

                    openServiceModal(
                        card
                    );

                }
            );

        }
    );

    serviceModalClose?.addEventListener(
        "click",
        () => {

            closeDialog(
                serviceModal
            );

        }
    );

    serviceModal?.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                serviceModal
            ) {

                closeDialog(
                    serviceModal
                );

            }

        }
    );

    /* =========================================================
       CARRUSEL DE AMBIENTES
       ========================================================= */

    setupHorizontalCarousel(
        $("#muroCarrusel"),
        "#muroPista",
        ".muro-item"
    );

    /* =========================================================
       CARRUSEL DESTACADOS
       ========================================================= */

    setupHorizontalCarousel(
        $("#destacadosCarrusel"),
        "#destacadosPista",
        ".destacado-card"
    );

    function setupHorizontalCarousel(
        container,
        trackSelector,
        itemSelector
    ) {

        if (!container) {
            return;
        }

        const track =
            $(trackSelector, container);

        if (!track) {
            return;
        }

        const prev =
            $(
                ".carrusel-flecha-anterior",
                container
            );

        const next =
            $(
                ".carrusel-flecha-siguiente",
                container
            );

        const items =
            $$(itemSelector, track);

        if (!items.length) {
            return;
        }

        let current = 0;

        const getVisible =
            () => {

                const width =
                    container.clientWidth;

                if (
                    width <= 650
                ) {
                    return 1;
                }

                if (
                    width <= 1000
                ) {
                    return 2;
                }

                return 3;

            };

        const getMaxIndex =
            () =>
                Math.max(
                    0,
                    items.length -
                    getVisible()
                );

        const update =
            (
                behavior = "smooth"
            ) => {

                current =
                    Math.min(
                        current,
                        getMaxIndex()
                    );

                const item =
                    items[current];

                if (!item) {
                    return;
                }

                track.scrollTo({

                    left:
                        item.offsetLeft,

                    behavior:
                        reduceMotion
                            ? "auto"
                            : behavior

                });

                updateCarouselButtons();

            };

        const updateCarouselButtons =
            () => {

                const max =
                    Math.max(
                        0,
                        track.scrollWidth -
                        track.clientWidth
                    );

                const left =
                    track.scrollLeft;

                if (prev) {

                    prev.disabled =
                        left <= 3;

                    prev.classList.toggle(
                        "disabled",
                        prev.disabled
                    );

                }

                if (next) {

                    next.disabled =
                        left >= max - 3;

                    next.classList.toggle(
                        "disabled",
                        next.disabled
                    );

                }

            };

        prev?.addEventListener(
            "click",
            () => {

                current =
                    Math.max(
                        0,
                        current - 1
                    );

                update();

            }
        );

        next?.addEventListener(
            "click",
            () => {

                current =
                    Math.min(
                        getMaxIndex(),
                        current + 1
                    );

                update();

            }
        );

        track.addEventListener(
            "scroll",
            updateCarouselButtons,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            () => update("auto"),
            {
                passive: true
            }
        );

        /*
         * NO se captura wheel.
         *
         * Esto es deliberado:
         * la rueda sigue controlando
         * el desplazamiento vertical.
         */

        update("auto");
    }

    /* =========================================================
       REVEAL
       ========================================================= */

    const revealElements =
        $$(".reveal");

    if (
        revealElements.length &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (
                    entries,
                    observer
                ) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }

                            entry.target.classList.add(
                                "visible",
                                "activo"
                            );

                            observer.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );

        revealElements.forEach(
            (element) => {

                revealObserver.observe(
                    element
                );

            }
        );

    } else {

        revealElements.forEach(
            (element) => {

                element.classList.add(
                    "visible",
                    "activo"
                );

            }
        );

    }

    /* =========================================================
       FAQ
       ========================================================= */

    const faqItems =
        $$(".faq-item");

    faqItems.forEach(
        (item) => {

            item.addEventListener(
                "toggle",
                () => {

                    if (
                        !item.open
                    ) {
                        return;
                    }

                    faqItems.forEach(
                        (other) => {

                            if (
                                other !== item &&
                                other.open
                            ) {

                                other.open =
                                    false;

                            }

                        }
                    );

                }
            );

        }
    );

    /* =========================================================
       ENLACES DEL FOOTER
       ========================================================= */

    $$(
        '.lista-enlaces a[href^="#"]'
    ).forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const href =
                        link.getAttribute(
                            "href"
                        );

                    if (
                        !href ||
                        href === "#"
                    ) {
                        return;
                    }

                    const target =
                        $(href);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    smoothScrollTo(
                        target
                    );

                }
            );

        }
    );

    /* =========================================================
       ENLACES "#" VACÍOS
       ========================================================= */

    $$(
        'a[href="#"]'
    ).forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                }
            );

        }
    );

    /* =========================================================
       IMÁGENES ROTAS
       ========================================================= */

    $$("img").forEach(
        (image) => {

            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "imagen-error"
                    );

                },
                {
                    once: true
                }
            );

        }
    );

    /* =========================================================
       ESTADO INICIAL
       ========================================================= */

    showHeroSlide(
        heroIndex
    );

    showInfoSlide(
        infoIndex
    );

    console.log(
        "SublimArts: JavaScript cargado correctamente."
    );
});


/* =========================================================
   SUBLIMARTS — INTERACCIÓN FINAL DE PERSONALIZA
   La sección usa el mismo lenguaje de carrusel que Destacados.
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const pista = document.querySelector(".personaliza-pista");

    if (!pista) return;

    const cards = [...pista.querySelectorAll(".personaliza-card")];

    if (!cards.length) return;

    pista.setAttribute("tabindex", "0");
    pista.setAttribute(
        "aria-label",
        "Opciones para personalizar tu cuadro"
    );

    pista.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return;
        }

        event.preventDefault();

        const direction = event.key === "ArrowRight" ? 1 : -1;
        const currentLeft = pista.scrollLeft;
        const nearest = cards.reduce((best, card) => {
            const distance = Math.abs(card.offsetLeft - currentLeft);
            const bestDistance = Math.abs(best.offsetLeft - currentLeft);
            return distance < bestDistance ? card : best;
        }, cards[0]);

        const index = cards.indexOf(nearest);
        const nextIndex = Math.max(
            0,
            Math.min(cards.length - 1, index + direction)
        );

        pista.scrollTo({
            left: cards[nextIndex].offsetLeft,
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches
                ? "auto"
                : "smooth"
        });
    });
});
