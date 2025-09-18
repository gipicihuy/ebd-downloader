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
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }

        // Set the appropriate Content-Type header
        const contentType = response.headers.get('content-type');
        res.setHeader('Content-Type', contentType);

        // Pipe the image data directly to the response
        response.body.pipe(res);

    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send('Internal Server Error');
    }
}
