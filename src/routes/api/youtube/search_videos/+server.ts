import { json } from '@sveltejs/kit';
import { Client, MusicClient } from 'youtubei'
const music = new MusicClient();

export async function GET({ url }) {

    const query = url.searchParams.get('q');
    if (!query) {
        return json( { error: 'Query parameter "q" is required' }, { status: 400 } );
    }

    try {
        const res = await music.search(query, "song")
        const songs = res.items                
        
        const formattedSongs = songs.map((song) => ({
            id: song.id,
            type: "song",
            title: song.title,
            subtitle: song.artists.map((artist) => artist.name).join(', '),
            thumbnail: song.thumbnails.best || "/placeholder.svg",
            src: ""
        }));

        return json( formattedSongs );
    } 
    catch (error) {
        return json( { error: error }, { status: 500 } );
    }
}