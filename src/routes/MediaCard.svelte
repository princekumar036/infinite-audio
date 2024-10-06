<script lang="ts">
    import { type MediaItem } from "$lib/stores";
    import { icons } from "$lib/icons";
    
    export let media: MediaItem
    export let usage_type:string
    export let remove_from_library: (media: MediaItem) => void;
    export let add_to_library: (media: MediaItem) => void;
    export let laodandplay: (media: MediaItem) => void;
</script>


<div class="relative group" title={media.title}>
    <button class="h-32 w-32" id={media.id} on:click={() => laodandplay(media)}>
        <img class="h-32 w-32 object-cover rounded-md" src={media.thumbnail} alt=""/>
        <p class="font-bold text-left truncate">{media.title}</p>
        <p class="text-left text-xs truncate">{media.subtitle}</p>
    </button>
    {#if usage_type === "library"}
        <button class="absolute top-0 right-0 text-2xl text-white p-2 bg-black/50 rounded-full hidden group-hover:block" 
            title="Remove from library" 
            on:click={() => remove_from_library(media)}>{@html icons.trash}
        </button>
    {:else if usage_type === "search"}
        <button class="absolute top-0 right-0 text-2xl text-white p-2 bg-black/50 rounded-full" 
            title="Add to library" 
            on:click={() => add_to_library(media)}>{@html icons.add_nooutline}
        </button>
    {/if}
</div>