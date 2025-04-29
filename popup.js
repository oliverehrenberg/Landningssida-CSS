function toggleModal(show = true) {
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.classList.toggle('active', show);
}

function toggleConfirmation(show = true) {
  const popup = document.getElementById('confirmationPopup');
  if (popup) popup.classList.toggle('active', show);
}

function updateFlagAndCode() {
  const select = document.getElementById('countrySelect');
  const phoneInput = document.getElementById('phoneNumber');
  const selectedOption = select.options[select.selectedIndex];
  const countryCode = selectedOption.getAttribute('data-code');
  phoneInput.placeholder = `+${countryCode}`;
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone, countryCode) {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  // Basic validation - at least 5 digits
  return digits.length >= 5;
}

function showError(element, message) {
  const errorDiv = element.nextElementSibling || document.createElement('div');
  if (!errorDiv.classList.contains('error-message')) {
    errorDiv.className = 'error-message';
    element.parentNode.insertBefore(errorDiv, element.nextSibling);
  }
  errorDiv.textContent = message;
  element.classList.add('error');
}

function clearError(element) {
  const errorDiv = element.nextElementSibling;
  if (errorDiv && errorDiv.classList.contains('error-message')) {
    errorDiv.remove();
  }
  element.classList.remove('error');
}

function setLoading(button, isLoading) {
  button.disabled = isLoading;
  button.innerHTML = isLoading ? 
    '<span class="loading-spinner"></span>' + button.getAttribute('data-translate') : 
    button.getAttribute('data-translate');
}

function initPopupLogic() {
  document.querySelectorAll('.cta-btn').forEach((btn) => {
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
