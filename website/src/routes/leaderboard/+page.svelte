<script>
	export let data;
	const { leaderboard } = data;
</script>

<svelte:head>
	<title>Leaderboard</title>
	<meta name="description" content="Pok leaderboard" /><script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877463839498887"
		crossorigin="anonymous"
	></script>
</svelte:head>

<main class="container">
	{#if leaderboard && leaderboard.length > 0}
		<table class="leaderboard-table">
			<thead>
				<tr>
					<th>Rank</th>
					<th>Player</th>
					<th>Money</th>
				</tr>
			</thead>
			<tbody>
				{#each leaderboard as entry, index (entry.id)}
					<tr>
						<td>{index + 1}</td>
						<td>*********{entry.id_last_3}</td>
						<td>{entry.money}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{:else}
		<p class="no-data">No leaderboard data available.</p>
	{/if}
</main>

<style>
	/* Skeleton's Mano theme colors */
	:root {
		--background: #161616;
		--primary: #f4a261;
		--secondary: #e76f51;
		--highlight: #2a9d8f;
		--text-color: #ffffff;
		--text-muted: #b0b0b0;
		--border-color: #444;
		--row-alt: rgba(255, 255, 255, 0.07);
		--row-hover: rgba(255, 255, 255, 0.12);
	}

	.container {
		max-width: 800px;
		margin: 2rem auto;
		/* padding: 1.5rem; */
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.02);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.leaderboard-table {
		width: 100%;
		border-collapse: collapse;
		overflow: hidden;
		border-radius: 12px;
	}

	.leaderboard-table thead {
		background-color: var(--highlight);
	}

	.leaderboard-table th {
		padding: 1rem;
		text-align: left;
		font-weight: 700;
		text-transform: uppercase;
	}

	.leaderboard-table td {
		padding: 1rem;
		border-bottom: 1px solid var(--border-color);
		font-size: 1.1rem;
	}

	/* Alternating row colors */
	.leaderboard-table tbody tr:nth-child(even) {
		background-color: var(--row-alt);
	}

	.leaderboard-table tbody tr:hover {
		background-color: var(--row-hover);
		transition: background 0.2s ease-in-out;
	}

	/* No data message */
	.no-data {
		text-align: center;
		margin-top: 2rem;
		font-size: 1.3rem;
		font-weight: 500;
		color: var(--text-muted);
	}
</style>
