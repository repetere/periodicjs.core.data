'use strict';
const xss = require('xss');
const xssRegexp = /(<([^>]+)>)/ig;

/**
 * Enforces XSS character escaping rules
 * @param  {Object} doc           Data that is being escaped
 * @param  {Object} configuration xss npm module configuration object
 * @param  {Object} options       Configurable options for character escaping
 * @param {Boolean} [options.html_xss] If true xss module is used for character escaping
 * @param {Boolean} [options.skip_xss] If true character escaping is ignored
 * @return {Object}               Returns either original document or object with xss character escaping rules applied
 */
module.exports = function enforceXSSRules (doc, configuration, options = {}) {
	if (!options.skip_xss) {
		if (configuration && options.html_xss) return JSON.parse(xss(JSON.stringify(doc), configuration))
		else return JSON.parse(JSON.stringify(doc).replace(xssRegexp, ''));
	}
	else return doc;
};