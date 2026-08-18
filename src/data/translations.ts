import type { Lang } from "@/lib/i18n";

/**
 * UI strings centralizadas, agrupadas por seção.
 *
 * Padrão: cada chave tem objeto { pt, en }. Componentes acessam via
 *   const { lang } = useLang();
 *   const tx = t(lang);
 *   tx.hero.role // string já no idioma certo
 *
 * Termos brasileiros específicos (NFCe, NFe, MDFe, Cuiabá) são mantidos
 * sem tradução por serem nomes próprios / siglas que recrutadores
 * estrangeiros pesquisam exatamente como estão.
 */

type Bilingual<T> = { [K in keyof T]: { pt: string; en: string } } extends T
  ? T
  : never;

const dict = {
  // Header / navegação
  nav: {
    about: { pt: "Sobre", en: "About" },
    experience: { pt: "Experiência", en: "Experience" },
    projects: { pt: "Projetos", en: "Projects" },
    clients: { pt: "Clientes", en: "Clients" },
    stack: { pt: "Stack", en: "Stack" },
    certifications: { pt: "Certificações", en: "Certifications" },
    contact: { pt: "Contato", en: "Contact" },
    headerCta: { pt: "Contato", en: "Contact" },
    headerCtaMobile: {
      pt: "Conectar no LinkedIn",
      en: "Connect on LinkedIn",
    },
    menuOpen: { pt: "Abrir menu", en: "Open menu" },
    menuClose: { pt: "Fechar menu", en: "Close menu" },
    menuLabel: { pt: "Menu de navegação", en: "Navigation menu" },
    primaryNav: { pt: "Navegação principal", en: "Primary navigation" },
    mobileNav: { pt: "Navegação móvel", en: "Mobile navigation" },
    backToTop: { pt: "Voltar ao topo", en: "Back to top" },
    skipLink: { pt: "Pular para o conteúdo", en: "Skip to main content" },
    labs: { pt: "Labs", en: "Labs" },
  },

  // Hero
  hero: {
    sectionLabel: { pt: "Introdução", en: "Introduction" },
    role: { pt: "Software Engineer", en: "Software Engineer" },
    pitch: {
      pt: "Construo apps web e mobile, APIs e SaaS — com foco em emissão fiscal (NFCe, NFe, MDFe) e integração com ERPs.",
      en: "I build web and mobile apps, APIs and SaaS — focused on Brazilian e-invoicing (NFCe, NFe, MDFe) and ERP integration.",
    },
    resumeLabel: { pt: "Currículo", en: "Resume" },
    resumeAria: {
      pt: "Currículo (ver online ou baixar PDF)",
      en: "Resume (view online or download PDF)",
    },
    scrollNext: {
      pt: "Rolar para a próxima seção",
      en: "Scroll to next section",
    },
    scrollLabel: { pt: "Scroll", en: "Scroll" },
  },

  // About
  about: {
    title: { pt: "Sobre", en: "About" },
    italic: { pt: "mim", en: "me" },
    subtitle: {
      pt: "Um pouco da minha história e jornada",
      en: "A bit of my story and journey",
    },
    p1: {
      pt: "Estou na área desde 2019. Comecei como suporte N1, passei por suporte N2 (onde também atuei como supervisor) e cresci para engenheiro de software dentro do mesmo nicho: ERPs, varejo e emissão fiscal brasileira. No caminho trabalhei com sistemas web corporativos, força de venda, dashboards internos, integrações com sistemas existentes e a parte de infra (servidores, redes, hardware).",
      en: "I've been in the field since 2019. Started as L1 support, moved to L2 (where I also acted as team supervisor) and grew into a software engineer within the same niche: ERPs, retail and Brazilian tax compliance. Along the way I worked on corporate web systems, field-sales apps, internal dashboards, integrations with existing systems and the infra side (servers, networks, hardware).",
    },
    p2: {
      pt: "Hoje, na maior parte do tempo, conecto código moderno a sistemas que já estão rodando — sem precisar reescrever o que funciona. Trabalho do Delphi às stacks modernas em React, Next.js e React Native, com APIs em Node.js, AdonisJS e PHP/Laravel sobre Linux e Windows Server.",
      en: "Most of my time now is spent connecting modern code to systems that are already running — without having to rewrite what works. I work across Delphi and modern stacks like React, Next.js and React Native, with APIs in Node.js, AdonisJS and PHP/Laravel running on Linux and Windows Server.",
    },
    statYears: { pt: "Anos na área", en: "Years in the field" },
    statProjects: { pt: "Projetos entregues", en: "Projects delivered" },
    statTechs: { pt: "Anos com emissão fiscal", en: "Years with e-invoicing" },
  },

  // Experience
  experience: {
    title: { pt: "Experiência", en: "Experience" },
    italic: { pt: "profissional", en: "career" },
    subtitle: {
      pt: "Minha trajetória e áreas de atuação",
      en: "My professional path and areas of focus",
    },
  },

  // Projects
  projects: {
    title: { pt: "Projetos", en: "Projects" },
    italic: { pt: "selecionados", en: "selected" },
    subtitle: {
      pt: "Produtos que construí — públicos e internos",
      en: "Products I've built — public and private",
    },
    seeAll: { pt: "Ver todos os projetos", en: "See all projects" },
    code: { pt: "Código", en: "Code" },
    seeLive: { pt: "Ver site", en: "View site" },
    codeAria: { pt: "Código de", en: "Code for" },
    liveAria: { pt: "Ver", en: "View" },
    codeAriaSuffix: { pt: "no GitHub", en: "on GitHub" },
    liveAriaSuffix: { pt: "ao vivo", en: "live" },
    internal: {
      pt: "Projeto interno · confidencial",
      en: "Internal project · confidential",
    },
  },

  // Clients
  clients: {
    title: { pt: "Clientes", en: "Clients" },
    italic: { pt: "& parceiros", en: "& partners" },
    subtitle: {
      pt: "Empresas que confiaram seus sites institucionais a mim",
      en: "Companies that trusted me with their institutional websites",
    },
    seeProject: { pt: "Ver projeto", en: "View project" },
    prevAria: { pt: "Cliente anterior", en: "Previous client" },
    nextAria: { pt: "Próximo cliente", en: "Next client" },
    goToAria: { pt: "Ir para cliente", en: "Go to client" },
  },

  // Technologies
  technologies: {
    title: { pt: "Stack", en: "Stack" },
    italic: { pt: "técnica", en: "technical" },
    subtitle: {
      pt: "Ferramentas que uso no dia a dia.",
      en: "Tools I use day to day.",
    },
  },

  // Certifications
  certifications: {
    title: { pt: "Certificações", en: "Certifications" },
    italic: { pt: "verificadas", en: "verified" },
    subtitle: {
      pt: "Avaliações técnicas verificáveis publicamente",
      en: "Technical assessments — publicly verifiable",
    },
    seeCredential: { pt: "Ver credencial", en: "View credential" },
    credentialAria: {
      pt: "Ver credencial de",
      en: "View credential for",
    },
    credentialAriaSuffix: { pt: "no HackerRank", en: "on HackerRank" },
  },

  // Contact
  contact: {
    title: { pt: "Vamos", en: "Let's" },
    italic: { pt: "conversar?", en: "talk?" },
    subtitle: {
      pt: "Projetos, parcerias ou um café",
      en: "Projects, partnerships, or a coffee",
    },
    whatsappMessage: {
      pt: "Olá Rafael! Encontrei seu portfólio e gostaria de conversar sobre uma possível oportunidade. Podemos agendar um bate-papo?",
      en: "Hi Rafael! I found your portfolio and would like to talk about a possible opportunity. Can we schedule a chat?",
    },
    whatsappHandle: { pt: "Fale comigo", en: "Send a message" },
  },

  // Labs (/labs + seções + /labs/:slug)
  labs: {
    navLabel: { pt: "Labs", en: "Labs" },
    navTools: { pt: "Ferramentas", en: "Tools" },
    navScripts: { pt: "Scripts", en: "Scripts" },
    navDocs: { pt: "Docs", en: "Docs" },
    navApi: { pt: "API", en: "API" },
    primaryNav: { pt: "Navegação do Labs", en: "Labs navigation" },
    mobileNav: { pt: "Menu do Labs", en: "Labs menu" },
    eyebrow: { pt: "Utilitários públicos", en: "Public utilities" },
    title: { pt: "Labs", en: "Labs" },
    italic: { pt: "& docs", en: "& docs" },
    subtitle: {
      pt: "Ferramentas no browser, scripts e documentação que eu uso no dia a dia — livres pra copiar e rodar.",
      en: "In-browser tools, scripts and docs I use day to day — free to copy and run.",
    },
    toolsTitle: { pt: "Ferramentas", en: "Tools" },
    toolsItalic: { pt: "no browser", en: "in the browser" },
    toolsSubtitle: {
      pt: "Utilitários que rodam só no seu dispositivo. Nada é enviado pra mim.",
      en: "Utilities that run on your device only. Nothing is sent to me.",
    },
    scriptsTitle: { pt: "Scripts", en: "Scripts" },
    scriptsItalic: { pt: "& instaladores", en: "& installers" },
    scriptsSubtitle: {
      pt: "Comandos e hubs interativos pra instalar e configurar o ambiente.",
      en: "Commands and interactive hubs to install and configure your environment.",
    },
    docsTitle: { pt: "Documentação", en: "Documentation" },
    docsItalic: { pt: "prática", en: "practical" },
    docsSubtitle: {
      pt: "Notas, algoritmos e referências curtas — o essencial pra consultar rápido.",
      en: "Notes, algorithms and short references — the essentials, quick to look up.",
    },
    apiTitle: { pt: "APIs mock", en: "Mock APIs" },
    apiItalic: { pt: "GET ao vivo", en: "live GET" },
    apiSubtitle: {
      pt: "JSONs reais que você pode chamar com fetch ou curl — de qualquer app, sem config.",
      en: "Real JSON you can call with fetch or curl — from any app, zero config.",
    },
    apiCategoryLegend: { pt: "Categoria de API", en: "API category" },
    apiTry: { pt: "Testar", en: "Try it" },
    apiCopyUrl: { pt: "Copiar URL", en: "Copy URL" },
    apiCopyCurl: { pt: "Copiar curl", en: "Copy curl" },
    apiFetchError: {
      pt: "Não foi possível buscar o endpoint. Tente novamente.",
      en: "Could not fetch the endpoint. Try again.",
    },
    emptySection: {
      pt: "Nada por aqui ainda.",
      en: "Nothing here yet.",
    },
    backHome: { pt: "Voltar ao portfolio", en: "Back to portfolio" },
    backToIndex: { pt: "Todos os labs", en: "All labs" },
    backToTools: { pt: "Todas as ferramentas", en: "All tools" },
    backToScripts: { pt: "Todos os scripts", en: "All scripts" },
    backToDocs: { pt: "Toda a documentação", en: "All docs" },
    updated: { pt: "Atualizado", en: "Updated" },
    quickStart: { pt: "Começar agora", en: "Quick start" },
    prerequisites: { pt: "Pré-requisitos", en: "Prerequisites" },
    includedTools: { pt: "Ferramentas incluídas", en: "Included tools" },
    howToUse: { pt: "Como usar", en: "How to use" },
    notes: { pt: "Observações", en: "Notes" },
    sources: { pt: "Arquivos fonte", en: "Source files" },
    copy: { pt: "Copiar", en: "Copy" },
    copied: { pt: "Copiado", en: "Copied" },
    openTool: { pt: "Abrir ferramenta", en: "Open tool" },
    toolsPagination: {
      pt: "Paginação de ferramentas",
      en: "Tools pagination",
    },
    pagePrev: { pt: "Página anterior", en: "Previous page" },
    pageNext: { pt: "Próxima página", en: "Next page" },
    pageLabel: { pt: "Página", en: "Page" },
    toolsTabGenerators: { pt: "Geradores", en: "Generators" },
    toolsTabValidators: { pt: "Validadores", en: "Validators" },
    toolsTabText: { pt: "Texto", en: "Text" },
    toolsTabDraws: { pt: "Sorteios", en: "Raffles" },
    toolsTabCode: { pt: "Código", en: "Code" },
    toolsTabSystem: { pt: "Sistema", en: "System" },
    toolsCategoryLegend: { pt: "Categoria de ferramentas", en: "Tool category" },
  },

  tools: {
    generate: { pt: "Gerar", en: "Generate" },
    check: { pt: "Verificar", en: "Check" },
    validate: { pt: "Validar", en: "Validate" },
    format: { pt: "Formatar", en: "Format" },
    minify: { pt: "Minificar", en: "Minify" },
    encode: { pt: "Codificar", en: "Encode" },
    decode: { pt: "Decodificar", en: "Decode" },
    convert: { pt: "Converter", en: "Convert" },
    clear: { pt: "Limpar", en: "Clear" },
    now: { pt: "Agora", en: "Now" },
    length: { pt: "Comprimento", en: "Length" },
    quantity: { pt: "Quantidade", en: "Quantity" },
    options: { pt: "Opções", en: "Options" },
    result: { pt: "Resultado", en: "Result" },
    output: { pt: "Saída", en: "Output" },
    input: { pt: "Entrada", en: "Input" },
    password: { pt: "Senha", en: "Password" },
    showPassword: { pt: "Mostrar senha", en: "Show password" },
    hidePassword: { pt: "Ocultar senha", en: "Hide password" },
    uppercase: { pt: "Maiúsculas (A–Z)", en: "Uppercase (A–Z)" },
    lowercase: { pt: "Minúsculas (a–z)", en: "Lowercase (a–z)" },
    numbers: { pt: "Números (0–9)", en: "Numbers (0–9)" },
    symbols: { pt: "Símbolos", en: "Symbols" },
    similar: { pt: "Evitar semelhantes (0, O, I, l, 1)", en: "Avoid similar (0, O, I, l, 1)" },
    formatted: { pt: "Com pontuação", en: "With punctuation" },
    charsetError: {
      pt: "Selecione pelo menos um conjunto de caracteres.",
      en: "Select at least one character set.",
    },
    passwordEmpty: {
      pt: "Digite uma senha para verificar.",
      en: "Enter a password to check.",
    },
    passwordChecking: {
      pt: "Consultando o Have I Been Pwned…",
      en: "Checking Have I Been Pwned…",
    },
    passwordSafe: {
      pt: "Essa senha não aparece nos vazamentos conhecidos.",
      en: "This password does not appear in known breaches.",
    },
    passwordPwned: {
      pt: "Esta senha apareceu",
      en: "This password appeared",
    },
    passwordTimes: {
      pt: "vezes em vazamentos conhecidos",
      en: "times in known breaches",
    },
    passwordPwnedHint: {
      pt: "Troque essa senha o quanto antes e não a reutilize em outros serviços.",
      en: "Change this password as soon as possible and do not reuse it elsewhere.",
    },
    passwordPrivacy: {
      pt: "A senha nunca sai do seu navegador. Só os 5 primeiros caracteres do hash SHA-1 vão para a API (k-anonymity). Fonte: Have I Been Pwned — Pwned Passwords.",
      en: "The password never leaves your browser. Only the first 5 characters of the SHA-1 hash are sent to the API (k-anonymity). Source: Have I Been Pwned — Pwned Passwords.",
    },
    passwordError: {
      pt: "Não foi possível consultar a API. Tente de novo em instantes.",
      en: "Could not reach the API. Try again in a moment.",
    },
    cpfLabel: { pt: "CPF", en: "CPF" },
    cnpjLabel: { pt: "CNPJ", en: "CNPJ" },
    docDisclaimer: {
      pt: "Só para testes de software. Não use documentos gerados para se passar por outra pessoa.",
      en: "For software testing only. Do not use generated documents to impersonate anyone.",
    },
    docValid: { pt: "Documento válido.", en: "Valid document." },
    docInvalid: { pt: "Documento inválido.", en: "Invalid document." },
    docEmpty: {
      pt: "Informe um número para validar.",
      en: "Enter a number to validate.",
    },
    personGenerate: { pt: "Gerar pessoa", en: "Generate person" },
    personGenderPrompt: { pt: "Sexo", en: "Gender" },
    personMale: { pt: "Masculino", en: "Male" },
    personFemale: { pt: "Feminino", en: "Female" },
    personRandom: { pt: "Aleatório", en: "Random" },
    personAny: { pt: "Qualquer", en: "Any" },
    personAge: { pt: "Idade", en: "Age" },
    personAgeHint: {
      pt: "Opcional — define a data de nascimento.",
      en: "Optional — sets the birth date.",
    },
    personCount: { pt: "Quantidade", en: "Quantity" },
    personCountHint: { pt: "Máximo de 30 pessoas.", en: "Up to 30 people." },
    personPrevious: { pt: "Pessoa anterior", en: "Previous person" },
    personNext: { pt: "Próxima pessoa", en: "Next person" },
    personJson: { pt: "JSON", en: "JSON" },
    personSectionPersonal: { pt: "Dados pessoais", en: "Personal data" },
    personSectionParents: { pt: "Filiação", en: "Parents" },
    personSectionOnline: { pt: "Online", en: "Online" },
    personSectionAddress: { pt: "Endereço", en: "Address" },
    personSectionPhones: { pt: "Telefones", en: "Phones" },
    personSectionPhysical: { pt: "Características físicas", en: "Physical traits" },
    personSectionOther: { pt: "Outros", en: "Other" },
    personName: { pt: "Nome", en: "Name" },
    personRg: { pt: "RG", en: "ID (RG)" },
    personBirthDate: { pt: "Data de nascimento", en: "Birth date" },
    personGender: { pt: "Sexo", en: "Gender" },
    personZodiac: { pt: "Signo", en: "Zodiac sign" },
    personMother: { pt: "Mãe", en: "Mother" },
    personFather: { pt: "Pai", en: "Father" },
    personEmail: { pt: "E-mail", en: "Email" },
    personZip: { pt: "CEP", en: "ZIP code" },
    personStreet: { pt: "Endereço", en: "Street" },
    personNumber: { pt: "Número", en: "Number" },
    personNeighborhood: { pt: "Bairro", en: "Neighborhood" },
    personCity: { pt: "Cidade", en: "City" },
    personState: { pt: "Estado", en: "State" },
    personPhone: { pt: "Telefone", en: "Phone" },
    personMobile: { pt: "Celular", en: "Mobile" },
    personHeight: { pt: "Altura", en: "Height" },
    personWeight: { pt: "Peso", en: "Weight" },
    personBloodType: { pt: "Tipo sanguíneo", en: "Blood type" },
    personFavoriteColor: { pt: "Cor favorita", en: "Favorite color" },
    hashAlgorithm: { pt: "Algoritmo", en: "Algorithm" },
    jsonInvalid: { pt: "JSON inválido.", en: "Invalid JSON." },
    jsonValid: { pt: "JSON válido.", en: "Valid JSON." },
    jsonHint: {
      pt: "Cole o JSON na entrada. A saída atualiza sozinha.",
      en: "Paste JSON in the input. The output updates as you type.",
    },
    example: { pt: "Exemplo", en: "Example" },
    sqlInvalid: { pt: "SQL inválido.", en: "Invalid SQL." },
    sqlHint: {
      pt: "Cole o SQL na entrada. A saída atualiza sozinha.",
      en: "Paste SQL in the input. The output updates as you type.",
    },
    decodeError: {
      pt: "Não foi possível decodificar esse valor.",
      en: "Could not decode that value.",
    },
    hexLabel: { pt: "HEX", en: "HEX" },
    rgbLabel: { pt: "RGB", en: "RGB" },
    hslLabel: { pt: "HSL", en: "HSL" },
    preview: { pt: "Pré-visualização", en: "Preview" },
    colorPicker: { pt: "Selecionar cor", en: "Pick a color" },
    colorPickerHint: {
      pt: "Clique no quadrado de cor para abrir o seletor ou edite HEX, RGB e HSL manualmente.",
      en: "Click the color square to open the picker, or edit HEX, RGB and HSL manually.",
    },
    cardBrand: { pt: "Bandeira", en: "Brand" },
    cardNumber: { pt: "Número do cartão", en: "Card number" },
    cardExpiry: { pt: "Validade", en: "Expiry" },
    cardCvv: { pt: "CVV", en: "CVV" },
    cardDisclaimer: {
      pt: "Só para testes de software. Não use para compras reais.",
      en: "For software testing only. Do not use for real purchases.",
    },
    vehicleBrand: { pt: "Marca", en: "Brand" },
    vehicleModel: { pt: "Modelo", en: "Model" },
    vehicleYear: { pt: "Ano", en: "Year" },
    vehiclePlate: { pt: "Placa", en: "Plate" },
    vehicleRenavam: { pt: "RENAVAM", en: "RENAVAM" },
    vehicleColor: { pt: "Cor", en: "Color" },
    vehicleMercosul: { pt: "Placa Mercosul", en: "Mercosul plate" },
    vehicleDisclaimer: {
      pt: "Dados fictícios para QA. Não representam veículos reais.",
      en: "Fake data for QA. Does not represent real vehicles.",
    },
    phoneType: { pt: "Tipo", en: "Type" },
    phoneMobile: { pt: "Celular", en: "Mobile" },
    phoneLandline: { pt: "Fixo", en: "Landline" },
    unixSeconds: { pt: "Unix (segundos)", en: "Unix (seconds)" },
    unixMillis: { pt: "Unix (milissegundos)", en: "Unix (milliseconds)" },
    isoLabel: { pt: "ISO 8601", en: "ISO 8601" },
    localLabel: { pt: "Data/hora local", en: "Local date/time" },
    invalidDate: { pt: "Data inválida.", en: "Invalid date." },
    paragraphs: { pt: "Parágrafos", en: "Paragraphs" },
    sentences: { pt: "Frases", en: "Sentences" },
    words: { pt: "palavras", en: "words" },
    wordsLabel: { pt: "Palavras", en: "Words" },
    loremLang: { pt: "Idioma do texto", en: "Text language" },
    loremLatin: { pt: "Latim", en: "Latin" },
    loremPortuguese: { pt: "Português", en: "Portuguese" },
    loremEnglish: { pt: "Inglês", en: "English" },
    loremStart: { pt: "Começar com “Lorem ipsum”", en: "Start with “Lorem ipsum”" },
    loremHtml: { pt: "Como HTML", en: "As HTML" },
    chars: { pt: "caracteres", en: "characters" },
    bytes: { pt: "bytes", en: "bytes" },
    jwtHeader: { pt: "Header", en: "Header" },
    jwtPayload: { pt: "Payload", en: "Payload" },
    jwtInvalid: {
      pt: "JWT inválido. Cole um token com três partes separadas por ponto.",
      en: "Invalid JWT. Paste a token with three dot-separated parts.",
    },
    jwtHint: {
      pt: "Só decodifica. Não verifica assinatura — não use isso para autenticar.",
      en: "Decode only. It does not verify the signature — do not use this to authenticate.",
    },
    cardEmpty: {
      pt: "Informe o número do cartão para validar.",
      en: "Enter the card number to validate.",
    },
    cardValid: { pt: "Número válido para a bandeira selecionada.", en: "Valid number for the selected brand." },
    cardInvalid: { pt: "Número inválido ou incompatível com a bandeira.", en: "Invalid number or incompatible with the brand." },
    calculate: { pt: "Calcular", en: "Calculate" },
    draw: { pt: "Sortear", en: "Draw" },
    sortMin: { pt: "De", en: "From" },
    sortMax: { pt: "Até", en: "To" },
    sortLabel: { pt: "Nome do sorteio", en: "Draw name" },
    sortLabelHint: { pt: "Opcional — só para referência.", en: "Optional — for reference only." },
    sortError: {
      pt: "Intervalo ou quantidade inválidos. A quantidade não pode exceder o intervalo.",
      en: "Invalid range or quantity. Count cannot exceed the range size.",
    },
    sortSummary: {
      pt: "Sorteio entre {min} e {max}, realizado em {date}.",
      en: "Draw between {min} and {max}, on {date}.",
    },
    sortModeNumbers: { pt: "Números", en: "Numbers" },
    sortModeList: { pt: "Lista", en: "List" },
    sortModeWheel: { pt: "Roleta", en: "Wheel" },
    sortModeCountdown: { pt: "Contagem", en: "Countdown" },
    sortListLabel: { pt: "Itens", en: "Items" },
    sortListHint: {
      pt: "Separe por vírgula, ponto e vírgula ou uma linha por item.",
      en: "Separate with commas, semicolons, or one item per line.",
    },
    sortWheelHint: {
      pt: "Até 16 nomes na roleta. Separe por vírgula ou linha.",
      en: "Up to 16 names on the wheel. Separate with commas or lines.",
    },
    sortListError: {
      pt: "Inclua pelo menos dois itens distintos.",
      en: "Include at least two distinct items.",
    },
    sortWheelError: {
      pt: "A roleta precisa de 2 a 16 itens.",
      en: "The wheel needs 2 to 16 items.",
    },
    sortWinner: { pt: "Sorteado", en: "Drawn" },
    sortSpinning: { pt: "Sorteando…", en: "Drawing…" },
    sortIdle: {
      pt: "Pronto para sortear.",
      en: "Ready to draw.",
    },
    sortGo: { pt: "Vai!", en: "Go!" },
    speedStart: { pt: "Iniciar teste", en: "Start test" },
    speedAgain: { pt: "Testar novamente", en: "Test again" },
    speedCancel: { pt: "Cancelar", en: "Cancel" },
    speedTesting: { pt: "Etapas do teste", en: "Test steps" },
    speedIdle: {
      pt: "Mede ping, download e upload com o motor oficial da Cloudflare, no PoP mais próximo. Em fibra o teste leva vários segundos.",
      en: "Measures ping, download and upload with Cloudflare’s official engine, at the nearest PoP. On fiber it takes several seconds.",
    },
    speedIdleShort: { pt: "Pronto para medir a conexão", en: "Ready to measure" },
    speedDone: { pt: "Teste concluído", en: "Test complete" },
    speedPartial: { pt: "Resultado parcial", en: "Partial result" },
    speedFailedShort: { pt: "Não foi possível medir", en: "Could not measure" },
    speedPing: { pt: "Ping", en: "Ping" },
    speedDownload: { pt: "Download", en: "Download" },
    speedUpload: { pt: "Upload", en: "Upload" },
    speedMbps: { pt: "Mbps", en: "Mbps" },
    speedMs: { pt: "ms", en: "ms" },
    speedPhasePing: { pt: "Medindo ping…", en: "Measuring ping…" },
    speedPhaseDownload: { pt: "Testando download…", en: "Testing download…" },
    speedPhaseUpload: { pt: "Testando upload…", en: "Testing upload…" },
    speedError: {
      pt: "Não foi possível completar o teste. Verifique a conexão e tente de novo.",
      en: "Could not complete the test. Check the connection and try again.",
    },
    speedUploadFailed: {
      pt: "Ping e download medidos. O upload não pôde ser concluído neste servidor — tente de novo.",
      en: "Ping and download measured. Upload could not finish on this server — try again.",
    },
    metaTitle: { pt: "Título", en: "Title" },
    metaAuthor: { pt: "Autor", en: "Author" },
    metaKeywords: { pt: "Keywords", en: "Keywords" },
    metaDescription: { pt: "Description", en: "Description" },
    metaUrl: { pt: "URL (Open Graph)", en: "URL (Open Graph)" },
    metaUrlHint: { pt: "Opcional — usado em og:url.", en: "Optional — used in og:url." },
    qrSize: { pt: "Tamanho do PNG", en: "PNG size" },
    qrSizeHint: {
      pt: "Altera só o arquivo baixado. A prévia na tela fica no mesmo tamanho.",
      en: "Changes the downloaded file only. The on-screen preview stays the same size.",
    },
    qrPreview: { pt: "Pré-visualização do QR Code", en: "QR Code preview" },
    qrDownload: { pt: "Baixar PNG", en: "Download PNG" },
    qrEmpty: {
      pt: "Digite um texto ou URL para ver o QR Code.",
      en: "Enter text or a URL to see the QR Code.",
    },
    qrHint: {
      pt: "URL, Wi-Fi, PIX ou qualquer texto. A prévia atualiza sozinha.",
      en: "URL, Wi-Fi, PIX, or any text. The preview updates as you type.",
    },
    qrExample: { pt: "Exemplo", en: "Example" },
    qrError: {
      pt: "Não foi possível gerar. Tente um texto mais curto.",
      en: "Could not generate. Try a shorter text.",
    },
    myIp: { pt: "IP público", en: "Public IP" },
    myIpHint: {
      pt: "Consulta api.ipify.org — seu IP é enviado apenas para esse serviço.",
      en: "Uses api.ipify.org — your IP is sent only to that service.",
    },
    myIpError: {
      pt: "Não foi possível obter o IP. Tente novamente.",
      en: "Could not fetch IP. Try again.",
    },
    browserName: { pt: "Navegador", en: "Browser" },
    browserVersion: { pt: "Versão", en: "Version" },
    browserLanguage: { pt: "Idioma", en: "Language" },
    browserOnline: { pt: "Online", en: "Online" },
    userAgent: { pt: "User agent", en: "User agent" },
    osName: { pt: "Sistema", en: "System" },
    osVersion: { pt: "Versão", en: "Version" },
    osPlatform: { pt: "Arquitetura", en: "Architecture" },
    osCores: { pt: "Núcleos lógicos", en: "Logical cores" },
    osMemory: { pt: "Memória", en: "Memory" },
    osMemoryHttp: { pt: "Indisponível em HTTP", en: "Unavailable over HTTP" },
    osMemoryUnavailable: { pt: "Indisponível", en: "Unavailable" },
    osTouch: { pt: "Touch points", en: "Touch points" },
    numberCurrency: { pt: "Monetária", en: "Currency" },
    numberSimple: { pt: "Numérica", en: "Numeric" },
    numberCase: { pt: "Tipo de letra", en: "Letter case" },
    numberLower: { pt: "minúsculas", en: "lowercase" },
    numberUpper: { pt: "MAIÚSCULAS", en: "UPPERCASE" },
    numberTitle: { pt: "Primeira maiúscula", en: "Title case" },
    rescisaoSalario: { pt: "Salário base", en: "Base salary" },
    rescisaoDependentes: { pt: "Dependentes", en: "Dependents" },
    rescisaoInicio: { pt: "Início do contrato", en: "Contract start" },
    rescisaoFim: { pt: "Fim do contrato", en: "Contract end" },
    rescisaoMotivo: { pt: "Motivo da rescisão", en: "Termination reason" },
    rescisaoPedido: { pt: "Pedido de demissão", en: "Resignation" },
    rescisaoJustaCausa: { pt: "Dispensa com justa causa", en: "Termination for cause" },
    rescisaoSemJusta: { pt: "Dispensa sem justa causa", en: "Termination without cause" },
    rescisaoExperiencia: { pt: "Fim do contrato de experiência", en: "End of trial contract" },
    rescisaoFeriasVencidas: { pt: "Possui férias vencidas?", en: "Has overdue vacation?" },
    rescisaoAvisoCumprido: { pt: "Aviso prévio cumprido?", en: "Notice period served?" },
    rescisaoDisclaimer: {
      pt: "Estimativa simplificada — não substitui orientação de profissional habilitado.",
      en: "Simplified estimate — does not replace advice from a qualified professional.",
    },
    rescisaoError: {
      pt: "Preencha salário e datas válidas. A data final deve ser posterior ao início.",
      en: "Fill in a valid salary and dates. End date must be after start date.",
    },
    rescisaoSaldo: { pt: "Saldo de salário", en: "Salary balance" },
    rescisaoDecimo: { pt: "13º proporcional", en: "Proportional bonus" },
    rescisaoFeriasProp: { pt: "Férias proporcionais", en: "Proportional vacation" },
    rescisaoTerco: { pt: "1/3 constitucional", en: "Constitutional 1/3" },
    rescisaoAviso: { pt: "Aviso prévio", en: "Notice period" },
    rescisaoFgts: { pt: "Multa FGTS (est.)", en: "FGTS fine (est.)" },
    rescisaoTotal: { pt: "Total estimado", en: "Estimated total" },
  },

  // CV (página /cv + PDF)
  cv: {
    backToPortfolio: {
      pt: "Voltar ao portfolio",
      en: "Back to portfolio",
    },
    downloadPdf: { pt: "Baixar PDF", en: "Download PDF" },
    profile: { pt: "Perfil", en: "Profile" },
    profileText: {
      pt: "Construo apps web e mobile, APIs e SaaS, com foco em emissão fiscal (NFCe, NFe, MDFe) e integração com ERPs. Estou na área desde 2019: comecei como suporte N1, passei por suporte N2 (também como supervisor) e cresci para engenheiro de software dentro do mesmo nicho — ERPs, varejo e emissão fiscal brasileira. Atuo do Delphi às stacks modernas em React, Next.js e React Native, com APIs em Node.js, AdonisJS e PHP/Laravel, sobre infraestrutura Linux e Windows Server.",
      en: "I build web and mobile apps, APIs and SaaS, focused on Brazilian e-invoicing (NFCe, NFe, MDFe) and ERP integration. I've been in the field since 2019: started as L1 support, moved to L2 (also as team supervisor) and grew into a software engineer within the same niche — ERPs, retail and Brazilian tax compliance. I work across Delphi and modern stacks like React, Next.js and React Native, with APIs in Node.js, AdonisJS and PHP/Laravel running on Linux and Windows Server.",
    },
    section_experience: { pt: "Experiência", en: "Experience" },
    section_projects: {
      pt: "Projetos selecionados",
      en: "Selected projects",
    },
    section_clients: { pt: "Clientes", en: "Clients" },
    section_stack: { pt: "Stack técnica", en: "Tech stack" },
    section_certs: { pt: "Certificações", en: "Certifications" },
    section_education: { pt: "Formação", en: "Education" },
    section_languages: { pt: "Idiomas", en: "Languages" },

    // Header da página /cv (folha de papel)
    headerRole: { pt: "Software Engineer", en: "Software Engineer" },

    // Education
    eduDegree: {
      pt: "CST em Análise e Desenvolvimento de Sistemas",
      en: "Associate Degree in Systems Analysis and Development",
    },
    eduSchool: {
      pt: "UNIASSELVI · Várzea Grande, MT",
      en: "UNIASSELVI · Várzea Grande, MT, Brazil",
    },
    eduPeriod: {
      pt: "Jul 2025 — Ago 2027 (em andamento)",
      en: "Jul 2025 — Aug 2027 (in progress)",
    },

    // Languages
    langPt: { pt: "Português (nativo)", en: "Portuguese (native)" },
    langEn: { pt: "Inglês (intermediário)", en: "English (intermediate)" },

    // Project status badges
    statusInDev: { pt: "em desenvolvimento", en: "in development" },
    statusUnderNda: { pt: "sob NDA", en: "under NDA" },
  },

  // Theme + language toggles
  toggle: {
    themeLight: { pt: "Ativar modo claro", en: "Switch to light mode" },
    themeDark: { pt: "Ativar modo escuro", en: "Switch to dark mode" },
    langSwitchToEn: {
      pt: "Mudar para inglês",
      en: "Switch to English",
    },
    langSwitchToPt: {
      pt: "Switch to Portuguese",
      en: "Mudar para português",
    },
  },
} as const;

type Dict = typeof dict;
type Section = keyof Dict;
type Key<S extends Section> = keyof Dict[S];

/**
 * Mapa de tradução de tags descritivas em PT → EN.
 *
 * Tags como "React", "Node.js", "Delphi", "PostgreSQL" são nomes próprios
 * que NÃO se traduzem — então só listamos aqui as tags em português que
 * deveriam aparecer em inglês quando lang === 'en'. Qualquer tag fora deste
 * mapa retorna inalterada (fallback).
 */
const TAG_TRANSLATIONS: Record<string, { pt: string; en: string }> = {
  "Suporte N1": { pt: "Suporte N1", en: "L1 Support" },
  "Suporte N2": { pt: "Suporte N2", en: "L2 Support" },
  "Emissão fiscal": { pt: "Emissão fiscal", en: "Tax compliance" },
  "Implantação": { pt: "Implantação", en: "Deployment" },
  "Infraestrutura": { pt: "Infraestrutura", en: "Infrastructure" },
  "Certificados Digitais": {
    pt: "Certificados Digitais",
    en: "Digital Certificates",
  },
  Segurança: { pt: "Segurança", en: "Security" },
  Privacidade: { pt: "Privacidade", en: "Privacy" },
  Validação: { pt: "Validação", en: "Validation" },
  Texto: { pt: "Texto", en: "Text" },
  Data: { pt: "Data", en: "Date" },
};

export const translateTag = (tag: string, lang: Lang): string =>
  TAG_TRANSLATIONS[tag]?.[lang] ?? tag;

export const translateTags = (tags: string[], lang: Lang): string[] =>
  tags.map((tag) => translateTag(tag, lang));

/**
 * Acessa as strings traduzidas pra um idioma.
 *
 * Retorna um objeto onde cada section tem strings já no idioma certo:
 *   const tx = t('en');
 *   tx.hero.role // "Software Engineer"
 */
export const t = (lang: Lang) => {
  const result = {} as {
    [S in Section]: { [K in Key<S>]: string };
  };
  for (const section of Object.keys(dict) as Section[]) {
    const sectionDict = dict[section];
    const translatedSection = {} as Record<string, string>;
    for (const key of Object.keys(sectionDict)) {
      translatedSection[key] = (sectionDict as Record<string, { pt: string; en: string }>)[key][lang];
    }
    result[section] = translatedSection as never;
  }
  return result;
};

export type Translations = ReturnType<typeof t>;
