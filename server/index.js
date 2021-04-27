const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const swaggerJsDoc = require('swagger-jsdoc');

const swaggerUI = require('swagger-ui-express'); 
const UsersControllers = require('./controllers/usersControllers');
const userControls = new UsersControllers();
const {
    flightsRoutes,
    usersRoutes
} = require('./routes/indexRoutes');

dotenv.config();
const path = require('path');
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
app.use('/users', usersRoutes);


app.post('/register', userControls.registerUser);
app.post('/login', userControls.loginByCredent);



app.get('/', (req, res) => {
    res.statusCode = 200;
});




//swagger documentation
const swaggerDoc = swaggerJsDoc(swaggerOptions);

app.use('/swagger',swaggerUI.serve, swaggerUI.setup(swaggerDoc));


app.listen(3000, function () {
    console.log('app is running in http://localhost:3000')
});