'use strict';
const path = require('path');
const Sequelize = require('sequelize');
const Promisie = require('promisie');
const utility = require(path.join(__dirname, '../utility/index'));
const xss_default_whitelist = require(path.join(__dirname, '../defaults/index')).xss_whitelist();
const Transform = require('stream').Transform;

const GENERATE_SELECT = function (fields) {
  if (typeof fields === 'string') return fields.split(',');
  if (Array.isArray(fields)) return fields;
  return Object.keys(fields).reduce((result, key) => {
    if (fields[key]) {
      if (typeof fields[key] !== 'string') result.push(key);
      else result.push([key, fields[key]]);
    }
    return result;
  }, []);
};

const _QUERY = function (options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, limit, population, fields, skip } = ['sort','limit','population','fields','skip'].reduce((result, key) => {
      result[key] = options[key] || this[key];
      return result;
    }, {});
    let queryOptions = {
      where: (options.query && typeof options.query === 'object') ? options.query : {}
    };
    if (fields) queryOptions.attributes = GENERATE_SELECT(fields);
    if (sort) queryOptions.order = sort;
    if (skip) queryOptions.offset = skip;
    if (limit) queryOptions.limit = limit;
    if (population) {
      if (population && population.include) queryOptions.include = population.include;
      else queryOptions.include = population;
    }
    Model.findAll(queryOptions)
      .then(result => cb(null, result))
      .catch(cb);
  }
  catch (e) {
    cb(e);
  }
};

const CREATE_SIMPLE_CURSOR = function (qs, data, cb) {
  try {
    let isDone = {
      state: false
    };
    let defaultSuccess = (data) => data;
    let defaultError = (e) => Promisie.reject(e);
    let next = function () {
      qs.resume();
      return new Promisie((resolve, reject) => {
        qs.once('data', data => {
          qs.pause();
          resolve(data);
        })
          .once('error', reject);
      });
    };
    let cursor = function initializeCursor (onSuccess = defaultSuccess, onError = defaultError) {
      qs.on('finish', () => {
        isDone.state = true;
      });
      return function* () {
        while (!isDone.state) yield next().then(onSuccess, onError);
      };
    };
    cursor = Object.assign(cursor, qs);
    let methods = ['pipe','unpipe','on','once','pause','resume'];
    for (let i = 0; i < methods.length; i++) cursor[methods[i]] = qs[methods[i]].bind(qs);
    for (let i = 0, len = data.length; i < len; i++) {
      let task = setImmediate(() => {
        if (i === len - 1) qs.end(data[i]);
        else qs.write(data[i]);
        clearImmediate(task);
      });
    }
    cb(null, cursor);
  }
  catch (e) {
    cb(e);
  }
};

const _STREAM = function (options, cb) {
  try {
    _QUERY(options, (err, documents) => {
      if (err) cb(err);
      else {
        let querystream = new Transform({ objectMode: true });
        querystream._transform = function (data, enc, next) {
          this.push(data);
          next();
        };
        CREATE_SIMPLE_CURSOR(querystream, documents, cb);
      }
    });
  }
  catch (e) {
    cb(e);
  }
};

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
      if (isObjectIds) query[toplevel].push({ 'id': { $in: split } });
      else query[toplevel].push({ [(options.docid || this.docid) ? (options.docid || this.docid) : 'id']: { $in: split } });
    }
    options.query = query;
    if (options.paginate) _QUERY_WITH_PAGINATION.call(this, options, cb);
    else _QUERY.call(this, options, cb);
  }
  catch (e) {
    cb(e);
  }
};

const _LOAD = function (options, cb) {
  try {
    let Model = options.model || this.model;
    //Iteratively checks if value was passed in options argument and conditionally assigns the default value if not passed in options
    let { sort, population, fields, docid } = ['sort','population','fields','docid'].reduce((result, key) => {
      result[key] = options[key] || this[key];
      return result;
    }, {});
    let query = (options.query && typeof options.query === 'object') ? options.query : {
      $or: [{
        id: options.query
      }, {
        [docid]: options.query
      }]
    };
    let queryOptions = {
      where: query
    };
    if (fields) queryOptions.attributes = GENERATE_SELECT(fields);
    if (sort) queryOptions.order = sort;
    if (population) {
      if (population && population.include) queryOptions.include = population.include;
      else queryOptions.include = population;
    }
    Model.findOne(queryOptions)
      .then(result => cb(null, result))
      .catch(cb);
  }
  catch (e) {
    cb(e);
  }
};

const _UPDATE = function (options, cb) {
  try {
    options.track_changes = (typeof options.track_changes === 'boolean') ? options.track_changes : this.track_changes;
    let changesetData = {
      update: Object.assign({}, options.updatedoc),
      original: Object.assign({}, options.originalrevision)
    };
    let generateChanges = (callback) => {
      if (!options.track_changes || (options.track_changes && !options.ensure_changes)) callback();
      if (options.track_changes) {
        let changeset = (!options.isPatch) ? utility.diff(changesetData.original, changesetData.update, true) : options.updatedoc;
        Promisie.map(Object.keys(changeset), (key) => {
          return this.changeset.create({
            parent_document_id: options.id,
            field_name: key,
            original: (changeset[key].length > 1) ? changeset[key][0] : 'new value',
            update: (changeset[key].length < 2) ? changeset[0] : ((changeset[key].length === 2) ? changeset[key][1] : 'deleted value')
          });
        })
          .then(result => {
            if (options.ensure_changes) callback(null, result);
          }, e => {
            if (options.ensure_changes) callback(e);
          });
      }
    };
    let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
    options.updatedoc = utility.enforceXSSRules(options.updatedoc, xss_whitelist, options);
    let Model = options.model || this.model;
    let where = {
      $or: [{
        id: options.id
      }, {
        [options.docid || this.docid]: options.id
      }]
    };
    Promisie.parallel({
      update: Model.update(options.updatedoc, (options.query && typeof options.query === 'object') ? {
        limit: 1,
        where: options.query
      } : {
        where,
        limit: 1
      }),
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

const _UPDATED = function (options, cb) {
  try {
    if (!options.id) throw new Error('Can\'t retrieve document after update if options.id is not defined');
    _UPDATE.call(this, options, (err) => {
      if (err) cb(err);
      else _LOAD.call(this, { model: options.model, query: options.id }, cb);
    });
  }
  catch (e) {
    cb(e);
  }
};

const _UPDATE_ALL = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let query = options.query || options.updatequery;
    let update = options.updateattributes || options.updatedoc;
    if (!update || (update && typeof update !== 'object')) throw new Error('Either updateattributes or updatedoc option must be set in order to execute multi update');
    Model.update(update, query, cb);
  }
  catch (e) {
    cb(e);
  }
};

const _CREATE = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let newdoc = options.newdoc || options;
    let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
    if (Array.isArray(newdoc) && options.bulk_create) {
      newdoc = newdoc.map(doc => utility.enforceXSSRules(doc, xss_whitelist, options));
      Model.bulkCreate(newdoc)
        .then(result => cb(null, result))
        .catch(cb);
    }
    else {
      Model.create(utility.enforceXSSRules(newdoc, xss_whitelist, (options.newdoc) ? options : undefined))
        .then(result => cb(null, result))
        .catch(cb);
    }
  }
  catch (e) {
    cb(e);
  }
};

const _DELETE = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let deleteid = options.deleteid || options.id;
    if (typeof deleteid !== 'string') throw new Error('Must specify "deleteid" or "id" for delete');
    Model.destroy({
      where: [{
        id: deleteid
      }, {
        [options.docid || this.docid]: deleteid
      }],
      force: options.force,
      limit: 1
    })
      .then(result => cb(null, result))
      .catch(cb);
  }
  catch (e) {
    cb(e);
  }
};

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

const _RAW = function (options, cb) {
  try {
    let Model = options.model || this.model;
    let query = options.query || options.raw_query || options.raw;
    let type;
    if (typeof query !== 'string') throw new Error('Raw queries must be strings');
    if (options.format_result !== false) {
      type = (options.format_result && (typeof options.format_result === 'function' || typeof options.format_result === 'object')) ? options.format_result : Sequelize.QueryTypes[query.replace(/^(\w+)\s+.+$/, '$1')];
    }
    Model.query(query, { type, model: Model })
      .then(result => cb(null, result))
      .catch(cb);
  }
  catch (e) {
    cb(e);
  }
};

const SQL_ADAPTER = class SQL_Adapter {
  constructor (options = {}) {
    this.db_connection = (options.db_connection && typeof options.db_connection === 'object' && options.db_connection.models && options.db_connection.define) ? options.db_connection : new Sequelize(options.db_connection);
    this.docid = options.docid;
    if (options.model && typeof options.model === 'object') {
      if (Array.isArray(options.model)) this.model = this.db_connection.define(...options.model);
      else this.model = options.model;
    }
    else this.model = this.db_connection.models[options.model];
    this.sort = options.sort || 'createdat DESC';
    this.limit = options.limit || 500;
    this.skip = options.skip || 0;
    if (Array.isArray(options.search)) this.searchfields = options.search;
    else if (typeof options.search === 'string') this.searchfields = options.search.split(',');
    else this.searchfields = [];
    this.population = options.population;
    this.fields = options.fields;
    this.pagelength = options.pagelength || 15;
    this.cache = options.cache;
    this.changeset = (options.db_connection) ? require(path.join(__dirname, '../changeset/index')).sql(this.db_connection) : false;
    this.track_changes = (options.track_changes === false || this.changeset === false) ? false : true;
    this.xss_whitelist = options.xss_whitelist || xss_default_whitelist;
    this._useCache = (options.useCache && options.cache) ? true : false;
  }
  query (options = {}, cb = false) {
    let _query = (options && options.paginate) ? _QUERY_WITH_PAGINATION.bind(this) : _QUERY.bind(this);
    if (typeof cb === 'function') _query(options, cb);
    else return Promisie.promisify(_query)(options);
  }
  search (options = {}, cb = false) {
    let _search = _SEARCH.bind(this);
    if (typeof cb === 'function') _search(options, cb);
    else return Promisie.promisify(_search)(options);
  }
  stream (options = {}, cb = false) {
    let _stream = _STREAM.bind(this);
    if (typeof cb === 'function') _stream(options, cb);
    else return Promisie.promisify(_stream)(options);
  }
  load (options = {}, cb = false) {
    let _load = _LOAD.bind(this);
    if (typeof cb === 'function') _load(options, cb);
    else return Promisie.promisify(_load)(options);
  }
  update (options = {}, cb = false) {
    let _update = (options.multi) ? _UPDATE_ALL.bind(this) : ((options.return_updated) ? _UPDATED.bind(this) : _UPDATE.bind(this));
    if (typeof cb === 'function') _update(options, cb);
    else return Promisie.promisify(_update)(options);
  }
  create (options = {}, cb = false) {
    let _create = _CREATE.bind(this);
    if (typeof cb === 'function') _create(options, cb);
    else return Promisie.promisify(_create)(options);
  }
  delete (options = {}, cb = false) {
    let _delete = (options.return_deleted) ? _DELETED.bind(this) : _DELETE.bind(this);
    if (typeof cb === 'function') _delete(options, cb);
    else return Promisie.promisify(_delete)(options);
  }
  raw (options = {}, cb = false) {
    let _raw = _RAW.bind(this);
    if (typeof cb === 'function') _raw(options, cb);
    else return Promisie.promisify(_raw)(options);
  }
};

module.exports = SQL_ADAPTER;
