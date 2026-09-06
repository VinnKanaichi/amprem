// api/proxy.js
export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const API_BASE = 'https://am.alwayscodex.eu.cc';
    const API_KEY = 'Codex-CA2E0674-409EA97A-F5A95E31-5734966F';

    try {
        const path = req.url; // /send atau /verify
        const targetUrl = path.includes('send') 
            ? `${API_BASE}/api/v1/bot-premium/send-link`
            : `${API_BASE}/api/v1/bot-premium/activate`;

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': API_KEY,
            },
            body: JSON.stringify(req.body),
        });

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
