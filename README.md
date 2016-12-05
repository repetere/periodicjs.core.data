# periodicjs.core.data
### Version
0.0.1
### Description
Core data is a component of periodicjs.core.controller and provides database adapters for commonly used databases (ie. mongo, sql, postgres).  Adapters provide a standard set of methods and options regardless of the type of database and so the methods for querying, updating, creating etc. that are exposed across your application always expect the same inputs and provide the same outputs.  Standardization of usage makes implementation easier and allows for more confidence in development.  Additionally, core data implements a basic interface for instantiating adapters and so all custom adapters are guaranteed to operate under the same basic guidelines.
### Usage
```javascript
//Basic usage (mongodb)
const mongoose = require('mongoose');
const AdapterInterface = require('periodicjs.core.data');
const ExampleSchema = require('./some/path/to/schema');
mongoose.connect();
mongoose.once('open', () => {
	let ExampleModel = mongoose.model('Example', ExampleSchema);
    let Adapter = AdapterIterface.create({ adapter: 'mongo', model: ExampleModel });
    //the model property in above example can also be set to the name of the registered model. See documentation for full list of options for .create method
    let exampleDocument = {...};
    Adapter.create({ newdoc: exampleDocument })
    	.then(Adapter.load.bind(Adapter, {...}))
        .then(Adapter.search.bind(Adapter, {...}))
        .then(Adapter.update.bind(Adapter, {...}))
        .then(Adapter.delete.bind(Adapter, {...}));
    //Adapters also have a stream method which resolves with a stream of query data
    let writeStream = require('fs').createWriteStream('./some/path/to/file');
    Adapter.stream({...})
    	.then(dbstream => {
        	dbstream.pipe(writeStream);
        });
    //All adapter methods optionally accept a callback argument
    Adapter.load({...}, function (err, data) {
    	//Provide some error first callback function
    });
});
//Implementing a custom adapter
const CustomAdapter = function () {
	this.search = function () {};
   	this.load = function () {};
    this.query = function () {};
    this.update = function () {};
    this.delete = function () {};
    this.stream = function () {};
    this.create = function () {};
    return this;
};
const Adapter = AdapterInterface.create({ adapter: CustomAdapter, model: ExampleModel });
//Custom adapters must implement .search, .load, .query, .update, .delete, .stream and .create methods
```
### Testing
```sh
$ npm test
```
### Contributing
License
----

MIT
