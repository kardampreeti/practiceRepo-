const express = require('express');
const mongoose = require('mongoose');
const logger = require('./logger/log');
const userRoutes = require ('./routes/userRoutes');

const dbUrl = "mongodb://localhost/UserAuthentication";//database used here is UserAuthentication
const PORT = process.env.port || 3000;
const server = express();

//connection with database 
mongoose.connect(dbUrl).then(()=>{
    logger.info(' Database [MongoDb] connected successfully ....');
}).catch((error)=>{
    logger.error(`Database connection error: ${error}`);
    process.exit(1);// db not connected ; then exit
});

server.use(express.json());// middleware ; express.json() used to parse JSON bodies

//calling routes 
server.use('/user',userRoutes);
//start server : listening 
server.listen(PORT , ()=>
    {
        logger.info(`Server is running on PORT : ${PORT} `);
    });
