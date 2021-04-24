export function getFile(url) {
    // return promise from get request
    return new Promise(function (resolve, reject) {
        // get request with given url
        const Http = new XMLHttpRequest();
        Http.open("GET", url);

        Http.onload = (e) => {
            // only resolve when http status is 200 ("request has succeeded")
            if (Http.readyState == 4 && Http.status == 200) {
                resolve(Http.response);
            } else {
                reject({
                    status: Http.status,
                    statusText: Http.statusText,
                });
            }
        };
        // reject on error
        Http.onerror = function () {
            reject({
                status: this.status,
                statusText: Http.statusText,
            });
        };
        Http.send();
    });
}
