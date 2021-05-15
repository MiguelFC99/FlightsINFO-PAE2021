const express = require('express');
const cors = require('cors');
//const dotenv = require('dotenv');
//dotenv.config();
const socketIo = require('socket.io');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerUI = require('swagger-ui-express'); 
const UsersControllers = require('./controllers/usersControllers');
const userControls = new UsersControllers();
const TokenControllers = require('./controllers/tokenControllers');
const tokenCtrs = new TokenControllers();
const {
    flightsRoutes,
    usersRoutes
} = require('./routes/indexRoutes');

if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
  }

const PORT = process.env.PORT || 3000;
const path = require('path');
const token = require('./models/token');

const app = express();
const swaggerOptions = {
    swaggerDefinition: {
        swagger: "2.0",
        info: {
            "title": "Flights API Proyecto PAE 2021",
            "description": "api proyecto p2021",
            "version": "1.0.0",
            "servers": [ "http://localhost:3000"]
        }
    },
    apis: ['index.js']
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))


/**
 * @swagger
 *
 * /users:
 *   get:
 *     description: "get all users"
 *     parameters:
 *     - in: "query"
 *       name: "AllUsers"
 *       description: "regresa todos los usuarios"
 *       required: false
 *       schema:
 *         type: string
 *     responses:
 *       "200":
 *         description: "list with all users"
 */
app.use('/flights', flightsRoutes);
app.use('/users',tokenCtrs.verifyToken,usersRoutes);


//Authentication
app.post('/auth/register', userControls.registerUser);
app.post('/auth/login', userControls.loginByCredent);

app.post('/auth/googlelog',userControls.googleLogin);
app.post('/auth/googlereg',userControls.googleRegister)



app.get('/', (req, res) => {
    res.statusCode = 200;
});



//swagger documentation
const swaggerDoc = swaggerJsDoc(swaggerOptions);

app.use('/swagger',swaggerUI.serve, swaggerUI.setup(swaggerDoc));



let server = app.listen(PORT, function () {
    console.log('app is running in http://localhost:3000')
});



const mensajesList= [];

const soIo = socketIo(server,{
    cors: {
        origin: 'http://localhost:4200',
        methods: ['GET','POST'],
        allowHeaders: ['Authorizacion'],
        credentials: true
    }
})

soIo.on('connection', socket =>{
    socket.on('send-message', (data)=>{
        mensajesList.unshift(data);
        socket.emit('text-event',mensajesList);
        socket.broadcast.emit('text-event',mensajesList);
    })
    console.log('se ha conectado al socket');
})
