'use strict';
// Reemplaza por tu número real de WhatsApp, sin + ni espacios.
const WHATSAPP_NUMBER = '56982045756';
const waUrl = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.wa-link').forEach((link) => { link.href = waUrl(link.dataset.message || 'Hola SublimArts, quiero información.'); link.target = '_blank'; link.rel = 'noopener noreferrer'; });
  const nav = document.querySelector('#main-nav'), menu = document.querySelector('#menu-button');
  menu.addEventListener('click', () => { const open = nav.classList.toggle('open'); menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => { nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); }));
  const filters = document.querySelectorAll('[data-filter]'), arts = document.querySelectorAll('.art');
  filters.forEach((filter) => filter.addEventListener('click', () => { filters.forEach((item) => item.classList.remove('active')); filter.classList.add('active'); arts.forEach((art) => { art.hidden = filter.dataset.filter !== 'todo' && art.dataset.category !== filter.dataset.filter; }); }));
  const modal = document.querySelector('#art-modal'), image = document.querySelector('#modal-image');
  arts.forEach((art) => art.addEventListener('click', () => { image.src = art.dataset.image; image.alt = art.querySelector('img').alt; document.querySelector('#modal-category').textContent = art.dataset.category; document.querySelector('#modal-title').textContent = art.dataset.title; document.querySelector('#modal-description').textContent = art.dataset.description; modal.showModal(); }));
  document.querySelector('.close-modal').addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });
  document.querySelector('#year').textContent = new Date().getFullYear();
});
