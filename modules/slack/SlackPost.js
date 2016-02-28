/**
 * Created by Jon on 2/27/2016.
 */
var request = require("request")

var data = JSON.stringify({
    username: "Fourtify Bot",
    text: "Client has arrived for appointment, blah blah blah.",
    icon_emoji: ":clock2:" //emoji of a clock; we can change this later if you fellas don't like it
});

request({
    //temporary url; need to set up a new slack team first
    url: "https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX",
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json"
    },
    body: data
}, function (error, response, body) {
    if (!error && response.statusCode === 200) {
        console.log(body)
    }
    else {

        console.log("error: " + error)
        console.log("response.statusCode: " + response.statusCode)
        console.log("response.statusText: " + response.statusText)
    }
})