/**
 * Vercel Serverless Function to proxy Clerk Frontend API requests.
 *
 * This is required when you enable "Frontend API Proxy" in Clerk and set:
 *   VITE_CLERK_PROXY_URL=/__clerk   (or https://<domain>/__clerk)
 *
 * Clerk expects these headers when proxying:
 * - Clerk-Proxy-Url
 * - Clerk-Secret-Key
 * - X-Forwarded-For (optional but recommended)
 */

const CLERK_FAPI_BASE = "https://frontend-api.clerk.dev";

function getProxyUrl(req: any) {
  const xfProto = (req.headers["x-forwarded-proto"] as string | undefined) || "https";
  const host = (req.headers["x-forwarded-host"] as string | undefined) || (req.headers.host as string | undefined);
  const base = host ? `${xfProto}://${host}` : "";
  // Prefer explicit env var if set, otherwise compute from incoming request host.
  return (process.env.CLERK_PROXY_URL as string | undefined) || `${base}/__clerk`;
}

async function readBody(req: any): Promise<Buffer | undefined> {
  const method = (req.method || "GET").toUpperCase();
  if (method === "GET" || method === "HEAD") return undefined;

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return chunks.length ? Buffer.concat(chunks) : undefined;
}

export default async function handler(req: any, res: any) {
  const secretKey = process.env.CLERK_SECRET_KEY as string | undefined;
  if (!secretKey) {
    res.statusCode = 500;
    res.setHeader("content-type", "application/json");
    res.end(JSON.stringify({ error: "Missing CLERK_SECRET_KEY on Vercel (server-side env var)." }));
    return;
  }

  const proxyUrl = getProxyUrl(req);
  const incoming = new URL(req.url, `https://${req.headers.host}`);
  const pathname = incoming.pathname.replace(/^\/api\/__clerk/, ""); // internal Vercel function path
  const targetUrl = `${CLERK_FAPI_BASE}${pathname}${incoming.search}`;

  const body = await readBody(req);

  // Clone request headers, drop hop-by-hop headers
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value === undefined) continue;
    const lower = key.toLowerCase();
    if (["host", "connection", "content-length"].includes(lower)) continue;
    if (Array.isArray(value)) {
      headers.set(key, value.join(","));
    } else {
      headers.set(key, String(value));
    }
  }

  headers.set("Clerk-Proxy-Url", proxyUrl);
  headers.set("Clerk-Secret-Key", secretKey);
  headers.set("X-Forwarded-For", (req.headers["x-forwarded-for"] as string | undefined) || "");

  const upstream = await fetch(targetUrl, {
    method: req.method,
    headers,
    body,
    redirect: "manual",
  });

  // Pass through status + headers
  res.statusCode = upstream.status;

  upstream.headers.forEach((value, key) => {
    // Some headers should be set by the platform/runtime.
    if (key.toLowerCase() === "transfer-encoding") return;
    if (key.toLowerCase() === "content-encoding") return;
    res.setHeader(key, value);
  });

  // Handle multiple set-cookie headers (Node fetch provides a helper)
  const setCookies = (upstream.headers as any).getSetCookie?.() as string[] | undefined;
  if (setCookies?.length) {
    res.setHeader("set-cookie", setCookies);
  }

  const buf = Buffer.from(await upstream.arrayBuffer());
  res.end(buf);
}

