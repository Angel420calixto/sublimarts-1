```javascript
/* =========================================================
   SUBLIMARTS · PAISAJES Y CIUDADES
   JavaScript principal del catálogo

   FUNCIONES:
   - Filtro Todos / Paisajes / Ciudades
   - Buscador
   - Orden A-Z / Z-A / Tamaño / Recientes
   - Visor de imágenes
   - 4 vistas por diseño
   - Flechas dentro del mismo diseño
   - Swipe en móvil
   - ESC para cerrar
   - Menú hamburguesa móvil
   - Fondo de bloqueo
   - Selección de medidas
   - Detalles
   - WhatsApp mediante data-servicio
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       ESPERAR A QUE EL DOM ESTÉ LISTO
       ===================================================== */

    document.addEventListener("DOMContentLoaded", function () {

        /* =====================================================
           CONFIGURACIÓN
           ===================================================== */

        /*
         * REEMPLAZA ESTE NÚMERO POR EL WHATSAPP REAL
         * DE SUBLIMARTS.
         *
         * Formato:
         * 569XXXXXXXX
         *
         * Sin +, espacios ni guiones.
         */

        var WHATSAPP = "56900000000";


        /* =====================================================
           ELEMENTOS PRINCIPALES
           ===================================================== */

        var grid = document.getElementById("grid-catalogo");

        var buscador =
            document.getElementById("buscadorCatalogo");

        var orden =
            document.getElementById("ordenCatalogo");

        var vacio =
            document.getElementById("catalogoVacio");

        var tabs =
            document.querySelectorAll(".tab-categoria");


        /* =====================================================
           ELEMENTOS DEL MENÚ MOBILE
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
           ELEMENTOS DEL VISOR
           ===================================================== */

        var visor =
            document.getElementById("visorCatalogo");

        var visorImagen =
            document.getElementById("visorImagen");

        var visorTitulo =
            document.getElementById("visorTitulo");

        var visorContador =
            document.getElementById("visorContador");

        var visorAnterior =
            document.getElementById("visorAnterior");

        var visorSiguiente =
            document.getElementById("visorSiguiente");

        var visorCerrar =
            document.getElementById("visorCerrar");

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
           ELEMENTOS DEL FOOTER MOBILE
           ===================================================== */

        var mobileFooterToggle =
            document.getElementById(
                "mobileFooterMenuToggle"
            );

        var mobileFooterMenu =
            document.getElementById(
                "mobileFooterMenu"
            );


        /* =====================================================
           ESTADO GLOBAL
           ===================================================== */

        var filtroActual = "todo";

        var indiceActual = 0;

        var vistasActuales = [];

        var tarjetaActual = null;

        var touchStartX = 0;

        var touchStartY = 0;


        /* =====================================================
           MENÚ HAMBURGUESA MOBILE
           ===================================================== */

        function abrirMenuMobile() {

            if (!sidebar) {
                return;
            }

            sidebar.classList.add("activo");


            if (sidebarOverlay) {
                sidebarOverlay.classList.add("activo");

                sidebarOverlay.setAttribute(
                    "aria-hidden",
                    "false"
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


        function cerrarMenuMobile() {

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


            document.body.classList.remove(
                "menu-abierto"
            );
        }


        function alternarMenuMobile() {

            if (!sidebar) {
                return;
            }


            if (
                sidebar.classList.contains(
                    "activo"
                )
            ) {

                cerrarMenuMobile();

            } else {

                abrirMenuMobile();
            }
        }


        if (sidebarToggle) {

            sidebarToggle.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    alternarMenuMobile();
                }
            );
        }


        if (sidebarOverlay) {

            sidebarOverlay.addEventListener(
                "click",
                function () {

                    cerrarMenuMobile();
                }
            );
        }


        sidebarLinks.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        cerrarMenuMobile();
                    }
                );
            }
        );


        /* =====================================================
           OBTENER VISTAS DEL DISEÑO
           ===================================================== */

        function obtenerVistas(tarjeta) {

            if (!tarjeta) {
                return [];
            }


            var vistas = [];


            /*
             * IMPORTANTE:
             *
             * NO usar:
             *
             * tarjeta.dataset.view1
             *
             * porque el HTML utiliza:
             *
             * data-view-1
             * data-view-2
             * data-view-3
             * data-view-4
             *
             * Por eso utilizamos getAttribute().
             */

            for (
                var i = 1;
                i <= 4;
                i++
            ) {

                var atributo =
                    "data-view-" + i;

                var url =
                    tarjeta.getAttribute(
                        atributo
                    );


                if (
                    url &&
                    url.trim() !== ""
                ) {

                    vistas.push(
                        url.trim()
                    );
                }
            }


            /*
             * Si el diseño no tiene ninguna
             * data-view, usamos su imagen principal.
             */

            if (
                vistas.length === 0
            ) {

                var imagen =
                    tarjeta.querySelector(
                        ".tarjeta-cuadro-media img"
                    );


                if (imagen) {

                    var src =
                        imagen.getAttribute(
                            "src"
                        );


                    if (
                        src &&
                        src.trim() !== ""
                    ) {

                        vistas.push(
                            src.trim()
                        );
                    }
                }
            }


            return vistas;
        }


        /* =====================================================
           OBTENER DATOS DE UNA TARJETA
           ===================================================== */

        function obtenerDatosTarjeta(
            tarjeta
        ) {

            if (!tarjeta) {

                return {
                    titulo: "Cuadro",
                    categoria: "",
                    tamano: "",
                    descripcion:
                        "Cuadro personalizado en alta calidad.",
                    alt: "Cuadro"
                };
            }


            var imagen =
                tarjeta.querySelector(
                    ".tarjeta-cuadro-media img"
                );


            var titulo =
                tarjeta.getAttribute(
                    "data-nombre"
                );


            if (
                !titulo ||
                titulo.trim() === ""
            ) {

                var tituloElemento =
                    tarjeta.querySelector(
                        "h3"
                    );


                titulo =
                    tituloElemento
                        ? tituloElemento.textContent
                        : "Cuadro";
            }


            var categoria =
                tarjeta.getAttribute(
                    "data-categoria"
                ) || "";


            var tamano =
                tarjeta.getAttribute(
                    "data-tamano"
                ) || "";


            var descripcion =
                tarjeta.getAttribute(
                    "data-descripcion"
                );


            if (
                !descripcion ||
                descripcion.trim() === ""
            ) {

                var meta =
                    tarjeta.querySelector(
                        ".tarjeta-meta"
                    );


                descripcion =
                    meta
                        ? meta.textContent
                        : "Cuadro personalizado en alta calidad.";
            }


            var alt =
                imagen
                    ? (
                        imagen.getAttribute(
                            "alt"
                        ) || titulo
                    )
                    : titulo;


            return {

                titulo:
                    titulo.trim(),

                categoria:
                    categoria.trim().toLowerCase(),

                tamano:
                    tamano.trim(),

                descripcion:
                    descripcion.trim(),

                alt:
                    alt.trim()
            };
        }


        /* =====================================================
           NOMBRE VISIBLE DE CATEGORÍA
           ===================================================== */

        function nombreCategoria(
            categoria
        ) {

            if (
                categoria === "paisajes"
            ) {

                return "Paisaje";
            }


            if (
                categoria === "ciudades"
            ) {

                return "Ciudad";
            }


            return categoria || "—";
        }


        /* =====================================================
           ACTUALIZAR IMAGEN DEL VISOR
           ===================================================== */

        function actualizarVisor() {

            if (
                !visorImagen ||
                vistasActuales.length === 0
            ) {

                return;
            }


            var url =
                vistasActuales[
                    indiceActual
                ];


            var datos =
                obtenerDatosTarjeta(
                    tarjetaActual
                );


            /*
             * Cambiar imagen.
             */

            visorImagen.src = url;


            visorImagen.alt =
                datos.alt +
                " — vista " +
                (indiceActual + 1);


            /*
             * Título.
             */

            if (visorTitulo) {

                visorTitulo.textContent =
                    datos.titulo;
            }


            /*
             * Contador.
             */

            if (visorContador) {

                if (
                    vistasActuales.length > 1
                ) {

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


            /*
             * Flechas.
             */

            var hayVariasVistas =
                vistasActuales.length > 1;


            if (visorAnterior) {

                visorAnterior.hidden =
                    !hayVariasVistas;

                visorAnterior.disabled =
                    !hayVariasVistas;
            }


            if (visorSiguiente) {

                visorSiguiente.hidden =
                    !hayVariasVistas;

                visorSiguiente.disabled =
                    !hayVariasVistas;
            }
        }


        /* =====================================================
           ACTUALIZAR DETALLES
           ===================================================== */

        function actualizarDetalles() {

            if (!tarjetaActual) {
                return;
            }


            var datos =
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

                visorDetallesCategoria.textContent =
                    nombreCategoria(
                        datos.categoria
                    );
            }


            /*
             * Marcar medida seleccionada.
             */

            if (visorMedidas) {

                var botones =
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


        /* =====================================================
           ACTUALIZAR WHATSAPP DEL VISOR
           ===================================================== */

        function actualizarWhatsApp() {

            if (
                !visorEncargar ||
                !tarjetaActual
            ) {

                return;
            }


            var datos =
                obtenerDatosTarjeta(
                    tarjetaActual
                );


            var medida =
                tarjetaActual.getAttribute(
                    "data-tamano"
                ) || "A definir";


            var mensaje =
                "Hola, quiero cotizar un cuadro de SublimArts. " +
                "Diseño: " +
                datos.titulo +
                ". " +
                "Categoría: " +
                nombreCategoria(
                    datos.categoria
                ) +
                ". " +
                "Medida: " +
                medida +
                ". " +
                "Vista seleccionada: " +
                (indiceActual + 1) +
                " de " +
                vistasActuales.length +
                ".";


            visorEncargar.href =
                "https://wa.me/" +
                WHATSAPP +
                "?text=" +
                encodeURIComponent(
                    mensaje
                );
        }


        /* =====================================================
           ABRIR VISOR
           ===================================================== */

        function abrirVisor(
            tarjeta,
            indiceInicial
        ) {

            if (
                !tarjeta ||
                !visor
            ) {

                return;
            }


            var vistas =
                obtenerVistas(
                    tarjeta
                );


            /*
             * No abrir si no existen imágenes.
             */

            if (
                vistas.length === 0
            ) {

                return;
            }


            tarjetaActual =
                tarjeta;


            vistasActuales =
                vistas;


            /*
             * Asegurar que el índice
             * esté dentro del rango.
             */

            if (
                typeof indiceInicial !==
                "number"
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


            /*
             * Ocultar detalles al abrir.
             */

            if (visorDetalles) {

                visorDetalles.hidden =
                    true;
            }


            /*
             * Actualizar contenido.
             */

            actualizarVisor();

            actualizarDetalles();

            actualizarWhatsApp();


            /*
             * Mostrar visor.
             */

            visor.classList.add(
                "activo"
            );


            visor.setAttribute(
                "aria-hidden",
                "false"
            );


            document.body.classList.add(
                "visor-abierto"
            );


            /*
             * Bloquear scroll de fondo.
             */

            document.body.style.overflow =
                "hidden";


            /*
             * Enfocar botón X.
             */

            if (visorCerrar) {

                window.setTimeout(
                    function () {

                        visorCerrar.focus();

                    },
                    0
                );
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


            /*
             * Restaurar scroll.
             */

            document.body.style.overflow =
                "";


            /*
             * Limpiar imagen.
             */

            if (visorImagen) {

                visorImagen.removeAttribute(
                    "src"
                );

                visorImagen.alt = "";
            }


            /*
             * Limpiar estado.
             */

            tarjetaActual = null;

            vistasActuales = [];

            indiceActual = 0;
        }


        /* =====================================================
           CAMBIAR VISTA
           
           SOLO DENTRO DEL DISEÑO ACTUAL.
           ===================================================== */

        function cambiarVista(
            direccion
        ) {

            if (
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


        /* =====================================================
           CLICK EN IMAGEN
           ===================================================== */

        if (grid) {

            grid.addEventListener(
                "click",
                function (event) {

                    /*
                     * Verificar que el objetivo
                     * sea un elemento HTML.
                     */

                    if (
                        !event.target ||
                        !event.target.closest
                    ) {

                        return;
                    }


                    var media =
                        event.target.closest(
                            ".tarjeta-cuadro-media"
                        );


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
                        media.querySelector(
                            "img"
                        );


                    if (!imagen) {
                        return;
                    }


                    event.preventDefault();


                    var vistas =
                        obtenerVistas(
                            tarjeta
                        );


                    if (
                        vistas.length === 0
                    ) {

                        return;
                    }


                    /*
                     * Encontrar la vista
                     * correspondiente a la imagen.
                     */

                    var srcImagen =
                        (
                            imagen.getAttribute(
                                "src"
                            ) || ""
                        ).trim();


                    var indice =
                        0;


                    for (
                        var i = 0;
                        i < vistas.length;
                        i++
                    ) {

                        if (
                            vistas[i] ===
                            srcImagen
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

                    event.stopPropagation();

                    cerrarVisor();
                }
            );
        }


        /* =====================================================
           CERRAR VISOR DESDE EL FONDO
           ===================================================== */

        if (visor) {

            visor.addEventListener(
                "click",
                function (event) {

                    /*
                     * Solo cerrar cuando se pulsa
                     * directamente sobre el fondo.
                     */

                    if (
                        event.target === visor
                    ) {

                        cerrarVisor();
                    }
                }
            );
        }


        /* =====================================================
           TECLADO
           ===================================================== */

        document.addEventListener(
            "keydown",
            function (event) {

                /*
                 * VISOR ABIERTO
                 */

                if (
                    visor &&
                    visor.classList.contains(
                        "activo"
                    )
                ) {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        event.preventDefault();

                        cerrarVisor();

                        return;
                    }


                    if (
                        event.key ===
                        "ArrowLeft"
                    ) {

                        event.preventDefault();

                        cambiarVista(-1);

                        return;
                    }


                    if (
                        event.key ===
                        "ArrowRight"
                    ) {

                        event.preventDefault();

                        cambiarVista(1);

                        return;
                    }
                }


                /*
                 * MENÚ MOBILE ABIERTO
                 */

                if (
                    event.key ===
                    "Escape" &&
                    sidebar &&
                    sidebar.classList.contains(
                        "activo"
                    )
                ) {

                    event.preventDefault();

                    cerrarMenuMobile();
                }
            }
        );


        /* =====================================================
           SWIPE MOBILE
           ===================================================== */

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


                    var endX =
                        event.changedTouches[0].clientX;


                    var endY =
                        event.changedTouches[0].clientY;


                    var diferenciaX =
                        endX -
                        touchStartX;


                    var diferenciaY =
                        endY -
                        touchStartY;


                    /*
                     * Solo considerar movimientos
                     * horizontales.
                     */

                    if (
                        Math.abs(
                            diferenciaX
                        ) > 45 &&
                        Math.abs(
                            diferenciaX
                        ) >
                        Math.abs(
                            diferenciaY
                        )
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


        /* =====================================================
           VER / OCULTAR DETALLES
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

                    if (
                        !event.target ||
                        !event.target.closest
                    ) {

                        return;
                    }


                    var boton =
                        event.target.closest(
                            "[data-medida]"
                        );


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


                    if (!medida) {
                        return;
                    }


                    /*
                     * Guardar medida
                     * seleccionada.
                     */

                    tarjetaActual.setAttribute(
                        "data-tamano",
                        medida
                    );


                    /*
                     * Actualizar botones.
                     */

                    var botones =
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


        /* =====================================================
           FILTROS
           ===================================================== */

        function aplicarFiltros() {

            if (!grid) {
                return;
            }


            var tarjetas =
                Array.from(
                    grid.querySelectorAll(
                        ".tarjeta-cuadro"
                    )
                );


            var termino =
                buscador
                    ? (
                        buscador.value || ""
                    )
                        .trim()
                        .toLowerCase()
                    : "";


            var visibles = 0;


            tarjetas.forEach(
                function (tarjeta) {

                    var categoria =
                        (
                            tarjeta.getAttribute(
                                "data-categoria"
                            ) || ""
                        )
                            .trim()
                            .toLowerCase();


                    var nombre =
                        (
                            tarjeta.getAttribute(
                                "data-nombre"
                            ) || ""
                        )
                            .trim()
                            .toLowerCase();


                    var texto =
                        (
                            tarjeta.textContent ||
                            ""
                        ).toLowerCase();


                    /*
                     * Categoría.
                     */

                    var coincideCategoria =
                        filtroActual === "todo" ||
                        categoria === filtroActual;


                    /*
                     * Buscador.
                     */

                    var coincideBusqueda =
                        termino === "" ||
                        nombre.indexOf(
                            termino
                        ) !== -1 ||
                        texto.indexOf(
                            termino
                        ) !== -1;


                    var mostrar =
                        coincideCategoria &&
                        coincideBusqueda;


                    /*
                     * hidden controla
                     * la desaparición real
                     * de la tarjeta.
                     */

                    tarjeta.hidden =
                        !mostrar;


                    /*
                     * También quitamos la clase
                     * por compatibilidad con CSS.
                     */

                    tarjeta.classList.toggle(
                        "tarjeta-filtrada",
                        !mostrar
                    );


                    if (mostrar) {
                        visibles++;
                    }
                }
            );


            /*
             * Mostrar mensaje vacío.
             */

            if (vacio) {

                vacio.hidden =
                    visibles !== 0;
            }
        }


        /* =====================================================
           BOTONES TODOS / PAISAJES / CIUDADES
           ===================================================== */

        tabs.forEach(
            function (tab) {

                tab.addEventListener(
                    "click",
                    function () {

                        filtroActual =
                            tab.getAttribute(
                                "data-filtro"
                            ) || "todo";


                        /*
                         * Actualizar estado visual.
                         */

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


                        /*
                         * Aplicar filtro.
                         */

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
                function () {

                    aplicarFiltros();
                }
            );
        }


        /* =====================================================
           ORDENAMIENTO
           ===================================================== */

        if (orden) {

            orden.addEventListener(
                "change",
                function () {

                    if (!grid) {
                        return;
                    }


                    var tarjetas =
                        Array.from(
                            grid.querySelectorAll(
                                ".tarjeta-cuadro"
                            )
                        );


                    var valor =
                        orden.value;


                    /*
                     * A-Z
                     */

                    if (
                        valor === "az"
                    ) {

                        tarjetas.sort(
                            function (a, b) {

                                var nombreA =
                                    a.getAttribute(
                                        "data-nombre"
                                    ) || "";


                                var nombreB =
                                    b.getAttribute(
                                        "data-nombre"
                                    ) || "";


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
                    }


                    /*
                     * Z-A
                     */

                    else if (
                        valor === "za"
                    ) {

                        tarjetas.sort(
                            function (a, b) {

                                var nombreA =
                                    a.getAttribute(
                                        "data-nombre"
                                    ) || "";


                                var nombreB =
                                    b.getAttribute(
                                        "data-nombre"
                                    ) || "";


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
                    }


                    /*
                     * TAMAÑO
                     */

                    else if (
                        valor === "tamano"
                    ) {

                        tarjetas.sort(
                            function (a, b) {

                                return (
                                    convertirTamanoAPuntos(
                                        a.getAttribute(
                                            "data-tamano"
                                        )
                                    ) -
                                    convertirTamanoAPuntos(
                                        b.getAttribute(
                                            "data-tamano"
                                        )
                                    )
                                );
                            }
                        );
                    }


                    /*
                     * RECIENTES
                     */

                    else {

                        tarjetas.sort(
                            function (a, b) {

                                var ordenA =
                                    Number(
                                        a.getAttribute(
                                            "data-orden"
                                        ) || 0
                                    );


                                var ordenB =
                                    Number(
                                        b.getAttribute(
                                            "data-orden"
                                        ) || 0
                                    );


                                return (
                                    ordenB -
                                    ordenA
                                );
                            }
                        );
                    }


                    /*
                     * Reinsertar las tarjetas.
                     */

                    tarjetas.forEach(
                        function (tarjeta) {

                            grid.appendChild(
                                tarjeta
                            );
                        }
                    );


                    /*
                     * Volver a aplicar
                     * filtro y buscador.
                     */

                    aplicarFiltros();
                }
            );
        }


        /* =====================================================
           CONVERTIR TAMAÑO A VALOR NUMÉRICO
           ===================================================== */

        function convertirTamanoAPuntos(
            tamano
        ) {

            var medidas = {

                "20x30": 1,

                "30x40": 2,

                "A3": 3,

                "40x60": 4,

                "50x70": 5
            };


            return (
                medidas[tamano] || 999
            );
        }


        /* =====================================================
           FOOTER MOBILE
           ===================================================== */

        if (
            mobileFooterToggle &&
            mobileFooterMenu
        ) {

            /*
             * Estado inicial.
             */

            mobileFooterMenu.hidden =
                true;


            mobileFooterToggle.setAttribute(
                "aria-expanded",
                "false"
            );


            mobileFooterToggle.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    var abierto =
                        mobileFooterToggle.getAttribute(
                            "aria-expanded"
                        ) === "true";


                    var nuevoEstado =
                        !abierto;


                    mobileFooterToggle.setAttribute(
                        "aria-expanded",
                        nuevoEstado
                            ? "true"
                            : "false"
                    );


                    mobileFooterMenu.hidden =
                        !nuevoEstado;
                }
            );
        }


        /* =====================================================
           WHATSAPP GENERAL
           
           Cualquier elemento con:
           
           data-servicio="Paisajes y Ciudades"
           
           será convertido automáticamente
           en un enlace de WhatsApp.
           ===================================================== */

        var enlacesWhatsApp =
            document.querySelectorAll(
                "[data-servicio]"
            );


        enlacesWhatsApp.forEach(
            function (enlace) {

                enlace.addEventListener(
                    "click",
                    function (event) {

                        var servicio =
                            enlace.getAttribute(
                                "data-servicio"
                            ) || "Cotización";


                        var href =
                            enlace.getAttribute(
                                "href"
                            ) || "";


                        /*
                         * Si el elemento ya tiene
                         * un enlace real a WhatsApp,
                         * no lo modificamos.
                         */

                        if (
                            href.indexOf(
                                "https://wa.me/"
                            ) === 0
                        ) {

                            return;
                        }


                        event.preventDefault();


                        var mensaje =
                            "Hola, quiero cotizar en SublimArts. " +
                            "Servicio: " +
                            servicio +
                            ". " +
                            "Quisiera conocer opciones y precios disponibles.";


                        var url =
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
                );
            }
        );


        /* =====================================================
           INICIALIZAR FILTROS
           ===================================================== */

        aplicarFiltros();


        /* =====================================================
           ESTADO INICIAL DEL VISOR
           ===================================================== */

        if (visor) {

            visor.classList.remove(
                "activo"
            );


            visor.setAttribute(
                "aria-hidden",
                "true"
            );
        }


        /* =====================================================
           ESTADO INICIAL DEL MENÚ
           ===================================================== */

        if (sidebar) {

            sidebar.classList.remove(
                "activo"
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
        }

    });

})();
```
