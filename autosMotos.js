/* =========================================================
   AUTOS Y MOTOS — autosMotos.js
   Visor de 1 producto con hasta 4 perspectivas
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

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
    const visorAnterior = document.getElementById("visorAnterior");
    const visorSiguiente = document.getElementById("visorSiguiente");
    const visorCerrar = document.getElementById("visorCerrar");

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

    const visorEncargar =
        document.getElementById("visorEncargar");

    const visorMedidas =
        document.getElementById("visorMedidas");

    /* =========================================================
       ESTADO
       ========================================================= */

    let filtroActual = "todo";
    let indiceActual = 0;
    let vistasActuales = [];
    let tarjetaActual = null;

    let touchStartX = 0;
    let touchStartY = 0;

    /*
     * REEMPLAZA ESTE NÚMERO POR EL WHATSAPP REAL DE SUBLIMARTS.
     * Formato internacional, sin +, espacios ni guiones.
     */
    const WHATSAPP = "56900000000";


    /* =========================================================
       OBTENER LAS 4 VISTAS DE UN VEHÍCULO
       =========================================================

       El HTML utiliza:

       data-view-1
       data-view-2
       data-view-3
       data-view-4

       NO usamos dataset.view1 porque el nombre real del
       atributo contiene guiones.
    */

    function obtenerVistas(tarjeta) {

        const vistas = [];

        for (let i = 1; i <= 4; i++) {

            const url =
                (tarjeta.getAttribute(`data-view-${i}`) || "")
                .trim();

            if (url) {
                vistas.push(url);
            }
        }

        /*
         * Si por alguna razón la tarjeta no tiene data-view,
         * utilizamos su imagen principal.
         */
        if (vistas.length === 0) {

            const imagen =
                tarjeta.querySelector(
                    ".tarjeta-cuadro-media img"
                );

            const src =
                imagen
                    ? (imagen.getAttribute("src") || "").trim()
                    : "";

            if (src) {
                vistas.push(src);
            }
        }

        return vistas;
    }


    /* =========================================================
       DATOS DEL PRODUCTO
       ========================================================= */

    function obtenerDatosTarjeta(tarjeta) {

        const imagen =
            tarjeta.querySelector(
                ".tarjeta-cuadro-media img"
            );

        const titulo =
            (
                tarjeta.dataset.nombre ||
                tarjeta.querySelector("h3")?.textContent ||
                "Cuadro"
            ).trim();

        const categoria =
            (
                tarjeta.dataset.categoria ||
                tarjeta.dataset.vehiculo ||
                "—"
            ).trim();

        const tamano =
            (tarjeta.dataset.tamano || "").trim();

        const descripcion =
            tarjeta.dataset.descripcion ||
            tarjeta.querySelector(".tarjeta-meta")?.textContent ||
            "Cuadro personalizado en alta calidad.";

        return {
            titulo,
            categoria,
            tamano,
            descripcion,
            alt: imagen?.getAttribute("alt") || titulo
        };
    }


    /* =========================================================
       ACTUALIZAR IMAGEN DEL VISOR
       ========================================================= */

    function actualizarVisor() {

        if (!visorImagen || !vistasActuales.length) {
            return;
        }

        const url =
            vistasActuales[indiceActual];

        visorImagen.src = url;

        const datos =
            tarjetaActual
                ? obtenerDatosTarjeta(tarjetaActual)
                : null;

        visorImagen.alt =
            `${datos ? datos.titulo : "Cuadro"} — vista ${indiceActual + 1}`;

        if (visorTitulo && datos) {
            visorTitulo.textContent =
                datos.titulo;
        }

        if (visorContador) {

            if (vistasActuales.length > 1) {

                visorContador.textContent =
                    `Vista ${indiceActual + 1} de ${vistasActuales.length}`;

            } else {

                visorContador.textContent =
                    "1 vista";
            }
        }

        /*
         * Si solamente existe una imagen,
         * ocultamos/desactivamos las flechas.
         */
        if (visorAnterior) {

            visorAnterior.hidden =
                vistasActuales.length <= 1;

            visorAnterior.disabled =
                vistasActuales.length <= 1;
        }

        if (visorSiguiente) {

            visorSiguiente.hidden =
                vistasActuales.length <= 1;

            visorSiguiente.disabled =
                vistasActuales.length <= 1;
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
            obtenerDatosTarjeta(tarjetaActual);

        if (visorDetallesTitulo) {

            visorDetallesTitulo.textContent =
                datos.titulo;
        }

        if (visorDetallesDescripcion) {

            visorDetallesDescripcion.textContent =
                datos.descripcion;
        }

        if (visorDetallesCategoria) {

            if (datos.categoria === "autos") {

                visorDetallesCategoria.textContent =
                    "Auto";

            } else if (datos.categoria === "motos") {

                visorDetallesCategoria.textContent =
                    "Moto";

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

            botones.forEach(boton => {

                boton.classList.toggle(
                    "activo",
                    boton.dataset.medida === datos.tamano
                );

            });
        }
    }


    /* =========================================================
       WHATSAPP
       ========================================================= */

    function actualizarWhatsApp() {

        if (!visorEncargar || !tarjetaActual) {
            return;
        }

        const datos =
            obtenerDatosTarjeta(tarjetaActual);

        const medida =
            tarjetaActual.dataset.tamano ||
            "A definir";

        const mensaje =
            `Hola, quiero cotizar el cuadro "${datos.titulo}". ` +
            `Tipo: ${datos.categoria}. ` +
            `Medida: ${medida}. ` +
            `Me interesa la vista ${indiceActual + 1} ` +
            `de ${vistasActuales.length}.`;

        visorEncargar.href =
            `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    }


    /* =========================================================
       ABRIR VISOR
       ========================================================= */

    function abrirVisor(
        tarjeta,
        indiceInicial = 0
    ) {

        const vistas =
            obtenerVistas(tarjeta);

        /*
         * Si no hay ninguna imagen real,
         * no abrimos el visor.
         */
        if (!vistas.length || !visor) {
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
                    indiceInicial,
                    vistasActuales.length - 1
                )
            );

        actualizarVisor();
        actualizarDetalles();
        actualizarWhatsApp();

        /*
         * Cada vez que se abre el visor,
         * los detalles empiezan cerrados.
         */
        if (visorDetalles) {
            visorDetalles.hidden = true;
        }

        /*
         * ESTA ES LA CLAVE:
         * agregamos la clase "activo" que utiliza
         * el CSS para mostrar el modal.
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

            setTimeout(() => {
                visorCerrar.focus();
            }, 0);
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

        tarjetaActual =
            null;

        vistasActuales =
            [];

        indiceActual =
            0;
    }


    /* =========================================================
       CAMBIAR VISTA
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

        /*
         * IMPORTANTE:
         * solamente recorremos las imágenes del mismo
         * vehículo.
         *
         * No cambiamos de tarjeta/producto.
         */
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
       CLICK EN LA IMAGEN DE UNA TARJETA
       ========================================================= */

    if (grid) {

        grid.addEventListener(
            "click",
            event => {

                const tarjeta =
                    event.target.closest(
                        ".tarjeta-cuadro"
                    );

                if (
                    !tarjeta ||
                    !grid.contains(tarjeta)
                ) {
                    return;
                }

                /*
                 * Solamente abrimos el visor cuando se
                 * pulsa el área de imagen.
                 */
                const media =
                    event.target.closest(
                        ".tarjeta-cuadro-media"
                    );

                if (!media) {
                    return;
                }

                event.preventDefault();

                const imagen =
                    media.querySelector("img");

                if (!imagen) {
                    return;
                }

                const vistas =
                    obtenerVistas(tarjeta);

                if (!vistas.length) {
                    return;
                }

                /*
                 * Buscamos cuál de las vistas corresponde
                 * a la imagen que el usuario pulsó.
                 *
                 * Normalmente será la vista 1, pero esto
                 * permite que el sistema funcione también
                 * si posteriormente se muestran otras
                 * vistas en la tarjeta.
                 */
                let indice =
                    0;

                const srcImagen =
                    (
                        imagen.getAttribute("src") ||
                        ""
                    ).trim();

                for (
                    let i = 0;
                    i < vistas.length;
                    i++
                ) {

                    const dataUrl =
                        (
                            tarjeta.getAttribute(
                                `data-view-${i + 1}`
                            ) ||
                            ""
                        ).trim();

                    if (
                        dataUrl &&
                        dataUrl === srcImagen
                    ) {

                        indice =
                            i;

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
            event => {

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
            event => {

                event.preventDefault();
                event.stopPropagation();

                cambiarVista(1);
            }
        );
    }


    /* =========================================================
       BOTÓN CERRAR
       ========================================================= */

    if (visorCerrar) {

        visorCerrar.addEventListener(
            "click",
            event => {

                event.preventDefault();

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
            event => {

                /*
                 * Solamente el fondo cierra el visor.
                 *
                 * Si se pulsa imagen, flechas, detalles,
                 * botones, etc., NO se cierra.
                 */
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
       ========================================================= */

    document.addEventListener(
        "keydown",
        event => {

            if (
                !visor ||
                !visor.classList.contains("activo")
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
       SWIPE PARA CELULAR
       ========================================================= */

    if (visorImagen) {

        visorImagen.addEventListener(
            "touchstart",
            event => {

                if (!event.touches.length) {
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
            event => {

                if (!event.changedTouches.length) {
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
                 * Evitamos interpretar desplazamientos
                 * verticales como cambio de imagen.
                 */
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


    /* =========================================================
       BOTÓN VER DETALLES
       ========================================================= */

    if (visorVerDetalles) {

        visorVerDetalles.addEventListener(
            "click",
            event => {

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


    /* =========================================================
       MEDIDAS
       ========================================================= */

    if (visorMedidas) {

        visorMedidas.addEventListener(
            "click",
            event => {

                const boton =
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

                const medida =
                    boton.dataset.medida;

                tarjetaActual.dataset.tamano =
                    medida;

                visorMedidas
                    .querySelectorAll(
                        "[data-medida]"
                    )
                    .forEach(btn => {

                        btn.classList.toggle(
                            "activo",
                            btn === boton
                        );
                    });

                actualizarWhatsApp();
            }
        );
    }


    /* =========================================================
       FILTROS
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

        const termino =
            (
                buscador?.value ||
                ""
            )
            .trim()
            .toLowerCase();

        let visibles =
            0;

        tarjetas.forEach(
            tarjeta => {

                const categoria =
                    (
                        tarjeta.dataset.categoria ||
                        ""
                    ).toLowerCase();

                const nombre =
                    (
                        tarjeta.dataset.nombre ||
                        ""
                    ).toLowerCase();

                const texto =
                    tarjeta.textContent.toLowerCase();

                const coincideCategoria =
                    filtroActual === "todo" ||
                    categoria === filtroActual;

                const coincideBusqueda =
                    !termino ||
                    nombre.includes(termino) ||
                    texto.includes(termino);

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
       TABS AUTOS / MOTOS / TODOS
       ========================================================= */

    tabs.forEach(
        tab => {

            tab.addEventListener(
                "click",
                () => {

                    filtroActual =
                        tab.dataset.filtro ||
                        "todo";

                    tabs.forEach(
                        item => {

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
            aplicarFiltros
        );
    }


    /* =========================================================
       ORDENAMIENTO
       ========================================================= */

    if (orden && grid) {

        orden.addEventListener(
            "change",
            () => {

                const tarjetas =
                    Array.from(
                        grid.querySelectorAll(
                            ".tarjeta-cuadro"
                        )
                    );

                switch (orden.value) {

                    case "az":

                        tarjetas.sort(
                            (a, b) =>
                                (
                                    a.dataset.nombre ||
                                    ""
                                ).localeCompare(
                                    b.dataset.nombre ||
                                    "",
                                    "es",
                                    {
                                        sensitivity:
                                            "base"
                                    }
                                )
                        );

                        break;


                    case "za":

                        tarjetas.sort(
                            (a, b) =>
                                (
                                    b.dataset.nombre ||
                                    ""
                                ).localeCompare(
                                    a.dataset.nombre ||
                                    "",
                                    "es",
                                    {
                                        sensitivity:
                                            "base"
                                    }
                                )
                        );

                        break;


                    case "tamano":

                        tarjetas.sort(
                            (a, b) =>
                                (
                                    a.dataset.tamano ||
                                    ""
                                ).localeCompare(
                                    b.dataset.tamano ||
                                    "",
                                    "es",
                                    {
                                        numeric:
                                            true
                                    }
                                )
                        );

                        break;


                    case "recientes":

                    default:

                        /*
                         * Si no hay data-orden, dejamos
                         * el orden original del HTML.
                         */
                        tarjetas.sort(
                            (a, b) =>
                                Number(
                                    a.dataset.orden ||
                                    0
                                ) -
                                Number(
                                    b.dataset.orden ||
                                    0
                                )
                        );

                        break;
                }

                tarjetas.forEach(
                    tarjeta => {

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
       MENÚ MÓVIL DEL FOOTER
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
            event => {

                event.preventDefault();

                const abierto =
                    mobileFooterToggle
                        .getAttribute(
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
       ========================================================= */

    document
        .querySelectorAll(
            "[data-servicio]"
        )
        .forEach(
            enlace => {

                enlace.addEventListener(
                    "click",
                    event => {

                        const servicio =
                            enlace.dataset.servicio ||
                            "Cotización";

                        if (
                            !enlace.href ||
                            enlace.getAttribute(
                                "href"
                            ) === "#"
                        ) {

                            event.preventDefault();

                            const mensaje =
                                `Hola, quiero cotizar: ${servicio}.`;

                            window.open(
                                `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`,
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