import { headers } from "next/headers";

function firstIpFromForwarded(forwarded: string): string | null {
  const candidate = forwarded.split(",")[0]?.trim();
  return candidate || null;
}

function normalizeIp(ip: string): string {
  return ip.trim().toLowerCase();
}

export function getClientIpFromHeaders(headerMap: Headers): string | null {
  const forwarded = headerMap.get("x-forwarded-for");
  if (forwarded) {
    const ip = firstIpFromForwarded(forwarded);
    if (ip) return normalizeIp(ip);
  }

  const realIp = headerMap.get("x-real-ip")?.trim();
  if (realIp) return normalizeIp(realIp);

  const cfIp = headerMap.get("cf-connecting-ip")?.trim();
  if (cfIp) return normalizeIp(cfIp);

  return null;
}

export function getClientIpFromRequest(req: Request): string | null {
  return getClientIpFromHeaders(req.headers);
}

export async function getRequestClientIp(): Promise<string | null> {
  const headerStore = await headers();
  return getClientIpFromHeaders(headerStore);
}
