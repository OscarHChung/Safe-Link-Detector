var links = [];
var linkArr = [];
for (var i = 0; i < document.links.length; i++) {
    links.push(document.links[i].href.toString());
};
for (var i = 0; i < links.length; i++) {
    if (isValidHttpUrl(links[i].toString())) {
        linkArr.push(links[i].toString());
    }
}



//Post Request Body Setup
var linkValuesArr = {
    "client": {
        "clientId": "Safe Link Detector",
        "clientVersion": "1.5.2"
    },
    "threatInfo": {
        "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING"],
        "platformTypes": ["WINDOWS"],
        "threatEntryTypes": ["URL"],
        "threatEntries": [
        ]
    }
};
for (i = 0; i < linkArr.length; i++) {
    linkValuesArr.threatInfo.threatEntries.push({ "url": linkArr[i].toString() });
}
var params = linkValuesArr;
/* const http = new XMLHttpRequest();
const url = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyBv0_jYJzbsDBiAbnGUe9gE7zcV-VqLbgY';
const params = linkValuesArr;
http.open('POST', url);
http.setRequestHeader('Content-type', 'application/json');
http.setRequestHeader("Access-Control-Allow-Origin", "*");
http.send(params);
http.onreadystatechange = (e) => {
    console.log(http.responseText)
} */

localStorage.clear();

async function first_call() {
    const rawResponse = await fetch('https://safebrowsing.googleapis.com/v4/threatMatches:find?key=AIzaSyBv0_jYJzbsDBiAbnGUe9gE7zcV-VqLbgY', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    });
    const content = await rawResponse.json();
    localStorage.setItem('response', JSON.stringify(content));
};

//List out problematic URLs
async function second_call() {
    await first_call();

    var contentResponse = [];
    contentResponse = JSON.parse(localStorage.getItem('response'));

    var problemURLS = [];
    for (var i = 0; i < contentResponse.matches.length; i++) {
        problemURLS.push({ "url": contentResponse.matches[i].threat.url.toString(), "threatType": contentResponse.matches[i].threatType.toString() });
    }
    console.log(problemURLS[0]);
}

second_call();

//Link Validator
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
