
'use strict'
//Environment bnased config. Look at .env file for details. The .env needs to be created mannually in each environment
const result = require('dotenv').config()
//Express library for web framework
var express = require('express');
//Middileware for parsing the request body 
var bodyParser = require('body-parser');
//Node module for firing https request
var https = require('https');
//Helper file for hashing
var hashHelper = require("./hash/hashHelper")
//DB connection details
var db = require('./db/db');
//Javascript model corresponding to DB object 
var Hash= require('./model/hashModel');



var app = express();
//Config for static middleware
var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['htm', 'html'],
    maxAge: '1d',
    redirect: false
  }

  //Server static files from public folder
  app.use(express.static('public',options));

  //Parsers
  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: false }));

  //Method to handle the /monitor rest call
  app.post("/monitor", function(req,res){
      
      if(!req.body){
        res.sendStatus(400);
      }else{  
        const url = req.body.url;
        var urlResponse;
        var responseHash;
        console.log("url is "+url);
        //Fire the url in the request and get the response
        https.get(url, function(resp){

          resp.on('data', function(data){
            urlResponse += data;
          });

          resp.on('end', function(data){
            responseHash = hashHelper.createHash(urlResponse)
            console.log(responseHash)
            var hash = new Hash(
                {
                  "url" : url,
                  "brand" : req.body.brand,
                  "filename" : req.body.filename,
                  "hash" : responseHash
                  
                });
            
              var hashObj = hash.toObject();
              //If the id already exists , mongodb will throw an error and hence remove it before sending
              delete hashObj._id;
              var query = {"url" : url};
              var options = {upsert : true}; 
                Hash.findOneAndUpdate(query,hashObj,options, function(err){
                    if(err){
                      throw err;
                    }
                    console.log("data saved successfully");
                    res.sendStatus(204);
                })
          });

        }).on("error", function(err){
          
          console.log("Error while hitting the url");
          console.log(err);
          throw err;
        })
      }
  })


  app.listen(process.env.APP_PORT);
  console.log(process.env.DB_HOST);
  console.log(process.env.DB_PORT);
  console.log(`Server listening on port ${process.env.APP_PORT}`);
