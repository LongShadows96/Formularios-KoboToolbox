let deferredPrompt;
const installBtn = document.getElementById('installBtn');

// Registro Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('SW listo'))
            .catch(err => console.log('Error SW', err));
    });
}

// Lógica de instalación navegadores Chromium
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.classList.remove('hidden');
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') installBtn.classList.add('hidden');
        deferredPrompt = null;
    }
});

// Detectar iOS
const isIos = /iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream;
const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

if (isIos && !isStandalone) {
    document.getElementById('ios-prompt').classList.remove('hidden');
}

// Alerta protocolo local
if (window.location.protocol === 'file:') {
    document.getElementById('protocol-warning').classList.remove('hidden');
}