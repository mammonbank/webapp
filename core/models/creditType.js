'use strict';

/*
    CreditType model fields:
    {
        title,
        currency,
        minSum,
        maxSum,
        term,
        interest
    }
*/
module.exports = function(sequelize, DataTypes) {
    var CreditType = sequelize.define('CreditType', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
            validate: {
                // TODO: add cyrillic letters support
                is: /^[a-z,.'-]+$/i
            }
        },
        currency: {
            type: DataTypes.ENUM,
            values: ['BYR', 'USD', 'EUR', 'RUB'],
            defaultValue: 'BYR',
            allowNull: false,
            field: 'currency'
        },
        minSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'min_sum'
        },
        maxSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'max_sum'
        },
        //in months
        term: {
            type: DataTypes.RANGE(DataTypes.INTEGER),
            allowNull: false,
            field: 'term'
        },
        interest: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'interest',
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'credit_types',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                CreditType.belongsTo(models.CreditCategory, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: 'creditCategoryId',
                        allowNull: false
                    }
                });
                CreditType.hasMany(models.Credit, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                CreditType.hasMany(models.CreditApplication, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    
    });

    return CreditType;
};
