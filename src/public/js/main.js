const tinyApiUrl = 'http://localhost:3000/tinyUrl/';
const resultUrlPrefix = 'http://localhost:3000/gmtu/';

const displayResult = (hashCode) => {
    let resultEl = document.querySelector("#result-url");
    resultEl.innerHTML = resultUrlPrefix + hashCode;
    alert('You got it!');
}

const clearResult = (hashCode) => {
    document.querySelector("#result-url").innerHTML = '';
}

const requestTinyApi = (url) => {
    axios.post(tinyApiUrl, { url })
        .then((response) => {
            displayResult(response.data.data.hashCode);
        })
        .catch((error) => {
            alert('Oops! It seems something worng!');
        });
}

const makeTinyUrl = () => {
    clearResult();
    let inputEl = document.querySelector("#input-url");
    let inputUrl = inputEl.value.trim();
    if (inputUrl === '') {
        alert('You need to enter your URL!');
        return;
    }
    requestTinyApi(inputUrl);
}
