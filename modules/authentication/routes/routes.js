var environment = process.env.NODE_ENV;
var moment = require('moment-timezone');
var request = require('request');

var config = require('../../../config/config.json')[environment];
var API_URL = config.apiUrl;

var express = require('express');
var router = express.Router();

router.get('/login', function (req, res) {
    res.render('login',{
        redirectUrl: req.query.redirectUrl || req.session.redirectUrl
    });
});
router.post('/api/login', function (req, res) {
    var localProvider;
    request({
            method: "GET",
            uri: API_URL+"/providers?domain="+req.body.domain
        },
        function (error, response, body) {
            if (error) {
                return res.status(500).send(error);
            }
            else if(response.statusCode !== 200){
                body = JSON.parse(body);
                return res.status(response.statusCode).send(body);
            }
            else{
                body = JSON.parse(body);
                localProvider = body;
                request({
                        headers: {
                            "Authorization": "Basic "+(new Buffer(localProvider._clientId+":"+localProvider._clientSecret).toString('base64')),
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: "POST",
                        uri: API_URL+"/authentication/token",
                        form: {
                            grant_type: "password",
                            email: req.body.email,
                            password: req.body.password
                        }
                    },
                    function (error, response, body) {
                        if (error) {
                            return res.status(500).send(error);
                        }
                        else if(response.statusCode !== 200){
                            body = JSON.parse(body);
                            return res.status(response.statusCode).send(body);
                        }
                        else{
                            body = JSON.parse(body);
                            req.session.redirectUrl = null;
                            req.session.accessToken = body.accessToken;
                            req.session.refreshToken = body.refreshToken;
                            req.session.provider = body.provider;
                            req.session.employee = body.employee;
                            req.session.save(function(err){
                                if(err){
                                    return res.status(500).send(err);
                                }
                                else{
                                    return res.status(response.statusCode).send(body);
                                }
                            });
                        }

                    });
            }
        });
} );


router.get('/logout',  function (req, res) {
    req.session.redirectUrl = null;
    req.session.accessToken = null;
    req.session.refreshToken = null;
    req.session.provider = null;
    req.session.employee = null;
    res.render('login');
    //@todo delete session, call api to logout, and redirect to login + req.logout();
});

//@todo implement the forgot password feature here

module.exports = router;
