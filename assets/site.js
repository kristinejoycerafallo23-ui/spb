// Header scroll state
const header = document.getElementById('siteHeader');
if (header) {
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  });
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
  });
  mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  }));
}

// Process accordion
document.querySelectorAll('.process-step').forEach(step => {
  step.addEventListener('click', () => {
    const wasOpen = step.classList.contains('open');
    document.querySelectorAll('.process-step').forEach(s => s.classList.remove('open'));
    if (!wasOpen) step.classList.add('open');
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  if (!q) return;
  q.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Project filter (Projects page)
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const cat = chip.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
    });
  });
});

// Checkbox/radio visual state
document.querySelectorAll('.opt input').forEach(input => {
  input.addEventListener('change', () => {
    if (input.type === 'radio') {
      document.querySelectorAll(`.opt input[name="${input.name}"]`).forEach(i => i.closest('.opt').classList.remove('checked'));
    }
    input.closest('.opt').classList.toggle('checked', input.checked);
  });
});

// Multi-step form (only runs if a lead form exists on this page)
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  let currentStep = 1;
  const totalSteps = document.querySelectorAll('.form-step').length;
  const stepLabel = document.getElementById('stepLabel');
  const btnBack = document.getElementById('btnBack');
  const btnNext = document.getElementById('btnNext');
  const formBody = document.getElementById('formBody');
  const successPanel = document.getElementById('successPanel');

  function updateProgress() {
    document.querySelectorAll('.form-progress .dot').forEach(dot => {
      const n = parseInt(dot.dataset.dot, 10);
      dot.classList.toggle('done', n < currentStep);
      dot.classList.toggle('active', n <= currentStep);
    });
    stepLabel.textContent = `Step ${currentStep} of ${totalSteps}`;
    btnBack.style.visibility = currentStep === 1 ? 'hidden' : 'visible';
    btnNext.textContent = currentStep === totalSteps ? 'Start My Project' : 'Continue';
  }

  function showStep(n) {
    document.querySelectorAll('.form-step').forEach(s => s.classList.toggle('active', parseInt(s.dataset.step, 10) === n));
    updateProgress();
  }

  function validateStep(n) {
    const stepEl = document.querySelector(`.form-step[data-step="${n}"]`);
    const required = stepEl.querySelectorAll('[required]');
    for (const field of required) {
      if (!field.value.trim()) { field.focus(); return false; }
    }
    return true;
  }

  btnNext.addEventListener('click', () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    } else {
      formBody.style.display = 'none';
      document.querySelector('.form-progress').style.display = 'none';
      document.querySelector('.form-step-label').style.display = 'none';
      document.querySelector('.form-nav').style.display = 'none';
      document.querySelector('.privacy-note').style.display = 'none';
      successPanel.classList.add('active');
    }
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) { currentStep--; showStep(currentStep); }
  });

  showStep(1);
}
