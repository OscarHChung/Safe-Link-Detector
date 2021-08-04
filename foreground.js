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
const url = 'https://safebrowsing.googleapis.com/v4/threatMatches:find?key=API_KEY';
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
    if (contentResponse.matches == null) {
        alert("This site is safe!");
    }
    else {
        var problemURLS = [];
        for (var i = 0; i < contentResponse.matches.length; i++) {
            problemURLS.push({ "url": contentResponse.matches[i].threat.url.toString(), "threatType": contentResponse.matches[i].threatType.toString() });
        }
        var warning = "WARNING! The following links are dangerous:\n";
        for (var i = 0; i < problemURLS.length; i++) {
            warning += "\n" + problemURLS[0].threatType.toString() + ": " + problemURLS[0].url.toString();
        }


    

        var styles = `
            .visible {
                opacity: 1
            }
            .popup-background {
                position: fixed; 
                z-index: 10;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%; 
                overflow: auto; 
                background-color: rgb(0,0,0); 
                background-color: rgba(0,0,0,0.4); 
            }

            .popup-content {
                background-color: #fefefe;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
            }

            .close {
                color: #aaa;
                float: right;
                font-size: 28px;
                font-weight: bold;
            }

            .close:hover,
            .close:focus {
                color: black;
                text-decoration: none;
                cursor: pointer;
            }
        `;
        var styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles;
        document.head.appendChild(styleSheet);


        var popupBackground = document.createElement("div");
        popupBackground.classList.add("popup-background");
        popupBackground.classList.add("visible");

        var popupContent = document.createElement("div");
        popupContent.classList.add("popup-content");
        popupContent.classList.add("visible");

        var popupClose = document.createElement("span");
        popupClose.classList.add("close");
        popupClose.classList.add("visible");
        popupClose.innerHTML += "&times";
        popupClose.onclick = function () { 
            var elements = document.getElementsByClassName("visible");
            while(elements.length > 0){
                elements[0].parentNode.removeChild(elements[0]);
            }
        };
        popupContent.appendChild(popupClose);

        var popupPara = document.createElement("p");
        popupPara.innerHTML += warning;
        popupContent.appendChild(popupPara);

        popupBackground.appendChild(popupContent);

        document.body.insertBefore(popupBackground, document.body.firstChild);
        console.log(popupBackground);
    }
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
