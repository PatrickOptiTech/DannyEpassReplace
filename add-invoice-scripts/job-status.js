document.addEventListener('DOMContentLoaded', function() {
    const jobStatusSelect = document.getElementById('job-status');
    const jobStatusInput = document.getElementById('job-status-input');

    const codeDictionary = {
        'BOP': 'BACK ORDERED PART',
        'CXL': 'CANCELLED CALL OR SALE',
        'FINISHED': 'FINISHED',
        'NAOO': 'New Appliance On Order',
        'NIKKI': 'QUESTIONS FOR NIKKI',
        'PCPU': 'PARTS PICK UP',
        'PI': 'PARTS IN',
        'PNTBO': 'PARTS NEED TO BE ORDER',
        'POO': 'PARTS ON ORDER',
        'PREAUTH': 'WAITING ON PREAUTH',
        'PREDIA': 'PRE DIAGNOSE',
        'QUOTE': 'QUOTE OUT',
        'RESCH': 'RESCHEDULE',
        'RESEARCH': 'RESEARCH PART OR ISSUE FURTHER',
        'RTV': 'RETURN PARTS TO VENDOR',
        'SCHED': 'SCHEDULED DATE',
        'SCPU': 'SALES PICK UP',
        'SHOPSVC': 'SHOP SERVICE',
        'SVCMQ': 'SERVICE MANAGER QUESTIONS',
        'SWAP': 'SWAP OUT APP',
        'WHW': 'WHOLESALE WAITING LIST',
        'WOC': 'WAITING ON CUSTOMER',
        'WOS': 'WHOLESALE ON SCHEDULE FOR PU',
        'WPN': 'WAREHOUSE PARTS NEEDED',
        'WTYQ': 'WARRANTY QUESTIONS',
    };

    // Reverse dictionary for description-to-code lookup
    const descDictionary = {};
    for (const [code, desc] of Object.entries(codeDictionary)) {
        descDictionary[desc.toLowerCase()] = code;
    }

    // Update description when code changes
    jobStatusSelect.addEventListener('input', function() {
        const code = this.value.trim().toUpperCase();
        if (codeDictionary[code]) {
            jobStatusInput.value = codeDictionary[code];
        }
    });

    // Update code when description changes
    jobStatusInput.addEventListener('input', function() {
        const desc = this.value.trim();
        const lowerDesc = desc.toLowerCase();

        // 1. Check for exact match in dictionary
        if (descDictionary[lowerDesc]) {
            jobStatusSelect.value = descDictionary[lowerDesc];
            return;
        }

        // 2. Smart abbreviation for new entries
        let abbreviation = '';

        // Handle Danny's Warranty -> D-WTY pattern
        if (/danny['\s]?s? warranty/i.test(desc)) {
            abbreviation = 'D-WTY';
        }
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

        jobStatusSelect.value = abbreviation;
    });

    // Initialize with first dictionary entry if empty
    if (!jobStatusSelect.value && !jobStatusInput.value && Object.keys(codeDictionary).length > 0) {
        const firstCode = Object.keys(codeDictionary)[0];
        jobStatusSelect.value = firstCode;
        jobStatusInput.value = codeDictionary[firstCode];
    }

});