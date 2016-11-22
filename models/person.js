var mongoose     = require('mongoose');
var findOrCreate = require('mongoose-findorcreate');
var Schema       = mongoose.Schema;

var propertiesSchema = new Schema({
		name: String,
		value: String
});

var channelsSchema = new Schema({
		type: String,
		name: String,
		value: String,
		username: String,
		notificationId: String,
		status: String
});

var PersonSchema   = new Schema({
	properties: [propertiesSchema],
	channel: [channelsSchema],
  coin: {
		address: String,
		balance: String,
		currency: String,
		keys: {
			scheme: String,
			private: String,
			public: String
		}
	},
	created: { type: Date, default: Date.now }
});

PersonSchema.plugin(findOrCreate);

module.exports = mongoose.model('Person', PersonSchema);
