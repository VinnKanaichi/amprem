// ============================================================
//  DENIA AM PREM — SCRIPT
//  DEV: VINN & CHELL REN
// ============================================================

(function() {
    'use strict';

    // ===== KONFIGURASI =====
    const API_BASE = 'https://am.alwayscodex.eu.cc';
    const API_KEY = 'Codex-CA2E0674-409EA97A-F5A95E31-5734966F';
    const SEND_ENDPOINT = '/api/v1/bot-premium/send-link';
    const VERIFY_ENDPOINT = '/api/v1/bot-premium/activate';

    // ===== DOM =====
    const overlay = document.getElementById('welcomeOverlay');
    const enterBtn = document.getElementById('enterBtn');
    const mainApp = document.getElementById('mainApp');

    const emailInput = document.getElementById('emailInput');
    const sendBtn = document.getElementById('sendBtn');
    const sendResult = document.getElementById('sendResult');

    const verifyEmailInput = document.getElementById('verifyEmailInput');
    const magicLinkInput = document.getElementById('magicLinkInput');
    const verifyBtn = document.getElementById('verifyBtn');
    const verifyResult = document.getElementById('verifyResult');

    const statusDot = document.getElementById('statusDot');
    const statusText = document.getElementById('statusText');

    const tabBtns = document.querySelectorAll('.tab-btn');
    const panels = {
        activation: document.getElementById('panel-activation'),
        verify: document.getElementById('panel-verify'),
    };

    // ===== STATUS =====
    function setStatus(text, state) {
        statusText.textContent = text;
        if (state === 'online') {
            statusDot.style.background = '#4a7bff';
        } else if (state === 'offline') {
            statusDot.style.background = '#ff6b7a';
        } else if (state === 'idle') {
            statusDot.style.background = '#fdcb6e';
        }
    }

    // ===== RESULT =====
    function showResult(element, message, isSuccess) {
        element.textContent = message;
        element.className = 'result-box show';
        if (isSuccess === true) element.classList.add('success');
        else if (isSuccess === false) element.classList.add('error');
    }

    function hideResult(element) {
        element.className = 'result-box';
        element.textContent = '';
    }

    function setLoading(btn, loading) {
        btn.disabled = loading;
        btn.textContent = loading ? '⏳ Memproses...' : btn.dataset.originalText || 'Kirim Magic Link';
        if (!btn.dataset.originalText) {
            btn.dataset.originalText = btn.textContent;
        }
    }

    // ===== API =====
    async function callApi(endpoint, body) {
        const response = await fetch(API_BASE + endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(body),
        });

        let data;
        try { data = await response.json(); } 
        catch { throw new Error('Response server tidak valid.'); }

        if (!response.ok) {
            throw new Error(data?.error || data?.message || `HTTP ${response.status}`);
        }
        return data;
    }

    // ===== SEND =====
    async function handleSend() {
        const email = emailInput.value.trim();

        if (!email) {
            showResult(sendResult, '⚠️ Email wajib diisi.', false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showResult(sendResult, '⚠️ Format email tidak valid.', false);
            return;
        }

        hideResult(sendResult);
        setLoading(sendBtn, true);
        setStatus('Mengirim...', 'idle');

        try {
            const data = await callApi(SEND_ENDPOINT, { email });

            if (data.success) {
                showResult(sendResult, data.message || '✅ Magic link berhasil dikirim! Cek inbox/spam.', true);
                verifyEmailInput.value = email;
                setStatus('Online', 'online');
            } else {
                throw new Error(data?.error || data?.message || 'Gagal mengirim.');
            }
        } catch (err) {
            showResult(sendResult, '❌ ' + err.message, false);
            setStatus('Gagal', 'offline');
        } finally {
            setLoading(sendBtn, false);
        }
    }

    // ===== VERIFY =====
    async function handleVerify() {
        const email = verifyEmailInput.value.trim();
        const link = magicLinkInput.value.trim();

        if (!email) {
            showResult(verifyResult, '⚠️ Email wajib diisi.', false);
            return;
        }

        if (!link) {
            showResult(verifyResult, '⚠️ Magic link wajib diisi.', false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showResult(verifyResult, '⚠️ Format email tidak valid.', false);
            return;
        }

        hideResult(verifyResult);
        setLoading(verifyBtn, true);
        setStatus('Memverifikasi...', 'idle');

        try {
            const data = await callApi(VERIFY_ENDPOINT, { email, link });

            if (data.success) {
                showResult(verifyResult, data.message || '✅ Verifikasi berhasil!', true);
                setStatus('Online', 'online');
            } else {
                throw new Error(data?.error || data?.message || 'Verifikasi gagal.');
            }
        } catch (err) {
            showResult(verifyResult, '❌ ' + err.message, false);
            setStatus('Gagal', 'offline');
        } finally {
            setLoading(verifyBtn, false);
        }
    }

    // ===== TABS =====
    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });
        Object.keys(panels).forEach(key => {
            panels[key].classList.toggle('active', key === tabId);
        });
        hideResult(sendResult);
        hideResult(verifyResult);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // ===== EVENTS =====
    enterBtn.addEventListener('click', function() {
        overlay.classList.add('hidden');
        mainApp.classList.add('show');
        setStatus('Online', 'online');
    });

    sendBtn.addEventListener('click', handleSend);
    verifyBtn.addEventListener('click', handleVerify);

    emailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); sendBtn.click(); }
    });

    verifyEmailInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); magicLinkInput.focus(); }
    });

    magicLinkInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') { e.preventDefault(); verifyBtn.click(); }
    });

    emailInput.addEventListener('input', function() {
        if (this.value.trim() && !verifyEmailInput.value.trim()) {
            verifyEmailInput.value = this.value.trim();
        }
    });

    // ===== INIT =====
    setStatus('Menunggu...', 'idle');
    hideResult(sendResult);
    hideResult(verifyResult);

    console.log('✦ DENIA AM PREM');
    console.log('✨ FREE UNTUK SEMUA');
    console.log('👨‍💻 DEV: VINN & CHELL REN');
})();