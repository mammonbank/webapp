'use strict';

var async = require('async'),
    bcrypt = require('bcrypt'),
    config = require('config'),
    debug = require('debug')('mammonbank:api');

/*
    BankEmployee model fields:
    {
        username,
        password,
        type,
        numberOfApplications
    }
*/
module.exports = function(sequelize, DataTypes) {
    var BankEmployee = sequelize.define('BankEmployee', {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'username',
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'password'
        },
        type: {
            type: DataTypes.ENUM('OPERATOR', 'OVERSEER'),
            allowNull: false,
            field: 'type'
        },
        //both - credit and deposit (for operators)
        numberOfApplications: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'number_of_applications'
        }
    }, {
        tableName: 'bank_employees',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                BankEmployee.hasMany(models.CreditApplication);
                BankEmployee.hasMany(models.DepositApplication);
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
            distributeDepositApplications: function (applications) {
                var self = this,
                    DepositApplication = sequelize.models.DepositApplication;

                BankEmployee
                    .findAll({
                        offset: 0,
                        limit: 50,
                        where: { id: { $ne: self.id } }
                    })
                    .then(function (employees) {

                        for (var i = 0; i < applications.length; i++) {
                            var operatorNumber = Math.floor(Math.random() * (employees.length));
                            DepositApplication.update({
                                bankEmployeeId: employees[operatorNumber]
                            },
                            {
                                where: { id: applications[i].id }
                            });
                        }
                    });
            },

            distributeCreditApplications: function (applications) {
                var self = this,
                    CreditApplication = sequelize.models.CreditApplication;

                BankEmployee
                    .findAll({
                        offset: 0,
                        limit: 50,
                        where: { id: { $ne: self.id } }
                    })
                    .then(function (employees) {
                        for (var i = 0; i < applications.length; i++) {
                            var operatorNumber = Math.floor(Math.random() * (employees.length));
                            CreditApplication.update({
                                bankEmployeeId: employees[operatorNumber]
                            },
                            {
                                where: { id: applications[i].id }
                            });
                        }
                    });
            }
        }
    });
    
    BankEmployee
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

    return BankEmployee;
};
