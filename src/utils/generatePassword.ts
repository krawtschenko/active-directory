import type { PasswordOptions } from "../types";

export function generatePassword(length: number, options: PasswordOptions): string {
  const ambiguous = "Il";
  const filterAmbiguous = (s: string) =>
    options.noAmbiguous
      ? s
          .split("")
          .filter((c) => !ambiguous.includes(c))
          .join("")
      : s;

  const lowerSet = filterAmbiguous("abcdefghijklmnopqrstuvwxyz");
  const upperSet = options.uppercase
    ? filterAmbiguous("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    : "";
  const digitsSet = options.numbers ? "0123456789" : "";
  const specialSet = options.symbols ? "!@#$%^&*()-_=+[]{}|;:,.<>?" : "";

  const charset = lowerSet + upperSet + digitsSet + specialSet;
  if (!charset) return "";

  const safeLength = Math.max(8, Math.min(128, length));

  try {
    const requiredSets = [lowerSet, upperSet, digitsSet, specialSet].filter(Boolean);
    const requiredBytes = new Uint32Array(requiredSets.length);
    crypto.getRandomValues(requiredBytes);
    const required = requiredSets.map((set, i) => set[requiredBytes[i] % set.length]);

    const bytes = new Uint32Array(safeLength);
    crypto.getRandomValues(bytes);
    const password = Array.from(bytes, (x) => charset[x % charset.length]);

    required.forEach((char, i) => {
      password[i] = char;
    });

    const shuffleBytes = new Uint32Array(safeLength);
    crypto.getRandomValues(shuffleBytes);
    for (let i = safeLength - 1; i > 0; i--) {
      const j = shuffleBytes[i] % (i + 1);
      [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join("");
  } catch {
    return "";
  }
}
