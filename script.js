const DATA_URL = 'data/oeuvres.json';
const WHATSAPP_NUMBER = '33683889329';

async function loadWorks() {
  const response = await fetch(DATA_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Impossible de charger ${DATA_URL}`);
  return response.json();
}

function esc(value) {
  return String(value ?? '').replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char]));
}

function formatPrice(price) {
  if (!price) return 'Collection privée';
  return `${new Intl.NumberFormat('fr-FR').format(price)} €`;
}

function workCard(work) {
  const isNew = work.comment.toLowerCase() === 'new';
  return `
    <article class="work-card">
      <a href="oeuvre.html?id=${encodeURIComponent(work.id)}">
        <div class="work-index" aria-hidden="true">
          <span class="visual-number">N° ${esc(work.id).padStart(2, '0')}</span>
          <span class="index-label">${esc(work.collection)}</span>
        </div>
        <div class="card-body">
          <div class="card-meta"><span>${esc(work.collection)}</span><span>${esc(work.date)}</span></div>
          <h3>${esc(work.title)}</h3>
          <div class="card-footer">
            <span class="price">${esc(formatPrice(work.price))}</span>
            ${isNew ? '<span class="new-badge">Nouveau</span>' : ''}
          </div>
        </div>
      </a>
    </article>`;
}

function renderFilters(works, active, onChange) {
  const filters = document.getElementById('filters');
  if (!filters) return;
  const collections = ['Toutes', ...new Set(works.map(work => work.collection))];
  filters.innerHTML = collections.map(collection => `
    <button class="filter-button ${collection === active ? 'is-active' : ''}" type="button" data-collection="${esc(collection)}">
      ${esc(collection)}
    </button>`).join('');
  filters.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => onChange(button.dataset.collection));
  });
}

async function renderHome() {
  const gallery = document.getElementById('gallery');
  if (!gallery) return;
  try {
    const works = await loadWorks();
    let active = 'Toutes';
    const count = document.getElementById('work-count');
    const draw = () => {
      const visible = active === 'Toutes' ? works : works.filter(work => work.collection === active);
      gallery.innerHTML = visible.map(workCard).join('');
      if (count) count.textContent = `${visible.length} œuvre${visible.length > 1 ? 's' : ''}`;
      renderFilters(works, active, next => { active = next; draw(); });
    };
    draw();
  } catch (error) {
    gallery.innerHTML = `<p class="error">${esc(error.message)}</p>`;
  }
}

function whatsappLink(work) {
  const message = `J'ai beaucoup aimé cette œuvre : « ${work.title} »`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

async function renderDetail() {
  const container = document.getElementById('detail');
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get('id');
  try {
    const works = await loadWorks();
    const work = works.find(item => String(item.id) === String(id));
    if (!work) throw new Error('Cette œuvre n’existe pas dans le catalogue.');
    document.title = `${work.title} | Arts et Couleurs 2026`;
    const isNew = work.comment.toLowerCase() === 'new';
    container.innerHTML = `
      <div class="detail-layout">
        <div class="detail-poster" aria-label="Cartel numérique de ${esc(work.title)}">
          <span class="poster-number">N° ${esc(work.id).padStart(2, '0')}</span>
          <span class="poster-collection">${esc(work.collection)}</span>
          <strong class="poster-title">${esc(work.title)}</strong>
          <span class="poster-caption">Scannez le QR code placé à côté de l’œuvre pour écouter son histoire.</span>
        </div>
        <article class="detail-copy">
          <p class="eyebrow">${esc(work.collection)}${isNew ? ' · Nouveau' : ''}</p>
          <h1>${esc(work.title)}</h1>
          <p class="detail-intro">Une œuvre à regarder, à écouter et à laisser résonner.</p>
          <div class="detail-meta">
            <div class="meta-item"><span class="meta-label">Format</span><span class="meta-value">${esc(work.size)}</span></div>
            <div class="meta-item"><span class="meta-label">Composition</span><span class="meta-value">${esc(work.date || 'Date non renseignée')}</span></div>
            <div class="meta-item"><span class="meta-label">Collection</span><span class="meta-value">${esc(work.collection)}</span></div>
            <div class="meta-item"><span class="meta-label">Prix</span><span class="meta-value">${esc(formatPrice(work.price))}</span></div>
          </div>
          <section class="reaction-box" aria-labelledby="reaction-title">
            <div>
              <p class="reaction-kicker">Une réaction ?</p>
              <h2 id="reaction-title">Écrivez-moi directement</h2>
            </div>
            <a class="reaction-button" href="${esc(whatsappLink(work))}" target="_blank" rel="noopener">
              <span class="whatsapp-icon" aria-hidden="true">✆</span>
              <span>Réagir sur WhatsApp</span>
            </a>
          </section>
          <section class="audio-box" aria-labelledby="audio-title">
            <h2 id="audio-title">La voix de l’artiste</h2>
            <audio controls preload="metadata" src="${esc(work.audio)}">
              Votre navigateur ne prend pas en charge la lecture audio.
            </audio>
          </section>
        </article>
      </div>`;
  } catch (error) {
    container.innerHTML = `<p class="error">${esc(error.message)}</p>`;
  }
}

renderHome();
renderDetail();
