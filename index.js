'use strict';
const path = require('path');

const ADPATERS = require(path.join(__dirname, './adapters/index'));

/**
 * Interface class - defines properties and property types that should exist within constructed classes
 */
const DB_ADAPTER_INTERFACE = class DB_ADAPTER_INTERFACE {
	/**
	 * Creates an interface
	 * @param  {Object} [options={}] A set of properties defined by keys with their allowed types as values. Each property will be required by newly constructed classes from this interface
	 */
	constructor (options = {}) {
		for (let key in options) {
			this[key] = options[key];
		}
	}
	/**
	 * Constructs a new object with a prototype defined by the .adapter ensuring that instantiated class conforms to interface requirements
	 * @param  {Object} [options={}] Values to be passed to class constructor (.adapter should be reserved for either customer class or string that matches key in ADAPTERS)
	 * @param {string|Function} options.adapter Required to specify type of adapter to be constructed or a class constructor that can be instantiated with new keyword
	 * @return {Object}         Returns an instantiated adapter class
	 */
	create (options = {}) {
		let Adapter = (typeof options.adapter === 'string') ? ADPATERS[options.adapter] : options.adapter;
		if (!Adapter) throw new Error('Could not find a corresponding adapter - for custom adapters pass the constructor as the "adapater" options');
		let adapater = new Adapter(options);
		let errors = [];
		for (let key in adapater) {
			if (typeof adapater[key] !== this[key]) errors.push(`${ key } is invalid type ${ typeof adapater[key] } and should be ${ this[key] }`);
		}
		if (errors.length) {
			let compiledErrors = errors.reduce((result, error, index) => {
				if (index === errors.length - 1) result += error;
				else result += `${ error }, `;
			}, '');
			throw new Error(compiledErrors);
		}
		return adapter;
	}
};

module.exports = new DB_ADAPTER_INTERFACE({
	load: 'function',
	search: 'function',
	update: 'function',
	delete: 'function',
	create: 'function'
});
