
const { contextBridge, ipcRenderer } = require('electron');

// We'll store the user info when login is successful
let currentUser = null;

// Listen for the user-updated event from the main process
ipcRenderer.on('user-updated', (_event, user) => {
    currentUser = user;
});

contextBridge.exposeInMainWorld('electron', {
    getCurrentUser: () => currentUser,
    onUserUpdated: (callback) => ipcRenderer.on('user-updated', () => callback()),
	    openAddInvoiceWindow: () => ipcRenderer.send('open-add-invoice-window'),
    openMapping: () => ipcRenderer.send('open-mapping'),
    openPurchasingMaintenance: () => ipcRenderer.send('open-purchasing-maintenance'),
    openAddPo: () => ipcRenderer.send('open-add-po'),
    openRouting: () => ipcRenderer.send('open-routing'),
    openInvoiceMaintenance: () => ipcRenderer.send('open-invoice-maintenance'),
	openCustomizeHomeWindow: () => ipcRenderer.send('open-customize-home-window'),
	openSalesQueue: () => ipcRenderer.send('open-sales-queue'),
    openInvoicePosting: () => ipcRenderer.send('open-invoice-posting'),
	loginSuccess: (user) => ipcRenderer.send('login-success', user || null)
});
