# periodicjs.core.data
[![Build Status](https://travis-ci.org/typesettin/periodicjs.core.data.svg?branch=master)](https://travis-ci.org/typesettin/periodicjs.core.data) [![NPM version](https://badge.fury.io/js/periodicjs.core.data.svg)](http://badge.fury.io/js/periodicjs.core.data) [![Coverage Status](https://coveralls.io/repos/github/typesettin/periodicjs.core.data/badge.svg?branch=master)](https://coveralls.io/github/typesettin/periodicjs.core.data?branch=master)  [![Join the chat at https://gitter.im/typesettin/periodicjs.core.data](https://badges.gitter.im/typesettin/periodicjs.core.data.svg)](https://gitter.im/typesettin/periodicjs.core.data?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


### Description
Core data is the ORM wrapping component of periodicjs.core.controller that provides database adapters for commonly used databases (ie. mongo, sql, postgres). Adapters provide a standard set of methods and options regardless of the type of database and so the methods for querying, updating, creating etc. that are exposed across your application always expect the same inputs and provide the same outputs.

Standardization of usage makes implementation easier and allows for more confidence in development.  Additionally, core data implements a basic interface for instantiating adapters and so all custom adapters are guaranteed to operate under the same basic guidelines.

### [Full Documentation](https://github.com/typesettin/periodicjs.core.data/blob/master/doc/api.md)

### Usage (basic)
```javascript
//Basic usage (mongodb)
const mongoose = require('mongoose');
mongoose.connect();
const AdapterInterface = require('periodicjs.core.data');
const ExampleSchema = require('./some/path/to/schema');
let ExampleModel = mongoose.model('Example', ExampleSchema);
let Adapter = AdapterIterface.create({ adapter: 'mongo', model: ExampleModel }); //example core datum for the Example mongoose schema
let exampleDocument = { //example mongo document
    title:'example document',
    createdat: new Date(),
};
mongoose.once('open', () => {
    // The model property in above example can also be set to the name of the registered model. 
    // See documentation for full list of options for .create method
    Adapter.create({ newdoc: exampleDocument })

    //Adapters also have a stream method which resolves with a stream of query data
    let writeStream = require('fs').createWriteStream('./some/path/to/file');
    Adapter.stream({...})
    	.then(dbstream => {
        	dbstream.pipe(writeStream);
        });
});
```
### Usage (with configuration Options)
```javascript
const mongoose = require('mongoose');
mongoose.connect();
const AdapterInterface = require('periodicjs.core.data');
const ExampleSchema = require('./some/path/to/schema');
let ExampleModel = mongoose.model('Example', ExampleSchema);
let config = { limit: 500, sort: '-createdat'};
let Adapter = AdapterIterface.create(Object.assign({ adapter: 'mongo', model: ExampleModel }, config)); //example core datum for the Example mongoose schema
let exampleDocument = { //example mongo document
    title:'example document',
    createdat: new Date(),
};
mongoose.once('open', () => {
    //All adapter methods optionally accept a callback argument
    Adapter.load({title:'example'}, function (err, data) {
    	//Provide some error first callback function
    });

});
```
### Usage (with custom adapter)
```javascript
const mongoose = require('mongoose');
mongoose.connect();
const AdapterInterface = require('periodicjs.core.data');
const ExampleSchema = require('./some/path/to/schema');
let ExampleModel = mongoose.model('Example', ExampleSchema);
let config = { limit: 500, sort: '-createdat' };
let Adapter = AdapterIterface.create(Object.assign({ adapter: 'mongo', model: ExampleModel }, config)); //example core datum for the Example mongoose schema
let exampleDocument = { //example mongo document
    title:'example document',
    createdat: new Date(),
};
mongoose.once('open', () => {
    //Implementing a custom adapter
    const CustomAdapter = function () {
        this.search = function () {};
        this.load   = function () {};
        this.query  = function () {};
        this.update = function () {};
        this.delete = function () {};
        this.stream = function () {};
        this.create = function () {};
        return this;
    };
    const Adapter = AdapterInterface.create({ adapter: CustomAdapter, model: ExampleModel });
    //Custom adapters must implement .search, .load, .query, .update, .delete, .stream and .create methods
});
```

### Development
*Make sure you have grunt installed*
```
$ npm install -g grunt-cli jsdoc-to-markdown
```

For generating documentation
```
$ grunt doc
$ jsdoc2md adapters/**/*.js utility/**/*.js defaults/**/*.js index.js > doc/api.md
```
### Notes
* Check out [https://github.com/typesettin/periodicjs](https://github.com/typesettin/periodicjs) for the full Periodic Documentation

### Testing
```sh
$ npm test
```
### Contributing
License
----

MIT
