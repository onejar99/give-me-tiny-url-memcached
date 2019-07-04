const tinyUrlBo = require('../src/bo/tiny-url-bo');

const sampleCount = 10;
const reportWaitSec = 5;
let history = [];
let i;

const getFuncObj = () => {
    const mode = process.argv[3];
    return (mode === '--mode=cache') ? tinyUrlBo.getTinyUrlByCached : tinyUrlBo.getTinyUrl;
}

const getHashCode = () => process.argv[2];

const queryTinyUrl = (clientCode, funcObj, hashCode) => {
    const startTime = new Date().getTime();
    console.log(`[Client ${clientCode}] start...`);
    funcObj(hashCode, (message, data) => {
        let endTime = new Date().getTime()
        let diff = endTime - startTime;
        let url = data.url;
        console.log(`[Client ${clientCode}] Get URL=${url} (elapsed: ${diff} ms) (start: ${startTime})`);
        history[clientCode] = { success: true, startTime, endTime, elapsed: diff, msg: message };
    }, (statusCode, message) => {
        console.log(`[Client ${clientCode}] Exception! e.message=[${message}]`);
        history[clientCode] = { success: false, startTime, elapsed: 0, msg: message };
    });
}

const generateReport = () => {
    let successCnt = 0, failureCnt = 0, cacheCnt = 0, totalElapsedMs = 0;
    for (i = 0; i < sampleCount; i++) {
        if (history[i].success) {
            successCnt++;
            totalElapsedMs += history[i].elapsed;
            if (history[i].msg === 'TinyUrl got (from cache)') {
                cacheCnt++;
            }
        } else {
            failureCnt++;
        }
    }
    console.log('=================================');
    console.log('            Report');
    console.log('=================================');
    console.log(`* Total samples: ${sampleCount}`);
    console.log(`* Success: ${successCnt}`);
    console.log(`* Failure: ${failureCnt}`);
    console.log(`* Got from cache: ${cacheCnt}`);
    console.log(`* Average elapsed time: ${(totalElapsedMs / successCnt)} ms`);
}

const mainProcess = () => {
    let hashCode = getHashCode();
    let funcObj = getFuncObj();
    for (i = 0; i < sampleCount; i++) {
        let client = i;
        setTimeout(() => {
            queryTinyUrl(client, funcObj, hashCode);
        }, 2000);
    }
    setTimeout(generateReport, reportWaitSec * 1000);
}

mainProcess();
