const {app, BrowserWindow} = require("electron");
const path = require("path");

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 1100,
		height: 820,
		icon: path.join(__dirname, "build", "icon.png"),
		webPreferences: {
			nodeIntegration: true,
		},
	});

	mainWindow.loadFile(path.join(__dirname, "dist", "index.html"));
	//   mainWindow.webContents.openDevTools();

	// Відключаємо меню
	mainWindow.removeMenu(); // Викликаємо метод як функцію
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
