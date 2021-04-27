'use strict';
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

const router = express();

//preguntar si se requiere
/*if(process.env.NODE_ENV == 'dev'){
    console.log("no entra")
    require('dotenv').config();
}
*/

const urlAPI = `http://api.aviationstack.com/v1/flights?access_key=${process.env.KEY_API}&arr_iata=`;



router.get('/',(req,res)=>{

    let url = urlAPI + req.query.arriata; 
    console.log(url);

    //res.send(url);

    fetch(url).then(response =>{
        return response.json();
    }).then(data => {
        res.send(data);
    })
    .catch(e => {
        res.status(400).send("todo correcto");
    });
});

router.get('/depiata',)

/*
fetch(url).then(response =>{
        return response.json();
    }).then(data => {
        res.send(data);
    })
    .catch(e => {
        res.status(400).send("todo correcto");
    });
*/
module.exports = router; 