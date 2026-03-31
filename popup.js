const CONTACT_EMAIL = 'oe@constructionsourcing.eu';
const BOOKING_URL = 'https://app.constructionsourcing.se/meetings/oliver28';
const FORM_ENDPOINT = 'https://gleaming-kelpie-b11bf2.netlify.app/.netlify/functions/api/forms/submit/641b06d5-4693-4cb8-a30e-bb2166a64869';
const LOCAL_DEV_HOSTS = new Set(['127.0.0.1', 'localhost']);

let lastFocusedElement = null;

function getCurrentLanguage() {
  return localStorage.getItem('language') === 'en' ? 'en' : 'sv';
}

function translate(key, fallback = '') {
  if (typeof translations === 'undefined') {
    return fallback;
  }

  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || fallback;
}

function syncBodyScroll() {
  const hasOpenOverlay = document.querySelector('.popup-overlay.active');
  document.body.style.overflow = hasOpenOverlay ? 'hidden' : '';
}

function ensurePopupMarkup() {
  const root = document.getElementById('popup-root');
  if (!root || document.getElementById('newsletterModal')) {
    return;
  }

  root.innerHTML = `
    <div class="popup-overlay" id="newsletterModal" role="dialog" aria-modal="true" aria-labelledby="popupTitle">
      <div class="popup-box">
        <button type="button" class="close-btn" data-translate="closeButton"></button>
        <h3 id="popupTitle" data-translate="popupTitle"></h3>
        <form class="popup-form" novalidate>
          <input type="email" placeholder="" data-translate="popupEmailPlaceholder" required />
          <div class="phone-input">
            <select id="countrySelect" onchange="updateFlagAndCode()">
              <option value="se" data-code="46" data-translate="countrySE"></option>
              <option value="dk" data-code="45" data-translate="countryDK"></option>
              <option value="no" data-code="47" data-translate="countryNO"></option>
              <option value="fi" data-code="358" data-translate="countryFI"></option>
              <option value="de" data-code="49" data-translate="countryDE"></option>
              <option value="fr" data-code="33" data-translate="countryFR"></option>
              <option value="es" data-code="34" data-translate="countryES"></option>
              <option value="it" data-code="39" data-translate="countryIT"></option>
              <option value="nl" data-code="31" data-translate="countryNL"></option>
              <option value="be" data-code="32" data-translate="countryBE"></option>
            </select>
          <input type="tel" id="phoneNumber" placeholder="" data-translate="popupPhonePlaceholder" />
          </div>
          <button type="submit" class="submit-btn" data-translate="popupSubmit"></button>
          <button type="button" class="decline-btn" data-translate="popupDecline"></button>
        </form>
        <p class="disclaimer" data-translate="popupDisclaimer"></p>
      </div>
    </div>

    <div class="popup-overlay" id="confirmationPopup" role="dialog" aria-modal="true" aria-labelledby="confirmationTitle">
      <div class="popup-box">
        <div class="confirmation-icon" aria-hidden="true"></div>
        <p class="confirmation-eyebrow" data-translate="confirmationEyebrow"></p>
        <h3 id="confirmationTitle" data-translate="confirmationTitle"></h3>
        <p class="confirmation-message" data-translate="confirmationText" aria-live="polite"></p>
        <div class="confirmation-panel">
          <p class="confirmation-next-title" data-translate="confirmationNextTitle"></p>
          <ul class="confirmation-steps">
            <li class="confirmation-step" data-translate="confirmationStep1"></li>
            <li class="confirmation-step" data-translate="confirmationStep2"></li>
            <li class="confirmation-step" data-translate="confirmationStep3"></li>
          </ul>
        </div>
        <div class="confirmation-actions">
          <a class="confirmation-link" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" data-translate="confirmationSecondaryCta"></a>
          <button type="button" class="submit-btn" data-translate="confirmationClose"></button>
        </div>
        <p class="confirmation-note" data-translate="confirmationFooterNote"></p>
      </div>
    </div>
  `;

  if (typeof window.applyLanguage === 'function') {
    window.applyLanguage(getCurrentLanguage());
  }
}

function ensureConfirmationMarkup() {
  const confirmationBox = document.querySelector('#confirmationPopup .popup-box');
  if (!confirmationBox || confirmationBox.dataset.enhanced === 'true') {
    return;
  }

  confirmationBox.dataset.enhanced = 'true';
  confirmationBox.innerHTML = `
    <div class="confirmation-icon" aria-hidden="true"></div>
    <p class="confirmation-eyebrow" data-translate="confirmationEyebrow"></p>
    <h3 id="confirmationTitle" data-translate="confirmationTitle"></h3>
    <p class="confirmation-message" data-translate="confirmationText" aria-live="polite"></p>
    <div class="confirmation-panel">
      <p class="confirmation-next-title" data-translate="confirmationNextTitle"></p>
      <ul class="confirmation-steps">
        <li class="confirmation-step" data-translate="confirmationStep1"></li>
        <li class="confirmation-step" data-translate="confirmationStep2"></li>
        <li class="confirmation-step" data-translate="confirmationStep3"></li>
      </ul>
    </div>
    <div class="confirmation-actions">
      <a class="confirmation-link" href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer" data-translate="confirmationSecondaryCta"></a>
      <button type="button" class="submit-btn" data-translate="confirmationClose"></button>
    </div>
    <p class="confirmation-note" data-translate="confirmationFooterNote"></p>
  `;

  if (typeof window.applyLanguage === 'function') {
    window.applyLanguage(getCurrentLanguage());
  }
}

function applyPopupAccessibility() {
  ensurePopupMarkup();
  ensureConfirmationMarkup();

  const closeLabel = translate('closeButton', 'Close');
  const emailPlaceholder = translate('popupEmailPlaceholder', 'Email');
  const phonePlaceholder = translate('popupPhonePlaceholder', 'Phone number');
  const countryLabel = getCurrentLanguage() === 'sv' ? 'Landskod' : 'Country code';

  const newsletterModal = document.getElementById('newsletterModal');
  const confirmationPopup = document.getElementById('confirmationPopup');
  if (newsletterModal) {
    newsletterModal.setAttribute('role', 'dialog');
    newsletterModal.setAttribute('aria-modal', 'true');
    newsletterModal.setAttribute('aria-labelledby', 'popupTitle');
  }
  if (confirmationPopup) {
    confirmationPopup.setAttribute('role', 'dialog');
    confirmationPopup.setAttribute('aria-modal', 'true');
    confirmationPopup.setAttribute('aria-labelledby', 'confirmationTitle');
  }

  document.querySelectorAll('.close-btn').forEach((button) => {
    button.setAttribute('aria-label', closeLabel);
    button.setAttribute('type', 'button');
  });

  document.querySelectorAll('#confirmationPopup .submit-btn').forEach((button) => {
    button.setAttribute('type', 'button');
  });

  document.querySelectorAll('#newsletterModal input[type="email"]').forEach((input) => {
    input.setAttribute('aria-label', emailPlaceholder);
  });

  document.querySelectorAll('#newsletterModal input[type="tel"]').forEach((input) => {
    input.setAttribute('aria-label', phonePlaceholder);
  });

  document.querySelectorAll('#newsletterModal select').forEach((select) => {
    select.setAttribute('aria-label', countryLabel);
  });

  const confirmationMessage = document.querySelector('#confirmationPopup .confirmation-message');
  if (confirmationMessage) {
    confirmationMessage.setAttribute('aria-live', 'polite');
  }

  updateFlagAndCode();
}

function restoreFocus() {
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

function toggleModal(show = true) {
  applyPopupAccessibility();

  const modal = document.getElementById('newsletterModal');
  if (!modal) return;

  if (show) {
    lastFocusedElement = document.activeElement;
  }

  modal.classList.toggle('active', show);
  syncBodyScroll();

  if (show) {
    const firstField = modal.querySelector('input, select, button');
    if (firstField) {
      window.requestAnimationFrame(() => firstField.focus());
    }
  } else {
    restoreFocus();
  }
}

function toggleConfirmation(show = true) {
  applyPopupAccessibility();

  const popup = document.getElementById('confirmationPopup');
  if (!popup) return;
  const popupBox = popup.querySelector('.popup-box');

  if (show) {
    lastFocusedElement = document.activeElement;
  }

  popup.classList.toggle('active', show);
  syncBodyScroll();

  if (show) {
    if (popupBox) {
      popupBox.scrollTop = 0;
    }
    const closeButton = popup.querySelector('.submit-btn');
    if (closeButton) {
      window.requestAnimationFrame(() => closeButton.focus());
    }
  } else {
    restoreFocus();
  }
}

function updateFlagAndCode() {
  const select = document.getElementById('countrySelect');
  const phoneInput = document.getElementById('phoneNumber');

  if (!select || !phoneInput) return;

  const selectedOption = select.options[select.selectedIndex];
  const countryCode = selectedOption.getAttribute('data-code');
  phoneInput.placeholder = `+${countryCode}`;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 5;
}

function showError(element, message) {
  if (!element) return;

  const anchor = element.closest('.phone-input') || element;
  let errorDiv = element._errorMessageElement;

  if (!errorDiv) {
    errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    anchor.insertAdjacentElement('afterend', errorDiv);
    element._errorMessageElement = errorDiv;
  }

  errorDiv.textContent = message;
  element.classList.add('error');
}

function clearError(element) {
  if (!element) return;

  if (element._errorMessageElement) {
    element._errorMessageElement.remove();
    element._errorMessageElement = null;
  }

  element.classList.remove('error');
}

function setLoading(button, isLoading) {
  if (!button) return;

  if (!button.dataset.originalText) {
    button.dataset.originalText = button.textContent.trim();
  }

  button.disabled = isLoading;
  button.innerHTML = isLoading
    ? `<span class="loading-spinner"></span>${getCurrentLanguage() === 'sv' ? 'Skickar...' : 'Sending...'}`
    : button.dataset.originalText;
}

function updateConfirmationMessage(result, payload) {
  applyPopupAccessibility();

  const title = document.querySelector('#confirmationPopup h3');
  const text = document.querySelector('#confirmationPopup .confirmation-message') || document.querySelector('#confirmationPopup p');

  if (!title || !text) return;

  if (result.transport === 'mailto') {
    if (getCurrentLanguage() === 'sv') {
      title.textContent = 'Fortsatt kontakt';
      text.innerHTML = `Ett e-postutkast har öppnats till <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Om inget hände kan du mejla oss direkt eller boka ett möte <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">här</a>.`;
    } else {
      title.textContent = 'Continue by email';
      text.innerHTML = `A draft email has been opened for <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. If nothing happened, email us directly or book a meeting <a href="${BOOKING_URL}" target="_blank" rel="noopener noreferrer">here</a>.`;
    }
    return;
  }

  title.textContent = translate('confirmationTitle', 'Thank you');
  text.textContent = result.message || translate(
    'confirmationText',
    payload.source === 'footer'
      ? 'Thank you. We will contact you shortly.'
      : 'Thank you for your interest. We will contact you shortly.'
  );
}

function getSubmissionErrorMessage(error) {
  if (error instanceof TypeError && LOCAL_DEV_HOSTS.has(window.location.hostname)) {
    return getCurrentLanguage() === 'sv'
      ? 'Formuläret blockeras lokalt av CORS. Lägg till http://127.0.0.1:5500 och https://www.constructionsourcing.eu i API:ts CORS-inställningar.'
      : 'Form submission is blocked locally by CORS. Add http://127.0.0.1:5500 and https://www.constructionsourcing.eu to the API CORS allowlist.';
  }

  return error?.message || translate('submitError', 'Something went wrong. Please try again.');
}

async function submitLead(payload) {
  const requestBody = {
    email: payload.email
  };

  if (payload.phone) {
    requestBody.phone = payload.phone;
  }

  let response;
  try {
    response = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  } catch (error) {
    throw new Error(getSubmissionErrorMessage(error));
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Could not submit form');
  }

  if (data.redirectUrl) {
    window.location.href = data.redirectUrl;
    return {
      transport: 'redirect',
      redirected: true,
      message: data.message || ''
    };
  }

  return {
    transport: 'endpoint',
    message: data.message || ''
  };
}

function buildPayload(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const phoneInput = form.querySelector('input[type="tel"]');

  return {
    source: form.classList.contains('footer-form') ? 'footer' : 'popup',
    email: emailInput ? emailInput.value.trim() : '',
    phone: phoneInput ? phoneInput.value.trim() : '',
    language: getCurrentLanguage(),
    pageTitle: document.title || 'Construction Sourcing',
    pageUrl: window.location.href
  };
}

function validateForm(form) {
  const emailInput = form.querySelector('input[type="email"]');
  const phoneInput = form.querySelector('input[type="tel"]');

  if (emailInput) {
    clearError(emailInput);
    if (!validateEmail(emailInput.value)) {
      showError(emailInput, translate('emailError', 'Please enter a valid email address.'));
      return false;
    }
  }

  if (phoneInput) {
    clearError(phoneInput);
    if (phoneInput.value.trim() && !validatePhone(phoneInput.value)) {
      showError(phoneInput, translate('phoneError', 'Please enter a valid phone number.'));
      return false;
    }
  }

  return true;
}

function resetFormState(form) {
  form.querySelectorAll('input').forEach((input) => {
    clearError(input);
  });
  form.reset();
  updateFlagAndCode();
}

function initPopupLogic() {
  ensurePopupMarkup();
  applyPopupAccessibility();

  document.addEventListener('click', (event) => {
    const target = event.target;

    if (target.closest('.close-btn') || target.closest('.decline-btn')) {
      event.preventDefault();
      toggleModal(false);
      return;
    }

    if (target.closest('#confirmationPopup .submit-btn')) {
      event.preventDefault();
      toggleConfirmation(false);
      return;
    }

    if (target.classList.contains('popup-overlay')) {
      if (target.id === 'newsletterModal') toggleModal(false);
      if (target.id === 'confirmationPopup') toggleConfirmation(false);
      return;
    }

    const ctaButton = target.closest('.cta-btn');
    if (!ctaButton) return;
    if (ctaButton.tagName === 'A' && ctaButton.hasAttribute('href')) return;
    if (ctaButton.hasAttribute('onclick')) return;

    event.preventDefault();
    toggleModal(true);
  });

  document.addEventListener('submit', async (event) => {
    const form = event.target.closest('.popup-form, .footer-form');
    if (!form) return;

    event.preventDefault();
    ensurePopupMarkup();

    if (!validateForm(form)) {
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    const payload = buildPayload(form);

    setLoading(submitButton, true);

    try {
      const result = await submitLead(payload);
      if (result.redirected) {
        resetFormState(form);
        return;
      }

      updateConfirmationMessage(result, payload);

      if (form.classList.contains('popup-form')) {
        toggleModal(false);
      }

      toggleConfirmation(true);
      resetFormState(form);
    } catch (error) {
      const emailInput = form.querySelector('input[type="email"]');
      showError(emailInput, getSubmissionErrorMessage(error));
    } finally {
      setLoading(submitButton, false);
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target.matches('.popup-form input, .footer-form input')) {
      clearError(event.target);
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.matches('#countrySelect')) {
      updateFlagAndCode();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    if (document.getElementById('confirmationPopup')?.classList.contains('active')) {
      toggleConfirmation(false);
      return;
    }

    if (document.getElementById('newsletterModal')?.classList.contains('active')) {
      toggleModal(false);
    }
  });

  window.addEventListener('languageChanged', applyPopupAccessibility);
}

window.toggleModal = toggleModal;
window.toggleConfirmation = toggleConfirmation;
window.updateFlagAndCode = updateFlagAndCode;

document.addEventListener('DOMContentLoaded', () => {
  initPopupLogic();
});
