console.log("working");

//List out problematic URLs
var contentResponse = JSON.parse(localStorage.getItem('response'));
var problemURLS = {};
for (var i = 0; i < contentResponse.length; i++) {
    problemURLS.push({ "url": contentResponse[i].threat.url.toString(), "threatType": contentResponse[i].threat.threatType.toString() });
}
console.log(problemURLS);
