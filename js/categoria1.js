/* ============================================================
   SUBLIMARTS — INDEX / SUBLIMACIÓN
   JavaScript principal

   Incluye:
   - Hero carrusel con autoplay
   - Carruseles horizontales
   - Carrusel de información
   - Menú mobile
   - Submenús acordeón
   - Animaciones reveal
   - Navegación suave
   - Soporte táctil
   - Navegación mediante teclado
   ============================================================ */


/* ============================================================
   1. CARRUSEL HORIZONTAL
   ============================================================ */

class Carrusel {
    constructor(contenedorId, pistaId, opciones = {}) {
        this.contenedor = document.getElementById(contenedorId);

        if (!this.contenedor) {
            return;
        }

        this.pista = document.getElementById(pistaId);
        this.vista = this.contenedor.querySelector(".carrusel-vista");

        this.btnAnterior = this.contenedor.querySelector(
            ".carrusel-flecha-anterior"
        );

        this.btnSiguiente = this.contenedor.querySelector(
            ".carrusel-flecha-siguiente"
        );

        if (!this.pista || !this.vista) {
            return;
        }

        this.slides = Array.from(this.pista.children);

        this.opciones = {
            visiblesDesktop: opciones.visiblesDesktop || 4,
            visiblesTablet: opciones.visiblesTablet || 3,
            visiblesMobile: opciones.visiblesMobile || 1,
            gap: opciones.gap || 20,
            ...opciones
        };

        this.esMobile = window.innerWidth <= 768;
        this.anchoSlide = 0;

        this.init();
    }


    /* --------------------------------------------------------
       Inicialización
       -------------------------------------------------------- */

    init() {
        if (this.slides.length === 0) {
            return;
        }

        this.calcularDimensiones();
        this.bindEventos();
        this.actualizarBotones();
    }


    /* --------------------------------------------------------
       Calcular dimensiones
       -------------------------------------------------------- */

    calcularDimensiones() {
        if (!this.vista) {
            return;
        }

        /*
         * MOBILE
         * Cada elemento ocupa prácticamente todo el ancho.
         */

        if (this.esMobile) {
            this.anchoSlide = this.vista.offsetWidth;

            this.slides.forEach((slide) => {
                slide.style.width = "100%";
            });

            return;
        }


        /*
         * TABLET / DESKTOP
         */

        const gap = this.opciones.gap;

        const visibles =
            window.innerWidth <= 1024
                ? this.opciones.visiblesTablet
                : this.opciones.visiblesDesktop;

        const anchoDisponible = this.vista.offsetWidth;

        const anchoSlide =
            (
                anchoDisponible -
                gap * (visibles - 1)
            ) / visibles;

        this.anchoSlide = anchoSlide;

        this.slides.forEach((slide) => {
            slide.style.width = `${anchoSlide}px`;
        });
    }


    /* --------------------------------------------------------
       Eventos
       -------------------------------------------------------- */

    bindEventos() {

        /*
         * Botón anterior
         */

        if (this.btnAnterior) {
            this.btnAnterior.addEventListener("click", () => {
                this.desplazar(-1);
            });
        }


        /*
         * Botón siguiente
         */

        if (this.btnSiguiente) {
            this.btnSiguiente.addEventListener("click", () => {
                this.desplazar(1);
            });
        }


        /*
         * Actualizar botones cuando se desplaza
         */

        this.vista.addEventListener(
            "scroll",
            () => {
                if (!this.esMobile) {
                    this.actualizarBotones();
                }
            },
            {
                passive: true
            }
        );


        /*
         * Navegación mediante teclado
         */

        this.contenedor.addEventListener("keydown", (evento) => {

            if (evento.key === "ArrowLeft") {
                evento.preventDefault();
                this.desplazar(-1);
            }

            if (evento.key === "ArrowRight") {
                evento.preventDefault();
                this.desplazar(1);
            }
        });


        /*
         * Responsive
         */

        let resizeTimer;

        window.addEventListener("resize", () => {

            clearTimeout(resizeTimer);

            resizeTimer = setTimeout(() => {

                this.esMobile = window.innerWidth <= 768;

                this.calcularDimensiones();

                this.actualizarBotones();

            }, 250);
        });
    }


    /* --------------------------------------------------------
       Desplazar carrusel
       -------------------------------------------------------- */

    desplazar(direccion) {

        if (!this.vista) {
            return;
        }

        const paso = this.anchoSlide + this.opciones.gap;

        const nuevoScroll =
            this.vista.scrollLeft +
            direccion * paso;

        this.vista.scrollTo({
            left: nuevoScroll,
            behavior: "smooth"
        });
    }


    /* --------------------------------------------------------
       Actualizar botones
       -------------------------------------------------------- */

    actualizarBotones() {

        if (
            !this.btnAnterior ||
            !this.btnSiguiente ||
            !this.vista
        ) {
            return;
        }

        const scrollActual = this.vista.scrollLeft;

        const anchoTotal = this.pista.scrollWidth;

        const anchoVista = this.vista.clientWidth;

        this.btnAnterior.disabled =
            scrollActual <= 5;

        this.btnSiguiente.disabled =
            scrollActual >=
            anchoTotal - anchoVista - 10;
    }
}


/* ============================================================
   2. HERO CARRUSEL
   ============================================================ */

class HeroCarrusel {

    constructor(
        seccionId,
        pistaId,
        indicadoresId,
        opciones = {}
    ) {

        this.seccion =
            document.getElementById(seccionId);

        this.pista =
            document.getElementById(pistaId);

        this.indicadoresContenedor =
            document.getElementById(indicadoresId);

        if (!this.seccion || !this.pista) {
            return;
        }

        this.slides =
            Array.from(
                this.pista.querySelectorAll(".hero-slide")
            );

        this.indicadores =
            this.indicadoresContenedor
                ? Array.from(
                    this.indicadoresContenedor.querySelectorAll(
                        ".hero-indicador"
                    )
                )
                : [];

        this.indice = 0;

        this.intervalo =
            opciones.intervalo || 5000;

        this.temporizador = null;

        this.reducirMovimiento =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

        this.touchInicioX = 0;
        this.touchInicioY = 0;

        this.touchDeltaX = 0;
        this.touchDeltaY = 0;

        this.tracking = false;

        this.init();
    }


    /* --------------------------------------------------------
       Inicializar
       -------------------------------------------------------- */

    init() {

        if (this.slides.length <= 1) {
            return;
        }


        /*
         * Indicadores
         */

        this.indicadores.forEach(
            (indicador, indice) => {

                indicador.addEventListener(
                    "click",
                    () => {

                        this.irSlide(indice);

                        this.reiniciarAutoplay();
                    }
                );
            }
        );


        /*
         * Pausar al pasar el mouse
         */

        this.seccion.addEventListener(
            "mouseenter",
            () => {
                this.detenerAutoplay();
            }
        );

        this.seccion.addEventListener(
            "mouseleave",
            () => {
                this.reiniciarAutoplay();
            }
        );


        /*
         * Pausar cuando recibe foco
         */

        this.seccion.addEventListener(
            "focusin",
            () => {
                this.detenerAutoplay();
            }
        );

        this.seccion.addEventListener(
            "focusout",
            () => {
                this.reiniciarAutoplay();
            }
        );


        /*
         * TOUCH START
         */

        this.seccion.addEventListener(
            "touchstart",
            (evento) => {

                this.touchInicioX =
                    evento.touches[0].clientX;

                this.touchInicioY =
                    evento.touches[0].clientY;

                this.touchDeltaX = 0;
                this.touchDeltaY = 0;

                this.tracking = true;

                this.detenerAutoplay();
            },
            {
                passive: true
            }
        );


        /*
         * TOUCH MOVE
         */

        this.seccion.addEventListener(
            "touchmove",
            (evento) => {

                if (!this.tracking) {
                    return;
                }

                this.touchDeltaX =
                    evento.touches[0].clientX -
                    this.touchInicioX;

                this.touchDeltaY =
                    evento.touches[0].clientY -
                    this.touchInicioY;


                /*
                 * Detectar swipe horizontal
                 */

                if (
                    Math.abs(this.touchDeltaX) >
                    Math.abs(this.touchDeltaY)
                ) {

                    evento.preventDefault();
                }
            },
            {
                passive: false
            }
        );


        /*
         * TOUCH END
         */

        this.seccion.addEventListener(
            "touchend",
            () => {

                if (!this.tracking) {
                    return;
                }

                this.tracking = false;

                const umbral = 50;


                if (this.touchDeltaX < -umbral) {

                    this.navegar(1);

                } else if (this.touchDeltaX > umbral) {

                    this.navegar(-1);
                }


                this.touchDeltaX = 0;
                this.touchDeltaY = 0;

                this.reiniciarAutoplay();
            }
        );


        /*
         * Mostrar primer slide
         */

        this.mostrarSlide(this.indice);


        /*
         * Autoplay
         */

        if (!this.reducirMovimiento) {
            this.iniciarAutoplay();
        }
    }


    /* --------------------------------------------------------
       Navegar
       -------------------------------------------------------- */

    navegar(direccion) {

        this.irSlide(
            this.indice + direccion
        );
    }


    /* --------------------------------------------------------
       Ir a slide específico
       -------------------------------------------------------- */

    irSlide(nuevoIndice) {

        this.indice =
            (
                nuevoIndice +
                this.slides.length
            ) %
            this.slides.length;

        this.mostrarSlide(
            this.indice
        );
    }


    /* --------------------------------------------------------
       Mostrar slide
       -------------------------------------------------------- */

    mostrarSlide(indice) {

        this.slides.forEach(
            (slide, posicion) => {

                slide.classList.toggle(
                    "activo",
                    posicion === indice
                );
            }
        );


        this.indicadores.forEach(
            (indicador, posicion) => {

                indicador.classList.toggle(
                    "activo",
                    posicion === indice
                );
            }
        );
    }


    /* --------------------------------------------------------
       Autoplay
       -------------------------------------------------------- */

    iniciarAutoplay() {

        this.detenerAutoplay();

        this.temporizador =
            setInterval(
                () => {
                    this.navegar(1);
                },
                this.intervalo
            );
    }


    detenerAutoplay() {

        if (this.temporizador) {

            clearInterval(
                this.temporizador
            );

            this.temporizador = null;
        }
    }


    reiniciarAutoplay() {

        this.detenerAutoplay();

        if (!this.reducirMovimiento) {
            this.iniciarAutoplay();
        }
    }
}


/* ============================================================
   3. CARRUSEL DE INFORMACIÓN
   ============================================================ */

class CarruselInfo {

    constructor(id) {

        this.carrusel =
            document.getElementById(id);

        if (!this.carrusel) {
            return;
        }

        this.slides =
            Array.from(
                this.carrusel.querySelectorAll(
                    ".info-slide"
                )
            );

        this.indicadores =
            Array.from(
                this.carrusel.querySelectorAll(
                    ".info-indicador"
                )
            );

        this.btnAnterior =
            this.carrusel.querySelector(
                ".info-carrusel-flecha.anterior"
            );

        this.btnSiguiente =
            this.carrusel.querySelector(
                ".info-carrusel-flecha.siguiente"
            );

        this.indice = 0;

        this.touchInicioX = 0;
        this.touchDeltaX = 0;

        this.init();
    }


    /* --------------------------------------------------------
       Inicializar
       -------------------------------------------------------- */

    init() {

        if (this.slides.length === 0) {
            return;
        }


        /*
         * Botón anterior
         */

        if (this.btnAnterior) {

            this.btnAnterior.addEventListener(
                "click",
                () => {
                    this.navegar(-1);
                }
            );
        }


        /*
         * Botón siguiente
         */

        if (this.btnSiguiente) {

            this.btnSiguiente.addEventListener(
                "click",
                () => {
                    this.navegar(1);
                }
            );
        }


        /*
         * Indicadores
         */

        this.indicadores.forEach(
            (indicador, indice) => {

                indicador.addEventListener(
                    "click",
                    () => {
                        this.irSlide(indice);
                    }
                );
            }
        );


        /*
         * Teclado
         */

        this.carrusel.addEventListener(
            "keydown",
            (evento) => {

                if (
                    evento.key === "ArrowLeft"
                ) {

                    evento.preventDefault();

                    this.navegar(-1);
                }


                if (
                    evento.key === "ArrowRight"
                ) {

                    evento.preventDefault();

                    this.navegar(1);
                }
            }
        );


        /*
         * Touch start
         */

        this.carrusel.addEventListener(
            "touchstart",
            (evento) => {

                this.touchInicioX =
                    evento.touches[0].clientX;

                this.touchDeltaX = 0;
            },
            {
                passive: true
            }
        );


        /*
         * Touch move
         */

        this.carrusel.addEventListener(
            "touchmove",
            (evento) => {

                this.touchDeltaX =
                    evento.touches[0].clientX -
                    this.touchInicioX;

                if (
                    Math.abs(
                        this.touchDeltaX
                    ) > 10
                ) {

                    evento.preventDefault();
                }
            },
            {
                passive: false
            }
        );


        /*
         * Touch end
         */

        this.carrusel.addEventListener(
            "touchend",
            () => {

                const umbral = 50;


                if (
                    this.touchDeltaX <
                    -umbral
                ) {

                    this.navegar(1);

                } else if (
                    this.touchDeltaX >
                    umbral
                ) {

                    this.navegar(-1);
                }


                this.touchDeltaX = 0;
            }
        );


        /*
         * Mostrar inicial
         */

        this.mostrarSlide(
            this.indice
        );
    }


    /* --------------------------------------------------------
       Navegar
       -------------------------------------------------------- */

    navegar(direccion) {

        this.irSlide(
            this.indice + direccion
        );
    }


    /* --------------------------------------------------------
       Ir a slide
       -------------------------------------------------------- */

    irSlide(nuevoIndice) {

        this.indice =
            (
                nuevoIndice +
                this.slides.length
            ) %
            this.slides.length;

        this.mostrarSlide(
            this.indice
        );
    }


    /* --------------------------------------------------------
       Mostrar slide
       -------------------------------------------------------- */

    mostrarSlide(indice) {

        this.slides.forEach(
            (slide, posicion) => {

                slide.classList.toggle(
                    "activo",
                    posicion === indice
                );
            }
        );


        this.indicadores.forEach(
            (indicador, posicion) => {

                indicador.classList.toggle(
                    "activo",
                    posicion === indice
                );
            }
        );
    }
}


/* ============================================================
   4. MENÚ MOBILE
   ============================================================ */

class MenuMobile {

    constructor() {

        this.boton =
            document.getElementById(
                "botonMenuMobile"
            );

        this.menu =
            document.getElementById(
                "menuPrincipal"
            );

        this.overlay =
            document.getElementById(
                "menuOverlay"
            );

        if (
            !this.boton ||
            !this.menu ||
            !this.overlay
        ) {
            return;
        }

        this.estaAbierto = false;

        this.init();
    }


    /* --------------------------------------------------------
       Inicializar
       -------------------------------------------------------- */

    init() {

        /*
         * Botón hamburguesa
         */

        this.boton.addEventListener(
            "click",
            (evento) => {

                evento.preventDefault();
                evento.stopPropagation();

                this.toggleMenu();
            }
        );


        /*
         * Overlay
         */

        this.overlay.addEventListener(
            "click",
            (evento) => {

                evento.preventDefault();

                this.cerrarMenu();
            }
        );


        /*
         * Submenús
         */

        const botonesSubmenu =
            document.querySelectorAll(
                ".enlace-menu-desplegable"
            );

        botonesSubmenu.forEach(
            (boton) => {

                boton.addEventListener(
                    "click",
                    (evento) => {

                        this.handleSubmenuClick(
                            evento,
                            boton
                        );
                    }
                );
            }
        );


        /*
         * Cerrar al seleccionar enlace
         */

        const enlacesMenu =
            document.querySelectorAll(
                ".enlace-menu, .submenu a"
            );

        enlacesMenu.forEach(
            (enlace) => {

                enlace.addEventListener(
                    "click",
                    () => {

                        if (
                            window.innerWidth <= 768 &&
                            this.estaAbierto
                        ) {

                            setTimeout(
                                () => {
                                    this.cerrarMenu();
                                },
                                150
                            );
                        }
                    }
                );
            }
        );


        /*
         * Escape
         */

        document.addEventListener(
            "keydown",
            (evento) => {

                if (
                    evento.key === "Escape" &&
                    this.estaAbierto
                ) {

                    this.cerrarMenu();

                    this.boton.focus();
                }
            }
        );


        /*
         * Reset al pasar a desktop
         */

        window.addEventListener(
            "resize",
            () => {

                if (
                    window.innerWidth > 768 &&
                    this.estaAbierto
                ) {

                    this.cerrarMenu();
                }
            }
        );
    }


    /* --------------------------------------------------------
       Submenú
       -------------------------------------------------------- */

    handleSubmenuClick(
        evento,
        boton
    ) {

        if (
            window.innerWidth > 768
        ) {
            return;
        }

        evento.preventDefault();
        evento.stopPropagation();


        const padre =
            boton.closest(
                ".menu-con-desplegable"
            );

        if (!padre) {
            return;
        }


        /*
         * Cerrar otros submenús
         */

        document
            .querySelectorAll(
                ".menu-con-desplegable.activo"
            )
            .forEach(
                (item) => {

                    if (item !== padre) {

                        item.classList.remove(
                            "activo"
                        );

                        const otroBoton =
                            item.querySelector(
                                ".enlace-menu-desplegable"
                            );

                        if (otroBoton) {

                            otroBoton.setAttribute(
                                "aria-expanded",
                                "false"
                            );
                        }
                    }
                }
            );


        /*
         * Toggle
         */

        const estaActivo =
            padre.classList.contains(
                "activo"
            );

        padre.classList.toggle(
            "activo",
            !estaActivo
        );

        boton.setAttribute(
            "aria-expanded",
            String(!estaActivo)
        );
    }


    /* --------------------------------------------------------
       Toggle
       -------------------------------------------------------- */

    toggleMenu() {

        if (this.estaAbierto) {

            this.cerrarMenu();

        } else {

            this.abrirMenu();
        }
    }


    /* --------------------------------------------------------
       Abrir
       -------------------------------------------------------- */

    abrirMenu() {

        this.estaAbierto = true;

        this.menu.classList.add(
            "activo"
        );

        this.overlay.classList.add(
            "activo"
        );

        document.body.style.overflow =
            "hidden";

        this.boton.setAttribute(
            "aria-expanded",
            "true"
        );

        this.boton.setAttribute(
            "aria-label",
            "Cerrar menú"
        );
    }


    /* --------------------------------------------------------
       Cerrar
       -------------------------------------------------------- */

    cerrarMenu() {

        this.estaAbierto = false;

        this.menu.classList.remove(
            "activo"
        );

        this.overlay.classList.remove(
            "activo"
        );

        document.body.style.overflow =
            "";

        this.boton.setAttribute(
            "aria-expanded",
            "false"
        );

        this.boton.setAttribute(
            "aria-label",
            "Abrir menú"
        );


        /*
         * Cerrar submenús
         */

        document
            .querySelectorAll(
                ".menu-con-desplegable.activo"
            )
            .forEach(
                (item) => {

                    item.classList.remove(
                        "activo"
                    );

                    const boton =
                        item.querySelector(
                            ".enlace-menu-desplegable"
                        );

                    if (boton) {

                        boton.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }
            );
    }
}


/* ============================================================
   5. ANIMACIONES REVEAL
   ============================================================ */

function initRevealAnimations() {

    const elementos =
        document.querySelectorAll(
            ".reveal"
        );

    if (
        elementos.length === 0
    ) {
        return;
    }


    /*
     * Navegadores sin IntersectionObserver
     */

    if (
        !(
            "IntersectionObserver"
            in window
        )
    ) {

        elementos.forEach(
            (elemento) => {

                elemento.classList.add(
                    "visible"
                );
            }
        );

        return;
    }


    /*
     * Observer
     */

    const observer =
        new IntersectionObserver(
            (entradas) => {

                entradas.forEach(
                    (entrada) => {

                        if (
                            entrada.isIntersecting
                        ) {

                            entrada.target.classList.add(
                                "visible"
                            );

                            observer.unobserve(
                                entrada.target
                            );
                        }
                    }
                );
            },
            {
                threshold: 0.15,

                rootMargin:
                    "0px 0px -40px 0px"
            }
        );


    elementos.forEach(
        (elemento) => {

            observer.observe(
                elemento
            );
        }
    );
}


/* ============================================================
   6. NAVEGACIÓN SUAVE
   ============================================================ */

function initNavegacionSuave() {

    const enlaces =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    enlaces.forEach(
        (enlace) => {

            enlace.addEventListener(
                "click",
                (evento) => {

                    const targetId =
                        enlace.getAttribute(
                            "href"
                        );


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }


                    const targetElement =
                        document.querySelector(
                            targetId
                        );


                    if (!targetElement) {
                        return;
                    }


                    evento.preventDefault();


                    /*
                     * Altura aproximada del header
                     */

                    const headerOffset = 80;


                    const elementPosition =
                        targetElement.getBoundingClientRect()
                            .top;


                    const offsetPosition =
                        elementPosition +
                        window.pageYOffset -
                        headerOffset;


                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth"
                    });
                }
            );
        }
    );
}


/* ============================================================
   7. FAQ
   ============================================================ */

function initFAQ() {

    const preguntas =
        document.querySelectorAll(
            ".faq-item"
        );

    if (
        preguntas.length === 0
    ) {
        return;
    }


    preguntas.forEach(
        (item) => {

            item.addEventListener(
                "toggle",
                () => {

                    /*
                     * Si abrimos una pregunta,
                     * cerramos las demás.
                     */

                    if (!item.open) {
                        return;
                    }

                    preguntas.forEach(
                        (otroItem) => {

                            if (
                                otroItem !== item &&
                                otroItem.open
                            ) {

                                otroItem.open =
                                    false;
                            }
                        }
                    );
                }
            );
        }
    );
}


/* ============================================================
   8. HEADER — CAMBIO AL HACER SCROLL
   ============================================================ */

function initHeaderScroll() {

    const header =
        document.querySelector(
            ".header-principal"
        );

    if (!header) {
        return;
    }


    let ultimoScroll = 0;


    window.addEventListener(
        "scroll",
        () => {

            const scrollActual =
                window.scrollY;


            if (
                scrollActual > 30
            ) {

                header.classList.add(
                    "scrolled"
                );

            } else {

                header.classList.remove(
                    "scrolled"
                );
            }


            ultimoScroll =
                scrollActual;
        },
        {
            passive: true
        }
    );
}


/* ============================================================
   9. INICIALIZACIÓN GENERAL
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "SublimArts — inicializando página de sublimación..."
        );


        /*
         * HERO
         */

        new HeroCarrusel(
            "inicio",
            "heroSlides",
            "heroIndicadores",
            {
                intervalo: 5000
            }
        );


        /*
         * CARRUSEL INFORMACIÓN
         */

        new CarruselInfo(
            "infoCarrusel"
        );


        /*
         * CATEGORÍAS
         */

        new Carrusel(
            "categoriasCarrusel",
            "categoriasPista",
            {
                visiblesDesktop: 4,
                visiblesTablet: 3,
                visiblesMobile: 1,
                gap: 20
            }
        );


        /*
         * AMBIENTES / MURO
         */

        new Carrusel(
            "muroCarrusel",
            "muroPista",
            {
                visiblesDesktop: 3,
                visiblesTablet: 2,
                visiblesMobile: 1,
                gap: 20
            }
        );


        /*
         * DESTACADOS
         */

        new Carrusel(
            "destacadosCarrusel",
            "destacadosPista",
            {
                visiblesDesktop: 4,
                visiblesTablet: 3,
                visiblesMobile: 1,
                gap: 20
            }
        );


        /*
         * MENÚ MOBILE
         */

        new MenuMobile();


        /*
         * ANIMACIONES
         */

        initRevealAnimations();


        /*
         * NAVEGACIÓN
         */

        initNavegacionSuave();


        /*
         * FAQ
         */

        initFAQ();


        /*
         * HEADER
         */

        initHeaderScroll();


        console.log(
            "SublimArts — página de sublimación cargada correctamente."
        );
    }
);