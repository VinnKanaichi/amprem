// api/proxy.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const API_KEY = 'Codex-CA2E0674-409EA97A-F5A95E31-5734966F';

    try {
        const { email, link, oobCode, endpoint } = req.body;

        console.log('📥 Received:', { email, link, oobCode, endpoint });

        let targetUrl;
        if (endpoint === 'send') {
            targetUrl = 'https://am.alwayscodex.eu.cc/api/v1/bot-premium/send-link';
        } else if (endpoint === 'verify') {
            targetUrl = 'https://am.alwayscodex.eu.cc/api/v1/bot-premium/activate';
        } else {
            return res.status(400).json({ error: 'Unknown endpoint. Use "send" or "verify"' });
        }

        // 🔥 KALAU ADA oobCode, KIRIM LANGSUNG
        const payload = { email };
        if (link) payload.link = link;
        if (oobCode) payload.oobCode = oobCode;  // ← Tambahkan ini

        console.log('📤 Forwarding to:', targetUrl);
        console.log('📤 Payload:', payload);

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();
        console.log('📥 API Response:', data);

        res.status(200).json(data);
    } catch (error) {
        console.error('❌ Error:', error);
        res.status(500).json({ error: error.message });
    }
}
