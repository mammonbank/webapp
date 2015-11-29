'use strict';

/*
    ClientAccount model fields:
    {
        amount,
        outstandingLoan
    }
*/
module.exports = function(sequelize, DataTypes) {
    var ClientAccount = sequelize.define('ClientAccount', {
        amount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'amount',
            validate: {
                min: 0
            }
        },
        outstandingLoan: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'outstanding_loan',
            validate: {
                min: 0
            }
        }
    }, {
        tableName: 'client_account',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                ClientAccount.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        },
        
        instanceMethods: {
            
        }
    
    });

    return ClientAccount;
};
