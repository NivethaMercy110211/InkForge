/* =========================================================
   InkForge — main.js
   Theme toggle, RTL toggle, scroll-to-top, mobile nav,
   navbar scroll effect, ripple, toast
   ========================================================= */

(function () {
  'use strict';

  /* ----- Helpers ----- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  /* ----- Theme (dark / light) ----- */
  const THEME_KEY = 'inkforge_theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    // Update toggle icons
    $$('.theme-toggle-btn').forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (theme === 'dark') {
        icon.className = 'fa-solid fa-sun';
        btn.setAttribute('title', 'Switch to light mode');
      } else {
        icon.className = 'fa-solid fa-moon';
        btn.setAttribute('title', 'Switch to dark mode');
      }
    });
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  on(document, 'click', (e) => {
    if (e.target.closest('.theme-toggle-btn')) toggleTheme();
  });

  initTheme();

  /* ----- RTL / LTR ----- */
  const DIR_KEY = 'inkforge_dir';

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', dir === 'rtl' ? 'ar' : 'en');
    localStorage.setItem(DIR_KEY, dir);

    $$('.rtl-toggle-btn').forEach(btn => {
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });
  }

  function initDir() {
    const saved = localStorage.getItem(DIR_KEY) || 'ltr';
    applyDir(saved);
  }

  function toggleDir() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  on(document, 'click', (e) => {
    if (e.target.closest('.rtl-toggle-btn')) toggleDir();
  });

  initDir();

  /* ----- Sticky Navbar Scroll Effect ----- */
  function initNavbarScroll() {
    const navbar = $('.ink-navbar');
    if (!navbar) return;

    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----- Mobile Menu Toggle ----- */
  function initMobileMenu() {
    const toggleBtn = $('.mobile-toggle');
    const mobileMenu = $('.mobile-menu');
    if (!toggleBtn || !mobileMenu) return;

    on(toggleBtn, 'click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        icon.className = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    // Close on outside click
    on(document, 'click', (e) => {
      if (!mobileMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
        toggleBtn.setAttribute('aria-expanded', 'false');
        const icon = toggleBtn.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      }
    });
  }

  /* ----- Shared navbar order and account actions ----- */
  function initNavbarLayout() {
    $$('.ink-navbar').forEach(navbar => {
      $$('.btn-seller-login', navbar).forEach(link => {
        link.href = 'seller-login.html';
        link.textContent = 'Login';
        link.setAttribute('aria-label', 'Creator login');
      });

      $$('.btn-dashboard', navbar).forEach(link => {
        link.textContent = 'Dashboard';
      });

      const controls = $('.nav-controls', navbar);
      if (controls) {
        const ordered = [
          $('.btn-seller-login', controls), $('.btn-dashboard', controls),
          $('.nav-divider', controls), $('a[href="cart.html"]', controls),
          $('.rtl-toggle-btn', controls), $('.theme-toggle-btn', controls)
        ];
        ordered.forEach(item => item && controls.appendChild(item));
      }

      const utilities = $('.mobile-utility-row', navbar);
      if (utilities) {
        const ordered = [
          $('a[href="cart.html"]', utilities),
          $('.rtl-toggle-btn', utilities), $('.theme-toggle-btn', utilities)
        ];
        ordered.forEach(item => item && utilities.appendChild(item));
      }
    });
  }

  /* ----- Shared public-site footer ----- */
  function initFooterLayout() {
    $$('.ink-footer').forEach(footer => {
      footer.innerHTML = `
        <div class="ink-container">
          <div class="footer-grid">
            <div class="footer-brand-column">
              <a href="index.html" class="footer-logo" aria-label="InkForge home">
                <div class="logo-icon"><i class="fa-solid fa-pen-nib"></i></div>
                <span class="logo-text">InkForge</span>
              </a>
              <p class="footer-tagline">Your Art. Your Merch. Your Store.<br>Independent designs, printed on demand.</p>
              <ul class="footer-social" aria-label="Social media links">
                <li><a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a></li>
                <li><a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a></li>
                <li><a href="#" aria-label="Pinterest"><i class="fa-brands fa-pinterest"></i></a></li>
                <li><a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a></li>
              </ul>
            </div>
            <div class="footer-column">
              <div class="footer-col-title">Shop</div>
              <ul class="footer-links">
                <li><a href="products.html">All Products</a></li>
                <li><a href="products.html?cat=tshirts">T-Shirts</a></li>
                <li><a href="products.html?cat=hoodies">Hoodies</a></li>
                <li><a href="products.html?cat=mugs">Mugs</a></li>
                <li><a href="products.html?cat=totes">Tote Bags</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <div class="footer-col-title">Creators</div>
              <ul class="footer-links">
                <li><a href="creators.html">Browse Creators</a></li>
                <li><a href="creator-signup.html">Become a Creator</a></li>
                <li><a href="seller-login.html">Creator Login</a></li>
                <li><a href="dashboard.html">Seller Dashboard</a></li>
                <li><a href="home2.html">How It Works</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <div class="footer-col-title">Company</div>
              <ul class="footer-links">
                <li><a href="about.html">About Us</a></li>
                <li><a href="contact.html">Contact</a></li>
                <li><a href="how-to-order.html">How to Order</a></li>
                <li><a href="cart.html">Shopping Cart</a></li>
                <li><a href="checkout.html">Checkout</a></li>
              </ul>
            </div>
            <div class="footer-column footer-newsletter-column">
              <div class="footer-col-title">Stay Updated</div>
              <div class="footer-newsletter">
                <p>Get new design drops, creator spotlights, and exclusive offers.</p>
                <div class="footer-newsletter-form">
                  <input type="email" placeholder="Your email address" aria-label="Email for newsletter">
                  <button type="button">Subscribe</button>
                </div>
                <p class="footer-newsletter-note"><i class="fa-solid fa-lock"></i> No spam. Unsubscribe anytime.</p>
              </div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="ink-container">
            <div class="inner">
              <p class="copy">&copy; 2026 InkForge. All rights reserved.</p>
              <ul class="legal-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>`;
    });
  }

  /* ----- Shared seller dashboard navigation ----- */
  function initDashboardNavigation() {
    const sidebar = $('.dash-sidebar');
    const topbarActions = $('.dash-topbar .topbar-actions');
    if (!sidebar || !topbarActions) return;

    const desktopSidebarToggle = $('.dash-sidebar-toggle', sidebar);
    if (desktopSidebarToggle) desktopSidebarToggle.remove();

    const duplicateSidebarUser = $('.dash-sidebar-user', sidebar);
    if (duplicateSidebarUser) duplicateSidebarUser.remove();

    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const mainLinks = [
      ['dashboard.html', 'fa-gauge-high', 'Overview'],
      ['dashboard-orders.html', 'fa-bag-shopping', 'Orders'],
      ['dashboard-designs.html', 'fa-palette', 'My Designs'],
      ['dashboard-upload.html', 'fa-cloud-arrow-up', 'Upload Design'],
      ['dashboard-earnings.html', 'fa-coins', 'Earnings'],
      ['dashboard-analytics.html', 'fa-chart-line', 'Analytics'],
      ['dashboard-reports.html', 'fa-file-lines', 'Reports']
    ];
    const nav = $('.dash-sidebar-nav', sidebar);
    if (nav) {
      nav.innerHTML = `
        <div class="dash-sidebar-section-label">Main</div>
        ${mainLinks.map(([href, icon, label]) => `
          <a href="${href}" class="dash-sidebar-link${currentPage === href ? ' active' : ''}"${currentPage === href ? ' aria-current="page"' : ''}>
            <i class="fa-solid ${icon}"></i><span>${label}</span>${href === 'dashboard-orders.html' ? '<span class="dash-badge"></span>' : ''}
          </a>`).join('')}
        <a href="seller-login.html" class="dash-sidebar-link dash-signout-link" id="dash-sidebar-logout" data-action="logout">
          <i class="fa-solid fa-right-from-bracket"></i><span>Log Out</span>
        </a>`;
    }

    if (!$('.dash-profile-menu', topbarActions)) {
      const profile = document.createElement('div');
      profile.className = 'dash-profile-menu';
      profile.innerHTML = `
        <button class="dash-profile-trigger" type="button" aria-expanded="false" aria-haspopup="menu">
          <img src="assets/images/creators/creator-1.jpg" alt="" class="dash-profile-avatar">
          <span class="dash-profile-name">Luna Patel</span>
          <i class="fa-solid fa-chevron-down dash-profile-chevron"></i>
        </button>
        <div class="dash-profile-dropdown" role="menu">u9yhmmmmmmjlyhjSZZZZZZBUB B 
          <div class="dash-profile-summary">
            <strong>Luna Patel</strong><span>Creator account</span>
          </div>
          <a href="dashboard-profile.html" role="menuitem"><i class="fa-solid fa-circle-user"></i> Profile</a>
          <a href="dashboard-payout.html" role="menuitem"><i class="fa-solid fa-wallet"></i> Payout Settings</a>
          <a href="dashboard-settings.html" role="menuitem"><i class="fa-solid fa-gear"></i> Settings</a>
          <a href="index.html" role="menuitem"><i class="fa-solid fa-store"></i> View Storefront</a>
        </div>`;
      topbarActions.appendChild(profile);

      const trigger = $('.dash-profile-trigger', profile);
      const closeMenu = () => {
        profile.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      };
      on(trigger, 'click', () => {
        const isOpen = profile.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      });
      on(document, 'click', e => {
        if (!profile.contains(e.target)) closeMenu();
      });
      on(document, 'keydown', e => {
        if (e.key === 'Escape') closeMenu();
      });
    }
  }

  /* ----- Logout Confirmation Modal Popup ----- */
  function initLogoutModal() {
    if (!$('.dash-sidebar') && !$('.dash-main') && !$('[data-action="logout"], .dash-signout-link')) return;

    let modal = $('#dash-logout-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'dash-logout-modal';
      modal.className = 'ink-logout-modal-backdrop';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'logout-modal-title');
      modal.innerHTML = `
        <div class="ink-logout-modal-card">
          <div class="ink-logout-modal-icon">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </div>
          <div class="ink-logout-modal-title" id="logout-modal-title">Log Out of InkForge?</div>
          <p class="ink-logout-modal-text">Are you sure you want to end your creator session? You will need to log back in to access your dashboard.</p>
          <div class="ink-logout-modal-actions">
            <button type="button" class="btn-ink btn-secondary-ink" id="cancel-logout-btn">Cancel</button>
            <a href="seller-login.html" class="btn-ink btn-danger-ink" id="confirm-logout-btn">
              <i class="fa-solid fa-right-from-bracket"></i> Log Out
            </a>
          </div>
        </div>`;
      document.body.appendChild(modal);
    }

    const openModal = () => {
      modal.classList.add('open');
      const cancelBtn = $('#cancel-logout-btn', modal);
      if (cancelBtn) cancelBtn.focus();
    };

    const closeModal = () => {
      modal.classList.remove('open');
    };

    document.addEventListener('click', e => {
      const logoutTrigger = e.target.closest('[data-action="logout"], .dash-signout-link');
      if (logoutTrigger) {
        e.preventDefault();
        openModal();
        return;
      }
      if (e.target.closest('#cancel-logout-btn')) {
        e.preventDefault();
        closeModal();
        return;
      }
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeModal();
      }
    });
  }

  /* ----- Active Nav Link ----- */
  function initActiveNavLink() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    $$('.ink-nav-links a, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (linkFile === path || (path === '' && linkFile === 'index.html')) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ----- Scroll to Top ----- */
  function initScrollTop() {
    const btn = $('.scroll-top-btn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Ripple Effect on Buttons ----- */
  function addRipple(e) {
    const btn = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    const existing = btn.querySelector('.ripple');
    if (existing) existing.remove();
    btn.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  }

  function initRipples() {
    $$('.btn-primary-ink, .btn-white-ink, .btn-success-ink, .btn-danger-ink').forEach(btn => {
      on(btn, 'click', addRipple);
    });
  }

  /* ----- Toast Notification ----- */
  window.showToast = function (msg, duration = 3000) {
    let toast = $('.ink-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'ink-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  };

  /* ----- Animate on Scroll ----- */
  function initScrollAnimation() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      document.documentElement.classList.add('motion-disabled');
      return;
    }

    document.documentElement.classList.add('motion-enabled');

    const headingSelectors = [
      '.section-header',
      '.section-eyebrow',
      '.section-badge',
      '.section-label',
      '.section-title',
      '.section-heading',
      '.section-subtitle',
      '.section-sub',
      '.section-desc',
      '.section > .ink-container > .section-label',
      '.section > .ink-container > .section-title',
      '.section > .ink-container > .section-subtitle',
      '.cta-section .ink-container > *',
      '.auth-heading',
      '.dash-page-title'
    ];

    const gridSelectors = [
      '.products-grid', '.category-grid', '.creators-grid',
      '.bestsellers-grid', '.arrivals-strip', '.stats-grid',
      '.stats-grid-4', '.designs-grid', '.how-it-works-steps',
      '.testimonials-grid', '.features-grid', '.values-grid',
      '.team-grid', '.process-grid', '.contact-grid', '.why-grid',
      '.faq-list', '.ink-accordion'
    ];

    const cardSelectors = [
      '.product-card', '.why-card', '.testimonial-card', '.journey-step',
      '.value-card', '.values-img-wrap', '.team-card', '.creator-card',
      '.creator-featured-card', '.stat-card', '.pod-step', '.pod-image-wrapper',
      '.process-card', '.timeline-item', '.about-stat-item', '.contact-info-card',
      '.contact-form-card', '.order-step-card', '.accordion-item', '.filter-sidebar',
      '.product-detail-layout', '.auth-card', '.order-summary-card'
    ];

    const revealElements = new Set();

    // Section headings and labels
    $$(headingSelectors.join(',')).forEach((element, index) => {
      element.classList.add('motion-reveal', 'motion-heading');
      element.style.setProperty('--motion-delay', `${Math.min(index % 3, 2) * 60}ms`);
      revealElements.add(element);
    });

    // Hero H1 and H2 banners are animated directly via high-performance CSS keyframe sequences on page load

    // Grid containers child staggering
    $$(gridSelectors.join(',')).forEach(grid => {
      if (grid.closest('.ink-footer') || grid.classList.contains('footer-grid')) return;
      [...grid.children].forEach((item, index) => {
        item.classList.add('motion-reveal', 'motion-card');
        item.style.setProperty('--motion-delay', `${Math.min(index % 6, 5) * 65}ms`);
        revealElements.add(item);
      });
    });

    // Specific individual card elements
    $$(cardSelectors.join(',')).forEach((element, index) => {
      if (!revealElements.has(element)) {
        element.classList.add('motion-reveal', 'motion-card');
        element.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 60}ms`);
        revealElements.add(element);
      }
    });

    $$('[data-aos]').forEach(element => {
      element.classList.add('motion-reveal');
      revealElements.add(element);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(element => observer.observe(element));
  }

  /* ----- Cart Count ----- */
  const CART_KEY = 'inkforge_cart';

  function getCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; }
  }

  function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
    $$('.cart-count').forEach(el => {
      el.textContent = total;
      el.style.display = total > 0 ? 'flex' : 'none';
    });
  }

  window.InkCart = { getCart, updateCartCount };
  updateCartCount();

  /* ----- Wishlist ----- */
  on(document, 'click', (e) => {
    const btn = e.target.closest('.wishlist-btn');
    if (!btn) return;
    btn.classList.toggle('active');
    const icon = btn.querySelector('i');
    if (icon) {
      icon.className = btn.classList.contains('active') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    }
    showToast(btn.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist');
  });

  /* ----- Smooth external link scroll ----- */
  on(document, 'click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  /* ----- Accordion auto-close siblings ----- */
  function initAccordion() {
    $$('.ink-accordion').forEach(accordion => {
      accordion.addEventListener('show.bs.collapse', function (e) {
        $$('.collapse.show', accordion).forEach(el => {
          if (el !== e.target) {
            const bsCollapse = bootstrap.Collapse.getInstance(el);
            if (bsCollapse) bsCollapse.hide();
          }
        });
      });
    });
  }

  /* ----- Init on DOM ready ----- */
  function init() {
    initFooterLayout();
    initDashboardNavigation();
    initLogoutModal();
    initNavbarLayout();
    initNavbarScroll();
    initMobileMenu();
    initActiveNavLink();
    initScrollTop();
    initRipples();
    initScrollAnimation();
    if (typeof bootstrap !== 'undefined') initAccordion();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
