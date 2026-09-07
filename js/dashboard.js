/* =========================================================
   InkForge — dashboard.js
   Dashboard charts, interactions, upload workflow
   ========================================================= */

(function () {
  'use strict';

  /* ----- Sidebar Collapse ----- */
  function initSidebarCollapse() {
    const toggle = document.querySelector('.dash-sidebar-toggle');
    const sidebar = document.querySelector('.dash-sidebar');
    if (!toggle || !sidebar) return;

    on(toggle, 'click', () => {
      if (window.matchMedia('(max-width: 991px)').matches) {
        sidebar.classList.remove('mobile-open');
        return;
      }
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('dash_sidebar_collapsed', sidebar.classList.contains('collapsed') ? '1' : '0');
    });

    // Restore state
    if (localStorage.getItem('dash_sidebar_collapsed') === '1') {
      sidebar.classList.add('collapsed');
    }
  }

  /* ----- Mobile Sidebar ----- */
  function initMobileSidebar() {
    const toggle = document.querySelector('.dash-mobile-toggle');
    const sidebar = document.querySelector('.dash-sidebar');
    const overlay = document.querySelector('.dash-sidebar-overlay');
    if (!toggle || !sidebar) return;

    const logoRow = sidebar.querySelector('.dash-sidebar-logo');
    let closeButton = sidebar.querySelector('.dash-mobile-close');
    if (logoRow && !closeButton) {
      closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.className = 'dash-mobile-close';
      closeButton.setAttribute('aria-label', 'Close sidebar');
      closeButton.setAttribute('title', 'Close menu');
      closeButton.innerHTML = '<i class="fa-solid fa-xmark" aria-hidden="true"></i>';
      logoRow.appendChild(closeButton);
    }

    on(toggle, 'click', () => {
      sidebar.classList.toggle('mobile-open');
    });

    if (overlay) {
      on(overlay, 'click', () => sidebar.classList.remove('mobile-open'));
    }

    on(closeButton, 'click', () => sidebar.classList.remove('mobile-open'));
  }

  /* ----- Helper ----- */
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);

  /* ----- Chart: Sales Performance ----- */
  function initSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const earnings = [820, 940, 780, 1120, 1340, 1580, 1240];
    const orders = [28, 32, 26, 38, 45, 54, 42];

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#B9B7C1' : '#686872';
    const gridColor = isDark ? 'rgba(57,56,66,0.6)' : 'rgba(228,226,231,0.8)';

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: months,
        datasets: [
          {
            label: 'Earnings ($)',
            data: earnings,
            borderColor: '#5546D7',
            backgroundColor: 'rgba(85,70,215,0.08)',
            borderWidth: 2.5,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#5546D7',
            pointRadius: 4,
            pointHoverRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'Orders',
            data: orders,
            borderColor: '#9B5CF6',
            backgroundColor: 'rgba(155,92,246,0.06)',
            borderWidth: 2,
            tension: 0.4,
            fill: false,
            pointBackgroundColor: '#9B5CF6',
            pointRadius: 4,
            pointHoverRadius: 6,
            borderDash: [4, 4],
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: {
            labels: { color: textColor, font: { family: 'Inter', size: 12 }, boxWidth: 12, padding: 16 }
          },
          tooltip: {
            backgroundColor: isDark ? '#25252D' : '#fff',
            titleColor: isDark ? '#F8F7F4' : '#202026',
            bodyColor: textColor,
            borderColor: isDark ? '#393842' : '#E4E2E7',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          },
          y: {
            position: 'left',
            grid: { color: gridColor },
            ticks: {
              color: textColor, font: { family: 'Inter', size: 11 },
              callback: v => `$${v}`
            }
          },
          y1: {
            position: 'right',
            grid: { drawOnChartArea: false },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          }
        }
      }
    });
  }

  /* ----- Chart: Earnings Donut ----- */
  function initEarningsDonut() {
    const canvas = document.getElementById('earningsDonut');
    if (!canvas || typeof Chart === 'undefined') return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#B9B7C1' : '#686872';

    new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['T-Shirts', 'Hoodies', 'Mugs', 'Tote Bags', 'Other'],
        datasets: [{
          data: [42, 28, 14, 10, 6],
          backgroundColor: ['#5546D7', '#8B6FE8', '#B4A8F4', '#D4CEFB', '#EAE8FB'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { family: 'Inter', size: 11 }, padding: 12, boxWidth: 12 }
          },
          tooltip: {
            backgroundColor: isDark ? '#25252D' : '#fff',
            titleColor: isDark ? '#F8F7F4' : '#202026',
            bodyColor: textColor,
            borderColor: isDark ? '#393842' : '#E4E2E7',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: { label: ctx => ` ${ctx.label}: ${ctx.parsed}%` }
          }
        }
      }
    });
  }

  /* ----- Chart: Monthly Earnings Bar ----- */
  function initEarningsBar() {
    const canvas = document.getElementById('earningsBar');
    if (!canvas || typeof Chart === 'undefined') return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#B9B7C1' : '#686872';
    const gridColor = isDark ? 'rgba(57,56,66,0.6)' : 'rgba(228,226,231,0.8)';

    new Chart(canvas, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [{
          label: 'Earnings ($)',
          data: [640, 720, 820, 940, 780, 1120, 1340, 1580, 1240],
          backgroundColor: 'rgba(85,70,215,0.75)',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#25252D' : '#fff',
            titleColor: isDark ? '#F8F7F4' : '#202026',
            bodyColor: textColor,
            borderColor: isDark ? '#393842' : '#E4E2E7',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: { label: ctx => ` $${ctx.parsed.y.toFixed(2)}` }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 } }
          },
          y: {
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: 'Inter', size: 11 }, callback: v => `$${v}` }
          }
        }
      }
    });
  }

  /* ----- Chart: Orders Trend ----- */
  function initOrdersChart() {
    const canvas = document.getElementById('ordersChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#B9B7C1' : '#686872';
    const gridColor = isDark ? 'rgba(57,56,66,0.6)' : 'rgba(228,226,231,0.8)';

    new Chart(canvas, {
      type: 'line',
      data: {
        labels: ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'],
        datasets: [{
          label: 'Orders',
          data: [8, 12, 9, 15, 18, 14, 20, 17],
          borderColor: '#5546D7',
          backgroundColor: 'rgba(85,70,215,0.10)',
          borderWidth: 2.5,
          tension: 0.45,
          fill: true,
          pointBackgroundColor: '#5546D7',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#25252D' : '#fff',
            titleColor: isDark ? '#F8F7F4' : '#202026',
            bodyColor: textColor,
            borderColor: isDark ? '#393842' : '#E4E2E7',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8
          }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 11 } } }
        }
      }
    });
  }

  /* ----- Period Toggle (chart) ----- */
  function initPeriodToggle() {
    document.querySelectorAll('.chart-period-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const parent = this.closest('.chart-wrap');
        if (!parent) return;
        parent.querySelectorAll('.chart-period-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // In a real app, fetch new data. For demo, just toggle.
      });
    });
  }

  /* ----- Reports Download (CSV) ----- */
  function initReportsDownload() {
    const downloadBtn = document.getElementById('download-csv');
    if (!downloadBtn) return;

    downloadBtn.addEventListener('click', () => {
      const rows = [
        ['Date', 'Order ID', 'Product', 'Sale Value', 'Production Cost', 'Seller Earnings'],
        ['2026-09-01', '#INK-0091', 'Midnight Botanica Tee', '$29.99', '$12.50', '$17.49'],
        ['2026-08-30', '#INK-0090', 'Abstract Orbit Mug', '$18.99', '$7.00', '$11.99'],
        ['2026-08-28', '#INK-0089', 'Minimal Form Hoodie', '$52.99', '$22.00', '$30.99'],
        ['2026-08-25', '#INK-0088', 'Retro Wave Phone Case', '$16.99', '$6.50', '$10.49'],
        ['2026-08-22', '#INK-0087', 'Urban Lines Tote', '$22.99', '$9.00', '$13.99'],
        ['2026-08-20', '#INK-0086', 'Wild Bloom Poster', '$14.99', '$5.00', '$9.99'],
        ['2026-08-18', '#INK-0085', 'Grid World Tee', '$27.99', '$12.50', '$15.49'],
        ['2026-08-15', '#INK-0084', 'Cosmos Dream Tee', '$31.99', '$12.50', '$19.49'],
      ];

      const csv = rows.map(r => r.map(cell => `"${cell}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'inkforge-sales-report.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (typeof showToast === 'function') showToast('CSV report downloaded');
    });
  }

  /* ----- Profile Image Upload Preview ----- */
  function initProfileImageUpload() {
    const input = document.getElementById('profile-img-upload');
    const preview = document.getElementById('profile-img-preview');
    if (!input || !preview) return;

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => { preview.src = ev.target.result; };
      reader.readAsDataURL(file);
    });
  }

  /* ----- Dashboard init ----- */
  function init() {
    initSidebarCollapse();
    initMobileSidebar();
    initSalesChart();
    initEarningsDonut();
    initEarningsBar();
    initOrdersChart();
    initPeriodToggle();
    initReportsDownload();
    initProfileImageUpload();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
