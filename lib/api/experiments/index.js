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

    ctx.smb = {units: 0.0};
    api.post('/smb/:units', ctx.authorization.isPermitted('api:smb:create'), function(req, res) {
        var unit = req.units;
        ctx.smb.units = req.unit;
        ctx.smb.created_at = (new Date( )).toISOString( );
        res.json(created);
        console.log('Save smb command:units:' + ctx.smb.units + "created:" + ctx.smb.created_at);
      });
      // delete record
      api.delete('/smb/', ctx.authorization.isPermitted('api:smb:delete'), function(req, res) {
        if (ctx.smb.units > 0.0 && ctx.smb.units <= 1.0) {
          console.log('Send smb command:units:' + ctx.smb.units + "created:" + ctx.smb.created_at);
          res.json({units: ctx.smb.units, created: ctx.smb.created_at });
          ctx.smb.units = 0;
        } else {
            console.log('No smb command exists');
            res.json({}) ;
        }
        
      });
    
        
  }

  return api;
}

module.exports = configure;
