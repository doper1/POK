import { error } from '@sveltejs/kit';
import { API_ADDRESS } from '$env/static/private';

export async function load({ fetch }) {
	const apiUrl = API_ADDRESS;

	if (!apiUrl) {
		throw error(500, 'API_ADDRESS is not set in environment variables');
	}

	try {
		const response = await fetch(`${apiUrl}/api/get-leaderboard?amount=10`);

		if (!response.ok) {
			throw error(response.status, 'Failed to fetch leaderboard data');
		}

		const data = await response.json();
		return { leaderboard: data.leaderboard };
	} catch (err) {
		console.error('Error fetching leaderboard:', err);
		throw error(500, 'An error occurred while fetching the leaderboard');
	}
}
