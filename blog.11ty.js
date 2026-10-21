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
      return `<article class="panel"><div class="tag">${escape(d.category || 'Cultura alternativa')}</div><h2>${escape(d.title)}</h2><p>${escape(d.description || '')}</p><a class="cta-link" href="${url}">Ler artigo →</a></article>`;
    }).join('') : '<div class="panel"><h2>Novidades em breve</h2><p>Estamos preparando os primeiros artigos. Acompanhe a página para descobrir novas histórias.</p></div>';
    return shell.replace(/<div class="grid2">[\s\S]*?<\/div><\/section>/, `<div class="grid2">${cards}</div></section>`);
  }
}
module.exports = Blog;
