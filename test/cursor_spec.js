'use strict';
const path = require('path');
const Promisie = require('promisie');
const chai = require('chai');
const expect = chai.expect;
const Cursor = require(path.join(__dirname, '../utility/cursor'));
const Transform = require('stream').Transform;

chai.use(require('chai-spies'));

describe('Cursor constructor spec', function () {
	describe('Basic assumptions', function () {
		let cursor = new Cursor();
		it('Should be an instance of a Transform stream', () => {
			expect(cursor instanceof Transform).to.be.true;
		});
		it('Should have an initialize and _next method', () => {
			expect(cursor).to.have.property('_next');
			expect(cursor).to.have.property('initialize');
		});
	});
	describe('Stream', function () {
		it('Should be able to handle objects', done => {
			let cursor = new Cursor();
			for (let i = 0; i < 5; i++) {
				let timeout = setTimeout(function () {
					if (i !== 4) cursor.write({ iteration: i });
					else cursor.end({ iteration: i });
				}, (i) ? 250 * i : 250);
			}
			cursor.on('data', data => {
				expect(data).to.be.an('object');
				expect(data).to.have.property('iteration');
			})
				.on('error', done)
				.on('finish', () => {
					expect(cursor._isInitialized).to.be.false;
					expect(cursor._isDone).to.be.false;
					done();
				});
		});
		it('Should be able to handle strings', done => {
			let cursor = new Cursor({ objectMode: false });
			for (let i = 0; i < 5; i++) {
				let timeout = setTimeout(function () {
					if (i !== 4) cursor.write(i.toString());
					else cursor.end(i.toString());
				}, (i) ? 250 * i : 250);
			}
			cursor.on('data', data => {
				expect(data instanceof Buffer).to.be.true;
			})
				.on('error', done)
				.on('finish', () => {
					expect(cursor._isInitialized).to.be.false;
					expect(cursor._isDone).to.be.false;
					done();
				});
		});
		it('Should expose a generator when .initialize method is called', done => {
			let cursor = new Cursor();
			for (let i = 0; i < 5; i++) {
				let timeout = setTimeout(function () {
					if (i !== 4) cursor.write({ iteration: i });
					else cursor.end({ iteration: i });
				}, (i) ? 250 * i : 250);
			}
			let full_data = [];
			let onSuccess = chai.spy(function (data) {
				full_data.push(data);
				return data;
			});
			Promisie.iterate(cursor.initialize(onSuccess))
				.try(() => {
					expect(full_data.length).to.equal(5);
					expect(onSuccess).to.have.been.called.exactly(5);
					expect(cursor._isDone).to.be.true;
					expect(cursor._isInitialized).to.be.true;
					done();
				})
				.catch(done);
		});
		it('Should expose a generator which has a .next method that will resolve with a document', done => {
			let cursor = new Cursor();
			for (let i = 0; i < 5; i++) {
				let timeout = setTimeout(function () {
					if (i !== 4) cursor.write({ iteration: i });
					else cursor.end({ iteration: i });
				}, (i) ? 250 * i : 250);
			}
			let full_data = [];
			let generator = cursor.initialize(function (data) {
				full_data.push(data);
				return data;
			})();
			let nextSuccess = chai.spy(function (data) {
				full_data.push(data);
				return data;
			});
			let next = generator.next(nextSuccess);
			let index = 0;
			Promisie.doWhilst(() => {
				return next.value
					.then(result => {
						expect(result).to.have.property('iteration');
						expect(result.iteration).to.equal(index++);
						next = generator.next(nextSuccess);
						return next;
					})
					.catch(e => Promisie.reject(e));
			}, n => !n.done)
				.then(() => {
					expect(full_data[0].iteration).to.equal(0);
					expect(nextSuccess).to.have.been.called.exactly(4);
					expect(next.done).to.be.true;
					done();
				}, done);
		});
	});
});