// store.js
import { writable } from 'svelte/store';

export const filterStore = writable('popular');

export const selectedGenreName = writable('');
