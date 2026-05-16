/**
 * Firefox browser keepalive helper for GitHub Codespaces.
 *
 * Usage:
 * 1. Open the target Codespace page in Firefox.
 * 2. Open Developer Tools (F12).
 * 3. Paste the contents of this file into the Console and press Enter.
 *
 * This script will:
 * - send a browser keepalive request every 2 minutes,
 * - refresh the page every 10 minutes,
 * - update the page title and status area so the tab has visible activity.
 */
(function () {
  const targetUrl = window.location.href;
  const pingIntervalMs = 2 * 60 * 1000;
  const refreshIntervalMs = 10 * 60 * 1000;
  const pageTitle = document.title;
  let tick = 0;

  const statusBar = document.createElement('div');
  statusBar.id = 'codespace-keepalive-status';
  statusBar.style.cssText = 'position:fixed;bottom:12px;right:12px;z-index:999999;padding:12px 16px;border-radius:12px;background:#0b0f17;color:#fff;font-family:Arial,Helvetica,sans-serif;font-size:13px;box-shadow:0 10px 30px rgba(0,0,0,.35);max-width:320px;line-height:1.4;';
  statusBar.innerHTML = '<strong>Codespace keepalive فعال شد</strong><br>در حال ارسال پینگ...';
  document.body.appendChild(statusBar);

  const updateStatus = (message, level = 'info') => {
    statusBar.innerHTML = `<strong>Codespace keepalive فعال شد</strong><br>${message}`;
    statusBar.style.background = level === 'error' ? '#9f1239' : '#111827';
  };

  const sendPing = () => {
    const timestamp = new Date().toLocaleTimeString();
    const keepaliveUrl = `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}_keepalive=${Date.now()}`;
    const image = new Image();
    image.src = keepaliveUrl;

    fetch(targetUrl, { cache: 'no-store', credentials: 'include' })
      .then((response) => {
        const statusText = response.status ? `${response.status} ${response.statusText}` : 'OK';
        updateStatus(`آخرین درخواست: ${timestamp}<br>آدرس: ${keepaliveUrl}<br>پاسخ: ${statusText}`);
        console.log('[codespace-keepalive] ping sent', keepaliveUrl, statusText);
      })
      .catch((error) => {
        updateStatus(`آخرین تلاش: ${timestamp}<br>خطا: ${error.message || error}`, 'error');
        console.warn('[codespace-keepalive] ping failed', error);
      });

    document.title = `Keepalive • ${timestamp}`;
    document.body.style.border = tick % 2 === 0 ? '3px solid rgba(56, 189, 248, 0.75)' : '3px solid rgba(16, 185, 129, 0.75)';
    tick += 1;
  };

  const refreshPage = () => {
    console.log('[codespace-keepalive] refreshing page');
    window.location.reload(true);
  };

  sendPing();
  setInterval(sendPing, pingIntervalMs);
  setInterval(refreshPage, refreshIntervalMs);

  console.log('[codespace-keepalive] started for', targetUrl);
  updateStatus('اولین پینگ ارسال شد. هر 2 دقیقه یک درخواست جدید ارسال می‌شود. هر 10 دقیقه صفحه رفرش خواهد شد.');
})();
