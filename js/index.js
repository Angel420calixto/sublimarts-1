// ============================================================
// SUBLIMARTS - INDEX.JS
// ============================================================

// Reemplaza por tu número real de WhatsApp.
// Formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = "56912345678";

const waUrl = (message) =>
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;


// ============================================================
// INICIALIZACIÓN
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ----------------------------------------------------------
    // WHATSAPP
    // ----------------------------------------------------------

    document.querySelectorAll(".wa-link").forEach((link) => {

        const message =
            link.dataset.message ||
            "Hola SublimArts, quiero más información.";

        link.href = waUrl(message);
        link.target = "_blank";
        link.rel = "noopener noreferrer";
    });


    // ----------------------------------------------------------
    // MENÚ MÓVIL
    // ----------------------------------------------------------

    const nav = document.querySelector("#main-nav");
    const menuButton = document.querySelector("#menu-button");

    if (nav && menuButton) {

        menuButton.addEventListener("click", () => {

            const open = nav.classList.toggle("open");

            menuButton.setAttribute(
                "aria-expanded",
                String(open)
            );

            menuButton.setAttribute(
                "aria-label",
                open ? "Cerrar menú" : "Abrir menú"
            );
        });


        nav.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                nav.classList.remove("open");

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Abrir menú"
                );
            });
        });
    }


    // ----------------------------------------------------------
    // DROPDOWN DEL MENÚ
    // ----------------------------------------------------------

    const dropdown = document.querySelector(".nav-dropdown");

    if (dropdown) {

        const dropdownButton =
            dropdown.querySelector("button");

        if (dropdownButton) {

            dropdownButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    const open =
                        dropdown.classList.toggle("open");

                    dropdownButton.setAttribute(
                        "aria-expanded",
                        String(open)
                    );
                }
            );


            document.addEventListener("click", (event) => {

                if (!dropdown.contains(event.target)) {

                    dropdown.classList.remove("open");

                    dropdownButton.setAttribute(
                        "aria-expanded",
                        "false"
                    );
                }
            });
        }
    }


    // ----------------------------------------------------------
    // FILTROS DEL PORTAFOLIO
    // ----------------------------------------------------------

    const filters =
        document.querySelectorAll("[data-filter]");

    const items =
        document.querySelectorAll(".portfolio-item");


    filters.forEach((filter) => {

        filter.addEventListener("click", () => {

            const category =
                filter.dataset.filter;


            // Quitar estado activo de todos
            filters.forEach((button) => {

                button.classList.remove("active");

                button.setAttribute(
                    "aria-selected",
                    "false"
                );
            });


            // Activar filtro seleccionado
            filter.classList.add("active");

            filter.setAttribute(
                "aria-selected",
                "true"
            );


            // Mostrar / ocultar elementos
            items.forEach((item) => {

                const visible =
                    category === "todo" ||
                    item.dataset.category === category;

                item.hidden = !visible;
            });
        });
    });


    // ----------------------------------------------------------
    // MODAL DEL PORTAFOLIO
    // ----------------------------------------------------------

    const modal =
        document.querySelector("#image-modal");

    const modalImage =
        document.querySelector("#modal-image");

    const modalCategory =
        document.querySelector("#modal-category");

    const modalTitle =
        document.querySelector("#modal-title");

    const modalDescription =
        document.querySelector("#modal-description");


    if (modal && modalImage) {

        items.forEach((item) => {

            item.addEventListener("click", () => {

                // Imagen grande
                const image =
                    item.dataset.image ||
                    item.querySelector("img")?.src ||
                    "";


                // Texto alternativo
                const alt =
                    item.querySelector("img")?.alt ||
                    item.dataset.title ||
                    "Imagen de SublimArts";


                modalImage.src = image;
                modalImage.alt = alt;


                // Categoría
                if (modalCategory) {

                    modalCategory.textContent =
                        item.dataset.category || "";
                }


                // Título
                if (modalTitle) {

                    modalTitle.textContent =
                        item.dataset.title || "";
                }


                // Descripción
                if (modalDescription) {

                    modalDescription.textContent =
                        item.dataset.description || "";
                }


                // --------------------------------------------------
                // BOTÓN WHATSAPP DEL MODAL
                // --------------------------------------------------

                const modalWhatsApp =
                    modal.querySelector(".wa-link");


                if (modalWhatsApp) {

                    const title =
                        item.dataset.title ||
                        "este servicio";


                    modalWhatsApp.href =
                        waUrl(
                            `Hola SublimArts, quiero cotizar: ${title}.`
                        );


                    modalWhatsApp.target = "_blank";

                    modalWhatsApp.rel =
                        "noopener noreferrer";
                }


                // Abrir modal
                if (
                    typeof modal.showModal === "function"
                ) {

                    modal.showModal();
                }
            });
        });


        // ------------------------------------------------------
        // CERRAR MODAL
        // ------------------------------------------------------

        const closeModal =
            modal.querySelector(".close-modal");


        if (closeModal) {

            closeModal.addEventListener(
                "click",
                () => {
                    modal.close();
                }
            );
        }


        // Cerrar haciendo clic fuera
        modal.addEventListener(
            "click",
            (event) => {

                if (event.target === modal) {

                    modal.close();
                }
            }
        );
    }


    // ----------------------------------------------------------
    // FORMULARIO DE COTIZACIÓN
    // ----------------------------------------------------------

    const quoteForm =
        document.querySelector("#quote-form");


    if (quoteForm) {

        quoteForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();


                const form =
                    new FormData(event.currentTarget);


                const name =
                    String(
                        form.get("name") || ""
                    ).trim();


                const email =
                    String(
                        form.get("email") || ""
                    ).trim();


                const notice =
                    document.querySelector(
                        "#form-notice"
                    );


                // Validación del correo
                const emailIsValid =
                    /^\S+@\S+\.\S+$/.test(email);


                // Validación del formulario
                if (
                    name.length < 2 ||
                    !emailIsValid
                ) {

                    if (notice) {

                        notice.textContent =
                            "Revisa tu nombre y correo para continuar.";
                    }

                    return;
                }


                // Servicio seleccionado
                const service =
                    form.get("service") ||
                    "un servicio";


                // Fecha
                const date =
                    form.get("date") ||
                    "por definir";


                // Mensaje
                const message =
                    String(
                        form.get("message") || ""
                    ).trim();


                // --------------------------------------------------
                // MENSAJE FINAL PARA WHATSAPP
                // --------------------------------------------------

                const whatsappMessage =
                    `Hola SublimArts, soy ${name}. ` +
                    `Quiero cotizar ${service}. ` +
                    `Fecha aproximada: ${date}. ` +
                    `${message}`;


                // Aviso al usuario
                if (notice) {

                    notice.textContent =
                        "Abriendo WhatsApp con tu solicitud lista para enviar.";
                }


                // Abrir WhatsApp
                window.open(
                    waUrl(whatsappMessage),
                    "_blank",
                    "noopener,noreferrer"
                );
            }
        );
    }


    // ----------------------------------------------------------
    // AÑO AUTOMÁTICO DEL FOOTER
    // ----------------------------------------------------------

    const year =
        document.querySelector("#year");


    if (year) {

        year.textContent =
            new Date().getFullYear();
    }

});