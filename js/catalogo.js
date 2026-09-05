(() => {
    "use strict";

    const state = {
        category: "todo",
        search: "",
        order: "recientes",
        images: [],
        index: 0,
        completeMode: false,
        touchStartX: 0
    };

    const categoryHeroImages = {
        todo: "https://i.pinimg.com/1200x/79/c5/a6/79c5a6f1320869e2ef5daaf5b161d111.jpg",
        anime: "https://i.pinimg.com/1200x/79/c5/a6/79c5a6f1320869e2ef5daaf5b161d111.jpg",
        autos: "https://i.pinimg.com/736x/4c/9d/33/4c9d33025308d0d64320293f73c5db78.jpg",
        paisajes: "https://i.pinimg.com/1200x/3e/ea/ca/3eeacae4a3553cc3ca4883028c252623.jpg",
        religion: "https://i.pinimg.com/736x/9c/46/52/9c4652da570fcc7338b967e1f6a2eead.jpg",
        retratos: "https://i.pinimg.com/1200x/10/09/e4/1009e4ac4417da4cfe2239fcda83a6be.jpg"
    };

    const categoryHeroTitles = {
        todo: "Guerrero Samurái",
        anime: "Guerrero Samurái",
        autos: "Moto Café Racer",
        paisajes: "Skyline Nocturno",
        religion: "Virgen del Carmen",
        retratos: "Mascota en HD"
    };

    const categoryLabels = {
        todo: "Todos",
        anime: "Anime y Gamer",
        autos: "Autos y Motos",
        paisajes: "Paisajes y Ciudades",
        religion: "Religión",
        retratos: "Retratos"
    };

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

    const cards = $$(".tarjeta-cuadro");
    const tabs = $$(".tab-categoria");
    const searchInput = $("#buscadorCatalogo");
    const orderSelect = $("#ordenCatalogo");
    const emptyMessage = $("#catalogoVacio");
    const heroImage = $("#heroCatalogoImagen");
    const heroTitle = $(".hero-catalogo-contenido h1");
    const heroTag = $(".hero-catalogo-meta li:nth-child(3)");

    const viewer = $("#visorCatalogo");
    const viewerImage = $("#visorImagen");
    const viewerTitle = $("#visorTitulo");
    const viewerCounter = $("#visorContador");
    const viewerComplete = $("#visorCompleto");
    const viewerCompleteTitle = $("#visorCompletoTitulo");
    const viewerCompleteCounter = $("#visorCompletoContador");
    const viewerCompleteGrid = $("#visorCompletoGrid");

    function getCardData(card) {
        const image = $("img", card);
        return {
            card,
            src: image?.dataset.viewer || image?.currentSrc || image?.src || "",
            alt: image?.alt || $("h3", card)?.textContent?.trim() || "Cuadro",
            name: card.dataset.nombre || $("h3", card)?.textContent?.trim() || "Cuadro",
            category: card.dataset.categoria || "todo",
            size: card.dataset.tamano || ""
        };
    }

    function getVisibleImages() {
        const query = state.search.trim().toLocaleLowerCase("es");
        let result = cards
            .filter(card => !card.classList.contains("tarjeta-filtrada"))
            .map(getCardData)
            .filter(item => {
                const categoryMatch = state.category === "todo" || item.category === state.category;
                const searchMatch = !query ||
                    item.name.toLocaleLowerCase("es").includes(query) ||
                    item.alt.toLocaleLowerCase("es").includes(query) ||
                    item.category.toLocaleLowerCase("es").includes(query);
                return categoryMatch && searchMatch;
            });

        if (state.order === "az") {
            result.sort((a, b) => a.name.localeCompare(b.name, "es"));
        } else if (state.order === "za") {
            result.sort((a, b) => b.name.localeCompare(a.name, "es"));
        } else if (state.order === "tamano") {
            result.sort((a, b) => a.size.localeCompare(b.size, "es", { numeric: true }));
        }

        return result;
    }

    function updateHero(category) {
        const nextSrc = categoryHeroImages[category] || categoryHeroImages.todo;
        const nextTitle = categoryHeroTitles[category] || categoryHeroTitles.todo;

        if (heroImage) {
            heroImage.style.opacity = "0.65";
            const preloader = new Image();
            preloader.onload = () => {
                heroImage.src = nextSrc;
                heroImage.alt = `Cuadro destacado SublimArts: ${nextTitle}`;
                requestAnimationFrame(() => { heroImage.style.opacity = "1"; });
            };
            preloader.onerror = () => {
                heroImage.src = categoryHeroImages.todo;
                heroImage.style.opacity = "1";
            };
            preloader.src = nextSrc;
        }

        if (heroTitle) {
            const badge = $(".hero-catalogo-badge", heroTitle);
            heroTitle.firstChild.textContent = `${nextTitle} `;
            if (badge) heroTitle.appendChild(badge);
        }

        if (heroTag) {
            heroTag.innerHTML = `<i class="fas fa-tag" aria-hidden="true"></i> ${categoryLabels[category] || categoryLabels.todo}`;
        }
    }

    function updateTabs(category) {
        tabs.forEach(tab => {
            const active = tab.dataset.filtro === category;
            tab.classList.toggle("activo", active);
            tab.setAttribute("aria-selected", String(active));
        });
    }

    function filterGallery(category = state.category) {
        state.category = category;
        updateTabs(category);

        const query = state.search.trim().toLocaleLowerCase("es");

        cards.forEach(card => {
            const data = getCardData(card);
            const categoryMatch = category === "todo" || data.category === category;
            const searchMatch = !query ||
                data.name.toLocaleLowerCase("es").includes(query) ||
                data.alt.toLocaleLowerCase("es").includes(query) ||
                data.category.toLocaleLowerCase("es").includes(query);

            const visible = categoryMatch && searchMatch;
            card.hidden = !visible;
            card.classList.toggle("tarjeta-filtrada", !visible);
        });

        const visible = cards.filter(card => !card.classList.contains("tarjeta-filtrada")).length;
        if (emptyMessage) emptyMessage.hidden = visible !== 0;

        updateHero(category);

        // Make every available item visible; no "Cargar más" state remains.
        cards.forEach(card => {
            card.classList.remove("tarjeta-oculta");
        });
    }

    function loadViewerImages() {
        state.images = getVisibleImages();
        if (!state.images.length) {
            state.index = 0;
            return;
        }
        state.index = Math.min(state.index, state.images.length - 1);
    }

    function renderViewer() {
        if (!state.images.length) return;
        const current = state.images[state.index];

        viewerImage.src = current.src;
        viewerImage.alt = current.alt;
        viewerTitle.textContent = current.name;
        viewerCounter.textContent = `${state.index + 1} / ${state.images.length}`;

        viewerCompleteTitle.textContent = categoryLabels[state.category] || "Catálogo";
        viewerCompleteCounter.textContent = `${state.images.length} imágenes`;

        renderCompleteGrid();
    }

    function renderCompleteGrid() {
        viewerCompleteGrid.innerHTML = "";

        state.images.forEach((item, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = `visor-completo-item${index === state.index ? " activo" : ""}`;
            button.setAttribute("aria-label", `Ver ${item.name}`);
            button.innerHTML = `<img src="${item.src}" alt="${item.alt}" loading="lazy">`;
            button.addEventListener("click", () => {
                state.index = index;
                state.completeMode = true;
                renderViewer();
            });
            viewerCompleteGrid.appendChild(button);
        });
    }

    function openImageViewer(imageOrCard) {
        const clickedCard = imageOrCard.closest ? imageOrCard.closest(".tarjeta-cuadro") : imageOrCard;
        const data = clickedCard ? getCardData(clickedCard) : null;
        if (!data) return;

        loadViewerImages();
        const found = state.images.findIndex(item => item.card === clickedCard);
        state.index = found >= 0 ? found : 0;
        state.completeMode = false;

        viewerComplete.hidden = true;
        viewer.classList.add("activo");
        viewer.setAttribute("aria-hidden", "false");
        document.body.classList.add("visor-abierto");
        renderViewer();
        $("#visorCerrar")?.focus();
    }

    function closeImageViewer() {
        viewer.classList.remove("activo");
        viewer.setAttribute("aria-hidden", "true");
        document.body.classList.remove("visor-abierto");
        viewerComplete.hidden = true;
        state.completeMode = false;
        viewerImage.src = "";
    }

    function nextImage() {
        if (!state.images.length) return;
        state.index = (state.index + 1) % state.images.length;
        renderViewer();
    }

    function previousImage() {
        if (!state.images.length) return;
        state.index = (state.index - 1 + state.images.length) % state.images.length;
        renderViewer();
    }

    function openCompleteViewer() {
        loadViewerImages();
        if (!state.images.length) return;
        state.completeMode = true;
        viewerComplete.hidden = false;
        renderViewer();
        viewerComplete.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const category = tab.dataset.filtro || "todo";
            filterGallery(category);
        });
    });

    searchInput?.addEventListener("input", () => {
        state.search = searchInput.value;
        filterGallery(state.category);
    });

    orderSelect?.addEventListener("change", () => {
        state.order = orderSelect.value;
        loadViewerImages();
        renderViewer();
    });

    cards.forEach(card => {
        const image = $("img", card);
        image?.addEventListener("click", () => openImageViewer(card));
        image?.setAttribute("tabindex", "0");
        image?.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openImageViewer(card);
            }
        });
    });

    $("#visorCerrar")?.addEventListener("click", closeImageViewer);
    $("[data-visor-cerrar]")?.addEventListener("click", closeImageViewer);
    $("#visorSiguiente")?.addEventListener("click", nextImage);
    $("#visorAnterior")?.addEventListener("click", previousImage);
    $("#visorVerMas")?.addEventListener("click", openCompleteViewer);

    viewer?.addEventListener("touchstart", event => {
        state.touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    viewer?.addEventListener("touchend", event => {
        const delta = event.changedTouches[0].screenX - state.touchStartX;
        if (Math.abs(delta) < 45) return;
        if (delta < 0) nextImage();
        else previousImage();
    }, { passive: true });

    document.addEventListener("keydown", event => {
        if (!viewer?.classList.contains("activo")) return;
        if (event.key === "Escape") closeImageViewer();
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") previousImage();
    });

    // Barra de filtros fija al llegar al borde superior.
    // El placeholder evita que la galería salte cuando la barra pasa a position: fixed.
    const barraFiltros = $("#categorias");
    if (barraFiltros) {
        const placeholder = document.createElement("div");
        placeholder.className = "barra-filtros-placeholder";
        barraFiltros.parentNode.insertBefore(placeholder, barraFiltros);

        let barraTop = 0;
        let barraAltura = 0;
        let fijada = false;

        const soltarBarra = () => {
            fijada = false;
            barraFiltros.classList.remove("filtro-fijo");
            placeholder.classList.remove("activo");
            placeholder.style.height = "0px";
        };

        const fijarBarra = () => {
            barraAltura = barraFiltros.offsetHeight;
            fijada = true;
            barraFiltros.classList.add("filtro-fijo");
            placeholder.style.height = `${barraAltura}px`;
            placeholder.classList.add("activo");
        };

        const medirBarra = () => {
            const estabaFijada = fijada;
            if (estabaFijada) soltarBarra();
            barraTop = barraFiltros.getBoundingClientRect().top + window.scrollY;
            barraAltura = barraFiltros.offsetHeight;
            if (estabaFijada && window.scrollY >= barraTop) fijarBarra();
        };

        const actualizarBarra = () => {
            if (window.scrollY >= barraTop) {
                if (!fijada) fijarBarra();
            } else if (fijada) {
                soltarBarra();
            }
        };

        medirBarra();
        actualizarBarra();
        window.addEventListener("scroll", actualizarBarra, { passive: true });
        window.addEventListener("resize", medirBarra);
    }

    // Sidebar mobile.
    const sidebar = $("#sidebar");
    const sidebarToggle = $("#sidebarToggle");
    const sidebarOverlay = $("#sidebarOverlay");

    function closeSidebar() {
        sidebar?.classList.remove("activo");
        sidebarOverlay?.classList.remove("activo");
        sidebarToggle?.setAttribute("aria-expanded", "false");
    }

    sidebarToggle?.addEventListener("click", () => {
        const open = sidebar.classList.toggle("activo");
        sidebarOverlay?.classList.toggle("activo", open);
        sidebarToggle.setAttribute("aria-expanded", String(open));
    });

    sidebarOverlay?.addEventListener("click", closeSidebar);
    $$(".sidebar-enlace").forEach(link => link.addEventListener("click", closeSidebar));

    // Existing WhatsApp buttons remain compatible with the current HTML.
    $$(".boton-whatsapp").forEach(button => {
        button.addEventListener("click", event => {
            const service = button.dataset.servicio || "Cuadros personalizados";
            const message = encodeURIComponent(`Hola, quiero consultar por ${service}.`);
            const phone = button.dataset.numero || "";
            if (!phone) {
                // Keep href="#" when no phone has been configured instead of inventing a number.
                event.preventDefault();
                return;
            }
            button.href = `https://wa.me/${phone}?text=${message}`;
        });
    });

    // Initial state.
    cards.forEach(card => {
        card.hidden = false;
        card.classList.remove("tarjeta-oculta", "tarjeta-filtrada");
    });
    filterGallery("todo");
})();
