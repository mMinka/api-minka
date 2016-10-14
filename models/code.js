var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CodeSchema   = new Schema({
  idUser: String,
  code: String
});

module.exports = mongoose.model('Code', CodeSchema);
