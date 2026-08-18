const toHex = (buffer: ArrayBuffer): string =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase();

const sha1 = async (value: string): Promise<string> => {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-1", encoded);
  return toHex(digest);
};

export type HibpResult =
  | { ok: true; count: number }
  | { ok: false; error: "network" };

/**
 * Consulta Pwned Passwords via k-anonymity.
 * Só os 5 primeiros caracteres do SHA-1 saem do navegador.
 * https://haveibeenpwned.com/API/v3#PwnedPasswords
 */
export const checkPwnedPassword = async (
  password: string
): Promise<HibpResult> => {
  const hash = await sha1(password);
  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  try {
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: {
          "Add-Padding": "true",
        },
      }
    );

    if (!response.ok) return { ok: false, error: "network" };

    const body = await response.text();
    const lines = body.split("\n");

    for (const line of lines) {
      const [hashSuffix, count] = line.trim().split(":");
      if (hashSuffix?.toUpperCase() === suffix) {
        return { ok: true, count: Number.parseInt(count, 10) || 0 };
      }
    }

    return { ok: true, count: 0 };
  } catch {
    return { ok: false, error: "network" };
  }
};
