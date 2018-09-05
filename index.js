'use strict';
const path = require('path');
const Redshift = require('@repetere/node-redshift');

const ADAPTERS = require(path.join(__dirname, './adapters/index'));

/**
 * Interface class - defines properties and property types that should exist within constructed classes
 */
const DB_ADAPTER_INTERFACE = class Adapter_Interface {
  /**
   * Creates an interface
   * @param  {Object} [options={}] A set of properties defined by keys with their allowed types as values. Each property will be required by newly constructed classes from this interface
   */
  constructor(options = {}) {
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
  create(options = {}) {
    options.adapter = (options.db) ? options.db : options.adapter;
    let Adapter = (typeof options.adapter === 'string') ? ADAPTERS[options.adapter] : options.adapter;
    console.log(Adapter, options.adapter);
    if (!Adapter) throw new Error('Could not find a corresponding adapter - for custom adapters pass the constructor as the "adapter" options');
    let adapter = new Adapter(options);
    let errors = [];
    for (let key in this.interface) {
      if (this.interface[key] !== typeof adapter[key]) errors.push(`${key} is invalid type ${typeof adapter[key]} and should be ${this.interface[key]}`);
    }
    if (errors.length) {
      let compiledErrors = errors.reduce((result, error, index) => {
        if (index === errors.length - 1) result += error;
        else result += `${error}, `;
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

(() => {
  const model = {
    tableName: 'test',
    tableProperties: {
      _id: {
        type: Redshift.DataTypes.BIGINT,
        primaryKey: true,
      },
      name: Redshift.DataTypes.VARCHAR,
      description: Redshift.DataTypes.VARCHAR,
      createdAt: Redshift.DataTypes.TIMESTAMP,
      updatedAt: Redshift.DataTypes.TIMESTAMP,
    },
  };
  const localConnectionOptions = ['importdb', 'developers', 'VAsweajhundIdb9', {
    host: 'r365-data-import.cpbygqps9vhq.us-east-1.redshift.amazonaws.com',
    port: 5439,
    dialect: 'postgres',
    keepDefaultTimezone: true,
    databaseVersion: '8.0.2',
  }];
  const Test = module.exports.create({
    adapter: 'redshift',
    db_connection: {
      db_name: 'importdb',
      db_user: 'developers',
      db_password: 'VAsweajhundIdb9',
      db_options: {
        host: 'r365-data-import.cpbygqps9vhq.us-east-1.redshift.amazonaws.com',
        port: 5439,
      },
    },
    track_changes: false,
    model,
  });
  Test.sync({ force: true, })
    .then(console.log.bind(console, 'table created'))
    .then(() => Test.create({ _id: 1, name: 'test', description: 'test 1' }))
    .then(() => Test.create({ _id: 2, name: 'hello', description: 'test 2' }))
    .then(console.log.bind(console, 'inserts'))
    .then(() => Test.query({ limit: 1, }))
    .then(console.log.bind(console, 'query with limit'))
    .then(() => Test.query({}))
    .then(console.log)
    .catch(console.error);
  // const redshift = new Redshift({
  //   user: 'developers',
  //   database: 'importdb',
  //   password: 'VAsweajhundIdb9',
  //   port: 5439,
  //   host: 'r365-data-import.cpbygqps9vhq.us-east-1.redshift.amazonaws.com',
  // });
  // const Test = redshift.import({
  //   tableName: 'test',
  //   tableProperties: model,
  // });
  // redshift.sync({ force: true, })
  //   .then(() => Test.createAsync({
  //     id: 1,
  //     name: 'test',
  //     description: 'a test value',
  //   }))
  //   .then(() => Test.queryAsync({}))
  //   .then(console.log)
  //   .catch(console.error);
})();
