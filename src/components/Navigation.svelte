<script>
	import FilterMenu from "./FilterMenu.svelte";

</script>
<div class="navigation-container">
<h1>Search</h1>
<FilterMenu/>
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