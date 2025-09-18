import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL is required.');
    }

    try {
        const response = await fetch(url, {
            // Tambahkan user-agent untuk menyamar sebagai browser
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.tiktok.com/' // Menambahkan referer agar terlihat seperti permintaan dari TikTok
            }
        });

        // Periksa apakah respons berhasil
        if (!response.ok) {
            // Log error untuk debugging di Vercel
            console.error(`Failed to fetch image: ${response.statusText} for URL: ${url}`);
            return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
            res.setHeader('Content-Type', contentType);
            // Pipe the image data directly to the response
            response.body.pipe(res);
        } else {
            // Jika respons bukan gambar, berikan pesan error
            console.error(`Unexpected content type: ${contentType} for URL: ${url}`);
            res.status(400).send('URL does not point to an image.');
        }

    } catch (error) {
        // Log error secara lebih detail
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error. Check Vercel logs for details.');
    }
}
