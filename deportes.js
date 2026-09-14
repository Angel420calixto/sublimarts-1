/* =========================================================
   SUBLIMARTS · DEPORTES — deportes.js
   Catálogo con filtros, buscador, ordenamiento y visor de 4 vistas
   ========================================================= */

(function () {
    "use strict";

    document.addEventListener("DOMContentLoaded", function () {

        /* =====================================================
           ELEMENTOS PRINCIPALES
           ===================================================== */

        var grid = document.getElementById("grid-catalogo");
        var buscador = document.getElementById("buscadorCatalogo");
        var orden = document.getElementById("ordenCatalogo");
        var vacio = document.getElementById("catalogoVacio");
        var tabs = document.querySelectorAll(".tab-categoria");


        /* =====================================================
           ELEMENTOS DEL VISOR
           ===================================================== */

        var visor = document.getElementById("visorCatalogo");
        var visorImagen = document.getElementById("visorImagen");
        var visorTitulo = document.getElementById("visorTitulo");
        var visorContador = document.getElementById("visorContador");

        var visorAnterior = document.getElementById("visorAnterior");
        var visorSiguiente = document.getElementById("visorSiguiente");
        var visorCerrar = document.getElementById("visorCerrar");

        var visorVerDetalles =
            document.getElementById("visorVerDetalles");

        var visorDetalles =
            document.getElementById("visorDetalles");

        var visorDetallesTitulo =
            document.getElementById("visorDetallesTitulo");

        var visorDetallesDescripcion =
            document.getElementById("visorDetallesDescripcion");

        var visorDetallesCategoria =
            document.getElementById("visorDetallesCategoria");

        var visorEncargar =
            document.getElementById("visorEncargar");

        var visorMedidas =
            document.getElementById("visorMedidas");


        /* =====================================================
           MENÚ LATERAL MÓVIL
           ===================================================== */

        var sidebar =
            document.getElementById("sidebar");

        var sidebarToggle =
            document.getElementById("sidebarToggle");

        var sidebarOverlay =
            document.getElementById("sidebarOverlay");

        var sidebarLinks =
            document.querySelectorAll(".sidebar-enlace");


        /* =====================================================
           ESTADO
           ===================================================== */

        var filtroActual = "todo";

        var indiceActual = 0;

        var vistasActuales = [];

        var tarjetaActual = null;

        var touchStartX = 0;

        var touchStartY = 0;


        /* =====================================================
           WHATSAPP
           
           REEMPLAZA ESTE NÚMERO POR EL WHATSAPP REAL.
           Formato:
           569XXXXXXXX
           
           Sin +, espacios ni guiones.
           ===================================================== */

        var WHATSAPP = "56900000000";


        /* =====================================================
           NOMBRES DE LAS CATEGORÍAS
           ===================================================== */

        var NOMBRES_CATEGORIAS = {

            todo: "Todos",

            futbol: "Fútbol",

            basquetbol: "Básquetbol",

            tenis: "Tenis",

            voleibol: "Vóleibol",

            boxeo: "Boxeo",

            formula1: "Fórmula 1"

        };


        /* =====================================================
           NORMALIZAR TEXTO
           Permite buscar sin importar tildes o mayúsculas.
           ===================================================== */

        function normalizar(valor) {

            return String(valor || "")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .toLowerCase()
                .trim();

        }


        /* =====================================================
           OBTENER LAS 4 VISTAS DEL MISMO DISEÑO
           
           El HTML utiliza:
           
           data-view-1
           data-view-2
           data-view-3
           data-view-4
           
           IMPORTANTE:
           No utilizamos dataset.view1 porque los atributos
           reales tienen guiones.
           ===================================================== */

        function obtenerVistas(tarjeta) {

            var vistas = [];

            var i;

            for (i = 1; i <= 4; i += 1) {

                var url =
                    (
                        tarjeta.getAttribute(
                            "data-view-" + i
                        ) || ""
                    ).trim();


                if (url) {

                    vistas.push(url);

                }

            }


            /* =================================================
               RESPALDO:
               Si no existen data-view, utiliza la imagen
               principal de la tarjeta.
               ================================================= */

            if (!vistas.length) {

                var imagen =
                    tarjeta.querySelector(
                        ".tarjeta-cuadro-media img"
                    );


                if (imagen) {

                    var src =
                        (
                            imagen.getAttribute("src") || ""
                        ).trim();


                    if (src) {

                        vistas.push(src);

                    }

                }

            }


            /* Nunca superar las 4 vistas */

            return vistas.slice(0, 4);

        }


        /* =====================================================
           OBTENER DATOS DE LA TARJETA
           ===================================================== */

        function obtenerDatos(tarjeta) {

            var imagen =
                tarjeta.querySelector(
                    ".tarjeta-cuadro-media img"
                );


            var tituloEl =
                tarjeta.querySelector("h3");


            var metaEl =
                tarjeta.querySelector(".tarjeta-meta");


            return {

                titulo:
                    (
                        tarjeta.getAttribute("data-nombre") ||
                        (
                            tituloEl
                                ? tituloEl.textContent
                                : "Cuadro"
                        )
                    ).trim(),


                categoria:
                    (
                        tarjeta.getAttribute("data-categoria") ||
                        ""
                    ).trim(),


                tamano:
                    (
                        tarjeta.getAttribute("data-tamano") ||
                        ""
                    ).trim(),


                descripcion:
                    tarjeta.getAttribute("data-descripcion") ||
                    (
                        metaEl
                            ? metaEl.textContent.trim()
                            : "Diseño deportivo en aluminio HD."
                    ),


                alt:
                    imagen
                        ? (
                            imagen.getAttribute("alt") || ""
                        )
                        : ""

            };

        }


        /* =====================================================
           ACTUALIZAR ENLACE DE WHATSAPP DEL VISOR
           ===================================================== */

        function actualizarWhatsApp() {

            if (!visorEncargar || !tarjetaActual) {

                return;

            }


            var datos =
                obtenerDatos(tarjetaActual);


            var medida =
                tarjetaActual.getAttribute(
                    "data-tamano"
                ) || "A definir";


            var categoria =
                NOMBRES_CATEGORIAS[
                    datos.categoria
                ] || datos.categoria;


            var mensaje =
                'Hola, quiero cotizar el diseño deportivo "' +
                datos.titulo +
                '". ' +
                "Categoría: " +
                categoria +
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


        /* =====================================================
           ACTUALIZAR DETALLES
           ===================================================== */

        function actualizarDetalles() {

            if (!tarjetaActual) {

                return;

            }


            var datos =
                obtenerDatos(tarjetaActual);


            if (visorDetallesTitulo) {

                visorDetallesTitulo.textContent =
                    datos.titulo;

            }


            if (visorDetallesDescripcion) {

                visorDetallesDescripcion.textContent =
                    datos.descripcion;

            }


            if (visorDetallesCategoria) {

                visorDetallesCategoria.textContent =
                    NOMBRES_CATEGORIAS[
                        datos.categoria
                    ] ||
                    datos.categoria ||
                    "—";

            }


            /* ===============================================
               MEDIDAS
               =============================================== */

            if (visorMedidas) {

                visorMedidas
                    .querySelectorAll("[data-medida]")
                    .forEach(function (boton) {

                        boton.classList.toggle(
                            "activo",
                            boton.getAttribute(
                                "data-medida"
                            ) === datos.tamano
                        );

                    });

            }

        }


        /* =====================================================
           ACTUALIZAR VISOR
           ===================================================== */

        function actualizarVisor() {

            if (
                !visorImagen ||
                !vistasActuales.length
            ) {

                return;

            }


            var datos =
                obtenerDatos(tarjetaActual);


            /* Imagen actual */

            visorImagen.src =
                vistasActuales[indiceActual];


            visorImagen.alt =
                datos.titulo +
                " — vista " +
                (indiceActual + 1);


            /* Título */

            if (visorTitulo) {

                visorTitulo.textContent =
                    datos.titulo;

            }


            /* Contador */

            if (visorContador) {

                visorContador.textContent =
                    "Vista " +
                    (indiceActual + 1) +
                    " de " +
                    vistasActuales.length;

            }


            /* ===============================================
               FLECHAS
               =============================================== */

            var hayVarias =
                vistasActuales.length > 1;


            if (visorAnterior) {

                visorAnterior.hidden =
                    !hayVarias;

                visorAnterior.disabled =
                    !hayVarias;

            }


            if (visorSiguiente) {

                visorSiguiente.hidden =
                    !hayVarias;

                visorSiguiente.disabled =
                    !hayVarias;

            }

        }


        /* =====================================================
           ABRIR VISOR
           
           IMPORTANTE:
           tarjetaActual conserva el producto seleccionado.
           
           Las flechas solamente recorren vistasActuales,
           por lo que jamás saltan a otro diseño.
           ===================================================== */

        function abrirVisor(
            tarjeta,
            indiceInicial
        ) {

            var vistas =
                obtenerVistas(tarjeta);


            if (
                !visor ||
                !vistas.length
            ) {

                return;

            }


            tarjetaActual =
                tarjeta;


            vistasActuales =
                vistas;


            indiceActual =
                Math.max(
                    0,
                    Math.min(
                        Number(indiceInicial) || 0,
                        vistasActuales.length - 1
                    )
                );


            actualizarVisor();

            actualizarDetalles();

            actualizarWhatsApp();


            /* Los detalles comienzan cerrados */

            if (visorDetalles) {

                visorDetalles.hidden =
                    true;

            }


            /* Mostrar visor */

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


            /* Enfocar botón cerrar */

            if (visorCerrar) {

                visorCerrar.focus();

            }

        }


        /* =====================================================
           CERRAR VISOR
           ===================================================== */

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

                visorImagen.src =
                    "";

            }


            tarjetaActual =
                null;


            vistasActuales =
                [];


            indiceActual =
                0;

        }


        /* =====================================================
           CAMBIAR VISTA
           
           Solo cambia dentro de las 4 vistas del producto
           actualmente abierto.
           ===================================================== */

        function cambiarVista(direccion) {

            if (
                !vistasActuales.length ||
                vistasActuales.length < 2
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


        /* =====================================================
           CLICK EN IMAGEN DE TARJETA
           ===================================================== */

        if (grid) {

            grid.addEventListener(
                "click",
                function (event) {

                    var media =
                        event.target.closest
                            ? event.target.closest(
                                ".tarjeta-cuadro-media"
                            )
                            : null;


                    if (
                        !media ||
                        !grid.contains(media)
                    ) {

                        return;

                    }


                    var tarjeta =
                        media.closest(
                            ".tarjeta-cuadro"
                        );


                    if (!tarjeta) {

                        return;

                    }


                    var imagen =
                        media.querySelector("img");


                    if (!imagen) {

                        return;

                    }


                    event.preventDefault();


                    var vistas =
                        obtenerVistas(tarjeta);


                    var src =
                        (
                            imagen.getAttribute("src") ||
                            ""
                        ).trim();


                    var indice =
                        0;


                    /* =========================================
                       Determinar qué vista fue pulsada
                       ========================================= */

                    vistas.forEach(
                        function (url, i) {

                            if (url === src) {

                                indice = i;

                            }

                        }
                    );


                    abrirVisor(
                        tarjeta,
                        indice
                    );

                }
            );

        }


        /* =====================================================
           FLECHA ANTERIOR
           ===================================================== */

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


        /* =====================================================
           FLECHA SIGUIENTE
           ===================================================== */

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


        /* =====================================================
           BOTÓN X
           ===================================================== */

        if (visorCerrar) {

            visorCerrar.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    cerrarVisor();

                }
            );

        }


        /* =====================================================
           CERRAR HACIENDO CLICK EN EL FONDO
           ===================================================== */

        var fondoVisor =
            visor
                ? visor.querySelector(
                    ".visor-catalogo-fondo"
                )
                : null;


        if (fondoVisor) {

            fondoVisor.addEventListener(
                "click",
                cerrarVisor
            );

        }


        /* =====================================================
           TECLADO
           
           ESC = cerrar
           ← = vista anterior
           → = vista siguiente
           ===================================================== */

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

                }


                if (
                    event.key === "ArrowLeft"
                ) {

                    event.preventDefault();

                    cambiarVista(-1);

                }


                if (
                    event.key === "ArrowRight"
                ) {

                    event.preventDefault();

                    cambiarVista(1);

                }

            }
        );


        /* =====================================================
           SWIPE EN MÓVIL
           ===================================================== */

        if (visorImagen) {

            visorImagen.addEventListener(
                "touchstart",
                function (event) {

                    if (
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
                        !event.changedTouches.length
                    ) {

                        return;

                    }


                    var endX =
                        event.changedTouches[0].clientX;


                    var endY =
                        event.changedTouches[0].clientY;


                    var diferenciaX =
                        endX - touchStartX;


                    var diferenciaY =
                        endY - touchStartY;


                    /* Solo swipe horizontal */

                    if (
                        Math.abs(diferenciaX) > 45 &&
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


        /* =====================================================
           BOTÓN VER DETALLES
           ===================================================== */

        if (visorVerDetalles) {

            visorVerDetalles.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


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


        /* =====================================================
           SELECCIÓN DE MEDIDAS
           ===================================================== */

        if (visorMedidas) {

            visorMedidas.addEventListener(
                "click",
                function (event) {

                    var boton =
                        event.target.closest
                            ? event.target.closest(
                                "[data-medida]"
                            )
                            : null;


                    if (
                        !boton ||
                        !tarjetaActual
                    ) {

                        return;

                    }


                    event.preventDefault();


                    var medida =
                        boton.getAttribute(
                            "data-medida"
                        );


                    tarjetaActual.setAttribute(
                        "data-tamano",
                        medida
                    );


                    actualizarDetalles();

                    actualizarWhatsApp();

                }
            );

        }


        /* =====================================================
           FILTROS
           
           Categorías:
           
           Todos
           Fútbol
           Básquetbol
           Tenis
           Vóleibol
           Boxeo
           Fórmula 1
           ===================================================== */

        function aplicarFiltros() {

            if (!grid) {

                return;

            }


            var termino =
                buscador
                    ? normalizar(
                        buscador.value
                    )
                    : "";


            var visibles =
                0;


            grid
                .querySelectorAll(
                    ".tarjeta-cuadro"
                )
                .forEach(
                    function (tarjeta) {

                        var categoria =
                            normalizar(
                                tarjeta.getAttribute(
                                    "data-categoria"
                                )
                            );


                        var nombre =
                            normalizar(
                                tarjeta.getAttribute(
                                    "data-nombre"
                                )
                            );


                        var texto =
                            normalizar(
                                tarjeta.textContent
                            );


                        var coincideCategoria =
                            filtroActual === "todo" ||
                            categoria === filtroActual;


                        var coincideBusqueda =
                            !termino ||
                            nombre.indexOf(
                                termino
                            ) !== -1 ||
                            texto.indexOf(
                                termino
                            ) !== -1;


                        var mostrar =
                            coincideCategoria &&
                            coincideBusqueda;


                        tarjeta.hidden =
                            !mostrar;


                        if (mostrar) {

                            visibles += 1;

                        }

                    }
                );


            if (vacio) {

                vacio.hidden =
                    visibles !== 0;

            }

        }


        /* =====================================================
           BOTONES DE FILTRO
           ===================================================== */

        tabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        filtroActual =
                            tab.getAttribute(
                                "data-filtro"
                            ) ||
                            "todo";


                        tabs.forEach(
                            function (item) {

                                var activo =
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


        /* =====================================================
           BUSCADOR
           ===================================================== */

        if (buscador) {

            buscador.addEventListener(
                "input",
                aplicarFiltros
            );

        }


        /* =====================================================
           ORDENAMIENTO
           
           Recientes
           A-Z
           Z-A
           Tamaño
           ===================================================== */

        if (orden && grid) {

            orden.addEventListener(
                "change",
                function () {

                    var tarjetas =
                        Array.from(
                            grid.querySelectorAll(
                                ".tarjeta-cuadro"
                            )
                        );


                    var modo =
                        orden.value;


                    /* =========================================
                       A-Z
                       ========================================= */

                    if (modo === "az") {

                        tarjetas.sort(
                            function (a, b) {

                                return (
                                    a.getAttribute(
                                        "data-nombre"
                                    ) || ""
                                ).localeCompare(
                                    b.getAttribute(
                                        "data-nombre"
                                    ) || "",
                                    "es",
                                    {
                                        sensitivity:
                                            "base"
                                    }
                                );

                            }
                        );

                    }


                    /* =========================================
                       Z-A
                       ========================================= */

                    else if (modo === "za") {

                        tarjetas.sort(
                            function (a, b) {

                                return (
                                    b.getAttribute(
                                        "data-nombre"
                                    ) || ""
                                ).localeCompare(
                                    a.getAttribute(
                                        "data-nombre"
                                    ) || "",
                                    "es",
                                    {
                                        sensitivity:
                                            "base"
                                    }
                                );

                            }
                        );

                    }


                    /* =========================================
                       TAMAÑO
                       ========================================= */

                    else if (modo === "tamano") {

                        tarjetas.sort(
                            function (a, b) {

                                return (
                                    a.getAttribute(
                                        "data-tamano"
                                    ) || ""
                                ).localeCompare(
                                    b.getAttribute(
                                        "data-tamano"
                                    ) || "",
                                    "es",
                                    {
                                        numeric:
                                            true
                                    }
                                );

                            }
                        );

                    }


                    /* =========================================
                       RECIENTES
                       ========================================= */

                    else {

                        tarjetas.sort(
                            function (a, b) {

                                return (
                                    Number(
                                        a.getAttribute(
                                            "data-orden"
                                        ) || 0
                                    ) -
                                    Number(
                                        b.getAttribute(
                                            "data-orden"
                                        ) || 0
                                    )
                                );

                            }
                        );

                    }


                    /* Volver a insertar las tarjetas */

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


        /* =====================================================
           CERRAR SIDEBAR MÓVIL
           ===================================================== */

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


            document.body.classList.remove(
                "menu-abierto"
            );

        }


        /* =====================================================
           ABRIR SIDEBAR MÓVIL
           ===================================================== */

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


            if (sidebarToggle) {

                sidebarToggle.setAttribute(
                    "aria-expanded",
                    "true"
                );


                sidebarToggle.setAttribute(
                    "aria-label",
                    "Cerrar menú"
                );

            }


            document.body.classList.add(
                "menu-abierto"
            );

        }


        /* =====================================================
           BOTÓN HAMBURGUESA
           ===================================================== */

        if (sidebarToggle) {

            sidebarToggle.addEventListener(
                "click",
                function () {

                    if (
                        sidebar &&
                        sidebar.classList.contains(
                            "activo"
                        )
                    ) {

                        cerrarSidebar();

                    } else {

                        abrirSidebar();

                    }

                }
            );

        }


        /* =====================================================
           FONDO DE BLOQUEO DEL MENÚ
           ===================================================== */

        if (sidebarOverlay) {

            sidebarOverlay.addEventListener(
                "click",
                cerrarSidebar
            );

        }


        /* =====================================================
           CERRAR MENÚ AL SELECCIONAR UNA OPCIÓN
           EN MÓVIL
           ===================================================== */

        sidebarLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        if (
                            window.innerWidth <= 900
                        ) {

                            cerrarSidebar();

                        }

                    }
                );

            }
        );


        /* =====================================================
           ESC TAMBIÉN CIERRA EL MENÚ MÓVIL
           ===================================================== */

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


        /* =====================================================
           MENÚ DEL FOOTER MÓVIL
           ===================================================== */

        var footerToggle =
            document.getElementById(
                "mobileFooterMenuToggle"
            );


        var footerMenu =
            document.getElementById(
                "mobileFooterMenu"
            );


        if (
            footerToggle &&
            footerMenu
        ) {

            footerToggle.addEventListener(
                "click",
                function () {

                    var abierto =
                        footerToggle.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    footerToggle.setAttribute(
                        "aria-expanded",
                        abierto
                            ? "false"
                            : "true"
                    );


                    footerMenu.hidden =
                        abierto;

                }
            );


            /* Comienza cerrado */

            footerMenu.hidden =
                true;

        }


        /* =====================================================
           WHATSAPP GENERAL
           
           Todos los elementos con:
           
           data-servicio="..."
           
           abrirán WhatsApp.
           ===================================================== */

        document
            .querySelectorAll(
                "[data-servicio]"
            )
            .forEach(
                function (enlace) {

                    enlace.addEventListener(
                        "click",
                        function (event) {

                            var href =
                                enlace.getAttribute(
                                    "href"
                                );


                            /*
                             * Solo intervenimos cuando el enlace
                             * todavía tiene href="#" o no tiene href.
                             */

                            if (
                                !href ||
                                href === "#"
                            ) {

                                event.preventDefault();


                                var servicio =
                                    enlace.getAttribute(
                                        "data-servicio"
                                    ) ||
                                    "Cotización";


                                var mensaje =
                                    "Hola, quiero cotizar: " +
                                    servicio +
                                    ".";


                                window.open(
                                    "https://wa.me/" +
                                    WHATSAPP +
                                    "?text=" +
                                    encodeURIComponent(
                                        mensaje
                                    ),
                                    "_blank",
                                    "noopener,noreferrer"
                                );

                            }

                        }
                    );

                }
            );


        /* =====================================================
           INICIALIZAR CATÁLOGO
           ===================================================== */

        aplicarFiltros();

    });

}());