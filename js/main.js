// LUMIÈRE - Main JavaScript

// Simple product dataset (used to populate product-detail dynamically)
const PRODUCTS = [
  { id: '1', title: 'Glow Radiance Serum', price: 285000, oldPrice: 350000, img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&h=500&fit=crop', category: 'Skincare', description: 'Serum wajah dengan kandungan Vitamin C, Niacinamide, dan Hyaluronic Acid yang diformulasikan untuk memberikan efek glowing alami, mencerahkan, dan melembapkan kulit secara intensif. Cocok untuk semua jenis kulit.', size: '30ml', expiry: '12 Bulan', cert: 'BPOM' },
  { id: '2', title: 'Velvet Matte Lipstick', price: 165000, oldPrice: null, img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=500&fit=crop', category: 'Makeup', description: 'Lipstik velvet dengan hasil matte yang nyaman dipakai sepanjang hari.', size: '4g', expiry: '24 Bulan', cert: '' },
  { id: '3', title: 'Hydra Boost Moisturizer', price: 320000, oldPrice: null, img: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=500&fit=crop', category: 'Skincare', description: 'Moisturizer ringan yang memberikan hidrasi intens dan membuat kulit halus.', size: '50ml', expiry: '24 Bulan', cert: 'BPOM' },
  { id: '4', title: 'Rose Petal Eau de Parfum', price: 450000, oldPrice: null, img: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=600&h=500&fit=crop', category: 'Fragrance', description: 'Parfum bunga rose dengan aroma lembut dan tahan lama.', size: '50ml', expiry: '36 Bulan', cert: '' },
  { id: '5', title: 'Silk Body Lotion', price: 198000, oldPrice: null, img: 'https://i.pinimg.com/1200x/bf/d4/b5/bfd4b5331225389552cdc89c12987da4.jpg', category: 'Body Care', description: 'Body lotion formulasi silk untuk kulit lembap dan harum.', size: '200ml', expiry: '24 Bulan', cert: '' },
  { id: '6', title: 'Pore Refining Toner', price: 175000, oldPrice: null, img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=500&fit=crop', category: 'Skincare', description: 'Toner untuk mengecilkan pori dan mempersiapkan kulit sebelum perawatan.', size: '150ml', expiry: '24 Bulan', cert: 'BPOM' },
  { id: '7', title: 'Flawless Skin Foundation', price: 245000, oldPrice: null, img: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&h=500&fit=crop', category: 'Makeup', description: 'Foundation untuk tampilan kulit mulus dan natural.', size: '30ml', expiry: '24 Bulan', cert: '' },
  { id: '8', title: 'Coffee Body Scrub', price: 155000, oldPrice: null, img: 'https://i.pinimg.com/1200x/2f/b4/ec/2fb4ec621abc229bf09a018dffa0b346.jpg', category: 'Body Care', description: 'Scrub tubuh dengan butiran kopi untuk eksfoliasi lembut.', size: '250ml', expiry: '24 Bulan', cert: '' }
];

// If on product-detail page, attempt to load product by id
function loadProductDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const titleEl = document.querySelector('.detail-title');
  const imgEl = document.getElementById('main-product-img');
  const priceEl = document.querySelector('.detail-price-lg');
  const descEl = document.querySelector('.detail-description');
  const tagEl = document.querySelector('.detail-tag');
  const sizeEl = document.querySelector('.detail-stat .detail-stat-value');
  if (titleEl) titleEl.textContent = p.title;
  if (imgEl) imgEl.src = p.img;
  if (priceEl) priceEl.innerHTML = `Rp ${p.price.toLocaleString('id-ID')}${p.oldPrice ? ' <span class="old">Rp ' + p.oldPrice.toLocaleString('id-ID') + '</span>' : ''}`;
  if (descEl) descEl.textContent = p.description;
  if (tagEl) tagEl.textContent = p.category;
  // update stats (attempt to fill size, expiry, cert)
  const stats = document.querySelectorAll('.detail-stat');
  if (stats && stats.length >=3) {
    stats[0].querySelector('.detail-stat-value').textContent = p.size || '';
    stats[1].querySelector('.detail-stat-value').textContent = p.expiry || '';
    stats[2].querySelector('.detail-stat-value').textContent = p.cert || '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      navLinks.style.display = navLinks.classList.contains('mobile-open') ? 'flex' : '';
      if (navLinks.classList.contains('mobile-open')) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = '#fff';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 40px rgba(0,0,0,0.1)';
      }
    });
  }

  // Admin sidebar toggle
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  }

  // Cart functionality
  window.cart = JSON.parse(localStorage.getItem('lumiere-cart') || '[]');
  updateCartBadge();

  window.addToCart = function(name, price, img) {
    const existing = window.cart.find(i => i.name === name);
    if (existing) { existing.qty++; }
    else { window.cart.push({ name, price, img, qty: 1 }); }
    localStorage.setItem('lumiere-cart', JSON.stringify(window.cart));
    updateCartBadge();
    showToast(`${name} ditambahkan ke keranjang!`);
  };

  window.removeFromCart = function(index) {
    window.cart.splice(index, 1);
    localStorage.setItem('lumiere-cart', JSON.stringify(window.cart));
    updateCartBadge();
    if (typeof renderCart === 'function') renderCart();
  };

  window.updateQty = function(index, delta) {
    window.cart[index].qty += delta;
    if (window.cart[index].qty < 1) window.cart[index].qty = 1;
    localStorage.setItem('lumiere-cart', JSON.stringify(window.cart));
    if (typeof renderCart === 'function') renderCart();
  };

  function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const total = window.cart.reduce((s, i) => s + i.qty, 0);
    badges.forEach(b => { b.textContent = total; b.style.display = total > 0 ? 'flex' : 'none'; });
  }

  // Toast notification
  window.showToast = function(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  };

  // Category filter
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.category;
      document.querySelectorAll('[data-cat]').forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });

  // Modal
  window.openModal = function(id) { document.getElementById(id).classList.add('show'); };
  window.closeModal = function(id) { document.getElementById(id).classList.remove('show'); };

  // Smooth scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-in'); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.card, .stat-card, .section-header').forEach(el => observer.observe(el));

  // Search filter
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      document.querySelectorAll('.searchable').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  // If product-detail page, populate from PRODUCTS
  loadProductDetail();
});

// CSS for fade-in animation
const style = document.createElement('style');
style.textContent = `
  .card,.stat-card,.section-header{opacity:0;transform:translateY(20px);transition:opacity 0.6s ease,transform 0.6s ease}
  .fade-in{opacity:1!important;transform:translateY(0)!important}
`;
document.head.appendChild(style);
