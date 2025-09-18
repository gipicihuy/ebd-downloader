import fetch from 'node-fetch';import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const apiUrl = `https://api.skyzxu.web.id/downloader/ytmp4?url=${encodeURIComponent(url)}&resolution=360`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        // Memeriksa keberadaan data yang diperlukan
        if (data.download_url) {
            const result = {
                status: true,
                data: {
                    urls: [data.download_url],
                    metadata: {
                        title: data.title || 'Tidak Ada Judul',
                        creator: data.uploader || 'Tidak Diketahui',
                        thumbnail: data.thumbnail || 'https://via.placeholder.com/200/2a2a2a/f0f0f0?text=No+Image',
                        description: data.description || 'Tidak Ada Deskripsi'
                    },
                    original_url: url
                }
            };
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'Tautan unduhan tidak ditemukan dalam respons.' });
        }

    } catch (error) {
        console.error('Error fetching data from external API:', error);
        res.status(500).json({ error: 'Gagal mengambil data dari API eksternal. Kemungkinan API tidak stabil.' });
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const apiUrl = `https://api.skyzxu.web.id/downloader/ytmp4?url=${encodeURIComponent(url)}&resolution=360`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
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
