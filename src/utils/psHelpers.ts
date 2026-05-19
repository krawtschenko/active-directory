import { SERVER_SHARE } from "./constants";

export function sanitize(s: string): string {
  return s.replace(/\\/g, "_");
}

export function buildGroupName(
  name: string,
  prefix?: string,
  suffix?: string,
  kadry = false,
): string {
  const base = kadry ? "GS_Firmy_Kadry_i_Place" : "GS_Firmy";
  return [base, prefix, name, suffix]
    .filter((s): s is string => Boolean(s))
    .map(sanitize)
    .join("_");
}

export function buildIcaclsCommand(
  path: string,
  groupName: string,
  permissions: string,
): string {
  return `icacls "${SERVER_SHARE}\\${path}" /grant "${groupName}:${permissions}"`;
}

export function buildPaths(path: string): string[] {
  const parts = path.split("\\").filter(Boolean);
  const result: string[] = [];
  for (let i = parts.length; i > 0; i--) {
    result.push(parts.slice(0, i).join("\\"));
  }
  return result;
}
