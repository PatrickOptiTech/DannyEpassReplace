
document.addEventListener('DOMContentLoaded', function() {
  const codeInput = document.getElementById('invoice-type-code');
  const descInput = document.getElementById('invoice-type-default');
  const baBuilderRow = document.getElementById('ba-builder-row');
  
  // Helper to toggle BA Builder visibility:
  function updateBaBuilderVisibility() {
    const hasCode = (codeInput.value || '').trim().length > 0;
    // Show BA Builder only when invoice type is empty; hide when filled
    if (baBuilderRow) baBuilderRow.style.display = hasCode ? 'none' : 'flex';
  }
  
  // Dictionary mapping codes to full descriptions
  const codeDictionary = {
    'D-WTY': 'DANNYS WARRANTY',
    'PT': 'PART SALES ONLY',
    'QT': 'SALES QUOTE',
    'SA': 'SALES INVOICE',
    'SV': 'SERVICE INVOICE',
    'WH': 'WHOLESALE INVOICE',
    'WHQ': 'WHOLESALE QUOTE',
    'WPEX': 'WHIRLPOOL PEX',
    'WTY': 'WTY SVC ALL COVERED',
    'WTYL': 'WTY SVC LABOR ONLY COVERED',
    'WTYP': 'WTY SVC PARTS ONLY',
  };
  
  // Reverse dictionary for description-to-code lookup
  const descDictionary = {};
  for (const [code, desc] of Object.entries(codeDictionary)) {
    descDictionary[desc.toLowerCase()] = code;
  }
  
  // Update description when code changes
  codeInput.addEventListener('input', function() {
    const code = this.value.trim().toUpperCase();
    if (codeDictionary[code]) {
      descInput.value = codeDictionary[code];
    }
    updateBaBuilderVisibility();
  });
  
  // Update code when description changes
  descInput.addEventListener('input', function() {
    const desc = this.value.trim();
    const lowerDesc = desc.toLowerCase();
    if (descDictionary[lowerDesc]) {
      codeInput.value = descDictionary[lowerDesc];
      updateBaBuilderVisibility();
      return;
    }
    let abbreviation = '';
    if (/danny['\s]?s? warranty/i.test(desc)) {
      abbreviation = 'D-WTY';
    } else {
      abbreviation = desc.split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      if (desc.split(/\s+/).length === 1 && desc.length > 3) {
        abbreviation = desc.substring(0, 3).toUpperCase();
      }
    }
    codeInput.value = abbreviation;
    updateBaBuilderVisibility();
  });
  
  // Initialize with first dictionary entry if empty
  if (!codeInput.value && !descInput.value && Object.keys(codeDictionary).length > 0) {
    // leave empty by default so BA Builder shows when empty, per requirement
  }
  
  // Run once on load to set initial visibility
  updateBaBuilderVisibility();
});
  