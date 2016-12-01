'use strict';
const path = require('path');
const Promisie = require('promisie');
const xss = require('xss');
const flatten = require('flat');
const utility = require(path.join(__dirname, '../../utility/index'));

/**
 * Convenience method for .find mongo method
 * @param  {Object}   options Options for the mongo query
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for search
 */
const _SEARCH = function (options, cb) {
	try {
		let Model = options.model || this.model;
		let { sort, limit, population, fields, skip } = ['sort','limit','population','fields','skip'].reduce((result, key) => {
			result[key] = options[key] || this[key];
		}, {});
		Model.find((options.query && typeof options.query === 'object') ? options.query : {}, fields)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.populate(population)
			.exec(cb);
	}
	catch (e) {
		cb(e);
	}
};

/**
 * Convenience method for returning a stream of mongo data
 * @param  {Object}   options Options for the mongo query
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
		let { sort, limit, population, fields, skip } = ['sort','limit','population','fields','skip'].reduce((result, key) => {
			result[key] = options[key] || this[key];
		}, {});
		let stream = Model.find((options.query && typeof options.query === 'object') ? options.query : {}, fields)
			.sort(sort)
			.skip(skip)
			.limit(limit)
			.populate(population)
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
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {string} [options.sort=this.sort] Sorting criteria for query will default to the this.sort value if not defined
 * @param {number} [options.limit=this.limit] Limits the total returned documents for query will default to the this.limit value if not defined
 * @param {number} [options.pagelength=this.pagelength] Defines the max length of each sub-set of data
 * @param {Object|string} [options.population=this.population] The mongoose population for query will default to the this.population value if not defined
 * @param {Object} [options.fields=this.fields] The fields that should be returned in query will default to the this.fields value if not defined
 * @param {number} [options.skip] The number of documents to offset in query
 * @param  {Function} cb      Callback function for search
 */
const _SEARCH_WITH_PAGINATION = function (options, cb) {
	try {
		let Model = options.model || this.model;
		let { sort, limit, population, fields, skip, pagelength } = ['sort','limit','population','fields','skip','pagelength'].reduce((result, key) => {
			result[key] = options[key] || this[key];
		}, {});
		let pages = {};
		let total = 0;
		let index = 0;
		Promisie.doWhilst(() => {
			return new Promisie((resolve, reject) => {
				_SEARCH.call(this, { sort, limit: pagelength, fields, skip, population, model: Model }, (err, data) => {
					if (err) reject(err);
					else {
						skip += data.length;
						total += data.length;
						pages[index++] = {
							documents: data,
							count: data.length
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
		let { sort, population, fields, docid } = ['sort','population','fields','docid'].reduce((result, key) => {
			result[key] = options[key] || this[key];
		}, {});
		let query = (options.query && typeof options.query === 'object') ? options.query : {
			[docid || '_id']: options.query
		};
		Model.findOne(query, fields)
			.sort(sort)
			.populate(population)
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
	return { $set, $push };
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
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param  {Function} cb      Callback function for update
 */
const _UPDATE = function (options, cb) {
	try {
		let usePatch = options.isPatch;
		let depopulate = (options.depopulate === false) ? false : true;
		let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
		options.updatedoc = (depopulate) ? utility.depopulate(options.updatedoc) : options.updatedoc;
		options.updatedoc = (xss_whitelist) ? JSON.parse(xss(JSON.stringify(options.updatedoc), xss_whitelist)) : options.updatedoc;
		let updateOperation = (usePatch) ? GENERATE_PATCH(options.updatedoc) : GENERATE_PUT(options.updatedoc);
		let Model = options.model || this.model;
		Model.update({ _id: options.id }, updateOperation, cb);
	}
	catch (e) {
		cb(e);
	}
};

/**
 * Convenience method for .findAndUpdate mongoose method (returns updated document instead of normal mongo update status object)
 * @param  {Object}   options Configurable options for mongo update
 * @param {Boolean} options.isPatch If true the update will be treated as a patch instead of a full document update
 * @param {Object} options.updatedoc Either specific fields to update in the case of a patch otherwise the entire updatedated document
 * @param {string} options.id The mongo _id of the document that should be updated
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
 * Convenience method for .create mongoose method
 * @param  {Object}   options Configurable options for mongo create
 * @param {Object} [options.model=this.model] The mongoose model for query will default to the this.model value if not defined
 * @param {Object} [options.newdoc=options] The document that should be created. If newdoc option is not passed it is assumed that the entire options object is the document
 * @param {string[]}  [options.xss_whitelist=this.xss_whitelist] XSS white-list configuration
 * @param  {Function} cb      Callback function for create
 */
const _CREATE = function (options, cb) {
	try {
		let Model = options.model || this.model;
		let newdoc = options.newdoc || options;
		let xss_whitelist = (options.xss_whitelist) ? options.xss_whitelist : this.xss_whitelist;
		Model.create((xss_whitelist) ? JSON.parse(xss(JSON.stringify(newdoc), xss_whitelist)) : newdoc, cb);
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
 * An mongoose specific adapter which provides CRUD methods for a given model
 * @class Mongo_Adapter
 */
const MONGO_ADAPTER = class Mongo_Adapter {
	/**
	 * @constructor
	 * @param  {Object} [options={}] Configurable options for the mongo adapter
	 * @param {string} options.docid Specifies the field which should be queried by default for .load
	 * @param {Object} options.model Mongoose model that should be used in CRUD operations by default
	 * @param {Object|string} [options.sort="-createdat"] Specifies default sort logic for .search queries
	 * @param {number} [options.limit=500] Specifies a default limit to the total documents returned in a .search query
	 * @param {number} [options.offset=0] Specifies a default amount of documents to skip in a .search query
	 * @param {Object|string} [options.population] Optional population configuration for documents returned in .load and .search queries
	 * @param {Object} [options.fields] Optional configuration for limiting fields that are returned in .load and .search queries
	 * @param {number} [options.pagelength=15] Specifies max number of documents that should appear in each sub-set for pagination
	 * @param {string[]} [options.xss_whitelist=false] Configuration for XSS whitelist package. If false XSS whitelisting will be ignored
	 */
	constructor (options = {}) {
		this.docid = options.docid;
		this.model = options.model;
		this.sort = options.sort || '-createdat';
		this.limit = options.limit || 500;
		this.offset = options.offset || 0;
		this.population = options.population;
		this.fields = options.fields;
		this.pagelength = options.pagelength || 15;
		this.cache = options.cache;
		this.xss_whitelist = options.xss_whitelist || false;
		this._useCache = (options.useCache && options.cache) ? true : false;
	}
	/**
	 * Search method for adapter see _SEARCH and _SEARCH_WITH_PAGINATION for more details
	 * @param  {Object}  [options={}] Configurable options for search
	 * @param {Boolean} options.paginate When true search will return data in a paginated form
	 * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
	 * @return {Object}          Returns a Promise when cb argument is not passed
	 */
	search (options = {}, cb = false) {
		let _search = (options && options.paginate) ? _SEARCH_WITH_PAGINATION.bind(this) : _SEARCH.bind(this);
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
	 * Update method for adapter see _UPDATE and _UPDATED for more details
	 * @param  {Object}  [options={}] Configurable options for update
	 * @param {Boolean} options.return_updated If true update method will return the updated document instead of an update status message
	 * @param  {Function} [cb=false]     Callback argument. When cb is not passed function returns a Promise
	 * @return {Object}          Returns a Promise when cb argument is not passed
	 */
	update (options = {}, cb = false) {
		let _update = (options.return_updated) ? _UPDATED.bind(this) : _UPDATE.bind(this);
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
