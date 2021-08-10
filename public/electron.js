const electron = require("electron");
const Menu = electron.Menu;
const ipc = electron.ipcMain;

const { app, BrowserWindow } = electron;

const isDev = require("electron-is-dev");
const Store = require("electron-store");
const wallpaper = require("wallpaper");
const fs = require("fs");
const Path = require("path");
const axios = require("axios").default;
const { menubar } = require("menubar");
const { getPicPath, downloadImg } = require("./utils");
const { recommend } = require("./sfw");

app.on("ready", () => {
  const options = {
    width: 400,
    height: 500,
    showDockIcon: false,
    browserWindow: {
      vibrancy: 'popover',
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        webSecurity: false,
        preload: __dirname + "/preload.js",
      },
    },
    icon: Path.join(__dirname, "./icon.png"),
    index: isDev
      ? "http://localhost:3000"
      : `file://${Path.join(__dirname, "../build/index.html")}`,
  };
  const mb = menubar(options);
  let q = [];
  let bhlist = [];
  let width = 0;
  let height = 0;
  let dlding = false;

  const pr = async () => {
    if (dlding) return;
    dlding = true;
    console.log("pr called!");
    let res = await recommend();
    let img_id = res.img_id;
    let blur_hash = res.blur_hash;
    bhlist.push(blur_hash);
    console.log(img_id);
    let url = `https://ik.imagekit.io/sfwall/https://source.unsplash.com/${img_id}/${width}x${height}`;
    downloadImg(url, img_id).then(() => {
      q.push(img_id);
      dlding = false;
    });
  };

  ipc.on("recommend", (event) => {
    let img_id = "random";
    if (q.length > 0) {
      if (bhlist.length > 0) {
        let bhash = bhlist.shift();
        mb.window.webContents.send("setbhash",bhash);
      }
      img_id = q.shift();
      console.log(`Set wallpaper to: ${getPicPath(img_id)}`);
      mb.window.webContents.send("wpath", getPicPath(img_id));
      wallpaper.set(getPicPath(img_id));
      mb.window.webContents.send("status", "Wallpaper set!");
    } else {
      let preloaded = false;
      let rid = setInterval(() => {
        if (bhlist.length > 0 && !preloaded) {
          let bhash = bhlist.shift();
          mb.window.webContents.send("setbhash",bhash);
          preloaded = true;
        }
        if (q.length > 0) {
          console.log("Check finished!");
          img_id = q.shift();
          console.log(`Set wallpaper to: ${getPicPath(img_id)}`);
          mb.window.webContents.send("wpath", getPicPath(img_id));
          wallpaper.set(getPicPath(img_id));
          mb.window.webContents.send("status", "Wallpaper set!");
          clearInterval(rid);
        }
      }, 1000);
    }
    pr();
  });

  mb.on("ready", () => {
    console.log("Menubar app is ready.");
    mb.showWindow();
  });

  mb.on("after-create-window", () => {
    const contextMenu = Menu.buildFromTemplate ([
      {label: 'restart app', click: () => { mb.app.quit();mb.app.relaunch(); }},
      {type: 'separator'},
      {label: 'Quit', click: () => {mb.app.quit ();}}
    ])
    mb.tray.on ('right-click', () => {
        mb.tray.popUpContextMenu (contextMenu);
    })
    mb.app.dock.hide();
  });

  ipc.on("set-token", (event, arg) => {
    const store = new Store();
    store.set("token", arg);
    mb.window.webContents.send("update-token",arg);
  });

  ipc.on("get-token", (event, arg) => {
    const store = new Store();
    event.returnValue = store.get("token");
  });

  ipc.on("get-wpath", (event,arg) => {
    wallpaper.get()
      .then((resp)=>{
        event.returnValue = resp;
      })
  });

  ipc.on("set-dimensions", (event, wid, hei) => {
    width = wid;
    height = hei;
    pr();
    event.returnValue = true;
  });
});
