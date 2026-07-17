export default {
  async fetch(request) {
    const response = await fetch(request);

    if ([502, 503, 504].includes(response.status)) {
      const acceptsHtml = request.headers.get('accept')?.includes('text/html');

      if (acceptsHtml) {
        const customHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Service Unavailable</title>
    <meta http-equiv="refresh" content="5">
    <style>
        body { font-family: monospace; background: #1a1a1a; color: #e0e0e0; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .box { text-align: center; }
        h1 { font-size: 4rem; margin: 0; }
        p { color: #999; }
        a { color: #6db3f2; text-decoration: none; }
        a:hover { text-decoration: underline; }
        .refresh-note { font-size: 0.8rem; color: #666; margin-top: 1.5rem; }
    </style>
</head>
<body>
    <div class="box">
        <h1>${response.status}</h1>
        <p>Service is temporarily unavailable.</p>
        <p>Check the <a href="https://tzer0m.co.uk">Dashboard</a> for status.</p>
        <p class="refresh-note">Refreshing in <span id="countdown">5</span> seconds...</p>
    </div>
    <script>
        let secondsLeft = 5;
        const countdownEl = document.getElementById('countdown');
        setInterval(() => {
            secondsLeft = Math.max(0, secondsLeft - 1);
            countdownEl.textContent = secondsLeft;
        }, 1000);
    </script>
</body>
</html>`;

        return new Response(customHtml, {
          status: response.status,
          headers: { 'content-type': 'text/html;charset=UTF-8' }
        });
      }
    }

    return response;
  }
};
