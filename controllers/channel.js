//var Channel    = require('../models/channel');
var request = require('request');

module.exports = {
  send: function(data, callback) {

    var message = data.phoneSend + ' te envio ' + data.amount.value;
    var channel = new Channel();
    channel.actors.source = data.phoneSend;
    channel.actors.destination = data.phoneReceive;
    channel.channel = 'SMS';
    Channel.body = data.phoneSend + ' te envio ' + data.amount.value;
    channel.status = 'PROCESSED';
    channel.save(function(err, response){
      callback(err, response);
    });
    var info = JSON.stringify({
	        "from": "Minka",
	        "to": "57"+data.phoneReceive,
	        "text": message
	      });
        request.post({
          type: "POST",
          url: 'https://api.infobip.com/sms/1/text/single',
          headers: {
            "authorization": "Basic RGFNaW5rZTIxOlhsczhzbXMyMg==",
            //"authorization": "Basic UGxheU1pbmsyMTpYbHM4c21zMzQ=",
            "content-type": "application/json",
          },
          body: info,
          dataType: 'json'
        }, function(err, data){
          console.log(data.body);
        });
  }
};
