import axios from "axios";
let url;
let baseURL = "http://45.89.66.91:8765/api";

export default class sendApi {
    constructor(uri) {
        url = uri;
        baseURL = uri;
    }

    async sendGet(obj) {
        let uri = url+'?';
        return uri
        /*Object.keys(obj).map((key) => {
            if ((typeof(obj[key]==='object'))||(typeof(obj[key]==='array'))) {
                return 'typeError'
            }
            uri+=`${key}=${obj[key]}&`;
        })
        let response = await fetch(uri);          
        return await response.json();*/
    }

    async sendPost(obj, make, token) {
        console.log('post');
        console.log(obj);
        console.log(make);
        console.log(token);
        //if ((!(obj.hasOwnProperty('name')))&&(obj.name!=='')) 
        //{
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
                console.log('nop');
                console.log(e)
                return (e.response)
            }
        //}
        //else console.log('пусто')
    }

    async sendDelete(obj, make, token) {        
        const jsonHeader = {
            "Content-type": "application/json",
            "make": make,
            "authorization": '' || token
        };

        let send = axios.create({
            baseURL,
            headers: jsonHeader
        });
        console.log(obj)
        const res = await send.delete(baseURL, obj);
        console.log(res); 
        return res;
    }
}