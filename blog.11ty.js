const fs = require('node:fs');
const escape = s => String(s ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
class Blog {
  data() { return { permalink: '/blog.html', eleventyExcludeFromCollections: true }; }
  render({ collections }) {
    const shell = fs.readFileSync('blog.html', 'utf8');
    const posts = collections.publicados || [];
    const cards = posts.length ? posts.map(post => {
      const d = post.data;
      const url = `/artigos/${post.fileSlug}/`;
      const themes = ['identity','fashion','music','community'];
      const idx = posts.indexOf(post);
      return `<article class="panel editorial-post"><a class="post-art post-art-${themes[idx % themes.length]}" href="${url}" aria-label="Ler ${escape(d.title)}">${d.image ? `<img src="${escape(d.image)}" alt="Fotografia de capa: ${escape(d.title)}" loading="lazy">` : ""}<span>${escape(d.category || 'Cultura alternativa')}</span></a><div class="post-body"><div class="tag">${escape(d.category || 'Cultura alternativa')}</div><h2>${escape(d.title)}</h2><p>${escape(d.description || '')}</p><a class="cta-link" href="${url}">Ler artigo →</a></div></article>`;
    }).join('') : '';
    return shell.replace(/<div class="grid2">[\s\S]*?<\/div><\/section>/, `<div class="grid2">${cards}</div></section>`);
  }
}
module.exports = Blog;
