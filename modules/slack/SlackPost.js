/**
 * Created by Jon on 2/27/2016.
 */
var request = require("request")

//will post to the default channel, aka "test"
var data = {
    "username": "fourtify-bot",
    "text": "Hello world!",
    "icon_emoji": ":clock2:"
};

request({
    //url for the fourtify slack team
    url: "https://hooks.slack.com/services/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",
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