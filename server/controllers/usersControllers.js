const {User} = require('./../models/index');

const { OAuth2Client } = require('google-auth-library');
const { response } = require('../routes/flightsRoutes');

if(process.env.NODE_ENV == 'dev'){
    require('dotenv').config();
}


const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

class UsersController{
    googleLogin(req, res){
        console.log('Datos de google ID TOKEN recibidos', req.body.idToken);
        
        const ticket = googleClient.verifyIdToken({
            idToken: req.body.idToken,
          }).then(re =>{
            const data = re.getPayload();
            console.log('Google response: ',re);
            console.log(data.email);
            res.send('Ok');
          }).catch(e =>{
            res.status(401).send('bad credentials');
          });
          
    }
}

module.exports = UsersController;