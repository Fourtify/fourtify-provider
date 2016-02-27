"use strict";
var environment = process.env.NODE_ENV;
var moment = require('moment-timezone');
var request = require('request');
var config = require('../../../config/config.json')[environment];
var API_URL = config.apiUrl;
//@todo hard coded provider, will need to change later
var SITE_AUTH_BASE64 = "NDE1ZTg1YzMxYjJmNDgyZmVhY2FjNzY4Y2IyMzdjZjU6YjQwZGQ0MWY0MTcyYzY2OTdiM2IzYWJkZTcwMWExYzc=";

module.exports = class AuthMiddleware {

    constructor() {
    }

    static authenticateApi(){

        return function(req, res, next) {

            res.setHeader("X-Powered-By", "Fourtify");

            //if not access token or never logged in
            if(!req.session || !req.session.accessToken){
                return res.status(401).send({_code:"PROVIDER-APP001", _msg:"Unauthorized"});
            }
            //if access token expired
            else if(moment(req.session.accessToken._expires).isBefore(moment()) || moment(req.session.accessToken._expires).isSame(moment())){
                //if refreshToken expired
                if(moment(req.session.refreshToken._expires).isBefore(moment()) || moment(req.session.refreshToken._expires).isSame(moment()) ){
                    //redirect to login
                    return res.status(401).send({_code:"PROVIDER-APP001", _msg:"Unauthorized"});
                }
                //if refreshToken is still valid
                else{
                    //request a new accesstoken
                    request(
                        {
                            headers: {
                                "Authorization": "Basic "+SITE_AUTH_BASE64,
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            method: "POST",
                            uri: API_URL+"/authentication/token",
                            form: {
                                grant_type: "refresh_token",
                                refresh_token: req.session.refreshToken._value
                            }
                        },
                        function (error, response, body) {
                            if (error) {
                                return res.status(500).send({_code:"PROVIDER-APP002", _msg:"Connection to API failed. Please try again later."});
                            }
                            else if(response.statusCode !== 200){
                                return res.status(401).send({_code:"PROVIDER-APP001", _msg:"Unauthorized"});
                            }
                            else{
                                body = JSON.parse(body);
                                req.session.accessToken = body.accessToken;
                                req.session.provider = body.provider;
                                req.session.employee = body.employee;
                                req.session.save(function(err){
                                    if(err){
                                        return res.status(500).send(err);
                                    }
                                    else{
                                        next();
                                    }
                                });
                            }
                        }
                    );
                }
            }
            else{
                next();
            }
        };
    };

    static authenticate(){

        return function(req, res, next) {

            res.setHeader("X-Powered-By", "Fourtify");

            //if not access token or never logged in
            if(!req.session || !req.session.accessToken){
                req.session.redirectUrl = req.url;
                return res.redirect("/login");
            }
            //if access token expired
            else if(moment(req.session.accessToken._expires).isBefore(moment()) || moment(req.session.accessToken._expires).isSame(moment())){
                //if refreshToken expired
                if(moment(req.session.refreshToken._expires).isBefore(moment()) || moment(req.session.refreshToken._expires).isSame(moment()) ){
                    //redirect to login
                    req.session.redirectUrl = req.url;
                    return res.redirect("/login");
                }
                //if refreshToken is still valid
                else{
                    //request a new accesstoken
                    request(
                        {
                            headers: {
                                "Authorization": "Basic "+SITE_AUTH_BASE64,
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            method: "POST",
                            uri: API_URL+"/authentication/token",
                            form: {
                                grant_type: "refresh_token",
                                refresh_token: req.session.refreshToken._value
                            }
                        },
                        function (error, response, body) {
                            if (error) {
                                res.status(500).send({_code:"PROVIDER-APP002", _msg:"Connection to API failed. Please try again later."});
                            }
                            else if(response.statusCode !== 200){
                                req.session.redirectUrl = req.url;
                                return res.redirect("/login");
                            }
                            else{
                                body = JSON.parse(body);
                                req.session.accessToken = body.accessToken;
                                req.session.provider = body.provider;
                                req.session.employee = body.employee;
                                req.session.save(function(err){
                                    if(err){
                                        return res.status(500).send(err);
                                    }
                                    else{
                                        next();
                                    }
                                });
                            }
                        }
                    );
                }
            }
            else{
                next();
            }
        };
    };

};