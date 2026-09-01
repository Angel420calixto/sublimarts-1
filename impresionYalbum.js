(() => {
    "use strict";


    /* =========================================================
       SUBLIMARTS
       IMPRESIÓN FOTOGRÁFICA + ÁLBUMES
       JAVASCRIPT PRINCIPAL
       ========================================================= */


    /* =========================================================
       REFERENCIAS DOM
       ========================================================= */

    const header = document.querySelector("header");

    const menuToggle = document.getElementById("toggle");

    const navigation = document.getElementById("nav");

    const orderForm = document.getElementById("order");

    const photoInput = orderForm?.querySelector(
        'input[name="photos"]'
    );

    const formatSelect = orderForm?.querySelector(
        'select[name="format"]'
    );

    const finishSelect = orderForm?.querySelector(
        'select[name="finish"]'
    );

    const quantityInput = orderForm?.querySelector(
        'input[name="quantity"]'
    );

    const summary = document.getElementById("summary");


    /* =========================================================
       PREFERENCIAS DE MOVIMIENTO
       ========================================================= */

    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    const scrollBehavior = reducedMotion
        ? "auto"
        : "smooth";


    /* =========================================================
       HEADER STICKY
       ========================================================= */

    const updateHeader = () => {

        if (!header) {
            return;
        }


        header.classList.toggle(
            "scrolled",
            window.scrollY > 20
        );

    };


    window.addEventListener(
        "scroll",
        updateHeader,
        {
            passive: true
        }
    );


    updateHeader();


    /* =========================================================
       MENÚ RESPONSIVE
       ========================================================= */

    const closeMenu = () => {

        if (!navigation || !menuToggle) {
            return;
        }


        navigation.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Abrir menú"
        );

    };


    const openMenu = () => {

        if (!navigation || !menuToggle) {
            return;
        }


        navigation.classList.add("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        menuToggle.setAttribute(
            "aria-label",
            "Cerrar menú"
        );

    };


    if (menuToggle && navigation) {

        menuToggle.addEventListener(
            "click",
            event => {

                event.stopPropagation();


                const isOpen =
                    navigation.classList.contains("open");


                if (isOpen) {
                    closeMenu();
                } else {
                    openMenu();
                }

            }
        );


        navigation
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener(
                    "click",
                    () => {
                        closeMenu();
                    }
                );

            });


        document.addEventListener(
            "click",
            event => {

                const clickedInsideNavigation =
                    navigation.contains(event.target);


                const clickedToggle =
                    menuToggle.contains(event.target);


                if (
                    !clickedInsideNavigation &&
                    !clickedToggle
                ) {
                    closeMenu();
                }

            }
        );


        document.addEventListener(
            "keydown",
            event => {

                if (event.key === "Escape") {
                    closeMenu();
                }

            }
        );

    }


    /* =========================================================
       CAMBIO DE TAMAÑO DE VENTANA
       CERRAR MENÚ AL VOLVER A DESKTOP
       ========================================================= */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 760 &&
                navigation
            ) {
                closeMenu();
            }

        }
    );


    /* =========================================================
       SCROLL SUAVE
       ========================================================= */

    const internalLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    internalLinks.forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }


                let target;


                try {

                    target =
                        document.querySelector(
                            targetId
                        );

                } catch {
                    return;
                }


                if (!target) {
                    return;
                }


                event.preventDefault();


                const headerHeight =
                    header?.offsetHeight || 0;


                const top =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight -
                    15;


                window.scrollTo({
                    top,
                    behavior: scrollBehavior
                });


                /*
                   Actualizar URL sin provocar
                   un salto adicional.
                */

                if (
                    history.replaceState
                ) {

                    history.replaceState(
                        null,
                        "",
                        targetId
                    );

                }

            }
        );

    });


    /* =========================================================
       CARGA DE FOTOGRAFÍAS
       ========================================================= */

    const renderSelectedFiles = files => {

        if (!orderForm) {
            return;
        }


        let preview =
            orderForm.querySelector(
                ".selected-files"
            );


        if (!preview) {

            preview =
                document.createElement("div");

            preview.className =
                "selected-files";


            photoInput?.parentElement?.appendChild(
                preview
            );

        }


        preview.replaceChildren();


        if (!files.length) {

            preview.textContent =
                "Aún no has seleccionado fotografías.";

            return;

        }


        const validFiles =
            files.filter(
                file =>
                    file.type.startsWith("image/")
            );


        if (!validFiles.length) {

            preview.textContent =
                "No se encontraron imágenes válidas.";

            return;

        }


        validFiles.forEach(
            (file, index) => {

                const item =
                    document.createElement("span");


                item.textContent =
                    `${index + 1}. ${file.name}`;


                preview.appendChild(item);

            }
        );

    };


    if (photoInput) {

        photoInput.addEventListener(
            "change",
            event => {

                const files =
                    Array.from(
                        event.target.files || []
                    );


                renderSelectedFiles(files);

                updateOrderSummary();

            }
        );

    }


    /* =========================================================
       RESUMEN DEL PEDIDO
       ========================================================= */

    const getQuantity = () => {

        if (!quantityInput) {
            return 1;
        }


        const value =
            Number(quantityInput.value);


        if (
            !Number.isFinite(value) ||
            value < 1
        ) {
            return 1;
        }


        return Math.floor(value);

    };


    const updateOrderSummary = () => {

        if (!summary) {
            return;
        }


        const format =
            formatSelect?.value ||
            "10 × 15 cm";


        const finish =
            finishSelect?.value ||
            "Mate";


        const selectedFiles =
            photoInput?.files?.length || 0;


        const quantity =
            getQuantity();


        const total =
            selectedFiles > 0
                ? selectedFiles
                : quantity;


        const word =
            total === 1
                ? "fotografía"
                : "fotografías";


        summary.textContent =
            `${total} ${word} · ${format} · ${finish}`;

    };


    [
        formatSelect,
        finishSelect,
        quantityInput
    ].forEach(control => {

        if (!control) {
            return;
        }


        control.addEventListener(
            "change",
            updateOrderSummary
        );


        control.addEventListener(
            "input",
            updateOrderSummary
        );

    });


    updateOrderSummary();


    /* =========================================================
       VALIDACIÓN DE CANTIDAD
       ========================================================= */

    if (quantityInput) {

        quantityInput.addEventListener(
            "input",
            () => {

                const value =
                    Number(quantityInput.value);


                if (
                    !Number.isFinite(value) ||
                    value < 1
                ) {
                    quantityInput.value = 1;
                }

            }
        );

    }


    /* =========================================================
       ENVÍO DEL FORMULARIO
       ========================================================= */

    if (orderForm) {

        orderForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();


                const files =
                    Array.from(
                        photoInput?.files || []
                    );


                const validImages =
                    files.filter(
                        file =>
                            file.type.startsWith("image/")
                    );


                if (
                    photoInput &&
                    files.length > 0 &&
                    validImages.length === 0
                ) {

                    summary.textContent =
                        "Selecciona al menos una fotografía válida.";

                    photoInput.focus();

                    return;

                }


                updateOrderSummary();


                /*
                   Actualmente el proyecto no tiene
                   backend ni número de WhatsApp configurado.

                   Por eso evitamos que el formulario
                   recargue la página.

                   Cuando tengas el número de WhatsApp
                   o backend definitivo, aquí se puede
                   conectar el envío real.
                */

                const originalText =
                    summary?.textContent || "";


                if (summary) {

                    summary.textContent =
                        `${originalText} · Pedido preparado`;

                }


                window.setTimeout(
                    () => {

                        if (summary) {
                            summary.textContent =
                                originalText;
                        }

                    },
                    2500
                );

            }
        );

    }


    /* =========================================================
       REVEAL ANIMATIONS
       ========================================================= */

    const revealElements =
        document.querySelectorAll(
            ".services article, .cards article, .package-list article, .testimonials article"
        );


    if (
        !reducedMotion &&
        "IntersectionObserver" in window &&
        revealElements.length
    ) {

        const revealObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible"
                            );


                            revealObserver.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -30px 0px"
                }
            );


        revealElements.forEach(
            element => {

                element.classList.add(
                    "reveal-item"
                );


                revealObserver.observe(
                    element
                );

            }
        );

    }


    /* =========================================================
       DRAG PREVENTION
       ========================================================= */

    document
        .querySelectorAll("img")
        .forEach(image => {

            image.addEventListener(
                "dragstart",
                event => {
                    event.preventDefault();
                }
            );

        });


    /* =========================================================
       TECLADO
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            /*
               Evitar que Enter genere comportamientos
               inesperados en elementos que no corresponden.
            */

            if (
                event.key === "Escape" &&
                navigation
            ) {
                closeMenu();
            }

        }
    );


    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */

    console.log(
        "Sublimarts — Impresión Fotográfica & Álbumes inicializado correctamente."
    );

})();