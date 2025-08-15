
const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');

let sessionUser = null;

function createWindow() {
  // Size the window to 90% of the available work area on the primary display
  const { width: displayWidth, height: displayHeight } = screen.getPrimaryDisplay().workAreaSize;
  const initialWidth = Math.round(displayWidth * 0.9);
  const initialHeight = Math.round(displayHeight * 0.9);

  const mainWindow = new BrowserWindow({
    width: initialWidth,
    height: initialHeight,
    minWidth: 1024,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
  });

  mainWindow.center();

  // Show login first
  const loginWindow = new BrowserWindow({
    width: 480,
    height: 560,
    title: 'Login',
    parent: mainWindow,
    modal: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  loginWindow.loadFile('login.html');

  ipcMain.once('login-success', (_e, user) => {
    sessionUser = user;
    // Broadcast the user info to all windows
    BrowserWindow.getAllWindows().forEach(win => {
      win.webContents.send('user-updated', user);
    });
    loginWindow.close();
    mainWindow.loadFile('index.html');
  });
}

ipcMain.on('open-mapping', () => {
  const mappingWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Dispatching Map',
    parent: BrowserWindow.getAllWindows()[0],
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  mappingWindow.loadFile('mapping.html');
});

ipcMain.on('open-purchasing-maintenance', () => {
  const purchasingWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Purchasing',
    parent: BrowserWindow.getAllWindows()[0],
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  purchasingWindow.loadFile('purchasing.html');
});

ipcMain.on('open-add-po', () => {
  const addPoWindow = new BrowserWindow({
    width: 800,
    height: 700,
    title: 'Add PO Header',
    parent: BrowserWindow.getAllWindows()[0],
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  addPoWindow.loadFile('add-po.html');
});

ipcMain.on('open-routing', () => {
  const routingWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Routing - SERVICE Department',
    parent: BrowserWindow.getAllWindows()[0],
    modal: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  routingWindow.loadFile('routing.html');
});

ipcMain.on('open-invoice-maintenance', () => {
  const maintenanceWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    title: 'Invoicing',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  maintenanceWindow.loadFile('invoice-maintenance.html');
});

ipcMain.on('open-add-invoice-window', () => {
    const addInvoiceWindow = new BrowserWindow({
        width: 1050,
        height: 720,
        title: 'Add Invoice',
        parent: BrowserWindow.getAllWindows()[0],
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    addInvoiceWindow.loadFile('add-invoice.html');
});

ipcMain.on('open-invoice-posting', () => {
    const invoicePostingWindow = new BrowserWindow({
        width: 500,
        height: 520,
        title: 'Invoice Posting & Daily Sales Summary',
        parent: BrowserWindow.getAllWindows()[0],
        modal: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    invoicePostingWindow.loadFile('invoice-posting.html');
    // Send user info once window is ready
    invoicePostingWindow.webContents.on('did-finish-load', () => {
        invoicePostingWindow.webContents.send('user-updated', sessionUser);
    });
});

ipcMain.on('open-customize-home-window', () => {
    const customizeWindow = new BrowserWindow({
        width: 780,
        height: 560,
        title: 'Home Screen Configuration',
        parent: BrowserWindow.getAllWindows()[0],
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        }
    });
    customizeWindow.loadFile('customize-home.html');
});

ipcMain.on('open-sales-queue', () => {
    const salesQueueWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Sales Queue',
        parent: BrowserWindow.getAllWindows()[0],
        modal: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    salesQueueWindow.loadFile('sales-queue.html');
    // Send user info once window is ready
    salesQueueWindow.webContents.on('did-finish-load', () => {
      salesQueueWindow.webContents.send('user-updated', sessionUser);
    });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
