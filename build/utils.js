const Path = require("path");
const fs = require("fs");
const electron = require("electron");
const axios = require("axios").default;
const { app } = electron;

module.exports = {
    getPicPath : (img_id) => {
        const dir = Path.resolve(app.getPath("pictures"), "./SFW-wallpapers");
        // console.log(app.getPath("pictures"));
        // console.log(dir);
        if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, '0744');
        }
        return Path.resolve(app.getPath("pictures"), "./SFW-wallpapers", `${img_id}.jpeg`)
    },
    
    downloadImg: async (img_url,img_id) => {
        // Downloads the image on image url with axios
        console.log(img_url);
        const path = module.exports.getPicPath(img_id);
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
    
}