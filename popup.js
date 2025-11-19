// Denna funktion öppnar eller stänger nyhetsbrevsmodalen
function toggleModal(show = true) {
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.classList.toggle('active', show);
}

// Denna funktion öppnar eller stänger bekräftelse-popupen
function toggleConfirmation(show = true) {
  const popup = document.getElementById('confirmationPopup');
  if (popup) popup.classList.toggle('active', show);
}

// Denna funktion uppdaterar placeholder och landskod för telefonnummer
function updateFlagAndCode() {
  const select = document.getElementById('countrySelect');
  const phoneInput = document.getElementById('phoneNumber');
  const selectedOption = select.options[select.selectedIndex];
  const countryCode = selectedOption.getAttribute('data-code');
  phoneInput.placeholder = `+${countryCode}`;
}

// Denna funktion validerar e-postadressen
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Denna funktion validerar telefonnumret
function validatePhone(phone, countryCode) {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Basic validation - at least 5 digits
  return digits.length >= 5;
}

// Denna funktion visar ett felmeddelande under ett formulärfält
function showError(element, message) {
  const errorDiv = element.nextElementSibling || document.createElement('div');
  if (!errorDiv.classList.contains('error-message')) {
    errorDiv.className = 'error-message';
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
  }
  errorDiv.textContent = message;
  element.classList.add('error');
}

// Denna funktion tar bort felmeddelande från ett formulärfält
function clearError(element) {
  const errorDiv = element.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.remove();
  }
  element.classList.remove('error');
}

// Denna funktion visar laddningsindikator på en knapp
function setLoading(button, isLoading) {
  button.disabled = isLoading;
  button.innerHTML = isLoading ? 
    '<span class="loading-spinner"></span>' + button.getAttribute('data-translate') : 
    button.getAttribute('data-translate');
}

// Denna funktion initierar popup-logiken och formulärhantering
function initPopupLogic() {
  document.querySelectorAll('.cta-btn').forEach((btn) => {
    // Skip buttons that are links (have href attribute)
    if (btn.tagName === 'A' && btn.hasAttribute('href')) {
      return;
    }
    // Skip buttons that have onclick attribute (they handle their own click)
    if (btn.hasAttribute('onclick')) {
      return;
    }
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal(true);
    });
  });

  const form = document.querySelector('.popup-form');
  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const phoneInput = document.getElementById('phoneNumber');
      const countrySelect = document.getElementById('countrySelect');
      const submitBtn = form.querySelector('.submit-btn');
      const selectedOption = countrySelect.options[countrySelect.selectedIndex];
      const countryCode = selectedOption.getAttribute('data-code');

      // Clear previous errors
      clearError(emailInput);
      clearError(phoneInput);

      // Validate email
      if (!validateEmail(emailInput.value)) {
        showError(emailInput, translations[localStorage.getItem('language') || 'sv'].emailError);
        return;
      }

      // Validate phone
      if (!validatePhone(phoneInput.value, countryCode)) {
        showError(phoneInput, translations[localStorage.getItem('language') || 'sv'].phoneError);
        return;
      }

      // Show loading state
      setLoading(submitBtn, true);

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Success - show confirmation
        toggleModal(false);
        setTimeout(() => toggleConfirmation(true), 300);
      } catch (error) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = translations[localStorage.getItem('language') || 'sv'].submitError;
        form.insertBefore(errorMessage, submitBtn);
      } finally {
        setLoading(submitBtn, false);
      }
    });

    // Add input validation
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', function() {
        clearError(this);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPopupLogic();
});
