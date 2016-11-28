var express = require('express');
var app = express();
var router = express.Router();
var Person = require('../controllers/person');
var Transfer = require('../models/transfer');
var person = require('../models/person');
var jwt = require('jsonwebtoken');

// router.use(function(req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//     // decode token
//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, 'minka424', function(err, decoded) {
//             if (err) {
//                 return res.json({
//                     success: false,
//                     message: 'Failed to authenticate token.'
//                 });
//             } else {
//                 // if everything is good, save to request for use in other routes
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     } else {
//         // if there is no token
//         // return an error
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         });
//     }
// });

//=======================================
//	get -> obtiene todos los usuarios
//=======================================
router.route('/')
    .get(function(req, res, next) {
        Person.all(function(err, person) {
            if (err) {
                res.status(404).json({
                    response: false,
                    error: 'UserNotFound'
                });
            }
            res.status(200).json(person);
        });
    })
    //=======================================
    //	post -> crea un usuario
    //=======================================
    .post(function(req, res) {
        // Person.getId(req.body.channel[1].value, function(err, person) {
        //     if(err)
        //       res.status(404).json({
        //         response: false,
        //         error: "Error"
        //       });
        //     if(person === null)
        //       Person.create(req.body, function(err, person) {
        //           if (err)
        //             res.status(403).json({
        //                 response: false
        //             });
        //           res.status(200).json({
        //             response: true,
        //             message: 'user created'
        //           });
        //       });
        //     res.status(200).json({
        //       response: true,
        //       message: 'user created'
        //     });
        // });
        Person.create(req.body, function(err, person) {
            if (err)
                res.status(403).json({
                    response: false
                });
            res.status(200).json({
                response: true,
                message: 'user created'
            });
        });
    });
//=======================================
//	get -> obtiene un usuario por su id
//=======================================
router.route('/:id')
    .get(function(req, res) {
        Person.getId(req.params.id, function(err, person) {
            if (err)
                res.status(404).json({
                    response: false,
                    error: "UserNotFound"
                });
            res.status(200).json(person);
        });
    })
    //=======================================
    //	put -> edita un usuario
    //=======================================
    .put(function(req, res) {
        Person.update(req.params.id, req.body, function(err, doc) {
            if (err)
                res.status(403).json({
                    response: false,
                    error: "Not update"
                });
            res.status(202).json({
                response: true,
                message: "Update success"
            });
        });
    })
    //=======================================
    //	delete -> elimina un usuario por su id
    //=======================================
    .delete(function(req, res) {
        person.remove({
            _id: req.params.id
        }, function(err, person1) {
            if (err)
                res.status(404).json({
                    response: false,
                    error: "user not found"
                })
            else {
                res.status(202).json({
                    response: true,
                    message: "delete success"
                })
            }
        });
    });
//=======================================
//	get -> obtiene el balance de un usuario
//=======================================
router.route('/:id/balance')
    .get(function(req, res) {
        Person.balance(req.params.id, function(err, person) {
            if (err)
                res.status(404).json({
                    response: false,
                    message: "balance not found"
                });
            res.status(202).json(person);
        });
    });
//=======================================
//	get -> Genera un token para un determinado usuario
//=======================================
router.route('/:id/token')
    .get(function(req, res) {
        Person.getId(req.params.id, function(err, person) {
          if (err) {
              res.status(404).json({
                  response: false,
                  error: "UserNotFound"
              });
          }else{
            var token = jwt.sign(person, 'minka424', {
                expiresIn: "2 days" // expires in 24 hours
            });
            // return the information including token as JSON
            res.json({
              success: true,
              message: 'Enjoy your token!',
              token: token,
              person: person
            });
          }
        });
    });
module.exports = router;
