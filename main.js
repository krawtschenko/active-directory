const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");

const WINDOW_STATE_FILE = "window-state.json";
const DEFAULT_WINDOW_SIZE = {
  width: 1250,
  height: 800,
};

function getWindowStatePath() {
  return path.join(app.getPath("userData"), WINDOW_STATE_FILE);
}

function loadWindowState() {
  try {
    const stateFile = getWindowStatePath();
    if (!fs.existsSync(stateFile)) return DEFAULT_WINDOW_SIZE;

    const savedState = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
    if (
      typeof savedState?.width === "number" &&
      typeof savedState?.height === "number"
    ) {
      return savedState;
    }
  } catch (error) {
    console.error("Unable to read window state:", error);
  }

  return DEFAULT_WINDOW_SIZE;
}

function saveWindowState(mainWindow) {
  try {
    const { width, height, x, y } = mainWindow.getBounds();
    const stateFile = getWindowStatePath();
    fs.writeFileSync(stateFile, JSON.stringify({ width, height, x, y }, null, 2), "utf-8");
  } catch (error) {
    console.error("Unable to save window state:", error);
  }
}

function createWindow() {
  const { width, height, x, y } = loadWindowState();

  const mainWindow = new BrowserWindow({
    width,
    height,
    ...(x !== undefined && y !== undefined ? { x, y } : {}),
    icon: path.join(__dirname, "build", "icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
  //   mainWindow.webContents.openDevTools();

  // Відключаємо меню
  mainWindow.removeMenu(); // Викликаємо метод як функцію

  mainWindow.on("resize", () => saveWindowState(mainWindow));
  mainWindow.on("move", () => saveWindowState(mainWindow));
  mainWindow.on("close", () => saveWindowState(mainWindow));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
