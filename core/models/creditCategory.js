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
            unique: true,
            validate: {
                is: /^[0-9а-яА-ЯёЁa-z,.'-]+$/i
            }
        }
    }, {
        tableName: 'credit_categories',
        underscored: true,
        timestamps: true,
        paranoid: false,
        
        classMethods: {
            associate: function(models) {
                CreditCategory.hasMany(models.CreditType);
            }
        }

    });

    return CreditCategory;
};
