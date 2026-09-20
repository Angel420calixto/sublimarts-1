(() => {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];

    const grid = $("#grid-catalogo-deportes");
    const cards = $$(".tarjeta-cuadro-deportes", grid || document);
    const tabs = $$(".tab-categoria-deportes");
    const search = $("#buscadorCatalogo-deportes");
    const order = $("#ordenCatalogo-deportes");
    const empty = $("#catalogoVacio-deportes");

    const viewer = $("#visorCatalogo-deportes");
    const viewerImage = $("#visorImagen-deportes");
    const viewerTitle = $("#visorTitulo-deportes");
    const viewerCounter = $("#visorContador-deportes");
    const previous = $("#visorAnterior-deportes");
    const next = $("#visorSiguiente-deportes");
    const close = $("#visorCerrar-deportes");
    const details = $("#visorDetalles-deportes");
    const detailsButton = $("#visorVerDetalles-deportes");
    const detailsTitle = $("#visorDetallesTitulo-deportes");
    const detailsDescription = $("#visorDetallesDescripcion-deportes");
    const detailsCategory = $("#visorDetallesCategoria-deportes");
    const measures = $("#visorMedidas-deportes");
    const orderButton = $("#visorEncargar-deportes");

    const sidebar = $("#sidebar-deportes");
    const menuButton = $("#sidebarToggle-deportes");
    const overlay = $("#sidebarOverlay-deportes");

    const filterBar = $("#categorias-deportes");
    const heroImage = $("#heroCatalogoImagen-deportes");
    const heroTitle = $(".hero-catalogo-contenido-deportes h1");
    const heroTag = $(".hero-catalogo-meta-deportes li:nth-child(3)");

    const state = {
      category: "todo",
      search: "",
      order: "recientes",
      card: null,
      views: [],
      index: 0,
      touchX: 0,
      touchY: 0
    };

    const labels = {
      todo: "Deportes",
      futbol: "Fútbol",
      basquetbol: "Básquetbol",
      tenis: "Tenis",
      motor: "Motor"
    };

    const heroImages = {
      todo:
        "https://i.pinimg.com/1200x/56/84/16/568416fd1ebe1e7c329dc0c8e15b076c.jpg",

      futbol:
        "https://i.pinimg.com/1200x/56/84/16/568416fd1ebe1e7c329dc0c8e15b076c.jpg",

      basquetbol:
        "https://i.pinimg.com/1200x/ea/c3/b9/eac3b9a36fe474e31db8c89a40ce9645.jpg",

      tenis:
        "https://i.pinimg.com/1200x/ea/7e/7e/ea7e7e556a834a2f7ab3f40d8ca43094.jpg",

      motor:
        "https://i.pinimg.com/1200x/df/e9/22/dfe9223d5f628e18a02b2e64cfce0342.jpg"
    };

    function normalize(value) {
      return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
    }

    /* =====================================================
       DEPORTES USA SOLO data-categoria
       ===================================================== */

    function categoryOf(card) {
      return normalize(
        card?.dataset.categoria || ""
      );
    }

    function nameOf(card) {
      return (
        card?.dataset.nombre ||
        $("h3", card)?.textContent ||
        "Cuadro"
      ).trim();
    }

    function sizeOf(card) {
      return String(
        card?.dataset.tamano || ""
      ).trim();
    }

    function textOf(card) {
      return normalize(
        [
          nameOf(card),
          categoryOf(card),
          labels[categoryOf(card)] || "",
          sizeOf(card),
          card?.textContent || ""
        ].join(" ")
      );
    }

    /* =====================================================
       VISTAS DEL PRODUCTO
       ===================================================== */

    function viewsOf(card) {
      if (!card) return [];

      const views = [];
      const used = new Set();

      for (let i = 1; i <= 4; i++) {
        const url = String(
          card.getAttribute(`data-view-${i}`) || ""
        ).trim();

        if (url && !used.has(url)) {
          used.add(url);
          views.push(url);
        }
      }

      /* Si no hay data-view, usa la imagen principal */

      if (!views.length) {
        const img = $("img", card);

        const src = String(
          img?.currentSrc ||
          img?.src ||
          ""
        ).trim();

        if (src) {
          views.push(src);
        }
      }

      return views.slice(0, 4);
    }

    /* =====================================================
       BUSCADOR
       ===================================================== */

    function matchesSearch(card) {
      if (!state.search) {
        return true;
      }

      return textOf(card).includes(
        normalize(state.search)
      );
    }

    /* =====================================================
       FILTRO + ORDEN
       ===================================================== */

    function filteredCards() {
      let result = cards.filter(card => {

        const categoria =
          categoryOf(card);

        const coincideCategoria =
          state.category === "todo" ||
          categoria === state.category;

        return (
          coincideCategoria &&
          matchesSearch(card)
        );
      });

      if (state.order === "az") {
        result.sort((a, b) =>
          nameOf(a).localeCompare(
            nameOf(b),
            "es",
            {
              sensitivity: "base"
            }
          )
        );
      }

      else if (state.order === "za") {
        result.sort((a, b) =>
          nameOf(b).localeCompare(
            nameOf(a),
            "es",
            {
              sensitivity: "base"
            }
          )
        );
      }

      else if (state.order === "tamano") {
        result.sort((a, b) =>
          sizeOf(a).localeCompare(
            sizeOf(b),
            "es",
            {
              numeric: true
            }
          )
        );
      }

      return result;
    }

    /* =====================================================
       TABS
       ===================================================== */

    function updateTabs() {

      tabs.forEach(tab => {

        const active =
          normalize(tab.dataset.filtro) ===
          state.category;

        tab.classList.toggle(
          "activo",
          active
        );

        tab.classList.toggle(
          "activo-deportes",
          active
        );

        tab.setAttribute(
          "aria-selected",
          String(active)
        );
      });
    }

    /* =====================================================
       HERO
       ===================================================== */

    function updateHero() {

      const src =
        heroImages[state.category] ||
        heroImages.todo;

      if (heroImage && src) {

        heroImage.src = src;

        heroImage.alt =
          `Diseño destacado de ${
            labels[state.category] ||
            "Deportes"
          }`;
      }

      if (heroTitle) {

        const badge =
          $(".hero-catalogo-badge-deportes",
          heroTitle);

        if (badge) {

          [
            ...heroTitle.childNodes
          ].forEach(node => {

            if (
              node.nodeType ===
              Node.TEXT_NODE
            ) {
              node.remove();
            }
          });

          heroTitle.insertBefore(
            document.createTextNode(
              `${labels[state.category]} `
            ),
            badge
          );

        } else {

          heroTitle.textContent =
            labels[state.category] ||
            "Deportes";
        }
      }

      if (heroTag) {

        heroTag.innerHTML =
          `<i class="fas fa-tag" aria-hidden="true"></i> ${
            labels[state.category] ||
            "Deportes"
          }`;
      }
    }

    /* =====================================================
       APLICAR FILTRO
       ===================================================== */

    function applyFilter() {

      const filtered =
        filteredCards();

      const visible =
        new Set(filtered);

      cards.forEach(card => {

        const show =
          visible.has(card);

        card.hidden =
          !show;

        /*
         * Se fuerza display inline para que
         * ninguna regla CSS antigua interfiera.
         */

        card.style.display =
          show ? "" : "none";

        card.classList.toggle(
          "tarjeta-filtrada-deportes",
          !show
        );

        card.setAttribute(
          "aria-hidden",
          String(!show)
        );
      });

      /*
       * Reordenamos solamente las tarjetas
       * que corresponden al filtro.
       */

      if (grid) {

        filtered.forEach(card =>
          grid.appendChild(card)
        );

        cards
          .filter(card => !visible.has(card))
          .forEach(card =>
            grid.appendChild(card)
          );
      }

      if (empty) {

        empty.hidden =
          visible.size !== 0;
      }

      updateTabs();
      updateHero();
    }

    /* =====================================================
       EVENTOS DE FILTRO
       ===================================================== */

    tabs.forEach(tab => {

      tab.addEventListener(
        "click",
        event => {

          event.preventDefault();

          const value =
            normalize(
              tab.dataset.filtro ||
              "todo"
            );

          const categorias = [
            "todo",
            "futbol",
            "basquetbol",
            "tenis",
            "motor"
          ];

          state.category =
            categorias.includes(value)
              ? value
              : "todo";

          applyFilter();
        }
      );
    });

    /* =====================================================
       BUSCADOR
       ===================================================== */

    search?.addEventListener(
      "input",
      () => {

        state.search =
          search.value;

        applyFilter();
      }
    );

    /* =====================================================
       ORDEN
       ===================================================== */

    order?.addEventListener(
      "change",
      () => {

        state.order =
          order.value ||
          "recientes";

        applyFilter();
      }
    );

    /* =====================================================
       RENDER DEL VISOR
       ===================================================== */

    function renderViewer() {

      if (
        !viewerImage ||
        !state.card ||
        !state.views.length
      ) {
        return;
      }

      const current =
        state.views[state.index];

      const name =
        nameOf(state.card);

      const categoria =
        categoryOf(state.card);

      viewerImage.src =
        current;

      viewerImage.alt =
        `${name} — vista ${
          state.index + 1
        }`;

      if (viewerTitle) {

        viewerTitle.textContent =
          name;
      }

      if (viewerCounter) {

        viewerCounter.textContent =
          `${state.index + 1} / ${
            state.views.length
          }`;
      }

      if (detailsTitle) {

        detailsTitle.textContent =
          name;
      }

      if (detailsDescription) {

        detailsDescription.textContent =
          `Cuadro deportivo en aluminio HD. Diseño: ${name}.`;
      }

      if (detailsCategory) {

        detailsCategory.textContent =
          labels[categoria] ||
          "Deportes";
      }

      /*
       * Las flechas pertenecen exclusivamente
       * al producto abierto.
       */

      if (previous) {

        previous.style.display =
          "flex";

        previous.disabled =
          state.views.length <= 1;

        previous.setAttribute(
          "aria-disabled",
          String(
            state.views.length <= 1
          )
        );
      }

      if (next) {

        next.style.display =
          "flex";

        next.disabled =
          state.views.length <= 1;

        next.setAttribute(
          "aria-disabled",
          String(
            state.views.length <= 1
          )
        );
      }

      /* Medida activa */

      if (measures) {

        $$(
          "[data-medida]",
          measures
        ).forEach(button => {

          button.classList.toggle(
            "activo",
            normalize(
              button.dataset.medida
            ) ===
            normalize(
              sizeOf(state.card)
            )
          );
        });
      }

      /* WhatsApp */

      if (orderButton) {

        const phone =
          String(
            orderButton.dataset.numero ||
            document.body.dataset.whatsapp ||
            ""
          ).replace(/\D/g, "");

        const message =
          `Hola, quiero cotizar el cuadro "${name}" ` +
          `de ${labels[categoria] || "Deportes"}` +
          `${
            sizeOf(state.card)
              ? ` en tamaño ${sizeOf(state.card)}`
              : ""
          }. Vengo desde el catálogo de SublimArts.`;

        orderButton.href =
          phone
            ? `https://wa.me/${phone}?text=${
                encodeURIComponent(message)
              }`
            : `https://wa.me/?text=${
                encodeURIComponent(message)
              }`;
      }
    }

    /* =====================================================
       ABRIR VISOR
       ===================================================== */

    function openViewer(card) {

      const views =
        viewsOf(card);

      if (
        !viewer ||
        !views.length
      ) {
        return;
      }

      state.card =
        card;

      state.views =
        views;

      state.index =
        0;

      if (details) {

        details.hidden =
          true;
      }

      if (detailsButton) {

        detailsButton.textContent =
          "Ver detalles";

        detailsButton.setAttribute(
          "aria-expanded",
          "false"
        );
      }

      renderViewer();

      viewer.classList.add(
        "activo",
        "activo-deportes"
      );

      viewer.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.classList.add(
        "visor-abierto"
      );

      document.body.style.overflow =
        "hidden";

      close?.focus();
    }

    /* =====================================================
       CERRAR VISOR
       ===================================================== */

    function closeViewer() {

      if (!viewer) {
        return;
      }

      viewer.classList.remove(
        "activo",
        "activo-deportes"
      );

      viewer.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.classList.remove(
        "visor-abierto"
      );

      document.body.style.overflow =
        "";

      if (viewerImage) {

        viewerImage.removeAttribute(
          "src"
        );
      }

      state.card =
        null;

      state.views =
        [];

      state.index =
        0;
    }

    /* =====================================================
       CAMBIAR VISTA
       ===================================================== */

    function changeView(direction) {

      /*
       * IMPORTANTE:
       * Nunca se cambia de producto.
       */

      if (
        state.views.length <= 1
      ) {
        return;
      }

      state.index =
        (
          state.index +
          direction +
          state.views.length
        ) %
        state.views.length;

      renderViewer();
    }

    /* =====================================================
       TARJETAS
       ===================================================== */

    cards.forEach(card => {

      card.setAttribute(
        "tabindex",
        "0"
      );

      card.addEventListener(
        "click",
        event => {

          if (
            event.target.closest(
              "a, button"
            )
          ) {
            return;
          }

          openViewer(card);
        }
      );

      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter" ||
            event.key === " "
          ) {

            event.preventDefault();

            openViewer(card);
          }
        }
      );
    });

    /* =====================================================
       BOTONES VISOR
       ===================================================== */

    previous?.addEventListener(
      "click",
      () => changeView(-1)
    );

    next?.addEventListener(
      "click",
      () => changeView(1)
    );

    close?.addEventListener(
      "click",
      closeViewer
    );

    viewer?.addEventListener(
      "click",
      event => {

        if (
          event.target === viewer ||
          event.target.matches(
            ".visor-catalogo-fondo-deportes"
          )
        ) {
          closeViewer();
        }
      }
    );

    /* =====================================================
       DETALLES
       ===================================================== */

    detailsButton?.addEventListener(
      "click",
      () => {

        if (!details) {
          return;
        }

        const open =
          details.hidden;

        details.hidden =
          !open;

        detailsButton.textContent =
          open
            ? "Ocultar detalles"
            : "Ver detalles";

        detailsButton.setAttribute(
          "aria-expanded",
          String(open)
        );
      }
    );

    /* =====================================================
       MEDIDAS
       ===================================================== */

    measures?.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-medida]"
          );

        if (!button) {
          return;
        }

        $$(
          "[data-medida]",
          measures
        ).forEach(item =>
          item.classList.remove(
            "activo"
          )
        );

        button.classList.add(
          "activo"
        );
      }
    );

    /* =====================================================
       SWIPE
       ===================================================== */

    viewer?.addEventListener(
      "touchstart",
      event => {

        const touch =
          event.changedTouches[0];

        if (!touch) {
          return;
        }

        state.touchX =
          touch.clientX;

        state.touchY =
          touch.clientY;

      },
      {
        passive: true
      }
    );

    viewer?.addEventListener(
      "touchend",
      event => {

        const touch =
          event.changedTouches[0];

        if (!touch) {
          return;
        }

        const dx =
          touch.clientX -
          state.touchX;

        const dy =
          touch.clientY -
          state.touchY;

        if (
          Math.abs(dx) < 45 ||
          Math.abs(dx) <= Math.abs(dy)
        ) {
          return;
        }

        changeView(
          dx < 0
            ? 1
            : -1
        );
      },
      {
        passive: true
      }
    );

    /* =====================================================
       TECLADO
       ===================================================== */

    document.addEventListener(
      "keydown",
      event => {

        if (
          !viewer?.classList.contains(
            "activo"
          )
        ) {
          return;
        }

        if (
          event.key === "Escape"
        ) {

          closeViewer();
        }

        if (
          event.key === "ArrowLeft"
        ) {

          event.preventDefault();

          changeView(-1);
        }

        if (
          event.key === "ArrowRight"
        ) {

          event.preventDefault();

          changeView(1);
        }
      }
    );

    /* =====================================================
       MENÚ MÓVIL
       ===================================================== */

    function openMenu() {

      sidebar?.classList.add(
        "activo",
        "activo-deportes"
      );

      overlay?.classList.add(
        "activo",
        "activo-deportes"
      );

      menuButton?.setAttribute(
        "aria-expanded",
        "true"
      );

      menuButton?.setAttribute(
        "aria-label",
        "Cerrar menú"
      );

      document.body.classList.add(
        "menu-mobile-abierto",
        "menu-abierto"
      );

      const icon =
        $("i", menuButton);

      icon?.classList.replace(
        "fa-bars",
        "fa-xmark"
      );
    }

    function closeMenu() {

      sidebar?.classList.remove(
        "activo",
        "activo-deportes"
      );

      overlay?.classList.remove(
        "activo",
        "activo-deportes"
      );

      menuButton?.setAttribute(
        "aria-expanded",
        "false"
      );

      menuButton?.setAttribute(
        "aria-label",
        "Abrir menú"
      );

      document.body.classList.remove(
        "menu-mobile-abierto",
        "menu-abierto"
      );

      const icon =
        $("i", menuButton);

      icon?.classList.replace(
        "fa-xmark",
        "fa-bars"
      );
    }

    menuButton?.addEventListener(
      "click",
      event => {

        event.preventDefault();

        if (
          sidebar?.classList.contains(
            "activo"
          )
        ) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    );

    overlay?.addEventListener(
      "click",
      closeMenu
    );

    $$(".sidebar-enlace-deportes")
      .forEach(link => {

        link.addEventListener(
          "click",
          () => {

            if (
              window.innerWidth <= 900
            ) {
              closeMenu();
            }
          }
        );
      });

    /* =====================================================
       ESC MENÚ
       ===================================================== */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key === "Escape" &&
          sidebar?.classList.contains(
            "activo"
          )
        ) {
          closeMenu();
        }
      }
    );

    /* =====================================================
       WHATSAPP GENERAL
       ===================================================== */

    $$(".boton-whatsapp-deportes")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const phone =
              String(
                button.dataset.numero ||
                document.body.dataset.whatsapp ||
                ""
              ).replace(
                /\D/g,
                ""
              );

            const service =
              button.dataset.servicio ||
              "Cuadros deportivos";

            const message =
              `Hola, quiero consultar por ${service}.`;

            button.href =
              phone
                ? `https://wa.me/${phone}?text=${
                    encodeURIComponent(
                      message
                    )
                  }`
                : `https://wa.me/?text=${
                    encodeURIComponent(
                      message
                    )
                  }`;

            button.target =
              "_blank";

            button.rel =
              "noopener noreferrer";
          }
        );
      });

    /* =====================================================
       BARRA DE FILTRO FIJA
       ===================================================== */

    if (filterBar) {

      const placeholder =
        document.createElement(
          "div"
        );

      placeholder.className =
        "barra-filtros-placeholder-deportes";

      filterBar.parentNode.insertBefore(
        placeholder,
        filterBar
      );

      let top = 0;
      let fixed = false;

      function fix() {

        fixed = true;

        filterBar.classList.add(
          "filtro-fijo",
          "filtro-fijo-deportes"
        );

        placeholder.style.height =
          `${filterBar.offsetHeight}px`;

        placeholder.classList.add(
          "activo"
        );
      }

      function release() {

        fixed = false;

        filterBar.classList.remove(
          "filtro-fijo",
          "filtro-fijo-deportes"
        );

        placeholder.classList.remove(
          "activo"
        );

        placeholder.style.height =
          "0px";
      }

      function measure() {

        const wasFixed =
          fixed;

        if (wasFixed) {
          release();
        }

        top =
          filterBar.getBoundingClientRect()
            .top +
          window.scrollY;

        if (
          wasFixed &&
          window.scrollY >= top
        ) {
          fix();
        }
      }

      function update() {

        if (
          window.scrollY >= top
        ) {
          fix();
        } else {
          release();
        }
      }

      measure();
      update();

      window.addEventListener(
        "scroll",
        update,
        {
          passive: true
        }
      );

      window.addEventListener(
        "resize",
        measure
      );
    }

    /* =====================================================
       INICIO
       ===================================================== */

    applyFilter();

  });

})();