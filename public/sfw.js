const axios = require('axios');
const Store = require("electron-store");

const get_tm = (hour) => {
    if (hour<6 || hour>=20) {
        return "night";
    }
    if (hour<8 || hour>=18) {
        return "sunrise";
    }
    if (hour<11){
        return "morning";
    }
    if (hour > 14){
        return "afternoon";
    }
    return "noon";
}

module.exports = {
    recommend: async () => {
        const store = new Store()
        const token = store.get('token');
        let cur = new Date();
        let h = cur.getHours();
        console.log(get_tm(h));
        const url = `https://api.scan4wall.xyz/token-recommendation?access_token=${token}&dtime=${get_tm(h)}`
        let img_id = 'random';
        let blur_hash = 'L#LNrwR*NGWB~XWBWBj[IUayj[j[';
        await axios
            .get(url)
            .then(
                (response) => {
                    console.log(response.data['recommendation']);
                    img_id = response.data['recommendation'];
                    blur_hash = response.data['blur_hash'];
                }
            )
            .catch(()=>{
                img_id =  "random";
            })
        return {
            'img_id': img_id,
            'blur_hash': blur_hash
        };
    }
}