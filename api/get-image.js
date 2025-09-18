import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).send('Method Not Allowed');
    }

    const { url } = req.query;

    if (!url) {
        return res.status(400).send('URL is required.');
    }

    let absoluteUrl = url;

    // Tambahkan 'https://' jika URL tidak memiliki protokol
    if (!absoluteUrl.startsWith('http://') && !absoluteUrl.startsWith('https://')) {
        absoluteUrl = `https://${absoluteUrl}`;
    }

    try {
        const response = await fetch(absoluteUrl, {
            // Menambahkan user-agent untuk menyamar sebagai browser
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://www.tiktok.com/'
            }
        });

        // Periksa apakah respons berhasil
        if (!response.ok) {
            console.error(`Failed to fetch image: ${response.statusText} for URL: ${absoluteUrl}`);
            return res.status(response.status).send(`Failed to fetch image: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
            res.setHeader('Content-Type', contentType);
            // Salurkan data gambar langsung ke respons
            response.body.pipe(res);
        } else {
            console.error(`Unexpected content type: ${contentType} for URL: ${absoluteUrl}`);
            res.status(400).send('URL does not point to an image.');
        }

    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error. Check Vercel logs for details.');
    }
}
