<!-- GenreMenu.svelte -->
<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { fetchGenres } from '../lib/fetchFilms';
	import { selectedGenreName } from '../lib/store'; // Import the selectedGenreName store

	export let selectedGenre; // Accept selectedGenre as a prop

	let genres = [];

	const dispatch = createEventDispatcher();

	onMount(() => {
		fetchGenres().then((results) => {
			genres = results;
		});
	});

	function handleGenreChange(event) {
		selectedGenre = event.target.value;
		const genreName = findGenreName(selectedGenre);
		selectedGenreName.set(genreName); // Update the selectedGenreName store with the genre name
		dispatch('genreChange', selectedGenre); // Emit the genreChange event with the selectedGenre
	}

	// Helper function to find the genre name based on genre ID
	function findGenreName(genreId) {
		const genre = genres.find((g) => g.id === parseInt(genreId));
		return genre ? genre.name : '';
	}
</script>

<div class="select-container">
	<label>
		Genre:
		<select bind:value={selectedGenre} on:change={handleGenreChange}>
			<option value="">Select Genre</option>
			{#each genres as genre}
				<option value={genre.id}>{genre.name}</option>
			{/each}
		</select>
	</label>
</div>
