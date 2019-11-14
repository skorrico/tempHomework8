/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var express = require('express');
var app1 = require('express');
var bodyParser = require('body-parser');
const https = require('https');
var url = require('url');
var EventEmitter = require("events").EventEmitter;
var request = require('request');
var cors = require('cors');
'use strict';

// [START gae_node_request_example]
//const express = require('express');
//
const app = express();

// app.use(express.static(__dirname + '/html'));
app.use(express.static(__dirname + '/angular-app/dist/app8'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//app.set('view engine', 'html');

app.get('/', function (req, res) {
//   res.sendFile('html/bananza8.html', {root: __dirname});
  res.sendFile(path.join(__dirname, 'angular-app/dist/app8/index.html'));
});

app.get('/auto_complete', function (req, res) {
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var token = req.query.token;
   var url_text_auto='https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + token + '&types=(cities)&language=en&key=AIzaSyC-QKWNYD5MOPHdUytMqi5Mq6w0dgvXhRk';
   console.log(url_text_auto);

	    https.get(url_text_auto,function(req2,res2)
		{
        var res_text = "";
        req2.on('data',function(data)
		{
            res_text+=data;
			
        });
        req2.on('end',function()
		{
            var possibleCities = res_text['predictions'];
			return res.send(res_text);
        });

        });
   

});

app.get('/work_pls', function (req, res) {
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
   var lat = req.query.lat;
   var lon = req.query.lon;
//    var url_text_auto='https://api.darksky.net/forecast/1d4cf38920dd2fb20f1f6094b2a82bdf/'+lat+','+lon;
   var url_text_auto = 'https://api.darksky.net/forecast/1d4cf38920dd2fb20f1f6094b2a82bdf/'+ lat+','+lon;
//    var url_text_auto='https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyC-QKWNYD5MOPHdUytMqi5Mq6w0dgvXhRk';

	    https.get(url_text_auto,function(req2,res2)
		{
        var res_text = "";
        req2.on('data',function(data)
		{
            res_text+=data;
			
        });
        req2.on('end',function()
		{
//            var possibleCities = res_text['predictions'];
			return res.send(res_text);
        });

        });
   

});

app.get('/form_api', function (req, res) {
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
    var street = req.query.street;
    var city = req.query.city;
    var state = req.query.state;
    var url_text_auto='https://maps.googleapis.com/maps/api/geocode/json?address=' + street + ',' + city + ',' + state + '&key=AIzaSyC-QKWNYD5MOPHdUytMqi5Mq6w0dgvXhRk';
//   var url_text_auto='https://api.darksky.net/forecast/1d4cf38920dd2fb20f1f6094b2a82bdf/33.9993,-118.2868';
//    var url_text_auto='https://maps.googleapis.com/maps/api/place/autocomplete/json?key=AIzaSyC-QKWNYD5MOPHdUytMqi5Mq6w0dgvXhRk';

	    https.get(url_text_auto,function(req2,res2)
		{
        var res_text = "";
        req2.on('data',function(data)
		{
            res_text+=data;
			
        });
        req2.on('end',function()
		{
//            var possibleCities = res_text['predictions'];
			return res.send(res_text);
        });

        });
   

});

app.get('/detail', function (req, res) {
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
    var lat = req.query.lat;
    var lon = req.query.lon;
    var time = req.query.time;
//    https://api.darksky.net/forecast/[key]/[latitude],[longitude],[time]
    var url_text_auto='https://api.darksky.net/forecast/1d4cf38920dd2fb20f1f6094b2a82bdf/' + lat + ',' + lon + ',' + time;

	    https.get(url_text_auto,function(req2,res2)
		{
        var res_text = "";
        req2.on('data',function(data)
		{
            res_text+=data;
			
        });
        req2.on('end',function()
		{
//            var possibleCities = res_text['predictions'];
			return res.send(res_text);
        });

        });
   

});

app.get('/seal_icon', function (req, res) {
   res.setHeader("Content-Type","text/plain");
   res.setHeader("Access-Control-Allow-Origin","*");
    var state = req.query.state;
    // var url_text_auto = 'https://www.googleapis.com/customsearch/v1?q='+ state + '%20State%20Seal&cx=002087289938218752286:fj9e1gfihf1&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyCPITb9U0IXQWckYfG3JszttFC0oicxYzE';
    var url_text_auto = 'https://www.googleapis.com/customsearch/v1?q=Seal%20of%20'+ state + '&cx=002087289938218752286:fj9e1gfihf1&imgSize=huge&imgType=news&num=1&searchType=image&key=AIzaSyCPITb9U0IXQWckYfG3JszttFC0oicxYzE';
    
	    https.get(url_text_auto,function(req2,res2)
		{
        var res_text = "";
        req2.on('data',function(data)
		{
            res_text+=data;
			
        });
        req2.on('end',function()
		{
//            var possibleCities = res_text['predictions'];
			return res.send(res_text);
        });

        });
   

});


var server = app.listen(8080, () => {
  console.log('server is listening on port', server.address().port);
})

module.exports = app;
