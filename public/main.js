(() => {
  const btn = document.querySelector('input[type="submit"]');
  const form = document.querySelector('form');
  const urlInput = document.getElementById('url_input');
  const responseBox = document.getElementById('response-box');

  function render(data) {
    if (data.error) {
      return `<p class="response-para">Error: <span class="response-text">${data.error}</span></p>`;
    }
    const link = window.location.href + 'api/shorturl/' + data.short_url;

    const original =
      data.original_url.length > 30
        ? data.original_url.slice(0, 30) + '...'
        : data.original_url;

    console.log(original);

    return `<p class="response-para" id="original-url"><span class="response-text">${original}</span></p>
    <p class="response-para" id="short-url"><span class="response-text"><a id='shorturl-link' href="${link}">${data.short_url}</a></span> <button class='btn' id="copy">Copy</button></p>`;
  }

  function wireButtons() {
    const copyBtn = document.getElementById('copy');
    const shortUrlLink = document.getElementById('shorturl-link');

    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(shortUrlLink.href).then(
        () => {
          console.log('success');
        },
        () => {
          console.log('failure');
        }
      );
    });
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

        if (!data.error) {
          wireButtons();
        }
      })
      .catch((err) => {
        const data = { error: 'Unable to reach the API server.' };
        responseBox.innerHTML = render(data);
      });
    form.reset();
  });
})();
