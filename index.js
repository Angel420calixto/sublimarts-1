// Reemplaza este valor por tu número de WhatsApp en formato internacional, sin + ni espacios.
const WHATSAPP_NUMBER = '569XXXXXXXX';

const whatsappUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

document.querySelectorAll('.wa-link').forEach((link) => {
  link.href = whatsappUrl(link.dataset.message || 'Hola, quiero cotizar un servicio de fotografía.');
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
});

const menuButton = document.querySelector('#menu-button');
const nav = document.querySelector('#main-nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.classList.toggle('open', isOpen);
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

const filters = document.querySelectorAll('[data-filter]');
const photos = document.querySelectorAll('.photo-card');
filters.forEach((filter) => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  filter.classList.add('active');
  filter.setAttribute('aria-selected', 'true');
  photos.forEach((photo) => { photo.hidden = category !== 'todo' && photo.dataset.category !== category; });
}));

const modal = document.querySelector('#gallery-modal');
const modalImage = document.querySelector('#modal-image');
photos.forEach((photo) => photo.addEventListener('click', () => {
  modalImage.src = photo.dataset.image;
  modalImage.alt = photo.querySelector('img').alt;
  document.querySelector('#modal-category').textContent = photo.dataset.category;
  document.querySelector('#modal-title').textContent = photo.dataset.title;
  document.querySelector('#modal-description').textContent = photo.dataset.description;
  modal.showModal();
}));
document.querySelector('.modal-close').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

document.querySelector('#quote-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get('name')).trim();
  const email = String(form.get('email')).trim();
  const notice = document.querySelector('#form-notice');
  if (name.length < 2 || !/^\S+@\S+\.\S+$/.test(email)) {
    notice.textContent = 'Revisa tu nombre y correo para continuar.';
    return;
  }
  const message = `Hola, soy ${name}. Quiero cotizar ${form.get('service')}. Fecha aproximada: ${form.get('date') || 'por definir'}. ${form.get('message') || ''}`;
  notice.textContent = 'Abriendo WhatsApp con tu solicitud lista para enviar.';
  window.open(whatsappUrl(message), '_blank', 'noopener,noreferrer');
});

document.querySelector('#year').textContent = new Date().getFullYear();
