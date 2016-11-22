var express = require('express');
var router = express.Router();
var request = require('request');
var Person = require('../controllers/person');
var person = require('../models/person')
var Code = require('../models/code')
var sms = require('../controllers/channel');


// router.use(function(req, res, next) {
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.param('token') || req.headers['x-access-token'];
//     // decode token
//     if (token) {
//         // verifies secret and checks exp
//         jwt.verify(token, app.get('secret'), function(err, decoded) {
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
	//	post -> crea un channel
	//=======================================
	router.route('/')
  .post(function(req, res) {
		//console.log(req.body);
  	Person.create(req.body, function(err, person){
			if(err)
				res.status(403).json({response: false});
			res.status(200).json({response: true, message: 'user created'});
		});
	});
	//=======================================
	//	get -> obtiene un channel
	//=======================================
	router.route('/:id')
	 .get(function(req, res){
			// Person.getId(req.params.id, function(err, person){
			// 	if(err)
			// 		res.status(404).json({response: false, error: "UserNotFound"});
			// 	res.status(200).json(person);
			// });
			res.json({response: true, message: "good for you"})
		})
	//=======================================
	//	post -> verifica el channel
	//=======================================
  router.route('/:id/verify')
		.post(function(req, res){
			Person.getId(req.params.id, function(err, persona){
				if(err)
					res.status(404).json({response: false, error: "UserNotFound"});
				Code.findOne({"code": req.body.code},function(err, codigo){
					if(err)
						res.status(404).json({response: false, error: "no se encontro el codigo"});
					for(var i = 0; i<persona.channel.length; i++){
						if(persona.channel[i].type == "phone"){
							person.update({"channel._id": persona.channel[i]._id}, { $set: {
					      "channel.$.status": "verified"
					    }}, function(err, doc){
								if(err)
									res.status(404).json({response: false, error: "no se pudo editar", message: err});
								Code.remove({"code": req.body.code});
					      res.status(202).json({response: true, message: "verify success"});
					    });
						}
					}
				})
			});
		});
	//=======================================
	//	post -> hace login
	//=======================================
	  router.route('/login')
			.post(function(req, res){
				Code.findOne({"code": req.body.code},function(err, codigo){
					if(err)
						res.status(404).json({response: false, error: "no se encontro el codigo"});
					Person.getId(req.body.user, function(err, person){
						if(err)
							res.status(404).json({response: false, error: "error"});
						Code.remove({"code": req.body.code});
						res.status(202).json({response: true, message: "verify success", person});
					})
				})
			});
	//=======================================
	//	post -> enviar el otp
	//=======================================
	router.route('/:id/sendotp')
		.post(function(req, res){
			Person.getId(req.params.id, function(err, person){
				if(err){
					res.status(404).json({response: false, error: "error"});
				}else if(person == null){
					Person.createWeb(req.params.id);
					var codigo = Math.floor( Math.random() * (10000-999 + 1) + 999 );
					//codigo = ('0000' + code).slice(-4);
					var code = new Code();
					code.remove({idUser: req.params.id});
					code.idUser = req.params.id;
					code.code = codigo;
					code.save(function(err, doc) {
						if(err)
							callback(err, doc)
					});
					var message = 'tu codigo de verificacion es: ' + codigo;
          sms.send(message, req.params.id, function(err, data){
            if(err)
							console.log(err)
						console.log(doc.data);
          });
          // var info = JSON.stringify({
					// 	"from": "Minka",
					// 	"to": "57"+req.params.id,
					// 	"text": message
					// });
					// request.post({
					// 	type: "POST",
					// 	url: 'https://api.infobip.com/sms/1/text/single',
					// 	headers: {
					// 		//"authorization": "Basic RGFNaW5rZTIxOlhsczhzbXMyMg==",
					// 		"authorization": "Basic UGxheU1pbmsyMTpYbHM4c21zMzQ=",
					// 		"content-type": "application/json",
					// 	},
					// 	body: info,
					// 	dataType: 'json'
					// }, function(err, doc){
					// 	if(err)
					// 		console.log(err)
					// 	console.log(doc.body);
					// });
					res.status(202).json({response: true, message: "send success"});
				}else{
					for(var i = 0; i<person.channel.length; i++){
						if(person.channel[i].type == "phone"){
							var codigo = Math.floor(Math.random() * (10000 - 1));
							//codigo = ('0000' + code).slice(-4);
							var code = new Code();
							code.remove({idUser: req.params.id});
							code.idUser = req.params.id;
							code.code = codigo;
							code.save(function(err, doc) {
								if(err)
									callback(err, doc)
							});
							var message = 'tu codigo de verificacion es: ' + codigo;
							var info = JSON.stringify({
								"from": "Minka",
								"to": "57"+person.channel[i].username,
								"text": message
							});
							request.post({
								type: "POST",
								url: 'https://api.infobip.com/sms/1/text/single',
								headers: {
									//"authorization": "Basic RGFNaW5rZTIxOlhsczhzbXMyMg==",
									"authorization": "Basic UGxheU1pbmsyMTpYbHM4c21zMzQ=",
									"content-type": "application/json",
								},
								body: info,
								dataType: 'json'
							}, function(err, doc){
								if(err)
									console.log(err)
								console.log(doc.body);
							});
							res.status(202).json({response: true, message: "send success"});
						}else{
							res.status(404).json({response: false, message: "not found channel"});
						}
					}
				}
			});
		});
  //=======================================
  //	post -> enviar un sms solo
  //=======================================
  router.route('/login')
    .post(function(req, res){
      sms.send(function(){

      });
    });

module.exports = router;
