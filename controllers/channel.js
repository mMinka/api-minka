var request = require('request');

module.exports = {
  send: function(message, phone, callback) {

    var info = JSON.stringify({
	        "from": "Minka",
	        "to": phone,
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
        }, function(err, data){
          callback(err, data);
        });
  }
};
