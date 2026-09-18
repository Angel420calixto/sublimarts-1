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
        document.querySelector(".catalogo-grid") ||
        document.getElementById("grid-catalogo");

    const barraFiltros =
        document.querySelector(".barra-filtros");

    const buscador =
        document.querySelector(
            ".barra-filtros input[type='search']"
        ) ||
        document.querySelector(
            ".barra-filtros input[type='text']"
        ) ||
        document.getElementById("buscadorCatalogo");

    const orden =
        document.querySelector(
            ".barra-filtros select"
        ) ||
        document.getElementById("ordenCatalogo");

    const tabs = Array.from(
        document.querySelectorAll(
            ".tab-categoria, .filtro-btn, [data-filtro]"
        )
    );

    const vacio =
        document.querySelector(".catalogo-vacio") ||
        document.querySelector(".sin-resultados") ||
        document.querySelector(".grid-catalogo-vacio");


    /* =========================================================
       MENÚ MOBILE
    ========================================================= */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


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
                    sidebar?.classList.contains("activo") ||
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
                sidebar?.classList.contains("activo")
            ) {

                cerrarMenuMobile();

                sidebarToggle?.focus();
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
                ".tarjeta-cuadro"
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
                "oculto-por-filtro",
                !mostrar
            );

            tarjeta.classList.toggle(
                "tarjeta-filtrada",
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
       BARRA DE FILTROS
       
       IMPORTANTE:
       La barra NO queda simplemente sticky.
       
       Se conserva en su posición original y, al llegar al
       límite superior de la pantalla, pasa a fixed mediante
       la clase .filtro-fijo.
       
       Así queda SIEMPRE visible durante el scroll.
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
                "mobileTopbar"
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
            document.createElement("div");

        barraPlaceholder.className =
            "barra-filtros-placeholder";

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
            Math.ceil(rect.height);

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

            if (barraPlaceholder) {

                barraPlaceholder.classList.remove(
                    "activo"
                );
            }
        }


        /*
         * Medimos la posición REAL dentro del documento.
         */
        const rect =
            barraFiltros.getBoundingClientRect();


        posicionOriginalBarra =
            rect.top +
            window.scrollY;


        medirBarraFiltros();


        /*
         * Restauramos inmediatamente el estado fijo
         * si estaba activo.
         */
        if (estabaFija) {

            barraFiltros.classList.add(
                "filtro-fijo"
            );

            if (barraPlaceholder) {

                barraPlaceholder.classList.add(
                    "activo"
                );
            }
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


        barraEstaFija = true;
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


        barraEstaFija = false;
    }


    function actualizarBarraFiltros() {

        if (!barraFiltros) {
            return;
        }


        crearPlaceholderBarra();


        /*
         * En mobile el filtro queda debajo del topbar.
         * En PC queda directamente en la parte superior.
         */
        const alturaCabecera =
            obtenerAlturaCabeceraMobile();


        /*
         * Cuando el scroll alcanza la posición original
         * menos la altura del encabezado, la barra pasa
         * a fixed.
         */
        const umbral =
            posicionOriginalBarra -
            alturaCabecera;


        if (
            window.scrollY >= umbral
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


        /*
         * Primero obtenemos nuevamente su posición original.
         */
        calcularPosicionOriginalBarra();


        /*
         * Después determinamos si debe estar fija.
         */
        actualizarBarraFiltros();
    }


    if (barraFiltros) {

        crearPlaceholderBarra();


        /*
         * Esperamos a que el navegador haya terminado
         * de calcular imágenes, fuentes y layout.
         */
        requestAnimationFrame(() => {

            recalcularBarraFiltros();
        });


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


        /*
         * Las imágenes del catálogo pueden modificar
         * el layout después de cargar.
         */
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

            "Autos y Motos":
                "Hola SublimArts, quisiera cotizar un cuadro de Autos y Motos.",

            "Tu foto, tu cuadro":
                "Hola SublimArts, quisiera consultar por un cuadro personalizado con mi propia foto.",

            "Cuadros personalizados":
                "Hola SublimArts, quisiera consultar por un cuadro personalizado."
        };


        const mensaje =
            mensajes[servicio] ||
            `Hola SublimArts, quisiera consultar por ${servicio}.`;


        return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    }


    document
        .querySelectorAll(".boton-whatsapp")
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
            "visorCatalogo"
        ) ||
        document.getElementById(
            "visorImagen"
        )?.closest(
            ".visor-catalogo"
        );


    const visorImg =
        document.getElementById(
            "visorImagen"
        ) ||
        visor?.querySelector(
            "img"
        );


    const cerrarVisorBtn =
        document.getElementById(
            "visorCerrar"
        );


    const anteriorBtn =
        document.getElementById(
            "visorAnterior"
        );


    const siguienteBtn =
        document.getElementById(
            "visorSiguiente"
        );


    const visorTitulo =
        document.getElementById(
            "visorTitulo"
        );


    const visorContador =
        document.getElementById(
            "visorContador"
        );


    const visorVerDetalles =
        document.getElementById(
            "visorVerDetalles"
        );


    const visorEncargar =
        document.getElementById(
            "visorEncargar"
        );


    const visorDetalles =
        document.getElementById(
            "visorDetalles"
        );


    const visorDetallesTitulo =
        document.getElementById(
            "visorDetallesTitulo"
        );


    const visorDetallesDescripcion =
        document.getElementById(
            "visorDetallesDescripcion"
        );


    const visorDetallesCategoria =
        document.getElementById(
            "visorDetallesCategoria"
        );


    const visorMedidas =
        document.getElementById(
            "visorMedidas"
        );


    let tarjetaActual = null;
    let vistasActuales = [];
    let indiceVista = 0;


    function obtenerVistas(tarjeta) {

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
         * Solo usamos la imagen principal como
         * respaldo si no existe ninguna data-view.
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
                ".tarjeta-meta"
            )?.textContent?.trim() ||
            "";


        const categoria =
            tarjeta.dataset.categoria ||
            tarjeta.dataset.vehiculo ||
            "";


        const nombre =
            tarjeta.dataset.nombre ||
            "Cuadro";


        return (
            `${nombre}. ` +
            `${meta || "Cuadro personalizado en aluminio HD."}`
        );
    }


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
            "Autos y Motos";


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
            "Autos y Motos";


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
         * Las vistas se obtienen SOLO de esta tarjeta.
         * Nunca se consulta otra tarjeta del grid.
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


        actualizarDetallesModal();


        actualizarEnlaceWhatsAppModal();


        if (visorDetalles) {

            visorDetalles.hidden = true;
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


        tarjetaActual = null;
        vistasActuales = [];
        indiceVista = 0;
    }


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
        }


        if (siguienteBtn) {

            siguienteBtn.disabled =
                vistasActuales.length <= 1;
        }
    }


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
       ABRIR MODAL DESDE TARJETA
    ========================================================= */

    if (grid) {

        grid.addEventListener(
            "click",
            event => {

                const media =
                    event.target.closest(
                        ".tarjeta-cuadro-media"
                    );


                if (!media) {
                    return;
                }


                const tarjeta =
                    media.closest(
                        ".tarjeta-cuadro"
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
       NAVEGACIÓN MODAL
    ========================================================= */

    anteriorBtn?.addEventListener(
        "click",
        () => {

            cambiarVista(-1);
        }
    );


    siguienteBtn?.addEventListener(
        "click",
        () => {

            cambiarVista(1);
        }
    );


    /* =========================================================
       DETALLES
    ========================================================= */

    visorVerDetalles?.addEventListener(
        "click",
        () => {

            if (!visorDetalles) {
                return;
            }


            visorDetalles.hidden =
                !visorDetalles.hidden;


            if (!visorDetalles.hidden) {

                actualizarDetallesModal();
            }
        }
    );


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
                                "Autos y Motos";


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
       SWIPE DEL MODAL
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


    /*
     * Primera medición después de que todo el DOM
     * esté renderizado.
     */
    requestAnimationFrame(() => {

        recalcularBarraFiltros();
    });

});