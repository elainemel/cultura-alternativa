# Cultura Alternativa — integração do blog com Pages CMS

## Atualização
Envie os arquivos deste pacote para a raiz do repositório GitHub. **Não apague** `.pages.yml` nem `content/posts/` já existentes. O `blog.html` continua no repositório apenas como modelo visual; o Eleventy gera a versão pública na pasta `_site`.

## Netlify
O arquivo `netlify.toml` configura `npm run build` e a pasta `_site`. Ele substitui os campos da interface do Netlify. A instalação do Eleventy é feita pelo `npm install` do Netlify. Confirme o status Published no painel de Deploys.

## Publicação pelo Pages CMS
1. Em *Artigos do Blog*, crie ou edite um artigo.
2. Deixe **Publicado** desligado para rascunhos.
3. Quando o texto estiver revisado, ligue **Publicado** e clique **Save**.
4. Após deploy bem-sucedido no Netlify, o artigo aparecerá em `/blog.html` e `/artigos/slug-do-arquivo/`.
5. Apenas `published: true` entra na lista pública. Arquivos Markdown de rascunho não são enviados ao site.

## Conteúdo já existente
A página demonstrativa antiga `artigo-identidade.html` é mantida para não quebrar links; ela não aparece mais na listagem principal do blog. Pode ser removida numa futura limpeza do projeto.

## Cuidados
Nunca envie senhas ao GitHub. O site precisa de revisão dos textos, contato e política de privacidade antes da divulgação do formulário. Para Quivana Personal Use, verificar licença antes de uso público.

## Inscrições e newsletter (Brevo)
A função `netlify/functions/sync-brevo.mjs` escuta os eventos de formulários verificados do Netlify e envia ao Brevo apenas contatos com `consentimento=sim`. Não envia e-mails: os disparos são criados e revisados no painel do Brevo.

**Ativação no painel privado Netlify:** Project configuration → Environment variables → Add a variable. Configure `BREVO_API_KEY` com a chave API v3 da conta do projeto e `BREVO_LIST_ID` com o ID numérico da lista `Noctivivium | Newsletter`. Habilite o escopo Functions, e execute novo deploy após salvar. Nunca coloque essas informações em arquivos versionados nem envie a chave por mensagens.

**Migração dos inscritos anteriores:** Netlify Forms → `inscricoes-cultura` → exportar CSV; retirar inscrições de teste e importar apenas contatos com consentimento para a lista correta no Brevo. A automação só inclui novos envios verificados; ela não importa registros anteriores.

**Teste e manutenção:** faça uma inscrição de teste pelo site com consentimento, confirme a chegada no Brevo e remova o teste. Monitore logs de funções e configure remetente, verificação de domínio e link de descadastro no Brevo. Não adicione inscritos manualmente sem comprovar o consentimento, e respeite cancelamentos de assinatura.
