var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TransferSchema   = new Schema({
  _links: {
    source: String,
    destination: String
  },
  amount: {
    currency: String,
    value: String
  },
  created: { type: Date, default: Date.now },
  metadata: {type: Schema.Types.Mixed}
});

module.exports = mongoose.model('Transfer', TransferSchema);
