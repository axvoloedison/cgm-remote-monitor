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
      var vname = req.query.name || '';
//      return res.json({vname: process.env[vname.toUpperCase()]});
      return res.send(process.env[vname.toUpperCase()])
//      var locale = req.body.request.locale;
    });

    ctx.smb = {units: -1.0, created_at: ''};
    api.post('/smb', ctx.authorization.isPermitted('api:smb:create'), function(req, res) {
        if (req.body.units && req.body.units >= 0 ) {            
            var unit = req.body.units;
            ctx.smb.units = unit;
            ctx.smb.created_at = (new Date( )).toISOString( );
            res.json({units: ctx.smb.units, created: ctx.smb.created_at });
            console.log('Save smb command:units:' + ctx.smb.units + " created:" + ctx.smb.created_at);
        } else {
            console.log('Wrong request');
            res.json({error:"wrong request"});
        }
    });
 // delete record
    api.delete('/smb', ctx.authorization.isPermitted('api:smb:delete'), function(req, res) {
    if (ctx.smb.units >= 0.0 && ctx.smb.units <= 1.0) {
        console.log('Send smb command:units:' + ctx.smb.units + "created:" + ctx.smb.created_at);
        res.json({units: ctx.smb.units, created: ctx.smb.created_at });
        ctx.smb.units = -1;
        ctx.smb.created_at = "";
    } else {
        console.log('No smb command exists');
        res.json({}) ;
    }
    
    api.get('/smb', ctx.authorization.isPermitted('api:env:read'), function (req, res) {
        if ( ctx.smb.units >= 0) {
            return  res.json({units: ctx.smb.units, created: ctx.smb.created_at });
        } else {
            return  res.json({}) ;
        }
    });

    });
    
        
  }

  return api;
}

module.exports = configure;
