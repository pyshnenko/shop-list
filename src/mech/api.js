let url;

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

    async sendPost(obj) {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json; charset=utf-8' || obj.headers.contentType,//application/x-www-form-urlencoded',
              'make': '' || obj.headers.make,
              'autorization': '' || `Brearer ${obj.headers.token}`
            },
            body: obj.body//user//
        });
          
        let result = await response.json();
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