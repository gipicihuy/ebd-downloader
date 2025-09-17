const axios = require('axios');

// Ambil API_KEY dari environment variables Vercel
const API_KEY = process.env.API_KEY;

// Handler function untuk Vercel Serverless
module.exports = async (req, res) => {
    // Memastikan metode permintaannya adalah POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { url } = req.body;

    // Pastikan API Key dan URL tidak kosong
    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key is missing.' });
    }
    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        const apiResponse = await axios.post('https://api.siputzx.my.id/api/d/tiktok', { url }, {
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'api_key': API_KEY // Gunakan variabel lingkungan
            }
        });
        
        // Meneruskan respons dari API ke frontend
        res.json(apiResponse.data);
    } catch (error) {
        console.error('Error contacting TikTok API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to download video. Please try another URL.' });
    }
};
