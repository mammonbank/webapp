'use strict';

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
                is: /^[a-z,.'-]+$/i
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
        phoneNumber: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: 'phone_number',
            validate: {
                // TODO: add validation
            }
        },
        authyId: {
            type: DataTypes.STRING,
            allowNull: true,
            field: 'authy_id'
        }
    }, {
        tableName: 'clients',
        underscored: true,
        timestamps: true,
        paranoid: true,
        classMethods: {
            // TODO: реализовать методы модели + отношения
        },
        instanceMethods: {
            // TODO: конкретная модель
        }
    });

    return Client;
};
