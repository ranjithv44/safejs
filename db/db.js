'use strict'

var mangoose = require('mongoose');


mangoose.Promise=global.Promise;
console.log(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
const connection = mangoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);

    connection.then(function(db){
        console.log(`Successfully connected to ${process.env.DB_NAME}`);
        return db;
    }).catch(function(err){
        if(err.message.code === 'ETIMEDOUT'){
            console.log("Connecton timed out , attempting to reconnect")
        }else{
            console.log("Error while connecting to database");
            console.log(err);
            process.exit(1);
        }
    })


    module.exports = connection;