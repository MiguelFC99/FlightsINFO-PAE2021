const {
  User
} = require('./../models/index');

const moment = require('moment');
const jws = require('jwt-simple');

const {
  OAuth2Client
} = require('google-auth-library');


if (process.env.NODE_ENV == 'dev') {
  require('dotenv').config();
}


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

function createToken(us){
  let payload = {
    sub: us._id,
    iat: us.iat==undefined?moment().unix():us.iat,
    exp: us.exp==undefined?moment().add(1, 'days').unix():us.exp
  }
  console.log(payload);
  return jws.encode(payload, process.env.SECRET_TOKEN);
}

class UsersController {

  loginByCredent(req, res) {
    let user = req.body;
    User.findOne({
      email: user.email,
      password: user.password
    }).then(us => {
      let token = createToken(us);
      console.log("Respuesta de login", us);
      res.status(200).send({"token": token});
    }).catch(err => {
      console.log('Failed to insert: ', err);
      res.status(402).send("Usuario no encontrado")
    });
  }

  registerUser(req, res) {
    let user = req.body;
    User.insertOne({
      userName: user.userName,
      lastName: user.lastName,
      email: user.email,
      password: user.password
    }).then(results => {
      console.log(results);
      res.status(200).send("Usuario Creado")
    }).catch(err => {
      console.log('Failed to insert: ', err);
      res.status(402).send("usuario no registrado")
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
      User.findOne({email: data.email}).then( results =>{
        console.log(results);
        if(results.googleId == data.sub){
          let us = {_id: results._id, iat: data.iat, exp: data.exp}
          let token = createToken(us);
          console.log("entro al if")
          res.status(203).send({"token": token});
        }else{
          res.send("error en algo");
        }
      }).catch(err => {
        res.status(405).send(err);
      });
    }).catch(e => {
      res.status(401).send('bad credentials');
    });

  }

  

 
}

module.exports = UsersController;