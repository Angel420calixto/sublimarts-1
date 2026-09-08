(() => {
    "use strict";

    const state = {
        category: "todo",
        search: "",
        order: "recientes",
        images: [],
        index: 0,
        detailsOpen: false,
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
        todo: "Guerrero Samurái", anime: "Guerrero Samurái", autos: "Moto Café Racer",
        paisajes: "Skyline Nocturno", religion: "Virgen del Carmen", retratos: "Mascota en HD"
    };

    const categoryLabels = {
        todo: "Todos", anime: "Anime y Gamer", autos: "Autos y Motos",
        paisajes: "Paisajes y Ciudades", religion: "Religión", retratos: "Retratos"
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
    const detailsPanel = $("#visorDetalles");
    const detailsTitle = $("#visorDetallesTitulo");
    const detailsDescription = $("#visorDetallesDescripcion");
    const detailsCategory = $("#visorDetallesCategoria");
    const orderButton = $("#visorEncargar");
    const detailsButton = $("#visorVerDetalles");

    function getCardData(card) {
        const image = $("img", card);
        const size = card.dataset.tamano || "";
        return {
            card, src: image?.dataset.viewer || image?.currentSrc || image?.src || "",
            alt: image?.alt || $("h3", card)?.textContent?.trim() || "Cuadro",
            name: card.dataset.nombre || $("h3", card)?.textContent?.trim() || "Cuadro",
            category: card.dataset.categoria || "todo", size
        };
    }

    function matchesSearch(item) {
        const query = state.search.trim().toLocaleLowerCase("es");
        if (!query) return true;
        return [item.name, item.alt, item.category, categoryLabels[item.category] || ""]
            .some(value => value.toLocaleLowerCase("es").includes(query));
    }

    function getFilteredPool() {
        let result = cards.map(getCardData).filter(item => {
            const categoryMatch = state.category === "todo" || item.category === state.category;
            return categoryMatch && matchesSearch(item);
        });
        if (state.order === "az") result.sort((a,b) => a.name.localeCompare(b.name, "es"));
        if (state.order === "za") result.sort((a,b) => b.name.localeCompare(a.name, "es"));
        if (state.order === "tamano") result.sort((a,b) => a.size.localeCompare(b.size, "es", {numeric:true}));
        return result;
    }

    // En "Todos" se muestran solo 3 por categoría. Al entrar a una categoría
    // concreta, o al buscar, se muestra todo lo que coincida.
    function getVisibleImages() {
        const pool = getFilteredPool();
        if (state.search.trim()) return pool;
        if (state.category !== "todo") return pool;

        const perCategory = new Map();
        const result = [];
        pool.forEach(item => {
            const count = perCategory.get(item.category) || 0;
            if (count < 3) {
                result.push(item);
                perCategory.set(item.category, count + 1);
            }
        });
        return result;
    }

    function updateHero(category) {
        const nextSrc = categoryHeroImages[category] || categoryHeroImages.todo;
        const nextTitle = categoryHeroTitles[category] || categoryHeroTitles.todo;
        if (heroImage) {
            const preloader = new Image();
            preloader.onload = () => { heroImage.src = nextSrc; heroImage.alt = `Cuadro destacado SublimArts: ${nextTitle}`; };
            preloader.src = nextSrc;
        }
        if (heroTitle) {
            const badge = $(".hero-catalogo-badge", heroTitle);
            heroTitle.firstChild.textContent = `${nextTitle} `;
            if (badge) heroTitle.appendChild(badge);
        }
        if (heroTag) heroTag.innerHTML = `<i class="fas fa-tag" aria-hidden="true"></i> ${categoryLabels[category] || categoryLabels.todo}`;
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
        const visibleItems = getVisibleImages();
        const visibleCards = new Set(visibleItems.map(item => item.card));
        cards.forEach(card => {
            const show = visibleCards.has(card);
            card.hidden = !show;
            card.classList.toggle("tarjeta-filtrada", !show);
        });
        if (emptyMessage) emptyMessage.hidden = visibleItems.length !== 0;
        updateHero(category);
        loadViewerImages();
    }

    function loadViewerImages() {
        state.images = getVisibleImages();
        if (!state.images.length) { state.index = 0; return; }
        state.index = Math.min(Math.max(state.index, 0), state.images.length - 1);
    }

    function updateOrderLink(current) {
        if (!orderButton) return;
        const message = encodeURIComponent(`Hola, quiero encargar el cuadro "${current.name}". Me interesa la imagen del catálogo y quisiera cotizar las medidas disponibles: 20x30, 30x40 y 40x60 cm.`);
        const phone = orderButton.dataset.numero || "";
        if (phone) orderButton.href = `https://wa.me/${phone}?text=${message}`;
        else orderButton.href = `#encargar-${encodeURIComponent(current.name.toLowerCase().replace(/\s+/g, "-"))}`;
    }

    function renderViewer() {
        if (!state.images.length) return;
        const current = state.images[state.index];
        viewerImage.src = current.src;
        viewerImage.alt = current.alt;
        viewerTitle.textContent = current.name;
        viewerCounter.textContent = `${state.index + 1} / ${state.images.length}`;
        detailsTitle.textContent = current.name;
        detailsDescription.textContent = `Cuadro personalizado en aluminio HD. Diseño: ${current.name}. Ideal para exhibir en formato vertical y conservar el detalle de la imagen.`;
        detailsCategory.textContent = categoryLabels[current.category] || current.category;
        updateOrderLink(current);
        const selectedSize = current.size || "";
        $$("[data-medida]", detailsPanel || document).forEach(button => {
            button.classList.toggle("activo", button.dataset.medida === selectedSize);
        });
    }

    function openImageViewer(imageOrCard) {
        const clickedCard = imageOrCard.closest ? imageOrCard.closest(".tarjeta-cuadro") : imageOrCard;
        if (!clickedCard) return;
        loadViewerImages();
        const found = state.images.findIndex(item => item.card === clickedCard);
        state.index = found >= 0 ? found : 0;
        if (detailsPanel) detailsPanel.hidden = true;
        state.detailsOpen = false;
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
        if (detailsPanel) detailsPanel.hidden = true;
        state.detailsOpen = false;
        viewerImage.src = "";
    }

    function toggleDetails() {
        state.detailsOpen = !state.detailsOpen;
        if (detailsPanel) detailsPanel.hidden = !state.detailsOpen;
        if (detailsButton) detailsButton.textContent = state.detailsOpen ? "Ocultar detalles" : "Ver detalles";
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

    tabs.forEach(tab => tab.addEventListener("click", () => filterGallery(tab.dataset.filtro || "todo")));
    searchInput?.addEventListener("input", () => { state.search = searchInput.value; filterGallery(state.category); });
    orderSelect?.addEventListener("change", () => { state.order = orderSelect.value; filterGallery(state.category); });

    cards.forEach(card => {
        const image = $("img", card);
        image?.addEventListener("click", () => openImageViewer(card));
        image?.setAttribute("tabindex", "0");
        image?.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openImageViewer(card); }
        });
    });

    $("#visorCerrar")?.addEventListener("click", closeImageViewer);
    $("[data-visor-cerrar]")?.addEventListener("click", closeImageViewer);
    $("#visorSiguiente")?.addEventListener("click", nextImage);
    $("#visorAnterior")?.addEventListener("click", previousImage);
    detailsButton?.addEventListener("click", toggleDetails);

    viewer?.addEventListener("touchstart", event => { state.touchStartX = event.changedTouches[0].screenX; }, {passive:true});
    viewer?.addEventListener("touchend", event => {
        const delta = event.changedTouches[0].screenX - state.touchStartX;
        if (Math.abs(delta) >= 45) delta < 0 ? nextImage() : previousImage();
    }, {passive:true});

    $("#visorMedidas")?.addEventListener("click", event => {
        const button = event.target.closest("[data-medida]");
        if (!button) return;
        $$("[data-medida]", $("#visorMedidas")).forEach(item => item.classList.remove("activo"));
        button.classList.add("activo");
    });

    document.addEventListener("keydown", event => {
        if (!viewer?.classList.contains("activo")) return;
        if (event.key === "Escape") closeImageViewer();
        if (event.key === "ArrowRight") nextImage();
        if (event.key === "ArrowLeft") previousImage();
    });

    // Barra de filtros fija al llegar al borde superior.
    const barraFiltros = $("#categorias");
    if (barraFiltros) {
        const placeholder = document.createElement("div");
        placeholder.className = "barra-filtros-placeholder";
        barraFiltros.parentNode.insertBefore(placeholder, barraFiltros);
        let barraTop = 0, barraAltura = 0, fijada = false;
        const soltar = () => { fijada = false; barraFiltros.classList.remove("filtro-fijo"); placeholder.classList.remove("activo"); placeholder.style.height = "0px"; };
        const fijar = () => { barraAltura = barraFiltros.offsetHeight; fijada = true; barraFiltros.classList.add("filtro-fijo"); placeholder.style.height = `${barraAltura}px`; placeholder.classList.add("activo"); };
        const medir = () => { const was = fijada; if (was) soltar(); barraTop = barraFiltros.getBoundingClientRect().top + window.scrollY; barraAltura = barraFiltros.offsetHeight; if (was && window.scrollY >= barraTop) fijar(); };
        const actualizar = () => window.scrollY >= barraTop ? (!fijada && fijar()) : (fijada && soltar());
        medir(); actualizar(); window.addEventListener("scroll", actualizar, {passive:true}); window.addEventListener("resize", medir);
    }

    const sidebar = $("#sidebar"), sidebarToggle = $("#sidebarToggle"), sidebarOverlay = $("#sidebarOverlay");
    function closeSidebar() { sidebar?.classList.remove("activo"); sidebarOverlay?.classList.remove("activo"); sidebarToggle?.setAttribute("aria-expanded", "false"); }
    sidebarToggle?.addEventListener("click", () => { const open = sidebar.classList.toggle("activo"); sidebarOverlay?.classList.toggle("activo", open); sidebarToggle.setAttribute("aria-expanded", String(open)); });
    sidebarOverlay?.addEventListener("click", closeSidebar);
    $$(".sidebar-enlace").forEach(link => link.addEventListener("click", closeSidebar));

    $$(".boton-whatsapp").forEach(button => button.addEventListener("click", event => {
        const service = button.dataset.servicio || "Cuadros personalizados";
        const phone = button.dataset.numero || "";
        if (!phone) { event.preventDefault(); return; }
        button.href = `https://wa.me/${phone}?text=${encodeURIComponent(`Hola, quiero consultar por ${service}.`)}`;
    }));

    cards.forEach(card => { card.hidden = false; card.classList.remove("tarjeta-oculta", "tarjeta-filtrada"); });
    filterGallery("todo");
})();
