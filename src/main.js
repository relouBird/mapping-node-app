const {
  app,
  session,
  screen,
  BrowserWindow,
  ipcMain,
  Menu,
} = require("electron/main");
const path = require("path");

const createWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: width - 250,
    height: height - 150,
    title: "Memohub-App",
    icon: path.join(__dirname, "logo.ico"),
    frame: false,
    titleBarStyle: "hidden",
    backgroundColor: "#003366",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Intercepter les en-têtes pour autoriser le chargement
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const headers = { ...details.responseHeaders };

    // Supprimer les protections qui bloquent l'affichage
    delete headers["x-frame-options"];
    delete headers["X-Frame-Options"];
    delete headers["content-security-policy"]; // Optionnel, si CSP est trop restrictif

    callback({ responseHeaders: headers });
  });

  const menu = Menu.buildFromTemplate([]);
  win.setMenu(menu);

  win.loadFile("./resources/index.html");

  // Gestion des contrôles de fenêtre
  ipcMain.handle("minimize", () => {
    win.minimize();
    return "is-minimizer";
  });

  ipcMain.handle("maximize", () => {
    if (win.isMaximized()) {
      win.unmaximize();
    } else {
      win.maximize();
    }
    return "is-maximizer";
  });

  ipcMain.handle("close", () => {
    win.close();
    return "is-closer";
  });

  // Open the DevTools.
  /* The line `// win.webContents.openDevTools();` is a commented-out line of code in the provided
  JavaScript snippet. It is a way to open the DevTools for the Electron BrowserWindow instance
  `win`. */
  // win.webContents.openDevTools();
};

if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
