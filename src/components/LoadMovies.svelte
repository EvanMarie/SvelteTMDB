<script>
	import { fetchMovies, fetchGenres } from '../lib/fetchFilms';
	import { truncateText } from '../lib/truncateText';
	import PageContainer from './PageContainer.svelte';
	import { filterStore } from '../lib/store.js';
	import { onMount } from 'svelte';
	import Navigation from './Navigation.svelte';
	import { selectedGenreName } from '../lib/store'; // Import the selectedGenreName store

	let movies = [];
	let genres = [];
	let filter;
	let selectedGenre = '';

	// Subscribe to the selectedGenreName store to get the current selected genre name
	let selectedGenreNameValue;
	selectedGenreName.subscribe((value) => {
		selectedGenreNameValue = value;
	});

	let selectedMovie = null;

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

	let colors = ['#5c0233', '#4a025c', '#1c025c', '#02475c', '#025c3e', '#a64c03'];
	let backdrops = [
		'rgba(92, 2, 51, 0.2)',
		'rgba(74, 2, 92, 0.2)',
		'rgba(28, 2, 92, 0.2)',

		'rgba(2, 92, 62, 0.2)',
		'rgba(166, 76, 3, 0.2)'
	];
	let colorIndex = 0; // Initialize the color index to 0
	let backdropIndex = 0;

	function getNextColor() {
		const color = colors[colorIndex];
		colorIndex = (colorIndex + 1) % colors.length;
		return color;
	}

	function getNextBackdrop() {
		const backdrop = backdrops[backdropIndex];
		backdropIndex = (backdropIndex + 1) % backdrops.length;
		return backdrop;
	}

	function loadMovies(endpoint, queryParameters = '', searchQuery = '') {
		const genreQuery = selectedGenre ? `&with_genres=${selectedGenre}` : '';
		fetchMovies(endpoint, queryParameters + genreQuery, searchQuery).then((results) => {
			movies = results.map((movie) => {
				const rating = Math.round(movie.vote_average * 10);
				return {
					...movie,
					shortOverview: truncateText(movie.overview, 70),
					color: getNextColor(),
					backdrop: getNextBackdrop(),
					rating // This is the rounded rating
				};
			});
			console.log(movies[0]);
		});
	}

	function handleGenreChange(genre) {
		selectedGenre = genre;
		selectedGenreName.set(findGenreName(genre)); // Update the selectedGenreName store with the genre name
		loadMovies(filter);
	}

	// Add this helper function in the same scope as handleGenreChange
	function findGenreName(genreId) {
		const genre = genres.find((g) => g.id === parseInt(genreId));
		return genre ? genre.name : '';
	}

	function formatFilter(filter) {
		let formattedFilter = filter.replace(/_/g, ' ');
		return formattedFilter
			.split(' ')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(' ');
	}

	function handleSearchChange(searchQuery) {
		// console.log('Handling Search:', searchQuery);
		loadMovies(filter, '', searchQuery);
	}

	const DEFAULT_IMAGE_URL = '/noimage.png';

	function closeModal() {
		selectedMovie = null;
	}

	function formatDate(dateString) {
		if (!dateString) return '';

		const date = new Date(dateString);
		const day = date.getDate();
		const month = date.toLocaleString('default', { month: 'long' });
		const year = date.getFullYear();

		return `${day} ${month} ${year}`;
	}

	function roundPopularity(popularity) {
		if (!popularity) return '';

		return Math.round(popularity);
	}
</script>

<PageContainer>
	<Navigation
		on:genreChange={(event) => handleGenreChange(event.detail)}
		on:searchChange={(event) => handleSearchChange(event.detail)}
		{selectedGenre}
	/>

	<h1 style="margin-bottom: 1rem;">{formatFilter(filter)} {selectedGenreNameValue}</h1>

	<ul>
		<div class="card-container">
			{#each movies as movie}<div class="indicator">
					<div class="indicator-item badge">
						<div class="radial-progress" style="--value:{movie.rating}; --size:1rem; --thickness: 0.2rem;">{movie.rating}%</div>
					</div>
					<div
						class="card-styles"
						style="background-color: {movie.color}"
						on:click={() => {
							selectedMovie = movie;
							document.getElementById('my_modal_4').showModal();
						}}
						on:keydown={(event) => {
							if (event.key === 'Enter') selectedMovie = movie;
						}}
						role="button"
						tabindex="0"
					>
						<figure>
							<img
								src={movie.backdrop_path
									? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
									: DEFAULT_IMAGE_URL}
								alt="Movie Poster"
								class="movie-poster"
							/>
						</figure>
						<div class="card-body">
							<p class="card-title" style="color: cyan;">{movie.title}</p>
							<p>{movie.shortOverview}</p>
						</div>
					</div>
				</div>{/each}
		</div>
	</ul>
</PageContainer>

<dialog id="my_modal_4" class="modal">
	<form method="dialog" class="modal-box w-11/12">
		<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		<div class="modal-stack">
			<div class="modal-image-overview">
				<img
					src={selectedMovie
						? `https://image.tmdb.org/t/p/w500${selectedMovie.backdrop_path}`
						: DEFAULT_IMAGE_URL}
					alt="Movie Poster"
					class="movie-poster-modal"
				/>
				<h3 class="font-bold text-xl" style="color: cyan;">
					{selectedMovie ? selectedMovie.title : 'Hello!'}
				</h3>
				<p style="padding: 5px 10px;">{selectedMovie ? selectedMovie.overview : ''}</p>
			</div>
			{#if selectedMovie}
				{#if selectedMovie.genre_ids}
					<div class="genre-list">
						<span class="type" style="padding-right: 5px">Genres: </span>
						{#each selectedMovie.genre_ids as genreId, index}
							<span class="genre">
								{findGenreName(genreId)}
								{#if index !== selectedMovie.genre_ids.length - 1}/ {/if}
							</span>
						{/each}
					</div>
				{/if}

				<div class="stats">
					<div class="stat">
						<div class="type">Rating</div>
						<div class="value">{selectedMovie ? selectedMovie.vote_average : ''} / 10</div>
					</div>
					<div class="stat">
						<div class="type">Release</div>
						<div class="value">{selectedMovie ? formatDate(selectedMovie.release_date) : ''}</div>
					</div>
					<div class="stat">
						<div class="type">Popularity</div>
						<div class="value">
							{selectedMovie ? roundPopularity(selectedMovie.popularity) : ''}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.card-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
	}

	.movie-poster,
	.movie-poster-modal {
		width: 250px;
		height: 200px;
		border-radius: 10px;
		box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.8);
	}

	.card-styles {
		padding: 1rem;
		width: 300px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.6);
	}

	.card-styles:hover {
		cursor: pointer;
		transform: scale(1.05) rotate(-3deg);
		box-shadow: 2px 2px 30px 1px rgba(0, 0, 0, 0.8);
		transition: all 0.4s ease-in-out;
	}

	.badge {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 60px;
		width: 60px;
		padding: 3px;
		border-radius: 50%;
		background-color: cyan;
        top: 15px;
        right: 15px;
	}

	.radial-progress {
		width: 95%;
		height: 95%;
        color: black;
        font-size: 1rem;
        font-weight: bold;
	}

    

	@media (min-width: 768px) {
		.card-container {
			flex-direction: row;
			flex-wrap: wrap;
			column-gap: 3rem;
			align-items: stretch;
		}
	}

	.type {
		color: cyan;
	}

	.stats {
		width: 100%;
		text-align: center;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	.card-title {
		padding: 4px;
		border-radius: 5px;
		text-align: center;
		font-size: 1.1rem;
		text-shadow: 3px 2px 20px rgba(0, 0, 0, 1);
		line-height: 1.2rem;
		margin-top: 0.25rem;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 5px;
		font-size: 0.85rem;
	}

	.modal-image-overview {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.modal-stack {
		display: flex;
		max-width: 700px;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1rem;
	}

	.modal-backdrop {
		background-color: rgba(0, 0, 23, 0.4);
		backdrop-filter: blur(5px);
	}

	.modal-box {
		width: 95%;
		max-width: 700px;
		box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.5);
	}

	.movie-poster-modal {
		width: 300px;
		height: 250px;
	}

	.modal p {
		margin: 0;
		padding: 0;
	}

	@media (min-width: 768px) {
		.modal-image-overview {
			display: block;
		}
		.movie-poster-modal {
			float: left;
			margin-right: 1rem;
		}

		.stats {
			font-size: 1rem;
		}
	}
</style>
