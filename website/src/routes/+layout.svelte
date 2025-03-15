<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	let { children } = $props();

	// Use a Svelte store for navOpen so updates are reactive
	const navOpen = writable(false);
</script>

<nav class="bg-mano-800 border-mano-600 w-full border-b-2 shadow-lg">
	<div class="px-4 py-3 flex items-center justify-between">
		<!-- Logo -->
		<a href="/" onclick={() => navOpen.set(false)}>
			<img src="/favicon.png" alt="Site Logo" class="h-16 w-16 rounded-lg" />
		</a>

		<!-- Desktop Navigation Links -->
		<div class="hidden md:flex space-x-4">
			<a
				href="/"
				class:text-mano-50={$page.url.pathname === '/'}
				class:bg-mano-700={$page.url.pathname === '/'}
				class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
			>
				How to play
			</a>
			<a
				href="/poker-hands"
				class:text-mano-50={$page.url.pathname === '/poker-hands'}
				class:bg-mano-700={$page.url.pathname === '/poker-hands'}
				class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
			>
				Poker Hands
			</a>
			<a
				href="/leaderboard"
				class:text-mano-50={$page.url.pathname === '/leaderboard'}
				class:bg-mano-700={$page.url.pathname === '/leaderboard'}
				class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
			>
				Leaderboard
			</a>
			<a
				href="/get-chips"
				class:text-mano-50={$page.url.pathname === '/get-chips'}
				class:bg-mano-700={$page.url.pathname === '/get-chips'}
				class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
			>
				Get More Chips
			</a>
			<a
				href="/about"
				class:text-mano-50={$page.url.pathname === '/about'}
				class:bg-mano-700={$page.url.pathname === '/about'}
				class="text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
			>
				About
			</a>
		</div>

		<!-- Mobile Menu Button -->
		<button class="md:hidden text-mano-100 focus:outline-none" onclick={() => navOpen.update(n => !n)}>
			<!-- Hamburger icon; shows X when open -->
			<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				{#if $navOpen}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				{:else}
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
				{/if}
			</svg>
		</button>
	</div>

	<!-- Mobile Navigation Links -->
	{#if $navOpen}
		<div class="px-4 pb-3 md:hidden">
			<div class="flex flex-col space-y-2">
				<a
					href="/"
					onclick={() => navOpen.set(false)}
					class:text-mano-50={$page.url.pathname === '/'}
					class:bg-mano-700={$page.url.pathname === '/'}
					class="block text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
				>
					How to play
				</a>
				<a
					href="/poker-hands"
					onclick={() => navOpen.set(false)}
					class:text-mano-50={$page.url.pathname === '/poker-hands'}
					class:bg-mano-700={$page.url.pathname === '/poker-hands'}
					class="block text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
				>
					Poker Hands
				</a>
				<a
					href="/leaderboard"
					onclick={() => navOpen.set(false)}
					class:text-mano-50={$page.url.pathname === '/leaderboard'}
					class:bg-mano-700={$page.url.pathname === '/leaderboard'}
					class="block text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
				>
					Leaderboard
				</a>
				<a
					href="/get-chips"
					onclick={() => navOpen.set(false)}
					class:text-mano-50={$page.url.pathname === '/get-chips'}
					class:bg-mano-700={$page.url.pathname === '/get-chips'}
					class="block text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
				>
					Get More Chips
				</a>
				<a
					href="/about"
					onclick={() => navOpen.set(false)}
					class:text-mano-50={$page.url.pathname === '/about'}
					class:bg-mano-700={$page.url.pathname === '/about'}
					class="block text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
				>
					About
				</a>
			</div>
		</div>
	{/if}
</nav>

{@render children()}
