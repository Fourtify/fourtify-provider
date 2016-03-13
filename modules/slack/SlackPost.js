var request = require("request")
var webHook = "https://hooks.slack.com/services/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"
//we will need to write a function to return the provider's webhook url

//will post to the default channel, aka "test"
var data = {
    "username": "fourtify-bot",
    "text": "Hello world!",
    "icon_emoji": ":clock2:"
};

//TODO each provider will have their own slack webhook url
request({
    url: webHook,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json"
    },
    body: data
}, function (error, response, body) {    if (!error && response.statusCode === 200) {
        console.log(body)
    }
    else {

        console.log("error: " + error)
        console.log("response.statusCode: " + response.statusCode)
        console.log("response.statusText: " + response.statusText)
    }
})