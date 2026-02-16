chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get('userRole', (data) => {

    if (!data.userRole) {
      chrome.tabs.create({ url: 'https://sep.eschool-ua.com/' });
    }

  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

  if (message.type === 'ROLE_DETECTED') {
    chrome.storage.local.set({ userRole: message.role }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
