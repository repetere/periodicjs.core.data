'use strict';
const TransformStream = require('stream').Transform;
const Promisie = require('promisie');

/**
 * A default on success function for each iteration of cursor
 * @param  {*} data Generally a single document be pushed by stream but can be any data type or a Buffer if cursor is not instantiated in objectMode
 * @return {*}      Simply returns whatever data is passed as data arugment
 */
var defaultSuccess = function (data) {
	return data;
};

/**
 * A default on error function for each iteration of cursor
 * @param  {Object} e An instance of Error
 * @return {Object}      Returns a rejected Promise
 */
var defaultError = function (e) {
	return Promisie.reject(e);
};

/**
 * A simple cursor-like implementation that combines generator and stream functionality. Cursor exposes all the normal stream methods such as pipe, unpipe, on, once etc as well as an initialize method that returns a generator and allows for documents to be iteratively resolved. Using both the generator based cursor interface and stream interface concurrently is not recommended as both utilize the TransformStream on data, on error and on finish events and as will likely cause unpredictable behavior
 * @type {Cursor}
 * @extends {TranformStream}
 */
const CURSOR = class Cursor extends TransformStream {
	/**
	 * Constructor for Cursor class
	 * @param  {Object} [options={}] Configurable options for cursor (see TransformStream documentation for more details)
	 * @param {Boolean} options.objectMode Unlike a normal transform stream the cursor class is meant for documents and as such objectMode will always be true unless explicitly declared as false at initialization
	 */
	constructor (options = {}) {
		options.objectMode = (options.objectMode === false) ? false : true;
		super(options);
		this._transform = function (data, enc, next) {
			this.push(data);
			next();
		};
		this._isInitialized = false;
		this._isDone = false;
	}
	/**
	 * Internally used _next method (this should never be accessed directly). Resumes the transform stream and resolves the next document before pausing the stream
	 * @return {Object} Returns a Promise which resolves with the next document written to the stream
	 */
	_next () {
		this.resume();
		return new Promisie((resolve, reject) => {
			this.once('data', data => {
				this.pause();
				resolve(data);
			})
				.once('error', reject);
		});
	}
	/**
	 * Initializes the cursor interface. Once initialized the generator will yield a single document with each next call. The behavior can be modified by passing an onSuccess function as the first argument with each next call. Once cursor is initialized the streams finish, data and error events will have registered listeners
	 * @param  {Function} [onSuccess=defaultSuccess] A default function to be called on each successful .next call. This function can be temporarily overridden by passing a function in the .next call
	 * @param  {Function} [onError=defaultError]   A default function to be called when a .next call results in an rejection
	 * @return {Function}           Returns a generator that iteratively resolves the documents written to the stream
	 */
	initialize (onSuccess = defaultSuccess, onError = defaultError) {
		this._isInitialized = true;
		this.on('finish', () => {
			this._isDone = true;
		});
		return function* () {
			let value;
			while (!this._isDone) value = yield this._next().then((typeof value === 'function') ? value : onSuccess, onError);
		}.bind(this);
	}
};

module.exports = CURSOR;
