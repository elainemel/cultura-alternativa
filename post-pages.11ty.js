const escape = s => String(s ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
class PostPages {
  data() {
    return { pagination: { data: 'collections.publicados', size: 1, alias: 'post' },
      permalink: data => `/artigos/${data.post.fileSlug}/index.html`,
      eleventyExcludeFromCollections: true };
  }
  render({ post }) {
    const d = post.data;
    const title = escape(d.title);
    const desc = escape(d.description || 'Uma publicação do portal Cultura Alternativa.');
    const author = escape(d.author || 'Equipe editorial');
    const category = escape(d.category || 'Cultura Alternativa');
    const body = post.templateContent || '';
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${desc}"><title>${title} | Noctivivium</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet"><link rel="stylesheet" href="/styles.css"></head><body><a class="skip" href="#conteudo">Pular para o conteúdo</a><header class="header"><nav class="nav wrap" aria-label="Navegação principal"><a class="brand" href="/index.html">NOCTI<b>VIVIUM</b></a><div class="links"><a href="/index.html">Início</a><a class="active" href="/blog.html">Blog</a><a href="/documentario.html">Documentário</a><a href="/sobre.html">Sobre</a><a class="nav-cta" href="/faca-parte.html">Faça parte</a></div></nav></header><main id="conteudo"><section class="page-hero"><div class="wrap"><div class="eyebrow">${category}</div><h1>${title}</h1><p>${desc}</p><p class="muted">Por ${author}</p></div></section><article class="section wrap prose">${d.image ? `<img src="${escape(d.image)}" alt="Imagem de capa do artigo" style="max-width:100%;border-radius:12px">` : ''}${body}<p><a class="cta-link" href="/blog.html">← Voltar ao blog</a></p></article></main><footer class="footer"><div class="wrap"><span>© 2026 Cultura Alternativa</span><span><a href="/privacidade.html">Privacidade</a></span></div></footer></body></html>`;
  }
}
module.exports = PostPages;
