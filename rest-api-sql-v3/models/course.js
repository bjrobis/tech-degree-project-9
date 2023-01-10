'use strict';
const {Model, DataTypes} = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
    class Course extends Model {}
    Course.init({
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {msg: 'A title is required'},
                notEmpty: {msg: 'Please provide a title'}
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notNull: {msg: 'A description is required'},
                notEmpty: {msg: 'Please provide a description'}
            }
        },
        estimatedTime: {
            type: DataTypes.STRING,
            validate: {

            }
        },
        materialsNeeded: {
            type: DataTypes.STRING,
            validate: {

            }
        }
    }, {sequelize});

    Course.associate = (models) => {
        Course.belongsTo(models.User, {
            foreignKey: {
                fieldName: 'userID',
                allowNull: false,
            },
        });
    };

    return Course;
}