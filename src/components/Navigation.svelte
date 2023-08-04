<script>
	import FilterMenu from './FilterMenu.svelte';
	import GenreMenu from './GenreMenu.svelte';
	import { createEventDispatcher } from 'svelte';
	import { selectedGenreName } from '../lib/store'; // Import the selectedGenreName store

	export let selectedGenre;
	export let selectedGenreNameValue;
	let searchQuery = '';

	function handleSearchInput(event) {
		if (event.key === 'Enter') {
			// console.log('Search Query:', searchQuery);
			dispatch('searchChange', searchQuery);
		}
	}

	const dispatch = createEventDispatcher();

	// Subscribe to the selectedGenreName store to get the current selected genre name

	selectedGenreName.subscribe((value) => {
		selectedGenreNameValue = value;
	});

	function handleGenreChange(event) {
		dispatch('genreChange', event.detail);
	}
</script>

<div class="navigation-container">
	<div class="input-container">
		<input
			type="text"
			bind:value={searchQuery}
			placeholder="Search movies..."
			on:keydown={handleSearchInput}
		/>
	</div>
	<GenreMenu on:genreChange={handleGenreChange} {selectedGenre} />

	<FilterMenu />
</div>

<style>
	.navigation-container {
        position: fixed;
        z-index: 10;
        background-color: rgba(28, 32, 48, 0.7);
        top: 0;
        left: 0;
		width: 100%;
        height: 160px;
		padding: 10px 20px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
        box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.8);
        gap: 10px;
	}

	@media (min-width: 768px) {
		.navigation-container {
			flex-direction: row;
			gap: 40px;
                    height: 70px;
		}
	}
</style>
