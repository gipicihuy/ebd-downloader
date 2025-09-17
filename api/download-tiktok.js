const axios = require('axios');

// Ganti dengan API Key Anda yang sebenarnya
const API_KEY = 'givy';

// Handler function untuk Vercel Serverless
module.exports = async (req, res) => {
    // Memastikan metode permintaannya adalah POST
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        const apiResponse = await axios.post('https://api.siputzx.my.id/api/d/tiktok', { url }, {
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'api_key': API_KEY
            }
        });
        
        res.json(apiResponse.data);
    } catch (error) {
        console.error('Error contacting TikTok API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to download video. Please try another URL.' });
    }
};
