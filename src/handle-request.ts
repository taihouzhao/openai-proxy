const pickHeaders = (headers: Headers, keys: (string | RegExp)[]): Headers => {
  const picked = new Headers();
  for (const key of headers.keys()) {
    if (keys.some((k) => (typeof k === "string" ? k === key : k.test(key)))) {
      const value = headers.get(key);
      if (typeof value === "string") {
        picked.set(key, value);
      }
    }
  }
  return picked;
};

const CORS_HEADERS: Record<string, string> = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "Content-Type, Authorization",
};

export default async function handleRequest(req: Request & { nextUrl?: URL }) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: CORS_HEADERS,
    });
  }

  const targetUrl = req.headers.get("x-target-url") || "https://api.groq.com/openai";
  const { pathname, search } = req.nextUrl ? req.nextUrl : new URL(req.url);

  if (pathname === "/") {
    return Response.redirect("https://english.news.cn/", 302);
  }

  const url = targetUrl + pathname;
  const headers = pickHeaders(req.headers, ["content-type", "authorization"]);

  console.log(`Forwarding request to ${url}`);

  const res = await fetch(url, {
    body: req.body,
    method: req.method,
    headers,
  });


  const resHeaders = {
    ...CORS_HEADERS,
    ...Object.fromEntries(
      pickHeaders(res.headers, ["content-type", /^x-ratelimit-/, /^openai-/])
    ),
  };


  return new Response(res.body, {
    headers: resHeaders,
    status: res.status
  });
}

