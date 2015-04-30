#!/usr/bin/env node
var express = require('express')
  , jade = require('jade')
  , fs = require('fs')
  , jadeRe = /\.jade$/;


var server_pages = './grunt-config/server-pages';
var conf_file_path = './src/dev-conf.json';
var jade_views_path = './src/html';
var assets_path = './src/assets';

var app = express();
app.use( express.static( assets_path ) );//HTML assets folder
app.use("/server", express.static( server_pages + '/assets') );//Jade Server Error Pages

app.get('/*', function(req, res){

  if ( req.url.match(jadeRe) ) {
    
    fs.exists( jade_views_path + req.url, function(exists) {

      if (exists) {//If file exists then serve it  

        var data;
        var conf_file_exists = fs.existsSync( conf_file_path );

        if( conf_file_exists ){
          try{
            data = JSON.parse( fs.readFileSync( conf_file_path , 'utf8') );
          } catch (e) {
            console.log('Error de formato en el archivo de configuración: "' + conf_file_path + '"' );
            data = {};
          }
        }else{
          data = {};
        }

        try{// If everthing is ok, then render jade files

          res.send( jade.renderFile( jade_views_path + req.url, {
            pretty: true,
            conf: data,
            basedir: jade_views_path,
            filename: jade_views_path + req.url.replace(jadeRe, '')
          }));

        } catch ( error ) {//If not, render the jade error page

          var msg = error.toString();
          msg =  msg.replace(new RegExp('>','g'), '&gt;');
          msg =  msg.replace(new RegExp('\n','g'), '<br>');
          res.send( jade.renderFile( server_pages + '/jade-lang-error.jade', {
            pretty: true,
            basedir: server_pages,
            msg: msg 
          }));

        }
      } else {
        res.status(404).send('<h1>404 - File Not Found</h1>');
      }
      
    });
  } else {
    res.status(404).send('<h1>404 - File Not Found</h1>');
  }

});

module.exports = app;