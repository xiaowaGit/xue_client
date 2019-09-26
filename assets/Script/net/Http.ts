const {ccclass, property} = cc._decorator;

@ccclass
export class Http{
    public static get(url, callback, thisObj) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            // if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            //     var response = xhr.responseText;
            //     // console.log(response);
            // }
            // callback.call(thisObj,"COMPLETE",xhr)
        };
        xhr.onerror = function () {
            callback.call(thisObj, "ERROR", xhr)
        }

        xhr.onprogress = function () {
            callback.call(thisObj, "PROGRESS", xhr)
        }

        xhr.onloadend = function () {
            callback.call(thisObj, "COMPLETE", xhr)
        }

        xhr.ontimeout = function () {
            callback.call(thisObj, "TIMEOUT", xhr)
        }
        url = encodeURI(url);
        xhr.open("GET", url, true);
       
        xhr.send();
    }
    
    public static post(url, params, callback, thisObj) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            // if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            //     var response = xhr.responseText;
            //     // console.log(response);
            // }
            // callback.call(thisObj,"COMPLETE",xhr)
        };
        xhr.onerror = function () {
            callback.call(thisObj, "ERROR", xhr)
        }

        xhr.onprogress = function () {
            callback.call(thisObj, "PROGRESS", xhr)
        }

        xhr.onloadend = function () {
            callback.call(thisObj, "COMPLETE", xhr)
        }

        xhr.ontimeout = function () {
            callback.call(thisObj, "TIMEOUT", xhr)
        }

        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(JSON.stringify(params));
    }
}