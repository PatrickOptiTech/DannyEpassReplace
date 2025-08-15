// Function to load sales queue data
async function loadSalesQueue() {
    try {
        const { data, error } = await window.supabaseClient
            .from('sales_queue')
            .select('*')
            .order('date', { ascending: false })
            .order('time', { ascending: false });

        if (error) throw error;

        const tbody = document.querySelector('tbody');
        tbody.innerHTML = '';

        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatDate(row.date)}</td>
                <td>${formatTime(row.time)}</td>
                <td>${row.name}</td>
                <td>${row.cell_phone || ''}</td>
                <td>${row.note || ''}</td>
                <td>${row.epass_user}</td>
            `;
            tr.addEventListener('click', () => selectRow(tr, row));
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error loading sales queue:', error);
        alert('Error loading sales queue data');
    }
}

// Function to handle row selection
function selectRow(tr, data) {
    document.querySelectorAll('tr.selected').forEach(row => row.classList.remove('selected'));
    tr.classList.add('selected');
    window.selectedQueueItem = data;
}

// Function to open add/edit form
function openForm(isEdit = false) {
    const form = document.createElement('div');
    form.className = 'modal-form';
    
    const title = isEdit ? 'Edit Queue Item' : 'Add Queue Item';
    const data = isEdit ? window.selectedQueueItem : {};
    
    form.innerHTML = `
        <div class="form-title-bar">
            <span>${title}</span>
            <button class="form-close">×</button>
        </div>
        <div class="form-content">
            <div class="form-row">
                <label>Name:</label>
                <input type="text" id="name" value="${data.name || ''}" required>
            </div>
            <div class="form-row">
                <label>Cell Phone:</label>
                <input type="text" id="cell_phone" value="${data.cell_phone || ''}" 
                    placeholder="(XXX) XXX-XXXX">
            </div>
            <div class="form-row">
                <label>Note:</label>
                <input type="text" id="note" value="${data.note || ''}">
            </div>
            <div class="form-buttons">
                <button class="win95-btn" id="btnSave">Save</button>
                <button class="win95-btn" id="btnFormCancel">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(form);

    // Handle form close
    form.querySelector('.form-close').onclick = () => form.remove();
    form.querySelector('#btnFormCancel').onclick = () => form.remove();

    // Handle form save
    form.querySelector('#btnSave').onclick = async () => {
        const formData = {
            name: document.getElementById('name').value,
            cell_phone: document.getElementById('cell_phone').value,
            note: document.getElementById('note').value,
            epass_user: window.electron.getCurrentUser().displayName || window.electron.getCurrentUser().username // Use display name or username
        };

        if (!formData.name) {
            alert('Name is required');
            return;
        }

        try {
            let result;
            if (isEdit) {
                result = await window.supabaseClient
                    .from('sales_queue')
                    .update(formData)
                    .eq('id', data.id);
            } else {
                result = await window.supabaseClient
                    .from('sales_queue')
                    .insert([formData]);
            }

            if (result.error) throw result.error;
            
            form.remove();
            await loadSalesQueue();
        } catch (error) {
            console.error('Error saving queue item:', error);
            alert('Error saving data');
        }
    };
}

// Function to delete selected item
async function deleteQueueItem() {
    if (!window.selectedQueueItem) {
        alert('Please select an item to delete');
        return;
    }

    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        const { error } = await window.supabaseClient
            .from('sales_queue')
            .delete()
            .eq('id', window.selectedQueueItem.id);

        if (error) throw error;
        
        await loadSalesQueue();
    } catch (error) {
        console.error('Error deleting queue item:', error);
        alert('Error deleting item');
    }
}

// Helper functions
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(time) {
    if (!time) return '';
    // Handle both full timestamps and time-only strings
    const date = time.includes('T') ? new Date(time) : new Date(`1970-01-01T${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Export functions
window.salesQueueHandler = {
    loadSalesQueue,
    openForm,
    deleteQueueItem
};
