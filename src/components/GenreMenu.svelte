<script>
  import { genreStore } from '../lib/store.js';
  import { onMount } from 'svelte';

  let selectedGenre = null;

  onMount(() => {
    // Call fetchGenres when component is mounted
    fetchGenres();
  });

  function handleGenreChange(event) {
    selectedGenre = event.target.value;
    // Call function to load movies with selected genre
  }
</script>

<select bind:value={selectedGenre} on:change={handleGenreChange}>
  <option value="">Select Genre</option>
  {#each $genreStore as genre}
    <option value={genre.id}>{genre.name}</option>
  {/each}
</select>
