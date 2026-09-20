document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       CONFIGURACIÓN
    ========================================================= */

    const WHATSAPP = "56900000000";
    const MOBILE_BREAKPOINT = 900;
    const body = document.body;


    /* =========================================================
       ELEMENTOS PRINCIPALES
    ========================================================= */

    const grid =
        document.querySelector(".grid-catalogo-anime-gamer") ||
        document.getElementById("grid-catalogo-anime-gamer");

    const barraFiltros =
        document.querySelector(".barra-filtros-anime-gamer");

    const buscador =
        document.getElementById("buscadorCatalogo-anime-gamer") ||
        barraFiltros?.querySelector("input[type='search']") ||
        barraFiltros?.querySelector("input[type='text']");

    const orden =
        document.getElementById("ordenCatalogo-anime-gamer") ||
        barraFiltros?.querySelector("select");

    const tabs = Array.from(
        document.querySelectorAll(
            ".barra-filtros-anime-gamer .tab-categoria-anime-gamer"
        )
    );

    const vacio =
        document.querySelector(".grid-catalogo-vacio-anime-gamer") ||
        document.querySelector(".catalogo-vacio") ||
        document.querySelector(".sin-resultados");


    /* =========================================================
       MENÚ MOBILE
    ========================================================= */

    const sidebar =
        document.getElementById("sidebar-anime-gamer");

    const sidebarToggle =
        document.getElementById("sidebarToggle-anime-gamer");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay-anime-gamer");


    function esMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }


    function actualizarMenu(abierto) {

        if (!sidebar || !sidebarToggle) {
            return;
        }

        const mobile = esMobile();

        /*
         * IMPORTANTE:
         * animeGamer.css utiliza .activo.
         */
        sidebar.classList.toggle(
            "activo",
            abierto && mobile
        );

        sidebarToggle.setAttribute(
            "aria-expanded",
            String(abierto && mobile)
        );

        sidebarToggle.setAttribute(
            "aria-label",
            abierto && mobile
                ? "Cerrar menú"
                : "Abrir menú"
        );

        sidebar.setAttribute(
            "aria-hidden",
            mobile
                ? String(!(abierto && mobile))
                : "false"
        );

        if (sidebarOverlay) {

            sidebarOverlay.classList.toggle(
                "activo",
                abierto && mobile
            );

            sidebarOverlay.setAttribute(
                "aria-hidden",
                String(!(abierto && mobile))
            );
        }

        const icono =
            sidebarToggle.querySelector("i");

        if (icono) {

            icono.classList.toggle(
                "fa-bars",
                !(abierto && mobile)
            );

            icono.classList.toggle(
                "fa-xmark",
                abierto && mobile
            );

            icono.classList.toggle(
                "fa-times",
                abierto && mobile
            );
        }

        body.classList.toggle(
            "menu-mobile-abierto",
            abierto && mobile
        );
    }


    function cerrarMenu() {
        actualizarMenu(false);
    }


    if (sidebarToggle) {

        sidebarToggle.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const abierto =
                    sidebar?.classList.contains("activo") || false;

                actualizarMenu(!abierto);
            }
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            event => {

                event.preventDefault();
                cerrarMenu();
            }
        );
    }


    if (sidebar) {

        sidebar
            .querySelectorAll("a")
            .forEach(enlace => {

                enlace.addEventListener(
                    "click",
                    () => {

                        if (esMobile()) {
                            cerrarMenu();
                        }
                    }
                );
            });
    }


    /* =========================================================
       FILTROS
    ========================================================= */

    let filtroActual = "todos";


    function normalizar(valor) {

        return String(valor || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
    }


    function obtenerTarjetas() {

        if (!grid) {
            return [];
        }

        return Array.from(
            grid.querySelectorAll(
                ".tarjeta-cuadro-anime-gamer"
            )
        );
    }


    function obtenerCategoria(tarjeta) {

        return normalizar(
            tarjeta.dataset.categoria ||
            tarjeta.dataset.category ||
            tarjeta.dataset.vehiculo ||
            ""
        );
    }


    function obtenerNombre(tarjeta) {

        return normalizar(
            tarjeta.dataset.nombre ||
            tarjeta.querySelector("h2, h3, h4")?.textContent ||
            ""
        );
    }


    function aplicarFiltros() {

        const tarjetas = obtenerTarjetas();

        const texto =
            normalizar(
                buscador?.value || ""
            );

        const filtro =
            normalizar(filtroActual);

        let visibles = 0;


        tarjetas.forEach(tarjeta => {

            const categoria =
                obtenerCategoria(tarjeta);

            const nombre =
                obtenerNombre(tarjeta);

            const contenido =
                normalizar(tarjeta.textContent);


            const coincideCategoria =
                filtro === "todos" ||
                filtro === "todo" ||
                !filtro ||
                categoria === filtro;


            const coincideBusqueda =
                !texto ||
                nombre.includes(texto) ||
                categoria.includes(texto) ||
                contenido.includes(texto);


            const mostrar =
                coincideCategoria &&
                coincideBusqueda;


            tarjeta.hidden = !mostrar;

            tarjeta.classList.toggle(
                "oculto-por-filtro-anime-gamer",
                !mostrar
            );

            tarjeta.classList.toggle(
                "tarjeta-filtrada-anime-gamer",
                !mostrar
            );


            if (mostrar) {
                visibles++;
            }
        });


        if (vacio) {
            vacio.hidden = visibles !== 0;
        }
    }


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            event => {

                event.preventDefault();

                let valor =
                    tab.dataset.filtro ||
                    tab.dataset.categoria ||
                    tab.textContent ||
                    "todos";

                valor = normalizar(valor);

                if (
                    valor === "todo" ||
                    valor === "todos" ||
                    !valor
                ) {
                    filtroActual = "todos";
                } else {
                    filtroActual = valor;
                }


                tabs.forEach(item => {

                    const activo =
                        item === tab;

                    /*
                     * animeGamer.css utiliza .activo.
                     */
                    item.classList.toggle(
                        "activo",
                        activo
                    );

                    item.classList.toggle(
                        "active",
                        activo
                    );

                    item.setAttribute(
                        "aria-selected",
                        activo
                            ? "true"
                            : "false"
                    );
                });


                aplicarFiltros();
            }
        );
    });


    if (buscador) {

        buscador.addEventListener(
            "input",
            aplicarFiltros
        );
    }


    /* =========================================================
       ORDENAMIENTO
    ========================================================= */

    if (orden) {

        orden.addEventListener(
            "change",
            () => {

                if (!grid) {
                    return;
                }

                const tarjetas =
                    obtenerTarjetas();

                const valor =
                    normalizar(orden.value);


                if (
                    valor === "az" ||
                    valor === "nombre-az"
                ) {

                    tarjetas.sort(
                        (a, b) =>
                            obtenerNombre(a)
                                .localeCompare(
                                    obtenerNombre(b),
                                    "es"
                                )
                    );

                } else if (
                    valor === "za" ||
                    valor === "nombre-za"
                ) {

                    tarjetas.sort(
                        (a, b) =>
                            obtenerNombre(b)
                                .localeCompare(
                                    obtenerNombre(a),
                                    "es"
                                )
                    );
                }


                tarjetas.forEach(tarjeta => {
                    grid.appendChild(tarjeta);
                });


                aplicarFiltros();
                recalcularBarraFiltros();
            }
        );
    }


    /* =========================================================
       BARRA DE FILTROS FIJA
    ========================================================= */

    let posicionOriginalBarra = 0;
    let alturaBarra = 0;
    let barraPlaceholder = null;
    let barraEstaFija = false;


    function obtenerAlturaTopbar() {

        if (!esMobile()) {
            return 0;
        }

        const topbar =
            document.getElementById(
                "mobileTopbar-anime-gamer"
            );

        if (topbar) {

            const altura =
                topbar.getBoundingClientRect().height;

            if (altura > 0) {
                return Math.ceil(altura);
            }
        }

        return window.innerWidth <= 480
            ? 68
            : 72;
    }


    function crearPlaceholder() {

        if (
            !barraFiltros ||
            barraPlaceholder
        ) {
            return;
        }

        barraPlaceholder =
            document.createElement("div");

        barraPlaceholder.className =
            "barra-filtros-placeholder-anime-gamer";

        barraPlaceholder.setAttribute(
            "aria-hidden",
            "true"
        );

        barraFiltros.parentNode.insertBefore(
            barraPlaceholder,
            barraFiltros
        );
    }


    function medirBarra() {

        if (!barraFiltros) {
            return;
        }

        const rect =
            barraFiltros.getBoundingClientRect();

        alturaBarra =
            Math.ceil(rect.height);

        if (barraPlaceholder) {

            const estilos =
                window.getComputedStyle(
                    barraFiltros
                );

            const marginTop =
                parseFloat(
                    estilos.marginTop
                ) || 0;

            const marginBottom =
                parseFloat(
                    estilos.marginBottom
                ) || 0;

            barraPlaceholder.style.height =
                `${alturaBarra + marginTop + marginBottom}px`;
        }
    }


    function obtenerPosicionOriginal() {

        if (!barraFiltros) {
            return;
        }

        const estabaFija =
            barraEstaFija;

        if (estabaFija) {

            barraFiltros.classList.remove(
                "filtro-fijo"
            );

            barraEstaFija = false;
        }

        if (barraPlaceholder) {

            barraPlaceholder.classList.remove(
                "activo"
            );

            barraPlaceholder.style.height =
                "";
        }

        const rect =
            barraFiltros.getBoundingClientRect();

        posicionOriginalBarra =
            rect.top + window.scrollY;

        medirBarra();
    }


    function fijarBarra() {

        if (
            !barraFiltros ||
            barraEstaFija
        ) {
            return;
        }

        crearPlaceholder();
        medirBarra();

        /*
         * animeGamer.css utiliza .filtro-fijo.
         */
        barraFiltros.classList.add(
            "filtro-fijo"
        );

        if (barraPlaceholder) {

            barraPlaceholder.style.height =
                `${alturaBarra}px`;

            barraPlaceholder.classList.add(
                "activo"
            );
        }

        barraEstaFija = true;
    }


    function liberarBarra() {

        if (
            !barraFiltros ||
            !barraEstaFija
        ) {
            return;
        }

        barraFiltros.classList.remove(
            "filtro-fijo"
        );

        if (barraPlaceholder) {

            barraPlaceholder.classList.remove(
                "activo"
            );

            barraPlaceholder.style.height =
                "";
        }

        barraEstaFija = false;
    }


    function actualizarBarraFiltros() {

        if (!barraFiltros) {
            return;
        }

        crearPlaceholder();

        const offset =
            obtenerAlturaTopbar();

        const umbral =
            posicionOriginalBarra - offset;


        if (window.scrollY >= umbral) {

            fijarBarra();

        } else {

            liberarBarra();
        }


        if (barraEstaFija) {
            medirBarra();
        }
    }


    function recalcularBarraFiltros() {

        if (!barraFiltros) {
            return;
        }

        crearPlaceholder();

        obtenerPosicionOriginal();

        actualizarBarraFiltros();
    }


    if (barraFiltros) {

        crearPlaceholder();

        requestAnimationFrame(
            recalcularBarraFiltros
        );

        window.addEventListener(
            "scroll",
            actualizarBarraFiltros,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            () => {
                requestAnimationFrame(
                    recalcularBarraFiltros
                );
            }
        );

        window.addEventListener(
            "orientationchange",
            () => {

                setTimeout(
                    recalcularBarraFiltros,
                    200
                );
            }
        );

        window.addEventListener(
            "load",
            recalcularBarraFiltros
        );
    }


    /* =========================================================
       WHATSAPP
    ========================================================= */

    function generarWhatsApp(servicio = "general") {

        const mensajes = {

            general:
                "Hola SublimArts, quisiera hacer una consulta.",

            "Anime & Gamer":
                "Hola SublimArts, quisiera cotizar un cuadro de Anime & Gamer.",

            "Tu foto, tu cuadro":
                "Hola SublimArts, quisiera consultar por un cuadro personalizado con mi propia foto.",

            "Cuadros personalizados":
                "Hola SublimArts, quisiera consultar por un cuadro personalizado."
        };


        const mensaje =
            mensajes[servicio] ||
            `Hola SublimArts, quisiera consultar por ${servicio}.`;


        return (
            `https://wa.me/${WHATSAPP}` +
            `?text=${encodeURIComponent(mensaje)}`
        );
    }


    document
        .querySelectorAll(
            ".boton-whatsapp-anime-gamer"
        )
        .forEach(boton => {

            boton.addEventListener(
                "click",
                event => {

                    event.preventDefault();

                    const servicio =
                        boton.dataset.servicio ||
                        "general";

                    const url =
                        generarWhatsApp(servicio);

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );
                }
            );
        });


    /* =========================================================
       MODAL / VISOR
    ========================================================= */

    const visor =
        document.getElementById(
            "visorCatalogo-anime-gamer"
        );

    const visorImagen =
        document.getElementById(
            "visorImagen-anime-gamer"
        );

    const visorCerrar =
        document.getElementById(
            "visorCerrar-anime-gamer"
        );

    const visorAnterior =
        document.getElementById(
            "visorAnterior-anime-gamer"
        );

    const visorSiguiente =
        document.getElementById(
            "visorSiguiente-anime-gamer"
        );

    const visorTitulo =
        document.getElementById(
            "visorTitulo-anime-gamer"
        );

    const visorContador =
        document.getElementById(
            "visorContador-anime-gamer"
        );

    const visorDetallesBtn =
        document.getElementById(
            "visorVerDetalles-anime-gamer"
        );

    const visorDetalles =
        document.getElementById(
            "visorDetalles-anime-gamer"
        );

    const visorDetallesTitulo =
        document.getElementById(
            "visorDetallesTitulo-anime-gamer"
        );

    const visorDetallesDescripcion =
        document.getElementById(
            "visorDetallesDescripcion-anime-gamer"
        );

    const visorDetallesCategoria =
        document.getElementById(
            "visorDetallesCategoria-anime-gamer"
        );

    const visorMedidas =
        document.getElementById(
            "visorMedidas-anime-gamer"
        );

    const visorEncargar =
        document.getElementById(
            "visorEncargar-anime-gamer"
        );


    let tarjetaActual = null;
    let vistasActuales = [];
    let indiceVista = 0;


    /* =========================================================
       OBTENER LAS 4 VISTAS DEL PRODUCTO
    ========================================================= */

    function obtenerVistas(tarjeta) {

        if (!tarjeta) {
            return [];
        }

        const vistas = [];


        for (
            let i = 1;
            i <= 4;
            i++
        ) {

            const vista =
                tarjeta.getAttribute(
                    `data-view-${i}`
                );

            if (
                vista &&
                vista.trim()
            ) {

                vistas.push(
                    vista.trim()
                );
            }
        }


        /*
         * Respaldo por si una tarjeta no tiene
         * data-view.
         */
        if (!vistas.length) {

            const imagen =
                tarjeta.querySelector(
                    "img"
                );

            if (imagen?.src) {
                vistas.push(imagen.src);
            }
        }


        return vistas;
    }


    /* =========================================================
       DESCRIPCIÓN
    ========================================================= */

    function obtenerDescripcion(tarjeta) {

        if (!tarjeta) {
            return "";
        }

        const nombre =
            tarjeta.dataset.nombre ||
            "Cuadro";

        const categoria =
            tarjeta.dataset.categoria ||
            tarjeta.dataset.vehiculo ||
            "Anime & Gamer";

        const meta =
            tarjeta.querySelector(
                ".tarjeta-meta-anime-gamer"
            )?.textContent?.trim() ||
            "";


        return (
            `${nombre}. ` +
            `${meta || `Diseño de ${categoria} en aluminio HD.`}`
        );
    }


    /* =========================================================
       WHATSAPP DEL MODAL
    ========================================================= */

    function actualizarWhatsAppModal(
        medidaPersonalizada = ""
    ) {

        if (
            !visorEncargar ||
            !tarjetaActual
        ) {
            return;
        }

        const nombre =
            tarjetaActual.dataset.nombre ||
            "este cuadro";

        const categoria =
            tarjetaActual.dataset.categoria ||
            "Anime & Gamer";

        const medida =
            medidaPersonalizada ||
            tarjetaActual.dataset.tamano ||
            "a consultar";


        const mensaje =
            `Hola SublimArts, quisiera cotizar ` +
            `el cuadro "${nombre}" en tamaño ${medida}. ` +
            `Categoría: ${categoria}.`;


        visorEncargar.href =
            `https://wa.me/${WHATSAPP}` +
            `?text=${encodeURIComponent(mensaje)}`;
    }


    /* =========================================================
       DETALLES DEL MODAL
    ========================================================= */

    function actualizarDetalles() {

        if (!tarjetaActual) {
            return;
        }

        const nombre =
            tarjetaActual.dataset.nombre ||
            "Cuadro";

        const categoria =
            tarjetaActual.dataset.categoria ||
            tarjetaActual.dataset.vehiculo ||
            "Anime & Gamer";

        const tamano =
            normalizar(
                tarjetaActual.dataset.tamano ||
                ""
            );


        if (visorDetallesTitulo) {

            visorDetallesTitulo.textContent =
                nombre;
        }


        if (visorDetallesDescripcion) {

            visorDetallesDescripcion.textContent =
                obtenerDescripcion(
                    tarjetaActual
                );
        }


        if (visorDetallesCategoria) {

            visorDetallesCategoria.textContent =
                categoria;
        }


        if (visorMedidas) {

            visorMedidas
                .querySelectorAll(
                    "[data-medida]"
                )
                .forEach(boton => {

                    const medida =
                        normalizar(
                            boton.dataset.medida
                        );

                    boton.classList.toggle(
                        "activo",
                        medida === tamano
                    );
                });
        }
    }


    /* =========================================================
       ACTUALIZAR IMAGEN DEL MODAL
    ========================================================= */

    function actualizarVisor() {

        if (
            !visorImagen ||
            !vistasActuales.length ||
            !tarjetaActual
        ) {
            return;
        }

        const imagen =
            vistasActuales[indiceVista];


        visorImagen.src =
            imagen;

        visorImagen.alt =
            `${tarjetaActual.dataset.nombre || "Cuadro"} — vista ${indiceVista + 1}`;


        if (visorTitulo) {

            visorTitulo.textContent =
                tarjetaActual.dataset.nombre ||
                "Cuadro";
        }


        if (visorContador) {

            visorContador.textContent =
                `${indiceVista + 1} / ${vistasActuales.length}`;
        }


        const deshabilitado =
            vistasActuales.length <= 1;


        if (visorAnterior) {

            visorAnterior.disabled =
                deshabilitado;

            visorAnterior.setAttribute(
                "aria-disabled",
                String(deshabilitado)
            );
        }


        if (visorSiguiente) {

            visorSiguiente.disabled =
                deshabilitado;

            visorSiguiente.setAttribute(
                "aria-disabled",
                String(deshabilitado)
            );
        }
    }


    /* =========================================================
       ABRIR MODAL
    ========================================================= */

    function abrirVisor(tarjeta) {

        if (
            !visor ||
            !tarjeta
        ) {
            return;
        }


        tarjetaActual =
            tarjeta;


        /*
         * MUY IMPORTANTE:
         *
         * Solo se leen las vistas de ESTA tarjeta.
         * Nunca se mezclan imágenes de otros productos.
         */
        vistasActuales =
            obtenerVistas(
                tarjeta
            );


        indiceVista = 0;


        if (!vistasActuales.length) {
            return;
        }


        actualizarVisor();
        actualizarDetalles();
        actualizarWhatsAppModal();


        if (visorDetalles) {

            visorDetalles.hidden =
                true;

            visorDetalles.classList.remove(
                "abierto-anime-gamer"
            );
        }


        if (visorDetallesBtn) {

            visorDetallesBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        /*
         * animeGamer.css utiliza .activo.
         */
        visor.classList.add(
            "activo"
        );

        visor.setAttribute(
            "aria-hidden",
            "false"
        );

        body.classList.add(
            "visor-abierto"
        );

        body.style.overflow =
            "hidden";


        visorCerrar?.focus();
    }


    /* =========================================================
       CERRAR MODAL
    ========================================================= */

    function cerrarVisor() {

        if (!visor) {
            return;
        }


        visor.classList.remove(
            "activo"
        );

        visor.setAttribute(
            "aria-hidden",
            "true"
        );


        body.classList.remove(
            "visor-abierto"
        );

        body.style.overflow =
            "";


        if (visorDetalles) {

            visorDetalles.hidden =
                true;

            visorDetalles.classList.remove(
                "abierto-anime-gamer"
            );
        }


        if (visorDetallesBtn) {

            visorDetallesBtn.setAttribute(
                "aria-expanded",
                "false"
            );
        }


        tarjetaActual =
            null;

        vistasActuales =
            [];

        indiceVista =
            0;
    }


    /* =========================================================
       CAMBIAR VISTA
    ========================================================= */

    function cambiarVista(direccion) {

        if (
            vistasActuales.length <= 1
        ) {
            return;
        }


        indiceVista +=
            direccion;


        if (
            indiceVista < 0
        ) {

            indiceVista =
                vistasActuales.length - 1;
        }


        if (
            indiceVista >=
            vistasActuales.length
        ) {

            indiceVista = 0;
        }


        actualizarVisor();
    }


    /* =========================================================
       ABRIR MODAL DESDE LAS TARJETAS
    ========================================================= */

    if (grid) {

        grid.addEventListener(
            "click",
            event => {

                const media =
                    event.target.closest(
                        ".tarjeta-cuadro-media-anime-gamer"
                    );

                if (!media) {
                    return;
                }


                const tarjeta =
                    media.closest(
                        ".tarjeta-cuadro-anime-gamer"
                    );

                if (!tarjeta) {
                    return;
                }


                event.preventDefault();

                abrirVisor(
                    tarjeta
                );
            }
        );
    }


    /* =========================================================
       CERRAR MODAL
    ========================================================= */

    visorCerrar?.addEventListener(
        "click",
        cerrarVisor
    );


    if (visor) {

        visor.addEventListener(
            "click",
            event => {

                if (
                    event.target === visor ||
                    event.target.closest(
                        "[data-visor-cerrar]"
                    )
                ) {

                    cerrarVisor();
                }
            }
        );
    }


    /* =========================================================
       FLECHAS DEL MODAL
    ========================================================= */

    visorAnterior?.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            cambiarVista(-1);
        }
    );


    visorSiguiente?.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            cambiarVista(1);
        }
    );


    /* =========================================================
       BOTÓN VER DETALLES
    ========================================================= */

    if (visorDetallesBtn) {

        visorDetallesBtn.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                if (!visorDetalles) {
                    return;
                }


                const abierto =
                    !visorDetalles.hidden;


                if (abierto) {

                    visorDetalles.hidden =
                        true;

                    visorDetalles.classList.remove(
                        "abierto-anime-gamer"
                    );

                    visorDetallesBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                } else {

                    actualizarDetalles();

                    visorDetalles.hidden =
                        false;

                    visorDetalles.classList.add(
                        "abierto-anime-gamer"
                    );

                    visorDetallesBtn.setAttribute(
                        "aria-expanded",
                        "true"
                    );
                }
            }
        );
    }


    /* =========================================================
       MEDIDAS
    ========================================================= */

    if (visorMedidas) {

        visorMedidas
            .querySelectorAll(
                "[data-medida]"
            )
            .forEach(boton => {

                boton.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();

                        if (!tarjetaActual) {
                            return;
                        }


                        const medida =
                            boton.dataset.medida ||
                            "";


                        visorMedidas
                            .querySelectorAll(
                                "[data-medida]"
                            )
                            .forEach(item => {

                                item.classList.toggle(
                                    "activo",
                                    item === boton
                                );
                            });


                        actualizarWhatsAppModal(
                            medida
                        );
                    }
                );
            });
    }


    /* =========================================================
       TECLADO
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            /*
             * ESCAPE — MENÚ MOBILE
             */
            if (
                event.key === "Escape" &&
                sidebar?.classList.contains("activo")
            ) {

                event.preventDefault();

                cerrarMenu();

                sidebarToggle?.focus();

                return;
            }


            /*
             * Si el modal está abierto,
             * el teclado controla el modal.
             */
            if (
                !visor?.classList.contains("activo")
            ) {
                return;
            }


            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                cerrarVisor();

            } else if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                cambiarVista(-1);

            } else if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                cambiarVista(1);
            }
        }
    );


    /* =========================================================
       SWIPE MOBILE
    ========================================================= */

    let touchStartX = 0;
    let touchStartY = 0;


    if (visor) {

        visor.addEventListener(
            "touchstart",
            event => {

                const touch =
                    event.changedTouches[0];

                if (!touch) {
                    return;
                }

                touchStartX =
                    touch.clientX;

                touchStartY =
                    touch.clientY;
            },
            {
                passive: true
            }
        );


        visor.addEventListener(
            "touchend",
            event => {

                const touch =
                    event.changedTouches[0];

                if (!touch) {
                    return;
                }


                const diferenciaX =
                    touch.clientX -
                    touchStartX;

                const diferenciaY =
                    touch.clientY -
                    touchStartY;


                /*
                 * Solo desplazamiento horizontal.
                 */
                if (
                    Math.abs(diferenciaX) > 50 &&
                    Math.abs(diferenciaX) >
                    Math.abs(diferenciaY)
                ) {

                    cambiarVista(
                        diferenciaX < 0
                            ? 1
                            : -1
                    );
                }
            },
            {
                passive: true
            }
        );
    }


    /* =========================================================
       ESTADO INICIAL
    ========================================================= */

    if (sidebar) {

        sidebar.setAttribute(
            "aria-hidden",
            esMobile()
                ? "true"
                : "false"
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.classList.remove(
            "activo"
        );

        sidebarOverlay.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    if (sidebarToggle) {

        sidebarToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        sidebarToggle.setAttribute(
            "aria-label",
            "Abrir menú"
        );
    }


    /*
     * Todos activo inicialmente.
     */
    tabs.forEach(tab => {

        const valor =
            normalizar(
                tab.dataset.filtro ||
                tab.dataset.categoria ||
                tab.textContent
            );

        const activo =
            valor === "todo" ||
            valor === "todos";


        tab.classList.toggle(
            "activo",
            activo
        );

        tab.classList.toggle(
            "active",
            activo
        );

        tab.setAttribute(
            "aria-selected",
            activo
                ? "true"
                : "false"
        );
    });


    filtroActual =
        "todos";


    aplicarFiltros();


    if (visor) {

        visor.classList.remove(
            "activo"
        );

        visor.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    /*
     * Recalcular después del render.
     */
    requestAnimationFrame(
        recalcularBarraFiltros
    );

});