const iconEl   = document.getElementById('icon');
const statusEl = document.getElementById('statusEl');
const roleEl   = document.getElementById('roleEl');
const openBtn  = document.getElementById('openBtn');
const resetBtn = document.getElementById('resetBtn');

const ROLE_CONFIG = {
  diary: {
    icon: '📓',
    label: 'Роль: Учень (Щоденник)',
    btnText: 'Відкрити Щоденник',
    url: 'https://diary.eschool-ua.com/'
  },
  journal: {
    icon: '📒',
    label: 'Роль: Вчитель (Е-журнал)',
    btnText: 'Відкрити Е-журнал',
    url: 'https://journal.eschool-ua.com/'
  }
};

chrome.storage.local.get('userRole', (data) => {
  const role = data.userRole;

  if (role && ROLE_CONFIG[role]) {
    const cfg = ROLE_CONFIG[role];

    iconEl.textContent = cfg.icon;

    statusEl.className = 'status';
    statusEl.innerHTML = '<div class="dot green"></div><span>Привіт!</span>';

    roleEl.style.display = 'block';
    roleEl.textContent = cfg.label;

    openBtn.style.display = 'block';
    openBtn.textContent = cfg.btnText;
    openBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: cfg.url });
    });

    resetBtn.style.display = 'block';
    resetBtn.addEventListener('click', () => {
      chrome.storage.local.remove('userRole', () => {
        chrome.tabs.create({ url: 'https://sep.eschool-ua.com/' });
        window.close();
      });
    });

  } else {
    statusEl.className = 'status warn';
    statusEl.innerHTML = '<div class="dot yellow"></div><span>Потрібна авторизація</span>';

    openBtn.style.display = 'block';

    openBtn.textContent = 'Увійти через SEP (1 раз)';
    openBtn.addEventListener('click', () => {
      chrome.tabs.create({ url: 'https://sep.eschool-ua.com/' });
      window.close();
    });
  }
});
