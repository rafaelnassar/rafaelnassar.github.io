export interface BrowserInfo {
  name: string;
  version: string;
  userAgent: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  online: boolean;
}

export interface OsInfo {
  name: string;
  version: string;
  architecture: string;
  cores: number;
  memoryGb: string;
  memoryUnavailable?: "insecure" | "unsupported";
  touchPoints: number;
}

interface UADataHighEntropy {
  architecture?: string;
  bitness?: string;
  platform?: string;
  platformVersion?: string;
}

interface NavigatorUAData {
  getHighEntropyValues?: (hints: string[]) => Promise<UADataHighEntropy>;
}

const matchFirst = (ua: string, patterns: Array<[RegExp, string]>): { name: string; version: string } => {
  for (const [regex, name] of patterns) {
    const match = ua.match(regex);
    if (match) return { name, version: match[1] ?? "" };
  }
  return { name: "Unknown", version: "" };
};

export const parseBrowser = (): BrowserInfo => {
  const ua = navigator.userAgent;
  const { name, version } = matchFirst(ua, [
    [/Edg\/([\d.]+)/, "Microsoft Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/Chrome\/([\d.]+)/, "Google Chrome"],
    [/Firefox\/([\d.]+)/, "Firefox"],
    [/Version\/([\d.]+).*Safari/, "Safari"],
  ]);

  return {
    name,
    version,
    userAgent: ua,
    language: navigator.language,
    platform: navigator.platform,
    cookiesEnabled: navigator.cookieEnabled,
    online: navigator.onLine,
  };
};

const architectureFromUa = (ua: string): string => {
  if (/aarch64|arm64|Windows ARM/i.test(ua)) return "ARM 64-bit";
  if (/Win64|x64|amd64|x86_64|WOW64/i.test(ua)) return "64-bit";
  if (/Win32|i686|i386/i.test(ua)) return "32-bit";
  return "—";
};

const windowsVersionFromPlatformVersion = (platformVersion: string): string => {
  const major = Number.parseInt(platformVersion.split(".")[0] ?? "", 10);
  if (!Number.isFinite(major)) return "";
  if (major >= 13) return "11";
  if (major >= 10) return "10";
  if (major === 3) return "8.1";
  if (major === 2) return "8";
  if (major === 1) return "7";
  return "";
};

const readDeviceMemory = (): Pick<OsInfo, "memoryGb" | "memoryUnavailable"> => {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (typeof memory === "number" && memory > 0) {
    return { memoryGb: `${memory} GB` };
  }
  if (typeof window !== "undefined" && !window.isSecureContext) {
    return { memoryGb: "", memoryUnavailable: "insecure" };
  }
  return { memoryGb: "", memoryUnavailable: "unsupported" };
};

export const parseOs = (): OsInfo => {
  const ua = navigator.userAgent;
  let name = "Unknown";
  let version = "";

  if (/Windows NT 10/.test(ua)) {
    name = "Windows";
    version = "10";
  } else if (/Windows NT 6\.3/.test(ua)) {
    name = "Windows";
    version = "8.1";
  } else if (/Windows NT 6\.1/.test(ua)) {
    name = "Windows";
    version = "7";
  } else if (/Mac OS X ([\d_]+)/.test(ua)) {
    name = "macOS";
    version = ua.match(/Mac OS X ([\d_]+)/)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Android ([\d.]+)/.test(ua)) {
    name = "Android";
    version = ua.match(/Android ([\d.]+)/)?.[1] ?? "";
  } else if (/iPhone OS ([\d_]+)/.test(ua)) {
    name = "iOS";
    version = ua.match(/iPhone OS ([\d_]+)/)?.[1]?.replace(/_/g, ".") ?? "";
  } else if (/Linux/.test(ua)) {
    name = "Linux";
  }

  const memory = readDeviceMemory();

  return {
    name,
    version,
    architecture: architectureFromUa(ua),
    cores: navigator.hardwareConcurrency ?? 0,
    memoryGb: memory.memoryGb,
    memoryUnavailable: memory.memoryUnavailable,
    touchPoints: navigator.maxTouchPoints ?? 0,
  };
};

export const enrichOs = async (base: OsInfo): Promise<OsInfo> => {
  const uaData = (navigator as Navigator & { userAgentData?: NavigatorUAData }).userAgentData;
  if (!uaData?.getHighEntropyValues) return base;

  try {
    const hints = await uaData.getHighEntropyValues([
      "architecture",
      "bitness",
      "platform",
      "platformVersion",
    ]);

    let version = base.version;
    if (hints.platform === "Windows" && hints.platformVersion) {
      version = windowsVersionFromPlatformVersion(hints.platformVersion) || base.version;
    }

    let architecture = base.architecture;
    if (hints.bitness === "64") {
      architecture = hints.architecture === "arm" ? "ARM 64-bit" : "64-bit";
    } else if (hints.bitness === "32") {
      architecture = hints.architecture === "arm" ? "ARM 32-bit" : "32-bit";
    }

    return { ...base, version, architecture };
  } catch {
    return base;
  }
};

export interface IpInfo {
  ip: string;
  error?: string;
}

export const fetchPublicIp = async (): Promise<IpInfo> => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    if (!response.ok) throw new Error("failed");
    const data = (await response.json()) as { ip?: string };
    return { ip: data.ip ?? "—" };
  } catch {
    return { ip: "—", error: "unavailable" };
  }
};
