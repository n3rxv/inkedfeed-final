export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle the auth callback
  if (url.pathname === '/api/auth') {
    const code = url.searchParams.get('code');
    
    if (!code) {
      return new Response('No code provided', { status: 400 });
    }

    try {
      // Exchange code for token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code: code,
        }),
      });

      const data = await tokenResponse.json();

      if (data.error) {
        return new Response(`Error: ${data.error_description}`, { status: 400 });
      }

      // Return the token in the format Decap CMS expects
      const content = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Authorization Complete</title>
          </head>
          <body>
            <script>
              (function() {
                function recieveMessage(e) {
                  console.log("recieveMessage %o", e);
                  if (window.opener) {
                    window.opener.postMessage(
                      'authorization:github:success:${JSON.stringify({
                        token: data.access_token,
                        provider: 'github'
                      })}',
                      e.origin
                    );
                    window.removeEventListener("message", recieveMessage, false);
                  }
                }
                window.addEventListener("message", recieveMessage, false);
                console.log("Posting message to opener");
                window.opener.postMessage("authorizing:github", "*");
              })();
            </script>
          </body>
        </html>
      `;

      return new Response(content, {
        headers: { 'Content-Type': 'text/html' },
      });
    } catch (error) {
      return new Response(`Error: ${error.message}`, { status: 500 });
    }
  }

  return new Response('Not found', { status: 404 });
}