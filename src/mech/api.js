import axios from "axios";
let url;
const baseURL = "http://45.89.66.91:8765/api";

export default class sendApi {
    constructor(uri) {
        url = uri;
    }

    async sendGet(obj) {
        let uri = url+'?';
        Object.keys(obj).map((key) => {
            if ((typeof(obj[key]==='object'))||(typeof(obj[key]==='array'))) {
                return 'typeError'
            }
            uri+=`${key}=${obj[key]}&`;
        })
        let response = await fetch(uri);          
        return await response.json();
    }

    async sendPost(obj, make, token) {
        console.log('post');
        console.log(obj)
        try {
            /*let response = await fetch(url, {
                method: 'POST',
                mode: 'no-cors',//'no-cors',
                headers: {
                'Content-Type': 'application/json' || obj.headers.contentType,//application/x-www-form-urlencoded',//'application/json; charset=utf-8'
                'make': '' || obj.headers.make,
                'autorization': '' || `Brearer ${obj.headers.token}`
                },
                body: JSON.stringify({
                    login: obj.body.login, 
                    pass: obj.body.pass, 
                    first_name: obj.body.first_name, 
                    last_name: obj.body.last_name,
                    email: obj.body.email,
                    lists: obj.body.lists,
                    data: obj.body.data,
                    name: obj.body.name
                })//JSON.stringify(obj.body)//user//
            });
            
            let result = await response.text();
            console.log(result)*/
            //setRows(result);
            const jsonHeader = {
                "Content-type": "application/json",
                "make": make,
                "authorization": '' || token
            };
    
            let send = axios.create({
                baseURL,
                headers: jsonHeader
            });
            const res = await send.post(baseURL, obj);
            console.log(res); 
            return res;
        }
        catch(e) {
            console.log('nop');
            console.log(e)
            return ([{
                name: 'list 1', author: 'nop', data: [
                { name: 'Cupcake', total: 3, del: 0, selected: false },
                { name: 'Donut', total: 2, del: 0, selected: false },
                { name: 'Eclair', total: 3, del: 0, selected: false },
                { name: 'Frozen yoghurt', total: 4, del: 0, selected: false },
                { name: 'Gingerbread', total: 1, del: 0, selected: false },
                { name: 'Honeycomb', total: 2, del: 0, selected: false },
                { name: 'Ice cream sandwich', total: 237, del: 0, selected: false },
                { name: 'Jelly Bean', total: 3, del: 0, selected: false },
                { name: 'KitKat', total: 6, del: 0, selected: false },
                { name: 'Lollipop', total: 3, del: 0, selected: false },
                { name: 'Marshmallow', total: 4, del: 0, selected: false },
                { name: 'Nougat', total: 1, del: 0, selected: false },
                { name: 'Oreo', total: 2, del: 0, selected: false },
              ]}, {
                name: 'Список 2', author: 'nop', data: [
                { name: 'Блины', total: 3, del: 0, selected: false },
                { name: 'Пончики', total: 2, del: 0, selected: false },
                { name: 'Эклер', total: 3, del: 0, selected: false },
                { name: 'йогурт', total: 4, del: 0, selected: false },
                { name: 'хлеб', total: 1, del: 0, selected: false },
                { name: 'мед', total: 2, del: 0, selected: false },
                { name: 'мороженое', total: 237, del: 0, selected: false },
                { name: 'сладкое', total: 3, del: 0, selected: false },
                { name: 'киткат', total: 6, del: 0, selected: false },
                { name: 'андроид', total: 3, del: 0, selected: false },
                { name: 'зефир', total: 4, del: 0, selected: false },
                { name: 'нуга', total: 1, del: 0, selected: false },
                { name: 'орео', total: 2, del: 0, selected: false },
              ]}])
        }
    }

    async sendDelete(obj) {
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json; charset=utf-8',//application/x-www-form-urlencoded',
              'make': 'login'
            },
            body: JSON.stringify(obj)//user//
        });
          
        let result = await response.json();
    }
}