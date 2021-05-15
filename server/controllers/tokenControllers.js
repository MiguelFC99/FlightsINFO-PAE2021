const moment = require('moment');
const jws = require('jwt-simple');
//const dotenv = require('dotenv');
//dotenv.config();
const {
    Token,
    User
} = require('./../models/index');
const token = require('../models/token');
const ObjectId= require('mongodb').ObjectId;

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
}


class TokenControllers {
    createToken(us) {
        let payload = {
            sub: us,
            iat: moment().unix(),
            exp: moment().add(30, 'days').unix()
        }
        console.log(payload);
        let token = jws.encode(payload, process.env.SECRET_TOKEN);
        this.checkTokendb(payload,token);
        return token;
    }

    verifyToken(req, res, next) {
        
        let xauth = req.headers.authorization;
        console.log("checar token error: ", req.headers.authorization);
        if (xauth) {
            let jwsRes = jws.decode(xauth, process.env.SECRET_TOKEN)
            console.log("una respuesta", jwsRes.sub)
            req.id = jwsRes.sub;
            next();

        } else {
            res.status(466).send('Not authorized 1');
        }

    }

    checkTokendb(payload, token) {
        console.log("aqui estOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        Token.insertOne({
            user_id: new ObjectId(payload.sub),
            token: token,
            iat: payload.iat,
            exp: payload.exp
        }).then(result => {
            //console.log(result);
            console.log("creo un nuevo token")
        }).catch(err => {
            console.log("entro a actualizar el token")
            
            Token.updateOne({
                user_id: new ObjectId(payload.sub)
            }, {$set: {
                token: token,
                iat: payload.iat,
                exp: payload.exp
            }} ).then(result => {
                console.log("actualizo el token")
            }).catch(err => {
                console.log("error 1");
            })
        });
    }



}




module.exports = TokenControllers;