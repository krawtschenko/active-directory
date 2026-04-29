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

function loadWindowSize() {
  try {
    const stateFile = getWindowStatePath();
    if (!fs.existsSync(stateFile)) return DEFAULT_WINDOW_SIZE;

    const savedState = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
    if (
      typeof savedState?.width === "number" &&
      typeof savedState?.height === "number"
    ) {
      return {
        width: savedState.width,
        height: savedState.height,
      };
    }
  } catch (error) {
    console.error("Unable to read window size state:", error);
  }

  return DEFAULT_WINDOW_SIZE;
}

function saveWindowSize(mainWindow) {
  try {
    const { width, height } = mainWindow.getBounds();
    const stateFile = getWindowStatePath();
    fs.writeFileSync(stateFile, JSON.stringify({ width, height }, null, 2), "utf-8");
  } catch (error) {
    console.error("Unable to save window size state:", error);
  }
}

function createWindow() {
  const { width, height } = loadWindowSize();

  const mainWindow = new BrowserWindow({
    width,
    height,
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

  mainWindow.on("resize", () => saveWindowSize(mainWindow));
  mainWindow.on("close", () => saveWindowSize(mainWindow));
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
