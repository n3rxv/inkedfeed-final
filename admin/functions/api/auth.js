// functions/api/auth.js
// Cloudflare Pages Function for GitHub OAuth with Decap CMS

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // Handle OAuth callback
  const code = url.searchParams.get('code');
  
  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: env.OAUTH_CLIENT_ID,
        client_secret: env.OAUTH_CLIENT_SECRET,
        code: code,
      }),
    });

    const data = await tokenResponse.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return token to Decap CMS in the expected format
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Complete</title>
        </head>
        <body>
          <script>
            (function() {
              function receiveMessage(e) {
                console.log("receiveMessage", e);
                if (e.data === "authorizing:github") {
                  window.postMessage(
                    'authorization:github:success:' + JSON.stringify({
                      token: "${data.access_token}",
                      provider: "github"
                    }),
                    "*"
                  );
                }
              }
              window.addEventListener("message", receiveMessage, false);
              
              // Trigger the auth success immediately
              window.opener.postMessage("authorizing:github", "*");
              
              setTimeout(function() {
                window.opener.postMessage(
                  'authorization:github:success:' + JSON.stringify({
                    token: "${data.access_token}",
                    provider: "github"
                  }),
                  window.opener.origin
                );
              }, 100);
            })();
          </script>
        </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}