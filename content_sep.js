(function () {
  'use strict';
  try {
    const targetDesc = Object.getOwnPropertyDescriptor(MouseEvent.prototype, 'target');
    if (targetDesc && targetDesc.configurable) {
      Object.defineProperty(MouseEvent.prototype, 'target', {
        get: targetDesc.get,
        set: function(value) {
          Object.defineProperty(this, 'target', {
            value: value,
            writable: true,
            enumerable: targetDesc.enumerable,
            configurable: targetDesc.configurable
          });
        },
        enumerable: targetDesc.enumerable,
        configurable: targetDesc.configurable
      });
    }
  } catch (e) {}

  function detectRole() {

    const diaryLink    = document.querySelector('a[href*="diary.eschool-ua.com"]');
    const journalLink  = document.querySelector('a[href*="journal.eschool-ua.com"]');

    if (!diaryLink && !journalLink) return null;

    const diaryAvailable   = diaryLink   && diaryLink.style.pointerEvents !== 'none';
    const journalAvailable = journalLink && journalLink.style.pointerEvents !== 'none';

    if (diaryAvailable)   return 'diary';
    if (journalAvailable) return 'journal';

    return null;
  }

  function tryRedirect() {
    const role = detectRole();
    if (!role) return false;

    chrome.runtime.sendMessage({ type: 'ROLE_DETECTED', role });


    const url = role === 'diary'

      ? 'https://diary.eschool-ua.com/'
      : 'https://journal.eschool-ua.com/';

    window.location.replace(url);
    return true;
  }


  const observer = new MutationObserver(() => {
    if (tryRedirect()) {
      observer.disconnect();
    }
  });


  if (!tryRedirect()) {
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => observer.disconnect(), 10000);

  }
})();
