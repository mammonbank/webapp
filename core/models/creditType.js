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
                is: /^[0-9а-яА-ЯёЁa-z,.'-]+$/i
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            field: 'description'
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
            type: DataTypes.DECIMAL(3, 3),
            allowNull: false,
            field: 'interest',
            validate: {
                min: 0,
                max: 1
            }
        }
    }, {
        tableName: 'credit_types',
        underscored: true,
        timestamps: true,
        paranoid: false,
        
        classMethods: {
            associate: function(models) {
                CreditType.belongsTo(models.CreditCategory, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                CreditType.hasMany(models.Credit);
                CreditType.hasMany(models.CreditApplication);
            }
        }
    
    });

    return CreditType;
};
