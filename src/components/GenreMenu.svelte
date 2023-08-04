<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { fetchGenres } from '../lib/fetchFilms';

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
        dispatch('genreChange', selectedGenre);
    }
</script>


<div class="select-container">
<label>
    Filter by Genre:
    <select bind:value={selectedGenre} on:change={handleGenreChange}>
        <option value="">Select Genre</option>
        {#each genres as genre}
            <option value={genre.id}>{genre.name}</option>
        {/each}
    </select>
</div>
