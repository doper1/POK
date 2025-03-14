<!-- src/routes/about/+page.svelte -->
<svelte:head>
	<title>About</title>
	<meta name="description" content="Learn about Pok - the poker bot for WhatsApp groups" /><script
		async
		src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877463839498887"
		crossorigin="anonymous"
	></script>
</svelte:head>

<div data-theme="mona" class="mx-auto max-w-4xl px-4 py-8">
	<div class="space-y-8">
		<!-- Hero Section -->
		<div class="bg-mano-800 border-mano-600 rounded-xl border-2 p-8 shadow-xl">
			<div class="flex flex-col items-center gap-6 md:flex-row">
				<div class="text-center md:text-left">
					<h2 class="text-ubuntu text-mano-100 mb-4 text-2xl font-semibold">
						Play Texas Hold'em Directly on WhatsApp!
					</h2>
					<p class="text-mano-300 text-lg leading-relaxed">
						Pok brings authentic poker experience to your WhatsApp groups.<br />
						Start games instantly, manage chips, and compete with friends -<br />
						all through simple chat commands.
					</p>
				</div>
			</div>
		</div>

		<!-- Features Grid -->
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div class="bg-mano-800 border-mano-600 rounded-xl border-2 p-6">
				<h3 class="text-ubuntu text-mano-100 mb-3 text-xl font-semibold">🚀 Instant Setup</h3>
				<p class="text-mano-300 leading-normal">
					Simply add Pok to any WhatsApp group to start playing.<br />
					No installations or downloads required!
				</p>
			</div>

			<div class="bg-mano-800 border-mano-600 rounded-xl border-2 p-6">
				<h3 class="text-ubuntu text-mano-100 mb-3 text-xl font-semibold">♠️ Current Game Mode</h3>
				<div class="text-mano-300 space-y-2">
					<p class="flex items-center gap-2">
						<span class="text-mano-100">•</span> Blinds system
					</p>
					<p class="flex items-center gap-2">
						<span class="text-mano-100">•</span> Full betting actions
					</p>
					<p class="flex items-center gap-2">
						<span class="text-mano-100">•</span> Chip management
					</p>
					<p class="flex items-center gap-2">
						<span class="text-mano-100">•</span> Game statistics
					</p>
				</div>
			</div>
		</div>

		<!-- How It Works -->
		<div class="bg-mano-800 border-mano-600 rounded-xl border-2 p-8 shadow-xl">
			<h2 class="text-ubuntu text-mano-100 mb-8 text-center text-2xl font-semibold">
				⚡ How It Works
			</h2>
			<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div class="p-4 text-center">
					<div class="mb-3 text-4xl">📥</div>
					<h3 class="text-ubuntu text-mano-100 mb-2 font-medium">Add to Group</h3>
					<p class="text-mano-300 text-sm">Invite Pok to any WhatsApp group</p>
				</div>
				<div class="p-4 text-center">
					<div class="mb-3 text-4xl">🎮</div>
					<h3 class="text-ubuntu text-mano-100 mb-2 font-medium">Start Game</h3>
					<p class="text-mano-300 text-sm">Use simple chat commands</p>
				</div>
				<div class="p-4 text-center">
					<div class="mb-3 text-4xl">🏆</div>
					<h3 class="text-ubuntu text-mano-100 mb-2 font-medium">Play & Win</h3>
					<p class="text-mano-300 text-sm">Compete with friends in real-time</p>
				</div>
			</div>
		</div>
	</div>
</div>
