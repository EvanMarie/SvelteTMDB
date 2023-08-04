<script>
	import FilterMenu from './FilterMenu.svelte';
	import GenreMenu from './GenreMenu.svelte';
	import { createEventDispatcher } from 'svelte';

	export let selectedGenre;

	const dispatch = createEventDispatcher();

	function handleGenreChange(event) {
		dispatch('genreChange', event.detail);
	}
</script>

<div class="navigation-container">
	<h1>Search</h1>
	<GenreMenu on:genreChange={handleGenreChange} {selectedGenre} />

	<FilterMenu />
</div>

<style>
	.navigation-container {
		width: 100%;
		height: 100px;
		padding: 10px 20px;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
</style>
