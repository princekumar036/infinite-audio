import { json } from '@sveltejs/kit';
import { Client } from 'youtubei'
const youtube = new Client();

export async function GET({ url }) {
    const id = url.searchParams.get('id');
    if (!id) {
        return json( { error: 'Query parameter "id" is required' }, { status: 400 } );
    }

    try {
        const video = await youtube.getVideo(id)
        
        const formattedSong = {
            id: video?.id,
            type: "song",
            title: video?.title,
            subtitle: video?.channel?.name,
            thumbnail: video?.thumbnails.best || "/placeholder.svg",
            src: ""
        }
        
        return json(formattedSong)
    } 
    catch (error) {
        return json( { error: error }, { status: 500 } );
    }
}