var request = require("request");
var environment = process.env.NODE_ENV;
var config = require('../../config/config.json')[environment];
var API_URL = config.apiUrl;

//angular.module("slack", ["settings"])
//    .controller("SlackController", ["$scope", "SettingsService",
//        function($scope){
//            SettingsService.getSettings(
//                {},
//                //success function
//                function(data) {
//                    if(data._slack){
//                        webHook = data._slack;
//                    }
//                },
//                //error function
//                function(data, status) {
//                    $scope.clearMessages();
//                    $scope.err = data;
//                }
//            )
//        }
//    ])

function getSettings() {
    var req = {
        method: 'GET',
        url: API_URL + '/settings',
    };
    request(
        req,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body)
            }
            else
            {
                console.log(body)
            }
        }
    )
};

var webHook = getSettings();
//"https://hooks.slack.com/services/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"


//we will need to write a function to return the provider's webhook url

//will post to the default channel, aka "test"
var data = {
    "username": "fourtify-bot",
    "text": "A client has arrived for an appointment.",
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
        //console.log("response.statusCode: " + response.statusCode)
        //console.log("response.statusText: " + response.statusText)
    }
});