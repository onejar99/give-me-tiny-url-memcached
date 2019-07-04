require('../config/config-include');
const memcached = require('memcached');

const createConn = () => {
    const cache = new memcached(process.env.MEMCACHED_HOST + ":" + process.env.MEMCACHED_PORT);
    return cache;
}

const closeConn = (cache) => {
    cache.end();
}
const set = (key, data, lifetime, okCbk, errCbk) => {
    let cache = createConn();
    cache.set(key, JSON.stringify(data), lifetime, (err) => {
        if (err) errCbk(err);
        okCbk();
        closeConn(cache);
    });
}

const get = (key, okCbk, errCbk) => {
    let cache = createConn();
    cache.get(key, (err, result) => {
        if (err) errCbk(err);
        okCbk(result);
        closeConn(cache);
    });
}

module.exports = {
    set, get
};
