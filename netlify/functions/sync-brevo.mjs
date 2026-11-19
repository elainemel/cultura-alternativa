// Sincroniza apenas inscrições autorizadas do Netlify Forms com o Brevo.
// Configure BREVO_API_KEY e BREVO_LIST_ID como variáveis privadas no Netlify, escopo Functions.
export default {
  async formSubmitted(event) {
    const data = event?.data || {};
    const formName = String(data["form-name"] || data.form_name || data.formName || "").trim();
    if (formName && formName !== "inscricoes-cultura") {
      console.info("Brevo: outro formulário; ignorado.");
      return;
    }

    const email = String(data.email || "").trim().toLowerCase();
    const name = String(data.nome || "").trim().slice(0, 120);
    const consent = String(data.consentimento || "").trim().toLowerCase();
    if (consent !== "sim" || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      console.info("Brevo: envio ignorado por consentimento ou e-mail ausente/inválido.");
      return;
    }

    // Variáveis privadas Netlify. Não registrar valores em logs.
    const apiKey = Netlify.env.get("BREVO_API_KEY");
    const listId = Number(Netlify.env.get("BREVO_LIST_ID"));
    if (!apiKey || !Number.isSafeInteger(listId) || listId < 1) {
      console.error("Brevo: configuração ausente; verifique BREVO_API_KEY, BREVO_LIST_ID e escopo Functions.");
      return;
    }

    const payload = {
      email,
      listIds: [listId],
      updateEnabled: true,
      ...(name ? { attributes: { FIRSTNAME: name } } : {})
    };
    let response;
    try {
      response = await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: { "api-key": apiKey, "accept": "application/json", "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (error) {
      console.error("Brevo: erro de conexão com a API.");
      throw new Error("Falha de conexão com a API do Brevo");
    }
    if (!response.ok) {
      console.error("Brevo: API recusou o cadastro; HTTP " + response.status + ". Confira chave, lista e atributo FIRSTNAME.");
      throw new Error("Erro HTTP " + response.status + " na sincronização com Brevo");
    }
    console.info("Brevo: contato autorizado sincronizado com sucesso.");
  }
};
