'use strict';
//install basic-auth to parse the authorization header 
const auth = require('basic-auth');
//Import the user model
const {User} = require('../models');
//Import bcrypt
const bcrypt = require('bcrypt');



// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
    let message; //store the mssage to display
    //Parse the user's credentials from the authorization header
    const credentials = auth(req);

    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });
        if (user) {
          const authenticated = bcrypt
            .compareSync(credentials.pass, user.password);
          if (authenticated) {
            console.log(`Authentication successful for username: ${user.firstName}`);
    
            // Store the user on the Request object.
            req.currentUser = user;
          } else {
            message = `Authentication failure for username: ${user.firstName}`;
          }
        } else {
          message = `User not found for username: ${credentials.name}`;
        }
      } else {
        message = 'Auth header not found';
      }

      if (message) {
        console.warn(message);
        res.status(401).json({message: 'Access Denied'});
      } else {
        next();
      }
    };