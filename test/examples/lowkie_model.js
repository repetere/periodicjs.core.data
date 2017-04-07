'use strict';
const lowkie = require('lowkie');

module.exports = lowkie.Schema({
  contact: {
    first_name: String,
    last_name: String,
    dob: Date
  },
  createdat: {
    type: Date,
    default: Date.now
  },
  updatedat: {
    type: Date,
    default: Date.now
  }
});