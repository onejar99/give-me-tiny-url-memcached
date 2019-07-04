const Hashids = require('hashids');
const myHash = new Hashids('onejar salt');

const genHashCode = (url) => {
    let str = url + '_' + new Date().getTime();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        let char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return myHash.encode(hash + 9000000000); // for encode failed issue
}

const responseOkHelper = (rsp) => {
    return (message, data) => {
        rsp.send({ result: 'ok', message: message, data: data });
    };
}

const responseErrorHelper = (rsp) => {
    return (statusCode, message) => {
        rsp.status(statusCode).send({ result: 'error', message: message })
    };
}

module.exports = {
    genHashCode, responseOkHelper, responseErrorHelper
};
