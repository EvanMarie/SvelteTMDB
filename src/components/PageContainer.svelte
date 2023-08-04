<div class="page-container">
	<slot />
</div>

<style>
	.page-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		padding-bottom: 40px;
		padding-top: 100px;
	}

	@media (min-width: 768px) {
		.page-container {
			padding-top: 40px;
		}
	}
</style>
