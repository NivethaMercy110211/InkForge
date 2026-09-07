/* =========================================================
   InkForge — filters.js
   Client-side product filtering and sorting
   ========================================================= */

(function () {
  'use strict';

  // Products data
  const PRODUCTS = [
    { id: 1,  name: 'Midnight Botanica Tee',     category: 'tshirts',  style: 'botanical', price: 29.99, rating: 4.8, creator: 'Luna Patel',   bestseller: true,  newest: false, img: 'assets/images/products/product-1.jpg', colors: ['#1A1A2E','#4A4A6A','#F8F7F4'], sizes: ['XS','S','M','L','XL'] },
    { id: 2,  name: 'Abstract Orbit Mug',        category: 'mugs',     style: 'abstract',  price: 18.99, rating: 4.6, creator: 'Kai Nakamura', bestseller: true,  newest: false, img: 'assets/images/products/product-2.jpg', colors: ['#FFFFFF','#1A1A2E'], sizes: [] },
    { id: 3,  name: 'Urban Lines Tote',          category: 'totes',    style: 'geometric', price: 22.99, rating: 4.7, creator: 'Zoe Wright',   bestseller: false, newest: true,  img: 'assets/images/products/product-3.jpg', colors: ['#E8E2D5','#1A1A2E'], sizes: [] },
    { id: 4,  name: 'Retro Wave Phone Case',     category: 'cases',    style: 'retro',     price: 16.99, rating: 4.5, creator: 'Marco Silva',  bestseller: true,  newest: false, img: 'assets/images/products/product-4.jpg', colors: ['#FF6B6B','#4ECDC4','#1A1A2E'], sizes: [] },
    { id: 5,  name: 'Minimal Form Hoodie',       category: 'hoodies',  style: 'minimal',   price: 52.99, rating: 4.9, creator: 'Anika Jensen', bestseller: true,  newest: false, img: 'assets/images/products/product-5.jpg', colors: ['#2C2C3E','#E8E2D5','#8B8B9E'], sizes: ['S','M','L','XL','2XL'] },
    { id: 6,  name: 'Wild Bloom Poster',         category: 'posters',  style: 'botanical', price: 14.99, rating: 4.4, creator: 'Luna Patel',   bestseller: false, newest: true,  img: 'assets/images/products/product-6.jpg', colors: ['#FFFFFF'], sizes: ['A4','A3','A2'] },
    { id: 7,  name: 'Grid World Tee',            category: 'tshirts',  style: 'geometric', price: 27.99, rating: 4.3, creator: 'Zoe Wright',   bestseller: false, newest: true,  img: 'assets/images/products/product-7.jpg', colors: ['#F8F7F4','#1A1A2E','#5546D7'], sizes: ['S','M','L','XL'] },
    { id: 8,  name: 'Skyline Cap',               category: 'caps',     style: 'minimal',   price: 24.99, rating: 4.6, creator: 'Kai Nakamura', bestseller: false, newest: false, img: 'assets/images/products/product-8.jpg', colors: ['#1A1A2E','#5546D7','#F8F7F4'], sizes: [] },
    { id: 9,  name: 'Cosmos Dream Tee',          category: 'tshirts',  style: 'abstract',  price: 31.99, rating: 4.7, creator: 'Marco Silva',  bestseller: true,  newest: false, img: 'assets/images/products/product-9.jpg', colors: ['#0D0D1A','#5546D7'], sizes: ['XS','S','M','L','XL','2XL'] },
    { id: 10, name: 'Brushstroke Tote',          category: 'totes',    style: 'abstract',  price: 21.99, rating: 4.5, creator: 'Anika Jensen', bestseller: false, newest: true,  img: 'assets/images/products/product-10.jpg', colors: ['#E8E2D5'], sizes: [] },
    { id: 11, name: 'Forest Walk Mug',           category: 'mugs',     style: 'botanical', price: 17.99, rating: 4.8, creator: 'Luna Patel',   bestseller: false, newest: true,  img: 'assets/images/products/product-11.jpg', colors: ['#FFFFFF','#2C4A2E'], sizes: [] },
    { id: 12, name: 'Neon Pulse Hoodie',         category: 'hoodies',  style: 'retro',     price: 58.99, rating: 4.5, creator: 'Marco Silva',  bestseller: false, newest: false, img: 'assets/images/products/product-12.jpg', colors: ['#1A1A2E','#00FF88'], sizes: ['S','M','L','XL'] },
  ];

  let filtered = [...PRODUCTS];
  let currentFilters = {
    categories: [],
    styles: [],
    priceMin: 0,
    priceMax: 100,
    sort: 'bestselling',
    search: ''
  };

  function applyFilters() {
    filtered = PRODUCTS.filter(p => {
      const catOk = currentFilters.categories.length === 0 || currentFilters.categories.includes(p.category);
      const styleOk = currentFilters.styles.length === 0 || currentFilters.styles.includes(p.style);
      const priceOk = p.price >= currentFilters.priceMin && p.price <= currentFilters.priceMax;
      const searchTerm = currentFilters.search.toLowerCase();
      const searchOk = !searchTerm || p.name.toLowerCase().includes(searchTerm) || p.creator.toLowerCase().includes(searchTerm);
      return catOk && styleOk && priceOk && searchOk;
    });

    // Sort
    switch (currentFilters.sort) {
      case 'newest':
        filtered.sort((a, b) => b.newest - a.newest);
        break;
      case 'bestselling':
        filtered.sort((a, b) => b.bestseller - a.bestseller);
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    renderProducts();
    updateCount();
  }

  function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-12 text-center py-5">
          <div style="font-size:3rem;margin-bottom:16px;opacity:0.3"><i class="fa-solid fa-box-open"></i></div>
          <h3 style="font-family:var(--font-heading);color:var(--heading);margin-bottom:8px">No products found</h3>
          <p style="color:var(--muted)">Try adjusting your filters or search term.</p>
          <button class="btn-ink btn-primary-ink btn-ink-md" onclick="window.InkFilters.clearAll()" style="margin-top:16px">Clear Filters</button>
        </div>`;
      return;
    }

    grid.innerHTML = filtered.map(p => renderProductCard(p)).join('');
  }

  function renderProductCard(p) {
    const stars = renderStars(p.rating);
    const fallbackColors = ['#F8F7F4', '#1A1A2E', '#5546D7'];
    const displayColors = [...p.colors];
    fallbackColors.forEach(color => {
      if (displayColors.length < 3 && !displayColors.includes(color)) displayColors.push(color);
    });
    const colorDots = displayColors.slice(0, 3).map(c =>
      `<span class="variant-dot" style="background:${c}" title="${c}"></span>`
    ).join('');
    const badge = p.bestseller ? '<span class="ink-badge badge-new">Bestseller</span>' : (p.newest ? '<span class="ink-badge badge-active">New</span>' : '');

    return `
    <div class="product-card" data-id="${p.id}">
      <div class="card-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='assets/images/products/product-placeholder.jpg'">
        ${badge ? `<div class="card-badge">${badge}</div>` : ''}
        <button class="wishlist-btn" title="Add to wishlist" aria-label="Add to wishlist">
          <i class="fa-regular fa-heart"></i>
        </button>
        <div class="card-quick-view">
          <button class="quick-view-btn" data-product-id="${p.id}">
            <i class="fa-regular fa-eye"></i> Quick View
          </button>
        </div>
      </div>
      <div class="card-body-ink">
        <div class="card-category">${formatCategory(p.category)}</div>
        <div class="card-title">${p.name}</div>
        <div class="card-creator">by <a href="creator-profile.html">${p.creator}</a></div>
        <div class="card-rating">
          ${stars}
          <span style="font-size:0.8rem;color:var(--muted)">(${(Math.floor(Math.random() * 200) + 30)})</span>
        </div>
        <div class="card-variants">${colorDots}</div>
        <div class="card-footer-ink">
          <div class="card-price">$${p.price.toFixed(2)}</div>
          <a href="product-detail.html" class="card-add-btn">
            <i class="fa-solid fa-cart-plus"></i> Shop Now
          </a>
        </div>
      </div>
    </div>`;
  }

  function renderStars(rating) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    let html = '<div class="star-rating">';
    for (let i = 0; i < full; i++) html += '<i class="fa-solid fa-star"></i>';
    if (half) html += '<i class="fa-solid fa-star-half-stroke"></i>';
    for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="fa-regular fa-star"></i>';
    html += `<span>${rating.toFixed(1)}</span></div>`;
    return html;
  }

  function formatCategory(cat) {
    const map = { tshirts: 'T-Shirts', mugs: 'Mugs', totes: 'Tote Bags', cases: 'Phone Cases', hoodies: 'Hoodies', posters: 'Posters', caps: 'Caps', gifts: 'Gifts' };
    return map[cat] || cat;
  }

  function updateCount() {
    const countEl = document.getElementById('products-count');
    if (countEl) {
      countEl.textContent = filtered.length;
    }
  }

  function initFilters() {
    // Category checkboxes
    document.querySelectorAll('[data-filter-cat]').forEach(input => {
      input.addEventListener('change', () => {
        currentFilters.categories = [...document.querySelectorAll('[data-filter-cat]:checked')].map(i => i.value);
        applyFilters();
      });
    });

    // Style checkboxes
    document.querySelectorAll('[data-filter-style]').forEach(input => {
      input.addEventListener('change', () => {
        currentFilters.styles = [...document.querySelectorAll('[data-filter-style]:checked')].map(i => i.value);
        applyFilters();
      });
    });

    // Price range
    const priceRange = document.getElementById('price-range');
    const priceMaxLabel = document.getElementById('price-max-label');
    if (priceRange) {
      priceRange.addEventListener('input', () => {
        currentFilters.priceMax = parseFloat(priceRange.value);
        if (priceMaxLabel) priceMaxLabel.textContent = `$${priceRange.value}`;
        applyFilters();
      });
    }

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        currentFilters.sort = sortSelect.value;
        applyFilters();
      });
    }

    // Search
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
      let debounce;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          currentFilters.search = searchInput.value;
          applyFilters();
        }, 280);
      });
    }

    // Mobile filter toggle
    const filterToggle = document.querySelector('.mobile-filter-btn');
    const filterSidebar = document.querySelector('.filter-sidebar');
    if (filterToggle && filterSidebar) {
      filterToggle.setAttribute('aria-expanded', 'false');
      filterToggle.addEventListener('click', () => {
        filterSidebar.classList.toggle('open');
        const isOpen = filterSidebar.classList.contains('open');
        filterToggle.setAttribute('aria-expanded', String(isOpen));
        filterToggle.innerHTML = `<i class="fa-solid fa-sliders"></i> ${isOpen ? 'Hide Filters' : 'Filters'}`;
      });
    }

    // Category chips (toolbar)
    document.querySelectorAll('[data-chip-cat]').forEach(chip => {
      chip.addEventListener('click', () => {
        const cat = chip.dataset.chipCat;
        document.querySelectorAll('[data-chip-cat]').forEach(c => c.classList.remove('active'));
        if (cat === 'all') {
          currentFilters.categories = [];
          chip.classList.add('active');
        } else {
          chip.classList.add('active');
          currentFilters.categories = [cat];
          // Sync checkbox
          const checkbox = document.querySelector(`[data-filter-cat][value="${cat}"]`);
          if (checkbox) checkbox.checked = true;
        }
        applyFilters();
      });
    });
  }

  window.InkFilters = {
    clearAll: function () {
      currentFilters = { categories: [], styles: [], priceMin: 0, priceMax: 100, sort: 'bestselling', search: '' };
      document.querySelectorAll('[data-filter-cat], [data-filter-style]').forEach(i => i.checked = false);
      const sortSelect = document.getElementById('sort-select');
      if (sortSelect) sortSelect.value = 'bestselling';
      const searchInput = document.getElementById('product-search');
      if (searchInput) searchInput.value = '';
      const priceRange = document.getElementById('price-range');
      if (priceRange) priceRange.value = 100;
      const priceMaxLabel = document.getElementById('price-max-label');
      if (priceMaxLabel) priceMaxLabel.textContent = '$100';
      document.querySelectorAll('[data-chip-cat]').forEach(c => c.classList.remove('active'));
      const allChip = document.querySelector('[data-chip-cat="all"]');
      if (allChip) allChip.classList.add('active');
      applyFilters();
    },
    applyFilters,
    PRODUCTS
  };

  // Auto-init on products page
  if (document.getElementById('products-grid')) {
    initFilters();
    applyFilters();
  }

})();
