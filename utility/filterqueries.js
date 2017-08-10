'use strict';
const moment = require('moment');


function get_db_fq_op(options) {
  switch (options.f_op) {
    case 'size':
      return '$size';
    case 'lte':
    case 'lte-date':
      return '$lte';
    case 'lt':
    case 'lt-date':
      return '$lt';
    case 'gt':
    case 'gt-date':
      return '$gt';
    case 'gte':
    case 'gte-date':
      return '$gte';
    case 'not':
    case 'not-date':
      return '$ne';
    case 'not-in':
      return '$nin';
    case 'in':
      return '$in';
    case 'has':
    case 'exists':
      return '$exists';
    case 'all':
    case 'contains':
      return '$all';
    default:
      return null;
  }
};

function get_db_fq_val(options) {
  switch (options.f_op) {
    case 'is-date':
    case 'not-date':
    case 'lte-date':
    case 'lt-date':
    case 'gte-date':
    case 'gt-date':
    case 'is-date':
      return moment(options.f_val).toDate(); //moment to date
    case 'exists':
      if (options.f_val === 'true' || options.f_val === true) {
        return true;
      } else {
        return false;
      }
      break;
    case 'in':
    case 'not-in':
    case 'nin':
    case 'all':
    case 'contains':
      return options.f_val.split(','); //moment to date
    default:
      if (options.f_val === 'null' || options.f_val === null) {
        return null;
      } else {
        return options.f_val;
      }
  }
}

function getFilterQueries(filterqueries,type) {
  const filterQuery = [];
  if (Array.isArray(filterqueries) === false) {
    filterqueries = new Array(filterqueries);
  }
  filterqueries.forEach(function(f_query) {
    let orbuilder = f_query.split('|||');
    let orbuilderquery = {};
    orbuilderquery[orbuilder[0]] = {};
    if (orbuilder[1] === 'is') {
      orbuilderquery[orbuilder[0]] = orbuilder[2];
    } else if (orbuilder[1] === 'is-date') {
      orbuilderquery[orbuilder[0]] = moment(orbuilder[2]).toDate();
    } else if (orbuilder[1] === 'like') {
      orbuilderquery[ orbuilder[ 0 ] ] = (type === 'loki') ? { $regex:stripTags(orbuilder[2]), } : new RegExp(stripTags(orbuilder[2]), 'gi');
    } else if (orbuilder[1] === 'not-like') {
      orbuilderquery[ orbuilder[ 0 ] ] = (type === 'loki') ? {
        '$not': {
          $regex: stripTags(orbuilder[ 2 ]),
        },
      } : {
        '$not': new RegExp(stripTags(orbuilder[ 2 ]), 'gi'),
      };
    } else {
      orbuilderquery[orbuilder[0]][get_db_fq_op({ f_op: orbuilder[1] })] = get_db_fq_val({ f_op: orbuilder[1], f_val: orbuilder[2] });
    }
    console.log('orbuilderquery', orbuilderquery);
    filterQuery.push(orbuilderquery);
  });
  console.log({ filterQuery });
  return filterQuery;
}

function stripTags(textinput) {
  if (textinput) {
    return textinput.replace(/[^a-z0-9@._]/gi, '-');
  } else {
    return false;
  }
}

module.exports = {
  get_db_fq_op,
  get_db_fq_val,
  getFilterQueries,
  stripTags,
};