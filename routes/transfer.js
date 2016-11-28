var express = require('express');
var router = express.Router();
var Person     = require('../models/person');
var Telegram     = require('../controllers/telegram');
var Transfer = require('../controllers/transfer');
var Channel = require('../controllers/channel');
var transferModel = require('../models/transfer');

router.route('/')
  .get(function(req, res){
    Transfer.get(function(err, transfers){
      if(err)
        res.send(err);
      res.json(transfers);
    });
  })
  .post(function(req, res) {
      var transfer = new transferModel();
      var status;
      //check el balance para poder realizar la transaccion
      //se busca la persona que esta enviando dinero
      Person.find({
          "$or": [{
              "channel.value": req.body._links.source
          }, {
              "channel.username": req.body._links.source
          }]
      }, function(err, send) {
          if (+send.coin.balance >= +req.body.amount.value) {
              Person.find({
                  "$or": [{
                      "channel.value": req.body._links.destination
                  }, {
                      "channel.username": req.body._links.destination
                  }]
              }, function(err, receiver) {
                  if (receiver == null) {
                      var message = 'te enviaron dinero por medio de mislukas';
                      var info = JSON.stringify({
                          "from": "Minka",
                          "to": "57" + req.body._links.destination,
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
                      }, function(err, doc) {
                          if (err)
                              console.log(err)
                          console.log(doc.body);
                      });

                      createWeb(req.body._links.destination, function(err, doc) {
                          if (err) {
                              res.status(404).json({
                                  response: false,
                                  message: "something happened, i'm sorry"
                              });
                          }
                      })
                      status = "PENDIENTE";
                  } else {
                      status = 'PROCESSEED';
                  }
                  //update los balances de las cuentas
                  Transfer.updateBalance(send._id, receiver._id, req.body.amount.value);
                  //guardar los datos en transfer
                  Transfer.create(status, req.body, function(err, transfer) {
                      if (err)
                          res.send(err)
                      res.status(202).json({
                          response: true,
                          message: "transfer success"
                      });
                  });
              });
          } else {
              res.json({
                  "error": "fondos insuficientes para realizar la transaccion",
                  "messages": "Lo sentimos no tienes fondos suficientes para realizar la transaccion"
              });
          }
      });
  });

  router.route('/:id')
    .get(function(req, res){
      Transfer.getSource(req.params.id, function(err, transfers){
        if(err)
          res.send(err);
        res.json(transfers);
      });
    });
      //check el balance para poder realizar la transaccion
      //update los balances de las cuentas
      //guardar los datos en transfer

module.exports = router;
