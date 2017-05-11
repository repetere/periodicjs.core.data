'use strict';
const path = require('path');
const mongoose = require('mongoose');
const Promisie = require('promisie');
const flatten = require('flat');
const utility = require(path.join(__dirname, '../utility/index'));
const xss_default_whitelist = require(path.join(__dirname, '../defaults/index')).xss_whitelist();

/**
 * Convenience method for .find mongo method
 * @param  {Object}   options Options for the mongo query
 * @param {Object} [options.query={}] The query that should be used for the database search
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for query
 */
const _QUERY = function (options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, limit, population, fields, skip } = ['sort','limit','population','fields','skip'].reduce((result, key) => {
      result[key] = options[key] || this[key];
      return result;
    }, {});
    Model.find((options.query && typeof options.query === 'object') ? options.query : {}, fields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(population || '')
      .exec(cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for returning a stream of mongo data
 * @param  {Object}   options Options for the mongo query
 * @param {Object} [options.query={}] The query that should be used for the database search
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for stream
 */
const _STREAM = function (options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, limit, population, fields, skip } = ['sort','limit','population','fields','skip'].reduce((result, key) => {
      result[key] = options[key] || this[key];
      return result;
    }, {});
    skip = (typeof skip === 'number') ? skip : 0;
    let stream = Model.find((options.query && typeof options.query === 'object') ? options.query : {}, fields)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(population || '')
      .cursor();
    cb(null, stream);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .find mongo method with built in pagination of data
 * @param  {Object}   options Options for the mongo query
 * @param {Object} [options.query={}] The query that should be used for the database search
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {number} [options.pagelength=this.pagelength] Defines the max length of each sub-set of data
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for query
 */
const _QUERY_WITH_PAGINATION = function (options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, limit, population, fields, skip, pagelength } = ['sort','limit','population','fields','skip','pagelength'].reduce((result, key) => {
      result[key] = options[key] || this[key];
      return result;
    }, {});
    let pages = {
    	total: 0,
    	total_pages: 0
    };
    let total = 0;
    let index = 0;
    skip = (typeof skip === 'number') ? skip : 0;
    Promisie.doWhilst(() => {
      return new Promisie((resolve, reject) => {
        _QUERY.call(this, { sort, limit: (total + pagelength <= limit) ? pagelength : (limit - total), fields, skip, population, model: Model }, (err, data) => {
          if (err) reject(err);
          else {
            skip += data.length;
            total += data.length;
            pages.total += data.length;
            pages.total_pages++;
            pages[index++] = {
              documents: data,
              count: data.length,
            };
            resolve(data.length);
          }
        });
      });
    }, current => (current === pagelength && total < limit))
      .then(() => cb(null, pages))
      .catch(cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .find mongo method with built in query builder functionality
 * @param  {Object}   options Options for the mongo query
 * @param {Object|string} [options.query] The query that should be used for the database search. If this value is a string it will be treated as a delimited list of values to use in query
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {number} [options.pagelength=this.pagelength] Defines the max length of each sub-set of data
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param {string[]} [options.search=this.searchfields] Used in building the query. A separate $or statement is appended into query array for each search field specified ie. ['a','b'] => { $or: [{a: ..., b ...}] }
 * @param {string} [options.delimeter="|||"] The value that the query values are delimeted by. If options.query is an object this value is ignored
 * @param {string} [options.docid=this.docid] When using options.values this specifies the name of the field that should be matched
 * @param {string} [options.values] A comma separated list of values to be queried against docid or "_id" if docid is not specified
 * @param {Boolean} options.paginate If true documents will be returned in a paginated format
 * @param  {Function} cb      Callback function for query
 */
const _SEARCH = function (options, cb) {
  try {
    let query;
    let searchfields;
    if (Array.isArray(options.search)) searchfields = options.search;
    else if (typeof options.search === 'string') searchfields = options.search.split(',');
    else searchfields = this.searchfields;
    let toplevel = (options.inclusive) ? '$or' : '$and';
    query = { [toplevel]: [] };
    //Pushes options.query if it already a composed query object
    if (options.query && typeof options.query === 'object') query[toplevel].push(options.query);
    //Handles options.query if string or number
    else if (typeof options.query === 'string' || typeof options.query === 'number') {
      let values = [];
      if (typeof options.query === 'number') values.push(options.query);
      //Tries to split on delimeter and generate query from options.query string
      else values = options.query.split((typeof options.delimeter === 'string' || options.delimeter instanceof RegExp) ? options.delimeter : '|||');
      let statement = values.reduce((result, value) => {
        let block = { $or: [] };
        for (let i = 0; i < searchfields.length; i++) {
          block.$or.push({ [searchfields[i]]: value });
        }
        return result.concat(block);
      }, []);
      query[toplevel].push({ $or: statement });
    }
    //Handles docnamelookup portion of query
    if (typeof options.values === 'string') {
      let split = options.values.split(',');
      let isObjectIds = (split.filter(utility.isObjectId).length === split.length);
      if (isObjectIds) query[toplevel].push({ '_id': { $in: split } });
      else query[toplevel].push({ [(options.docid || this.docid) ? (options.docid || this.docid) : '_id']: { $in: split } });
    }
    options.query = query;
    if (options.paginate) _QUERY_WITH_PAGINATION.call(this, options, cb);
    else _QUERY.call(this, options, cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .findOne or .findById mongoose methods
 * @param  {Object}   options Configurable options for mongo query
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {string} [options.docid="_id"] A field that should be queried will default to "_id"
 * @param {Object|string|number} options.query If value is an object query will be set to the value otherwise a query will be built based on options.docid and any other value provided in options.query
 * @param  {Function} cb      Callback function for load
 */
const _LOAD = function (options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, population, fields, docid } = ['sort','population','fields','docid'].reduce((result, key) => {
      result[key] = options[key] || this[key];
      return result;
    }, {});
    let query = (options.query && typeof options.query === 'object') ? options.query : {
      [(utility.isObjectId(options.query)) ? '_id' : (docid || '_id')]: options.query
    };
    Model.findOne(query, fields)
      .sort(sort)
      .populate(population || '')
      .exec(cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Creates a mongoose update operation that only uses $set and $push
 * @param {Object} data Any fields that should be updated as part of patch
 * @return {Object} Returns an object with $set and $push properties
 */
const GENERATE_PATCH = function (data) {
  delete data._id;
  delete data.__v;
  let flattened = flatten(data, { safe: true });
  let $set = {};
  let $push = {};
  for (let key in flattened) {
    if (Array.isArray(flattened[key])) $push[key] = { $each: flattened[key] };
    else $set[key] = flattened[key];
  }
  let compiled = {};
  if (Object.keys($set).length) compiled.$set = $set;
  if (Object.keys($push).length) compiled.$push = $push;
  return compiled;
};

/**
 * Returns a cleaned object for a full document update
 * @param {Object} data A full document with updated data for put
 * @return {Object} Returns original object with reserved fields removed
 */
const GENERATE_PUT = function (data) {
  delete data._id;
  delete data.__v;
  return data;
};

/**
 * Convenience method for .update mongo method
 * @param  {Object}   options Configurable options for mongo update
 * @param {Boolean} options.isPatch If true the update will be treated as a patch instead of a full document update
 * @param {Object} options.updatedoc Either specific fields to update in the case of a patch otherwise the entire updatedated document
 * @param {string} options.id The mongo _id of the document that should be updated
 * @param {Boolean} [options.skip_xss] If true xss character escaping will be skipped and xss whitelist is ignored
 * @param {Boolean} [options.html_xss] If true xss npm module will be used for character escaping
 * @param {Boolean} [options.track_changes] If false changes will not be tracked
 * @param {Boolean} [options.ensure_changes] If true changeset generation and saving is blocking and errors will cause entire operation to fail
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param  {Function} cb      Callback function for update
 */
const _UPDATE = function (options, cb) {
  try {
    options.track_changes = (typeof options.track_changes === 'boolean') ? options.track_changes : this.track_changes;
    if (!options.id) {
      options.id = options.updatedoc._id;
    }
    let changesetData = {
      update: Object.assign({}, options.updatedoc),
      original: Object.assign({}, options.originalrevision)
    };
    let depopulate = (options.depopulate === false) ? false : true;
    let generateChanges = (callback) => {
      if (!options.track_changes || (options.track_changes && !options.ensure_changes)) callback();
      if (options.track_changes) {
        let changeset = (!options.isPatch) ? utility.diff(changesetData.original, changesetData.update, depopulate) : options.updatedoc;
        this.changeset.create({
          parent_document: { id: options.id },
          changeset: changeset
        }, (err, result) => {
          if (options.ensure_changes) {
            if (err) callback(err);
            else callback(null, result);
          }
        });
      }
    };
    let usePatch = options.isPatch;
    let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
    let originalId = options.updatedoc._id;
    options.updatedoc = (depopulate) ? utility.depopulate(options.updatedoc) : options.updatedoc;
    options.updatedoc._id = originalId;
    options.updatedoc = utility.enforceXSSRules(options.updatedoc, xss_whitelist, options);
    let updateOperation = (usePatch) ? GENERATE_PATCH(options.updatedoc) : GENERATE_PUT(options.updatedoc);
    let Model = options.model || this.model;
    Promisie.parallel({
      update: Promisie.promisify(Model.update, Model)({ _id: options.id }, updateOperation),
      changes: Promisie.promisify(generateChanges)()
    })
      .then(result => {
        if (options.ensure_changes) cb(null, result);
        else cb(null, result.update);
      }, cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .findAndUpdate mongoose method (returns updated document instead of normal mongo update status object)
 * @param  {Object}   options Configurable options for mongo update
 * @param {Boolean} options.isPatch If true the update will be treated as a patch instead of a full document update
 * @param {Object} options.updatedoc Either specific fields to update in the case of a patch otherwise the entire updated document
 * @param {string} options.id The mongo _id of the document that should be updated
 * @param {Boolean} [options.skip_xss] If true xss character escaping will be skipped and xss whitelist is ignored
 * @param {Boolean} [options.html_xss] If true xss npm module will be used for character escaping
 * @param {Boolean} [options.track_changes] If false changes will not be tracked
 * @param {Boolean} [options.ensure_changes] If true changeset generation and saving is blocking and errors will cause entire operation to fail
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param  {Function} cb      Callback function for update
 */
const _UPDATED = function (options, cb) {
  try {
    _UPDATE.call(this, options, (err) => {
      if (err) cb(err);
      else _LOAD.call(this, { model: options.model, query: options.id }, cb);
    });
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .update with the multi options set to true for multiple document updates
 * @param  {Object}   options Configurable options for mongo update with multi true
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {Object} options.query Query that should be used in update
 * @param {Object} [options.updatequery] Alias for options.query if options.query is set this option is ignored
 * @param {Object} options.updateattributes A mongo update formatted object
 * @param {Object} [options.updatedoc] Object specifying fields to update with new values this object will be formatted as a patch update. If options.updateattributes is set this option is ignored
 * @param  {Function} cb      Callback function for update all
 */
const _UPDATE_ALL = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let query = options.query || options.updatequery;
    let patch;
    if (options.updateattributes && typeof options.updateattributes === 'object') patch = options.updateattributes;
    else if (options.updatedoc && typeof options.updatedoc === 'object') patch = GENERATE_PATCH(options.updatedoc);
    else throw new Error('Either updateattributes or updatedoc option must be set in order to execute multi update');
    Model.update(query, patch, { multi: true }, cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .create mongoose method
 * @param  {Object}   options Configurable options for mongo create
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {Object|Object[]} [options.newdoc=options] The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document
 * @param {Boolean} options.bulk_create If true and options.newdoc is an array each index will be treated as an individual document and be bulk inserted
 * @param {Boolean} [options.skip_xss] If true xss character escaping will be skipped and xss whitelist is ignored
 * @param {Boolean} [options.html_xss] If true xss npm module will be used for character escaping
 * @param {Object}  [options.xss_whitelist=this.xss_whitelist] XSS white-list configuration for xss npm module
 * @param  {Function} cb      Callback function for create
 */
const _CREATE = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let newdoc = options.newdoc || options;
    let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
    if (Array.isArray(newdoc) && options.bulk_create) {
      Promisie.map(newdoc, (doc) => {
        return Promisie.promisify(Model.create, Model)(utility.enforceXSSRules(doc, xss_whitelist, options));
      })
        .then(created => cb(null, created))
        .catch(cb);
    }
    else Model.create(utility.enforceXSSRules(newdoc, xss_whitelist, (options.newdoc) ? options : undefined), cb);
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .remove mongoose method
 * @param  {Object}   options Configurable options for mongo delete
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} options.deleteid The mongo id of the document that should be removed
 * @param {string} options.id If options.deleteid is provided this value is ignored - alias for options.deleteid
 * @param  {Function} cb      Callback function for delete
 */
const _DELETE = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let deleteid = options.deleteid || options.id;
    if (typeof deleteid !== 'string') throw new Error('Must specify "deleteid" or "id" for delete');
    Model.remove({ _id: deleteid }, cb); 
  }
  catch (e) {
    cb(e);
  }
};

/**
 * Convenience method for .remove mongoose method but returns the deleted document
 * @param  {Object}   options Configurable options for mongo delete
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} options.deleteid The mongo id of the document that should be removed
 * @param {string} options.id If options.deleteid is provided this value is ignored - alias for options.deleteid
 * @param  {Function} cb      Callback function for delete
 */
const _DELETED = function (options, cb) {
  try {
    _LOAD.call(this, { model: options.model, query: options.deleteid || options.id }, (err1, loaded) => {
      if (err1) cb(err1);
      else {
        _DELETE.call(this, options, (err2) => {
          if (err2) cb(err2);
          else cb(null, loaded);
        });
      }
    });
  }
  catch (e) {
    cb(e);
  }
};

/**
 * A mongoose specific adapter which provides CRUD methods for a given model
 * @type Mongo_Adapter
 */
const MONGO_ADAPTER = class Mongo_Adapter {
  /**
   * @constructor
   * @param  {Object} [options={}] Configurable options for the mongo adapter
   * @param {string} options.docid Specifies the field which should be queried by default for .load
   * @param {Object} options.model Mongoose model that should be used in CRUD operations by default
   * @param {Object|string} [options.sort="-createdat"] Specifies default sort logic for .query and .search queries
   * @param {Object} [options.db_connection=mongoose] A custom mongoose db instance if connecting to a different mongoose instance. Will default to cached mongoose connection if not passed. If this option is defined the changeset scheam will be registered on this instance.
   * @param {number} [options.limit=500] Specifies a default limit to the total documents returned in a .query and .search queries
   * @param {number} [options.skip=0] Specifies a default amount of documents to skip in a .query and .search queries
   * @param {Object|string} [options.population] Optional population configuration for documents returned in .load and .search queries
   * @param {Object} [options.fields] Optional configuration for limiting fields that are returned in .load and .search queries
   * @param {number} [options.pagelength=15] Specifies max number of documents that should appear in each sub-set for pagination
   * @param {Boolean} [options.track_changes=true] Sets default track changes behavior for udpates
   * @param {string[]} [options.xss_whitelist=false] Configuration for XSS whitelist package. If false XSS whitelisting will be ignored
   */
  constructor (options = {}) {
  	this.db_connection = options.db_connection || mongoose;
    this.docid = options.docid; //previously docnamelookup
    this.model = (typeof options.model === 'string') ? this.db_connection.model(options.model) : options.model;
    this.sort = options.sort || '-createdat';
    this.limit = options.limit || 500;
    this.skip = options.skip || 0;
    if (Array.isArray(options.search)) this.searchfields = options.search;
    else if (typeof options.search === 'string') this.searchfields = options.search.split(',');
    else this.searchfields = [];
    this.population = options.population;
    this.fields = options.fields;
    this.pagelength = options.pagelength || 15;
    this.cache = options.cache;
    this.track_changes = (options.track_changes === false) ? false : true;
    this.changeset = (options.db_connection) ? require(path.join(__dirname, '../changeset/index')).mongo(this.db_connection) : require(path.join(__dirname, '../changeset/index')).mongo_default;
    this.xss_whitelist = options.xss_whitelist || xss_default_whitelist;
    this._useCache = (options.useCache && options.cache) ? true : false;
  }
  /**
   * Query method for adapter see _QUERY and _QUERY_WITH_PAGINATION for more details
   * @param  {Object}  [options={}] Configurable options for query
   * @param {Boolean} options.paginate When true query will return data in a paginated form
   * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
   * @return {Object}          Returns a Promise when cb argument is not passed
   */
  query (options = {}, cb = false) {
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
  search (options = {}, cb = false) {
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
  stream (options = {}, cb = false) {
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
  load (options = {}, cb = false) {
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
  update (options = {}, cb = false) {
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
  create (options = {}, cb = false) {
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
  delete (options = {}, cb = false) {
    let _delete = (options.return_deleted) ? _DELETED.bind(this) : _DELETE.bind(this);
    if (typeof cb === 'function') _delete(options, cb);
    else return Promisie.promisify(_delete)(options);
  }
};

module.exports = MONGO_ADAPTER;
