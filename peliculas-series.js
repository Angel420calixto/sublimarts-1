document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    /* =========================================================
       HEADER / MENÚ
       ========================================================= */

    const menuButton = $("#botonMenuMobile");
    const menu = $("#menuPrincipal");
    const overlay = $("#menuOverlay");
    const dropdown = $(".menu-con-desplegable");
    const dropdownButton = $(".enlace-menu-desplegable");

    const closeMenu = () => {
        if (!menu || !menuButton) return;

        menu.classList.remove("activo");
        menuButton.setAttribute("aria-expanded", "false");
        document.body.classList.remove("menu-abierto");
        overlay?.classList.remove("activo");
    };

    menuButton?.addEventListener("click", () => {
        const open = menuButton.getAttribute("aria-expanded") === "true";

        menuButton.setAttribute("aria-expanded", String(!open));
        menu?.classList.toggle("activo", !open);
        overlay?.classList.toggle("activo", !open);
        document.body.classList.toggle("menu-abierto", !open);
    });

    overlay?.addEventListener("click", closeMenu);

    $$(".enlace-menu", menu).forEach(link => {
        link.addEventListener("click", closeMenu);
    });

    dropdownButton?.addEventListener("click", () => {
        if (window.innerWidth > 768) return;

        const active = dropdown.classList.toggle("activo");

        dropdownButton.setAttribute(
            "aria-expanded",
            String(active)
        );
    });


    /* =========================================================
       HERO
       ========================================================= */

    const heroSlides = $$(".hero-slide");
    const heroDots = $$(".hero-indicador");

    let heroIndex = 0;
    let heroTimer = null;

    const showHero = index => {
        if (!heroSlides.length) return;

        heroIndex =
            (index + heroSlides.length) %
            heroSlides.length;

        heroSlides.forEach((slide, i) => {
            slide.classList.toggle(
                "activo",
                i === heroIndex
            );
        });

        heroDots.forEach((dot, i) => {
            dot.classList.toggle(
                "activo",
                i === heroIndex
            );
        });
    };

    const startHero = () => {
        if (heroSlides.length < 2) return;

        clearInterval(heroTimer);

        heroTimer = setInterval(() => {
            showHero(heroIndex + 1);
        }, 6000);
    };

    heroDots.forEach((dot, i) => {
        dot.addEventListener("click", () => {
            showHero(i);
            startHero();
        });
    });

    showHero(0);
    startHero();


    /* =========================================================
       CARRUSEL: ¿QUÉ ES?
       ========================================================= */

    const infoSlides = $$(".info-slide");
    const infoDots = $$(".info-indicador");

    const infoPrev =
        $(".info-carrusel-flecha.anterior");

    const infoNext =
        $(".info-carrusel-flecha.siguiente");

    let infoIndex = 0;

    const showInfo = index => {
        if (!infoSlides.length) return;

        infoIndex =
            (index + infoSlides.length) %
            infoSlides.length;

        infoSlides.forEach((slide, i) => {
            slide.classList.toggle(
                "activo",
                i === infoIndex
            );
        });

        infoDots.forEach((dot, i) => {
            dot.classList.toggle(
                "activo",
                i === infoIndex
            );
        });
    };

    infoPrev?.addEventListener(
        "click",
        () => showInfo(infoIndex - 1)
    );

    infoNext?.addEventListener(
        "click",
        () => showInfo(infoIndex + 1)
    );

    infoDots.forEach((dot, i) => {
        dot.addEventListener(
            "click",
            () => showInfo(i)
        );
    });

    $("#infoCarrusel")?.addEventListener(
        "keydown",
        event => {

            if (event.key === "ArrowLeft") {
                showInfo(infoIndex - 1);
            }

            if (event.key === "ArrowRight") {
                showInfo(infoIndex + 1);
            }
        }
    );


    /* =========================================================
       CARRUSELES GENERALES
       ========================================================= */

    const initCarousel = (
        id,
        cardSelector
    ) => {

        const root =
            document.getElementById(id);

        if (!root) return;

        const viewport =
            $(".carrusel-vista", root);

        const track =
            $(".carrusel-pista", root);

        const cards =
            $$(cardSelector, root);

        const prev =
            $(".carrusel-flecha-anterior", root);

        const next =
            $(".carrusel-flecha-siguiente", root);

        if (
            !viewport ||
            !track ||
            !cards.length
        ) {
            return;
        }

        let index = 0;

        const visibleCount = () => {

            if (window.innerWidth <= 768) {
                return 1;
            }

            if (window.innerWidth <= 1100) {
                return 3;
            }

            return 4;
        };

        const update = () => {

            const count =
                visibleCount();

            const max =
                Math.max(
                    0,
                    cards.length - count
                );

            index =
                Math.min(index, max);

            const first = cards[0];

            if (!first) return;

            const step =
                first.getBoundingClientRect().width + 5;

            track.style.transform =
                `translateX(-${index * step}px)`;

            if (prev) {
                prev.disabled =
                    index <= 0;
            }

            if (next) {
                next.disabled =
                    index >= max;
            }
        };

        prev?.addEventListener(
            "click",
            () => {
                index--;
                update();
            }
        );

        next?.addEventListener(
            "click",
            () => {
                index++;
                update();
            }
        );

        window.addEventListener(
            "resize",
            update
        );

        update();
    };

    initCarousel(
        "categoriasCarrusel",
        ".categoria-card"
    );

    initCarousel(
        "destacadosCarrusel",
        ".destacado-card"
    );

    initCarousel(
        "muroCarrusel",
        ".muro-item"
    );


    /* =========================================================
       SERVICIOS FOTOGRÁFICOS + MODAL
       ========================================================= */

    const modal =
        $("#modalServicio");

    const modalImage =
        $("#modalServicioImagen");

    const modalTitle =
        $("#modalServicioTitulo");

    const modalDescription =
        $("#modalServicioDescripcion");

    const modalMore =
        $("#modalServicioVerMas");

    const modalClose =
        $("#cerrarModalServicio");

    const openService = card => {

        if (!modal) return;

        const service =
            card.dataset.servicio || "";

        const title =
            card.dataset.title || "";

        const description =
            card.dataset.description || "";

        const image =
            card.dataset.image || "";

        modalImage.src = image;
        modalImage.alt = title;

        modalTitle.textContent =
            title;

        modalDescription.textContent =
            description;

        modalMore.href =
            `servicios.html?servicio=${encodeURIComponent(service)}`;

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
    };

    $$(".servicio-fotografia-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".servicio-ver-mas"
                        )
                    ) {
                        event.preventDefault();
                    }

                    openService(card);
                }
            );

            $(
                ".servicio-ver-mas",
                card
            )?.addEventListener(
                "click",
                event => {

                    event.preventDefault();
                    event.stopPropagation();

                    openService(card);
                }
            );
        });

    const closeService = () => {

        if (!modal) return;

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
    };

    modalClose?.addEventListener(
        "click",
        closeService
    );

    modal?.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {
                closeService();
            }
        }
    );

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                modal?.open
            ) {
                closeService();
            }
        }
    );


    /* =========================================================
       REVEAL
       ========================================================= */

    const reveals =
        $$(".reveal");

    if (
        "IntersectionObserver" in
        window
    ) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target.classList.add(
                                    "visible"
                                );

                                observer.unobserve(
                                    entry.target
                                );
                            }
                        }
                    );
                },
                {
                    threshold: 0.12
                }
            );

        reveals.forEach(
            element =>
                observer.observe(element)
        );

    } else {

        reveals.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );
    }


    /* =========================================================
       FAQ
       ========================================================= */

    $$(".faq-item")
        .forEach(item => {

            item.addEventListener(
                "toggle",
                () => {

                    if (!item.open) {
                        return;
                    }

                    $$(".faq-item")
                        .forEach(other => {

                            if (
                                other !== item
                            ) {
                                other.removeAttribute(
                                    "open"
                                );
                            }
                        });
                }
            );
        });


    /* =========================================================
       REDUCED MOTION
       ========================================================= */

    if (
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches
    ) {

        clearInterval(heroTimer);

        reveals.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );
    }


    /* =========================================================
       CATÁLOGO EDITORIAL
       VER MÁS / VER MENOS
       ========================================================= */

    const PRODUCTOS_VISIBLES = 10;

    $$(".catalogo-editorial-seccion")
        .forEach(section => {

            const gallery =
                $(".catalogo-editorial-grid", section);

            const button =
                $(".catalogo-ver-mas", section);

            if (!gallery || !button) {
                return;
            }

            const products =
                $$(".producto-card", gallery);


            const updateGallery =
                expanded => {

                    products.forEach(
                        (product, index) => {

                            const hidden =
                                !expanded &&
                                index >=
                                PRODUCTOS_VISIBLES;

                            product.classList.toggle(
                                "producto-oculto",
                                hidden
                            );

                            product.setAttribute(
                                "aria-hidden",
                                String(hidden)
                            );


                            if (
                                !hidden &&
                                expanded &&
                                index >=
                                PRODUCTOS_VISIBLES
                            ) {

                                product.classList.remove(
                                    "producto-aparece"
                                );

                                requestAnimationFrame(
                                    () => {

                                        product.classList.add(
                                            "producto-aparece"
                                        );
                                    }
                                );
                            }
                        }
                    );


                    button.setAttribute(
                        "aria-expanded",
                        String(expanded)
                    );


                    const text =
                        $("span", button);

                    if (text) {

                        text.textContent =
                            expanded
                                ? "Ver menos"
                                : "Ver más";
                    }


                    const icon =
                        $("i", button);

                    icon?.classList.toggle(
                        "fa-arrow-up",
                        expanded
                    );

                    icon?.classList.toggle(
                        "fa-arrow-down",
                        !expanded
                    );
                };


            if (
                products.length <=
                PRODUCTOS_VISIBLES
            ) {

                button.hidden = true;

                products.forEach(
                    product =>
                        product.setAttribute(
                            "aria-hidden",
                            "false"
                        )
                );

            } else {

                updateGallery(false);


                button.addEventListener(
                    "click",
                    () => {

                        const expanded =
                            button.getAttribute(
                                "aria-expanded"
                            ) === "true";

                        updateGallery(
                            !expanded
                        );


                        if (expanded) {

                            section.scrollIntoView({
                                behavior:
                                    window.matchMedia(
                                        "(prefers-reduced-motion: reduce)"
                                    ).matches
                                        ? "auto"
                                        : "smooth",

                                block: "start"
                            });
                        }
                    }
                );
            }
        });


    /* =========================================================
       MODAL DE PRODUCTO
       ========================================================= */

    const productModal =
        $("#modalProducto");

    const productModalImage =
        $("#modalProductoImagen");

    const productModalCategory =
        $("#modalProductoCategoria");

    const productModalTitle =
        $("#modalProductoTitulo");

    const productModalMeasure =
        $("#modalProductoMedida");

    const productModalPrice =
        $("#modalProductoPrecio");

    const productModalDetails =
        $("#modalProductoDetalles");

    const productModalWhatsapp =
        $("#modalProductoWhatsapp");

    const productModalClose =
        $("#cerrarModalProducto");

    let lastProductTrigger = null;


    /* =========================================================
       OBTENER INFORMACIÓN DEL PRODUCTO
       ========================================================= */

    const getProductData =
        card => {

            const image =
                $(".imagen-producto", card);

            return {

                title:
                    $(".titulo-producto", card)
                        ?.textContent
                        .trim()
                    ||
                    image?.alt
                    ||
                    "Cuadro Anime o Gamer",

                measure:
                    $(".dimension-producto", card)
                        ?.textContent
                        .trim()
                    ||
                    "30 × 40 cm",

                price:
                    $(".precio-producto", card)
                        ?.textContent
                        .trim()
                    ||
                    "$20.000 CLP",

                category:
                    card
                        .closest(
                            ".catalogo-editorial-seccion"
                        )
                        ?.querySelector(
                            ".catalogo-seccion-header h2"
                        )
                        ?.textContent
                        .trim()
                    ||
                    "Anime & Gamer",

                image:
                    image?.currentSrc
                    ||
                    image?.src
                    ||
                    ""
            };
        };


    /* =========================================================
       ABRIR MODAL DE PRODUCTO
       ========================================================= */

    const openProductModal =
        trigger => {

            if (!productModal) {
                return;
            }

            const card =
                trigger.closest(
                    ".producto-card"
                );

            if (!card) {
                return;
            }

            const data =
                getProductData(card);

            lastProductTrigger =
                trigger;


            if (productModalImage) {

                productModalImage.src =
                    data.image;

                productModalImage.alt =
                    data.title;
            }


            if (productModalCategory) {

                productModalCategory.textContent =
                    `${data.category} · SUBLIMARTS`;
            }


            if (productModalTitle) {

                productModalTitle.textContent =
                    data.title;
            }


            if (productModalMeasure) {

                productModalMeasure.textContent =
                    data.measure.replace(
                        /^Medida:\s*/i,
                        ""
                    );
            }


            if (productModalPrice) {

                productModalPrice.textContent =
                    data.price.replace(
                        /^Precio:\s*/i,
                        ""
                    );
            }


            /* =================================================
               ENLACE A VISUALIZACIÓN
               ================================================= */

            if (productModalDetails) {

                const params =
                    new URLSearchParams({

                        nombre:
                            data.title,

                        medida:
                            data.measure,

                        precio:
                            data.price,

                        imagen:
                            data.image
                    });


                productModalDetails.href =
                    `visualizacion.html?${params.toString()}`;
            }


            /* =================================================
               WHATSAPP
               ================================================= */

            if (productModalWhatsapp) {

                const message =
                    `Hola SublimArts, me interesa el cuadro "${data.title}", ${data.measure}, ${data.price}. ¿Está disponible?`;

                productModalWhatsapp.href =
                    `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
            }


            /* =================================================
               MOSTRAR MODAL
               ================================================= */

            if (
                typeof productModal.showModal ===
                "function"
            ) {

                productModal.showModal();

            } else {

                productModal.setAttribute(
                    "open",
                    ""
                );
            }


            productModalClose?.focus();
        };


    /* =========================================================
       CERRAR MODAL DE PRODUCTO
       ========================================================= */

    const closeProductModal =
        () => {

            if (!productModal) {
                return;
            }


            if (
                typeof productModal.close ===
                    "function" &&
                productModal.open
            ) {

                productModal.close();

            } else {

                productModal.removeAttribute(
                    "open"
                );
            }


            lastProductTrigger?.focus();
        };


    /* =========================================================
       CLICK EN PRODUCTOS
       ========================================================= */

    $$(".producto-interactivo")
        .forEach(trigger => {

            trigger.addEventListener(
                "click",
                () => {

                    openProductModal(
                        trigger
                    );
                }
            );
        });


    /* =========================================================
       BOTÓN CERRAR MODAL
       ========================================================= */

    productModalClose?.addEventListener(
        "click",
        closeProductModal
    );


    /* =========================================================
       CERRAR HACIENDO CLICK FUERA
       ========================================================= */

    productModal?.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                productModal
            ) {

                closeProductModal();
            }
        }
    );


    /* =========================================================
       ESC PARA CERRAR MODAL
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                productModal?.open
            ) {

                closeProductModal();
            }
        }
    );

});