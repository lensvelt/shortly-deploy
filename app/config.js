var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var db = mongoose.connection;
var Schema = mongoose.Schema;

db.on('error', console.error);
db.once('open', function() {
  console.log('Connected!');
});

mongoose.connect('mongodb://localhost/shortly-db');

var urlsSchema = new Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: Number
});

var usersSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});


module.exports = {
  db: db,
  urls: urlsSchema,
  users: usersSchema
};

// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: path.join(__dirname, '../db/shortly.sqlite')
//   },
//   useNullAsDefault: true
// });

// db.knex.schema.hasTable('urls').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('urls', function (link) {
//       link.increments('id').primary();
//       link.string('url', 255);
//       link.string('baseUrl', 255);
//       link.string('code', 100);
//       link.string('title', 255);
//       link.integer('visits');
//       link.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

// db.knex.schema.hasTable('users').then(function(exists) {
//   if (!exists) {
//     db.knex.schema.createTable('users', function (user) {
//       user.increments('id').primary();
//       user.string('username', 100).unique();
//       user.string('password', 100);
//       user.timestamps();
//     }).then(function (table) {
//       console.log('Created Table', table);
//     });
//   }
// });

