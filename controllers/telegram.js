var Code = require('../models/code');
var Person = require('../models/person');
var request = require('request');

module.exports = {
  codeTelegram: function(data, callback) {
    Person.findOne({"phone": data.phone},function(err, person){
      if(person != "null"){
        var codigo = Math.floor(Math.random() * (10000 - 9999) + 10000);
        var code = new Code();
        code.phone = data.phone;
        code.code = codigo;
        code.save(function(err, doc) {
          if(err)
            callback(err, doc)
        });
        var message = 'tu codigo de verificacion es: ' + codigo;
        var info = JSON.stringify({
              "from": "Minka",
              "to": "57"+data.phone,
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
          }else{
            callback(err, person)
          }
    });
  },
  getIdTelegram: function(idTelegram, callback){
    Person.findOne({'idTelegram': idTelegram},function(err, person){
      callback(err, person);
    });
  },
  getUserTelegram: function(userTelegram, callback){
    Person.findOne({'TelegramUserName': userTelegram},function(err, person){
      callback(err, person);
    });
  },
  balanceTelegram: function(idTelegram, callback){
    Person.findOne({'idTelegram': idTelegram},'wallet.balance',  function(err, personBalance){
      callback(err, personBalance)
    });
  },
}
