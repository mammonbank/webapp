'use strict';

/*
    Credit model fields:
    {
        sum,
        startDate,
        endDate
    }
*/
module.exports = function(sequelize, DataTypes) {
    var Credit = sequelize.define('Credit', {
        sum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'sum',
            validate: {
                min: 0
            }
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'start_date'
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'start_date'
        }
    }, {
        tableName: 'credits',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                Credit.belongsTo(models.CreditType, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                Credit.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    
    });

    return Credit;
};
