'use strict';
const path = require('path');
const mongoose = require('mongoose');
const xss_defaults = require(path.join(__dirname, '../defaults/xss_whitelist'));
const chai = require('chai');
const expect = chai.expect;
const utility = require(path.join(__dirname, '../utility/index'));

var generateObjectId = function () {
	return mongoose.Types.ObjectId();
};

describe('Utility method testing', function () {
	describe('depopulate', function () {
		it('Should recursively depopulate entire object', () => {
			let example = {
				username: 'test',
				contact: {
					user: {
						_id: generateObjectId(),
						createdat: new Date()
					},
					firstname: 'Bob'
				},
				associated: [{
					_id: generateObjectId(),
					createdat: new Date()
				}, {
					_id: generateObjectId(),
					createdat: new Date()
				}]
			};
			let depopulated = utility.depopulate(example);
			expect(depopulated.contact.user).to.be.a('string');
			expect(depopulated.contact.firstname).to.be.ok;
			expect(depopulated.associated.filter(val => typeof val === 'string').length).to.equal(2);
			expect(example.contact.user).to.be.an('object');
		});
	});
	describe('diff', function () {
		let original = {
			user: {
				_id: generateObjectId(),
				firstname: 'Test'
			},
			foo: 'bar',
			hello: 'world'
		};
		let revision = Object.assign({}, original, {
			fizz: 'boom',
			foo: 'foo',
			user: Object.assign({}, original.user, { firstname: 'Bob' })
		});
		it('Should return a diff between two depopulated objects', () => {
			let diff = utility.diff(original, revision);
			expect(diff).to.be.ok;
			expect(diff).to.have.property('foo');
			expect(diff).to.have.property('fizz');
			expect(diff).to.not.have.property('user');
		});
		it('Should return a diff between two objects without depopulating if argument is passed', () => {
			let diff = utility.diff(original, revision, true);
			expect(diff).to.be.ok;
			expect(diff).to.have.property('foo');
			expect(diff).to.have.property('fizz');
			expect(diff).to.have.property('user');
		});
	});
	describe('isObjectId', function () {
		it('Should return false if passed any falsy or non-string value', () => {
			let value = 0;
			expect(utility.isObjectId(value)).to.be.false;
		});
		it('Should return false if passed a string with a length under 24', () => {
			let value = 'test';
			expect(utility.isObjectId(value)).to.be.false;
		});
		it('Should return true if passed a valid ObjectId', () => {
			let value = generateObjectId();
			expect(utility.isObjectId(value)).to.be.true;
		});
	});
	describe('enforceXSSRules', function () {
		let example = {
			user: '<script>alert("hello");</script>'
		};
		it('Should return unmodified object skip_xss is true', () => {
			let unescaped = utility.enforceXSSRules(Object.assign({}, example), {}, { skip_xss: true });
			expect(unescaped).to.deep.equal(example);
		});
		it('Should enforce xss rules if configuration is passed', () => {
			let escaped = utility.enforceXSSRules(Object.assign({}, example), xss_defaults, { skip_xss: false, html_xss: true });
			expect(escaped).to.not.deep.equal(example);
		});
		it('Should use simple character escaping if html_xss is not true', () => {
			let escaped = utility.enforceXSSRules(Object.assign({}, example), xss_defaults, { skip_xss: false, html_xss: false });
			expect(escaped).to.not.deep.equal(example);
			let escaped2 = utility.enforceXSSRules(Object.assign({}, example), false, { skip_xss: false, html_xss: true });
			expect(escaped2).to.deep.equal(escaped);
		});
	});
});