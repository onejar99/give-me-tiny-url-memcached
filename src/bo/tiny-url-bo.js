require('../config/config-include');
const { TinyUrl } = require('../model/tiny-url');
const commonUtil = require('../util/common-util');
const cacheUtil = require('../util/memcached-util');

const CACHE_EXPIRED_SEC = 60;

const createTinyUrl = (url, okCbk, failCbk) => {
    if (url === undefined || url.trim() === '') {
        failCbk(400, 'Please specify url');
        return;
    }
    const createTime = new Date();
    const hashCode = commonUtil.genHashCode(url);
    let tinyUrl = new TinyUrl({
        hashCode: hashCode,
        url: url.trim(),
        createdTime: createTime.getTime()
    });
    tinyUrl.save()
        .then(doc => { okCbk('TinyUrl created', doc) })
        .catch(e => { failCbk(500, 'Creating TinyUrl failed! Error: ' + e) });
}

const getTinyUrl = (hashCode, okCbk, failCbk) => {
    if (hashCode === undefined || hashCode.trim() === '') {
        failCbk(400, 'Please specify code');
        return;
    }
    TinyUrl.findOne({ hashCode })
        .then(doc => {
            if (doc === null) {
                failCbk(400, 'Not found');
                return;
            }
            okCbk('TinyUrl got', doc)
        })
        .catch(e => {
            failCbk(500, 'Getting TinyUrl failed! Error: ' + e);
        });
}

const getTinyUrlByCached = (hashCode, okCbk, failCbk) => {
    if (hashCode === undefined || hashCode.trim() === '') {
        failCbk(400, 'Please specify code');
        return;
    }
    cacheUtil.get(hashCode, (ret) => {
        if (ret !== undefined) {
            okCbk('TinyUrl got (from cache)', JSON.parse(ret));
            return;
        }
        TinyUrl.findOne({ hashCode })
            .then(doc => {
                if (doc === null) {
                    failCbk(400, 'Not found');
                    return;
                }
                cacheUtil.set(hashCode, doc, CACHE_EXPIRED_SEC, () => {
                    okCbk('TinyUrl got (from DB)', doc);
                }, (e) => {
                    failCbk(500, 'Set memcached failed: ' + e)
                });
            })
            .catch(e => {
                failCbk(500, 'Getting TinyUrl failed! Error: ' + e)
            });
    },
        (e) => {
            failCbk(500, 'Get memcached failed: ' + e)
        });
}

module.exports = {
    createTinyUrl, getTinyUrl, getTinyUrlByCached
};
