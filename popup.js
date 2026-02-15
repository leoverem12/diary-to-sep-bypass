document.getElementById('openBtn').addEventListener('click', () => {
  chrome.tabs.create({ url: 'https://diary.eschool-ua.com/' });
});
