const electron = require("electron");
const ipc = electron.ipcMain;

const { app, BrowserWindow } = electron;

const isDev = require("electron-is-dev");
const Store = require("electron-store");
const wallpaper = require("wallpaper");
const fs = require("fs");
const Path = require("path");
const axios = require("axios").default;
const { menubar } = require("menubar");

app.on('ready', () => {
  const options = {
    width: 400,
    height: 400,
    browserWindow: {
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        preload: __dirname + "/preload.js",
      }
    },
    index:
    (isDev
      ? "http://localhost:3000"
      : `file://${Path.join(__dirname, "../build/index.html")}`
    )
  }
  const mb = menubar(options);
  mb.on('ready', () => {
    console.log('Menubar app is ready.');
    mb.showWindow()
  });
});

const getPicPath = (img_id) => {
  const dir = Path.resolve(app.getPath("pictures"), "./SFW-wallpapers");
  console.log(app.getPath("pictures"));
  console.log(dir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, '0744');
  }
  return Path.resolve(app.getPath("pictures"), "./SFW-wallpapers", `${img_id}.jpeg`)
}

async function downloadImg(img_url,img_id) {
  // Downloads the image on image url with axios
  console.log(img_url);
  const path = getPicPath(img_id);
  const writer = fs.createWriteStream(path);
  console.log(path);
  const surl = String(img_url);
  const response = await axios({
    url: surl,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

ipc.on("set-token", (event, arg) => {
  const store = new Store();
  store.set("token", arg);
});

ipc.on("get-token", (event, arg) => {
  const store = new Store();
  event.returnValue = store.get("token");
});

ipc.on("recommend", (event, width, height) => {
  console.log(width, height);
  const store = new Store();
  const token = store.get("token");
  let img_id = "random";
  axios
    .get(`https://api.scan4wall.xyz/token-recommendation?access_token=${token}`)
    .then((res) => {
      console.log(res.data);
      img_id = res.data.recommendation;
      const url = `https://source.unsplash.com/${img_id}/${width}x${height}`;
      console.log(url);
      downloadImg(url,img_id)
        .then(() => {
          console.log("image downloaded!!!");
          wallpaper.set(getPicPath(img_id))
            .then(
              () => {
                console.log("All set!!!")
              }
            )
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});