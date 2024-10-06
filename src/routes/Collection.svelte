<script lang="ts">
    import { type MediaItem } from "$lib/stores";
    import MediaCard from "./MediaCard.svelte";
    import EmptyCard from "./EmptyCard.svelte";

    export let name: string;
    export let usage_type:string
    export let items: MediaItem[];
    export let add_to_library: (media: MediaItem) => void;
    export let remove_from_library: (media: MediaItem) => void;
    export let laodandplay: (media: MediaItem) => void;
</script>

<h2 class="text-3xl font-bold my-2">{name}</h2>
<div class="flex gap-10 overflow-x-scroll no-scrollbar">
    {#if items.length > 0}
        {#each items as media}
            <MediaCard {media} {usage_type} {add_to_library} {remove_from_library} {laodandplay} />
        {/each}
    {:else}
        <EmptyCard />
    {/if}
</div>
