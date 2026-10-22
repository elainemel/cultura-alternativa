module.exports = function(eleventyConfig) {
  const fs = require("node:fs");

  // Copiar paginas e recursos estaticos para _site.
  const publicFiles = [
    "index.html", "documentario.html", "sobre.html", "faca-parte.html",
    "obrigado.html", "privacidade.html", "artigo-identidade.html",
    "styles.css", "banner-noctivivium.png", "cartaz-documentario.png",
    "banner-noctivivium.webp", "cartaz-documentario.webp"
  ];
  for (const name of publicFiles) {
    if (fs.existsSync(name)) eleventyConfig.addPassthroughCopy(name);
  }
  if (fs.existsSync("media")) eleventyConfig.addPassthroughCopy("media");

  // Manter a colecao do blog: somente artigos publicados.
  eleventyConfig.addCollection("publicados", function(api) {
    return api.getFilteredByGlob("content/posts/**/*.md")
      .filter(item => item.data.published === true)
      .sort((a, b) => new Date(b.data.date || 0) - new Date(a.data.date || 0));
  });
  return {
    dir: { input: ".", output: "_site" },
    templateFormats: ["md", "11ty.js"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: false
  };
};
