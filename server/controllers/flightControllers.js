const fetch = require('node-fetch');
const dotenv = require('dotenv');


//prueba
const dataFile = require('./dataTest.json');

dotenv.config();

const urlAPI = `http://api.aviationstack.com/v1/flights?access_key=${process.env.KEY_API}&dep_iata=`;
const urlAPIAirports = `http://api.aviationstack.com/v1/airports?access_key=${process.env.KEY_API}`;

function statusF(status) {
    let stats;
    switch (status) {
        case "scheduled":
            stats = {
                stats: "Agendado",
                icon: "fas fa-clock me-1"
            }
            break;
        case "active":
            stats = {
                stats: "Activo",
                icon: "fas fa-plane me-1"
            }
            break;
        case "landed":
            stats = {
                stats: "Aterrizado",
                icon: "fas fa-plane-arrival me-1"
            }
            break;
        case "cancelled":
            stats = {
                stats: "Cancelado",
                icon: "fas fa-plane-slash me-1"
            }
            break;
        case "incident":
            stats = {
                stats: "Incidente",
                icon: "fas fa-exclamation-circle me-1"
            }
            break;
        case "diverted":
            stats = {
                stats: "Desviado",
                icon: "fas fa-angle-right me-1"
            }
            break;
        default:
            break;
    }
    return stats;
}

function dateFormat(date) {
    let temp = new Date(date);
    let str = "" + temp.getDate() + "-" + (temp.getMonth() + 1 < 10 ? "0" + (temp.getMonth() + 1) : temp.getMonth() + 1) + "-" + temp.getFullYear() + " Hr " + (temp.getHours() < 10 ? "0" + temp.getHours() : temp.getHours()) + ":" + (temp.getMinutes() < 10 ? "0" + temp.getMinutes() : temp.getMinutes());
    return str;
}

console.log(statusF("diverted"));


class FlightControllers {

    getFlightsByArr(req, res) {
        let url = urlAPI + req.query.arr_iata;
        console.log(url);

        let dataList = dataFile.data.map(e => {
            return {
                vueloNum: e.flight.iata,
                airLine: e.airline.name,
                salidaTime: e.departure.actual == null ? "---" : dateFormat(e.departure.actual),
                llegadaTime: e.arrival.estimated == null ? "---" : dateFormat(e.arrival.estimated),
                destinoName: e.arrival.airport,
                status: statusF(e.flight_status).stats,
                icon: statusF(e.flight_status).icon
            }
        })


        res.status(230).send(dataList);



        /*fetch(url).then(response =>{
            return response.json();
        }).then(data => {
            let dataList = data.data.map(e =>{
            return {
                vueloNum: e.flight.iata,
                airLine: e.airline.name,
                salidaTime: e.departure.actual==null?"---":dateFormat(e.departure.actual),
                llegadaTime: e.arrival.estimated==null?"---":dateFormat(e.arrival.estimated),
                destinoName: e.arrival.airport,
                status: statusF(e.flight_status)
            }
        })
            res.status(230).send(dataList);
        })
        .catch(e => {
            res.status(400).send(e);
        });*/
    }
    getFlightsByDep(req, res) {
        let url = urlAPI + req.query.dep_iata;

        let dataList = dataFile.data.map(e => {
            return {
                vueloNum: e.flight.iata,
                airLine: e.airline.name,
                salidaTime: e.departure.actual == null ? "---" : dateFormat(e.departure.actual),
                llegadaTime: e.arrival.estimated == null ? "---" : dateFormat(e.arrival.estimated),
                destinoName: e.arrival.airport,
                status: statusF(e.flight_status).stats,
                icon: statusF(e.flight_status).icon
            }
        })


        res.status(230).send(dataList);

        /* TODO Este si funciona correcto
        fetch(url).then(response => {
                return response.json();
            }).then(data => {
                let dataList = data.data.map(e => {
                    return {
                        vueloNum: e.flight.iata,
                        airLine: e.airline.name,
                        salidaTime: e.departure.actual == null ? "---" : dateFormat(e.departure.actual),
                        llegadaTime: e.arrival.estimated == null ? "---" : dateFormat(e.arrival.estimated),
                        destinoName: e.arrival.airport,
                        status: statusF(e.flight_status).stats,
                        icon: statusF(e.flight_status).icon
                    }
                })
                res.status(230).send(dataList);
            })
            .catch(e => {
                res.status(400).send(e);
            });*/
    }

    getFlightsByCode(req, res) {
        let url = urlAPI + req.query.flight_iata;
        console.log(url);

        /*fetch(url).then(response =>{
            return response.json();
        }).then(data => {
            let dataList = data.data.map(e =>{
            return {
                vueloNum: e.flight.iata,
                airLine: e.airline.name,
                salidaTime: e.departure.actual==null?"---":dateFormat(e.departure.actual),
                llegadaTime: e.arrival.estimated==null?"---":dateFormat(e.arrival.estimated),
                destinoName: e.arrival.airport,
                status: statusF(e.flight_status).stats,
                icon: statusF(e.flight_status).icon
            }
        })
            res.status(230).send(dataList);
        })
        .catch(e => {
            res.status(400).send(e);
        });*/

    }


    getAirportsList(req,res){

        fetch(urlAPIAirports).then(response =>{
            return response.json();
        }).then(data => {
            let dataList = data.data.map(e =>{
            return {
                iata_code: e.iata_code,
                airportName: e.airport_name,
                country: e.country_name,
                timezone: e.timezone
            }
        })
            res.status(230).send(dataList);
        })
        .catch(e => {
            res.status(400).send(e);
        });

    }


}

/*
 <h4 class="card-title">{{item.airportName}}</h4>
                      <p class="card-text letraSmall">Pais: {{item.country}}</p>
                      <p class="card-text letraSmall">Zona horaria: {{item.timezone}} </p>


                    </div>
                    <div class="card-footer text-muted letraMedium">
                      Código IATA: {{item.iata_code}}
*/

module.exports = FlightControllers;