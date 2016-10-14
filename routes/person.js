var express = require('express');
var router = express.Router();
var Person     = require('../controllers/person');
var Transfer = require('../models/transfer');
var person = require('../models/person')

	//=======================================
	//	get -> obtiene todos los usuarios
	//=======================================
	router.route('/')
	.get(function(req, res, next){
		Person.all(function(err, person){
    	if(err){
				res.status(404).json({response: false, error: 'UserNotFound'});
			}
      res.status(200).json(person);
			});
	})
	//=======================================
	//	post -> crea un usuario
	//=======================================
  .post(function(req, res) {
		//console.log(req.body);
  	Person.create(req.body, function(err, person){
			if(err)
				res.status(403).json({response: false});
			res.status(200).json({response: true, message: 'user created'});
		});
	});
	//=======================================
	//	get -> obtiene un usuairo por su id
	//=======================================
	router.route('/:id')
	 .get(function(req, res){
			Person.getId(req.params.id, function(err, person){
				if(err)
					res.status(404).json({response: false, error: "UserNotFound"});
				res.status(200).json(person);
			});
		})
	//=======================================
	//	put -> edita un usuario
	//=======================================
		.put(function(req, res) {
			Person.update(req.params.id,req.body, function(err, doc){
				if(err)
					res.status(403).json({response: false, error: "Not update"});
				res.status(202).json({response: true, message: "Update success"});
			});
	  })
	//=======================================
	//	delete -> elimina un usuario por su id
	//=======================================
		.delete(function(req, res){
			person.remove({ _id:req.params.id}, function(err, person1){
				if(err)
					res.status(404).json({response: false, error: "user not found"})
				else {
					res.status(202).json({response: true, message: "delete success"})
				}
			});
		});
	//=======================================
	//	get -> obtiene el balance de un usuario
	//=======================================
  router.route('/:id/balance')
		.get(function(req, res){
			Person.balance(req.params.id, function(err, person){
				if(err)
					res.status(404).json({response: false, message: "balance not found"});
				res.status(202).json(person);
			});
		});
module.exports = router;
