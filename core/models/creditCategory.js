'use strict';

/*
    CreditCategory model fields:
    {
        title
    }
*/
module.exports = function(sequelize, DataTypes) {
    var CreditCategory = sequelize.define('CreditCategory', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            field: 'title',
            validate: {
                // TODO: add cyrillic letters support
                is: /^[a-z,.'-]+$/i
            }
        }
    }, {
        tableName: 'credit_categories',
        underscored: true,
        timestamps: true,
        paranoid: true,
        
        classMethods: {
            associate: function(models) {
                CreditCategory.hasMany(models.CreditType, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        name: 'creditCategoryId',
                        allowNull: false
                    }
                });
            }
        }

    });

    return CreditCategory;
};
