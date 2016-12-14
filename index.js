'use strict';
const path = require('path');

const ADAPTERS = require(path.join(__dirname, './adapters/index'));

/**
 * Interface class - defines properties and property types that should exist within constructed classes
 */
const DB_ADAPTER_INTERFACE = class Adapter_Interface {
  /**
   * Creates an interface
   * @param  {Object} [options={}] A set of properties defined by keys with their allowed types as values. Each property will be required by newly constructed classes from this interface
   */
  constructor (options = {}) {
    this.interface = (this.interface && typeof this.interface === 'object') ? this.interface : {};
    for (let key in options) {
      this.interface[key] = options[key];
    }
  }
  /**
   * Constructs a new object with a prototype defined by the .adapter ensuring that instantiated class conforms to interface requirements
   * @param  {Object} [options={}] Values to be passed to class constructor (.adapter should be reserved for either customer class or string that matches key in ADAPTERS)
   * @param {string|Function} options.adapter Required to specify type of adapter to be constructed or a class constructor that can be instantiated with new keyword
   * @param {string|Function} options.db Alias for options.adapter. If options.db is defined options.adapter will be ignored
   * @return {Object}         Returns an instantiated adapter class
   */
  create (options = {}) {
  	options.adapter = (options.db) ? options.db : options.adapter;
    let Adapter = (typeof options.adapter === 'string') ? ADAPTERS[options.adapter] : options.adapter;
    if (!Adapter) throw new Error('Could not find a corresponding adapter - for custom adapters pass the constructor as the "adapter" options');
    let adapter = new Adapter(options);
    let errors = [];
    for (let key in this.interface) {
      if (this.interface[key] !== typeof adapter[key]) errors.push(`${ key } is invalid type ${ typeof adapter[key] } and should be ${ this.interface[key] }`);
    }
    if (errors.length) {
      let compiledErrors = errors.reduce((result, error, index) => {
        if (index === errors.length - 1) result += error;
        else result += `${ error }, `;
        return result;
      }, '');
      throw new Error(compiledErrors);
    }
    return adapter;
  }
};

module.exports = new DB_ADAPTER_INTERFACE({
  load: 'function',
  query: 'function',
  search: 'function',
  update: 'function',
  delete: 'function',
  create: 'function',
  stream: 'function',
});
