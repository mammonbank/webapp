'use strict';

var _ = require('lodash'),
    async = require('async'),
    bcrypt = require('bcrypt'),
    config = require('config'),
    helper = require('helper'),
    debug = require('debug')('mammonbank:api');

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
        mothersMaidenName,
        secret,
        isConfirmed,
        creditHistoryCoefficient
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
                is: /^[а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'last_name',
            validate: {
                is: /^[а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
        patronymic: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'patronymic',
            validate: {
                is: /^[а-яА-ЯёЁa-z,.'-]+$/i
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
                    if ( helper.getYearsDiff(Date.now(), value) < 18 ) {
                        throw new Error('You must be at least 18 years old');
                    }
                }
            }
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'phone_number',
            validate: {
                // TODO: add phone format validation
                isUnique: function(value, next) {
                    Client
                        .find({
                            where: { phoneNumber: value }
                        })
                        .then(function(client) {
                            if (client) {
                                return next('Phone number already in use!');
                            }
                            
                            next();
                        })
                        .catch(function(error) {
                            return next(error);
                        });
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
                isUnique: function(value, next) {
                    Client
                        .find({
                            where: { email: value }
                        })
                        .then(function(client) {
                            if (client) {
                                return next('Email already in use!');
                            }
                            
                            next();
                        })
                        .catch(function(error) {
                            return next(error);
                        });
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // Minimum 8 characters at least 1 uppercase letter,
                // 1 lowercase letter and 1 number:
                is: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[а-яА-ЯёЁa-zA-Z\d]{8,}$/
            }
        },
        passportNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'passport_number',
            validate: {
                // TODO: add format validation
                isUnique: function(value, next) {
                    Client
                        .find({
                            where: { passportNumber: value }
                        })
                        .then(function(client) {
                            if (client) {
                                return next('Passport number already in use!');
                            }
                            
                            next();
                        })
                        .catch(function(error) {
                            return next(error);
                        });
                }
            }
        },
        passportIdNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            field: 'passport_id_number',
            validate: {
                // TODO: add format validation
                isUnique: function(value, next) {
                    Client
                        .find({
                            where: { passportIdNumber: value }
                        })
                        .then(function(client) {
                            if (client) {
                                return next('Passport id number already in use!');
                            }
                            
                            next();
                        })
                        .catch(function(error) {
                            return next(error);
                        });
                }
            }
        },
        mothersMaidenName: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'mothers_maiden_name',
            validate: {
                is: /^[а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
        //used in two-factor authentication
        secret: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'secret'
        },
        //flag indicating that the client has been checked by bank
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_confirmed'
        },
        creditHistoryCoefficient: {
            type: DataTypes.REAL,
            allowNull: false,
            defaultValue: 0,
            field: 'credit_history_coefficient'
        },
		  scoringFormId: {
		  type: DataTypes.STRING,
        allowNull: false,
        field: 'scoring_form_id'
        }
    }, {
        tableName: 'clients',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                Client.hasMany(models.Credit);
                Client.hasMany(models.CreditApplication);
                Client.hasMany(models.Deposit);
                Client.hasOne(models.ClientAccount);
            }
        },
        
        instanceMethods: {
            verifyPassword: function(password, cb) {
                bcrypt.compare(password, this.password, function(error, isMatch) {
                    if (error) {
                        return cb(error);
                    }

                    cb(null, isMatch);
                });
            },
            
            getCreditHistoryCoefficient: function() {
                var otherBanksCreditHistoryCoefficient = _.random(-100, 100, true) * 0.7;
                return this.creditHistoryCoefficient + otherBanksCreditHistoryCoefficient;
            }
        }
    });

    Client
        .beforeCreate(hook)
        .beforeUpdate(hook);
    
    function hook(user, options, fn) {
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
    }

    return Client;
};
