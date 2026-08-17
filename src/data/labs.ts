/**
 * Labs — scripts, docs e utilitários públicos.
 * Fonte única bilíngue; cada item vira /labs/:slug.
 */

export type LabCategory = "docker" | "cli" | "docs";

export interface LabStep {
  title: { pt: string; en: string };
  body?: { pt: string; en: string };
  code?: string;
  codeLang?: string;
}

export interface LabTool {
  id: string;
  name: string;
  description: { pt: string; en: string };
}

export interface Lab {
  slug: string;
  category: LabCategory;
  title: { pt: string; en: string };
  summary: { pt: string; en: string };
  tags: string[];
  updatedAt: string;
  installCommand?: string;
  prerequisites: { pt: string; en: string }[];
  tools?: LabTool[];
  steps: LabStep[];
  notes?: { pt: string; en: string }[];
  sourcePaths?: string[];
}

export const labs: Lab[] = [
  {
    slug: "docker-tools",
    category: "docker",
    title: {
      pt: "Supabase self-host no Docker",
      en: "Self-host Supabase on Docker",
    },
    summary: {
      pt: "Menu interativo no PowerShell para instalar e gerenciar ferramentas Docker (Supabase self-host, Portainer, Watchtower) com um único comando.",
      en: "Interactive PowerShell menu to install and manage Docker tools (Supabase self-host, Portainer, Watchtower) with a single command.",
    },
    tags: ["Docker", "PowerShell", "Windows", "Supabase"],
    updatedAt: "2026-06-19",
    installCommand: "irm https://rafaelnassar.github.io/docker | iex",
    prerequisites: [
      {
        pt: "Windows 10/11 com PowerShell 5.1+",
        en: "Windows 10/11 with PowerShell 5.1+",
      },
      {
        pt: "Docker Desktop instalado e em execução",
        en: "Docker Desktop installed and running",
      },
      {
        pt: "Conexão com a internet (baixa o catálogo e os instaladores)",
        en: "Internet connection (downloads the catalog and installers)",
      },
    ],
    tools: [
      {
        id: "supabase",
        name: "Supabase Self-Host",
        description: {
          pt: "Cria e gerencia múltiplas instâncias Supabase no Docker Desktop.",
          en: "Create and manage multiple Supabase instances with Docker Desktop.",
        },
      },
      {
        id: "portainer",
        name: "Portainer CE",
        description: {
          pt: "Interface web para gerenciar containers Docker.",
          en: "Web UI to manage Docker containers.",
        },
      },
      {
        id: "watchtower",
        name: "Watchtower",
        description: {
          pt: "Atualiza containers Docker automaticamente.",
          en: "Automatic Docker container updater.",
        },
      },
    ],
    steps: [
      {
        title: {
          pt: "Abrir o PowerShell",
          en: "Open PowerShell",
        },
        body: {
          pt: "Abra um terminal PowerShell (não precisa ser admin na maioria dos casos). Confirme que o Docker Desktop está rodando.",
          en: "Open a PowerShell terminal (admin usually not required). Make sure Docker Desktop is running.",
        },
      },
      {
        title: {
          pt: "Rodar o instalador",
          en: "Run the installer",
        },
        body: {
          pt: "O comando baixa o script público e abre o menu interativo do hub.",
          en: "This downloads the public script and opens the interactive hub menu.",
        },
        code: "irm https://rafaelnassar.github.io/docker | iex",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Escolher a ferramenta",
          en: "Pick a tool",
        },
        body: {
          pt: "No menu, selecione Supabase, Portainer ou Watchtower. O hub baixa o instalador correspondente e executa o fluxo guiado.",
          en: "In the menu, select Supabase, Portainer, or Watchtower. The hub downloads the matching installer and runs the guided flow.",
        },
      },
      {
        title: {
          pt: "Cache local",
          en: "Local cache",
        },
        body: {
          pt: "Scripts e cache ficam em ~/RafaelDockerTools. Você pode rodar o mesmo comando de novo para atualizar o catálogo.",
          en: "Scripts and cache live under ~/RafaelDockerTools. Run the same command again to refresh the catalog.",
        },
        code: "Join-Path $HOME 'RafaelDockerTools'",
        codeLang: "powershell",
      },
    ],
    notes: [
      {
        pt: "O endpoint /docker é um script PowerShell servido pelo GitHub Pages — não é uma rota React.",
        en: "The /docker endpoint is a PowerShell script served by GitHub Pages — not a React route.",
      },
      {
        pt: "Catálogo dinâmico: tools/docker-tools.json. Novas ferramentas aparecem no menu sem mudar o script bootstrap.",
        en: "Dynamic catalog: tools/docker-tools.json. New tools show up in the menu without changing the bootstrap script.",
      },
    ],
    sourcePaths: [
      "/docker",
      "/tools/docker-tools.json",
      "/tools/installers/supabase.ps1",
      "/tools/installers/portainer.ps1",
      "/tools/installers/watchtower.ps1",
    ],
  },
  {
    slug: "wsl2-windows",
    category: "cli",
    title: {
      pt: "WSL 2 do zero no Windows",
      en: "WSL 2 from scratch on Windows",
    },
    summary: {
      pt: "Instala e configura o WSL 2 no Windows 10/11 só com comandos: engine, reboot, Ubuntu, limites de RAM/CPU e systemd.",
      en: "Install and configure WSL 2 on Windows 10/11 with commands only: engine, reboot, Ubuntu, RAM/CPU limits, and systemd.",
    },
    tags: ["WSL 2", "Windows", "PowerShell", "Ubuntu", "Linux"],
    updatedAt: "2026-08-17",
    installCommand: "irm https://rafaelnassar.github.io/wsl | iex",
    prerequisites: [
      {
        pt: "Windows 11, ou Windows 10 versão 2004+ (build 19041+)",
        en: "Windows 11, or Windows 10 version 2004+ (build 19041+)",
      },
      {
        pt: "PowerShell aberto como Administrador",
        en: "PowerShell opened as Administrator",
      },
      {
        pt: "Virtualização habilitada na BIOS/UEFI (Intel VT-x ou AMD SVM)",
        en: "Virtualization enabled in BIOS/UEFI (Intel VT-x or AMD SVM)",
      },
      {
        pt: "Conexão com a internet (baixa o kernel do WSL e a distro)",
        en: "Internet connection (downloads the WSL kernel and the distro)",
      },
    ],
    tools: [
      {
        id: "engine",
        name: "WSL 2 engine",
        description: {
          pt: "Ativa os recursos do Windows, instala o kernel e define a versão 2 como padrão.",
          en: "Enables Windows features, installs the kernel, and sets version 2 as default.",
        },
      },
      {
        id: "ubuntu",
        name: "Ubuntu",
        description: {
          pt: "Distro padrão. O menu também deixa escolher Debian, Kali e outras listadas em wsl -l -o.",
          en: "Default distro. The menu also lets you pick Debian, Kali, and others from wsl -l -o.",
        },
      },
      {
        id: "wslconfig",
        name: ".wslconfig",
        description: {
          pt: "Limita RAM, CPU e swap da VM do WSL 2 em %UserProfile%\\.wslconfig.",
          en: "Caps RAM, CPU, and swap for the WSL 2 VM in %UserProfile%\\.wslconfig.",
        },
      },
      {
        id: "systemd",
        name: "systemd",
        description: {
          pt: "Grava [boot] systemd=true em /etc/wsl.conf para serviços Linux iniciarem como numa máquina real.",
          en: "Writes [boot] systemd=true to /etc/wsl.conf so Linux services start like on a real machine.",
        },
      },
    ],
    steps: [
      {
        title: {
          pt: "Abrir o PowerShell como Administrador",
          en: "Open PowerShell as Administrator",
        },
        body: {
          pt: "Win + X → Terminal (Admin) ou Windows PowerShell (Admin). Sem elevação, o install dos recursos do Windows falha.",
          en: "Win + X → Terminal (Admin) or Windows PowerShell (Admin). Without elevation, enabling Windows features fails.",
        },
      },
      {
        title: {
          pt: "Rodar o assistente (recomendado)",
          en: "Run the wizard (recommended)",
        },
        body: {
          pt: "O script é resumível: instala o engine, pede reboot, e na segunda execução segue para Ubuntu, .wslconfig e systemd.",
          en: "The script is resume-able: it installs the engine, asks for a reboot, then on the second run continues with Ubuntu, .wslconfig, and systemd.",
        },
        code: "irm https://rafaelnassar.github.io/wsl | iex",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Ou instalar na mão — checar o sistema",
          en: "Or install by hand — check the system",
        },
        body: {
          pt: "Confirme o build (precisa ser ≥ 19041) e se a virtualização está ligada.",
          en: "Confirm the build (must be ≥ 19041) and that virtualization is on.",
        },
        code: "(Get-ItemProperty 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion').CurrentBuild\nGet-CimInstance Win32_Processor | Select-Object -First 1 Name, VirtualizationFirmwareEnabled",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Instalar o engine (sem distro) e reiniciar",
          en: "Install the engine (no distro) and reboot",
        },
        body: {
          pt: "No Windows 10/11 atuais isso ativa WSL, Virtual Machine Platform, baixa o kernel e já deixa a versão 2 como padrão. Depois reinicie.",
          en: "On current Windows 10/11 this enables WSL, Virtual Machine Platform, downloads the kernel, and already sets version 2 as default. Then reboot.",
        },
        code: "wsl --install --no-distribution\nshutdown /r /t 0",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Depois do reboot: atualizar e travar na versão 2",
          en: "After reboot: update and lock version 2",
        },
        body: {
          pt: "Abra o PowerShell como Admin de novo. Se o wsl --install só mostrar o help, o engine já está no lugar — siga daqui.",
          en: "Open PowerShell as Admin again. If wsl --install only prints help, the engine is already there — continue from here.",
        },
        code: "wsl --update\nwsl --set-default-version 2\nwsl --status",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Instalar o Ubuntu",
          en: "Install Ubuntu",
        },
        body: {
          pt: "Liste as distros e instale. --no-launch evita abrir o prompt no meio do script; na primeira abertura você cria usuário e senha Linux.",
          en: "List distros and install. --no-launch skips opening the prompt mid-script; the first launch asks you to create a Linux username and password.",
        },
        code: "wsl --list --online\nwsl --install -d Ubuntu --no-launch\nwsl --set-version Ubuntu 2\nwsl -d Ubuntu",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Limitar RAM e CPU (opcional)",
          en: "Cap RAM and CPU (optional)",
        },
        body: {
          pt: "Crie %UserProfile%\\.wslconfig. Ajuste os números à sua máquina. wsl --shutdown aplica na próxima abertura.",
          en: "Create %UserProfile%\\.wslconfig. Tune the numbers for your machine. wsl --shutdown applies them on the next launch.",
        },
        code: [
          "Set-Content -Path $env:USERPROFILE\\.wslconfig -Encoding ASCII -Value @'",
          "[wsl2]",
          "memory=8GB",
          "processors=4",
          "swap=2GB",
          "localhostForwarding=true",
          "'@",
          "wsl --shutdown",
        ].join("\n"),
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Ativar systemd (opcional)",
          en: "Enable systemd (optional)",
        },
        body: {
          pt: "Rode como root na distro. Depois confirme com systemctl dentro do Ubuntu.",
          en: "Run as root inside the distro. Then confirm with systemctl from Ubuntu.",
        },
        code: "wsl -d Ubuntu -u root -- bash -lc \"printf '[boot]\\nsystemd=true\\n' > /etc/wsl.conf\"\nwsl --shutdown\nwsl -d Ubuntu -- systemctl list-unit-files --type=service",
        codeLang: "powershell",
      },
      {
        title: {
          pt: "Conferir",
          en: "Verify",
        },
        body: {
          pt: "VERSION deve ser 2. Se uma distro antiga ficou em 1, converta com wsl --set-version <nome> 2.",
          en: "VERSION should be 2. If an old distro stayed on 1, convert it with wsl --set-version <name> 2.",
        },
        code: "wsl --status\nwsl --list --verbose",
        codeLang: "powershell",
      },
    ],
    notes: [
      {
        pt: "O endpoint /wsl é um script PowerShell servido pelo GitHub Pages — não é uma rota React. Rode no PowerShell do Windows, não dentro do Linux.",
        en: "The /wsl endpoint is a PowerShell script served by GitHub Pages — not a React route. Run it in Windows PowerShell, not inside Linux.",
      },
      {
        pt: "Se o install travar em 0.0%, use: wsl --install --web-download -d Ubuntu",
        en: "If install hangs at 0.0%, use: wsl --install --web-download -d Ubuntu",
      },
      {
        pt: "Windows 10 antigo (build < 19041) não tem wsl --install. Atualize o Windows ou siga o install manual da Microsoft (DISM + pacote do kernel).",
        en: "Older Windows 10 (build < 19041) has no wsl --install. Update Windows or follow Microsoft's manual install (DISM + kernel package).",
      },
      {
        pt: "Virtualização desligada na BIOS é o erro mais comum do WSL 2 ('The virtual machine could not be started'). Ligue VT-x/SVM e tente de novo.",
        en: "BIOS virtualization off is the most common WSL 2 failure ('The virtual machine could not be started'). Turn on VT-x/SVM and retry.",
      },
    ],
    sourcePaths: ["/wsl"],
  },
];

export const getLabBySlug = (slug: string): Lab | undefined =>
  labs.find((lab) => lab.slug === slug);

export const categoryLabel: Record<
  LabCategory,
  { pt: string; en: string }
> = {
  docker: { pt: "Docker", en: "Docker" },
  cli: { pt: "CLI", en: "CLI" },
  docs: { pt: "Docs", en: "Docs" },
};
