'use strict';
const express = require('express');
//const dotenv = require('dotenv');
//dotenv.config();
const FlightsControllers = require('./../controllers/flightControllers');
const flightsCtrs = new FlightsControllers();

const router = express();

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
  }


router.get('/flightsArr',flightsCtrs.getFlightsByArr);

router.get('/flightsDep',flightsCtrs.getFlightsByDep);

router.get('/flightsCode', flightsCtrs.getFlightsByCode);


router.get('/airportsArr',flightsCtrs.getAirportsList);

router.get('/airport',flightsCtrs.getOneAirport)

//router.get('/flightsArr',)

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