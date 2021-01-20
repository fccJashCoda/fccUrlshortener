(() => {
  const btn = document.querySelector('input[type="submit"]');
  const urlInput = document.getElementById('url_input');
  const responseBox = document.getElementById('response-box');

  function render(data) {
    if (data.error) {
      return `<p class="response-para">Error: <span class="response-text">${data.error}</span></p>`;
    }
    const link = window.location.href + 'api/shorturl/' + data.short_url;

    return `<p class="response-para">Original: <span class="response-text">${data.original_url}</span></p>
    <p class="response-para">Short: <span class="response-text"><a id='shorturl-link' href="${link}">${data.short_url}</a></span> <button id="copy">Copy</button></p>`;
  }

  btn.addEventListener('click', (e) => {
    e.preventDefault();

    const data = { url: urlInput.value };
    const url = window.location.href + 'api/shorturl/new';

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        responseBox.innerHTML = render(data);
      })
      .catch((err) => {
        console.log(err);
        const data = { error: 'Unable to reach the API server.' };
        responseBox.innerHTML = render(data);
      });
  });
})();
