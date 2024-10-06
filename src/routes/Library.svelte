<script lang="ts">
    import { library_items, type MediaItem } from '$lib/stores';
    import Collection from './Collection.svelte';

    let usage_type = "library"
    export let add_to_library: (media: MediaItem) => void;
    export let remove_from_library: (media: MediaItem) => void;
    export let laodandplay: (media: MediaItem) => void;
</script>

<div class="py-20 px-4">
    <Collection name="Saved Stations" items={$library_items.stations} {usage_type} {add_to_library} {remove_from_library} {laodandplay} />
    <div class="h-8"></div>
    <Collection name="Saved Songs" items={$library_items.songs} {usage_type} {add_to_library} {remove_from_library} {laodandplay} />
</div>
