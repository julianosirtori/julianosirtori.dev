export const audienceCopy = {
  pt: {
    title: "Notas do Juliano",
    intro:
      "Uma newsletter com o que me der vontade de compartilhar, a cada duas semanas.",
    email: "Seu e-mail",
    subscribe: "Quero receber",
    sending: "Enviando…",
    check:
      "Confira sua caixa de entrada. Abra o link para confirmar sua inscrição.",
    hint: "Em português, a cada duas semanas. Confirme seu e-mail para começar. Cancele quando quiser.",
    error: "Não foi possível concluir agora. Tente novamente.",
    newsletterTestRecipient:
      "Esta prévia aceita apenas e-mails autorizados para testes. Este endereço ainda não está liberado.",
    newsletterRateLimited:
      "O limite de tentativas foi atingido. Aguarde um pouco antes de tentar novamente.",
    confirm: "Confirmar minha inscrição",
    confirmKicker: "Confirmação de e-mail",
    confirmed: "Inscrição confirmada. Boas-vindas às Notas do Juliano!",
    expired: "Este link expirou ou não é mais válido. Solicite um novo link.",
    sample: "O que pode aparecer por aqui",
    sampleText:
      "Pode aparecer uma opinião sobre um aplicativo, uma ferramenta que testei, um projeto em que estou mexendo ou um meme que me fez rir.",
    sampleLinks:
      "Vou mandar o que estiver me interessando e der vontade de dividir com você. O assunto e o formato podem mudar a cada edição.",
    guestbook: "Deixe um recado",
    guestIntro:
      "Passou por aqui? Conte de onde veio ou o que achou. Português e inglês dividem o mesmo mural.",
    login: "Entrar com GitHub",
    logout: "Sair",
    message: "Seu recado",
    moderation: "Até 500 caracteres. Os recados são públicos após revisão.",
    send: "Enviar recado",
    received: "Recebi seu recado. Ele aparece aqui depois da revisão.",
    empty: "Nenhum recado publicado ainda. Você pode deixar o primeiro.",
    unavailable: "O mural está indisponível no momento. Tente novamente.",
    retry: "Tentar novamente",
    drafts: "Rascunhos salvos neste navegador",
    recover: "Usar este rascunho",
    recommendations: "Recomendações",
    allRecommendations: "Ver todas as recomendações",
    original: "Texto original",
    source: "Origem: LinkedIn",
    admin: "Moderação do guestbook",
    pending: "Pendentes",
    approved: "Publicadas",
    rejected: "Rejeitadas",
    approve: "Aprovar",
    reject: "Rejeitar",
    unpublish: "Retirar da publicação",
    more: "Carregar mais",
    unsubscribe: "Cancelar inscrição",
    unsubscribeKicker: "Preferências de e-mail",
    unsubscribed: "Inscrição cancelada. Você não receberá novas edições.",
    unsubscribeHint:
      "Confirme abaixo para parar de receber as Notas do Juliano.",
    backHome: "Voltar ao início",
  },
  en: {
    title: "Notas do Juliano",
    intro: "A newsletter about whatever I feel like sharing, every two weeks.",
    email: "Your email",
    subscribe: "Subscribe",
    sending: "Sending…",
    check: "Check your inbox. Open the link to confirm your subscription.",
    hint: "In English, every two weeks. Confirm your email to get started. Unsubscribe anytime.",
    error: "We could not complete this right now. Please try again.",
    newsletterTestRecipient:
      "This preview only accepts approved test email addresses. This address is not enabled yet.",
    newsletterRateLimited:
      "The request limit has been reached. Please wait a while before trying again.",
    confirm: "Confirm my subscription",
    confirmKicker: "Email confirmation",
    confirmed: "You're subscribed. Welcome to Notas do Juliano!",
    expired: "This link has expired or is no longer valid. Request a new link.",
    sample: "What might show up here",
    sampleText:
      "You might get an app review, a tool I've tried, something from a project I'm working on, or a meme that made me laugh.",
    sampleLinks:
      "I'll send whatever catches my interest and feels worth passing along. The topics and format can change from one issue to the next.",
    guestbook: "Leave a note",
    guestIntro:
      "Stopped by? Share where you came from or what you thought. Portuguese and English share the same wall.",
    login: "Sign in with GitHub",
    logout: "Sign out",
    message: "Your note",
    moderation: "Up to 500 characters. Notes become public after review.",
    send: "Send note",
    received: "I received your note. It will appear here after review.",
    empty: "No published notes yet. You can leave the first one.",
    unavailable: "The guestbook is unavailable right now. Please try again.",
    retry: "Try again",
    drafts: "Drafts saved in this browser",
    recover: "Use this draft",
    recommendations: "Recommendations",
    allRecommendations: "View all recommendations",
    original: "Original text",
    source: "Source: LinkedIn",
    admin: "Guestbook moderation",
    pending: "Pending",
    approved: "Published",
    rejected: "Rejected",
    approve: "Approve",
    reject: "Reject",
    unpublish: "Unpublish",
    more: "Load more",
    unsubscribe: "Unsubscribe",
    unsubscribeKicker: "Email preferences",
    unsubscribed: "You are unsubscribed. You will not receive new issues.",
    unsubscribeHint: "Confirm below to stop receiving Notas do Juliano.",
    backHome: "Back to home",
  },
};
export const copyFor = (lang: string) =>
  audienceCopy[lang === "pt" ? "pt" : "en"];
const buttonBaseClass =
  "inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium outline-accent transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed motion-reduce:transition-none";
export const buttonClass = `${buttonBaseClass} border border-transparent bg-fg text-bg enabled:hover:bg-fg/90 enabled:active:bg-fg/80 disabled:border-border disabled:bg-bg-muted disabled:text-fg-muted`;
export const secondaryButtonClass = `${buttonBaseClass} border border-border-strong bg-bg-elevated text-fg enabled:hover:bg-bg-muted enabled:active:border-fg-muted disabled:text-fg-subtle`;
export const textButtonClass = `${buttonBaseClass} text-fg-muted enabled:hover:bg-bg-muted enabled:hover:text-fg enabled:active:bg-bg-muted disabled:text-fg-subtle`;
export const inputClass =
  "border-border-strong bg-bg text-fg placeholder:text-fg-subtle focus:border-accent outline-accent min-h-11 min-w-0 w-full rounded-md border px-3 py-2 text-base transition-colors focus:outline-2 focus:outline-offset-2 disabled:cursor-not-allowed disabled:bg-bg-muted disabled:text-fg-muted motion-reduce:transition-none";
