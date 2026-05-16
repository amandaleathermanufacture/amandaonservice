// ============================================
// DIGITAL SERVICES — app.js
// PayPal: amandaleathershop@gmail.com
// ============================================

const PAYPAL_EMAIL = 'amandaleathershop@gmail.com';
const WA_NUMBER   = '6287760929944';

let currentService = '';
let currentPrice   = 0;

// ---- Open Order Modal ----
function order(serviceName, price) {
  currentService = serviceName;
  currentPrice   = price;

  document.getElementById('modal-title').textContent = `Pesan: ${serviceName}`;
  document.getElementById('modal-price').textContent  = `$${price}`;
  document.getElementById('btn-price').textContent    = `$${price}`;

  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ---- Close Modal ----
function closeModal(e) {
  if (!e || e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('open');
    document.body.style.overflow = '';
    document.getElementById('order-form').reset();
  }
}

// ---- Submit Order → PayPal ----
function submitOrder(e) {
  e.preventDefault();

  const name    = document.getElementById('input-name').value.trim();
  const contact = document.getElementById('input-contact').value.trim();
  const desc    = document.getElementById('input-desc').value.trim();

  if (!name || !contact || !desc) return;

  // Build PayPal.me or PayPal payment link
  const itemName = encodeURIComponent(`${currentService} - ${name}`);
  const note     = encodeURIComponent(`Dari: ${name} | Kontak: ${contact} | Kebutuhan: ${desc.substring(0, 100)}`);

  // PayPal invoice link (no account needed for payer)
  const paypalURL = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${PAYPAL_EMAIL}&item_name=${itemName}&amount=${currentPrice}&currency_code=USD&custom=${note}&return=https://google.com&cancel_return=https://google.com`;

  // Open PayPal in new tab
  window.open(paypalURL, '_blank');

  // Also send WA notification
  const waMsg = encodeURIComponent(
    `🛒 *Order Baru!*\n\n` +
    `📦 Layanan: ${currentService}\n` +
    `💰 Harga: $${currentPrice}\n` +
    `👤 Nama: ${name}\n` +
    `📞 Kontak: ${contact}\n` +
    `📝 Kebutuhan:\n${desc}`
  );
  const waURL = `https://wa.me/${WA_NUMBER}?text=${waMsg}`;

  setTimeout(() => {
    window.open(waURL, '_blank');
  }, 1000);

  // Close modal & show success
  closeModal();
  showToast(`✅ Pembayaran dibuka! Konfirmasi otomatis dikirim ke WhatsApp.`);
}

// ---- Toast Notification ----
function showToast(msg) {
  const toast = document.createElement('div');
  toast.textContent = msg;
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '32px',
    left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: 'linear-gradient(135deg, #7c5cfc, #5c8aff)',
    color: 'white',
    padding: '16px 28px',
    borderRadius: '14px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: '600',
    fontSize: '15px',
    zIndex: '9999',
    boxShadow: '0 16px 50px rgba(124,92,252,0.5)',
    opacity: '0',
    transition: 'all 0.4s ease',
    maxWidth: '90vw',
    textAlign: 'center',
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

// ---- Scroll Reveal Animation ----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity    = '1';
      entry.target.style.transform  = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .testi-card, .step').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// ---- ESC to close modal ----
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal({});
});

// ---- Smooth number counter animation for stats ----
function animateCounter(el, target) {
  let current = 0;
  const step  = Math.ceil(target / 40);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current + (el.dataset.suffix || '');
    if (current >= target) clearInterval(timer);
  }, 40);
}

// Trigger stats animation on scroll
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = true;
      const statNums = entry.target.querySelectorAll('.stat-num');
      const values   = [50, 100];
      statNums.forEach((el, i) => {
        if (i < 2) {
          el.dataset.suffix = i === 0 ? '+' : '%';
          animateCounter(el, values[i]);
        }
      });
    }
  });
}, { threshold: 0.5 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObserver.observe(statsRow);
