
document.addEventListener('DOMContentLoaded', function() {
  const codeInput = document.getElementById('payment-type-code');
  const descInput = document.getElementById('payment-type-default');
  
  // Dictionary mapping codes to full descriptions
  const codeDictionary = {
    'AR-10': 'AR - 10 Days To Pay',
    'AR-15': 'AR - 15 Days To Pay',
    'AR-30': 'AR - 30 Days To Pay ',
    'COD': 'Paid Prior To Delivery',
    'PMCOD': 'Property Manager - Paid'
    // Add more mappings as needed
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
  });
  
  // Update code when description changes
  descInput.addEventListener('input', function() {
    const desc = this.value.trim();
    const lowerDesc = desc.toLowerCase();
    
    // 1. Check for exact match in dictionary
    if (descDictionary[lowerDesc]) {
      codeInput.value = descDictionary[lowerDesc];
      return;
    }
    
    // 2. Smart abbreviation for new entries
    let abbreviation = '';
    
    // Handle Danny's Warranty -> D-WTY pattern
    if (/danny['\s]?s? warranty/i.test(desc)) {
      abbreviation = 'D-WTY';
    }
    // Handle other special cases here...
    else {
      // Default abbreviation logic: first letters of words
      abbreviation = desc.split(/\s+/)
        .map(word => word.charAt(0).toUpperCase())
        .join('');
      
      // Special handling for single long words
      if (desc.split(/\s+/).length === 1 && desc.length > 3) {
        abbreviation = desc.substring(0, 3).toUpperCase();
      }
    }
    
    codeInput.value = abbreviation;
  });
  
  // Initialize with first dictionary entry if empty
  if (!codeInput.value && !descInput.value && Object.keys(codeDictionary).length > 0) {
    const firstCode = Object.keys(codeDictionary)[0];
    codeInput.value = firstCode;
    descInput.value = codeDictionary[firstCode];
  }
});
