const axios = require('axios');
const Store = require("electron-store");

module.exports = {
    recommend: async () => {
        const store = new Store()
        const token = store.get('token');
        const url = `https://api.scan4wall.xyz/token-recommendation?access_token=${token}`
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