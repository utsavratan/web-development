
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    nav.style.background = window.scrollY > 30
      ? 'rgba(13,15,20,0.97)'
      : 'rgba(13,15,20,0.88)';
  }
});

// ── Mobile nav toggle ─────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  // Close when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── Auto-dismiss flash messages ───────────────────────────────
document.querySelectorAll('.flash').forEach(flash => {
  setTimeout(() => {
    flash.style.opacity = '0';
    flash.style.transform = 'translateX(110%)';
    flash.style.transition = 'all 0.4s ease';
    setTimeout(() => flash.remove(), 400);
  }, 4000);
});

// ── Live search on events page ────────────────────────────────
const liveSearch = document.getElementById('liveSearch');
const eventsGrid  = document.getElementById('eventsGrid');
const resultsCount = document.getElementById('resultsCount');

if (liveSearch && eventsGrid) {
  liveSearch.addEventListener('input', () => {
    const query = liveSearch.value.toLowerCase().trim();
    const cards  = eventsGrid.querySelectorAll('.event-card');
    let visible  = 0;

    cards.forEach(card => {
      const name = card.dataset.name || '';
      const desc = card.dataset.desc || '';
      const match = name.includes(query) || desc.includes(query);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });

    if (resultsCount) {
      resultsCount.innerHTML = `Showing <strong>${visible}</strong> event(s)`;
    }
  });
}

// ── Registration Form Validation ──────────────────────────────
const regForm = document.getElementById('regForm');

if (regForm) {
  regForm.addEventListener('submit', (e) => {
    let valid = true;

    // Helper: show/clear errors
    function setError(fieldId, errorId, message) {
      const field = document.getElementById(fieldId);
      const errEl = document.getElementById(errorId);
      if (!field || !errEl) return;
      if (message) {
        field.classList.add('invalid');
        errEl.textContent = message;
        valid = false;
      } else {
        field.classList.remove('invalid');
        errEl.textContent = '';
      }
    }

    // Full Name
    const name = document.getElementById('full_name');
    if (!name || name.value.trim().length < 2) {
      setError('full_name', 'err_name', 'Please enter your full name (at least 2 characters).');
    } else {
      setError('full_name', 'err_name', '');
    }

    // Email
    const email = document.getElementById('email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      setError('email', 'err_email', 'Please enter a valid email address.');
    } else {
      setError('email', 'err_email', '');
    }

    // Phone
    const phone = document.getElementById('phone');
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone.value.trim())) {
      setError('phone', 'err_phone', 'Enter a valid 10-digit phone number.');
    } else {
      setError('phone', 'err_phone', '');
    }

    // Event selection
    const eventSel = document.getElementById('event_id');
    if (!eventSel || !eventSel.value) {
      setError('event_id', 'err_event', 'Please select an event.');
    } else {
      setError('event_id', 'err_event', '');
    }

    // Tickets
    const tickets = document.getElementById('tickets');
    if (!tickets || tickets.value < 1 || tickets.value > 10) {
      setError('tickets', 'err_tickets', 'Please enter between 1 and 10 tickets.');
    } else {
      setError('tickets', 'err_tickets', '');
    }

    if (!valid) {
      e.preventDefault();
      // Scroll to first error
      const firstErr = regForm.querySelector('.invalid');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Show loading state on button
      const btn  = document.getElementById('submitBtn');
      const text = document.getElementById('btnText');
      if (btn && text) {
        text.textContent = 'Submitting…';
        btn.disabled = true;
        btn.style.opacity = '0.7';
      }
    }
  });

  // Clear error on input
  regForm.querySelectorAll('input, select').forEach(field => {
    field.addEventListener('input', () => field.classList.remove('invalid'));
  });
}

// ── Scroll-reveal animation ───────────────────────────────────
// Simple IntersectionObserver to fade-in cards as they scroll into view
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.event-card, .step, .admin-stat').forEach((el, i) => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  observer.observe(el);
});
