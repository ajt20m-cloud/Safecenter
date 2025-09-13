export async function onRequest(context) {
  const PASSWORD = context.env.CHAT_PASSWORD;
  const { request } = context;

  // Check cookie (already logged in)
  const cookie = request.headers.get("Cookie") || "";
  if (cookie.includes("auth=1")) {
    // Serve the real chat page
    return context.next();
  }

  // Handle login form submission
  if (request.method === "POST") {
    const formData = await request.formData();
    const pass = formData.get("password");

    if (pass === PASSWORD) {
      // Set cookie + redirect to chat-page.html
      return new Response(null, {
        status: 302,
        headers: {
          "Set-Cookie": "auth=1; Path=/; HttpOnly; Secure; SameSite=Strict",
          "Location": "/chat-page.html",
        },
      });
    }
  }

  // Show password form
  return new Response(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Chat Login</title>
      <style>
        body {
          background: #121212;
          color: #fff;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
        form {
          background: #1e1e1e;
          padding: 30px;
          border-radius: 12px;
          box-shadow: 0 0 15px rgba(0,0,0,0.5);
          text-align: center;
          width: 90%;
          max-width: 400px;
        }
        input {
          width: 100%;
          padding: 12px;
          margin-bottom: 15px;
          border-radius: 8px;
          border: none;
          background: #2c2c2c;
          color: #fff;
          font-size: 16px;
        }
        button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: #007bff;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
        button:hover { background: #0056b3; }
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
