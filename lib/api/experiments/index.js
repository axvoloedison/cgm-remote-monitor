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
//      console.log('Call getPutty');        
      var vname = req.params.name;
//      return res.json({vname: process.env[vname.toUpperCase()]});
      return res.send(process.env[vname.toUpperCase()])
//      var locale = req.body.request.locale;
    });
        
  }

  return api;
}

module.exports = configure;
