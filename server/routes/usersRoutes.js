'use strict';
const express = require('express');
const {
    User,
} = require('./../models');
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

const UsersController = require('../controllers/usersControllers');
const usersControls = new UsersController();

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

router.get('/', (req, res) => {
    User.find({}, (err, result) => {

    })
});

const s3 = new aws.S3({
    accessKeyId: 'AKIAYGM6GOCDJC7H2LNL',
    secretAccessKey: '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'
  })

var upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'torneo-bucket-1',
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

router.post('/upload', upload.single('profilePic'), function (req, res, next) {
    console.log('Successfully uploaded file :)');
    res.send('Successfully uploaded file :)')
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