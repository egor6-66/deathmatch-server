class CookieParser {
    get(cookie, name) {
        cookie = ';' + cookie;
        cookie = cookie.split('; ').join(';');
        cookie = cookie.split(' =').join('=');
        cookie = cookie.split(';' + name + '=');

        if (cookie.length < 2) {
            return null;
        } else {
            return decodeURIComponent(cookie[1].split(';')[0]);
        }
    }
}

export default new CookieParser();
