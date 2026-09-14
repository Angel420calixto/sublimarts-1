/* =========================================================
   SUBLIMARTS · RELIGIÓN Y ESPIRITUALIDAD
   Visor de 1 producto con hasta 4 perspectivas
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    /* =========================================================
       ELEMENTOS PRINCIPALES
       ========================================================= */

    const grid = document.getElementById("grid-catalogo");
    const buscador = document.getElementById("buscadorCatalogo");
    const orden = document.getElementById("ordenCatalogo");
    const vacio = document.getElementById("catalogoVacio");
    const tabs = document.querySelectorAll(".tab-categoria");


    /* =========================================================
       ELEMENTOS DEL VISOR
       ========================================================= */

    const visor = document.getElementById("visorCatalogo");
    const visorImagen = document.getElementById("visorImagen");
    const visorTitulo = document.getElementById("visorTitulo");
    const visorContador = document.getElementById("visorContador");

    const visorAnterior =
        document.getElementById("visorAnterior");

    const visorSiguiente =
        document.getElementById("visorSiguiente");

    const visorCerrar =
        document.getElementById("visorCerrar");

    const visorVerDetalles =
        document.getElementById("visorVerDetalles");

    const visorDetalles =
        document.getElementById("visorDetalles");

    const visorDetallesTitulo =
        document.getElementById("visorDetallesTitulo");

    const visorDetallesDescripcion =
        document.getElementById("visorDetallesDescripcion");

    const visorDetallesCategoria =
        document.getElementById("visorDetallesCategoria");

    const visorMedidas =
        document.getElementById("visorMedidas");

    const visorEncargar =
        document.getElementById("visorEncargar");


    /* =========================================================
       ELEMENTOS DEL MENÚ MÓVIL
       ========================================================= */

    const sidebar =
        document.getElementById("sidebar");

    const sidebarToggle =
        document.getElementById("sidebarToggle");

    const sidebarOverlay =
        document.getElementById("sidebarOverlay");


    /* =========================================================
       ESTADO DEL VISOR
       ========================================================= */

    let filtroActual = "todo";

    let indiceActual = 0;

    let vistasActuales = [];

    let tarjetaActual = null;

    let touchStartX = 0;

    let touchStartY = 0;


    /* =========================================================
       WHATSAPP
       REEMPLAZAR POR EL NÚMERO REAL
       Formato:
       569XXXXXXXX
       ========================================================= */

    const WHATSAPP = "56900000000";


    /* =========================================================
       OBTENER LAS 4 VISTAS DEL MISMO DISEÑO
       ========================================================= */

    function obtenerVistas(tarjeta) {

        const vistas = [];

        if (!tarjeta) {
            return vistas;
        }

        for (let i = 1; i <= 4; i++) {

            const url =
                (
                    tarjeta.getAttribute(
                        "data-view-" + i
                    ) || ""
                ).trim();

            if (url) {
                vistas.push(url);
            }
        }

        /*
         * Si no existen data-view,
         * utiliza la imagen principal.
         */

        if (vistas.length === 0) {

            const imagen =
                tarjeta.querySelector(
                    ".tarjeta-cuadro-media img"
                );

            if (imagen) {

                const src =
                    (
                        imagen.getAttribute("src") || ""
                    ).trim();

                if (src) {
                    vistas.push(src);
                }
            }
        }

        return vistas;
    }


    /* =========================================================
       OBTENER INFORMACIÓN DE LA TARJETA
       ========================================================= */

    function obtenerDatosTarjeta(tarjeta) {

        if (!tarjeta) {
            return {
                titulo: "Diseño",
                categoria: "Religión",
                tamano: "",
                descripcion:
                    "Diseño personalizado de alta calidad.",
                alt: "Diseño SublimArts"
            };
        }

        const imagen =
            tarjeta.querySelector(
                ".tarjeta-cuadro-media img"
            );

        const tituloData =
            tarjeta.getAttribute(
                "data-nombre"
            );

        const tituloElemento =
            tarjeta.querySelector("h3");

        const titulo =
            (
                tituloData ||
                (
                    tituloElemento
                        ? tituloElemento.textContent
                        : "Diseño"
                )
            ).trim();

        const categoria =
            (
                tarjeta.getAttribute(
                    "data-categoria"
                ) ||
                "religion"
            ).trim();

        const tamano =
            (
                tarjeta.getAttribute(
                    "data-tamano"
                ) || ""
            ).trim();

        const descripcionData =
            tarjeta.getAttribute(
                "data-descripcion"
            );

        const meta =
            tarjeta.querySelector(
                ".tarjeta-meta"
            );

        const descripcion =
            (
                descripcionData ||
                (
                    meta
                        ? meta.textContent
                        : "Diseño personalizado en alta calidad."
                )
            ).trim();

        const alt =
            imagen
                ? (
                    imagen.getAttribute("alt") ||
                    titulo
                )
                : titulo;

        return {
            titulo: titulo,
            categoria: categoria,
            tamano: tamano,
            descripcion: descripcion,
            alt: alt
        };
    }


    /* =========================================================
       ACTUALIZAR VISOR
       ========================================================= */

    function actualizarVisor() {

        if (
            !visorImagen ||
            !vistasActuales.length
        ) {
            return;
        }

        const url =
            vistasActuales[indiceActual];

        visorImagen.src = url;

        const datos =
            tarjetaActual
                ? obtenerDatosTarjeta(
                    tarjetaActual
                )
                : null;

        if (datos) {

            visorImagen.alt =
                datos.titulo +
                " — vista " +
                (indiceActual + 1);

            if (visorTitulo) {
                visorTitulo.textContent =
                    datos.titulo;
            }
        }

        if (visorContador) {

            if (vistasActuales.length > 1) {

                visorContador.textContent =
                    "Vista " +
                    (indiceActual + 1) +
                    " de " +
                    vistasActuales.length;

            } else {

                visorContador.textContent =
                    "1 vista";
            }
        }


        /* =====================================================
           FLECHAS
           ===================================================== */

        if (visorAnterior) {

            const desactivado =
                vistasActuales.length <= 1;

            visorAnterior.hidden =
                desactivado;

            visorAnterior.disabled =
                desactivado;
        }

        if (visorSiguiente) {

            const desactivado =
                vistasActuales.length <= 1;

            visorSiguiente.hidden =
                desactivado;

            visorSiguiente.disabled =
                desactivado;
        }
    }


    /* =========================================================
       ACTUALIZAR DETALLES
       ========================================================= */

    function actualizarDetalles() {

        if (!tarjetaActual) {
            return;
        }

        const datos =
            obtenerDatosTarjeta(
                tarjetaActual
            );


        if (visorDetallesTitulo) {

            visorDetallesTitulo.textContent =
                datos.titulo;
        }


        if (visorDetallesDescripcion) {

            visorDetallesDescripcion.textContent =
                datos.descripcion;
        }


        if (visorDetallesCategoria) {

            if (
                datos.categoria === "religion"
            ) {

                visorDetallesCategoria.textContent =
                    "Religión";

            } else if (
                datos.categoria === "espiritualidad"
            ) {

                visorDetallesCategoria.textContent =
                    "Espiritualidad";

            } else {

                visorDetallesCategoria.textContent =
                    datos.categoria;
            }
        }


        if (visorMedidas) {

            const botones =
                visorMedidas.querySelectorAll(
                    "[data-medida]"
                );

            botones.forEach(
                function (boton) {

                    boton.classList.toggle(
                        "activo",
                        boton.getAttribute(
                            "data-medida"
                        ) === datos.tamano
                    );
                }
            );
        }
    }


    /* =========================================================
       ACTUALIZAR WHATSAPP DEL VISOR
       ========================================================= */

    function actualizarWhatsApp() {

        if (
            !visorEncargar ||
            !tarjetaActual
        ) {
            return;
        }

        const datos =
            obtenerDatosTarjeta(
                tarjetaActual
            );

        const medida =
            tarjetaActual.getAttribute(
                "data-tamano"
            ) || "A definir";

        const mensaje =
            "Hola, quiero cotizar el diseño \"" +
            datos.titulo +
            "\". " +
            "Categoría: " +
            datos.categoria +
            ". " +
            "Medida: " +
            medida +
            ". " +
            "Me interesa la vista " +
            (indiceActual + 1) +
            " de " +
            vistasActuales.length +
            ".";

        visorEncargar.href =
            "https://wa.me/" +
            WHATSAPP +
            "?text=" +
            encodeURIComponent(mensaje);
    }


    /* =========================================================
       ABRIR VISOR
       ========================================================= */

    function abrirVisor(
        tarjeta,
        indiceInicial
    ) {

        if (!tarjeta || !visor) {
            return;
        }

        const vistas =
            obtenerVistas(tarjeta);

        if (!vistas.length) {
            return;
        }


        tarjetaActual =
            tarjeta;

        vistasActuales =
            vistas;


        if (
            typeof indiceInicial !== "number"
        ) {
            indiceInicial = 0;
        }


        indiceActual =
            Math.max(
                0,
                Math.min(
                    indiceInicial,
                    vistasActuales.length - 1
                )
            );


        actualizarVisor();

        actualizarDetalles();

        actualizarWhatsApp();


        /*
         * Los detalles empiezan cerrados.
         */

        if (visorDetalles) {
            visorDetalles.hidden = true;
        }


        /*
         * Mostrar modal.
         */

        visor.classList.add("activo");

        visor.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "visor-abierto"
        );

        document.body.style.overflow =
            "hidden";


        if (visorCerrar) {

            setTimeout(
                function () {

                    visorCerrar.focus();

                },
                0
            );
        }
    }


    /* =========================================================
       CERRAR VISOR
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

        document.body.classList.remove(
            "visor-abierto"
        );

        document.body.style.overflow =
            "";


        if (visorImagen) {
            visorImagen.src = "";
        }


        tarjetaActual = null;

        vistasActuales = [];

        indiceActual = 0;
    }


    /* =========================================================
       CAMBIAR VISTA
       IMPORTANTE:
       SOLO CAMBIA LAS VISTAS DEL MISMO DISEÑO
       ========================================================= */

    function cambiarVista(
        direccion
    ) {

        if (
            !vistasActuales.length ||
            vistasActuales.length <= 1
        ) {
            return;
        }

        indiceActual =
            (
                indiceActual +
                direccion +
                vistasActuales.length
            ) %
            vistasActuales.length;

        actualizarVisor();

        actualizarWhatsApp();
    }


    /* =========================================================
       CLICK EN GALERÍA
       ========================================================= */

    if (grid) {

        grid.addEventListener(
            "click",
            function (event) {

                const elemento =
                    event.target;

                if (!elemento) {
                    return;
                }


                const media =
                    elemento.closest(
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


                const imagen =
                    media.querySelector("img");

                if (!imagen) {
                    return;
                }


                event.preventDefault();


                const vistas =
                    obtenerVistas(
                        tarjeta
                    );

                if (!vistas.length) {
                    return;
                }


                /*
                 * Detectar cuál de las 4 vistas
                 * corresponde a la imagen pulsada.
                 */

                let indice = 0;

                const srcImagen =
                    (
                        imagen.getAttribute(
                            "src"
                        ) || ""
                    ).trim();


                for (
                    let i = 0;
                    i < vistas.length;
                    i++
                ) {

                    const dataUrl =
                        (
                            tarjeta.getAttribute(
                                "data-view-" +
                                (i + 1)
                            ) || ""
                        ).trim();

                    if (
                        dataUrl &&
                        dataUrl === srcImagen
                    ) {

                        indice = i;

                        break;
                    }
                }


                abrirVisor(
                    tarjeta,
                    indice
                );
            }
        );
    }


    /* =========================================================
       FLECHA ANTERIOR
       ========================================================= */

    if (visorAnterior) {

        visorAnterior.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                cambiarVista(-1);
            }
        );
    }


    /* =========================================================
       FLECHA SIGUIENTE
       ========================================================= */

    if (visorSiguiente) {

        visorSiguiente.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                cambiarVista(1);
            }
        );
    }


    /* =========================================================
       BOTÓN X
       ========================================================= */

    if (visorCerrar) {

        visorCerrar.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                cerrarVisor();
            }
        );
    }


    /* =========================================================
       CERRAR AL HACER CLICK EN EL FONDO
       ========================================================= */

    if (visor) {

        visor.addEventListener(
            "click",
            function (event) {

                if (
                    event.target === visor
                ) {

                    cerrarVisor();
                }
            }
        );
    }


    /* =========================================================
       TECLADO
       ESC + FLECHAS
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                !visor ||
                !visor.classList.contains(
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

                return;
            }


            if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                cambiarVista(-1);

                return;
            }


            if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                cambiarVista(1);
            }
        }
    );


    /* =========================================================
       SWIPE EN MÓVIL
       ========================================================= */

    if (visorImagen) {

        visorImagen.addEventListener(
            "touchstart",
            function (event) {

                if (
                    !event.touches ||
                    !event.touches.length
                ) {
                    return;
                }

                touchStartX =
                    event.touches[0].clientX;

                touchStartY =
                    event.touches[0].clientY;

            },
            {
                passive: true
            }
        );


        visorImagen.addEventListener(
            "touchend",
            function (event) {

                if (
                    !event.changedTouches ||
                    !event.changedTouches.length
                ) {
                    return;
                }


                const endX =
                    event.changedTouches[0].clientX;

                const endY =
                    event.changedTouches[0].clientY;


                const diferenciaX =
                    endX - touchStartX;

                const diferenciaY =
                    endY - touchStartY;


                /*
                 * Solo reconocemos desplazamientos
                 * horizontales.
                 */

                if (
                    Math.abs(diferenciaX) > 45 &&
                    Math.abs(diferenciaX) >
                    Math.abs(diferenciaY)
                ) {

                    if (
                        diferenciaX < 0
                    ) {

                        cambiarVista(1);

                    } else {

                        cambiarVista(-1);
                    }
                }

            },
            {
                passive: true
            }
        );
    }


    /* =========================================================
       VER DETALLES
       ========================================================= */

    if (visorVerDetalles) {

        visorVerDetalles.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                event.stopPropagation();


                if (!visorDetalles) {
                    return;
                }


                visorDetalles.hidden =
                    !visorDetalles.hidden;


                if (
                    !visorDetalles.hidden
                ) {

                    actualizarDetalles();
                }
            }
        );
    }


    /* =========================================================
       SELECCIÓN DE MEDIDAS
       ========================================================= */

    if (visorMedidas) {

        visorMedidas.addEventListener(
            "click",
            function (event) {

                const elemento =
                    event.target;

                if (!elemento) {
                    return;
                }


                const boton =
                    elemento.closest(
                        "[data-medida]"
                    );

                if (
                    !boton ||
                    !tarjetaActual
                ) {
                    return;
                }


                event.preventDefault();


                const medida =
                    boton.getAttribute(
                        "data-medida"
                    );


                /*
                 * Guardamos la medida
                 * seleccionada para el producto.
                 */

                tarjetaActual.setAttribute(
                    "data-tamano",
                    medida
                );


                const botones =
                    visorMedidas.querySelectorAll(
                        "[data-medida]"
                    );


                botones.forEach(
                    function (btn) {

                        btn.classList.toggle(
                            "activo",
                            btn === boton
                        );
                    }
                );


                actualizarWhatsApp();
            }
        );
    }


    /* =========================================================
       FILTROS
       TODOS / RELIGIÓN / ESPIRITUALIDAD
       ========================================================= */

    function aplicarFiltros() {

        if (!grid) {
            return;
        }


        const tarjetas =
            Array.from(
                grid.querySelectorAll(
                    ".tarjeta-cuadro"
                )
            );


        let termino = "";

        if (buscador) {

            termino =
                (
                    buscador.value || ""
                )
                .trim()
                .toLowerCase();
        }


        let visibles = 0;


        tarjetas.forEach(
            function (tarjeta) {

                const categoria =
                    (
                        tarjeta.getAttribute(
                            "data-categoria"
                        ) || ""
                    )
                    .trim()
                    .toLowerCase();


                const nombre =
                    (
                        tarjeta.getAttribute(
                            "data-nombre"
                        ) || ""
                    )
                    .trim()
                    .toLowerCase();


                const texto =
                    (
                        tarjeta.textContent || ""
                    )
                    .toLowerCase();


                /*
                 * Filtro de categoría.
                 */

                const coincideCategoria =
                    filtroActual === "todo" ||
                    categoria === filtroActual;


                /*
                 * Filtro de buscador.
                 */

                const coincideBusqueda =
                    !termino ||
                    nombre.includes(
                        termino
                    ) ||
                    texto.includes(
                        termino
                    );


                const mostrar =
                    coincideCategoria &&
                    coincideBusqueda;


                tarjeta.hidden =
                    !mostrar;


                if (mostrar) {
                    visibles++;
                }
            }
        );


        if (vacio) {

            vacio.hidden =
                visibles !== 0;
        }
    }


    /* =========================================================
       BOTONES DE CATEGORÍA
       ========================================================= */

    tabs.forEach(
        function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    filtroActual =
                        tab.getAttribute(
                            "data-filtro"
                        ) || "todo";


                    tabs.forEach(
                        function (item) {

                            const activo =
                                item === tab;


                            item.classList.toggle(
                                "activo",
                                activo
                            );


                            item.setAttribute(
                                "aria-selected",
                                activo
                                    ? "true"
                                    : "false"
                            );
                        }
                    );


                    aplicarFiltros();
                }
            );
        }
    );


    /* =========================================================
       BUSCADOR
       ========================================================= */

    if (buscador) {

        buscador.addEventListener(
            "input",
            function () {

                aplicarFiltros();
            }
        );
    }


    /* =========================================================
       ORDENAMIENTO
       A-Z / Z-A / TAMAÑO / RECIENTES
       ========================================================= */

    if (orden && grid) {

        orden.addEventListener(
            "change",
            function () {

                const tarjetas =
                    Array.from(
                        grid.querySelectorAll(
                            ".tarjeta-cuadro"
                        )
                    );


                switch (orden.value) {

                    /* -----------------------------------------
                       A-Z
                       ----------------------------------------- */

                    case "az":

                        tarjetas.sort(
                            function (a, b) {

                                const nombreA =
                                    (
                                        a.getAttribute(
                                            "data-nombre"
                                        ) || ""
                                    ).trim();

                                const nombreB =
                                    (
                                        b.getAttribute(
                                            "data-nombre"
                                        ) || ""
                                    ).trim();


                                return nombreA.localeCompare(
                                    nombreB,
                                    "es",
                                    {
                                        sensitivity:
                                            "base"
                                    }
                                );
                            }
                        );

                        break;


                    /* -----------------------------------------
                       Z-A
                       ----------------------------------------- */

                    case "za":

                        tarjetas.sort(
                            function (a, b) {

                                const nombreA =
                                    (
                                        a.getAttribute(
                                            "data-nombre"
                                        ) || ""
                                    ).trim();

                                const nombreB =
                                    (
                                        b.getAttribute(
                                            "data-nombre"
                                        ) || ""
                                    ).trim();


                                return nombreB.localeCompare(
                                    nombreA,
                                    "es",
                                    {
                                        sensitivity:
                                            "base"
                                    }
                                );
                            }
                        );

                        break;


                    /* -----------------------------------------
                       TAMAÑO
                       ----------------------------------------- */

                    case "tamano":

                        tarjetas.sort(
                            function (a, b) {

                                const tamanoA =
                                    (
                                        a.getAttribute(
                                            "data-tamano"
                                        ) || ""
                                    ).trim();

                                const tamanoB =
                                    (
                                        b.getAttribute(
                                            "data-tamano"
                                        ) || ""
                                    ).trim();


                                return tamanoA.localeCompare(
                                    tamanoB,
                                    "es",
                                    {
                                        numeric:
                                            true
                                    }
                                );
                            }
                        );

                        break;


                    /* -----------------------------------------
                       RECIENTES
                       ----------------------------------------- */

                    case "recientes":

                    default:

                        tarjetas.sort(
                            function (a, b) {

                                const ordenA =
                                    Number(
                                        a.getAttribute(
                                            "data-orden"
                                        ) || 0
                                    );

                                const ordenB =
                                    Number(
                                        b.getAttribute(
                                            "data-orden"
                                        ) || 0
                                    );


                                return ordenA - ordenB;
                            }
                        );

                        break;
                }


                /*
                 * Volver a insertar las tarjetas
                 * en el orden correspondiente.
                 */

                tarjetas.forEach(
                    function (tarjeta) {

                        grid.appendChild(
                            tarjeta
                        );
                    }
                );


                aplicarFiltros();
            }
        );
    }


    /* =========================================================
       MENÚ LATERAL MÓVIL
       ========================================================= */

    function abrirSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.add(
            "activo"
        );


        if (sidebarOverlay) {

            sidebarOverlay.classList.add(
                "activo"
            );
        }


        document.body.style.overflow =
            "hidden";


        if (sidebarToggle) {

            sidebarToggle.setAttribute(
                "aria-expanded",
                "true"
            );
        }
    }


    function cerrarSidebar() {

        if (!sidebar) {
            return;
        }

        sidebar.classList.remove(
            "activo"
        );


        if (sidebarOverlay) {

            sidebarOverlay.classList.remove(
                "activo"
            );
        }


        /*
         * Solo restauramos el scroll
         * si el visor no está abierto.
         */

        if (
            !visor ||
            !visor.classList.contains(
                "activo"
            )
        ) {

            document.body.style.overflow =
                "";
        }


        if (sidebarToggle) {

            sidebarToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    }


    if (sidebarToggle) {

        sidebarToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                const abierto =
                    sidebar &&
                    sidebar.classList.contains(
                        "activo"
                    );


                if (abierto) {

                    cerrarSidebar();

                } else {

                    abrirSidebar();
                }
            }
        );
    }


    if (sidebarOverlay) {

        sidebarOverlay.addEventListener(
            "click",
            function () {

                cerrarSidebar();
            }
        );
    }


    /*
     * Cerrar menú al seleccionar un enlace.
     */

    if (sidebar) {

        const enlaces =
            sidebar.querySelectorAll(
                "a"
            );


        enlaces.forEach(
            function (enlace) {

                enlace.addEventListener(
                    "click",
                    function () {

                        cerrarSidebar();
                    }
                );
            }
        );
    }


    /* =========================================================
       ESC TAMBIÉN CIERRA EL MENÚ MÓVIL
       ========================================================= */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                sidebar &&
                sidebar.classList.contains(
                    "activo"
                )
            ) {

                cerrarSidebar();
            }
        }
    );


    /* =========================================================
       MENÚ DEL FOOTER MÓVIL
       ========================================================= */

    const mobileFooterToggle =
        document.getElementById(
            "mobileFooterMenuToggle"
        );

    const mobileFooterMenu =
        document.getElementById(
            "mobileFooterMenu"
        );


    if (
        mobileFooterToggle &&
        mobileFooterMenu
    ) {

        mobileFooterToggle.addEventListener(
            "click",
            function (event) {

                event.preventDefault();


                const abierto =
                    mobileFooterToggle.getAttribute(
                        "aria-expanded"
                    ) === "true";


                mobileFooterToggle.setAttribute(
                    "aria-expanded",
                    abierto
                        ? "false"
                        : "true"
                );


                mobileFooterMenu.hidden =
                    abierto;
            }
        );


        mobileFooterMenu.hidden =
            mobileFooterToggle.getAttribute(
                "aria-expanded"
            ) !== "true";
    }


    /* =========================================================
       WHATSAPP GENERAL
       ELEMENTOS CON data-servicio
       ========================================================= */

    const enlacesWhatsApp =
        document.querySelectorAll(
            "[data-servicio]"
        );


    enlacesWhatsApp.forEach(
        function (enlace) {

            enlace.addEventListener(
                "click",
                function (event) {

                    const servicio =
                        enlace.getAttribute(
                            "data-servicio"
                        ) ||
                        "Cotización";


                    /*
                     * Si el enlace todavía tiene href="#",
                     * generamos automáticamente
                     * el enlace de WhatsApp.
                     */

                    const href =
                        enlace.getAttribute(
                            "href"
                        );


                    if (
                        !href ||
                        href === "#"
                    ) {

                        event.preventDefault();


                        const mensaje =
                            "Hola, quiero cotizar: " +
                            servicio +
                            ".";


                        const url =
                            "https://wa.me/" +
                            WHATSAPP +
                            "?text=" +
                            encodeURIComponent(
                                mensaje
                            );


                        window.open(
                            url,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    }
                }
            );
        }
    );


    /* =========================================================
       INICIO
       ========================================================= */

    aplicarFiltros();

});