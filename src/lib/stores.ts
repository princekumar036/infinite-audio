import { writable } from "svelte/store";

export type MediaItem = {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    thumbnail: string;
    src: string;
};

// MY LIBRARY
export const library_items = save_to_localStorage('library')

export function save_to_localStorage(key: string) {
    let data

    if (typeof window !== 'undefined') {
        const storedValue = localStorage.getItem(key);
        if (storedValue) {
            data = JSON.parse(storedValue);
        }
    }
    data = data || { stations: [], songs: [] }
    const store = writable(data)

    store.subscribe((value) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(value));
        }
    });

    return store;
}

