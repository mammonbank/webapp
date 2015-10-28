'use strict';

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Client  = require('models').Client;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        Client
            .findOne({
                where: {
                    email: email
                }
            })
            .then(function(client) {
                if (!client) {
                    return done(null, false, { message: 'Incorrect credentials' });
                }
                client.verifyPassword(password, function(error, isMatch) {
                    if (error) {
                        return done(error);
                    }
                    if (!isMatch) {
                        return done(null, false, { message: 'Incorrect credentials' });
                    }
                    return done(null, client);
                });
            })
            .catch(function(error) {
                done(error);
            });
    }
));

passport.serializeUser(function(client, done) {
    done(null, client.id);
});

passport.deserializeUser(function(id, done) {
    Client
        .findById(id)
        .then(function(client) {
            done(null, client);
        })
        .catch(function(error) {
            done(error, null);
        });
});

module.exports = passport;
