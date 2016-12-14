'use strict';
const path = require('path');
const chai = require('chai');
const expect = chai.expect;
const AdapterInterface = require(path.join(__dirname, '../index'));
const MongoAdapter = require(path.join(__dirname, '../adapters/mongo'));

describe('DB Adapter Interface', function () {
	describe('basic assumptions and methods', function () {
		it('Should be an object with specified required properties and types', () => {
			let interfaceFields = ['load','query','search','update','delete','create','stream'];
			interfaceFields.forEach(field => {
				expect(AdapterInterface.interface[field]).to.equal('function');
			});
		});
		it('Should have a create method', () => {
			expect(AdapterInterface.create).to.be.a('function');
		});
	});
	describe('generating a pre-loaded adapter by adapter name', function () {
		it('Should throw an error if adapter name does not exist in list', done => {
			try {
				let adapter = AdapterInterface.create({ adapter: 'some-non-existant-adapter' });
				done(new Error('Should not evaluate this line'));
			}
			catch (e) {
				expect(e instanceof Error).to.be.true;
				done();
			}
		});
		it('Should return a constructed adapter given a valid adapter name', () => {
			let adapter = AdapterInterface.create({ adapter: 'mongo' });
			expect(adapter instanceof MongoAdapter).to.be.true;
		});
		it('Should return a constructed adapter when only .db is defined', () => {
			let adapter = AdapterInterface.create({ db: 'mongo' });
			expect(adapter instanceof MongoAdapter).to.be.true;
		});
	});
	describe('generating an adapter from a provided constructor', function () {
		it('Should throw an error if custom adapter class is missing required methods', done => {
			try {
				let Invalid_Adapter = class Invalid_Adapter {
					constructor () {
						this.method = false;
					}
				};
				let adapter = AdapterInterface.create({ adapter: Invalid_Adapter });
			}
			catch (e) {
				expect(e instanceof Error).to.be.true;
				done();
			}
		});
		it('Should return a constructed adapter given a valid custom class', () => {
			let Valid_Adapter = class Valid_Adapter {
				constructor () {
					this.load = () => true;
					this.query = () => true;
					this.search = () => true;
					this.update = () => true;
					this.delete = () => true;
					this.create = () => true;
					this.stream = () => true;
				}
			};
			let adapter = AdapterInterface.create({ adapter: Valid_Adapter });
			expect(adapter instanceof Valid_Adapter).to.be.true;
		});
	});
});