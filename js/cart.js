/* =========================================================
   InkForge — cart.js
   Cart management, cart page rendering, checkout helpers
   ========================================================= */

(function () {
  'use strict';

  const CART_KEY = 'inkforge_cart';

  /* ----- Cart Storage ----- */
  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
  }

  /* ----- Add to cart ----- */
  function addToCart(item) {
    const cart = getCart();
    const key = `${item.id}_${item.size || ''}_${item.color || ''}`;
    const existing = cart.find(i => i.key === key);
    if (existing) {
      existing.qty = (existing.qty || 1) + (item.qty || 1);
    } else {
      cart.push({ ...item, key, qty: item.qty || 1 });
    }
    saveCart(cart);
    if (typeof showToast === 'function') showToast('Added to cart!');
  }

  /* ----- Remove from cart ----- */
  function removeFromCart(key) {
    const cart = getCart().filter(i => i.key !== key);
    saveCart(cart);
  }

  /* ----- Update quantity ----- */
  function updateQty(key, qty) {
    const cart = getCart();
    const item = cart.find(i => i.key === key);
    if (item) {
      item.qty = Math.max(1, qty);
      saveCart(cart);
    }
  }

  /* ----- Cart totals ----- */
  function getCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, i) => sum + (i.price * (i.qty || 1)), 0);
    const shipping = subtotal > 0 ? 4.99 : 0;
    const tax = subtotal * 0.08;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax, count: cart.reduce((s,i) => s + (i.qty||1), 0) };
  }

  /* ----- Update Cart UI (count badge, totals) ----- */
  function updateCartUI() {
    const totals = getCartTotals();

    // Count badges in navbar
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = totals.count;
      el.style.display = totals.count > 0 ? 'flex' : 'none';
    });

    // Totals on cart page
    const subtotalEl = document.getElementById('cart-subtotal');
    const shippingEl = document.getElementById('cart-shipping');
    const taxEl = document.getElementById('cart-tax');
    const totalEl = document.getElementById('cart-total');
    if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = totals.shipping > 0 ? `$${totals.shipping.toFixed(2)}` : 'Free';
    if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;
  }

  /* ----- Render Cart Page ----- */
  function renderCartPage() {
    const container = document.getElementById('cart-items-list');
    if (!container) return;

    const cart = getCart();

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="text-center py-5">
          <div style="font-size:3.5rem;opacity:0.3;margin-bottom:20px"><i class="fa-solid fa-cart-shopping"></i></div>
          <h3 style="font-family:var(--font-heading);color:var(--heading);margin-bottom:10px">Your cart is empty</h3>
          <p style="color:var(--muted);margin-bottom:24px">Discover designs from independent creators.</p>
          <a href="products.html" class="btn-ink btn-primary-ink btn-ink-md">Explore Products</a>
        </div>`;
      return;
    }

    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-item-img">
          <img src="${item.img || 'assets/images/products/product-1.jpg'}" alt="${item.name}" loading="lazy">
        </div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-meta">
            ${item.size ? `<span>Size: ${item.size}</span>` : ''}
            ${item.category ? `<span>${item.category}</span>` : ''}
          </div>
          <div class="cart-item-creator">by ${item.creator || 'InkForge Creator'}</div>
        </div>
        <div class="cart-item-controls">
          <div class="qty-control">
            <button class="qty-btn" onclick="InkCart.changeQty('${item.key}', ${(item.qty||1) - 1})">
              <i class="fa-solid fa-minus"></i>
            </button>
            <input class="qty-val" type="number" value="${item.qty || 1}" min="1" readonly>
            <button class="qty-btn" onclick="InkCart.changeQty('${item.key}', ${(item.qty||1) + 1})">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="cart-item-price">$${(item.price * (item.qty||1)).toFixed(2)}</div>
          <button class="cart-remove-btn" onclick="InkCart.remove('${item.key}')" title="Remove item">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </div>
      </div>
    `).join('');

    updateCartUI();
  }

  /* ----- Checkout & Order Placement ----- */
  function initCheckout() {
    const checkoutBtn = document.getElementById('proceed-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => {
        const cart = getCart();
        if (!cart || cart.length === 0) {
          if (typeof showToast === 'function') {
            showToast('Your cart is empty! Add items first.');
          } else {
            alert('Your cart is empty! Add items first.');
          }
          return;
        }

        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Order...';
        checkoutBtn.disabled = true;

        setTimeout(() => {
          saveCart([]);
          renderCartPage();
          checkoutBtn.innerHTML = originalText;
          checkoutBtn.disabled = false;
          if (typeof showToast === 'function') {
            showToast('🎉 Order placed successfully! Thank you for shopping with InkForge.');
          } else {
            alert('🎉 Order placed successfully! Thank you for shopping with InkForge.');
          }
        }, 1200);
      });
    }

    const form = document.getElementById('checkout-form');
    if (!form) return;

    const totals = getCartTotals();
    const totalEl = document.getElementById('checkout-total');
    if (totalEl) totalEl.textContent = `$${totals.total.toFixed(2)}`;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      if (btn) {
        btn.classList.add('loading');
        btn.disabled = true;
      }
      // Simulate processing
      setTimeout(() => {
        saveCart([]);
        window.location.href = '#order-complete';
        if (typeof showToast === 'function') showToast('Order placed! Thank you.');
        // Show order complete state
        const orderComplete = document.getElementById('order-complete-msg');
        if (orderComplete) {
          orderComplete.style.display = 'block';
          form.style.display = 'none';
        }
        if (btn) { btn.classList.remove('loading'); btn.disabled = false; }
      }, 1800);
    });
  }

  /* ----- Add to cart from product page ----- */
  function initAddToCart() {
    document.querySelectorAll('[data-add-cart]').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.addCart;
        const nameEl = document.querySelector('[data-product-name]');
        const priceEl = document.querySelector('[data-product-price]');
        const sizeEl = document.querySelector('.size-option.active');
        const imgEl = document.querySelector('.gallery-main img');

        addToCart({
          id: productId,
          name: nameEl ? nameEl.textContent : 'Custom Product',
          price: priceEl ? parseFloat(priceEl.textContent.replace('$','')) : 29.99,
          size: sizeEl ? sizeEl.textContent.trim() : null,
          category: 'T-Shirts',
          creator: 'InkForge Creator',
          img: imgEl ? imgEl.src : 'assets/images/products/product-1.jpg'
        });
      });
    });
  }

  /* ----- Init ----- */
  function init() {
    renderCartPage();
    initCheckout();
    initAddToCart();
    updateCartUI();
  }

  /* ----- Public API ----- */
  window.InkCart = {
    add: addToCart,
    remove: function(key) { removeFromCart(key); renderCartPage(); },
    changeQty: function(key, qty) { if (qty < 1) { removeFromCart(key); } else { updateQty(key, qty); } renderCartPage(); },
    getCart,
    getTotals: getCartTotals,
    updateCartCount: updateCartUI
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
