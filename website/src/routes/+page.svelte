<svelte:head>
	<title>How to play</title>
	<meta name="description" content="Pok how to play" /><script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877463839498887"
		crossorigin="anonymous"
	></script>
</svelte:head>

<div data-theme="mona" class="px-2 py-4">
	<div class="space-y-4">
		<!-- Game Commands Section -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<div class="mb-2 flex items-center gap-2">
				<h2 class="text-ubuntu text-mano-100 text-lg font-semibold">Game Actions</h2>
			</div>
			<ul class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">join [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Join game with optional buy-in</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">start</code>
					<p class="text-mano-300 mt-1 text-xs">Starts the game</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">exit</code>
					<p class="text-mano-300 mt-1 text-xs">Leave the game</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">end</code>
					<p class="text-mano-300 mt-1 text-xs">Ends the game for everyone</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">buy [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Buy more chips</p>
				</li>
			</ul>
		</div>

		<!-- Betting Section -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<div class="mb-2 flex items-center gap-2">
				<h2 class="text-ubuntu text-mano-100 text-lg font-semibold">Betting Commands</h2>
			</div>
			<ul class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">fold</code>
					<p class="text-mano-300 mt-1 text-xs">Fold your hand</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">check</code>
					<p class="text-mano-300 mt-1 text-xs">Check (if no bet has been made)</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">call</code>
					<p class="text-mano-300 mt-1 text-xs">Call the current bet</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">raise [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Raise the bet</p>
				</li>
			</ul>
		</div>

		<!-- Blinds Section -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<div class="mb-2 flex items-center gap-2">
				<h2 class="text-ubuntu text-mano-100 text-lg font-semibold">Blind Settings</h2>
			</div>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">small [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Set small blind</p>
				</div>
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">big [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Set big blind</p>
				</div>
			</div>
		</div>

		<!-- Game Info Section -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<div class="mb-2 flex items-center gap-2">
				<h2 class="text-ubuntu text-mano-100 text-lg font-semibold">Game Info</h2>
			</div>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">show</code>
					<p class="text-mano-300 mt-1 text-xs">Display game status</p>
				</div>
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">help</code>
					<p class="text-mano-300 mt-1 text-xs">Show commands list</p>
				</div>
			</div>
		</div>

		<!-- Important Notes -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<div class="space-y-2">
				<p class="text-mano-100 text-xs font-medium">
					💰 Starting balance: <span class="text-mano-300">$1000 (shared across all groups)</span>
				</p>
				<p class="text-mano-100 text-xs font-medium">
					📌 Remember: <span class="text-mano-300">All actions must be done in group chat!</span>
				</p>
				<p class="text-mano-300 text-xs italic">
					🌍 You can use any language for commands - just maintain the basic format!
				</p>
			</div>
		</div>
	</div>
</div>
