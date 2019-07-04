require('./config/config-include');
const express = require('express');
const bodyParser = require('body-parser');
const tinyUrlBo = require('./bo/tiny-url-bo');
const commonUtil = require('./util/common-util');

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));

app.get('/gmtu/:hashCode', (req, rsp) => {
    tinyUrlBo.getTinyUrl(req.params.hashCode,
        (message, data) => {
            rsp.redirect(data.url);
        }, () => rsp.redirect('http://localhost:3000/gmtu'));
});

app.post('/tinyUrl', (req, rsp) => {
    tinyUrlBo.createTinyUrl(req.body.url, commonUtil.responseOkHelper(rsp), commonUtil.responseErrorHelper(rsp));
});

app.get('/tinyUrl/:hashCode', (req, rsp) => {
    tinyUrlBo.getTinyUrl(req.params.hashCode, commonUtil.responseOkHelper(rsp), commonUtil.responseErrorHelper(rsp));
});

app.get('/tinyUrlCached/:hashCode', (req, rsp) => {
    tinyUrlBo.getTinyUrlByCached(req.params.hashCode, commonUtil.responseOkHelper(rsp), commonUtil.responseErrorHelper(rsp));
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

module.exports = { app };
