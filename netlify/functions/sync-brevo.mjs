// Envia apenas inscrições confirmadas do formulário Faça Parte ao Brevo.
// Credenciais e ID da lista são definidos exclusivamente nas variáveis do Netlify.
export default {
  async formSubmitted(event) {
    const data = event?.data || {};
    const formName = String(data["form-name"] || data.form_name || data.formName || "").trim();
    if (formName && formName !== "inscricoes-cultura") return;

    const email = String(data.email || "").trim().toLowerCase();
    const name = String(data.nome || "").trim().slice(0, 120);
    const consent = String(data.consentimento || "").trim().toLowerCase();

    if (consent !== "sim" || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const apiKey = process.env.BREVO_API_KEY;
    const listId = Number(process.env.BREVO_LIST_ID);
    if (!apiKey || !Number.isSafeInteger(listId) || listId < 1) {
      console.warn("Brevo não configurado: defina BREVO_API_KEY e BREVO_LIST_ID no Netlify.");
      return;
    }

    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "accept": "application/json",
        "content-type": "application/json"
      },
      body: JSON.stringify({
        email,
        attributes: name ? { FNAME: name } : {},
        listIds: [listId],
        updateEnabled: true
      })
    });

    if (!response.ok) {
      // Não registrar dados pessoais nem a chave privada nos logs.
      console.error("Brevo: falha na sincronização de inscrição; status HTTP:", response.status);
      throw new Error("Falha ao sincronizar inscrição autorizada com o Brevo");
    }
    console.info("Brevo: inscrição autorizada sincronizada.");
  }
};
