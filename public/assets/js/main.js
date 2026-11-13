const backToTop = document.querySelector('.footer-up');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

backToTop.addEventListener('click', () => {
  document.querySelector('.header-logo').focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
});

const mobileLayout = matchMedia('(width <= 1024px)');
const services = document.querySelector('[data-services]');
if (services && services.querySelector('[data-service]')) {
  const controls = [...services.querySelectorAll('[data-service]')];
  services.querySelector('.services-list').style.setProperty('--service-count', controls.length);
  const preview = services.querySelector('.services-media');
  const previewNumber = preview.querySelector('.service-preview-number');
  let previewImage = preview.querySelector('img');
  let desktopSelected = null;
  let currentDesktop = null;
  let mobileSelected = controls[0];
  let request = 0;

  async function updateImage(control) {
    const version = ++request;
    const source = control || controls[0];
    preview.dataset.variant = source.dataset.service;
    previewNumber.textContent = source.dataset.serviceNumber || source.dataset.service;
    if (!source.dataset.image) {
      if (previewImage) previewImage.remove();
      previewImage = null;
      return;
    }
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
    if (previewImage) previewImage.replaceWith(image);
    else preview.prepend(image);
    previewImage = image;
  }

  function showDesktopService(control) {
    if (control === currentDesktop) return;
    currentDesktop = control;
    for (const item of controls) item.setAttribute('aria-pressed', String(item === control));
    updateImage(control);
  }

  function showMobileService(control) {
    mobileSelected = control;
    for (const item of controls) {
      const open = item === control;
      const panel = document.getElementById(`service-details-${item.dataset.service}`);
      panel.hidden = !open;
      item.setAttribute('aria-expanded', String(open));
      item.removeAttribute('aria-pressed');
      item.querySelector('use').setAttribute('href', `/assets/svg/sprite.svg#mobile-${open ? 'minus' : 'plus'}`);
    }
    preview.hidden = !control;
    if (control) {
      document.getElementById(`service-details-${control.dataset.service}`).append(preview);
      updateImage(control);
    } else {
      ++request;
      services.append(preview);
    }
  }

  function syncServiceLayout() {
    if (mobileLayout.matches) {
      for (const item of controls) item.setAttribute('aria-controls', `service-details-${item.dataset.service}`);
      showMobileService(mobileSelected);
    } else {
      for (const item of controls) {
        item.removeAttribute('aria-expanded');
        item.setAttribute('aria-controls', 'service-preview');
        item.setAttribute('aria-pressed', String(item === desktopSelected));
        item.querySelector('use').setAttribute('href', '/assets/svg/sprite.svg#service-plus');
        document.getElementById(`service-details-${item.dataset.service}`).hidden = true;
      }
      preview.hidden = false;
      services.append(preview);
      currentDesktop = desktopSelected;
      updateImage(desktopSelected);
    }
  }

  for (const control of controls) {
    control.addEventListener('pointerenter', event => {
      if (!mobileLayout.matches && event.pointerType === 'mouse') showDesktopService(control);
    });
    control.addEventListener('click', () => {
      if (mobileLayout.matches) {
        showMobileService(control === mobileSelected ? null : control);
      } else {
        desktopSelected = control;
        showDesktopService(control);
      }
    });
  }
  services.addEventListener('pointerleave', event => {
    if (!mobileLayout.matches && event.pointerType === 'mouse') showDesktopService(desktopSelected || (currentDesktop ? controls[0] : null));
  });
  mobileLayout.addEventListener('change', syncServiceLayout);
  syncServiceLayout();
}

// Shared header, menu and contacts on all static frontend pages.
const menu = document.querySelector('.frontend-page .mobile-menu');
const menuToggle = document.querySelector('.frontend-page .header-menu-toggle');
if (menu && menuToggle) {
  const background = [document.querySelector('main'), document.querySelector('.site-footer')];
  const header = document.querySelector('.site-header');
  // Hero and Footer remain the content sources for the repeated menu blocks.
  const actions = menu.querySelector('[data-menu-actions]');
  const heroActions = document.querySelector('.hero-actions');
  if (heroActions) actions.replaceChildren(...[...heroActions.children].map(action => action.cloneNode(true)));
  const phones = document.querySelector('.footer-phones').cloneNode(true);
  phones.className = 'data phone';
  phones.querySelector('span').remove();
  const address = document.querySelector('.footer-contact-details').cloneNode(true);
  address.className = 'body small mobile-menu-address flex flex-column';
  menu.querySelector('[data-menu-contacts]').append(phones, address);
  const socials = document.querySelector('.footer-socials').cloneNode(true);
  socials.className = 'mobile-menu-socials flex flex-wrap label caps';
  menu.querySelector('[data-menu-socials]').replaceWith(socials);
  function setMenuOpen(open, restoreFocus = true) {
    // Keep the close button inside the modal's accessible subtree without duplicating the header.
    if (open) menu.prepend(header);
    else menu.before(header);
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.querySelector('use').setAttribute('href', `/assets/svg/sprite.svg#mobile-${open ? 'close' : 'menu'}`);
    for (const element of background) element.inert = open;
    if (open) menu.querySelector('summary').focus();
    else if (restoreFocus) menuToggle.focus({ preventScroll: true });
  }
  menuToggle.addEventListener('click', () => setMenuOpen(menu.hidden));
  menu.addEventListener('click', event => {
    if (event.target.closest('a[href]')) setMenuOpen(false, false);
  });
  document.addEventListener('keydown', event => {
    if (menu.hidden) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setMenuOpen(false);
    }
    if (event.key === 'Tab') {
      const focusable = [...menu.querySelectorAll('a[href], button, summary')].filter(el => el.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault(); first.focus();
      }
    }
  });
  mobileLayout.addEventListener('change', () => {
    if (!mobileLayout.matches) setMenuOpen(false, false);
  });
}

// Use the original mobile arrow glyph, preserving the desktop symbols on wider screens.
const homeArrowUses = [...document.querySelectorAll('.frontend-page :is(.hero-actions, .build-card-arrow, .project-arrow, .about-copy, .catalog-project-info, .catalog-service-description, .request-submit, .mobile-menu-actions) use')]
  .filter(use => use.getAttribute('href').endsWith('#arrow-link'));
function syncHomeArrows() {
  for (const use of homeArrowUses) use.setAttribute('href', `/assets/svg/sprite.svg#${mobileLayout.matches ? 'mobile-arrow' : 'arrow-link'}`);
}
mobileLayout.addEventListener('change', syncHomeArrows);
syncHomeArrows();

const buildTrack = document.querySelector('#build-items');
const buildScroll = document.querySelector('.build-scroll');
if (buildTrack && buildScroll) {
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
}

// The static request form has no delivery endpoint yet.
document.querySelector('.request-form')?.addEventListener('submit', event => {
  event.preventDefault();
});

// Mouse dragging for the objects strip only; native touch/wheel scrolling stays intact.
if (buildTrack) {
  let drag = null;
  let suppressClickUntil = 0;
  buildTrack.classList.add('mouse-drag-scroll');
  buildTrack.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || buildTrack.scrollWidth <= buildTrack.clientWidth) return;
    suppressClickUntil = 0;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, left: buildTrack.scrollLeft, active: false };
  });
  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    if (!(event.buttons & 1)) { finishDrag(); return; }
    const dx = event.clientX - drag.x;
    if (!drag.active) {
      if (Math.abs(dx) < 7 || Math.abs(dx) < Math.abs(event.clientY - drag.y)) return;
      drag.active = true;
      buildTrack.setPointerCapture(drag.id);
      buildTrack.classList.add('is-mouse-dragging');
      const selection = getSelection();
      if (selection?.anchorNode && buildTrack.contains(selection.anchorNode)) selection.removeAllRanges();
    }
    event.preventDefault();
    buildTrack.scrollLeft = drag.left - dx;
  }, { passive: false });
  function finishDrag() {
    if (!drag) return;
    const { id, active } = drag;
    drag = null;
    if (active) suppressClickUntil = performance.now() + 400;
    buildTrack.classList.remove('is-mouse-dragging');
    if (buildTrack.hasPointerCapture(id)) buildTrack.releasePointerCapture(id);
  }
  window.addEventListener('pointerup', event => { if (event.pointerId === drag?.id) finishDrag(); });
  window.addEventListener('pointercancel', event => { if (event.pointerId === drag?.id) finishDrag(); });
  buildTrack.addEventListener('lostpointercapture', finishDrag);
  window.addEventListener('blur', finishDrag);
  buildTrack.addEventListener('dragstart', event => { if (drag) event.preventDefault(); });
  buildTrack.addEventListener('click', event => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopImmediatePropagation();
      suppressClickUntil = 0;
    }
  }, true);
}
