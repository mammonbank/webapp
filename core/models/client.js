'use strict';

var async = require('async'),
    bcrypt = require('bcrypt'),
    config = require('config'),
    debug = require('debug')('mammonbank:client:db');

/*
    Client model fields:
    {
        firstName,
        lastName,
        patronymic,
        dateOfBirth,
        phoneNumber,
        email,
        password,
        passportNumber,
        passportIdNumber,
        mothersMaidenName
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Client = sequelize.define('Client', {
        firstName: {
            // VARCHAR(255)
            type: DataTypes.STRING,
            allowNull: false,
            field: 'first_name',
            validate: {
                // Lowercase and uppercase letters, special symbols (,.'-):
                // TODO: add cyrillic letters support
                is: /^[a-z,.'-]+$/i
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'last_name',
            validate: {
                // TODO: add cyrillic letters support
                is: /^[a-z,.'-]+$/i
            }
        },
        patronymic: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'patronymic',
            validate: {
                // TODO: add cyrillic letters support
                is: /^[a-z,.'-]+$/i
            }
        },
        dateOfBirth: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'date_of_birth',
            validate: {
                isDate: true,
                isAfter: '1900-01-01',
                isBefore: function(value) {
                    if (value > Date.now()) {
                        throw new Error('Date of birth cannot be in the future');
                    }
                }
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'phone_number',
            validate: {
                // TODO: add validation
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // Minimum 8 characters at least 1 uppercase letter,
                // 1 lowercase letter and 1 number:
                is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
            }
        },
        passportNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'passport_number',
            validate: {
                // TODO: add validation
            }
        },
        passportIdNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'passport_id_number',
            validate: {
                // TODO: add validation
            }
        },
        mothersMaidenName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'mothers_maiden_name',
            validate: {
                // TODO: add cyrillic letters support
                is: /^[a-z,.'-]+$/i
            }
        }
    }, {
        tableName: 'clients',
        underscored: true,
        timestamps: true,
        paranoid: true,
        classMethods: {

        },
        instanceMethods: {
            verifyPassword: function(password, cb) {
                bcrypt.compare(password, this.password, function(error, isMatch) {
                    if (error) {
                        return cb(error);
                    }

                    cb(null, isMatch);
                });
            }
        }
    });

    Client.hook('beforeCreate', function(user, options, fn) {
        async.waterfall([
            function(cb) {
                bcrypt.genSalt(config.saltWorkFactor, cb);
            },
            function(salt, cb) {
                bcrypt.hash(user.password, salt, cb);
            }],
            function(error, hashedPassword) {
                if (error) {
                    debug(error);
                    fn(error);
                }

                user.password = hashedPassword;
                fn(null, user);
            });
        });

    return Client;
};
