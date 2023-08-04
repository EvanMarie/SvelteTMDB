<script>
	import { filterStore } from '../lib/store.js'; // adjust the path if needed

	let filter = $filterStore;

	function handleChange(event) {
		filterStore.set(event.target.value);
	}
</script>

<div class="filter-container">
	<label for="filter">Filter by: </label>
	<select bind:value={filter} id="filter" on:change={handleChange}>
		<option value="popular">Popular</option>
		<option value="top_rated">Top Rated</option>
		<option value="upcoming">Upcoming</option>
		<option value="now_playing">Now Playing</option>
	</select>
</div>



<style>
select {
    padding: 0.25rem;
    border-radius: 0.5rem;
    border: 1px solid cyan;
}

.filter-container {
	display: flex;
	align-items: center;
	margin-bottom: 1rem;
    font-size: 1rem;
}

.filter-container label {
    margin-right: 0.75rem;
}

@media (min-width: 768px) {
    .filter-container {
        font-size: 1.5rem;
    }
}
</style>
