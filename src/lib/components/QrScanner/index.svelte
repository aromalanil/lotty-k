<script lang="ts">
	import { onMount } from 'svelte';
	import { Html5Qrcode } from 'html5-qrcode';

	let scanning = false;
	let html5Qrcode: Html5Qrcode;
	export let onScanSuccess: (scanResult: string) => unknown;
	export let onScanError: (scanError: string) => unknown = () => {};

	onMount(() => {
		html5Qrcode = new Html5Qrcode('render');
	});

	const handleScanSuccess = (data: string) => {
		html5Qrcode.stop();
		onScanSuccess(data);
	};

	const startScan = () => {
		Html5Qrcode.getCameras(); // To get User Permission

		html5Qrcode.start(
			{ facingMode: 'environment' },
			{ fps: 10, qrbox: { width: 250, height: 250 } },
			handleScanSuccess,
			onScanError
		);
		scanning = true;
	};

	const stopScan = async () => {
		await html5Qrcode.stop();
		scanning = false;
	};
</script>

<main>
	<reader id="render" />
	{#if scanning}
		<button on:click={stopScan}>Stop Scan</button>
	{:else}
		<button on:click={startScan}>Start Scan</button>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 20px;
	}
	reader {
		width: 50vh;
		min-height: 50vh;
		background-color: black;
	}
</style>
