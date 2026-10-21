module.exports = function(eleventyConfig) {
  const fs = require("node:fs");
  // Publicar apenas paginas e recursos, nunca arquivos .md ou configuracoes do CMS.
  for (const name of ["index.html", "documentario.html", "sobre.html", "faca-parte.html", "obrigado.html", "privacidade.html", "artigo-identidade.html", "styles.css"]) {
    if (fs.existsSync(name)) eleventyConfig.addPassthroughCopy(name);
  }
  if (fs.existsSync("media")) eleventyConfig.addPassthroughCopy("media");
  eleventyConfig.addCollection("publicados", function(api) {
    return api.getFilteredByGlob("content/posts/**/*.md")
      .filter(item => item.data.published === true)
      .sort((a,b) => new Date(b.data.date || 0) - new Date(a.data.date || 0));
  });
  return { dir: { input: ".", output: "_site" },
    templateFormats: ["md", "11ty.js"],
    markdownTemplateEngine: false,
    htmlTemplateEngine: false };
};
