import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const apiUrl = `https://api.skyzxu.web.id/downloader/ytmp4?url=${encodeURIComponent(url)}&resolution=720`;

        console.log(`[DEBUG] Mengirim permintaan ke: ${apiUrl}`);

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        // Cetak status dan data respons mentah dari API eksternal
        const data = await response.json().catch(e => {
            console.error('[DEBUG] Gagal parsing JSON dari API:', e);
            return { error: 'Invalid JSON response from external API' };
        });

        console.log(`[DEBUG] Status respons: ${response.status}`);
        console.log('[DEBUG] Data respons:', data);

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('[DEBUG] Kesalahan dalam proses fetch:', error);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
}
