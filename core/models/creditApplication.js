'use strict';

/*
    CreditApplication model fields:
    {
        plannedSum,
        plannedTerm,
        isConfirmed
    }
*/
module.exports = function(sequelize, DataTypes) {
    var CreditApplication = sequelize.define('CreditApplication', {
        plannedSum: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            field: 'planned_sum',
            validate: {
                min: 0
            }
        },
        plannedTerm: {
            type: DataTypes.RANGE(DataTypes.INTEGER),
            allowNull: false,
            field: 'planned_term'
        },
        isConfirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            field: 'is_confirmed'
        }
    }, {
        tableName: 'credit_applications',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                CreditApplication.belongsTo(models.Client, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                CreditApplication.belongsTo(models.CreditType, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
            }
        }
    
    });

    return CreditApplication;
};
