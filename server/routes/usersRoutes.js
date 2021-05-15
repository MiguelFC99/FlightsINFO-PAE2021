'use strict';
const express = require('express');
const bodyParser = require('body-parser'); 
//const dotenv = require('dotenv');
//dotenv.config();
const {
    User,
} = require('./../models');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');



const UsersController = require('../controllers/usersControllers');
const usersControls = new UsersController();

const linkList =[]
if (process.env.NODE_ENV == 'dev') {
    require('dotenv').config();
  }
  
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    const flag = file.mimetype.startsWith('image');
    cb(null, flag);
};


const uploadFile = multer({
    storage: multerStorage,
    fileFilter: fileFilter
})


const router = express();

//router.use(bodyParser.json({limit: "50mb"}));
//router.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

router.get('/', (req, res) => {
    User.find({}, (err, result) => {

    })
});

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  })

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'flights-info-app',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, {
                fieldName: file.fieldname
            });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '.' + file.originalname.split('.').pop()); //date + extension
        }
    })
});

router.post('/upload', upload.array('file',1), function (req, res, next) {
    console.log('Successfully uploaded file :)');
    console.log(req)
    linkList.unshift({namefile: req.files[0].originalname,link: req.files[0].location});
    res.send(linkList)
  });


router.post('/reg', uploadFile.single('profilePic'), (req, res) => {
    console.log(req.file, req.body)
    if (req.file) {
        console.log('resultado:', req.body, req.file)
        res.send('imagen guardada y usuario recibido');

    } else {
        res.send('archivo incorrecto o sin archivo');
    }
})

router.get('/hola',(req, res)=>{
    res.status(200).send("ok");
})

router.get('/one-us',usersControls.getOneUserById);  


router.get('/flights_list',usersControls.getFlightsArrOfUser);
router.post('/favorite_list_addItm',usersControls.insertFlightstoArrUser);
router.delete('/favorite_list_deleteItm',usersControls.deleteObjectIntoFlightsArrUser);


router.get('/favAirports_list',usersControls.getFavAirportsListUser);
router.post('/favAirports_list_addItm',usersControls.insertItmFavAirportListUser);
router.delete('/favAirports_list_deleteItm',usersControls.deleteItmFavAirportsListUser);





//router.post('/auth/google', usersControls.googleLogin);

module.exports = router;