import { json } from '@sveltejs/kit';
import ytstream from 'yt-stream'

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    const yt_url = `https://www.youtube.com/watch?v=${id}`

    if (!id || !ytstream.validateVideoURL(yt_url)) {
        return json( { error: 'Invalid Youtube URL' }, { status: 400 } );
    }

    try {
        const stream = await ytstream.stream(yt_url, {
            quality: 'high',
            type: 'audio',
            highWaterMark: 1048576 * 32,
            download: true
        })
        const url = stream.url

        return json({ url });
    } 
    catch (error) {
        return json(
            { error: error }, 
            { status: 500 }
        );
    }
}