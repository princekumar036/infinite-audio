<script lang="ts">
    import type { MediaItem } from '$lib/stores';
    import Collection from './Collection.svelte';

    let query: string;
    let usage_type = "search"
    export let laodandplay: (media: MediaItem) => void;
    export let add_to_library: (media: MediaItem) => void;
    export let remove_from_library: (media: MediaItem) => void;

    let search_result: { stations: MediaItem[]; songs: MediaItem[] } = { stations: [], songs: [] };
    let intervalId: NodeJS.Timeout
    function do_search() {
        clearTimeout(intervalId)
        intervalId = setTimeout(async () => {
            const res_stations = await fetch(`/api/radio/search_stations?q=${query}`)
            const stations: MediaItem[] = await res_stations.json()

            const res_songs = await fetch(`/api/youtube/search_videos?q=${query}`)
            const songs: MediaItem[] = await res_songs.json()

            search_result = { stations, songs }
        }, 500)
    }
</script>

<div class="group">
    <div class="bg-slate-800/50 absolute z-10 top-0 left-0 w-screen h-screen backdrop-blur-sm hidden group-focus-within:block"></div>

    <div class="fixed container z-20 px-4">
        <input 
            type="text"
            bind:value={query}
            placeholder="Search for a radio station or a song..."
            class="w-full px-4 py-2 border border-slate-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-600 my-4"
            on:input={do_search}
        />

        {#if search_result.stations.length > 0 || search_result.songs.length > 0}
        <div class="bg-slate-600 rounded-md p-4 hidden group-focus-within:block">
            <Collection name="Stations" items={search_result.stations} {usage_type} {add_to_library} {remove_from_library} {laodandplay} />
            <Collection name="Songs" items={search_result.songs} {usage_type} {add_to_library} {remove_from_library} {laodandplay} />
        </div>
        {/if}
        
    </div>
</div>
