import axios from "axios";
let baseURL = "http://45.89.66.91:8765/api";

export default class sendApi {
    constructor(uri) {
        baseURL = uri;
    }

    async sendPost(obj, make, token) {
            try {
                const jsonHeader = {
                    "Content-type": "application/json",
                    "make": make,
                    "authorization": '' || token
                };
        
                let send = axios.create({
                    baseURL,
                    timeout: 10000,
                    headers: jsonHeader
                });
                const res = await send.post(baseURL, obj);
                console.log(res); 
                return res;
            }
            catch(e) {
                console.log(e)
                return (e.response)
            }
    }
}