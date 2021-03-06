'use strict';
const path = require('path');
const BigQuery = require('@google-cloud/bigquery');
const Promisie = require('promisie');
const builder = require('mongo-sql');
const mongoose = require('mongoose');
const flatten = require('flat');
const unflatten = flatten.unflatten;
const utility = require(path.join(__dirname, '../utility/index'));
const xss_default_whitelist = require(path.join(__dirname, '../defaults/index')).xss_whitelist();
const IS_SYNCED = Symbol.for('changeset_is_synced');


/**
 * Takes a set of fields either as a comma delimited list or a mongoose style fields object and converts them into a sequelize compatible array
 * @param {Object|string} fields Fields that should be returned when running the query
 */
const GENERATE_SELECT = function(fields) {
  if (typeof fields === 'string') return fields.split(',');
  if (Array.isArray(fields)) return fields;
  return Object.keys(fields).reduce((result, key) => {
    if (fields[key]) {
      if (typeof fields[key] !== 'string') result.push(key);
      else result.push([key, fields[key],]);
    }
    return result;
  }, []);
};

/**
 * Convenience method for .findAll sequelize method
 * @param  {Object}   options Options for the SQL query
 * @param {Object} [options.query={}] The query that should be used for the database search
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {Object|string} [options.population=this.population] An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration)
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for query
 */
const _QUERY = function(options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, limit, population, fields, skip, } = ['sort', 'limit', 'population', 'fields', 'skip',].reduce((result, key) => {
      if (options[key] && !isNaN(Number(options[key]))) options[key] = Number(options[key]);
      result[key] = (typeof options[key]!=='undefined') ? options[key] : this[key];
      return result;
    }, {});
    let queryOptions = {
      where: (options.query && typeof options.query === 'object') ? options.query : {},
    };
    queryOptions.attributes = Object.assign({}, queryOptions.attributes, options.attributes);
    if (Object.keys(queryOptions.where).length === 0) delete queryOptions.where;
    if (fields) queryOptions.attributes = Object.assign({}, queryOptions.attributes, GENERATE_SELECT(fields));
    if (sort) queryOptions.order = (!Array.isArray(sort) && typeof sort !== 'string') ?
      convertSortObjToOrderArray(sort) :
      sort;
    if (skip) queryOptions.offset = skip;
    if (limit) queryOptions.limit = limit;
    if (population) {
      // console.log('this.db_connection.models', this.db_connection.models);
      // if (population && population.include) queryOptions.include = population.include;
      // else queryOptions.include = population;
      queryOptions.joins = population;
    }
    // queryOptions.raw = true;
    // const util = require('util');
    // console.log(util.inspect( queryOptions,{depth:20 }));
    const q = builder.sql(Object.assign({
      type: 'select',
      table: `${this.db_connection.projectId}###${Model.parent.id}###${Model.id}`,
    }, queryOptions));
    // console.log({q})
    const qstring = q.values.reduce((result, value, index) => {
      // console.log({result,value,index})
      return result.replace(new RegExp(`\\$${index + 1}`), (typeof value === 'string') ? `'${value}'` : value);
    }, q.toString())
      .replace(new RegExp(`"${this.db_connection.projectId}###${Model.parent.id}###${Model.id}"\\.`, 'g'), '')
      .replace(/#{3}/g, '.')
      .replace(/"/g, '`');
    // console.log({qstring})
    Model.query({ query: qstring, useLegacySql: false, })
      .then(results => {
        // console.log({ results },'this.jsonify_results',this.jsonify_results);

        // console.log(util.inspect( results,{depth:20 }));
        return cb(null, (this.jsonify_results) ? getJSONResults.call(this, results) : results);
      })
      .catch(cb);
  } catch (e) {
    cb(e);
  }
};

/**
 * converts mongo-like sort property to sequelize order value
 * 
 * @param {any} sortVal 
 * @returns {String} [ASC|DESC]
 */
function getOrderFromSortObj(sortVal) {
  if (sortVal >= 0) return 'ASC';
  else if (sortVal < 0) return 'DESC';
  else return 'ASC';
}
/**
 * this converts a mongo like sort object to a sequelize order argument. { date:1, title:1} => [ ['date','ASC'], ['title','ASC'] ]
 * 
 * @param {Object} sort mongo like sort argument 
 * @returns {Array} order argument
 */
function convertSortObjToOrderArray(sort) {
  return Object.keys(sort)
    .reduce((sortObject, key) => {
      sortObject[ key ] = getOrderFromSortObj(sort[ key ]);
      return sortObject;
    }, {});
}
/**
 * returns plain json object instead of sequelize row instance
 * 
 * @param {Object} result 
 * @returns {Object}
 */
function getPlainResult(result) {
  return (result && typeof result.get === 'function')
    ? result.get({ plain: true, })
    : getJSONResults.call(this, result);
}

/**
 * returns rows of sequelize instances to plain objects
 * 
 * @param {any} results 
 * @returns 
 */
function getJSONResults(results) {
  const documents = (Array.isArray(results) && results.length === 1 && Array.isArray(results[ 0 ]))
    ? results[ 0 ]
    : results;
  let objectFields = [];
  const useAltId = (this && this.docid && Array.isArray(this.docid) && this.docid.length > 1) ? this.docid.filter(id=>id!=='_id')[0] : false;
  // console.log({documents,useAltId})
  // if(this)console.log('this.model.schema', this.model.schema);
  return documents.map((doc, i) => {
    if (i === 0) {
      objectFields = Object.keys(doc).filter(prop => {
        const val = doc[ prop ];
        return val && typeof val === 'object' && val.value;
      });
    }
    if (useAltId && !doc._id) doc._id = doc[ useAltId ];
    if (objectFields.length) {
      const valueProps = objectFields.reduce((valObj, prop) => {
        // console.log('doc[ prop ]',doc[ prop ], 'doc[ prop ] instanceof BigQuery.date',doc[ prop ] instanceof BigQuery.date, 'doc[ prop ] instanceof BigQuery.datetime',doc[ prop ] instanceof BigQuery.datetime, 'doc[ prop ] instanceof BigQuery.time',doc[ prop ] instanceof BigQuery.time, 'doc[ prop ] instanceof BigQuery.timestamp',)
        // valObj[ prop ] = (doc[ prop ] instanceof BigQuery.timestamp)
        //   ? new Date(doc[ prop ].value)
        //   : doc[ prop ].value;
        // console.log({ doc, prop },'doc[ prop ]',doc[ prop ]);
        valObj[ prop ] = (doc[ prop ] !== null && doc[ prop ] && typeof doc[ prop ].value !== 'undefined')
          ? doc[ prop ].value
          : doc[ prop ];
        return valObj;
      }, {});
      return Object.assign(doc, valueProps);
    } else return doc;
  });
}
/**
 * Convenience method for returning a stream of sql data. Since sequelize does not expose a cursor or stream method this is an implementation of a cursor on top of a normal SQL query
 * @param  {Object}   options Options for the SQL query
 * @param {Object} [options.query={}] The query that should be used for the database search
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {Object|string} [options.population=this.population] An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration)
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for stream
 */
const _STREAM = function(options, cb) {
  try {
    _QUERY.call(this, options, (err, documents) => {
      if (err) cb(err);
      else {
        //Cursor class which extends the Node TransformStream class
        let querystream = new utility.Cursor();
        for (let i = 0; i < documents.length; i++) {
          //Becuase of inconsistencies in generator behavior when mixing sync and async operations writes are done as a setImmediate task
          let task = setImmediate(() => {
            if (i === documents.length - 1) querystream.end(
              (this.jsonify_results) ?
                getPlainResult(documents[i]) :
                documents[i]
            );
            else querystream.write(
              (this.jsonify_results) ?
                getPlainResult(documents[i]) :
                documents[i]
            );
            clearImmediate(task);
          });
        }
        cb(null, querystream);
      }
    });
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .findAll SQL method with built in pagination of data
 * @param  {Object}   options Options for the SQL query
 * @param {Object} [options.query={}] The query that should be used for the database search
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {number} [options.pagelength=this.pagelength] Defines the max length of each sub-set of data
 * @param {Object|string} [options.population=this.population] An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration)
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for query
 */
const _QUERY_WITH_PAGINATION = function(options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, limit, population, fields, skip, pagelength, query, } = ['sort', 'limit', 'population', 'fields', 'skip', 'pagelength', 'query',].reduce((result, key) => {
      if (options[key] && !isNaN(Number(options[key]))) options[key] = Number(options[key]);
      result[key] = options[key] || this[key];
      return result;
    }, {});
    let pages = {
      total: 0,
      total_pages: 0,
    };
    let total = 0;
    let index = 0;
    skip = (typeof skip === 'number') ? skip : 0;
    Promisie.parallel({
      count: () => {
        return true;
      },
      pagination: () => {
        return Promisie.doWhilst(() => {
          return new Promisie((resolve, reject) => {
            _QUERY.call(this, { query, sort, limit: (total + pagelength <= limit) ? pagelength : (limit - total), fields, skip, population, model: Model, }, (err, data) => {
              if (err) reject(err);
              else {
                skip += data.length;
                total += data.length;
                pages.total += data.length;
                pages.total_pages++;
                pages[index++] = {
                  documents: (this.jsonify_results) ?
                    getJSONResults.call(this, data) : data,
                  count: data.length,
                };
                resolve(data.length);
              }
            });
          });
        }, current => (current === pagelength && total < limit))
          .then(() => pages)
          .catch(e => Promisie.reject(e));
      },
    })
      .then(result => {
        // console.log('PAGINATION result',result)
        result.count = result.pagination.total;
        cb(null, Object.assign({}, result.pagination, {
          collection_count: result.count,
          collection_pages: Math.ceil(result.count / ((pagelength <= limit) ? pagelength : limit)),
        }));
      })
      .catch(cb);
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .findAll SQL method with built in query builder functionality
 * @param  {Object}   options Options for the SQL query
 * @param {Object|string} [options.query] The query that should be used for the database search. If this value is a string it will be treated as a delimited list of values to use in query
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {number} [options.pagelength=this.pagelength] Defines the max length of each sub-set of data
 * @param {Object|string} [options.population=this.population] An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration)
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param {string[]} [options.search=this.searchfields] Used in building the query. A separate $or statement is appended into query array for each search field specified ie. ['a','b'] => { $or: [{a: ..., b ...}] }
 * @param {string} [options.delimeter="|||"] The value that the query values are delimeted by. If options.query is an object this value is ignored
 * @param {string} [options.docid=this.docid] When using options.values this specifies the name of the field that should be matched
 * @param {string} [options.values] A comma separated list of values to be queried against docid or "_id" if docid is not specified
 * @param {Boolean} options.paginate If true documents will be returned in a paginated format
 * @param  {Function} cb      Callback function for query
 */
const _SEARCH = function(options, cb) {
  try {
    let query;
    let searchfields;
    let docid = options.docid || this.docid;
    if (Array.isArray(options.search)) searchfields = options.search;
    else if (typeof options.search === 'string') searchfields = options.search.split(',');
    else searchfields = this.searchfields;
    let toplevel = (options.inclusive) ? '$or' : '$and';
    query = {
      [toplevel]: [],
    };
    //Pushes options.query if it already a composed query object
    if (options.query && typeof options.query === 'object') query[toplevel].push(options.query);
    //Handles options.query if string or number
    else if (typeof options.query === 'string' || typeof options.query === 'number') {
      let values = [];
      if (typeof options.query === 'number') values.push(options.query);
      //Tries to split on delimeter and generate query from options.query string
      else values = options.query.split((typeof options.delimeter === 'string' || options.delimeter instanceof RegExp) ? options.delimeter : '|||');
      let statement = values.reduce((result, value) => {
        let block = { $or: [], };
        for (let i = 0; i < searchfields.length; i++) {
          block.$or.push({
            [searchfields[i]]: { $like: `%${value}`, },
          });
        }
        return result.concat(block);
      }, []);
      query[toplevel].push({ $or: statement, });
    }
    //Handles docnamelookup portion of query
    if (typeof options.values === 'string') {
      let split = options.values.split(',');
      let isObjectIds = (split.filter(utility.isObjectId).length === split.length);
      if (isObjectIds) query[toplevel].push({ 'id': { $in: split, }, });
      // else query[toplevel].push({
      //   [(options.docid || this.docid) ? (options.docid || this.docid) : 'id']: { $in: split, },
      // });
      else if (Array.isArray(docid)) {
        docid.forEach(d => {
          if (d === '_id') {
            if (validIdIsNumber(options.query)) {
              query[toplevel].push({
                [d]: { $in: split, },
              });
            }
          } else {
            query[toplevel].push({
              [d]: { $in: split, },
            });
          }
        });
      } else {
        query[toplevel].push({
          [(docid) ? (docid) : '_id']: { $in: split, },
        });
      }
    }
    options.query = query;
    if (options.paginate) _QUERY_WITH_PAGINATION.call(this, options, cb);
    else _QUERY.call(this, options, cb);
  } catch (e) {
    cb(e);
  }
};

function validIdIsNumber(ID) {
  return (typeof parseInt(ID, 10) ===
    'number' && parseInt(ID, 10) == ID);
}

// options.updatedoc.description = "";
// options.updatedoc.body_html = "";
function valueReplacer(value) {

  const valueType = typeof value;
  switch (valueType) {
  case 'string':
    if(this.strict) value=value.replace(/\'/gi, '\\\'').replace(/\r?\n|\r/g, ' ');
    return `'${value}'`;
  case 'number':
    return value;
  case 'boolean':
    return value;
  default:
    if (value instanceof Date) return value;
    else if (!value) return value;
    else if (Array.isArray(value)) return `'${JSON.stringify( value.map(v => valueReplacer.call(this, v)))}'`;
    var flattenedJSON = flatten(value);
    var cleanedFlatten = Object.keys(flattenedJSON).reduce((result, flattenedProp) => {
      var testVal = flattenedJSON[ flattenedProp ];
      result[ flattenedProp ] = typeof testVal === 'string' ? testVal.replace(/\'/gi, '&apos;'): testVal;
      return result;
    }, {});
    var unflattedCleaned = unflatten(cleanedFlatten);
    // console.log('unflattedCleaned', unflattedCleaned)
    return `'${JSON.stringify(unflattedCleaned)}'`;
      // const unflatten 
      // let jsonstringify = (this.strict)
      //   ? `'${JSON.stringify(value).replace('\'','&apos;')}'`
      //   : `'${JSON.stringify(value)}'`;
      // return jsonstringify;
  }
}

function stringifyArray(updatedoc) {
  return Object.keys(updatedoc).reduce((result, prop) => { 
    const value = updatedoc[ prop ];
    result[ prop ] = Array.isArray(value) ? JSON.stringify(value) : value;
    return result;
  }, {});
}
/**
 * Convenience method for .findOne sequelize methods
 * @param  {Object}   options Configurable options for mongo query
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {Object|string} [options.population=this.population] An object containing an include property which is an array of table associations for a given sequelize model or just the array of associations (see sequelize documentation for proper configuration)
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {string} [options.docid="id"] A field that should be queried will default to "id"
 * @param {Object|string|number} options.query If value is an object query will be set to the value otherwise a query will be built based on options.docid and any other value provided in options.query
 * @param  {Function} cb      Callback function for load
 */
const _LOAD = function(options, cb) {
  try {
    let query;
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, population, fields, docid, } = ['sort', 'population', 'fields', 'docid',].reduce((result, key) => {
      if (options[key] && !isNaN(Number(options[key]))) options[key] = Number(options[key]);
      result[key] = options[key] || this[key];
      return result;
    }, {});
    // let query = (options.query && typeof options.query === 'object') ? options.query : {
    //   $or: [{
    //     [docid || 'id']: options.query,
    //   }, ],
    // };
    if (options.query && typeof options.query === 'object') {
      query = options.query;
    } else if ((Array.isArray(docid))) {
      query = { '$or': [], };
      docid.forEach(d => {
        if (d === '_id') {
          if (validIdIsNumber(options.query)) {
            query.$or.push({
              [d]: options.query,
            });
          }
        } else {
          query.$or.push({
            [d]: options.query.toString(),
          });
        }
      });
    } else {
      query = {
        [docid || '_id']: options.query,
      };
    }
    // console.log('query', query);
    // if(query.$or) throw new Error('find callee')

    let queryOptions = {
      where: query,
      limit:1,
    };
    if (fields) queryOptions.attributes = GENERATE_SELECT(fields);
    // if (sort) queryOptions.order = sort;
    if (sort) queryOptions.order = (!Array.isArray(sort) && typeof sort !== 'string') ?
      convertSortObjToOrderArray(sort) :
      sort;
      
    if (population && Array.isArray(population)) {
      // queryOptions.include = population.map(pop => ({
      //   model: this.db_connection.models[ pop.model ],
      //   as: pop.as,
      //   through: pop.through,
      //   foreignKey: pop.foreignKey,
      // }));
      queryOptions.include = [{ all: true, }, ];
      // if (population && population.include) queryOptions.include = population.include;
      // else queryOptions.include = population.map(pop => ({
      //   model: this.db_connection.models[ pop.model ],
      //   as: pop.as,
      //   through: pop.through,
      //   foreignKey: pop.foreignKey,
      // }));
      // console.log('this.db_connection.models', this.db_connection.models,'queryOptions.include',queryOptions.include,{queryOptions, population});
    }
    // const util = require('util');
    // console.log('queryOptions',util.inspect(queryOptions, { depth:20,  }));
    // console.log('Model',util.inspect(Model, { depth:20,  }));
    // const util = require('util');
    // console.log(util.inspect( queryOptions,{depth:20 }));
    const q = builder.sql(Object.assign({
      type: 'select',
      table: `${this.db_connection.projectId}###${Model.parent.id}###${Model.id}`,
    }, queryOptions));
    // console.log({q})
    const qstring = q.values.reduce((result, value, index) => {
      // console.log({result,value,index})
      return result.replace(new RegExp(`\\$${index + 1}`), (typeof value === 'string') ? `'${value}'` : value);
    }, q.toString())
      .replace(new RegExp(`"${this.db_connection.projectId}###${Model.parent.id}###${Model.id}"\\.`, 'g'), '')
      .replace(/#{3}/g, '.')
      .replace(/"/g, '`');
    // console.log({qstring})
    // Model.query(queryOptions)
    Model.query({ query: qstring, useLegacySql: false, })
      .then(results => {
        const result = Array.isArray(results) ? results[ 0 ] : results;
        return cb(null, (this.jsonify_results)
          ? getPlainResult(result)[0]
          : result[0]);
      })
      .catch(cb);
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .update SQL method
 * @param  {Object}   options Configurable options for SQL update
 * @param {Boolean} options.isPatch If true the update will be treated as a patch instead of a full document update
 * @param {Object} options.updatedoc Either specific fields to update in the case of a patch otherwise the entire updatedated document
 * @param {string} options.id The SQL id of the document that should be updated
 * @param {Boolean} [options.skip_xss] If true xss character escaping will be skipped and xss whitelist is ignored
 * @param {Boolean} [options.html_xss] If true xss npm module will be used for character escaping
 * @param {Boolean} [options.track_changes] If false changes will not be tracked
 * @param {Boolean} [options.ensure_changes] If true changeset generation and saving is blocking and errors will cause entire operation to fail
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param  {Function} cb      Callback function for update
 */
const _UPDATE = function(options, cb) {
  try {
    // console.log('options', options);
    const safeValues = valueReplacer.bind(options);
    options.track_changes = (typeof options.track_changes === 'boolean') ? options.track_changes : this.track_changes;
    if (options.stringifyArray) options.updatedoc = stringifyArray(options.updatedoc);
    if (!options.id) {
      options.id = options.updatedoc._id || options.updatedoc.id;
    }
    let changesetData = {
      update: Object.assign({}, options.updatedoc),
      original: Object.assign({}, options.originalrevision),
    };
    let generateChanges = (callback) => {
      if (!options.track_changes || (options.track_changes && !options.ensure_changes)) callback();
      if (options.track_changes && this.changeset) {
        let changeset = (!options.isPatch) ? utility.diff(changesetData.original, changesetData.update, true) : options.updatedoc;
        (() => {
          if (this.changeset[IS_SYNCED]) return Promisie.resolve(true);
          return this.sync();
        })()
          .then(() => {
            return Promisie.map(Object.keys(changeset), (key) => {
              return this.changeset.create({
                parent_document_id: options.id,
                field_name: key,
                original: (changeset[key].length > 1) ? changeset[key][0] : 'new value',
                update: (changeset[key].length < 2) ? changeset[0] : ((changeset[key].length === 2) ? changeset[key][1] : 'deleted value'),
              });
            });
          })
          .then(result => {
            if (options.ensure_changes) callback(null, (this.jsonify_results) ?
              getPlainResult(result) :
              result);
          }, e => {
            if (options.ensure_changes) callback(e);
          });
      }
    };
    let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
    // console.log({ xss_whitelist });
    options.updatedoc.updatedat = new Date();
    options.updatedoc = utility.enforceXSSRules(options.updatedoc, xss_whitelist, options);
    if (options.strict) {
      options.updatedoc = this.modelFields.reduce((result, prop) => { 
        result[ prop ] = options.updatedoc[ prop ];
        return result;
      }, {});
    }
    let Model = options.model || this.model;
    let docid = (Array.isArray(options.docid) || typeof options.docid === 'string')
      ? options.docid
      : this.docid;
    let where = {
      $or: [],
    };
    if ((Array.isArray(docid))) {
      docid.forEach(d => {
        if (d === '_id' && validIdIsNumber(options.id)) {
          where.$or.push({ [ d ]: options.id, });
        } else if(typeof options.id !=='number') {
          where.$or.push({
            [ d ]: options.id.toString(),
          });
        }
      });
    } else {
      where.$or.push({ [ docid ]: options.id, });
    }
    // console.log({ docid }, 'this.docid', this.docid, 'where', JSON.stringify(where, null, 2));
    Promise.resolve(options.originalrevision)
      .then(originalDoc => {
        if (originalDoc) {
          return changesetData.original;
        } else if (options.track_changes) {
          return this.load({ query: options.id, });
        } else {
          return {};
        }
      })
      .then(originalDoc => {
        changesetData.original = (typeof originalDoc.toObject === 'function')
          ? originalDoc.toObject()
          : originalDoc;
        const q = builder.sql(Object.assign({
          type: 'update',
          table: `${this.db_connection.projectId}###${Model.parent.id}###${Model.id}`,
          updates: options.updatedoc,
        }, options.query || where));
        // console.log('q', q);
        const qstring = q.values.reduce((result, value, index) => {
          const safeValue = safeValues(value);
          // console.log({value,safeValue})
          return result.replace(new RegExp(`\\$${index + 1}`), safeValue);
        }, q.toString())
          .replace(new RegExp(`"${this.db_connection.projectId}###${Model.parent.id}###${Model.id}"\\.`, 'g'), '')
          .replace(/#{3}/g, '.')
          .replace(/"/g, '`');
          // console.log('qstring');
          // console.log(qstring);
        this.model.get()
          .then(([table, apiResponse,]) => {
            // console.log({ table, apiResponse });
            if (apiResponse && apiResponse.streamingBuffer && parseInt(apiResponse.streamingBuffer.estimatedRows) > 0) throw new Error('Cannot update rows on ' + apiResponse.id + ' while table is still streaming data: ' + apiResponse.selfLink + '. last update:' + new Date(parseInt(apiResponse.streamingBuffer.oldestEntryTime)));
            return Promisie.parallel({
              update: () => Model.query({ query: qstring, useLegacySql: false, }),
              changes: () => Promisie.promisify(generateChanges)(),
            });
          })
          .then(result => {
            if (options.ensure_changes) cb(null, result);
            else cb(null, result.update);
          }, (err, bq) => {
            console.error(err);
            cb(err, bq);
          });
        
      })
      .catch((e) => { 
        console.error( e);
        cb(e);
      });
  } catch (e) {
    console.error(e);
    cb(e);
  }
};

/**
 * Convenience method for .update + .findOne sequelize method (returns updated document instead of normal number updated status)
 * @param  {Object}   options Configurable options for SQL update
 * @param {Boolean} options.isPatch If true the update will be treated as a patch instead of a full document update
 * @param {Object} options.updatedoc Either specific fields to update in the case of a patch otherwise the entire updated document
 * @param {string} options.id The SQL id of the document that should be updated
 * @param {Boolean} [options.skip_xss] If true xss character escaping will be skipped and xss whitelist is ignored
 * @param {Boolean} [options.html_xss] If true xss npm module will be used for character escaping
 * @param {Boolean} [options.track_changes] If false changes will not be tracked
 * @param {Boolean} [options.ensure_changes] If true changeset generation and saving is blocking and errors will cause entire operation to fail
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param  {Function} cb      Callback function for update
 */
const _UPDATED = function(options, cb) {
  try {
    if (!options.id) throw new Error('Can\'t retrieve document after update if options.id is not defined');
    _UPDATE.call(this, options, (err) => {
      if (err) cb(err);
      else _LOAD.call(this, { model: options.model, query: options.id, }, cb);
    });
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .update for multiple document updates
 * @param  {Object}   options Configurable options for SQL update with no limit
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {Object} options.query Query that should be used in update
 * @param {Object} [options.updatequery] Alias for options.query if options.query is set this option is ignored
 * @param {Object} options.updateattributes A SQL update formatted object
 * @param {Object} [options.updatedoc] Object specifying fields to update with new values this object will be formatted as a patch update. If options.updateattributes is set this option is ignored
 * @param  {Function} cb      Callback function for update all
 */
const _UPDATE_ALL = function(options, cb) {
  try {
    let Model = options.model || this.model;
    let query = options.query || options.updatequery;
    let update = options.updateattributes || options.updatedoc;
    if (!update || (update && typeof update !== 'object')) throw new Error('Either updateattributes or updatedoc option must be set in order to execute multi update');
    Model.update(query, update)
      .then(result => cb(null, result))
      .catch(cb);
  } catch (e) {
    cb(e);
  }
};

function stringifyObjectFields(obj) {
  const stringified= Object.keys(obj).reduce((stringified, prop) => { 
    const val = obj[ prop ];
    stringified[ prop ] = (val && typeof val === 'object')
      ? JSON.stringify(val, null, 2)
      : val;
    return stringified;
  }, {});
  if (!stringified._id) stringified._id = mongoose.Types.ObjectId().toString();
  if (!stringified.entitytype && this && this.model) stringified.entitytype = this.model.id;
  if (!stringified.createdat) stringified.createdat = new Date();
  if (!stringified.updatedat) stringified.updatedat = new Date();
  return stringified;
}

/**
 * Convenience method for .create sequelize method
 * @param  {Object}   options Configurable options for SQL create
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {Object|Object[]} [options.newdoc=options] The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document. A bulk create will be done if newdoc is an array and bulk_create option is true
 * @param {Boolean} options.bulk_create If true and options.newdoc is an array each index will be treated as an individual document and be bulk inserted (WARNING: Due to limitations in MySQL and other SQL variants bulk creates can't assign auto-incremented ids please use accordingly)
 * @param {Boolean} [options.skip_xss] If true xss character escaping will be skipped and xss whitelist is ignored
 * @param {Boolean} [options.html_xss] If true xss npm module will be used for character escaping
 * @param {Object}  [options.xss_whitelist=this.xss_whitelist] XSS white-list configuration for xss npm module
 * @param  {Function} cb      Callback function for create
 */
const _CREATE = function(options, cb) {
  try {
    let Model = options.model || this.model;
    let newdoc = options.newdoc || options;
    let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
    const formatObjectFields = stringifyObjectFields.bind(this);
    const insertOptions = {
      ignoreUnknownValues:true,
    };
    if (Array.isArray(newdoc) && newdoc.length && options.bulk_create) {
      newdoc = newdoc
        .map(doc => utility.enforceXSSRules(doc, xss_whitelist, options))
        .map(formatObjectFields);
      Model.insert(newdoc, insertOptions)
        .then(result => cb(null, result))
        .catch(cb);
    } else {
      const rows = [utility.enforceXSSRules(newdoc, xss_whitelist, (options.newdoc) ? options : undefined),].map(formatObjectFields);
      Model.insert(rows[0], insertOptions)
        .then(result => cb(null, result))
        .catch(cb);
    }
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .destroy sequelize method
 * @param  {Object}   options Configurable options for SQL delete
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} options.deleteid The SQL id of the document that should be removed
 * @param {string} options.id If options.deleteid is provided this value is ignored - alias for options.deleteid
 * @param {Boolean} options.force If true document will always be fully deleted (if paranoid option is set on model this option will override)
 * @param  {Function} cb      Callback function for delete
 */
const _DELETE = function(options, cb) {
  try {
    let Model = options.model || this.model;
    let deleteWhere = [];
    if (options.query) {
      deleteWhere = options.query;
    } else {
      let deleteid = options.deleteid || options.id;
      if (typeof deleteid !== 'string' && typeof deleteid !== 'number') throw new Error('Must specify "deleteid" or "id" for delete');
      const docid = options.docid || this.docid || '_id';
      if (Array.isArray(docid)) {
        deleteWhere.push(...docid
          .map(docidname => ({
            [ docidname ]: deleteid,
          }))
        );
      } else if (docid.indexOf(',')!==-1) {
        deleteWhere.push(...docid
          .split(',')
          .map(docidname => ({
            [ docidname ]: deleteid,
          }))
        );
      } else {
        deleteWhere.push({
          [ docid ]: deleteid,
        });
      }
    }
    const q = builder.sql(Object.assign({
      type: 'delete',
      table: `${this.db_connection.projectId}###${Model.parent.id}###${Model.id}`,
    }, {
      where: deleteWhere,
    }));
    let qstring = q.values.reduce((result, value, index) => {
      return result.replace(new RegExp(`\\$${index + 1}`), (typeof value === 'string') ? `'${value}'` : value);
    }, q.toString())
      .replace(new RegExp(`"${this.db_connection.projectId}###${Model.parent.id}###${Model.id}"\\.`, 'g'), '')
      .replace(/#{3}/g, '.')
      .replace(/"/g, '`');
    qstring = `#standardSQL
    ${qstring};`;
    // console.log('qstring', qstring)
    this.model.get()
      .then(([table, apiResponse,]) => {
        // console.log({ table, apiResponse });
        if (apiResponse && apiResponse.streamingBuffer && parseInt(apiResponse.streamingBuffer.estimatedRows) > 0) throw new Error('Cannot delete rows on ' + apiResponse.id + ' while table is still streaming data: ' + apiResponse.selfLink + '. last update:' + new Date(parseInt(apiResponse.streamingBuffer.oldestEntryTime)));
        return Model.query({ query: qstring, useLegacySql: false, });
      })
      .then(result => cb(null, result))
      .catch(cb);
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .destroy sequelize method but returns the deleted document
 * @param  {Object}   options Configurable options for SQL delete
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} options.deleteid The SQL id of the document that should be removed
 * @param {string} options.id If options.deleteid is provided this value is ignored - alias for options.deleteid
 * @param  {Function} cb      Callback function for delete
 */
const _DELETED = function(options, cb) {
  try {
    _LOAD.call(this, { model: options.model, query: options.query || options.deleteid || options.id, }, (err1, loaded) => {
      if (err1) cb(err1);
      else {
        _DELETE.call(this, options, (err2) => {
          if (err2) cb(err2);
          else cb(null, loaded);
        });
      }
    });
  } catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .query sequelize method that allows for raw SQL queries
 * @param  {Object}   options Configurable options for raw SQL query
 * @param {Object} [options.model=this.model] The sequelize model for query will default to the this.model value if not defined
 * @param {string} options.query Raw query for SQL
 * @param {string} options.raw_query Alias for options.query. If options.query is set this option is ignored
 * @param {string} options.raw Alias for options.query. If options.query or options.raw_query is set this option is ignored
 * @param {Boolean|Object} options.format_result If false result will not be formatted. If a sequelize query type object those rules will be used in formatting. If not false and not a format object the query type will be inferred from the raw query and formatting rules will be applied
 * @param  {Function} cb      Callback function for raw query
 */
const _RAW = function(options, cb) {
  try {
    let query = options.query || options.raw_query || options.raw;
    if (typeof query !== 'string') throw new Error('Raw queries must be strings');
    Promisie.promisify(this.db_connection.rawQuery, this.db_connection)(query)
      .then(result => cb(null, result))
      .catch(cb);
  } catch (e) {
    cb(e);
  }
};

/**
 * A sequelize SQL specific adapter which provides CRUD methods for a given model
 * @type {BigQuery_Adapter}
 */
const BIGQUERY_ADAPTER = class BigQuery_Adapter {
  /**
   * Constructor for BigQuery_Adapter
   * @param  {Object} options Configurable options for the SQL adapter
   * @param {Object|string[]} options.db_connection Either a instantiated instance of Sequelize or the connection details for a instance as an array of ordered arguments or options object
   * @param {string}  [options.db_connetion.db_name] Name of the database (only used if instantiating a new Sequelize instance) 
   * @param {string}  [options.db_connetion.db_user] Username for the database (only used if instantiating a new Sequelize instance)
   * @param {string}  [options.db_connetion.db_password] Password for the database (only used if instantiating a new Sequelize instance)
   * @param {string}  [options.db_connetion.db_options] Options for connection to the database ie. port, hostname (only used if instantiating a new Sequelize instance) 
   * @param {string} [options.docid="id"] Specifies the field which should be queried by default for .load
   * @param {Object|Object[]} options.model Either a registered sequelize model or if options.model is an Array it will be treated as the arguments to define a sequelize model
   * @param {Object|string} [options.sort="createdat DESC"] Specifies default sort logic for .query and .search queries
   * @param {number} [options.limit=500] Specifies a default limit to the total documents returned in a .query and .search queries
   * @param {number} [options.skip=0] Specifies a default amount of documents to skip in a .query and .search queries
   * @param {Object|Object[]} [options.population=[]] Optional population configuration for documents returned in .load and .search queries (see sequelize include for proper formatting)
   * @param {Object} [options.fields] Optional configuration for limiting fields that are returned in .load and .search queries
   * @param {number} [options.pagelength=15] Specifies max number of documents that should appear in each sub-set for pagination
   * @param {Boolean} [options.track_changes=true] Sets default track changes behavior for udpates
   * @param {string[]} [options.xss_whitelist=false] Configuration for XSS whitelist package. If false XSS whitelisting will be ignored
   */
  constructor(options = {}) {
    // console.log('options.db_connection', options.db_connection);
    // console.log("INITIAL typeof options.db_connection", typeof options.db_connection,{options});
    this.adapter_type = 'bigquery';

    if (options.db_connection && typeof options.db_connection === 'object') {
      if (options.db_connection instanceof BigQuery) {
        this.db_connection = options.db_connection;
      } else if (options.db_connection.db_options) {
        let { db_options, } = options.db_connection;
        this.db_connection = new BigQuery(db_options);
      }
    }

    this.docid = options.docid || '_id';
    this.jsonify_results = (typeof options.jsonify_results === 'boolean') ? options.jsonify_results : true;
    // console.log('Object.keys(options.model)',Object.keys(options.model))
    this.db_connection.models = this.db_connection.models || {};
    if (options.model && typeof options.model === 'object') {
      if (!(options.model instanceof BigQuery.Table)) {
        this.dataset = this.db_connection.dataset(options.model.dataset);
        const schema = Object.keys(options.model.tableProperties).reduce((result, key) => {
          result.push(`${key}:${options.model.tableProperties[key]}`);
          return result;
        }, [])
          .join(', ');
        this.model = this.dataset.table(options.model.tableName, { schema, });
        this.model.schema = schema;
      } else {
        this.model = options.model;
      }
      this.db_connection.models[this.model.id] = this.model;
    } else {
      this.model = this.db_connection.models[ options.model ];
    }
    this.modelScheme = options.model;
    this.modelFields = Object.keys(options.model.tableProperties);
    this.sort = options.sort || 'createdat DESC';
    this.limit = options.limit || 500;
    this.skip = options.skip || 0;
    if (Array.isArray(options.search)) this.searchfields = options.search;
    else if (typeof options.search === 'string') this.searchfields = options.search.split(',');
    else this.searchfields = [];
    this.population = options.population || undefined;
    this.fields = options.fields;
    this.pagelength = options.pagelength || 15;
    this.cache = options.cache;
    this.changeset = false;
    this.track_changes = false;
    this.xss_whitelist = options.xss_whitelist || xss_default_whitelist;
    this._useCache = (options.useCache && options.cache) ? true : false;
  }
  /**
   * Sync defined sequelize models with SQL db
   * @param  {Object}  [options={}] Configurable options for sequelize sync method
   * @param  {Function} [cb=false] Callback argument. When cb is not passed function returns a Promise    
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  sync(options = {}, cb = false) {
    if (typeof options === 'function') cb = options;
    let _sync = function(callback) {
      try {
        if (!Object.keys(this.db_connection.models)) {
          callback(null, { status: 'ok', });
        } else {
          Promisie.map(Object.keys(this.db_connection.models), key => {
            const model = this.db_connection.models[key];
            return model.parent.get({ autoCreate: true, })
              .then(() => {
                if (options.force) {
                  return model.delete();
                }
                return Promisie.resolve();
              })
              .then(() => model.create({ schema: model.schema, }));
          }, 1)
            .then(() => {
              if (this.changeset && !this.changeset[IS_SYNCED]) {
                Object.defineProperty(this.changeset, IS_SYNCED, {
                  value: true,
                  enumerable: false,
                });
              }
              callback(null, { status: 'ok', });
            })
            .catch(callback);
        }
      } catch (e) {
        callback(e);
      }
    }.bind(this);
    if (typeof cb === 'function') _sync(cb);
    else return Promisie.promisify(_sync)();
  }
  /**
   * Query method for adapter see _QUERY and _QUERY_WITH_PAGINATION for more details
   * @param  {Object}  [options={}] Configurable options for query
   * @param {Boolean} options.paginate When true query will return data in a paginated form
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  query(options = {}, cb = false) {
    let _query = (options && options.paginate) ? _QUERY_WITH_PAGINATION.bind(this) : _QUERY.bind(this);
    if (typeof cb === 'function') _query(options, cb);
    else return Promisie.promisify(_query)(options);
  }
  /**
   * Search method for adapter see _SEARCH for more details
   * @param  {Object}  [options={}] Configurable options for query
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  search(options = {}, cb = false) {
    let _search = _SEARCH.bind(this);
    if (typeof cb === 'function') _search(options, cb);
    else return Promisie.promisify(_search)(options);
  }
  /**
   * Stream method for adapter see _STREAM for more details
   * @param  {Object}  [options={}] Configurable options for stream
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  stream(options = {}, cb = false) {
    let _stream = _STREAM.bind(this);
    if (typeof cb === 'function') _stream(options, cb);
    else return Promisie.promisify(_stream)(options);
  }
  /**
   * Load method for adapter see _LOAD for more details
   * @param  {Object}  [options={}] Configurable options for load
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  load(options = {}, cb = false) {
    let _load = _LOAD.bind(this);
    if (typeof cb === 'function') _load(options, cb);
    else return Promisie.promisify(_load)(options);
  }
  /**
   * Update method for adapter see _UPDATE, _UPDATED and _UPDATE_ALL for more details
   * @param  {Object}  [options={}] Configurable options for update
   * @param {Boolean} options.return_updated If true update method will return the updated document instead of an update status message
   * @param {Boolean} options.multi If true a multiple document update will be perfomed
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  update(options = {}, cb = false) {
    let _update = (options.multi) ? _UPDATE_ALL.bind(this) : ((options.return_updated) ? _UPDATED.bind(this) : _UPDATE.bind(this));
    if (typeof cb === 'function') _update(options, cb);
    else return Promisie.promisify(_update)(options);
  }
  /**
   * Create method for adapter see _CREATE for more details
   * @param  {Object}  [options={}] Configurable options for create
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  create(options = {}, cb = false) {
    let _create = _CREATE.bind(this);
    if (typeof cb === 'function') _create(options, cb);
    else return Promisie.promisify(_create)(options);
  }
  /**
   * Delete method for adapter see _DELETE and _DELETED for more details
   * @param  {Object}  [options={}] Configurable options for create
   * @param {Boolean} options.return_deleted If true delete method will return the deleted document
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  delete(options = {}, cb = false) {
    let _delete = (options.return_deleted) ? _DELETED.bind(this) : _DELETE.bind(this);
    if (typeof cb === 'function') _delete(options, cb);
    else return Promisie.promisify(_delete)(options);
  }
  /**
   * Raw query method for adapter see _RAW for more details
   * @param  {Object}  options Configurable options for raw query
   * @param  {Function} cb     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  raw(options = {}, cb = false) {
    let _raw = _RAW.bind(this);
    if (typeof cb === 'function') _raw(options, cb);
    else return Promisie.promisify(_raw)(options);
  }
};

module.exports = BIGQUERY_ADAPTER;