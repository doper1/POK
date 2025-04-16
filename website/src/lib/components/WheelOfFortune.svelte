<script>
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	// Rewards counter
	let totalRewards = 0;
	let showRewardCode = false;
	let generatedCode = '';
	let isGeneratingCode = false;

	// Prizes configuration with their probabilities
	const prizes = [
		{ value: 'nothing', probability: 0.3, color: '#e74c3c' },
		{ value: '50', probability: 0.25, color: '#3498db' },
		{ value: '100', probability: 0.2, color: '#2ecc71' },
		{ value: '250', probability: 0.15, color: '#f1c40f' },
		{ value: '500', probability: 0.1, color: '#9b59b6' }
	];

	// Calculate segment angles
	const segments = [];
	let startAngle = 0;
	prizes.forEach(prize => {
		const angle = prize.probability * 360;
		segments.push({
			...prize,
			startAngle,
			endAngle: startAngle + angle,
			midAngle: startAngle + angle / 2
		});
		startAngle += angle;
	});

	// Wheel properties
	let wheelRotation = spring(0);
	let isSpinning = false;
	let spinComplete = false;
	let winningPrize = null;
	let canSpin = true;

	// Canvas references
	let canvas;
	let ctx;
	const wheelRadius = 150;
	const centerX = 200;
	const centerY = 200;

	// Optimized spin function
	function spinWheel() {
		if (!canSpin || isSpinning) return;
		
		isSpinning = true;
		spinComplete = false;
		canSpin = false;
		winningPrize = null;
		
		// Smoother rotation parameters
		const rotations = 3 + Math.random() * 2; // 3-5 rotations
		const targetRotation = $wheelRotation + (rotations * 360);
		
		// Improved spring animation
		wheelRotation.set(targetRotation, { 
			stiffness: 0.02,
			damping: 0.4,
			precision: 0.1
		});
		
		// Adjusted timing
		setTimeout(() => {
			spinComplete = true;
			determineWinner();
		}, 6500);

		setTimeout(() => {
			isSpinning = false;
			if (winningPrize !== 'nothing') {
				totalRewards += parseInt(winningPrize);
			}
			setTimeout(() => canSpin = true, 500);
		}, 7000);
	}

	function determineWinner() {
		const normalizedRotation = $wheelRotation % 360;
		const pointerAngle = (270 - normalizedRotation + 360) % 360;
		const winner = segments.find(segment => 
			pointerAngle >= segment.startAngle && 
			pointerAngle < segment.endAngle
		);
		winningPrize = winner.value;
	}

	function generateRandomId() {
		const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		return Array.from({length: 32}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
	}

	async function getRewards() {
		if (totalRewards <= 0 || isGeneratingCode) return;
		
		isGeneratingCode = true;
		const code = generateRandomId();
		
		try {
			const response = await fetch('/add-code', {
				method: 'POST',
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify({ id: code, amount: totalRewards })
			});
			
			if (response.ok) {
				generatedCode = code;
				showRewardCode = true;
				totalRewards = 0;
			}
		} finally {
			isGeneratingCode = false;
		}
	}

	function closeRewardCode() {
		showRewardCode = false;
	}

	function drawWheel() {
		if (!ctx) return;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		segments.forEach(segment => {
			const startRad = (segment.startAngle * Math.PI) / 180;
			const endRad = (segment.endAngle * Math.PI) / 180;
			
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, wheelRadius, startRad, endRad);
			ctx.closePath();
			
			ctx.fillStyle = segment.color;
			ctx.fill();
			
			// Draw text
			ctx.save();
			ctx.translate(centerX, centerY);
			ctx.rotate((segment.midAngle * Math.PI) / 180);
			ctx.textAlign = "center";
			ctx.fillStyle = "#ffffff";
			ctx.font = "bold 16px 'Ubuntu', sans-serif";
			ctx.fillText(segment.value === 'nothing' ? segment.value : '$' + segment.value, wheelRadius * 0.7, 0);
			ctx.restore();
		});
		
		// Center circle
		ctx.beginPath();
		ctx.arc(centerX, centerY, 15, 0, 2 * Math.PI);
		ctx.fillStyle = "#333";
		ctx.fill();
	}

	function updateWheel() {
		if (!ctx) return;
		
		ctx.save();
		ctx.translate(centerX, centerY);
		ctx.rotate(($wheelRotation * Math.PI) / 180);
		ctx.translate(-centerX, -centerY);
		drawWheel();
		ctx.restore();
		requestAnimationFrame(updateWheel);
	}
	
	onMount(() => {
		ctx = canvas.getContext("2d");
		updateWheel();
	});
</script>

<div data-theme="mona" class="wheel-container">
	<div class="max-w-lg mx-auto text-center">
		<h2 class="text-ubuntu text-mano-100 text-2xl font-bold mb-4">Spin the Wheel of Fortune!</h2>
		
		<div class="rewards-counter mb-6">
			<div class="text-mano-100">Total Rewards: <span class="text-xl font-bold text-yellow-400">${totalRewards}</span></div>
			<button 
				on:click={getRewards} 
				class="get-rewards-button" 
				class:disabled={totalRewards <= 0 || isGeneratingCode}
			>
				{isGeneratingCode ? 'Processing...' : 'Get Rewards'}
			</button>
		</div>
		
		<div class="wheel-wrapper">
			<div class="needle"></div>
			<div class="canvas-container">
				<canvas bind:this={canvas} width="400" height="400"></canvas>
			</div>
			
			<button 
				on:click={spinWheel} 
				class="spin-button"
				class:disabled={!canSpin || isSpinning}
			>
				{isSpinning ? 'Spinning...' : 'SPIN'}
			</button>
		</div>
		
		{#if winningPrize && spinComplete}
			<div class="prize-display">
				<h3 class="text-xl">You won: <span class="font-bold text-2xl text-yellow-400">
					{winningPrize === 'nothing' ? 'Nothing this time!' : `$${winningPrize}`}
				</span></h3>
			</div>
		{/if}
		
		<div class="disclaimer">
			<p>* All dollar amounts represent in-game currency with no real-world value.</p>
		</div>
	</div>
</div>

{#if showRewardCode}
	<div class="modal-backdrop">
		<div class="modal-content">
			<h3 class="text-xl mb-4">Your POK Code:</h3>
			<div class="code-display">
				<span class="code">{generatedCode}</span>
				<button class="copy-button" on:click={() => navigator.clipboard.writeText(generatedCode)}>Copy</button>
			</div>
			<p class="mt-4 text-sm">Send this code in a private message to "POK" on WhatsApp to receive your rewards!</p>
			<div class="mt-6">
				<button class="close-button" on:click={closeRewardCode}>Close</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.wheel-container {
		padding: 2rem;
		background-color: var(--mano-800);
		color: var(--mano-100);
		font-family: 'Ubuntu', sans-serif;
		position: relative;
		min-height: 100vh;
	}
	
	.rewards-counter {
		padding: 1rem;
		border-radius: 8px;
		background-color: var(--mano-700);
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
	}
	
	.wheel-wrapper {
		position: relative;
		width: 400px;
		height: 400px;
		margin: 0 auto;
		padding-bottom: 100px;
	}
	
	.needle {
		position: absolute;
		top: -15px;
		left: 50%;
		transform: translateX(-50%);
		width: 0;
		height: 0;
		border-left: 20px solid transparent;
		border-right: 20px solid transparent;
		border-top: 40px solid #ff6b6b;
		filter: drop-shadow(0 3px 5px rgba(0, 0, 0, 0.3));
		z-index: 10;
	}
	
	.spin-button {
		position: absolute;
		bottom: 30px;
		left: 50%;
		transform: translateX(-50%);
		background-color: #e74c3c;
		color: white;
		padding: 12px 50px;
		border-radius: 30px;
		font-size: 1.2rem;
		border: none;
		cursor: pointer;
		transition: all 0.3s ease;
		z-index: 20;
	}
	
	.spin-button:hover:not(:disabled) {
		background-color: #c0392b;
		transform: translateX(-50%) scale(1.05);
	}
	
	.spin-button:disabled {
		background-color: #95a5a6;
		cursor: not-allowed;
	}
	
	.disclaimer {
		margin-top: 2rem;
		padding-top: 1rem;
		color: var(--mano-300);
		font-size: 0.9rem;
		border-top: 1px solid var(--mano-600);
		position: relative;
		z-index: 1;
	}
	
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}
	
	.modal-content {
		background-color: var(--mano-800);
		padding: 2rem;
		border-radius: 12px;
		max-width: 90%;
		width: 500px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
	}
</style>