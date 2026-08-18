export const toSlug = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

export const toCamelCase = (value: string): string => {
  const parts = toSlug(value).split("-").filter(Boolean);
  return parts
    .map((part, index) =>
      index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
    )
    .join("");
};

export const toPascalCase = (value: string): string => {
  const camel = toCamelCase(value);
  return camel ? camel.charAt(0).toUpperCase() + camel.slice(1) : "";
};

export const toSnakeCase = (value: string): string =>
  toSlug(value).replace(/-/g, "_");

export const toKebabCase = (value: string): string => toSlug(value);

export const toConstantCase = (value: string): string =>
  toSnakeCase(value).toUpperCase();

export const encodeBase64 = (value: string): string => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

export const decodeBase64 = (value: string): string => {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const hashDigest = async (
  value: string,
  algorithm: "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512"
): Promise<string> => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest(algorithm, encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const generateUuid = (): string => crypto.randomUUID();

export const decodeJwt = (
  token: string
): { header: unknown; payload: unknown } | null => {
  const parts = token.trim().split(".");
  if (parts.length < 2) return null;

  const decodePart = (part: string): unknown => {
    const padded = part.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((part.length + 3) % 4);
    return JSON.parse(decodeBase64(padded));
  };

  try {
    return {
      header: decodePart(parts[0]),
      payload: decodePart(parts[1]),
    };
  } catch {
    return null;
  }
};

export const countText = (value: string) => {
  const chars = value.length;
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const bytes = new TextEncoder().encode(value).length;
  const lines = value ? value.split(/\n/).length : 0;
  return { chars, words, bytes, lines };
};
