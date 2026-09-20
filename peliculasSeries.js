document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       CONFIGURACIÓN
    ========================================================= */

    const WHATSAPP = "56900000000";


    /* =========================================================
       ELEMENTOS GENERALES
    ========================================================= */

    const body = document.body;

    const grid =
        document.querySelector(".grid-catalogo-peliculas-series") ||
        document.getElementById("grid-catalogo-peliculas-series");

    const barraFiltros =
        document.querySelector(".barra-filtros-peliculas-series");

    const buscador =
        document.querySelector(
            ".barra-filtros-peliculas-series input[type='search']"
        ) ||
        document.querySelector(
            ".barra-filtros-peliculas-series input[type='text']"
        ) ||
        document.getElementById("buscadorCatalogo-peliculas-series");

    const orden =
        document.querySelector(
            ".barra-filtros-peliculas-series select"
        ) ||
        document.getElementById("ordenCatalogo-peliculas-series");

    /*
     * IMPORTANTE:
     * Los tabs se buscan SOLO dentro de la barra de filtros.
     * Esto evita que otros elementos con data-filtro
     * interfieran con el funcionamiento.
     */
    const tabs = Array.from(
        document.querySelectorAll(
            ".barra-filtros-peliculas-series .tab-categoria-peliculas-series"
        )
    );

    const vacio =
        document.querySelector(
            ".catalogo-vacio-peliculas-series"
        ) ||
        document.querySelector(
            ".sin-resultados-peliculas-series"
        ) ||
        document.querySelector(
            ".grid-catalogo-vacio-peliculas-series"
        ) ||
        document.getElementById(
            "catalogoVacio-peliculas-series"
        );


    /* =========================================================
       MENÚ MOBILE
    ========================================================= */

    const sidebar =
        document.getElementById(
            "sidebar-peliculas-series"
        );

    const sidebarToggle =
        document.getElementById(
            "sidebarToggle-peliculas-series"
        );

    const sidebarOverlay =
        document.getElementById(
            "sidebarOverlay-peliculas-series"
        );


    function actualizarEstadoMenuMobile(abierto) {

        if (!sidebar || !sidebarToggle) {
            return;
        }

        const mobile =
            window.innerWidth <= 900;

        sidebar.classList.toggle(
            "activo",
            abierto
        );

        sidebar.setAttribute(
            "aria-hidden",
            mobile
                ? String(!abierto)
                : "false"
        );

        sidebarToggle.setAttribute(
            "aria-expanded",
            String(abierto)
        );

        sidebarToggle.setAttribute(
            "aria-label",
            abierto
                ? "Cerrar menú"
                : "Abrir menú"
        );

        if (sidebarOverlay) {

            sidebarOverlay.classList.toggle(
                "activo",
                abierto
            );

            sidebarOverlay.setAttribute(
                "aria-hidden",
                String(!abierto)
            );
        }

        const icono =
            sidebarToggle.querySelector("i");

        if (icono) {

            icono.classList.toggle(
                "fa-bars",
                !abierto
            );

            icono.classList.toggle(
                "fa-xmark",
                abierto
            );

            icono.classList.toggle(
                "fa-times",
                abierto
            );
        }

        body.classList.toggle(
            "menu-mobile-abierto",
            abierto && mobile
        );
    }


    function cerrarMenuMobile() {
        actualizarEstadoMenuMobile(false);
    }


    if (sidebarToggle) {

        sidebarToggle.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();

                const abierto =
                    sidebar?.classList.contains(
                        "activo"
                    ) ||
                    false;

                actualizarEstadoMenuMobile(
                    !abierto
                );
            }
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            event => {

                event.preventDefault();

                cerrarMenuMobile();
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

                        if (
                            window.innerWidth <= 900
                        ) {
                            cerrarMenuMobile();
                        }
                    }
                );
            });
    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                sidebar?.classList.contains(
                    "activo"
                )
            ) {

                cerrarMenuMobile();

                sidebarToggle?.focus();
            }
        }
    );


    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 900 &&
                sidebar?.classList.contains("activo")
            ) {
                cerrarMenuMobile();
            }
        }
    );


    /* =========================================================
       FILTROS
    ========================================================= */

    let filtroActual = "todos";


    function normalizar(valor) {

        return String(valor || "")
            .trim()
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );
    }


    function obtenerTarjetas() {

        if (!grid) {
            return [];
        }

        return Array.from(
            grid.querySelectorAll(
                ".tarjeta-cuadro-peliculas-series"
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
            tarjeta.querySelector(
                "h2, h3, h4"
            )?.textContent ||
            ""
        );
    }


    function aplicarFiltros() {

        const tarjetas =
            obtenerTarjetas();

        const textoBusqueda =
            normalizar(
                buscador?.value || ""
            );

        const filtro =
            normalizar(
                filtroActual
            );

        let visibles = 0;


        tarjetas.forEach(tarjeta => {

            const categoria =
                obtenerCategoria(
                    tarjeta
                );

            const nombre =
                obtenerNombre(
                    tarjeta
                );

            const contenido =
                normalizar(
                    tarjeta.textContent
                );


            const coincideCategoria =
                filtro === "todos" ||
                filtro === "todo" ||
                !filtro ||
                categoria === filtro ||
                categoria.includes(filtro);


            const coincideBusqueda =
                !textoBusqueda ||
                nombre.includes(
                    textoBusqueda
                ) ||
                categoria.includes(
                    textoBusqueda
                ) ||
                contenido.includes(
                    textoBusqueda
                );


            const mostrar =
                coincideCategoria &&
                coincideBusqueda;


            tarjeta.hidden =
                !mostrar;


            tarjeta.classList.toggle(
                "oculto-por-filtro-peliculas-series",
                !mostrar
            );

            tarjeta.classList.toggle(
                "tarjeta-filtrada-peliculas-series",
                !mostrar
            );


            if (mostrar) {
                visibles++;
            }
        });


        if (vacio) {

            vacio.hidden =
                visibles > 0;
        }
    }


    tabs.forEach(tab => {

        tab.addEventListener(
            "click",
            event => {

                event.preventDefault();

                const valor =
                    tab.dataset.filtro ||
                    tab.dataset.categoria ||
                    tab.textContent ||
                    "todos";


                filtroActual =
                    normalizar(
                        valor
                    );


                if (
                    filtroActual === "todo" ||
                    filtroActual === "todos" ||
                    !filtroActual
                ) {

                    filtroActual =
                        "todos";
                }


                tabs.forEach(item => {

                    const activo =
                        item === tab;

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
                    normalizar(
                        orden.value
                    );


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


                tarjetas.forEach(
                    tarjeta => {

                        grid.appendChild(
                            tarjeta
                        );
                    }
                );


                aplicarFiltros();

                recalcularBarraFiltros();
            }
        );
    }


    /* =========================================================
       BARRA DE FILTROS FIJA
       
       La barra conserva su posición original.
       Cuando alcanza el límite superior pasa a fixed.
       
       El placeholder mantiene el espacio original para
       evitar saltos del contenido.
    ========================================================= */

    let alturaBarra = 0;
    let posicionOriginalBarra = 0;
    let barraPlaceholder = null;
    let barraEstaFija = false;


    function obtenerAlturaCabeceraMobile() {

        if (window.innerWidth > 900) {
            return 0;
        }

        const topbar =
            document.getElementById(
                "mobileTopbar-peliculas-series"
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


    function crearPlaceholderBarra() {

        if (
            !barraFiltros ||
            barraPlaceholder
        ) {
            return;
        }

        barraPlaceholder =
            document.createElement(
                "div"
            );

        barraPlaceholder.className =
            "barra-filtros-placeholder-peliculas-series";

        barraPlaceholder.setAttribute(
            "aria-hidden",
            "true"
        );

        barraFiltros.parentNode?.insertBefore(
            barraPlaceholder,
            barraFiltros
        );
    }


    function medirBarraFiltros() {

        if (!barraFiltros) {
            return;
        }

        const rect =
            barraFiltros.getBoundingClientRect();

        alturaBarra =
            Math.ceil(
                rect.height
            );

        const estilos =
            window.getComputedStyle(
                barraFiltros
            );

        const margenSuperior =
            parseFloat(
                estilos.marginTop
            ) || 0;

        const margenInferior =
            parseFloat(
                estilos.marginBottom
            ) || 0;


        if (barraPlaceholder) {

            barraPlaceholder.style.height =
                `${
                    alturaBarra +
                    margenSuperior +
                    margenInferior
                }px`;
        }
    }


    function calcularPosicionOriginalBarra() {

        if (!barraFiltros) {
            return;
        }

        const estabaFija =
            barraEstaFija;

        if (estabaFija) {

            barraFiltros.classList.remove(
                "filtro-fijo"
            );

            barraEstaFija =
                false;
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
            rect.top +
            window.scrollY;

        medirBarraFiltros();

        if (estabaFija) {
            actualizarBarraFiltros();
        }
    }


    function fijarBarraFiltros() {

        if (
            !barraFiltros ||
            barraEstaFija
        ) {
            return;
        }


        crearPlaceholderBarra();

        medirBarraFiltros();


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


        barraEstaFija =
            true;
    }


    function liberarBarraFiltros() {

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


        barraEstaFija =
            false;
    }


    function actualizarBarraFiltros() {

        if (!barraFiltros) {
            return;
        }


        crearPlaceholderBarra();


        const alturaCabecera =
            obtenerAlturaCabeceraMobile();


        const umbral =
            posicionOriginalBarra -
            alturaCabecera;


        if (
            window.scrollY >=
            umbral
        ) {

            fijarBarraFiltros();

        } else {

            liberarBarraFiltros();
        }


        if (barraEstaFija) {

            medirBarraFiltros();
        }
    }


    function recalcularBarraFiltros() {

        if (!barraFiltros) {
            return;
        }


        crearPlaceholderBarra();

        calcularPosicionOriginalBarra();

        actualizarBarraFiltros();
    }


    if (barraFiltros) {

        crearPlaceholderBarra();


        requestAnimationFrame(
            () => {

                recalcularBarraFiltros();
            }
        );


        window.addEventListener(
            "scroll",
            actualizarBarraFiltros,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            recalcularBarraFiltros
        );


        window.addEventListener(
            "orientationchange",
            () => {

                window.setTimeout(
                    recalcularBarraFiltros,
                    150
                );
            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "load",
            () => {

                recalcularBarraFiltros();
            }
        );
    }


    /* =========================================================
       WHATSAPP
    ========================================================= */

    function generarWhatsApp(
        servicio = "general"
    ) {

        const mensajes = {

            general:
                "Hola SublimArts, quisiera hacer una consulta.",

            "Películas & Series":
                "Hola SublimArts, quisiera cotizar un cuadro de Películas & Series.",

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
            ".boton-whatsapp-peliculas-series"
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
                        generarWhatsApp(
                            servicio
                        );


                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer"
                    );
                }
            );
        });


    /* =========================================================
       VISOR / MODAL
    ========================================================= */

    const visor =
        document.getElementById(
            "visorCatalogo-peliculas-series"
        ) ||
        document.getElementById(
            "visorImagen-peliculas-series"
        )?.closest(
            ".visor-catalogo-peliculas-series"
        );


    const visorImg =
        document.getElementById(
            "visorImagen-peliculas-series"
        ) ||
        visor?.querySelector(
            "img"
        );


    const cerrarVisorBtn =
        document.getElementById(
            "visorCerrar-peliculas-series"
        );


    const anteriorBtn =
        document.getElementById(
            "visorAnterior-peliculas-series"
        );


    const siguienteBtn =
        document.getElementById(
            "visorSiguiente-peliculas-series"
        );


    const visorTitulo =
        document.getElementById(
            "visorTitulo-peliculas-series"
        );


    const visorContador =
        document.getElementById(
            "visorContador-peliculas-series"
        );


    const visorVerDetalles =
        document.getElementById(
            "visorVerDetalles-peliculas-series"
        );


    const visorEncargar =
        document.getElementById(
            "visorEncargar-peliculas-series"
        );


    const visorDetalles =
        document.getElementById(
            "visorDetalles-peliculas-series"
        );


    const visorDetallesTitulo =
        document.getElementById(
            "visorDetallesTitulo-peliculas-series"
        );


    const visorDetallesDescripcion =
        document.getElementById(
            "visorDetallesDescripcion-peliculas-series"
        );


    const visorDetallesCategoria =
        document.getElementById(
            "visorDetallesCategoria-peliculas-series"
        );


    const visorMedidas =
        document.getElementById(
            "visorMedidas-peliculas-series"
        );


    let tarjetaActual = null;
    let vistasActuales = [];
    let indiceVista = 0;


    /* =========================================================
       OBTENER LAS 4 VISTAS
       
       Las vistas SIEMPRE pertenecen a la tarjeta
       seleccionada.
    ========================================================= */

    function obtenerVistas(tarjeta) {

        const vistas = [];


        if (!tarjeta) {
            return vistas;
        }


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
         * Respaldo:
         * si no existen data-view, utiliza la imagen
         * principal de ESTA tarjeta.
         */
        if (!vistas.length) {

            const img =
                tarjeta.querySelector(
                    "img"
                );


            if (img?.src) {

                vistas.push(
                    img.src
                );
            }
        }


        return vistas;
    }


    function obtenerDescripcion(tarjeta) {

        if (!tarjeta) {
            return "";
        }


        const meta =
            tarjeta.querySelector(
                ".tarjeta-meta-peliculas-series"
            )?.textContent?.trim() ||
            "";


        const nombre =
            tarjeta.dataset.nombre ||
            "Cuadro";


        return (
            `${nombre}. ` +
            `${
                meta ||
                "Cuadro personalizado en aluminio HD."
            }`
        );
    }


    /* =========================================================
       WHATSAPP DEL MODAL
    ========================================================= */

    function actualizarEnlaceWhatsAppModal() {

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
            tarjetaActual.dataset.vehiculo ||
            "Películas & Series";


        const tamano =
            tarjetaActual.dataset.tamano ||
            "";


        let mensaje =
            `Hola SublimArts, quisiera encargar el cuadro "${nombre}"`;


        if (tamano) {

            mensaje +=
                ` en tamaño ${tamano}`;
        }


        mensaje +=
            `. Categoría: ${categoria}.`;


        visorEncargar.href =
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    }


    /* =========================================================
       DETALLES DEL MODAL
    ========================================================= */

    function actualizarDetallesModal() {

        if (!tarjetaActual) {
            return;
        }


        const nombre =
            tarjetaActual.dataset.nombre ||
            "Cuadro";


        const categoria =
            tarjetaActual.dataset.categoria ||
            tarjetaActual.dataset.vehiculo ||
            "Películas & Series";


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

            const tamanoActual =
                normalizar(
                    tarjetaActual.dataset.tamano ||
                    ""
                );


            visorMedidas
                .querySelectorAll(
                    "[data-medida]"
                )
                .forEach(
                    boton => {

                        const medida =
                            normalizar(
                                boton.dataset.medida
                            );


                        boton.classList.toggle(
                            "activo",
                            medida === tamanoActual
                        );
                    }
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
         * IMPORTANTE:
         *
         * Solo se obtienen las vistas
         * de la tarjeta seleccionada.
         */
        vistasActuales =
            obtenerVistas(
                tarjeta
            );


        indiceVista =
            0;


        if (!vistasActuales.length) {
            return;
        }


        actualizarVisor();

        actualizarDetallesModal();

        actualizarEnlaceWhatsAppModal();


        if (visorDetalles) {

            visorDetalles.hidden =
                true;

            visorDetalles.classList.remove(
                "abierto-peliculas-series"
            );
        }


        if (visorVerDetalles) {

            visorVerDetalles.setAttribute(
                "aria-expanded",
                "false"
            );
        }


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


        cerrarVisorBtn?.focus();
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


        tarjetaActual =
            null;

        vistasActuales =
            [];

        indiceVista =
            0;
    }


    /* =========================================================
       ACTUALIZAR MODAL
    ========================================================= */

    function actualizarVisor() {

        if (
            !visorImg ||
            !vistasActuales.length
        ) {
            return;
        }


        visorImg.src =
            vistasActuales[
                indiceVista
            ];


        const titulo =
            tarjetaActual?.dataset.nombre ||
            "Producto";


        visorImg.alt =
            `${titulo} — vista ${indiceVista + 1}`;


        if (visorTitulo) {

            visorTitulo.textContent =
                titulo;
        }


        if (visorContador) {

            visorContador.textContent =
                `${indiceVista + 1} / ${vistasActuales.length}`;
        }


        if (anteriorBtn) {

            anteriorBtn.disabled =
                vistasActuales.length <= 1;

            anteriorBtn.setAttribute(
                "aria-disabled",
                String(
                    vistasActuales.length <= 1
                )
            );
        }


        if (siguienteBtn) {

            siguienteBtn.disabled =
                vistasActuales.length <= 1;

            siguienteBtn.setAttribute(
                "aria-disabled",
                String(
                    vistasActuales.length <= 1
                )
            );
        }
    }


    /* =========================================================
       CAMBIAR VISTA
    ========================================================= */

    function cambiarVista(
        direccion
    ) {

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

            indiceVista =
                0;
        }


        actualizarVisor();
    }


    /* =========================================================
       ABRIR MODAL DESDE TARJETA
    ========================================================= */

    if (grid) {

        grid.addEventListener(
            "click",
            event => {

                const media =
                    event.target.closest(
                        ".tarjeta-cuadro-media-peliculas-series"
                    );


                if (!media) {
                    return;
                }


                const tarjeta =
                    media.closest(
                        ".tarjeta-cuadro-peliculas-series"
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

    cerrarVisorBtn?.addEventListener(
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
       NAVEGACIÓN DEL MODAL
    ========================================================= */

    anteriorBtn?.addEventListener(
        "click",
        () => {

            cambiarVista(
                -1
            );
        }
    );


    siguienteBtn?.addEventListener(
        "click",
        () => {

            cambiarVista(
                1
            );
        }
    );


    /* =========================================================
       DETALLES
    ========================================================= */

    if (visorVerDetalles) {

        visorVerDetalles.setAttribute(
            "aria-expanded",
            "false"
        );


        visorVerDetalles.addEventListener(
            "click",
            event => {

                event.preventDefault();
                event.stopPropagation();


                if (!visorDetalles) {
                    return;
                }


                const abierto =
                    visorDetalles.classList.contains(
                        "abierto-peliculas-series"
                    );


                if (abierto) {

                    visorDetalles.classList.remove(
                        "abierto-peliculas-series"
                    );

                    visorDetalles.hidden =
                        true;

                    visorVerDetalles.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                } else {

                    actualizarDetallesModal();

                    visorDetalles.hidden =
                        false;

                    visorDetalles.classList.add(
                        "abierto-peliculas-series"
                    );

                    visorVerDetalles.setAttribute(
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
            .forEach(
                boton => {

                    boton.addEventListener(
                        "click",
                        () => {

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
                                .forEach(
                                    item => {

                                        item.classList.toggle(
                                            "activo",
                                            item === boton
                                        );
                                    }
                                );


                            const nombre =
                                tarjetaActual.dataset.nombre ||
                                "este cuadro";


                            const categoria =
                                tarjetaActual.dataset.categoria ||
                                "Películas & Series";


                            const mensaje =
                                `Hola SublimArts, quisiera cotizar "${nombre}" en tamaño ${medida}. Categoría: ${categoria}.`;


                            if (visorEncargar) {

                                visorEncargar.href =
                                    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
                            }
                        }
                    );
                }
            );
    }


    /* =========================================================
       TECLADO DEL MODAL
    ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !visor?.classList.contains(
                    "activo"
                )
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

                cambiarVista(
                    -1
                );

            } else if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                cambiarVista(
                    1
                );
            }
        }
    );


    /* =========================================================
       SWIPE DEL MODAL
       
       Variables declaradas explícitamente para evitar
       ReferenceError.
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
            window.innerWidth <= 900
                ? "true"
                : "false"
        );
    }


    if (sidebarOverlay) {

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


    tabs.forEach(tab => {

        const valor =
            normalizar(
                tab.dataset.filtro ||
                tab.dataset.categoria ||
                tab.textContent
            );


        const activo =
            valor === "todos" ||
            valor === "todo";


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

        visor.setAttribute(
            "aria-hidden",
            "true"
        );
    }


    requestAnimationFrame(
        () => {

            recalcularBarraFiltros();
        }
    );

});