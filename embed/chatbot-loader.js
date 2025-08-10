(() => {
  const SCRIPT = document.currentScript;

  const base = (SCRIPT.getAttribute('data-base') || '').replace(/\/$/, '');
  if (!base) { console.error('[chatbot] Falta data-base (e.g. https://tu-dominio.com/chatbot)'); return; }

  const cfg = {
    position: SCRIPT.dataset.position || 'bottom-right',
    offsetX: parseInt(SCRIPT.dataset.offsetX || '20', 10),
    offsetY: parseInt(SCRIPT.dataset.offsetY || '20', 10),
    primary: SCRIPT.dataset.primary || '#0078d4',
    userEmail: SCRIPT.dataset.userEmail || '',
    start: SCRIPT.dataset.start || 'bubble',
    hideToggle: SCRIPT.dataset.hideToggle === '1',
    closable: SCRIPT.dataset.closable !== '0',
    width: SCRIPT.dataset.width || '420px',
    height: SCRIPT.dataset.height || '510px',
    pageUrl: location.href
  };

  const host = document.createElement('div');
  host.setAttribute('data-chatbot-host', '');
  host.style.all = 'initial';
  host.style.position = 'fixed';
  host.style.zIndex = '2147483647';
  host.style.bottom = `${cfg.offsetY}px`;
  if (cfg.position === 'bottom-right') {
    host.style.right = `${cfg.offsetX}px`;
  } else {
    host.style.left = `${cfg.offsetX}px`;
  }

  const params = new URLSearchParams({
    embed: '1',
    primary: cfg.primary,
    userEmail: cfg.userEmail,
    start: cfg.start === 'open' ? 'open' : 'bubble',
    hideToggle: cfg.hideToggle ? '1' : '0',
    closable: cfg.closable ? '1' : '0'
  });

  const iframe = document.createElement('iframe');
  iframe.src = `${base}/widget/index.html?${params.toString()}`;
  iframe.title = 'BANCO GNB';
  iframe.allow = 'clipboard-write';
  iframe.setAttribute('frameborder', '0');
  iframe.style.border = '0';
  iframe.style.boxShadow = '0 6px 20px rgba(0,0,0,.25)';
  iframe.style.borderRadius = cfg.start === 'open' ? '16px' : '9999px';
  iframe.style.width  = cfg.start === 'open' ? cfg.width  : '50px';
  iframe.style.height = cfg.start === 'open' ? cfg.height : '50px';
  iframe.style.background = '#fff';
  iframe.style.overflow = 'hidden';

  const onMessage = (ev) => {
    if (!ev || !ev.data || typeof ev.data !== 'object') return;
    const { type, width, height, radius } = ev.data;

    if (type === 'chatbot:resize') {
      if (width)  iframe.style.width = width;
      if (height) iframe.style.height = height;
      if (radius) iframe.style.borderRadius = radius;
      return;
    }
    if (type === 'chatbot:getContext') {
      iframe.contentWindow?.postMessage({
        type: 'chatbot:context',
        pageUrl: cfg.pageUrl,
        userEmail: cfg.userEmail
      }, '*');
      return;
    }
  };
  window.addEventListener('message', onMessage);

  host.appendChild(iframe);
  (document.body || document.documentElement).appendChild(host);

  const api = {
    open()  { iframe.contentWindow?.postMessage({ type: 'chatbot:open' }, '*'); },
    close() { iframe.contentWindow?.postMessage({ type: 'chatbot:close' }, '*'); },
    toggle(){ iframe.contentWindow?.postMessage({ type: 'chatbot:toggle' }, '*'); },
    setPosition(pos) {
      if (pos === 'bottom-left' || pos === 'bottom-right') {
        host.style.right = pos === 'bottom-right' ? `${cfg.offsetX}px` : 'auto';
        host.style.left  = pos === 'bottom-left'  ? `${cfg.offsetX}px` : 'auto';
      }
    }
  };
  window.ChatbotWidget = api;
})();
