<script lang="ts">
    import { library_items, type MediaItem } from '$lib/stores.js';
    import Search from './Search.svelte';
    import Library from './Library.svelte';
    import Player from './Player.svelte';

    function add_to_library(media: MediaItem) {
        if (media.type === 'station') {
            if ($library_items.stations.find(m => m.id === media.id)) return
            $library_items.stations = [...$library_items.stations, media]
        }
        else if (media.type === 'song') {
            if ($library_items.songs.find(m => m.id === media.id)) return
            $library_items.songs = [...$library_items.songs, media]
        }
    }

    function remove_from_library(media: MediaItem) {
        if (media.type === 'station') {
            $library_items.stations = $library_items.stations.filter((item) => item.id !== media.id)
        }
        else if (media.type === 'song') {
            $library_items.songs = $library_items.songs.filter((item) => item.id !== media.id)
        }
    }

    let plyr:Player
    let props = { id:"", src:"", title:"", subtitle:"", thumbnail:"" }
    async function laodandplay(media: MediaItem) {  
        plyr.loading()      
        if (media.type === 'station') {
            const res = await fetch(`/api/radio/get_stations?ids=${media.id}`)
		    const stations = await res.json()
            props = stations[0]
        }
        else if (media.type === 'song') {
            const res = await fetch(`/api/youtube/get_video_stream?id=${media.id}`)
		    const data = await res.json()
            props = {...media, src: data.url}
        }
        plyr.play()
    }
</script>

<Search {add_to_library} {remove_from_library} {laodandplay} />

<Library {add_to_library} {remove_from_library} {laodandplay} />

<Player bind:this={plyr} {props} {add_to_library} />
