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
        const apiUrl = 'https://api.siputzx.my.id/api/d/ytpost';
        // Mengambil API Key dari environment variable yang benar
        const apiKey = process.env.API_KEY;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'api_key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: url })
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
