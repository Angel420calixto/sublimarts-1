document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Mobile navigation */
  const toggle = $("#mobileToggle");
  const mobileNav = $("#mobileNav");
  toggle?.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    mobileNav?.classList.toggle("is-open", !open);
    const icon = $("i", toggle);
    if (icon) {
      icon.classList.toggle("fa-bars", open);
      icon.classList.toggle("fa-xmark", !open);
    }
  });
  $$("#mobileNav a").forEach(a => a.addEventListener("click", () => {
    toggle?.setAttribute("aria-expanded", "false");
    mobileNav?.classList.remove("is-open");
    const icon = $("i", toggle);
    icon?.classList.add("fa-bars");
    icon?.classList.remove("fa-xmark");
  }));

  /* Hero */
  const heroSlides = $$(".hero__slide");
  const heroDots = $("#heroDots");
  let heroIndex = 0;
  let heroTimer;

  heroSlides.forEach((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", `Mostrar portada ${i + 1}`);
    b.addEventListener("click", () => {
      showHero(i);
      restartHero();
    });
    heroDots?.appendChild(b);
  });

  function showHero(index) {
    if (!heroSlides.length) return;
    heroIndex = (index + heroSlides.length) % heroSlides.length;
    heroSlides.forEach((slide, i) => slide.classList.toggle("is-active", i === heroIndex));
    $$("#heroDots button").forEach((b, i) => b.classList.toggle("is-active", i === heroIndex));
  }
  function restartHero() {
    clearInterval(heroTimer);
    if (heroSlides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroTimer = setInterval(() => showHero(heroIndex + 1), 6500);
    }
  }
  showHero(0);
  restartHero();

  /* Ver más: 8 -> 18, independiente por colección */
  $$(".collection").forEach(section => {
    const grid = $(".product-grid", section);
    const button = $(".more-button", section);
    if (!grid || !button) return;

    const products = $$(".product-card", grid);
    const visible = 8;

    const render = expanded => {
      products.forEach((card, index) => {
        const hidden = !expanded && index >= visible;
        card.classList.toggle("is-hidden-product", hidden);
        card.setAttribute("aria-hidden", String(hidden));
        if (!hidden && expanded && index >= visible) {
          card.animate(
            [
              { opacity: 0, transform: "translateY(16px)" },
              { opacity: 1, transform: "translateY(0)" }
            ],
            { duration: 420, delay: (index - visible) * 45, easing: "cubic-bezier(.2,.7,.2,1)", fill: "both" }
          );
        }
      });

      button.setAttribute("aria-expanded", String(expanded));
      const text = $("span", button);
      if (text) text.textContent = expanded ? "Ver menos" : "Ver más diseños";
      const icon = $("i", button);
      icon?.classList.toggle("fa-arrow-up", expanded);
      icon?.classList.toggle("fa-arrow-down", !expanded);
    };

    if (products.length <= visible) {
      button.hidden = true;
    } else {
      render(false);
      button.addEventListener("click", () => {
        const expanded = button.getAttribute("aria-expanded") === "true";
        render(!expanded);
        if (expanded) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    }
  });

  /* Product modal */
  const productModal = $("#productModal");
  const modalImage = $("#modalImage");
  const modalTitle = $("#modalTitle");
  const modalCollection = $("#modalCollection");
  const modalMeasure = $("#modalMeasure");
  const modalPrice = $("#modalPrice");
  const modalDetails = $("#modalDetails");
  const modalWhatsapp = $("#modalWhatsapp");
  const modalClose = $("#modalClose");
  const wallButton = $("#wallButton");
  let lastTrigger = null;
  let currentProduct = null;

  function productData(card) {
    const img = $(".product-card__image", card);
    const section = card.closest(".collection");
    return {
      title: card.querySelector("h3")?.textContent.trim() || img?.alt || "Cuadro",
      measure: card.querySelector(".product-card__meta span")?.textContent.trim() || "30 × 40 cm",
      price: card.querySelectorAll(".product-card__meta span")[1]?.textContent.trim() || "$20.000 CLP",
      collection: section?.querySelector("h2")?.textContent.trim() || "Anime & Gamer",
      image: img?.currentSrc || img?.src || ""
    };
  }

  $$(".product-card__button").forEach(button => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      if (!card) return;
      currentProduct = productData(card);
      lastTrigger = button;

      modalImage.src = currentProduct.image;
      modalImage.alt = currentProduct.title;
      modalTitle.textContent = currentProduct.title;
      modalCollection.textContent = `${currentProduct.collection} · SUBLIMARTS`;
      modalMeasure.textContent = currentProduct.measure;
      modalPrice.textContent = currentProduct.price;

      const params = new URLSearchParams({
        nombre: currentProduct.title,
        medida: currentProduct.measure,
        precio: currentProduct.price,
        imagen: currentProduct.image
      });
      modalDetails.href = `visualizacion.html?${params.toString()}`;
      modalWhatsapp.href = `https://wa.me/56912345678?text=${encodeURIComponent(
        `Hola SublimArts, me interesa el cuadro "${currentProduct.title}", ${currentProduct.measure}, ${currentProduct.price}.`
      )}`;

      productModal.showModal();
      document.body.classList.add("modal-open");
      modalClose.focus();
    });
  });

  function closeProduct() {
    if (productModal?.open) productModal.close();
    document.body.classList.remove("modal-open");
    lastTrigger?.focus();
  }
  modalClose?.addEventListener("click", closeProduct);
  productModal?.addEventListener("click", e => {
    if (e.target === productModal) closeProduct();
  });

  /* Wall visualizer */
  const wallModal = $("#wallModal");
  const wallClose = $("#wallClose");
  const wallImage = $("#wallImage");
  const wallFrame = $("#wallFrame");
  const wallScale = $("#wallScale");

  wallButton?.addEventListener("click", () => {
    if (!currentProduct) return;
    wallImage.src = currentProduct.image;
    wallImage.alt = currentProduct.title;
    productModal.close();
    wallModal.showModal();
    document.body.classList.add("modal-open");
  });

  wallScale?.addEventListener("input", () => {
    wallFrame.style.width = `${wallScale.value}%`;
  });

  function closeWall() {
    if (wallModal?.open) wallModal.close();
    document.body.classList.remove("modal-open");
    lastTrigger?.focus();
  }
  wallClose?.addEventListener("click", closeWall);
  wallModal?.addEventListener("click", e => {
    if (e.target === wallModal) closeWall();
  });

  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (wallModal?.open) closeWall();
    else if (productModal?.open) closeProduct();
  });

  /* Reduce motion */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    clearInterval(heroTimer);
  }
});
