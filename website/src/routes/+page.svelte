<svelte:head>
	<title>How to Play Poker</title>
	<meta name="description" content="Learn how to play poker and use game commands" /><script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877463839498887"
		crossorigin="anonymous"
	></script>
</svelte:head>

<div data-theme="mona" class="px-2 py-4">
	<div class="space-y-4">
		<!-- Poker Basics -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<h2 class="text-ubuntu text-mano-100 text-lg font-semibold mb-3">Poker Basics</h2>
			<div class="text-mano-300 text-sm space-y-3">
				<p>🏆 <strong>Objective:</strong> Make the best 5-card hand or convince others to fold.</p>
				
				<ol class="list-decimal list-inside space-y-2">
					<li><strong>Blinds:</strong> Forced bets to start the action (Small Blind & Big Blind)</li>
					<li><strong>Dealing:</strong> Each player gets 2 hidden cards (hole cards)</li>
					<li><strong>Betting Rounds:</strong>
						<ul class="list-disc list-inside ml-4">
							<li>Pre-flop: Bet before community cards are revealed</li>
							<li>Flop: 3 community cards revealed</li>
							<li>Turn: 4th community card</li>
							<li>River: Final community card</li>
						</ul>
					</li>
					<li><strong>Showdown:</strong> Remaining players reveal their hands</li>
				</ol>

    <p>🃏 <strong>Hand Rankings:</strong></p>
    <p class="ml-4">
        <a href="/poker-hands" class="text-mano-100 hover:text-mano-200 underline">
            View detailed poker hand rankings
        </a>
    </p>
			</div>
		</div>

		<!-- Game Commands Section -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<h2 class="text-ubuntu text-mano-100 text-lg font-semibold mb-2">Game Setup</h2>
			<ul class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">join [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Join game (add chips with optional amount)</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">start</code>
					<p class="text-mano-300 mt-1 text-xs">Begin game with joined players</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">buy [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Add more chips during game</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">small/big [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Set blind amounts</p>
				</li>
			</ul>
		</div>

		<!-- Betting Section -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<h2 class="text-ubuntu text-mano-100 text-lg font-semibold mb-2">During Gameplay</h2>
			<ul class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">check</code>
					<p class="text-mano-300 mt-1 text-xs">Pass without betting</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">call</code>
					<p class="text-mano-300 mt-1 text-xs">Match current bet</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">raise [amount]</code>
					<p class="text-mano-300 mt-1 text-xs">Increase the bet</p>
				</li>
				<li class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">fold</code>
					<p class="text-mano-300 mt-1 text-xs">Quit current round</p>
				</li>
			</ul>
		</div>

		<!-- Game Management -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<h2 class="text-ubuntu text-mano-100 text-lg font-semibold mb-2">Game Management</h2>
			<div class="grid grid-cols-2 gap-2 md:grid-cols-4 lg:grid-cols-5">
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">show</code>
					<p class="text-mano-300 mt-1 text-xs">Display current game status</p>
				</div>
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">exit</code>
					<p class="text-mano-300 mt-1 text-xs">Leave current game</p>
				</div>
				<div class="bg-mano-700 hover:bg-mano-600 rounded p-2 transition-colors">
					<code class="text-mano-100 font-mono text-sm">end</code>
					<p class="text-mano-300 mt-1 text-xs">Terminate game for all</p>
				</div>
			</div>
		</div>

		<!-- Key Notes -->
		<div class="bg-mano-800 border-mano-600 rounded-lg border p-3 shadow-md">
			<div class="space-y-2">
				<p class="text-mano-100 text-sm font-medium">
					💰 <strong>Starting Chips:</strong> <span class="text-mano-300">$1000 (shared across all games)</span>
				</p>
				<p class="text-mano-100 text-sm font-medium">
					📌 <strong>Important:</strong> <span class="text-mano-300">All commands must be used in the group chat!</span>
				</p>
				<p class="text-mano-300 text-sm italic">
					🌍 <strong>Tip:</strong> Commands work in any language - just keep the format!
				</p>
			</div>
		</div>
	</div>
</div>