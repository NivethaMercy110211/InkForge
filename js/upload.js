/* =========================================================
   InkForge — upload.js
   Multi-step artwork upload workflow
   ========================================================= */

(function () {
  'use strict';

  let currentStep = 1;
  const totalSteps = 6;
  let uploadedFile = null;

  /* ----- Step navigation ----- */
  function goToStep(step) {
    if (step < 1 || step > totalSteps) return;
    currentStep = step;

    // Update step tabs
    document.querySelectorAll('.upload-step-tab').forEach((tab, idx) => {
      const tabStep = idx + 1;
      tab.classList.remove('active', 'done');
      if (tabStep < step) tab.classList.add('done');
      else if (tabStep === step) tab.classList.add('active');
    });

    // Show/hide step cards
    document.querySelectorAll('[data-step-card]').forEach(card => {
      const cardStep = parseInt(card.dataset.stepCard);
      card.style.display = cardStep === step ? 'block' : 'none';
    });

    // Update nav buttons
    const prevBtn = document.getElementById('step-prev');
    const nextBtn = document.getElementById('step-next');
    const publishBtn = document.getElementById('step-publish');
    const draftBtn = document.getElementById('step-draft');

    if (prevBtn) prevBtn.style.display = step > 1 ? 'inline-flex' : 'none';
    if (nextBtn) nextBtn.style.display = step < totalSteps ? 'inline-flex' : 'none';
    if (publishBtn) publishBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';
    if (draftBtn) draftBtn.style.display = step === totalSteps ? 'inline-flex' : 'none';

    // Scroll to top of upload card
    const card = document.querySelector('.upload-step-card');
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ----- File drop zone ----- */
  function initFileUpload() {
    const dropZone = document.getElementById('artwork-drop-zone');
    const fileInput = document.getElementById('artwork-file-input');
    const preview = document.getElementById('artwork-preview');
    const progressWrap = document.getElementById('upload-progress-wrap');
    const progressFill = document.getElementById('upload-progress-fill');
    const progressPct = document.getElementById('upload-progress-pct');

    if (!dropZone || !fileInput) return;

    function handleFile(file) {
      if (!file) return;
      const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        if (typeof showToast === 'function') showToast('Please upload PNG, JPEG, or SVG files only.');
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        if (typeof showToast === 'function') showToast('File too large. Maximum size is 50MB.');
        return;
      }

      uploadedFile = file;

      // Show progress
      if (progressWrap) progressWrap.style.display = 'block';
      let pct = 0;
      const interval = setInterval(() => {
        pct += Math.random() * 15;
        if (pct >= 100) { pct = 100; clearInterval(interval); }
        if (progressFill) progressFill.style.width = `${pct}%`;
        if (progressPct) progressPct.textContent = `${Math.round(pct)}%`;

        if (pct === 100) {
          setTimeout(() => {
            if (progressWrap) progressWrap.style.display = 'none';

            // Show preview
            const reader = new FileReader();
            reader.onload = (e) => {
              if (preview) {
                preview.src = e.target.result;
                preview.style.display = 'block';
              }
            };
            reader.readAsDataURL(file);

            // Update file name display
            const nameEl = document.getElementById('uploaded-file-name');
            if (nameEl) nameEl.textContent = file.name;

            if (typeof showToast === 'function') showToast('Artwork uploaded successfully!');
          }, 400);
        }
      }, 80);
    }

    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      handleFile(e.dataTransfer.files[0]);
    });
  }

  /* ----- Product selection ----- */
  function initProductSelection() {
    document.querySelectorAll('.upload-product-option').forEach(option => {
      option.addEventListener('click', () => {
        option.classList.toggle('selected');
        option.querySelector('input[type="checkbox"]').checked = option.classList.contains('selected');
      });
    });
  }

  /* ----- Publish / Save Draft ----- */
  function initPublish() {
    const publishBtn = document.getElementById('step-publish');
    const draftBtn = document.getElementById('step-draft');

    if (publishBtn) {
      publishBtn.addEventListener('click', () => {
        publishBtn.classList.add('loading');
        publishBtn.disabled = true;
        setTimeout(() => {
          publishBtn.classList.remove('loading');
          publishBtn.disabled = false;
          if (typeof showToast === 'function') showToast('Product published successfully!');
          setTimeout(() => { window.location.href = 'dashboard-designs.html'; }, 1200);
        }, 1800);
      });
    }

    if (draftBtn) {
      draftBtn.addEventListener('click', () => {
        if (typeof showToast === 'function') showToast('Saved as draft.');
        setTimeout(() => { window.location.href = 'dashboard-designs.html'; }, 1000);
      });
    }
  }

  /* ----- Step nav buttons ----- */
  function initStepNavButtons() {
    const prevBtn = document.getElementById('step-prev');
    const nextBtn = document.getElementById('step-next');

    if (prevBtn) prevBtn.addEventListener('click', () => goToStep(currentStep - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => {
      // Validate step 1: file uploaded
      if (currentStep === 1 && !uploadedFile) {
        if (typeof showToast === 'function') showToast('Please upload artwork first.');
        return;
      }
      goToStep(currentStep + 1);
    });

    // Step tab clicks
    document.querySelectorAll('.upload-step-tab').forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        const tabStep = idx + 1;
        if (tabStep <= currentStep || tab.classList.contains('done')) {
          goToStep(tabStep);
        }
      });
    });
  }

  /* ----- Price calculator ----- */
  function initPriceCalculator() {
    const priceInput = document.getElementById('product-selling-price');
    const baseCost = document.getElementById('base-cost-display');
    const profitDisplay = document.getElementById('profit-display');

    if (!priceInput) return;

    const BASE_COST = 12.50;
    if (baseCost) baseCost.textContent = `$${BASE_COST.toFixed(2)}`;

    priceInput.addEventListener('input', () => {
      const price = parseFloat(priceInput.value) || 0;
      const profit = price - BASE_COST;
      if (profitDisplay) {
        profitDisplay.textContent = profit > 0 ? `$${profit.toFixed(2)}` : '$0.00';
        profitDisplay.style.color = profit > 0 ? 'var(--success)' : 'var(--danger)';
      }
    });
  }

  /* ----- Character count for textarea ----- */
  function initCharCounts() {
    document.querySelectorAll('[data-max-chars]').forEach(el => {
      const max = parseInt(el.dataset.maxChars);
      const countEl = document.getElementById(el.dataset.charTarget);
      if (!countEl) return;
      el.addEventListener('input', () => {
        const len = el.value.length;
        countEl.textContent = `${len}/${max}`;
        countEl.style.color = len > max * 0.9 ? 'var(--warning)' : 'var(--muted)';
      });
    });
  }

  /* ----- Tag input ----- */
  function initTagInput() {
    const tagInputEl = document.getElementById('product-tags-input');
    const tagWrap = document.getElementById('product-tags-wrap');
    if (!tagInputEl || !tagWrap) return;

    let tags = [];

    function addTag(val) {
      val = val.trim().replace(/,/g, '');
      if (!val || tags.includes(val) || tags.length >= 10) return;
      tags.push(val);
      renderTags();
    }

    function removeTag(val) {
      tags = tags.filter(t => t !== val);
      renderTags();
    }

    function renderTags() {
      const existingTags = tagWrap.querySelectorAll('.ink-tag');
      existingTags.forEach(t => t.remove());
      tags.forEach(tag => {
        const el = document.createElement('span');
        el.className = 'ink-tag';
        el.innerHTML = `${tag} <button class="remove-tag" data-tag="${tag}"><i class="fa-solid fa-xmark"></i></button>`;
        tagWrap.insertBefore(el, tagInputEl);
        el.querySelector('.remove-tag').addEventListener('click', () => removeTag(tag));
      });
    }

    tagInputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        addTag(tagInputEl.value);
        tagInputEl.value = '';
      } else if (e.key === 'Backspace' && !tagInputEl.value && tags.length) {
        removeTag(tags[tags.length - 1]);
      }
    });
  }

  /* ----- Init ----- */
  function init() {
    if (!document.querySelector('[data-step-card]')) return;
    goToStep(1);
    initFileUpload();
    initProductSelection();
    initPublish();
    initStepNavButtons();
    initPriceCalculator();
    initCharCounts();
    initTagInput();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
