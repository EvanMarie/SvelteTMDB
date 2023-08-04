<script>
	import FilterMenu from './FilterMenu.svelte';
	import GenreMenu from './GenreMenu.svelte';
	import { createEventDispatcher } from 'svelte';
	import { selectedGenreName } from '../lib/store'; // Import the selectedGenreName store

	export let selectedGenre;

	const dispatch = createEventDispatcher();

	// Subscribe to the selectedGenreName store to get the current selected genre name
	let selectedGenreNameValue;
	selectedGenreName.subscribe(value => {
		selectedGenreNameValue = value;
	});

	function handleGenreChange(event) {
		dispatch('genreChange', event.detail);
	}
</script>

<div class="navigation-container">
	<h1>Search</h1>
	<GenreMenu on:genreChange={handleGenreChange} selectedGenre={selectedGenre} selectedGenreNameValue={selectedGenreNameValue} />

	<FilterMenu />

</div>

<style>
	.navigation-container {
		width: 100%;
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	@media (min-width: 768px) {
		.navigation-container {
			flex-direction: row;
		}
	}
</style>