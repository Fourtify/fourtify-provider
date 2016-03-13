var request = require("request")

function sendToSlack(attachment, integration, message) {
    request.post({
        json: true,
        url: 'https://slack.com/api/chat.postMessage',
        qs: {
            "token": integration.get('slack_token'),
            "channel": integration.get('channel_id'),
            "username": 'fourtify-bot',
            "attachments": JSON.stringify(attachment),
            "icon_url": SLACK_BOT_ICON,
        },
    }, function(err, res, body) {
        if (body.ok) {
            console.log(body);
        } else {
            console.log(err);
        }
    });
}

//-----------------brainstorming------------------

//send slack command post to api.fourtify.us/slack

var msgToSend = {
    "response_type": "ephemeral",
    "text": "fill in later",
    "username": "fourtify-bot",
    //add more
};