const axios = require('axios');

const sampleCount = 10;
const reportWaitSec = 10;
let history = [];
let i;

const getApiUrl = () => {
    const hashCode = process.argv[2];
    const mode = process.argv[3];
    const apiName = (mode === '--mode=cache') ? 'tinyUrlCached' : 'tinyUrl';
    return `http://localhost:3000/${apiName}/${hashCode}`;
}

const queryTinyUrl = (clientCode, apiUrl) => {
    const startTime = new Date().getTime();
    console.log(`[Client ${clientCode}] start...`);
    axios.get(apiUrl).then((response) => {
        let endTime = new Date().getTime()
        let diff = endTime - startTime;
        let url = response.data.data.url;
        console.log(`[Client ${clientCode}] Get URL=${url} (elapsed: ${diff} ms) (start: ${startTime})`);
        history[clientCode] = { success: true, startTime, endTime, elapsed: diff, msg: response.data.message };
    }).catch((e) => {
        console.log(`[Client ${clientCode}] Exception! e.message=[${e.message}]`);
        history[clientCode] = { success: false, startTime };
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
    const apiUrl = getApiUrl();
    for (i = 0; i < sampleCount; i++) {
        let client = i;
        setTimeout(() => {
            queryTinyUrl(client, apiUrl);
        }, 2000);
    }
    setTimeout(generateReport, reportWaitSec * 1000);
}

mainProcess();
