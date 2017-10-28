'use strict';

function configure (app, wares, ctx) {
  var express = require('express'),
      api = express.Router( )
  ;

  if (app.enabled('api')) {
    api.use(wares.sendJSONStatus);

    api.get('/test', ctx.authorization.isPermitted('authorization:debug:test'), function (req, res) {
        return res.json({status: 'ok'});
    });
    api.get('/getenv', ctx.authorization.isPermitted('api:env:read'), function (req, res) {
      console.log('Call getPutty');        
      return res.json({url: process.env['VASA']});
//      var locale = req.body.request.locale;
    });
        
  }

  return api;
}

module.exports = configure;
