/*
  VidyaSutra interactions: attractive loader, accessible navigation, FAQ and
  one donation-interest form. This project has no backend, so form entries are
  validated in the browser and are never transmitted or stored.
*/
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const toast = document.getElementById('toast');
  let toastTimer;

  // Keep the branded preloader visible briefly, but never let it hang forever.
  const preloader = document.getElementById('preloader');
  const loaderStartedAt = performance.now();
  let loaderHideScheduled = false;
  document.body.classList.add('is-loading');

  function hidePreloader() {
    if (!preloader || loaderHideScheduled) return;
    loaderHideScheduled = true;
    const minimumDisplay = prefersReducedMotion ? 300 : 2800;
    const remainingTime = Math.max(0, minimumDisplay - (performance.now() - loaderStartedAt));
    window.setTimeout(() => {
      preloader.classList.add('is-hidden');
      preloader.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-loading');
      window.setTimeout(() => preloader.remove(), prefersReducedMotion ? 0 : 750);
    }, remainingTime);
  }

  if (document.readyState === 'complete') hidePreloader();
  else window.addEventListener('load', hidePreloader, { once: true });
  // Safety fallback for unusual cases where the load event does not arrive.
  window.setTimeout(hidePreloader, prefersReducedMotion ? 700 : 2600);

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
  }

  // Responsive menu: close on navigation, Escape, outside click or resize.
  const siteHeader = document.querySelector('.site-header');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNavigation = document.getElementById('primary-navigation');

  function setMenuOpen(isOpen) {
    if (!siteHeader || !menuToggle) return;
    siteHeader.classList.toggle('menu-expanded', isOpen);
    document.body.classList.toggle('menu-open', isOpen && window.innerWidth <= 1000);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  }

  menuToggle?.addEventListener('click', () => {
    setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
  });
  primaryNavigation?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenuOpen(false));
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && siteHeader?.classList.contains('menu-expanded')) setMenuOpen(false);
  });
  document.addEventListener('click', (event) => {
    if (siteHeader?.classList.contains('menu-expanded') && !siteHeader.contains(event.target)) setMenuOpen(false);
  });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1000) setMenuOpen(false);
  });

  // Gentle scroll reveals, with a visible fallback if IntersectionObserver is absent.
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  /*
   * FUTURE DATABASE CONNECTION PLACEHOLDER — intentionally inactive.
   * When a secure backend is ready, replace the local-only success handler below
   * with a POST to a server route such as /api/donation-interests. Example shape:
   *
   *   const response = await fetch('/api/donation-interests', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify(validatedInterest)
   *   });
   *
   * Keep this example commented until the server endpoint exists. Validate again
   * on the server, use HTTPS and appropriate CSRF / abuse protections, and never
   * connect the browser directly to a database or put database credentials here.
   */

  // Donation-interest form helpers. No form values are read after validation.
  function getErrorElement(field) {
    return field.id ? document.getElementById(`${field.id}-error`) : null;
  }

  function setFieldError(field, message) {
    const errorElement = getErrorElement(field);
    if (errorElement) errorElement.textContent = message || '';
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      if (errorElement) {
        const describedBy = new Set((field.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean));
        describedBy.add(errorElement.id);
        field.setAttribute('aria-describedby', [...describedBy].join(' '));
      }
    } else {
      field.removeAttribute('aria-invalid');
      if (errorElement) {
        const describedBy = (field.getAttribute('aria-describedby') || '').split(/\s+/).filter((id) => id && id !== errorElement.id);
        if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' '));
        else field.removeAttribute('aria-describedby');
      }
    }
  }

  function getFieldMessage(field, form) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const labelText = form.querySelector(`label[for="${field.id}"]`)?.textContent.replace('*', '').trim() || 'This field';

    if (field.required && (field.type === 'checkbox' ? !value : value === '')) {
      return field.type === 'checkbox' ? 'Please confirm this before continuing.' : `${labelText} is required.`;
    }
    if (field.type === 'email' && value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailPattern.test(value)) return 'Enter a valid email address, such as name@example.com.';
    }
    if ((field.id === 'interest-name' || field.id === 'interest-campus') && value.length < 2) {
      return 'Please enter at least two characters.';
    }
    return '';
  }

  function validateInterestForm(form) {
    const invalidFields = [];
    const ordinaryFields = Array.from(form.querySelectorAll('input:not([type="checkbox"]), textarea'));
    const consentField = document.getElementById('interest-consent');

    ordinaryFields.forEach((field) => {
      const message = getFieldMessage(field, form);
      setFieldError(field, message);
      if (message) invalidFields.push(field);
    });

    if (consentField) {
      const consentMessage = getFieldMessage(consentField, form);
      setFieldError(consentField, consentMessage);
      if (consentMessage) invalidFields.push(consentField);
    }

    const itemChoices = Array.from(form.querySelectorAll('input[name="items"]'));
    const selectedChoice = itemChoices.find((choice) => choice.checked);
    const itemFieldset = document.querySelector('.item-fieldset');
    const itemError = document.getElementById('interest-items-error');
    if (!selectedChoice) {
      if (itemFieldset) itemFieldset.setAttribute('aria-invalid', 'true');
      if (itemError) itemError.textContent = 'Choose at least one type of electronic item.';
      if (itemChoices[0]) invalidFields.push(itemChoices[0]);
    } else {
      itemFieldset?.removeAttribute('aria-invalid');
      if (itemError) itemError.textContent = '';
    }

    return invalidFields;
  }

  function clearInterestFormErrors(form) {
    form.querySelectorAll('input, textarea').forEach((field) => setFieldError(field, ''));
    document.querySelector('.item-fieldset')?.removeAttribute('aria-invalid');
    const itemError = document.getElementById('interest-items-error');
    if (itemError) itemError.textContent = '';
    form.querySelectorAll('.item-option').forEach((option) => option.classList.remove('is-selected'));
  }

  const interestForm = document.getElementById('interest-form');
  const interestStatus = document.getElementById('interest-status');

  if (interestForm) {
    interestForm.addEventListener('input', (event) => {
      const field = event.target;
      if (field.matches('input:not([type="checkbox"]), textarea')) {
        const message = getFieldMessage(field, interestForm);
        if (!message || field.getAttribute('aria-invalid') === 'true') setFieldError(field, message);
      }
      interestStatus?.classList.remove('is-visible');
    });

    interestForm.addEventListener('change', (event) => {
      const field = event.target;
      if (field.matches('input[name="items"]')) {
        const hasSelection = interestForm.querySelector('input[name="items"]:checked');
        const itemFieldset = document.querySelector('.item-fieldset');
        const itemError = document.getElementById('interest-items-error');
        field.closest('.item-option')?.classList.toggle('is-selected', field.checked);
        if (hasSelection) {
          itemFieldset?.removeAttribute('aria-invalid');
          if (itemError) itemError.textContent = '';
        }
      } else if (field.type === 'checkbox') {
        const message = getFieldMessage(field, interestForm);
        if (!message || field.getAttribute('aria-invalid') === 'true') setFieldError(field, message);
      }
    });

    interestForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalidFields = validateInterestForm(interestForm);
      if (invalidFields.length) {
        const firstInvalid = invalidFields[0];
        firstInvalid.focus({ preventScroll: true });
        firstInvalid.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'center' });
        showToast('Please check the highlighted fields and try again.');
        return;
      }

      // FUTURE DATABASE HOOK: after backend setup, send a minimal validated payload
      // to the secure server route above and wait for confirmation before success.
      // This prototype deliberately makes no request and does not persist form data.
      interestForm.reset();
      clearInterestFormErrors(interestForm);
      if (interestStatus) {
        interestStatus.innerHTML = '<strong>Thanks for your interest.</strong>This was an on-page demonstration only. No details were sent or saved, and no collection has been booked.';
        interestStatus.classList.add('is-visible');
        interestStatus.focus({ preventScroll: true });
      }
      showToast('Interest noted on this page only — no pickup has been booked.');
    });
  }

  // FAQ accordion with native buttons and explicit expanded state.
  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      const answer = document.getElementById(button.getAttribute('aria-controls'));
      if (answer) answer.hidden = !willOpen;
    });
  });

  // Privacy notice and project terms use native, keyboard-friendly dialogs.
  document.querySelectorAll('[data-dialog]').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const dialog = document.getElementById(trigger.dataset.dialog);
      if (!dialog) return;
      if (typeof dialog.showModal === 'function') dialog.showModal();
      else dialog.setAttribute('open', '');
    });
  });
  document.querySelectorAll('.policy-dialog').forEach((dialog) => {
    dialog.querySelectorAll('.dialog-close, .dialog-done').forEach((button) => {
      button.addEventListener('click', () => {
        if (typeof dialog.close === 'function') dialog.close();
        else dialog.removeAttribute('open');
      });
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog && typeof dialog.close === 'function') dialog.close();
    });
  });

  // Back-to-top control.
  const backToTop = document.querySelector('.back-to-top');
  function updateBackToTop() {
    backToTop?.classList.toggle('is-visible', window.scrollY > 520);
  }
  window.addEventListener('scroll', updateBackToTop, { passive: true });
  updateBackToTop();
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  });
});
