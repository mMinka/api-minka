// BASE SETUP
// =============================================================================
// =====================================
// get the packages we need ============
// =====================================
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var morgan = require('morgan');
var cors = require('cors');
// configure app
app.use(morgan('dev')); // log requests to the console
// configure body parser
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());

var port = process.env.PORT || 8082; // set our port
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/api2'); // connect to our database
//configure routes for our api
var routesPerson = require('./routes/person');
var routesTransfer = require('./routes/transfer');
var routesChannel = require('./routes/channel');
// REGISTER OUR ROUTES -------------------------------
app.use('/person', routesPerson);
app.use('/transfer', routesTransfer);
app.use('/channel', routesChannel);
// =============================================================================
// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
// =============================================================================




// codeTelegram: function(data, callback) {
//     person.findOne({"phone": data.phone},function(err, person){
//       if(person != "null"){
//         var codigo = Math.floor(Math.random() * (10000 - 1));
//         //codigo = ('0000' + code).slice(-4);
//
//         var code = new Code();
//         code.phone = data.phone;
//         code.code = codigo;
//         code.save(function(err, doc) {
//           if(err)
//             callback(err, doc)
//         });
//         var message = 'tu codigo de verificacion es: ' + codigo;
//         var info = JSON.stringify({
//               "from": "Minka",
//               "to": "57"+data.phone,
//               "text": message
//             });
//             request.post({
//               type: "POST",
//               url: 'https://api.infobip.com/sms/1/text/single',
//               headers: {
//                 //"authorization": "Basic RGFNaW5rZTIxOlhsczhzbXMyMg==",
//                 "authorization": "Basic UGxheU1pbmsyMTpYbHM4c21zMzQ=",
//                 "content-type": "application/json",
//               },
//               body: info,
//               dataType: 'json'
//             }, function(err, doc){
//               if(err)
//                 console.log(err)
//               console.log(doc.body);
//             });
//           }else{
//             callback(err, person)
//           }
//     });
//   }
