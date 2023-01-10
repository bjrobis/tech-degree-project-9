'use strict';
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: 'A first name is required'},
        notEmpty: {msg: 'Please provide a first name'}
      }
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {msg: 'A last name is required'},
          notEmpty: {msg: 'Please provide a last name'}
        }
      },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {msg: 'An email is required'},
        isEmail: {msg: 'Please provide a valid email address'}
      }    
    },
    password: {
      //virtual only gets populated in sequlize but don't actually exist or get insterted as a column in the database
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        notNull: {msg: 'A password is required'},
        notEmpty: {msg: 'Please provide a password'},
        len: {args: [8, 20], msg: 'The password should be between 8 and 20 characters in length'}
      }
    },
    confirmedPassword: { // new attribute
      type: DataTypes.STRING,
      allowNull: false,
      //val represents the value being set for the confirmedPassword
      set(val) {
        if ( val === this.password) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('confrimedPassword', hashedPassword);
        }
      },
      validate: {
        notNull: {msg: 'Both passwords must match'}
      }
    }
  }, { sequelize });



User.associate = (models) => {
  User.hasMany(models.Course, {
    foreignKey: {
      fieldName: 'userID',
      allowNull: false,
    },
  });
}

return User;
};