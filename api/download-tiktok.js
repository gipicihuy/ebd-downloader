import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;
    const API_KEY = process.env.API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key is missing.' });
    }
    if (!url) {
        return res.status(400).json({ error: 'URL is required.' });
    }

    try {
        const response = await fetch('https://api.siputzx.my.id/api/d/tiktok', {
            method: 'POST',
            headers: {
                'accept': '*/*',
                'Content-Type': 'application/json',
                'api_key': API_KEY
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (!response.ok || data.status !== true) {
            return res.status(response.status).json(data);
        }

        const downloadUrl = data.data?.urls?.[0];

        if (downloadUrl) {
            const metadata = data.data.metadata;
            let thumbnailURL = metadata.thumbnail;

            // Jika thumbnail ada, gunakan proxy API untuk mengambilnya
            if (thumbnailURL) {
                thumbnailURL = `/api/get-image?url=${encodeURIComponent(thumbnailURL)}`;
            } else {
                // Fallback jika tidak ada thumbnail
                thumbnailURL = 'https://via.placeholder.com/200/2a2a2a/f0f0f0?text=No+Image';
            }

            const result = {
                status: true,
                data: {
                    urls: [downloadUrl],
                    metadata: {
                        title: metadata.title || 'Tidak Ada Judul',
                        creator: metadata.creator || 'Tidak Diketahui',
                        thumbnail: thumbnailURL,
                        description: metadata.description || 'Tidak Ada Deskripsi'
                    },
                    original_url: url
                }
            };
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'Tautan unduhan video tidak ditemukan. Coba URL lain.' });
        }

    } catch (error) {
        console.error('Error contacting TikTok API:', error);
        res.status(500).json({ error: 'Gagal mengunduh video. Silakan coba lagi.' });
    }
}
