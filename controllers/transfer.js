var Transfer    = require('../models/transfer');
var Person    = require('../models/person');

module.exports = {
  get: function(callback) {
    Transfer.find({},null,{sort: {created: -1}},function(err, person){
      callback(err,person);
    });
  },
  getSource: function(source, callback) {
    Transfer.find({"_links.source": source},null,{sort: {created: -1}},function(err, transfers){
      callback(err,transfers);
    });
  },
  create: function(status,data, callback) {
  	var transfer = new Transfer();
    transfer._links.source = data._links.source;
  	transfer._links.destination = data._links.destination;
  	transfer.amount.currency = data.amount.currency;
  	transfer.amount.value = data.amount.value;
    transfer.metadata = data.metadata;
  	transfer.save(function(err, doc) {
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
  updateBalance: function(send, receiver,amount, callback){
    Person.findOne({"_id":send},function(err, user1){
      user1.coin.balance = +user1.coin.balance - +amount;
      user1.save(function(err){
        if(err)
          res.send('se produjo un error al actualizar el balance');
      })
    });
    //se busca la persona que esta recibiendo el dinero para sumarle el balance
    Person.findOne({"_id":receiver},function(err, user2){
      user2.coin.balance = (+user2.coin.balance) + (+amount);
      user2.save(function(err){
        if(err)
          res.send('se produjo un error al actualizar el balance');
      })
    });
  }
};
