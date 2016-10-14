var express = require('express');
var router = express.Router();
var Telegram     = require('../controllers/telegram');
var Code = require('../models/code');
var Person = require('../models/person');
var request = require('request');
  //=======================================
  //	post -> crea un usuario
  //=======================================
  router.route('/registro')
    .post(function(req, res){
      Person.findOne({idTelegram: req.body.idTelegram}, function(err, person){
        if(err)
          res.json(err)
        else if(person == null) {
          Telegram.registroTelegram(req.body, function(err, doc){
            if(err)
              res.status(403).json({response: false, error: "no se pudo registrar el usuario"});
            res.status(200).json({response: true, message: "created success"});
          })
        }else {
          res.status(403).json({response: false, error: "El usuario ya existe"});
        }
      });
    })
  //=======================================
  //	get -> obtiene un usuario por username
  //=======================================
  router.route('/:username')
   .get(function(req, res){
      Telegram.getUserTelegram(req.params.user, function(err, person){
        if(err)
          res.status(403).json({response: false, error: 'UserNotFound'});
        res.status(200).json(person);
      });
    });
  //=======================================
  //	get -> obtiene un usuario por id
  //=======================================
  router.route('/:idTelegram')
    .get(function(req, res){
      Telegram.getIdTelegram(req.params.idTelegram, function(err, person){
        if(err)
          res.status(403).json({response: false, error: 'UserNotFound'});
        res.status(200).json(person);
      });
    });
  //=======================================
  //	get -> obtiene el balance de un usuario
  //=======================================
  router.route('/:id/balance')
    .get(function(req, res){
    	Telegram.balanceTelegram(req.params.id, function(err, person){
    	  if(err)
    			res.status(404).json({response: false, message: "balance not found"});
    		res.status(202).json(person);
    	});
    });
  //=======================================
  //	get -> obtiene el balance de un usuario
  //=======================================
  router.route('/transfer')
  	.post(function(req, res){
  		var transfer = new transferModel();
  		var status;
  		//check el balance para poder realizar la transaccion
  		//se busca la persona que esta enviando dinero
  		Person.getIdTelegram(req.body.idSend, function(err, idSend){
  			if(+idSend.wallet.balance >= +req.body.amount.value){
  				Person.getUserTelegram(req.body.userReceive, function(err, userReceive){
  					if(userReceive == null){
  						res.json({"error" : "fondos insuficientes para realizar la transaccion", "messages":"Lo sentimos no tienes fondos suficientes para realizar la transaccion"});
  					}else{
  						status = 'PROCESSEED';
  					}
  					//update los balances de las cuentas
  					Transfer.updateBalance(req.body);
  					//guardar los datos en transfer
  					Transfer.create(idSend, userReceive,status, req.body, function(err, transfer){
  						if(err)
  							res.send(err)
  						res.json(transfer);
  					});
  				});
  			}else {
  				res.json({"error" : "fondos insuficientes para realizar la transaccion", "messages":"Lo sentimos no tienes fondos suficientes para realizar la transaccion"});
  			}
  		});
  	});
module.exports = router;
