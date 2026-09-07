(function () {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('plan');
  const plan = (typeof BARNDO_PLANS !== 'undefined') ? BARNDO_PLANS.find(p => p.slug === slug) : null;

  const contentEl = document.getElementById('detailContent');
  const notFoundEl = document.getElementById('detailNotFound');

  if (!plan) {
    if (contentEl) contentEl.style.display = 'none';
    if (notFoundEl) notFoundEl.style.display = 'block';
    return;
  }

  document.title = plan.name + ' Barndominium Floor Plan | Saratoga Premier Builders';
  document.getElementById('pageTitle').textContent = document.title;

  document.getElementById('crumbName').textContent = plan.name;
  document.getElementById('detailName').textContent = plan.name;

  const badgesEl = document.getElementById('detailBadges');
  if (plan.badges && plan.badges.length) {
    badgesEl.innerHTML = plan.badges.map(b => `<span>${b}</span>`).join('');
  }

  const mainPhoto = document.getElementById('detailMainPhoto');
  mainPhoto.src = plan.photos[0];
  mainPhoto.alt = plan.name + ' barndominium exterior';

  const galleryEl = document.getElementById('detailGallery');
  plan.photos.forEach((url, i) => {
    const thumb = document.createElement('div');
    thumb.className = 'gallery-thumb';
    thumb.innerHTML = `<img src="${url}" alt="${plan.name} photo ${i + 1}">`;
    thumb.addEventListener('click', () => openLightbox(i));
    galleryEl.appendChild(thumb);
  });

  // Also let the main photo open the lightbox
  document.getElementById('detailMainPhotoWrap').addEventListener('click', () => openLightbox(0));
  document.getElementById('detailMainPhotoWrap').style.cursor = 'zoom-in';

  document.getElementById('detailDesc').textContent = plan.desc;
  document.getElementById('detailSource').innerHTML =
    `Source: <a href="${plan.src}" target="_blank" rel="noopener">mybarndoplans.com</a>`;

  const bedsLabel = plan.beds >= 5 ? plan.beds + '+' : plan.beds;
  const specs = [
    ['Living Area', plan.sqft.toLocaleString() + ' sf'],
    ['Bedrooms', bedsLabel],
    ['Bathrooms', plan.baths],
    ['Stories', plan.stories],
    ['Garage', plan.garage],
    ['Footprint', plan.foot],
  ];
  document.getElementById('detailSpecs').innerHTML = specs.map(([label, val]) =>
    `<div class="spec-row"><span>${label}</span><strong>${val}</strong></div>`
  ).join('');

  // ---------- Lightbox ----------
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCounter = document.getElementById('lightboxCounter');
  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function updateLightbox() {
    lightboxImg.src = plan.photos[currentIndex];
    lightboxCounter.textContent = (currentIndex + 1) + ' / ' + plan.photos.length;
  }
  function nextPhoto() {
    currentIndex = (currentIndex + 1) % plan.photos.length;
    updateLightbox();
  }
  function prevPhoto() {
    currentIndex = (currentIndex - 1 + plan.photos.length) % plan.photos.length;
    updateLightbox();
  }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  document.getElementById('lightboxNext').addEventListener('click', nextPhoto);
  document.getElementById('lightboxPrev').addEventListener('click', prevPhoto);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
})();
