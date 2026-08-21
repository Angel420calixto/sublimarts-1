// Reemplaza por el número real de WhatsApp en formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = '56912345678';
const waUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wa-link').forEach((link) => {
    link.href = waUrl(link.dataset.message || 'Hola SublimArts, quiero más información.');
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const nav = document.querySelector('#main-nav');
  const menuButton = document.querySelector('#menu-button');
  menuButton.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  const dropdown = document.querySelector('.nav-dropdown');
  const dropdownButton = dropdown.querySelector('button');
  dropdownButton.addEventListener('click', () => {
    const open = dropdown.classList.toggle('open');
    dropdownButton.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove('open');
      dropdownButton.setAttribute('aria-expanded', 'false');
    }
  });

  const filters = document.querySelectorAll('[data-filter]');
  const items = document.querySelectorAll('.portfolio-item');
  filters.forEach((filter) => filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    filters.forEach((button) => { button.classList.remove('active'); button.setAttribute('aria-selected', 'false'); });
    filter.classList.add('active');
    filter.setAttribute('aria-selected', 'true');
    items.forEach((item) => { item.hidden = category !== 'todo' && item.dataset.category !== category; });
  }));

  const modal = document.querySelector('#image-modal');
  const modalImage = document.querySelector('#modal-image');
  items.forEach((item) => item.addEventListener('click', () => {
    modalImage.src = item.dataset.image;
    modalImage.alt = item.querySelector('img').alt;
    document.querySelector('#modal-category').textContent = item.dataset.category;
    document.querySelector('#modal-title').textContent = item.dataset.title;
    document.querySelector('#modal-description').textContent = item.dataset.description;
    modal.showModal();
  }));
  document.querySelector('.close-modal').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

  document.querySelector('#quote-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const notice = document.querySelector('#form-notice');
    if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
      notice.textContent = 'Revisa tu nombre y correo para continuar.';
      return;
    }
    const message = `Hola SublimArts, soy ${name}. Quiero cotizar ${form.get('service')}. Fecha aproximada: ${form.get('date') || 'por definir'}. ${form.get('message') || ''}`;
    notice.textContent = 'Abriendo WhatsApp con tu solicitud lista para enviar.';
    window.open(waUrl(message), '_blank', 'noopener,noreferrer');
  });
  document.querySelector('#year').textContent = new Date().getFullYear();
});
