const TokenControllers = require('./tokenControllers');
const tokenCntrs = new TokenControllers();
//const dotenv = require('dotenv');
//dotenv.config();
const ObjectId = require('mongodb').ObjectId;
const {
  User,
  SavedFlights,
  SavedAirports
} = require('./../models/index');



const {
  OAuth2Client
} = require('google-auth-library');


if (process.env.NODE_ENV == 'dev') {
  require('dotenv').config();
}


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

class UsersController {

  loginByCredent(req, res) {
    let user = req.body;
    console.log("entro al login por credenciales");
    User.findOne({
      email: user.email,
      password: user.password
    }).then(us => {
      if (us != null) {
        let token = tokenCntrs.createToken(us._id);
        console.log("Respuesta de login", us);
        res.status(200).send({
          "token": token
        });
      } else {
        res.status(402).send({
          err: 402
        });
      }
    }).catch(err => {
      console.log('Failed to insert: ', err);
      res.status(400).send({
        err: 402
      })
    });
  }

  registerUser(req, res) {
    let user = req.body;
    User.insertOne({
      userName: user.userName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      picture: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
    }).then(results => {
      //console.log(results.insertedId);
      let token = tokenCntrs.createToken(results.insertedId);
      SavedFlights.insertOne({
        user_id: new ObjectId(results.insertedId),
        flightsList: []
      }).then(resfavList => {
        console.log("se creo el usuario y su Lista de favoritos vacia");
        SavedAirports.insertOne({
          user_id: new ObjectId(results.insertedId),
          airportsList: []
        }).then(resfinal => {
          res.status(200).send({
            "token": token
          })
        }).catch(errfinal => {
          console.log("Error no se pudo crear la lista de favoritos");
          res.status(402).send(errfinal)
        })
      }).catch(errFavList => {
        console.log("Error no se pudo crear la lista de favoritos");
        res.status(402).send({
          err: 402
        })
      })
    }).catch(err => {
      console.log('Failed to insert: ', err);
      res.status(402).send({
        err: 402
      })
    });
  }




  googleLogin(req, res) {
    console.log('Datos de google ID TOKEN recibidos', req.body.idToken);

    const ticket = googleClient.verifyIdToken({
      idToken: req.body.idToken,
    }).then(re => {
      const data = re.getPayload();
      console.log('Google response: ', re);
      console.log(data.email);
      User.findOne({
        email: data.email
      }).then(results => {
        console.log(results);
        if (results.googleId == data.sub) {

          let token = tokenCntrs.createToken(results._id);
          res.status(203).send({
            "token": token
          });
        } else {
          console.log("entro al update")
          User.updateOne({
            email: data.email
          }, {
            $set: {
              googleId: data.sub
            }
          }).then(result => {
            console.log(result)
            let token = tokenCntrs.createToken(results._id);
            res.status(203).send({
              "token": token
            });
          }).catch(err => {
            res.status(402).send(err)
          });
        }
      }).catch(err => {
        res.status(402).send({
          err: 402
        });
      });
    }).catch(e => {
      res.status(401).send('error en credenciales desde google');
    });

  }

  googleRegister(req, res) {
    console.log('Datos de google ID TOKEN recibidos para registro', req.body.idToken);

    const ticket = googleClient.verifyIdToken({
      idToken: req.body.idToken,
    }).then(re => {
      const data = re.getPayload();
      console.log('Google response: ', re);
      console.log(data.given_name, data.family_name);
      User.insertOne({
        userName: data.given_name,
        lastName: data.family_name,
        email: data.email,
        googleId: data.sub,
        picture: data.picture
      }).then(results => {
        let token = tokenCntrs.createToken(results.insertedId);
        SavedFlights.insertOne({
          user_id: new ObjectId(results.insertedId),
          flightsList: []
        }).then(resfavList => {
          console.log("se creo el usuario y su Lista de favoritos vacia");
          SavedAirports.insertOne({
            user_id: new ObjectId(results.insertedId),
            airportsList: []
          }).then(resfinal => {
            res.status(200).send({
              "token": token
            })
          }).catch(errfinal => {
            console.log("Error no se pudo crear la lista de favoritos");
            res.status(402).send(errfinal)
          })
        }).catch(errFavList => {
          console.log("Error no se pudo crear la lista de favoritos");
          res.status(402).send({
            err: 402
          })
        })
      }).catch(err => {
        console.log('Usuario ya registrado: ', err);
        res.status(423).send({
          err: 402
        })
      });
    }).catch(e => {
      res.status(402).send({
        err: 402
      });
    });
  }

  getOneUserById(req, res) {
    console.log("datos del req: ", req.id)
    User.findOne({
      _id: new ObjectId(req.id)
    }).then(user => {
      console.log("usuario de bd: ", user)
      res.status(200).send({
        user
      });
    }).catch(err => {
      res.status(400).send("usuario no encontrado");
    })
  }

  getFlightsArrOfUser(req, res) {
    console.log("id del usuario: ", req.id);
    SavedFlights.findOne({
      user_id: new ObjectId(req.id)
    }).then(list => {
      console.log("lista de vuelos del usuario: ", list);
      if(list.flightsList.length!=0){
        let flightsArr = list.flightsList.reverse();
        console.log(flightsArr);
        res.status(200).send(flightsArr);
      }else{
        res.status(402).send({err: 402});
      }
    }).catch(err => {
      res.status(400).send("Error al traer lista de vuelos del usuario", err);
    })
  }

  insertFlightstoArrUser(req, res) {
    console.log("id del usuario: ", req.id);
    console.log("este es el body: ", req.body);
    SavedFlights.updateOne({
      user_id: new ObjectId(req.id)
    }, {
      $addToSet: {
        flightsList: req.body
      }
    }, {
      upsert: true
    }).then(result => {
      console.log("lista de vuelos del usuario: ", result);
      if (result.result.nModified == 1) {
        res.status(200).send({
          res: "Object add"
        });
      } else {
        res.status(406).send({
          res: "Object ya existe"
        });
      }

    }).catch(err => {
      res.status(400).send("Error al insertar ItmFavFlightsList", err);
    })

  }

  deleteObjectIntoFlightsArrUser(req, res) {
    console.log("id del usuario: ", req.id);
    console.log("este es el body: ", req.query.vueloNum);
    SavedFlights.updateOne({
      user_id: new ObjectId(req.id)
    }, {
      $pull: {
        flightsList: {
          vueloNum: req.query.vueloNum
        }
      }
    }).then(result => {
      res.status(200).send(result);
    }).catch(err => {
      res.status(400).send("Error al eliminar ItmFavFlightsList", err);
    })
  }



  getFavAirportsListUser(req,res){
    console.log("id del usuario: ", req.id);
    SavedAirports.findOne({
      user_id: new ObjectId(req.id)
    }).then(list => {
      console.log("lista de vuelos del usuario: ", list);
      if(list.airportsList.length !=0){
        let airportsArr = list.airportsList.reverse();
        console.log(airportsArr);
        res.status(200).send(airportsArr);
      }else{
        res.status(402).send({err: 402});
      }
    }).catch(err => {
      res.status(400).send("Error al traer la listaFavAirports", err);
    })
  }


  insertItmFavAirportListUser(req,res){
    console.log("id del usuario: ", req.id);
    console.log("este es el body: ", req.body);
    SavedAirports.updateOne({
      user_id: new ObjectId(req.id)
    }, {
      $addToSet: {
        airportsList: req.body
      }
    }, {
      upsert: true
    }).then(result => {
      //console.log("lista de vuelos del usuario: ", result);
      if (result.result.nModified == 1) {
        res.status(200).send({
          res: "Object add"
        });
      } else {
        res.status(406).send({
          res: "Object ya existe"
        });
      }

    }).catch(err => {
      res.status(400).send("Error al insertar itemFavAirportList", err);
    })
  }

  deleteItmFavAirportsListUser(req,res){
    console.log("id del usuario: ", req.id);
    console.log("este es el body: ", req.query.iata_code);
    SavedFlights.updateOne({
      user_id: new ObjectId(req.id)
    }, {
      $pull: {
        airportsList: {
          iata_code: req.query.iata_code
        }
      }
    }).then(result => {
      res.status(200).send(result);
    }).catch(err => {
      res.status(400).send("al eliminar itemAeropuerto: ", err);
    })
  }







}

module.exports = UsersController;