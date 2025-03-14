<script>
	import '../app.css';
	import { page } from '$app/stores';
	let { children } = $props();
</script>

<nav class="bg-mano-800 border-mano-600 w-full border-b-2 shadow-lg">
	<div class="px-4 py-3">
		<div class="flex items-center gap-6">
			<!-- Logo -->
			<a href="/">
				<img src="/favicon.png" alt="Site Logo" class="ml-4 h-16 w-16 rounded-lg" />
			</a>

			<!-- Navigation Links - Bolder text -->
			<div class="flex space-x-4">
				<a
					href="/"
					class:text-mano-50={$page.url.pathname === '/'}
					class:bg-mano-700={$page.url.pathname === '/'}
					class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors hover:font-bold"
				>
					How to play
				</a>
				<a
					href="/leaderboard"
					class:text-mano-50={$page.url.pathname === '/leaderboard'}
					class:bg-mano-700={$page.url.pathname === '/leaderboard'}
					class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors hover:font-bold"
				>
					Leaderboard
				</a>
				<a
					href="/get-chips"
					class:text-mano-50={$page.url.pathname === '/get-chips'}
					class:bg-mano-700={$page.url.pathname === '/get-chips'}
					class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors hover:font-bold"
				>
					Get More Chips
				</a>
				<a
					href="/about"
					class:text-mano-50={$page.url.pathname === '/about'}
					class:bg-mano-700={$page.url.pathname === '/about'}
					class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors hover:font-bold"
				>
					About
				</a>
			</div>
		</div>
	</div>
</nav>

{@render children()}
