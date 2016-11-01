var Person    = require('../models/person');
var webwallet = require('webwallet');
var url 			 = 'http://core.minka.io:8080';

module.exports = {
  all: function(callback) {
    Person.find({},'_id properties channel',function(err, person){
      callback(err,person);
    });
  },
  getId: function(id, callback){
    Person.findOne({"channel.value": id},'_id properties channel', function(err, person) {
      callback(err, person);
    });
  },
  create: function(data, callback) {
    var walletaddress = webwallet.generate.address();
  	webwallet.register.address(url, walletaddress.statement);
    var person = new Person();
    person.properties = data.properties;
    person.channel = data.channel;
    person.coin.address = walletaddress.address;
  	person.coin.balance = '10';
  	person.coin.currency = "LUK";
  	person.coin.keys.scheme = walletaddress.keys.scheme;
  	person.coin.keys.private = walletaddress.keys.private;
  	person.coin.keys.public = walletaddress.keys.public;
    person.save(function(err, doc) {
      callback(err, doc);
    });
  },
  createWeb: function(phone, callback) {
    var channel = {
                    "type" : "phone",
                    "name": "phone",
                    "value": phone,
                    "username": phone,
                    "notificationId": "573185951045",
                    "status" : "unverified"
                  };
    var walletaddress = webwallet.generate.address();
  	webwallet.register.address(url, walletaddress.statement);
    var person = new Person();
    person.properties = "";
    person.channel = channel;
    person.coin.address = walletaddress.address;
  	person.coin.balance = '10';
  	person.coin.currency = "LUK";
  	person.coin.keys.scheme = walletaddress.keys.scheme;
  	person.coin.keys.private = walletaddress.keys.private;
  	person.coin.keys.public = walletaddress.keys.public;
    person.save(function(err, doc) {
      callback(err, doc);
    });
  },
  update: function(id,data, callback){
    Person.update({"channel.value": id}, { $set: {
      properties : data.properties,
      channel : data.channel
    }}, function(err, person){
      callback(err, person);
    });
  },
  balance: function(id, callback){
    Person.findOne({"channel.value": id},'coin.balance coin.currency',  function(err, personBalance){
      callback(err, personBalance)
    });
  }
};
