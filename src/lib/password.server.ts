const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH_BITS = 256;

function toHex(bytes: ArrayBuffer | Uint8Array) {
  const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  return Array.from(view, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function fromHex(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

async function deriveKey(password: string, salt: Uint8Array) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    KEY_LENGTH_BITS,
  );
  return toHex(bits);
}

export async function hashPassword(password: string, saltHex?: string) {
  const salt = saltHex ? fromHex(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await deriveKey(password, salt);
  return {
    passwordHash,
    salt: toHex(salt),
  };
}

export async function verifyPassword(password: string, saltHex: string, expectedHash: string) {
  const { passwordHash } = await hashPassword(password, saltHex);
  if (passwordHash.length !== expectedHash.length) return false;

  let mismatch = 0;
  for (let i = 0; i < passwordHash.length; i += 1) {
    mismatch |= passwordHash.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }
  return mismatch === 0;
}
