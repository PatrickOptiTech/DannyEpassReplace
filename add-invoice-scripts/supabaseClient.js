// Replace these at runtime or set on window before this script loads:
// window.SUPABASE_URL = 'https://YOUR-PROJECT.supabase.co';
// window.SUPABASE_ANON_KEY = 'YOUR-ANON-KEY';

// Initialize Supabase client
function initSupabase() {
    // Use your actual Supabase URL and anon key here
    const url = 'https://frzbvnjoihrsovruxaay.supabase.co';
    const anon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyemJ2bmpvaWhyc292cnV4YWF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzNTczNDcsImV4cCI6MjA2NTkzMzM0N30.4qNgM7ULfyuCQWsPpwXu8q_Aj7aFGcaPnJ0SvPFpvfQ';

    if (!window.supabase) {
        throw new Error('[Supabase] supabase-js not loaded. Ensure the CDN script is included before supabaseClient.js');
    }

    try {
        window.supabaseClient = window.supabase.createClient(url, anon);
        console.log('[Supabase] Client initialized successfully');
        
        // Test the connection
        window.supabaseClient
            .from('supplier')
            .select('count')
            .then(({ data, error }) => {
                if (error) {
                    console.error('[Supabase] Connection test failed:', error);
                } else {
                    console.log('[Supabase] Connection test successful:', data);
                }
            });
    } catch (e) {
        console.error('[Supabase] Failed to initialize client:', e);
        throw e;
    }
}

// Initialize when the script loads
initSupabase();

// Function to fetch and populate salesperson data
async function populateSalespersons() {
    const select1 = document.getElementById('salesperson-1');
    const desc1 = document.getElementById('salesperson-1-input');

    const select2 = document.getElementById('salesperson-2');
    const desc2 = document.getElementById('salesperson-2-input');
    
    if (!select1) {
        console.error('Salesperson 1 select element not found');
        return;
    }

    console.log('Fetching salespersons from Supabase...');
    
    try {
        // Fetch both code and description
        const { data, error } = await window.supabaseClient
            .from('salesperson')
            .select('code, description')
            .order('code', { ascending: true });
        
        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }
        
        console.log('Received data:', data);
        
        const optionsHtml = ['<option value="">Select...</option>'].concat(
            (data || []).map(sp => `<option value="${sp.code}" data-description="${(sp.description||'').replace(/"/g,'&quot;')}">${sp.code}</option>`)
        ).join('');
        
        // Populate Salesperson 1
        select1.innerHTML = optionsHtml;
        if (desc1) {
            select1.addEventListener('change', () => {
                const opt = select1.selectedOptions[0];
                desc1.value = opt ? (opt.dataset.description || '') : '';
            });
        }
        
        // Populate Salesperson 2 if exists
        if (select2) {
            select2.innerHTML = optionsHtml;
            if (desc2) {
                select2.addEventListener('change', () => {
                    const opt = select2.selectedOptions[0];
                    desc2.value = opt ? (opt.dataset.description || '') : '';
                });
            }
        }
        
    } catch (error) {
        console.error('Error fetching salespersons:', error);
        if (select1) select1.innerHTML = '<option value="">Error loading data</option>';
        if (select2) select2.innerHTML = '<option value="">Error loading data</option>';
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', populateSalespersons);