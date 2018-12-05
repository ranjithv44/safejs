
'use strict'
const result = require('dotenv').config()
var express = require('express');
var bodyParser = require('body-parser');
var https = require('https');
var hashHelper = require("./hash/hashHelper")
var db = require('./db/db');
var Hash= require('./model/hashModel');



var app = express();

var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    maxAge: '1d',
    redirect: false
  }

  app.use(express.static('public',options));

 app.use(bodyParser.json());
  // create application/x-www-form-urlencoded parser
  app.use(bodyParser.urlencoded({ extended: false }));

  app.post("/monitor", function(req,res){
      
      if(!req.body){
        res.sendStatus(400);
      }else{  
        const url = req.body.url;
        var urlResponse;
        var responseHash;
        console.log("url is "+url);
        https.get(url, function(resp){

          resp.on('data', function(data){
            urlResponse += data;
          });

          resp.on('end', function(data){
            responseHash = hashHelper.createHash(urlResponse)
            console.log(responseHash)
            var hashObj = new Hash(
                {
                  "url" : url,
                  "brand" : req.body.brand,
                  "filename" : req.body.filename,
                  "hash" : responseHash
                  
                });
                hashObj.save(function(err){
                    if(err){
                      throw err;
                    }
                    console.log("data saved successfully");
                    res.sendStatus(201);
                })
          });

        }).on("error", function(err){
          
          console.log("Error while hitting the url");
          console.log(err);
          throw err;
        })
      }
  })


  app.listen(3000);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_PORT);
  console.log("Server listening on port 3000");
