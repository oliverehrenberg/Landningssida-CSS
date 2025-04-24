function toggleModal(show = true) {
  const modal = document.getElementById('newsletterModal');
  if (modal) modal.classList.toggle('active', show);
}

function toggleConfirmation(show = true) {
  const popup = document.getElementById('confirmationPopup');
  if (popup) popup.classList.toggle('active', show);
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
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const phoneInput = document.getElementById('phoneNumber');
      const phoneValue = phoneInput.value.trim();
      const phoneRegex = /^[0-9+()\\s-]*$/; // allows digits, +, (), spaces, -

      // Optional: Reference an error element if you want to display a custom message
      const errorMsg = document.getElementById('phoneError');

      if (!phoneRegex.test(phoneValue)) {
        if (errorMsg) {
          errorMsg.style.display = 'block';
        } else {
          alert("Felaktigt telefonnummer: Det får inte innehålla bokstäver.");
        }
        phoneInput.focus();
        return;
      } else {
        if (errorMsg) {
          errorMsg.style.display = 'none';
        }
      }

      toggleModal(false);
      setTimeout(() => toggleConfirmation(true), 300);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initPopupLogic();
});
