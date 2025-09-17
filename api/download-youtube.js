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
        // Buat URL API dengan query string untuk URL video dan resolusi
        const apiUrl = `https://api.skyzxu.web.id/downloader/ytmp4?url=${encodeURIComponent(url)}&resolution=720`;

        // Lakukan permintaan GET ke API eksternal
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            // Jika API eksternal merespons dengan error (misalnya 4xx atau 5xx)
            return res.status(response.status).json(data);
        }

        // Mengirimkan respons dari API eksternal kembali ke frontend
        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
}
