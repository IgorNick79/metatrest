const backToTop = document.querySelector('.footer-up');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

backToTop.addEventListener('click', () => {
  document.querySelector('.header-logo').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});

const services = document.querySelector('[data-services]');
const controls = [...services.querySelectorAll('[data-service]')];
const preview = services.querySelector('.services-media');
const previewNumber = preview.querySelector('.service-preview-number');
let previewImage = preview.querySelector('img');
let selected = null;
let current = null;
let request = 0;

async function showService(control) {
  const version = ++request;
  if (control === current) return;

  const source = control || controls[0];
  const image = new Image();
  image.className = 'cover';
  image.alt = source.querySelector('.service-name').textContent;
  image.src = source.dataset.image;

  try {
    await image.decode();
  } catch {
    return;
  }
  if (version !== request) return;

  current = control;
  for (const item of controls) {
    item.setAttribute('aria-pressed', String(item === control));
  }
  previewImage.replaceWith(image);
  previewImage = image;
  preview.dataset.variant = source.dataset.service;
  previewNumber.textContent = source.dataset.service;
}

for (const control of controls) {
  control.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse') showService(control);
  });
  control.addEventListener('click', () => {
    selected = control;
    showService(control);
  });
}

services.addEventListener('pointerleave', event => {
  if (event.pointerType === 'mouse') showService(selected || (current ? controls[0] : null));
});


const buildTrack = document.querySelector('#build-items');
const buildScroll = document.querySelector('.build-scroll');
const scrollControl = buildScroll.querySelector('input');
const scrollLimit = () => buildTrack.scrollWidth - buildTrack.clientWidth;

function syncBuildScroll() {
  const limit = scrollLimit();
  scrollControl.value = limit > 0 ? Math.round(buildTrack.scrollLeft / limit * 1000) : 0;
}

scrollControl.addEventListener('input', () => {
  buildTrack.scrollLeft = scrollControl.value / 1000 * scrollLimit();
});
buildTrack.addEventListener('scroll', syncBuildScroll, { passive: true });
new ResizeObserver(syncBuildScroll).observe(buildTrack);
buildTrack.classList.add('has-scroll-control');
buildScroll.hidden = false;
syncBuildScroll();
