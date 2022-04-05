const { roles } = require('../config/roles');
const { sites } = require('./commonDefine');
const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const numberPhone = (value, helpers) => {
  if (value[0] !== '+' && value.length !== 10) {
    return helpers.message('Must be syntax of number phone')
  }
  if (value.length === 10) {
    let isOnlyNumber = /^\d+$/.test(value);
    if (!isOnlyNumber) {
      return helpers.message('Must be syntax of number phone');
    }
  }
  if (value[0] === '+') { //ex. +84855513569
    const strCheck = value.substr(1); //84855513569
    let isOnlyNumber = /^\d+$/.test(strCheck);
    if (!isOnlyNumber) {
      return helpers.message('Must be syntax of number phone');
    }
    if (strCheck.length !== 11) {
      return helpers.message('Must be syntax of number phone');
    }
  }
  return value;
}
const isRole = (value, helpers) => {
  if (!roles.includes(value)) {
    return helpers.message('Role is invalid, should be user, admin ...');
  }
  return value;
};

const isSite = (value, helpers) => {
  if (!sites.includes(value)) {
    return helpers.message('Site is invalid, should be hà nội, đà nẵng, hồ chí minh ...');
  }
  return value;
};

module.exports = {
  objectId,
  password,
  numberPhone,
  isRole,
  isSite,
};
