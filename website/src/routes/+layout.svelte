<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { writable } from 'svelte/store';
	let { children } = $props();

	// Use a Svelte store for navOpen so updates are reactive
	const navOpen = writable(false);
</script>

<nav class="bg-mano-800 border-mano-600 w-full border-b-2 shadow-lg relative z-50">
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
			<!-- GitHub Link -->
			<a
				href="https://github.com/doper1/POK"
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center justify-center text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 transition-colors"
				aria-label="View POK project on GitHub"
			>
				<svg 
					width="20" 
					height="20" 
					viewBox="0 0 24 24" 
					fill="currentColor"
					class="text-mano-300"
				>
					<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
				</svg>
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
</nav>

<!-- Mobile Navigation Overlay -->
{#if $navOpen}
	<div class="fixed top-20 left-0 w-full bg-mano-800 border-b-2 border-mano-600 shadow-lg z-40 md:hidden">
		<div class="px-4 py-4 space-y-2">
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
			<!-- GitHub Link -->
			<a
				href="https://github.com/doper1/POK"
				target="_blank"
				rel="noopener noreferrer"
				onclick={() => navOpen.set(false)}
				class="inline-flex items-center gap-2 text-ubuntu text-mano-100 hover:text-mano-50 hover:bg-mano-700 rounded-md px-3 py-2 font-bold transition-colors"
				aria-label="View POK project on GitHub"
			>
				<svg 
					width="20" 
					height="20" 
					viewBox="0 0 24 24" 
					fill="currentColor"
					class="text-mano-300"
				>
					<path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
				</svg>
				GitHub
			</a>
		</div>
	</div>
{/if}

{@render children()}
