'use strict';
const path = require('path');
const xss_defaults = require(path.join(__dirname, '../defaults/xss_whitelist'));
const chai = require('chai');
const expect = chai.expect;

describe('Default value loaders testing', function () {
	describe('xss_whitelist', function () {
		let whitelist;
		before(() => {
			whitelist = xss_defaults();
		});
		it('Should return an object with xss whitelist data', () => {
			expect(whitelist).to.be.an('object');
			expect(whitelist).to.have.property('onIgnoreTagAttr');
			expect(whitelist).to.have.property('onTagAttr');
		});
	});
});