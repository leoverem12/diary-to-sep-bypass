(function() {
  'use strict';

  document.cookie = 'ignoreSep=true; path=/; domain=.eschool-ua.com; max-age=31536000';
  document.cookie = 'ignoreSep=true; path=/; domain=diary.eschool-ua.com; max-age=31536000';
  document.cookie = 'ignoreSep=true; path=/; max-age=31536000';

  try {
    localStorage.setItem('ignoreSep', 'true');
    sessionStorage.setItem('ignoreSep', 'true');
  } catch(e) {}

  const origFetch = window.fetch;
  window.fetch = async function(input, init) {
    const response = await origFetch.apply(this, arguments);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return response;
    try {
      const data = await response.clone().json();
      if (data && data.url_redirect) {
        delete data.url_redirect;
        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
    } catch(e) {}
    return response;
  };

  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(method, url, ...args) {
    this._url = url;
    return origOpen.apply(this, [method, url, ...args]);
  };

  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function(...args) {
    this.addEventListener('readystatechange', function() {
      if (this.readyState === 4 && this.status === 200) {
        try {
          const data = JSON.parse(this.responseText);
          if (data && data.url_redirect) {
            delete data.url_redirect;
            Object.defineProperty(this, 'responseText', { get: () => JSON.stringify(data), configurable: true });
            Object.defineProperty(this, 'response', { get: () => JSON.stringify(data), configurable: true });
          }
        } catch(e) {}
      }
    });
    return origSend.apply(this, args);
  };

  const isSep = (url) => url && String(url).includes('sep.eschool-ua.com');

  try {
    const d = Object.getOwnPropertyDescriptor(window.Location.prototype, 'href');
    if (d && d.set) {
      Object.defineProperty(window.Location.prototype, 'href', {
        set(url) { if (!isSep(url)) d.set.call(this, url); },
        get: d.get,
        configurable: true
      });
    }
  } catch(e) {}

  const origAssign = window.location.assign.bind(window.location);
  window.location.assign = (url) => { if (!isSep(url)) origAssign(url); };

  const origReplace = window.location.replace.bind(window.location);
  window.location.replace = (url) => { if (!isSep(url)) origReplace(url); };
})();
