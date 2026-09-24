'use strict';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('./sw.js');
            registration.update().catch(() => {});

            let reloading = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (reloading) return;
                reloading = true;
                window.location.reload();
            });
        } catch (error) {
            console.error('No fue posible registrar el Service Worker:', error);
        }
    });
}

let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
const installHelpModal = document.getElementById('installHelpModal');
const closeInstallHelpBtn = document.getElementById('closeInstallHelp');
const installHelpText = document.getElementById('installHelpText');

function isStandalone() {
    return window.matchMedia?.('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

function getPlatformHint() {
    const ua = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua)
        || (platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    const isFirefox = /Firefox|FxiOS/i.test(ua);

    if (isIOS) {
        return 'En iPhone o iPad, abra el menú Compartir o el menú del navegador y elija “Añadir a pantalla de inicio” cuando esté disponible. La ubicación y el nombre exacto de la opción pueden cambiar entre Safari, Firefox, Chrome u otros navegadores.';
    }

    if (isAndroid && isFirefox) {
        return 'En Firefox para Android, abra el menú del navegador y busque “Instalar” o “Añadir a pantalla de inicio”. Si esa opción no aparece, el portal puede seguir usándose normalmente desde el navegador.';
    }

    if (isAndroid) {
        return 'En Android, abra el menú del navegador y busque una opción como “Instalar aplicación”, “Instalar” o “Añadir a pantalla de inicio”. El texto exacto cambia según Firefox, Chrome, Edge, Samsung Internet u otro navegador.';
    }

    return 'Abra el menú de su navegador y busque una opción como “Instalar”, “Añadir a pantalla de inicio” o “Agregar a pantalla de inicio”. El nombre puede variar según el navegador y el equipo.';
}

function openInstallHelp() {
    if (!installHelpModal) return;
    if (installHelpText) installHelpText.textContent = getPlatformHint();
    installHelpModal.classList.remove('hidden');
    installHelpModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    closeInstallHelpBtn?.focus();
}

function closeInstallHelp() {
    if (!installHelpModal) return;
    installHelpModal.classList.add('hidden');
    installHelpModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    installBtn?.focus();
}

function refreshInstallButton() {
    if (!installBtn || isStandalone()) {
        installBtn?.classList.add('hidden');
        return;
    }

    installBtn.classList.remove('hidden');
    installBtn.textContent = deferredPrompt ? 'Instalar Aplicación' : 'Cómo instalar';
}

window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredPrompt = event;
    refreshInstallButton();
});

installBtn?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;

        if (outcome === 'accepted') {
            installBtn.classList.add('hidden');
        } else {
            refreshInstallButton();
        }
        return;
    }

    openInstallHelp();
});

closeInstallHelpBtn?.addEventListener('click', closeInstallHelp);
installHelpModal?.addEventListener('click', event => {
    if (event.target === installHelpModal) closeInstallHelp();
});

document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && installHelpModal && !installHelpModal.classList.contains('hidden')) {
        closeInstallHelp();
    }
});

window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installBtn?.classList.add('hidden');
});

window.addEventListener('DOMContentLoaded', refreshInstallButton);
