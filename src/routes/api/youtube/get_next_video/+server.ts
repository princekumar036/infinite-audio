import { json } from '@sveltejs/kit';
import { Client, MusicClient } from 'youtubei'
const youtube = new Client();
import ytstream from 'yt-stream'

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json( { error: 'Query parameter "id" is required' }, { status: 400 } );
    }

    try {
        const video = await youtube.getVideo(id)

        const not_so_related = video?.related.items.filter((item) => {
            return !((item.title + ' ' + item.channel?.name).split(/\s+/).some(w => (video.title + ' ' + video.channel?.name).split(/\s+/).includes(w)))
        })
        const upNext = not_so_related[Math.floor(Math.random() * not_so_related.length)]        

        const upNextStream = await ytstream.stream(`https://www.youtube.com/watch?v=${upNext?.id}`, {
            quality: 'high',
            type: 'audio',
            highWaterMark: 1048576 * 32,
            download: true
        })

        const formattedSong = {
            id: upNext?.id,
            type: "song",
            title: upNext?.title,
            subtitle: upNext?.channel?.name,
            thumbnail: upNext?.thumbnails.best || "/placeholder.svg",
            src: upNextStream.url,
        }
        
        return json(formattedSong)
    } 
    catch (error) {
        return json( { error: error }, { status: 500 } );
    }
}