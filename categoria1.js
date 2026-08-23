/**
 * SUBLIMARTS — categoria1.js
 * Galería, menú, hero, "ver más" y modal de producto.
 *
 * Principios:
 * - Las imágenes se controlan desde HTML mediante <img src="">.
 * - No se crean URLs de imágenes desde JavaScript.
 * - El visualizador antiguo "Ver en pared" queda desactivado.
 * - Si una sección no existe, el JS no rompe el resto de la página.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       SELECTORES
       ========================================================= */

    const $ = (selector, scope = document) => {
        return scope.querySelector(selector);
    };

    const $$ = (selector, scope = document) => {
        return [...scope.querySelectorAll(selector)];
    };


    /* =========================================================
       CONFIGURACIÓN
       ========================================================= */

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =========================================================
       FUNCIONES PARA DIALOG / MODALES
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

        if (!$(".product-modal[open], .wall-modal[open]")) {

            document.body.classList.remove("modal-open");

        }

    };


    /* =========================================================
       OBTENER INFORMACIÓN DE UNA TARJETA
       ========================================================= */

    const getCardData = (card) => {

        if (!card) return null;

        const image = $(".product-card__image", card);
        const title = $("h3", card);

        const meta = $$(".product-card__meta span", card);

        if (!image) return null;


        const collection = card
            .closest(".collection")
            ?.querySelector(".collection__header h2")
            ?.textContent
            ?.trim() || "SublimArts";


        return {

            src:
                image.currentSrc ||
                image.src ||
                "",

            alt:
                image.alt ||
                "Cuadro en aluminio HD",

            title:
                title?.textContent?.trim() ||
                "Cuadro",

            measure:
                meta[0]?.textContent?.trim() ||
                "30 × 40 cm",

            price:
                meta[1]?.textContent?.trim() ||
                "$20.000 CLP",

            collection

        };

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
       HERO / SLIDER
       ========================================================= */

    const heroSlides = $$(".hero__slide");
    const heroDots = $("#heroDots");


    if (heroSlides.length) {

        let heroIndex = Math.max(

            0,

            heroSlides.findIndex(
                (slide) =>
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


        /* Crear indicadores */

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


        /* Rotación automática */

        if (
            !prefersReducedMotion &&
            heroSlides.length > 1
        ) {

            window.setInterval(
                () => {

                    setHeroSlide(
                        heroIndex + 1
                    );

                },
                6500
            );

        }

    }


    /* =========================================================
       GALERÍAS — VER MÁS DISEÑOS
       ========================================================= */

    $$(".collection").forEach(
        (collection) => {

            const gallery =
                $(".product-grid", collection);

            const moreButton =
                $(".more-button", collection);


            if (!gallery || !moreButton) {
                return;
            }


            const hiddenProducts =
                $$(".is-hidden-product", gallery);


            /* Si no hay productos ocultos */

            if (!hiddenProducts.length) {

                moreButton.hidden = true;

                return;

            }


            const label =
                $("span", moreButton);

            const icon =
                $("i", moreButton);


            moreButton.addEventListener(
                "click",
                () => {

                    const expanded =
                        moreButton.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    const nextState =
                        !expanded;


                    hiddenProducts.forEach(
                        (card) => {

                            card.classList.toggle(
                                "is-hidden-product",
                                !nextState
                            );

                        }
                    );


                    moreButton.setAttribute(
                        "aria-expanded",
                        String(nextState)
                    );


                    if (label) {

                        label.textContent =
                            nextState
                                ? "Mostrar menos"
                                : "Ver más diseños";

                    }


                    if (icon) {

                        icon.classList.toggle(
                            "fa-arrow-down",
                            !nextState
                        );

                        icon.classList.toggle(
                            "fa-arrow-up",
                            nextState
                        );

                    }

                }
            );

        }
    );


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


    let activeProduct = null;


    /* =========================================================
       ACTUALIZAR INFORMACIÓN DEL MODAL
       ========================================================= */

    const updateProductModal = (data) => {

        if (!data || !productModal) {
            return;
        }


        activeProduct = data;


        /* Imagen */

        if (modalImage) {

            modalImage.src =
                data.src;

            modalImage.alt =
                data.alt;

        }


        /* Colección */

        if (modalCollection) {

            modalCollection.textContent =
                data.collection;

        }


        /* Título */

        if (modalTitle) {

            modalTitle.textContent =
                data.title;

        }


        /* Medidas */

        if (modalMeasure) {

            modalMeasure.textContent =
                data.measure;

        }


        /* Precio */

        if (modalPrice) {

            modalPrice.textContent =
                data.price;

        }


        /* WhatsApp */

        if (modalWhatsapp) {

            const message =
                encodeURIComponent(

                    `Hola SublimArts, quiero consultar por el diseño "${data.title}" (${data.measure}, ${data.price}).`

                );


            modalWhatsapp.href =
                `https://wa.me/56912345678?text=${message}`;

        }


        /* Detalles */

        if (modalDetails) {

            const baseUrl =
                modalDetails.getAttribute(
                    "href"
                ) ||
                "visualizacion.html";


            try {

                const url =
                    new URL(
                        baseUrl,
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
                 * Si la URL no es válida,
                 * se conserva la original.
                 */

            }

        }

    };


    /* =========================================================
       ABRIR PRODUCTO
       ========================================================= */

    const openProduct = (card) => {

        const data =
            getCardData(card);


        if (
            !data ||
            !data.src ||
            !productModal
        ) {

            return;

        }


        updateProductModal(data);

        safeOpenDialog(
            productModal
        );

    };


    /* =========================================================
       EVENTOS DE LAS TARJETAS
       ========================================================= */

    $$(".product-card").forEach(
        (card) => {

            const button =
                $(".product-card__button", card);


            if (!button) {
                return;
            }


            button.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    openProduct(card);

                }
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


    /* Cerrar haciendo click fuera */

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

                document.body
                    .classList
                    .remove(
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

    const wallClose =
        $("#wallClose");


    /*
     * Se elimina el botón antiguo.
     */

    if (wallButton) {

        wallButton.remove();

    }


    /*
     * Se elimina el modal antiguo.
     */

    if (wallModal) {

        wallModal.remove();

    }


    /*
     * Se elimina el botón de cierre
     * si todavía existe fuera del modal.
     */

    if (wallClose) {

        wallClose.remove();

    }


    /* =========================================================
       ACTUALIZAR TEXTO DEL CATÁLOGO
       ========================================================= */

    $$(".catalog-intro__copy p")
        .forEach(
            (paragraph) => {

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
       FRANJA DE ALUMINIO
       ========================================================= */

    const aluminumImage =
        $(".aluminum-strip__image img");


    /*
     * En el HTML actual esta imagen tiene src="".
     *
     * Mientras no coloques la imagen definitiva,
     * usamos temporalmente la primera imagen del
     * catálogo para evitar que la sección quede vacía.
     */

    if (
        aluminumImage &&
        !aluminumImage.getAttribute("src")
    ) {

        const firstCatalogImage =
            $(".product-card__image");


        if (
            firstCatalogImage?.src
        ) {

            aluminumImage.src =
                firstCatalogImage.currentSrc ||
                firstCatalogImage.src;

        }

    }


    /* =========================================================
       ESC PARA CERRAR MODAL
       ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            if (
                productModal?.open
            ) {

                safeCloseDialog(
                    productModal
                );

            }

        }
    );


    /* =========================================================
       CONTROL DE SCROLL DEL BODY
       ========================================================= */

    const observer =
        new MutationObserver(
            () => {

                const modalOpen =
                    Boolean(
                        $(
                            ".product-modal[open], .wall-modal[open]"
                        )
                    );


                document.body.classList.toggle(
                    "modal-open",
                    modalOpen
                );

            }
        );


    observer.observe(
        document.body,
        {
            subtree: true,
            attributes: true,
            attributeFilter: ["open"]
        }
    );


    /* =========================================================
       PREVENIR SCROLL DEL BODY CON MODAL
       ========================================================= */

    const modalStyle =
        document.createElement("style");


    modalStyle.textContent = `
        body.modal-open {
            overflow: hidden;
        }
    `;


    document.head.appendChild(
        modalStyle
    );


    /* =========================================================
       FIN
       ========================================================= */

    console.log(
        "SublimArts: galería inicializada correctamente."
    );

});