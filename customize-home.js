(function initCustomizeHome(){
  const ACTIONS = [
    { slug: 'invoice_maintenance', label: 'Invoice maintenance', emoji: '🗂️' },
    { slug: 'add_invoice', label: 'add invoice', emoji: '📄' },
    { slug: 'quick_cash_sale', label: 'quick cash sale', emoji: '💵' },
    { slug: 'invoice_posting', label: 'invoice posting', emoji: '🗄️' },
    { slug: 'service_requests', label: 'service requests', emoji: '🛠' },
    { slug: 'routing', label: 'routing', emoji: '🚚' },
    { slug: 'mapping', label: 'mapping', emoji: '🗺️' },
    { slug: 'purchasing_maintenance', label: 'purchasing maintenance', emoji: '🗃️' },
    { slug: 'add_po', label: 'add po', emoji: '📝' },
    { slug: 'supplier_maintenance', label: 'supplier maintenance', emoji: '🏭' },
    { slug: 'item_maintenance', label: 'item maintenance', emoji: '📦' },
    { slug: 'print_item_lables', label: 'print item lables', emoji: '🔖' },
    { slug: 'serial_mainenance', label: 'serial mainenance', emoji: '⛆' },
    { slug: 'print_price_tags', label: 'print price tags', emoji: '🏷️' },
    { slug: 'print_serial_labels', label: 'print serial labels', emoji: '⛆' },
    { slug: 'print_serial_labels_by_po', label: 'print serial labels by po', emoji: '⛆' },
    { slug: 'customer_maintenance', label: 'customer maintenance', emoji: '👥' },
    { slug: 'customer_history', label: 'customer history', emoji: '📓' },
    { slug: 'ar_transactions', label: 'a/r transactions', emoji: '📒' },
    { slug: 'ar_payment', label: 'a/r payment', emoji: '💳' },
    { slug: 'ar_posting', label: 'a/r posting', emoji: '📤' },
    { slug: 'ar_customer_balance', label: 'a/r customer balance', emoji: '💼' },
    { slug: 'ap_transaction', label: 'a/p transaction', emoji: '📒' },
    { slug: 'ap_posting', label: 'a/p posting', emoji: '📤' },
    { slug: 'ap_supplier_history', label: 'a/p supplier history', emoji: '🏭' },
    { slug: 'mailbox', label: 'mailbox', emoji: '📬' },
    { slug: 'text_messages', label: 'text messages', emoji: '💬' },
    { slug: 'system_maintenance', label: 'system maintenance', emoji: '🧩' },
    { slug: 'managers_dashboard', label: 'managers dashboard', emoji: '📊' },
    { slug: 'call_count_calendar', label: 'call cound calendar', emoji: '📅' },
  ];

  const ids = ['btn1','btn2','btn3','btn4','btn5','btn6','btn7','btn8'];

  function fill(select) {
    select.innerHTML = '';
    ACTIONS.forEach(a => {
      const o = document.createElement('option');
      o.value = a.slug;
      o.textContent = `${a.emoji || '📦'}  ${a.label}`;
      o.dataset.label = a.label;
      o.dataset.emoji = a.emoji || '';
      select.appendChild(o);
    });
  }

  ids.forEach(id => fill(document.getElementById(id)));

  // Restore (localStorage). Supports old label-based values by migrating to slug.
  const byLabel = Object.fromEntries(ACTIONS.map(a => [a.label.toLowerCase(), a.slug]));
  const saved = JSON.parse(localStorage.getItem('home-shortcuts') || '{}');
  ids.forEach(id => {
    const sel = document.getElementById(id);
    let val = saved[id];
    if (!val) return;
    // Migrate label -> slug if needed
    if (!ACTIONS.find(a => a.slug === val)) {
      const migrated = byLabel[(val || '').toLowerCase()];
      if (migrated) val = migrated;
    }
    if (ACTIONS.find(a => a.slug === val)) sel.value = val;
  });

  document.getElementById('save').addEventListener('click', () => {
    const result = {};
    ids.forEach(id => { result[id] = document.getElementById(id).value; }); // save slugs
    localStorage.setItem('home-shortcuts', JSON.stringify(result));
    try { localStorage.setItem('home-shortcuts-last-updated', Date.now().toString()); } catch {}
    window.close();
  });

  document.getElementById('exit').addEventListener('click', () => window.close());
})();
