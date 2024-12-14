<script lang="ts">
    import Plyr from "plyr";
    import "plyr/dist/plyr.css";
    import { onMount } from "svelte";
    import { icons } from "$lib/icons";
    import type { MediaItem } from "$lib/stores";

    let audioRef: HTMLAudioElement;
    let plyrRef: Plyr;
    let plyr__control: HTMLButtonElement;
    let upnext:MediaItem;

    export let props = {
        id: "",
        src: "",
        title: "",
        subtitle: "",
        thumbnail: "",
    }
    export let add_to_library: (media: MediaItem) => void;
    export const play = () => plyrRef.once('canplay', () => plyrRef.play())
    export const loading = () => plyr__control.innerHTML = `<span class="text-2xl">${icons.loading}</span>`

    onMount(() => {
        if (typeof window !== 'undefined') {
            plyrRef = new Plyr(audioRef, {
                controls: ["play", "progress", "mute", "volume"],
            });
        }

        plyr__control = document.querySelector('.plyr__control')

        plyrRef.on("play", () => {
            plyr__control.innerHTML = `
                <svg class="icon--pressed" aria-hidden="true" focusable="false">
                    <use xlink:href="#plyr-pause"></use>
                </svg>
                <svg class="icon--not-pressed" aria-hidden="true" focusable="false">
                    <use xlink:href="#plyr-play"></use>
                </svg>
                <span class="label--pressed plyr__sr-only">Pause</span>
                <span class="label--not-pressed plyr__sr-only">Play</span>
            `

            if (plyrRef.duration < plyrRef.currentTime) {
                audioRef.load();        // Relaod and play if live stream
                plyrRef.on("canplay", () => plyrRef.play());
            }
        });

        plyrRef.on("progress", async () => {
            if (plyrRef.buffered === 1) {
                const res = await fetch(`/api/youtube/get_next_video?id=${props.id}`);
                upnext = await res.json();
            }
        });

        plyrRef.on("ended", () => {
            props.id = upnext.id;
            props.src = upnext.src;
            props.title = upnext.title;
            props.subtitle = upnext.subtitle;
            props.thumbnail = upnext.thumbnail;
            plyr__control.innerHTML = `<span class="text-2xl">${icons.loading}</span>`;
            plyrRef.on("canplay", () => plyrRef.play());
        });

        return () => plyrRef.destroy();
    });
</script>


<div class="bg-slate-900 shadow p-2 flex items-center text-white fixed bottom-0 left-0 right-0 z-50">
    <div class="flex-1 flex items-center gap-2">
        <div class="relative group">
            <img
                class="h-20 w-20 object-cover rounded-md"
                src={props.thumbnail || "/placeholder.svg"}
                alt=""
            />
            <div class="bg-black/50 w-full h-full absolute top-0 left-0 rounded-md hidden group-hover:block">
                <button 
                    class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl p-2 rounded-full hidden group-hover:block" 
                    title="Add to Library" 
                    on:click={() => add_to_library(props.id)}
                >{@html icons.add}
                </button>
            </div>
        </div>

        <div class="flex-1">
            <h3 class="font-bold">{props.title}</h3>
            <p class="text-xs text-slate-400">{props.subtitle}</p>
        </div>
    </div>

    <audio bind:this={audioRef} src={props.src} />
</div>


<style>
    /* PLAYER */
    :global(.plyr) {
        flex: 1;
    }
    :global(.plyr__progress) {
        pointer-events: none;
    }
    :global(.plyr__progress__container) {
        width: 80%;
        position: absolute;
        bottom: -8px;
        left: 0;
        transform: translateX(-50%);
    }
    :global(.plyr__progress input::-webkit-slider-thumb) {
        display: none;
    }
    :root {
        --plyr-audio-controls-background: tranparent;
        --plyr-audio-control-color: white;
        --plyr-audio-control-background-hover: none;
    }
</style>