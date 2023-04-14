<script lang="ts">
	import { goto } from '$app/navigation';
	import { validateTicketNumber } from '$lib/utils/validate';
	import QrScanner from '$lib/components/QrScanner/index.svelte';
	import { onMount } from 'svelte';

	let errorMessage: string;

	onMount(() => {
		setTimeout(function () {
			console.log('called');
			handleScanSuccess('LO 587888');
		}, 5000);
	});

	const handleScanSuccess = (data: string) => {
		if (!validateTicketNumber(data)) {
			errorMessage = 'Invalid Ticket';
			return
		}
		const route = `/result/14-04-2023?ticket=${encodeURIComponent(data)}`;

		goto(route, { replaceState: true });
	};
</script>

<QrScanner onScanSuccess={handleScanSuccess} />

{#if errorMessage}
	<p>{errorMessage}</p>
{/if}
