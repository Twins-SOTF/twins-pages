// TWINS Center reverse proxy: <pages-domain> -> Center
// Upstream origin is read from env.CENTER_ORIGIN (configure in Cloudflare Pages project settings),
// so the internal endpoint is not leaked in this public repo.
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = env.CENTER_ORIGIN;

  if (!origin) {
    return new Response("CENTER_ORIGIN not configured", { status: 500 });
  }

  // Root redirects to /docs (Swagger UI) instead of 404
  if (url.pathname === "/") {
    return new Response(null, { status: 302, headers: { Location: "/docs" } });
  }

  const target = origin.replace(/\/$/, "") + url.pathname + url.search;
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.set("x-forwarded-proto", "https");
  headers.set("x-forwarded-host", url.host);

  const init = {
    method: request.method,
    headers: headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }

  const resp = await fetch(target, init);
  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: resp.headers,
  });
}
