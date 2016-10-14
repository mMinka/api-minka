var Transfer    = require('../models/transfer');
var Person    = require('../models/person');

module.exports = {
  get: function(callback) {
    Transfer.find({},null,{sort: {created: -1}},function(err, person){
      callback(err,person);
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
