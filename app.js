// ============================================
// DIGITAL SERVICES — app.js
// PayPal : amandaleathershop@gmail.com
// WhatsApp: 6287760929944
// ============================================

const PAYPAL_EMAIL = 'amandaleathershop@gmail.com';
const WA_NUMBER   = '6287760929944';

let currentLang    = 'en';
let currentService = '';
let currentPrice   = 0;

// ============================================
// LANGUAGE SWITCHER
// ============================================
function setLang(lang) {
  currentLang = lang;

  // Toggle button styles
  document.getElementById('btn-lang-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-lang-id').classList.toggle('active', lang === 'id');

  // Update all elements with data-en / data-id attributes
  document.querySelectorAll('[data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val === null) return;

    // Buttons: update textContent but skip elements with child nodes we want to keep
    if (el.tagName === 'BUTTON' && el.classList.contains('btn-order')) {
      el.textContent = val;
    } else if (el.tagName === 'P' || el.tagName === 'H2' || el.tagName === 'H4' ||
               el.tagName === 'H3' || el.tagName === 'DIV' || el.tagName === 'SPAN' || el.tagName === 'SMALL') {
      el.innerHTML = val;
    } else {
      el.textContent = val;
    }
  });

  // Update placeholders
  document.querySelectorAll('[data-placeholder-' + lang + ']').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;

  // Update page title
  document.title = lang === 'en'
    ? 'Abu Faza | Premium Digital Services'
    : 'Abu Faza | Jasa Digital Premium';

  // Store preference
  localStorage.setItem('lang', lang);
}

// Init language on load
(function initLang() {
  const saved = localStorage.getItem('lang') || 'en';
  setLang(saved);
})();

// ============================================
// ORDER MODAL
// ============================================
function order(serviceName, price) {
  currentService = serviceName;
  currentPrice   = price;

  const titleEl = document.getElementById('modal-title');
  titleEl.textContent = (currentLang === 'en' ? 'Order: ' : 'Pesan: ') + serviceName;

  document.getElementById('modal-price').textContent = '$' + price;
  document.getElementById('btn-price').textContent   = '$' + price;

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (!e || e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('order-form').reset();
  }
}

// ============================================
// SUBMIT ORDER → PayPal + WhatsApp
// ============================================
function submitOrder(e) {
  e.preventDefault();

  const name    = document.getElementById('input-name').value.trim();
  const contact = document.getElementById('input-contact').value.trim();
  const desc    = document.getElementById('input-desc').value.trim();
  if (!name || !contact || !desc) return;

  const itemName = encodeURIComponent(currentService + ' - ' + name);
  const note     = encodeURIComponent('From: ' + name + ' | Contact: ' + contact + ' | Need: ' + desc.substring(0, 100));
  const paypalURL = 'https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=' + PAYPAL_EMAIL +
    '&item_name=' + itemName + '&amount=' + currentPrice + '&currency_code=USD&custom=' + note;

  window.open(paypalURL, '_blank');

  const waMsg = encodeURIComponent(
    '*New Order!*\n\n' +
    'Service: ' + currentService + '\n' +
    'Price: $' + currentPrice + '\n' +
    'Name: ' + name + '\n' +
    'Contact: ' + contact + '\n' +
    'Details:\n' + desc
  );
  setTimeout(() => window.open('https://wa.me/' + WA_NUMBER + '?text=' + waMsg, '_blank'), 1000);

  closeModal();
  showToast(currentLang === 'en'
    ? 'Payment opened! WhatsApp confirmation sent.'
    : 'Pembayaran dibuka! Konfirmasi terkirim ke WhatsApp.');
}

// ============================================
// TOAST
// ============================================
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed', bottom: '32px', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'linear-gradient(135deg,#7c5cfc,#5c8aff)',
    color: 'white', padding: '16px 28px', borderRadius: '14px',
    fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: '600',
    fontSize: '15px', zIndex: '9999',
    boxShadow: '0 16px 50px rgba(124,92,252,0.5)',
    opacity: '0', transition: 'all 0.4s ease',
    maxWidth: '90vw', textAlign: 'center',
  });
  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// ============================================
// SCROLL REVEAL
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .testi-card, .step').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ESC to close
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal({}); });

// Stats counter animation
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = true;
      const nums   = entry.target.querySelectorAll('.stat-num');
      const values = [50, 100];
      nums.forEach((el, i) => {
        if (i < 2) {
          const suffix = i === 0 ? '+' : '%';
          let cur = 0;
          const step = Math.ceil(values[i] / 40);
          const t = setInterval(() => {
            cur = Math.min(cur + step, values[i]);
            el.textContent = cur + suffix;
            if (cur >= values[i]) clearInterval(t);
          }, 40);
        }
      });
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObserver.observe(statsRow);
