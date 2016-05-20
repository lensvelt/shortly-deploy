var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function() {
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  var linkQuery = Link.findOne();
  linkQuery.exec(function(err, link) {
    if (err) {
      console.log(err);
      res.redirect('/'); //redirect to where?
    } else {
      res.status(200).send(link);
    }
  });
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  //If url is invalid, return 404 response
  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.sendStatus(404);
  }

  //else save the link
  var linkQuery = Link.findOne({ url: uri });
  linkQuery.exec(function(err, link) {
    //Handle errors & redirect
    if (err) {
      console.log(err);
      res.redirect('/'); //redirect to where?
    } else {
      //Save the link
      util.getUrlTitle(uri, function(err, title) {
        //If error reading title, return 404 response
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.sendStatus(404);
        }
        //Else save the link
        Link.create({
          url: uri,
          title: title,
          baseUrl: req.headers.origin
        }, function(err, link) {
          if (err) {
            console.log('Error saving link');
            return res.redirect('/');
          }
          res.status(200).send(link);
          console.log('Link saved successfully!');  
        });
      });  
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var loginQuery = User.findOne({ username: username });

  loginQuery.exec(function(err, user) {
    if (!user) {
      console.log('user name not found');
      res.redirect('/login');
    } else {
      user.comparePassword(password, function(match) {      
        if (match) {
          util.createSession(req, res, user);
        } else {
          res.redirect('/login');
        }
      });
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var userQuery = User.findOne({ username: username });
  userQuery.exec(function(err, user) {
    if (!user) {
      User.create({
        username: username,
        password: password 
      }, function(err, user) {
        if (err) {
          console.log('Account already exists');
          return res.redirect('/signup');
        }
        user.hashPassword();
        util.createSession(req, res, user);
        console.log('User saved successfully!');  
      });
    }
  });
};


  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           Users.add(newUser);
  //           util.createSession(req, res, newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   });
// };

// exports.navToLink = function(req, res) {
//   new Link({ code: req.params[0] }).fetch().then(function(link) {
//     if (!link) {
//       res.redirect('/');
//     } else {
//       link.set({ visits: link.get('visits') + 1 })
//         .save()
//         .then(function() {
//           return res.redirect(link.get('url'));
//         });
//     }
//   });
// };
