<script>
	import { fetchMovies, fetchGenres } from '../lib/fetchFilms';
	import { truncateText } from '../lib/truncateText';
	import PageContainer from './PageContainer.svelte';
	import { filterStore } from '../lib/store.js';
	import { onMount } from 'svelte';

	let movies = [];
	let genres = [];
	let selectedGenre = null;
	let filter;

	$: filterStore.subscribe((value) => {
		filter = value;
		loadMovies(filter);
	});

	onMount(() => {
		// Fetch genres when the component is mounted
		fetchGenres().then((results) => {
			genres = results;
		});
	});

	function loadMovies(endpoint, queryParameters = '') {
		// Modify this function to include genre ID if selected
		const genreQuery = selectedGenre ? `&with_genres=${selectedGenre}` : '';
		fetchMovies(endpoint, queryParameters + genreQuery).then((results) => {
			movies = results.map((movie) => ({
				...movie,
				overview: truncateText(movie.overview, 70)
			}));
		});
	}

	function handleGenreChange(event) {
		selectedGenre = event.target.value;
		loadMovies(filter);
	}

	function formatFilter(filter) {
		let formattedFilter = filter.replace(/_/g, ' ');
		return formattedFilter
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}
</script>

<PageContainer>
	<h1>{formatFilter(filter)}</h1>
	<label>
		Filter by Genre:
		<select bind:value={selectedGenre} on:change={handleGenreChange}>
			<option value="">Select Genre</option>
			{#each genres as genre}
				<option value={genre.id}>{genre.name}</option>
			{/each}
		</select>
	</label>
	<ul>
		<div class="card-container">
			{#each movies as movie}
				<div class="card-styles">
					<figure>
						<img
							src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
							alt="Movie Poster"
							class="movie-poster"
						/>
					</figure>
					<div class="card-body">
						<h2 class="card-title">{movie.title}</h2>
						<p>{movie.overview}</p>
					</div>
				</div>
			{/each}
		</div>
	</ul>
</PageContainer>

<style>
	.card-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.movie-poster {
		width: 300px;
		height: 300px;
		border-radius: 10px;
		box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.8);
	}

	.card-styles {
		padding: 1rem;
		background-color: darkcyan;
		width: 375px;
		height: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		box-shadow: 1px 1px 20px 1px rgba(0, 0, 0, 0.8);
	}
</style>