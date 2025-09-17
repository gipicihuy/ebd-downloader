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
        // Buat URL API dengan query string
        const apiUrl = `https://api.skyzxu.web.id/downloader/ytmp4?url=${encodeURIComponent(url)}&resolution=720`;
        // Mengambil API Key dari environment variable
        const apiKey = process.env.API_KEY;

        // Lakukan permintaan GET ke API eksternal dengan header API key
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'api_key': apiKey // Tambahkan API key di header
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.status(200).json(data);

    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Failed to fetch data from external API' });
    }
}
