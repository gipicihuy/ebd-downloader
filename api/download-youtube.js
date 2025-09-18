export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'Missing URL parameter' });
    }

    try {
        const apiUrl = `https://api-downloader.zone.id/api/ytmp4?url=${encodeURIComponent(url)}&quality=highest`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        });

        const data = await response.json();

        // Periksa apakah API berhasil merespons
        if (data.status !== 200 || !data.success) {
            return res.status(data.status || 500).json({ error: data.message || 'Gagal mengambil data dari API.' });
        }

        // Periksa apakah URL unduhan tersedia
        if (data.url) {
            const result = {
                status: true,
                data: {
                    urls: [data.url],
                    metadata: {
                        title: data.title || 'Tidak Ada Judul',
                        creator: data.channel || 'Tidak Diketahui',
                        thumbnail: data.thumb || 'https://via.placeholder.com/200/2a2a2a/f0f0f0?text=No+Image',
                        description: data.description || 'Tidak Ada Deskripsi'
                    },
                    original_url: url
                }
            };
            res.status(200).json(result);
        } else {
            res.status(404).json({ error: 'Tautan unduhan tidak ditemukan. Coba URL lain atau tunggu sebentar.' });
        }

    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).json({ error: 'Gagal mengambil data dari API eksternal. Periksa koneksi atau URL.' });
    }
}
