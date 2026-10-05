// TWINS Center 反向代理：https://<project>.pages.dev -> http://103.217.191.79:11008
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const origin = "http://103.217.191.79:11008";

  // 根路径 302 到 /docs，落地 Swagger 界面而不是 404
  if (url.pathname === "/") {
    return new Response(null, { status: 302, headers: { Location: "/docs" } });
  }

  const target = origin + url.pathname + url.search;
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
