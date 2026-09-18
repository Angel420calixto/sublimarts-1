(() => {
    "use strict";

    const state = {
        category: "anime",
        order: "recientes",
        images: [],
        index: 0,
        completeMode: false,
        touchStartX: null
    };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const gallery = $("#galeriaCatalogo");
    const visor = $("#visorCatalogo");
    const visorImagen = $("#visorImagen");
    const visorTitulo = $("#visorTitulo");
    const visorContador = $("#visorContador");
    const visorDetalles = $("#visorDetalles");
    const visorCompleto = $("#visorCompleto");

    const visorAnterior = $("#visorAnterior");
    const visorSiguiente = $("#visorSiguiente");
    const visorCerrar = $("#visorCerrar");
    const visorVerDetalles = $("#visorVerDetalles");
    const visorVerMas = $("#visorVerMas");
    const visorEncargar = $("#visorEncargar");

    const ordenCatalogo = $("#ordenCatalogo");

    const sidebar = $("#sidebar");
    const sidebarToggle = $("#sidebarToggle");
    const sidebarOverlay = $("#sidebarOverlay");

    /* =========================================================
       DATOS DE LAS TARJETAS
       ========================================================= */

    function getCardData(card) {
        if (!card) return null;

        const image = $("img", card);

        return {
            element: card,
            title:
                card.dataset.titulo ||
                card.dataset.nombre ||
                $(".tarjeta-cuadro-titulo", card)?.textContent.trim() ||
                image?.alt ||
                "Cuadro",
            category:
                (card.dataset.categoria || card.dataset.category || "anime")
                    .trim()
                    .toLowerCase(),
            image: image?.currentSrc || image?.src || "",
            alt: image?.alt || "Cuadro",
            size: card.dataset.tamano || "",
            description: card.dataset.descripcion || "",
            detailsUrl:
                card.dataset.url ||
                card.dataset.detalles ||
                card.querySelector("[data-detalles]")?.getAttribute("href") ||
                "#",
            whatsapp:
                card.dataset.whatsapp ||
                card.querySelector(".boton-whatsapp")?.getAttribute("href") ||
                ""
        };
    }

    function getAllCards() {
        return $$(".tarjeta-cuadro", gallery);
    }

    /* =========================================================
       FILTRO Y ORDEN
       ========================================================= */

    function getVisibleImages() {
        let cards = getAllCards()
            .map(getCardData)
            .filter(Boolean)
            .filter(card => card.category === state.category);

        switch (state.order) {
            case "az":
                cards.sort((a, b) =>
                    a.title.localeCompare(b.title, "es", {
                        sensitivity: "base"
                    })
                );
                break;

            case "za":
                cards.sort((a, b) =>
                    b.title.localeCompare(a.title, "es", {
                        sensitivity: "base"
                    })
                );
                break;

            case "tamano":
                cards.sort((a, b) =>
                    (a.size || "").localeCompare(b.size || "", "es", {
                        numeric: true,
                        sensitivity: "base"
                    })
                );
                break;

            case "recientes":
            default:
                // Mantiene el orden original del HTML.
                break;
        }

        return cards;
    }

    function filterGallery() {
        const cards = getAllCards();

        cards.forEach(card => {
            const category = (
                card.dataset.categoria ||
                card.dataset.category ||
                ""
            )
                .trim()
                .toLowerCase();

            card.hidden = category !== state.category;
        });

        $$(".tab-categoria").forEach(tab => {
            const active =
                (tab.dataset.filtro || "").toLowerCase() === state.category;

            tab.classList.toggle("activo", active);
            tab.setAttribute("aria-selected", active ? "true" : "false");
        });

        state.images = getVisibleImages();

        if (state.images.length === 0) {
            state.index = 0;
        } else if (state.index >= state.images.length) {
            state.index = state.images.length - 1;
        }
    }

    $$(".tab-categoria").forEach(tab => {
        tab.addEventListener("click", () => {
            const category = (tab.dataset.filtro || "").toLowerCase();

            if (!["anime", "gamer"].includes(category)) return;

            state.category = category;
            state.index = 0;

            filterGallery();
        });
    });

    if (ordenCatalogo) {
        ordenCatalogo.addEventListener("change", event => {
            state.order = event.target.value;
            state.index = 0;

            filterGallery();
        });
    }

    /* =========================================================
       MODAL / VISOR
       ========================================================= */

    function loadViewerImages() {
        state.images = getVisibleImages();

        if (!state.images.length) {
            state.index = 0;
            return;
        }

        if (state.index < 0) {
            state.index = state.images.length - 1;
        }

        if (state.index >= state.images.length) {
            state.index = 0;
        }
    }

    function renderViewer() {
        if (!visor || !visorImagen || !state.images.length) return;

        const item = state.images[state.index];

        visorImagen.src = item.image;
        visorImagen.alt = item.alt || item.title;

        if (visorTitulo) {
            visorTitulo.textContent = item.title;
        }

        if (visorContador) {
            visorContador.textContent =
                `${state.index + 1} / ${state.images.length}`;
        }

        if (visorDetalles) {
            const detailsText =
                item.description ||
                item.size ||
                "";

            if (detailsText) {
                visorDetalles.textContent = detailsText;
            }
        }

        if (visorEncargar && item.whatsapp) {
            visorEncargar.href = item.whatsapp;
        }

        if (visorVerMas && item.detailsUrl) {
            visorVerMas.href = item.detailsUrl;
        }

        if (visorAnterior) {
            visorAnterior.disabled = state.images.length <= 1;
        }

        if (visorSiguiente) {
            visorSiguiente.disabled = state.images.length <= 1;
        }
    }

    function renderCompleteGrid() {
        if (!visorCompleto) return;

        visorCompleto.innerHTML = "";

        state.images.forEach((item, index) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "visor-completo-item";
            button.dataset.index = index;
            button.setAttribute(
                "aria-label",
                `Ver ${item.title || "imagen"}`
            );

            const img = document.createElement("img");

            img.src = item.image;
            img.alt = item.alt || item.title || "Imagen";

            button.appendChild(img);
            visorCompleto.appendChild(button);
        });
    }

    function openImageViewer(card) {
        const data = getCardData(card);

        if (!data || !data.image) return;

        loadViewerImages();

        const foundIndex = state.images.findIndex(
            item => item.element === card
        );

        if (foundIndex >= 0) {
            state.index = foundIndex;
        } else {
            state.index = 0;
        }

        state.completeMode = false;

        if (visorCompleto) {
            visorCompleto.hidden = true;
        }

        if (visorDetalles) {
            visorDetalles.hidden = true;
        }

        if (visorVerDetalles) {
            visorVerDetalles.setAttribute("aria-expanded", "false");
        }

        renderViewer();

        if (visor) {
            visor.classList.add("abierto");
            visor.setAttribute("aria-hidden", "false");
            document.body.classList.add("visor-abierto");
        }

        visorCerrar?.focus();
    }

    function closeImageViewer() {
        if (!visor) return;

        visor.classList.remove("abierto");
        visor.setAttribute("aria-hidden", "true");

        document.body.classList.remove("visor-abierto");

        state.completeMode = false;
        state.touchStartX = null;
    }

    function nextImage() {
        if (!state.images.length) return;

        state.index =
            (state.index + 1) % state.images.length;

        renderViewer();
    }

    function previousImage() {
        if (!state.images.length) return;

        state.index =
            (state.index - 1 + state.images.length) %
            state.images.length;

        renderViewer();
    }

    function openCompleteViewer() {
        loadViewerImages();

        if (!state.images.length) return;

        state.completeMode = true;

        renderCompleteGrid();

        if (visorCompleto) {
            visorCompleto.hidden = false;
        }
    }

    /* =========================================================
       CLICK EN LAS TARJETAS
       ========================================================= */

    getAllCards().forEach(card => {
        const image = $("img", card);

        if (image) {
            image.addEventListener("click", event => {
                event.preventDefault();
                openImageViewer(card);
            });
        }

        const trigger =
            card.querySelector("[data-visor-abrir]") ||
            card.querySelector(".tarjeta-cuadro-ver") ||
            card.querySelector(".tarjeta-cuadro-media");

        if (trigger && trigger !== image) {
            trigger.addEventListener("click", event => {
                event.preventDefault();
                openImageViewer(card);
            });
        }
    });

    /* =========================================================
       CONTROLES DEL MODAL
       ========================================================= */

    visorCerrar?.addEventListener("click", closeImageViewer);

    visorAnterior?.addEventListener("click", event => {
        event.preventDefault();
        previousImage();
    });

    visorSiguiente?.addEventListener("click", event => {
        event.preventDefault();
        nextImage();
    });

    visorVerMas?.addEventListener("click", event => {
        if (!state.completeMode) {
            event.preventDefault();
            openCompleteViewer();
        }
    });

    visorVerDetalles?.addEventListener("click", () => {
        if (!visorDetalles) return;

        const isHidden = visorDetalles.hidden;

        visorDetalles.hidden = !isHidden;

        visorVerDetalles.setAttribute(
            "aria-expanded",
            isHidden ? "true" : "false"
        );
    });

    $$("[data-visor-cerrar]").forEach(element => {
        element.addEventListener("click", closeImageViewer);
    });

    visorCompleto?.addEventListener("click", event => {
        const item = event.target.closest(".visor-completo-item");

        if (!item) return;

        const index = Number(item.dataset.index);

        if (!Number.isNaN(index)) {
            state.index = index;
            state.completeMode = false;

            visorCompleto.hidden = true;

            renderViewer();
        }
    });

    /* =========================================================
       TECLADO
       ========================================================= */

    document.addEventListener("keydown", event => {
        if (!visor?.classList.contains("abierto")) return;

        switch (event.key) {
            case "Escape":
                closeImageViewer();
                break;

            case "ArrowRight":
                event.preventDefault();
                nextImage();
                break;

            case "ArrowLeft":
                event.preventDefault();
                previousImage();
                break;
        }
    });

    /* =========================================================
       SWIPE EN MOBILE
       ========================================================= */

    if (visor) {
        visor.addEventListener(
            "touchstart",
            event => {
                if (event.touches.length !== 1) return;

                state.touchStartX = event.touches[0].clientX;
            },
            { passive: true }
        );

        visor.addEventListener(
            "touchend",
            event => {
                if (state.touchStartX === null) return;

                const endX = event.changedTouches[0].clientX;
                const difference =
                    endX - state.touchStartX;

                state.touchStartX = null;

                if (Math.abs(difference) < 50) return;

                if (difference < 0) {
                    nextImage();
                } else {
                    previousImage();
                }
            },
            { passive: true }
        );
    }

    /* =========================================================
       MENÚ MOBILE
       ========================================================= */

    function openSidebar() {
        if (!sidebar) return;

        sidebar.classList.add("abierto");
        sidebar.setAttribute("aria-hidden", "false");

        sidebarToggle?.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add("menu-abierto");
    }

    function closeSidebar() {
        if (!sidebar) return;

        sidebar.classList.remove("abierto");
        sidebar.setAttribute("aria-hidden", "true");

        sidebarToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove("menu-abierto");
    }

    sidebarToggle?.addEventListener("click", () => {
        const isOpen = sidebar?.classList.contains("abierto");

        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    sidebarOverlay?.addEventListener("click", closeSidebar);

    $$(".sidebar a").forEach(link => {
        link.addEventListener("click", () => {
            closeSidebar();
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    /* =========================================================
       WHATSAPP
       ========================================================= */

    $$(".boton-whatsapp").forEach(button => {
        button.addEventListener("click", () => {
            const message =
                button.dataset.mensaje ||
                "Hola, quiero consultar por un diseño de SublimArts.";

            if (
                button.tagName.toLowerCase() === "a" &&
                button.getAttribute("href")
            ) {
                return;
            }

            const phone = button.dataset.telefono || "";

            if (!phone) return;

            const url =
                `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

            window.open(url, "_blank", "noopener,noreferrer");
        });
    });

    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */

    function initialize() {
        // Anime es la categoría inicial.
        state.category = "anime";
        state.order = ordenCatalogo?.value || "recientes";
        state.index = 0;

        filterGallery();

        if (sidebar) {
            sidebar.setAttribute("aria-hidden", "true");
        }

        if (visor) {
            visor.setAttribute("aria-hidden", "true");
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
})();