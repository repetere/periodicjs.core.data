'use strict';
const path = require('path');
const Promisie = require('promisie');
const chai = require('chai');
const expect = chai.expect;
const Sequelize = require('sequelize');
const moment = require('moment');
const AdapterInterface = require(path.join(__dirname, '../../index'));
const ExampleSchema = require(path.join(__dirname, '../examples/sequelize_model'));
const SQL_Adapter = require(path.join(__dirname, '../../adapters/sql'));

chai.use(require('chai-spies'));

var Example;
var db;
var connection;
var localConnectionOptions = ['test_core_data', 'root', 'root', {
	dialect: 'mysql',
	port: 8889,
	host: 'localhost',
	logging: false
}];

var travisConnectionOptions = ['test_core_data', 'travis', '', {
	dialect: 'mysql',
	port: 3306,
	host: 'localhost',
	logging: false
}];
//Set env in travis script and check for the test env
var connectionOptions = (process.env.NODE_ENV === 'test') ? travisConnectionOptions : localConnectionOptions;
var connectDB = function () {
	return new Promisie((resolve, reject) => {
		db = new Sequelize(...connectionOptions);
		Example = db.define(...ExampleSchema);
		db.sync({ force: true })
			.then(_connection => _connection.authenticate())
			.then(_connection => {
				connection = _connection;
				resolve(connection);
			})
			.catch(reject);
	});
};

describe('SQL Adapter Testing', function () {
	let Adapter;
	before(done => {
		connectDB()
			.then(() => {
				done();
			}, done);
	});
	after(done => {
		Promisie.parallel({
			delete_examples: Adapter.model.destroy.bind(Adapter.model, { where: { $or: [{ id: null }, { id: { $not: null } }] } }),
			delete_changes: Adapter.changeset.model.destroy.bind(Adapter.changeset.model, { where: { id: { $not: null } } })
		})
			.then(() => done())
			.catch(done);
	});
	describe('Basic adapter testing', () => {
		before(() => {
			Adapter = AdapterInterface.create({ adapter: 'sql', model: Example, db_connection: db });
		});
		it('Should set the Example model', () => {
			expect(Adapter.model.name).to.equal('Example');
		});
		it('Should be able to set the adapter model with just the adapter name', () => {
			let TestAdapter = AdapterInterface.create({ adapter: 'sql', model: ExampleSchema });
			expect(Adapter.model.name).to.equal('Example');
		});
	});
	describe('Registering new models/using connection credentials', () => {
		it('Should be able to take connection settings and initialize a connection to the db', () => {
			let AdapterOne = AdapterInterface.create({ adapter: 'sql', db_connection: connectionOptions });
			expect(AdapterOne instanceof SQL_Adapter).to.be.true;
			let AdapterTwo = AdapterInterface.create({
				adapter: 'sql',
				db_connection: {
					db_name: connectionOptions[0],
					db_user: connectionOptions[1],
					db_password: connectionOptions[2],
					db_options: connectionOptions[3]
				}
			});
			expect(AdapterTwo instanceof SQL_Adapter).to.be.true;
		});
		it('Should be able to sync a model that has not already been registered with the database', done => {
			let ExampleAdapter = AdapterInterface.create({ adapter: 'sql', db_connection: db, model: Example });
			ExampleAdapter.sync()
				.try(result => {
					expect(ExampleAdapter.changeset[Symbol.for('changeset_is_synced')]).to.be.true;
					expect(result.status).to.equal('ok');
					done();
				})
				.catch(done);
		});
		it('Should be able to sync a model and pass a callback arugment', done => {
			let ExampleAdapter = AdapterInterface.create({ adapter: 'sql', db_connection: db, model: Example });
			ExampleAdapter.sync({}, (err, result) => {
				if (err) done(err);
				else {
					ExampleAdapter.sync((err2, result2) => {
						if (err2) done(err2);
						else {
							expect(result2.status).to.equal('ok');
							done();
						}
					});
				}
			});
		});
	});
	describe('Adapter .create method testing', () => {
		let person = {
			first_name: 'Hello<script>alert("hello");</script>',
			last_name: 'World',
			email: 'someemail@email.com'
		};
		it('Should be able to create a document and skip escaping', done => {
			Adapter.create({ newdoc: Object.assign({}, person), skip_xss: true })
				.try(result => {
					expect(result.first_name).to.equal('Hello<script>alert("hello");</script>');
					expect(result.id).to.be.ok;
					done();
				})
				.catch(done);
		});
		it('Should enforce character escaping with defaults if options.html_xss is true', done => {
			Adapter.create({ newdoc: Object.assign({}, person), html_xss: true })
				.try(result => {
					expect(/^Hello&lt;/.test(result.first_name)).to.be.true;
					expect(result.id).to.be.ok;
					done();
				})
				.catch(done);
		});
		it('Should enforce basic character escaping if options.html_xss is false', done => {
			Adapter.create({ newdoc: Object.assign({}, person) })
				.try(result => {
					expect(result.first_name).to.equal('Helloalert("hello");');
					expect(result.id).to.be.ok;
					done();
				})
				.catch(done);
		});
		it('Should be able to create document if options.newdoc is undefined and options is the document', done => {
			Adapter.create(Object.assign({}, person))
				.try(result => {
					expect(result.id).to.be.ok;
					done();
				})
				.catch(done);
		});
		it('Should respect callback function if argument is passed', done => {
			Adapter.create({ newdoc: Object.assign({}, person) }, (err, result) => {
				expect(result.id).to.be.ok;
				done();
			});
		});
		it('Should be able to batch create documents if bulk_create options is true', done => {
			let newdoc = [{
				first_name: 'Fizz',
				last_name: 'Buzz',
				email: 'someemail1@email.com'
			}, {
				first_name: 'Foo',
				last_name: 'Bar',
				email: 'someemail2@email.com'
			}, {
				first_name: 'Alice',
				last_name: 'Bob',
				email: 'someemail3@email.com'
			}];
			Adapter.create({ newdoc, bulk_create: true })
				.try(result => {
					expect(result).to.be.an('array');
					expect(result.filter(data => data.first_name).length).to.equal(3);
					done();
				})
				.catch(done);
		});
	});
	describe('Adapter .query method testing', () => {
		let query = {
			'first_name': { $like: 'hello%' }
		};
		before(() => {
			Adapter = (Adapter) ? Adapter : AdapterInterface.create({ adapter: 'sql', model: Example, db_connection: db });
		});
		it('Should be able to query for documents and use default options', done => {
			Adapter.query({ query })
				.try(result => {
					expect(Array.isArray(result)).to.be.true;
					expect(/hello/i.test(result[0].first_name)).to.be.true;
					done();
				})
				.catch(done);
		});
		it('Should be able to query for documents with custom options', done => {
			Adapter.query({ query, limit: 1, fields: { 'first_name': 1 } })
				.try(result => {
					expect(Array.isArray(result)).to.be.true;
					expect(result.length).to.equal(1);
					expect(result[0].createdat).to.not.be.ok;
					done();
				})
				.catch(done);
		});
		it('Should be able to handle pagination', done => {
			Adapter.query({ query, paginate: true, pagelength: 2, limit: 5 })
				.try(result => {
					expect(result).to.be.an('object');
					result = Object.keys(result).filter(key => {
						return (result[key].documents && result[key].count);
					});
					expect(result.length).to.equal(3);
					done();
				})
				.catch(done);
		});
		it('Should respect callback if arguement is passed', done => {
			Adapter.query({ query }, (err, result) => {
				if (err) done(err);
				else {
					expect(result).to.be.an('array');
					done();
				}
			});
		});
	});
	describe('Adapter .search method testing', () => {
		before(() => {
			Adapter = (Adapter) ? Adapter : AdapterInterface.create({ adapter: 'sql', model: Example, db_connection: db });
		});
		it('Should be able to handle a normal query object', done => {
			let query = {
				'first_name': { $like: 'hello%' }
			};
			Adapter.search({ query })
				.try(result => {
					expect(result).to.be.an('array');
					expect(result[0]).to.have.property('createdat');
					done();
				})
				.catch(done);
		});
		it('Should be able to handle a query string', done => {
			let query = 'World,Foobar,Fizzbuzz';
			let search = 'last_name';
			Adapter.search({ query, search, delimeter: ',' })
				.try(result => {
					expect(result).to.be.an('array');
					let splitquery = query.split(',');
					expect(result.filter(value => splitquery.indexOf(value.last_name) !== -1).length).to.equal(result.length);
					done();
				})
				.catch(done);
		});
		it('Should be able to handle queries on docid', done => {
			let values = 'World,Foobar,Fizzbuzz';
			Adapter.search({ values, docid: 'last_name' })
				.try(result => {
					expect(result).to.be.an('array');
					let splitvalue = values.split(',');
					expect(result.filter(value => splitvalue.indexOf(value.last_name) !== -1).length).to.equal(result.length);
					done();
				})
				.catch(done);
		});
		it('Should be able to handle composed queries', done => {
			let query = {
				'first_name': { $like: 'hello%' }
			};
			let values = 'Foobar,Fizzbuzz';
			Adapter.search({ query, values, docid: 'last_name', inclusive: true })
				.try(result => {
					expect(result).to.be.an('array');
					let splitvalue = values.split(',');
					expect(result.filter(value => splitvalue.indexOf(value.last_name) === -1).length).to.equal(result.length);
					done();
				})
				.catch(done);
		});
		it('Should be able to handle pagination', done => {
			let query = {
				'first_name': { $like: 'hello%' }
			};
			let values = 'Foobar,Fizzbuzz';
			Adapter.search({ query, values, docid: 'last_name', inclusive: true, paginate: true, pagelength: 2, limit: 5 })
				.try(result => {
					expect(result).to.be.an('object');
					result = Object.keys(result).filter(key => {
						return (result[key].documents && result[key].count);
					});
					expect(result.length).to.equal(3);
					done();
				})
				.catch(done);
		});
	});
	describe('Adapter .load method testing', () => {
		let example;
		before(done => {
			Adapter.query({ limit: 1 })
				.then(result => {
					example = result[0];
					done();
				}, done);
		});
		it('Should be able to handle queries on docid', done => {
			Adapter.load({ docid: 'last_name', query: 'World' })
				.try(result => {
					expect(result).to.be.an('object');
					expect(result).to.have.property('createdat');
					done();
				})
				.catch(done);
		});
		it('Should be able to handle queries on id if docid option is not passed', done => {
			Adapter.load({ query: example.id })
				.try(result => {
					expect(result).to.be.an('object');
					expect(result).to.have.property('createdat');
					done();
				})
				.catch(done);
		});
	});
	describe('Adapter .stream method testing', () => {
		it('Should be return a sql stream of data', done => {
			Adapter.stream()
				.try(cursor => {
					expect(cursor).to.have.property('pause');
					expect(cursor).to.have.property('resume');
					let values = [];
					cursor.on('data', data => values.push(data))
						.on('end', () => {
							expect(values.filter(value => value.created_at).length).to.equal(values.length);
							done();
						})
						.on('error', done);
				})
				.catch(done);
		});
		it('Should respect custom configuration options', done => {
			Adapter.stream({ limit: 2 })
				.try(cursor => {
					expect(cursor).to.have.property('pause');
					expect(cursor).to.have.property('resume');
					let values = [];
					cursor.on('data', data => values.push(data))
						.on('end', () => {
							expect(values.length).to.equal(2);
							done();
						})
						.on('error', done);
				})
				.catch(done);
		});
	});
	describe('Adapter .delete method testing', () => {
		let example;
		before(done => {
			Adapter.query({ limit: 2 })
				.then(result => {
					example = result;
					done();
				}, done);
		});
		it('Should be able to handle delete', done => {
			Adapter.delete({ deleteid: example[0].id })
				.try(result => {
					expect(result).to.be.a('number');
					return Adapter.load({ query: example[0].id });
				})
				.try(result => {
					expect(result).to.not.be.ok;
					done();
				})
				.catch(done);
		});
		it('Should handle delete and return loaded object if return_deleted option is passed', done => {
			Adapter.delete({ deleteid: example[1].id, return_deleted: true })
				.try(result => {
					expect(result.dataValues).to.deep.equal(example[1].dataValues);
					return Adapter.load({ query: example[1].id });
				})
				.try(result => {
					expect(result).to.not.be.ok;
					done();
				})
				.catch(done);
		});
	});
	describe('Adapter .update method testing', () => {
		let ChangesetAdapter;
		let example;
		let totalChanges;
		before(done => {
			ChangesetAdapter = Adapter.changeset;
			Adapter.query({ limit: 1, query: { id: { $not: null } } })
				.then(result => {
					example = result[0].dataValues;
					done();
				}, done);
		});
		it('Should be able to handle put updates', done => {
			let updatedoc = Object.assign({}, example);
			updatedoc.first_name = 'Hi';
			let sync = Adapter.sync.bind(Adapter);
			let sync_spy = chai.spy(sync);
			Adapter.sync = sync_spy;
			Adapter.update({ id: updatedoc.id, originalrevision: example, updatedoc })
				.try(result => {
					expect(result).to.deep.equal([1]);
					expect(result).to.not.have.property('createdat');
					expect(sync_spy).to.have.been.called.exactly(1);
					return Promisie.retry(() => {
						return ChangesetAdapter.query({ query: { 'parent_document_id': updatedoc.id } })
							.then(result => {
								if (!result.length) return Promise.reject(new Error('Not Found'));
								else return Promise.resolve(result);
							}, e => Promise.reject(e));
					}, { times: 3, timeout: 500 });
				})
				.try(result => {
					expect(Array.isArray(result)).to.be.true;
					expect(result.filter(change => Number(change.parent_document_id) === updatedoc.id).length).to.equal(result.length);
					Adapter.sync = sync;
					done();
				})
				.catch(done);
		});
		it('Should return updated document if return_updated is true', function (done) {
			this.timeout(5000);
			let updatedoc = Object.assign({}, example);
			updatedoc.first_name = 'Bob';
			let sync = Adapter.sync.bind(Adapter);
			let sync_spy = chai.spy(sync);
			Adapter.sync = sync_spy;
			(function () {
				return new Promisie(resolve => {
					let timeout = setTimeout(function () {
						resolve();
						clearTimeout(timeout);
					}, 2000);
				});
			})()
				.then(() => Adapter.update({ id: updatedoc.id, originalrevision: example, updatedoc, return_updated: true }))
				.try(result => {
					expect(result).to.be.an('object');
					expect(result).to.have.property('createdat');
					expect(sync_spy).to.not.have.been.called();
					return Promisie.retry(() => {
						return ChangesetAdapter.query({ query: { 'parent_document_id': updatedoc.id } })
							.then(result => {
								if (!result.length) return Promise.reject(new Error('Not Found'));
								else return Promise.resolve(result);
							}, e => Promise.reject(e));
					}, { times: 3, timeout: 500 });
				})
				.try(result => {
					expect(Array.isArray(result)).to.be.true;
					expect(result.filter(change => Number(change.parent_document_id) === updatedoc.id).length).to.equal(result.length);
					Adapter.sync = sync;
					done();
				})
				.catch(done);
		});
		it('Should be able to handle patch updates', done => {
			let updatedoc = {
				last_name: 'Greg'
			};
			Adapter.update({ id: example.id, originalrevision: example, updatedoc, isPatch: true })
				.try(result => {
					expect(result).to.deep.equal([1]);
					expect(result).to.not.have.property('createdat');
					return Promisie.retry(() => {
						return ChangesetAdapter.query({ query: { 'parent_document_id': example.id } })
							.then(result => {
								if (result.length < 3) return Promise.reject(new Error('Not Found'));
								else return Promise.resolve(result);
							}, e => Promise.reject(e));
					}, { times: 3, timeout: 500 });
				})
				.try(result => {
					expect(Array.isArray(result)).to.be.true;
					expect(result.filter(change => Number(change.parent_document_id) === example.id).length).to.equal(result.length);
					done();
				})
				.catch(done);
		});
		it('Should wait for changeset to save if ensure_changes is true', done => {
			let updatedoc = {
				last_name: 'Nick'
			};
			Adapter.update({ id: example.id, originalrevision: example, updatedoc, isPatch: true, ensure_changes: true })
				.try(result => {
					expect(result).to.have.property('changes');
					expect(result).to.have.property('update');
					done();
				})
				.catch(done);
		});
		it('Should not track changes if track_changes is false', done => {
			let updatedoc = Object.assign({}, example);
			updatedoc.first_name = 'Bob';
			Promisie.resolve(ChangesetAdapter.model.destroy({ where: { id: { $not: null } } }))
				.then(() => Adapter.update({ id: updatedoc.id, originalrevision: example, updatedoc, track_changes: false }))
				.try(result => {
					expect(result).to.deep.equal([1]);
					expect(result).to.not.have.property('createdat');
					return Promisie.retry(() => {
						return ChangesetAdapter.query({ query: { 'parent_document_id': example.id } })
							.then(result => {
								return result;
							}, e => Promise.reject(e));
					}, { times: 3, timeout: 500 });
				})
				.try(result => {
					expect(Array.isArray(result)).to.be.true;
					expect(result.length).to.equal(0);
					done();
				})
				.catch(done);
		});
		it('Should update multiple documents if multi option is true', done => {
			Adapter.update({ 
				query: { where: { first_name: { $not: null } } },
				multi: true,
				updateattributes: { 'first_name': 'SameFirstName' }
			})
				.then(() => Adapter.query())
				.try(result => {
					expect(result).to.be.an('array');
					expect(result.filter(doc => doc.first_name === 'SameFirstName').length).to.equal(result.length);
					done();
				})
				.catch(done);
		});
		it('Should throw an error if neither updateattributes nor updatedoc is set', done => {
			Adapter.update({ multi: true })
				.then(() => {
					done(new Error('Should not execute'));
				}, e => {
					expect(e instanceof Error).to.be.true;
					expect(e.message).to.equal('Either updateattributes or updatedoc option must be set in order to execute multi update');
					done();
				});
		});
	});
	describe('Adapter .raw method testing', () => {
		it('Should skip formatting if options.format_result is false', done => {
			Adapter.raw({
				query: 'SELECT * FROM Examples',
				format_result: false
			})
				.try(result => {
					expect(result).to.be.an('array');
					done();
				})
				.catch(done);
		});
		it('Should format result using sequelize formatting if passed', done => {
			Adapter.raw({
				query: 'SELECT * FROM Examples',
				format_result: Sequelize.QueryTypes.UPDATE
			})
				.try(result => {
					expect(result).to.equal(undefined);
					done();
				})
				.catch(done);
		});
		it('Should format result by inferring query type if format_result is true', done => {
			Adapter.raw({
				query: 'SELECT * FROM Examples',
				format_result: true
			})
				.try(result => {
					expect(result).to.be.an('array');
					done();
				})
				.catch(done);
		});
	});
});