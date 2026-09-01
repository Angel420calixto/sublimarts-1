(() => {
    "use strict";

    const DOM = {
        header: document.querySelector(".site-header"),
        navToggle: document.querySelector(".nav-toggle"),
        navList: document.querySelector(".nav-list"),
        navLinks: document.querySelectorAll(".nav-list a[href^='#']"),
        revealItems: document.querySelectorAll(".reveal"),
        year: document.querySelector("[data-current-year]"),
        faqTriggers: document.querySelectorAll("[data-faq-trigger]"),
        carouselTrack: document.querySelector("[data-carousel-track]"),
        carouselPrev: document.querySelector("[data-carousel-prev]"),
        carouselNext: document.querySelector("[data-carousel-next]"),
        newsletter: document.querySelector(".newsletter")
    };

    const prefersReducedMotion =
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;


    /* =========================================================
       HEADER STICKY
       ========================================================= */

    const updateHeader = () => {
        if (!DOM.header) {
            return;
        }

        DOM.header.classList.toggle(
            "is-scrolled",
            window.scrollY > 12
        );
    };

    window.addEventListener(
        "scroll",
        updateHeader,
        { passive: true }
    );

    updateHeader();


    /* =========================================================
       MENÚ RESPONSIVE
       ========================================================= */

    const closeMenu = () => {
        if (!DOM.navToggle || !DOM.navList) {
            return;
        }

        DOM.navToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        DOM.navToggle.setAttribute(
            "aria-label",
            "Abrir menú de navegación"
        );

        DOM.navList.classList.remove("is-open");
    };


    if (DOM.navToggle && DOM.navList) {

        DOM.navToggle.addEventListener("click", () => {

            const isOpen =
                DOM.navToggle.getAttribute("aria-expanded") === "true";

            DOM.navToggle.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            DOM.navToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Abrir menú de navegación"
                    : "Cerrar menú de navegación"
            );

            DOM.navList.classList.toggle(
                "is-open",
                !isOpen
            );
        });


        DOM.navLinks.forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


        window.addEventListener("resize", () => {

            if (window.innerWidth > 820) {
                closeMenu();
            }

        });

    }


    /* =========================================================
       ANIMACIONES REVEAL AL HACER SCROLL
       ========================================================= */

    if (
        !prefersReducedMotion &&
        "IntersectionObserver" in window
    ) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin: "0px 0px -40px"
                }
            );


        DOM.revealItems.forEach((item) => {

            revealObserver.observe(item);

        });

    } else {

        DOM.revealItems.forEach((item) => {

            item.classList.add(
                "is-visible"
            );

        });

    }


    /* =========================================================
       FAQ — ACORDEÓN ACCESIBLE
       ========================================================= */

    DOM.faqTriggers.forEach((trigger) => {

        trigger.addEventListener("click", () => {

            const isExpanded =
                trigger.getAttribute("aria-expanded") === "true";

            const answerId =
                trigger.getAttribute("aria-controls");

            const answer =
                document.getElementById(answerId);


            /*
             * Cerramos las demás preguntas.
             */

            DOM.faqTriggers.forEach(
                (otherTrigger) => {

                    if (otherTrigger === trigger) {
                        return;
                    }

                    const otherId =
                        otherTrigger.getAttribute(
                            "aria-controls"
                        );

                    const otherAnswer =
                        document.getElementById(
                            otherId
                        );


                    otherTrigger.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    if (otherAnswer) {

                        otherAnswer.hidden = true;

                    }

                }
            );


            /*
             * Alternamos la pregunta seleccionada.
             */

            trigger.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );


            if (answer) {

                answer.hidden = isExpanded;

            }

        });

    });


    /* =========================================================
       CARRUSEL DE SERVICIOS
       ========================================================= */

    const updateCarouselButtons = () => {

        if (
            !DOM.carouselTrack ||
            !DOM.carouselPrev ||
            !DOM.carouselNext
        ) {
            return;
        }


        const maxScroll =
            DOM.carouselTrack.scrollWidth -
            DOM.carouselTrack.clientWidth;


        DOM.carouselPrev.disabled =
            DOM.carouselTrack.scrollLeft <= 2;


        DOM.carouselNext.disabled =
            DOM.carouselTrack.scrollLeft >=
            maxScroll - 2;

    };


    const getCarouselStep = () => {

        if (!DOM.carouselTrack) {
            return 0;
        }


        const firstSlide =
            DOM.carouselTrack.querySelector(
                ".service-slide"
            );


        if (!firstSlide) {
            return DOM.carouselTrack.clientWidth;
        }


        const styles =
            window.getComputedStyle(
                DOM.carouselTrack
            );


        const gap =
            Number.parseFloat(
                styles.columnGap ||
                styles.gap ||
                "16"
            );


        return (
            firstSlide.getBoundingClientRect().width +
            gap
        );

    };


    if (
        DOM.carouselTrack &&
        DOM.carouselPrev &&
        DOM.carouselNext
    ) {

        DOM.carouselPrev.addEventListener(
            "click",
            () => {

                DOM.carouselTrack.scrollBy({
                    left: -getCarouselStep(),

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"
                });

            }
        );


        DOM.carouselNext.addEventListener(
            "click",
            () => {

                DOM.carouselTrack.scrollBy({
                    left: getCarouselStep(),

                    behavior:
                        prefersReducedMotion
                            ? "auto"
                            : "smooth"
                });

            }
        );


        DOM.carouselTrack.addEventListener(
            "scroll",
            updateCarouselButtons,
            { passive: true }
        );


        window.addEventListener(
            "resize",
            updateCarouselButtons
        );


        updateCarouselButtons();

    }


    /* =========================================================
       AÑO AUTOMÁTICO DEL FOOTER
       ========================================================= */

    if (DOM.year) {

        DOM.year.textContent =
            String(new Date().getFullYear());

    }


    /* =========================================================
       NEWSLETTER
       
       Este comportamiento es demostrativo.
       Cuando tengas backend, reemplazar por el endpoint real.
       ========================================================= */

    if (DOM.newsletter) {

        DOM.newsletter.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const emailInput =
                    DOM.newsletter.querySelector(
                        "input[type='email']"
                    );


                if (
                    !emailInput ||
                    !emailInput.value.trim()
                ) {
                    return;
                }


                const submitButton =
                    DOM.newsletter.querySelector(
                        "button"
                    );


                if (submitButton) {

                    const originalText =
                        submitButton.textContent;


                    submitButton.textContent =
                        "¡Registrado!";


                    submitButton.disabled =
                        true;


                    window.setTimeout(
                        () => {

                            submitButton.textContent =
                                originalText;

                            submitButton.disabled =
                                false;

                            DOM.newsletter.reset();

                        },
                        2200
                    );

                }

            }
        );

    }

})();