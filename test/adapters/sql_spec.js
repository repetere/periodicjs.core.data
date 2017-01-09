'use strict';
const path = require('path');
const Promisie = require('promisie');
const chai = require('chai');
const expect = chai.expect;
const Sequelize = require('sequelize');
const moment = require('moment');
const AdapterInterface = require(path.join(__dirname, '../../index'));
const ExampleSchema = require(path.join(__dirname, '../examples/sequelize_model'));

var Example;
var db;
var connection;
var connectionOptions = ['pas_dev_1', 'vln9834rer', 'lo8wjhetru98', {
	dialect: 'mysql',
	port: 3306,
	host: 'pf-dbsql-dev.promisefinancial.net'
}];
// var connectDB = function () {
// 	return new Promisie((resolve, reject) => {
// 		db = new Sequelize('******', '******', '*****', {
// 			dialect: 'mysql',
// 			port: 3306,
// 			host: '****'
// 		});
// 		Example = db.define(...ExampleSchema);
// 		db.sync({ force: true })
// 			.then(_connection => _connection.authenticate())
// 			.then(_connection => {
// 				connection = _connection;
// 				resolve(connection);
// 			})
// 			.catch(reject);
// 	});
// };

// describe('SQL Adapter Testing', function () {
// 	let Adapter;
// 	before(done => {
// 		connectDB()
// 			.then(() => {
// 				done();
// 			}, done);
// 	});
// 	describe('Basic adapter testing', () => {
// 		before(() => {
// 			Adapter = AdapterInterface.create({ adapter: 'sql', model: Example, db_connection: db });
// 		});
// 		it('Should set the Example model', () => {
// 			expect(Adapter.model.name).to.equal('Example');
// 		});
// 		it('Should be able to set the adapter model with just the adapter name', () => {
// 			let TestAdapter = AdapterInterface.create({ adapter: 'sql', model: ExampleSchema });
// 			expect(Adapter.model.name).to.equal('Example');
// 		});
// 	});
// 	describe('Adapter .create method testing', () => {
// 		let person = {
// 			first_name: 'Hello<script>alert("hello");</script>',
// 			last_name: 'World',
// 			email: 'someemail@email.com'
// 		};
// 		it('Should be able to create a document and skip escaping', done => {
// 			Adapter.create({ newdoc: Object.assign({}, person), skip_xss: true })
// 				.try(result => {
// 					expect(result.first_name).to.equal('Hello<script>alert("hello");</script>');
// 					expect(result.id).to.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should enforce character escaping with defaults if options.html_xss is true', done => {
// 			Adapter.create({ newdoc: Object.assign({}, person), html_xss: true })
// 				.try(result => {
// 					expect(/^Hello&lt;/.test(result.first_name)).to.be.true;
// 					expect(result.id).to.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should enforce basic character escaping if options.html_xss is false', done => {
// 			Adapter.create({ newdoc: Object.assign({}, person) })
// 				.try(result => {
// 					expect(result.first_name).to.equal('Helloalert("hello");');
// 					expect(result.id).to.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to create document if options.newdoc is undefined and options is the document', done => {
// 			Adapter.create(Object.assign({}, person))
// 				.try(result => {
// 					expect(result.id).to.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should respect callback function if argument is passed', done => {
// 			Adapter.create({ newdoc: Object.assign({}, person) }, (err, result) => {
// 				expect(result.id).to.be.ok;
// 				done();
// 			});
// 		});
// 		it('Should be able to batch create documents if bulk_create options is true', done => {
// 			let newdoc = [{
// 				first_name: 'Fizz',
// 				last_name: 'Buzz',
// 				email: 'someemail1@email.com'
// 			}, {
// 				first_name: 'Foo',
// 				last_name: 'Bar',
// 				email: 'someemail2@email.com'
// 			}, {
// 				first_name: 'Alice',
// 				last_name: 'Bob',
// 				email: 'someemail3@email.com'
// 			}];
// 			Adapter.create({ newdoc, bulk_create: true })
// 				.try(result => {
// 					expect(result).to.be.an('array');
// 					expect(result.filter(data => data.first_name).length).to.equal(3);
// 					done();
// 				})
// 				.catch(done);
// 		});
// 	});
// 	describe('Adapter .query method testing', () => {
// 		let query = {
// 			'first_name': { $like: 'hello%' }
// 		};
// 		before(() => {
// 			Adapter = (Adapter) ? Adapter : AdapterInterface.create({ adapter: 'sql', model: Example, db_connection: db });
// 		});
// 		it('Should be able to query for documents and use default options', done => {
// 			Adapter.query({ query })
// 				.try(result => {
// 					expect(Array.isArray(result)).to.be.true;
// 					expect(/hello/i.test(result[0].first_name)).to.be.true;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to query for documents with custom options', done => {
// 			Adapter.query({ query, limit: 1, fields: { 'first_name': 1 } })
// 				.try(result => {
// 					expect(Array.isArray(result)).to.be.true;
// 					expect(result.length).to.equal(1);
// 					expect(result[0].createdat).to.not.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to handle pagination', done => {
// 			Adapter.query({ query, paginate: true, pagelength: 2, limit: 5 })
// 				.try(result => {
// 					expect(result).to.be.an('object');
// 					result = Object.keys(result).filter(key => {
// 						return (result[key].documents && result[key].count);
// 					});
// 					expect(result.length).to.equal(3);
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should respect callback if arguement is passed', done => {
// 			Adapter.query({ query }, (err, result) => {
// 				if (err) done(err);
// 				else {
// 					expect(result).to.be.an('array');
// 					done();
// 				}
// 			});
// 		});
// 	});
// 	describe('Adapter .search method testing', () => {
// 		before(() => {
// 			Adapter = (Adapter) ? Adapter : AdapterInterface.create({ adapter: 'sql', model: Example, db_connection: db });
// 		});
// 		it('Should be able to handle a normal query object', done => {
// 			let query = {
// 				'first_name': { $like: 'hello%' }
// 			};
// 			Adapter.search({ query })
// 				.try(result => {
// 					expect(result).to.be.an('array');
// 					expect(result[0]).to.have.property('createdat');
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to handle a query string', done => {
// 			let query = 'World,Foobar,Fizzbuzz';
// 			let search = 'last_name';
// 			Adapter.search({ query, search, delimeter: ',' })
// 				.try(result => {
// 					expect(result).to.be.an('array');
// 					let splitquery = query.split(',');
// 					expect(result.filter(value => splitquery.indexOf(value.last_name) !== -1).length).to.equal(result.length);
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to handle queries on docid', done => {
// 			let values = 'World,Foobar,Fizzbuzz';
// 			Adapter.search({ values, docid: 'last_name' })
// 				.try(result => {
// 					expect(result).to.be.an('array');
// 					let splitvalue = values.split(',');
// 					expect(result.filter(value => splitvalue.indexOf(value.last_name) !== -1).length).to.equal(result.length);
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to handle composed queries', done => {
// 			let query = {
// 				'first_name': 'hello%'
// 			};
// 			let values = 'Foobar,Fizzbuzz';
// 			Adapter.search({ query, values, docid: 'last_name', inclusive: true })
// 				.try(result => {
// 					expect(result).to.be.an('array');
// 					let splitvalue = values.split(',');
// 					expect(result.filter(value => splitvalue.indexOf(value.last_name) === -1).length).to.equal(result.length);
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to handle pagination', done => {
// 			let query = {
// 				'first_name': 'hello%'
// 			};
// 			let values = 'Foobar,Fizzbuzz';
// 			Adapter.search({ query, values, docid: 'last_name', inclusive: true, paginate: true, pagelength: 2, limit: 5 })
// 				.try(result => {
// 					expect(result).to.be.an('object');
// 					result = Object.keys(result).filter(key => {
// 						return (result[key].documents && result[key].count);
// 					});
// 					expect(result.length).to.equal(3);
// 					done();
// 				})
// 				.catch(done);
// 		});
// 	});
// 	describe('Adapter .load method testing', () => {
// 		let example;
// 		before(done => {
// 			Adapter.query({ limit: 1 })
// 				.then(result => {
// 					example = result[0];
// 					done();
// 				}, done);
// 		});
// 		it('Should be able to handle queries on docid', done => {
// 			Adapter.load({ docid: 'last_name', query: 'World' })
// 				.try(result => {
// 					expect(result).to.be.an('object');
// 					expect(result).to.have.property('createdat');
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should be able to handle queries on id if docid option is not passed', done => {
// 			Adapter.load({ query: example.id })
// 				.try(result => {
// 					expect(result).to.be.an('object');
// 					expect(result).to.have.property('createdat');
// 					done();
// 				})
// 				.catch(done);
// 		});
// 	});
// 	describe('Adapter .stream method testing', () => {
// 		it('Should be return a sql stream of data', done => {
// 			Adapter.stream()
// 				.try(cursor => {
// 					expect(cursor).to.have.property('pause');
// 					expect(cursor).to.have.property('resume');
// 					let values = [];
// 					cursor.on('data', data => values.push(data))
// 						.on('end', () => {
// 							expect(values.filter(value => value.created_at).length).to.equal(values.length);
// 							done();
// 						})
// 						.on('error', done);
// 				})
// 				.catch(done);
// 		});
// 		it('Should respect custom configuration options', done => {
// 			Adapter.stream({ limit: 2 })
// 				.try(cursor => {
// 					expect(cursor).to.have.property('pause');
// 					expect(cursor).to.have.property('resume');
// 					let values = [];
// 					cursor.on('data', data => values.push(data))
// 						.on('end', () => {
// 							expect(values.length).to.equal(2);
// 							done();
// 						})
// 						.on('error', done);
// 				})
// 				.catch(done);
// 		});
// 	});
// 	describe('Adapter .delete method testing', () => {
// 		let example;
// 		before(done => {
// 			Adapter.query({ limit: 2 })
// 				.then(result => {
// 					example = result;
// 					done();
// 				}, done);
// 		});
// 		it('Should be able to handle delete', done => {
// 			Adapter.delete({ deleteid: example[0].id })
// 				.try(result => {
// 					expect(result).to.be.a('number');
// 					return Adapter.load({ query: example[0].id });
// 				})
// 				.try(result => {
// 					expect(result).to.not.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 		it('Should handle delete and return loaded object if return_deleted option is passed', done => {
// 			Adapter.delete({ deleteid: example[1].id, return_deleted: true })
// 				.try(result => {
// 					expect(result.dataValues).to.deep.equal(example[1].dataValues);
// 					return Adapter.load({ query: example[1].id });
// 				})
// 				.try(result => {
// 					expect(result).to.not.be.ok;
// 					done();
// 				})
// 				.catch(done);
// 		});
// 	});
// });
