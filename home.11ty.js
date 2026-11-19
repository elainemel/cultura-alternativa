const fs = require('node:fs');
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
class Home {
  data() { return { permalink: '/index.html', eleventyExcludeFromCollections: true }; }
  render({ collections }) {
    const shell = fs.readFileSync('index.html', 'utf8');
    const posts = collections.publicados || [];
    const cards = posts.map((post, index) => {
      const d = post.data;
      const title = escape(d.title || 'Artigo do Noctivivium');
      const desc = escape(d.description || '').replace(/\s+/g,' ').slice(0,190);
      const category = escape(d.category || 'Cultura alternativa');
      const url = '/artigos/' + encodeURIComponent(post.fileSlug) + '/';
      const image = d.image ? '<img src="' + escape(d.image) + '" alt="Capa de ' + title + '" loading="lazy">' : '';
      return '<article class="card carousel-card"><a class="art carousel-art" href="' + url + '" aria-label="Ler ' + title + '">' + image + '<span>' + category + '</span></a><div class="card-body"><small>' + category + '</small><a href="' + url + '">' + title + ' →</a><p>' + desc + '</p></div></article>';
    }).join('');
    const content = posts.length ? cards : '<p class="intro">Novos artigos serão publicados em breve.</p>';
    const carousel = '<div class="blog-carousel" aria-label="Artigos publicados no blog"><div class="blog-carousel-controls"><span class="blog-carousel-count" aria-live="polite">Artigos do blog</span><div class="blog-carousel-actions"><button class="carousel-arrow prev" type="button" aria-label="Artigos anteriores">‹</button><button class="carousel-arrow next" type="button" aria-label="Próximos artigos">›</button></div></div><div class="blog-carousel-track" id="blog-carousel-track" tabindex="0" aria-label="Deslize para conhecer os artigos">' + content + '</div></div>';
    const marker = /<div class="cards">[\s\S]*?<\/div><\/section>\s*<section class="manifesto/;
    if (!marker.test(shell)) throw new Error('Seção de artigos da página inicial não encontrada');
    const updated = shell.replace(marker, carousel + '</section>\n<section class="manifesto');
    const script = `<script>
(() => {
  const track = document.querySelector('.blog-carousel-track');
  const carousel = document.querySelector('.blog-carousel');
  if (!track || !carousel) return;
  const prev = carousel.querySelector('.carousel-arrow.prev');
  const next = carousel.querySelector('.carousel-arrow.next');
  const count = carousel.querySelector('.blog-carousel-count');
  const cards = [...track.querySelectorAll('.carousel-card')];
  if (!cards.length) { prev.hidden = true; next.hidden = true; return; }
  const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : cards[0].getBoundingClientRect().width);
  const update = () => {
    const max = Math.max(0, track.scrollWidth - track.clientWidth);
    const pos = track.scrollLeft;
    prev.disabled = pos <= 2;
    next.disabled = pos >= max - 2;
    const current = cards.reduce((n, card, i) => Math.abs(card.offsetLeft - cards[0].offsetLeft - pos) < Math.abs(cards[n].offsetLeft - cards[0].offsetLeft - pos) ? i : n, 0);
    count.textContent = 'Artigo ' + (current + 1) + ' de ' + cards.length;
  };
  prev.addEventListener('click', () => track.scrollBy({left: -step(), behavior: 'smooth'}));
  next.addEventListener('click', () => track.scrollBy({left: step(), behavior: 'smooth'}));
  track.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
})();
</script>`;
    return updated.replace('</body>',script+'</body>');
  }
}
module.exports = Home;
