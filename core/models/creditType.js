'use strict';

/*
    CreditType model fields:
    {
        title,
        description,
        minSum,
        maxSum,
        minTerm,
        maxTerm,
        interest
    }
*/
module.exports = function(sequelize, DataTypes) {
    var CreditType = sequelize.define('CreditType', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
            unique: true,
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
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'min_sum'
        },
        maxSum: {
            type: DataTypes.DECIMAL(16, 2),
            allowNull: false,
            field: 'max_sum'
        },
        //in months
        minTerm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'min_term',
            validate: {
                min: 0
            }
        },
        maxTerm: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'max_term',
            validate: {
                min: 0
            }
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
