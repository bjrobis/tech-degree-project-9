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
      type: DataTypes.STRING,
      allowNull: false,
      set(val) {
        if ( val === this.password) {
          const hashedPassword = bcrypt.hashSync(val, 10);
          this.setDataValue('password', hashedPassword);
        }
      },
      validate: {
        notNull: {msg: 'A password is required'},
        notEmpty: {msg: 'Please provide a password'},
        len: {args: [8, 20], msg: 'The password should be between 8 and 20 characters in length'}
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