<svelte:head>
    <title>Official Poker Hand Rankings</title>
    <meta name="description" content="Clear visual guide to poker hand strengths from strongest to weakest" />
    <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4877463839498887"
        crossorigin="anonymous"
    ></script>
</svelte:head>

<div data-theme="mona" class="px-2 py-4">
    <div class="max-w-4xl mx-auto space-y-6">
        <!-- Header -->
        <div class="text-center mb-8">
            <h1 class="text-ubuntu text-mano-100 text-3xl font-bold mb-3">
                Official Poker Hand Rankings
            </h1>
            <p class="text-mano-300 text-sm">
                Ranked from strongest (1) to weakest (10)
            </p>
        </div>

        <!-- Hands Ranking -->
        <div class="bg-mano-800 border-mano-600 rounded-lg border shadow-md">
            <div class="divide-y divide-mano-600">
                <!-- Royal Flush -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">1</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Royal Flush</div>
                            <div class="text-mano-300 text-sm">A-K-Q-J-10 same suit</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/royal-flush.webp"
                                alt="Royal flush"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Straight Flush -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">2</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Straight Flush</div>
                            <div class="text-mano-300 text-sm">5 consecutive same suit</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/straight-flush.webp"
                                alt="Straight flush"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Four of a Kind -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">3</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Four of a Kind</div>
                            <div class="text-mano-300 text-sm">All four cards of same rank</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/four-of-a-kind.webp"
                                alt="Four of a kind"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Full House -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">4</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Full House</div>
                            <div class="text-mano-300 text-sm">Three + pair</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/full-house.webp"
                                alt="Full House"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Flush -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">5</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Flush</div>
                            <div class="text-mano-300 text-sm">Any 5 same suit</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/flush.webp"
                                alt="Flush"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Straight -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">6</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Straight</div>
                            <div class="text-mano-300 text-sm">5 consecutive ranks</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/straight.webp"
                                alt="Straight"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Three of a Kind -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">7</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Three of a Kind</div>
                            <div class="text-mano-300 text-sm">Three same rank</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/three-of-a-kind.webp"
                                alt="Three of a kind"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- Two Pair -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">8</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">Two Pair</div>
                            <div class="text-mano-300 text-sm">Two different pairs</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/two-pair.webp"
                                alt="Two pair"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- One Pair -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">9</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">One Pair</div>
                            <div class="text-mano-300 text-sm">Two same rank</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/pair.webp"
                                alt="Pair"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>

                <!-- High Card -->
                <div class="p-4 hover:bg-mano-700 transition-colors">
                    <div class="grid grid-cols-12 items-center gap-4">
                        <div class="col-span-1 text-mano-100 font-bold text-center text-xl">10</div>
                        <div class="col-span-3">
                            <div class="text-mano-100 font-semibold">High Card</div>
                            <div class="text-mano-300 text-sm">No matching cards</div>
                        </div>
                        <div class="col-span-8 flex justify-center">
                            <img
                                src="example-hands/high-card.webp"
                                alt="High Card"
                                class="rounded-lg w-full max-w-md object-contain shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Key Takeaways section remains unchanged -->
    </div>
</div>
