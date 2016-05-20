var mongoose = require('mongoose');
var db = mongoose.connection;

mongoose.connect('mongodb://localhost/shortly-db');

db.on('error', console.error);
db.once('open', function() {
  console.log('Connected!');
});

module.exports = db;
