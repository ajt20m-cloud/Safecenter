export async function onRequest(context) {
  const PASSWORD = context.env.CHAT_PASSWORD; // we’ll set this in Cloudflare later
  const { request } = context;

  // check if already logged in (cookie exists)
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("auth=1")) {
    return context.next();
  }

  // if it's a POST (login attempt)
  if (request.method === "POST") {
    const formData = await request.formData();
    const pass = formData.get("password");
    if (pass === PASSWORD) {
      return new Response(null, {
        status: 302,
        headers: {
          "Set-Cookie": "auth=1; Path=/; HttpOnly; Secure; SameSite=Strict",
          "Location": "/chat.html",
        },
      });
    }
  }

  // if not logged in → show login page
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chat Login</title>
      <style>
        body {background:#121212;color:#fff;display:flex;justify-content:center;align-items:center;height:100vh;font-family:sans-serif;}
        form {background:#1e1e1e;padding:30px;border-radius:10px;box-shadow:0 0 15px rgba(0,0,0,0.5);}
        input {padding:10px;width:100%;margin-bottom:15px;border-radius:6px;border:none;background:#2c2c2c;color:#fff;}
        button {padding:10px;width:100%;border:none;border-radius:6px;background:#007bff;color:#fff;font-size:1em;cursor:pointer;}
        button:hover {background:#0056b3;}
      </style>
    </head>
    <body>
      <form method="POST">
        <h2>Enter Chat Password</h2>
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </body>
    </html>
  `, { headers: { "Content-Type": "text/html" } });
}
