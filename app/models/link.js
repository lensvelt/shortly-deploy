var db = require('../config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


var linksSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

linksSchema.methods.shorten = function () {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5); 
  this.save();
};

var Link = mongoose.model('Link', linksSchema);

module.exports = Link;
