(async function loadSalespeople() {
	if (!window.supabaseClient) {
		console.warn('[Salespeople] Supabase client not ready');
		return;
	}
	const selectEl = document.getElementById('salesperson-1');
	const descEl = document.getElementById('salesperson-1-input');
	if (!selectEl) return;

	try {
		// Adjust table/columns to your actual schema
		const { data, error } = await window.supabaseClient
			.from('salespeople')
			.select('id, code, name')
			.order('name', { ascending: true });
		if (error) throw error;

		// Clear existing options except the first placeholder
		for (let i = selectEl.options.length - 1; i >= 1; i--) {
			selectEl.remove(i);
		}

		(data || []).forEach(sp => {
			const opt = document.createElement('option');
			opt.value = sp.code || sp.id;
			opt.textContent = sp.name || sp.code || sp.id;
			opt.dataset.name = sp.name || '';
			selectEl.appendChild(opt);
		});

		selectEl.addEventListener('change', () => {
			const option = selectEl.selectedOptions[0];
			descEl.value = option?.dataset?.name || '';
		});
	} catch (e) {
		console.error('[Salespeople] Failed to load:', e);
	}
})();
